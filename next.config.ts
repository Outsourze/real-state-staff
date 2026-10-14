import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photographs are pre-optimized WebP assets; keep them independent of a paid
  // Cloudflare Images binding when deploying this project to Workers.
  images: { unoptimized: true },
};

export default nextConfig;
