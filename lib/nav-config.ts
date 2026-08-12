import { isExcludedFromShortcuts } from '@/lib/shortcut-exclusions'

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
      { id: 201, label: 'Infissi in Alluminio Freddo', href: '/serramenti/infissi-in-alluminio-freddo' },
      { id: 2052, label: 'Tapparelle Motorizzazione', href: '/serramenti/tapparelle-motorizzazione' },
      { id: 206,  label: 'Veneziane',              href: '/serramenti/veneziane'               },
      { id: 208, label: 'Vetrine',                 href: '/serramenti/vetrine'                 },
      { id: 209, label: 'Lucernai',                href: '/serramenti/lucernai'                },
      { id: 207, label: 'Box Doccia',              href: '/serramenti/box-doccia'              },
    ],
  },
  {
    id: 'metallurgia',
    label: 'Ferro e Acciaio',
    href: '/metallurgia',
    pages: [
      { id: 2119, label: 'Porte Corazzate',           href: '/metallurgia/porte-corazzate'            },
      { id: 2120, label: 'Porte Antincendio',        href: '/metallurgia/porte-antincendio'          },
      { id: 2171, label: 'Saracinesche Manuali',     href: '/metallurgia/saracinesche-manuali'       },
      { id: 218,  label: 'Saracinesche Motorizzate', href: '/metallurgia/saracinesche-motorizzate'   },
      { id: 219, label: 'Strutture Portanti',          href: '/metallurgia/strutture'                  },
      { id: 2203, label: 'Scale Antincendio',         href: '/metallurgia/scale-antincendio'          },
      { id: 221, label: 'Armadi Blindati',            href: '/metallurgia/armadi-blindati'            },
      { id: 222, label: 'Casseforti',                 href: '/metallurgia/casseforti'                 },
      { id: 2221, label: 'Tetti Coibentati',          href: '/metallurgia/tetti-coibentati'           },
      { id: 2222, label: 'Grondaie',                  href: '/metallurgia/grondaie'                   },
    ],
  },
  {
    id: 'legno',
    label: 'Legno',
    href: '/legno',
    pages: [
      { id: 242, label: 'Porte Interne',           href: '/legno/porte-interne'           },
      { id: 243, label: 'Porte a Scomparsa',        href: '/legno/porte-scrigno'           },
      { id: 244, label: 'Cucine',                  href: '/legno/cucine'                  },
      { id: 245, label: 'Mobili in Massello',      href: '/legno/mobili-in-massello'      },
      { id: 246, label: 'Mobili Tamburati',        href: '/legno/mobili-tamburati'        },
      { id: 303, label: 'Mobili su Misura',        href: '/legno/mobili-su-misura'        },
      { id: 247, label: 'Parquet',                 href: '/legno/parquet'                 },
      { id: 248, label: 'Rivestimento Compensato', href: '/legno/rivestimento-compensato' },
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
      { id: 273, label: 'Tappeti',  href: '/tessuti/tappeti'  },
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

// Pagine spostate dal dropdown di categoria a un menu "flat" dedicato (es. Comfort
// e Spazi Esterni): ora vivono con url e id propri sotto il proprio namespace
// (vedi comfortSpaziEsterniPages ecc.) e sono state rimosse del tutto da
// categoryGroups — questa mappa resta vuota finché non serve di nuovo il pattern
// "stesso id, doppio punto di ingresso, url invariato".
export const HIDDEN_FROM_CATEGORY: Record<string, number[]> = {}

// Gruppi di categoryGroups nascosti dalla barra di navigazione principale (dropdown
// desktop e sezione mobile), pur restando dentro categoryGroups per due motivi: le
// sue sottopagine restano singolarmente attivabili/disattivabili dal pannello admin
// "Pagine visibili", e la loro catena prev/next interna (getCategoryGroupNeighbors)
// resta funzionante. La pagina hub (es. /edilizia) e le sue sottopagine restano
// online e raggiungibili — cambia solo il punto di ingresso: non più un dropdown
// di primo livello, ma un link dedicato altrove (es. dentro Ristrutturazioni Chiavi
// in Mano), la cui visibilità si gestisce con l'id della voce in quel menu flat.
export const HIDDEN_CATEGORY_GROUPS: string[] = ['edilizia']

// Vicini (precedente/successivo) di una pagina in una categoryGroup, tenendo conto sia
// di disabledPages sia di HIDDEN_FROM_CATEGORY (le pagine "spostate" non contano come
// vicine qui: appartengono logicamente a un'altra sezione).
export function getCategoryGroupNeighbors(groupId: string, currentId: number, disabledPages: number[]): { prev: NavPage | null; next: NavPage | null } {
  const group = categoryGroups.find(g => g.id === groupId)
  if (!group) return { prev: null, next: null }
  const hidden = HIDDEN_FROM_CATEGORY[groupId] ?? []
  const visible = group.pages.filter(p => !disabledPages.includes(p.id) && !hidden.includes(p.id))
  return getSectionNeighbors(visible, currentId, disabledPages)
}

// Pagine Chi Siamo (ex "Brand"): area pubblica sito vetrina.
// Le pagine vivono ancora sotto app/brand/* (nessuna modifica ai file), ma sono
// raggiunte con l'URL pubblico /chi-siamo/* grazie al rewrite in next.config.ts.
export const clientPages: NavPage[] = [
  { id: 36, label: 'Storia',                href: '/chi-siamo/storia'                },
  { id: 6,  label: 'Galleria',              href: '/chi-siamo/galleria'              },
  { id: 15, label: 'Contatti',              href: '/chi-siamo/contatti'              },
  { id: 37, label: 'Partners',              href: '/chi-siamo/partners'              },
  { id: 39, label: 'Condizioni di Vendita', href: '/chi-siamo/condizioni-di-vendita' },
  { id: 40, label: 'Documenti Legali',      href: '/chi-siamo/templates-documenti'   },
]

export function getClientPagesNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(clientPages, currentId, disabledPages)
}

// Voci singole in barra (non dentro un dropdown): Shop prima di Cataloghi
export const standalonePages: NavPage[] = [
  { id: 41, label: 'Shop On Line', href: '/shop'          },
  { id: 42, label: 'Promozioni', href: '/promozioni' },
  { id: 38, label: 'Cataloghi', href: '/cataloghi' },
]

// Vicini (precedente/successivo) tra le voci standalone stesse: non hanno una propria
// sezione con sottopagine, quindi qui il bottone dinamico nello sticky è sempre "gold"
// (voce di nav adiacente), mai "blu" (sorella nella stessa sezione).
export function getStandaloneNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(standalonePages, currentId, disabledPages)
}

