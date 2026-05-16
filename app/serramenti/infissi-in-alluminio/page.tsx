import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getConnection } from '@/lib/db'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
import CatalogoWrapper from '@/app/brand/cataloghi/[id]/catalogo-wrapper'
import AggiungiArticolo, { type ArticoloListino } from '@/app/brand/cataloghi/[id]/aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

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
        'SELECT id, nome, pdf_filename, pdf_label FROM catalogo_voci WHERE categoria_id = ? ORDER BY nome ASC',
        [categoria.id]
      )

      let articoli: ArticoloListino[] = []
      if (categoria.listino_categoria) {
        try {
          const [rows] = await db.query(
            'SELECT id, descrizione, produttore, serie, unita, prezzo_acquisto, prezzo_vendita, sconto_articolo, richiede_larghezza, richiede_altezza, richiede_quantita, richiede_piano, richiede_km, richiede_peso, richiede_tipo_colore, richiede_tipo_vetro FROM listini WHERE categoria = ? AND disponibile = 1 AND preventivabile = 1 AND principale = 1 ORDER BY descrizione ASC',
            [categoria.listino_categoria]
          )
          articoli = rows as ArticoloListino[]
        } catch {}
      }

      return {
        voci: voci as { id: number; nome: string; pdf_filename: string; pdf_label: string }[],
        articoli,
      }
    } finally {
      await db.end()
    }
  } catch {
    return null
  }
}

export default async function Page() {
  const catalogo = await getCatalogoData('Infissi in Alluminio')
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
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/serramenti" style={{ color: '#888', textDecoration: 'underline' }}>Serramenti</Link> / Infissi in Alluminio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Infissi in Alluminio a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Gli <strong>infissi in alluminio a taglio termico a Palermo</strong> rappresentano la scelta ideale per chi cerca durata, minima manutenzione e design contemporaneo. Il taglio termico — una barriera in poliammide che interrompe il ponte termico tra il profilo esterno e quello interno — garantisce elevate prestazioni di isolamento termoacustico, riducendo sensibilmente i consumi energetici.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/infissi-in-alluminio/infisso-balcone.jpg" alt="Infisso balcone" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Infisso balcone</span>
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/serramenti/infissi-in-alluminio/infisso-finestra.jpg" alt="Infisso finestra" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Infisso finestra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Lavoriamo con sistemi certificati dei principali produttori — Schüco, Metra, Reynaers, Wicona — nelle versioni a battente, a vasistas, scorrevole alzante e a libro. Le finiture disponibili includono verniciatura a polvere in qualsiasi colore RAL, anodizzazione e legno-alluminio per l&apos;interno.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Il servizio comprende sopralluogo, rilievo quote, fornitura con vetrocamera selezionata, posa in opera e sigillatura perimetrale. Contattaci per un preventivo gratuito.
          </p>
        </div>

        {/* Cataloghi PDF */}
        {catalogo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="effetto-3d fs-28" style={{ fontWeight: 700, margin: 0 }}>Cataloghi</h2>
            <CatalogoWrapper voci={catalogo.voci} />
          </div>
        )}

        {/* Aggiungi al carrello preventivi */}
        {catalogo && <AggiungiArticolo articoli={catalogo.articoli} isStaff={isStaff} isLoggedIn={!!username} preventiviBozza={preventiviBozza} cartNonVuoto={cartNonVuoto} />}

        {/* CTA */}
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
            <CtaCantiere />
          </div>
        </div>

      </div>

      <Link href="/serramenti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Serramenti</Link>
    </div>
  )
}
