'use client'

import { useActionState, useState, useEffect } from 'react'
import { uploadDocumento } from './actions'
import { b } from '@/lib/btn'
import SelectLookup from '@/components/select-lookup'

type ClienteOption = { id: number; label: string }

const inputStyle: React.CSSProperties = {
  border: '1px solid #ddd', borderRadius: 6, padding: '7px 10px',
  fontSize: 13, background: '#fff', width: '100%', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#666', textTransform: 'uppercase',
  letterSpacing: '0.05em', display: 'block', marginBottom: 4,
}

export function UploadDocumentoForm({ clienti, isApp }: { clienti: ClienteOption[]; isApp?: boolean }) {
  const [state, action, pending] = useActionState(uploadDocumento, {})
  const [resetKey, setResetKey] = useState(0)
  const [clienteIdSel, setClienteIdSel] = useState('')

  useEffect(() => {
    if (!pending && !state?.error) { setResetKey(k => k + 1); setClienteIdSel('') }
  }, [pending, state])

  return (
    <form
      key={resetKey}
      action={action}
      style={{
        background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 10,
        padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: '#222' }}>Carica nuovo documento</div>

      {state?.error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 6, padding: '8px 12px', fontSize: 13, color: '#c00' }}>
          {state.error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        <div>
          <label style={labelStyle}>Cliente</label>
          <SelectLookup name="cliente_id" value={clienteIdSel} onChange={setClienteIdSel}
            options={[{ value: '', label: '— nessuno —' }, ...clienti.map(c => ({ value: String(c.id), label: c.label }))]}
            style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Titolo *</label>
          <input name="titolo" required style={inputStyle} placeholder="Es. Contratto 2026" />
        </div>
        <div>
          <label style={labelStyle}>Tipo</label>
          <input name="tipo" style={inputStyle} placeholder="fattura / contratto / altro" />
        </div>
        <div>
          <label style={labelStyle}>Note</label>
          <input name="note" style={inputStyle} placeholder="Opzionale" />
        </div>
        <div>
          <label style={labelStyle}>File *</label>
          <input name="file" type="file" required style={{ ...inputStyle, padding: '5px 10px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" name="visibile_cliente" value="1" defaultChecked style={{ width: 15, height: 15 }} />
            Visibile al cliente
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className={b('btn-green', isApp)}
          style={{ padding: '9px 28px', fontSize: 13, fontWeight: 600, borderRadius: 6, border: 'none', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.6 : 1 }}
        >
          {pending ? 'Caricamento…' : 'Carica'}
        </button>
      </div>
    </form>
  )
}
