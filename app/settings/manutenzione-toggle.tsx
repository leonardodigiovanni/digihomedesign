'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toggleManutenzione, type SaveAccessResult } from './actions'

export default function ManutenzioneToggle({ manutenzione }: { manutenzione: boolean }) {
  const router = useRouter()
  const [result, action, pending] = useActionState<SaveAccessResult | null, FormData>(toggleManutenzione, null)
  useEffect(() => { if (result?.ok) router.refresh() }, [result])

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 10,
      padding: '24px 28px 28px',
      marginBottom: 32,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 12px' }}>
        Modalità manutenzione
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 10,
          background: manutenzione ? '#c04444' : '#e0e0e0',
          color: manutenzione ? '#fff' : '#888',
        }}>
          {manutenzione ? 'ATTIVA' : 'DISATTIVA'}
        </span>
        <form action={action}>
          <button type="submit" disabled={pending}
            className={pending ? 'btn-gray' : manutenzione ? 'btn-green' : 'btn-red'}
            style={{ padding: '8px 20px', fontSize: 13, borderRadius: 7, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {pending ? '…' : manutenzione ? '✓ Ripristina sito' : <><span style={{ verticalAlign: 'middle', lineHeight: 1, position: 'relative', top: '-3px' }}>⊘</span>{' Attiva manutenzione'}</>}
          </button>
        </form>
      </div>
    </div>
  )
}
