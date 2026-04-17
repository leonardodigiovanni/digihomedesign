import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Porte Antincendio
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Porte Antincendio a Palermo</h1>
      <p>Forniamo e installiamo <strong>porte antincendio certificate REI a Palermo</strong> per la compartimentazione degli edifici: porte tagliafuoco REI 30, REI 60 e REI 120 in acciaio verniciato, con telaio a controtelaio in acciaio zincato, guarnizioni intumescenti e maniglione antipanico omologato. Obbligatorie nei vani scala, locali tecnici, garage condominiali e attività soggette a controllo VVF.</p>
      <p style={{ marginTop: 12 }}>Ogni porta è corredata di marcatura CE, dichiarazione di prestazione (DoP) e certificato di prova EN 1634. Installiamo modelli a singola e doppia anta, con o senza maniglione antipanico, con chiudiporta aereo e selezionatore di chiusura per doppia anta. Su richiesta forniamo porte con oblò in vetro REI e passacavi a tenuta.</p>
      <p style={{ marginTop: 12 }}>Collaboriamo con tecnici abilitati per la pratica SCIA antincendio. Contattaci per un sopralluogo e un preventivo gratuito a Palermo e provincia.</p>
      {/* CTA esclusivi */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40, padding: '20px', background: '#fdfcf8', border: '1px solid #e8d89a', borderRadius: 10 }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai un progetto in mente?</p>
          <Link href="/aiuto/guida-preventivo" style={{ display: 'inline-block', padding: '10px 20px', background: '#c8960c', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Calcola il tuo preventivo
          </Link>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 12px' }}>Hai già un cantiere aperto?</p>
          <Link href="/aiuto/guida-cantiere" style={{ display: 'inline-block', padding: '10px 20px', background: '#1a1a1a', color: '#fff', borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
            Segui il tuo cantiere online
          </Link>
        </div>
      </div>
      <Link href="/metallurgia" style={{ display: 'inline-block', marginTop: 32, color: '#1a1a1a', fontWeight: 600, textDecoration: 'underline' }}>← Torna a Metallurgia</Link>
    </div>
  )
}
