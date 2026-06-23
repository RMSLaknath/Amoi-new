import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.20.10.4', '172.20.10.6', '172.20.10.*'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
