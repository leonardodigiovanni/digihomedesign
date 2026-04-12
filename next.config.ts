import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    imageSizes: [69, 95, 128, 216, 256, 384],
  },
  allowedDevOrigins: ['192.168.1.37'],
};

export default nextConfig;
