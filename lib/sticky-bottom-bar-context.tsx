'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

type SetContent = (content: React.ReactNode | null) => void

const SetterCtx = createContext<SetContent | null>(null)
const ContentCtx = createContext<React.ReactNode>(null)

export function StickyBottomBarProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null)
  return (
    <SetterCtx.Provider value={setContent}>
      <ContentCtx.Provider value={content}>
        {children}
      </ContentCtx.Provider>
    </SetterCtx.Provider>
  )
}

/**
 * Da chiamare in un client component dentro una pagina per mettere qualcosa
 * nella barra fissa in fondo allo schermo. Ogni pagina decide per conto suo:
 * se nessuna pagina montata chiama questo hook, la barra resta nascosta.
 * Il contenuto si ritira automaticamente quando il componente si smonta
 * (cambio pagina).
 */
export function useStickyBottomBarContent(content: React.ReactNode) {
  const setContent = useContext(SetterCtx)
  useEffect(() => {
    setContent?.(content)
    return () => setContent?.(null)
  }, [content, setContent])
}

/** Usato dalla barra stessa (nel layout radice) per leggere cosa mostrare. */
export function useStickyBottomBarValue(): React.ReactNode {
  return useContext(ContentCtx)
}
