export type Metric =
  | 'humaneval'
  | 'humaneval+'
  | 'mbpp'
  | 'mbpp+'
  | 'aa-intelligence'
  | 'aa-coding'
  | 'aa-agentic'
export type Model = {
  id: string
  name: string
  publisher: string
  link: string
  instructionTuned: boolean | null
  parametersB: number | null
  scores: Partial<Record<Metric, number | null>>
  pricing: { input: number | null; output: number | null } | null
  speed: number | null
}
export type Snapshot = {
  schemaVersion: number
  source: 'evalplus' | 'artificial-analysis'
  sourceRevision: string
  sourceURL: string
  sourceUpdatedAt: string | null
  retrievedAt: string
  license: string
  attribution: string
  indexVersion?: string
  models: Model[]
}
