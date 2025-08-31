'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallbackSrc?: string
  lazyThreshold?: number
  performanceMode?: 'auto' | 'high' | 'low'
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc,
  lazyThreshold = 0.1,
  performanceMode = 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imageRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Performance mode detection
  const isLowEnd = performanceMode === 'low' || 
    (performanceMode === 'auto' && 
     (typeof window !== 'undefined' && 
      (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
       (navigator as any).connection?.effectiveType === 'slow-2g' ||
       (navigator as any).connection?.effectiveType === '2g')))

  // Optimize quality and sizes for low-end devices
  const optimizedQuality = isLowEnd ? Math.min(quality, 60) : quality
  const optimizedSizes = isLowEnd ? 
    '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : 
    sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imageRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: lazyThreshold,
        rootMargin: '50px'
      }
    )

    observer.observe(imageRef.current)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [priority, lazyThreshold])

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  // Handle image error
  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
    } else {
      setHasError(true)
      onError?.()
    }
  }, [fallbackSrc, currentSrc, onError])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Show loading state for non-priority images
  if (!priority && !isInView) {
    return (
      <div
        ref={imageRef}
        className={cn(
          'bg-muted animate-pulse rounded-lg',
          className
        )}
        style={{ width, height }}
        aria-label={`Loading ${alt}`}
      />
    )
  }

  // Show error state
  if (hasError) {
    return (
      <div
        className={cn(
          'bg-muted flex items-center justify-center rounded-lg text-muted-foreground',
          className
        )}
        style={{ width, height }}
        aria-label={`Failed to load ${alt}`}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="relative">
      <Image
        ref={imageRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        priority={priority}
        sizes={optimizedSizes}
        quality={optimizedQuality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          // Performance optimizations
          willChange: 'opacity',
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      />
      
      {/* Loading overlay */}
      {!isLoaded && (
        <div
          className={cn(
            'absolute inset-0 bg-muted animate-pulse rounded-lg',
            'flex items-center justify-center'
          )}
          aria-label={`Loading ${alt}`}
        >
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default OptimizedImage