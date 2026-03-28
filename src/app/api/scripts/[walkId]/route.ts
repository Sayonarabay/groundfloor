// src/app/api/scripts/[walkId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { walkId: string } }) {
  try {
    const body = await req.json()

    const script = await db.script.upsert({
      where: { walkId: params.walkId },
      update: { ...body, updatedAt: new Date() },
      create: { walkId: params.walkId, ...body },
    })

    return NextResponse.json(script)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save script' }, { status: 500 })
  }
}

export async function GET(_: NextRequest, { params }: { params: { walkId: string } }) {
  try {
    const script = await db.script.findUnique({ where: { walkId: params.walkId } })
    return NextResponse.json(script ?? {})
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
