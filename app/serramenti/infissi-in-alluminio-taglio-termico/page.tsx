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
import { getFiltriCatalogoLabels } from '@/lib/filtri-catalogo-labels'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'
import AggiungiArticoloAcquistoForm from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'
import { readSettings } from '@/lib/settings'
import { getProdottiNeighbors } from '@/lib/nav-config'
import NavDropdownTriggerButton from '@/components/nav-dropdown-trigger-button'

export const metadata: Metadata = {
  title: 'Infissi in Alluminio a Taglio Termico a Palermo — Su Misura',
  description: 'Infissi in alluminio a taglio termico a Palermo: finestre e porte-finestre su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio-taglio-termico' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in Alluminio a Taglio Termico a Palermo — Su Misura',
    description: 'Infissi in alluminio a taglio termico a Palermo: finestre e porte-finestre su misura. Alta efficienza energetica, design moderno e durabilità garantita.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-alluminio-taglio-termico',
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
      type VoceRow = { id: number; nome: string; serie: string; pdf_filename: string; pdf_label: string; descrizione: string | null; filtro_c1: number; filtro_c2: number; filtro_c3: number; filtro_c4: number; filtro_c5: number; filtro_c6: number; sottocategoria?: string | null; fase?: string | null; materiale?: string | null; tipologia?: string | null; ambiente?: string | null; fascia?: string | null; filtro_1?: number; filtro_2?: number; filtro_3?: number; filtro_4?: number; filtro_5?: number; filtro_6?: number; filtro_7?: number; filtro_8?: number; filtro_9?: number; filtro_10?: number }
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_5 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_6 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_7 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_8 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_9 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
      await db.execute(`ALTER TABLE catalogo_voci ADD COLUMN filtro_10 TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {})
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
      // Base fissa per la pagina: articoli il cui percorso è esattamente serramenti/infissi-in-alluminio-taglio-termico.
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
      const filtriLabels = await getFiltriModelloLabels(db)
      const filtriCatalogoLabels = await getFiltriCatalogoLabels(db)
      return { categoria: { nome: nomeCategoria }, voci: voceList, articoliPerListino, articoliAcquisto, filtriLabels, filtriCatalogoLabels }
    } finally {
      await db.end()
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const { disabledPages } = await readSettings()
  const { prev, next } = getProdottiNeighbors(290, disabledPages)
  const catalogo = await getCatalogoData('serramenti', 'infissi-in-alluminio-taglio-termico')
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
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in Alluminio a Taglio Termico<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Infissi in Alluminio a Taglio Termico a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '24px 24px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/infissi-in-alluminio/infisso-balcone.webp" alt="Infisso balcone" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Porta Balcone</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/serramenti/infissi-in-alluminio/infisso-finestra.webp" alt="Infisso finestra" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Finestra</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli infissi in alluminio a taglio termico sono la soluzione ideale per chi desidera resistenza, design moderno, elevate prestazioni di isolamento termico e acustico e una manutenzione minima. Grazie alla tecnologia a taglio termico, migliorano il comfort abitativo e contribuiscono a ridurre i consumi energetici.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Vendiamo e installiamo serramenti su misura nelle versioni a battente, vasistas, scorrevoli e a libro, disponibili in un&apos;ampia gamma di colori e finiture.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ti seguiamo in ogni fase del progetto: preventivo gratuito, sopralluogo, rilievo misure, fornitura, posa in opera, sigillatura e smaltimento vecchi infissi, con un servizio completo e professionale.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#e8f7e8', border: '1px solid #9dd49d', borderRadius: 20, padding: 16 }}>
              <Image src="/images/cta/emoticon2.webp" alt="" width={64} height={64} style={{ objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p className="testo-articoli" style={{ margin: 0, fontWeight: 700, color: '#8a6800' }}>
                  Articolo disponibile per preventivi Online
                </p>
                <p className="testo-articoli" style={{ margin: 0, fontStyle: 'italic' }}>
                  Per farti risparmiare tempo prezioso, puoi utilizzare il nostro preventivatore online: inserisci in autonomia misure e configurazione del serramento per ottenere una stima immediata del costo. Se il preventivo ti soddisfa, fisseremo un sopralluogo per il rilievo definitivo delle misure e la conferma dell&apos;offerta, che normalmente si discosta di poco dalla simulazione iniziale.
                </p>
              </div>
            </div>
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
            fixedSottocat="infissi-in-alluminio-taglio-termico"
            filtriLabels={catalogo.filtriLabels}
            filtriCatalogoLabels={catalogo.filtriCatalogoLabels}
          />
        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <StickyBottomBarContent>
          <Link href="/serramenti" className="btn-black fs-12">← Serramenti</Link>
          {prev ? <Link href={prev.href} className="btn-blue fs-12">← {prev.label}</Link> : <Link href="/" className="btn-gold fs-12">← Home</Link>}
          <CtaCantiere />
          {next ? <Link href={next.href} className="btn-blue fs-12">{next.label} →</Link> : <NavDropdownTriggerButton dropdownId="comfort" label="Spazi Esterni e Comfort →" />}
        </StickyBottomBarContent>

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
