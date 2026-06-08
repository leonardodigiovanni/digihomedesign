'use client'

import { useState } from 'react'
import { updateVisibileDocumento } from './actions'

export function VisibileCheckbox({ docId, visibile }: { docId: number; visibile: boolean }) {
  const [checked, setChecked] = useState(visibile)
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.checked
    setChecked(val)
    setSaving(true)
    await updateVisibileDocumento(docId, val)
    setSaving(false)
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      disabled={saving}
      style={{ width: 16, height: 16, cursor: saving ? 'wait' : 'pointer', accentColor: '#276749' }}
    />
  )
}
