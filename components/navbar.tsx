'use client'

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { clientPages, standalonePages, visibleAdminPages, visibleInternalPages, visibleFornitoriPages, visibleClientiPages, aiutoPages, categoryGroups, areaClientiPages, prodottiPages, prodottiSubgroups, comfortSpaziEsterniPages, antintrusioneSicurezzaPages, carpenteriaArredoPages, ristrutturazioniChiaviInManoPages, type NavPage, type CategoryGroup } from '@/lib/nav-config'
import HeaderAuth from '@/components/header-auth'
import ShortcutStar from '@/components/shortcut-star'
import { useHomeShortcuts } from '@/lib/home-shortcuts-context'
import { useNavDropdownRequest, type AnchorRect } from '@/lib/nav-dropdown-context'

// Pagine spostate dal dropdown di categoria a un menu "flat" dedicato (es. Comfort
// e Spazi Esterni): restano nell'array categoryGroups (serve al pannello admin
// "Pagine visibili" per il toggle), ma non vengono più duplicate nel dropdown
// della categoria di origine — l'URL sotto /serramenti/* non cambia.
const HIDDEN_FROM_CATEGORY: Record<string, number[]> = {
  serramenti: [2082, 2081, 203, 2031, 210, 202, 204, 205],
  metallurgia: [2124, 2125, 2126, 215, 214, 2201, 2202, 216, 217],
  legno: [249],
}

interface NavbarProps {
  role: string | null
  disabledPages?: number[]
  rolePermissions?: Record<string, number[]>
  username?: string | null
  registrazioniDisabilitate?: boolean
  bannerAbilitato?: boolean
  cartCount?: number
  cartAcquistiCount?: number
  unreadEmailCount?: number
  unreadAvvisiCount?: number
  clienteAbilitato?: boolean
}

