// src/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Calendar, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',          label: 'Walks',    icon: LayoutGrid },
  { href: '/calendar',  label: 'Calendar', icon: Calendar },
  { href: '/settings',  label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-14 bg-ink flex flex-col items-center py-5 z-50">
      {/* Logo mark */}
      <div className="mb-8">
        <div className="w-7 h-7 rounded-sm bg-terra flex items-center justify-content-center">
          <span className="font-serif text-white text-sm font-medium leading-none flex items-center justify-center w-full h-full">G</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' || pathname.startsWith('/walks') : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'w-9 h-9 rounded-md flex items-center justify-center transition-colors',
                active
                  ? 'bg-terra text-white'
                  : 'text-ink-3 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon size={16} />
            </Link>
          )
        })}
      </nav>

      <div className="text-ink-3 text-[9px] font-sans opacity-40 leading-tight text-center">
        GF<br />26
      </div>
    </aside>
  )
}
