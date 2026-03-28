// src/app/api/walks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const walk = await db.walk.findUnique({
      where: { id: params.id },
      include: { script: true },
    })
    if (!walk) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(walk)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { script: _script, ...walkData } = body

    // Parse dates
    if (walkData.recordingDate) walkData.recordingDate = new Date(walkData.recordingDate)
    else if ('recordingDate' in walkData) walkData.recordingDate = null
    if (walkData.publishDate) walkData.publishDate = new Date(walkData.publishDate)
    else if ('publishDate' in walkData) walkData.publishDate = null

    // Numeric
    if (walkData.cost !== undefined) walkData.cost = walkData.cost ? parseFloat(walkData.cost) : null
    if (walkData.duration !== undefined) walkData.duration = walkData.duration ? parseInt(walkData.duration) : null

    const walk = await db.walk.update({
      where: { id: params.id },
      data: walkData,
      include: { script: true },
    })
    return NextResponse.json(walk)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.walk.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
