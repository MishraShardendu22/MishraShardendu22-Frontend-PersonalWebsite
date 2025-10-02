import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy-utils'

export async function POST(req: NextRequest) {
  return proxyRequest(
    req,
    (pathname) => pathname.replace('/api/proxy/projects/updateOrder', '/api/projects/updateOrder'),
    {
      timeout: 90000,
      customHeaders: {
        'Content-Type': 'application/json',
      },
      responseType: 'text',
    }
  )
}
