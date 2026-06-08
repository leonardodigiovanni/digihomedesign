'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoRefresh({ isStaff }: { isStaff: boolean }) {
  const router   = useRouter()
  const hashRef  = useRef<string | null>(null)

  useEffect(() => {
    async function check() {
      try {
        if (isStaff) {
          const res  = await fetch('/api/avvisi/updates', { cache: 'no-store' })
          const data = await res.json() as { hash: string }
          if (hashRef.current !== null && data.hash !== hashRef.current) router.refresh()
          hashRef.current = data.hash
        } else {
          const res  = await fetch('/api/avvisi/unread', { cache: 'no-store' })
          const data = await res.json() as { count: number }
          const hash = String(data.count)
          if (hashRef.current !== null && hash !== hashRef.current) router.refresh()
          hashRef.current = hash
        }
      } catch {}
    }
    check()
    const id = setInterval(check, 15_000)
    function onCountChanged() { router.refresh() }
    window.addEventListener('avvisi-count-changed', onCountChanged)
    return () => { clearInterval(id); window.removeEventListener('avvisi-count-changed', onCountChanged) }
  }, [router, isStaff])

  return null
}
