import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DatabaseClient from './database-client'
import ShortcutStar from '@/components/shortcut-star'

export const metadata: Metadata = {
  title: 'Database',
}

export default async function Page() {
  const cookieStore = await cookies()
  if (cookieStore.get('session_role')?.value !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Database<ShortcutStar href="/amministrazione/database" small /></h2>
      <DatabaseClient />
    </div>
  )
}
