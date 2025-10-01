'use client'

import { useEffect, useState } from 'react'
import { ProjectDetail } from '@/data/types.data'
import { projectsAPI } from '@/util/apiResponse.util'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderKanban, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const KanbanPage = () => {
  const [allprojects, setAllProjects] = useState<ProjectDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsRes = await projectsAPI.getAllProjectsKanban()
        setAllProjects(Array.isArray(projectsRes.data) ? projectsRes.data : [])
        setError('')
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError('Failed to load projects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-secondary animate-spin mb-4" />
        <p className="text-lg text-foreground">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
          <p className="text-foreground text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30">
            <FolderKanban className="h-12 w-12 text-secondary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent leading-tight">
          Kanban Board
        </h1>
        <p className="text-base text-foreground">Organize and manage your project workflow</p>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 pb-4 border-b border-border">
        <div>
          <h2 className="text-3xl font-bold text-secondary mb-1">Project Overview</h2>
          <p className="text-foreground">
            Total Projects:{' '}
            <Badge variant="secondary" className="ml-2">
              {allprojects.length}
            </Badge>
          </p>
        </div>
      </div>

      {allprojects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <FolderKanban className="mx-auto h-16 w-16 text-foreground mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No projects yet</h3>
          <p className="text-lg text-foreground mb-6">
            Your kanban board is empty. Projects will appear here once created.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {allprojects.map((project) => (
            <Card
              key={project.project_id}
              className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl"
            >
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-card pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-semibold text-secondary line-clamp-2">
                    {project.project_title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="shrink-0 bg-secondary/10 text-secondary border-secondary/20"
                  >
                    #{project.order}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default KanbanPage
