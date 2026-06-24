'use client'

import { useState } from 'react'
import { updateClienteDocumento } from './actions'
import SelectLookup from '@/components/select-lookup'

type ClienteOption = { id: number; label: string }

export function ClienteSelect({ docId, clienteId, clienti }: {
  docId: number
  clienteId: number | null
  clienti: ClienteOption[]
}) {
  const [saving, setSaving] = useState(false)
  const [selValue, setSelValue] = useState(String(clienteId ?? ''))

  async function handleChange(val: string) {
    setSelValue(val)
    setSaving(true)
    await updateClienteDocumento(docId, val ? Number(val) : null)
    setSaving(false)
  }

  return (
    <SelectLookup
      value={selValue}
      onChange={handleChange}
      disabled={saving}
      options={[{ value: '', label: '— nessuno —' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}
      style={{
        border: '1px solid #ddd', borderRadius: 5, padding: '4px 8px',
        fontSize: 13, cursor: saving ? 'wait' : 'pointer', minWidth: 140,
      }}
    />
  )
}
