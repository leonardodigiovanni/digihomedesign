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

const entranceAnim: Record<Effect, string> = {
  fade:       'heroEntranceFade',
  slideLeft:  'heroEntranceLeft',
  slideRight: 'heroEntranceRight',
  slideUp:    'heroEntranceUp',
  slideDown:  'heroEntranceDown',
  zoom:       'heroEntranceZoom',
}

const STYLES = `
  @keyframes heroFadeOut       { from { opacity:1 } to { opacity:0 } }
  @keyframes heroEntranceFade  { from { opacity:0 } to { opacity:1 } }
  @keyframes heroEntranceLeft  { from { opacity:0; transform:translateX(-70px) } to { opacity:1; transform:translateX(0) } }
  @keyframes heroEntranceRight { from { opacity:0; transform:translateX(70px)  } to { opacity:1; transform:translateX(0) } }
  @keyframes heroEntranceUp    { from { opacity:0; transform:translateY(-55px) } to { opacity:1; transform:translateY(0) } }
  @keyframes heroEntranceDown  { from { opacity:0; transform:translateY(55px)  } to { opacity:1; transform:translateY(0) } }
  @keyframes heroEntranceZoom  { from { opacity:0; transform:scale(1.15) }       to { opacity:1; transform:scale(1)    } }

  .hero-grid {
    position: relative;
    height: clamp(360px, 52vh, 620px);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 32px;
    border: 5px solid #ffffff;
    box-shadow: 0 4px 32px rgba(0,0,0,0.13);
    flex-shrink: 0;
    box-sizing: border-box;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-img-col {
    position: absolute;
    inset: 0;
  }

  /* Pannello testo: overlay semitrasparente a destra */
  .hero-text-col {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 42%;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .hero-text-stack {
    display: grid;
    min-height: 100%;
  }
  .hero-text-panel {
    grid-column: 1;
    grid-row: 1;
    position: relative;
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(0, 0, 0, 0.60);
  }

  @media (max-width: 640px) {
    .hero-grid {
      height: clamp(420px, 80vw, 560px);
    }
    .hero-text-col {
      top: auto;
      bottom: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: auto;
    }
    .hero-text-panel {
      padding: 24px 20px;
    }
  }
`
const DUR = '2s'

export default function HeroCarousel() {
  const [current,      setCurrent]      = useState(0)
  const [previous,     setPrevious]     = useState<number | null>(null)
  const [effect,       setEffect]       = useState<Effect>('fade')
  const [transitionId, setTransitionId] = useState(0)
  const currentRef = useRef(0)
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const pausedRef  = useRef(false)

  const advance = (next: number) => {
    setPrevious(currentRef.current)
    setCurrent(next)
    currentRef.current = next
    setEffect(randomEffect())
    setTransitionId(id => id + 1)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(
      () => { if (!pausedRef.current) advance((currentRef.current + 1) % slides.length) },
      12000
    )
  }

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const handleDot = (i: number) => {
    if (i === currentRef.current) return
    if (timerRef.current) clearInterval(timerRef.current)
    advance(i)
    startTimer()
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

      {/* ── Immagine di sfondo (occupa tutto il container) ── */}
      <div className="hero-img-col">
        {previous !== null && (
          <Image
            key={`prev-${transitionId}`}
            fill
            src={slides[previous].img}
            alt=""
            sizes="(max-width: 640px) 100vw, 1000px"
            style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 1, animation: `heroFadeOut ${DUR} ease forwards` }}
          />
        )}
        <Image
          key={`curr-${transitionId}`}
          fill
          src={slides[current].img}
          alt={slides[current].title}
          sizes="(max-width: 640px) 100vw, 1000px"
          priority
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0, animation: `${entranceAnim[effect]} ${DUR} ease forwards` }}
        />

        {/* Dots — centrati sulla porzione immagine visibile (58% sinistra) */}
        <div style={{
          position: 'absolute', bottom: 18, left: '29%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 10, zIndex: 3,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? 28 : 10,
                height: 10, borderRadius: 5,
                border: 'none', cursor: 'pointer',
                padding: i === current ? '17px 8px' : '17px',
                backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                backgroundClip: 'content-box',
                transition: 'width 0.3s, background-color 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Colonna testo: scorribile ── */}
      <div className="hero-text-col">
        {/*
          Entrambi i pannelli nella stessa cella CSS grid (gridColumn:1, gridRow:1).
          Si sovrappongono per il crossfade, ma contribuiscono all'altezza
          del contenitore → su mobile il carousel si espande; su desktop si scorre.
        */}
        <div className="hero-text-stack">
          {previous !== null && (
            <div
              key={`tprev-${transitionId}`}
              className="hero-text-panel"
              style={{ zIndex: 1, animation: `heroFadeOut ${DUR} ease forwards` }}
            >
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: '0 0 20px' }}>
                {slides[previous].title}
              </h2>
              <p style={{ fontSize: 15, color: '#bbb', lineHeight: 1.75, margin: 0 }}>
                {slides[previous].text}
              </p>
            </div>
          )}
          <div
            key={`tcurr-${transitionId}`}
            className="hero-text-panel"
            style={{ zIndex: 0, animation: `heroEntranceFade ${DUR} ease forwards` }}
          >
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.25, margin: '0 0 20px' }}>
              {slides[current].title}
            </h2>
            <p style={{ fontSize: 15, color: '#bbb', lineHeight: 1.75, margin: 0 }}>
              {slides[current].text}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
