import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DIGI Home Design',
    short_name: 'DIGI',
    description: 'Infissi, Verande, Ristrutturazioni e Sicurezza a Palermo',
    start_url: '/app',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1c1c1c',
    orientation: 'portrait',
    categories: ['business', 'shopping'],
    icons: [
      {
        src: '/images/icons/DIGI-HOME-DESIGN-APP.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/images/icons/DIGI-HOME-DESIGN-APP.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  }
}
