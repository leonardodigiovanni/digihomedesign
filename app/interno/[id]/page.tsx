import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { internalPages } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'
import { hasPageAccess } from '@/lib/permissions'

export default async function PaginaInterna({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const page = internalPages.find(p => p.id === Number(id))
  if (!page) notFound()

  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  if (!role) redirect('/')

  const settings = readSettings()
  if (!hasPageAccess(role, page.id, settings)) redirect('/')

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{page.label}</h2>
      <p style={{ color: '#888', fontSize: 14 }}>Pagina {page.id} — contenuto in costruzione.</p>
    </div>
  )
}
