import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import CantieriClient, { type Cantiere, type Lavoro, type Media, type Cliente } from './cantieri-client'

function dateToStr(d: unknown): string | null {
  if (!d) return null
  if (d instanceof Date) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }
  return String(d)
}

async function getData(role: string, username: string) {
  const db = await getConnection()

  // Crea tabelle se non esistono
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri (
      id INT AUTO_INCREMENT PRIMARY KEY, cliente_id INT NULL,
      titolo VARCHAR(200) NOT NULL, indirizzo VARCHAR(300) NOT NULL DEFAULT '',
      stato ENUM('preventivo','in_corso','completato','sospeso') NOT NULL DEFAULT 'preventivo',
      inizio_lavori DATE NULL, fine_lavori DATE NULL,
      note_pubbliche TEXT NULL, note_interne TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri_lavori (
      id INT AUTO_INCREMENT PRIMARY KEY, cantiere_id INT NOT NULL,
      descrizione VARCHAR(300) NOT NULL, qta DECIMAL(10,2) NOT NULL DEFAULT 1,
      unita VARCHAR(20) NOT NULL DEFAULT 'cad', prezzo_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
      sconto_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
      totale DECIMAL(10,2) GENERATED ALWAYS AS (qta * prezzo_unit * (1 - sconto_pct / 100)) STORED,
      visibile_cliente TINYINT(1) NOT NULL DEFAULT 1,
      FOREIGN KEY (cantiere_id) REFERENCES cantieri(id) ON DELETE CASCADE
    )
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cantieri_media (
      id INT AUTO_INCREMENT PRIMARY KEY, cantiere_id INT NOT NULL,
      tipo ENUM('foto','video') NOT NULL DEFAULT 'foto', filename VARCHAR(255) NOT NULL,
      descrizione VARCHAR(200) NULL, visibile_cliente TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cantiere_id) REFERENCES cantieri(id) ON DELETE CASCADE
    )
  `)

  let cantieriRows: Record<string, unknown>[]
  const isStaff = role === 'admin' || role === 'dipendente'

  if (isStaff) {
    try {
      const [rows] = await db.query(`
        SELECT c.*, COALESCE(ak.ragione_sociale, CONCAT(ak.cognome, ' ', ak.nome)) AS cliente_nome
        FROM cantieri c
        LEFT JOIN clienti ak ON ak.id = c.cliente_id
        ORDER BY c.created_at DESC
      `)
      cantieriRows = rows as Record<string, unknown>[]
    } catch {
      // clienti non ancora creata
      const [rows] = await db.query('SELECT *, NULL AS cliente_nome FROM cantieri ORDER BY created_at DESC')
      cantieriRows = rows as Record<string, unknown>[]
    }
  } else {
    // cliente: trova cliente_id tramite email del user loggato
    try {
      const [userRows] = await db.query('SELECT email FROM users WHERE username = ? LIMIT 1', [username])
      const userEmail  = (userRows as Record<string, unknown>[])[0]?.email as string ?? ''
      const [rows] = await db.query(`
        SELECT c.*, NULL AS cliente_nome
        FROM cantieri c
        INNER JOIN clienti ak ON ak.id = c.cliente_id AND ak.email = ?
        WHERE c.visibile_cliente = 1
        ORDER BY c.created_at DESC
      `, [userEmail])
      cantieriRows = rows as Record<string, unknown>[]
    } catch {
      cantieriRows = []
    }
  }

  const cantieri: Cantiere[] = cantieriRows.map(r => ({
    ...r,
    data_preventivo: dateToStr(r.data_preventivo),
    inizio_lavori:   dateToStr(r.inizio_lavori),
    fine_lavori:     dateToStr(r.fine_lavori),
    created_at:    r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at ?? ''),
  })) as Cantiere[]

  const cantiereIds = cantieri.map(c => c.id)

  let lavori: Lavoro[] = []
  let media: Media[]   = []

  if (cantiereIds.length > 0) {
    const placeholders = cantiereIds.map(() => '?').join(',')
    const [lRows] = await db.query(
      `SELECT * FROM cantieri_lavori WHERE cantiere_id IN (${placeholders})`, cantiereIds
    )
    lavori = (lRows as Record<string, unknown>[]) as Lavoro[]

    const [mRows] = await db.query(
      `SELECT * FROM cantieri_media WHERE cantiere_id IN (${placeholders}) ORDER BY created_at ASC`, cantiereIds
    )
    media = (mRows as Record<string, unknown>[]) as Media[]
  }

  // Clienti (solo per staff, per il form)
  let clienti: Cliente[] = []
  if (isStaff) {
    try {
      const [cRows] = await db.query('SELECT id, nome, cognome, ragione_sociale, email FROM clienti ORDER BY cognome ASC, ragione_sociale ASC')
      clienti = (cRows as Record<string, unknown>[]) as Cliente[]
    } catch { /* tabella non ancora creata */ }
  }

  await db.end()
  return { cantieri, lavori, media, clienti, isStaff }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role    = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  if (!role) redirect('/')

  const { cantieri, lavori, media, clienti, isStaff } = await getData(role, username)

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Cantieri</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        {isStaff ? 'Tutti i cantieri — gestione completa.' : 'I tuoi cantieri attivi.'}
      </p>
      <CantieriClient
        cantieri={cantieri} lavori={lavori} media={media}
        clienti={clienti} isStaff={isStaff}
      />
    </div>
  )
}
