'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from './badge'
import { cn } from '@/lib/utils'
import { Button } from './button'
import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { Experience } from '@/data/types.data'
import { Card, CardDescription, CardTitle } from './card'
import {
  Award,
  ArrowRight,
  Building2,
  Calendar,
  ExternalLink,
  Clock,
  Users,
  Trophy,
  Target,
} from 'lucide-react'

export const ExperienceFocusCard = React.memo(
  ({
    exp,
    index,
    hovered,
    setHovered,
    startIndex,
    isMobile,
  }: {
    exp: Experience
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
    startIndex: number
    isMobile: boolean
  }) => {
    const latestPosition = exp.experience_time_line?.[exp.experience_time_line.length - 1]
    const earliestPosition = exp.experience_time_line?.[0]

    const dateRange = useMemo(() => {
      if (!earliestPosition?.start_date || !latestPosition?.end_date) return '—'
      const startDate = new Date(earliestPosition.start_date)
      const endDate = new Date(latestPosition.end_date)
      const startStr = startDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
      const endStr = endDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
      return `${startStr} - ${endStr}`
    }, [earliestPosition?.start_date, latestPosition?.end_date])

    const totalDuration = useMemo(() => {
      if (!earliestPosition?.start_date || !latestPosition?.end_date) return null
      const start = new Date(earliestPosition.start_date)
      const end = new Date(latestPosition.end_date)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const months = Math.floor(diffDays / 30)

      if (months < 1) return '< 1 month'
      if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return `${years}y${remainingMonths > 0 ? ` ${remainingMonths}m` : ''}`
    }, [earliestPosition?.start_date, latestPosition?.end_date])

    const summary = useMemo(() => {
      const limit = isMobile ? 140 : 180
      return exp.description.length > limit
        ? `${exp.description.slice(0, limit)}…`
        : exp.description
    }, [exp.description, isMobile])

    const currentPosition = latestPosition?.position || earliestPosition?.position || 'Professional'
    const positionCount = exp.experience_time_line?.length || 0
    const techCount = exp.technologies?.length || 0
    const projectCount = exp.projects?.length + exp.images?.length || 0
    const imageCount = exp.images?.length || 0

    const isCurrentlyActive = useMemo(() => {
      if (!latestPosition?.end_date) return true
      const endDate = new Date(latestPosition.end_date)
      const now = new Date()
      return endDate > now
    }, [latestPosition?.end_date])

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={`transition-all duration-300 ease-out h-full ${
          hovered !== null && hovered !== index ? 'blur-sm scale-[0.98] opacity-70' : ''
        }`}
      >
        <Card className="group relative overflow-visible border border-border/40 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-md hover:bg-gradient-to-br hover:from-card hover:via-card hover:to-card/95 h-full flex flex-col">
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-primary/30 to-secondary/20 flex items-center justify-center text-primary text-sm font-bold shadow-xl border border-primary/30 backdrop-blur-sm">
                {String(startIndex + index + 1).padStart(2, '0')}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </div>

            {isCurrentlyActive && (
              <div className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-500/30 backdrop-blur-sm">
                Active
              </div>
            )}
          </div>

          <div className="relative z-10 p-6 flex flex-col h-full">
            <div className="flex-shrink-0 mb-5">
              <div className="flex items-start space-x-4 mb-4">
                {exp.company_logo && (
                  <div className="relative group/logo">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-background border-2 border-border shadow-lg flex-shrink-0 ring-2 ring-primary/10 transition-all group-hover/logo:ring-primary/20">
                      <Image
                        src={exp.company_logo}
                        width={56}
                        height={56}
                        alt={`${exp.company_name} logo`}
                        className="w-full h-full object-cover transition-transform group-hover/logo:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-foreground mb-1 leading-tight">
                    {exp.company_name}
                  </h3>
                  <div className="flex items-center text-sm text-primary font-semibold mb-2">
                    <Award className="mr-1.5 h-4 w-4 flex-shrink-0" />
                    {currentPosition}
                  </div>

                  {positionCount > 1 && (
                    <div className="flex items-center text-xs text-foreground/60">
                      <Users className="mr-1 h-3 w-3" />
                      <span>
                        {positionCount} position{positionCount > 1 ? 's' : ''} held
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center text-sm text-foreground/70 bg-secondary/10 px-3 py-2 rounded-lg border border-secondary/30 flex-1">
                    <Calendar className="mr-2 h-4 w-4 text-primary/70 flex-shrink-0" />
                    <span className="font-medium text-xs">{dateRange}</span>
                  </div>
                  {totalDuration && (
                    <div className="px-3 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 whitespace-nowrap flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {totalDuration}
                    </div>
                  )}
                </div>

                {exp.created_by && (
                  <div className="flex items-center text-xs text-foreground/60 bg-accent/5 px-3 py-2 rounded-lg border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent/60 mr-2 flex-shrink-0"></div>
                    <span>Created by {exp.created_by}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4"></div>

            <div className="flex-1 min-h-0 mb-4">
              <div className="overflow-hidden">
                <div className="text-foreground/85 leading-relaxed text-sm font-medium">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              </div>
            </div>

            {exp.technologies && exp.technologies.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Technologies Used
                  </h4>
                  <span className="text-xs text-foreground/50">
                    {techCount} tech{techCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.slice(0, isMobile ? 4 : 6).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-secondary/20 to-accent/20 text-foreground/80 rounded-full border border-secondary/30 hover:border-secondary/50 transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                  {exp.technologies.length > (isMobile ? 4 : 6) && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-foreground/10 text-foreground/60 rounded-full border border-foreground/20 cursor-default">
                      +{exp.technologies.length - (isMobile ? 4 : 6)} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {projectCount}
                  </div>
                  <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                    Project{projectCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {techCount}
                  </div>
                  <div className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
                    Tech{techCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {imageCount}
                  </div>
                  <div className="text-xs text-purple-600/70 dark:text-purple-400/70 font-medium">
                    Photo{imageCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {exp.experience_time_line && exp.experience_time_line.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">
                  Position Timeline
                </h4>
                <div className="space-y-2 max-h-20 overflow-y-auto">
                  {exp.experience_time_line.slice(0, 2).map((timeline, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-muted/50 rounded-md px-2 py-1.5 border border-muted-foreground/10"
                    >
                      <span className="font-medium text-foreground/80 truncate flex-1">
                        {timeline.position}
                      </span>
                      <span className="text-foreground/60 text-[10px] ml-2 whitespace-nowrap">
                        {new Date(timeline.start_date).toLocaleDateString('en-GB', {
                          year: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  ))}
                  {exp.experience_time_line.length > 2 && (
                    <div className="text-xs text-foreground/50 text-center py-1">
                      +{exp.experience_time_line.length - 2} more position
                      {exp.experience_time_line.length - 2 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4"></div>

            <div className="flex-shrink-0 mt-auto space-y-2">
              <Link
                href={`/experiences/${exp.inline?.id || exp.inline.id}`}
                className="w-full block"
              >
                <Button
                  size="sm"
                  className="w-full h-10 bg-gradient-to-r from-primary via-primary/95 to-secondary hover:from-primary/90 hover:via-primary/85 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-semibold group/btn relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="text-sm relative z-10">View Full Experience</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 relative z-10" />
                </Button>
              </Link>

              {exp.certificate_url ? (
                <Link
                  href={exp.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 group/cert hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 bg-primary/5 border-primary/20 font-medium shadow-sm"
                  >
                    <Award className="mr-1.5 h-3 w-3" />
                    <span className="text-xs">View Certificate</span>
                    <ExternalLink className="ml-1 h-2.5 w-2.5 opacity-60 group-hover/cert:opacity-100 transition-transform group-hover/cert:translate-x-0.5" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full h-8 text-muted-foreground/50 bg-muted/20 border-muted-foreground/20 font-medium cursor-not-allowed"
                >
                  <Award className="mr-1.5 h-3 w-3 opacity-30" />
                  <span className="text-xs">No Certificate</span>
                </Button>
              )}
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </Card>
      </div>
    )
  }
)

ExperienceFocusCard.displayName = 'ExperienceFocusCard'

export function ExperienceFocusCards({
  experiences,
  startIndex,
  isMobile,
}: {
  experiences: Experience[]
  startIndex: number
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="mx-auto mt-12 max-w-7xl">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 auto-rows-fr">
        {experiences.map((exp, index) => (
          <div key={exp.inline?.id || exp.inline.id} className="min-h-[650px] flex">
            <ExperienceFocusCard
              exp={exp}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              startIndex={startIndex}
              isMobile={isMobile}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
