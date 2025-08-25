import { NextRequest } from 'next/server'
import axios from 'axios'

const targets: string[] = [
  process.env.BACKEND_1!,
  process.env.BACKEND_2!,
  process.env.BACKEND_3!,
].filter(Boolean)

let index = 0

const unsafeHeaders = new Set([
  'host',
  'connection',
  'cookie',
  'pragma',
  'referer',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-port',
  'x-forwarded-proto',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-dest',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'user-agent',
])

export async function GET(req: NextRequest, context: any) {
  const { id } = context.params
  return proxy(req, id)
}

export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params
  return proxy(req, id)
}

export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params
  return proxy(req, id)
}

async function proxy(req: NextRequest, id: string) {
  if (targets.length === 0) {
    return new Response(JSON.stringify({ error: 'No backend targets configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const target = targets[index++ % targets.length]
  const reqUrl = new URL(req.url)
  const backendUrl = `${target}/api/volunteer/experiences/${id}${reqUrl.search}`

  const headers: Record<string, string> = {}
  for (const [k, v] of req.headers.entries()) {
    if (!unsafeHeaders.has(k.toLowerCase())) {
      headers[k] = v
    }
  }

  const method = req.method || 'GET'
  const body = method !== 'GET' && method !== 'HEAD' ? await req.text() : undefined

  try {
    const axiosRes = await axios.request({
      method,
      url: backendUrl,
      headers,
      data: body,
      responseType: 'arraybuffer',
      validateStatus: () => true,
    })

    const responseHeaders = new Headers()
    Object.entries(axiosRes.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        responseHeaders.set(key, value)
      } else if (Array.isArray(value)) {
        responseHeaders.set(key, value.join(', '))
      }
    })

    return new Response(axiosRes.data, {
      status: axiosRes.status,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(JSON.stringify({ error: 'Backend unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
