'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const slides: { img: string; title: string; text: React.ReactNode }[] = [
  {
    img: '/images/casa-ristrutturata-1.jpg',
    title: 'Infissi in alluminio',
    text: (<>
      <strong>Infissi in alluminio a Palermo: design, resistenza e isolamento per ogni ambiente</strong><br /><br />
      Gli infissi in alluminio rappresentano una delle soluzioni più richieste da chi desidera serramenti moderni, resistenti e durevoli nel tempo. Grazie alle loro caratteristiche tecniche, gli infissi in alluminio sono ideali sia per le nuove costruzioni sia per gli interventi di ristrutturazione, offrendo un perfetto equilibrio tra estetica, sicurezza e prestazioni.<br /><br />
      La nostra azienda propone infissi in alluminio a Palermo realizzati con materiali di alta qualità e progettati per garantire un ottimo isolamento termico e acustico. Le moderne tecnologie costruttive permettono infatti di ottenere profili performanti, capaci di migliorare il comfort abitativo e di contribuire al risparmio energetico dell&apos;immobile.<br /><br />
      <strong>Perché scegliere gli infissi in alluminio</strong><br /><br />
      Scegliere infissi in alluminio significa puntare su una soluzione elegante e funzionale. L&apos;alluminio è un materiale estremamente resistente agli agenti atmosferici, non teme umidità, sole e salsedine ed è particolarmente adatto anche in contesti urbani e marittimi come Palermo. Inoltre, richiede una manutenzione minima e mantiene nel tempo stabilità, colore e prestazioni.<br /><br />
      Dal punto di vista estetico, gli infissi in alluminio si distinguono per il loro design pulito e contemporaneo. Possono essere personalizzati in diverse finiture e colori, adattandosi perfettamente a qualsiasi stile architettonico, dal classico al moderno.<br /><br />
      <strong>Infissi in alluminio su misura a Palermo</strong><br /><br />
      Realizziamo infissi in alluminio su misura a Palermo per abitazioni, uffici e attività commerciali, seguendo ogni fase del progetto: rilievo misure, consulenza, produzione e posa in opera. Il nostro obiettivo è offrire soluzioni affidabili, durevoli e in linea con le reali esigenze del cliente.<br /><br />
      Se stai cercando infissi in alluminio a Palermo capaci di unire qualità, efficienza energetica e stile, contattaci per ricevere maggiori informazioni o un preventivo personalizzato.
    </>),
  },
  {
    img: '/images/casa-ristrutturata-2.jpg',
    title: 'Infissi in PVC',
    text: (<>
      <strong>Infissi in PVC a Palermo: comfort, risparmio energetico e praticità</strong><br /><br />
      Gli infissi in PVC sono una scelta sempre più apprezzata da chi desidera migliorare il comfort della propria casa e ridurre i consumi energetici. Grazie alle loro eccellenti proprietà isolanti, gli infissi in PVC rappresentano una soluzione pratica, conveniente e durevole, ideale sia per nuove abitazioni sia per lavori di ristrutturazione.<br /><br />
      La nostra azienda propone infissi in PVC a Palermo progettati per garantire ottime prestazioni in termini di isolamento termico e acustico. Questo significa ambienti più confortevoli in ogni stagione, meno dispersioni di calore in inverno e una migliore protezione dal caldo estivo, con un concreto vantaggio anche in bolletta.<br /><br />
      <strong>I vantaggi degli infissi in PVC</strong><br /><br />
      Uno dei principali punti di forza del PVC è la sua capacità di offrire alte prestazioni con costi competitivi. Gli infissi in PVC non richiedono manutenzioni complesse, resistono bene all&apos;umidità e agli agenti atmosferici e mantengono nel tempo funzionalità ed estetica. Sono inoltre disponibili in numerose finiture e colorazioni, anche effetto legno, per adattarsi facilmente a diversi contesti abitativi.<br /><br />
      Gli infissi in PVC a Palermo sono particolarmente indicati per chi cerca una soluzione efficiente e conveniente, senza rinunciare alla qualità. Possono migliorare sensibilmente il comfort interno dell&apos;immobile e contribuire a valorizzarlo nel tempo.<br /><br />
      <strong>Infissi in PVC su misura a Palermo</strong><br /><br />
      Realizziamo infissi in PVC su misura con attenzione ai dettagli, seguendo il cliente dalla scelta del prodotto fino alla posa finale. Ogni progetto viene studiato per offrire il miglior equilibrio tra estetica, funzionalità e budget.<br /><br />
      Se vuoi installare infissi in PVC a Palermo affidabili, moderni e pensati per il risparmio energetico, siamo a tua disposizione per una consulenza e un preventivo personalizzato.
    </>),
  },
  {
    img: '/images/casa-ristrutturata-3.jpg',
    title: 'Verande in alluminio',
    text: (<>
      <strong>Verande in alluminio a Palermo: eleganza, luminosità e funzionalità per i tuoi spazi</strong><br /><br />
      Le verande in alluminio sono la soluzione ideale per valorizzare balconi, terrazze e spazi esterni, creando ambienti più protetti, luminosi e vivibili durante tutto l&apos;anno. Grazie alla leggerezza e alla resistenza dell&apos;alluminio, queste strutture offrono ottime prestazioni e un&apos;estetica moderna, adatta a ogni tipologia di immobile.<br /><br />
      La nostra azienda realizza verande in alluminio a Palermo su misura, progettate per integrarsi perfettamente con l&apos;architettura dell&apos;edificio e con le esigenze del cliente. Ogni veranda viene studiata con attenzione, per garantire un risultato funzionale, armonioso e durevole nel tempo.<br /><br />
      <strong>Perché scegliere una veranda in alluminio</strong><br /><br />
      L&apos;alluminio è un materiale particolarmente apprezzato per la realizzazione di verande perché unisce robustezza, stabilità e ridotta manutenzione. Resiste agli agenti atmosferici, non teme l&apos;umidità e assicura una lunga durata, anche in zone esposte al sole e alla salsedine come Palermo.<br /><br />
      Le verande in alluminio a Palermo permettono di chiudere e proteggere gli spazi esterni in modo elegante, migliorando il comfort abitativo e aumentando la fruibilità della casa. Possono essere personalizzate in diverse finiture, colori e configurazioni, così da rispondere sia a esigenze estetiche sia pratiche.<br /><br />
      <strong>Verande in alluminio su misura a Palermo</strong><br /><br />
      Realizziamo verande in alluminio per abitazioni private, attici, terrazzi, balconi e contesti residenziali, offrendo un servizio completo che comprende consulenza, rilievo misure, progettazione e installazione. Ogni soluzione viene pensata per ottimizzare gli spazi e migliorare il valore dell&apos;immobile.<br /><br />
      Se stai cercando verande in alluminio a Palermo affidabili, belle da vedere e costruite con materiali di qualità, contattaci per ricevere maggiori informazioni o un preventivo personalizzato.
    </>),
  },
  {
    img: '/images/casa-ristrutturata-4.jpg',
    title: 'Verande in PVC',
    text: (<>
      <strong>Verande in PVC a Palermo: una soluzione pratica e conveniente per chiudere gli spazi esterni</strong><br /><br />
      Le verande in PVC sono una soluzione pratica e versatile per chi desidera chiudere balconi, terrazze o altri spazi esterni, migliorandone comfort, protezione e funzionalità. Grazie alle buone prestazioni isolanti del materiale e alla facilità di manutenzione, il PVC rappresenta una scelta molto apprezzata in ambito residenziale.<br /><br />
      La nostra azienda realizza verande in PVC a Palermo su misura, studiate per adattarsi alle caratteristiche dell&apos;immobile e alle necessità del cliente. Ogni intervento viene seguito con attenzione, con l&apos;obiettivo di offrire un risultato pratico, ordinato ed esteticamente gradevole.<br /><br />
      <strong>I vantaggi delle verande in PVC</strong><br /><br />
      Il PVC è un materiale che offre un ottimo rapporto tra qualità e convenienza. Le verande in PVC consentono di proteggere gli spazi esterni da vento, pioggia e polvere, creando ambienti più vivibili e sfruttabili durante tutto l&apos;anno. Inoltre, richiedono poca manutenzione e permettono di mantenere buone prestazioni nel tempo.<br /><br />
      Le verande in PVC a Palermo sono particolarmente indicate per chi cerca una soluzione funzionale e accessibile, capace di migliorare l&apos;utilizzo degli spazi senza interventi invasivi. Possono essere personalizzate nelle forme, nelle aperture e nelle finiture, per adattarsi al meglio al contesto abitativo.<br /><br />
      <strong>Verande in PVC su misura a Palermo</strong><br /><br />
      Progettiamo e installiamo verande in PVC per balconi, terrazzi e abitazioni private, offrendo un servizio completo che parte dalla consulenza iniziale e arriva fino alla posa finale. Ogni soluzione viene realizzata su misura, con attenzione alla funzionalità, all&apos;estetica e alla durata.<br /><br />
      Se vuoi realizzare verande in PVC a Palermo affidabili e convenienti, contattaci per ricevere una consulenza personalizzata e scoprire la soluzione più adatta ai tuoi spazi.
    </>),
  },
  {
    img: '/images/casa-ristrutturata-5.jpg',
    title: 'Persiane in alluminio',
    text: (<>
      <strong>Persiane in alluminio a Palermo: sicurezza, durata e stile per la tua casa</strong><br /><br />
      Le persiane in alluminio sono una scelta eccellente per chi desidera proteggere la propria abitazione, migliorare il comfort interno e valorizzare l&apos;estetica della facciata. Resistenti, pratiche e durevoli, rappresentano una soluzione ideale sia per le nuove costruzioni sia per gli interventi di ristrutturazione.<br /><br />
      La nostra azienda realizza persiane in alluminio a Palermo su misura, progettate per garantire funzionalità, affidabilità e un perfetto equilibrio tra estetica e prestazioni. Grazie alla qualità dei materiali e alla cura nella lavorazione, offriamo soluzioni capaci di resistere nel tempo e di adattarsi a diversi stili architettonici.<br /><br />
      <strong>Perché scegliere le persiane in alluminio</strong><br /><br />
      L&apos;alluminio è un materiale molto apprezzato per la realizzazione delle persiane perché unisce leggerezza, robustezza e resistenza agli agenti atmosferici. Non richiede manutenzioni frequenti, non si deforma facilmente e conserva a lungo le proprie caratteristiche tecniche ed estetiche.<br /><br />
      Le persiane in alluminio a Palermo sono particolarmente indicate anche per il clima locale, grazie alla loro capacità di resistere a sole, pioggia, vento e salsedine. Oltre a migliorare la protezione degli infissi, contribuiscono a regolare luce, aerazione e privacy, aumentando il benessere all&apos;interno della casa.<br /><br />
      <strong>Persiane in alluminio su misura a Palermo</strong><br /><br />
      Realizziamo persiane in alluminio personalizzate in base alle dimensioni, al colore e allo stile richiesto, seguendo ogni fase del lavoro: consulenza, rilievo misure, produzione e posa in opera. Ogni progetto viene studiato per garantire una soluzione durevole, funzionale e armoniosa con l&apos;estetica dell&apos;immobile.<br /><br />
      Se stai cercando persiane in alluminio a Palermo di qualità, affidati alla nostra esperienza per trovare la soluzione più adatta alla tua abitazione.
    </>),
  },
  {
    img: '/images/casa-ristrutturata-6.jpg',
    title: 'Imbotti in alluminio con tapparelle coibentate',
    text: (<>
      <strong>Imbotti in alluminio con tapparelle coibentate a Palermo: protezione, isolamento e finiture di qualità</strong><br /><br />
      Gli imbotti in alluminio con tapparelle coibentate rappresentano una soluzione completa per migliorare l&apos;estetica del vano finestra, aumentare la protezione dell&apos;immobile e contribuire all&apos;isolamento termico e acustico della casa. Si tratta di un sistema pratico e funzionale, particolarmente adatto sia alle nuove costruzioni sia agli interventi di ristrutturazione.<br /><br />
      La nostra azienda realizza imbotti in alluminio con tapparelle coibentate a Palermo su misura, con particolare attenzione alla qualità dei materiali, alla precisione delle finiture e alla durata nel tempo. L&apos;obiettivo è offrire una soluzione capace di migliorare il comfort abitativo e di valorizzare l&apos;aspetto complessivo dei serramenti.<br /><br />
      <strong>I vantaggi di imbotti in alluminio e tapparelle coibentate</strong><br /><br />
      Gli imbotti in alluminio permettono di rifinire il foro finestra in modo ordinato, elegante e resistente, proteggendo le superfici e riducendo la necessità di manutenzione. Le tapparelle coibentate, invece, aiutano a migliorare l&apos;isolamento termico e acustico, contribuendo al risparmio energetico e al comfort degli ambienti interni.<br /><br />
      Questa combinazione è ideale per chi desidera una soluzione moderna, pratica e durevole. Gli imbotti in alluminio con tapparelle coibentate a Palermo sono particolarmente utili per migliorare la protezione dal caldo, dalla luce e dagli agenti atmosferici, senza rinunciare all&apos;estetica.<br /><br />
      <strong>Soluzioni su misura a Palermo</strong><br /><br />
      Progettiamo e installiamo sistemi su misura, studiati in base alle caratteristiche dell&apos;immobile e alle esigenze del cliente. Ogni intervento viene seguito con attenzione, per garantire funzionalità, resa estetica e un risultato finale preciso in ogni dettaglio.<br /><br />
      Se cerchi imbotti in alluminio con tapparelle coibentate a Palermo, contattaci per ricevere una consulenza personalizzata e trovare la soluzione più adatta alla tua casa.
    </>),
  },
]

