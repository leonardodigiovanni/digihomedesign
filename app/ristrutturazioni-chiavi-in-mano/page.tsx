import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import ContattoIngegnereForm from '@/components/contatto-ingegnere-form'

import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
  description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
  alternates: { canonical: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Ristrutturazioni Chiavi in Mano a Palermo — Unico Referente',
    description: 'Ristrutturazioni chiavi in mano a Palermo: dal progetto alla consegna, un unico referente gestisce ogni fase. Preventivo gratuito e cantiere seguito online.',
    url: 'https://www.digi-home-design.com/ristrutturazioni-chiavi-in-mano',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Ristrutturazioni Chiavi in Mano
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>
        Ristrutturazioni Chiavi in Mano a Palermo
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div style={{ background: '#fff', border: '2px solid #c8960c', borderRadius: 10, padding: '24px 28px' }}>

          {/* Card foto — dentro il riquadro, centrate in alto */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <div className="page-card" style={{ width: 280, boxShadow: '0 8px 28px rgba(0,0,0,0.25)' }}>
              <div style={{ position: 'relative', width: 280, height: 300 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="280px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px 12px 14px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
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
              Le nostre <strong>ristrutturazioni chiavi in mano a Palermo</strong> ti permettono di rinnovare casa o ufficio senza stress: un unico referente coordina tutte le lavorazioni — muratura, impianti, pavimenti, infissi, tinteggiatura — dalla progettazione alla consegna delle chiavi.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gestiamo pratiche edilizie, coordinamento delle maestranze e approvvigionamento dei materiali, garantendo rispetto dei tempi e del budget concordato. Grazie al nostro sistema di monitoraggio cantiere online, puoi seguire l&apos;avanzamento dei lavori in tempo reale dal tuo smartphone o computer.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Siamo operativi su tutto il territorio di Palermo e provincia. Contattaci per un sopralluogo gratuito e scopri come possiamo trasformare il tuo immobile con un servizio completo, trasparente e senza pensieri.
            </p>
          </div>

        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', padding: '24px 28px', background: '#fdfcf8', border: '2px solid #c8960c', borderRadius: 10 }}>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai un progetto in mente?</p>
            <ContattoIngegnereForm />
          </div>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
            <p className="testo-articoli" style={{ margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
            <CtaCantiere />
          </div>
        </div>

      </div>

      <Link href="/" className="fs-12" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>
        ← Torna alla home
      </Link>
    </div>
  )
}
