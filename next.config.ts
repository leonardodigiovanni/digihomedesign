import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  turbopack: {},
  serverExternalPackages: ['sharp', 'mysql2', 'pdfjs-dist', 'canvas'],
  outputFileTracingExcludes: {
    '*': [
      './public/**',
      './node_modules/@img/**',
      './node_modules/sharp/build/**',
    ],
  },
  images: {
    imageSizes: [69, 95, 128, 216, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
  allowedDevOrigins: ['192.168.1.38'],
  async redirects() {
    return [
      { source: '/porte-corazzate', destination: '/porte-blindate', permanent: true },
    ]
  },
  // "brand" resta il nome della cartella sotto app/ (nessuna modifica ai file/import
  // interni, zero rischio per i ~130 file che dipendono da app/brand/cataloghi), ma
  // in giro per il sito le pagine vanno raggiunte con l'URL pubblico /chi-siamo.
  async rewrites() {
    return [
      { source: '/chi-siamo', destination: '/brand' },
      { source: '/chi-siamo/:path*', destination: '/brand/:path*' },
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
};

export default nextConfig;
