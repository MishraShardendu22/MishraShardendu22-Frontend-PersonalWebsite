'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Dribbble } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Project } from '@/data/types.data'
import { projectsAPI } from '@/util/apiResponse.util'
import { EmptyState, ErrorState, LoadingState } from './Load-Error'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import ProjectGrid from './project-grid'
import ProjectPagination from './project-pagination'

export default function ProjectPageContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6
  const [selectedSkill, setSelectedSkill] = useState<string>('__all__')
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = (searchParams?.get('name_has') ?? '').toLowerCase() || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const allSkills = Array.from(new Set(projects.flatMap((p) => p.skills)))

  const filteredProjects = projects.filter((project) => {
    const matchesSkill = selectedSkill !== '__all__' ? project.skills.includes(selectedSkill) : true
    const matchesName = project.project_name.toLowerCase().includes(searchTerm)
    return matchesSkill && matchesName
  })

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  const transformedProjects = currentProjects.map((project) => ({
    title: project.project_name,
    description: project.small_description,
    link: `/projects/${project.inline?.id || project.inline.id}`,
    skills: project.skills,
    repository: project.project_repository,
    liveLink: project.project_live_link,
    video: project.project_video,
  }))

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAllProjects()
        const projectsData = Array.isArray(response.data) ? response.data : []
        const sortedProjects = projectsData.sort((a, b) => a.order - b.order)
        setProjects(sortedProjects)
      } catch (err) {
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set('name_has', value)
    } else {
      params.delete('name_has')
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
                  <Dribbble className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
                    Projects
                  </h1>
                </div>

                <div className="hidden md:flex lg:flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">{projects.length}</span>
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-9 sm:h-10 w-full border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors bg-background/50 text-sm"
              />
            </div>

            <div className="flex-shrink-0 hidden lg:block">
              {totalPages > 1 && (
                <ProjectPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredProjects.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 max-w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:justify-center gap-3 sm:gap-4">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm">
                <SelectValue placeholder="Filter by Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Skills</SelectItem>
                {allSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedSkill !== '__all__' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSkill('__all__')}
                className="h-9 w-full sm:w-auto text-sm"
              >
                Clear Filters
              </Button>
            )}

            <div className="md:hidden flex items-center gap-2 sm:gap-3 text-xs sm:text-sm w-full sm:w-auto justify-center">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">{projects.length}</span>
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
          {projects.length === 0 ? (
            <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
              <EmptyState />
            </div>
          ) : (
            <div className="mb-6 sm:mb-8">
              <ProjectGrid
                items={transformedProjects}
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 border-t border-border/30 text-xs sm:text-sm text-muted-foreground gap-3 sm:gap-0">
            <p>
              Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
            <p className="text-xs text-center sm:text-left">
              A curated collection of my latest work and contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
