import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const files = [
  'app/tessuti/tendaggi/page.tsx',
  'app/tessuti/divani/page.tsx',
  'app/arredi/soprammobili/page.tsx',
  'app/arredi/quadri/page.tsx',
  'app/arredi/lampadari/page.tsx',
  'app/legno/rivestimento-compensato/page.tsx',
  'app/legno/porte-scrigno/page.tsx',
  'app/legno/porte-interne/page.tsx',
  'app/legno/parquet/page.tsx',
  'app/legno/mobili-tamburati/page.tsx',
  'app/legno/mobili-in-massello/page.tsx',
  'app/legno/infissi-in-legno/page.tsx',
  'app/legno/cucine/page.tsx',
  'app/metallurgia/tetti-coibentati/page.tsx',
  'app/metallurgia/strutture/page.tsx',
  'app/metallurgia/scale-antincendio/page.tsx',
  'app/metallurgia/scale-a-rampe/page.tsx',
  'app/metallurgia/scale-a-chiocciola/page.tsx',
  'app/metallurgia/scale/page.tsx',
  'app/metallurgia/saracinesche-motorizzate/page.tsx',
  'app/metallurgia/saracinesche-manuali/page.tsx',
  'app/metallurgia/ringhiere/page.tsx',
  'app/metallurgia/porte-blindate/page.tsx',
  'app/metallurgia/porte-antincendio/page.tsx',
  'app/metallurgia/pannelli-bugnato-alluminio/page.tsx',
  'app/metallurgia/grondaie/page.tsx',
  'app/metallurgia/grate/page.tsx',
  'app/metallurgia/casseforti/page.tsx',
  'app/metallurgia/cancelli/page.tsx',
  'app/metallurgia/balconi/page.tsx',
  'app/metallurgia/armadi-blindati/page.tsx',
  'app/metallurgia/porte-corazzate/page.tsx',
  'app/serramenti/zanzariere/page.tsx',
  'app/serramenti/vetrine/page.tsx',
  'app/serramenti/verande-in-pvc/page.tsx',
  'app/serramenti/verande-in-alluminio/page.tsx',
  'app/serramenti/verande/page.tsx',
  'app/serramenti/veneziane/page.tsx',
  'app/serramenti/tapparelle-motorizzate/page.tsx',
  'app/serramenti/tapparelle-manuali/page.tsx',
  'app/serramenti/persiane-in-alluminio/page.tsx',
  'app/serramenti/lucernai/page.tsx',
  'app/serramenti/infissi-in-pvc/page.tsx',
  'app/serramenti/imbotti/page.tsx',
  'app/serramenti/box-doccia/page.tsx',
  'app/serramenti/avvolgibili-motorizzati/page.tsx',
  'app/serramenti/infissi-in-alluminio/page.tsx',
]

const base = 'C:/Users/User/Desktop/SITO/sito-cursor'

const IMPORT_ANCHOR = `import type { PreventivoDestOption } from '@/app/brand/cataloghi/actions'`
const IMPORT_ADD = `import AggiungiArticoloAcquistoForm from '@/components/aggiungi-articolo-acquisto-form'
import type { ArticoloListinoAcquisto } from '@/components/aggiungi-articolo-acquisto-form'`

const RETURN_OLD = `      return { categoria: { nome: categoria.nome, listino_categoria: categoria.listino_categoria }, voci: voceList, articoliPerListino }`
const RETURN_NEW = `      const acquistoCats = new Set<string>()
      if (categoria.listino_categoria) acquistoCats.add(categoria.listino_categoria)
      for (const v of voceList) { if (v.listino_categoria) acquistoCats.add(v.listino_categoria) }
      let articoliAcquisto: ArticoloListinoAcquisto[] = []
      if (acquistoCats.size > 0) {
        try {
          const cats = [...acquistoCats]
          const ph = cats.map(() => '?').join(',')
          const [rowsAcq] = await db.query(
            \`SELECT id, descrizione, produttore, unita, prezzo_vendita, max_acquistabile FROM listini WHERE categoria IN (\${ph}) AND disponibile = 1 AND acquistabile = 1 ORDER BY descrizione ASC\`,
            cats
          )
          articoliAcquisto = (rowsAcq as (ArticoloListinoAcquisto & { max_acquistabile: number | null })[]).map(r => ({
            ...r,
            max_acquistabile: r.max_acquistabile != null ? Number(r.max_acquistabile) : null,
          }))
        } catch {}
      }
      return { categoria: { nome: categoria.nome, listino_categoria: categoria.listino_categoria }, voci: voceList, articoliPerListino, articoliAcquisto }`

const WRAPPER_CLOSE = `        )}

        <div style={{ display: 'flex', gap: 8 }}>`
const WRAPPER_WITH_ACQUISTO = `        )}

        {catalogo && catalogo.articoliAcquisto.length > 0 && (
          <AggiungiArticoloAcquistoForm articoli={catalogo.articoliAcquisto} />
        )}

        <div style={{ display: 'flex', gap: 8 }}>`

let ok = 0, skip = 0, errors = []

for (const rel of files) {
  const fpath = join(base, rel)
  let src = readFileSync(fpath, 'utf8')

  if (src.includes('AggiungiArticoloAcquistoForm')) { skip++; continue }

  if (!src.includes(IMPORT_ANCHOR)) { errors.push(rel + ': no import anchor'); continue }
  if (!src.includes(RETURN_OLD)) { errors.push(rel + ': no return anchor'); continue }
  if (!src.includes(WRAPPER_CLOSE)) { errors.push(rel + ': no wrapper close anchor'); continue }

  src = src.replace(IMPORT_ANCHOR, IMPORT_ANCHOR + '\n' + IMPORT_ADD)
  src = src.replace(RETURN_OLD, RETURN_NEW)
  src = src.replace(WRAPPER_CLOSE, WRAPPER_WITH_ACQUISTO)

  writeFileSync(fpath, src, 'utf8')
  ok++
}

console.log('Transformed:', ok, '| Already done:', skip, '| Errors:', errors.length)
if (errors.length) errors.forEach(e => console.log(' ERR:', e))
