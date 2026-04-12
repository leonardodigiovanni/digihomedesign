import type { Metadata } from 'next'
import { preload } from 'react-dom'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { clientPages } from '@/lib/nav-config'
import { readSettings } from '@/lib/settings'
import HeroCarousel from '@/components/hero-carousel'

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Page() {
  // Preload dell'immagine LCP (prima slide del carousel) dal server component
  preload('/images/casa-ristrutturata-1.jpg', { as: 'image', fetchPriority: 'high' })

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
            <div style={{ position: 'relative', height: 220, width: '100%' }}>
              <Image
                fill
                src={`/images/casa-ristrutturata-${(i % 8) + 1}.jpg`}
                alt={page.label}
                sizes="(max-width: 640px) calc(100vw - 40px), 400px"
                style={{ objectFit: 'cover' }}
              />
            </div>
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
