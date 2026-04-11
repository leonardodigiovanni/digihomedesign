import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const config = {
  api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'File mancante.' }, { status: 400 })

    const ext  = path.extname(file.name).toLowerCase()
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${Date.now()}_${safe}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'marketing')

    await mkdir(dir, { recursive: true })

    // Leggi tramite stream per evitare troncamenti con arrayBuffer()
    const chunks: Buffer[] = []
    const reader = file.stream().getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(Buffer.from(value))
    }
    const buffer = Buffer.concat(chunks)

    console.log(`[upload-marketing] ${file.name}: atteso=${file.size} bytes, ricevuto=${buffer.length} bytes`)

    await writeFile(path.join(dir, filename), buffer)

    const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
    const tipo = videoExts.includes(ext) ? 'video' : 'immagine'

    return NextResponse.json({ filename, tipo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
