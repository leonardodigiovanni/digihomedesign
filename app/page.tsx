import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { clientPages, categoryGroups } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'
import HeroCarousel from '@/components/hero-carousel'
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
      <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', margin: '32px 16px 8px', lineHeight: 1.4 }}>
        Infissi, persiane, verande, porte.<br />
        Ristrutturazioni e soluzioni su misura per casa e ufficio
      </h1>
      <div className="home-hero">
        <div className="home-hero-text" style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '20px', display: 'flex', alignItems: 'flex-start' }}>
          <p style={{ textAlign: 'justify', fontSize: 17, color: '#555', lineHeight: 1.8, margin: 0 }}>
            Dall&apos; esperienza maturata, come stimata ditta artigiana a conduzione familiare, iniziata nel 1972 nasce a Palermo una nuova azienda, organizzata, innovativa e moderna. Se desideri prodotti di qualità e durevoli nel tempo, se vuoi risparmiare tempo e denaro, siamo la scelta giusta. Ci collochiamo sul mercato a prezzi competitivi come <strong>REFERENTE UNICO</strong> per i tuoi progetti di ristrutturazione e di riqualificazione energetica. Per i nostri clienti sono disponibili due servizi esclusivi, completamente gratuiti. La disponibilità di preparare preventivi immediati, in completa autonomia, con un widget facile e intuitivo. La possibilità di monitorare il cantiere di casa tua da qualunque parte del mondo, in qualunque momento, con giornalieri inserimenti online di rapporti, foto e video che ne documentano il progresso. Registrati e accedi alla tua area personale per iniziare... ti aspettiamo!
          </p>
        </div>
        <div className="home-hero-right">
          <div className="home-hero-carousel">
            <HeroCarousel />
          </div>

          {/* CTA esclusivi — sotto il carousel */}
          <div className="cta-home-section" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={ctaPreventivi} className="cta-home-btn" style={{ height: 250, justifyContent: 'flex-start', gap: 10 }}>
              <div style={{ height: 165, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/images/preventivo-online-t.png" alt="Preventivo" width={160} height={160} style={{ objectFit: 'contain' }} />
              </div>
              Calcola il tuo preventivo online
            </Link>
            <Link href={ctaCantiere} className="cta-home-btn" style={{ height: 250, justifyContent: 'flex-start', gap: 10 }}>
              <div style={{ height: 165, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/images/cantieri-online-t.png" alt="Cantiere" width={160} height={160} style={{ objectFit: 'contain' }} />
              </div>
              Segui il tuo cantiere online
            </Link>
            <Link href="/aiuto/app" className="cta-home-btn" style={{ height: 250, justifyContent: 'flex-start', gap: 10 }}>
              <div style={{ height: 165, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image src="/images/digi-home-design-app.png" alt="App" width={100} height={100} style={{ objectFit: 'contain' }} />
              </div>
              Scarica la nostra App Android/Apple
            </Link>
          </div>
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
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                {page.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {/* Blocco SEO keyword cluster */}
      <div style={{ maxWidth: 860, margin: '48px auto 0', padding: '0 20px 48px', color: '#444', fontSize: 15, lineHeight: 1.8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
          La tua casa, il tuo ufficio — tutto a Palermo
        </h2>
        <p>
          Siamo specialisti in <Link href="/infissi" aria-label="infissi-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>infissi</Link> e <Link href="/serramenti" aria-label="serramenti-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>serramenti</Link>: finestre, porte-finestre e scorrevoli su misura, installati e garantiti.
          Realizziamo <Link href="/verande" aria-label="verande-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>verande</Link> per vivere gli spazi esterni tutto l&apos;anno, e montiamo <Link href="/porte-corazzate" aria-label="porte-corazzate-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>porte corazzate</Link> e blindature antintrusione per la massima sicurezza.
          Le nostre <Link href="/persiane-in-alluminio" aria-label="persiane-in-alluminio-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>persiane in alluminio</Link> coniugano estetica e durata nel tempo.
        </p>
        <p style={{ marginTop: 12 }}>
          Ci occupiamo di <Link href="/ristrutturazioni-chiavi-in-mano" aria-label="ristrutturazioni-chiavi-in-mano-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>ristrutturazioni chiavi in mano</Link> a Palermo: dal progetto alla consegna, un unico referente segue ogni fase del lavoro.
          Progettiamo e installiamo anche <Link href="/strutture-metalliche" aria-label="strutture-metalliche-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>strutture metalliche </Link>  — tettoie, pensiline, scale e pergolati — con prodotti di qualità e lavorazioni a regola d&apos;arte.
        </p>
      </div>
    </>
  )
}
