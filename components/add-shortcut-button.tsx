'use client'

import { useHomeShortcuts } from '@/lib/home-shortcuts-context'

/**
 * Bottone da mettere manualmente dentro <StickyBottomBarContent> di una
 * pagina, per farla proporre come scorciatoia nella home (localStorage se
 * sloggato, localStorage+DB se loggato). Non si auto-registra da nessuna
 * parte: va aggiunto pagina per pagina su richiesta esplicita.
 *
 * Se la scorciatoia è già presente, il bottone sparisce del tutto — non
 * diventa un bottone "rimuovi": la rimozione avviene solo dalla ✕ in home
 * (HomeShortcutsContent), mai da qui.
 */
export default function AddShortcutButton({ href, label }: { href: string; label: string }) {
  const { isShortcut, add } = useHomeShortcuts()

  if (isShortcut(href)) return null

  return (
    <button
      type="button"
      className="btn-green fs-12"
      onClick={() => add(href, label)}
    >
      Aggiungi scorciatoia nella home
    </button>
  )
}
