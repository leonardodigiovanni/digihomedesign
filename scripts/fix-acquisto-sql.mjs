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

const BAD_LINE = `            ,`
const GOOD_LINE = `            \`SELECT id, descrizione, produttore, unita, prezzo_vendita, max_acquistabile FROM listini WHERE categoria IN (\${ph}) AND disponibile = 1 AND acquistabile = 1 ORDER BY descrizione ASC\`,`

let ok = 0, skip = 0

for (const rel of files) {
  const fpath = join(base, rel)
  let src = readFileSync(fpath, 'utf8')

  if (!src.includes(BAD_LINE)) { skip++; continue }

  src = src.replace(BAD_LINE, GOOD_LINE)
  writeFileSync(fpath, src, 'utf8')
  ok++
}

console.log('Fixed:', ok, '| Already ok:', skip)
