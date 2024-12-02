import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "https",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
