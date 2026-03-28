// src/components/StatusBadge.tsx
import { cn } from '@/lib/utils'
import { getStatus } from '@/lib/types'

export default function StatusBadge({ status, className }: { status: string; className?: string }) {
  const s = getStatus(status)
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans font-medium tracking-wide', s.color, className)}>
      {s.label}
    </span>
  )
}
