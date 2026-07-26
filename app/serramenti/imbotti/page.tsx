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
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'
import AggiungiArticoloAcquistoForm from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Imbotti a Palermo â€” Rivestimento Vani Finestra in Alluminio e PVC',
  description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/imbotti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Imbotti a Palermo â€” Rivestimento Vani Finestra in Alluminio e PVC',
    description: 'Imbotti a Palermo in alluminio e PVC per il rivestimento dei vani finestra: eliminano ponti termici, proteggono la muratura e danno un aspetto finito all\'infisso.',
    url: 'https://www.digi-home-design.com/serramenti/imbotti',
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
      type VoceRow = { id: number; nome: string; serie: string; pdf_filename: string; pdf_label: string; descrizione: string | null; filtro_c1: number; filtro_c2: number; filtro_c3: number; filtro_c4: number; filtro_c5: number; filtro_c6: number; sottocategoria?: string | null; fase?: string | null; materiale?: string | null; tipologia?: string | null; ambiente?: string | null; fascia?: string | null; filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number }
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN serie VARCHAR(200) NOT NULL DEFAULT ''`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN descrizione TEXT NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_c6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fase VARCHAR(100) NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN materiale VARCHAR(100) NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN tipologia VARCHAR(100) NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN ambiente VARCHAR(100) NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN fascia VARCHAR(100) NULL`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_1 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_2 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_3 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_4 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      const [voci] = await db.query(
        `SELECT cv.id, cv.nome, cv.serie, cv.pdf_filename, cv.pdf_label, cv.descrizione,
                cv.filtro_c1, cv.filtro_c2, cv.filtro_c3,
                cv.filtro_c4, cv.filtro_c5, cv.filtro_c6,
                (SELECT vp2.sottocategoria FROM catalogo_voci_percorsi vp2 WHERE vp2.voce_id = cv.id AND LOWER(REPLACE(TRIM(vp2.categoria), '-', ' ')) = ? AND (LOWER(REPLACE(TRIM(vp2.sottocategoria), '-', ' ')) = ? OR TRIM(vp2.sottocategoria) = '') LIMIT 1) AS sottocategoria,
                cv.fase, cv.materiale, cv.tipologia, cv.ambiente, cv.fascia,
                cv.filtro_1, cv.filtro_2, cv.filtro_3, cv.filtro_4
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
        `SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile, foto_url, prezzo_promo
         FROM listini
         WHERE disponibile = 1 AND acquistabile = 1
           AND id IN (SELECT listino_id FROM listini_percorsi WHERE LOWER(REPLACE(TRIM(categoria), '-', ' ')) = ?)
         ORDER BY descrizione ASC`,
        [normCat]
      )
      const articoliAcquisto = (rowsAcq as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
        ...r, max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
      }))
      return { categoria: { nome: nomeCategoria }, voci: voceList, articoliPerListino, articoliAcquisto }
    } finally {
      await db.end()
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const catalogo = await getCatalogoData('serramenti', 'imbotti')
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
          FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
          WHERE p.stato IN ('bozza','richiesto') ORDER BY p.data DESC, p.id DESC
        `) as [{ id: number; numero: string; descrizione: string; cliente_nome: string }[], unknown]
        rows = r
      } else {
        const [r] = await db2.query(`
          SELECT p.id, p.numero, p.descrizione, '' AS cliente_nome
          FROM preventivi p LEFT JOIN clienti c ON c.id = p.cliente_id
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
        return { id: p.id, label: parts.join(' â€” ') }
      })
    } catch {}
    finally { await db2.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Imbotti<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Imbotti a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/imbotti-in-alluminio/20240802_183635.jpg" alt="Imbotti in alluminio installati" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Imbotti in alluminio installati</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/imbotti-in-alluminio/cassonetto_mediterraneo-800x533.jpg" alt="Cassonetto mediterraneo in alluminio" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Cassonetto mediterraneo in alluminio</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli <strong>imbotti in alluminio e PVC a Palermo</strong> rivestono il vano finestra tra il telaio dell&apos;infisso e la muratura esterna, eliminando i ponti termici perimetrali, proteggendo l&apos;intonaco dall&apos;umiditÃ  di infiltrazione e conferendo all&apos;apertura un aspetto pulito e rifinito. Sono realizzati su misura per adattarsi a qualsiasi spessore di muro e profonditÃ  del vano.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli imbotti in alluminio vengono verniciati nello stesso colore dell&apos;infisso per continuitÃ  estetica, mentre quelli in PVC sono disponibili in bianco e in versione foliata. La posa avviene con aggancio a clips o con viti a scomparsa, senza bisogno di opere murarie aggiuntive, e il giunto perimetrale viene sigillato con silicone neutro per la tenuta all&apos;acqua.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Vengono installati contestualmente alla posa degli infissi o come intervento autonomo su serramenti esistenti. Contattaci per un preventivo gratuito.
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
            fixedCat="serramenti"
            fixedSottocat="imbotti"
          />
        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <StickyBottomBarContent>
          <Link href="/serramenti" className="btn-black fs-12">← Torna a Serramenti</Link>
          <CtaPreventivo />
          <CtaCantiere />
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>{(() => {
        const cerca = catalogo
          ? `${catalogo.categoria.nome}`
          : 'serramenti/imbotti/non trovata'
        const trova = catalogo && catalogo.voci.length > 0
          ? catalogo.voci.map(v => `(${v.nome}:${v.serie}:${v.pdf_label})/${v.sottocategoria ?? 'nessuno'}`).join('+')
          : 'nessuno'
        return `tipo pagina fototesto con cataloghi visualizzatore aggiunta carrello (cerca categoria cataloghi [${cerca}])(trova ${trova})`
      })()}</p>
    </div>
  )
}

