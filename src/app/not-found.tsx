// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-6xl font-light text-ink-3 mb-4">404</p>
        <p className="text-sm font-sans text-ink-3 mb-6">Walk not found.</p>
        <Link href="/" className="text-sm font-sans text-terra hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