// Pagine Riqualificazione Energetica (ex "Prodotti"): pagine vetrina top-level, sempre pubbliche.
// Nomi/id storici (280-285, Infissi/Verande/Persiane/Porte Blindate/Strutture
// Metalliche/Ristrutturazioni) sostituiti dal 2026-07-21: le pagine restano
// online e raggiungibili via URL diretto, ma non più in nav/footer/admin.
export const prodottiPages: NavPage[] = [
  { id: 290, label: 'Infissi in Alluminio a Taglio Termico', href: '/riqualificazione-energetica/infissi-in-alluminio-taglio-termico'    },
  { id: 291, label: 'Infissi in PVC',           href: '/riqualificazione-energetica/infissi-in-pvc'                                    },
  { id: 292, label: 'Infissi in Legno',         href: '/riqualificazione-energetica/infissi-in-legno'                                  },
  { id: 293, label: 'Infissi in Legno-Alluminio', href: '/riqualificazione-energetica/infissi-in-legno-alluminio'                      },
  { id: 294, label: 'Persiane in Alluminio',    href: '/riqualificazione-energetica/persiane-in-alluminio'                             },
  { id: 295, label: 'Persiane in PVC',          href: '/riqualificazione-energetica/persiane-in-pvc'                                   },
  { id: 296, label: 'Monoblocchi',               href: '/riqualificazione-energetica/monoblocchi'                                       },
  { id: 297, label: 'Cassonetti in PVC',        href: '/riqualificazione-energetica/cassonetti-in-pvc'                                 },
  { id: 298, label: 'Tapparelle in Alluminio',  href: '/riqualificazione-energetica/tapparelle-in-alluminio'                           },
  { id: 299, label: 'Tapparelle in PVC',        href: '/riqualificazione-energetica/tapparelle-in-pvc'                                 },
]

