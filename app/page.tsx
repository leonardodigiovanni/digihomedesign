import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { clientPages, categoryGroups } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'
import HeroCarousel from '@/components/hero-carousel'
import PartnerForm from '@/components/partner-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Infissi, Verande, Ristrutturazioni e Sicurezza a Palermo',
  description: 'Ristruttura chiavi in mano, per case belle e funzionali. Serramenti, edilizia, antintrusione, arredi, accessori. Unico referente. Zero pensieri tu!',
  alternates: { canonical: 'https://www.digi-home-design.com/' },
  keywords: [
    'infissi a Palermo',
    'serramenti a Palermo',
    'verande a Palermo',
    'porte corazzate a Palermo',
    'persiane in alluminio a Palermo',
    'ristrutturazioni chiavi in mano a Palermo',
    'strutture metalliche a Palermo',
  ],
}

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const role = cookieStore.get('session_role')?.value ?? ''
  const { disabledPages } = readSettings()

  const ctaPreventivi = role ? '/pagine/5'   : '/aiuto/guida-preventivo'
  const ctaCantiere   = role ? '/cantieri'   : '/aiuto/guida-cantiere'
  const allPublicPages = [
    ...clientPages,
    ...categoryGroups.flatMap(g => g.pages),
  ]
  const visiblePages = allPublicPages.filter(p => !disabledPages.includes(p.id))

  return (
    <>
      <h1 className="effetto-3d" style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', margin: '16px 16px 48px', lineHeight: 1.4 }}>
        Infissi, persiane, verande, porte.<br />
        Ristrutturazioni e soluzioni su misura per casa e ufficio
      </h1>
      <div className="home-hero">
        <div className="home-hero-text" style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10 }}>
          <div style={{ height: '100%', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
          <p style={{ textAlign: 'justify', fontSize: 15, color: '#555', lineHeight: 1.8, margin: 0 }}>
            Dall&apos;esperienza maturata dal 1972 nel settore dei serramenti e della lavorazione del ferro, come stimata realtà artigiana a conduzione familiare, nasce una nuova azienda, organizzata, innovativa e moderna, che amplia i propri servizi anche al settore dell&apos;edilizia, delle ristrutturazioni e della riqualificazione energetica.<br /><br />
            La nostra storia parte da solide competenze artigianali e si evolve in una struttura capace di offrire un servizio più completo. Oggi siamo il partner ideale per chi cerca qualità, affidabilità, soluzioni durevoli nel tempo e un unico interlocutore per progetti di miglioramento, recupero e valorizzazione degli immobili. Ci proponiamo sul mercato con prezzi competitivi e con l&apos;obiettivo di diventare un referente unico per interventi che spaziano dai serramenti alle opere edili, fino ai lavori di ristrutturazione e efficientamento energetico.<br /><br />
            Per i nostri clienti sono disponibili due servizi esclusivi e completamente gratuiti:<br />
            — la possibilità di ottenere preventivi immediati online in completa autonomia, grazie a un widget semplice, veloce e intuitivo<br />
            — il servizio di monitoraggio del cantiere online, per seguire i lavori di casa da qualunque parte del mondo, in qualsiasi momento, attraverso aggiornamenti giornalieri con rapporti, foto e video<br /><br />
            Registrati e accedi alla tua area personale per iniziare subito.<br />
            <strong>Affidati a un&apos;azienda che unisce esperienza artigiana, innovazione e nuovi servizi per l&apos;edilizia a Palermo.</strong>
          </p>
          </div>
        </div>
        <div className="home-hero-carousel">
          <HeroCarousel />
        </div>

        {/* CTA esclusivi — colonna a destra su schermi larghi */}
        <div className="home-hero-cta">
          <Link href={ctaPreventivi} className="cta-home-btn">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Image src="/images/preventivo-online-t.png" alt="Preventivo" width={130} height={130} style={{ objectFit: 'contain' }} />
            </div>
            <span>Calcola il tuo <span className="animato">Preventivo Online</span></span>
          </Link>
          <Link href={ctaCantiere} className="cta-home-btn">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Image src="/images/cantieri-online-t.png" alt="Cantiere" width={130} height={130} style={{ objectFit: 'contain' }} />
            </div>
            <span>Segui il tuo <span className="animato">Cantiere Online</span></span>
          </Link>
          <Link href="/aiuto/app" className="cta-home-btn">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Image src="/images/digi-home-design-app.png" alt="App" width={60} height={60} style={{ objectFit: 'contain' }} />
            </div>
            <span>Scarica la <span className="animato">DIGI App</span> <span style={{ fontSize: 11, opacity: 0.8 }}>(Android/Apple)</span></span>
          </Link>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
      }}>
        {visiblePages.map((page, i) => (
          <Link key={page.id} href={page.href} className="page-card" style={{ flex: '1 1 260px' }}>
            <div style={{ position: 'relative', height: 220, width: '100%' }}>
              <Image
                fill
                src={`/images/casa-ristrutturata-${(i % 8) + 1}.jpg`}
                alt={page.label}
                sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1200px) calc(50vw - 30px), calc(33vw - 30px)"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                {page.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* Partners */}
      <div style={{ maxWidth: 1100, margin: '48px auto 0', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <h2 className="effetto-3d" style={{ fontSize: 22, fontWeight: 700, textAlign: 'center', margin: 0 }}>
          I nostri partners
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
          {[
            { nome: 'Aluplast',    colore: '#1565c0', testo: '#fff' },
            { nome: 'Schüco',      colore: '#b71c1c', testo: '#fff' },
            { nome: 'Reynaers',    colore: '#1b5e20', testo: '#fff' },
            { nome: 'Finstral',    colore: '#4a148c', testo: '#fff' },
            { nome: 'Internorm',   colore: '#e65100', testo: '#fff' },
            { nome: 'Veka',        colore: '#006064', testo: '#fff' },
            { nome: 'Gealan',      colore: '#37474f', testo: '#fff' },
            { nome: 'Metra',       colore: '#880e4f', testo: '#fff' },
          ].map(p => (
            <div
              key={p.nome}
              style={{
                width: 96, height: 44,
                background: p.colore,
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: p.testo, fontSize: 13, fontWeight: 700,
                letterSpacing: '0.03em',
                flexShrink: 0,
              }}
            >
              {p.nome}
            </div>
          ))}
        </div>
        <PartnerForm />
        </div>
      </div>

      {/* Blocco SEO keyword cluster */}
      <div style={{ maxWidth: 860, margin: '48px auto 48px', padding: '0 20px' }}>
        <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 10, padding: '28px 24px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
          <h2 className="effetto-3d" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            La tua casa, il tuo ufficio — tutto a Palermo
          </h2>
          <p>
            Siamo specialisti in <Link href="/infissi" aria-label="infissi-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>infissi</Link> e <Link href="/serramenti" aria-label="serramenti-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>serramenti</Link>: finestre, porte-finestre e scorrevoli su misura, installati e garantiti.
            Realizziamo <Link href="/verande" aria-label="verande-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>verande</Link> per vivere gli spazi esterni tutto l&apos;anno, e montiamo <Link href="/porte-corazzate" aria-label="porte-corazzate-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>porte corazzate</Link> e blindature antintrusione per la massima sicurezza.
            Le nostre <Link href="/persiane" aria-label="persiane-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>persiane in alluminio</Link> coniugano estetica e durata nel tempo.
          </p>
          <p style={{ marginTop: 12 }}>
            Ci occupiamo di <Link href="/ristrutturazioni-chiavi-in-mano" aria-label="ristrutturazioni-chiavi-in-mano-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>ristrutturazioni chiavi in mano</Link> a Palermo: dal progetto alla consegna, un unico referente segue ogni fase del lavoro.
            Progettiamo e installiamo anche <Link href="/strutture-metalliche" aria-label="strutture-metalliche-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>strutture metalliche</Link> — tettoie, pensiline, scale e pergolati — con prodotti di qualità e lavorazioni a regola d&apos;arte.
          </p>
        </div>
      </div>
    </>
  )
}
