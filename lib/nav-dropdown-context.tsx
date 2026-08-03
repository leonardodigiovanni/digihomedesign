'use client'

import { createContext, useCallback, useContext, useState } from 'react'

export type AnchorRect = { left: number; top: number; width: number }

type Request = { id: string; token: number; anchorRect: AnchorRect | null } | null

type Ctx = {
  request: Request
  requestOpen: (id: string, anchorRect?: AnchorRect) => void
  consume: () => void
}

const NavDropdownContext = createContext<Ctx | null>(null)

/**
 * Permette a un bottone in qualsiasi pagina di aprire una tendina della navbar
 * (es. lo sticky "vai" esterno di fine sezione che apre la tendina della
 * sezione successiva). La navbar è dentro #site-sticky-header, sempre visibile
 * (position:sticky), quindi basta aprire la tendina — non serve navigare.
 *
 * anchorRect: se il trigger è lo sticky bottom bar (lontano dalla navbar in
 * alto), la tendina si ancora lì invece che al link nella navbar, e si
 * sviluppa verso l'alto — come se lo sticky fosse una navbar sottostante.
 */
export function NavDropdownProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<Request>(null)
  const requestOpen = useCallback((id: string, anchorRect?: AnchorRect) => {
    setRequest({ id, token: Date.now(), anchorRect: anchorRect ?? null })
  }, [])
  const consume = useCallback(() => setRequest(null), [])
  return (
    <NavDropdownContext.Provider value={{ request, requestOpen, consume }}>
      {children}
    </NavDropdownContext.Provider>
  )
}

export function useNavDropdownRequest() {
  const ctx = useContext(NavDropdownContext)
  if (!ctx) throw new Error('useNavDropdownRequest deve essere usato dentro NavDropdownProvider')
  return ctx
}
