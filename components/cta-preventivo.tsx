import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function CtaPreventivo() {
  const cookieStore = await cookies()
  const user = cookieStore.get('session_user')?.value ?? null
  const href = user ? '/area-clienti/preventivi' : '/aiuto/guida-preventivo'
  return (
    <Link href={href} className="btn-black fs-12" style={{ flex: 1, padding: '0 20px' }}>
      Calcola preventivo
    </Link>
  )
}
