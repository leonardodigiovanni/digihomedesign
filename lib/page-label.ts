// Eccezioni per pagine di dettaglio dinamiche: l'ultimo segmento URL da solo
// (es. "4") non è leggibile in home ("Vai a 4") — qui diamo un nome esplicito.
// Alcune usano un id nel path (/ordini/4), altre un query param
// (/cantieri?cantiere=42) per selezionare "quale elemento" si sta guardando.
const NAME_EXCEPTIONS: { test: RegExp; name: (m: RegExpMatchArray) => string }[] = [
  { test: /^\/area-clienti\/ordini\/(\d+)$/, name: m => `Ordine N° ${m[1]}` },
  { test: /^\/area-clienti\/preventivi\/(\d+)$/, name: m => `Preventivo N° ${m[1]}` },
  { test: /^\/clienti\/preventivi\/(\d+)$/, name: m => `Preventivo N° ${m[1]}` },
  { test: /^\/area-lavoro\/ordini-ricevuti\/(\d+)$/, name: m => `Ordine N° ${m[1]}` },
  { test: /^\/area-clienti\/cantieri\?cantiere=(\d+)$/, name: m => `Cantiere N° ${m[1]}` },
]

/** "/brand/cataloghi" → "Cataloghi"; "/metallurgia/porte-blindate" → "Porte Blindate"; "/area-clienti/ordini/4" → "Ordine N° 4"; "/area-clienti/cantieri?cantiere=42" → "Cantiere N° 42" */
export function nameFromPathname(pathname: string): string {
  for (const ex of NAME_EXCEPTIONS) {
    const m = pathname.match(ex.test)
    if (m) return ex.name(m)
  }
  const pathOnly = pathname.split('?')[0]
  const segments = pathOnly.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? ''
  const words = last.split('-').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1))
  return words.join(' ')
}

/** "/brand/cataloghi" → "Vai a Cataloghi"; "/area-clienti/ordini/4" → "Vai a Ordine N° 4" */
export function labelFromPathname(pathname: string): string {
  return `Vai a ${nameFromPathname(pathname)}`
}
