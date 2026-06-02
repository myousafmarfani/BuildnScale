import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sites = await prisma.monitoredSite.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      uptimeChecks: {
        orderBy: { checkedAt: "desc" },
        take: 1,
      },
    },
  });

  const result = sites.map((site) => {
    const lastCheck = site.uptimeChecks[0] ?? null;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentChecks = site.uptimeChecks.filter(
      (c) => c.checkedAt >= thirtyDaysAgo
    );
    const total = recentChecks.length;
    const up = recentChecks.filter((c) => c.isUp).length;

    return {
      id: site.id,
      url: site.url,
      displayName: site.displayName,
      isActive: site.isActive,
      createdAt: site.createdAt,
      lastCheck: lastCheck
        ? {
            isUp: lastCheck.isUp,
            checkedAt: lastCheck.checkedAt,
            responseMs: lastCheck.responseMs,
            statusCode: lastCheck.statusCode,
          }
        : null,
      uptimePercent: total > 0 ? Math.round((up / total) * 1000) / 10 : null,
      totalChecks: total,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, display_name } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  try {
    new URL(normalized);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const existing = await prisma.monitoredSite.findUnique({
    where: { userId_url: { userId: session.user.id, url: normalized } },
  });

  if (existing) {
    return NextResponse.json({ error: "Site already monitored" }, { status: 409 });
  }

  const site = await prisma.monitoredSite.create({
    data: {
      userId: session.user.id,
      url: normalized,
      displayName: display_name || null,
    },
  });

  return NextResponse.json(site);
}
