// Shared by imports and the UI. Null is missing, never a zero score.
export const metricKeys = ['humaneval', 'humaneval+', 'mbpp', 'mbpp+']
export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, '-plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
export function finite(value, max = Infinity) {
  if (value === null || value === undefined) return null
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > max
  )
    throw new Error('Invalid numeric measurement')
  return value
}
export function httpsURL(value) {
  const u = new URL(value)
  if (u.protocol !== 'https:' || u.username || u.password)
    throw new Error('Expected public HTTPS source')
  return u.href
}
export function normalizeEvalPlus(raw, provenance) {
  if (
    !raw ||
    typeof raw !== 'object' ||
    Array.isArray(raw) ||
    Object.keys(raw).length < 10
  )
    throw new Error('Unexpected EvalPlus payload')
  const models = Object.entries(raw).map(([name, row]) => {
    if (
      !row ||
      typeof row !== 'object' ||
      !row['pass@1'] ||
      typeof row.prompted !== 'boolean'
    )
      throw new Error('Invalid EvalPlus row')
    const link = httpsURL(row.link)
    const publisher =
      new URL(link).hostname === 'huggingface.co'
        ? new URL(link).pathname.split('/')[1]
        : 'Not specified'
    return {
      id: slugify(name),
      name,
      publisher,
      link,
      instructionTuned: row.prompted,
      parametersB: finite(row.size),
      scores: Object.fromEntries(
        metricKeys.map((key) => [key, finite(row['pass@1'][key], 100)])
      ),
      pricing: null,
      speed: null,
    }
  })
  if (new Set(models.map((m) => m.id)).size !== models.length)
    throw new Error('Model identifier collision')
  return { schemaVersion: 1, source: 'evalplus', ...provenance, models }
}
/** @param {import('./types').Model[]} models @param {import('./types').Metric} metric */
export function rankModels(models, metric) {
  return models
    .filter((m) => m.scores[metric] !== null && m.scores[metric] !== undefined)
    .sort(
      (a, b) =>
        b.scores[metric] - a.scores[metric] || a.name.localeCompare(b.name)
    )
    .map((m, index, all) => ({
      ...m,
      rank: m.evidence?.[metric] ? m.evidence[metric].rank : all.findIndex((x) => x.scores[metric] === m.scores[metric]) + 1,
    }))
}
export function estimateCost(pricing, inputTokens, outputTokens, requests) {
  if (!pricing || pricing.input === null || pricing.output === null) return null
  for (const value of [
    pricing.input,
    pricing.output,
    inputTokens,
    outputTokens,
    requests,
  ])
    finite(value)
  return (
    ((pricing.input * inputTokens + pricing.output * outputTokens) * requests) /
    1_000_000
  )
}
export function isStale(updatedAt, now = Date.now()) {
  return !updatedAt || now - Date.parse(updatedAt) > 30 * 24 * 60 * 60 * 1000
}
export function assertSnapshot(snapshot) {
  if (
    !snapshot ||
    snapshot.schemaVersion !== 1 ||
    !['evalplus', 'artificial-analysis', 'arena'].includes(snapshot.source) ||
    !Array.isArray(snapshot.models) ||
    snapshot.models.length < 2
  )
    throw new Error('Invalid snapshot')
  for (const key of ['retrievedAt', 'sourceUpdatedAt'])
    if (
      snapshot[key] !== null &&
      (!snapshot[key] || !Number.isFinite(Date.parse(snapshot[key])))
    )
      throw new Error('Invalid timestamp')
  httpsURL(snapshot.sourceURL)
  if (!snapshot.sourceRevision || !snapshot.license || !snapshot.attribution)
    throw new Error('Missing provenance')
  const ids = new Set()
  for (const model of snapshot.models) {
    if (
      !model.id ||
      slugify(model.id) !== model.id ||
      ids.has(model.id) ||
      !model.name ||
      !model.publisher ||
      !(
        model.instructionTuned === null ||
        typeof model.instructionTuned === 'boolean'
      )
    )
      throw new Error('Invalid model identity')
    ids.add(model.id)
    httpsURL(model.link)
    finite(model.parametersB)
    for (const [key, value] of Object.entries(model.scores)) {
      if (
        ![
          'humaneval',
          'humaneval+',
          'mbpp',
          'mbpp+',
          'aa-intelligence',
          'aa-coding',
          'aa-agentic',
          'arena-text',
          'arena-webdev',
          'arena-agent',
        ].includes(key)
      )
        throw new Error('Unknown metric')
      if (key === 'arena-agent') {
        if (value != null && (typeof value !== 'number' || !Number.isFinite(value))) throw new Error('Invalid agent score')
      } else finite(value, key.startsWith('aa-') || key.startsWith('arena-') ? Infinity : 100)
    }
    if (snapshot.source === 'arena') {
      for (const [metric, value] of Object.entries(model.scores)) {
        const ev = model.evidence?.[metric]
        if (!ev || !/^\d{4}-\d{2}-\d{2}$/.test(ev.publishedAt) || !Number.isFinite(Date.parse(ev.publishedAt))) throw new Error('Missing Arena evidence')
        for (const key of ['rank', 'count', 'sessions']) if (ev[key] != null && (!Number.isSafeInteger(ev[key]) || ev[key] < (key === 'rank' ? 1 : 0))) throw new Error('Invalid Arena count/rank')
        for (const key of ['lower', 'upper']) if (ev[key] != null && (typeof ev[key] !== 'number' || !Number.isFinite(ev[key]))) throw new Error('Invalid confidence interval')
        if ((value != null && ev.lower != null && ev.lower > value) || (value != null && ev.upper != null && ev.upper < value)) throw new Error('Invalid confidence interval order')
      }
    }
    if (model.pricing) {
      finite(model.pricing.input)
      finite(model.pricing.output)
    }
    finite(model.speed)
  }
  const expectedMetrics =
    snapshot.source === 'evalplus'
      ? metricKeys
      : snapshot.source === 'arena'
        ? ['arena-text', 'arena-webdev', 'arena-agent']
        : ['aa-intelligence', 'aa-coding', 'aa-agentic']
  if (
    !snapshot.models.some((model) =>
      expectedMetrics.some((key) => model.scores[key] != null)
    )
  )
    throw new Error('Snapshot has no rankable measurements')
  if (
    snapshot.models.some((model) =>
      Object.keys(model.scores).some((key) => !expectedMetrics.includes(key))
    )
  )
    throw new Error('Metrics do not belong to selected source')
  if (snapshot.source === 'artificial-analysis' && !snapshot.indexVersion)
    throw new Error('Missing source index version')
  return snapshot
}

export function arenaFreshness(snapshot, now = Date.now()) {
  const checked = Date.parse(snapshot.lastCheckedAt || snapshot.retrievedAt)
  const published = Date.parse(snapshot.sourceUpdatedAt)
  return { checkOverdue: !Number.isFinite(checked) || now - checked > 8 * 3600000, publicationOld: !Number.isFinite(published) || now - published > 7 * 86400000 }
}
