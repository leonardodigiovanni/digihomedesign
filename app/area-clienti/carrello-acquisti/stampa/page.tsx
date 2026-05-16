import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import StampaAcquistiClient from './stampa-client'

export const metadata: Metadata = { title: 'Stampa Ordine Acquisto' }

type ArtRow = {
  idx: number
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  quantita: number
  larghezza_cm: number
  altezza_cm: number
  ante: number
  colore: string
  note: string
}

function calcolaPrezzo(a: ArtRow): number {
  const pb = a.prezzo_vendita
  const h  = a.altezza_cm  / 100
  const l  = a.larghezza_cm / 100
  const q  = a.quantita
  if (a.unita === 'm²')      return Math.round(pb * h * l * q * 100) / 100
  if (a.unita === 'ml')      return Math.round(pb * l * q * 100) / 100
  return Math.round(pb * q * 100) / 100
}

function articoloHTML(a: ArtRow & { idx: number }): string {
  const sub  = calcolaPrezzo(a)
  const dims: string[] = []
  if (a.ante > 1) dims.push(`${a.ante} ante`)
  if (a.larghezza_cm) dims.push(`L: ${a.larghezza_cm} cm`)
  if (a.altezza_cm) dims.push(`H: ${a.altezza_cm} cm`)
  if (a.colore) dims.push(a.colore)
  const dimsStr = dims.length > 0 ? `<div style="font-size:9px;color:#888;">${dims.join(' · ')}</div>` : ''
  const noteStr = a.note ? `<div style="font-size:9px;color:#aaa;font-style:italic;">${a.note}</div>` : ''

  return `<table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
<tr style="border-bottom:1px solid #f0f0f0;">
  <td style="padding:6px 8px;width:28px;font-size:10px;color:#aaa;vertical-align:top;">${a.idx + 1}</td>
  <td style="padding:6px 8px;font-size:11px;vertical-align:top;">
    <span style="font-size:9px;background:#e8e8f8;border-radius:3px;padding:1px 5px;color:#555;">${a.categoria}</span>
    <span style="color:#888;font-size:9px;margin-left:4px;">${a.produttore}</span>
    <div style="font-weight:600;font-size:11px;margin-top:2px;">${a.descrizione}</div>
    ${dimsStr}${noteStr}
  </td>
  <td style="padding:6px 8px;font-size:10px;text-align:center;white-space:nowrap;vertical-align:top;color:#555;">${a.unita}</td>
  <td style="padding:6px 8px;font-size:10px;text-align:right;white-space:nowrap;vertical-align:top;color:#555;">€ ${Number(a.prezzo_vendita).toFixed(2)}</td>
  <td style="padding:6px 8px;font-size:10px;text-align:center;vertical-align:top;font-weight:600;">${a.quantita}</td>
  <td style="padding:6px 8px;font-size:11px;text-align:right;white-space:nowrap;vertical-align:top;font-weight:700;">€ ${sub.toFixed(2)}</td>
</tr>
</table>`
}

const PAGE_H   = 1123
const PAD_TOP  = 38
const PAD_BTM  = 56
const AVAIL    = PAGE_H - PAD_TOP - PAD_BTM
const H_HDR1   = 200
const H_HDR_N  = 50
const H_ROW    = 50
const H_FOOT   = 60

