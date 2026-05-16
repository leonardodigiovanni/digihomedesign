import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Divani a Palermo — Tessuti e Rivestimenti su Misura',
  description: 'Divani a Palermo: rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa. Qualità artigianale e materiali selezionati.',
  alternates: { canonical: 'https://www.digi-home-design.com/tessuti/divani' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Divani a Palermo — Tessuti e Rivestimenti su Misura',
    description: 'Divani a Palermo: rivestimenti in tessuto su misura, rifacimento imbottitura e personalizzazione completa. Qualità artigianale e materiali selezionati.',
    url: 'https://www.digi-home-design.com/tessuti/divani',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/tessuti" style={{ color: '#888', textDecoration: 'underline' }}>Tessuti</Link> / Divani
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Divani a Palermo
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Offriamo un servizio completo per il <strong>rivestimento e il rifacimento dei divani a Palermo</strong>: dalla scelta del tessuto alla realizzazione artigianale, fino alla consegna e al montaggio nel tuo spazio. Lavoriamo con stoffe tecniche, velluti, lini e materiali sintetici di alta qualità, selezionati per durabilità ed estetica.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px 14px' }}>
                  <span className="testo-articoli">Fotografia da scegliere</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Sia che tu voglia rinnovare un divano esistente o scegliere un rivestimento personalizzato per un acquisto nuovo, i nostri artigiani ti guidano nella selezione dei materiali più adatti allo stile della tua casa e all&apos;uso quotidiano. I tessuti disponibili coprono ogni gusto: dal classico al moderno, dall&apos;elegante al pratico.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Operiamo su tutto il territorio palermitano, con sopralluogo gratuito a domicilio. Contattaci per un preventivo personalizzato e scopri come trasformare il tuo divano con la qualità artigianale che ci contraddistingue dal 1972.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
          <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <CtaPreventivo />
        </div>
        <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
          <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <CtaCantiere />
        </div>
      </div>

      </div>

      <Link href="/tessuti" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna a Tessuti
      </Link>
    </div>
  )
}
