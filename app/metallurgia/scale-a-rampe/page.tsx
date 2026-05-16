import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Scale a Rampe a Palermo — Ferro e Acciaio su Misura',
  description: 'Scale a rampe in ferro e acciaio a Palermo su misura: gradini in legno o lamiera mandorlata, strutture portanti saldate, parapetti e corrimano inclusi.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/scale-a-rampe' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Scale a Rampe a Palermo — Ferro e Acciaio su Misura',
    description: 'Scale a rampe in ferro e acciaio a Palermo su misura: gradini in legno o lamiera mandorlata, strutture portanti saldate, parapetti e corrimano inclusi.',
    url: 'https://www.digi-home-design.com/metallurgia/scale-a-rampe',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Scale a Rampe
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Scale a Rampe a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Prima riga: primo articolo + foto */}
          <div className="storia-row" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px', flex: 1, minWidth: 0 }}>
              <p className="testo-articoli" style={{ margin: 0 }}>
                Realizziamo <strong>scale a rampe in ferro e acciaio su misura a Palermo</strong>: scale a una, due o tre rampe con pianerottolo intermedio, struttura portante in ferro piatto o tubolare saldata in officina, gradini in legno massello, legno lamellare o lamiera mandorlata antiscivolo. Adatte per interni residenziali, soppalchi e accessi esterni.
              </p>
            </div>
            <div className="storia-foto" style={{ flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
              <div className="page-card storia-card-1" style={{ width: 220, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/scale-a-rampa/photo_2026-04-15_23-24-17.jpg" alt="Scala a rampe in ferro" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
              <div className="page-card storia-card-2" style={{ width: 220, boxShadow: '0 6px 22px rgba(0,0,0,0.2)' }}>
                <div style={{ position: 'relative', width: 220, height: 240 }}>
                  <Image src="/images/metallurgia/scale-a-rampa/photo_2026-04-15_23-24-19.jpg" alt="Scala a rampe installata" fill sizes="220px" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Secondo articolo */}
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni scala viene progettata rispettando le proporzioni ergonomiche (alzata 17–18 cm, pedata 28–30 cm) e i requisiti della normativa UNI EN 14975. Le strutture vengono verniciate a polvere in qualsiasi colore RAL e assemblate in opera con tasselli chimici ad alta resistenza. Parapetti e corrimano sono abbinabili alle ringhiere dello stesso stile.
            </p>
          </div>

        </div>

        {/* Terzo articolo */}
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '24px 28px' }}>
          <p className="testo-articoli" style={{ margin: 0 }}>
            Contattaci per un sopralluogo gratuito e un preventivo su misura a Palermo e provincia.
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

      <Link href="/metallurgia" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
