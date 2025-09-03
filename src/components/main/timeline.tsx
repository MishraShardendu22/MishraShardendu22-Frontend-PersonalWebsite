'use client'

import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMemo, useRef, useEffect, useState } from 'react'
import { Experience, VolunteerExperience } from '@/data/types.data'
import { Briefcase, Heart, ArrowLeft, ArrowRight, Clock, Building } from 'lucide-react'

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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Combine and process all experiences
  const processedData = useMemo(() => {
    const allExperiences: ProcessedExperience[] = []

    // Process work experiences
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

    // Process volunteer experiences
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

    // Sort by start date (most recent first for better visibility)
    allExperiences.sort((a, b) => b.startMonth.getTime() - a.startMonth.getTime())

    // Calculate timeline range
    const earliestStart =
      allExperiences.length > 0
        ? new Date(Math.min(...allExperiences.map((exp) => exp.startMonth.getTime())))
        : new Date()

    const latestEnd = new Date()

    // Generate months array
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
    const baseSpacing = isMobile ? 80 : 120
    const leftPadding = isMobile ? 16 : 32
    return monthIndex >= 0 ? monthIndex * baseSpacing + leftPadding : leftPadding
  }

  const getExperiencePosition = (exp: ProcessedExperience) => {
    const startPos = getMonthPosition(exp.startMonth)
    const endPos = getMonthPosition(exp.endMonth)
    const minWidth = isMobile ? 80 : 120
    const baseSpacing = isMobile ? 80 : 120

    return {
      left: startPos,
      width: Math.max(endPos - startPos + baseSpacing, minWidth),
    }
  }

  // Check scroll capabilities
  const checkScrollCapabilities = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  // Auto-scroll to show recent timeline on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollTo = Math.max(0, container.scrollWidth - container.clientWidth - 100)
      container.scrollLeft = scrollTo
      checkScrollCapabilities()
    }
  }, [processedData])

  // Group experiences by rows to avoid overlap - now separate by type
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

  // Generate unique colors for each company
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
      const scrollAmount = isMobile ? 200 : 400
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })

      // Update scroll capabilities after animation
      setTimeout(checkScrollCapabilities, 300)
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

  // Calculate improved container width with proper padding
  const containerWidth = Math.max(
    processedData.months.length * (isMobile ? 80 : 120) + (isMobile ? 120 : 200),
    800
  )

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
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

        {/* Timeline Container */}
        <div className="relative max-w-full overflow-hidden">
          {/* Navigation Buttons - Improved positioning */}
          {!isMobile && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`
                  absolute left-0 top-1/2 transform -translate-y-1/2 z-30 p-3 
                  bg-card/95 backdrop-blur-sm border border-border/50 rounded-full shadow-lg 
                  transition-all duration-300
                  ${
                    canScrollLeft
                      ? 'hover:shadow-xl hover:bg-primary/10 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                aria-label="Scroll left"
              >
                <ArrowLeft
                  className={`w-5 h-5 ${canScrollLeft ? 'text-foreground' : 'text-muted-foreground'}`}
                />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`
                  absolute right-0 top-1/2 transform -translate-y-1/2 z-30 p-3 
                  bg-card/95 backdrop-blur-sm border border-border/50 rounded-full shadow-lg 
                  transition-all duration-300
                  ${
                    canScrollRight
                      ? 'hover:shadow-xl hover:bg-primary/10 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }
                `}
                aria-label="Scroll right"
              >
                <ArrowRight
                  className={`w-5 h-5 ${canScrollRight ? 'text-foreground' : 'text-muted-foreground'}`}
                />
              </button>
            </>
          )}

          {/* Fade gradients for scroll indication */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/80 to-transparent z-20 pointer-events-none" />

          {/* Scrollable timeline container - UPDATED FOR HORIZONTAL ONLY SCROLLING */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-4 mx-8 lg:mx-12"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--border-strong) var(--background)',
              height: 'auto',
              maxHeight: 'fit-content',
            }}
            onScroll={checkScrollCapabilities}
          >
            <div
              className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg"
              style={{
                width: `${containerWidth}px`,
                minWidth: '100%',
                height: 'fit-content',
              }}
            >
              {/* Main timeline line */}
              <div
                className="absolute top-20 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full shadow-sm"
                style={{
                  left: `${isMobile ? 16 : 32}px`,
                  right: `${isMobile ? 60 : 100}px`,
                }}
              />

              {/* Month markers */}
              <div className="relative h-16 mb-8 overflow-visible">
                {processedData.months.map((month, index) => (
                  <div
                    key={`${month.year}-${month.month}`}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${index * (isMobile ? 80 : 120) + (isMobile ? 16 : 32)}px`,
                      width: `${isMobile ? 80 : 120}px`,
                    }}
                  >
                    {/* Month dot */}
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-card shadow-sm z-10 ${
                        month.isYearStart ? 'bg-secondary' : 'bg-primary'
                      }`}
                    />

                    {/* Month label */}
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

              {/* Work Experience Track */}
              {workExperiences.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-primary">Work Experience</span>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Base timeline line for work */}
                    <div
                      className="absolute top-8 h-0.5 bg-primary/20 rounded-full"
                      style={{
                        left: `${isMobile ? 16 : 32}px`,
                        right: `${isMobile ? 60 : 100}px`,
                      }}
                    />

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
                          {/* Company logo/icon above timeline */}
                          <div
                            className="absolute z-10 transition-all duration-300"
                            style={{
                              left: `${Math.min(position.left + position.width / 2 - 24, containerWidth - 60)}px`,
                              top: '-12px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-full border-3 border-card bg-card shadow-lg
                              flex items-center justify-center cursor-pointer
                              transition-all duration-300 hover:scale-110
                              ${isHovered ? 'scale-110 shadow-xl' : ''}
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

                            {/* Company name label */}
                            <div
                              className={`
                              absolute top-14 left-1/2 -translate-x-1/2 
                              px-2 py-1 bg-card/95 backdrop-blur-sm border border-border/50 
                              rounded-md shadow-lg text-xs font-medium whitespace-nowrap
                              transition-all duration-200 max-w-[200px]
                              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                            `}
                            >
                              <div className="truncate">{exp.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {exp.position}
                              </div>
                            </div>
                          </div>

                          {/* Experience line */}
                          <div
                            className="absolute top-8 h-1 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                              left: `${position.left}px`,
                              width: `${Math.min(position.width, containerWidth - position.left - (isMobile ? 60 : 100))}px`,
                              backgroundColor: companyColor,
                              height: isHovered ? '6px' : '4px',
                              top: isHovered ? '6px' : '7px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            {/* Start marker */}
                            <div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm"
                              style={{ backgroundColor: companyColor }}
                            />

                            {/* End marker */}
                            <div
                              className={`
                                absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm
                                ${!exp.end_date ? 'animate-pulse' : ''}
                              `}
                              style={{ backgroundColor: companyColor }}
                            />
                          </div>

                          {/* Duration label below */}
                          <div
                            className="absolute top-12 text-xs text-muted-foreground text-center"
                            style={{
                              left: `${position.left}px`,
                              width: `${Math.min(position.width, containerWidth - position.left - (isMobile ? 60 : 100))}px`,
                            }}
                          >
                            <div className="truncate">
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
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Volunteer Experience Track */}
              {volunteerExperiences.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="mt-6 flex items-center space-x-3 px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
                      <Heart className="w-5 h-5 text-secondary" />
                      <span className="font-semibold text-secondary">Volunteer Experience</span>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Base timeline line for volunteer */}
                    <div
                      className="absolute top-8 h-0.5 bg-secondary/20 rounded-full"
                      style={{
                        left: `${isMobile ? 16 : 32}px`,
                        right: `${isMobile ? 60 : 100}px`,
                      }}
                    />

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
                          {/* Organization logo/icon above timeline */}
                          <div
                            className="absolute z-10 transition-all duration-300"
                            style={{
                              left: `${Math.min(position.left + position.width / 2 - 24, containerWidth - 60)}px`,
                              top: '-12px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-full border-3 border-card bg-card shadow-lg
                              flex items-center justify-center cursor-pointer
                              transition-all duration-300 hover:scale-110
                              ${isHovered ? 'scale-110 shadow-xl' : ''}
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

                            {/* Organization name label */}
                            <div
                              className={`
                              absolute top-14 left-1/2 -translate-x-1/2 
                              px-2 py-1 bg-card/95 backdrop-blur-sm border border-border/50 
                              rounded-md shadow-lg text-xs font-medium whitespace-nowrap
                              transition-all duration-200 max-w-[200px]
                              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
                            `}
                            >
                              <div className="truncate">{exp.name}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {exp.position}
                              </div>
                            </div>
                          </div>

                          {/* Experience line */}
                          <div
                            className="absolute top-8 h-1 rounded-full transition-all duration-300 cursor-pointer"
                            style={{
                              left: `${position.left}px`,
                              width: `${Math.min(position.width, containerWidth - position.left - (isMobile ? 60 : 100))}px`,
                              backgroundColor: companyColor,
                              height: isHovered ? '6px' : '4px',
                              top: isHovered ? '6px' : '7px',
                            }}
                            onMouseEnter={() => !isMobile && setHoveredCard(expId)}
                            onMouseLeave={() => !isMobile && setHoveredCard(null)}
                          >
                            {/* Start marker */}
                            <div
                              className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm"
                              style={{ backgroundColor: companyColor }}
                            />

                            {/* End marker */}
                            <div
                              className={`
                                absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-card shadow-sm
                                ${!exp.end_date ? 'animate-pulse' : ''}
                              `}
                              style={{ backgroundColor: companyColor }}
                            />
                          </div>

                          {/* Duration label below */}
                          <div
                            className="absolute top-12 text-xs text-muted-foreground text-center"
                            style={{
                              left: `${position.left}px`,
                              width: `${Math.min(position.width, containerWidth - position.left - (isMobile ? 60 : 100))}px`,
                            }}
                          >
                            <div className="truncate">
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
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              {!isMobile && canScrollLeft && <span>← Scroll left</span>}
              <span>
                {isMobile
                  ? '← Swipe to explore timeline →'
                  : 'Scroll horizontally to explore timeline'}
              </span>
              {!isMobile && canScrollRight && <span>Scroll right →</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Guide */}
      <div className="mt-16 pt-8 border-t border-border/30">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">Timeline Guide</h3>
          <p className="text-sm text-muted-foreground">
            Each track shows different experience types with unique colors per company
          </p>
        </div>

        <div
          className={`
          flex justify-center items-center gap-12
          ${isMobile ? 'flex-col gap-6' : ''}
        `}
        >
          {/* Work Experience Guide */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="w-16 h-1 bg-primary rounded-full" />
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm" />
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-card shadow-sm" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="w-8 h-8 rounded-full border-2 border-primary bg-card shadow-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium text-foreground">Work Experience</div>
              <div className="text-xs text-muted-foreground">Professional roles and positions</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="w-16 h-1 bg-secondary rounded-full" />
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary rounded-full border-2 border-card shadow-sm" />
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary rounded-full border-2 border-card shadow-sm" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="w-8 h-8 rounded-full border-2 border-secondary bg-card shadow-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-secondary" />
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium text-foreground">Volunteer Experience</div>
              <div className="text-xs text-muted-foreground">
                Community service and contributions
              </div>
            </div>
          </div>

          {/* Ongoing indicator */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="w-4 h-4 bg-accent rounded-full border-2 border-card shadow-sm animate-pulse" />
            </div>
            <div>
              <div className="font-medium text-foreground">Ongoing</div>
              <div className="text-xs text-muted-foreground">Currently active</div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          Each company/organization has a unique color within its track. Hover over logos for
          details.
        </div>
      </div>
    </section>
  )
}

export default CombinedTimeline
