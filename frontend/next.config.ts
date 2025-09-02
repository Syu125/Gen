import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/sign-up/:path*',
        destination: 'http://localhost:5000/api/sign-up/:path*', // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;
