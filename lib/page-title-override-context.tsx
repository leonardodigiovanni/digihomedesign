'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Override = { url: string; title: string } | null

const SetterCtx = createContext<((o: Override) => void) | null>(null)
const ValueCtx = createContext<Override>(null)

export function PageTitleOverrideProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<Override>(null)
  return (
    <SetterCtx.Provider value={setOverride}>
      <ValueCtx.Provider value={override}>{children}</ValueCtx.Provider>
    </SetterCtx.Provider>
  )
}

/**
 * Registra un nome leggibile per l'URL corrente (es. il vero titolo di un
 * cantiere, non derivabile dalla sola query string ?cantiere=42) — usato al
 * posto del nome generico ovunque questa pagina venga proposta come
 * scorciatoia (doppio click, popup 2 minuti, etichetta "Vai a ..." in home).
 */
export function usePageTitleOverride(url: string, title: string | null | undefined) {
  const setOverride = useContext(SetterCtx)
  useEffect(() => {
    if (!title) return
    setOverride?.({ url, title })
    return () => setOverride?.(null)
  }, [url, title, setOverride])
}

/** Ritorna il nome registrato per url, solo se combacia esattamente con la pagina corrente. */
export function usePageTitleOverrideValue(url: string): string | null {
  const override = useContext(ValueCtx)
  return override && override.url === url ? override.title : null
}
