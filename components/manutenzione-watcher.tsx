'use client'

import { useEffect, useRef } from 'react'

export default function ManutenzioneWatcher({ manutenzione: initial, role, username = '', dest = '/' }: { manutenzione: boolean; role: string; username?: string; dest?: string }) {
  const lastSeen = useRef(initial)
  const bypass = role === 'cliente' && username === 'Diggio83'

  useEffect(() => {
    if (bypass) return

    const check = async () => {
      try {
        const res = await fetch('/api/manutenzione/status', { cache: 'no-store' })
        const { manutenzione } = await res.json() as { manutenzione: boolean }

        // Manutenzione appena attivata → logout via route handler (cancella cookie) poi home
        if (manutenzione && role && role !== 'admin') {
          window.location.href = `/api/manutenzione/logout?dest=${encodeURIComponent(dest)}`
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
  }, [role, bypass, dest])

  return null
}
