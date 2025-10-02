import { NextRequest } from 'next/server'
import axios from 'axios'

const targets = [
  process.env.BACKEND_1 as string,
  process.env.BACKEND_2 as string,
  process.env.BACKEND_3 as string,
]

let index = 0

export async function POST(req: NextRequest) {
  const target = targets[index]
  index = (index + 1) % targets.length

  try {
    const body = await req.text()
    const headers = Object.fromEntries(req.headers.entries())

    // Clean up unsafe headers
    const unsafeHeaders = [
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
    ]

    unsafeHeaders.forEach((h) => delete headers[h.toLowerCase()])

    // Forward POST request to backend updateOrder endpoint
    const backendUrl = `${target}/api/projects/updateOrder`

    console.log(`Forwarding updateOrder request to: ${backendUrl}`)

    const axiosRes = await axios.post(backendUrl, body, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // Increase timeout to 30 seconds for bulk updates
      validateStatus: () => true,
    })

    console.log(`Backend responded with status: ${axiosRes.status}`)

    // Forward response headers
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
      headers: responseHeaders,
    })
  } catch (error: any) {
    console.error('UpdateOrder proxy error:', error.message)

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return new Response(
        JSON.stringify({
          error: 'Request timeout',
          message:
            'The update operation took too long. Please try again with fewer items or check your connection.',
        }),
        {
          status: 408,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (error.code === 'ECONNREFUSED') {
      return new Response(
        JSON.stringify({
          error: 'Backend unavailable',
          message: 'Unable to connect to the backend service. Please try again later.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        error: 'Backend error',
        message: error.message || 'An unexpected error occurred while updating project order.',
      }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
