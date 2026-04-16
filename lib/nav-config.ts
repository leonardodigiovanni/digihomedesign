export type NavPage = {
  id: number
  label: string
  href: string
  roles?: string[]   // undefined = tutti gli utenti loggati
}

export type CategoryGroup = {
  id: string
  label: string
  href: string
  pages: { id: number; label: string; href: string }[]
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: 'serramenti',
    label: 'Serramenti',
    href: '/serramenti',
    pages: [
      { id: 201, label: 'Infissi in Alluminio',    href: '/serramenti/infissi-in-alluminio'    },
      { id: 202, label: 'Infissi in PVC',          href: '/serramenti/infissi-in-pvc'          },
      { id: 203, label: 'Verande',                 href: '/serramenti/verande'                 },
      { id: 204, label: 'Persiane',                href: '/serramenti/persiane'                },
      { id: 205, label: 'Imbotti',                 href: '/serramenti/imbotti'                 },
      { id: 206, label: 'Veneziane',               href: '/serramenti/veneziane'               },
      { id: 207, label: 'Box Doccia',              href: '/serramenti/box-doccia'              },
      { id: 208, label: 'Vetrine',                 href: '/serramenti/vetrine'                 },
      { id: 209, label: 'Lucernai',                href: '/serramenti/lucernai'                },
      { id: 210, label: 'Zanzariere',              href: '/serramenti/zanzariere'              },
      { id: 211, label: 'Avvolgibili Motorizzati', href: '/serramenti/avvolgibili-motorizzati' },
    ],
  },
  {
    id: 'metallurgia',
    label: 'Metallurgia',
    href: '/metallurgia',
    pages: [
      { id: 212, label: 'Porte Blindate',             href: '/metallurgia/porte-blindate'             },
      { id: 213, label: 'Pannelli Bugnato Alluminio', href: '/metallurgia/pannelli-bugnato-alluminio' },
      { id: 214, label: 'Cancelli',                   href: '/metallurgia/cancelli'                   },
      { id: 215, label: 'Grate',                      href: '/metallurgia/grate'                      },
      { id: 216, label: 'Ringhiere',                  href: '/metallurgia/ringhiere'                  },
      { id: 217, label: 'Balconi',                    href: '/metallurgia/balconi'                    },
      { id: 218, label: 'Saracinesche Motorizzate',   href: '/metallurgia/saracinesche-motorizzate'   },
      { id: 219, label: 'Strutture',                  href: '/metallurgia/strutture'                  },
      { id: 220, label: 'Scale',                      href: '/metallurgia/scale'                      },
      { id: 221, label: 'Armadi Blindati',            href: '/metallurgia/armadi-blindati'            },
      { id: 222, label: 'Casseforti',                 href: '/metallurgia/casseforti'                 },
    ],
  },
  {
    id: 'edilizia',
    label: 'Edilizia',
    href: '/edilizia',
    pages: [
      { id: 223, label: 'Demolizioni',            href: '/edilizia/demolizioni'            },
      { id: 224, label: 'Opere Murarie',          href: '/edilizia/opere-murarie'          },
      { id: 225, label: 'Tramezzature',           href: '/edilizia/tramezzature'           },
      { id: 226, label: 'Intonaci',               href: '/edilizia/intonaci'               },
      { id: 227, label: 'Massetti',               href: '/edilizia/massetti'               },
      { id: 228, label: 'Tracce',                 href: '/edilizia/tracce'                 },
      { id: 229, label: 'Pavimenti',              href: '/edilizia/pavimenti'              },
      { id: 230, label: 'Piastrelle',             href: '/edilizia/piastrelle'             },
      { id: 231, label: 'Sanitari',               href: '/edilizia/sanitari'               },
      { id: 232, label: 'Tetti',                  href: '/edilizia/tetti'                  },
      { id: 233, label: 'Impermeabilizzazioni',   href: '/edilizia/impermeabilizzazioni'   },
      { id: 234, label: 'Tinteggiatura',          href: '/edilizia/tinteggiatura'          },
      { id: 235, label: 'Antimuffa',              href: '/edilizia/antimuffa'              },
      { id: 236, label: 'Smaltimento Calcinacci', href: '/edilizia/smaltimento-calcinacci' },
      { id: 237, label: 'Pitturazioni',           href: '/edilizia/pitturazioni'           },
      { id: 238, label: 'Indoratura',             href: '/edilizia/indoratura'             },
      { id: 239, label: 'Pulizia Finale',         href: '/edilizia/pulizia-finale'         },
      { id: 240, label: 'Piscine',                href: '/edilizia/piscine'                },
      { id: 241, label: 'Solarium',               href: '/edilizia/solarium'               },
    ],
  },
  {
    id: 'legno',
    label: 'Legno',
    href: '/legno',
    pages: [
      { id: 242, label: 'Porte Interne',           href: '/legno/porte-interne'           },
      { id: 243, label: 'Porte Scrigno',           href: '/legno/porte-scrigno'           },
      { id: 244, label: 'Cucine',                  href: '/legno/cucine'                  },
      { id: 245, label: 'Mobili in Massello',      href: '/legno/mobili-in-massello'      },
      { id: 246, label: 'Mobili Tamburati',        href: '/legno/mobili-tamburati'        },
      { id: 247, label: 'Parquet',                 href: '/legno/parquet'                 },
      { id: 248, label: 'Rivestimento Compensato', href: '/legno/rivestimento-compensato' },
      { id: 249, label: 'Infissi in Legno',        href: '/legno/infissi-in-legno'        },
    ],
  },
  {
    id: 'elettricita',
    label: 'Elettricità',
    href: '/elettricita',
    pages: [
      { id: 250, label: 'Impianti Elettrici', href: '/elettricita/impianti-elettrici' },
      { id: 251, label: 'Illuminazione',      href: '/elettricita/illuminazione'       },
      { id: 252, label: 'Elettrodomestici',   href: '/elettricita/elettrodomestici'    },
      { id: 253, label: 'Pannelli Solari',    href: '/elettricita/pannelli-solari'     },
      { id: 254, label: 'Domotica',           href: '/elettricita/domotica'            },
      { id: 255, label: 'Videosorveglianza',  href: '/elettricita/videosorveglianza'   },
    ],
  },
  {
    id: 'termodinamica',
    label: 'Termodinamica',
    href: '/termodinamica',
    pages: [
      { id: 256, label: 'Climatizzazione',     href: '/termodinamica/climatizzazione'     },
      { id: 257, label: 'Isolamenti Termici',  href: '/termodinamica/isolamenti-termici'  },
      { id: 258, label: 'Isolamenti Acustici', href: '/termodinamica/isolamenti-acustici' },
      { id: 259, label: 'Caldaie',             href: '/termodinamica/caldaie'             },
      { id: 260, label: 'Pompe di Calore',     href: '/termodinamica/pompe-di-calore'     },
      { id: 261, label: 'Impianti Idraulici',  href: '/termodinamica/impianti-idraulici'  },
      { id: 262, label: 'Irrigazione',         href: '/termodinamica/irrigazione'         },
      { id: 263, label: 'Allacci',             href: '/termodinamica/allacci'             },
    ],
  },
  {
    id: 'arredi',
    label: 'Arredi',
    href: '/arredi',
    pages: [
      { id: 264, label: 'Quadri',       href: '/arredi/quadri'       },
      { id: 265, label: 'Soprammobili', href: '/arredi/soprammobili' },
      { id: 266, label: 'Lampadari',    href: '/arredi/lampadari'    },
    ],
  },
  {
    id: 'tessuti',
    label: 'Tessuti',
    href: '/tessuti',
    pages: [
      { id: 267, label: 'Divani',   href: '/tessuti/divani'   },
      { id: 268, label: 'Tendaggi', href: '/tessuti/tendaggi' },
    ],
  },
  {
    id: 'servizi',
    label: 'Servizi',
    href: '/servizi',
    pages: [
      { id: 269, label: 'Riparazioni',          href: '/servizi/riparazioni'          },
      { id: 270, label: 'Montaggio',            href: '/servizi/montaggio'            },
      { id: 271, label: 'Manutenzione',         href: '/servizi/manutenzione'         },
      { id: 272, label: 'Contratti di Pulizia', href: '/servizi/contratti-di-pulizia' },
    ],
  },
]

