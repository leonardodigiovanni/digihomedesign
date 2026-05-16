import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['sharp', 'mysql2', 'pdfjs-dist', 'canvas'],
  outputFileTracingExcludes: {
    '*': [
      './node_modules/@img/sharp-darwin-x64/**',
      './node_modules/@img/sharp-darwin-arm64/**',
      './node_modules/@img/sharp-win32-ia32/**',
      './node_modules/@img/sharp-win32-x64/**',
    ],
  },
  images: {
    imageSizes: [69, 95, 128, 216, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
  allowedDevOrigins: ['192.168.1.37'],
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
};

export default nextConfig;
