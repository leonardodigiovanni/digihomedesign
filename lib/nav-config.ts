export type NavPage = {
  id: number
  label: string
  href: string
  roles?: string[]   // undefined = tutti gli utenti loggati
}

// Pagine 2-15: area clienti
export const clientPages: NavPage[] = [
  { id: 2,  label: 'Chi Siamo',        href: '/pagine/2'  },
  { id: 3,  label: 'Prodotti',         href: '/pagine/3'  },
  { id: 4,  label: 'Servizi',          href: '/pagine/4'  },
  { id: 5,  label: 'Preventivi',       href: '/pagine/5'  },
  { id: 6,  label: 'Galleria',         href: '/pagine/6'  },
  { id: 7,  label: 'Cantieri',         href: '/pagine/7'  },
  { id: 8,  label: 'Materiali',        href: '/pagine/8'  },
  { id: 9,  label: 'Installazioni',    href: '/pagine/9'  },
  { id: 10, label: 'Ristrutturazioni', href: '/pagine/10' },
  { id: 11, label: 'Fornitori',        href: '/pagine/11' },
  { id: 12, label: 'News',             href: '/pagine/12' },
  { id: 13, label: 'FAQ',              href: '/pagine/13' },
  { id: 14, label: 'Documenti',        href: '/pagine/14' },
  { id: 15, label: 'Contatti',         href: '/pagine/15' },
]

// Colori placeholder per i riquadri della home (sostituire con immagini reali)
export const cardColors = [
  '#4f7cac','#6b8f71','#c47c5a','#7b6fa0',
  '#4a8fa8','#8f7b6b','#5a8a6b','#a07b5a',
  '#6b7ba0','#8a6b8f','#5a7b8f','#8f6b5a',
  '#7b8a5a','#6b5a8f',
]

// Pagine 16-20: area amministrativa fissa
export const adminPages: NavPage[] = [
  { id: 19, label: 'Impostazioni',     href: '/settings',        roles: ['admin'] },
  { id: 20, label: 'Gestione Utenti', href: '/gestione-utenti', roles: ['admin'] },
]

// Pagine interne 16-29: protette da matrice permessi
export const internalPages: NavPage[] = [
  { id: 16, label: 'Magazzino',               href: '/magazzino'   },
  { id: 17, label: 'Fatture',                 href: '/fatture'     },
  { id: 18, label: 'Bilancio',                href: '/bilancio'    },
  { id: 21, label: 'Anagrafica Clienti',      href: '/anagrafica-clienti' },
  { id: 22, label: 'Adempimenti',             href: '/adempimenti' },
  { id: 23, label: 'Cataloghi',               href: '/cataloghi'   },
  { id: 24, label: 'Anagrafica Fornitori',    href: '/anagrafica-fornitori' },
  { id: 25, label: 'Listini',                 href: '/listini'     },
  { id: 26, label: 'Ordini a Fornitori',      href: '/ordini-fornitori' },
  { id: 27, label: 'Worklist',                href: '/worklist'    },
  { id: 28, label: 'Cantieri',                 href: '/cantieri'    },
  { id: 29, label: 'Marketing',               href: '/marketing'   },
  { id: 30, label: 'I Miei Ordini',           href: '/miei-ordini' },
  { id: 35, label: 'Ordini Ricevuti',         href: '/ordini-ricevuti' },
  { id: 31, label: 'I Miei Cantieri',         href: '/cantieri'    },
  { id: 32, label: 'Email',                   href: '/email'       },
  { id: 33, label: 'Archivio',               href: '/archivio'    },
  { id: 34, label: 'Facsimili',              href: '/facsimili'   },
]

export function visibleAdminPages(role: string | null): NavPage[] {
  if (!role) return []
  return adminPages.filter(p => !p.roles || p.roles.includes(role))
}

export function visibleInternalPages(
  role: string | null,
  rolePermissions: Record<string, number[]>
): NavPage[] {
  if (!role) return []
  // Admin vede tutto tranne le voci "personali" del cliente (id 31 = I Miei Cantieri, id 30 = I Miei Ordini)
  if (role === 'admin') return internalPages.filter(p => p.id !== 31 && p.id !== 30)
  const allowed = rolePermissions[role] ?? []
  return internalPages.filter(p => allowed.includes(p.id))
}
