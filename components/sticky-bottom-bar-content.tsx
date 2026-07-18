'use client'

import { useStickyBottomBarContent } from '@/lib/sticky-bottom-bar-context'

/**
 * Mette il contenuto passato dentro la barra fissa in fondo allo schermo.
 * Usalo in qualsiasi pagina, dove vuoi nel suo JSX — non serve altro:
 *
 *   <StickyBottomBarContent>
 *     <Link href="/qualcosa">Testo del link</Link>
 *   </StickyBottomBarContent>
 *
 * Se una pagina non lo usa, per quella pagina la barra resta nascosta.
 */
export default function StickyBottomBarContent({ children }: { children: React.ReactNode }) {
  useStickyBottomBarContent(children)
  return null
}
