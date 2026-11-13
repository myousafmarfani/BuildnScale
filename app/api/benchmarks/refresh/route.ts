import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { importBenchmarks } from '@/lib/benchmarks/import'
export const runtime = 'nodejs'
export const maxDuration = 300
export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET,
    actual = request.headers.get('authorization') || ''
  if (
    !expected ||
    Buffer.byteLength(actual) !== Buffer.byteLength(`Bearer ${expected}`) ||
    !timingSafeEqual(Buffer.from(actual), Buffer.from(`Bearer ${expected}`))
  )
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const source = new URL(request.url).searchParams.get('source') || 'arena'
  if (source !== 'evalplus' && source !== 'artificial-analysis' && source !== 'arena')
    return NextResponse.json({ error: 'Unsupported source' }, { status: 400 })
  try {
    const result = await importBenchmarks(source)
    try {
      revalidateTag('benchmarks', { expire: 0 })
      // The data cache is tagged, but the full route cache is not. Revalidate the
      // public routes so "Last successful check" and the update history change now.
      for (const path of [
        '/leaderboard',
        '/leaderboard/coding',
        '/leaderboard/agents',
        '/leaderboard/value',
        '/leaderboard/changelog',
        '/leaderboard/archive',
        '/models',
        '/compare',
      ])
        revalidatePath(path)
      revalidatePath('/models/[slug]', 'page')
      revalidatePath('/compare/[pair]', 'page')
    } catch (error) {
      // The snapshot is already stored. Do not report a failed import just
      // because cache invalidation was unavailable; pages refresh within an hour.
      console.warn(
        'Benchmark snapshot imported but public cache revalidation failed',
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error(
      'Benchmark import failed',
      error instanceof Error ? error.message : 'Unknown error'
    )
    return NextResponse.json(
      {
        error:
          'Import failed; previous published snapshot retained. See server logs.',
      },
      { status: 503 }
    )
  }
}
