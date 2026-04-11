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
      background: manutenzione ? '#fff8f0' : '#fff',
      border: `2px solid ${manutenzione ? '#e07020' : '#e0e0e0'}`,
      borderRadius: 10,
      padding: '20px 28px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 20,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/images/manutenzione.png" alt="Manutenzione" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            Modalità manutenzione
          </h3>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 10,
            background: manutenzione ? '#e07020' : '#e0e0e0',
            color: manutenzione ? '#fff' : '#888',
          }}>
            {manutenzione ? 'ATTIVA' : 'DISATTIVA'}
          </span>
        </div>
        <p style={{ margin: '6px 0 0 32px', fontSize: 13, color: '#666', lineHeight: 1.5 }}>
          {manutenzione
            ? 'Il sito mostra solo la pagina di manutenzione. Solo l\'admin può accedere.'
            : 'Il sito è operativo normalmente per tutti gli utenti.'}
        </p>
      </div>
      <form action={action}>
        <button type="submit" disabled={pending}
          className={pending ? 'btn-gray' : manutenzione ? 'btn-green' : 'btn-orange'}
          style={{ padding: '10px 22px', fontSize: 14, borderRadius: 7, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          {pending ? '…' : manutenzione ? '✓ Ripristina sito' : 'Attiva manutenzione'}
        </button>
      </form>
    </div>
  )
}
