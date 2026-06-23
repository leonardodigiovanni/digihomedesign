import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
import CtaCantiere from '@/components/cta-cantiere'

export const metadata: Metadata = {
  title: 'Massetti a Palermo — Sabbia-Cemento, Autolivellanti e Riscaldanti',
  description: 'Massetti a Palermo: massetti tradizionali in sabbia-cemento, autolivellanti a base anidrite e massetti per pannelli radianti. Posa e livellamento professionale.',
  alternates: { canonical: 'https://www.digi-home-design.com/edilizia/massetti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Massetti a Palermo — Sabbia-Cemento, Autolivellanti e Riscaldanti',
    description: 'Massetti a Palermo: massetti tradizionali in sabbia-cemento, autolivellanti a base anidrite e massetti per pannelli radianti. Posa e livellamento professionale.',
    url: 'https://www.digi-home-design.com/edilizia/massetti',
    type: 'website',
  },
}

export default function Page() {
  return (
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/edilizia" style={{ color: '#888', textDecoration: 'underline' }}>Edilizia</Link> / Massetti
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Massetti a Palermo</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: '#fff', border: '1px solid #c8960c', borderRadius: 10, padding: '16px' }}>
          <div className="vetrina-foto-row">
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
            <div className="page-card">
              <div style={{ position: 'relative', width: '100%', height: 148 }}>
                <Image src="/images/manutenzione/sito_manutenzione.png" alt="Anteprima" fill sizes="240px" style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '8px 12px 10px' }}>
                <span className="testo-articoli">Fotografia da scegliere</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Realizziamo <strong>massetti a Palermo</strong> per ogni tipo di posa: massetti tradizionali in sabbia e cemento per pavimentazioni ceramiche e in pietra, massetti autolivellanti a base di anidrite per superfici perfettamente piane in tempi rapidi, e massetti alleggeriti con argilla espansa per ridurre il carico sui solai.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Eseguiamo anche massetti per pannelli radianti a pavimento, con spessori calibrati e posa della rete di rinforzo. La corretta realizzazione del massetto è fondamentale per la durabilità della pavimentazione finale: utilizziamo pompe e macchine miscelatrici per garantire omogeneità e resistenza.
            </p>
            <p className="testo-articoli" style={{ margin: 0 }}>
              Disponibile anche il ripristino localizzato di massetti esistenti con lesioni o zone cedevoli. Preventivo gratuito a Palermo e provincia.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/edilizia" className="btn-black fs-12" style={{ flex: 1 }}>← Torna a Edilizia</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1 }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
