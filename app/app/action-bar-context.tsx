'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Ctx = { set: (c: ReactNode) => void; content: ReactNode }

export const ActionBarCtx = createContext<Ctx>({ set: () => {}, content: null })

export function ActionBarProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null)
  const set = useCallback((c: ReactNode) => setContent(c), [])
  return <ActionBarCtx.Provider value={{ set, content }}>{children}</ActionBarCtx.Provider>
}
