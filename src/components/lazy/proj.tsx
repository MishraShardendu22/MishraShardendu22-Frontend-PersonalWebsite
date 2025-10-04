import toast from 'react-hot-toast'
import { Project } from '@/data/types.data'
import ProjectsSection from '../main/project'
import { useIntersectionObserver } from './obs'
import { ProjectsSkeleton } from '../main/loading'
import { projectsAPI } from '@/util/apiResponse.util'
import { useEffect, useRef, useState } from 'react'

export const LazyProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.1,
    rootMargin: '800px',
  })

  const fetchProjects = async () => {
    if (loaded || loading) return

    setLoading(true)
    try {
      const projectsRes = await projectsAPI.getAllProjects()
      const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : []
      const sortedProjects = projectsData.sort((a, b) => b.order - a.order)
      setProjects(sortedProjects)
      setLoaded(true)
      toast.success('Projects loaded!')
    } catch (err) {
      toast.error('Failed to load projects')
      console.error('Projects fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      fetchProjects()
    }
  }, [hasBeenVisible, loaded])

  return (
    <div ref={sectionRef} className="scroll-mt-20 relative">
      {loading ? (
        <ProjectsSkeleton />
      ) : loaded ? (
        <ProjectsSection projects={projects} />
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading projects...</div>
        </div>
      )}
    </div>
  )
}
