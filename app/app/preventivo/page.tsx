import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import { creaPreventivo } from './actions'
import PreventiviTabella from './preventivi-tabella'
import { decompressCart } from '@/lib/cart-cookie'
import SetActionBar from '@/app/app/set-action-bar'
import InfoCard from '@/app/app/info-card'
import { readSettings } from '@/lib/settings'

type Preventivo = {
  id: number
  numero: string
  cliente_id: number | null
  cliente_nome: string
  descrizione: string
  stato: 'bozza' | 'inviato' | 'accettato' | 'rifiutato' | 'scaduto'
  importo: number
  data: string
  validita_giorni: number
  note: string | null
  visibile_cliente: number
  created_at: string
}


function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(role: string, username: string): Promise<{ preventivi: Preventivo[]; isStaff: boolean }> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS preventivi (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        numero           VARCHAR(50)   NOT NULL DEFAULT '',
        cliente_id       INT           NULL,
        descrizione      TEXT          NULL,
        stato            ENUM('bozza','inviato','accettato','rifiutato','scaduto') NOT NULL DEFAULT 'bozza',
        importo          DECIMAL(10,2) NOT NULL DEFAULT 0,
        data             DATE          NOT NULL,
        validita_giorni  INT           NOT NULL DEFAULT 30,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [col] = await conn.query(
      `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'preventivi' AND COLUMN_NAME = 'creato_da'`
    ) as [{ cnt: number }[], unknown]
    if ((col[0]?.cnt ?? 0) === 0) {
      await conn.execute(`ALTER TABLE preventivi ADD COLUMN creato_da VARCHAR(100) NULL DEFAULT NULL`)
    }

    const isStaff = role === 'admin' || role === 'dipendente'
    let rows: Record<string, unknown>[]

    if (isStaff) {
      const [r] = await conn.query(`
        SELECT p.*, CASE WHEN c.id IS NULL THEN '' WHEN c.ragione_sociale != '' THEN c.ragione_sociale ELSE CONCAT(TRIM(c.cognome), '|', TRIM(c.nome)) END AS cliente_nome
        FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
        ORDER BY p.data DESC, p.id DESC
      `)
      rows = r as Record<string, unknown>[]
    } else {
      const [userRows] = await conn.execute('SELECT cliente_id FROM users WHERE username = ? LIMIT 1', [username]) as [{ cliente_id: number | null }[], unknown]
      const clienteId = userRows[0]?.cliente_id ?? null
      const [r] = await conn.query(`
        SELECT p.*, '' AS cliente_nome FROM preventivi p
        WHERE p.visibile_cliente = 1
          AND p.stato != 'da inviare'
          AND (
            (p.cliente_id = ?)
            OR (p.creato_da = ? AND p.cliente_id IS NULL)
          )
        ORDER BY p.data DESC, p.id DESC
      `, [clienteId, username])
      rows = r as Record<string, unknown>[]
    }

    const today = new Date(); today.setHours(0,0,0,0)
    const preventivi = rows.map(r => {
      let stato = String(r.stato ?? 'bozza')
      if (!['accettato','rifiutato','annullato','scaduto'].includes(stato)) {
        const exp = new Date(r.data as string)
        exp.setDate(exp.getDate() + Number(r.validita_giorni ?? 5))
        if (exp < today) stato = 'scaduto'
      }
      return { ...r, stato, data: dateToLocal(r.data), created_at: dateToLocal(r.created_at) }
    }) as Preventivo[]
    return { preventivi, isStaff }
  } catch { return { preventivi: [], isStaff: false } }
  finally { await conn.end() }
}

export default async function AppPreventivoPage() {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const { preventivi, isStaff } = await getData(role, username)
  const { manutenzione } = await readSettings()

  const cartRaw = cookieStore.get('digi_cart')?.value ?? ''
  const cartNonVuoto = decompressCart(cartRaw).filter(i => i.parent == null).length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginLeft: 3, marginRight: 3 }}>
      <InfoCard titolo="Preventivi" corpo="Consulta tutti i preventivi che hai salvato: riepilogo articoli, prezzi e stato di avanzamento." />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {isStaff && (
          <form action={creaPreventivo}>
            <button type="submit" className="btn-green-app"
              style={{ padding: '0 24px', fontSize: 14 }}>
              + Nuovo preventivo
            </button>
          </form>
        )}
        {!(manutenzione && !username) && (
          <a href="/app/carrello-preventivo" className="btn-green-app"
            style={{ padding: '0 24px', fontSize: 14 }}>
            + Nuova simulazione preventivo
          </a>
        )}
      </div>

      <PreventiviTabella preventivi={preventivi} isStaff={isStaff} />

      <SetActionBar>
        {cartNonVuoto && (
          <Link href="/app/carrello-preventivo" className="btn-black-app fs-12" style={{ margin: '0 auto' }}>
            Vai alla simulazione
          </Link>
        )}
      </SetActionBar>
    </div>
  )
}


