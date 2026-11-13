export type TokenPricing = {
  input: number
  output: number
  cacheRead: number | null
  cacheWrite: number | null
}

export type QualityReference = {
  board: string
  boardName: string
  score: number
  label: string
  modelId: string
  sourceDate: string | null
  sourceURL: string
  href: string
}

export type ScheduledPricing = {
  effectiveFrom: string
  pricing: TokenPricing
  note: string
}

export type ModelPricing = {
  id: string
  openrouterId: string
  name: string
  publisher: string
  contextTokens: number
  maxOutputTokens: number
  pricing: TokenPricing
  longContext: {
    thresholdInputTokens: number
    pricing: TokenPricing
  } | null
  scheduledPricing: ScheduledPricing[]
  priceNotes: string[]
  priceSource: {
    url: string
    checkedAt: string
  }
  quality: QualityReference | null
}

export type ModelEconomicsSnapshot = {
  schemaVersion: number
  currency: string
  unit: string
  retrievedAt: string
  firstPartyCheckedAt: string
  sources: Array<{ name: string; url: string }>
  attribution: string
  notes: string[]
  models: ModelPricing[]
}
