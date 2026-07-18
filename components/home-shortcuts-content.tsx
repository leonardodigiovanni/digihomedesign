'use client'

import Link from 'next/link'
import { useHomeShortcuts } from '@/lib/home-shortcuts-context'
import { useStickyBottomBarContent } from '@/lib/sticky-bottom-bar-context'
import { isHrefAccessible } from '@/lib/nav-config'

type Props = {
  children?: React.ReactNode
  role: string | null
  rolePermissions: Record<string, number[]>
  disabledPages: number[]
}

/**
 * Solo per la home. `children` (opzionale) sono gli elementi fissi messi dal
 * proprietario del sito — vengono mostrati per primi (a sinistra). Subito
 * dopo (a destra) vengono lette le scorciatoie salvate dall'utente (via
 * HomeShortcutsProvider — localStorage se sloggato, localStorage+DB se
 * loggato), ciascuna con una ✕ per rimuoverla. Se non c'è né contenuto fisso
 * né alcuna scorciatoia, non registra nulla — barra invisibile. Le
 * scorciatoie verso pagine protette non accessibili al profilo corrente
 * (sloggato, o loggato ma senza i permessi) restano salvate ma non vengono
 * mostrate finché non tornano accessibili.
 */
export default function HomeShortcutsContent({ children, role, rolePermissions, disabledPages }: Props) {
  const { shortcuts, remove } = useHomeShortcuts()
  const visibleShortcuts = shortcuts.filter(s => isHrefAccessible(s.href, role, rolePermissions, disabledPages))

  const hasFixed = children != null
  const hasAny = hasFixed || visibleShortcuts.length > 0

  useStickyBottomBarContent(
    hasAny ? (
      <>
        {children}
        {visibleShortcuts.map(s => (
          <div key={s.href} style={{ position: 'relative' }}>
            <Link href={s.href} className="btn-black fs-12">{s.label}</Link>
            <button
              type="button"
              onClick={() => remove(s.href)}
              title={`Rimuovi scorciatoia ${s.label}`}
              style={{
                position: 'absolute', top: -6, right: -6,
                width: 18, height: 18, padding: 0, lineHeight: 1, fontSize: 11, fontWeight: 700,
                background: 'rgba(180,30,30,0.85)', color: '#fff', border: 'none',
                borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </>
    ) : null
  )

  return null
}
