import Link from 'next/link'
import type { Metadata } from 'next'

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
    <div style={{ maxWidth: 860, margin: '48px auto', padding: '0 20px 64px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>
        <Link href="/metallurgia" style={{ color: '#888', textDecoration: 'underline' }}>Metallurgia</Link> / Armadi Blindati
      </p>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Armadi Blindati a Palermo</h1>
      <p>Forniamo e installiamo <strong>armadi blindati a Palermo</strong> per la custodia di armi da fuoco (omologati dal Ministero dell&apos;Interno), documenti riservati, valori e oggetti preziosi. Gli armadi sono costruiti in acciaio da 3 a 5 mm con serrature a chiave doppia mappa, a combinazione meccanica o elettronica con tastiera digitale.</p>
      <p style={{ marginTop: 12 }}>Gli armadi per armi rispettano le disposizioni del TULPS e del D.M. 15/07/1997 sulla custodia obbligatoria: disponibili in vari formati per pistole, fucili, carabine e munizioni in scomparto separato e a norma. Forniamo il manuale tecnico per la pratica in Questura.</p>
      <p style={{ marginTop: 12 }}>Gli armadi per documenti e valori sono disponibili in versione ignifuga (classe 60 o 120 minuti) con certificazione EN 1047-1. Contattaci per un preventivo gratuito.</p>
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