// Pagine Brand: area pubblica sito vetrina
export const clientPages: NavPage[] = [
  { id: 36, label: 'Storia',                href: '/brand/storia'                },
  { id: 6,  label: 'Galleria',              href: '/brand/galleria'              },
  { id: 15, label: 'Contatti',              href: '/brand/contatti'              },
  { id: 37, label: 'Partners',              href: '/brand/partners'              },
  { id: 38, label: 'Cataloghi',             href: '/brand/cataloghi'             },
  { id: 39, label: 'Condizioni di Vendita', href: '/brand/condizioni-di-vendita' },
  { id: 40, label: 'Templates Documenti',   href: '/brand/templates-documenti'   },
]

// Colori placeholder per i riquadri della home (sostituire con immagini reali)
export const cardColors = [
  '#4f7cac','#6b8f71','#c47c5a','#7b6fa0',
  '#4a8fa8','#8f7b6b','#5a8a6b','#a07b5a',
  '#6b7ba0','#8a6b8f','#5a7b8f','#8f6b5a',
  '#7b8a5a','#6b5a8f',
]

// Pagine Area Clienti: visibili a tutti gli utenti loggati
export const areaClientiPages: NavPage[] = [
  { id: 50, label: 'Ordini',     href: '/area-clienti/ordini'     },
  { id: 51, label: 'Cantieri',   href: '/area-clienti/cantieri'   },
  { id: 52, label: 'Preventivi', href: '/area-clienti/preventivi' },
  { id: 53, label: 'Documenti',  href: '/area-clienti/documenti'  },
  { id: 54, label: 'Fatture',    href: '/area-clienti/fatture'    },
]

