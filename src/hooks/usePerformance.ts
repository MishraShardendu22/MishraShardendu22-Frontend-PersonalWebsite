import { useState, useEffect, useCallback } from 'react'

interface PerformanceMetrics {
  fps: number
  memoryUsage: number | null
  connectionSpeed: string | null
  isLowEnd: boolean
  reducedMotion: boolean
}

interface PerformanceOptions {
  fpsThreshold?: number
  memoryThreshold?: number
  connectionThreshold?: string
}

export const usePerformance = (options: PerformanceOptions = {}) => {
  const {
    fpsThreshold = 30,
    memoryThreshold = 4,
    connectionThreshold = '3g'
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: null,
    connectionSpeed: null,
    isLowEnd: false,
    reducedMotion: false
  })

  const [frameCount, setFrameCount] = useState(0)
  const [lastTime, setLastTime] = useState(performance.now())

  // FPS calculation
  const measureFPS = useCallback(() => {
    const now = performance.now()
    setFrameCount(prev => prev + 1)

    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime))
      setMetrics(prev => ({ ...prev, fps }))
      setFrameCount(0)
      setLastTime(now)
    }
  }, [frameCount, lastTime])

  // Memory usage detection
  const checkMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = memory.usedJSHeapSize / (1024 * 1024 * 1024) // Convert to GB
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }
  }, [])

  // Connection speed detection
  const checkConnection = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setMetrics(prev => ({ 
        ...prev, 
        connectionSpeed: connection.effectiveType || connection.type 
      }))
    }
  }, [])

  // Reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMetrics(prev => ({ ...prev, reducedMotion: prefersReducedMotion }))
  }, [])

  // Determine if device is low-end
  const determineLowEnd = useCallback(() => {
    const { fps, memoryUsage, connectionSpeed, reducedMotion } = metrics
    
    let isLowEnd = false

    // Check FPS
    if (fps < fpsThreshold) {
      isLowEnd = true
    }

    // Check memory
    if (memoryUsage && memoryUsage < memoryThreshold) {
      isLowEnd = true
    }

    // Check connection
    if (connectionSpeed && ['slow-2g', '2g'].includes(connectionSpeed)) {
      isLowEnd = true
    }

    // Check reduced motion preference
    if (reducedMotion) {
      isLowEnd = true
    }

    // Check for low-end device indicators
    if ('hardwareConcurrency' in navigator && (navigator as any).hardwareConcurrency < 4) {
      isLowEnd = true
    }

    // Check for low-end GPU
    if ('gpu' in navigator) {
      const gpu = (navigator as any).gpu
      if (gpu && gpu.name && gpu.name.toLowerCase().includes('intel')) {
        isLowEnd = true
      }
    }

    setMetrics(prev => ({ ...prev, isLowEnd }))
  }, [metrics, fpsThreshold, memoryThreshold])

  // Performance monitoring loop
  useEffect(() => {
    let animationFrameId: number

    const monitorPerformance = () => {
      measureFPS()
      animationFrameId = requestAnimationFrame(monitorPerformance)
    }

    animationFrameId = requestAnimationFrame(monitorPerformance)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [measureFPS])

  // Check system capabilities on mount and when dependencies change
  useEffect(() => {
    checkMemory()
    checkConnection()
    checkReducedMotion()
  }, [checkMemory, checkConnection, checkReducedMotion])

  // Determine low-end status when metrics change
  useEffect(() => {
    determineLowEnd()
  }, [determineLowEnd])

  // Listen for connection changes
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      const handleChange = () => {
        checkConnection()
        determineLowEnd()
      }

      connection.addEventListener('change', handleChange)
      return () => connection.removeEventListener('change', handleChange)
    }
  }, [checkConnection, determineLowEnd])

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => {
      checkReducedMotion()
      determineLowEnd()
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [checkReducedMotion, determineLowEnd])

  // Performance optimization recommendations
  const getOptimizationRecommendations = useCallback(() => {
    const recommendations: string[] = []

    if (metrics.fps < 30) {
      recommendations.push('Reduce animation complexity')
    }

    if (metrics.memoryUsage && metrics.memoryUsage < 2) {
      recommendations.push('Limit concurrent operations')
    }

    if (metrics.connectionSpeed === 'slow-2g' || metrics.connectionSpeed === '2g') {
      recommendations.push('Implement aggressive caching')
    }

    if (metrics.reducedMotion) {
      recommendations.push('Respect reduced motion preferences')
    }

    return recommendations
  }, [metrics])

  // Dynamic performance settings
  const getPerformanceSettings = useCallback(() => {
    if (metrics.isLowEnd) {
      return {
        animationFrameRate: 30,
        particleCount: 100,
        blurEffects: false,
        complexShadows: false,
        highQualityTextures: false
      }
    }

    return {
      animationFrameRate: 60,
      particleCount: 500,
      blurEffects: true,
      complexShadows: true,
      highQualityTextures: true
    }
  }, [metrics.isLowEnd])

  return {
    metrics,
    isLowEnd: metrics.isLowEnd,
    reducedMotion: metrics.reducedMotion,
    getOptimizationRecommendations,
    getPerformanceSettings,
    // Performance monitoring methods
    measureFPS,
    checkMemory,
    checkConnection,
    checkReducedMotion
  }
}

export default usePerformance