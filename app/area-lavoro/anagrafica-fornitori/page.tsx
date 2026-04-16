import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import AnagraficaForniClient, { type Fornitore } from './client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anagrafica Fornitori',
}

async function getFornitori(): Promise<Fornitore[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS fornitori (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        ragione_sociale  VARCHAR(255) NOT NULL,
        indirizzo        VARCHAR(255) NOT NULL DEFAULT '',
        telefono         VARCHAR(50)  NOT NULL DEFAULT '',
        email            VARCHAR(150) NOT NULL DEFAULT '',
        pec              VARCHAR(150) NOT NULL DEFAULT '',
        created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.execute(
      'SELECT id,ragione_sociale,indirizzo,telefono,email,pec,created_at FROM fornitori ORDER BY ragione_sociale ASC'
    ) as [Fornitore[], unknown]
    return rows
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 24, settings)) redirect('/')

  const fornitori = await getFornitori()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Anagrafica Fornitori</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Elenco fornitori — clicca Modifica per aggiornare i dati</p>
      </div>
      <AnagraficaForniClient fornitori={fornitori} role={role} />
    </div>
  )
}
