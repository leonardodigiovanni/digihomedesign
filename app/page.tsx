import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import HeroCarousel from '@/components/hero-carousel'
import PulsaSync from '@/components/pulsa-sync'
import PartnerForm from '@/components/partner-form'
import PartnersBlock from '@/components/partners-block'
import FornitoreForm from '@/components/fornitore-form'
import { readSettings } from '@/lib/settings'
import { categoryGroups } from '@/lib/nav-config'
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
  const ctaCantiere = role ? '/area-clienti/cantieri' : '/aiuto/guida-cantiere'

  const { disabledPages, rolePermissions } = await readSettings()
  const isStaff             = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviFlag      = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
  const computometricoFlag  = isStaff || (rolePermissions['cliente'] ?? []).includes(54)
  const ctaPreventivi       = preventiviFlag     ? (role ? '/area-clienti/preventivi' : '/brand/cataloghi')                         : '/aiuto/guida-preventivo'
  const ctaComputometrico   = computometricoFlag ? (role ? '/area-clienti/computometrici' : '/area-clienti/carrello-computometrico') : '/aiuto/guida-computometrico'
  const disabledHrefs = new Set(
    categoryGroups.flatMap(g => g.pages)
      .filter(p => disabledPages.includes(p.id))
      .map(p => p.href)
  )
  const ok = (href: string) => !disabledHrefs.has(href)

  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16, marginBottom: 16 }}>
      <p style={{ textAlign: 'center', margin: 0, padding: 0, lineHeight: 1 }}>
      <span className="testo-titoli" style={{ display: 'block' }}>Infissi Verande</span>
      <span className="testo-titoli" style={{ display: 'block' }}>Persiane Porte</span>
      <span className="testo-titoli" style={{ display: 'block' }}>Ristrutturazioni</span>
      </p>
      <div className="home-hero">
        <div className="home-hero-cta">
          <Link href={ctaPreventivi} className="cta-home-btn">
            <div><Image src="/images/cta/preventivo-online.png" alt="Preventivo" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
            <span className="testo-cta"><span className="animato">Preventivo Serramenti & Porte</span></span>
          </Link>
          <Link href={ctaComputometrico} className="cta-home-btn">
            <div><Image src="/images/cta/computometrico-online.png" alt="Computometrico" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
            <span className="testo-cta"><span className="animato">Computo metrico</span></span>
          </Link>
          <Link href={ctaCantiere} className="cta-home-btn">
            <div><Image src="/images/cta/cantiere-online.png" alt="Cantiere" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
            <span className="testo-cta"><span className="animato">Foto/Video Cantiere</span></span>
          </Link>
          <Link href="/app-download" className="cta-home-btn cta-home-btn-app">
            <div><Image src="/images/cta/digi-home-design-srl-app.png" alt="App" width={70} height={70} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} unoptimized /></div>
            <span className="testo-cta"><span className="animato">DIGI App</span></span>
          </Link>
        </div>
        <div className="home-hero-text" style={{ borderRadius: 20, background: '#fff' }}>
          <div style={{ padding: '28px 28px 24px' }}>
          <p className="testo-articoli">
            DIGI Home Design nasce da oltre 60 anni di esperienza nel settore della lavorazione del ferro e dei serramenti. Da realtà artigiana a conduzione familiare, stimata nella città di Palermo, l&apos;azienda si è evoluta nel tempo fino a diventare una realtà moderna e innovativa, capace di integrare competenze nell&apos;edilizia, nelle ristrutturazioni e nella riqualificazione energetica.<br /><br />
            Alla base del nostro percorso ci sono la passione per il design d&apos;interni e la volontà di offrire soluzioni complete per abitazioni e spazi commerciali. Dalla progettazione alla posa in opera, ogni intervento viene seguito con cura artigianale, precisione e attenzione al dettaglio.<br /><br />
            Nel corso degli anni abbiamo ampliato la nostra offerta, abbracciando diversi ambiti: dai serramenti alla falegnameria, dall&apos;impiantistica alle opere edili, fino alle ristrutturazioni chiavi in mano. Il tutto con un unico interlocutore, in grado di coordinare ogni fase del lavoro.<br /><br />
            Oggi ci proponiamo come partner di fiducia per chi desidera migliorare, recuperare o valorizzare il proprio immobile. Gestiamo l&apos;intero processo, semplificando la comunicazione tra le figure coinvolte e sollevando il committente da problematiche organizzative, tecniche e gestionali.<br /><br />
            Siamo al fianco delle famiglie con soluzioni durevoli, prezzi onesti e competitivi, occupandoci di interventi che spaziano dai serramenti alle opere edili, fino ai lavori di ristrutturazione ed efficientamento energetico.<br /><br />
            Per rendere l&apos;esperienza ancora più semplice e trasparente, mettiamo a disposizione due servizi esclusivi e completamente gratuiti:<br /><br />
            — <span>Preventivi Immediati Online</span>:<br />
            Senza registrazione e in completa autonomia, grazie a un widget semplice, veloce e intuitivo. Registrandoti, potrai inoltre scoprire offerte dedicate, sconti fedeltà progressivi, premialità referral &ldquo;porta un amico&rdquo; e accedere a finanziamenti convenzionati, per realizzare i tuoi progetti anche con comode rate mensili.<br /><br />
            — <span>Monitoraggio del Cantiere Online</span>:<br />
            Un servizio pensato per seguire i lavori ovunque ti trovi e in qualsiasi momento, attraverso aggiornamenti giornalieri, rapporti di lavoro, foto e video documentali. Accedendo alla tua area personale, potrai verificare in modo semplice e trasparente l&apos;avanzamento del cantiere.<br /><br />
            Affidati a un&apos;azienda che unisce esperienza artigiana, innovazione e servizi evoluti per aiutarti a realizzare la casa dei tuoi sogni.
          </p>
          </div>
        </div>
      <div className="home-hero-cards" style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '8px 4px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {/* ── Brand ── */}

        {/*
        {ok('/brand/storia') && (
        <Link href="/brand/storia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Storia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Storia</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/galleria') && (
        <Link href="/brand/galleria" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Galleria" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Galleria</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/contatti') && (
        <Link href="/brand/contatti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Contatti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Contatti</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/partners') && (
        <Link href="/brand/partners" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Partners" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Partners</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/cataloghi') && (
        <Link href="/brand/cataloghi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Cataloghi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cataloghi</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/condizioni-di-vendita') && (
        <Link href="/brand/condizioni-di-vendita" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Condizioni di Vendita" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Condizioni di Vendita</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/brand/templates-documenti') && (
        <Link href="/brand/templates-documenti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Documenti Legali" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Documenti Legali</span></div>
        </Link>
        )}
        */}

        {/* ── Serramenti ── */}
        {ok('/serramenti/infissi-in-alluminio') && (
        <Link href="/serramenti/infissi-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/infissi-in-alluminio/photo_2026-04-15_23-14-30.jpg" alt="Infissi in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi in Alluminio</span></div>
        </Link>
        )}
        {ok('/serramenti/infissi-in-pvc') && (
        <Link href="/serramenti/infissi-in-pvc" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/infissi-in-pvc/PVC.jpg" alt="Infissi in PVC" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi in PVC</span></div>
        </Link>
        )}
        {ok('/serramenti/verande-in-alluminio') && (
        <Link href="/serramenti/verande-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Verande in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Verande in Alluminio</span></div>
        </Link>
        )}
        {/*
        {ok('/serramenti/verande-in-pvc') && (
        <Link href="/serramenti/verande-in-pvc" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Verande in PVC" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Verande in PVC</span></div>
        </Link>
        )}
        */}
        {ok('/serramenti/persiane-in-alluminio') && (
        <Link href="/serramenti/persiane-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Persiane in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Persiane in Alluminio</span></div>
        </Link>
        )}
        {ok('/serramenti/imbotti') && (
        <Link href="/serramenti/imbotti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Imbotti in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Imbotti in Alluminio</span></div>
        </Link>
        )}
        {ok('/serramenti/tapparelle-manuali') && (
        <Link href="/serramenti/tapparelle-manuali" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Tapparelle Manuali" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tapparelle Manuali</span></div>
        </Link>
        )}
        {ok('/serramenti/tapparelle-motorizzate') && (
        <Link href="/serramenti/tapparelle-motorizzate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Tapparelle Motorizzate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tapparelle Motorizzate</span></div>
        </Link>
        )}
        {/*
        {ok('/serramenti/veneziane') && (
        <Link href="/serramenti/veneziane" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Veneziane" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Veneziane</span></div>
        </Link>
        )}
        */}
        {/*
        {ok('/serramenti/vetrine') && (
        <Link href="/serramenti/vetrine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Vetrine" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Vetrine</span></div>
        </Link>
        )}
        */}
        {/*
        {ok('/serramenti/lucernai') && (
        <Link href="/serramenti/lucernai" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Lucernai" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Lucernai</span></div>
        </Link>
        )}
        */}
        {ok('/serramenti/zanzariere') && (
        <Link href="/serramenti/zanzariere" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Zanzariere" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Zanzariere</span></div>
        </Link>
        )}
        {ok('/serramenti/box-doccia') && (
        <Link href="/serramenti/box-doccia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Box Doccia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Box Doccia</span></div>
        </Link>
        )}

        {/* ── Metallurgia ── */}
        {/*
        {ok('/metallurgia/porte-corazzate') && (
        <Link href="/metallurgia/porte-corazzate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Porte Corazzate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Corazzate</span></div>
        </Link>
        )}
        */}
        
        {/*
        {ok('/metallurgia/porte-blindate') && (
        <Link href="/metallurgia/porte-blindate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Porte Blindate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Blindate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/porte-antincendio') && (
        <Link href="/metallurgia/porte-antincendio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Porte Antincendio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Antincendio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/pannelli-bugnato-alluminio') && (
        <Link href="/metallurgia/pannelli-bugnato-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Pannelli Bugnato Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pannelli Bugnato Alluminio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/cancelli') && (
        <Link href="/metallurgia/cancelli" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Cancelli" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cancelli</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/grate') && (
        <Link href="/metallurgia/grate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Grate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Grate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/ringhiere') && (
        <Link href="/metallurgia/ringhiere" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Ringhiere" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Ringhiere</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/balconi') && (
        <Link href="/metallurgia/balconi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Balconi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Balconi</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/saracinesche-manuali') && (
        <Link href="/metallurgia/saracinesche-manuali" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Saracinesche Manuali" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Saracinesche Manuali</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/saracinesche-motorizzate') && (
        <Link href="/metallurgia/saracinesche-motorizzate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Saracinesche Motorizzate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Saracinesche Motorizzate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/strutture') && (
        <Link href="/metallurgia/strutture" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Strutture Portanti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Strutture Portanti</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/scale-a-rampe') && (
        <Link href="/metallurgia/scale-a-rampe" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Scale a Rampe" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale a Rampe</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/scale-a-chiocciola') && (
        <Link href="/metallurgia/scale-a-chiocciola" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Scale a Chiocciola" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale a Chiocciola</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/scale-antincendio') && (
        <Link href="/metallurgia/scale-antincendio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Scale Antincendio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale Antincendio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/armadi-blindati') && (
        <Link href="/metallurgia/armadi-blindati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Armadi Blindati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Armadi Blindati</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/casseforti') && (
        <Link href="/metallurgia/casseforti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Casseforti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Casseforti</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/tetti-coibentati') && (
        <Link href="/metallurgia/tetti-coibentati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Tetti Coibentati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tetti Coibentati</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/grondaie') && (
        <Link href="/metallurgia/grondaie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Grondaie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Grondaie</span></div>
        </Link>
        )}
        */}

        {/* ── Edilizia ── */}
        {/*
        {ok('/edilizia/demolizioni') && (
        <Link href="/edilizia/demolizioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Demolizioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Demolizioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/opere-murarie') && (
        <Link href="/edilizia/opere-murarie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Opere Murarie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Opere Murarie</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tramezzature') && (
        <Link href="/edilizia/tramezzature" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Tramezzature" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tramezzature</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/intonaci') && (
        <Link href="/edilizia/intonaci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Intonaci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Intonaci</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/massetti') && (
        <Link href="/edilizia/massetti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Massetti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Massetti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tracce') && (
        <Link href="/edilizia/tracce" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Tracce" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tracce</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pavimenti') && (
        <Link href="/edilizia/pavimenti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Pavimenti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pavimenti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/piastrelle') && (
        <Link href="/edilizia/piastrelle" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Piastrelle" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Piastrelle</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/sanitari') && (
        <Link href="/edilizia/sanitari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Sanitari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Sanitari</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tetti') && (
        <Link href="/edilizia/tetti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Tetti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tetti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/impermeabilizzazioni') && (
        <Link href="/edilizia/impermeabilizzazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Impermeabilizzazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impermeabilizzazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tinteggiatura') && (
        <Link href="/edilizia/tinteggiatura" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Tinteggiatura" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tinteggiatura</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/antimuffa') && (
        <Link href="/edilizia/antimuffa" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Antimuffa" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Antimuffa</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/smaltimento-calcinacci') && (
        <Link href="/edilizia/smaltimento-calcinacci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Smaltimento Calcinacci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Smaltimento Calcinacci</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pitturazioni') && (
        <Link href="/edilizia/pitturazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Pitturazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pitturazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/indoratura') && (
        <Link href="/edilizia/indoratura" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Indoratura" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Indoratura</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pulizia-finale') && (
        <Link href="/edilizia/pulizia-finale" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Pulizia Finale" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pulizia Finale</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/piscine') && (
        <Link href="/edilizia/piscine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Piscine" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Piscine</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/solarium') && (
        <Link href="/edilizia/solarium" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Solarium" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Solarium</span></div>
        </Link>
        )}
        */} 

        {/* ── Legno ── */}
        {/*
        {ok('/legno/porte-interne') && (
        <Link href="/legno/porte-interne" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Porte Interne" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Interne</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/porte-scrigno') && (
        <Link href="/legno/porte-scrigno" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Porte Scrigno" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Scrigno</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/cucine') && (
        <Link href="/legno/cucine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Cucine" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cucine</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/mobili-in-massello') && (
        <Link href="/legno/mobili-in-massello" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Mobili in Massello" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Mobili in Massello</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/mobili-tamburati') && (
        <Link href="/legno/mobili-tamburati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Mobili Tamburati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Mobili Tamburati</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/parquet') && (
        <Link href="/legno/parquet" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Parquet" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Parquet</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/rivestimento-compensato') && (
        <Link href="/legno/rivestimento-compensato" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Rivestimento Compensato" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Rivestimento Compensato</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/infissi-in-legno') && (
        <Link href="/legno/infissi-in-legno" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Infissi in Legno" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi in Legno</span></div>
        </Link>
        )}
        */}

        {/* ── Elettricità ── */}
        {/*
        {ok('/elettricita/impianti-elettrici') && (
        <Link href="/elettricita/impianti-elettrici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Impianti Elettrici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impianti Elettrici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/illuminazione') && (
        <Link href="/elettricita/illuminazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Illuminazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Illuminazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/elettrodomestici') && (
        <Link href="/elettricita/elettrodomestici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Elettrodomestici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Elettrodomestici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/pannelli-solari') && (
        <Link href="/elettricita/pannelli-solari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Pannelli Solari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pannelli Solari</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/domotica') && (
        <Link href="/elettricita/domotica" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Domotica" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Domotica</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/videosorveglianza') && (
        <Link href="/elettricita/videosorveglianza" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Videosorveglianza" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Videosorveglianza</span></div>
        </Link>
        )}
        */}

        {/* ── Termodinamica ── */}
        {/*
        {ok('/termodinamica/climatizzazione') && (
        <Link href="/termodinamica/climatizzazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Climatizzazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Climatizzazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/isolamenti-termici') && (
        <Link href="/termodinamica/isolamenti-termici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Isolamenti Termici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Isolamenti Termici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/isolamenti-acustici') && (
        <Link href="/termodinamica/isolamenti-acustici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Isolamenti Acustici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Isolamenti Acustici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/caldaie') && (
        <Link href="/termodinamica/caldaie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Caldaie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Caldaie</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/pompe-di-calore') && (
        <Link href="/termodinamica/pompe-di-calore" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Pompe di Calore" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pompe di Calore</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/impianti-idraulici') && (
        <Link href="/termodinamica/impianti-idraulici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Impianti Idraulici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impianti Idraulici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/irrigazione') && (
        <Link href="/termodinamica/irrigazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Irrigazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Irrigazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/allacci') && (
        <Link href="/termodinamica/allacci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Allacci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Allacci</span></div>
        </Link>
        )}
        */}

        {/* ── Arredi ── */}
        {/*
        {ok('/arredi/quadri') && (
        <Link href="/arredi/quadri" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Quadri" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Quadri</span></div>
        </Link>
        )}
        */} {/*
        {ok('/arredi/soprammobili') && (
        <Link href="/arredi/soprammobili" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-2.jpg" alt="Soprammobili" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Soprammobili</span></div>
        </Link>
        )}
        */} {/*
        {ok('/arredi/lampadari') && (
        <Link href="/arredi/lampadari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-3.jpg" alt="Lampadari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Lampadari</span></div>
        </Link>
        )}
        */}

        {/* ── Tessuti ── */}
        {/*
        {ok('/tessuti/divani') && (
        <Link href="/tessuti/divani" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-4.jpg" alt="Divani" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Divani</span></div>
        </Link>
        )}
        */} {/*
        {ok('/tessuti/tendaggi') && (
        <Link href="/tessuti/tendaggi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-5.jpg" alt="Tendaggi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tendaggi</span></div>
        </Link>
        )}
*/}

        {/* ── Servizi ── */}
        {/*
        {ok('/servizi/riparazioni') && (
        <Link href="/servizi/riparazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-6.jpg" alt="Riparazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Riparazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/montaggio') && (
        <Link href="/servizi/montaggio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-7.jpg" alt="Montaggio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Montaggio</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/manutenzione') && (
        <Link href="/servizi/manutenzione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-8.jpg" alt="Manutenzione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Manutenzione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/contratti-di-pulizia') && (
        <Link href="/servizi/contratti-di-pulizia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/casa-ristrutturata-1.jpg" alt="Contratti di Pulizia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Contratti di Pulizia</span></div>
        </Link>
        )}
        */}

      </div>
      </div>

      {/* Vendiamo Marchi di valore */}
      <div className="page-section-wrapper" style={{ margin: 0 }}>
        <div style={{ borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, background: '#fff' }}>
          <h2 className="testo-articoli" style={{ textAlign: 'center', margin: 0 }}>
            Vendiamo Marchi di valore
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            {[
              { src: '/images/brand/partners/alsistem.png',  alt: 'Alsistem',  href: 'https://www.alsistem.it/' },
              { src: '/images/brand/partners/alphacan.png',  alt: 'Alphacan',  href: '#' },
              { src: '/images/brand/partners/moskout.png',   alt: 'Moskout',   href: '#' },
            ].map(m => (
              <a key={m.alt} href={m.href} target={m.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', height: 52, border: '2px solid #c8960c', borderRadius: 6, background: '#fff', flexShrink: 0 }}
              >
                <Image src={m.src} alt={m.alt} width={130} height={40} style={{ objectFit: 'contain' }} />
              </a>
            ))}
          </div>

          <FornitoreForm />
        </div>
      </div>

      {/* Partners */}
      {/* <div className="page-section-wrapper" style={{ maxWidth: 1100, margin: '32px auto 0', padding: '0 20px' }}>
        <PartnersBlock />
      </div> */}

      {/* Blocco SEO keyword cluster */}
      <div className="page-section-wrapper" style={{ margin: 0 }}>
        <div style={{ borderRadius: 20, padding: '28px 24px', color: '#444', fontSize: 15, lineHeight: 1.8, background: '#fff' }}>
          <div className="seo-block-flex">
            <div>
              <h2 className="testo-articoli" style={{ marginBottom: 6, marginTop: 0 }}>
                Serramenti, verande, tettoie e porte di qualità, per la tua casa o il tuo ufficio, realizzati su misura e in tempi rapidissimi
              </h2>
              <ul className="testo-articoli" style={{ margin: 0, lineHeight: 2, paddingLeft: 18 }}>
                <li>Vendita + consegna diretta + montaggio a <strong>Palermo e Provincia</strong> entro <strong>30 giorni</strong></li>
                <li>Vendita + consegna diretta + montaggio in tutto il <strong>resto della Sicilia</strong> entro <strong>45 giorni</strong></li>
                <li>Vendita + consegna mezzo corriere nel <strong>resto d&apos;Italia</strong> entro <strong>60 giorni</strong> (montaggio concordabile)</li>
                {/* <li>Vendita + consegna mezzo corriere nel <strong>resto d&apos;Europa</strong> entro <strong>90 giorni</strong></li> */}
                {/* <li>Vendita + consegna mezzo corriere nel <strong>resto del Mondo</strong> entro <strong>120 giorni</strong></li> */}
              </ul>
            </div>
            {/* Cronometro SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="110" height="130" viewBox="0 0 110 130" fill="none" style={{ flexShrink: 0 }}>
              {/* Corona */}
              <rect x="46" y="4" width="18" height="10" rx="4" fill="#555" />
              {/* Pulsante sinistro */}
              <rect x="18" y="28" width="10" height="6" rx="3" fill="#555" />
              {/* Pulsante destro */}
              <rect x="82" y="28" width="10" height="6" rx="3" fill="#555" />
              {/* Anello corona → corpo */}
              <rect x="49" y="13" width="12" height="8" rx="2" fill="#777" />
              {/* Corpo principale */}
              <circle cx="55" cy="78" r="46" fill="#f0f0f0" stroke="#555" strokeWidth="4" />
              {/* Quadrante interno */}
              <circle cx="55" cy="78" r="38" fill="#fff" stroke="#ccc" strokeWidth="1" />
              {/* Tacche ore */}
              {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
                const rad = (deg - 90) * Math.PI / 180
                const isMajor = deg % 90 === 0
                const r1 = isMajor ? 30 : 33
                const r2 = 37
                return (
                  <line key={i}
                    x1={55 + r1 * Math.cos(rad)} y1={78 + r1 * Math.sin(rad)}
                    x2={55 + r2 * Math.cos(rad)} y2={78 + r2 * Math.sin(rad)}
                    stroke="#555" strokeWidth={isMajor ? 2.5 : 1} strokeLinecap="round"
                  />
                )
              })}
              {/* Lancetta minuti (punta alle 12 meno 5 ≈ 330°) */}
              <line x1="55" y1="78" x2={55 + 28 * Math.cos((330 - 90) * Math.PI / 180)} y2={78 + 28 * Math.sin((330 - 90) * Math.PI / 180)}
                stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
              {/* Lancetta secondi (punta alle 8 ≈ 240°) */}
              <line x1="55" y1="78" x2={55 + 34 * Math.cos((240 - 90) * Math.PI / 180)} y2={78 + 34 * Math.sin((240 - 90) * Math.PI / 180)}
                stroke="#c00" strokeWidth="1.5" strokeLinecap="round" />
              {/* Coda lancetta secondi */}
              <line x1="55" y1="78" x2={55 + 10 * Math.cos((240 + 180 - 90) * Math.PI / 180)} y2={78 + 10 * Math.sin((240 + 180 - 90) * Math.PI / 180)}
                stroke="#c00" strokeWidth="1.5" strokeLinecap="round" />
              {/* Perno centrale */}
              <circle cx="55" cy="78" r="3.5" fill="#444" />
              <circle cx="55" cy="78" r="1.5" fill="#fff" />
            </svg>
          </div>
          <p className="testo-articoli">
            Siamo specialisti in <Link href="/infissi" aria-label="infissi-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>infissi</Link> e <Link href="/serramenti" aria-label="serramenti-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>serramenti</Link>: finestre, porte-finestre e scorrevoli su misura, installati e garantiti.
            Realizziamo <Link href="/verande" aria-label="verande-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>verande</Link> per vivere gli spazi esterni tutto l&apos;anno, e montiamo <Link href="/porte-corazzate" aria-label="porte-corazzate-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>porte corazzate</Link> e blindature antintrusione per la massima sicurezza.
            Le nostre <Link href="/persiane" aria-label="persiane-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>persiane in alluminio</Link> coniugano estetica e durata nel tempo.
          </p>
          <p className="testo-articoli" style={{ marginTop: 12 }}>
            Ci occupiamo di <Link href="/ristrutturazioni-chiavi-in-mano" aria-label="ristrutturazioni-chiavi-in-mano-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>ristrutturazioni chiavi in mano</Link> a Palermo e Provincia: dal progetto alla consegna, un unico referente segue ogni fase del lavoro.
            Progettiamo e installiamo anche <Link href="/strutture-metalliche" aria-label="strutture-metalliche-a-palermo" style={{ color: '#1a1a1a', fontWeight: 700 }}>strutture metalliche</Link>{' '}— tettoie, pensiline, scale e pergolati — con prodotti di qualità e lavorazioni a regola d&apos;arte.
          </p>
        </div>
      </div>
      <p className="IsDebug fs-11">login e logout non devono cambiare pagina</p>
    </div>
    </>
  )
}
