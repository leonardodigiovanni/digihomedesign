import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Porte Antincendio a Palermo — Porte REI Certificate',
  description: 'Porte antincendio REI a Palermo: porte tagliafuoco certificate REI 30, REI 60 e REI 120 in acciaio per compartimentazione. Fornitura, posa e certificazione.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/porte-antincendio' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Porte Antincendio a Palermo — Porte REI Certificate',
    description: 'Porte antincendio REI a Palermo: porte tagliafuoco certificate REI 30, REI 60 e REI 120 in acciaio per compartimentazione. Fornitura, posa e certificazione.',
    url: 'https://www.digi-home-design.com/metallurgia/porte-antincendio',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Antincendio
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Porte Antincendio a Palermo</h1>

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
              Forniamo e installiamo <strong>porte antincendio certificate REI a Palermo</strong> per la compartimentazione degli edifici: porte tagliafuoco REI 30, REI 60 e REI 120 in acciaio verniciato, con telaio a controtelaio in acciaio zincato, guarnizioni intumescenti e maniglione antipanico omologato. Obbligatorie nei vani scala, locali tecnici, garage condominiali e attività soggette a controllo VVF.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Ogni porta è corredata di marcatura CE, dichiarazione di prestazione (DoP) e certificato di prova EN 1634. Installiamo modelli a singola e doppia anta, con o senza maniglione antipanico, con chiudiporta aereo e selezionatore di chiusura per doppia anta. Su richiesta forniamo porte con oblò in vetro REI e passacavi a tenuta.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Collaboriamo con tecnici abilitati per la pratica SCIA antincendio. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.
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
