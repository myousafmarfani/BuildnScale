import { NextRequest, NextResponse } from "next/server";

const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isPrivateIP(hostname: string): boolean {
  const privatePatterns = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^localhost$/i,
    /^::1$/,
  ];
  return privatePatterns.some((p) => p.test(hostname));
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded. 10 checks/hour allowed." }, { status: 429 });
  }

  let url: string;
  try {
    const body = await req.json();
    url = body.url;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (isPrivateIP(parsed.hostname)) {
    return NextResponse.json({ error: "Cannot check private or local addresses" }, { status: 400 });
  }

  const start = Date.now();
  try {
    const res = await fetch(normalized, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });
    const response_ms = Date.now() - start;

    return NextResponse.json({
      url: normalized,
      is_up: res.ok || res.status < 500,
      status_code: res.status,
      response_ms,
      checked_at: new Date().toISOString(),
      region: process.env.VERCEL_REGION ?? "us-east",
    });
  } catch (err: any) {
    return NextResponse.json({
      url: normalized,
      is_up: false,
      status_code: null,
      response_ms: Date.now() - start,
      error_message: err.message,
      checked_at: new Date().toISOString(),
    });
  }
}
