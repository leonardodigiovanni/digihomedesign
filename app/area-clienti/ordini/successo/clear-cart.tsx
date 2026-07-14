'use client'

import { useEffect } from 'react'
import { svuotaCarrelloAcquisti } from '@/app/area-clienti/carrello-acquisti/checkout-action'

export default function ClearCart() {
  useEffect(() => {
    svuotaCarrelloAcquisti().catch(() => {})
  }, [])
  return null
}
