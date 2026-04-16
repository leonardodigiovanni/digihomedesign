'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const slides = [
  {
    img: '/images/casa-ristrutturata-1.jpg',
    title: 'Qualità che si vede',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    img: '/images/casa-ristrutturata-2.jpg',
    title: 'Ogni dettaglio conta',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
  },
  {
    img: '/images/casa-ristrutturata-3.jpg',
    title: 'Spazi che ispirano',
    text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.',
  },
  {
    img: '/images/casa-ristrutturata-4.jpg',
    title: 'Il tuo progetto, la nostra cura',
    text: 'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis rerum necessitatibus saepe eveniet.',
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

  const advance = (next: number) => {
    const from   = currentRef.current
    const effect = randomEffect()
    currentRef.current = next
    setCurrent(next)
    playTransition(from, next, effect)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!pausedRef.current && !expandedRef.current) {
        advance((currentRef.current + 1) % slides.length)
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
    advance(i)
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
