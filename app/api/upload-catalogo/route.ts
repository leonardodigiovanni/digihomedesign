import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
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

    const blob = await put(`cataloghi/${filename}`, file, { access: 'public' })

    return NextResponse.json({ filename: blob.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
