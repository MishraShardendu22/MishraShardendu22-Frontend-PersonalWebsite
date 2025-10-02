import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy-utils'

export async function POST(req: NextRequest) {
  return proxyRequest(
    req,
    (pathname) => pathname.replace('/api/proxy/admin/auth', '/api/admin/auth'),
    {
      customHeaders: {
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    }
  )
}
