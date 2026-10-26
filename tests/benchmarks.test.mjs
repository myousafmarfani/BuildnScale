import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {
  normalizeEvalPlus,
  rankModels,
  estimateCost,
  assertSnapshot,
  isStale,
} from '../lib/benchmarks/core.mjs'
import {
  normalizeArtificialAnalysis,
  fetchArtificialAnalysis,
} from '../lib/benchmarks/artificial-analysis.mjs'
const seed = JSON.parse(
  fs.readFileSync(
    new URL('../data/benchmarks/evalplus-snapshot.json', import.meta.url),
    'utf8'
  )
)
const upstream = JSON.parse(
  fs.readFileSync(
    new URL('../data/benchmarks/upstream/evalplus.json', import.meta.url),
    'utf8'
  )
)
test('bundled snapshot preserves every upstream score, exact label, and missing value', () => {
  assertSnapshot(seed)
  assert.equal(seed.models.length, Object.keys(upstream).length)
  for (const model of seed.models) {
    assert.deepEqual(model.scores, upstream[model.name]['pass@1'])
    assert.equal(model.link, upstream[model.name].link)
    assert.equal(model.pricing, null)
  }
  assert.equal(seed.sourceUpdatedAt, '2024-12-26T17:02:22Z')
  assert.equal(isStale(seed.sourceUpdatedAt, Date.parse('2026-10-26')), true)
})
test('competition ranking preserves ties and excludes missing scores, including real zero correctly', () => {
  const rows = [
    { id: 'a', name: 'A', scores: { 'humaneval+': 90 } },
    { id: 'b', name: 'B', scores: { 'humaneval+': 90 } },
    { id: 'c', name: 'C', scores: { 'humaneval+': 0 } },
    { id: 'd', name: 'D', scores: { 'humaneval+': null } },
  ]
  assert.deepEqual(
    rankModels(rows, 'humaneval+').map((m) => [m.id, m.rank]),
    [
      ['a', 1],
      ['b', 1],
      ['c', 3],
    ]
  )
})
test('invalid measurements and identifier collisions cannot publish', () => {
  for (const value of [-1, 101, '90', Infinity]) {
    const copy = structuredClone(upstream),
      key = Object.keys(copy)[0]
    copy[key]['pass@1']['humaneval+'] = value
    assert.throws(() => normalizeEvalPlus(copy, {}))
  }
  const copy = structuredClone(upstream),
    key = Object.keys(copy)[0]
  copy[key + '!'] = copy[key]
  assert.throws(() => normalizeEvalPlus(copy, {}), /collision/)
  const broken = structuredClone(seed)
  broken.models[0].link = 'javascript:alert(1)'
  assert.throws(() => assertSnapshot(broken))
})
test('cost estimate respects units, missing prices and free pricing', () => {
  assert.equal(estimateCost({ input: 2, output: 8 }, 2000, 500, 1000), 8)
  assert.equal(estimateCost({ input: 0, output: 0 }, 2000, 500, 1000), 0)
  assert.equal(estimateCost({ input: null, output: 2 }, 1000, 500, 1), null)
  assert.throws(() => estimateCost({ input: 2, output: 8 }, -1, 0, 1))
})
const row = (id) => ({
  id,
  slug: `model-${id}`,
  name: `Model ${id}`,
  model_creator: { name: 'Example' },
  evaluations: {
    artificial_analysis_intelligence_index: 42,
    artificial_analysis_coding_index: null,
  },
  pricing: { price_1m_input_tokens: 0, price_1m_output_tokens: 2 },
  performance: { median_output_tokens_per_second: 100 },
})
const envelope = {
  data: [row('a'), row('b')],
  intelligence_index_version: '4.3',
}
test('AA adapter preserves unknown configuration and index version instead of matching model names', () => {
  const result = normalizeArtificialAnalysis(envelope, {
    ...seed,
    source: 'artificial-analysis',
    models: undefined,
  })
  assert.equal(result.indexVersion, '4.3')
  assert.equal(result.models[0].instructionTuned, null)
  assert.equal(result.models[0].scores['aa-coding'], null)
  assert.equal(result.models[0].pricing.input, 0)
  assert.ok(result.models[0].id.startsWith('aa-'))
})
test('AA import requires credentials and display permission, reads all pages, rejects version drift', async () => {
  let calls = 0
  await assert.rejects(() =>
    fetchArtificialAnalysis('key', '', async () => {
      calls++
      return {}
    })
  )
  assert.equal(calls, 0)
  const mock = async () => ({
    ok: true,
    json: async () => ({
      data: [row(String(++calls))],
      intelligence_index_version: '4.3',
      pagination: { page: calls, has_more: calls < 2 },
    }),
  })
  const result = await fetchArtificialAnalysis('key', 'agreement-123', mock)
  assert.equal(result.data.length, 2)
  calls = 0
  await assert.rejects(
    () =>
      fetchArtificialAnalysis('key', 'agreement', async () => ({
        ok: true,
        json: async () => ({
          data: [row(String(++calls))],
          intelligence_index_version: String(calls),
          pagination: { page: calls, has_more: true },
        }),
      })),
    /version changed/
  )
  await assert.rejects(
    () =>
      fetchArtificialAnalysis('key', 'agreement', async () => ({
        ok: false,
        status: 429,
      })),
    /429/
  )
})
