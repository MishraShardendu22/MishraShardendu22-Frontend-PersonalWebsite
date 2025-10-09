import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { VolunteerExperience } from '@/data/types.data'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Heart, Users, HandHeart } from 'lucide-react'
import { ExperienceFocusCards } from '../ui/focus-cards-vol'

interface VolunteerExperienceSectionProps {
  experiences: VolunteerExperience[]
}

export default function VolunteerExperienceSection({
  experiences,
}: VolunteerExperienceSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1
    return 2
  }

  const itemsPerPage = getItemsPerPage()
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  const { currentPageExperiences, startIndex, endIndex } = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, experiences.length)
    const currentPageExperiences = experiences.slice(startIndex, endIndex)

    return { currentPageExperiences, startIndex, endIndex }
  }, [experiences, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1)
  }, [currentPage, totalPages])

  const prevPage = useCallback(() => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1)
  }, [currentPage])

  const getVisiblePageNumbers = useCallback(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    const pages = []
    const delta = 1

    pages.push(0)

    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages - 2, currentPage + delta)

    if (start > 1) {
      pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      if (i !== 0 && i !== totalPages - 1) {
        pages.push(i)
      }
    }

    if (end < totalPages - 2) {
      pages.push('...')
    }

    if (totalPages > 1) {
      pages.push(totalPages - 1)
    }

    return pages
  }, [totalPages, currentPage])

  const isMobile = windowWidth < 640

  const volunteerStats = useMemo(() => {
    const totalOrganizations = new Set(experiences.map((exp) => exp.organisation)).size
    const totalProjects = experiences.reduce(
      (sum, exp) => sum + (exp.projects?.length || 0) + (exp.images?.length || 0),
      0
    )
    const totalTechnologies = new Set(experiences.flatMap((exp) => exp.technologies || [])).size
    const totalPositions = experiences.reduce(
      (sum, exp) => sum + (exp.volunteer_time_line?.length || 0),
      0
    )

    return {
      organizations: totalOrganizations,
      projects: totalProjects,
      technologies: totalTechnologies,
      positions: totalPositions,
    }
  }, [experiences])

  if (!experiences.length) {
    return (
      <section className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <HandHeart className="mx-auto h-16 w-16 text-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground/70 mb-2">
            No Volunteer Experiences
          </h3>
          <p className="text-foreground/60">
            Check back later for community contributions and volunteer work.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
          'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Badge
              variant="outline"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <Heart
                className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary"
                aria-hidden="true"
              />
              Community Impact & Service
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Volunteer
            </span>{' '}
            <span className="text-foreground">Experience</span>
          </h1>

          <div
            className="mx-auto w-16 sm:w-24 lg:w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg mb-6 sm:mb-8"
            aria-hidden="true"
          />

          <div className="max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8">
            <p className="text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-foreground/80 font-medium">
              My journey of giving back to the community through volunteer work and leadership roles
              across various organizations, fostering growth and making meaningful impact.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {volunteerStats.organizations}
                </div>
                <div className="text-xs sm:text-sm text-blue-600/80 dark:text-blue-400/80 font-medium">
                  Organization{volunteerStats.organizations !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                  {volunteerStats.positions}
                </div>
                <div className="text-xs sm:text-sm text-green-600/80 dark:text-green-400/80 font-medium">
                  Position{volunteerStats.positions !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {volunteerStats.projects}
                </div>
                <div className="text-xs sm:text-sm text-purple-600/80 dark:text-purple-400/80 font-medium">
                  Project{volunteerStats.projects !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-800/30">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {volunteerStats.technologies}
                </div>
                <div className="text-xs sm:text-sm text-orange-600/80 dark:text-orange-400/80 font-medium">
                  Tech{volunteerStats.technologies !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {experiences.length > 0 && (
            <div className="text-sm sm:text-base text-foreground/70 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, experiences.length)} of{' '}
              {experiences.length} volunteer experience{experiences.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="hidden sm:flex items-center justify-center gap-4 lg:gap-6">
                <Button
                  onClick={prevPage}
                  variant="outline"
                  size="default"
                  className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 min-w-[110px] backdrop-blur-sm shadow-sm hover:shadow-md"
                  disabled={currentPage === 0}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">Previous</span>
                </Button>

                {totalPages <= 10 && (
                  <div className="flex items-center gap-2">
                    {getVisiblePageNumbers().map((pageNum, index) => {
                      if (pageNum === '...') {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="w-10 h-10 flex items-center justify-center text-sm text-foreground/50 font-medium"
                            aria-hidden="true"
                          >
                            ...
                          </span>
                        )
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum as number)}
                          className={cn(
                            'w-10 h-10 rounded-full font-semibold transition-all duration-300 text-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                              : 'bg-card/50 hover:bg-primary/5 border border-primary/20 hover:border-primary/40 text-foreground/70 hover:text-primary hover:scale-105 backdrop-blur-sm'
                          )}
                          aria-label={`Go to page ${(pageNum as number) + 1}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {(pageNum as number) + 1}
                        </button>
                      )
                    })}
                  </div>
                )}

                <Button
                  onClick={nextPage}
                  variant="outline"
                  size="default"
                  className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 min-w-[110px] backdrop-blur-sm shadow-sm hover:shadow-md"
                  disabled={currentPage === totalPages - 1}
                  aria-label="Go to next page"
                >
                  <span className="text-sm font-medium">Next</span>
                  <ChevronRight
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </div>

              <div className="sm:hidden space-y-5 px-4">
                <div className="text-center bg-card/30 rounded-lg py-2 border border-border/50">
                  <span className="text-sm text-foreground/80 font-semibold">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={prevPage}
                    variant="outline"
                    size="lg"
                    className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[160px] backdrop-blur-sm h-12 touch-manipulation"
                    disabled={currentPage === 0}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft
                      className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-base font-semibold">Previous</span>
                  </Button>

                  <Button
                    onClick={nextPage}
                    variant="outline"
                    size="lg"
                    className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[160px] backdrop-blur-sm h-12 touch-manipulation"
                    disabled={currentPage === totalPages - 1}
                    aria-label="Go to next page"
                  >
                    <span className="text-base font-semibold">Next</span>
                    <ChevronRight
                      className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Button>
                </div>

                {totalPages <= 7 && (
                  <div className="flex items-center justify-center gap-2 pb-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={cn(
                          'w-11 h-11 rounded-full font-bold transition-all duration-300 text-base flex items-center justify-center touch-manipulation',
                          currentPage === i
                            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-110'
                            : 'bg-card/50 hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40 text-foreground/70 hover:text-primary backdrop-blur-sm hover:scale-105'
                        )}
                        aria-label={`Go to page ${i + 1}`}
                        aria-current={currentPage === i ? 'page' : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-16 sm:mb-20 lg:mb-24">
          <ExperienceFocusCards
            experiences={currentPageExperiences}
            startIndex={startIndex}
            isMobile={isMobile}
          />
        </div>

        {experiences.length > 2 && (
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-r from-card/80 via-card/90 to-card/80 rounded-2xl border border-border/50 backdrop-blur-sm shadow-xl max-w-lg sm:max-w-2xl mx-auto">
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Explore All My Volunteer Work
                </h3>
                <p className="text-sm sm:text-base text-foreground/70">
                  Discover detailed stories and impact from all {experiences.length} volunteer
                  experience{experiences.length !== 1 ? 's' : ''} across{' '}
                  {volunteerStats.organizations} organization
                  {volunteerStats.organizations !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/volunteer" className="block">
                  <Button
                    size={isMobile ? 'default' : 'lg'}
                    className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 min-w-[140px] sm:min-w-[160px]"
                  >
                    <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base font-semibold">View All</span>
                    <ArrowRight
                      className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
