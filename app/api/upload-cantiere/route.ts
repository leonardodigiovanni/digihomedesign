import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData    = await req.formData()
    const file        = formData.get('file') as File | null
    const cantiereId  = formData.get('cantiere_id') as string | null

    if (!file || !cantiereId) {
      return NextResponse.json({ error: 'File o cantiere_id mancante.' }, { status: 400 })
    }

    const ext      = path.extname(file.name).toLowerCase()
    const safe     = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${Date.now()}_${safe}`
    const dir      = path.join(process.cwd(), 'public', 'uploads', 'cantieri', cantiereId)

    await mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, filename), buffer)

    const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
    const tipo = videoExts.includes(ext) ? 'video' : 'foto'

    return NextResponse.json({ filename, tipo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
