'use client'

import { useContext, useEffect, ReactNode } from 'react'
import { ActionBarCtx } from './action-bar-context'

export default function SetActionBar({ children }: { children: ReactNode }) {
  const { set } = useContext(ActionBarCtx)
  useEffect(() => {
    set(children)
    return () => set(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
