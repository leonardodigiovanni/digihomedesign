'use client'

import { useMemo, useState } from 'react'
import EcommerceShop, { type ArticoloEcommerce } from './ecommerce-shop'

const inpStyle: React.CSSProperties = {
  padding: '7px 10px', border: '1px solid #ccc',
  borderRadius: 4, fontSize: 13, fontFamily: 'inherit',
  width: '100%', boxSizing: 'border-box', color: '#222', WebkitTextFillColor: '#222',
}

function countBy(articoli: ArticoloEcommerce[], key: 'categoria' | 'produttore'): { valore: string; count: number }[] {
  const map = new Map<string, number>()
  for (const a of articoli) {
    const v = a[key]
    if (!v) continue
    map.set(v, (map.get(v) ?? 0) + 1)
  }
  return Array.from(map, ([valore, count]) => ({ valore, count })).sort((x, y) => x.valore.localeCompare(y.valore))
}

export default function EcommerceCatalog({ articoli, macro, showCategoryFilter = true }: { articoli: ArticoloEcommerce[]; macro: string; showCategoryFilter?: boolean }) {
  const [ricerca, setRicerca] = useState('')
  const [categorieSelezionate, setCategorieSelezionate] = useState<Set<string>>(new Set())
  const [marcheSelezionate, setMarcheSelezionate] = useState<Set<string>>(new Set())
  const [filtriAperti, setFiltriAperti] = useState(false)

  const categorie = useMemo(() => countBy(articoli, 'categoria'), [articoli])
  const marche = useMemo(() => countBy(articoli, 'produttore'), [articoli])

  // Articoli che rispettano ricerca/categoria/marca (tutto tranne il prezzo): il range
  // prezzo va ricalcolato su questo sottoinsieme, non sul catalogo intero — se filtro
  // per una categoria più cara, il "più economico"/"più caro" devono aggiornarsi di conseguenza.
  const articoliPerPrezzo = useMemo(() => {
    const q = ricerca.trim().toLowerCase()
    return articoli.filter(a => {
      if (q && !`${a.descrizione} ${a.produttore}`.toLowerCase().includes(q)) return false
      if (categorieSelezionate.size > 0 && !categorieSelezionate.has(a.categoria)) return false
      if (marcheSelezionate.size > 0 && !marcheSelezionate.has(a.produttore)) return false
      return true
    })
  }, [articoli, ricerca, categorieSelezionate, marcheSelezionate])

  const prezzi = articoliPerPrezzo.map(a => Number(a.prezzo_vendita) || 0)
  const prezzoMinAssoluto = prezzi.length > 0 ? Math.floor(Math.min(...prezzi) * 100) / 100 : 0
  const prezzoMaxAssoluto = prezzi.length > 0 ? Math.ceil(Math.max(...prezzi) * 100) / 100 : 0

  const [prezzoMin, setPrezzoMin] = useState(prezzoMinAssoluto)
  const [prezzoMax, setPrezzoMax] = useState(prezzoMaxAssoluto)

  // Quando cambiano gli altri filtri il range disponibile si ricalcola: riparte
  // sempre dall'estremo minimo/massimo del nuovo sottoinsieme (selezione intera).
  // Aggiustamento durante il render (non in un effect) per evitare un render extra:
  // pattern consigliato da React per "adjusting state when a prop changes".
  const [prezzoBoundsPrec, setPrezzoBoundsPrec] = useState([prezzoMinAssoluto, prezzoMaxAssoluto])
  if (prezzoBoundsPrec[0] !== prezzoMinAssoluto || prezzoBoundsPrec[1] !== prezzoMaxAssoluto) {
    setPrezzoBoundsPrec([prezzoMinAssoluto, prezzoMaxAssoluto])
    setPrezzoMin(prezzoMinAssoluto)
    setPrezzoMax(prezzoMaxAssoluto)
  }

  const scalaPrezzo = prezzoMaxAssoluto - prezzoMinAssoluto || 1
  const pctMin = ((prezzoMin - prezzoMinAssoluto) / scalaPrezzo) * 100
  const pctMax = ((prezzoMax - prezzoMinAssoluto) / scalaPrezzo) * 100
  const zMin = prezzoMin > prezzoMinAssoluto + scalaPrezzo / 2 ? 4 : 3

  const filtrati = useMemo(() => {
    return articoliPerPrezzo.filter(a => {
      const prezzo = Number(a.prezzo_vendita) || 0
      if (prezzo < prezzoMin || prezzo > prezzoMax) return false
      return true
    })
  }, [articoliPerPrezzo, prezzoMin, prezzoMax])

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, valore: string) {
    const next = new Set(set)
    if (next.has(valore)) next.delete(valore)
    else next.add(valore)
    setter(next)
  }

  const filtriAttivi = ricerca.trim() !== '' || categorieSelezionate.size > 0 || marcheSelezionate.size > 0
    || prezzoMin !== prezzoMinAssoluto || prezzoMax !== prezzoMaxAssoluto

  function azzeraFiltri() {
    setRicerca('')
    setCategorieSelezionate(new Set())
    setMarcheSelezionate(new Set())
    setPrezzoMin(prezzoMinAssoluto)
    setPrezzoMax(prezzoMaxAssoluto)
  }

  const haFiltri = (showCategoryFilter && categorie.length > 1) || marche.length > 1 || prezzoMaxAssoluto > prezzoMinAssoluto

  return (
    <div>
      <input
        type="search"
        value={ricerca}
        onChange={e => setRicerca(e.target.value)}
        placeholder="Cerca un prodotto…"
        style={{ ...inpStyle, marginBottom: 16, padding: '10px 14px', fontSize: 14 }}
      />

      {haFiltri && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setFiltriAperti(true)}
            className="btn-black"
            style={{ height: 42, borderRadius: 21, padding: '0 20px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            ☰ Filtri{filtriAttivi ? ' •' : ''}
          </button>
        </div>
      )}

      {filtriAperti && (
        <div
          onClick={() => setFiltriAperti(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, maxWidth: '85vw',
              background: '#fff', padding: '20px 16px', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#222' }}>Filtri</p>
              <button
                type="button"
                onClick={() => setFiltriAperti(false)}
                className="btn-red"
                style={{ width: 32, height: 32, borderRadius: 16, padding: 0, fontSize: 14 }}
              >
                ✕
              </button>
            </div>

            {showCategoryFilter && categorie.length > 1 && (
              <div>
                <p className="testo-articoli" style={{ margin: '0 0 8px', fontWeight: 700 }}>Categoria</p>
                {categorie.map(c => (
                  <label key={c.valore} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444', padding: '3px 0', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={categorieSelezionate.has(c.valore)}
                      onChange={() => toggle(categorieSelezionate, setCategorieSelezionate, c.valore)}
                    />
                    {c.valore} <span style={{ color: '#999' }}>({c.count})</span>
                  </label>
                ))}
              </div>
            )}

            {marche.length > 1 && (
              <div>
                <p className="testo-articoli" style={{ margin: '0 0 8px', fontWeight: 700 }}>Marca</p>
                {marche.map(m => (
                  <label key={m.valore} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#444', padding: '3px 0', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={marcheSelezionate.has(m.valore)}
                      onChange={() => toggle(marcheSelezionate, setMarcheSelezionate, m.valore)}
                    />
                    {m.valore} <span style={{ color: '#999' }}>({m.count})</span>
                  </label>
                ))}
              </div>
            )}

            {prezzoMaxAssoluto > prezzoMinAssoluto && (
              <div>
                <p className="testo-articoli" style={{ margin: '0 0 8px', fontWeight: 700 }}>Prezzo</p>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: '#444', fontWeight: 600 }}>
                  Da € {prezzoMin.toFixed(2)} a € {prezzoMax.toFixed(2)}
                </p>

                <div className="ecommerce-range-track" style={{ position: 'relative', height: 20 }}>
                  <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 4, borderRadius: 2, background: '#ddd' }} />
                  <div style={{ position: 'absolute', top: 8, height: 4, borderRadius: 2, background: '#c8960c', left: `${pctMin}%`, width: `${pctMax - pctMin}%` }} />
                  <input
                    type="range"
                    min={prezzoMinAssoluto}
                    max={prezzoMaxAssoluto}
                    step={0.01}
                    value={prezzoMin}
                    onChange={e => setPrezzoMin(Math.min(Number(e.target.value), prezzoMax))}
                    style={{ zIndex: zMin }}
                  />
                  <input
                    type="range"
                    min={prezzoMinAssoluto}
                    max={prezzoMaxAssoluto}
                    step={0.01}
                    value={prezzoMax}
                    onChange={e => setPrezzoMax(Math.max(Number(e.target.value), prezzoMin))}
                    style={{ zIndex: zMin === 3 ? 4 : 3 }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888', marginTop: 4 }}>
                  <span>€ {prezzoMinAssoluto.toFixed(2)}</span>
                  <span>€ {prezzoMaxAssoluto.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #eee' }}>
              {filtriAttivi && (
                <button type="button" onClick={azzeraFiltri} className="btn-red" style={{ height: 36, borderRadius: 18, fontSize: 12 }}>
                  Cancella filtri
                </button>
              )}
              <button type="button" onClick={() => setFiltriAperti(false)} className="btn-green" style={{ height: 42, borderRadius: 21, fontSize: 13, fontWeight: 600 }}>
                Mostra {filtrati.length} risultat{filtrati.length === 1 ? 'o' : 'i'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{ margin: '0 0 10px', fontSize: 12, color: '#888' }}>
        {filtrati.length} prodott{filtrati.length === 1 ? 'o' : 'i'}
      </p>
      <EcommerceShop articoli={filtrati} macro={macro} />
    </div>
  )
}
