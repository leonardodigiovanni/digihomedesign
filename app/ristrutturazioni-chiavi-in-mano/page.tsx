import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import CtaPreventivo from '@/components/cta-preventivo'
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
    <div className="fs-15" style={{ padding: '0 0 64px', color: '#444', lineHeight: 1.8 }}>
      <p className="fs-12" style={{ color: '#000', marginBottom: 8, textShadow: 'none' }}>
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>Home</Link> / Ristrutturazioni Chiavi in Mano
      </p>
      <h1 className="effetto-3d fs-28" style={{ fontWeight: 700, marginBottom: 8 }}>Ristrutturazioni Chiavi in Mano a Palermo</h1>

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

        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>← Home</Link>
          <CtaPreventivo />
          <CtaCantiere />
          <Link href="/brand/contatti" className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>Chiedi info</Link>
        </div>
      </div>
      <p className="IsDebug fs-11" style={{ marginTop: 8 }}>tipo pagina fototesto contatti</p>
    </div>
  )
}
