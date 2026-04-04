import { cookies } from 'next/headers'
import Link from 'next/link'
import { clientPages } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'
import HeroCarousel from '@/components/hero-carousel'

export default async function Page() {
  const cookieStore = await cookies()
  const username = cookieStore.get('session_user')?.value
  const { disabledPages } = readSettings()
  const visiblePages = clientPages.filter(p => !disabledPages.includes(p.id))

  return (
    <>
      <HeroCarousel />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'center',
      }}>
        {visiblePages.map((page, i) => (
          <Link key={page.id} href={page.href} className="page-card" style={{ flex: '1 1 260px', maxWidth: 400 }}>
            <img
              src={`/images/casa-ristrutturata-${(i % 8) + 1}.jpg`}
              alt={page.label}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div style={{ padding: '14px 16px' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                {page.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
