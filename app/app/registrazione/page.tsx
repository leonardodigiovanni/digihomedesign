import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { readSettings } from '@/lib/settings'
import AppRegistrationFlow from './app-registration-flow'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Registrazione' }

export default async function Page({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const cookieStore = await cookies()
  if (cookieStore.get('session_user')?.value) redirect('/app')

  const { registrazioniDisabilitate } = await readSettings()
  if (registrazioniDisabilitate) redirect('/app')

  const { from } = await searchParams
  const redirectTo = from && from.startsWith('/') ? from : '/app'

  return (
    <div style={{ marginLeft: 3, marginRight: 3, paddingBottom: 80 }}>
      <AppRegistrationFlow redirectTo={redirectTo} />
    </div>
  )
}
