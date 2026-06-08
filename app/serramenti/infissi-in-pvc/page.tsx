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

export const metadata: Metadata = {
  title: 'Infissi in PVC a Palermo â€” Multicamera Alta Efficienza',
  description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/mÂ²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
  alternates: { canonical: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Infissi in PVC a Palermo â€” Multicamera Alta Efficienza',
    description: 'Infissi in PVC a Palermo: finestre e porte-finestre multicamera con trasmittanza fino a 0,8 W/mÂ²K. Isolamento termico e acustico superiore. Preventivo gratuito.',
    url: 'https://www.digi-home-design.com/serramenti/infissi-in-pvc',
    type: 'website',
  },
}

async function getCatalogoData(nomeCategoria: string) {
  try {
    const db = await getConnection()
    try {
      const [cats] = await db.query(
        'SELECT id, nome, listino_categoria FROM catalogo_categorie WHERE LOWER(nome) = LOWER(?) LIMIT 1',
        [nomeCategoria]
      )
      const categoria = (cats as { id: number; nome: string; listino_categoria: string | null }[])[0]
      if (!categoria) return null
      const [voci] = await db.query(
        'SELECT id, nome, serie, pdf_filename, pdf_label, listino_categoria, descrizione FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
        [categoria.id]
      )
      const voceList = voci as { id: number; nome: string; serie: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null; descrizione: string | null }[]
      const allListiniSet = new Set<string>()
      if (categoria.listino_categoria) allListiniSet.add(categoria.listino_categoria)
      for (const v of voceList) { if (v.listino_categoria) allListiniSet.add(v.listino_categoria) }
      const COLS = 'id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro, richiede_tipo_montaggio, schema_url, max_acquistabile'
      const articoliPerListino: Record<string, ArticoloListino[]> = {}
      if (allListiniSet.size > 0) {
        await db.execute(`ALTER TABLE listini ADD COLUMN principale TINYINT(1) NOT NULL DEFAULT 1`).catch(() => {})
        for (const listino of allListiniSet) {
          try {
            const [rows] = await db.query(
              `SELECT ${COLS} FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND principale = 1 ORDER BY descrizione ASC`,
              [listino]
            )
            articoliPerListino[listino] = rows as ArticoloListino[]
          } catch {}
        }
      }
      const acquistoCats = new Set<string>()
      if (categoria.listino_categoria) acquistoCats.add(categoria.listino_categoria)
      for (const v of voceList) { if (v.listino_categoria) acquistoCats.add(v.listino_categoria) }
      let articoliAcquisto: ArticoloListinoAcquisto[] = []
      if (acquistoCats.size > 0) {
        try {
          const cats = [...acquistoCats]
          const ph = cats.map(() => '?').join(',')
          const [rowsAcq] = await db.query(
            `SELECT id, descrizione, produttore, serie, unita, prezzo_vendita, max_acquistabile FROM listini WHERE categoria IN (${ph}) AND disponibile = 1 AND acquistabile = 1 ORDER BY descrizione ASC`,
            cats
          )
          articoliAcquisto = (rowsAcq as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
            ...r,
            max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
          }))
        } catch {}
      }
      return { categoria: { nome: categoria.nome, listino_categoria: categoria.listino_categoria }, voci: voceList, articoliPerListino, articoliAcquisto }
    } finally {
      await db.end()
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const CERCA = 'Infissi in PVC'
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
        return { id: p.id, label: parts.join(' â€” ') }
      })
    } catch {}
    finally { await db2.end() }
  }

  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in PVC
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Infissi in PVC a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/serramenti/infissi-in-pvc/pvc-alphaluce.jpg" alt="Infissi in PVC Alphaluce" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Infissi in PVC Alphaluce</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/serramenti/infissi-in-pvc/Inalpha-Prestigio21.jpg" alt="Infissi in PVC Inalpha Prestigio" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Infissi in PVC Inalpha Prestigio</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli <strong>infissi in PVC a Palermo</strong> offrono il miglior rapporto qualitÃ -prezzo per l&apos;isolamento termoacustico: i profili multicamera a 5, 6 o 7 camere raggiungono valori di trasmittanza termica Uf fino a 0,95 W/mÂ²K, tra i piÃ¹ bassi sul mercato. Il PVC Ã¨ un materiale intrinsecamente isolante, non necessita di taglio termico aggiuntivo e garantisce lunga durata senza manutenzione.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Installiamo sistemi dei principali brand europei â€” VEKA, Rehau, KBE, Aluplast â€” in versione bianca, foliata in varie essenze di legno e in colorazione integrale. Le ante sono disponibili nelle tipologie a battente, a vasistas, scorrevole parallela e alzante-scorrevole, abbinate a vetrocamera con gas argon e Low-E per la massima efficienza.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Il servizio Ã¨ chiavi in mano: sopralluogo, rilievo, fornitura, posa e smaltimento dei vecchi infissi. Contattaci per un preventivo gratuito a Palermo e provincia.
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
          />
        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/serramenti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>â† Torna a Serramenti</Link>
          <CtaPreventivo />
          <CtaCantiere />
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>{(() => {
        const cerca = catalogo
          ? `${catalogo.categoria.nome}/${catalogo.categoria.listino_categoria ?? 'nessun listino categoria'}`
          : `${CERCA}/non trovata`
        const trova = catalogo && catalogo.voci.length > 0
          ? catalogo.voci.map(v => `(${v.nome}:${v.serie}:${v.pdf_label})/${v.listino_categoria ?? 'nessuno'}`).join('+')
          : 'nessuno'
        return `tipo pagina fototesto con cataloghi visualizzatore aggiunta carrello (cerca categoria cataloghi [${cerca}])(trova ${trova})`
      })()}</p>
    </div>
  )
}

