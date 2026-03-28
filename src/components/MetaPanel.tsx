// src/components/MetaPanel.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { STATUSES, WalkStatus } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { Walk } from '@prisma/client'

function fmt(date: Date | string | null | undefined) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0]
}

export default function MetaPanel({ walk }: { walk: Walk & { script: any } }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: walk.title,
    city: walk.city,
    district: walk.district ?? '',
    protagonist: walk.protagonist ?? '',
    status: walk.status as WalkStatus,
    recordingDate: fmt(walk.recordingDate),
    publishDate: fmt(walk.publishDate),
    cost: walk.cost?.toString() ?? '',
    duration: walk.duration?.toString() ?? '',
    notes: walk.notes ?? '',
  })

  async function save(patch: Partial<typeof form>) {
    setSaving(true)
    const updated = { ...form, ...patch }
    setForm(updated)
    await fetch(`/api/walks/${walk.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSaving(false)
    startTransition(() => router.refresh())
  }

  async function deleteWalk() {
    if (!confirm('Delete this walk permanently?')) return
    await fetch(`/api/walks/${walk.id}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  const Field = ({
    label, field, type = 'text', placeholder
  }: { label: string; field: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-ink-3 mb-1">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        onBlur={e => save({ [field]: e.target.value })}
        placeholder={placeholder}
        className="w-full text-sm font-sans text-ink bg-transparent border-b border-stone-border pb-1 focus:outline-none focus:border-terra/60 transition-colors placeholder:text-ink-3/50"
      />
    </div>
  )

  return (
    <aside className="w-64 flex-shrink-0 border-r border-stone-border flex flex-col h-full overflow-y-auto">
      <div className="p-5 border-b border-stone-border">
        <textarea
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          onBlur={e => save({ title: e.target.value })}
          rows={2}
          className="w-full font-serif text-xl font-light text-ink bg-transparent resize-none focus:outline-none leading-snug"
          placeholder="Walk title"
        />
        <div className="mt-3">
          <select
            value={form.status}
            onChange={e => save({ status: e.target.value as WalkStatus })}
            className="text-[11px] font-sans font-medium px-2 py-1 rounded border-0 focus:outline-none cursor-pointer"
            style={{ backgroundColor: 'transparent' }}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        <Field label="City" field="city" placeholder="Paris" />
        <Field label="District" field="district" placeholder="BNF — 13ème" />
        <Field label="Protagonist" field="protagonist" placeholder="JR, Abd Al Malik…" />

        <div className="border-t border-stone-border pt-4 flex flex-col gap-5">
          <Field label="Recording date" field="recordingDate" type="date" />
          <Field label="Publish date" field="publishDate" type="date" />
        </div>

        <div className="border-t border-stone-border pt-4 flex flex-col gap-5">
          <Field label="Cost (€)" field="cost" type="number" placeholder="0" />
          <Field label="Duration (min)" field="duration" type="number" placeholder="22" />
        </div>

        <div className="border-t border-stone-border pt-4">
          <label className="block text-[10px] uppercase tracking-widest text-ink-3 mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            onBlur={e => save({ notes: e.target.value })}
            rows={4}
            placeholder="Context, contacts, access info…"
            className="w-full text-sm font-sans text-ink bg-transparent resize-none focus:outline-none leading-relaxed placeholder:text-ink-3/50"
          />
        </div>
      </div>

      <div className="p-5 border-t border-stone-border flex items-center justify-between">
        <span className={cn('text-[10px] font-sans text-ink-3 transition-opacity', saving ? 'opacity-100' : 'opacity-0')}>
          Saving…
        </span>
        <button
          onClick={deleteWalk}
          className="flex items-center gap-1.5 text-[11px] font-sans text-ink-3 hover:text-red-500 transition-colors"
        >
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </aside>
  )
}
