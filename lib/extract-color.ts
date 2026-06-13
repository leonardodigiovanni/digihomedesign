import fs from 'fs/promises'
import path from 'path'

export function colorFromDesc(desc: string): string | null {
  const d = (desc ?? '').toLowerCase()
  if (d.includes('nero') || d.includes('black') || d.includes('9005') || d.includes('schwar'))  return '#1c1c1c'
  if (d.includes('antracite') || d.includes('anthracite') || d.includes('7016') || d.includes('grafite')) return '#3e3e3e'
  if (d.includes('grigio') || d.includes('grey') || d.includes('gray') || d.includes('7015') || d.includes('7040')) return '#5a5c60'
  if (d.includes('noce') || d.includes('rovere') || d.includes('legno') || d.includes('wood') || d.includes('walnut') || d.includes('oak')) return '#7b4f2e'
  if (d.includes('bronzo') || d.includes('bronze'))                           return '#8a6424'
  if (d.includes('oro') || d.includes('gold') || d.includes('champagne') || d.includes('dorat')) return '#c0a040'
  if (d.includes('blu') || d.includes('blue') || d.includes('azzur'))         return '#2a4a8c'
  if (d.includes('verde') || d.includes('green'))                             return '#2a6a3a'
  if (d.includes('bianco') || d.includes('white') || d.includes('weiss') || d.includes('weiß') || d.includes('9010') || d.includes('9016')) return '#d0ccc4'
  return null
}

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
