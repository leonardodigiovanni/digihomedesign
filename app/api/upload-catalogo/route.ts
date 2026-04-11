import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'File mancante.' }, { status: 400 })

    const ext = path.extname(file.name).toLowerCase()
    if (ext !== '.pdf') return NextResponse.json({ error: 'Solo file PDF.' }, { status: 400 })

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${Date.now()}_${safe}`
    const dir = path.join(process.cwd(), 'public', 'uploads', 'cataloghi')

    await mkdir(dir, { recursive: true })

    const chunks: Buffer[] = []
    const reader = file.stream().getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(Buffer.from(value))
    }
    const buffer = Buffer.concat(chunks)

    await writeFile(path.join(dir, filename), buffer)

    return NextResponse.json({ filename })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