// Vicini (precedente/successivo) di una pagina all'interno di una sequenza ordinata di
// NavPage, saltando quelle disattivate da pannello admin (disabledPages) così la
// numerazione resta compatta. Usato per i bottoni dinamici blu "torna"/"vai" nello
// sticky di ogni pagina (intra-sezione).
export function getSectionNeighbors(pages: NavPage[], currentId: number, disabledPages: number[]): { prev: NavPage | null; next: NavPage | null } {
  const visible = pages.filter(p => !disabledPages.includes(p.id))
  const idx = visible.findIndex(p => p.id === currentId)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? visible[idx - 1] : null,
    next: idx < visible.length - 1 ? visible[idx + 1] : null,
  }
}

export function getProdottiNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(prodottiPages, currentId, disabledPages)
}

// Raggruppamento visivo (non cliccabile) delle voci sopra nel dropdown di navbar/menu mobile.
export const prodottiSubgroups: { label: string; pageIds: number[] }[] = [
  { label: 'Infissi Isolanti Termoacustici', pageIds: [290, 291, 292, 293] },
  { label: 'Sistemi Oscuranti',              pageIds: [294, 295, 296, 297, 298, 299] },
]

// Pagine "Comfort e Spazi Esterni": voce di menu nuova, flat (nessuna sottocategoria),
// che riusa le pagine reali già esistenti sotto Serramenti (stessi id/href: se una
// pagina viene disabilitata dal pannello "Pagine visibili" sparisce da entrambe le nav).
export const comfortSpaziEsterniPages: NavPage[] = [
  { id: 2082, label: 'Vetrate Panoramiche',   href: '/comfort-e-spazi-esterni/vetrate-panoramiche'   },
  { id: 2081, label: 'Pergole Bioclimatiche', href: '/comfort-e-spazi-esterni/pergole-bioclimatiche' },
  { id: 203,  label: 'Verande in Alluminio',  href: '/comfort-e-spazi-esterni/verande-in-alluminio'  },
  { id: 2031, label: 'Verande in PVC',        href: '/comfort-e-spazi-esterni/verande-in-pvc'        },
  { id: 210,  label: 'Zanzariere',            href: '/comfort-e-spazi-esterni/zanzariere'            },
  { id: 240,  label: 'Piscine',               href: '/comfort-e-spazi-esterni/piscine'               },
  { id: 241,  label: 'Solarium',              href: '/comfort-e-spazi-esterni/solarium'              },
]

export function getComfortNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(comfortSpaziEsterniPages, currentId, disabledPages)
}

// Pagine "Antintrusione e Sicurezza": voce di menu nuova, flat, che riusa le pagine
// reali già esistenti sotto Metallurgia (stessi id/href, stesso principio di comfortSpaziEsterniPages).
export const antintrusioneSicurezzaPages: NavPage[] = [
  { id: 2124, label: 'Porte Blindate Riv. Legno',      href: '/antintrusione-e-sicurezza/porte-blindate-legno'      },
  { id: 2125, label: 'Porte Blindate Riv. Alluminio',  href: '/antintrusione-e-sicurezza/porte-blindate-alluminio'  },
  { id: 2126, label: 'Porte Blindate Riv. PVC',        href: '/antintrusione-e-sicurezza/porte-blindate-pvc'        },
  { id: 215,  label: 'Grate',          href: '/antintrusione-e-sicurezza/grate'          },
  { id: 214,  label: 'Cancelli',       href: '/antintrusione-e-sicurezza/cancelli'       },
]

export function getAntintrusioneNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(antintrusioneSicurezzaPages, currentId, disabledPages)
}

