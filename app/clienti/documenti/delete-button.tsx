'use client'

import { deleteDocumento } from './actions'

export function DeleteDocumentoButton({ id, filename, titolo }: { id: number; filename: string; titolo: string }) {
  async function handleDelete() {
    if (!confirm(`Eliminare il documento "${titolo}"?`)) return
    await deleteDocumento(id, filename)
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="btn-red"
      style={{ padding: '5px 14px', fontSize: 12, fontWeight: 600, borderRadius: 5, border: 'none', cursor: 'pointer' }}
    >
      Elimina
    </button>
  )
}
