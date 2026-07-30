import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'
import { mappaOccorrenzeBlob } from '@/lib/blob-usage'
import { LISTINI_FILE_LOCALI } from '@/lib/listini-file-locali'

export async function GET() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const settings = await readSettings()
  if (!hasPageAccess(role, 25, settings))
    return NextResponse.json({ error: 'Non autorizzato.' }, { status: 403 })

  // Riusa la stessa mappa occorrenze dei blob: raggruppa i valori di foto_url/schema_url/
  // logo_url indipendentemente dal fatto che siano URL Vercel Blob o path locali /listini/*.
  const occorrenze = await mappaOccorrenzeBlob('listini/')
  return NextResponse.json({
    blobs: LISTINI_FILE_LOCALI.map(url => ({
      url,
      nome: url.split('/').pop() ?? url,
      occorrenze: occorrenze.get(url) ?? 0,
    })),
  })
}
