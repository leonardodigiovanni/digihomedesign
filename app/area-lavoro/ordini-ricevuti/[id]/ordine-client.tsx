'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import PreviewInfisso from '@/components/preview-infisso'
import type { OrdineInfo, OrdineArticolo } from './page'

// Centesimi → evita accumuli floating point
function c(n: number | string | null | undefined): number { return Math.round(Number(n ?? 0) * 100) }
function e(cents: number): string { return (cents / 100).toFixed(2) }
function fmt(n: number): string { return Number(n).toFixed(2) }

function renderPrezzo(cents: number, opts?: { strike?: number; pct?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontFamily: 'monospace', gap: 1 }}>
      {opts?.strike !== undefined && Math.abs(opts.strike - cents) >= 1 && (
        <span style={{ color: '#aaa', fontSize: 14, textDecoration: 'line-through' }}>€&nbsp;{e(opts.strike)}</span>
      )}
      {opts?.pct !== undefined && opts.pct !== 0 && (
        <span style={{ fontSize: 14, color: opts.pct < 0 ? '#1565c0' : '#e65100' }}>
          {opts.pct < 0 ? `+${Math.abs(opts.pct)}%` : `−${opts.pct}%`}
        </span>
      )}
      <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>€&nbsp;{e(cents)}</span>
    </div>
  )
}

