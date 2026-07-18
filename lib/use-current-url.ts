'use client'

import { usePathname, useSearchParams } from 'next/navigation'

/**
 * Path + query string della pagina corrente (es. "/area-clienti/cantieri?cantiere=42").
 * Necessario per le pagine che usano un query param per indicare "quale elemento" si
 * sta guardando (es. cantieri, dove ?cantiere=X seleziona il cantiere) — usare solo
 * usePathname() le renderebbe tutte indistinguibili (stesso path per 1000 cantieri).
 */
export function useCurrentUrl(): string {
  const pathname = usePathname()
  const qs = useSearchParams().toString()
  return qs ? `${pathname}?${qs}` : pathname
}
