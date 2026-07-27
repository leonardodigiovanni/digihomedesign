'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import SelectLookup from '@/components/select-lookup'
import { associaClienteComputometrico } from './actions'

export type ClienteOption = { id: number; label: string }

export default function ClienteSelector({ computometrico_id, cliente_id, clienti }: {
  computometrico_id: number
  cliente_id: number | null
  clienti: ClienteOption[]
}) {
  const router = useRouter()
  const [pending, startT] = useTransition()
  const [sel, setSel] = useState(cliente_id?.toString() ?? '')

  function handleSave() {
    const fd = new FormData()
    fd.set('computometrico_id', String(computometrico_id))
    fd.set('cliente_id', sel)
    startT(async () => {
      await associaClienteComputometrico(null, fd)
      router.refresh()
    })
  }

  const dirty = sel !== (cliente_id?.toString() ?? '')

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 220 }}>
      <SelectLookup
        value={sel}
        onChange={setSel}
        options={[{ value: '', label: '— Nessun cliente —' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}
        placeholder="— Nessun cliente —"
        style={{ minWidth: 180, fontSize: 12 }}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={pending || !dirty}
        className="btn-black"
        style={{ padding: '0 12px', fontSize: 12, opacity: !dirty ? 0.4 : 1, whiteSpace: 'nowrap' }}
      >
        {pending ? '…' : 'Assegna'}
      </button>
    </div>
  )
}
