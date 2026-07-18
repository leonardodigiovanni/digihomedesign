'use client'

import { useHomeShortcuts } from '@/lib/home-shortcuts-context'
import { isExcludedFromShortcuts } from '@/lib/shortcut-exclusions'
import { useCurrentUrl } from '@/lib/use-current-url'

type Props = {
  /** Pagina da controllare — di default quella corrente (breadcrumb). Passa un href esplicito per le voci di menu/nav. */
  href?: string
  /** Versione compatta per le liste di nav (font più piccolo, meno margine). */
  small?: boolean
  /** Solo contorno nero (☆) invece di oro pieno — per le voci su sfondo gold della nav, dove una stella oro sparirebbe. */
  outline?: boolean
}

/** Stellina accanto a un link/breadcrumb se quella pagina è già una scorciatoia salvata. */
export default function ShortcutStar({ href, small, outline }: Props) {
  const currentUrl = useCurrentUrl()
  const { isShortcut } = useHomeShortcuts()
  const target = href ?? currentUrl
  if (isExcludedFromShortcuts(target) || !isShortcut(target)) return null
  return (
    <span
      title="Pagina tra le tue scorciatoie"
      style={{
        color: outline ? '#000' : '#c8960c',
        fontSize: small ? 11 : undefined,
        verticalAlign: small ? 'middle' : undefined,
        flexShrink: 0,
      }}
    >
      {outline ? '☆' : '★'}
    </span>
  )
}
