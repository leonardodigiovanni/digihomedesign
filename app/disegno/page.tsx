import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DisegnoClient from './disegno-client'

export const metadata: Metadata = { title: 'Editor Disegno' }

export default async function Page() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (role !== 'admin') redirect('/')
  return <DisegnoClient />
}
