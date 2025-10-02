'use client'

import { useEffect, useState } from 'react'

import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  projectsAPI,
  experiencesAPI,
  skillsAPI,
  certificationsAPI,
} from '../../../util/apiResponse.util'
import { Project, Experience, Certification } from '../../../data/types.data'
import { Briefcase, GraduationCap, Settings, Plus, ExternalLink, Medal } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, experiencesRes, skillsRes, certificationsRes] = await Promise.all([
          projectsAPI.getAllProjects(),
          experiencesAPI.getAllExperiences(),
          await skillsAPI.getSkills(),
          certificationsAPI.getAllCertifications(),
        ])
        const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : []
        const sortedProjects = projectsData.sort((a, b) => b.order - a.order)
        setProjects(sortedProjects)
        setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : [])
      } catch (err) {
        setError('Failed to load dashboard data')
        setProjects([])
        setExperiences([])
        setSkills([])
        setCertifications([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mx-auto"></div>
          <p className="text-lg text-foreground/70">Loading dashboard data...</p>
        </div>
      </div>
    )
  if (error)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8">
        <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-5xl">😢</span>
        </div>
        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-3xl font-heading font-bold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="text-foreground/70 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="text-center space-y-6 pb-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Welcome, Admin
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Manage your professional experiences and work history with ease
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 flex flex-col items-center animate-fade-in">
          <Briefcase className="h-10 w-10 text-primary mb-4" />
          <div className="text-4xl font-bold text-foreground mb-2">{projects.length}</div>
          <div className="text-base font-medium text-foreground/80">Projects</div>
        </div>

        <div className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 flex flex-col items-center animate-fade-in">
          <GraduationCap className="h-10 w-10 text-secondary mb-4" />
          <div className="text-4xl font-bold text-foreground mb-2">{experiences.length}</div>
          <div className="text-base font-medium text-foreground/80">Experiences</div>
        </div>

        <div className="group relative overflow-hidden border-2 border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 flex flex-col items-center animate-fade-in">
          <Settings className="h-10 w-10 text-accent mb-4" />
          <div className="text-4xl font-bold text-foreground mb-2">{skills.length}</div>
          <div className="text-base font-medium text-foreground/80">Skills</div>
        </div>

        <div className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 flex flex-col items-center animate-fade-in">
          <Medal className="h-10 w-10 text-primary mb-4" />
          <div className="text-4xl font-bold text-foreground mb-2">{certifications.length}</div>
          <div className="text-base font-medium text-foreground/80">Certifications</div>
        </div>

        <div className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 lg:p-8 flex flex-col items-center animate-fade-in sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <span className="h-10 w-10 flex items-center justify-center text-secondary mb-4 text-3xl">
            🌐
          </span>
          <div className="text-4xl font-bold text-foreground mb-2">Live</div>
          <div className="text-base font-medium text-foreground/80">Portfolio Status</div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground">
          Quick Actions
        </h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/projects" className="group">
            <Button
              variant="outline"
              className="w-full h-auto p-6 lg:p-8 flex-col gap-4 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-fade-in border-2 hover:border-primary/50"
            >
              <Briefcase className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span>Manage Projects</span>
            </Button>
          </Link>

          <Link href="/admin/experiences" className="group">
            <Button
              variant="outline"
              className="w-full h-auto p-6 lg:p-8 flex-col gap-4 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-fade-in border-2 hover:border-secondary/50"
            >
              <GraduationCap className="h-10 w-10 text-secondary group-hover:scale-110 transition-transform duration-300" />
              <span>Manage Experiences</span>
            </Button>
          </Link>

          <Link href="/admin/skills" className="group">
            <Button
              variant="outline"
              className="w-full h-auto p-6 lg:p-8 flex-col gap-4 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-fade-in border-2 hover:border-accent/50"
            >
              <Settings className="h-10 w-10 text-accent group-hover:scale-110 transition-transform duration-300" />
              <span>Manage Skills</span>
            </Button>
          </Link>

          <Link href="/" className="group">
            <Button
              variant="outline"
              className="w-full h-auto p-6 lg:p-8 flex-col gap-4 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 animate-fade-in border-2 hover:border-primary/50"
            >
              <ExternalLink className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              <span>View Portfolio</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground">
          Recent Activity
        </h2>
        <div className="grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2">
          <div className="rounded-2xl border-2 border-border bg-card/80 shadow-xl p-6 lg:p-8 animate-fade-in hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-primary">Recent Projects</h3>
            </div>

            <div className="space-y-6">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-primary/60" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-semibold text-foreground">No projects yet</h4>
                    <p className="text-foreground/70">Get started by creating your first project</p>
                  </div>
                  <Link href="/admin/projects">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div
                      key={project.inline.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-200 border border-primary/10 hover:border-primary/20"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-lg font-semibold text-foreground truncate">
                          {project.project_name}
                        </p>
                        <p className="text-sm text-foreground/70 line-clamp-2">
                          {project.small_description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        {project.project_live_link && (
                          <Link
                            href={project.project_live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg text-primary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <div className="pt-4 border-t border-border/50">
                      <Link href="/admin/projects">
                        <Button variant="outline" className="w-full">
                          View All {projects.length} Projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card/80 shadow-xl p-6 lg:p-8 animate-fade-in hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="h-6 w-6 text-secondary" />
              <h3 className="text-2xl font-bold text-secondary">Recent Experiences</h3>
            </div>

            <div className="space-y-6">
              {experiences.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-secondary/60" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-semibold text-foreground">No experiences yet</h4>
                    <p className="text-foreground/70">Get started by adding your work experience</p>
                  </div>
                  <Link href="/admin/experiences">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-5 w-5" />
                      Add Experience
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.slice(0, 3).map((experience) => (
                    <div
                      key={experience.inline.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-200 border border-secondary/10 hover:border-secondary/20"
                    >
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-lg font-semibold text-foreground truncate">
                          {experience.company_name}
                        </p>
                        <p className="text-sm text-foreground/70 truncate">
                          {experience.company_name}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {new Date(experience.experience_time_line[0].start_date).getFullYear()} -{' '}
                          {new Date(
                            experience.experience_time_line[
                              experience.experience_time_line.length - 1
                            ].end_date
                          ).getFullYear()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {experiences.length > 3 && (
                    <div className="pt-4 border-t border-border/50">
                      <Link href="/admin/experiences">
                        <Button variant="outline" className="w-full">
                          View All {experiences.length} Experiences
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
