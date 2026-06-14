'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AccediBtn() {
  const pathname = usePathname()
  if (pathname === '/app/login') return null
  return (
    <Link href="/app/login" style={{
      background: 'none',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: 20,
      color: '#fff',
      fontSize: 12,
      height: 50,
      padding: '0 14px',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
      textDecoration: 'none',
    }}>Accedi</Link>
  )
}
