// Manual refresh for the model-economics snapshot. Never runs in the request path.
//
// Usage: node scripts/sync-model-prices.mjs
//
// Reads OpenRouter's public model list, compares it with the first-party prices
// recorded below, and writes data/model-economics/models.json. First-party values
// win when they disagree, so a stale or discounted OpenRouter route cannot quietly
// change what the calculator shows.

import { mkdir, readFile, writeFile } from 'node:fs/promises'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/models'
const OUTPUT = new URL('../data/model-economics/models.json', import.meta.url)
const ARENA = new URL('../data/benchmarks/arena-snapshot.json', import.meta.url)

// Prices are USD per 1M tokens, verified against the publisher page on the date
// in `checkedAt`. Update the model list by hand; do not auto-discover models,
// because the quality mapping and long-context rules need a human check.
const CURATED = [
  {
    id: 'claude-fable-5.2',
    name: 'Claude Fable 5.2',
    publisher: 'Anthropic',
    openrouterId: 'anthropic/claude-fable-5.2',
    arenaName: 'Claude Fable 5.2 (xHigh)',
    contextTokens: 1_000_000,
    maxOutputTokens: 128_000,
    pricing: { input: 8, output: 40, cacheRead: 0.2, cacheWrite: 10 },
    checkedAt: '2026-11-13',
    sourceURL: 'https://platform.claude.com/docs/en/about-claude/pricing',
    priceNotes: [
      'Anthropic says its newer tokenizer produces about 30% more tokens for the same text than Sonnet 4.6 and earlier.',
    ],
  },
  {
    id: 'claude-sonnet-5.5',
    name: 'Claude Sonnet 5.5',
    publisher: 'Anthropic',
    openrouterId: 'anthropic/claude-sonnet-5.5',
    arenaName: 'Claude Sonnet 5.5 (xHigh)',
    contextTokens: 1_000_000,
    maxOutputTokens: 128_000,
    pricing: { input: 2, output: 10, cacheRead: 0.1, cacheWrite: 2.5 },
    checkedAt: '2026-11-13',
    sourceURL: 'https://platform.claude.com/docs/en/about-claude/pricing',
    priceNotes: [
      'Anthropic says its newer tokenizer produces about 30% more tokens for the same text than Sonnet 4.6 and earlier.',
    ],
  },
  {
    id: 'claude-haiku-5.5',
    name: 'Claude Haiku 5.5',
    publisher: 'Anthropic',
    openrouterId: 'anthropic/claude-haiku-5.5',
    arenaName: 'Claude Haiku 5.5 (High)',
    contextTokens: 1_000_000,
    maxOutputTokens: 128_000,
    pricing: { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
    longContext: {
      thresholdInputTokens: 100_000,
      pricing: { input: 0.5, output: 2.5, cacheRead: 0.05, cacheWrite: 0.625 },
    },
    checkedAt: '2026-11-13',
    sourceURL: 'https://platform.claude.com/docs/en/about-claude/pricing',
    priceNotes: [
      'A request whose prompt is over 100,000 tokens pays 5x the base rate for that request, including cache reads.',
      'Anthropic says its newer tokenizer produces about 30% more tokens for the same text than Sonnet 4.6 and earlier.',
    ],
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    publisher: 'OpenAI',
    openrouterId: 'openai/gpt-6-astra',
    arenaName: 'GPT-6 Astra (Max)',
    contextTokens: 1_050_000,
    maxOutputTokens: 128_000,
    pricing: { input: 10, output: 50, cacheRead: 1, cacheWrite: 12.5 },
    longContext: {
      thresholdInputTokens: 272_000,
      pricing: { input: 20, output: 75, cacheRead: 2, cacheWrite: 25 },
    },
    checkedAt: '2026-11-13',
    sourceURL: 'https://platform.openai.com/docs/pricing',
    priceNotes: [
      'Prompts over 272K input tokens are billed at the long-context rate.',
    ],
  },
  {
    id: 'gpt-6.1-terra',
    name: 'GPT-6.1 Terra',
    publisher: 'OpenAI',
    openrouterId: 'openai/gpt-6.1-terra',
    arenaName: 'GPT-6.1 Terra (Max)',
    contextTokens: 1_050_000,
    maxOutputTokens: 128_000,
    pricing: { input: 1, output: 5, cacheRead: 0.05, cacheWrite: 1.25 },
    longContext: {
      thresholdInputTokens: 272_000,
      pricing: { input: 2, output: 7.5, cacheRead: 0.1, cacheWrite: 2.5 },
    },
    checkedAt: '2026-11-13',
    sourceURL: 'https://platform.openai.com/docs/pricing',
    priceNotes: [
      'Prompts over 272K input tokens are billed at the long-context rate.',
    ],
  },
  {
    id: 'gemini-4-carbon',
    name: 'Gemini 4 Carbon',
    publisher: 'Google',
    openrouterId: 'google/gemini-4-carbon',
    arenaName: 'Gemini 4 Carbon (High)',
    contextTokens: 1_048_576,
    maxOutputTokens: 943_718,
    pricing: { input: 2, output: 10, cacheRead: 0.1, cacheWrite: null },
    scheduledPricing: [
      {
        effectiveFrom: '2026-12-01',
        pricing: { input: 4, output: 20, cacheRead: 0.2, cacheWrite: null },
        note: 'Google lists $2/$10 through November 30, 2026, then $4/$20 from December 1, 2026.',
      },
    ],
    checkedAt: '2026-11-13',
    sourceURL: 'https://ai.google.dev/gemini-api/docs/pricing',
    priceNotes: [
      'Context caching is implicit only; Google does not list a separate cache-write price.',
    ],
  },
  {
    id: 'gemini-4-hydrogen',
    name: 'Gemini 4 Hydrogen',
    publisher: 'Google',
    openrouterId: 'google/gemini-4-hydrogen',
    arenaName: 'Gemini 4 Hydrogen (High)',
    contextTokens: 1_048_576,
    maxOutputTokens: 943_718,
    pricing: { input: 1.5, output: 7.5, cacheRead: 0.075, cacheWrite: null },
    checkedAt: '2026-11-13',
    sourceURL: 'https://ai.google.dev/gemini-api/docs/pricing',
    priceNotes: [
      'Context caching is implicit only; Google does not list a separate cache-write price.',
    ],
  },
  {
    id: 'deepseek-v4.1-flash',
    name: 'DeepSeek V4.1 Flash',
    publisher: 'DeepSeek',
    openrouterId: 'deepseek/deepseek-v4.1-flash',
    arenaName: 'DeepSeek-V4.1-Flash-20261017 (Max)',
    contextTokens: 1_048_576,
    maxOutputTokens: 384_000,
    pricing: { input: 0.3, output: 1.2, cacheRead: 0.006, cacheWrite: null },
    checkedAt: '2026-11-13',
    sourceURL: 'https://api-docs.deepseek.com/quick_start/pricing',
    priceNotes: [
      'Peak-hour list price. Off-peak is half: $0.15 input, $0.60 output, $0.003 cache read per 1M tokens.',
      'Peak hours are 01:00–04:00 and 06:00–10:00 UTC, Monday–Friday, excluding Chinese public holidays.',
    ],
  },
]

const TOLERANCE = 0.005 // 0.5% — catches route differences without flagging rounding.

function perMillion(value) {
  if (typeof value !== 'string' || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Number((parsed * 1_000_000).toFixed(6)) : null
}

function close(a, b) {
  if (a === null || b === null || b === undefined) return a === b
  return Math.abs(a - b) <= Math.max(Math.abs(b) * TOLERANCE, 0.000001)
}

function qualityFor(arena, arenaName) {
  const model = arena.models.find((entry) => entry.name === arenaName)
  if (!model) return null
  const score = model.scores?.['arena-webdev']
  if (typeof score !== 'number') return null
  return {
    board: 'arena-webdev',
    boardName: 'Arena web development',
    score: Number(score.toFixed(1)),
    label: model.name,
    modelId: model.id,
    sourceDate: arena.sourceUpdatedAt?.slice(0, 10) ?? null,
    sourceURL: arena.sourceURL,
    href: `/models/${model.id}`,
  }
}

const response = await fetch(OPENROUTER_URL, {
  headers: { Accept: 'application/json' },
})
if (!response.ok) {
  throw new Error(`OpenRouter returned ${response.status}`)
}
const openrouter = await response.json()
const routes = new Map(openrouter.data.map((model) => [model.id, model]))
const arena = JSON.parse(await readFile(ARENA, 'utf8'))

const models = []
const warnings = []

for (const curated of CURATED) {
  const route = routes.get(curated.openrouterId)
  if (!route) {
    warnings.push(`${curated.name}: ${curated.openrouterId} missing from OpenRouter`)
  } else {
    const observed = {
      input: perMillion(route.pricing?.prompt),
      output: perMillion(route.pricing?.completion),
      cacheRead: perMillion(route.pricing?.input_cache_read),
      cacheWrite: perMillion(route.pricing?.input_cache_write),
    }
    for (const [field, value] of Object.entries(observed)) {
      if (value === null) continue
      // A null first-party value means the publisher does not bill that line
      // item separately (for example Gemini's implicit-only caching).
      if (curated.pricing[field] === null) continue
      if (!close(value, curated.pricing[field])) {
        warnings.push(
          `${curated.name}: ${field} first-party $${curated.pricing[field]} vs OpenRouter $${value}`
        )
      }
    }
    if (route.context_length < curated.contextTokens) {
      warnings.push(
        `${curated.name}: context ${curated.contextTokens} exceeds route ${route.context_length}`
      )
    }
  }

  models.push({
    id: curated.id,
    openrouterId: curated.openrouterId,
    name: curated.name,
    publisher: curated.publisher,
    contextTokens: curated.contextTokens,
    maxOutputTokens: curated.maxOutputTokens,
    pricing: curated.pricing,
    longContext: curated.longContext ?? null,
    scheduledPricing: curated.scheduledPricing ?? [],
    priceNotes: curated.priceNotes ?? [],
    priceSource: {
      url: curated.sourceURL,
      checkedAt: curated.checkedAt,
    },
    quality: qualityFor(arena, curated.arenaName),
  })

  if (!models.at(-1).quality) {
    warnings.push(
      `${curated.name}: no Arena webdev score for "${curated.arenaName}"`
    )
  }
}

models.sort((a, b) => b.pricing.output - a.pricing.output)

const snapshot = {
  schemaVersion: 1,
  currency: 'USD',
  unit: 'per 1M tokens',
  retrievedAt: new Date().toISOString(),
  firstPartyCheckedAt: '2026-11-13',
  sources: [
    {
      name: 'Anthropic pricing',
      url: 'https://platform.claude.com/docs/en/about-claude/pricing',
    },
    { name: 'OpenAI pricing', url: 'https://platform.openai.com/docs/pricing' },
    {
      name: 'Gemini Developer API pricing',
      url: 'https://ai.google.dev/gemini-api/docs/pricing',
    },
    {
      name: 'DeepSeek API pricing',
      url: 'https://api-docs.deepseek.com/quick_start/pricing',
    },
    {
      name: 'OpenRouter public model list (cross-check)',
      url: OPENROUTER_URL,
    },
  ],
  attribution:
    'List prices from each publisher, cross-checked against OpenRouter on the date shown. Evaluations were not rerun. No provider endorsed this page.',
  notes: [
    'Prices are USD list prices per 1M tokens, excluding tax, negotiated discounts, batch discounts, cache storage, and tool fees.',
    'The calculator estimates tokens you supply. Real bills vary with tokenizer, retries, tool calls, and reasoning tokens.',
    'Scheduled price changes are shown but not blended into current pricing.',
  ],
  models,
}

await mkdir(new URL('../data/model-economics/', import.meta.url), { recursive: true })
await writeFile(OUTPUT, JSON.stringify(snapshot, null, 2) + '\n')

for (const warning of warnings) console.warn(`warn: ${warning}`)
console.log(
  `Model economics: ${models.length} models, ${warnings.length} cross-check warning(s), snapshot ${snapshot.retrievedAt}`
)
