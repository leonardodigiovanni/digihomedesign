import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { clientPages } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const page = clientPages.find(p => p.id === Number(id))
  return { title: page?.label ?? 'Pagina' }
}

export default async function PaginaCliente({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const page = clientPages.find(p => p.id === Number(id))
  if (!page) notFound()

  const { disabledPages } = readSettings()
  if (disabledPages.includes(page.id)) notFound()

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>{page.label}</h2>
      <p style={{ color: '#888', fontSize: 14 }}>Pagina {page.id} — contenuto in costruzione.</p>
    </div>
  )
}
