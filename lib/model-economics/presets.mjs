// Workload presets for /ai-costs. Kept dependency-free so the selection logic
// can be tested without rendering the client component.

/**
 * @typedef {Object} WorkloadInputs
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
 * @typedef {Object} WorkloadPreset
 * @property {string} id
 * @property {string} label
 * @property {string} hint
 * @property {Record<string, number>} values
 */

/** @type {WorkloadInputs} */
export const DEFAULT_WORKLOAD = {
  tasks: 1_000,
  turns: 3,
  input: 8_000,
  output: 700,
  cache: 0,
  retry: 2,
  plan: 20,
  scheduled: false,
}

/** @type {WorkloadPreset[]} */
export const PRESETS = [
  {
    id: 'assistant',
    label: 'Support assistant',
    hint: '4,000 tasks · 2 turns · 6k input · 500 output',
    values: { tasks: 4_000, turns: 2, input: 6_000, output: 500, cache: 40, retry: 2 },
  },
  {
    id: 'agent',
    label: 'Coding agent',
    hint: '600 tasks · 8 turns · 30k input · 1.2k output',
    values: { tasks: 600, turns: 8, input: 30_000, output: 1_200, cache: 60, retry: 5 },
  },
  {
    id: 'extraction',
    label: 'Batch extraction',
    hint: '50,000 tasks · 1 turn · 1.5k input · 250 output',
    values: { tasks: 50_000, turns: 1, input: 1_500, output: 250, cache: 0, retry: 1 },
  },
]

/**
 * A preset is selected only while every workload field it sets still matches.
 * Editing one of those fields clears the highlight instead of leaving a stale
 * selection on screen.
 *
 * @param {WorkloadPreset} preset
 * @param {Record<string, unknown>} workload
 */
export function presetMatches(preset, workload) {
  return Object.entries(preset.values).every(
    ([field, value]) => workload[field] === value
  )
}

/**
 * @param {WorkloadPreset[]} presets
 * @param {Record<string, unknown>} workload
 */
export function findActivePreset(presets, workload) {
  return presets.find((preset) => presetMatches(preset, workload)) ?? null
}