// Pagine Aiuto: sempre pubbliche
export const aiutoPages: NavPage[] = [
  { id: 101, label: 'Guida PreventivoOnLine', href: '/aiuto/guida-preventivo' },
  { id: 102, label: 'Guida CantiereOnLine',   href: '/aiuto/guida-cantiere'   },
  { id: 103, label: 'Guida DigiApp',           href: '/aiuto/app'              },
]

// Pagine amministrazione: area amministrativa fissa
export const adminPages: NavPage[] = [
  { id: 19, label: 'Impostazioni',    href: '/amministrazione/impostazioni',    roles: ['admin'] },
  { id: 20, label: 'Gestione Utenti', href: '/amministrazione/gestione-utenti', roles: ['admin'] },
]

// Pagine Fornitori: visibili solo a dipendenti e admin
export const fornitoriDipendentiPages: NavPage[] = [
  { id: 24, label: 'Anagrafica Fornitori', href: '/area-lavoro/anagrafica-fornitori' },
  { id: 23, label: 'Cataloghi',            href: '/area-lavoro/cataloghi'            },
  { id: 25, label: 'Listini',              href: '/area-lavoro/listini'              },
  { id: 26, label: 'Ordini a Fornitori',   href: '/area-lavoro/ordini-fornitori'     },
]

// Pagine Clienti: visibili solo a dipendenti e admin
export const clientiDipendentiPages: NavPage[] = [
  { id: 21, label: 'Anagrafica Clienti', href: '/area-lavoro/anagrafica-clienti'   },
  { id: 35, label: 'Ordini Ricevuti',    href: '/area-lavoro/ordini-ricevuti'      },
  { id: 28, label: 'Cantieri',           href: '/area-lavoro/cantieri'             },
  { id: 60, label: 'Preventivi',         href: '/clienti/preventivi'               },
  { id: 61, label: 'Documenti',          href: '/clienti/documenti'                },
  { id: 17, label: 'Fatture',            href: '/area-lavoro/fatture'              },
]

// Pagine area-lavoro: protette da matrice permessi
export const internalPages: NavPage[] = [
  { id: 16, label: 'Magazzino',            href: '/area-lavoro/magazzino'            },
  { id: 18, label: 'Bilancio',             href: '/area-lavoro/bilancio'             },
  { id: 22, label: 'Adempimenti',          href: '/area-lavoro/adempimenti'          },
  { id: 27, label: 'Worklist',             href: '/area-lavoro/worklist'             },
  { id: 29, label: 'Marketing',            href: '/area-lavoro/marketing'            },
  { id: 30, label: 'I Miei Ordini',        href: '/area-lavoro/miei-ordini'          },
  { id: 31, label: 'I Miei Cantieri',      href: '/area-lavoro/cantieri'             },
  { id: 32, label: 'Email',                href: '/area-lavoro/email'                },
  { id: 33, label: 'Archivio',             href: '/area-lavoro/archivio'             },
  { id: 34, label: 'Facsimili',            href: '/area-lavoro/facsimili'            },
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

export function visibleFornitoriPages(
  role: string | null,
  rolePermissions: Record<string, number[]>,
  disabledPages: number[]
): NavPage[] {
  if (!role || role === 'cliente') return []
  if (role === 'admin') return fornitoriDipendentiPages.filter(p => !disabledPages.includes(p.id))
  const allowed = rolePermissions[role] ?? []
  return fornitoriDipendentiPages.filter(p => allowed.includes(p.id) && !disabledPages.includes(p.id))
}

export function visibleClientiPages(
  role: string | null,
  rolePermissions: Record<string, number[]>,
  disabledPages: number[]
): NavPage[] {
  if (!role || role === 'cliente') return []
  if (role === 'admin') return clientiDipendentiPages.filter(p => !disabledPages.includes(p.id))
  const allowed = rolePermissions[role] ?? []
  return clientiDipendentiPages.filter(p => allowed.includes(p.id) && !disabledPages.includes(p.id))
}
