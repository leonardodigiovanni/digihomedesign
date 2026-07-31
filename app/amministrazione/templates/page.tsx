import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConnection } from '@/lib/db'
import type { Metadata } from 'next'
import TemplatesClient, { type Template, type DisegnoTemplate, type ProvvisorioTemplate } from './templates-client'

export const metadata: Metadata = { title: 'Template Preventivi' }

const DEFAULT_PROVVISORIO_HEADER =
  `<table style="width:100%;margin-bottom:14px;border-collapse:collapse;"><tr>` +
  `<td style="vertical-align:top;width:50%;">` +
  `<img src="/images/header/DIGIHOMEDESIGN.webp" alt="Logo" style="height:46px;margin-bottom:7px;display:block;"/>` +
  `<div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Digi Home Design S.r.l.</div>` +
  `<div style="font-size:10px;color:#555;line-height:1.55;margin-top:3px;">` +
  `Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>info@digi-home-design.com` +
  `</div></td>` +
  `<td style="vertical-align:top;text-align:right;width:50%;">` +
  `<img src="/images/volantino/nome_tr.webp" alt="Logo 2" style="height:46px;"/></td>` +
  `</tr></table>` +
  `<hr style="border:none;border-top:2px solid #1a3a5c;margin:0 0 12px;"/>` +
  `<table style="width:100%;margin-bottom:12px;border-collapse:collapse;"><tr>` +
  `<td style="vertical-align:top;width:50%;">` +
  `<div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;">Data</div>` +
  `<div style="font-size:12px;font-weight:bold;">{{data}}</div>` +
  `<div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:6px 0 2px;">Tipo</div>` +
  `<div style="font-size:12px;font-weight:bold;color:#1a3a5c;">Preventivo Provvisorio</div>` +
  `</td>` +
  `<td style="vertical-align:top;text-align:right;width:50%;">` +
  `<div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;">Spett.le</div>` +
  `<div style="font-size:13px;font-weight:bold;color:#1a3a5c;">{{cliente_nome}}</div>` +
  `</td></tr></table>` +
  `<div style="font-size:12px;margin-bottom:6px;"><strong>Oggetto:</strong> Preventivo provvisorio</div>` +
  `<div style="font-size:12px;margin-bottom:10px;line-height:1.6;">Gentile Cliente,<br/>vi trasmettiamo la nostra stima indicativa dei seguenti articoli:</div>` +
  `<div style="font-size:11px;margin-bottom:14px;padding:8px 12px;background:#f0f4fa;border-left:3px solid #1a3a5c;line-height:1.7;color:#444;">` +
  `<strong>Importante:</strong> Il presente preventivo è da intendersi come stima orientativa basata sui prezzi di listino correnti. ` +
  `I prezzi definitivi potranno variare a seguito di sopralluogo tecnico e rilevazione delle misure effettive.<br/>` +
  `Per confermare il preventivo e concordare un appuntamento si prega di contattare la nostra azienda ai recapiti sopra indicati.` +
  `</div>`

