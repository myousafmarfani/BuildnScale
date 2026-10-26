import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { prisma } from '@/lib/prisma'
import { normalizeEvalPlus, assertSnapshot } from './core.mjs'
import {
  normalizeArtificialAnalysis,
  fetchArtificialAnalysis,
} from './artificial-analysis.mjs'
import type { Snapshot } from './types'
import type { Prisma } from '@prisma/client'
const hash = (value: string) => createHash('sha256').update(value).digest('hex')
async function json(url: string) {
  const r = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  })
  if (!r.ok) throw new Error(`Source request failed (${r.status})`)
  return r.json()
}
async function githubContent(path: string, ref: string) {
  const data = await json(
    `https://api.github.com/repos/evalplus/evalplus.github.io/contents/${path}?ref=${ref}`
  )
  if (data.encoding !== 'base64' || typeof data.content !== 'string')
    throw new Error('Unexpected GitHub contents contract')
  return Buffer.from(data.content, 'base64').toString('utf8')
}
export async function importBenchmarks(
  source: 'evalplus' | 'artificial-analysis'
) {
  let snapshot: Snapshot
  if (source === 'evalplus') {
    const commits = await json(
      'https://api.github.com/repos/evalplus/evalplus.github.io/commits?path=results.json&per_page=1'
    )
    const revision = commits[0]?.sha,
      updated = commits[0]?.commit?.committer?.date
    if (!/^[a-f0-9]{40}$/.test(revision) || !updated)
      throw new Error('Missing source revision')
    const [raw, license, bundledLicense] = await Promise.all([
      githubContent('results.json', revision),
      githubContent('LICENSE', revision),
      readFile(
        join(process.cwd(), 'data/benchmarks/licenses/EvalPlus-Apache-2.0.txt'),
        'utf8'
      ),
    ])
    if (license.trim() !== bundledLicense.trim())
      throw new Error('Upstream license changed; review before publication')
    snapshot = normalizeEvalPlus(JSON.parse(raw), {
      sourceRevision: revision,
      sourceURL: `https://github.com/evalplus/evalplus.github.io/blob/${revision}/results.json`,
      sourceUpdatedAt: updated,
      retrievedAt: new Date().toISOString(),
      license: 'Apache-2.0',
      attribution:
        'EvalPlus contributors — results redistributed under Apache-2.0. Normalized by BuildnScale; no evaluations rerun.',
    }) as Snapshot
  } else {
    if (process.env.AA_PUBLIC_DISPLAY_ENABLED !== 'true')
      throw new Error('Artificial Analysis publication is disabled')
    const envelope = await fetchArtificialAnalysis(
      process.env.AA_API_KEY,
      process.env.AA_PERMISSION_REFERENCE
    )
    snapshot = normalizeArtificialAnalysis(envelope, {
      sourceRevision: `v${envelope.intelligence_index_version}-${hash(JSON.stringify(envelope))}`,
      sourceURL: 'https://artificialanalysis.ai/',
      sourceUpdatedAt: null,
      retrievedAt: new Date().toISOString(),
      license: 'Public display permission recorded by operator',
      attribution:
        'Source: Artificial Analysis. Published under a recorded data agreement. Normalized by BuildnScale; no evaluations rerun.',
    }) as Snapshot
  }
  assertSnapshot(snapshot)
  const previous = await prisma.benchmarkSnapshot.findFirst({
    where: { source },
    orderBy: { retrievedAt: 'desc' },
  })
  if (previous) {
    const old = assertSnapshot(previous.payload) as Snapshot
    if (snapshot.models.length < old.models.length * 0.75)
      throw new Error('Coverage dropped more than 25%; manual review required')
    for (const model of snapshot.models) {
      const prior = old.models.find((m) => m.id === model.id)
      if (!prior || snapshot.indexVersion !== old.indexVersion) continue
      for (const [key, value] of Object.entries(model.scores)) {
        const before = prior.scores[key as keyof typeof prior.scores]
        if (value != null && before != null && Math.abs(value - before) > 10)
          throw new Error('Large score change requires manual review')
      }
    }
  }
  await prisma.benchmarkSnapshot.upsert({
    where: {
      source_sourceRevision: {
        source,
        sourceRevision: snapshot.sourceRevision,
      },
    },
    update: {},
    create: {
      source,
      sourceRevision: snapshot.sourceRevision,
      sourceUpdatedAt: snapshot.sourceUpdatedAt
        ? new Date(snapshot.sourceUpdatedAt)
        : null,
      retrievedAt: new Date(snapshot.retrievedAt),
      payload: snapshot as unknown as Prisma.InputJsonValue,
    },
  })
  return {
    source,
    revision: snapshot.sourceRevision,
    models: snapshot.models.length,
  }
}