// Pagine "Carpenteria d'Arredo": voce di menu nuova, flat, che riusa le pagine
// reali già esistenti sotto Metallurgia (stessi id/href, stesso principio delle voci sopra).
export const carpenteriaArredoPages: NavPage[] = [
  { id: 2201, label: 'Scale a Rampe',     href: '/carpenteria-arredo/scale-a-rampe'     },
  { id: 2202, label: 'Scale a Chiocciola', href: '/carpenteria-arredo/scale-a-chiocciola' },
  { id: 216,  label: 'Ringhiere',         href: '/carpenteria-arredo/ringhiere'         },
  { id: 217,  label: 'Balconi',           href: '/carpenteria-arredo/balconi'           },
]

export function getCarpenteriaNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(carpenteriaArredoPages, currentId, disabledPages)
}

// Pagine "Ristrutturazioni Chiavi in Mano": voce di menu nuova, flat. Edilizia riusa
// l'hub categoria già esistente (link di scorciatoia, non una pagina "prestata": Edilizia
// resta proprietaria della sua url); Pratiche/Impianti sono pagine nuove generiche/
// segnaposto (2026-07-21), contenuto e collegamenti da definire in seguito.
// "Arredi" è stato rimosso (2026-08-12): aveva già una propria voce di nav dedicata,
// il link di scorciatoia qui era ridondante. "Mobili" è stato spostato sotto Legno
// come pagina vera e propria ("Mobili su Misura", id 303 riusato) invece di restare
// un segnaposto senza categoria — vedi categoryGroups.legno.
export const ristrutturazioniChiaviInManoPages: NavPage[] = [
  { id: 300, label: 'Pratiche',  href: '/ristrutturazioni-chiavi-in-mano/pratiche' },
  { id: 301, label: 'Edilizia',  href: '/edilizia'                                 },
  { id: 302, label: 'Impianti',  href: '/ristrutturazioni-chiavi-in-mano/impianti' },
]

export function getRistrutturazioniNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(ristrutturazioniChiaviInManoPages, currentId, disabledPages)
}

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
  { id: 52, label: 'Preventivi',    href: '/area-clienti/preventivi'    },
  { id: 54, label: 'Computi Metrici', href: '/area-clienti/computometrici' },
  { id: 53, label: 'Documenti',    href: '/area-clienti/documenti'      },
  { id: 55, label: 'Avvisi',     href: '/area-clienti/avvisi'     },
]

// Pagine Aiuto: sempre pubbliche
export const aiutoPages: NavPage[] = [
  { id: 101, label: 'Guida PreventivoOnLine', href: '/aiuto/guida-preventivo' },
  { id: 102, label: 'Guida CantiereOnLine',   href: '/aiuto/guida-cantiere'   },
  { id: 103, label: 'Guida DigiApp',           href: '/aiuto/app'              },
  { id: 104, label: 'Guida alla Navigazione', href: '/aiuto/guida-navigazione' },
]

export function getAiutoNeighbors(currentId: number, disabledPages: number[]) {
  return getSectionNeighbors(aiutoPages, currentId, disabledPages)
}

// Pagine amministrazione: area amministrativa fissa
export const adminPages: NavPage[] = [
  { id: 19, label: 'Impostazioni',         href: '/amministrazione/impostazioni',    roles: ['admin'] },
  { id: 20, label: 'Gestione Utenti',     href: '/amministrazione/gestione-utenti', roles: ['admin'] },
  { id: 62, label: 'Templates Carte Intestate', href: '/amministrazione/templates',       roles: ['admin'] },
  { id: 63, label: 'Editor Disegno',      href: '/disegno',                         roles: ['admin'] },
  { id: 64, label: 'Database',            href: '/amministrazione/database',        roles: ['admin'] },
  { id: 65, label: 'Area di Test',        href: '/amministrazione/area-di-test',    roles: ['admin'] },
  { id: 66, label: 'B2B',                 href: '/amministrazione/b2b',             roles: ['admin'] },
  { id: 67, label: 'B2C',                 href: '/amministrazione/b2c',             roles: ['admin'] },
  { id: 68, label: 'Immagini Categorie e Promo', href: '/amministrazione/immagini-categorie', roles: ['admin'] },
  { id: 69, label: 'Test Anteprime',      href: '/amministrazione/test-anteprime',  roles: ['admin'] },
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
  { id: 57, label: 'Computi Metrici',    href: '/clienti/computometrici'           },
  { id: 61, label: 'Documenti',          href: '/clienti/documenti'                },
  { id: 56, label: 'Avvisi',             href: '/area-clienti/avvisi'              },
]

