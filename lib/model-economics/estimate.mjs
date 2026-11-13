// Pure cost math for /ai-costs. Kept dependency-free so the numbers can be
// tested without a browser or a build step.

/**
 * @typedef {Object} TokenPricing
 * @property {number} input
 * @property {number} output
 * @property {number|null} cacheRead
 * @property {number|null} cacheWrite
 */

/**
 * @typedef {Object} Workload
 * @property {number} tasks
 * @property {number} turns
 * @property {number} input
 * @property {number} output
 * @property {number} cache
 * @property {number} retry
 * @property {number} plan
 * @property {boolean} scheduled
 */

/**
 * @typedef {Object} PricedModel
 * @property {string} id
 * @property {string} name
 * @property {string} [publisher]
 * @property {number} contextTokens
 * @property {TokenPricing} pricing
 * @property {{thresholdInputTokens: number, pricing: TokenPricing}|null} longContext
 * @property {Array<{effectiveFrom: string, pricing: TokenPricing, note: string}>} scheduledPricing
 * @property {{href: string, label: string, boardName: string, score: number, sourceDate?: string|null}|null} [quality]
 */

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))

/**
 * Clamp a workload into the ranges the calculator accepts. Invalid and empty
 * numbers fall back to the minimum, which keeps the table finite.
 *
 * @param {Workload} inputs
 * @returns {Workload}
 */
export function sanitizeWorkload(inputs) {
  return {
    tasks: Math.round(clamp(inputs.tasks, 1, 5_000_000)),
    turns: Math.round(clamp(inputs.turns, 1, 100)),
    input: Math.round(clamp(inputs.input, 1, 2_000_000)),
    output: Math.round(clamp(inputs.output, 1, 1_000_000)),
    cache: clamp(inputs.cache, 0, 100),
    retry: clamp(inputs.retry, 0, 100),
    plan: clamp(inputs.plan, 0, 1_000_000),
    scheduled: Boolean(inputs.scheduled),
  }
}

/**
 * Pick the rate card for a request. Long-context rates take precedence over a
 * scheduled increase; no current model has both.
 *
 * @param {PricedModel} model
 * @param {Workload} inputs
 */
export function ratesFor(model, inputs) {
  const scheduled =
    inputs.scheduled && model.scheduledPricing.length > 0
      ? model.scheduledPricing[0]
      : null
  const longContext =
    model.longContext !== null && inputs.input > model.longContext.thresholdInputTokens
      ? model.longContext
      : null
  const card = longContext
    ? longContext.pricing
    : scheduled
      ? scheduled.pricing
      : model.pricing

  return {
    input: card.input,
    output: card.output,
    cacheRead: card.cacheRead ?? card.input,
    longContext: longContext !== null,
    scheduled: Boolean(scheduled) && longContext === null,
  }
}

/**
 * Cost one model for a workload. Tokens are priced per 1M. Retries multiply the
 * whole request because a retry produces output as well as input.
 *
 * @param {PricedModel} model
 * @param {Workload} inputs
 */
export function estimateModel(model, inputs) {
  const rates = ratesFor(model, inputs)
  const requests = inputs.tasks * inputs.turns * (1 + inputs.retry / 100)
  const hit = inputs.cache / 100
  const blendedInput = rates.input * (1 - hit) + rates.cacheRead * hit

  const monthly =
    requests *
    ((inputs.input * blendedInput) / 1_000_000 + (inputs.output * rates.output) / 1_000_000)
  const monthlyNoCache =
    requests *
    ((inputs.input * rates.input) / 1_000_000 + (inputs.output * rates.output) / 1_000_000)

  return {
    model,
    monthly,
    monthlyNoCache,
    cacheSavings: monthlyNoCache - monthly,
    perTask: monthly / inputs.tasks,
    perThousand: (monthly / inputs.tasks) * 1_000,
    requests,
    longContext: rates.longContext,
    scheduled: rates.scheduled,
    overContext: inputs.input > model.contextTokens,
  }
}

/**
 * Estimate every model and return the cheapest first. Over-context models stay
 * in the list so the table can flag them, but callers should not treat them as
 * the cheapest usable option.
 *
 * @param {PricedModel[]} models
 * @param {Workload} raw
 */
export function estimateAll(models, raw) {
  const inputs = sanitizeWorkload(raw)
  return models
    .map((model) => estimateModel(model, inputs))
    .sort((a, b) => a.monthly - b.monthly)
}
