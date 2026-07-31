import Image from 'next/image'
import PartnerForm from '@/components/partner-form'

const LOGO_PARTNERS = [
  { src: '/images/brand/partners/edilsider.webp', alt: 'Edilsider', href: '#' },
]

export default function PartnersBlock() {
  return (
    <div className="class_silver_D_safe" style={{ borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <h2 className="testo-articoli" style={{ textAlign: 'center', margin: 0 }}>
        Scegliamo Partners con cura
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
        {LOGO_PARTNERS.map(m => (
          <a key={m.alt} href={m.href} target={m.href !== '#' ? '_blank' : undefined} rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', height: 44, border: '1px solid #e0e0e0', borderRadius: 6, background: '#fff', flexShrink: 0 }}
          >
            <Image src={m.src} alt={m.alt} width={120} height={36} style={{ objectFit: 'contain' }} />
          </a>
        ))}
      </div>
      <PartnerForm />
    </div>
  )
}
