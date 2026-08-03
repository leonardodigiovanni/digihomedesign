import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import HeroCarousel from '@/components/hero-carousel'
import HeroCardsScroll from '@/components/hero-cards-scroll'
import HeroCtaScroll from '@/components/hero-cta-scroll'
import PulsaSync from '@/components/pulsa-sync'
import HomeShortcutsContent from '@/components/home-shortcuts-content'
import PartnerForm from '@/components/partner-form'
import PartnersBlock from '@/components/partners-block'
import FornitoreForm from '@/components/fornitore-form'
import { readSettings } from '@/lib/settings'
import { categoryGroups } from '@/lib/nav-config'
import type { Metadata } from 'next'

const VIDEO_ID = '1aZGOyeKcrg'
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`
const VIDEO2_ID = 'P5ygwAPPQq8'
const VIDEO2_URL = `https://www.youtube.com/watch?v=${VIDEO2_ID}`

async function getVideoTitle(url: string): Promise<string> {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    if (!res.ok) return 'Guarda il video'
    const data = await res.json() as { title?: string }
    return data.title ?? 'Guarda il video'
  } catch {
    return 'Guarda il video'
  }
}

function VideoButton({ url, videoId, label, hint }: { url: string; videoId: string; label: string; hint: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={hint}
      className="btn-black fs-12"
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 32, gap: 8, padding: '0 12px 0 8px' }}
    >
      <div style={{ position: 'relative', width: 42, height: 24, flexShrink: 0 }}>
        <Image
          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
          alt="Anteprima video"
          fill
          sizes="42px"
          style={{ objectFit: 'cover', borderRadius: 3, display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 0, height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderLeft: '7px solid #fff',
            marginLeft: 1,
            filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.7))',
          }} />
        </div>
      </div>
      <span style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </a>
  )
}

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
  const videoTitle = await getVideoTitle(VIDEO_URL)
  const video2Title = await getVideoTitle(VIDEO2_URL)
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const role = cookieStore.get('session_role')?.value ?? ''
  const ctaCantiere = role ? '/area-clienti/cantieri' : '/aiuto/guida-cantiere'

  const { disabledPages, rolePermissions } = await readSettings()
  const isStaff             = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviFlag      = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
  const computometricoFlag  = isStaff || (rolePermissions['cliente'] ?? []).includes(54)
  const ctaPreventivi       = preventiviFlag     ? (role ? '/area-clienti/preventivi' : '/cataloghi')                      : '/aiuto/guida-preventivo'
  const ctaComputometrico   = computometricoFlag ? (role ? '/area-clienti/computometrici' : '/area-clienti/carrello-computometrico') : '/aiuto/guida-computometrico'
  const disabledHrefs = new Set(
    categoryGroups.flatMap(g => g.pages)
      .filter(p => disabledPages.includes(p.id))
      .map(p => p.href)
  )
  const ok = (href: string) => !disabledHrefs.has(href)

  return (
    <>
    <HomeShortcutsContent role={role || null} rolePermissions={rolePermissions} disabledPages={disabledPages}>
      <VideoButton url={VIDEO_URL} videoId={VIDEO_ID} label="Incentivi Riqualificazione Energetica 2026" hint={videoTitle} />
      <VideoButton url={VIDEO2_URL} videoId={VIDEO2_ID} label="Tutti Bonus CASA 2026" hint={video2Title} />
    </HomeShortcutsContent>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16, marginBottom: 16 }}>
      <div className="home-hero">
        <HeroCtaScroll>
          <Link href={ctaPreventivi} className="cta-home-btn">
            <div className="cta-row">
              <div><Image src="/images/cta/preventivo-online.webp" alt="Preventivo" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
              <span className="testo-cta"><span className="animato">Preventivo<br />Online &amp; Gratis</span></span>
            </div>
            <span className="cta-sub">Porte &amp; Serramenti</span>
          </Link>
          <Link href={ctaComputometrico} className="cta-home-btn">
            <div className="cta-row">
              <div><Image src="/images/cta/computometrico-online.webp" alt="Computo Metrico" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
              <span className="testo-cta"><span className="animato">Computo Metrico<br />Online &amp; Gratis</span></span>
            </div>
            <span className="cta-sub">Edilizia &amp; Strutture &amp; Scale &amp; Recinzioni</span>
          </Link>
          <Link href={ctaCantiere} className="cta-home-btn">
            <div className="cta-row">
              <div><Image src="/images/cta/cantiere-online.webp" alt="Cantiere" width={130} height={130} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
              <span className="testo-cta"><span className="animato">Segui il cantiere<br />Online &amp; Gratis</span></span>
            </div>
            <span className="cta-sub">Foto &amp; Video</span>
          </Link>
          <Link href="/app-download" className="cta-home-btn cta-home-btn-app">
            <div className="cta-row">
              <div><Image src="/images/cta/digi-home-design-srl-app.webp" alt="App" width={70} height={70} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%', flexShrink: 1 }} /></div>
              <span className="testo-cta"><span className="animato">Utilizza i nostri Servizi<br />Online &amp; Gratis</span></span>
            </div>
            <span className="cta-sub">Download DIGIApp</span>
          </Link>
        </HeroCtaScroll>
        <div className="home-hero-text" style={{ borderRadius: 20, background: '#fff', border: '1px solid #c8960c' }}>
          <div style={{ padding: '28px 28px 24px' }}>
          <p className="testo-articoli">
            <strong style={{ fontSize: 'calc(1em + 2px)' }}>DIGI Home Design</strong> nasce da oltre 60 anni di esperienza nella lavorazione del ferro e dei serramenti. Oggi è un punto di riferimento a Palermo per ristrutturazioni, edilizia, serramenti ed efficientamento energetico, offrendo un servizio completo con un unico interlocutore.<br /><br />
            Seguiamo ogni progetto dalla progettazione alla consegna, con cura artigianale, precisione e soluzioni su misura per abitazioni e spazi commerciali.<br /><br />
            Per rendere tutto più semplice, offriamo anche due servizi gratuiti:<br /><br />
            — <span>Preventivi online immediati</span>, con offerte dedicate, programmi fedeltà, bonus referral e finanziamenti convenzionati.<br />
            — <span>Monitoraggio del cantiere online</span>, con aggiornamenti, foto e video consultabili in qualsiasi momento dalla tua area personale.<br /><br />
            Esperienza, qualità, trasparenza e innovazione: tutto ciò che serve per realizzare e valorizzare il tuo immobile.
          </p>
          </div>
        </div>
      <HeroCardsScroll>

        {/* ── Brand ── */}

        {/*
        {ok('/chi-siamo/storia') && (
        <Link href="/chi-siamo/storia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Storia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Storia</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/chi-siamo/galleria') && (
        <Link href="/chi-siamo/galleria" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Galleria" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Galleria</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/chi-siamo/contatti') && (
        <Link href="/chi-siamo/contatti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Contatti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Contatti</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/chi-siamo/partners') && (
        <Link href="/chi-siamo/partners" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Partners" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Partners</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/cataloghi') && (
        <Link href="/cataloghi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Cataloghi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cataloghi</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/chi-siamo/condizioni-di-vendita') && (
        <Link href="/chi-siamo/condizioni-di-vendita" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Condizioni di Vendita" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Condizioni di Vendita</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/chi-siamo/templates-documenti') && (
        <Link href="/chi-siamo/templates-documenti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Documenti Legali" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Documenti Legali</span></div>
        </Link>
        )}
        */}

        {/* ── Serramenti ── */}
        {ok('/serramenti/infissi-in-alluminio-taglio-termico') && (
        <Link href="/serramenti/infissi-in-alluminio-taglio-termico" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill priority src="/images/serramenti/infissi-in-alluminio/porta-finestra-2-ante.webp" alt="Infissi Alluminio Taglio Termico" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi Alluminio Taglio Termico</span></div>
        </Link>
        )}
        {ok('/serramenti/infissi-in-pvc') && (
        <Link href="/serramenti/infissi-in-pvc" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/infissi-in-pvc/PVC.webp" alt="Infissi in PVC" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi PVC</span></div>
        </Link>
        )}
        {ok('/serramenti/verande-in-alluminio') && (
        <Link href="/serramenti/verande-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/verande-in-alluminio/veranda.webp" alt="Verande in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Verande Alluminio</span></div>
        </Link>
        )}
        {/*
        {ok('/serramenti/verande-in-pvc') && (
        <Link href="/serramenti/verande-in-pvc" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Verande in PVC" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Verande in PVC</span></div>
        </Link>
        )}
        */}
        {ok('/serramenti/persiane-in-alluminio') && (
        <Link href="/serramenti/persiane-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/persiane-in-alluminio/persiana.webp" alt="Persiane in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Persiane Alluminio</span></div>
        </Link>
        )}
        {ok('/serramenti/monoblocchi') && (
        <Link href="/serramenti/monoblocchi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/monoblocchi/monoblocco-persiana.webp" alt="Monoblocchi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Sistemi Monoblocco</span></div>
        </Link>
        )}
        {ok('/serramenti/tapparelle-in-alluminio') && (
        <Link href="/serramenti/tapparelle-in-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/tapparelle-manuali/tapparelle.webp" alt="Tapparelle in Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tapparelle Alluminio & PVC</span></div>
        </Link>
        )}
        {/*
        {ok('/serramenti/tapparelle-motorizzazione') && (
        <Link href="/serramenti/tapparelle-motorizzazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Tapparelle Motorizzazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tapparelle Motorizzazione</span></div>
        </Link>
        )}
        */}
        {/*
        {ok('/serramenti/veneziane') && (
        <Link href="/serramenti/veneziane" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Veneziane" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Veneziane</span></div>
        </Link>
        )}
        */}
        {/*
        {ok('/serramenti/lucernai') && (
        <Link href="/serramenti/lucernai" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Lucernai" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Lucernai</span></div>
        </Link>
        )}
        */}
        {ok('/serramenti/zanzariere') && (
        <Link href="/serramenti/zanzariere" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/zanzariere/zanzariera%20sc.webp" alt="Zanzariere" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Zanzariere</span></div>
        </Link>
        )}
        {ok('/serramenti/vetrine') && (
        <Link href="/serramenti/vetrine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/vetrate/vetrata.webp" alt="Vetrate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Vetrate Panoramiche</span></div>
        </Link>
        )}
        {ok('/serramenti/pergole-bioclimatiche') && (
        <Link href="/serramenti/pergole-bioclimatiche" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/pergole-bioclimatiche/pergole.webp" alt="Pergole Bioclimatiche" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pergole Bioclimatiche</span></div>
        </Link>
        )}
        {ok('/serramenti/box-doccia') && (
        <Link href="/serramenti/box-doccia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/serramenti/box-doccia/box-doccia-rettangolare.webp" alt="Box Doccia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Box Doccia</span></div>
        </Link>
        )}

        {/* ── Metallurgia ── */}
        {/*
        {ok('/metallurgia/porte-corazzate') && (
        <Link href="/metallurgia/porte-corazzate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Porte Corazzate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Corazzate</span></div>
        </Link>
        )}
        */}
        
        {/*
        {ok('/metallurgia/porte-blindate') && (
        <Link href="/metallurgia/porte-blindate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Porte Blindate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Blindate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/porte-antincendio') && (
        <Link href="/metallurgia/porte-antincendio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Porte Antincendio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Antincendio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/pannelli-bugnato-alluminio') && (
        <Link href="/metallurgia/pannelli-bugnato-alluminio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Pannelli Bugnato Alluminio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pannelli Bugnato Alluminio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/cancelli') && (
        <Link href="/metallurgia/cancelli" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Cancelli" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cancelli</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/grate') && (
        <Link href="/metallurgia/grate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Grate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Grate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/ringhiere') && (
        <Link href="/metallurgia/ringhiere" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Ringhiere" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Ringhiere</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/balconi') && (
        <Link href="/metallurgia/balconi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Balconi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Balconi</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/saracinesche-manuali') && (
        <Link href="/metallurgia/saracinesche-manuali" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Saracinesche Manuali" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Saracinesche Manuali</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/saracinesche-motorizzate') && (
        <Link href="/metallurgia/saracinesche-motorizzate" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Saracinesche Motorizzate" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Saracinesche Motorizzate</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/strutture') && (
        <Link href="/metallurgia/strutture" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Strutture Portanti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Strutture Portanti</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/scale-a-rampe') && (
        <Link href="/metallurgia/scale-a-rampe" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Scale a Rampe" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale a Rampe</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/scale-a-chiocciola') && (
        <Link href="/metallurgia/scale-a-chiocciola" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Scale a Chiocciola" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale a Chiocciola</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/scale-antincendio') && (
        <Link href="/metallurgia/scale-antincendio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Scale Antincendio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Scale Antincendio</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/armadi-blindati') && (
        <Link href="/metallurgia/armadi-blindati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Armadi Blindati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Armadi Blindati</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/casseforti') && (
        <Link href="/metallurgia/casseforti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Casseforti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Casseforti</span></div>
        </Link>
        )}
        */}


        {/*
        {ok('/metallurgia/tetti-coibentati') && (
        <Link href="/metallurgia/tetti-coibentati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Tetti Coibentati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tetti Coibentati</span></div>
        </Link>
        )}
        */}

        {/*
        {ok('/metallurgia/grondaie') && (
        <Link href="/metallurgia/grondaie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Grondaie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Grondaie</span></div>
        </Link>
        )}
        */}

        {/* ── Edilizia ── */}
        {/*
        {ok('/edilizia/demolizioni') && (
        <Link href="/edilizia/demolizioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Demolizioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Demolizioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/opere-murarie') && (
        <Link href="/edilizia/opere-murarie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Opere Murarie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Opere Murarie</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tramezzature') && (
        <Link href="/edilizia/tramezzature" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Tramezzature" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tramezzature</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/intonaci') && (
        <Link href="/edilizia/intonaci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Intonaci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Intonaci</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/massetti') && (
        <Link href="/edilizia/massetti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Massetti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Massetti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tracce') && (
        <Link href="/edilizia/tracce" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Tracce" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tracce</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pavimenti') && (
        <Link href="/edilizia/pavimenti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Pavimenti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pavimenti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/piastrelle') && (
        <Link href="/edilizia/piastrelle" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Piastrelle" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Piastrelle</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/sanitari') && (
        <Link href="/edilizia/sanitari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Sanitari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Sanitari</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tetti') && (
        <Link href="/edilizia/tetti" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Tetti" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tetti</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/impermeabilizzazioni') && (
        <Link href="/edilizia/impermeabilizzazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Impermeabilizzazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impermeabilizzazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/tinteggiatura') && (
        <Link href="/edilizia/tinteggiatura" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Tinteggiatura" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tinteggiatura</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/antimuffa') && (
        <Link href="/edilizia/antimuffa" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Antimuffa" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Antimuffa</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/smaltimento-calcinacci') && (
        <Link href="/edilizia/smaltimento-calcinacci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Smaltimento Calcinacci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Smaltimento Calcinacci</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pitturazioni') && (
        <Link href="/edilizia/pitturazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Pitturazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pitturazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/indoratura') && (
        <Link href="/edilizia/indoratura" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Indoratura" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Indoratura</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/pulizia-finale') && (
        <Link href="/edilizia/pulizia-finale" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Pulizia Finale" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pulizia Finale</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/piscine') && (
        <Link href="/edilizia/piscine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Piscine" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Piscine</span></div>
        </Link>
        )}
        */} {/*
        {ok('/edilizia/solarium') && (
        <Link href="/edilizia/solarium" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Solarium" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Solarium</span></div>
        </Link>
        )}
        */} 

        {/* ── Legno ── */}
        {/*
        {ok('/legno/porte-interne') && (
        <Link href="/legno/porte-interne" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Porte Interne" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Interne</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/porte-scrigno') && (
        <Link href="/legno/porte-scrigno" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Porte Scrigno" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Porte Scrigno</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/cucine') && (
        <Link href="/legno/cucine" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Cucine" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Cucine</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/mobili-in-massello') && (
        <Link href="/legno/mobili-in-massello" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Mobili in Massello" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Mobili in Massello</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/mobili-tamburati') && (
        <Link href="/legno/mobili-tamburati" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Mobili Tamburati" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Mobili Tamburati</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/parquet') && (
        <Link href="/legno/parquet" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Parquet" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Parquet</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/rivestimento-compensato') && (
        <Link href="/legno/rivestimento-compensato" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Rivestimento Compensato" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Rivestimento Compensato</span></div>
        </Link>
        )}
        */} {/*
        {ok('/legno/infissi-in-legno') && (
        <Link href="/legno/infissi-in-legno" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Infissi in Legno" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Infissi in Legno</span></div>
        </Link>
        )}
        */}

        {/* ── Elettricità ── */}
        {/*
        {ok('/elettricita/impianti-elettrici') && (
        <Link href="/elettricita/impianti-elettrici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Impianti Elettrici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impianti Elettrici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/illuminazione') && (
        <Link href="/elettricita/illuminazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Illuminazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Illuminazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/elettrodomestici') && (
        <Link href="/elettricita/elettrodomestici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Elettrodomestici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Elettrodomestici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/pannelli-solari') && (
        <Link href="/elettricita/pannelli-solari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Pannelli Solari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pannelli Solari</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/domotica') && (
        <Link href="/elettricita/domotica" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Domotica" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Domotica</span></div>
        </Link>
        )}
        */} {/*
        {ok('/elettricita/videosorveglianza') && (
        <Link href="/elettricita/videosorveglianza" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Videosorveglianza" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Videosorveglianza</span></div>
        </Link>
        )}
        */}

        {/* ── Termodinamica ── */}
        {/*
        {ok('/termodinamica/climatizzazione') && (
        <Link href="/termodinamica/climatizzazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Climatizzazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Climatizzazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/isolamenti-termici') && (
        <Link href="/termodinamica/isolamenti-termici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Isolamenti Termici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Isolamenti Termici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/isolamenti-acustici') && (
        <Link href="/termodinamica/isolamenti-acustici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Isolamenti Acustici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Isolamenti Acustici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/caldaie') && (
        <Link href="/termodinamica/caldaie" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Caldaie" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Caldaie</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/pompe-di-calore') && (
        <Link href="/termodinamica/pompe-di-calore" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Pompe di Calore" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Pompe di Calore</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/impianti-idraulici') && (
        <Link href="/termodinamica/impianti-idraulici" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Impianti Idraulici" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Impianti Idraulici</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/irrigazione') && (
        <Link href="/termodinamica/irrigazione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Irrigazione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Irrigazione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/termodinamica/allacci') && (
        <Link href="/termodinamica/allacci" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Allacci" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Allacci</span></div>
        </Link>
        )}
        */}

        {/* ── Arredi ── */}
        {/*
        {ok('/arredi/quadri') && (
        <Link href="/arredi/quadri" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Quadri" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Quadri</span></div>
        </Link>
        )}
        */} {/*
        {ok('/arredi/soprammobili') && (
        <Link href="/arredi/soprammobili" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-2.webp" alt="Soprammobili" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Soprammobili</span></div>
        </Link>
        )}
        */} {/*
        {ok('/arredi/lampadari') && (
        <Link href="/arredi/lampadari" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-3.webp" alt="Lampadari" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Lampadari</span></div>
        </Link>
        )}
        */}

        {/* ── Tessuti ── */}
        {/*
        {ok('/tessuti/divani') && (
        <Link href="/tessuti/divani" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-4.webp" alt="Divani" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Divani</span></div>
        </Link>
        )}
        */} {/*
        {ok('/tessuti/tendaggi') && (
        <Link href="/tessuti/tendaggi" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-5.webp" alt="Tendaggi" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Tendaggi</span></div>
        </Link>
        )}
*/}

        {/* ── Servizi ── */}
        {/*
        {ok('/servizi/riparazioni') && (
        <Link href="/servizi/riparazioni" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-6.webp" alt="Riparazioni" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Riparazioni</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/montaggio') && (
        <Link href="/servizi/montaggio" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-7.webp" alt="Montaggio" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Montaggio</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/manutenzione') && (
        <Link href="/servizi/manutenzione" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-8.webp" alt="Manutenzione" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Manutenzione</span></div>
        </Link>
        )}
        */} {/*
        {ok('/servizi/contratti-di-pulizia') && (
        <Link href="/servizi/contratti-di-pulizia" className="page-card" style={{ flex: '1 1 260px', maxWidth: 300 }}>
          <div style={{ position: 'relative', height: 220, width: '100%' }}><Image fill src="/images/carousel/casa-ristrutturata-1.webp" alt="Contratti di Pulizia" sizes="(max-width:640px) calc(100vw - 40px),(max-width:1200px) calc(50vw - 30px),calc(33vw - 30px)" style={{ objectFit: 'cover' }} /></div>
          <div style={{ padding: '14px 16px' }}><span className="testo-articoli">Contratti di Pulizia</span></div>
        </Link>
        )}
        */}

      </HeroCardsScroll>
      </div>

      {/* Vendiamo Marchi di valore */}
      <div className="page-section-wrapper" style={{ margin: 0 }}>
        <div style={{ borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, background: '#fff', border: '1px solid #c8960c' }}>
          <h2 className="testo-articoli" style={{ textAlign: 'center', margin: 0 }}>
            Marchi leader &bull; Partner affidabili &bull; Qualità garantita
          </h2>
          <div className="partner-logo-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            {[
              { src: '/images/brand/partners/3M.webp',                alt: '3M',                  href: '#' },
              { src: '/images/brand/partners/alphacan.webp',          alt: 'Alphacan',            href: '#' },
              { src: '/images/brand/partners/alsistem.webp',          alt: 'Alsistem',            href: '#' },
              { src: '/images/brand/partners/ALU-ITALIA.webp',        alt: 'Alu Italia',          href: '#' },
              { src: '/images/brand/partners/AMAZON.webp',            alt: 'Amazon',              href: '#' },
              { src: '/images/brand/partners/ARGO.webp',              alt: 'Argo',                href: '#' },
              { src: '/images/brand/partners/ARISTON.webp',           alt: 'Ariston',             href: '#' },
              { src: '/images/brand/partners/BEGHELLI.webp',          alt: 'Beghelli',            href: '#' },
              { src: '/images/brand/partners/BETA.webp',              alt: 'Beta',                href: '#' },
              { src: '/images/brand/partners/BLACK-DECKER.webp',      alt: 'Black & Decker',      href: '#' },
              { src: '/images/brand/partners/BOSH.webp',              alt: 'Bosch',               href: '#' },
              { src: '/images/brand/partners/BOSTIK.webp',            alt: 'Bostik',              href: '#' },
              { src: '/images/brand/partners/BRICO-CENTER.webp',      alt: 'Brico Center',        href: '#' },
              { src: '/images/brand/partners/CANDY.webp',             alt: 'Candy',               href: '#' },
              { src: '/images/brand/partners/CANON.webp',             alt: 'Canon',               href: '#' },
              { src: '/images/brand/partners/CISA.webp',              alt: 'CISA',                href: '#' },
              { src: '/images/brand/partners/COMAS.webp',             alt: 'Comas',               href: '#' },
              { src: '/images/brand/partners/DAIKIN.webp',            alt: 'Daikin',              href: '#' },
              { src: '/images/brand/partners/DEGHI.webp',             alt: 'Deghi',               href: '#' },
              { src: '/images/brand/partners/DELONGHI.webp',          alt: 'DeLonghi',            href: '#' },
              { src: '/images/brand/partners/DEWALT.webp',            alt: 'DeWalt',              href: '#' },
              { src: '/images/brand/partners/DIGAL.webp',             alt: 'Digal',               href: '#' },
              { src: '/images/brand/partners/edilsider.webp',         alt: 'Edilsider',           href: '#' },
              { src: '/images/brand/partners/ELECTROLUX.webp',        alt: 'Electrolux',          href: '#' },
              { src: '/images/brand/partners/FAAC.webp',              alt: 'FAAC',                href: '#' },
              { src: '/images/brand/partners/FAI.webp',               alt: 'FAI',                 href: '#' },
              { src: '/images/brand/partners/FINSTRAL.webp',          alt: 'Finstral',            href: '#' },
              { src: '/images/brand/partners/FISCHER.webp',           alt: 'Fischer',             href: '#' },
              { src: '/images/brand/partners/GDM.webp',               alt: 'GDM',                 href: '#' },
              { src: '/images/brand/partners/GTHERMIC.webp',          alt: 'Gthermic',            href: '#' },
              { src: '/images/brand/partners/HAIER.webp',             alt: 'Haier',               href: '#' },
              { src: '/images/brand/partners/HISENSE.webp',           alt: 'Hisense',             href: '#' },
              { src: '/images/brand/partners/IMPERIAL.webp',          alt: 'Imperial',            href: '#' },
              { src: '/images/brand/partners/INDINVEST.webp',         alt: 'Indinvest',           href: '#' },
              { src: '/images/brand/partners/LEROY-MERLIN.webp',      alt: 'Leroy Merlin',        href: '#' },
              { src: '/images/brand/partners/LEVANTE.webp',           alt: 'Levante',             href: '#' },
              { src: '/images/brand/partners/LG.webp',                alt: 'LG',                  href: '#' },
              { src: '/images/brand/partners/LOCTITE.webp',           alt: 'Loctite',             href: '#' },
              { src: '/images/brand/partners/MAPEI.webp',             alt: 'Mapei',               href: '#' },
              { src: '/images/brand/partners/MAX-MEYER.webp',         alt: 'Max Meyer',           href: '#' },
              { src: '/images/brand/partners/METRA.webp',             alt: 'Metra',               href: '#' },
              { src: '/images/brand/partners/MITSUBISHI.webp',        alt: 'Mitsubishi',          href: '#' },
              { src: '/images/brand/partners/MONDO-CONVENIENZA.webp', alt: 'Mondo Convenienza',   href: '#' },
              { src: '/images/brand/partners/moskout.webp',           alt: 'Moskout',             href: '#' },
              { src: '/images/brand/partners/MOTTURA.webp',           alt: 'Mottura',             href: '#' },
              { src: '/images/brand/partners/MOULINEX.webp',          alt: 'Moulinex',            href: '#' },
              { src: '/images/brand/partners/PALAZZOLO.webp',         alt: 'Palazzolo',           href: '#' },
              { src: '/images/brand/partners/PANASONIC.webp',         alt: 'Panasonic',           href: '#' },
              { src: '/images/brand/partners/PATTEX.webp',            alt: 'Pattex',              href: '#' },
              { src: '/images/brand/partners/PROFIL-PLASTIC.webp',    alt: 'Profil Plastic',      href: '#' },
              { src: '/images/brand/partners/REHAU.webp',             alt: 'Rehau',               href: '#' },
              { src: '/images/brand/partners/ROLLTEK.webp',           alt: 'Rolltek',             href: '#' },
              { src: '/images/brand/partners/SALAMANDER.webp',        alt: 'Salamander',          href: '#' },
              { src: '/images/brand/partners/SAMSUNG.webp',           alt: 'Samsung',             href: '#' },
              { src: '/images/brand/partners/SARATOGA.webp',          alt: 'Saratoga',            href: '#' },
              { src: '/images/brand/partners/SCHUCO.webp',            alt: 'Schüco',              href: '#' },
              { src: '/images/brand/partners/SCOTCH.webp',            alt: 'Scotch',              href: '#' },
              { src: '/images/brand/partners/SCRIGNO.webp',           alt: 'Scrigno',             href: '#' },
              { src: '/images/brand/partners/SHARKNET.webp',          alt: 'Sharknet',            href: '#' },
              { src: '/images/brand/partners/SIEMENS.webp',           alt: 'Siemens',             href: '#' },
              { src: '/images/brand/partners/SIRTAL.webp',            alt: 'Sirtal',              href: '#' },
              { src: '/images/brand/partners/TOSHIBA.webp',           alt: 'Toshiba',             href: '#' },
              { src: '/images/brand/partners/TWIN-SYSTEMS.webp',      alt: 'Twin Systems',        href: '#' },
              { src: '/images/brand/partners/TYTAN.webp',             alt: 'Tytan',               href: '#' },
              { src: '/images/brand/partners/VIMAR.webp',             alt: 'Vimar',               href: '#' },
              { src: '/images/brand/partners/VORTICE.webp',           alt: 'Vortice',             href: '#' },
              { src: '/images/brand/partners/WHIRLPOOL.webp',         alt: 'Whirlpool',           href: '#' },
              { src: '/images/brand/partners/WURTH.webp',             alt: 'Würth',               href: '#' },
            ].map(m => {
              const boxStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', height: 52, border: '1px solid #fff', borderRadius: 6, background: '#fff', flexShrink: 0 }
              const img = <Image src={m.src} alt={m.alt} width={130} height={40} className="partner-logo-img" style={{ objectFit: 'contain' }} />
              return m.href !== '#' ? (
                <a key={m.alt} href={m.href} target="_blank" rel="noopener noreferrer" className="partner-logo-box" style={boxStyle}>
                  {img}
                </a>
              ) : (
                <div key={m.alt} className="partner-logo-box" style={boxStyle}>
                  {img}
                </div>
              )
            })}
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
        <div style={{ borderRadius: 20, padding: '28px 24px', color: '#444', fontSize: 15, lineHeight: 1.8, background: '#fff', border: '1px solid #c8960c' }}>
          <div className="seo-block-flex">
            <div>
              <h2 className="effetto-3d" style={{ marginBottom: 6, marginTop: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
                Serramenti, Sicurezza e Ristrutturazioni in tempi brevi!
              </h2>
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
            Vendiamo e installiamo serramenti, verande e tettoie su misura per abitazioni e uffici, garantendo tempi rapidi di produzione, consegna e installazione.<br /><br />
            Proteggiamo la tua casa con porte blindate, cancelli e grate, realizzati su misura, certificati, resistenti e progettati per garantire la massima sicurezza.<br /><br />
            Realizziamo ristrutturazioni chiavi in mano, con un unico referente che coordina ogni fase del progetto fino alla consegna, offrendo un servizio organizzato e professionale.<br /><br />
            Spediamo rapidamente in tutta Italia tutti i prodotti acquistabili nel nostro Shop Online.
          </p>
        </div>
      </div>
      <p className="IsDebug fs-11">login e logout non devono cambiare pagina</p>
    </div>
    </>
  )
}
