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

    const blob = await put(`cataloghi/${safe}`, file, { access: 'public', addRandomSuffix: false })

    return NextResponse.json({ filename: blob.url })
  } catch (e) {
    console.error(e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: `Errore upload: ${msg}` }, { status: 500 })
  }
}
