import { NextRequest } from 'next/server'
import axios from 'axios'

const targets = [
  process.env.BACKEND_1 as string,
  process.env.BACKEND_2 as string,
  process.env.BACKEND_3 as string,
].filter(Boolean)

let index = 0

export async function POST(req: NextRequest) {
  return proxy(req)
}

async function proxy(req: NextRequest) {
  if (targets.length === 0) {
    return new Response(JSON.stringify({ error: 'No backend targets configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const target = targets[index]
  index = (index + 1) % targets.length

  const url = new URL(req.url)
  const fullUrl = target + url.pathname.replace('/api/proxy/admin/auth', '/api/admin/auth') + url.search

  const method = req.method || 'POST'
  const headers: Record<string, string> = {}
  for (const [k, v] of req.headers.entries()) {
    if (![
      'host','connection','cookie','pragma','referer','x-forwarded-for','x-forwarded-host','x-forwarded-port','x-forwarded-proto','sec-fetch-site','sec-fetch-mode','sec-fetch-dest','sec-ch-ua','sec-ch-ua-mobile','sec-ch-ua-platform','user-agent',
    ].includes(k.toLowerCase())) {
      headers[k] = v
    }
  }
  const body = await req.text()

  // Debug logging
  console.log('[Admin Auth Proxy] Forwarding request:', {
    method,
    fullUrl,
    headers,
    body,
  })

  try {
    const axiosRes = await axios.request({
      method,
      url: fullUrl,
      headers,
      data: body,
      responseType: 'text',
      validateStatus: () => true,
    })

    // Debug response
    console.log('[Admin Auth Proxy] Backend response:', {
      status: axiosRes.status,
      data: axiosRes.data,
      headers: axiosRes.headers,
    })

    return new Response(axiosRes.data, {
      status: axiosRes.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (err: any) {
    console.error('[Admin Auth Proxy error]', err)
    return new Response(
      JSON.stringify({ 
        error: 'Backend unreachable', 
        detail: err?.message || String(err) 
      }), 
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