export default function Navbar({ role, disabledPages = [], rolePermissions = {}, username, registrazioniDisabilitate, bannerAbilitato = false, cartCount = 0, cartAcquistiCount = 0, unreadEmailCount = 0, unreadAvvisiCount = 0, clienteAbilitato = true }: NavbarProps) {
  const { shortcuts } = useHomeShortcuts()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [liveAvvisiCount, setLiveAvvisiCount] = useState(unreadAvvisiCount)
  const [computoCount, setComputoCount] = useState(0)

  useEffect(() => {
    try { setComputoCount(parseInt(localStorage.getItem('computo_count') ?? '0', 10) || 0) } catch {}
    function handle(e: Event) { setComputoCount((e as CustomEvent<{ count: number }>).detail.count) }
    window.addEventListener('computo-count-changed', handle)
    return () => window.removeEventListener('computo-count-changed', handle)
  }, [])

  // Colore badge carrelli: verde se completo/salvabile, arancione se ci sono
  // lacune aperte (caratteristiche obbligatorie mancanti). Il computometrico non
  // ha ancora questo concetto, resta sempre completo finché non ne avrà uno.
  const [computoCompleto, setComputoCompleto] = useState(true)
  const [preventivoCompleto, setPreventivoCompleto] = useState(true)
  const [acquistiCompleto, setAcquistiCompleto] = useState(true)

  useEffect(() => {
    try { setComputoCompleto(localStorage.getItem('computo_completo') !== '0') } catch {}
    function handle(e: Event) { setComputoCompleto((e as CustomEvent<{ completo: boolean }>).detail.completo) }
    window.addEventListener('computo-completo-changed', handle)
    return () => window.removeEventListener('computo-completo-changed', handle)
  }, [])

  useEffect(() => {
    try { setPreventivoCompleto(localStorage.getItem('preventivo_completo') !== '0') } catch {}
    function handle(e: Event) { setPreventivoCompleto((e as CustomEvent<{ completo: boolean }>).detail.completo) }
    window.addEventListener('preventivo-completo-changed', handle)
    return () => window.removeEventListener('preventivo-completo-changed', handle)
  }, [])

  useEffect(() => {
    try { setAcquistiCompleto(localStorage.getItem('acquisti_completo') !== '0') } catch {}
    function handle(e: Event) { setAcquistiCompleto((e as CustomEvent<{ completo: boolean }>).detail.completo) }
    window.addEventListener('acquisti-completo-changed', handle)
    return () => window.removeEventListener('acquisti-completo-changed', handle)
  }, [])

  const BADGE_VERDE = '#1a9e2a'
  const BADGE_ARANCIONE = '#e65100'

  useEffect(() => {
    function handle(e: Event) {
      setLiveAvvisiCount((e as CustomEvent<{ count: number }>).detail.count)
    }
    window.addEventListener('avvisi-count-changed', handle)
    return () => window.removeEventListener('avvisi-count-changed', handle)
  }, [])
  const [sectionOpen, setSectionOpen] = useState(false)
  const [mobileOpenSection, setMobileOpenSection] = useState<string | null>(null)
  const toggleMobileSection = (key: string) => setMobileOpenSection(prev => prev === key ? null : key)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(false)
  const router              = useRouter()
  const pathname            = usePathname()
  const skipSectionClose    = useRef(false)
  const dropRef     = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const innerRef    = useRef<HTMLDivElement>(null)
  const scrollPos   = useRef(0)

  function updateArrows() {
    const container = scrollRef.current
    const inner     = innerRef.current
    if (!container || !inner) return
    const maxScroll = inner.offsetWidth - container.offsetWidth
    // Se il contenuto ora entra tutto (es. dopo un resize), annulla uno scroll residuo:
    // altrimenti marginLeft resterebbe negativo con canRight già false e canLeft bloccato.
    if (maxScroll <= 0 && scrollPos.current !== 0) {
      scrollPos.current = 0
      inner.style.marginLeft = '0'
    }
    setCanLeft(scrollPos.current > 0)
    setCanRight(maxScroll > 0 && scrollPos.current < maxScroll - 1)
  }

  function scrollNav(direction: 'left' | 'right') {
    const container = scrollRef.current
    const inner     = innerRef.current
    if (!container || !inner) return
    const S = scrollPos.current
    const W = container.offsetWidth
    const AW = 42 // freccia quadrata: larghezza = altezza navbar
    const items = Array.from(inner.children) as HTMLElement[]
    const maxScroll = inner.offsetWidth - W
    if (maxScroll <= 0) {
      // Nessun overflow: assicurati che uno scroll residuo non lasci la nav bloccata
      if (scrollPos.current !== 0) {
        scrollPos.current = 0
        inner.style.marginLeft = '0'
        updateArrows()
      }
      return
    }

    // Posizione iniziale basata sulla direzione
    let initial: number
    if (direction === 'right') {
      const target = items.find(el => el.offsetLeft + el.offsetWidth > S + W - AW + 1)
      initial = target ? Math.max(0, target.offsetLeft - AW) : maxScroll
    } else {
      initial = 0
    }

    initial = Math.max(0, Math.min(initial, maxScroll))

    // Cleanup solo per destra: la sinistra va sempre a S=0 (inizio esatto)
    let next = initial
    for (let i = 0; i < 6 && direction === 'right'; i++) {
      let adjusted = false
      // Bordo freccia destra: x = W-AW in nav-scroll
      if (next < maxScroll) {
        const rEdge = next + W - AW
        const rs = items.find(el => el.offsetLeft < rEdge && el.offsetLeft + el.offsetWidth > rEdge)
        if (rs) { next = Math.min(maxScroll, rs.offsetLeft - (W - AW)); adjusted = true }
      }
      // Bordo freccia sinistra: x = AW in nav-scroll (solo se freccia sinistra visibile)
      if (next > 0) {
        const lEdge = next + AW
        const ls = items.find(el => el.offsetLeft < lEdge && el.offsetLeft + el.offsetWidth > lEdge)
        if (ls) { next = Math.min(maxScroll, ls.offsetLeft + ls.offsetWidth - AW); adjusted = true }
      }
      if (!adjusted) break
    }

    next = Math.max(0, Math.min(next, maxScroll))
    scrollPos.current = next
    inner.style.marginLeft = `-${next}px`
    updateArrows()
  }

  // Scorrimento graduale al passaggio del mouse sulle frecce (hover), indipendente
  // dal salto "a pagina" del click gestito da scrollNav.
  const hoverDir   = useRef<'left' | 'right' | null>(null)
  const hoverRaf   = useRef<number | null>(null)
  const hoverLastTs = useRef<number | null>(null)
  const HOVER_SPEED = 160 // px/sec

  function hoverStep(ts: number) {
    const container = scrollRef.current
    const inner     = innerRef.current
    const dir       = hoverDir.current
    if (!container || !inner || !dir) { hoverRaf.current = null; hoverLastTs.current = null; return }
    const maxScroll = inner.offsetWidth - container.offsetWidth
    const last = hoverLastTs.current ?? ts
    const dt = (ts - last) / 1000
    hoverLastTs.current = ts
    if (maxScroll <= 0) { hoverRaf.current = null; return }
    let next = scrollPos.current + (dir === 'right' ? 1 : -1) * HOVER_SPEED * dt
    next = Math.max(0, Math.min(next, maxScroll))
    scrollPos.current = next
    inner.style.marginLeft = `-${next}px`
    updateArrows()
    if ((dir === 'right' && next < maxScroll) || (dir === 'left' && next > 0)) {
      hoverRaf.current = requestAnimationFrame(hoverStep)
    } else {
      hoverRaf.current = null
      hoverLastTs.current = null
    }
  }

  function startHoverScroll(direction: 'left' | 'right') {
    hoverDir.current = direction
    hoverLastTs.current = null
    if (hoverRaf.current == null) hoverRaf.current = requestAnimationFrame(hoverStep)
  }

  function stopHoverScroll() {
    hoverDir.current = null
    if (hoverRaf.current != null) { cancelAnimationFrame(hoverRaf.current); hoverRaf.current = null }
    hoverLastTs.current = null
  }

  useEffect(() => stopHoverScroll, [])

  // Chiudi tutto al cambio pagina. Lo scroll orizzontale della nav NON si
  // resetta più in navigazione normale (l'utente vuole restare nella stessa
  // posizione per vedere subito la nuova selezione e riaprire la stessa
  // tendina) — le due righe sono commentate, non rimosse: il reset completo
  // resta disponibile per i cambi "importanti" (login/logout), vedi effect
  // dedicato su [role, username] qui sotto.
  useEffect(() => {
    setMenuOpen(false)
    setMobileOpenSection(null)
    if (skipSectionClose.current) { skipSectionClose.current = false } else { setSectionOpen(false) }
    // scrollPos.current = 0
    // if (innerRef.current) innerRef.current.style.marginLeft = '0'
    updateArrows()
    // In questo layout è "body" (non la finestra) l'elemento che scrolla
    // davvero (per via di html{overflow-y:scroll} + body{height:100%}).
    // "body" non viene mai smontato tra una navigazione e l'altra, quindi
    // il suo scrollTop resta quello della pagina precedente se non lo
    // resettiamo esplicitamente qui.
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    window.scrollTo(0, 0)
  }, [pathname])

  // Reset completo dello scroll orizzontale della nav: solo sui cambi
  // "importanti" (login, logout, cambio utente) — qui i due `=0` restano attivi.
  useEffect(() => {
    scrollPos.current = 0
    if (innerRef.current) innerRef.current.style.marginLeft = '0'
    updateArrows()
  }, [role, username])

  // Chiudi menu mobile se il browser diventa largo; aggiorna frecce al resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false)
      updateArrows()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Misura overflow iniziale e osserva variazioni di dimensione
  useEffect(() => {
    updateArrows()
    const observer = new ResizeObserver(updateArrows)
    if (scrollRef.current) observer.observe(scrollRef.current)
    if (innerRef.current)  observer.observe(innerRef.current)
    return () => observer.disconnect()
  }, [])

  // Chiudi dropdown desktop cliccando fuori
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setSectionOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const brandDropRef = useDropdownAlign(sectionOpen)

  const adminItems         = visibleAdminPages(role)
  const internalItems      = visibleInternalPages(role, rolePermissions).filter(p => !disabledPages.includes(p.id))
  const visibleClientPages = clientPages.filter(p => !disabledPages.includes(p.id))
  const standaloneItems    = standalonePages.filter(p => !disabledPages.includes(p.id))
  const prodottiItems      = prodottiPages.filter(p => !disabledPages.includes(p.id))
  const comfortItems       = comfortSpaziEsterniPages.filter(p => !disabledPages.includes(p.id))
  const antintrusioneItems = antintrusioneSicurezzaPages.filter(p => !disabledPages.includes(p.id))
  const carpenteriaItems   = carpenteriaArredoPages.filter(p => !disabledPages.includes(p.id))
  const ristrutturazioniItems = ristrutturazioniChiaviInManoPages.filter(p => !disabledPages.includes(p.id))
  const fornitoriItems     = visibleFornitoriPages(role, rolePermissions, disabledPages)
  const clientiItems       = visibleClientiPages(role, rolePermissions, disabledPages)

  const areaPersonaleItems = (() => {
    if (role !== 'cliente') return []
    const allowed = rolePermissions['cliente']
    const allItems = areaClientiPages.filter(p =>
      !disabledPages.includes(p.id) &&
      (allowed === undefined || allowed.includes(p.id))
    )
    return clienteAbilitato ? allItems : allItems.filter(p => p.id === 52 || p.id === 54)
  })()
  const preferitiVisibili  = !!username && shortcuts.length > 0
  // Ordine del segmento "silver" (pagine per loggati): serve per sapere quale
  // sia il primo item visibile, il cui separatore di apertura resta fuori dal
  // wrapper — così lo sfondo silver parte esattamente dal separatore, non prima.
  const primoGruppoSilver = areaPersonaleItems.length > 0 ? 'personale'
    : fornitoriItems.length > 0 ? 'fornitori'
    : clientiItems.length > 0 ? 'clienti'
    : internalItems.length > 0 ? 'lavoro'
    : adminItems.length > 0 ? 'admin'
    : preferitiVisibili ? 'preferiti'
    : null

  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  const preventiviAbilitato     = isStaff || (rolePermissions['cliente'] ?? []).includes(52)
  const computometricoAbilitato = !!username && (isStaff || (rolePermissions['cliente'] ?? []).includes(54))
  const computometricoHref = computometricoAbilitato ? (role ? '/area-clienti/computometrici' : '/area-clienti/carrello-computometrico') : '/aiuto/guida-computometrico'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const linkStyle = (href: string): React.CSSProperties => ({
    padding: '0 5px',
    minWidth: 24,
    height: 46,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    transition: 'color 0.15s',
    lineHeight: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    })

  // Item selezionato: sfondo gold persistente (vedi .nav-link-active in globals.css) al posto della sottolineatura
  const linkClass = (active: boolean) => `nav-link testo-nav-bar${active ? ' nav-link-active' : ''}`

  return (
    <nav className="class_gold_D_safe" style={{ borderBottom: '1px solid #c8960c', flexShrink: 0, position: 'relative' }}>

      {/* ── Desktop ── */}
      <div className="nav-bar">
        {/* Area scrollabile — le frecce sono dentro, in position:absolute, coprono gli item parziali */}
        <div className="nav-scroll" ref={scrollRef}>
        {canLeft && (
          <button className="nav-arrow-btn nav-arrow-btn-left" onClick={() => scrollNav('left')} onMouseEnter={() => startHoverScroll('left')} onMouseLeave={stopHoverScroll} aria-label="Scorri sinistra">
            <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M14 0 L8 6 L14 12 Z M6 0 L0 6 L6 12 Z"/></svg>
          </button>
        )}
        <div className="nav-scroll-inner" ref={innerRef}>
          <Link href="/" className={linkClass(isActive('/'))} style={{ ...linkStyle('/'), display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', gap: 2, marginLeft: 8, position: 'relative' }} aria-label="Home">
            <Image src="/images/header/home.webp" alt="Home" width={30} height={30} style={{ height: 30, width: 30, display: 'block', objectFit: 'contain', marginTop: -3 }} />
          </Link>

          {prodottiItems.length > 0 && (
            <><NavSep /><ProdottiDropdown items={prodottiItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
          )}

          {comfortItems.length > 0 && (
            <><NavSep /><ComfortDropdown items={comfortItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
          )}

          {antintrusioneItems.length > 0 && (
            <><NavSep /><AntintrusioneDropdown items={antintrusioneItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
          )}

          {carpenteriaItems.length > 0 && (
            <><NavSep /><CarpenteriaDropdown items={carpenteriaItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
          )}

          {ristrutturazioniItems.length > 0 && (
            <><NavSep /><RistrutturazioniDropdown items={ristrutturazioniItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} computometricoHref={computometricoHref} /></>
          )}

          {standaloneItems.map(p => (
            <React.Fragment key={p.id}>
              <NavSep />
              <Link href={p.href} className={linkClass(isActive(p.href))} style={linkStyle(p.href)}>
                {p.label}<ShortcutStar href={p.href} small outline />
              </Link>
            </React.Fragment>
          ))}

          {categoryGroups.map(g => {
            const hidden = HIDDEN_FROM_CATEGORY[g.id] ?? []
            const visiblePages = g.pages.filter(p => !disabledPages.includes(p.id) && !hidden.includes(p.id))
            if (visiblePages.length === 0) return null
            return (
              <React.Fragment key={g.id}>
                <NavSep />
                <CategoryDropdown group={{ ...g, pages: visiblePages }} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} />
              </React.Fragment>
            )
          })}

          {aiutoPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <><NavSep /><AiutoDropdown items={aiutoPages.filter(p => !disabledPages.includes(p.id))} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
          )}

          {visibleClientPages.length > 0 && (
            <><NavSep />
            <div ref={dropRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => { if (!sectionOpen) { skipSectionClose.current = true; router.push('/chi-siamo') } setSectionOpen(o => !o) }}
                className={linkClass(isActive('/chi-siamo'))}
                style={{ ...linkStyle('/chi-siamo'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}
              >
                <span>Chi Siamo<ShortcutStar href="/chi-siamo" small outline /></span>
                <span>{sectionOpen ? '▴' : '▾'}</span>
              </button>

              {sectionOpen && (
                <div ref={brandDropRef} style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#fdfcf8',
                  border: '1px solid #c8960c',
                  borderRadius: 6,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  padding: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  zIndex: 200,
                  width: 'max-content',
                  minWidth: 200,
                }}>
                  {visibleClientPages.map(p => (
                    <Link
                      key={p.id}
                      href={p.href}
                      className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                      style={{ padding: '7px 10px' }}
                    >
                      <span>{p.label}<ShortcutStar href={p.href} small /></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            </>
          )}

          {/* ── Da qui in poi: pagine per utenti loggati (non sito vetrina) — tema "silver" di prova, facile da rimuovere togliendo "nav-theme-silver".
               Il separatore di confine (NavSepBoundary, senza margine) è l'esatto limite gold/silver.
               Il wrapper cresce (flex-grow) per riempire di silver tutto lo spazio residuo fino al bordo destro. ── */}
          {primoGruppoSilver && (
          <>
          <NavSepBoundary />
          <div className="nav-theme-silver" style={{ display: 'flex', alignItems: 'center', height: '100%', flex: '1 0 auto', paddingLeft: 3 }}>
            {areaPersonaleItems.length > 0 && (
              <>{primoGruppoSilver !== 'personale' && <NavSep />}<AreaClientiDropdown items={areaPersonaleItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} unreadAvvisiCount={liveAvvisiCount} /></>
            )}

            {fornitoriItems.length > 0 && (
              <>{primoGruppoSilver !== 'fornitori' && <NavSep />}<FornitoriDropdown items={fornitoriItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
            )}

            {clientiItems.length > 0 && (
              <>{primoGruppoSilver !== 'clienti' && <NavSep />}<ClientiDropdown items={clientiItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
            )}

            {internalItems.length > 0 && (
              <>{primoGruppoSilver !== 'lavoro' && <NavSep />}<InternalDropdown items={internalItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} unreadEmailCount={unreadEmailCount} /></>
            )}

            {adminItems.length > 0 && (
              <>{primoGruppoSilver !== 'admin' && <NavSep />}<AdminDropdown items={adminItems} isActive={isActive} linkStyle={linkStyle} linkClass={linkClass} /></>
            )}

            {preferitiVisibili && (
              <>{primoGruppoSilver !== 'preferiti' && <NavSep />}<PreferitiDropdown items={shortcuts} isActive={isActive} linkStyle={linkStyle} /></>
            )}
          </div>
          </>
          )}
        </div>{/* fine nav-scroll-inner */}
        {canRight && (
          <button className={`nav-arrow-btn nav-arrow-btn-right${primoGruppoSilver ? ' nav-arrow-btn-silver' : ''}`} onClick={() => scrollNav('right')} onMouseEnter={() => startHoverScroll('right')} onMouseLeave={stopHoverScroll} aria-label="Scorri destra">
            <svg viewBox="0 0 14 12" width="14" height="12" fill="currentColor"><path d="M0 0 L6 6 L0 12 Z M8 0 L14 6 L8 12 Z"/></svg>
          </button>
        )}
        </div>{/* fine nav-scroll */}

        {/* Icone carrello — sempre visibili, non scorrono. Visibile solo se c'è
            almeno un'icona reale da mostrare (altrimenti resterebbe un riquadro
            vuoto, solo padding+bordo). Sfondo verde fisso, coerente con lo
            sfondo dei bottoni (.cart-btn), indipendente dal segmento gold/silver
            della nav retrostante. */}
        {(() => {
          const showComputo    = computoCount > 0 && computometricoAbilitato
          const showPreventivo = cartCount > 0 && preventiviAbilitato
          const showAcquisti   = cartAcquistiCount > 0
          if (!showComputo && !showPreventivo && !showAcquisti) return null
          return (
        <>
        {primoGruppoSilver && <div style={{ flexShrink: 0, width: 3, alignSelf: 'stretch', background: '#1a1a1a' }} />}
        <div style={{ flexShrink: 0, paddingRight: 4, borderLeft: '1px solid #a07808', background: '#dba820', display: 'flex', alignItems: 'center', gap: 0 }}>
          {showComputo && (
          <Link
            href="/area-clienti/carrello-computometrico"
            title="Computo metrico"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/carrello-computometrici.webp" alt="Computo metrico" width={41} height={41} style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            {computoCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 1,
                background: computoCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
                minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {computoCount > 99 ? '99+' : computoCount}
              </span>
            )}
          </Link>
          )}
          {showPreventivo && (
          <>
          {showComputo && <NavSep />}
          <Link
            href="/area-clienti/carrello-preventivo"
            title="Carrello preventivo"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/carrello-preventivo-t.webp" alt="Carrello preventivo" width={38} height={38} style={{ height: 38, width: 38, display: 'block', objectFit: 'contain', transform: 'translateY(-1px)' }} />
            <span style={{
              position: 'absolute', top: 4, right: 1,
              background: preventivoCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>
          </>
          )}
          {showAcquisti && (
          <>
          {(showComputo || showPreventivo) && <NavSep />}
          <Link
            href="/area-clienti/carrello-acquisti"
            title="Carrello acquisti"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/acquisti.webp" alt="Carrello acquisti" width={41} height={41} style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            <span className="fs-9" style={{
              position: 'absolute', top: 4, right: 1,
              background: acquistiCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartAcquistiCount > 99 ? '99+' : cartAcquistiCount}
            </span>
          </Link>
          </>
          )}
        </div>
        </>
          )
        })()}
      </div>

      {/* ── Mobile bar: hamburger + auth ── */}
      <div className="nav-mobile-bar">
        <button
          type="button"
          className="nav-hamburger testo-nav-bar"
          onClick={() => { setMenuOpen(o => !o); setMobileOpenSection(null) }}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
          style={{ position: 'relative', fontWeight: 500 }}
        >
          <span className="fs-18" style={{ width: 20, display: 'inline-block', textAlign: 'center' }}>{menuOpen ? '✕' : '☰'}</span>
          Menu
          {!menuOpen && (unreadEmailCount > 0 || liveAvvisiCount > 0) && (
            <span style={{ position: 'absolute', top: 4, right: 4, background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
              {Math.min(99, unreadEmailCount + liveAvvisiCount)}
            </span>
          )}
        </button>
        <div style={{ marginLeft: 'auto', paddingRight: 12, background: '#dba820', display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
          {(() => {
            const showComputo    = computoCount > 0 && computometricoAbilitato
            const showPreventivo = cartCount > 0 && preventiviAbilitato
            const showAcquisti   = cartAcquistiCount > 0
            return (
            <>
          {showComputo && (
          <Link
            href="/area-clienti/carrello-computometrico"
            title="Computo metrico"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/carrello-computometrici.webp" alt="Computo metrico" width={41} height={41} style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            {computoCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 1,
                background: computoCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
                minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 4px',
              }}>
                {computoCount > 99 ? '99+' : computoCount}
              </span>
            )}
          </Link>
          )}
          {showPreventivo && (
          <>
          {showComputo && <NavSep />}
          <Link
            href="/area-clienti/carrello-preventivo"
            title="Carrello preventivo"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/carrello-preventivo-t.webp" alt="Carrello preventivo" width={38} height={38} style={{ height: 38, width: 38, display: 'block', objectFit: 'contain', transform: 'translateY(-1px)' }} />
            <span style={{
              position: 'absolute', top: 4, right: 0,
              background: preventivoCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>
          </>
          )}
          {showAcquisti && (
          <>
          {(showComputo || showPreventivo) && <NavSep />}
          <Link
            href="/area-clienti/carrello-acquisti"
            title="Carrello acquisti"
            className="cart-btn"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 41, height: 41, marginTop: 1, textDecoration: 'none' }}
          >
            <Image src="/images/carrello/acquisti.webp" alt="Carrello acquisti" width={41} height={41} style={{ height: 41, width: 41, display: 'block', objectFit: 'contain' }} />
            <span style={{
              position: 'absolute', top: 4, right: 0,
              background: acquistiCompleto ? BADGE_VERDE : BADGE_ARANCIONE, color: '#fff', borderRadius: '50%',
              minWidth: 18, height: 18, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
            }}>
              {cartAcquistiCount > 99 ? '99+' : cartAcquistiCount}
            </span>
          </Link>
          </>
          )}
            </>
            )
          })()}
        </div>
      </div>

      {/* ── Mobile menu ── incollato sotto la nav-mobile-bar, dentro il contenitore sticky */}
      {menuOpen && (
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 300,
          background: '#fdfcf8',
          borderTop: '1px solid #c8960c',
          padding: '6px 0 16px',
          overflowY: 'auto',
          maxHeight: `calc(100dvh - ${90 + (bannerAbilitato ? 42 : 0) + 42}px)`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
          <Link
            href="/"
            className={`nav-mobile-section${isActive('/') ? ' nav-mobile-section-active' : ''}`}
            style={{ textDecoration: 'none', color: isActive('/') ? '#111' : undefined }}
          >
            <span>Home</span>
          </Link>

          {prodottiItems.length > 0 && (
            <MobileSection sectionKey="prodotti" label="Riqualificazione Energetica" open={mobileOpenSection === 'prodotti'} onToggle={toggleMobileSection}>
              {prodottiSubgroups.map(sg => {
                const groupItems = prodottiItems.filter(p => sg.pageIds.includes(p.id))
                if (groupItems.length === 0) return null
                return (
                  <React.Fragment key={sg.label}>
                    <p className="fs-11" style={{ margin: 0, padding: '8px 16px 2px 28px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a6800' }}>
                      {sg.label}
                    </p>
                    {groupItems.map(p => (
                      <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
                    ))}
                  </React.Fragment>
                )
              })}
              <Link href="/bonuss-riqualificazione" onClick={() => setMenuOpen(false)} className="nav-banner-bonus" style={{ margin: '8px 16px 4px' }}>
                Scopri Bonus e Detrazioni Fiscali
              </Link>
            </MobileSection>
          )}

          {comfortItems.length > 0 && (
            <MobileSection sectionKey="comfort" label="Comfort e Spazi Esterni" open={mobileOpenSection === 'comfort'} onToggle={toggleMobileSection}>
              {comfortItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {antintrusioneItems.length > 0 && (
            <MobileSection sectionKey="antintrusione" label="Antintrusione e Sicurezza" open={mobileOpenSection === 'antintrusione'} onToggle={toggleMobileSection}>
              {antintrusioneItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {carpenteriaItems.length > 0 && (
            <MobileSection sectionKey="carpenteria" label="Carpenteria d'Arredo" open={mobileOpenSection === 'carpenteria'} onToggle={toggleMobileSection}>
              {carpenteriaItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {ristrutturazioniItems.length > 0 && (
            <MobileSection sectionKey="ristrutturazioni" label="Ristrutturazioni Chiavi in Mano" open={mobileOpenSection === 'ristrutturazioni'} onToggle={toggleMobileSection}>
              {ristrutturazioniItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
              <Link href={computometricoHref} onClick={() => setMenuOpen(false)} className="nav-banner-bonus" style={{ margin: '8px 16px 4px' }}>
                Calcola il Computo Metrico Online
              </Link>
            </MobileSection>
          )}

          {standaloneItems.map(p => (
            <Link
              key={p.id}
              href={p.href}
              className={`nav-mobile-section${isActive(p.href) ? ' nav-mobile-section-active' : ''}`}
              style={{ textDecoration: 'none', color: isActive(p.href) ? '#111' : undefined }}
            >
              <span>{p.label}</span>
            </Link>
          ))}

          {categoryGroups.map(g => {
            const hidden = HIDDEN_FROM_CATEGORY[g.id] ?? []
            const visiblePages = g.pages.filter(p => !disabledPages.includes(p.id) && !hidden.includes(p.id))
            if (visiblePages.length === 0) return null
            const key = `cat-${g.id}`
            return (
              <MobileSection key={g.id} sectionKey={key} label={g.label} open={mobileOpenSection === key} onToggle={toggleMobileSection}>
                {visiblePages.map(p => (
                  <MobileLink key={p.href} href={p.href} label={p.label} active={isActive(p.href)} indent />
                ))}
              </MobileSection>
            )
          })}

          {role === 'cliente' && (() => {
            const allowed = rolePermissions['cliente']
            const allItems = areaClientiPages.filter(p =>
              !disabledPages.includes(p.id) &&
              (allowed === undefined || allowed.includes(p.id))
            )
            const items = clienteAbilitato ? allItems : allItems.filter(p => p.id === 52 || p.id === 54)
            return items.length > 0 ? (
              <MobileSection sectionKey="area-personale" label="Area Personale" open={mobileOpenSection === 'area-personale'} onToggle={toggleMobileSection} badge={liveAvvisiCount}>
                {items.map(p => (
                  <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent
                    badge={p.href === '/area-clienti/avvisi' ? liveAvvisiCount : 0} />
                ))}
              </MobileSection>
            ) : null
          })()}

          {aiutoPages.filter(p => !disabledPages.includes(p.id)).length > 0 && (
            <MobileSection sectionKey="aiuto" label="Aiuto" open={mobileOpenSection === 'aiuto'} onToggle={toggleMobileSection}>
              {aiutoPages.filter(p => !disabledPages.includes(p.id)).map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {!!username && shortcuts.length > 0 && (
            <MobileSection sectionKey="preferiti" label="Preferiti" open={mobileOpenSection === 'preferiti'} onToggle={toggleMobileSection}>
              {shortcuts.map(s => (
                <MobileLink key={s.href} href={s.href} label={s.label.replace(/^Vai a /, '')} active={isActive(s.href)} indent />
              ))}
            </MobileSection>
          )}

          {visibleClientPages.length > 0 && (
            <MobileSection sectionKey="brand" label="Chi Siamo" open={mobileOpenSection === 'brand'} onToggle={toggleMobileSection}>
              {visibleClientPages.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {fornitoriItems.length > 0 && (
            <MobileSection sectionKey="area-fornitori" label="Area Fornitori" open={mobileOpenSection === 'area-fornitori'} onToggle={toggleMobileSection}>
              {fornitoriItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {clientiItems.length > 0 && (
            <MobileSection sectionKey="area-clienti" label="Area Clienti" open={mobileOpenSection === 'area-clienti'} onToggle={toggleMobileSection}>
              {clientiItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}

          {internalItems.length > 0 && (
            <MobileSection sectionKey="area-lavoro" label="Area Lavoro" open={mobileOpenSection === 'area-lavoro'} onToggle={toggleMobileSection} badge={unreadEmailCount}>
              {internalItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent
                  badge={p.href === '/area-lavoro/email' ? unreadEmailCount : 0} />
              ))}
            </MobileSection>
          )}

          {adminItems.length > 0 && (
            <MobileSection sectionKey="amministrazione" label="Amministrazione" open={mobileOpenSection === 'amministrazione'} onToggle={toggleMobileSection}>
              {adminItems.map(p => (
                <MobileLink key={p.id} href={p.href} label={p.label} active={isActive(p.href)} indent />
              ))}
            </MobileSection>
          )}
      </div>
      )}
    </nav>
  )
}

function useDropdownAlign(open: boolean, anchorRect?: AnchorRect | null): React.RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !open) return

    // Ancorato allo sticky bottom bar (trigger lontano, in fondo allo schermo):
    // si sviluppa verso l'alto a partire dal bottone cliccato, non dal link in navbar.
    if (anchorRect) {
      el.style.position = 'fixed'
      el.style.top = 'auto'
      el.style.bottom = `${window.innerHeight - anchorRect.top}px`
      el.style.maxWidth = `${window.innerWidth - 16}px`
      el.style.overflowX = 'auto'

      el.style.left = `${anchorRect.left + anchorRect.width / 2}px`
      el.style.right = 'auto'
      el.style.transform = 'translateX(-50%)'

      const eRect = el.getBoundingClientRect()
      if (eRect.right > window.innerWidth - 8) {
        el.style.left = 'auto'
        el.style.right = '8px'
        el.style.transform = 'none'
      } else if (eRect.left < 8) {
        el.style.left = '8px'
        el.style.right = 'auto'
        el.style.transform = 'none'
      }
      return
    }

    const trigger = el.parentElement
    if (!trigger) return
    const tRect = trigger.getBoundingClientRect()

    // fixed sfugge a overflow-x:clip su nav-scroll
    el.style.position = 'fixed'
    el.style.bottom = 'auto'
    el.style.top = `${tRect.bottom}px`
    el.style.maxWidth = `${window.innerWidth - 16}px`
    el.style.overflowX = 'auto'

    // centra sotto il trigger
    el.style.left = `${tRect.left + tRect.width / 2}px`
    el.style.right = 'auto'
    el.style.transform = 'translateX(-50%)'

    // aggiusta se esce dal viewport
    const eRect = el.getBoundingClientRect()
    if (eRect.right > window.innerWidth - 8) {
      el.style.left = 'auto'
      el.style.right = '8px'
      el.style.transform = 'none'
    } else if (eRect.left < 8) {
      el.style.left = '8px'
      el.style.right = 'auto'
      el.style.transform = 'none'
    }
  }, [open, anchorRect])
  return ref as React.RefObject<HTMLDivElement>
}

function NavSep() {
  return <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.18)', flexShrink: 0, margin: '4px 2px' }} />
}

// Separatore di confine gold/silver: senza margine orizzontale, così la linea
// è esattamente il limite di colore (nessun px di gold o silver "in più" ai suoi lati).
function NavSepBoundary() {
  return <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.18)', flexShrink: 0, margin: '4px 0 4px 2px' }} />
}

function InternalDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
  unreadEmailCount = 0,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
  unreadEmailCount?: number
}) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(unreadEmailCount)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)
  const audio = useRef<HTMLAudioElement | null>(null)
  const unreadRef = useRef(unreadEmailCount)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    audio.current = new Audio('/sounds/horse.mp3')
    audio.current.preload = 'auto'
  }, [])

  useEffect(() => { setUnread(unreadEmailCount) }, [unreadEmailCount])

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/email/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        setUnread(prev => {
          if (data.count > prev) audio.current?.play().catch(() => {})
          return data.count
        })
        if (data.count > unreadRef.current && pathname === '/area-lavoro/email') router.refresh()
        unreadRef.current = data.count
      } catch {}
    }
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/area-lavoro'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Area Lavoro</span>
        <span>{open ? '▴' : '▾'}</span>
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid var(--nav-accent-border)', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 320,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
              {p.href === '/area-lavoro/email' && unread > 0 && (
                <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function ProdottiDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/prodotti'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, padding: '0 6px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span>Riqualificazione</span>
          <span>Energetica</span>
        </span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 200, width: 'max-content',
        }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {prodottiSubgroups.map(sg => {
              const groupItems = items.filter(p => sg.pageIds.includes(p.id))
              if (groupItems.length === 0) return null
              return (
                <div key={sg.label} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 190 }}>
                  <p className="fs-11" style={{ margin: '0 0 4px', padding: '0 10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a6800' }}>
                    {sg.label}
                  </p>
                  {groupItems.map(p => (
                    <Link
                      key={p.id}
                      href={p.href}
                      onClick={() => setOpen(false)}
                      className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                      style={{ padding: '7px 10px' }}
                    >
                      <span>{p.label}<ShortcutStar href={p.href} small /></span>
                    </Link>
                  ))}
                </div>
              )
            })}
          </div>
          <Link href="/bonuss-riqualificazione" onClick={() => setOpen(false)} className="nav-banner-bonus">
            Scopri Bonus e Detrazioni Fiscali
          </Link>
        </div>
      )}
    </div>
  )
}

function ComfortDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const [stickyAnchor, setStickyAnchor] = useState<AnchorRect | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open, stickyAnchor)
  const { request, consume } = useNavDropdownRequest()

  useEffect(() => {
    function handle(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (ref.current && !ref.current.contains(target) && !target.closest('[data-nav-dropdown-trigger="comfort"]')) {
        setOpen(false)
        setStickyAnchor(null)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  useEffect(() => {
    if (request?.id === 'comfort') {
      setOpen(o => !o)
      setStickyAnchor(request.anchorRect)
      consume()
    }
  }, [request, consume])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => { setOpen(o => !o); setStickyAnchor(null) }} className={linkClass(anyActive)} style={{ ...linkStyle('/comfort-e-spazi-esterni'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, padding: '0 6px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span>Spazi Esterni</span>
          <span>e Comfort</span>
        </span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AntintrusioneDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/antintrusione-e-sicurezza'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, padding: '0 6px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span>Antintrusione</span>
          <span>e Sicurezza</span>
        </span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CarpenteriaDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle("/carpenteria-d-arredo"), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, padding: '0 6px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span>Carpenteria</span>
          <span>d&apos;Arredo</span>
        </span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function RistrutturazioniDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
  computometricoHref,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
  computometricoHref: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/ristrutturazioni-chiavi-in-mano'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, padding: '0 6px' }}>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span>Ristrutturazioni</span>
          <span>Chiavi in Mano</span>
        </span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 200, width: 'max-content',
        }}>
          <div style={{
            display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
            minWidth: 220,
          }}>
            {items.map(p => (
              <Link
                key={p.id}
                href={p.href}
                onClick={() => setOpen(false)}
                className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                style={{ padding: '7px 10px' }}
              >
                <span>{p.label}<ShortcutStar href={p.href} small /></span>
              </Link>
            ))}
          </div>
          <Link href={computometricoHref} onClick={() => setOpen(false)} className="nav-banner-bonus">
            Calcola il Computo Metrico Online
          </Link>
        </div>
      )}
    </div>
  )
}

function AiutoDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/aiuto'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Aiuto</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function PreferitiDropdown({
  items,
  isActive,
  linkStyle,
}: {
  items: { href: string; label: string }[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className="nav-link testo-nav-bar" style={{ ...linkStyle('/preferiti'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4, textDecoration: 'none' }}>
        <span>Preferiti</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid #c8960c', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 220,
        }}>
          {items.map(p => (
            <Link
              key={p.href}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label.replace(/^Vai a /, '')}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/amministrazione'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Amministrazione</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid var(--nav-accent-border)', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 12,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 2,
          zIndex: 200, width: 'max-content', minWidth: 200,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryDropdown({
  group,
  isActive,
  linkStyle,
  linkClass,
}: {
  group: CategoryGroup
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setIsMounted(true) }, [])

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !dropRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const el = dropRef.current
    el.style.top = `${tr.bottom}px`
    el.style.left = `${tr.left + tr.width / 2}px`
    el.style.right = 'auto'
    el.style.transform = 'translateX(-50%)'
    const er = el.getBoundingClientRect()
    if (er.right > window.innerWidth - 8) {
      el.style.left = 'auto'
      el.style.right = '8px'
      el.style.transform = 'none'
    } else if (er.left < 8) {
      el.style.left = '8px'
      el.style.right = 'auto'
      el.style.transform = 'none'
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !dropRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  return (
    <div ref={triggerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        onClick={() => { if (!open) router.push(group.href); setOpen(o => !o) }}
        className={linkClass(isActive(group.href))}
        style={{ ...linkStyle(group.href), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}
      >
        {group.id === 'metallurgia' ? (
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span>Ferro e</span>
            <span>Acciaio<ShortcutStar href={group.href} small outline /></span>
          </span>
        ) : (
          <span>{group.label}<ShortcutStar href={group.href} small outline /></span>
        )}
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {isMounted && open && createPortal(
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#fdfcf8',
            border: '1px solid #c8960c',
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 9000,
            overflowX: 'auto',
            maxWidth: 'calc(100vw - 16px)',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateRows: 'repeat(6, auto)',
            gridAutoFlow: 'column',
            gridAutoColumns: 'max-content',
            gap: 0,
            padding: 4,
            width: 'max-content',
            minWidth: group.id === 'edilizia' ? 320 : 180,
          }}>
            {group.pages.map(p => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
                style={{ padding: '7px 10px' }}
              >
                <span>{p.label}<ShortcutStar href={p.href} small /></span>
              </Link>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function FornitoriDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/area-fornitori'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Area Fornitori</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid var(--nav-accent-border)', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 200,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function ClientiDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const alignRef = useDropdownAlign(open)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/clienti'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Area Clienti</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid var(--nav-accent-border)', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 180,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px' }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function AreaClientiDropdown({
  items,
  isActive,
  linkStyle,
  linkClass,
  unreadAvvisiCount = 0,
}: {
  items: NavPage[]
  isActive: (href: string) => boolean
  linkStyle: (href: string) => React.CSSProperties
  linkClass: (active: boolean) => string
  unreadAvvisiCount?: number
}) {
  const [open, setOpen]       = useState(false)
  const [unread, setUnread]   = useState(unreadAvvisiCount)
  const ref       = useRef<HTMLDivElement>(null)
  const alignRef  = useDropdownAlign(open)
  const router    = useRouter()
  const pathname  = usePathname()
  const unreadRef = useRef(unreadAvvisiCount)

  useEffect(() => { setUnread(unreadAvvisiCount) }, [unreadAvvisiCount])

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/avvisi/unread', { cache: 'no-store' })
        const data = await res.json() as { count: number }
        setUnread(data.count)
        if (data.count > unreadRef.current && pathname === '/area-clienti/avvisi') router.refresh()
        unreadRef.current = data.count
      } catch {}
    }
    function handleEvent(e: Event) {
      const count = (e as CustomEvent<{ count: number }>).detail.count
      setUnread(count)
      unreadRef.current = count
    }
    fetchCount()
    const id = setInterval(fetchCount, 30_000)
    window.addEventListener('avvisi-count-changed', handleEvent)
    return () => { clearInterval(id); window.removeEventListener('avvisi-count-changed', handleEvent) }
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const anyActive = items.some(p => isActive(p.href))

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button onClick={() => setOpen(o => !o)} className={linkClass(anyActive)} style={{ ...linkStyle('/area-clienti'), height: 'auto', minHeight: 46, flexDirection: 'row', alignItems: 'center', whiteSpace: 'normal', lineHeight: 1.15, gap: 4 }}>
        <span>Area Personale</span>
        <span>{open ? '▴' : '▾'}</span>
        {!open && unread > 0 && (
          <span style={{ position: 'absolute', top: 6, right: 6, background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div ref={alignRef} style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: '#fdfcf8', border: '1px solid var(--nav-accent-border)', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: 4,
          display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column', gridAutoColumns: 'max-content', gap: 0,
          zIndex: 200, width: 'max-content', minWidth: 180,
        }}>
          {items.map(p => (
            <Link
              key={p.id}
              href={p.href}
              onClick={() => setOpen(false)}
              className={isActive(p.href) ? 'nav-dropdown-link nav-dropdown-link-active' : 'nav-dropdown-link'}
              style={{ padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>{p.label}<ShortcutStar href={p.href} small /></span>
              {p.href === '/area-clienti/avvisi' && open && unread > 0 && (
                <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileSection({
  sectionKey,
  label,
  open,
  onToggle,
  badge = 0,
  children,
}: {
  sectionKey: string
  label: string
  open: boolean
  onToggle: (key: string) => void
  badge?: number
  children: React.ReactNode
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        aria-expanded={open}
        className="nav-mobile-section"
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
      >
        <span>{label}</span>
        {!open && badge > 0 && (
          <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        <span className="fs-11" style={{ flexShrink: 0 }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && children}
    </>
  )
}

function MobileLink({ href, label, active, indent, badge = 0 }: { href: string; label: string; active: boolean; indent?: boolean; badge?: number }) {
  return (
    <Link
      href={href}
      className={active ? 'nav-mobile-link nav-mobile-link-active' : 'nav-mobile-link'}
      style={{ padding: `10px ${indent ? 28 : 16}px`, display: 'flex', alignItems: 'center', gap: 6 }}
    >
      <span>{label}<ShortcutStar href={href} small /></span>
      {badge > 0 && (
        <span style={{ background: '#e53e3e', color: '#fff', borderRadius: '50%', minWidth: 18, height: 18, fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', textDecoration: 'none', flexShrink: 0 }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

