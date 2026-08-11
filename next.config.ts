import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  turbopack: {},
  serverExternalPackages: ['sharp', 'mysql2', 'pdfjs-dist', 'canvas'],
  outputFileTracingExcludes: {
    '*': [
      './public/**',
    ],
  },
  images: {
    imageSizes: [69, 95, 128, 216, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1366, 1536, 1680, 1920],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/vi/**' },
    ],
  },
  // Wildcard sull'ultimo ottetto invece di un IP fisso: il telefono di test cambia IP
  // ad ogni rinnovo DHCP (era .37, poi .38, poi .39...) e ribloccava l'accesso dev da LAN
  // ogni volta. Il matcher di Next.js (isCsrfOriginAllowed) spezza sui punti e tratta '*'
  // come singolo segmento jolly — funziona anche sugli IPv4, non solo sui domini DNS.
  allowedDevOrigins: ['192.168.1.*'],
  async redirects() {
    return [
      // Host canonico: senza questo, il sito è raggiungibile identico su due
      // hostname (con e senza www). Le pagine HTML se la cavano col canonical
      // in <head>, ma i file statici in public/ (PDF, immagini...) non hanno un
      // <head> — restano duplicati senza segnale, da qui i redirect sono
      // valutati prima del filesystem/public (vedi next/dist/docs redirects.md),
      // quindi coprono anche quelli.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'digi-home-design.com' }],
        destination: 'https://www.digi-home-design.com/:path*',
        permanent: true,
      },
      { source: '/porte-corazzate', destination: '/porte-blindate', permanent: true },
      { source: '/serramenti/imbotti', destination: '/serramenti/monoblocchi', permanent: true },
      { source: '/metallurgia/porte-blindate', destination: '/metallurgia/porte-blindate-legno', permanent: true },
      { source: '/serramenti/infissi-in-alluminio', destination: '/serramenti/infissi-in-alluminio-taglio-termico', permanent: true },
      { source: '/serramenti/tapparelle-manuali', destination: '/serramenti/tapparelle-in-alluminio', permanent: true },
      { source: '/serramenti/tapparelle-motorizzate', destination: '/serramenti/tapparelle-motorizzazione', permanent: true },
      // Cataloghi uscito da sotto "Chi Siamo": URL pubblico ora è /cataloghi. I redirect
      // vengono valutati prima dei rewrite, quindi questo vince sul rewrite generico
      // /chi-siamo/:path* qui sotto.
      { source: '/chi-siamo/cataloghi', destination: '/cataloghi', permanent: true },
      { source: '/chi-siamo/cataloghi/:path*', destination: '/cataloghi/:path*', permanent: true },
    ]
  },
  // "brand" resta il nome della cartella sotto app/ (nessuna modifica ai file/import
  // interni, zero rischio per i ~130 file che dipendono da app/brand/cataloghi), ma
  // in giro per il sito le pagine vanno raggiunte con l'URL pubblico /chi-siamo
  // (eccetto cataloghi, che ha un proprio prefisso pubblico /cataloghi — vedi redirect sopra).
  async rewrites() {
    return [
      { source: '/chi-siamo', destination: '/brand' },
      { source: '/chi-siamo/:path*', destination: '/brand/:path*' },
      { source: '/cataloghi', destination: '/brand/cataloghi' },
      { source: '/cataloghi/:path*', destination: '/brand/cataloghi/:path*' },
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
};

export default nextConfig;
