'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  scale: number
  speed: number
  distance: number
}

interface ShootingStarsProps {
  minSpeed?: number
  maxSpeed?: number
  minDelay?: number
  maxDelay?: number
  starColor?: string
  trailColor?: string
  starWidth?: number
  starHeight?: number
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

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4)
  const offset = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 }
    case 1:
      return { x: (typeof window !== 'undefined' ? window.innerWidth : 1200), y: offset, angle: 135 }
    case 2:
      return { x: offset, y: (typeof window !== 'undefined' ? window.innerHeight : 800), angle: 225 }
    case 3:
      return { x: 0, y: offset, angle: 315 }
    default:
      return { x: 0, y: 0, angle: 45 }
  }
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1000,
  maxDelay = 1200,
  starColor = '#9E00FF',
  trailColor = '#2EB9DF',
  starWidth = 20,
  starHeight = 1,
  className,
  reducedMotion = false,
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  
  // Performance optimization: Reduce complexity for low-end devices
  const isLowEnd = useMemo(() => isLowEndDevice() || reducedMotion, [reducedMotion])
  
  // Reduce particle count and animation frequency for low-end devices
  const effectiveMinDelay = isLowEnd ? minDelay * 3 : minDelay
  const effectiveMaxDelay = isLowEnd ? maxDelay * 3 : maxDelay
  const maxStars = isLowEnd ? 3 : 8
  const animationThrottle = isLowEnd ? 100 : 16 // 60fps vs 10fps

  const createStar = useCallback(() => {
    if (stars.length >= maxStars) return
    
    const { x, y, angle } = getRandomStartPoint()
    const newStar: ShootingStar = {
      id: Date.now() + Math.random(),
      x,
      y,
      angle,
      scale: 1,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      distance: 0,
    }

    setStars((prevStars) => [...prevStars.slice(-maxStars + 1), newStar])

    const randomDelay = Math.random() * (effectiveMaxDelay - effectiveMinDelay) + effectiveMinDelay
    setTimeout(createStar, randomDelay)
  }, [stars.length, maxStars, minSpeed, maxSpeed, effectiveMinDelay, effectiveMaxDelay])

  useEffect(() => {
    if (isLowEnd) return // Skip animation for low-end devices
    
    createStar()
    return () => {}
  }, [createStar, isLowEnd])

  useEffect(() => {
    if (isLowEnd) return // Skip animation for low-end devices
    
    const moveStars = (timestamp: number) => {
      // Throttle animation for better performance
      if (timestamp - lastUpdateRef.current < animationThrottle) {
        animationFrameRef.current = requestAnimationFrame(moveStars)
        return
      }
      
      lastUpdateRef.current = timestamp
      
      setStars((prevStars) =>
        prevStars
          .map((star) => {
            const newX = star.x + star.speed * Math.cos((star.angle * Math.PI) / 180)
            const newY = star.y + star.speed * Math.sin((star.angle * Math.PI) / 180)
            const newDistance = star.distance + star.speed
            const newScale = 1 + newDistance / 100

            return {
              ...star,
              x: newX,
              y: newY,
              distance: newDistance,
              scale: newScale,
            }
          })
          .filter(
            (star) =>
              star.x >= -20 &&
              star.x <= (typeof window !== 'undefined' ? window.innerWidth : 1200) + 20 &&
              star.y >= -20 &&
              star.y <= (typeof window !== 'undefined' ? window.innerHeight : 800) + 20
          )
      )

      animationFrameRef.current = requestAnimationFrame(moveStars)
    }

    animationFrameRef.current = requestAnimationFrame(moveStars)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isLowEnd, animationThrottle])

  // For low-end devices, render static stars
  if (isLowEnd) {
    return (
      <svg className={cn('w-full h-full absolute inset-0', className)}>
        <defs>
          <linearGradient id="gradient-static" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
        {/* Render 3-5 static stars */}
        {Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            x={100 + i * 200}
            y={100 + i * 150}
            width={starWidth}
            height={starHeight}
            fill="url(#gradient-static)"
            transform={`rotate(45, ${100 + i * 200 + starWidth / 2}, ${100 + i * 150 + starHeight / 2})`}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg ref={svgRef} className={cn('w-full h-full absolute inset-0', className)}>
      {stars.map((star) => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      ))}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
