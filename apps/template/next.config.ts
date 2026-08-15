import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
