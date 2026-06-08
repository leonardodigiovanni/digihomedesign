import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import StampaClient from '@/app/area-clienti/preventivi/[id]/stampa/stampa-client'
import { loadData } from '@/app/area-clienti/preventivi/[id]/stampa/page'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Stampa Preventivo' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const role     = cookieStore.get('session_role')?.value ?? ''
  const username = cookieStore.get('session_user')?.value ?? ''
  if (!username) redirect('/app/login')

  const { id } = await params
  const prevId  = parseInt(id)
  if (isNaN(prevId)) redirect('/app/preventivo')

  const isStaff    = role === 'admin' || role === 'dipendente'
  const stampaData = await loadData(prevId, username, isStaff)
  if (!stampaData) redirect('/app/preventivo')

  return <StampaClient data={stampaData} />
}
