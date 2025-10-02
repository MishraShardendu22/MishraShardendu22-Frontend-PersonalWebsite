'use client'

// Client-side health check utilities with React hooks
import { useState } from 'react'
import { HealthCheckResult } from './health-check-server'

// Client-side health monitoring hook
export const useHealthCheck = () => {
  const [health, setHealth] = useState<HealthCheckResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkHealth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data.backends || [])
      setLastCheck(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    health,
    isLoading,
    lastCheck,
    checkHealth,
    overallHealth:
      health.length > 0
        ? health.every((h: HealthCheckResult) => h.status === 'healthy')
          ? 'healthy'
          : 'unhealthy'
        : 'unknown',
  }
}
