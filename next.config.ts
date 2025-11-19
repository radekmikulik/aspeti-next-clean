import type { NextConfig } from "next";

// UPDATE(2025-11-19): Odebráno `output: "export"` kvůli dynamické route /account/offers/[id]/edit (Vercel build fix)
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
