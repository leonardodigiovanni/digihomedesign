import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import AnagraficaClientiClient, { type Cliente } from './client'

async function getClienti(): Promise<Cliente[]> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS clienti (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        tipo             ENUM('fisica','giuridica') NOT NULL DEFAULT 'fisica',
        nome             VARCHAR(100) NOT NULL DEFAULT '',
        cognome          VARCHAR(100) NOT NULL DEFAULT '',
        ragione_sociale  VARCHAR(255) NOT NULL DEFAULT '',
        indirizzo        VARCHAR(255) NOT NULL DEFAULT '',
        telefono         VARCHAR(50)  NOT NULL DEFAULT '',
        email            VARCHAR(150) NOT NULL DEFAULT '',
        pec              VARCHAR(150) NOT NULL DEFAULT '',
        codice_sdi       VARCHAR(7)   NOT NULL DEFAULT '',
        codice_fiscale   VARCHAR(16)  NOT NULL DEFAULT '',
        partita_iva      VARCHAR(11)  NOT NULL DEFAULT '',
        created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    // Migrate existing table: add codice_fiscale if missing
    const [cfCols] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'clienti' AND COLUMN_NAME = 'codice_fiscale'`
    ) as [{ COLUMN_NAME: string }[], unknown]
    if (cfCols.length === 0) {
      await conn.execute(`ALTER TABLE clienti ADD COLUMN codice_fiscale VARCHAR(16) NOT NULL DEFAULT ''`)
      await conn.execute(`ALTER TABLE clienti ADD COLUMN partita_iva VARCHAR(11) NOT NULL DEFAULT ''`)
    }

    const [rows] = await conn.execute(
      `SELECT id,tipo,nome,cognome,ragione_sociale,indirizzo,telefono,email,pec,codice_sdi,codice_fiscale,partita_iva,created_at
       FROM clienti ORDER BY ragione_sociale ASC, cognome ASC, nome ASC`
    ) as [Cliente[], unknown]
    return rows
  } finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = readSettings()
  if (!hasPageAccess(role, 21, settings)) redirect('/')

  const clienti = await getClienti()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Anagrafica Clienti</h2>
        <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>Elenco clienti — persone fisiche e giuridiche</p>
      </div>
      <AnagraficaClientiClient clienti={clienti} role={role} />
    </div>
  )
}
