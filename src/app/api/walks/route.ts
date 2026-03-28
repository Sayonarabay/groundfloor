// src/app/api/walks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const walks = await db.walk.findMany({
      include: { script: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(walks)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch walks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const walk = await db.walk.create({
      data: {
        title: body.title,
        city: body.city ?? 'Paris',
        district: body.district ?? '',
        protagonist: body.protagonist ?? null,
        status: 'idea',
        notes: body.notes ?? null,
        script: { create: {} },
      },
      include: { script: true },
    })
    return NextResponse.json(walk, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create walk' }, { status: 500 })
  }
}
