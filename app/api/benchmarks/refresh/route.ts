import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
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
  const source = new URL(request.url).searchParams.get('source') || 'evalplus'
  if (source !== 'evalplus' && source !== 'artificial-analysis')
    return NextResponse.json({ error: 'Unsupported source' }, { status: 400 })
  try {
    const result = await importBenchmarks(source)
    revalidateTag('benchmarks', 'max')
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
