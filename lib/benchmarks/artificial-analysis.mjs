import { assertSnapshot, finite, slugify } from './core.mjs'
// V2 free-shape contract: https://artificialanalysis.ai/api/v2/openapi
// API access does not establish public-display/redistribution permission.
export function normalizeArtificialAnalysis(envelope, provenance) {
  if (
    !Array.isArray(envelope?.data) ||
    envelope.data.length < 2 ||
    !envelope.intelligence_index_version
  )
    throw new Error('Invalid Artificial Analysis V2 envelope')
  const models = envelope.data.map((row) => {
    if (
      !row.id ||
      !row.slug ||
      !row.name ||
      !row.model_creator?.name ||
      !row.evaluations
    )
      throw new Error('Invalid Artificial Analysis model')
    return {
      id: `aa-${slugify(row.slug)}-${slugify(row.id)}`,
      name: row.name,
      publisher: row.model_creator.name,
      link: `https://artificialanalysis.ai/models/${encodeURIComponent(row.slug)}`,
      parametersB: null,
      instructionTuned: null,
      scores: {
        'aa-intelligence': finite(
          row.evaluations.artificial_analysis_intelligence_index
        ),
        'aa-coding': finite(row.evaluations.artificial_analysis_coding_index),
        'aa-agentic': finite(row.evaluations.artificial_analysis_agentic_index),
      },
      pricing: row.pricing
        ? {
            input: finite(row.pricing.price_1m_input_tokens),
            output: finite(row.pricing.price_1m_output_tokens),
          }
        : null,
      speed: finite(row.performance?.median_output_tokens_per_second),
    }
  })
  return assertSnapshot({
    schemaVersion: 1,
    source: 'artificial-analysis',
    ...provenance,
    indexVersion: String(envelope.intelligence_index_version),
    models,
  })
}
export async function fetchArtificialAnalysis(
  apiKey,
  permissionReference,
  fetcher = fetch
) {
  if (!apiKey || !permissionReference?.trim())
    throw new Error(
      'Artificial Analysis key and public display permission reference are required'
    )
  const rows = []
  let version = null
  for (let page = 1; page <= 20; page++) {
    const response = await fetcher(
      `https://artificialanalysis.ai/api/v2/language/models/free?page=${page}&page_size=200`,
      {
        headers: { 'x-api-key': apiKey },
        signal: AbortSignal.timeout(20000),
        cache: 'no-store',
      }
    )
    if (!response.ok)
      throw new Error(
        `Artificial Analysis import failed (${response.status}); previous snapshot retained`
      )
    const json = await response.json()
    if (
      !Array.isArray(json.data) ||
      !json.pagination ||
      json.pagination.page !== page ||
      typeof json.pagination.has_more !== 'boolean'
    )
      throw new Error('Unexpected pagination contract')
    if (version !== null && version !== json.intelligence_index_version)
      throw new Error('Index version changed during pagination')
    version = json.intelligence_index_version
    rows.push(...json.data)
    if (!json.pagination.has_more)
      return { data: rows, intelligence_index_version: version }
  }
  throw new Error('Pagination exceeded safety limit; refusing partial data')
}