// Pagine area-lavoro: protette da matrice permessi
export const internalPages: NavPage[] = [
  { id: 16, label: 'Magazzino',            href: '/area-lavoro/magazzino'            },
  { id: 17, label: 'Fatture',              href: '/area-lavoro/fatture'              },
  { id: 18, label: 'Bilancio',             href: '/area-lavoro/bilancio'             },
  { id: 22, label: 'Adempimenti',          href: '/area-lavoro/adempimenti'          },
  { id: 27, label: 'Worklist',             href: '/area-lavoro/worklist'             },
  { id: 29, label: 'Marketing',            href: '/area-lavoro/marketing'            },
  { id: 30, label: 'I Miei Ordini',        href: '/area-lavoro/miei-ordini'          },
  { id: 31, label: 'I Miei Cantieri',      href: '/area-lavoro/cantieri'             },
  { id: 32, label: 'Notifiche',             href: '/area-lavoro/email'                },
  { id: 33, label: 'Archivio',             href: '/area-lavoro/archivio'             },
  { id: 34, label: 'Facsimili',            href: '/area-lavoro/facsimili'            },
]

// Prefissi che richiedono login (stessa lista di app/actions.ts PROTECTED_PREFIXES)
const PROTECTED_PREFIXES = ['/area-clienti', '/area-lavoro', '/amministrazione', '/clienti', '/disegno']

// Tutte le pagine vetrina pubbliche con un id nel pannello "Pagine visibili"
const PUBLIC_PAGES_WITH_ID = [
  ...categoryGroups.flatMap(g => g.pages),
  ...clientPages,
  ...standalonePages,
  ...prodottiPages,
  ...aiutoPages,
]

/**
 * Per le scorciatoie home: una pagina va nascosta se il profilo corrente
 * (anche se loggato) non potrebbe comunque accedervi — replica la stessa
 * logica di visibleInternalPages/visibleFornitoriPages/visibleClientiPages —
 * oppure se l'admin l'ha disattivata dal pannello "Pagine visibili"
 * (indipendentemente dal motivo: ruolo o scelta admin, non ha senso
 * proporla come preferita se è stata disabilitata).
 */
// Vero se href è esattamente pageHref, o un suo sotto-percorso (/pageHref/dettaglio)
// o la stessa pagina con una query string (/pageHref?param=x) — le pagine di
// dettaglio dinamiche (per path o per query, es. i cantieri) condividono gli
// stessi permessi della voce di menu statica a cui appartengono.
export function matchesPage(href: string, pageHref: string): boolean {
  return href === pageHref || href.startsWith(pageHref + '/') || href.startsWith(pageHref + '?')
}

export function isHrefAccessible(
  href: string,
  role: string | null,
  rolePermissions: Record<string, number[]>,
  disabledPages: number[]
): boolean {
  if (isExcludedFromShortcuts(href)) return false

  const publicMatch = PUBLIC_PAGES_WITH_ID.find(p => p.href === href)
  if (publicMatch && disabledPages.includes(publicMatch.id)) return false

  const isProtected = PROTECTED_PREFIXES.some(p => href === p || href.startsWith(p + '/'))
  if (!isProtected) return true
  if (!role) return false
  if (role === 'admin') return true

  if (areaClientiPages.some(p => matchesPage(href, p.href))) return true
  if (adminPages.some(p => p.href === href)) return false

  const allowed = rolePermissions[role] ?? []
  const internal = internalPages.find(p => matchesPage(href, p.href))
  if (internal) return allowed.includes(internal.id)

  if (role === 'cliente') return false

  const fornitori = fornitoriDipendentiPages.find(p => matchesPage(href, p.href))
  if (fornitori) return allowed.includes(fornitori.id) && !disabledPages.includes(fornitori.id)

  const clienti = clientiDipendentiPages.find(p => matchesPage(href, p.href))
  if (clienti) return allowed.includes(clienti.id) && !disabledPages.includes(clienti.id)

  // Pagina protetta ma non riconosciuta in nessuna matrice: nascondi per sicurezza
  return false
}

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