type Effect = 'fade' | 'slideLeft' | 'slideRight' | 'slideUp' | 'slideDown' | 'zoom'
const allEffects: Effect[] = ['fade', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoom']
const randomEffect = () => allEffects[Math.floor(Math.random() * allEffects.length)]

// Trasformazione iniziale per ogni effetto entrata
const entranceTransform: Record<Effect, string> = {
  fade:       '',
  slideLeft:  'translateX(-70px)',
  slideRight: 'translateX(70px)',
  slideUp:    'translateY(-55px)',
  slideDown:  'translateY(55px)',
  zoom:       'scale(1.15)',
}

const STYLES = `
  /* Solo heroEntranceFade serve ancora (per il testo overlay con key-change) */
  @keyframes heroEntranceFade { from { opacity:0 } to { opacity:1 } }

  .hero-grid {
    position: relative;
    height: clamp(420px, 65vh, 780px);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 0;
    border: 5px solid #ffffff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.13);
    flex-shrink: 0;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-img-col {
    position: absolute;
    inset: 0;
  }

  .hero-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    z-index: 0;
    will-change: opacity, transform;
  }
  /* La prima slide parte visibile al montaggio */
  .hero-slide:first-child {
    opacity: 1;
    z-index: 2;
  }

  /* Overlay testo */
  .hero-overlay {
    position: absolute;
    top: 0; left: 0; right: 0;
    background: linear-gradient(135deg,
      rgba(120, 120, 120, 0.95) 0%,
      rgba(138, 138, 138, 0.92) 20%,
      rgba(208, 208, 208, 0.92) 45%,
      rgba(138, 138, 138, 0.92) 80%,
      rgba(120, 120, 120, 0.95) 100%
    );
    z-index: 5;
    overflow: hidden;
    max-height: 86px;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hero-overlay.open {
    height: 80%;
    max-height: 80%;
    overflow-y: auto;
  }

  .hero-overlay-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 28px;
    min-height: 86px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  .hero-overlay-body {
    padding: 0 28px 28px;
    position: relative;
    z-index: 1;
  }

  .hero-dots {
    position: absolute;
    bottom: calc(10% - 22px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
  }

  @media (max-width: 640px) {
    .hero-grid { height: clamp(420px, 80vw, 560px); }
    .hero-overlay { max-height: 74px; }
    .hero-overlay-header { padding: 16px 18px; min-height: 74px; }
    .hero-overlay-body { padding: 0 18px 20px; }
  }
`

const DUR = '2s'

export default function HeroCarousel() {
  const [current,  setCurrent]  = useState(0)
  const [expanded, setExpanded] = useState(false)

  const currentRef        = useRef(0)
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedRef         = useRef(false)
  const expandedRef       = useRef(false)
  const slideRefs         = useRef<Array<HTMLDivElement | null>>(slides.map(() => null))
  const transitionVersion = useRef(0)   // annulla listener stale

  /** Applica la transizione CSS direttamente sul DOM */
  const doTransition = (from: number, to: number, effect: Effect) => {
    const fromEl = slideRefs.current[from]
    const toEl   = slideRefs.current[to]
    if (!toEl) return

    // Nascondi tutte le slide non coinvolte
    slides.forEach((_, i) => {
      if (i !== from && i !== to) {
        const el = slideRefs.current[i]
        if (el) {
          el.style.transition = 'none'
          el.style.opacity    = '0'
          el.style.transform  = 'none'
          el.style.zIndex     = '0'
        }
      }
    })

    // Uscita: fade out
    if (fromEl) {
      fromEl.style.transition = 'none'
      fromEl.style.opacity    = '1'
      fromEl.style.transform  = 'none'
      fromEl.style.zIndex     = '1'
      void fromEl.offsetWidth                       // commit stato iniziale
      fromEl.style.transition = `opacity ${DUR} ease`
      fromEl.style.opacity    = '0'
    }

    // Entrata: slide/zoom + fade in
    const initTransform = entranceTransform[effect]
    toEl.style.transition = 'none'
    toEl.style.opacity    = '0'
    toEl.style.transform  = initTransform || 'none'
    toEl.style.zIndex     = '2'
    void toEl.offsetWidth                           // commit stato iniziale
    toEl.style.transition = initTransform
      ? `opacity ${DUR} ease, transform ${DUR} ease`
      : `opacity ${DUR} ease`
    toEl.style.opacity    = '1'
    toEl.style.transform  = 'none'
    // opacity:1 rimane come stile inline → nessun conflitto con fill-mode
  }

  /** Avvia la transizione aspettando il caricamento se necessario.
   *  Il version counter garantisce che listener stale vengano ignorati. */
  const playTransition = (from: number, to: number, effect: Effect) => {
    const version = ++transitionVersion.current
    const toEl    = slideRefs.current[to]
    if (!toEl) return

    const run = () => {
      if (transitionVersion.current !== version) return   // versione superata
      doTransition(from, to, effect)
    }

    const img = toEl.querySelector('img')
    if (!img || img.complete) {
      run()
    } else {
      img.addEventListener('load',  run, { once: true })
      img.addEventListener('error', run, { once: true })
    }
  }

  const advance = (next: number, effect?: Effect) => {
    const from = currentRef.current
    const eff  = effect ?? randomEffect()
    currentRef.current = next
    setCurrent(next)
    playTransition(from, next, eff)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!pausedRef.current && !expandedRef.current) {
        // Avanzamento automatico sempre a sinistra → loop circolare senza stacco
        advance((currentRef.current + 1) % slides.length, 'slideLeft')
      }
    }, 12000)
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const toggleExpanded = () => {
    const next = !expandedRef.current
    expandedRef.current = next
    setExpanded(next)
  }

  const handleDot = (i: number) => {
    if (i === currentRef.current) return
    if (timerRef.current) clearInterval(timerRef.current)
    // Direzione dot: avanti o indietro (con wrap circolare)
    const n    = slides.length
    const curr = currentRef.current
    const fwd  = ((i - curr + n) % n) <= n / 2
    advance(i, fwd ? 'slideLeft' : 'slideRight')
    if (!expandedRef.current) startTimer()
  }

  return (
    <div
      className="hero-grid"
      onMouseEnter={() => { pausedRef.current = true  }}
      onMouseLeave={() => { pausedRef.current = false }}
      onTouchStart={() => { pausedRef.current = true  }}
      onTouchEnd={()   => { pausedRef.current = false }}
    >
      <style>{STYLES}</style>

      {/* Tutte le slide sempre nel DOM — chiavi stabili, immagini caricate una sola volta */}
      <div className="hero-img-col">
        {slides.map((slide, i) => (
          <div
            key={`slide-${i}`}
            className="hero-slide"
            ref={el => { slideRefs.current[i] = el }}
          >
            <Image
              fill
              src={slide.img}
              alt={slide.title}
              sizes="(max-width: 1920px) 100vw, 1920px"
              priority={i === 0}
              loading={i === 0 ? 'eager' : undefined}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 32 : 14,
              height: 14, borderRadius: 7,
              border: 'none', cursor: 'pointer',
              padding: '15px',
              backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.55)',
              backgroundClip: 'content-box',
              boxSizing: 'content-box',
              transition: 'width 0.3s, background-color 0.3s',
            }}
          />
        ))}
      </div>

      {/* Overlay testo */}
      <div className={`hero-overlay${expanded ? ' open' : ''}`}>
        <div className="hero-overlay-header">
          <h2
            key={`title-${current}`}
            style={{
              fontSize: 'clamp(17px, 2.6vw, 26px)',
              fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.25,
              animation: `heroEntranceFade ${DUR} ease forwards`,
            }}
          >
            {slides[current].title}
          </h2>
          <button
            onClick={toggleExpanded}
            aria-label={expanded ? 'Chiudi testo' : 'Leggi testo'}
            style={{
              flexShrink: 0,
              width: 34, height: 34,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 22, fontWeight: 400,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0,
              lineHeight: '1',
              fontFamily: 'Arial, sans-serif',
              transition: 'background 0.2s',
            }}
          >
            {expanded ? '−' : '+'}
          </button>
        </div>
        <div className="hero-overlay-body">
          <p
            key={`body-${current}`}
            style={{
              fontSize: 15, color: '#fff', lineHeight: 1.8, margin: 0,
              animation: 'heroEntranceFade 0.3s ease forwards',
            }}
          >
            {slides[current].text}
          </p>
        </div>
      </div>
    </div>
  )
}
