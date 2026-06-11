import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File | null
    const taskId   = formData.get('task_id') as string | null

    if (!file || !taskId) {
      return NextResponse.json({ error: 'File o task_id mancante.' }, { status: 400 })
    }

    const ext      = path.extname(file.name).toLowerCase()
    const safe     = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filename = `${Date.now()}_${safe}`

    const blob = await put(`cantieri/tasks/${taskId}/${filename}`, file, { access: 'public' })

    const videoExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
    const tipo = videoExts.includes(ext) ? 'video' : 'foto'

    return NextResponse.json({ filename: blob.url, tipo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Errore upload.' }, { status: 500 })
  }
}
