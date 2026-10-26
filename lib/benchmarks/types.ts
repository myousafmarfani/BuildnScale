export type Metric =
  | 'humaneval'
  | 'humaneval+'
  | 'mbpp'
  | 'mbpp+'
  | 'aa-intelligence'
  | 'aa-coding'
  | 'aa-agentic'
  | 'arena-text'
  | 'arena-webdev'
  | 'arena-agent'
export type Model = {
  id: string
  name: string
  publisher: string
  link: string
  instructionTuned: boolean | null
  releaseDate?: string | null
  parametersB: number | null
  scores: Partial<Record<Metric, number | null>>
  identityNote?: string
  evidence?: Partial<Record<Metric, { rank: number | null; lower: number | null; upper: number | null; count: number | null; sessions: number | null; publishedAt: string }>>
  pricing: { input: number | null; output: number | null } | null
  speed: number | null
}
export type Snapshot = {
  schemaVersion: number
  source: 'evalplus' | 'artificial-analysis' | 'arena'
  sourceRevision: string
  sourceURL: string
  sourceUpdatedAt: string | null
  retrievedAt: string
  license: string
  attribution: string
  lastCheckedAt?: string
  indexVersion?: string
  models: Model[]
}
