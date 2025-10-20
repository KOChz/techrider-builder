// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@supabase/ssr"],
  },
  webpack: (config, context) => {
    // Destructure after receiving the context object
    const { isServer } = context;

    if (!isServer) {
      // Provide fallbacks for browser environment
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          path: false,
          crypto: false,
        },
      };
    }

    return config;
  },
};

export default nextConfig;
