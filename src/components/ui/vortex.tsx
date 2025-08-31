/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import { createNoise3D } from 'simplex-noise'
import { motion } from 'motion/react'

interface VortexProps {
  children?: any
  className?: string
  containerClassName?: string
  particleCount?: number
  rangeY?: number
  baseHue?: number
  baseSpeed?: number
  rangeSpeed?: number
  baseRadius?: number
  rangeRadius?: number
  backgroundColor?: string
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

export const Vortex = (props: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef(null)
  const animationFrameId = useRef<number | null>(null)
  const lastUpdateRef = useRef<number>(0)
  
  // Performance optimization: Reduce complexity for low-end devices
  const isLowEnd = useMemo(() => isLowEndDevice() || props.reducedMotion, [props.reducedMotion])
  
  // Reduce particle count and complexity for low-end devices
  const particleCount = isLowEnd ? Math.min(props.particleCount || 700, 200) : (props.particleCount || 700)
  const particlePropCount = 9
  const particlePropsLength = particleCount * particlePropCount
  const rangeY = props.rangeY || 100
  const baseTTL = isLowEnd ? 30 : 50
  const rangeTTL = isLowEnd ? 80 : 150
  const baseSpeed = props.baseSpeed || 0.0
  const rangeSpeed = isLowEnd ? (props.rangeSpeed || 1.5) * 0.5 : (props.rangeSpeed || 1.5)
  const baseRadius = props.baseRadius || 1
  const rangeRadius = props.rangeRadius || 2
  const baseHue = props.baseHue || 220
  const rangeHue = isLowEnd ? 50 : 100
  const noiseSteps = isLowEnd ? 2 : 3
  const xOff = isLowEnd ? 0.0025 : 0.00125
  const yOff = isLowEnd ? 0.0025 : 0.00125
  const zOff = isLowEnd ? 0.001 : 0.0005
  const backgroundColor = props.backgroundColor || '#000000'
  
  let tick = 0
  const noise3D = createNoise3D()
  let particleProps = new Float32Array(particlePropsLength)
  let center: [number, number] = [0, 0]

  const HALF_PI: number = 0.5 * Math.PI
  const TAU: number = 2 * Math.PI
  const TO_RAD: number = Math.PI / 180
  const rand = (n: number): number => n * Math.random()
  const randRange = (n: number): number => n - rand(2 * n)
  const fadeInOut = (t: number, m: number): number => {
    let hm = 0.5 * m
    return Math.abs(((t + hm) % m) - hm) / hm
  }
  const lerp = (n1: number, n2: number, speed: number): number => (1 - speed) * n1 + speed * n2

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas && container) {
      const ctx = canvas.getContext('2d')

      if (ctx) {
        resize(canvas, ctx)
        initParticles()
        if (!isLowEnd) {
          draw(canvas, ctx)
        }
      }
    }
  }, [isLowEnd])

  const initParticles = useCallback(() => {
    tick = 0
    particleProps = new Float32Array(particlePropsLength)

    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i)
    }
  }, [particlePropsLength, particlePropCount])

  const initParticle = useCallback((i: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    let x, y, vx, vy, life, ttl, speed, radius, hue

    x = rand(canvas.width)
    y = center[1] + randRange(rangeY)
    vx = 0
    vy = 0
    life = 0
    ttl = baseTTL + rand(rangeTTL)
    speed = baseSpeed + rand(rangeSpeed)
    radius = baseRadius + rand(rangeRadius)
    hue = baseHue + rand(rangeHue)

    particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i)
  }, [baseTTL, rangeTTL, baseSpeed, rangeSpeed, baseRadius, rangeRadius, baseHue, rangeHue])

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (isLowEnd) return // Skip animation for low-end devices
    
    tick++

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawParticles(ctx)
    if (!isLowEnd) {
      renderGlow(canvas, ctx)
      renderToScreen(canvas, ctx)
    }

    // Throttle animation for better performance
    const timestamp = performance.now()
    if (timestamp - lastUpdateRef.current >= (isLowEnd ? 100 : 16)) {
      lastUpdateRef.current = timestamp
      animationFrameId.current = window.requestAnimationFrame(() => draw(canvas, ctx))
    } else {
      animationFrameId.current = window.requestAnimationFrame(() => draw(canvas, ctx))
    }
  }, [isLowEnd])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx)
    }
  }, [particlePropsLength, particlePropCount])

  const updateParticle = useCallback((i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return

    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i
    let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue

    x = particleProps[i]
    y = particleProps[i2]
    n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU
    vx = lerp(particleProps[i3], Math.cos(n), 0.5)
    vy = lerp(particleProps[i4], Math.sin(n), 0.5)
    life = particleProps[i5]
    ttl = particleProps[i6]
    speed = particleProps[i7]
    x2 = x + vx * speed
    y2 = y + vy * speed
    radius = particleProps[i8]
    hue = particleProps[i9]

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx)

    life++

    particleProps[i] = x2
    particleProps[i2] = y2
    particleProps[i3] = vx
    particleProps[i4] = vy
    particleProps[i5] = life

    ;(checkBounds(x, y, canvas) || life > ttl) && initParticle(i)
  }, [noise3D, xOff, yOff, zOff, noiseSteps, TAU, initParticle])

  const drawParticle = useCallback((
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineWidth = radius
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }, [])

  const checkBounds = useCallback((x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0
  }, [])

  const resize = useCallback((canvas: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => {
    const { innerWidth, innerHeight } = window

    canvas.width = innerWidth
    canvas.height = innerHeight

    center[0] = 0.5 * canvas.width
    center[1] = 0.5 * canvas.height
  }, [])

  const renderGlow = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    if (isLowEnd) return // Skip glow effects for low-end devices
    
    ctx.save()
    ctx.filter = 'blur(8px) brightness(200%)'
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()

    ctx.save()
    ctx.filter = 'blur(4px) brightness(200%)'
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }, [isLowEnd])

  const renderToScreen = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.drawImage(canvas, 0, 0)
    ctx.restore()
  }, [])

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      resize(canvas, ctx)
    }
  }, [resize])

  useEffect(() => {
    setup()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [setup, handleResize])

  // For low-end devices, render a simplified static background
  if (isLowEnd) {
    return (
      <div className={cn('relative h-full w-full', props.containerClassName)}>
        <div
          ref={containerRef}
          className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(0,255,0,0.1) 0%, transparent 70%)`,
          }}
        />
        <div className={cn('relative z-10', props.className)}>{props.children}</div>
      </div>
    )
  }

  return (
    <div className={cn('relative h-full w-full', props.containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute inset-0 z-0 flex h-full w-full items-center justify-center bg-transparent"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn('relative z-10', props.className)}>{props.children}</div>
    </div>
  )
}
