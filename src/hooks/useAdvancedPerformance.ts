import { useState, useEffect, useCallback, useMemo } from 'react'

interface AdvancedPerformanceMetrics {
  fps: number
  memoryUsage: number | null
  connectionSpeed: string | null
  isLowEnd: boolean
  reducedMotion: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  screenSize: 'small' | 'medium' | 'large' | 'xlarge'
  batteryLevel: number | null
  isCharging: boolean | null
  hardwareConcurrency: number | null
  gpuInfo: string | null
  touchSupport: boolean
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
  viewportSize: { width: number; height: number }
}

interface AdvancedPerformanceOptions {
  fpsThreshold?: number
  memoryThreshold?: number
  connectionThreshold?: string
  batteryThreshold?: number
  enableBatteryMonitoring?: boolean
}

export const useAdvancedPerformance = (options: AdvancedPerformanceOptions = {}) => {
  const {
    fpsThreshold = 30,
    memoryThreshold = 4,
    connectionThreshold = '3g',
    batteryThreshold = 0.2,
    enableBatteryMonitoring = true
  } = options

  const [metrics, setMetrics] = useState<AdvancedPerformanceMetrics>({
    fps: 60,
    memoryUsage: null,
    connectionSpeed: null,
    isLowEnd: false,
    reducedMotion: false,
    deviceType: 'desktop',
    screenSize: 'large',
    batteryLevel: null,
    isCharging: null,
    hardwareConcurrency: null,
    gpuInfo: null,
    touchSupport: false,
    orientation: 'landscape',
    pixelRatio: 1,
    viewportSize: { width: 0, height: 0 }
  })

  const [frameCount, setFrameCount] = useState(0)
  const [lastTime, setLastTime] = useState(performance.now())

  // Advanced device detection
  const detectDeviceType = useCallback(() => {
    if (typeof window === 'undefined') return 'desktop'
    
    const width = window.innerWidth
    const height = window.innerHeight
    
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }, [])

  const detectScreenSize = useCallback(() => {
    if (typeof window === 'undefined') return 'large'
    
    const width = window.innerWidth
    
    if (width < 640) return 'small'
    if (width < 768) return 'medium'
    if (width < 1024) return 'large'
    if (width < 1280) return 'large'
    return 'xlarge'
  }, [])

  const detectTouchSupport = useCallback(() => {
    if (typeof window === 'undefined') return false
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }, [])

  const detectOrientation = useCallback(() => {
    if (typeof window === 'undefined') return 'landscape'
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  }, [])

  const getPixelRatio = useCallback(() => {
    if (typeof window === 'undefined') return 1
    return window.devicePixelRatio || 1
  }, [])

  const getViewportSize = useCallback(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }, [])

  // FPS calculation with advanced throttling
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

  // Advanced memory detection
  const checkMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = memory.usedJSHeapSize / (1024 * 1024 * 1024) // Convert to GB
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }
  }, [])

  // Advanced connection detection
  const checkConnection = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      setMetrics(prev => ({ 
        ...prev, 
        connectionSpeed: connection.effectiveType || connection.type 
      }))
    }
  }, [])

  // Battery monitoring
  const checkBattery = useCallback(async () => {
    if (!enableBatteryMonitoring || !('getBattery' in navigator)) return
    
    try {
      const battery = await (navigator as any).getBattery()
      setMetrics(prev => ({ 
        ...prev, 
        batteryLevel: battery.level,
        isCharging: battery.charging
      }))
      
      // Listen for battery changes
      battery.addEventListener('levelchange', () => {
        setMetrics(prev => ({ ...prev, batteryLevel: battery.level }))
      })
      
      battery.addEventListener('chargingchange', () => {
        setMetrics(prev => ({ ...prev, isCharging: battery.charging }))
      })
    } catch (error) {
      console.warn('Battery API not supported:', error)
    }
  }, [enableBatteryMonitoring])

  // Hardware detection
  const checkHardware = useCallback(() => {
    // CPU cores
    if ('hardwareConcurrency' in navigator) {
      setMetrics(prev => ({ 
        ...prev, 
        hardwareConcurrency: (navigator as any).hardwareConcurrency 
      }))
    }

    // GPU info
    if ('gpu' in navigator) {
      const gpu = (navigator as any).gpu
      if (gpu && gpu.name) {
        setMetrics(prev => ({ ...prev, gpuInfo: gpu.name }))
      }
    }
  }, [])

  // Reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMetrics(prev => ({ ...prev, reducedMotion: prefersReducedMotion }))
  }, [])

  // Advanced low-end device detection
  const determineLowEnd = useCallback(() => {
    const { 
      fps, 
      memoryUsage, 
      connectionSpeed, 
      reducedMotion,
      deviceType,
      batteryLevel,
      hardwareConcurrency,
      gpuInfo,
      pixelRatio
    } = metrics
    
    let isLowEnd = false
    let score = 0

    // FPS check (weight: 30%)
    if (fps < fpsThreshold) {
      score += 30
    }

    // Memory check (weight: 20%)
    if (memoryUsage && memoryUsage < memoryThreshold) {
      score += 20
    }

    // Connection check (weight: 15%)
    if (connectionSpeed && ['slow-2g', '2g'].includes(connectionSpeed)) {
      score += 15
    }

    // Device type check (weight: 10%)
    if (deviceType === 'mobile') {
      score += 5
    }

    // Battery check (weight: 10%)
    if (batteryLevel !== null && batteryLevel < batteryThreshold) {
      score += 10
    }

    // Hardware check (weight: 10%)
    if (hardwareConcurrency && hardwareConcurrency < 4) {
      score += 10
    }

    // GPU check (weight: 5%)
    if (gpuInfo && gpuInfo.toLowerCase().includes('intel')) {
      score += 5
    }

    // Reduced motion preference
    if (reducedMotion) {
      score += 10
    }

    // High pixel ratio (retina displays can be more demanding)
    if (pixelRatio > 2) {
      score += 5
    }

    isLowEnd = score >= 40 // Threshold for low-end classification

    setMetrics(prev => ({ ...prev, isLowEnd }))
  }, [metrics, fpsThreshold, memoryThreshold, batteryThreshold])

  // Performance monitoring loop with adaptive throttling
  useEffect(() => {
    let animationFrameId: number
    let lastUpdate = 0
    const throttleInterval = metrics.isLowEnd ? 100 : 16 // 10fps vs 60fps

    const monitorPerformance = (timestamp: number) => {
      if (timestamp - lastUpdate >= throttleInterval) {
        measureFPS()
        lastUpdate = timestamp
      }
      animationFrameId = requestAnimationFrame(monitorPerformance)
    }

    animationFrameId = requestAnimationFrame(monitorPerformance)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [measureFPS, metrics.isLowEnd])

  // Initialize all checks
  useEffect(() => {
    checkMemory()
    checkConnection()
    checkReducedMotion()
    checkBattery()
    checkHardware()
    
    // Set initial device properties
    setMetrics(prev => ({
      ...prev,
      deviceType: detectDeviceType(),
      screenSize: detectScreenSize(),
      touchSupport: detectTouchSupport(),
      orientation: detectOrientation(),
      pixelRatio: getPixelRatio(),
      viewportSize: getViewportSize()
    }))
  }, [checkMemory, checkConnection, checkReducedMotion, checkBattery, checkHardware, detectDeviceType, detectScreenSize, detectTouchSupport, detectOrientation, getPixelRatio, getViewportSize])

  // Update device properties on resize
  useEffect(() => {
    const handleResize = () => {
      setMetrics(prev => ({
        ...prev,
        deviceType: detectDeviceType(),
        screenSize: detectScreenSize(),
        orientation: detectOrientation(),
        viewportSize: getViewportSize()
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [detectDeviceType, detectScreenSize, detectOrientation, getViewportSize])

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

  // Advanced performance optimization recommendations
  const getAdvancedOptimizationRecommendations = useCallback(() => {
    const recommendations: string[] = []

    if (metrics.fps < 30) {
      recommendations.push('Reduce animation complexity and implement frame throttling')
    }

    if (metrics.memoryUsage && metrics.memoryUsage < 2) {
      recommendations.push('Implement aggressive memory management and lazy loading')
    }

    if (metrics.connectionSpeed === 'slow-2g' || metrics.connectionSpeed === '2g') {
      recommendations.push('Use aggressive caching and minimal resource loading')
    }

    if (metrics.batteryLevel !== null && metrics.batteryLevel < 0.3) {
      recommendations.push('Reduce CPU-intensive operations and optimize for battery life')
    }

    if (metrics.deviceType === 'mobile') {
      recommendations.push('Optimize for touch interactions and reduce hover effects')
    }

    if (metrics.pixelRatio > 2) {
      recommendations.push('Optimize high-DPI rendering and reduce image sizes')
    }

    if (metrics.reducedMotion) {
      recommendations.push('Respect reduced motion preferences and provide static alternatives')
    }

    return recommendations
  }, [metrics])

  // Advanced performance settings with device-specific optimizations
  const getAdvancedPerformanceSettings = useCallback(() => {
    const baseSettings = {
      animationFrameRate: metrics.isLowEnd ? 30 : 60,
      particleCount: metrics.isLowEnd ? 100 : 500,
      blurEffects: !metrics.isLowEnd,
      complexShadows: !metrics.isLowEnd,
      highQualityTextures: !metrics.isLowEnd,
      enableParallax: !metrics.isLowEnd,
      enableComplexAnimations: !metrics.isLowEnd,
      enableRealTimeUpdates: !metrics.isLowEnd,
      enableSmoothScrolling: !metrics.isLowEnd,
      enableHoverEffects: metrics.deviceType !== 'mobile',
      enableTouchOptimizations: metrics.deviceType === 'mobile',
      enableBatteryOptimizations: metrics.batteryLevel !== null && metrics.batteryLevel < 0.5,
      enableLowBandwidthMode: ['slow-2g', '2g'].includes(metrics.connectionSpeed || ''),
      enableHighDPIOptimizations: metrics.pixelRatio > 2,
      enableReducedMotion: metrics.reducedMotion
    }

    // Device-specific overrides
    if (metrics.deviceType === 'mobile') {
      baseSettings.particleCount = Math.min(baseSettings.particleCount, 150)
      baseSettings.animationFrameRate = Math.min(baseSettings.animationFrameRate, 45)
    }

    if (metrics.screenSize === 'small') {
      baseSettings.particleCount = Math.min(baseSettings.particleCount, 100)
      baseSettings.enableComplexAnimations = false
    }

    return baseSettings
  }, [metrics])

  // Performance score calculation
  const getPerformanceScore = useCallback(() => {
    let score = 100

    if (metrics.fps < 30) score -= 30
    else if (metrics.fps < 45) score -= 15

    if (metrics.memoryUsage && metrics.memoryUsage > 6) score -= 20
    else if (metrics.memoryUsage && metrics.memoryUsage > 4) score -= 10

    if (metrics.connectionSpeed === 'slow-2g') score -= 25
    else if (metrics.connectionSpeed === '2g') score -= 15

    if (metrics.batteryLevel !== null && metrics.batteryLevel < 0.2) score -= 10

    return Math.max(0, score)
  }, [metrics])

  return {
    metrics,
    isLowEnd: metrics.isLowEnd,
    reducedMotion: metrics.reducedMotion,
    deviceType: metrics.deviceType,
    screenSize: metrics.screenSize,
    touchSupport: metrics.touchSupport,
    orientation: metrics.orientation,
    getAdvancedOptimizationRecommendations,
    getAdvancedPerformanceSettings,
    getPerformanceScore,
    // Performance monitoring methods
    measureFPS,
    checkMemory,
    checkConnection,
    checkReducedMotion,
    checkBattery,
    checkHardware
  }
}

export default useAdvancedPerformance