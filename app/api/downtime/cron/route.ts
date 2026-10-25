import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkWebsite } from '@/lib/http-check'
export const runtime = 'nodejs'
export async function POST(req: NextRequest) {
  if (!process.env.CRON_SECRET || req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 })
  const sites = await prisma.monitoredSite.findMany({ where: { isActive: true } })
  let succeeded = 0
  // Bound concurrent outbound checks rather than opening one request per site.
  for (let index = 0; index < sites.length; index += 5) {
    const results = await Promise.allSettled(sites.slice(index,index+5).map(async site => {
      const start = Date.now()
      try {
        const result = await checkWebsite(site.url)
        await prisma.uptimeCheck.create({ data: { siteId: site.id, url: site.url, isUp: result.isUp, statusCode: result.statusCode, responseMs: result.responseMs, region: result.region } })
      } catch (error) {
        await prisma.uptimeCheck.create({ data: { siteId: site.id, url: site.url, isUp: false, statusCode: null, responseMs: Date.now()-start, region: process.env.VERCEL_REGION ?? 'server', errorMessage: error instanceof Error ? error.message : 'Check failed' } })
      }
    }))
    succeeded += results.filter(result => result.status === 'fulfilled').length
  }
  return NextResponse.json({ ok: true, sitesChecked: sites.length, succeeded, failed: sites.length-succeeded })
}
