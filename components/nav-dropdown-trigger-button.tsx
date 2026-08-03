'use client'

import { useNavDropdownRequest } from '@/lib/nav-dropdown-context'
import { BAR_HEIGHT, BAR_HEIGHT_NARROW, NARROW_BREAKPOINT, GAP_HEIGHT } from '@/components/sticky-bottom-bar'

export default function NavDropdownTriggerButton({ dropdownId, label }: { dropdownId: string; label: string }) {
  const { requestOpen } = useNavDropdownRequest()
  return (
    <button
      type="button"
      data-nav-dropdown-trigger={dropdownId}
      onClick={e => {
        const r = e.currentTarget.getBoundingClientRect()
        const isNarrow = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT}px)`).matches
        const barHeight = isNarrow ? BAR_HEIGHT_NARROW : BAR_HEIGHT
        // Ancora sopra la striscia bianca (non al bottone stesso), altrimenti
        // la striscia copre un pezzo del pannello aperto.
        const top = window.innerHeight - (barHeight + GAP_HEIGHT)
        requestOpen(dropdownId, { left: r.left, top, width: r.width })
      }}
      className="btn-gold fs-12"
    >
      {label}
    </button>
  )
}
