'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toggleBanner, toggleBannerCircolare, saveBannerTesto, type SaveAccessResult } from './actions'

interface BannerPanelProps {
  abilitato: boolean
  circolare: boolean
  testo: string
}

export default function BannerPanel({ abilitato, circolare, testo }: BannerPanelProps) {
  const router = useRouter()
  const [toggleResult,     toggleAction,     togglePending]     = useActionState<SaveAccessResult | null, FormData>(toggleBanner,          null)
  const [circResult,       circAction,       circPending]       = useActionState<SaveAccessResult | null, FormData>(toggleBannerCircolare, null)
  const [saveResult,       saveAction,       savePending]       = useActionState<SaveAccessResult | null, FormData>(saveBannerTesto,        null)
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    if (toggleResult?.ok || circResult?.ok || saveResult?.ok) router.refresh()
    if (saveResult?.ok) setChanged(false)
  }, [toggleResult, circResult, saveResult])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 10,
      padding: '24px 28px 28px',
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 16px' }}>Banner scorrevole</h3>

      {/* Toggle ON/OFF + Circolare */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <form action={toggleAction}>
          <button type="submit" disabled={togglePending}
            className={togglePending ? 'btn-gray' : abilitato ? 'btn-red' : 'btn-green'}
            style={{ padding: '8px 20px', fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {togglePending ? '…' : abilitato ? 'Disabilita' : 'Abilita'}
          </button>
        </form>
        <form action={circAction}>
          <button type="submit" disabled={circPending}
            className={circPending ? 'btn-gray' : circolare ? 'btn-green' : 'btn-gray'}
            style={{ padding: '8px 20px', fontSize: 13, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {circPending ? '…' : circolare ? '⟳ Circolare ON' : '⟳ Circolare OFF'}
          </button>
        </form>
      </div>

      {/* Testo */}
      <form key={testo} action={saveAction} onReset={() => setChanged(false)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <textarea
          name="bannerTesto"
          defaultValue={testo}
          rows={2}
          onChange={e => setChanged(e.target.value !== testo)}
          style={{ padding: '8px 10px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, fontFamily: 'inherit', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={!changed || savePending}
            className={changed && !savePending ? 'btn-green' : 'btn-gray'}
            style={{ padding: '8px 20px', fontSize: 13, borderRadius: 7, fontFamily: 'inherit' }}>
            {savePending ? '…' : '✓ Salva testo'}
          </button>
          <button type="reset" disabled={!changed || savePending}
            className={changed && !savePending ? 'btn-red' : 'btn-gray'}
            style={{ padding: '8px 20px', fontSize: 13, borderRadius: 7, fontFamily: 'inherit' }}>
            Annulla
          </button>
        </div>
      </form>
    </div>
  )
}
