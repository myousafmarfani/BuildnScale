// Requires CRON_SECRET env var (set in Vercel/your hosting) and
// SUPABASE_SERVICE_ROLE_KEY for direct DB access if using Supabase.
// This route uses Prisma with DATABASE_URL which already has full access.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sites = await prisma.monitoredSite.findMany({
    where: { isActive: true },
  });

  const results = await Promise.allSettled(
    sites.map(async (site) => {
      const regions = ["us-east", "eu-west", "ap-south"];
      const checks = await Promise.allSettled(
        regions.map(async (region) => {
          const start = Date.now();
          try {
            const res = await fetch(site.url, {
              method: "HEAD",
              signal: AbortSignal.timeout(10000),
              redirect: "follow",
            });
            const response_ms = Date.now() - start;

            await prisma.uptimeCheck.create({
              data: {
                siteId: site.id,
                url: site.url,
                isUp: res.ok || res.status < 500,
                statusCode: res.status,
                responseMs: response_ms,
                region,
                sslValid: res.headers.get("strict-transport-security") !== null,
              },
            });
          } catch (err: any) {
            await prisma.uptimeCheck.create({
              data: {
                siteId: site.id,
                url: site.url,
                isUp: false,
                statusCode: null,
                responseMs: Date.now() - start,
                region,
                errorMessage: err.message,
              },
            });
          }
        })
      );
      return { siteId: site.id, url: site.url, checks: checks.length };
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;

  return NextResponse.json({
    ok: true,
    sitesChecked: sites.length,
    succeeded,
    failed: sites.length - succeeded,
  });
}
