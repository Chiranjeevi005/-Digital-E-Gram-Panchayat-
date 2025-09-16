import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    // Add domains for external images if needed
    domains: [],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Enable compression
  compress: true,
  // Enable react strict mode
  reactStrictMode: true,
  // Turbopack configuration (remove webpack config when using Turbopack)
  // Note: Turbopack automatically handles tree shaking and optimization
};

export default nextConfig;