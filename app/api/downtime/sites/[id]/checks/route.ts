import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const site = await prisma.monitoredSite.findUnique({ where: { id } });

  if (!site || site.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const range = req.nextUrl.searchParams.get("range") || "30";
  const daysAgo = parseInt(range, 10) || 30;
  const since = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  const checks = await prisma.uptimeCheck.findMany({
    where: {
      siteId: id,
      checkedAt: { gte: since },
    },
    orderBy: { checkedAt: "desc" },
    take: 2000,
  });

  const totalChecks = checks.length;
  const upChecks = checks.filter((c) => c.isUp).length;
  const uptimePercent = totalChecks > 0 ? Math.round((upChecks / totalChecks) * 1000) / 10 : 100;

  const dailyBuckets: Record<string, { up: number; total: number; avgMs: number[] }> = {};
  for (const check of checks) {
    const day = check.checkedAt.toISOString().slice(0, 10);
    if (!dailyBuckets[day]) {
      dailyBuckets[day] = { up: 0, total: 0, avgMs: [] };
    }
    dailyBuckets[day].total++;
    if (check.isUp) dailyBuckets[day].up++;
    if (check.responseMs !== null) dailyBuckets[day].avgMs.push(check.responseMs);
  }

  const days = Object.entries(dailyBuckets)
    .map(([date, data]) => ({
      date,
      up: data.up,
      down: data.total - data.up,
      total: data.total,
      avgResponseMs: data.avgMs.length > 0
        ? Math.round(data.avgMs.reduce((a, b) => a + b, 0) / data.avgMs.length)
        : null,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const incidents = checks
    .filter((c) => !c.isUp)
    .map((c) => ({
      id: c.id,
      checkedAt: c.checkedAt,
      statusCode: c.statusCode,
      region: c.region,
      errorMessage: c.errorMessage,
      responseMs: c.responseMs,
    }));

  return NextResponse.json({
    siteId: id,
    url: site.url,
    displayName: site.displayName,
    uptimePercent,
    totalChecks,
    upChecks,
    downChecks: totalChecks - upChecks,
    days,
    incidents,
    range: daysAgo,
  });
}
