import { NextResponse } from 'next/server'
import { arenaFreshness } from '@/lib/benchmarks/core.mjs'
import { getSnapshots } from '@/lib/benchmarks/data'
import { selectSnapshot } from '@/lib/benchmarks/selection.mjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Read-only operational signal for the scheduled freshness check and for
 * operators verifying which storage path is serving the public leaderboard.
 * It intentionally exposes no credentials or environment configuration.
 */
export async function GET() {
  const snapshot = selectSnapshot(await getSnapshots())
  if (!snapshot) {
    return NextResponse.json(
      { error: 'No Arena snapshot is available' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
  const freshness = arenaFreshness(snapshot)
  return NextResponse.json(
    {
      source: snapshot.source,
      storage: snapshot.storage ?? 'unknown',
      revision: snapshot.sourceRevision,
      sourceURL: snapshot.sourceURL,
      sourceUpdatedAt: snapshot.sourceUpdatedAt,
      retrievedAt: snapshot.retrievedAt,
      lastCheckedAt: snapshot.lastCheckedAt || snapshot.retrievedAt,
      ...freshness,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
