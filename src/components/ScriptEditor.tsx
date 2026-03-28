// src/components/ScriptEditor.tsx
'use client'

import { useState, useCallback, useRef } from 'react'
import { SCRIPT_PHASES, wordCount, estimateMinutes } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { Script } from '@prisma/client'

type PhaseKey = 'arrival' | 'observation' | 'discovery' | 'expansion' | 'reframing'

type ScriptData = {
  [K in `${PhaseKey}Text` | `${PhaseKey}Speaker` | `${PhaseKey}Notes`]?: string | null
}

function useAutoSave(walkId: string, delay = 1200) {
  const timer = useRef<NodeJS.Timeout>()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const save = useCallback((data: ScriptData) => {
    setStatus('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      await fetch(`/api/scripts/${walkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 2000)
    }, delay)
  }, [walkId, delay])

  return { save, status }
}

export default function ScriptEditor({ walkId, script }: { walkId: string; script: Script | null }) {
  const [data, setData] = useState<ScriptData>({
    arrivalText: script?.arrivalText ?? '',
    arrivalSpeaker: script?.arrivalSpeaker ?? '',
    arrivalNotes: script?.arrivalNotes ?? '',
    observationText: script?.observationText ?? '',
    observationSpeaker: script?.observationSpeaker ?? '',
    observationNotes: script?.observationNotes ?? '',
    discoveryText: script?.discoveryText ?? '',
    discoverySpeaker: script?.discoverySpeaker ?? '',
    discoveryNotes: script?.discoveryNotes ?? '',
    expansionText: script?.expansionText ?? '',
    expansionSpeaker: script?.expansionSpeaker ?? '',
    expansionNotes: script?.expansionNotes ?? '',
    reframingText: script?.reframingText ?? '',
    reframingSpeaker: script?.reframingSpeaker ?? '',
    reframingNotes: script?.reframingNotes ?? '',
  })
  const [active, setActive] = useState<PhaseKey>('arrival')
  const { save, status } = useAutoSave(walkId)

  function update(field: keyof ScriptData, value: string) {
    const next = { ...data, [field]: value }
    setData(next)
    save(next)
  }

  const totalWords = SCRIPT_PHASES.reduce((acc, p) => {
    return acc + wordCount(data[`${p.key as PhaseKey}Text`])
  }, 0)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Phase tabs */}
      <div className="flex items-end gap-0 border-b border-stone-border px-6 pt-4 overflow-x-auto">
        {SCRIPT_PHASES.map(phase => {
          const key = phase.key as PhaseKey
          const words = wordCount(data[`${key}Text`])
          const isActive = active === key
          const hasContent = words > 0

          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                'flex flex-col items-start px-4 py-2.5 border-b-2 transition-all whitespace-nowrap mr-1 rounded-t-md',
                isActive
                  ? 'border-terra text-ink bg-terra-light/30'
                  : 'border-transparent text-ink-3 hover:text-ink hover:bg-cream-2/60'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-medium text-terra/60">{phase.number}</span>
                <span className="text-sm font-sans font-medium">{phase.label}</span>
                {hasContent && !isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-terra/40" />
                )}
              </div>
              {isActive && words > 0 && (
                <span className="text-[10px] font-sans text-ink-3 mt-0.5">{words}w · ~{estimateMinutes(data[`${key}Text`])}min</span>
              )}
            </button>
          )
        })}

        <div className="ml-auto pb-2.5 flex items-center gap-3 flex-shrink-0">
          <span className="text-[11px] font-sans text-ink-3">
            {totalWords > 0 && `${totalWords}w total · ~${Math.round(totalWords / 150)}min`}
          </span>
          <span className={cn(
            'text-[11px] font-sans transition-opacity',
            status === 'saving' ? 'text-ink-3 opacity-100' : status === 'saved' ? 'text-emerald-600 opacity-100' : 'opacity-0'
          )}>
            {status === 'saving' ? 'Saving…' : '✓ Saved'}
          </span>
        </div>
      </div>

      {/* Active phase editor */}
      {SCRIPT_PHASES.map(phase => {
        const key = phase.key as PhaseKey
        if (active !== key) return null

        return (
          <div key={key} className="flex flex-col flex-1 overflow-hidden">
            {/* Phase description */}
            <div className="px-7 pt-4 pb-3 bg-cream-2/30 border-b border-stone-border/60">
              <p className="text-[12px] font-sans text-ink-3 italic">{phase.description}</p>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Main text */}
              <div className="flex-1 overflow-y-auto p-7">
                <textarea
                  value={data[`${key}Text`] ?? ''}
                  onChange={e => update(`${key}Text`, e.target.value)}
                  placeholder={`Write the ${phase.label.toLowerCase()} text here…\n\nThis is where the listener is when they hear this.`}
                  className="w-full h-full min-h-[400px] font-serif text-[17px] leading-[1.85] text-ink bg-transparent resize-none focus:outline-none placeholder:text-ink-3/40 placeholder:font-sans placeholder:text-sm placeholder:leading-relaxed"
                />
              </div>

              {/* Right gutter: speaker + notes */}
              <div className="w-56 flex-shrink-0 border-l border-stone-border/60 p-5 flex flex-col gap-5 overflow-y-auto bg-cream-2/20">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-ink-3 mb-1.5">Speaker</label>
                  <input
                    value={data[`${key}Speaker`] ?? ''}
                    onChange={e => update(`${key}Speaker`, e.target.value)}
                    placeholder="Narrator, JR…"
                    className="w-full text-sm font-sans text-ink bg-white border border-stone-border rounded-md px-2.5 py-1.5 focus:outline-none focus:border-terra/50 transition-colors"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-[10px] uppercase tracking-widest text-ink-3 mb-1.5">Notes</label>
                  <textarea
                    value={data[`${key}Notes`] ?? ''}
                    onChange={e => update(`${key}Notes`, e.target.value)}
                    placeholder="Movement instruction, production notes…"
                    rows={6}
                    className="w-full text-xs font-sans text-ink-2 bg-white border border-stone-border rounded-md px-2.5 py-1.5 focus:outline-none focus:border-terra/50 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Word count for this phase */}
                {wordCount(data[`${key}Text`]) > 0 && (
                  <div className="bg-cream rounded-lg p-3 text-center">
                    <div className="font-serif text-2xl font-light text-ink">
                      {wordCount(data[`${key}Text`])}
                    </div>
                    <div className="text-[10px] font-sans text-ink-3 uppercase tracking-wider mt-0.5">words</div>
                    <div className="text-[10px] font-sans text-ink-3 mt-1">
                      ~{estimateMinutes(data[`${key}Text`])} min audio
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
