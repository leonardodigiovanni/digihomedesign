import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function CtaPreventivo() {
  const cookieStore = await cookies()
  const user = cookieStore.get('session_user')?.value ?? null
  const href = user ? '/area-clienti/preventivi' : '/aiuto/guida-preventivo'
  return (
    <Link href={href} className="cta-btn-metal" style={{ display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
      Calcola il tuo preventivo
    </Link>
  )
}
