import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['t59vul7r5s.ufs.sh'],
  },
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ This is the key addition
  },
};

export default nextConfig;
