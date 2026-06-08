'use client'

import dynamic from 'next/dynamic'

type Voce = { nome: string; pdf_filename: string; pdf_label: string }

const VoceViewerInner = dynamic(() => import('./voce-viewer-inner'), {
  ssr: false,
  loading: () => <p className="fs-14" style={{ color: '#888', marginTop: 32 }}>Caricamento visualizzatore…</p>,
})

export default function VoceViewer({ voce }: { voce: Voce }) {
  return <VoceViewerInner voce={voce} />
}
