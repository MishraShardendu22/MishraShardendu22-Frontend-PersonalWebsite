'use client'
import { cn } from '@/lib/utils'
import React, { useState, useEffect, useRef, RefObject, useCallback, useMemo } from 'react'

interface StarProps {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number | null
}

interface StarBackgroundProps {
  starDensity?: number
  allStarsTwinkle?: boolean
  twinkleProbability?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
  className?: string
  reducedMotion?: boolean
}

// Performance optimization: Detect low-end devices
const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  
  // Check for low-end device indicators
  const connection = (navigator as any).connection
  if (connection) {
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return true
    if (connection.downlink < 1) return true
  }
  
  // Check for low memory
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) return true
  
  return false
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  className,
  reducedMotion = false,
}) => {
  const [stars, setStars] = useState<StarProps[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastUpdateRef = useRef<number>(0)
  
  // Performance optimization: Reduce complexity for low-end devices
  const isLowEnd = useMemo(() => isLowEndDevice() || reducedMotion, [reducedMotion])
  
  // Reduce star density and animation for low-end devices
  const effectiveStarDensity = isLowEnd ? starDensity * 0.3 : starDensity
  const effectiveTwinkleProbability = isLowEnd ? 0.3 : twinkleProbability
  const animationThrottle = isLowEnd ? 200 : 16 // 5fps vs 60fps

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height
      const numStars = Math.floor(area * effectiveStarDensity)
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle = allStarsTwinkle || Math.random() < effectiveTwinkleProbability
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        }
      })
    },
    [effectiveStarDensity, allStarsTwinkle, effectiveTwinkleProbability, minTwinkleSpeed, maxTwinkleSpeed]
  )

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const { width, height } = canvas.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setStars(generateStars(width, height))
      }
    }

    updateStars()

    const canvasEl = canvasRef.current
    const resizeObserver = new ResizeObserver(updateStars)
    if (canvasEl) {
      resizeObserver.observe(canvasEl)
    }

    return () => {
      if (canvasEl) {
        resizeObserver.unobserve(canvasEl)
      }
    }
  }, [
    effectiveStarDensity,
    allStarsTwinkle,
    effectiveTwinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ])

  useEffect(() => {
    if (isLowEnd) return // Skip animation for low-end devices
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = (timestamp: number) => {
      // Throttle animation for better performance
      if (timestamp - lastUpdateRef.current < animationThrottle) {
        animationFrameRef.current = requestAnimationFrame(render)
        return
      }
      
      lastUpdateRef.current = timestamp
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        if (star.twinkleSpeed !== null) {
          star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5)
        }
      })

      animationFrameRef.current = requestAnimationFrame(render)
    }

    animationFrameRef.current = requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stars, isLowEnd, animationThrottle])

  // For low-end devices, render static stars without animation
  if (isLowEnd) {
    return (
      <canvas 
        ref={canvasRef} 
        className={cn('h-full w-full absolute inset-0', className)}
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
    )
  }

  return <canvas ref={canvasRef} className={cn('h-full w-full absolute inset-0', className)} />
}
