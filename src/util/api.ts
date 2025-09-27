import axios from 'axios'

const isServer = typeof window === 'undefined'
const baseURL = isServer ? process.env.NEXT_PUBLIC_BASE_URL + '/api/proxy' : '/api/proxy'

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
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
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default api
