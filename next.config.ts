import type { NextConfig } from 'next'
import { withMicrofrontends } from '@vercel/microfrontends/next/config'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    proxyTimeout: 120000,
  },
  serverRuntimeConfig: {
    maxDuration: 120,
  },
}

export default withMicrofrontends(nextConfig)
