'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AccediBtn() {
  const pathname = usePathname()
  if (pathname === '/app/login') return null
  return <Link href="/app/login" className="btn-black-app">Accedi</Link>
}
