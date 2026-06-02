import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url query parameter is required" }, { status: 400 });
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const checks = await prisma.uptimeCheck.findMany({
    where: {
      url,
      checkedAt: { gte: thirtyDaysAgo },
    },
    orderBy: { checkedAt: "desc" },
    take: 1000,
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

  return NextResponse.json({
    url,
    uptimePercent,
    totalChecks,
    upChecks,
    downChecks: totalChecks - upChecks,
    days,
  });
}
