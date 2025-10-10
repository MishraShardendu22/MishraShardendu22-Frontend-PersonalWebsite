import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}

const isServer = typeof window === 'undefined'
const baseURL = isServer ? process.env.NEXT_PUBLIC_BASE_URL + '/api/proxy' : '/api/proxy'

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 5,
  maxContentLength: 50 * 1024 * 1024,
})

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

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
      const delay = RETRY_DELAY * Math.pow(2, retryCount)
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

    config.metadata = { startTime: Date.now() }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    const requestTime = Date.now() - (response.config.metadata?.startTime || 0)
    if (requestTime > 10000) {
      console.warn(`Slow request detected: ${response.config.url} took ${requestTime}ms`)
    }
    return response
  },
  async (error: AxiosError) => {
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

export default api
export { retryRequest }
