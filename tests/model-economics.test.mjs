import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {
  estimateAll,
  estimateModel,
  ratesFor,
  sanitizeWorkload,
} from '../lib/model-economics/estimate.mjs'
import { PRESETS, findActivePreset, presetMatches } from '../lib/model-economics/presets.mjs'

const snapshot = JSON.parse(
  fs.readFileSync(
    new URL('../data/model-economics/models.json', import.meta.url),
    'utf8'
  )
)

const workload = {
  tasks: 1_000,
  turns: 3,
  input: 8_000,
  output: 700,
  cache: 0,
  retry: 2,
  plan: 20,
  scheduled: false,
}

const model = (overrides = {}) => ({
  id: 'test',
  name: 'Test model',
  contextTokens: 1_000_000,
  pricing: { input: 1, output: 2, cacheRead: 0.1, cacheWrite: 1.25 },
  longContext: null,
  scheduledPricing: [],
  quality: null,
  ...overrides,
})

test('default workload matches the hand calculation for Claude Haiku 5.5', () => {
  const haiku = snapshot.models.find((entry) => entry.id === 'claude-haiku-5.5')
  const result = estimateModel(haiku, workload)
  assert.equal(result.requests, 3_060)
  assert.ok(Math.abs(result.monthly - 3.519) < 1e-9)
  assert.ok(Math.abs(result.perTask - 0.003519) < 1e-9)
  assert.ok(Math.abs(result.perThousand - 3.519) < 1e-9)
})

test('every model is estimated and the cheapest usable option sorts first', () => {
  const rows = estimateAll(snapshot.models, workload)
  assert.equal(rows.length, snapshot.models.length)
  assert.equal(rows[0].model.id, 'claude-haiku-5.5')
  for (let index = 1; index < rows.length; index += 1) {
    assert.ok(rows[index - 1].monthly <= rows[index].monthly)
  }
})

test('cache hits are billed at the cache-read rate and savings are reported', () => {
  const result = estimateModel(
    model({ pricing: { input: 1, output: 0, cacheRead: 0.1, cacheWrite: 1.25 } }),
    { ...workload, tasks: 1, turns: 1, input: 1_000_000, output: 1, cache: 100, retry: 0 }
  )
  assert.ok(Math.abs(result.monthly - 0.1) < 1e-9)
  assert.ok(Math.abs(result.monthlyNoCache - 1) < 1e-9)
  assert.ok(Math.abs(result.cacheSavings - 0.9) < 1e-9)
})

test('long-context pricing applies above the threshold, not at it', () => {
  const priced = model({
    pricing: { input: 1, output: 0, cacheRead: 0.1, cacheWrite: 1.25 },
    longContext: {
      thresholdInputTokens: 100_000,
      pricing: { input: 2, output: 0, cacheRead: 0.2, cacheWrite: 2.5 },
    },
  })
  const atThreshold = estimateModel(priced, {
    ...workload,
    tasks: 1,
    turns: 1,
    input: 100_000,
    output: 1,
    cache: 0,
    retry: 0,
  })
  const aboveThreshold = estimateModel(priced, {
    ...workload,
    tasks: 1,
    turns: 1,
    input: 100_001,
    output: 1,
    cache: 0,
    retry: 0,
  })
  assert.equal(atThreshold.longContext, false)
  assert.ok(Math.abs(atThreshold.monthly - 0.1) < 1e-9)
  assert.equal(aboveThreshold.longContext, true)
  assert.ok(Math.abs(aboveThreshold.monthly - 0.200002) < 1e-9)
})

