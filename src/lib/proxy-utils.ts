import { NextRequest, NextResponse } from 'next/server'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// Common configuration for all proxy routes
const PROXY_TIMEOUT = 60000 // 60 seconds
const MAX_RETRIES = 2
const RETRY_DELAY = 1000

// Get backend targets from environment
const getBackendTargets = (): string[] => {
  return [process.env.BACKEND_1, process.env.BACKEND_2, process.env.BACKEND_3].filter(
    Boolean
  ) as string[]
}

// Round-robin index for load balancing
let globalIndex = 0

// Headers that should not be forwarded to backend
const UNSAFE_HEADERS = new Set([
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

// Configure axios instance with connection pooling and keep-alive
const createAxiosInstance = () => {
  return axios.create({
    timeout: PROXY_TIMEOUT,
    maxRedirects: 5,
    maxContentLength: 100 * 1024 * 1024, // 100MB for large requests
    validateStatus: () => true, // Accept all status codes
    // Add HTTP keep-alive support
    httpsAgent: undefined, // Will be set per request if needed
  })
}

// Clean headers for backend forwarding
const cleanHeaders = (headers: Headers): Record<string, string> => {
  const cleanedHeaders: Record<string, string> = {}

  headers.forEach((value, key) => {
    if (!UNSAFE_HEADERS.has(key.toLowerCase())) {
      cleanedHeaders[key] = value
    }
  })

  return cleanedHeaders
}

// Retry logic with exponential backoff
const retryRequest = async (config: AxiosRequestConfig, retryCount = 0): Promise<AxiosResponse> => {
  const axiosInstance = createAxiosInstance()

  try {
    return await axiosInstance.request(config)
  } catch (error: any) {
    const shouldRetry =
      retryCount < MAX_RETRIES &&
      (error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        (error.response?.status && error.response.status >= 500))

    if (shouldRetry) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount)
      console.warn(
        `[Proxy] Retrying request after ${delay}ms (${retryCount + 1}/${MAX_RETRIES}):`,
        {
          url: config.url,
          error: error.code || error.message,
        }
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
      return retryRequest(config, retryCount + 1)
    }

    throw error
  }
}

// Main proxy function
export const proxyRequest = async (
  req: NextRequest,
  pathMapping: (pathname: string) => string,
  options: {
    timeout?: number
    customHeaders?: Record<string, string>
    responseType?: 'text' | 'json' | 'arraybuffer'
  } = {}
): Promise<NextResponse> => {
  const startTime = Date.now()
  const targets = getBackendTargets()

  if (targets.length === 0) {
    console.error('[Proxy] No backend targets configured')
    return NextResponse.json({ error: 'No backend targets configured' }, { status: 500 })
  }

  // Select backend target using round-robin
  const target = targets[globalIndex % targets.length]
  globalIndex++

  const url = new URL(req.url)
  const backendPath = pathMapping(url.pathname)
  const fullUrl = `${target}${backendPath}${url.search}`

  const method = req.method || 'GET'
  let body: string | undefined

  // Get request body for non-GET requests
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await req.text()
    } catch (error) {
      console.error('[Proxy] Failed to read request body:', error)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
  }

  // Prepare headers
  const headers = cleanHeaders(req.headers)
  if (options.customHeaders) {
    Object.assign(headers, options.customHeaders)
  }

  try {
    const config: AxiosRequestConfig = {
      method,
      url: fullUrl,
      headers,
      data: body,
      timeout: options.timeout || PROXY_TIMEOUT,
      responseType: options.responseType || 'arraybuffer',
      validateStatus: () => true,
    }

    const axiosRes = await retryRequest(config)
    const requestTime = Date.now() - startTime

    // Forward response headers
    const responseHeaders = new Headers()
    Object.entries(axiosRes.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        responseHeaders.set(key, value)
      } else if (Array.isArray(value)) {
        responseHeaders.set(key, value.join(', '))
      }
    })

    // Add debug headers
    responseHeaders.set('X-Proxy-Backend', target)
    responseHeaders.set('X-Proxy-Time', `${requestTime}ms`)

    return new NextResponse(axiosRes.data, {
      status: axiosRes.status,
      headers: responseHeaders,
    })
  } catch (error: any) {
    const requestTime = Date.now() - startTime

    console.error(`[Proxy] Error after ${requestTime}ms:`, {
      url: fullUrl,
      error: error.code || error.message,
      stack: error.stack,
    })

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json(
        {
          error: 'Request timeout',
          message: `Request took longer than ${options.timeout || PROXY_TIMEOUT}ms`,
          backend: target,
        },
        { status: 408 }
      )
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return NextResponse.json(
        {
          error: 'Backend unavailable',
          message: 'Unable to connect to backend service',
          backend: target,
        },
        { status: 503 }
      )
    }

    if (error.code === 'ERR_NETWORK') {
      return NextResponse.json(
        {
          error: 'Network error',
          message: 'Network connection failed',
          backend: target,
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        error: 'Backend error',
        message: error.message || 'An unexpected error occurred',
        backend: target,
      },
      { status: 502 }
    )
  }
}

// Utility function for standard API path mapping
export const createApiPathMapping = (apiPath: string) => {
  return (pathname: string) => pathname.replace(`/api/proxy${apiPath}`, `/api${apiPath}`)
}

// Export constants for reuse
export { PROXY_TIMEOUT, MAX_RETRIES, RETRY_DELAY }
