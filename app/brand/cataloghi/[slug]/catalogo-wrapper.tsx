'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import AggiungiArticolo, { type ArticoloListino } from './aggiungi-articolo'
import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'

type Voce = { id: number; nome: string; serie?: string; pdf_filename: string; pdf_label: string; listino_categoria: string | null; descrizione?: string | null }

const CatalogoClient = dynamic(() => import('./catalogo-client'), {
  ssr: false,
  loading: () => <p className="fs-14" style={{ color: '#aaa' }}>Caricamento…</p>,
})

type Props = {
  voci: Voce[]
  articoliPerListino: Record<string, ArticoloListino[]>
  isStaff: boolean
  isLoggedIn: boolean
  preventiviBozza: PreventivoDestOption[]
  cartNonVuoto: boolean
  parentPendente?: { uid: number; desc: string }
  categorySlug?: string
  basePath?: string
  carrelloHref?: string
  preventivoClienteBaseHref?: string
  submitLabel?: string
}

export default function CatalogoWrapper({ voci, articoliPerListino, isStaff, isLoggedIn, preventiviBozza, cartNonVuoto, parentPendente, categorySlug, basePath, carrelloHref, preventivoClienteBaseHref, submitLabel }: Props) {
  const [selectedVoce, setSelectedVoce] = useState<Voce | null>(null)

  let articoliVisibili: ArticoloListino[]
  if (selectedVoce !== null) {
    articoliVisibili = selectedVoce.listino_categoria
      ? articoliPerListino[selectedVoce.listino_categoria] ?? []
      : []
  } else {
    const seen = new Set<number>()
    articoliVisibili = []
    for (const list of Object.values(articoliPerListino)) {
      for (const a of list) {
        if (!seen.has(a.id)) { seen.add(a.id); articoliVisibili.push(a) }
      }
    }
  }

  return (
    <>
      <CatalogoClient voci={voci} onSelect={setSelectedVoce} categorySlug={categorySlug} basePath={basePath} />

      {articoliVisibili.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <AggiungiArticolo
            articoli={articoliVisibili}
            isStaff={isStaff}
            isLoggedIn={isLoggedIn}
            preventiviBozza={preventiviBozza}
            cartNonVuoto={cartNonVuoto}
            parentPendente={parentPendente}
            carrelloHref={carrelloHref}
            preventivoClienteBaseHref={preventivoClienteBaseHref}
            submitLabel={submitLabel}
          />
        </div>
      )}
    </>
  )
}
