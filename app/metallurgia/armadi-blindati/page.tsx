import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'
export const metadata: Metadata = {
  title: 'Armadi Blindati a Palermo — Armi, Documenti e Valori',
  description: 'Armadi blindati a Palermo: fornitura e installazione di armadi per armi (omologati ministerialmente), documenti e valori con serrature di sicurezza certificate.',
  alternates: { canonical: 'https://www.digi-home-design.com/metallurgia/armadi-blindati' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Armadi Blindati a Palermo — Armi, Documenti e Valori',
    description: 'Armadi blindati a Palermo: fornitura e installazione di armadi per armi (omologati ministerialmente), documenti e valori con serrature di sicurezza certificate.',
    url: 'https://www.digi-home-design.com/metallurgia/armadi-blindati',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Armadi Blindati
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 16 }}>Armadi Blindati a Palermo</h1>

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
              Forniamo e installiamo <strong>armadi blindati a Palermo</strong> per la custodia di armi da fuoco (omologati dal Ministero dell&apos;Interno), documenti riservati, valori e oggetti preziosi. Gli armadi sono costruiti in acciaio da 3 a 5 mm con serrature a chiave doppia mappa, a combinazione meccanica o elettronica con tastiera digitale.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli armadi per armi rispettano le disposizioni del TULPS e del D.M. 15/07/1997 sulla custodia obbligatoria: disponibili in vari formati per pistole, fucili, carabine e munizioni in scomparto separato e a norma. Forniamo il manuale tecnico per la pratica in Questura.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Gli armadi per documenti e valori sono disponibili in versione ignifuga (classe 60 o 120 minuti) con certificazione EN 1047-1. Contattaci per un preventivo gratuito.
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
