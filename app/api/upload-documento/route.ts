import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'File mancante.' }, { status: 400 })

    const safe     = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${Date.now()}_${safe}`
    const dir      = path.join(process.cwd(), 'public', 'uploads', 'documenti')

    await mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, filename), buffer)

    return NextResponse.json({ filename })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