const DEFAULT_DISEGNO_HTML = (w: number, h: number) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;width:${w}px;height:${h}px;padding:36px 44px 50px;box-sizing:border-box;overflow:hidden;position:relative;background:#fff;">` +
  `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">` +
  `<img src="/images/header/DIGIHOMEDESIGN.webp" alt="Logo" style="height:40px;display:block;" />` +
  `<img src="/images/volantino/nome_tr.webp" alt="" style="height:40px;display:block;" /></div>` +
  `<hr style="border:none;border-top:2px solid #1a3a5c;margin:0 0 10px;" />` +
  `<div style="text-align:right;font-size:10px;color:#666;margin-bottom:8px;">{{data}}</div>` +
  `{{titolo}}` +
  `<div style="display:flex;justify-content:center;">{{svg}}</div>` +
  `<div style="position:absolute;bottom:16px;left:44px;right:44px;border-top:1px solid #ddd;padding-top:5px;font-size:8px;color:#aaa;">` +
  `Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</div></div>`

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')

  const db = await getConnection()
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS preventivo_templates (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        nome       VARCHAR(200) NOT NULL,
        html       LONGTEXT NOT NULL,
        attivo     TINYINT(1) NOT NULL DEFAULT 1,
        tipo       VARCHAR(50) NOT NULL DEFAULT 'preventivo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Aggiunge colonna tipo se la tabella esisteva già senza
    try {
      await db.execute(`ALTER TABLE preventivo_templates ADD COLUMN tipo VARCHAR(50) NOT NULL DEFAULT 'preventivo'`)
    } catch { /* colonna già presente */ }

    // Inserisce i template disegno default se non esistono
    const [dpRows] = await db.query(
      `SELECT id FROM preventivo_templates WHERE tipo = 'disegno_portrait' LIMIT 1`
    ) as [Record<string, unknown>[], unknown]
    if ((dpRows as unknown[]).length === 0) {
      await db.execute(
        `INSERT INTO preventivo_templates (nome, html, attivo, tipo) VALUES (?, ?, 1, 'disegno_portrait')`,
        ['Template Disegno Verticale', DEFAULT_DISEGNO_HTML(794, 1123)]
      )
    }

    const [dlRows] = await db.query(
      `SELECT id FROM preventivo_templates WHERE tipo = 'disegno_landscape' LIMIT 1`
    ) as [Record<string, unknown>[], unknown]
    if ((dlRows as unknown[]).length === 0) {
      await db.execute(
        `INSERT INTO preventivo_templates (nome, html, attivo, tipo) VALUES (?, ?, 1, 'disegno_landscape')`,
        ['Template Disegno Orizzontale', DEFAULT_DISEGNO_HTML(1123, 794)]
      )
    }

    // Migrazione: rimuove "Disegno Infisso" hardcoded e aggiusta struttura template disegno
    await db.execute(
      `UPDATE preventivo_templates
       SET html = REPLACE(
         REPLACE(html,
           '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:16px;"><div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Disegno Infisso</div><div style="font-size:10px;color:#666;">{{data}}</div></div>',
           '<div style="text-align:right;font-size:10px;color:#666;margin-bottom:8px;">{{data}}</div>'
         ),
         '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;"><div style="font-size:15px;font-weight:bold;color:#1a3a5c;">Disegno Infisso</div><div style="font-size:10px;color:#666;">{{data}}</div></div>',
         '<div style="text-align:right;font-size:10px;color:#666;margin-bottom:8px;">{{data}}</div>'
       )
       WHERE tipo IN ('disegno_portrait','disegno_landscape')`
    )
    // Migrazione: aggiunge {{titolo}} ai template disegno esistenti che non ce l'hanno
    await db.execute(
      `UPDATE preventivo_templates SET html = REPLACE(html, '<div style="display:flex;justify-content:center;">{{svg}}</div>', '{{titolo}}<div style="display:flex;justify-content:center;">{{svg}}</div>')
       WHERE tipo IN ('disegno_portrait','disegno_landscape') AND html NOT LIKE '%{{titolo}}%'`
    )

    // Inserisce il template provvisorio default se non esiste
    const [ppRows] = await db.query(
      `SELECT id FROM preventivo_templates WHERE tipo = 'preventivo_provvisorio' LIMIT 1`
    ) as [Record<string, unknown>[], unknown]
    if ((ppRows as unknown[]).length === 0) {
      await db.execute(
        `INSERT INTO preventivo_templates (nome, html, attivo, tipo) VALUES (?, ?, 1, 'preventivo_provvisorio')`,
        ['Template Preventivo Provvisorio', DEFAULT_PROVVISORIO_HEADER]
      )
    }

    // Carica template preventivo
    const [prevRows] = await db.query(
      `SELECT id, nome, html, attivo, updated_at FROM preventivo_templates WHERE tipo = 'preventivo' ORDER BY attivo DESC, id ASC`
    ) as [Record<string, unknown>[], unknown]

    const templates: Template[] = (prevRows as Record<string, unknown>[]).map(r => ({
      id: Number(r.id),
      nome: String(r.nome ?? ''),
      html: String(r.html ?? ''),
      attivo: Number(r.attivo),
      updated_at: r.updated_at instanceof Date
        ? r.updated_at.toLocaleDateString('it-IT')
        : String(r.updated_at ?? ''),
    }))

    // Carica template disegno
    const [disegnoRows] = await db.query(
      `SELECT tipo, html, updated_at FROM preventivo_templates WHERE tipo IN ('disegno_portrait','disegno_landscape')`
    ) as [Record<string, unknown>[], unknown]

    const disegnoMap = Object.fromEntries(
      (disegnoRows as Record<string, unknown>[]).map(r => [String(r.tipo), { html: String(r.html ?? ''), updated_at: r.updated_at instanceof Date ? r.updated_at.toLocaleDateString('it-IT') : String(r.updated_at ?? '') }])
    )

    const disegnoTemplates: DisegnoTemplate[] = [
      { tipo: 'disegno_portrait',  label: 'Template Disegno Verticale',    ...(disegnoMap['disegno_portrait']  ?? { html: '', updated_at: '' }) },
      { tipo: 'disegno_landscape', label: 'Template Disegno Orizzontale',  ...(disegnoMap['disegno_landscape'] ?? { html: '', updated_at: '' }) },
    ]

    // Carica template provvisorio
    const [ppLoadRows] = await db.query(
      `SELECT html, updated_at FROM preventivo_templates WHERE tipo = 'preventivo_provvisorio' LIMIT 1`
    ) as [Record<string, unknown>[], unknown]
    const ppRow = (ppLoadRows as Record<string, unknown>[])[0]
    const provvisorioTemplate: ProvvisorioTemplate = {
      html:       String(ppRow?.html ?? DEFAULT_PROVVISORIO_HEADER),
      updated_at: ppRow?.updated_at instanceof Date ? ppRow.updated_at.toLocaleDateString('it-IT') : String(ppRow?.updated_at ?? ''),
    }

    return <TemplatesClient templates={templates} disegnoTemplates={disegnoTemplates} provvisorioTemplate={provvisorioTemplate} />
  } finally {
    await db.end()
  }
}
