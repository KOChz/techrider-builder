// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable SWC minification temporarily to debug
  swcMinify: false,

  // Ensure Edge Runtime compatibility
  experimental: {
    // Remove the serverComponentsExternalPackages for now
    // as it might be causing the issue
  },

  // Add source maps for better error tracking
  productionBrowserSourceMaps: true,

  // Disable static optimization for debugging
  output: "standalone",
};

export default nextConfig;
