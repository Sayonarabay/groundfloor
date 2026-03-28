// src/app/page.tsx
import { db } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import KanbanBoard from '@/components/KanbanBoard'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const walks = await db.walk.findMany({
    include: { script: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="ml-14 flex-1 overflow-y-auto p-7">
        <KanbanBoard initialWalks={walks} />
      </main>
    </div>
  )
}
