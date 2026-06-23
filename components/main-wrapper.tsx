'use client'
import { usePathname } from 'next/navigation'

const STAFF_PREFIXES = ['/area-lavoro', '/clienti', '/amministrazione', '/disegno']
const STAFF_ROLES = ['admin', 'dipendente', 'venditore', 'magazzino', 'ragioniere', 'commercialista', 'direttore', 'marketing', 'email', 'operaio']

export default function MainWrapper({ children, role }: { children: React.ReactNode; role: string }) {
  const pathname = usePathname()
  const isStaffRole = STAFF_ROLES.includes(role)
  const isFullWidth =
    STAFF_PREFIXES.some(p => pathname.startsWith(p)) ||
    (pathname.startsWith('/area-clienti/') && isStaffRole)
  return (
    <main
      className="main-layout class_silver_D_safe"
      style={{ flex: 1, padding: '8px 8px', ...(!isFullWidth && { maxWidth: 720, margin: '0 auto', width: '100%' }) }}
    >
      {children}
    </main>
  )
}
