'use client'

import { useState } from 'react'
import { updateClienteDocumento } from './actions'

type ClienteOption = { id: number; label: string }

export function ClienteSelect({ docId, clienteId, clienti }: {
  docId: number
  clienteId: number | null
  clienti: ClienteOption[]
}) {
  const [saving, setSaving] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setSaving(true)
    await updateClienteDocumento(docId, val ? Number(val) : null)
    setSaving(false)
  }

  return (
    <select
      defaultValue={clienteId ?? ''}
      onChange={handleChange}
      disabled={saving}
      style={{
        border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px',
        fontSize: 13, background: saving ? '#f5f5f5' : '#fff',
        cursor: saving ? 'wait' : 'pointer', minWidth: 140,
      }}
    >
      <option value="">— nessuno —</option>
      {clienti.map(c => (
        <option key={c.id} value={c.id}>{c.label}</option>
      ))}
    </select>
  )
}
