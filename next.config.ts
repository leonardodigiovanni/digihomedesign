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
      { source: '/serramenti/imbotti', destination: '/riqualificazione-energetica/monoblocchi', permanent: true },
      { source: '/metallurgia/porte-blindate', destination: '/metallurgia/porte-blindate-legno', permanent: true },
      { source: '/serramenti/infissi-in-alluminio', destination: '/serramenti/infissi-in-alluminio-taglio-termico', permanent: true },
      { source: '/serramenti/tapparelle-manuali', destination: '/serramenti/tapparelle-in-alluminio', permanent: true },
      { source: '/serramenti/tapparelle-motorizzate', destination: '/serramenti/tapparelle-motorizzazione', permanent: true },
      // Cataloghi uscito da sotto "Chi Siamo": URL pubblico ora è /cataloghi. I redirect
      // vengono valutati prima dei rewrite, quindi questo vince sul rewrite generico
      // /chi-siamo/:path* qui sotto.
      { source: '/chi-siamo/cataloghi', destination: '/cataloghi', permanent: true },
      { source: '/chi-siamo/cataloghi/:path*', destination: '/cataloghi/:path*', permanent: true },
      // Bonifica pagine doppie in nav (2026-08-11): l'url di ogni pagina ora riflette
      // sempre la voce di nav "attuale" (principale + secondaria) da cui è raggiunta,
      // non più la categoria d'origine storica — vedi
      // docs/2026-08-11-21-50-bonifica-pagine-doppie-nav.md e il suo seguito.
      // Vecchio url in redirect permanente, cartella fisica invariata (vedi rewrite
      // sotto), stesso pattern di /chi-siamo ↔ app/brand.
      { source: '/serramenti/infissi-in-pvc', destination: '/riqualificazione-energetica/infissi-in-pvc', permanent: true },
      { source: '/serramenti/persiane-in-alluminio', destination: '/riqualificazione-energetica/persiane-in-alluminio', permanent: true },
      { source: '/serramenti/monoblocchi', destination: '/riqualificazione-energetica/monoblocchi', permanent: true },
      { source: '/legno/infissi-in-legno', destination: '/riqualificazione-energetica/infissi-in-legno', permanent: true },
      { source: '/serramenti/infissi-in-alluminio-taglio-termico', destination: '/riqualificazione-energetica/infissi-in-alluminio-taglio-termico', permanent: true },
      { source: '/serramenti/infissi-in-legno-alluminio', destination: '/riqualificazione-energetica/infissi-in-legno-alluminio', permanent: true },
      { source: '/serramenti/persiane-in-pvc', destination: '/riqualificazione-energetica/persiane-in-pvc', permanent: true },
      { source: '/serramenti/cassonetti-in-pvc', destination: '/riqualificazione-energetica/cassonetti-in-pvc', permanent: true },
      { source: '/serramenti/tapparelle-in-alluminio', destination: '/riqualificazione-energetica/tapparelle-in-alluminio', permanent: true },
      { source: '/serramenti/tapparelle-in-pvc', destination: '/riqualificazione-energetica/tapparelle-in-pvc', permanent: true },
      { source: '/serramenti/vetrate-panoramiche', destination: '/comfort-e-spazi-esterni/vetrate-panoramiche', permanent: true },
      { source: '/serramenti/pergole-bioclimatiche', destination: '/comfort-e-spazi-esterni/pergole-bioclimatiche', permanent: true },
      { source: '/serramenti/verande-in-alluminio', destination: '/comfort-e-spazi-esterni/verande-in-alluminio', permanent: true },
      { source: '/serramenti/verande-in-pvc', destination: '/comfort-e-spazi-esterni/verande-in-pvc', permanent: true },
      { source: '/serramenti/zanzariere', destination: '/comfort-e-spazi-esterni/zanzariere', permanent: true },
      { source: '/edilizia/piscine', destination: '/comfort-e-spazi-esterni/piscine', permanent: true },
      { source: '/edilizia/solarium', destination: '/comfort-e-spazi-esterni/solarium', permanent: true },
      { source: '/metallurgia/porte-blindate-legno', destination: '/antintrusione-e-sicurezza/porte-blindate-legno', permanent: true },
      { source: '/metallurgia/porte-blindate-alluminio', destination: '/antintrusione-e-sicurezza/porte-blindate-alluminio', permanent: true },
      { source: '/metallurgia/porte-blindate-pvc', destination: '/antintrusione-e-sicurezza/porte-blindate-pvc', permanent: true },
      { source: '/metallurgia/grate', destination: '/antintrusione-e-sicurezza/grate', permanent: true },
      { source: '/metallurgia/cancelli', destination: '/antintrusione-e-sicurezza/cancelli', permanent: true },
      { source: '/metallurgia/scale-a-rampe', destination: '/carpenteria-arredo/scale-a-rampe', permanent: true },
      { source: '/metallurgia/scale-a-chiocciola', destination: '/carpenteria-arredo/scale-a-chiocciola', permanent: true },
      { source: '/metallurgia/ringhiere', destination: '/carpenteria-arredo/ringhiere', permanent: true },
      { source: '/metallurgia/balconi', destination: '/carpenteria-arredo/balconi', permanent: true },
      // Mobili spostato da segnaposto sotto Ristrutturazioni Chiavi in Mano a pagina vera
      // sotto Legno (2026-08-12): qui la cartella fisica si sposta davvero, non serve un
      // rewrite gemello come sopra.
      { source: '/ristrutturazioni-chiavi-in-mano/mobili', destination: '/legno/mobili-su-misura', permanent: true },
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
      // Bonifica pagine doppie in nav (2026-08-11): stesso principio di /chi-siamo ↔ app/brand,
      // vedi commento sul redirect gemello qui sopra.
      { source: '/riqualificazione-energetica/infissi-in-pvc', destination: '/serramenti/infissi-in-pvc' },
      { source: '/riqualificazione-energetica/persiane-in-alluminio', destination: '/serramenti/persiane-in-alluminio' },
      { source: '/riqualificazione-energetica/monoblocchi', destination: '/serramenti/monoblocchi' },
      { source: '/riqualificazione-energetica/infissi-in-legno', destination: '/legno/infissi-in-legno' },
      { source: '/riqualificazione-energetica/infissi-in-alluminio-taglio-termico', destination: '/serramenti/infissi-in-alluminio-taglio-termico' },
      { source: '/riqualificazione-energetica/infissi-in-legno-alluminio', destination: '/serramenti/infissi-in-legno-alluminio' },
      { source: '/riqualificazione-energetica/persiane-in-pvc', destination: '/serramenti/persiane-in-pvc' },
      { source: '/riqualificazione-energetica/cassonetti-in-pvc', destination: '/serramenti/cassonetti-in-pvc' },
      { source: '/riqualificazione-energetica/tapparelle-in-alluminio', destination: '/serramenti/tapparelle-in-alluminio' },
      { source: '/riqualificazione-energetica/tapparelle-in-pvc', destination: '/serramenti/tapparelle-in-pvc' },
      { source: '/comfort-e-spazi-esterni/vetrate-panoramiche', destination: '/serramenti/vetrate-panoramiche' },
      { source: '/comfort-e-spazi-esterni/pergole-bioclimatiche', destination: '/serramenti/pergole-bioclimatiche' },
      { source: '/comfort-e-spazi-esterni/verande-in-alluminio', destination: '/serramenti/verande-in-alluminio' },
      { source: '/comfort-e-spazi-esterni/verande-in-pvc', destination: '/serramenti/verande-in-pvc' },
      { source: '/comfort-e-spazi-esterni/zanzariere', destination: '/serramenti/zanzariere' },
      { source: '/comfort-e-spazi-esterni/piscine', destination: '/edilizia/piscine' },
      { source: '/comfort-e-spazi-esterni/solarium', destination: '/edilizia/solarium' },
      { source: '/antintrusione-e-sicurezza/porte-blindate-legno', destination: '/metallurgia/porte-blindate-legno' },
      { source: '/antintrusione-e-sicurezza/porte-blindate-alluminio', destination: '/metallurgia/porte-blindate-alluminio' },
      { source: '/antintrusione-e-sicurezza/porte-blindate-pvc', destination: '/metallurgia/porte-blindate-pvc' },
      { source: '/antintrusione-e-sicurezza/grate', destination: '/metallurgia/grate' },
      { source: '/antintrusione-e-sicurezza/cancelli', destination: '/metallurgia/cancelli' },
      { source: '/carpenteria-arredo/scale-a-rampe', destination: '/metallurgia/scale-a-rampe' },
      { source: '/carpenteria-arredo/scale-a-chiocciola', destination: '/metallurgia/scale-a-chiocciola' },
      { source: '/carpenteria-arredo/ringhiere', destination: '/metallurgia/ringhiere' },
      { source: '/carpenteria-arredo/balconi', destination: '/metallurgia/balconi' },
    ]
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
};

export default nextConfig;
