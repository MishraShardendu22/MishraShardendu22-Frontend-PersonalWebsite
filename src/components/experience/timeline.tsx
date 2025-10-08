'use client'
import { useScroll, useTransform, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import {
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Award,
  Building2,
  Users,
  Trophy,
  Target,
} from 'lucide-react'
import { Experience, ExperienceTimeLine } from '@/data/types.data'
import { cn } from '@/lib/utils'

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

interface ExperienceTimelineProps {
  experience: Experience
}

export const ExperienceTimeline = ({ experience }: ExperienceTimelineProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))

    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`
    }
    const years = Math.floor(diffMonths / 12)
    const remainingMonths = diffMonths % 12
    return `${years}y${remainingMonths > 0 ? ` ${remainingMonths}m` : ''}`
  }

  const isCurrentPosition = (endDate?: string) => {
    return !endDate || new Date(endDate) > new Date()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  const timelineData: TimelineEntry[] = React.useMemo(() => {
    return [...experience.experience_time_line]
      .reverse()
      .map((timeline: ExperienceTimeLine, index: number) => {
        const duration = calculateDuration(timeline.start_date, timeline.end_date)
        const isCurrent = isCurrentPosition(timeline.end_date)
        const originalIndex = experience.experience_time_line.length - 1 - index
        const isLatest = originalIndex === experience.experience_time_line.length - 1

        return {
          title: timeline.position,
          content: (
            <div className="space-y-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={cn(
                  'relative rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 overflow-visible',
                  isCurrent
                    ? 'bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/30 shadow-lg shadow-primary/10'
                    : 'bg-gradient-to-br from-card/90 via-card to-card/80 border-border/40 shadow-md'
                )}
              >
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="absolute -top-3 -right-3 z-[100] px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-xl border-2 border-white dark:border-gray-800 flex items-center gap-1"
                    style={{
                      position: 'absolute',
                      zIndex: 100,
                      top: '-12px',
                      right: '-12px',
                    }}
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    CURRENT
                  </motion.div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={cn(
                      'p-3 rounded-xl border',
                      isCurrent
                        ? 'bg-primary/20 border-primary/30'
                        : 'bg-secondary/20 border-secondary/30'
                    )}
                  >
                    <Building2
                      className={cn('w-6 h-6', isCurrent ? 'text-primary' : 'text-secondary')}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-foreground truncate">
                        {experience.company_name}
                      </h4>
                      {isLatest && !isCurrent && (
                        <div className="px-2 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-500/30 flex-shrink-0">
                          Latest
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(timeline.start_date)} –{' '}
                          {timeline.end_date ? formatDate(timeline.end_date) : 'Present'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-foreground">Role & Responsibilities</span>
                  </div>

                  <p className="text-foreground/80 leading-relaxed">
                    Worked as <strong>{timeline.position}</strong> at {experience.company_name},
                    contributing to product development and organizational growth through dedicated
                    professional service.
                  </p>
                </div>
              </motion.div>

              {experience.technologies && experience.technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/40"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-secondary flex-shrink-0" />
                    <h5 className="font-semibold text-foreground">Technologies & Skills</h5>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.slice(0, 8).map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + techIndex * 0.05 }}
                        className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-secondary/20 to-accent/20 text-foreground/80 rounded-full border border-secondary/30 hover:border-secondary/50 transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {experience.technologies.length > 8 && (
                      <span className="px-3 py-1 text-xs font-medium bg-foreground/10 text-foreground/60 rounded-full border border-foreground/20">
                        +{experience.technologies.length - 8} more
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {experience.projects && experience.projects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/40"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-accent flex-shrink-0" />
                    <h5 className="font-semibold text-foreground">Projects & Contributions</h5>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {experience.projects.length + (experience.images?.length || 0)}
                      </div>
                      <div className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">
                        Project
                        {experience.projects.length + (experience.images?.length || 0) !== 1
                          ? 's'
                          : ''}
                      </div>
                    </div>

                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800/50">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {experience.technologies?.length || 0}
                      </div>
                      <div className="text-sm text-green-600/70 dark:text-green-400/70 font-medium">
                        Technologies
                      </div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800/50">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {experience.experience_time_line.length}
                      </div>
                      <div className="text-sm text-purple-600/70 dark:text-purple-400/70 font-medium">
                        Position{experience.experience_time_line.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ),
        }
      })
  }, [experience])

  return (
    <div className="w-full bg-background font-sans" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Professional Journey
            </h2>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            My professional career and contributions through dedicated work at{' '}
            <strong>{experience.company_name}</strong>, showcasing growth and expertise in the
            industry.
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {experience.experience_time_line.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Position{experience.experience_time_line.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {(experience.projects?.length || 0) + (experience.images?.length || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {experience.technologies?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10">
        {timelineData.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-12 absolute left-3 md:left-3 w-12 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shadow-xl">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center',
                    isCurrentPosition(
                      experience.experience_time_line[
                        experience.experience_time_line.length - 1 - index
                      ]?.end_date
                    )
                      ? 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/50'
                      : 'bg-gradient-to-br from-secondary to-accent'
                  )}
                >
                  {isCurrentPosition(
                    experience.experience_time_line[
                      experience.experience_time_line.length - 1 - index
                    ]?.end_date
                  ) ? (
                    <Award className="w-3 h-3 text-white" />
                  ) : (
                    <Briefcase className="w-3 h-3 text-white" />
                  )}
                </motion.div>
              </div>

              <motion.h3
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-muted-foreground hover:text-primary transition-colors cursor-default truncate max-w-sm"
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full min-w-0">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="md:hidden block text-2xl mb-4 text-left font-bold text-muted-foreground"
              >
                {item.title}
              </motion.h3>
              <div className="w-full min-w-0">{item.content}</div>
            </div>
          </div>
        ))}

        <div
          style={{ height: height + 'px' }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[3px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[3px] bg-gradient-to-t from-primary via-secondary to-accent from-[0%] via-[50%] rounded-full shadow-lg shadow-primary/30"
          />
        </div>
      </div>
    </div>
  )
}

export default ExperienceTimeline
