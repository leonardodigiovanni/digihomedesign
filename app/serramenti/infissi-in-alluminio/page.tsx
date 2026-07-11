import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import CatalogoWrapper from '@/app/brand/cataloghi/[slug]/catalogo-wrapper'
import { type ArticoloListino } from '@/app/brand/cataloghi/[slug]/aggiungi-articolo'
import { LISTINO_COLS } from '@/lib/catalogo-matching'
import { getFiltriModelloLabels } from '@/lib/filtri-modello-labels'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'
import AggiungiArticoloAcquistoForm from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'

export const metadata: Metadata = {
  title: 'Infissi in Alluminio a Palermo — Taglio Termico su Misura',
  description: 'Infissi in alluminio a Palermo: finestre e porte-finestre a taglio termico su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in Alluminio a Palermo — Taglio Termico su Misura',
    description: 'Infissi in alluminio a Palermo: finestre e porte-finestre a taglio termico su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio',
    type: 'website',
  },
}

function normalize(s: string) { return s.toLowerCase().replace(/-/g, ' ').trim() }

async function getCatalogoData(nomeCategoria: string, sottocatSlug: string) {
  const normCat    = normalize(nomeCategoria)
  const normSubcat = normalize(sottocatSlug)
  try {
    const db = await getConnection()
    try {
      type VoceRow = { id: number; nome: string; serie: string; pdf_filename: string; pdf_label: string; descrizione: string | null; filtro_battente: number; filtro_scorrevole: number; filtro_taglio_termico: number; filtro_taglio_freddo: number; filtro_economico: number; filtro_fascia_alta: number; sottocategoria?: string | null; fase?: string | null; materiale?: string | null; tipologia?: string | null; ambiente?: string | null; fascia?: string | null; filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number; filtro_5?: number; filtro_6?: number; filtro_7?: number; filtro_8?: number; filtro_9?: number; filtro_10?: number }
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_7 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_8 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_9 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      const [voci] = await db.query(
        `SELECT cv.id, cv.nome, cv.serie, cv.pdf_filename, cv.pdf_label, cv.descrizione,
                cv.filtro_battente, cv.filtro_scorrevole, cv.filtro_taglio_termico,
                cv.filtro_taglio_freddo, cv.filtro_economico, cv.filtro_fascia_alta,
                (SELECT vp2.sottocategoria FROM catalogo_voci_percorsi vp2 WHERE vp2.voce_id = cv.id AND LOWER(REPLACE(TRIM(vp2.categoria), '-', ' ')) = ? AND (LOWER(REPLACE(TRIM(vp2.sottocategoria), '-', ' ')) = ? OR TRIM(vp2.sottocategoria) = '') LIMIT 1) AS sottocategoria,
                cv.fase, cv.materiale, cv.tipologia, cv.ambiente, cv.fascia,
                cv.filtro_1, cv.filtro_2, cv.filtro_3, cv.filtro_4,
                cv.filtro_5, cv.filtro_6, cv.filtro_7, cv.filtro_8, cv.filtro_9, cv.filtro_10
         FROM catalogo_voci cv
         WHERE cv.id IN (SELECT vp.voce_id FROM catalogo_voci_percorsi vp WHERE LOWER(REPLACE(TRIM(vp.categoria), '-', ' ')) = ? AND (LOWER(REPLACE(TRIM(vp.sottocategoria), '-', ' ')) = ? OR TRIM(vp.sottocategoria) = ''))
         ORDER BY cv.nome ASC`,
        [normCat, normSubcat, normCat, normSubcat]
      )
      const voceList = voci as VoceRow[]

      await db.execute(`ALTER TABLE listini ADD COLUMN principale    TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN caratteristica TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_1      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_2      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_3      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_4      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_5      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_6      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_7      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_8      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_9      TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE listini ADD COLUMN Filtro_10     TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      // Base fissa per la pagina: articoli il cui percorso è esattamente serramenti/infissi-in-alluminio.
      // I filtri (manuali o ereditati da un PDF aperto) narrowano questa stessa base lato client.
      const [artRows] = await db.query(
        `SELECT ${LISTINO_COLS} FROM listini
         WHERE disponibile = 1 AND preventivabile = 1 AND principale = 1
           AND id IN (
             SELECT listino_id FROM listini_percorsi
             WHERE LOWER(REPLACE(TRIM(categoria), '-', ' ')) = ?
               AND (LOWER(REPLACE(TRIM(sottocategoria), '-', ' ')) = ? OR TRIM(sottocategoria) = '')
           )
         ORDER BY descrizione ASC`,
        [normCat, normSubcat]
      )
      const articoliPerListino: Record<string, ArticoloListino[]> = { '0': artRows as ArticoloListino[] }
      const [rowsAcq] = await db.query(
        `SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile
         FROM listini
         WHERE disponibile = 1 AND acquistabile = 1
           AND id IN (SELECT listino_id FROM listini_percorsi WHERE LOWER(REPLACE(TRIM(categoria), '-', ' ')) = ?)
         ORDER BY descrizione ASC`,
        [normCat]
      )
      const articoliAcquisto = (rowsAcq as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
        ...r, max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
      }))
      const filtriLabels = await getFiltriModelloLabels(db)
      return { categoria: { nome: nomeCategoria }, voci: voceList, articoliPerListino, articoliAcquisto, filtriLabels }
    } finally {
      await db.end()
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const catalogo = await getCatalogoData('serramenti', 'infissi-in-alluminio')
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const isStaff = role === 'admin' || role === 'dipendente'
  const cartRaw = cookieStore.get('digi_cart')?.value
  const cartNonVuoto = !!cartRaw && (() => { try { const c = JSON.parse(cartRaw); return Array.isArray(c) && c.length > 0 } catch { return false } })()

  const username = cookieStore.get('session_user')?.value ?? ''
  let preventiviBozza: PreventivoDestOption[] = []
  if (username && !cartNonVuoto) {
    const db2 = await getConnection()
    try {
      let rows: { id: number; numero: string; descrizione: string; cliente_nome: string }[]
      if (isStaff) {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione,
            CASE WHEN c.id IS NULL THEN '' WHEN c.ragione_sociale != '' THEN c.ragione_sociale ELSE CONCAT(TRIM(c.cognome), ' ', TRIM(c.nome)) END AS cliente_nome
          FROM preventivi p
          LEFT JOIN clienti c ON c.id = p.cliente_id
          WHERE p.stato IN ('bozza','richiesto')
          ORDER BY p.data DESC, p.id DESC
        `) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      } else {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione, '' AS cliente_nome
          FROM preventivi p
          LEFT JOIN clienti c ON c.id = p.cliente_id
          JOIN users u ON u.username = ?
          WHERE p.stato IN ('bozza','richiesto')
            AND ((c.email = u.email) OR (p.creato_da = ? AND p.cliente_id IS NULL))
          ORDER BY p.data DESC, p.id DESC
        `, [username, username]) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      }
      preventiviBozza = rows.map(p => {
        const parts = [p.numero || `#${p.id}`]
        if (p.cliente_nome) parts.push(p.cliente_nome)
        if (p.descrizione) parts.push(p.descrizione)
        return { id: p.id, label: parts.join(' — ') }
      })
    } catch {}
    finally { await db2.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in Alluminio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Infissi in Alluminio a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/infissi-in-alluminio/infisso-balcone.jpg" alt="Infisso balcone" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Infisso balcone</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/infissi-in-alluminio/infisso-finestra.jpg" alt="Infisso finestra" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Infisso finestra</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli <strong>infissi in alluminio a taglio termico a Palermo</strong> rappresentano la scelta ideale per chi cerca durata, minima manutenzione e design contemporaneo. Il taglio termico — una barriera in poliammide che interrompe il ponte termico tra il profilo esterno e quello interno — garantisce elevate prestazioni di isolamento termoacustico, riducendo sensibilmente i consumi energetici.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Lavoriamo con sistemi certificati dei principali produttori — Schüco, Metra, Reynaers, Wicona — nelle versioni a battente, a vasistas, scorrevole alzante e a libro. Le finiture disponibili includono verniciatura a polvere in qualsiasi colore RAL, anodizzazione e legno-alluminio per l&apos;interno.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio comprende sopralluogo, rilievo quote, fornitura con vetrocamera selezionata, posa in opera e sigillatura perimetrale. Contattaci per un preventivo gratuito.
            </p>
          </div>
        </div>

        {catalogo && (
          <CatalogoWrapper
            voci={catalogo.voci}
            articoliPerListino={catalogo.articoliPerListino}
            isStaff={isStaff}
            isLoggedIn={!!username}
            preventiviBozza={preventiviBozza}
            cartNonVuoto={cartNonVuoto}
            submitLabel="Conferma"
            mostraFiltri
            fixedCat="serramenti"
            fixedSottocat="infissi-in-alluminio"
            filtriLabels={catalogo.filtriLabels}
          />
        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/serramenti" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Serramenti</Link>
          <CtaCantiere />
        </div>

      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>{(() => {
        const cerca = catalogo
          ? `${catalogo.categoria.nome}`
          : `serramenti/non trovata`
        const trova = catalogo && catalogo.voci.length > 0
          ? catalogo.voci.map(v => `(${v.nome}:${v.serie}:${v.pdf_label})/${v.sottocategoria ?? 'nessuno'}`).join('+')
          : 'nessuno'
        return `tipo pagina fototesto con cataloghi visualizzatore aggiunta carrello (cerca categoria cataloghi [${cerca}])(trova ${trova})`
      })()}</p>
    </div>
  )
}

