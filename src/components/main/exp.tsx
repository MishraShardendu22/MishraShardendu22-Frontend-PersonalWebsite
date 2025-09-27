import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Experience } from '@/data/types.data'
import { ExperienceFocusCards } from '../ui/focus-cards-exp'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
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

  if (!experiences.length) {
    return (
      <section className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="text-center text-foreground/60">No experiences available</div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Badge
              variant="outline"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <Briefcase
                className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary"
                aria-hidden="true"
              />
              Professional Journey
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Work
            </span>{' '}
            <span className="text-foreground">Experience</span>
          </h1>

          <div
            className="mx-auto w-16 sm:w-24 lg:w-32 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg mb-6 sm:mb-8"
            aria-hidden="true"
          />

          <div className="max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8">
            <p className="text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-foreground/80 font-medium">
              My professional journey and contributions across different organizations, showcasing
              growth and expertise in various domains
            </p>
          </div>

          {experiences.length > 0 && (
            <div className="text-sm sm:text-base text-foreground/70 font-medium">
              Showing {startIndex + 1}-{Math.min(endIndex, experiences.length)} of{' '}
              {experiences.length} experiences
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

              <div className="sm:hidden space-y-4">
                <div className="text-center">
                  <span className="text-sm text-foreground/70 font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={prevPage}
                    variant="outline"
                    size="sm"
                    className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[140px] backdrop-blur-sm"
                    disabled={currentPage === 0}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft
                      className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">Previous</span>
                  </Button>

                  <Button
                    onClick={nextPage}
                    variant="outline"
                    size="sm"
                    className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[140px] backdrop-blur-sm"
                    disabled={currentPage === totalPages - 1}
                    aria-label="Go to next page"
                  >
                    <span className="text-sm font-medium">Next</span>
                    <ChevronRight
                      className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Button>
                </div>

                {totalPages <= 7 && (
                  <div className="flex items-center justify-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={cn(
                          'w-9 h-9 rounded-full font-semibold transition-all duration-300 text-sm flex items-center justify-center',
                          currentPage === i
                            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105'
                            : 'bg-card/50 hover:bg-primary/5 border border-primary/20 hover:border-primary/40 text-foreground/70 hover:text-primary backdrop-blur-sm'
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
                  Explore All Experiences
                </h3>
                <p className="text-sm sm:text-base text-foreground/70">
                  View detailed information about all {experiences.length} professional experiences
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/experiences" className="block">
                  <Button
                    size={isMobile ? 'default' : 'lg'}
                    className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 min-w-[140px] sm:min-w-[160px]"
                  >
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
