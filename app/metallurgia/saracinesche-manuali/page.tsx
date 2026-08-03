import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import CatalogoWrapper from '@/app/brand/cataloghi/[slug]/catalogo-wrapper'
import { type ArticoloListino } from '@/app/brand/cataloghi/[slug]/aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'
import AggiungiArticoloAcquistoForm from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'
import StickyBottomBarContent from '@/components/sticky-bottom-bar-content'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
  description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Saracinesche Manuali a Palermo — Garage e Locali Commerciali',
    description: 'Saracinesche manuali a Palermo: avvolgibili in acciaio, alluminio e PVC con manovra manuale per garage, negozi e magazzini. Fornitura, posa e assistenza.',
    url: 'https://www.digi-home-design.com/metallurgia/saracinesche-manuali',
    type: 'website',
  },
}

async function getCatalogoData(nomeCategoria: string) {
  const normCat = nomeCategoria.toLowerCase().replace(/-/g, ' ').trim()
  try {
    const db = await getConnection()
    try {
      const [vociRows] = await db.query(
        `SELECT cv.id, cv.nome, cv.serie, cv.pdf_filename, cv.pdf_label, cv.descrizione,
                (SELECT vp2.sottocategoria FROM catalogo_voci_percorsi vp2 WHERE vp2.voce_id = cv.id AND LOWER(REPLACE(TRIM(vp2.categoria), '-', ' ')) = ? LIMIT 1) AS sottocategoria
         FROM catalogo_voci cv
         WHERE cv.id IN (SELECT vp.voce_id FROM catalogo_voci_percorsi vp WHERE LOWER(REPLACE(TRIM(vp.categoria), '-', ' ')) = ?)
         ORDER BY cv.nome ASC`,
        [normCat, normCat]
      )
      const voceList = vociRows as { id: number; nome: string; serie: string; pdf_filename: string; pdf_label: string; descrizione: string | null; sottocategoria?: string | null }[]
      await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
      const COLS = 'id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro, richiede_tipo_montaggio, schema_url, foto_url, max_acquistabile'
      const [rows] = await db.query(
        `SELECT ${COLS} FROM listini
         WHERE disponibile = 1 AND preventivabile = 1 AND principale = 1
           AND id IN (SELECT listino_id FROM listini_percorsi WHERE LOWER(REPLACE(TRIM(categoria), '-', ' ')) = ?)
         ORDER BY descrizione ASC`,
        [normCat]
      )
      const articoliPerListino: Record<string, ArticoloListino[]> = { '0': rows as ArticoloListino[] }
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
  const CERCA = 'Saracinesche Manuali'
  const catalogo = await getCatalogoData(CERCA)
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
        return { id: p.id, label: parts.join(' — ') }
      })
    } catch {}
    finally { await db2.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Saracinesche Manuali<ShortcutStar />
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Saracinesche Manuali a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/metallurgia/saracinesce-manuali/basculante.webp" alt="Basculante manuale in garage" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Basculante manuale per garage</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/metallurgia/saracinesce-manuali/saracinesca.webp" alt="Saracinesca manuale in garage" fill sizes="300px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span className="testo-articoli">Saracinesca manuale per garage</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo e installiamo <strong>saracinesche manuali a Palermo</strong> per garage privati, negozi, magazzini e locali commerciali: avvolgibili in doghe di acciaio zincato, alluminio estruso e PVC coibentato con manovra a cinghia, molla di bilanciamento o moschettone. Soluzione affidabile e senza componenti elettrici, ideale dove non è disponibile l&apos;alimentazione o si preferisce la semplicità di utilizzo.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le saracinesche manuali sono disponibili in larghezze fino a 4 m e altezze fino a 3,5 m. Le guide in acciaio zincato e il cassonetto di contenimento sono verniciati a polvere in qualsiasi colore RAL. Su richiesta installiamo serrature a lucchetto o cilindro per la chiusura di sicurezza notturna.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo anche il servizio di manutenzione e riparazione di saracinesche esistenti: sostituzione guide, doghe danneggiate e molle di bilanciamento. Contattaci per un sopralluogo gratuito e un preventivo a Palermo e provincia.
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
          />
        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <StickyBottomBarContent>
          <Link href="/metallurgia" className="btn-black fs-12">← Metallurgia</Link>
          <CtaPreventivo />
          <CtaCantiere />
        </StickyBottomBarContent>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>{(() => {
        const cerca = catalogo
          ? `${catalogo.categoria.nome}`
          : `${CERCA}/non trovata`
        const trova = catalogo && catalogo.voci.length > 0
          ? catalogo.voci.map(v => `(${v.nome}:${v.serie}:${v.pdf_label})/${v.sottocategoria ?? 'nessuna'}`).join('+')
          : 'nessuno'
        return `tipo pagina fototesto con cataloghi visualizzatore aggiunta carrello (cerca categoria cataloghi [${cerca}])(trova ${trova})`
      })()}</p>
    </div>
  )
}
