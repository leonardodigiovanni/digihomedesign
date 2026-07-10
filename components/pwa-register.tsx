'use client'

import { useEffect } from 'react'

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      } catch {}
    }
  }, [])
  return null
}
