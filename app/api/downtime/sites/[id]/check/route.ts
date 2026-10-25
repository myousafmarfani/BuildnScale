import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkWebsite } from "@/lib/http-check";
import { prisma } from "@/lib/prisma";

export async function POST(
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

  const start = Date.now();
  try {
    const result = await checkWebsite(site.url);
    const responseMs = result.responseMs;

    await prisma.uptimeCheck.create({
      data: {
        siteId: site.id,
        url: site.url,
        isUp: result.isUp,
        statusCode: result.statusCode,
        responseMs,
        region: process.env.VERCEL_REGION ?? "us-east",
      },
    });

    return NextResponse.json({
      isUp: result.isUp,
      statusCode: result.statusCode,
      responseMs,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    const responseMs = Date.now() - start;

    await prisma.uptimeCheck.create({
      data: {
        siteId: site.id,
        url: site.url,
        isUp: false,
        statusCode: null,
        responseMs,
        region: process.env.VERCEL_REGION ?? "us-east",
        errorMessage: err.message,
      },
    });

    return NextResponse.json({
      isUp: false,
      statusCode: null,
      responseMs,
      error: err.message,
      checkedAt: new Date().toISOString(),
    });
  }
}
