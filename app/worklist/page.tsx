import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { getConnection } from '@/lib/db'
import WorklistClient, { type Compito, type Utente } from './worklist-client'

const GESTORI = ['admin', 'direttore']

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  return String(d)
}

async function getData(role: string, username: string) {
  const db = await getConnection()

  await db.execute(`
    CREATE TABLE IF NOT EXISTS worklist (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      titolo        VARCHAR(200) NOT NULL,
      descrizione   TEXT NULL,
      assegnato_a   VARCHAR(100) NOT NULL,
      creato_da     VARCHAR(100) NOT NULL,
      priorita      ENUM('bassa','normale','alta','urgente') NOT NULL DEFAULT 'normale',
      stato         ENUM('da_fare','in_corso','completato') NOT NULL DEFAULT 'da_fare',
      data_scadenza DATE NULL,
      created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const isGestore = GESTORI.includes(role)

  // Compiti: gestore vede tutto, dipendente solo i suoi
  let compitiRows: Record<string, unknown>[]
  if (isGestore) {
    const [rows] = await db.query(`
      SELECT w.*,
        COALESCE(CONCAT(u.nome, ' ', u.cognome), w.assegnato_a) AS assegnato_nome
      FROM worklist w
      LEFT JOIN users u ON u.username = w.assegnato_a
      ORDER BY
        FIELD(w.priorita,'urgente','alta','normale','bassa'),
        FIELD(w.stato,'da_fare','in_corso','completato'),
        w.data_scadenza ASC
    `)
    compitiRows = rows as Record<string, unknown>[]
  } else {
    const [rows] = await db.query(`
      SELECT w.*,
        COALESCE(CONCAT(u.nome, ' ', u.cognome), w.assegnato_a) AS assegnato_nome
      FROM worklist w
      LEFT JOIN users u ON u.username = w.assegnato_a
      WHERE w.assegnato_a = ?
      ORDER BY
        FIELD(w.priorita,'urgente','alta','normale','bassa'),
        FIELD(w.stato,'da_fare','in_corso','completato'),
        w.data_scadenza ASC
    `, [username])
    compitiRows = rows as Record<string, unknown>[]
  }

  const compiti: Compito[] = compitiRows.map(r => ({
    ...r,
    data_scadenza: dateToStr(r.data_scadenza),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
  })) as Compito[]

  // Lista utenti assegnabili (solo per gestori): tutti gli attivi non-cliente
  let utenti: Utente[] = []
  if (isGestore) {
    const [uRows] = await db.query(
      `SELECT username, nome, cognome, role FROM users
       WHERE is_active = 1 AND role != 'cliente'
       ORDER BY cognome ASC, nome ASC`
    )
    utenti = uRows as Utente[]
  }

  await db.end()
  return { compiti, utenti, isGestore }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  if (!role) redirect('/')
  const settings = readSettings()
  if (!hasPageAccess(role, 27, settings)) redirect('/')

  const { compiti, utenti, isGestore } = await getData(role, username)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Worklist</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        {isGestore
          ? 'Tutti i compiti — crea, assegna, monitora.'
          : 'I compiti assegnati a te.'}
      </p>
      <WorklistClient
        compiti={compiti} utenti={utenti}
        isGestore={isGestore} currentUser={username}
      />
    </div>
  )
}
