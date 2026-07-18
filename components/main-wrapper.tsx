'use client'
import { usePathname } from 'next/navigation'

const STAFF_PREFIXES = ['/area-lavoro', '/clienti', '/amministrazione', '/disegno']
const STAFF_ROLES = ['admin', 'dipendente', 'venditore', 'magazzino', 'ragioniere', 'commercialista', 'direttore', 'marketing', 'email', 'operaio']
const CLIENT_WIDTH_PATHS = ['/clienti/preventivi/', '/area-clienti/carrello-preventivo', '/area-clienti/carrello-acquisti', '/area-clienti/carrello-computometrico']

export default function MainWrapper({ children, role }: { children: React.ReactNode; role: string }) {
  const pathname = usePathname()
  const isStaffRole = STAFF_ROLES.includes(role)
  const forceClientWidth = CLIENT_WIDTH_PATHS.some(p => pathname.startsWith(p))
  const isFullWidth =
    !forceClientWidth && (
      STAFF_PREFIXES.some(p => pathname.startsWith(p)) ||
      (pathname.startsWith('/area-clienti/') && isStaffRole)
    )
  return (
    <main
      className="main-layout"
      style={{ flex: 1, padding: '8px 8px', ...(!isFullWidth && { maxWidth: 720, margin: '0 auto', width: '100%' }) }}
    >
      {children}
    </main>
  )
}
