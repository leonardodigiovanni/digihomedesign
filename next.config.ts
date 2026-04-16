import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    imageSizes: [69, 95, 128, 216, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 31536000,
  },
  allowedDevOrigins: ['192.168.1.37'],
};

export default nextConfig;
