// src/components/CalendarView.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns'
import { cn } from '@/lib/utils'
import type { Walk } from '@prisma/client'

type WalkEvent = {
  walk: Walk
  type: 'recording' | 'publish'
  date: Date
}

export default function CalendarView({ walks }: { walks: Walk[] }) {
  const [current, setCurrent] = useState(new Date())

  const events: WalkEvent[] = walks.flatMap(walk => {
    const evs: WalkEvent[] = []
    if (walk.recordingDate) evs.push({ walk, type: 'recording', date: new Date(walk.recordingDate) })
    if (walk.publishDate) evs.push({ walk, type: 'publish', date: new Date(walk.publishDate) })
    return evs
  })

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-serif text-3xl font-light text-ink">{format(current, 'MMMM yyyy')}</h1>
          <p className="text-ink-3 text-sm mt-0.5 font-sans">Recording & publish schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="w-8 h-8 rounded-lg border border-stone-border flex items-center justify-center text-ink-2 hover:bg-cream transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="px-3 py-1.5 text-xs font-sans border border-stone-border rounded-lg text-ink-2 hover:bg-cream transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="w-8 h-8 rounded-lg border border-stone-border flex items-center justify-center text-ink-2 hover:bg-cream transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-terra" />
          <span className="text-[11px] font-sans text-ink-3">Recording</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          <span className="text-[11px] font-sans text-ink-3">Publish</span>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl border border-stone-border overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-stone-border">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-[11px] font-sans font-medium text-ink-3 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dayEvents = events.filter(e => isSameDay(e.date, day))
            const inMonth = isSameMonth(day, current)
            const today = isToday(day)

            return (
              <div
                key={i}
                className={cn(
                  'min-h-[100px] p-2 border-b border-r border-stone-border/50 last:border-r-0 transition-colors',
                  !inMonth && 'bg-cream-2/30',
                  today && 'bg-terra-light/20',
                  (i + 1) % 7 === 0 && 'border-r-0'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans mb-1.5 ml-auto',
                  today ? 'bg-terra text-white font-medium' : inMonth ? 'text-ink' : 'text-ink-3/40'
                )}>
                  {format(day, 'd')}
                </div>

                <div className="flex flex-col gap-1">
                  {dayEvents.map((ev, j) => (
                    <Link
                      key={j}
                      href={`/walks/${ev.walk.id}`}
                      className={cn(
                        'block px-1.5 py-0.5 rounded text-[10px] font-sans leading-tight truncate transition-opacity hover:opacity-80',
                        ev.type === 'recording'
                          ? 'bg-terra/10 text-terra'
                          : 'bg-emerald-50 text-emerald-700'
                      )}
                      title={`${ev.walk.title} — ${ev.type}`}
                    >
                      {ev.walk.title}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
