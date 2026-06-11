'use client'

import { deleteDocumento } from './actions'
import { b } from '@/lib/btn'

export function DeleteDocumentoButton({ id, filename, titolo, isApp }: { id: number; filename: string; titolo: string; isApp?: boolean }) {
  async function handleDelete() {
    if (!confirm(`Eliminare il documento "${titolo}"?`)) return
    await deleteDocumento(id, filename)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={b('btn-red', isApp)}
      style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 5, border: 'none', cursor: 'pointer' }}
    >
      Elimina
    </button>
  )
}
