import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stampa Preventivo' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  if (!cookieStore.get('session_user')?.value) redirect('/app/login')

  const { id } = await params
  const prevId = parseInt(id)
  if (isNaN(prevId)) redirect('/app/preventivo')

  redirect(`/area-clienti/preventivi/${prevId}/stampa`)
}
