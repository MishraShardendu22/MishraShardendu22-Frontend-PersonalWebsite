// Server-side health check utilities for monitoring proxy routes and backend connectivity

interface HealthCheckResult {
  service: string
  status: 'healthy' | 'unhealthy' | 'timeout'
  responseTime: number
  error?: string
  backend?: string
}

interface BackendHealth {
  url: string
  status: 'healthy' | 'unhealthy' | 'timeout'
  responseTime: number
  error?: string
}

// Get backend targets from environment
const getBackendTargets = (): string[] => {
  return [process.env.BACKEND_1, process.env.BACKEND_2, process.env.BACKEND_3].filter(
    Boolean
  ) as string[]
}

// Check health of a single backend
export const checkBackendHealth = async (
  backendUrl: string,
  timeout: number = 10000
): Promise<BackendHealth> => {
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    if (response.ok) {
      return {
        url: backendUrl,
        status: 'healthy',
        responseTime,
      }
    } else {
      return {
        url: backendUrl,
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
      }
    }
  } catch (error: any) {
    const responseTime = Date.now() - startTime

    if (error.name === 'AbortError') {
      return {
        url: backendUrl,
        status: 'timeout',
        responseTime,
        error: `Request timed out after ${timeout}ms`,
      }
    }

    return {
      url: backendUrl,
      status: 'unhealthy',
      responseTime,
      error: error.message || 'Connection failed',
    }
  }
}

// Check health of all configured backends
export const checkAllBackendsHealth = async (): Promise<BackendHealth[]> => {
  const backends = getBackendTargets()

  if (backends.length === 0) {
    console.warn('No backends configured for health check')
    return []
  }

  const healthChecks = backends.map((backend) => checkBackendHealth(backend))
  return Promise.all(healthChecks)
}

// API route for frontend to check backend health
export const performHealthCheck = async (): Promise<HealthCheckResult[]> => {
  const services = [
    'projects',
    'experiences',
    'certifications',
    'skills',
    'admin/auth',
    'admin/profile',
  ]

  const results: HealthCheckResult[] = []

  for (const service of services) {
    const startTime = Date.now()

    try {
      const response = await fetch(`/api/proxy/${service}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const responseTime = Date.now() - startTime
      const backend = response.headers.get('X-Proxy-Backend')

      results.push({
        service,
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`,
        backend: backend || undefined,
      })
    } catch (error: any) {
      const responseTime = Date.now() - startTime

      results.push({
        service,
        status: 'unhealthy',
        responseTime,
        error: error.message || 'Request failed',
      })
    }
  }

  return results
}

// Utility to log performance metrics
export const logPerformanceMetrics = (
  endpoint: string,
  responseTime: number,
  status: number,
  error?: string
) => {
  const metrics = {
    endpoint,
    responseTime,
    status,
    error,
    timestamp: new Date().toISOString(),
    slow: responseTime > 5000, // Flag slow requests (>5s)
    failed: status >= 400,
  }

  // In production, you might want to send these metrics to a monitoring service
  // sendToMonitoringService(metrics)
}

export type { HealthCheckResult, BackendHealth }