export default function OrdineClient({ ordine, articoli }: { ordine: OrdineInfo; articoli: OrdineArticolo[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set())
  const [previewArt, setPreviewArt]   = useState<OrdineArticolo | null>(null)

  function toggleExpand(id: number) {
    setExpandedIds(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const thS: React.CSSProperties = {
    padding: '8px 8px', fontSize: 14, fontWeight: 700, color: '#1a1a1a',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#fff', borderBottom: '1px solid #c8960c', whiteSpace: 'nowrap',
    fontFamily: 'monospace',
  }
  const tdS: React.CSSProperties = {
    padding: '2px 8px', fontSize: 14, color: '#333',
    borderBottom: '1px solid #c8960c', verticalAlign: 'middle',
    overflow: 'hidden', wordBreak: 'break-word', fontFamily: 'monospace',
  }

  // Raggruppa per categoria·produttore·serie
  type Gruppo = { label: string; groups: OrdineArticolo[][] }
  const catGroups: Gruppo[] = []
  const radici = articoli.filter(a => !a.parent_id)
  for (const root of radici) {
    const key   = [root.categoria, root.produttore, root.serie].filter(Boolean).join(' · ')
    const label = key || 'Articoli'
    let cg = catGroups.find(g => g.label === label)
    if (!cg) { cg = { label, groups: [] }; catGroups.push(cg) }
    const figli = articoli.filter(a => a.parent_id === root.id)
    cg.groups.push([root, ...figli])
  }

  // ─── Totali (tutto in centesimi) ────────────────────────────────────────────
  const lordoCents       = articoli.reduce((s, a) => s + c(a.prezzo_lordo || a.totale), 0)
  const nettoTotaleCents = articoli.reduce((s, a) => s + c(a.totale), 0)
  const scontiArticoliCents = articoli.reduce((s, a) => s + (c(a.prezzo_lordo || a.totale) - c(a.totale)), 0)
  const scontoCliPct     = Number(ordine.sconto_cli_pct ?? 0)
  const scontoCliCents   = Math.round(nettoTotaleCents * scontoCliPct / 100)
  const importoOrdineCents = c(ordine.importo_totale)

  let gi = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div>
        <h2 className="effetto-3d" style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          Ordine {ordine.numero || `#${ordine.id}`}
        </h2>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 8, flexWrap: 'wrap', fontSize: 13, color: '#555' }}>
          <span style={{
            background: ordine.tipo === 'preventivo' ? '#e3f2fd' : '#f0fff4',
            color:      ordine.tipo === 'preventivo' ? '#1565c0' : '#276749',
            padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
          }}>
            {ordine.tipo === 'preventivo' ? 'Da preventivo' : 'Acquisto online'}
          </span>
          <span>Data: <strong>{ordine.data_ordine}</strong></span>
        </div>
      </div>

      {articoli.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 14 }}>Nessun articolo.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {catGroups.map((cg, cgi) => (
            <div key={cgi} className="class_silver_D_safe" style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '6px 14px', background: '#fff', borderBottom: '1px solid #c8960c', fontSize: 12, fontWeight: 700, color: '#7a6000', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {cg.label}
              </div>
              <table className="carrello-table ordine-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: 70 }} />
                  <col style={{ width: 72 }} />
                  <col />
                  <col style={{ width: 80 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th style={{ ...thS, textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                      </div>
                    </th>
                    <th style={{ ...thS, textAlign: 'center' }}>Q.tà<br/>Rif.</th>
                    <th style={thS}>Articolo</th>
                    <th style={{ ...thS, textAlign: 'center' }}>Prezzo<br/>€</th>
                  </tr>
                </thead>
                <tbody>
                  {cg.groups.map((group, groupIdx) => {
                    gi++
                    const root       = group[0]
                    const children   = group.slice(1)
                    const isExpanded = expandedIds.has(root.id)
                    const hasDetails = children.length > 0
                    const hasPreview = !!(root.abbr || root.foto_url)

                    // Prezzi in centesimi
                    const rootLordoCents  = c(root.prezzo_lordo || root.totale)
                    const rootNettoCents  = c(root.totale)
                    const rootScontoPct   = Number(root.sconto_art_pct ?? 0)

                    const gruppoLordoCents = rootLordoCents + children.reduce((s, ch) => s + c(ch.prezzo_lordo || ch.totale), 0)
                    const gruppoNettoCents = rootNettoCents  + children.reduce((s, ch) => s + c(ch.totale), 0)

                    const expandBgRoot = isExpanded ? '#b8d9b8' : undefined
                    const expandBg    = isExpanded ? '#d6ecd6' : undefined

                    return (
                      <React.Fragment key={root.id}>
                        {/* Riga articolo principale */}
                        <tr style={{ background: expandBgRoot ?? '#fff', borderTop: groupIdx > 0 ? '1px solid #c8960c' : undefined }}>

                          {/* Col 1: eye + toggle */}
                          <td style={{ ...tdS, textAlign: 'center', padding: '4px 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                              <button
                                onClick={() => hasPreview ? setPreviewArt(root) : undefined}
                                disabled={!hasPreview}
                                className={`${hasPreview ? 'btn-black' : 'btn-gray'} btn-icon`}
                                title="Anteprima"
                                style={{ fontFamily: 'inherit' }}>
                                <svg style={{ position: 'relative', zIndex: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </button>
                              {hasDetails && (
                                <button type="button" onClick={() => toggleExpand(root.id)}
                                  className="btn-black btn-icon"
                                  style={{ fontFamily: 'inherit', gap: 2 }}>
                                  <svg style={{ position: 'relative', zIndex: 1 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="10" cy="18" r="2" fill="currentColor" stroke="none"/></svg>
                                  <span style={{ position: 'relative', zIndex: 1, fontSize: 10 }}>{isExpanded ? '▴' : '▾'}</span>
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Col 2: qty / rif */}
                          <td style={{ ...tdS, padding: 0, height: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #c8960c', fontSize: 14, color: '#1a1a1a', padding: '0 4px' }}>
                                N°&nbsp;{Number(root.quantita)}
                              </div>
                              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#1a1a1a', padding: '0 4px' }}>
                                Rif#{String(gi).padStart(3, '0')}
                              </div>
                            </div>
                          </td>

                          {/* Col 3: articolo */}
                          <td style={{ ...tdS, paddingLeft: 8, textAlign: 'left' }}>
                            {root.descrizione || '—'}
                            {(() => {
                              const parts: string[] = []
                              if (root.larghezza_cm > 0 && root.altezza_cm > 0) parts.push(`${root.larghezza_cm}×${root.altezza_cm} cm`)
                              if (root.n_ante > 1) parts.push(`${root.n_ante} ante`)
                              if (root.colore) parts.push(root.colore)
                              if (root.prezzo_unit > 0) parts.push(`€ ${fmt(root.prezzo_unit)}/${root.unita}`)
                              return parts.length > 0 && <div style={{ fontSize: 14, color: '#555', marginTop: 1 }}>{parts.join(' · ')}</div>
                            })()}
                          </td>

                          {/* Col 4: prezzo */}
                          <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                            {isExpanded
                              ? renderPrezzo(rootNettoCents, {
                                  strike: rootScontoPct !== 0 ? rootLordoCents : undefined,
                                  pct:    rootScontoPct !== 0 ? rootScontoPct : undefined,
                                })
                              : (() => {
                                  const gruppoPctSconto = gruppoLordoCents > 0 ? Math.round((gruppoLordoCents - gruppoNettoCents) / gruppoLordoCents * 100) : 0
                                  return renderPrezzo(gruppoNettoCents, {
                                    strike: gruppoLordoCents > gruppoNettoCents ? gruppoLordoCents : undefined,
                                    pct:    gruppoPctSconto > 0 ? gruppoPctSconto : undefined,
                                  })
                                })()
                            }
                          </td>
                        </tr>

                        {/* Righe caratteristiche (espanse) */}
                        {isExpanded && children.map(child => {
                          const chLordoCents = c(child.prezzo_lordo || child.totale)
                          const chNettoCents = c(child.totale)
                          const chScontoPct  = Number(child.sconto_art_pct ?? 0)
                          return (
                            <tr key={child.id} style={{ background: expandBg ?? 'rgba(0,0,0,0.04)' }}>
                              <td style={{ ...tdS, padding: 4, textAlign: 'center' }}>
                                {child.foto_url && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={child.foto_url.startsWith('/') ? child.foto_url : `/${child.foto_url}`}
                                    alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 4, display: 'block', margin: '0 auto' }} />
                                )}
                              </td>
                              <td style={{ ...tdS, textAlign: 'center', fontSize: 14, color: '#555', padding: '2px 4px' }}>Caratt.</td>
                              <td style={{ ...tdS, paddingLeft: 12, textAlign: 'left' }}>
                                {child.descrizione || '—'}
                              </td>
                              <td style={{ ...tdS, whiteSpace: 'nowrap', padding: '2px 0 2px 4px' }}>
                                {renderPrezzo(chNettoCents, {
                                  strike: chScontoPct !== 0 ? chLordoCents : undefined,
                                  pct:    chScontoPct !== 0 ? chScontoPct  : undefined,
                                })}
                              </td>
                            </tr>
                          )
                        })}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ─── Totali ──────────────────────────────────────────────────────────── */}
      {importoOrdineCents > 0 && (() => {
        const row = (label: string, value: string, opts?: { color?: string; bold?: boolean; separator?: boolean; large?: boolean }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...(opts?.separator ? { borderTop: '1px solid #dde3ed', paddingTop: 6, marginTop: 2 } : {}) }}>
            <span style={{ fontSize: 14, color: opts?.color ?? '#555', fontWeight: opts?.bold ? 600 : 400, fontFamily: 'monospace' }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: opts?.bold ? 700 : 400, color: opts?.color ?? '#444', minWidth: 110, textAlign: 'right', fontFamily: 'monospace' }}>{value}</span>
          </div>
        )
        const hasScontiArt = scontiArticoliCents >= 1
        const hasScontoCli = scontoCliCents >= 1
        return (
          <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 8, padding: '12px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {hasScontiArt && row('Listino (escluso IVA):', `€ ${e(lordoCents)}`)}
            {hasScontiArt && row('Sconti articolo:', `− € ${e(scontiArticoliCents)}`, { color: '#e65100' })}
            {(hasScontiArt || hasScontoCli) && row('Subtotale:', `€ ${e(nettoTotaleCents)}`, { separator: hasScontiArt })}
            {hasScontoCli && row(
              scontoCliPct === 5 ? 'Sconto di benvenuto (5%):' : `Sconto riservato al cliente (${scontoCliPct}%):`,
              `− € ${e(scontoCliCents)}`,
              { color: '#e65100' }
            )}
            {row('Importo ordine:', `€ ${e(importoOrdineCents)}`, { bold: true, large: true, color: '#111', separator: true })}
          </div>
        )
      })()}

      {/* Torna */}
      <div>
        <Link href="/area-lavoro/ordini-ricevuti" className="btn-black"
          style={{ padding: '0 28px' }}>
          ← Torna agli ordini
        </Link>
      </div>

      {/* Preview modale */}
      {previewArt && (
        <div onClick={() => setPreviewArt(null)}
          style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewArt.abbr ? (
              <PreviewInfisso
                larghezza_cm={previewArt.larghezza_cm || 100}
                altezza_cm={previewArt.altezza_cm || 150}
                colore={previewArt.colore || 'Bianco'}
                descrizione={previewArt.descrizione}
                tipo_prodotto={previewArt.categoria}
                n_ante={previewArt.n_ante || 1}
                abbr={previewArt.abbr}
                profilo_mm={previewArt.profilo_mm}
                bar_color={previewArt.bar_color ?? undefined}
                bar_color_acc={previewArt.bar_color_acc ?? undefined}
                maxHeight="100vh"
              />
            ) : previewArt.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewArt.foto_url.startsWith('/') ? previewArt.foto_url : `/${previewArt.foto_url}`}
                alt={previewArt.descrizione}
                style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', display: 'block' }} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