function buildPages(arts: ArtRow[], clienteNome: string, data: string, totale: string): string[] {
  const header1 = `
<table style="width:100%;margin-bottom:14px;border-collapse:collapse;"><tr>
  <td style="vertical-align:top;width:50%;">
    <img src="/images/volantino/dg-t.png" alt="Logo" style="height:46px;margin-bottom:7px;display:block;"/>
    <div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Digi Home Design S.r.l.</div>
    <div style="font-size:10px;color:#555;line-height:1.55;margin-top:3px;">P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>info@digi-home-design.com</div>
  </td>
  <td style="vertical-align:top;text-align:right;width:50%;">
    <img src="/images/volantino/nome_tr.png" alt="Logo 2" style="height:46px;"/>
  </td>
</tr></table>
<hr style="border:none;border-top:2px solid #4a0080;margin:0 0 12px;"/>
<table style="width:100%;margin-bottom:12px;border-collapse:collapse;"><tr>
  <td style="vertical-align:top;width:50%;">
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Data</div>
    <div style="font-size:12px;font-weight:bold;">${data}</div>
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:6px 0 2px;">Tipo</div>
    <div style="font-size:12px;font-weight:bold;color:#4a0080;">Ordine Acquisto</div>
  </td>
  <td style="vertical-align:top;text-align:right;width:50%;">
    <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">Spett.le</div>
    <div style="font-size:13px;font-weight:bold;color:#4a0080;">${clienteNome}</div>
  </td>
</tr></table>
<table style="width:100%;border-collapse:collapse;margin-bottom:6px;">
<tr style="background:#4a0080;">
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:left;font-weight:600;width:28px;">#</th>
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:left;font-weight:600;">Articolo</th>
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:center;font-weight:600;">Unità</th>
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:right;font-weight:600;">P. Unit.</th>
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:center;font-weight:600;">Qtà</th>
  <th style="padding:5px 8px;font-size:9px;color:#f3e5ff;text-align:right;font-weight:600;">Subtotale</th>
</tr>
</table>`

  const headerN = `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
  <img src="/images/volantino/dg-t.png" alt="Logo" style="height:28px;display:block;"/>
  <div style="font-size:10px;color:#555;text-align:right;line-height:1.5;">
    <strong style="color:#4a0080;">Digi Home Design S.r.l.</strong> &nbsp;|&nbsp;
    Ordine Acquisto — ${data} &nbsp;|&nbsp; <em>continua</em>
  </div>
</div>
<hr style="border:none;border-top:1.5px solid #4a0080;margin:0 0 8px;"/>
<table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
<tr style="background:#4a0080;">
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:left;font-weight:600;width:28px;">#</th>
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:left;font-weight:600;">Articolo</th>
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:center;font-weight:600;">Unità</th>
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:right;font-weight:600;">P. Unit.</th>
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:center;font-weight:600;">Qtà</th>
  <th style="padding:4px 8px;font-size:9px;color:#f3e5ff;text-align:right;font-weight:600;">Subtotale</th>
</tr>
</table>`

  const footer = (n: number, tot: number) =>
    `<div style="position:absolute;bottom:16px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:5px;display:flex;justify-content:space-between;font-size:8px;color:#aaa;line-height:1.5;">
      <span>Digi Home Design S.r.l. — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</span>
      <span style="white-space:nowrap;font-weight:bold;color:#888;">Pag. ${n} / ${tot}</span>
    </div>`

  const buckets: ArtRow[][] = []
  let remaining = [...arts]
  while (remaining.length > 0) {
    const isFirst  = buckets.length === 0
    const hdrH     = isFirst ? H_HDR1 : H_HDR_N
    const available = AVAIL - hdrH
    let count = 0, used = 0
    for (const _ of remaining) {
      const reserve = (count + 1 >= remaining.length) ? H_FOOT : 0
      if (used + H_ROW + reserve > available) break
      used += H_ROW
      count++
    }
    if (count === 0) count = 1
    buckets.push(remaining.splice(0, count))
  }
  if (buckets.length === 0) buckets.push([])

  const totalPages = buckets.length
  return buckets.map((bucket, i) => {
    const isFirst = i === 0
    const isLast  = i === totalPages - 1
    const hdr     = isFirst ? header1 : headerN
    const rows    = bucket.map(a => articoloHTML(a)).join('\n')
    const bottom  = isLast ? `
      <div style="margin-top:12px;text-align:right;padding:8px 14px;background:#f3e5ff;border-radius:4px;border-left:3px solid #4a0080;">
        <div style="font-size:10px;color:#555;margin-bottom:2px;">Totale (prezzi di listino, escluso IVA)</div>
        <div style="font-size:20px;font-weight:bold;color:#4a0080;">€ ${totale}</div>
      </div>` : ''

    return (
      `<div style="font-family:Arial,Helvetica,sans-serif;width:794px;height:${PAGE_H}px;` +
      `padding:${PAD_TOP}px 50px ${PAD_BTM}px;position:relative;background:#fff;` +
      `box-sizing:border-box;overflow:hidden;">` +
      hdr + rows + bottom +
      footer(i + 1, totalPages) +
      `</div>`
    )
  })
}

export default async function Page() {
  const cookieStore = await cookies()
  const digiCartAcquisti = cookieStore.get('digi_cart_acquisti')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''

  if (!digiCartAcquisti) redirect('/area-clienti/carrello-acquisti')

  let cart: Array<{ id: number; q: number; l?: number; h?: number; ante?: number; colore?: string; note?: string }> = []
  try { cart = JSON.parse(digiCartAcquisti) } catch { redirect('/area-clienti/carrello-acquisti') }
  if (cart.length === 0) redirect('/area-clienti/carrello-acquisti')

  const db = await getConnection()
  let arts: ArtRow[] = []
  let clienteNome = 'N/D'

  try {
    const ids = cart.map(i => i.id)
    const ph  = ids.map(() => '?').join(',')
    const [rows] = await db.query(
      `SELECT id, categoria, produttore, descrizione, unita, prezzo_vendita FROM listini WHERE id IN (${ph})`,
      ids
    ) as [{ id: number; categoria: string; produttore: string; descrizione: string; unita: string; prezzo_vendita: number }[], unknown]

    arts = cart.map((item, index) => {
      const r = rows.find(x => x.id === item.id)
      if (!r) return null
      return {
        idx: index,
        categoria: r.categoria,
        produttore: r.produttore,
        descrizione: r.descrizione,
        unita: r.unita,
        prezzo_vendita: Number(r.prezzo_vendita),
        quantita: item.q,
        larghezza_cm: item.l ?? 0,
        altezza_cm: item.h ?? 0,
        ante: item.ante ?? 1,
        colore: item.colore ?? '',
        note: item.note ?? '',
      }
    }).filter((x): x is ArtRow => x !== null)

    if (username) {
      const [uRows] = await db.query(
        'SELECT email FROM users WHERE username = ? LIMIT 1', [username]
      ) as [{ email: string }[], unknown]
      const email = uRows[0]?.email ?? ''
      if (email) {
        const [cRows] = await db.query(
          'SELECT nome, cognome, ragione_sociale FROM clienti WHERE email = ? LIMIT 1', [email]
        ) as [{ nome: string; cognome: string; ragione_sociale: string }[], unknown]
        if (cRows[0]) {
          const c = cRows[0]
          clienteNome = String(c.ragione_sociale || '').trim() || `${String(c.cognome ?? '')} ${String(c.nome ?? '')}`.trim() || username
        } else {
          clienteNome = username
        }
      } else {
        clienteNome = username
      }
    }
  } finally {
    await db.end()
  }

  if (arts.length === 0) redirect('/area-clienti/carrello-acquisti')

  const today  = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
  const totale = arts.reduce((s, a) => s + calcolaPrezzo(a), 0).toFixed(2)
  const pages  = buildPages(arts, clienteNome, today, totale)

  return <StampaAcquistiClient pages={pages} />
}
