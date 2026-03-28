// src/app/walks/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import MetaPanel from '@/components/MetaPanel'
import ScriptEditor from '@/components/ScriptEditor'
import StatusBadge from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function WalkDetailPage({ params }: { params: { id: string } }) {
  const walk = await db.walk.findUnique({
    where: { id: params.id },
    include: { script: true },
  })

  if (!walk) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="ml-14 flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-5 py-3 border-b border-stone-border bg-white/80 backdrop-blur-sm flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-ink-3 hover:text-ink text-sm font-sans transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Walks</span>
          </Link>
          <div className="w-px h-4 bg-stone-border" />
          <span className="font-serif text-lg font-light text-ink truncate">{walk.title}</span>
          <StatusBadge status={walk.status} className="ml-1" />
          {walk.district && (
            <span className="text-[11px] font-sans text-ink-3 ml-auto hidden sm:block">{walk.district}</span>
          )}
        </header>

        {/* Split layout */}
        <div className="flex flex-1 overflow-hidden">
          <MetaPanel walk={walk} />
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScriptEditor walkId={walk.id} script={walk.script} />
          </div>
        </div>
      </div>
    </div>
  )
}
