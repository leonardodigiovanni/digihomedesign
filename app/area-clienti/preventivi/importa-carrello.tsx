'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { importaCarrello } from '@/app/brand/cataloghi/actions'

export default function ImportaCarrello({ redirectTo }: { redirectTo?: string }) {
  const done = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (done.current) return
    done.current = true
    importaCarrello().then(() => {
      if (redirectTo) router.push(redirectTo)
      else router.refresh()
    })
  }, [router, redirectTo])

  return null
}
