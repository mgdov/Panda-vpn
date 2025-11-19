import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация для production деплоя
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  async rewrites() {
    // В production используем переменную окружения, в dev - хардкод
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://103.74.92.81:8000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;
