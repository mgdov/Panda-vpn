import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация для production деплоя
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  
  async rewrites() {
    // В production используем переменную окружения
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://vpn-p.ru';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
};

export default nextConfig;
