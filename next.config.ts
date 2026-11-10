import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "genshin.jmp.blue",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "genshin-impact.fandom.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fandom.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
