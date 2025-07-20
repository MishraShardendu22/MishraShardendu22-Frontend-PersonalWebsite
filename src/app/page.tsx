'use client'

import { useEffect, useState } from 'react'
import { Home, GraduationCap, Code, Briefcase, Award, Mail, User, ChevronRight, Sparkles, Heart, Book, Glasses } from 'lucide-react'
import { cn } from '@/lib/utils'
import { projectsAPI, experiencesAPI, skillsAPI, certificationsAPI } from '../util/apiResponse.util'
import { Project, Experience, Certification } from '../data/types.data'
import Error from '@/components/Error'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import ProjectsSection from '@/components/main/project'
import ExperienceSection from '@/components/main/exp'
import CertificationsSection from '@/components/main/certificate'
import ContactSection from '@/components/main/contact'
import FooterSection from '@/components/main/footer'
import Education from '@/components/main/education'
import toast from 'react-hot-toast'

// Import skeleton components
import { 
  SkillsSkeleton, 
  ProjectsSkeleton, 
  ExperienceSkeleton, 
  CertificationsSkeleton, 
  EducationSkeleton 
} from '@/components/main/loading'

const navItems = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#education', label: 'Education', icon: GraduationCap },
  { href: '#skills', label: 'Skills', icon: Code },
  { href: '#projects', label: 'Projects', icon: Briefcase },
  { href: '#experience', label: 'Experience', icon: User },
  { href: '#certifications', label: 'Certifications', icon: Award },
  { href: '#contact', label: 'Contact', icon: Mail },
  { href: '/blog', label: 'Blog', icon: Glasses },
]

function NavLink({ href, label, icon: Icon, isActive, isExpanded }: {
  href: string
  label: string
  icon: React.ElementType
  isActive?: boolean
  isExpanded?: boolean
}) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl group relative overflow-hidden",
        "hover:bg-gradient-to-r hover:from-accent/20 hover:to-secondary/10 hover:text-accent hover:shadow-lg hover:shadow-accent/20",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        "active:scale-95 transform-gpu",
        isActive && "bg-gradient-to-r from-primary/20 to-secondary/15 text-primary shadow-lg shadow-primary/30 border border-primary/30"
      )}
    >
      {/* Animated background for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <Icon className={cn(
        "h-5 w-5 flex-shrink-0 transition-all duration-300",
        isActive ? "text-primary" : "text-foreground group-hover:text-accent",
        "group-hover:scale-110"
      )} />
      
      <span className={cn(
        "transition-all duration-300 whitespace-nowrap font-medium",
        isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
        isActive ? "text-primary" : "text-foreground group-hover:text-accent"
      )}>
        {label}
      </span>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
      
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-x-2 group-hover:translate-x-0">
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
        </div>
      )}
    </a>
  )
}

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isExpanded) setHasAnimated(false)
  }, [isExpanded])

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1))
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 h-full z-50">
      <div
        className={cn(
          "h-full bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 shadow-2xl transition-all duration-500 ease-out",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-sidebar-primary/5 before:to-transparent before:pointer-events-none",
          isExpanded ? "w-72" : "w-20"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-primary/10 via-transparent to-sidebar-accent/10 opacity-50 pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/25 transition-all duration-300 hover:scale-105">
                <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-sidebar animate-pulse" />
            </div>
            
            {/* Profile info when expanded */}
            {isExpanded && (
              <div
                className="flex-1 animate-in slide-in-from-left duration-300"
                onAnimationEnd={() => setHasAnimated(true)}
              >
                {hasAnimated && (
                  <div className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-blast">
                    I Love Golang and Fedora
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-in slide-in-from-left duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NavLink
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.href.substring(1)}
                isExpanded={isExpanded}
              />
            </div>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sidebar/50 to-transparent pointer-events-none" />
        
        {/* Expand indicator */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className={cn(
            "text-xs text-sidebar-foreground/70 text-center transition-all duration-300 flex items-center justify-center gap-2",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
            <span>Hover to expand</span>
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState({
    projects: true,
    experiences: true,
    skills: true,
    certifications: true,
    education: true
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data concurrently
        const [projectsRes, experiencesRes, skillsRes, certificationsRes] = await Promise.all([
          projectsAPI.getAllProjects(),
          experiencesAPI.getAllExperiences(),
          skillsAPI.getSkills(),
          certificationsAPI.getAllCertifications(),
        ])

        // Set data and update loading states individually
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : [])
        setLoading(prev => ({ ...prev, projects: false }))

        setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
        setLoading(prev => ({ ...prev, experiences: false }))

        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setLoading(prev => ({ ...prev, skills: false }))

        setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : [])
        setLoading(prev => ({ ...prev, certifications: false }))

        // Simulate education loading (assuming it's static or has its own API)
        setTimeout(() => {
          setLoading(prev => ({ ...prev, education: false }))
        }, 1000)

        toast.success('Homepage data loaded!')
      } catch (err) {
        setError('Failed to load homepage data')
        toast.error('Failed to load homepage data')
        // Set all loading states to false on error
        setLoading({
          projects: false,
          experiences: false,
          skills: false,
          certifications: false,
          education: false
        })
      }
    }
    fetchData()
  }, [])

  if (error) {
    return (
      <Error
        error={error}
        onRetry={() => location.reload()}
        showActions={true}
        title="Failed to load homepage"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-muted/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '6s' }} />
      </div>
      
      <Sidebar />
      
      <div className="pl-20 transition-all duration-500 ease-out">
        <section id="hero" className="relative">
          <HeroSection />
        </section>
        
        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          {loading.education ? <EducationSkeleton /> : <Education />}
        </section>
        
        <section id="skills" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-accent/5 to-transparent opacity-50 pointer-events-none" />
          {loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={skills} />}
        </section>
        
        <section id="projects" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50 pointer-events-none" />
          {loading.projects ? <ProjectsSkeleton /> : <ProjectsSection projects={projects} />}
        </section>
        
        <section id="experience" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-muted/5 to-transparent opacity-50 pointer-events-none" />
          {loading.experiences ? <ExperienceSkeleton /> : <ExperienceSection experiences={experiences} />}
        </section>
        
        <section id="certifications" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          {loading.certifications ? <CertificationsSkeleton /> : <CertificationsSection certifications={certifications} />}
        </section>
        
        <section id="contact" className="scroll-mt-20 relative">
          <ContactSection />
        </section>
        
        <FooterSection />
      </div>
    </div>
  )
}