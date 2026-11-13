import { readFile } from 'node:fs/promises'

const snapshot = JSON.parse(
  await readFile(
    new URL('../data/benchmarks/arena-snapshot.json', import.meta.url),
    'utf8'
  )
)
const args = process.argv.slice(2)
const maxIndex = args.indexOf('--max-age-days')
const maxAgeDays = Number(maxIndex === -1 ? 7 : args[maxIndex + 1])
const strict = args.includes('--strict')
if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
  console.error('--max-age-days must be a positive number')
  process.exit(2)
}

const checked = Date.parse(snapshot.lastCheckedAt || snapshot.retrievedAt)
const published = Date.parse(snapshot.sourceUpdatedAt)
const now = Date.now()
const checkAgeDays = Number.isFinite(checked) ? (now - checked) / 86_400_000 : Infinity
const publicationAgeDays = Number.isFinite(published)
  ? (now - published) / 86_400_000
  : Infinity

console.log(
  `Bundled Arena snapshot ${snapshot.sourceRevision}: checked ${checkAgeDays.toFixed(1)} days ago, published ${publicationAgeDays.toFixed(1)} days ago (limit ${maxAgeDays} days).`
)
if (checkAgeDays > maxAgeDays) {
  const message = `Bundled Arena snapshot is stale. Run \`npm run benchmarks:arena\`, inspect the diff, and commit the refreshed file.`
  if (strict) {
    console.error(message)
    process.exit(1)
  }
  console.warn(message)
}
