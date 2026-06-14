'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ProfiloIncompletoPrompt({ profiloIncompleto }: { profiloIncompleto: boolean }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!profiloIncompleto) return
    if (pathname === '/app/completa-profilo') return
    const skipped = sessionStorage.getItem('profilo_completamento_skipped')
    if (!skipped) window.location.href = '/app/completa-profilo'
  }, [profiloIncompleto, pathname])

  return null
}