test('scheduled pricing is opt-in and never blended into the current rate', () => {
  const priced = model({
    pricing: { input: 2, output: 0, cacheRead: 0.1, cacheWrite: 2.5 },
    scheduledPricing: [
      {
        effectiveFrom: '2026-12-01',
        pricing: { input: 4, output: 0, cacheRead: 0.2, cacheWrite: 5 },
        note: 'doubles',
      },
    ],
  })
  const now = estimateModel(priced, {
    ...workload,
    tasks: 1,
    turns: 1,
    input: 1_000_000,
    output: 1,
    cache: 0,
    retry: 0,
    scheduled: false,
  })
  const later = estimateModel(priced, {
    ...workload,
    tasks: 1,
    turns: 1,
    input: 1_000_000,
    output: 1,
    cache: 0,
    retry: 0,
    scheduled: true,
  })
  assert.ok(Math.abs(now.monthly - 2) < 1e-9)
  assert.equal(now.scheduled, false)
  assert.ok(Math.abs(later.monthly - 4) < 1e-9)
  assert.equal(later.scheduled, true)
})

test('retries multiply the full request, including output', () => {
  const result = estimateModel(
    model({ pricing: { input: 1, output: 1, cacheRead: 1, cacheWrite: 1 } }),
    { ...workload, tasks: 1, turns: 2, input: 1_000_000, output: 0, cache: 0, retry: 50 }
  )
  assert.equal(result.requests, 3)
  assert.ok(Math.abs(result.monthly - 3) < 1e-9)
})

test('over-context requests are flagged but still estimated', () => {
  const result = estimateModel(model({ contextTokens: 1_000 }), {
    ...workload,
    tasks: 1,
    turns: 1,
    input: 2_000,
    output: 1,
    retry: 0,
  })
  assert.equal(result.overContext, true)
  assert.ok(result.monthly > 0)
})

test('workload sanitization clamps invalid and out-of-range values', () => {
  const safe = sanitizeWorkload({
    tasks: -10,
    turns: 1_000,
    input: 0,
    output: 2_000_000,
    cache: 150,
    retry: -2,
    plan: -5,
    scheduled: 1,
  })
  assert.deepEqual(safe, {
    tasks: 1,
    turns: 100,
    input: 1,
    output: 1_000_000,
    cache: 100,
    retry: 0,
    plan: 0,
    scheduled: true,
  })
})

test('preset highlight follows the workload and clears on manual edits', () => {
  assert.equal(PRESETS.length, 3)
  for (const preset of PRESETS) {
    const selected = findActivePreset(PRESETS, { ...workload, ...preset.values })
    assert.equal(selected?.id, preset.id)
  }

  const assistant = PRESETS.find((preset) => preset.id === 'assistant')
  assert.equal(presetMatches(assistant, { ...workload, ...assistant.values }), true)

  // Plan and scheduled-price toggles do not change the workload preset.
  assert.equal(
    findActivePreset(PRESETS, { ...workload, ...assistant.values, plan: 0 })?.id,
    'assistant'
  )

  // The default workload is not a preset, and editing a preset field clears it.
  assert.equal(findActivePreset(PRESETS, workload), null)
  assert.equal(
    findActivePreset(PRESETS, { ...workload, ...assistant.values, turns: 3 }),
    null
  )
})

test('snapshot carries a dated first-party source for every model', () => {
  assert.ok(snapshot.models.length >= 6)
  for (const entry of snapshot.models) {
    assert.equal(entry.priceSource.checkedAt, snapshot.firstPartyCheckedAt)
    assert.ok(entry.priceSource.url.startsWith('https://'))
    assert.ok(entry.contextTokens > 0)
    assert.ok(entry.pricing.input >= 0)
    assert.ok(entry.pricing.output > 0)
    if (entry.quality) {
      assert.ok(entry.quality.href.startsWith('/models/'))
      assert.ok(Number.isFinite(entry.quality.score))
    }
    for (const scheduled of entry.scheduledPricing) {
      assert.match(scheduled.effectiveFrom, /^\d{4}-\d{2}-\d{2}$/)
      assert.ok(scheduled.pricing.input > entry.pricing.input)
    }
    if (entry.longContext) {
      assert.ok(entry.longContext.thresholdInputTokens > 0)
      assert.ok(ratesFor(entry, { ...workload, input: entry.longContext.thresholdInputTokens + 1 }).longContext)
    }
  }
})
