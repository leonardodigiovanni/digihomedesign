import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Caldaie a Palermo — Installazione e Manutenzione',
  description: 'Caldaie a Palermo: vendita, installazione e manutenzione di caldaie a condensazione, a gas e a biomassa. Tecnici abilitati e pronto intervento.',
  alternates: { canonical: 'https://www.digi-home-design.com/termodinamica/caldaie' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Caldaie a Palermo — Installazione e Manutenzione',
    description: 'Caldaie a Palermo: vendita, installazione e manutenzione di caldaie a condensazione, a gas e a biomassa. Tecnici abilitati e pronto intervento.',
    url: 'https://www.digi-home-design.com/termodinamica/caldaie',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/termodinamica" style={{ color: '#888', textDecoration: 'underline' }}>Termodinamica</Link> / Caldaie
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Caldaie a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card" style={{ flex: '1 1 220px', maxWidth: 480 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="(max-width: 480px) 100vw, 480px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Offriamo un servizio completo per le <strong>caldaie a Palermo</strong>: fornitura, installazione, messa in servizio, manutenzione ordinaria e straordinaria, e pronto intervento per guasti. Lavoriamo con caldaie murali e a basamento a condensazione dei principali marchi — Vaillant, Baxi, Ariston, Ferroli — per massimizzare l&apos;efficienza e ridurre i consumi di gas.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              La manutenzione annuale obbligatoria per legge viene eseguita da tecnici abilitati con rilascio del libretto di impianto aggiornato. Offriamo contratti di manutenzione programmata con priorità di intervento in caso di guasto.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo anche le pratiche per gli incentivi alla sostituzione delle caldaie obsolete con modelli ad alta efficienza energetica (classe A+). Contattaci per un preventivo gratuito.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/termodinamica" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Torna a Termodinamica</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
