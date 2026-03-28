// src/lib/types.ts
export type WalkStatus = 'idea' | 'en-desarrollo' | 'grabado' | 'editado' | 'publicado'

export const STATUSES: { value: WalkStatus; label: string; color: string }[] = [
  { value: 'idea',         label: 'Idea',         color: 'bg-stone-100 text-stone-600' },
  { value: 'en-desarrollo',label: 'En desarrollo', color: 'bg-blue-50 text-blue-700' },
  { value: 'grabado',      label: 'Grabado',       color: 'bg-amber-50 text-amber-700' },
  { value: 'editado',      label: 'Editado',       color: 'bg-violet-50 text-violet-700' },
  { value: 'publicado',    label: 'Publicado',     color: 'bg-emerald-50 text-emerald-700' },
]

export const SCRIPT_PHASES = [
  {
    key: 'arrival',
    label: 'Arrival',
    number: '01',
    description: 'Sitúa al oyente en el espacio. Dónde está, qué ve antes de que le cuentes nada.',
  },
  {
    key: 'observation',
    label: 'Observation',
    number: '02',
    description: 'Enséñale a mirar. Un detalle concreto que cambia lo que hay delante.',
  },
  {
    key: 'discovery',
    label: 'Discovery',
    number: '03',
    description: 'Revela algo oculto o ignorado. La capa bajo la superficie.',
  },
  {
    key: 'expansion',
    label: 'Expansion',
    number: '04',
    description: 'Conecta con el contexto más amplio. Historia, cultura, poder.',
  },
  {
    key: 'reframing',
    label: 'Reframing',
    number: '05',
    description: 'Transforma la percepción. El oyente sale viendo el lugar de forma diferente.',
  },
] as const

export type ScriptPhaseKey = typeof SCRIPT_PHASES[number]['key']

export function getStatus(value: string) {
  return STATUSES.find(s => s.value === value) ?? STATUSES[0]
}

export function wordCount(text: string | null | undefined): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function estimateMinutes(text: string | null | undefined): number {
  return Math.round(wordCount(text) / 150)
}
