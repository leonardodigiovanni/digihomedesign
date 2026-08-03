'use client'

import { useNavDropdownRequest } from '@/lib/nav-dropdown-context'

export default function NavDropdownTriggerButton({ dropdownId, label }: { dropdownId: string; label: string }) {
  const { requestOpen } = useNavDropdownRequest()
  return (
    <button
      type="button"
      data-nav-dropdown-trigger={dropdownId}
      onClick={() => requestOpen(dropdownId)}
      className="btn-gold fs-12"
    >
      {label}
    </button>
  )
}
