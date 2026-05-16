'use server'

import { cookies, headers } from 'next/headers'
import { getConnection } from '@/lib/db'

type ArticoloLog = {
  categoria: string
  produttore: string
  descrizione: string
  unita: string
  prezzo_vendita: number
  quantita: number
  sconto_articolo?: number
  tipo?: string
}

export async function logPdfRequest(articoli: ArticoloLog[]) {
  const headersList = await headers()
  const cookieStore = await cookies()

  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'sconosciuto'

  const utente = cookieStore.get('session_user')?.value ?? '(non loggato)'
  const ruolo  = cookieStore.get('session_role')?.value ?? '—'
  const ora    = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })

  const righe = articoli.map((a, i) => {
    const subtot = (a.prezzo_vendita * a.quantita).toFixed(2)
    const promo  = (a.sconto_articolo ?? 0) > 0
      ? ` <b style="color:#b45000">[PROMO ${a.sconto_articolo}%]</b>` : ''
    const rientro = a.tipo === 'caratteristica' ? '&nbsp;&nbsp;↳ ' : ''
    return `<tr style="background:${i % 2 === 0 ? '#f9f9f9' : '#fff'}">
      <td style="padding:5px 9px;border:1px solid #e0e0e0">${rientro}${a.categoria}</td>
      <td style="padding:5px 9px;border:1px solid #e0e0e0">${a.produttore}</td>
      <td style="padding:5px 9px;border:1px solid #e0e0e0">${a.descrizione}${promo}</td>
      <td style="padding:5px 9px;border:1px solid #e0e0e0;text-align:center">${a.quantita} ${a.unita}</td>
      <td style="padding:5px 9px;border:1px solid #e0e0e0;text-align:right">€ ${a.prezzo_vendita.toFixed(2)}</td>
      <td style="padding:5px 9px;border:1px solid #e0e0e0;text-align:right"><b>€ ${subtot}</b></td>
    </tr>`
  }).join('')

  const totale = articoli
    .filter(a => a.tipo !== 'caratteristica')
    .reduce((s, a) => s + a.prezzo_vendita * a.quantita, 0)

  const corpo = `
<div style="font-family:sans-serif;font-size:13px;color:#1a1a1a">
  <table style="border-collapse:collapse;margin-bottom:14px">
    <tr><td style="padding:3px 14px 3px 0;color:#555;font-weight:600">Data/ora</td><td>${ora}</td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#555;font-weight:600">IP</td><td><code>${ip}</code></td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#555;font-weight:600">Utente</td><td>${utente}</td></tr>
    <tr><td style="padding:3px 14px 3px 0;color:#555;font-weight:600">Ruolo</td><td>${ruolo}</td></tr>
  </table>
  <table style="border-collapse:collapse;width:100%;font-size:12px">
    <thead>
      <tr style="background:#1a3a5c;color:#fff">
        <th style="padding:6px 9px;text-align:left">Categoria</th>
        <th style="padding:6px 9px;text-align:left">Produttore</th>
        <th style="padding:6px 9px;text-align:left">Descrizione</th>
        <th style="padding:6px 9px;text-align:center">Qtà</th>
        <th style="padding:6px 9px;text-align:right">Prezzo</th>
        <th style="padding:6px 9px;text-align:right">Subtot.</th>
      </tr>
    </thead>
    <tbody>${righe}</tbody>
    <tfoot>
      <tr style="background:#f0f0f0">
        <td colspan="5" style="padding:7px 9px;font-weight:700;text-align:right;border:1px solid #e0e0e0">Totale indicativo</td>
        <td style="padding:7px 9px;font-weight:700;text-align:right;border:1px solid #e0e0e0">€ ${totale.toFixed(2)}</td>
      </tr>
    </tfoot>
  </table>
</div>`

  const conn = await getConnection()
  try {
    await conn.execute(
      'INSERT INTO email_inbox (tipo, oggetto, corpo, letto) VALUES (?, ?, ?, 0)',
      ['log_pdf_preventivo', `PDF preventivo — ${utente} — IP ${ip}`, corpo],
    )
  } finally {
    await conn.end()
  }
}
