import { cookies } from 'next/headers'
import Link from 'next/link'
import { readSettings } from '@/lib/settings'

export default async function CtaPreventivo() {
  const cookieStore = await cookies()
  const role = cookieStore.get('session_role')?.value ?? ''
  const user = cookieStore.get('session_user')?.value ?? null
  const isStaff = role === 'admin' || role === 'dipendente' || role === 'direttore'
  if (!isStaff) {
    const { rolePermissions } = await readSettings()
    if (!(rolePermissions['cliente'] ?? []).includes(52)) return null
  }
  const href = user ? '/area-clienti/preventivi' : '/aiuto/guida-preventivo'
  return (
    <Link href={href} className="btn-black fs-12" style={{ flex: 1, padding: '0 20px' }}>
      Calcola preventivo
    </Link>
  )
}
