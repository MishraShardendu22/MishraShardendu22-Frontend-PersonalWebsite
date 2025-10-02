import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// Extend axios config to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

const isServer = typeof window === 'undefined'
const baseURL = isServer ? process.env.NEXT_PUBLIC_BASE_URL + '/api/proxy' : '/api/proxy'

// Create axios instance with improved configuration
const api = axios.create({
  baseURL,
  timeout: 60000, // Increased to 60 seconds for bulk operations
  headers: {
    'Content-Type': 'application/json',
  },
  // Add keep-alive and connection pooling
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024, // 50MB max content length
})

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // Base delay in ms

// Retry logic for network errors
const retryRequest = async (config: AxiosRequestConfig, retryCount = 0): Promise<any> => {
  try {
    return await api.request(config)
  } catch (error: any) {
    const shouldRetry =
      retryCount < MAX_RETRIES &&
      (error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ERR_NETWORK' ||
        error.response?.status >= 500)

    if (shouldRetry) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount) // Exponential backoff
      console.warn(`Request failed, retrying in ${delay}ms... (${retryCount + 1}/${MAX_RETRIES})`)

      await new Promise((resolve) => setTimeout(resolve, delay))
      return retryRequest(config, retryCount + 1)
    }

    throw error
  }
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp for request tracking
    config.metadata = { startTime: Date.now() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const requestTime = Date.now() - (response.config.metadata?.startTime || 0)
    if (requestTime > 10000) {
      // Log slow requests (>10s)
      console.warn(`Slow request detected: ${response.config.url} took ${requestTime}ms`)
    }
    return response
  },
  async (error: AxiosError) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token')
        const isAdminPage =
          window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login'
        if (isAdminPage) {
          window.location.href = '/'
        }
      }
    }

    // Enhanced error logging
    const requestTime = Date.now() - (error.config?.metadata?.startTime || 0)
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      code: error.code,
      message: error.message,
      requestTime: `${requestTime}ms`,
      retryable:
        error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ERR_NETWORK' ||
        (error.response?.status && error.response.status >= 500),
    })

    return Promise.reject(error)
  }
)

// Export both the configured instance and retry function
export default api
export { retryRequest }
