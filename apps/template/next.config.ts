import type { NextConfig } from 'next'

import { IMAGE_DEVICE_SIZES, IMAGE_SMALL_SIZES } from '../../config/image-device-sizes'

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Keep template builds warm when they are validated from a linked worktree.
    turbopackFileSystemCacheForBuild: true,
    turbopackSeedCacheFromWorktree: true,
  },
  images: {
    // Keep responsive image selection from skipping the useful 1,440px and
    // 2,560px candidates on high-density displays.
    deviceSizes: [...IMAGE_DEVICE_SIZES],
    imageSizes: [...IMAGE_SMALL_SIZES],
  },
}

export default nextConfig
