'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type Request = { id: string; token: number } | null

type Ctx = {
  request: Request
  requestOpen: (id: string) => void
  consume: () => void
}

const NavDropdownContext = createContext<Ctx | null>(null)

/**
 * Permette a un bottone in qualsiasi pagina di aprire una tendina della navbar
 * (es. lo sticky "vai" esterno di fine sezione che apre la tendina della
 * sezione successiva). La navbar è dentro #site-sticky-header, sempre visibile
 * (position:sticky), quindi basta aprire la tendina — non serve navigare.
 *
 * Passiamo solo l'id, non le coordinate del bottone: la posizione viene
 * ricalcolata "fresca" leggendo il bottone dal DOM (via data-nav-dropdown-trigger)
 * nel momento in cui la tendina si apre, per evitare coordinate stale.
 */
export function NavDropdownProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<Request>(null)
  const requestOpen = useCallback((id: string) => setRequest({ id, token: Date.now() }), [])
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
