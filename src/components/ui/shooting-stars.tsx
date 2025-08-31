'use client'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React, { useEffect, useState, useRef } from 'react'

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  scale: number
  speed: number // speed in pixels per second
  duration: number // animation duration in seconds
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
  numStars?: number
}

const getRandomStartPoint = () => {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, angle: 45 }
  }
  const side = Math.floor(Math.random() * 4)
  const offset = Math.random() * window.innerWidth

  switch (side) {
    case 0:
      return { x: offset, y: -20, angle: 45 }
    case 1:
      return { x: window.innerWidth + 20, y: offset, angle: 135 }
    case 2:
      return { x: offset, y: window.innerHeight + 20, angle: 225 }
    case 3:
      return { x: -20, y: offset, angle: 315 }
    default:
      return { x: 0, y: 0, angle: 45 }
  }
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 500,
  maxSpeed = 1000,
  minDelay = 0.5,
  maxDelay = 1,
  starColor = '#9E00FF',
  trailColor = '#2EB9DF',
  starWidth = 20,
  starHeight = 1,
  className,
  numStars = 5,
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const timeouts = Array.from({ length: numStars }).map(() => {
      let timeoutId: NodeJS.Timeout

      const createStar = () => {
        const { x, y, angle } = getRandomStartPoint()
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed
        const duration = (window.innerWidth * 1.5) / speed

        const newStar: ShootingStar = {
          id: Date.now() + Math.random(),
          x,
          y,
          angle,
          scale: 1,
          speed,
          duration,
        }

        setStars((prevStars) => [...prevStars, newStar])

        setTimeout(() => {
          setStars((prev) => prev.filter((s) => s.id !== newStar.id))
        }, duration * 1000 + 500)

        const randomDelay = (Math.random() * (maxDelay - minDelay) + minDelay) * 1000
        timeoutId = setTimeout(createStar, randomDelay)
      }

      createStar()

      return () => clearTimeout(timeoutId)
    })

    return () => timeouts.forEach((cleanup) => cleanup())
  }, [minSpeed, maxSpeed, minDelay, maxDelay, numStars])

  return (
    <div className={cn('w-full h-full absolute inset-0 overflow-hidden', className)}>
      {stars.map((star) => {
        const distance = star.speed * star.duration
        const endX = star.x + distance * Math.cos((star.angle * Math.PI) / 180)
        const endY = star.y + distance * Math.sin((star.angle * Math.PI) / 180)

        return (
          <motion.div
            key={star.id}
            className="absolute"
            initial={{
              x: star.x,
              y: star.y,
              rotate: star.angle,
              scale: star.scale,
            }}
            animate={{
              x: endX,
              y: endY,
              scale: star.scale + distance / 200,
            }}
            transition={{
              duration: star.duration,
              ease: 'linear',
            }}
            style={{
              width: `${starWidth}px`,
              height: `${starHeight}px`,
              background: `linear-gradient(to right, ${trailColor}00, ${starColor})`,
            }}
          />
        )
      })}
    </div>
  )
}
