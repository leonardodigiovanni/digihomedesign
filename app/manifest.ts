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
        src: '/icons/DIGIHOMEDESIGN.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/DIGIHOMEDESIGN.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/images/opengraph/big_digi_tr.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  }
}
