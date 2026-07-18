import { cookies } from 'next/headers'
import { recordVisit, recordDwell, type VisitBucket } from '@/lib/page-visits-db'

type TrackPayload = {
  href: string
  event: 'visit' | 'dwell'
  minutes?: number
}

export async function POST(request: Request) {
  // sendBeacon manda il body come testo/Blob, non sempre con
  // Content-Type: application/json — leggiamo come testo e parsiamo a mano
  // invece di affidarci a request.json().
  let payload: TrackPayload
  try {
    payload = JSON.parse(await request.text())
  } catch {
    return new Response(null, { status: 204 })
  }

  const href = typeof payload.href === 'string' ? payload.href.slice(0, 255) : ''
  if (!href) return new Response(null, { status: 204 })

  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role === 'dipendente' || role === 'admin') return new Response(null, { status: 204 })

  const bucket: VisitBucket = role === 'cliente' ? 'cliente' : 'sloggato'

  if (payload.event === 'visit') {
    await recordVisit(href, bucket)
  } else if (payload.event === 'dwell') {
    const minutes = Number(payload.minutes) || 0
    await recordDwell(href, bucket, minutes)
  }

  return new Response(null, { status: 204 })
}
