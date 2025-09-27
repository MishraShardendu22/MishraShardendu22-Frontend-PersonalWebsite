'use client'

import { useMemo, useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Experience, VolunteerExperience } from '@/data/types.data'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Briefcase,
  Heart,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Clock,
  Building,
  Users,
} from 'lucide-react'

interface CombinedTimelineProps {
  experiences: Experience[]
  volunteerExperiences: VolunteerExperience[]
}

interface ProcessedExperience {
  type: 'work' | 'volunteer'
  name: string
  logo: string
  position: string
  start_date: string
  end_date: string
  startMonth: Date
  endMonth: Date
  description?: string
  technologies?: string[]
}

const CombinedTimeline = ({
  experiences,
  volunteerExperiences: volunteerExpProps,
}: CombinedTimelineProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const processedData = useMemo(() => {
    const allExperiences: ProcessedExperience[] = []

    experiences.forEach((exp) => {
      exp.experience_time_line.forEach((timeline) => {
        const startDate = new Date(timeline.start_date)
        const endDate = timeline.end_date ? new Date(timeline.end_date) : new Date()

        allExperiences.push({
          type: 'work',
          name: exp.company_name,
          logo: exp.company_logo || '',
          position: timeline.position,
          start_date: timeline.start_date,
          end_date: timeline.end_date || '',
          startMonth: startDate,
          endMonth: endDate,
          description: exp.description,
          technologies: exp.technologies,
        })
      })
    })

    volunteerExpProps.forEach((exp) => {
      exp.volunteer_time_line.forEach((timeline) => {
        const startDate = new Date(timeline.start_date)
        const endDate = timeline.end_date ? new Date(timeline.end_date) : new Date()

        allExperiences.push({
          type: 'volunteer',
          name: exp.organisation,
          logo: exp.organisation_logo || '',
          position: timeline.position,
          start_date: timeline.start_date,
          end_date: timeline.end_date || '',
          startMonth: startDate,
          endMonth: endDate,
          description: exp.description,
          technologies: exp.technologies,
        })
      })
    })

    allExperiences.sort((a, b) => b.startMonth.getTime() - a.startMonth.getTime())

    const earliestStart =
      allExperiences.length > 0
        ? new Date(Math.min(...allExperiences.map((exp) => exp.startMonth.getTime())))
        : new Date()

    const latestEnd = new Date()

    const months: Array<{
      date: Date
      year: number
      month: number
      monthName: string
      isYearStart: boolean
    }> = []

    const current = new Date(earliestStart.getFullYear(), earliestStart.getMonth(), 1)
    while (current <= latestEnd) {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      months.push({
        date: new Date(current),
        year: current.getFullYear(),
        month: current.getMonth(),
        monthName: monthNames[current.getMonth()],
        isYearStart: current.getMonth() === 0,
      })
      current.setMonth(current.getMonth() + 1)
    }

    return { allExperiences, months, earliestStart, latestEnd }
  }, [experiences, volunteerExpProps])

  const getMonthPosition = (date: Date) => {
    const monthIndex = processedData.months.findIndex(
      (m) => m.date.getFullYear() === date.getFullYear() && m.date.getMonth() === date.getMonth()
    )
    return monthIndex >= 0 ? monthIndex * (isMobile ? 80 : 120) + 24 : 24
  }

  const getExperiencePosition = (exp: ProcessedExperience) => {
    const startPos = getMonthPosition(exp.startMonth)
    const endPos = getMonthPosition(exp.endMonth)
    const minWidth = isMobile ? 80 : 120

    return {
      left: startPos,
      width: Math.max(endPos - startPos + (isMobile ? 80 : 120), minWidth),
    }
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollTo = Math.max(0, container.scrollWidth - container.clientWidth - 200)
      container.scrollLeft = scrollTo
    }
  }, [])

  const arrangeExperiences = () => {
    const workExperiences: ProcessedExperience[] = []
    const volunteerExperiences: ProcessedExperience[] = []

    processedData.allExperiences.forEach((exp) => {
      if (exp.type === 'work') {
        workExperiences.push(exp)
      } else {
        volunteerExperiences.push(exp)
      }
    })

    return { workExperiences, volunteerExperiences }
  }

  const { workExperiences, volunteerExperiences } = arrangeExperiences()

  const getCompanyColor = (companyName: string, type: 'work' | 'volunteer') => {
    const colors =
      type === 'work'
        ? ['#3B82F6', '#1D4ED8', '#2563EB', '#1E40AF', '#312E81', '#4338CA', '#4F46E5', '#6366F1']
        : ['#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#0F766E', '#0D9488', '#14B8A6']

    let hash = 0
    for (let i = 0; i < companyName.length; i++) {
      hash = companyName.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 300 : 500
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (processedData.allExperiences.length === 0) {
    return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-foreground">Experience </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Timeline
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">No experiences available to display.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Professional Timeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">Experience </span>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Timeline
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Journey through professional work and volunteer experiences
          </p>
        </div>

        <div className="relative max-w-full overflow-hidden">
          {!isMobile && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/10 transition-all duration-300"
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg hover:shadow-xl hover:bg-primary/10 transition-all duration-300"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-visible pb-4 pt-4 mx-4 lg:mx-8 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-muted/20 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/70"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--primary) var(--muted)',
              scrollBehavior: 'smooth',
            }}
          >
            <div
              className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 pb-16 shadow-lg"
              style={{
                width: `${Math.max(processedData.months.length * (isMobile ? 80 : 120), 800)}px`,
                minWidth: '100%',
                height: 'auto',
                maxHeight: 'none',
              }}
            >
              <div className="absolute top-20 left-6 right-6 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full shadow-sm" />

              <div className="relative h-16 mb-8 overflow-visible">
                {processedData.months.map((month, index) => (
                  <div
                    key={`${month.year}-${month.month}`}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${index * (isMobile ? 80 : 120)}px`,
                      width: `${isMobile ? 80 : 120}px`,
                    }}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-card shadow-sm z-10 ${
                        month.isYearStart ? 'bg-secondary' : 'bg-primary'
                      }`}
                    />

                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs sm:text-sm font-medium ${
                          month.isYearStart ? 'text-secondary' : 'text-primary'
                        }`}
                      >
                        {month.monthName}
                      </div>
                      {month.isYearStart && (
                        <div className="text-xs text-muted-foreground font-bold mt-1">
                          {month.year}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {workExperiences.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">Work Experience</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute top-8 left-6 right-6 h-0.5 bg-primary/20 rounded-full" />

                    {workExperiences.map((exp, index) => {
                      const position = getExperiencePosition(exp)
                      const companyColor = getCompanyColor(exp.name, 'work')
                      const expId = `work-${index}`
                      const isHovered = hoveredCard === expId

                      return (
                        <div
                          key={expId}
                          className="relative"
                          style={{
                            marginBottom: index < workExperiences.length - 1 ? '2rem' : '0',
                          }}
                        >
                          <div
                            className="absolute transition-all duration-300"
                            style={{
                              left: `${position.left + position.width / 2 - 24}px`,
                              top: '-12px',
                              zIndex: 20,
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-full border-3 border-card bg-card shadow-lg
                              flex items-center justify-center cursor-pointer
                              transition-all duration-300 hover:scale-125 hover:shadow-2xl
                              ${isHovered ? 'scale-125 shadow-2xl ring-2 ring-primary/20' : ''}
                            `}
                              style={{ borderColor: companyColor }}
                            >
                              {exp.logo ? (
                                <Image
                                  src={exp.logo}
                                  alt={exp.name}
                                  width={32}
                                  height={32}
                                  className="object-contain rounded-full"
                                />
                              ) : (
                                <Building className="w-6 h-6" style={{ color: companyColor }} />
                              )}
                            </div>

                            <div
                              className={`
                              absolute top-14 left-1/2 -translate-x-1/2 
                              px-3 py-2 bg-card/95 backdrop-blur-sm border border-border/50 
                              rounded-lg shadow-xl text-xs font-medium whitespace-nowrap
                              transition-all duration-300 z-50
                              ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
                            `}
                              style={{ zIndex: 1000 }}
                            >
                              <div className="font-semibold text-foreground">{exp.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {exp.position}
                              </div>

                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card/95 border-l border-t border-border/50 rotate-45"></div>
                            </div>
                          </div>

                          <div
                            className="absolute top-8 h-1 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                              backgroundColor: companyColor,
                              height: isHovered ? '6px' : '4px',
                              top: isHovered ? '6px' : '7px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm"
                              style={{ backgroundColor: companyColor }}
                            />

                            <div
                              className={`
                                absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm
                                ${!exp.end_date ? 'animate-pulse' : ''}
                              `}
                              style={{ backgroundColor: companyColor }}
                            />
                          </div>

                          <div
                            className="absolute top-12 text-xs text-muted-foreground text-center"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                            }}
                          >
                            {exp.startMonth.toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            -
                            {exp.end_date
                              ? exp.endMonth.toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Present'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {volunteerExperiences.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
                      <Heart className="w-5 h-5 text-secondary" />
                      <span className="font-semibold text-secondary">Volunteer Experience</span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute top-8 left-6 right-6 h-0.5 bg-secondary/20 rounded-full" />

                    {volunteerExperiences.map((exp, index) => {
                      const position = getExperiencePosition(exp)
                      const companyColor = getCompanyColor(exp.name, 'volunteer')
                      const expId = `volunteer-${index}`
                      const isHovered = hoveredCard === expId

                      return (
                        <div
                          key={expId}
                          className="relative"
                          style={{
                            marginBottom: index < volunteerExperiences.length - 1 ? '2rem' : '0',
                          }}
                        >
                          <div
                            className="absolute transition-all duration-300"
                            style={{
                              left: `${position.left + position.width / 2 - 24}px`,
                              top: '-12px',
                              zIndex: 20,
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-full border-3 border-card bg-card shadow-lg
                              flex items-center justify-center cursor-pointer
                              transition-all duration-300 hover:scale-125 hover:shadow-2xl
                              ${isHovered ? 'scale-125 shadow-2xl ring-2 ring-secondary/20' : ''}
                            `}
                              style={{ borderColor: companyColor }}
                            >
                              {exp.logo ? (
                                <Image
                                  src={exp.logo}
                                  alt={exp.name}
                                  width={32}
                                  height={32}
                                  className="object-contain rounded-full"
                                />
                              ) : (
                                <Heart className="w-6 h-6" style={{ color: companyColor }} />
                              )}
                            </div>

                            <div
                              className={`
                              absolute top-14 left-1/2 -translate-x-1/2 
                              px-3 py-2 bg-card/95 backdrop-blur-sm border border-border/50 
                              rounded-lg shadow-xl text-xs font-medium whitespace-nowrap
                              transition-all duration-300 z-50
                              ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
                            `}
                              style={{ zIndex: 1000 }}
                            >
                              <div className="font-semibold text-foreground">{exp.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {exp.position}
                              </div>

                              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card/95 border-l border-t border-border/50 rotate-45"></div>
                            </div>
                          </div>

                          <div
                            className="absolute top-8 h-1 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                              backgroundColor: companyColor,
                              height: isHovered ? '6px' : '4px',
                              top: isHovered ? '6px' : '7px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm"
                              style={{ backgroundColor: companyColor }}
                            />

                            <div
                              className={`
                                absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm
                                ${!exp.end_date ? 'animate-pulse' : ''}
                              `}
                              style={{ backgroundColor: companyColor }}
                            />
                          </div>

                          <div
                            className="absolute top-12 text-xs text-muted-foreground text-center"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                            }}
                          >
                            {exp.startMonth.toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            -
                            {exp.end_date
                              ? exp.endMonth.toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Present'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground">
              {isMobile
                ? '← Swipe to explore timeline →'
                : '← Scroll horizontally to explore timeline →'}
            </p>
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Timeline Legend</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20 w-full max-w-xs">
                  <div className="w-10 h-10 rounded-full border-2 border-primary bg-card shadow-md flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="font-medium text-foreground text-sm">Work Experience</div>
                    <div className="text-xs text-muted-foreground">Professional roles</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20 w-full max-w-xs">
                  <div className="w-10 h-10 rounded-full border-2 border-secondary bg-card shadow-md flex items-center justify-center">
                    <Heart className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="font-medium text-foreground text-sm">Volunteer Work</div>
                    <div className="text-xs text-muted-foreground">Community service</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"></div>
                    <span>Timeline flows from most recent to earliest</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Scroll horizontally to explore full timeline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CombinedTimeline
