import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function CtaCantiere() {
  const cookieStore = await cookies()
  const user = cookieStore.get('session_user')?.value ?? null
  const href = user ? '/area-clienti/cantieri' : '/aiuto/guida-cantiere'
  return (
    <Link href={href} className="cta-btn-metal" style={{ display: 'block', width: '100%', textAlign: 'center', boxSizing: 'border-box' }}>
      Segui il tuo cantiere online
    </Link>
  )
}
