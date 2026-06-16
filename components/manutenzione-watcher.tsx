'use client'

import { useEffect, useRef } from 'react'

export default function ManutenzioneWatcher({ manutenzione: initial, role }: { manutenzione: boolean; role: string }) {
  const lastSeen = useRef(initial)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/manutenzione/status', { cache: 'no-store' })
        const { manutenzione } = await res.json() as { manutenzione: boolean }

        // Manutenzione appena attivata → forza logout e redirect a home
        if (manutenzione && role && role !== 'admin') {
          window.location.href = '/'
          return
        }

        // Manutenzione appena disattivata → ricarica per tornare al sito normale
        if (!manutenzione && lastSeen.current) {
          window.location.reload()
          return
        }

        lastSeen.current = manutenzione
      } catch {}
    }

    const id = setInterval(check, 15_000)
    return () => clearInterval(id)
  }, [role])

  return null
}
