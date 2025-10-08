'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Experience } from '@/data/types.data'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { experiencesAPI } from '@/util/apiResponse.util'
import ExperienceGrid from '@/components/experience/grid'
import { useRouter, useSearchParams } from 'next/navigation'
import ExperiencePagination from '@/components/experience/pagination'
import { EmptyState, ErrorState, LoadingState } from '@/components/experience/load-error'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ExperiencePageContent() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const experiencesPerPage = 6
  const [selectedTech, setSelectedTech] = useState<string>('__all__')
  const [selectedCompany, setSelectedCompany] = useState<string>('__all__')
  const [selectedYear, setSelectedYear] = useState<string>('__all__')
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams?.get('search')?.toLowerCase() || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const allTechs = Array.from(new Set(experiences.flatMap((e) => e.technologies)))
  const allCompanies = Array.from(new Set(experiences.map((e) => e.company_name)))
  const allYears = Array.from(
    new Set(
      experiences.map((e) => {
        const latestTimeline = e.experience_time_line?.[e.experience_time_line.length - 1]
        return latestTimeline?.start_date
          ? new Date(latestTimeline.start_date).getFullYear().toString()
          : ''
      })
    )
  ).filter(Boolean)

  const filteredExperiences = experiences.filter((experience) => {
    const matchesTech =
      selectedTech !== '__all__' ? experience.technologies.includes(selectedTech) : true
    const matchesCompany =
      selectedCompany !== '__all__' ? experience.company_name === selectedCompany : true
    const matchesYear =
      selectedYear !== '__all__'
        ? (() => {
            const latestTimeline =
              experience.experience_time_line?.[experience.experience_time_line.length - 1]
            return (
              latestTimeline?.start_date &&
              new Date(latestTimeline.start_date).getFullYear().toString() === selectedYear
            )
          })()
        : true
    const matchesSearch =
      searchTerm === '' ||
      (() => {
        const latestTimeline =
          experience.experience_time_line?.[experience.experience_time_line.length - 1]
        const latestPosition = latestTimeline?.position ?? ''
        return (
          latestPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
          experience.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          experience.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })()

    return matchesTech && matchesCompany && matchesYear && matchesSearch
  })

  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage)
  const startIndex = (currentPage - 1) * experiencesPerPage
  const endIndex = startIndex + experiencesPerPage
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex)

  const transformedExperiences = currentExperiences.map((experience) => {
    const latestTimeline =
      experience.experience_time_line?.[experience.experience_time_line.length - 1]

    return {
      title: latestTimeline?.position ?? '',
      company: experience.company_name,
      companyLogo: experience.company_logo,
      description: experience.description,
      link: `/experiences/${experience.inline?.id || experience.inline.id}`,
      technologies: experience.technologies,
      certificateUrl: experience.certificate_url,
      startDate: latestTimeline?.start_date ?? '',
      endDate: latestTimeline?.end_date ?? '',
    }
  })

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experiencesAPI.getAllExperiences()
        setExperiences(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError('Failed to load experiences')
      } finally {
        setLoading(false)
      }
    }
    fetchExperiences()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`?${params.toString()}`)
  }

  if (loading) {
    return <LoadingState />
  }
  if (error) {
    toast.error(error, {
      style: { zIndex: 30 },
    })
    return <ErrorState error={error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 lg:gap-8">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0 w-full lg:w-auto">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 sm:gap-2 hover:bg-muted h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>

              <div className="flex items-center gap-2 sm:gap-4 flex-1 lg:flex-initial">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
                    Experience
                  </h1>
                </div>

                <div className="hidden md:flex lg:flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">{experiences.length}</span>
                    <span className="text-muted-foreground">Total</span>
                  </div>
                  <div className="w-px h-3 sm:h-4 bg-border" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-secondary">{currentPage}</span>
                    <span className="text-muted-foreground">of</span>
                    <span className="font-semibold text-secondary">{totalPages}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center w-full lg:w-auto lg:max-w-md">
              <Input
                type="text"
                placeholder="Search experiences..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 sm:h-10 w-full border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors bg-background/50 text-sm"
              />
            </div>

            <div className="flex-shrink-0 hidden lg:block">
              {totalPages > 1 && (
                <ExperiencePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredExperiences.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-center gap-3 sm:gap-4">
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Technologies</SelectItem>
                {allTechs.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 text-sm">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Companies</SelectItem>
                {allCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Years</SelectItem>
                {allYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedTech !== '__all__' ||
              selectedCompany !== '__all__' ||
              selectedYear !== '__all__') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedTech('__all__')
                  setSelectedCompany('__all__')
                  setSelectedYear('__all__')
                }}
                className="h-9 w-full sm:w-auto text-sm"
              >
                Clear Filters
              </Button>
            )}

            <div className="md:hidden flex items-center gap-2 sm:gap-3 text-xs sm:text-sm w-full sm:w-auto justify-center">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">{experiences.length}</span>
                <span className="text-muted-foreground">Total</span>
              </div>
              <div className="w-px h-3 sm:h-4 bg-border" />
              <div className="flex items-center gap-1">
                <span className="font-semibold text-secondary">{currentPage}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-semibold text-secondary">{totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-full">
          {experiences.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <EmptyState />
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="prose-md">
                  <ExperienceGrid
                    items={transformedExperiences}
                    className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  />
                </div>
              </div>

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="lg:hidden mb-8">
                  <div className="space-y-5 px-4">
                    <div className="text-center bg-card/30 rounded-lg py-2 border border-border/50">
                      <span className="text-sm text-foreground/80 font-semibold">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        variant="outline"
                        size="lg"
                        className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[160px] backdrop-blur-sm h-12 touch-manipulation"
                        disabled={currentPage === 1}
                        aria-label="Go to previous page"
                      >
                        <ChevronLeft
                          className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                          aria-hidden="true"
                        />
                        <span className="text-base font-semibold">Previous</span>
                      </Button>

                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        variant="outline"
                        size="lg"
                        className="group bg-card/50 hover:bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 flex-1 max-w-[160px] backdrop-blur-sm h-12 touch-manipulation"
                        disabled={currentPage === totalPages}
                        aria-label="Go to next page"
                      >
                        <span className="text-base font-semibold">Next</span>
                        <ChevronRight
                          className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>

                    {totalPages <= 5 && (
                      <div className="flex items-center justify-center gap-2 pb-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-11 h-11 rounded-full font-bold transition-all duration-300 text-base flex items-center justify-center touch-manipulation ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-110'
                                : 'bg-card/50 hover:bg-primary/5 border-2 border-primary/20 hover:border-primary/40 text-foreground/70 hover:text-primary backdrop-blur-sm hover:scale-105'
                            }`}
                            aria-label={`Go to page ${pageNum}`}
                            aria-current={currentPage === pageNum ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Pagination */}
              <div className="hidden lg:block mb-8">
                {totalPages > 1 && (
                  <ExperiencePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={filteredExperiences.length}
                  />
                )}
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-border/30 text-sm text-muted-foreground">
            <p>
              Showing {filteredExperiences.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredExperiences.length)} of {filteredExperiences.length}{' '}
              experiences
            </p>
            <p className="text-xs">Professional journey and work experience</p>
          </div>
        </div>
      </div>
    </div>
  )
}
