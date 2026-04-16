# SEO completo pagine categoria pubbliche

**Data:** 2026-04-15
**Stato:** completato

---

## Situazione attuale

Tutte le 89 pagine categoria esistono già con:
- `title` unico e descrittivo ✓
- `description` unica ✓
- `canonical` self ✓
- Breadcrumb (su sottopagine) ✓
- Contenuto testuale ✓

**Mancano:**
- `robots: { index: true, follow: true }`
- `openGraph: { title, description, url, type: 'website' }`
- CTA ai 2 servizi esclusivi (preventivo online + cantiere online)

---

## Lavoro da fare su ogni pagina

### 1. Aggiunta metadata mancanti

```typescript
export const metadata: Metadata = {
  title: '...',         // già presente
  description: '...',   // già presente
  alternates: { canonical: 'https://...' },  // già presente
  robots: { index: true, follow: true },     // DA AGGIUNGERE
  openGraph: {                               // DA AGGIUNGERE
    title: '...',        // uguale al title
    description: '...',  // uguale alla description
    url: 'https://...',  // uguale al canonical
    type: 'website',
  },
}
```

### 2. CTA esclusivi (in fondo a ogni pagina)

```tsx
<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 40 }}>
  <Link href="/aiuto/guida-preventivo" className="cta-home-btn" ...>
    Calcola il tuo preventivo online
  </Link>
  <Link href="/aiuto/guida-cantiere" className="cta-home-btn" ...>
    Segui il tuo cantiere online
  </Link>
</div>
```

---

## File da aggiornare (89 totali)

### Serramenti (12)
serramenti/page, infissi-in-alluminio, infissi-in-pvc, verande, persiane, imbotti, veneziane, box-doccia, vetrine, lucernai, zanzariere, avvolgibili-motorizzati

### Metallurgia (12)
metallurgia/page, porte-blindate, pannelli-bugnato-alluminio, cancelli, grate, ringhiere, balconi, saracinesche-motorizzate, strutture, scale, armadi-blindati, casseforti

### Edilizia (20)
edilizia/page, demolizioni, opere-murarie, tramezzature, intonaci, massetti, tracce, pavimenti, piastrelle, sanitari, tetti, impermeabilizzazioni, tinteggiatura, antimuffa, smaltimento-calcinacci, pitturazioni, indoratura, pulizia-finale, piscine, solarium

### Legno (9)
legno/page, porte-interne, porte-scrigno, cucine, mobili-in-massello, mobili-tamburati, parquet, rivestimento-compensato, infissi-in-legno

### Elettricità (7)
elettricita/page, impianti-elettrici, illuminazione, elettrodomestici, pannelli-solari, domotica, videosorveglianza

### Termodinamica (9)
termodinamica/page, climatizzazione, isolamenti-termici, isolamenti-acustici, caldaie, pompe-di-calore, impianti-idraulici, irrigazione, allacci

### Arredi (4)
arredi/page, quadri, soprammobili, lampadari

### Tessuti (3)
tessuti/page, divani, tendaggi

### Servizi (5)
servizi/page, riparazioni, montaggio, manutenzione, contratti-di-pulizia

### Top-level SEO landing (6)
infissi, verande, persiane-in-alluminio, porte-corazzate, ristrutturazioni-chiavi-in-mano, strutture-metalliche

---

## Note tecniche
- `openGraph.title` e `openGraph.description` rispecchiano `title` e `description`
- `openGraph.url` rispecchia il `canonical`
- Le pagine di categoria (index) NON ricevono CTA (già hanno link alle sottopagine)
- Le sottopagine ricevono sempre i 2 CTA in fondo
