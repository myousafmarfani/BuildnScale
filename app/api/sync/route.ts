import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import type { Prisma } from "@prisma/client"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function toJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const records = await prisma.userData.findMany({
    where: { userId: session.user.id },
    select: { key: true, value: true },
  })

  const data: Record<string, unknown> = {}
  for (const r of records) {
    data[r.key] = r.value
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { key, value } = body

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 })
  }

  await prisma.userData.upsert({
    where: {
      userId_key: { userId: session.user.id, key },
    },
    update: { value: toJson(value) },
    create: {
      userId: session.user.id,
      key,
      value: toJson(value),
    },
  })

  return NextResponse.json({ ok: true })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { entries } = body

  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ error: "Entries array is required" }, { status: 400 })
  }

  await prisma.$transaction(
    entries.map((entry: { key: string; value: unknown }) =>
      prisma.userData.upsert({
        where: {
          userId_key: { userId: session.user.id, key: entry.key },
        },
        update: { value: toJson(entry.value) },
        create: {
          userId: session.user.id,
          key: entry.key,
          value: toJson(entry.value),
        },
      })
    )
  )

  return NextResponse.json({ ok: true, count: entries.length })
}
