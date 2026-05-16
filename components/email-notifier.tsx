'use client'

import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'email_unread_count'

export default function EmailNotifier() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/horse.mp3')
    audioRef.current.preload = 'auto'
  }, [])

  useEffect(() => {
    async function check() {
      try {
        const res  = await fetch('/api/email/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        const stored = parseInt(sessionStorage.getItem(STORAGE_KEY) ?? '-1', 10)
        if (stored >= 0 && data.count > stored) {
          audioRef.current?.play().catch(() => {})
        }
        sessionStorage.setItem(STORAGE_KEY, String(data.count))
      } catch {}
    }

    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  return null
}
