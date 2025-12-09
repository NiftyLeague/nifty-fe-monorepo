import type { NextConfig } from 'next';

const nextConfig: NextConfig = { typescript: { ignoreBuildErrors: true }, transpilePackages: ['@nl/ui'] };

export default nextConfig;
