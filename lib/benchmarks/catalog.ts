import type { Metric } from './types'
export const METRICS: Record<
  Metric,
  { name: string; description: string; unit: string; tasks: number | null }
> = {
  'humaneval+': {
    name: 'HumanEval+',
    description:
      'Python function generation tested against EvalPlus expanded tests. Higher pass@1 is better.',
    unit: '%',
    tasks: 164,
  },
  'mbpp+': {
    name: 'MBPP+',
    description:
      'Python programming problems tested against expanded EvalPlus tests. Higher pass@1 is better.',
    unit: '%',
    tasks: 399,
  },
  humaneval: {
    name: 'HumanEval (base tests)',
    description:
      'Original HumanEval tests, as recorded by EvalPlus. Less rigorous test coverage than HumanEval+.',
    unit: '%',
    tasks: 164,
  },
  mbpp: {
    name: 'MBPP (base tests)',
    description:
      'EvalPlus sanitized MBPP subset with base tests; not the full original MBPP dataset.',
    unit: '%',
    tasks: 399,
  },
  'aa-intelligence': {
    name: 'AA Intelligence Index',
    description:
      'Artificial Analysis composite index. Interpret only within the recorded source version; not a percentage.',
    unit: '',
    tasks: null,
  },
  'aa-coding': {
    name: 'AA Coding Index',
    description:
      'Artificial Analysis coding index. Not a percentage or a BuildnScale evaluation.',
    unit: '',
    tasks: null,
  },
  'aa-agentic': {
    name: 'AA Agentic Index',
    description:
      'Artificial Analysis agentic index. Not a measure of every production agent workflow.',
    unit: '',
    tasks: null,
  },
}
export const BENCHMARKS = [
  {
    slug: 'humaneval-plus',
    metric: 'humaneval+' as Metric,
    name: 'HumanEval+',
    text: 'HumanEval+ expands the tests for 164 Python function-completion tasks. A high score indicates success on this task set, not general software engineering ability. Static public tasks can be affected by training contamination.',
    url: 'https://github.com/evalplus/evalplus',
  },
  {
    slug: 'mbpp-plus',
    metric: 'mbpp+' as Metric,
    name: 'MBPP+',
    text: 'MBPP+ uses the EvalPlus sanitized 399-task MBPP subset with expanded tests. Its scores must not be compared as if they came from the entire original MBPP dataset. These tasks do not measure repository navigation, deployment, or tool use.',
    url: 'https://github.com/evalplus/evalplus',
  },
]
export const formatScore = (
  value: number | null | undefined,
  metric: Metric
) =>
  value == null ? 'Not measured' : `${value.toFixed(1)}${METRICS[metric].unit}`
export const dateLabel = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : 'Not provided'
