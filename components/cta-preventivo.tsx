import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function CtaPreventivo() {
  const cookieStore = await cookies()
  const user = cookieStore.get('session_user')?.value ?? null
  const href = user ? '/area-clienti/preventivi' : '/aiuto/guida-preventivo'
  return (
    <Link href={href} className="btn-black fs-12" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 42, padding: '0 20px', borderRadius: 21, textDecoration: 'none', fontFamily: 'monospace' }}>
      Calcola preventivo
    </Link>
  )
}
