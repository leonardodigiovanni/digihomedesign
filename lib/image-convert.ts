import sharp from 'sharp'

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp'])

export function isConvertibleImageExt(ext: string): boolean {
  return IMAGE_EXTS.has(ext.toLowerCase().replace(/^\./, ''))
}

// file.arrayBuffer() tronca i binari in questa versione di Next.js (vedi feedback
// memory) — si legge sempre via stream + Buffer.concat.
async function readFileBuffer(file: File): Promise<Buffer> {
  const reader = file.stream().getReader()
  const chunks: Uint8Array[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks.map(c => Buffer.from(c)))
}

/** Converte un'immagine (jpg/png/webp incollata o caricata) in WebP prima di
 * salvarla su Blob: il copia-incolla da clipboard produce quasi sempre PNG
 * pesanti indipendentemente dalla sorgente — meglio comprimere qui una volta
 * sola che affidarsi a next/image (che alleggerisce solo in fase di richiesta,
 * lasciando comunque l'originale pesante su storage). GIF esclusi (animazioni). */
export async function toWebpFile(file: File, opts?: { maxDim?: number; quality?: number }): Promise<File> {
  const buffer = await readFileBuffer(file)
  const webpBuffer = await sharp(buffer)
    .resize({
      width: opts?.maxDim ?? 2000,
      height: opts?.maxDim ?? 2000,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: opts?.quality ?? 82 })
    .toBuffer()
  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([new Uint8Array(webpBuffer)], `${baseName}.webp`, { type: 'image/webp' })
}
