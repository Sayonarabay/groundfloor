// src/components/KanbanBoard.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, User, Calendar, DollarSign, GripVertical } from 'lucide-react'
import { STATUSES, WalkStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { Walk } from '@prisma/client'
import StatusBadge from './StatusBadge'
import NewWalkDialog from './NewWalkDialog'

type WalkWithScript = Walk & { script: any }

export default function KanbanBoard({ initialWalks }: { initialWalks: WalkWithScript[] }) {
  const router = useRouter()
  const [walks, setWalks] = useState(initialWalks)
  const [showNew, setShowNew] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<WalkStatus | null>(null)

  async function moveWalk(walkId: string, newStatus: WalkStatus) {
    setWalks(prev => prev.map(w => w.id === walkId ? { ...w, status: newStatus } : w))
    await fetch(`/api/walks/${walkId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  function handleDragStart(e: React.DragEvent, walkId: string) {
    setDragging(walkId)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent, status: WalkStatus) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(status)
  }

  function handleDrop(e: React.DragEvent, status: WalkStatus) {
    e.preventDefault()
    if (dragging) moveWalk(dragging, status)
    setDragging(null)
    setDragOver(null)
  }

  function handleDragEnd() {
    setDragging(null)
    setDragOver(null)
  }

  const colBorderMap: Record<WalkStatus, string> = {
    'idea': 'border-t-stone-400',
    'en-desarrollo': 'border-t-blue-400',
    'grabado': 'border-t-amber-400',
    'editado': 'border-t-violet-400',
    'publicado': 'border-t-emerald-500',
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-serif text-3xl font-light text-ink">Ground Floor</h1>
          <p className="text-ink-3 text-sm mt-0.5 font-sans">{walks.length} walk{walks.length !== 1 ? 's' : ''} · Paris</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-terra text-white text-sm font-sans font-medium rounded-lg hover:bg-terra-2 transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          New walk
        </button>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-180px)]">
        {STATUSES.map(({ value, label }) => {
          const colWalks = walks.filter(w => w.status === value)
          const isOver = dragOver === value

          return (
            <div
              key={value}
              className={cn(
                'flex-shrink-0 w-72 rounded-xl border-t-2 bg-cream-2/60 border border-stone-border p-3 transition-colors',
                colBorderMap[value],
                isOver && 'bg-terra-light/40 border-terra/20'
              )}
              onDragOver={e => handleDragOver(e, value)}
              onDrop={e => handleDrop(e, value)}
              onDragLeave={() => setDragOver(null)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] uppercase tracking-widest font-sans font-medium text-ink-2">
                  {label}
                </span>
                <span className="text-[11px] font-sans text-ink-3 bg-cream rounded-full w-5 h-5 flex items-center justify-center">
                  {colWalks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {colWalks.map(walk => (
                  <WalkCard
                    key={walk.id}
                    walk={walk}
                    isDragging={dragging === walk.id}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </div>

              {colWalks.length === 0 && (
                <div className="mt-2 border border-dashed border-stone-border rounded-lg p-4 text-center text-ink-3 text-xs font-sans">
                  Drop here
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showNew && <NewWalkDialog onClose={() => { setShowNew(false); router.refresh() }} />}
    </>
  )
}

function WalkCard({
  walk,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  walk: WalkWithScript
  isDragging: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
}) {
  const recDate = walk.recordingDate
    ? new Date(walk.recordingDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    : null

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, walk.id)}
      onDragEnd={onDragEnd}
      className={cn(
        'bg-white rounded-lg border border-stone-border p-3.5 cursor-grab active:cursor-grabbing group transition-all',
        isDragging ? 'opacity-40 scale-95' : 'hover:border-terra/30 hover:shadow-sm'
      )}
    >
      {/* Drag handle + title row */}
      <div className="flex items-start gap-2 mb-2.5">
        <GripVertical size={12} className="text-ink-3/40 mt-1 flex-shrink-0 group-hover:text-ink-3/70 transition-colors" />
        <Link
          href={`/walks/${walk.id}`}
          onClick={e => e.stopPropagation()}
          className="font-serif text-[17px] font-light leading-snug text-ink hover:text-terra transition-colors flex-1"
          draggable={false}
        >
          {walk.title}
        </Link>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5 ml-5">
        {walk.district && (
          <div className="flex items-center gap-1.5 text-ink-3 text-[11px] font-sans">
            <MapPin size={11} />
            <span>{walk.district}</span>
          </div>
        )}
        {walk.protagonist && (
          <div className="flex items-center gap-1.5 text-ink-3 text-[11px] font-sans">
            <User size={11} />
            <span>{walk.protagonist}</span>
          </div>
        )}
        {recDate && (
          <div className="flex items-center gap-1.5 text-ink-3 text-[11px] font-sans">
            <Calendar size={11} />
            <span>Rec. {recDate}</span>
          </div>
        )}
        {walk.cost != null && (
          <div className="flex items-center gap-1.5 text-ink-3 text-[11px] font-sans">
            <DollarSign size={11} />
            <span>€{walk.cost.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
