import fs from 'node:fs/promises'
import { normalizeEvalPlus, assertSnapshot } from '../lib/benchmarks/core.mjs'
const raw = JSON.parse(
  await fs.readFile('data/benchmarks/upstream/evalplus.json', 'utf8')
)
const snapshot = assertSnapshot(
  normalizeEvalPlus(raw, {
    sourceRevision: '87418456d3a8c2bc6265f24ff91d2dd0e7993f4b',
    sourceURL:
      'https://github.com/evalplus/evalplus.github.io/blob/87418456d3a8c2bc6265f24ff91d2dd0e7993f4b/results.json',
    sourceUpdatedAt: '2024-12-26T17:02:22Z',
    retrievedAt: '2026-10-26T09:40:00Z',
    license: 'Apache-2.0',
    attribution:
      'EvalPlus contributors — results redistributed under Apache-2.0. Normalized by BuildnScale; no evaluations rerun.',
  })
)
await fs.writeFile(
  'data/benchmarks/evalplus-snapshot.json',
  JSON.stringify(snapshot, null, 2) + '\n'
)
console.log(`Generated ${snapshot.models.length} attributed model records`)
