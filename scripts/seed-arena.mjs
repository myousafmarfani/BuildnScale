import { writeFile } from 'node:fs/promises'
import { fetchArena } from '../lib/benchmarks/arena.mjs'
const snapshot = await fetchArena()
await writeFile(new URL('../data/benchmarks/arena-snapshot.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n')
console.log(`Arena: ${snapshot.models.length} evaluated labels at ${snapshot.sourceRevision}`)
