// src/app/settings/page.tsx
import Sidebar from '@/components/Sidebar'

export default function SettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="ml-14 flex-1 overflow-y-auto p-7">
        <h1 className="font-serif text-3xl font-light text-ink mb-2">Settings</h1>
        <p className="text-ink-3 text-sm font-sans">Configuration coming soon.</p>
      </main>
    </div>
  )
}
