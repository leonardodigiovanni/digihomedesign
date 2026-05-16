'use client'

import dynamic from 'next/dynamic'

type Voce = { id: number; nome: string; pdf_filename: string; pdf_label: string }

const CatalogoClient = dynamic(() => import('./catalogo-client'), {
  ssr: false,
  loading: () => <p className="fs-14" style={{ color: '#aaa' }}>Caricamento…</p>,
})

export default function CatalogoWrapper({ voci }: { voci: Voce[] }) {
  return <CatalogoClient voci={voci} />
}
