import seed from '@/data/benchmarks/evalplus-snapshot.json'
import arenaSeed from '@/data/benchmarks/arena-snapshot.json'
import { prisma } from '@/lib/prisma'
import { assertSnapshot } from './core.mjs'
import type { Snapshot } from './types'
import { unstable_cache } from 'next/cache'
const getStoredSnapshots = unstable_cache(
  async (): Promise<Snapshot[]> => {
    const fallback = seed as Snapshot
    const arenaFallback = arenaSeed as Snapshot
    if (!process.env.DATABASE_URL) return [fallback, arenaFallback]
    try {
      const candidates = await Promise.all(
        ['evalplus', 'artificial-analysis', 'arena'].map((source) =>
          prisma.benchmarkSnapshot.findFirst({
            where: { source },
            orderBy: { retrievedAt: 'desc' },
          })
        )
      )
      const rows = candidates.filter((row) => row !== null)
      const latest = new Map<string, Snapshot>()
      for (const row of rows) {
        if (latest.has(row.source)) continue
        try {
          latest.set(row.source, { ...assertSnapshot(row.payload), lastCheckedAt: row.retrievedAt?.toISOString() || undefined } as Snapshot)
        } catch {
          console.warn('Ignoring invalid benchmark snapshot', row.id)
        }
      }
      if (!latest.has('evalplus')) latest.set('evalplus', fallback)
      if (!latest.has('arena')) latest.set('arena', arenaFallback)
      return [...latest.values()]
    } catch {
      console.warn(
        'Benchmark storage unavailable; serving attributed bundled snapshot'
      )
      return [fallback, arenaFallback]
    }
  },
  ['benchmarks-v2-arena'],
  { revalidate: 3600, tags: ['benchmarks'] }
)
// Apply the publication gate after the shared cache so disabling display also
// removes already imported AA data, including data from a warm cache.
function publicSources() {
  return process.env.AA_PUBLIC_DISPLAY_ENABLED === 'true' &&
    Boolean(process.env.AA_PERMISSION_REFERENCE?.trim())
    ? ['evalplus', 'arena', 'artificial-analysis']
    : ['evalplus', 'arena']
}
export async function getSnapshots(): Promise<Snapshot[]> {
  const sources = publicSources()
  return (await getStoredSnapshots()).filter(snapshot => sources.includes(snapshot.source))
}
export async function getModel(id: string) {
  const snapshots = await getSnapshots()
  for (const snapshot of snapshots) {
    const model = snapshot.models.find((m) => m.id === id)
    if (model) return { model, snapshot }
  }
  return null
}
export async function getHistory() {
  if (!process.env.DATABASE_URL) return [seed as Snapshot, arenaSeed as Snapshot]
  try {
    const rows = await prisma.benchmarkSnapshot.findMany({
      where: { source: { in: publicSources() } },
      orderBy: { retrievedAt: 'desc' },
      take: 20,
    })
    const history = [
      seed as Snapshot,
      arenaSeed as Snapshot,
      ...rows.map((r) => assertSnapshot(r.payload) as Snapshot),
    ].sort((a, b) => b.retrievedAt.localeCompare(a.retrievedAt))
    return [...new Map(history.map(snapshot => [`${snapshot.source}:${snapshot.sourceRevision}`, snapshot])).values()]
  } catch {
    return [seed as Snapshot, arenaSeed as Snapshot]
  }
}
