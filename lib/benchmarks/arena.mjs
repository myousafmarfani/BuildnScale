import { createHash } from 'node:crypto'
import { parquetReadObjects } from 'hyparquet'
import { slugify, assertSnapshot } from './core.mjs'
export const ARENA_DATASET = 'lmarena-ai/leaderboard-dataset'
const base = `https://huggingface.co/datasets/${ARENA_DATASET}`
const subsets = ['text', 'webdev', 'agent']
const upstreamSubset = subset => subset === 'text' ? 'text_style_control' : subset
async function request(url, fetcher) {
  const response = await fetcher(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) })
  if (!response.ok) throw new Error(`Arena source request failed (${response.status})`)
  return response
}
// Read immutable Parquet files at one revision; the live viewer can lag or mix revisions.
export async function fetchArena(fetcher = fetch) {
  const info = await (await request(`https://huggingface.co/api/datasets/${ARENA_DATASET}`, fetcher)).json()
  if (!/^[a-f0-9]{40}$/.test(info.sha) || info.cardData?.license !== 'cc-by-4.0')
    throw new Error('Arena revision or license changed; review required')
  const groups = {}
  await Promise.all(subsets.map(async subset => {
    const paths = info.siblings?.map(x => x.rfilename).filter(path => new RegExp(`^${upstreamSubset(subset)}/latest-\\d+-of-\\d+\\.parquet$`).test(path)).sort()
    if (!paths?.length || paths.length > 10) throw new Error('Missing Arena subset')
    for (const [index, path] of paths.entries()) {
      const match = path.match(/latest-(\d+)-of-(\d+)\.parquet$/)
      if (!match || Number(match[1]) !== index || Number(match[2]) !== paths.length) throw new Error('Incomplete Arena shards')
    }
    const rows = []
    for (const path of paths) {
      const response = await request(`${base}/resolve/${info.sha}/${path}`, fetcher)
      const buffer = await response.arrayBuffer()
      if (buffer.byteLength > 20_000_000) throw new Error('Arena file exceeds import limit')
      rows.push(...await parquetReadObjects({ file: { byteLength: buffer.byteLength, slice: (start, end) => buffer.slice(start, end) } }))
    }
    groups[subset] = rows
  }))
  return normalizeArena(groups, { revision: info.sha, retrievedAt: new Date().toISOString() })
}
function number(value, { signed = false, integer = false } = {}) {
  if (value == null) return null
  if (typeof value === 'bigint') value = Number(value)
  if (typeof value !== 'number' || !Number.isFinite(value) || (!signed && value < 0) || (integer && !Number.isSafeInteger(value)))
    throw new Error('Invalid Arena measurement')
  return value
}
export function normalizeArena(groups, { revision, retrievedAt }) {
  if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Invalid Arena revision')
  const models = new Map(), dates = []
  for (const subset of subsets) {
    const rows = groups[subset]?.filter(row => row.category === 'overall')
    if (!rows?.length) throw new Error(`No overall results for ${subset}`)
    // A split can contain multiple categories/dates; only one published overall board is compared.
    const published = rows.map(row => row.leaderboard_publish_date).sort().at(-1)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(published) || !Number.isFinite(Date.parse(published)) || Date.parse(published) > Date.parse(retrievedAt))
      throw new Error('Invalid Arena publication date')
    if (new Date(published).toISOString().slice(0, 10) !== published) throw new Error('Invalid calendar date')
    dates.push(published)
    const latestRows = rows.filter(row => row.leaderboard_publish_date === published)
    const seen = new Set()
    for (const row of rows.filter(row => row.leaderboard_publish_date === published)) {
      if (typeof row.model_name !== 'string' || !row.model_name.trim() || (row.organization != null && typeof row.organization !== 'string'))
        throw new Error('Missing Arena identity')
      const labelIdentity = `${row.organization}\0${row.model_name}`
      const duplicate = latestRows.filter(other => other.model_name === row.model_name && other.organization === row.organization).length > 1
      const identity = duplicate ? `${labelIdentity}\0${subset}\0${row.rank}` : labelIdentity
      if (seen.has(identity)) throw new Error('Indistinguishable Arena records')
      seen.add(identity)
      // Exact label + organisation only; never fuzzy-match model variants or API aliases.
      const id = `arena-${slugify(row.model_name)}-${createHash('sha256').update(identity).digest('hex').slice(0, 10)}`
      const model = models.get(id) || { id, name: row.model_name, publisher: row.organization?.trim() || 'Not supplied', link: 'https://arena.ai/leaderboard', instructionTuned: null, parametersB: null, scores: {}, evidence: {}, pricing: null, speed: null }
      const metric = `arena-${subset}`, agent = subset === 'agent'
      const score = number(agent ? row.score : row.rating, { signed: agent })
      const lower = number(agent ? row.score_ci_lower : row.rating_lower, { signed: agent })
      const upper = number(agent ? row.score_ci_upper : row.rating_upper, { signed: agent })
      const rank = number(row.rank, { integer: true })
      if ((score != null && lower != null && lower > score) || (score != null && upper != null && upper < score) || (rank != null && rank < 1))
        throw new Error('Invalid Arena interval or rank')
      if (duplicate) model.identityNote = `Duplicate label in source: ${subset} record at published rank ${rank}. Kept separate; configuration not identified.`
      model.scores[metric] = score
      model.evidence[metric] = { rank, lower, upper, count: number(agent ? row.observation_count : row.vote_count, { integer: true }), sessions: number(row.session_count, { integer: true }), publishedAt: published }
      models.set(id, model)
    }
  }
  for (const subset of subsets) {
    if ([...models.values()].filter(model => model.scores[`arena-${subset}`] != null).length < 2) throw new Error('Arena board has no rankable coverage')
  }
  return assertSnapshot({ schemaVersion: 1, source: 'arena', sourceRevision: revision, sourceURL: `${base}/tree/${revision}`, sourceUpdatedAt: `${dates.sort()[0]}T00:00:00Z`, retrievedAt, lastCheckedAt: retrievedAt, license: 'CC-BY-4.0', attribution: 'Source: Arena / lmarena-ai leaderboard dataset, CC BY 4.0. Filtered to the latest overall boards and normalized by BuildnScale; evaluations were not rerun. No endorsement implied.', models: [...models.values()] })
}
