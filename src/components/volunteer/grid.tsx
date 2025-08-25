import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import VolunteerCards from '@/components/volunteer/card'
import { VolunteerExperience } from '@/data/types.data'

interface VolunteerGridProps {
  experiences: VolunteerExperience[]
  className?: string
}

export default function VolunteerGrid({ experiences, className }: VolunteerGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid auto-rows-fr py-6', className)}>
      {experiences.map((exp, idx) => (
        <div
          key={exp.inline.id}
          className="relative group block p-3 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-pink-100/8 via-rose-100/8 to-pink-200/8 dark:from-pink-900/60 dark:via-rose-900/60 dark:to-pink-900/60 block rounded-3xl border border-pink-400/20 shadow-xl shadow-pink-200/10"
                layoutId="hoverBackground"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  transition: { duration: 0.2, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <VolunteerCards experience={exp} />
        </div>
      ))}
    </div>
  )
}
