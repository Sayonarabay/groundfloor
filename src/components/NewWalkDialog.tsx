// src/components/NewWalkDialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function NewWalkDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', district: '', protagonist: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/walks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, city: 'Paris' }),
      })
      const walk = await res.json()
      router.push(`/walks/${walk.id}`)
      router.refresh()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl w-full max-w-md p-7 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-light">New walk</h2>
          <button onClick={onClose} className="text-ink-3 hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-3 mb-1.5">Title *</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Le jardin fermé"
              className="w-full border border-stone-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream-2/40 focus:outline-none focus:border-terra/60 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-3 mb-1.5">District</label>
            <input
              value={form.district}
              onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
              placeholder="BNF — 13ème"
              className="w-full border border-stone-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream-2/40 focus:outline-none focus:border-terra/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-ink-3 mb-1.5">Protagonist</label>
            <input
              value={form.protagonist}
              onChange={e => setForm(f => ({ ...f, protagonist: e.target.value }))}
              placeholder="JR, Laurent Garnier…"
              className="w-full border border-stone-border rounded-lg px-3 py-2.5 text-sm font-sans bg-cream-2/40 focus:outline-none focus:border-terra/60 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-sans text-ink-2 border border-stone-border rounded-lg hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="px-5 py-2 text-sm font-sans font-medium bg-terra text-white rounded-lg hover:bg-terra-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating…' : 'Create walk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
