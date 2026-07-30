import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import { UploadDocumentoForm } from './upload-form'
import { DocumentiFiltri } from './filtri'
import ShortcutStar from '@/components/shortcut-star'
import GestioneBlob from '@/components/gestione-blob'

export const metadata: Metadata = { title: 'Documenti Clienti' }

type Documento = {
  id: number
  cliente_id: number | null
  cliente_nome: string
  titolo: string
  tipo: string
  filename: string
  note: string | null
  visibile_cliente: number
  created_at: string
}

type ClienteOption = { id: number; label: string }

function dateToLocal(d: unknown): string {
  if (!(d instanceof Date)) return String(d ?? '')
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

async function getData(): Promise<{ documenti: Documento[]; clienti: ClienteOption[] }> {
  const conn = await getConnection()
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS documenti_cliente (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id       INT           NULL,
        titolo           VARCHAR(200)  NOT NULL,
        tipo             VARCHAR(50)   NOT NULL DEFAULT 'generico',
        filename         VARCHAR(255)  NOT NULL,
        note             TEXT          NULL,
        visibile_cliente TINYINT(1)    NOT NULL DEFAULT 1,
        created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `)
    const [rows] = await conn.query(`
      SELECT d.*, COALESCE(NULLIF(c.ragione_sociale, ''), CONCAT(c.cognome, ' ', c.nome), '') AS cliente_nome
      FROM documenti_cliente d LEFT JOIN clienti c ON c.id = d.cliente_id
      ORDER BY d.created_at DESC
    `)
    const [cr] = await conn.query(
      `SELECT id, COALESCE(NULLIF(ragione_sociale, ''), CONCAT(cognome, ' ', nome)) AS label
       FROM clienti ORDER BY label`
    )
    const documenti = (rows as Record<string, unknown>[]).map(r => ({
      ...r, created_at: dateToLocal(r.created_at),
    })) as Documento[]
    const clienti = (cr as { id: number; label: string }[]).map(c => ({ id: c.id, label: c.label }))
    return { documenti, clienti }
  } catch { return { documenti: [], clienti: [] } }
  finally { await conn.end() }
}

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin' && role !== 'dipendente') redirect('/')

  const { documenti, clienti } = await getData()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Documenti Clienti<ShortcutStar href="/clienti/documenti" small /></h2>
        <p style={{ color: '#000', fontSize: 14, margin: '4px 0 0' }}>Tutti i documenti caricati.</p>
      </div>

      <UploadDocumentoForm clienti={clienti} />

      {documenti.length === 0
        ? <p style={{ color: '#aaa', fontSize: 14 }}>Nessun documento disponibile.</p>
        : <DocumentiFiltri documenti={documenti} clienti={clienti} />
      }
      <GestioneBlob prefix="documenti/" label="Gestione Blob — Documenti Clienti" />
      <div className="IsDebug fs-11" style={{marginTop:8}}>pagina revisionata</div>
    </div>
  )
}
