import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
  // Increase timeouts for API routes
  experimental: {
    // Increase the timeout for serverless functions
    proxyTimeout: 120000, // 2 minutes
  },
  // Configure HTTP server settings
  serverRuntimeConfig: {
    // Increase timeout for server requests
    maxDuration: 120, // 2 minutes
  },
}

export default nextConfig
