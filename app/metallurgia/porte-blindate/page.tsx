import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Porte Blindate a Palermo — Classe 3, 4, 5 e 6',
  description: 'Porte blindate a Palermo: fornitura e installazione di porte blindate classe 3-6 con serrature di sicurezza multipunto. Misure standard e su misura.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/porte-blindate' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Blindate a Palermo — Classe 3, 4, 5 e 6',
    description: 'Porte blindate a Palermo: fornitura e installazione di porte blindate classe 3-6 con serrature di sicurezza multipunto. Misure standard e su misura.',
    url: 'https://www.digi-home-design.com/metallurgia/porte-blindate',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Blindate
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Porte Blindate a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/metallurgia/porte-blindate/photo_2026-04-15_23-24-58.jpg" alt="Porta blindata installata" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Porta blindata installata</span>
              </div>
            </div>
            <div className="page-card" style={{ width: 280, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>

          {/* Testo — piena larghezza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Forniamo e installiamo <strong>porte blindate a Palermo</strong> certificate dalla classe 3 alla classe 6 secondo la norma UNI EN 1627: la scelta della classe dipende dal livello di rischio e dal contesto abitativo o commerciale. Ogni porta è dotata di serratura multipunto con chiusura perimetrale, cerniere anti-scasso e pannello esterno in acciaio da almeno 1,5 mm.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Le ante sono disponibili con rivestimento esterno in acciaio inox satinato, laminato laccato o legno impiallacciato per integrarsi con l&apos;estetica dell&apos;ambiente. Installiamo modelli con apertura a destra, sinistra, doppia anta e scorrevole. La posa include la rimozione della vecchia porta, la posa del controtelaio in acciaio e il sigillamento perimetrale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Collaboriamo con i principali marchi italiani — Dierre, Alias, Oikos, Bertolotto Blindate. Contattaci per un sopralluogo e un preventivo gratuito.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10 }}>
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
