/** @type {import('next').NextConfig} */

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Or better yet:
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias["@"] = path.join(process.cwd(), "src");
    return config;
  },
};

module.exports = nextConfig;
