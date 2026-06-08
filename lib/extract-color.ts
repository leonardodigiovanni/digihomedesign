import fs from 'fs/promises'
import path from 'path'

export async function extractAvgColor(fotoUrl: string): Promise<string | null> {
  if (!fotoUrl) return null
  try {
    const sharp = (await import('sharp')).default
    let buf: Buffer
    if (fotoUrl.startsWith('http://') || fotoUrl.startsWith('https://')) {
      const resp = await fetch(fotoUrl)
      if (!resp.ok) return null
      buf = Buffer.from(await resp.arrayBuffer())
    } else {
      const filePath = path.join(process.cwd(), 'public', fotoUrl.replace(/^\//, ''))
      buf = await fs.readFile(filePath)
    }
    const meta = await sharp(buf).metadata()
    const iw = meta.width  ?? 100
    const ih = meta.height ?? 100
    const cw = Math.max(1, Math.round(iw * 0.6))
    const ch = Math.max(1, Math.round(ih * 0.6))
    const cl = Math.round((iw - cw) / 2)
    const ct = Math.round((ih - ch) / 2)
    const stats = await sharp(buf)
      .extract({ left: cl, top: ct, width: cw, height: ch })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .toColorspace('srgb')
      .stats()
    const r = Math.round(stats.channels[0].mean).toString(16).padStart(2, '0')
    const g = Math.round(stats.channels[1].mean).toString(16).padStart(2, '0')
    const b = Math.round(stats.channels[2].mean).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  } catch {
    return null
  }
}
