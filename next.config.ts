import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://103.74.92.81:8000/:path*',
      },
    ]
  },
};

export default nextConfig;
