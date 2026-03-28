// src/app/calendar/page.tsx
import { db } from '@/lib/db'
import Sidebar from '@/components/Sidebar'
import CalendarView from '@/components/CalendarView'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const walks = await db.walk.findMany({
    where: {
      OR: [
        { recordingDate: { not: null } },
        { publishDate: { not: null } },
      ],
    },
    orderBy: { recordingDate: 'asc' },
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="ml-14 flex-1 overflow-y-auto p-7">
        <CalendarView walks={walks} />
      </main>
    </div>
  )
}
