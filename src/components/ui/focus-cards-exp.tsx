'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Badge } from './badge'
import { Button } from './button'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Experience } from '@/data/types.data'
import { Card, CardDescription, CardTitle } from './card'
import { Award, ArrowRight, Building2, Calendar, ExternalLink } from 'lucide-react'

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
    // Get the latest position from experience timeline
    const latestPosition = exp.experience_time_line?.[exp.experience_time_line.length - 1]
    const earliestPosition = exp.experience_time_line?.[0]

    // Hydration-safe date rendering
    const [dateRange, setDateRange] = useState<string>('')
    const [durationText, setDurationText] = useState<string>('')

    React.useEffect(() => {
      if (!earliestPosition?.start_date || !latestPosition?.end_date) return;
      const startDate = new Date(earliestPosition.start_date)
      const endDate = new Date(latestPosition.end_date)
      // Use fixed locale and options for consistency
      const startStr = startDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
      const endStr = endDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
      setDateRange(`${startStr} - ${endStr}`)
      const monthsDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      const years = Math.floor(monthsDiff / 12)
      const months = monthsDiff % 12
      setDurationText(years > 0 ? `${years}y${months > 0 ? ` ${months}m` : ''}`.trim() : `${months}m`)
    }, [earliestPosition?.start_date, latestPosition?.end_date])

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          'transition-all duration-300 ease-out',
          hovered !== null && hovered !== index && 'blur-sm scale-[0.98] opacity-70'
        )}
      >
        <Card className="group relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100 h-[450px]">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Experience number badge */}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-lg border border-primary/20">
            {String(startIndex + index + 1).padStart(2, '0')}
          </div>

          <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col">
            {/* Header Section - Fixed height with better spacing */}
            <div className="flex-shrink-0 h-[140px] pr-10 sm:pr-12 space-y-3">
              {/* Company info */}
              <div className="flex items-center space-x-3">
                {exp.company_logo && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-background border border-border/50 flex-shrink-0">
                    <img 
                      src={exp.company_logo} 
                      alt={`${exp.company_name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary/60" />
                    </div>
                  </div>
                )}
                <CardDescription className="font-semibold text-sm sm:text-base text-foreground/80 truncate">
                  {exp.company_name}
                </CardDescription>
              </div>

              {/* Position title */}
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2 min-h-[2.5rem]">
                {latestPosition?.position || 'Position Not Specified'}
              </CardTitle>

              {/* Date and duration */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs sm:text-sm text-foreground/60 bg-secondary/5 px-2 py-1.5 rounded border border-secondary/20">
                  <Calendar className="mr-1.5 h-3 w-3 text-primary/60 flex-shrink-0" />
                  <span className="text-xs">
                    {dateRange || '—'}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/8 text-primary font-medium border-primary/20">
                  {durationText || '—'}
                </Badge>
              </div>
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-border/50 my-4"></div>

            {/* Content Section - Fixed height with clear boundaries */}
            <div className="flex-1 min-h-0 space-y-4">
              {/* Description section with clear boundary */}
              <div className="space-y-2">
                <div className="h-[90px] overflow-hidden">
                  <div className="text-foreground/80 leading-relaxed text-xs sm:text-sm">
                    <div className="prose-md">
                      <ReactMarkdown>
                        {isMobile && exp.description.length > 120
                          ? `${exp.description.substring(0, 120)}...`
                          : exp.description.length > 150
                            ? `${exp.description.substring(0, 150)}...`
                            : exp.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies section with clear boundary */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground/70">Technologies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.slice(0, isMobile ? 3 : 4).map((tech, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors font-medium"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {exp.technologies.length > (isMobile ? 3 : 4) && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors font-medium"
                    >
                      +{exp.technologies.length - (isMobile ? 3 : 4)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-border/50 my-4"></div>

            {/* Actions - Fixed height */}
            <div className="flex-shrink-0 h-[70px] flex flex-col gap-2">
              <Link href={`/experiences/${exp.inline?.id || exp.inline.id}`} className="w-full">
                <Button
                  size="sm"
                  className="w-full h-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold group/btn"
                >
                  <span className="text-xs">View Details</span>
                  <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>

              {exp.certificate_url ? (
                <Link
                  href={exp.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-300 bg-primary/5 border-primary/30 hover:border-primary font-medium shadow-sm group/cert"
                  >
                    <Award className="mr-1.5 h-3 w-3" />
                    <span className="text-xs">Certificate</span>
                    <ExternalLink className="ml-1 h-2.5 w-2.5 opacity-60 group-hover/cert:opacity-100" />
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full h-8 text-muted-foreground bg-muted/30 border-muted-foreground/20 font-medium cursor-not-allowed"
                >
                  <Award className="mr-1.5 h-3 w-3 opacity-50" />
                  <span className="text-xs">No Certificate</span>
                </Button>
              )}
            </div>
          </div>
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
    <div className="mx-auto mt-12 sm:mt-20 lg:mt-24 max-w-7xl">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        {experiences.map((exp, index) => (
          <ExperienceFocusCard
            key={exp.inline?.id || exp.inline.id}
            exp={exp}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            startIndex={startIndex}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  )
}
