import { NextRequest, NextResponse } from 'next/server'
import { checkWebsite, normalizePublicURL } from '@/lib/http-check'
export const runtime = 'nodejs'
const requests = new Map<string,{ count: number; resetAt: number }>()
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  for (const [key,entry] of requests) if (entry.resetAt <= now) requests.delete(key)
  const entry = requests.get(ip)
  if (entry && entry.count >= 10) return NextResponse.json({ error: 'Rate limit exceeded. 10 checks/hour allowed.' }, { status: 429 })
  requests.set(ip, { count: (entry?.count ?? 0) + 1, resetAt: entry?.resetAt ?? now + 3600000 })
  let url: string
  try {
    const body = await req.json()
    if (typeof body.url !== 'string' || body.url.length > 2048) throw new Error('Enter a valid website URL.')
    url = normalizePublicURL(body.url).href
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid URL' }, { status: 400 }) }
  try {
    const result = await checkWebsite(url)
    return NextResponse.json({ url, is_up: result.isUp, status_code: result.statusCode, response_ms: result.responseMs, checked_at: new Date().toISOString(), region: result.region })
  } catch (error) {
    return NextResponse.json({ url, is_up: false, status_code: null, response_ms: Date.now()-now, checked_at: new Date().toISOString(), region: process.env.VERCEL_REGION ?? 'server', error_message: error instanceof Error ? error.message : 'Check failed' })
  }
}
