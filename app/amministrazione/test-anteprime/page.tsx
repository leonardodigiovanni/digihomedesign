import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import TestAnteprimeClient from './test-anteprime-client'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = { title: 'Test Anteprime' }

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Test Anteprime<ShortcutStar href="/amministrazione/test-anteprime" small /></h2>
      <TestAnteprimeClient />
    </div>
  )
}
