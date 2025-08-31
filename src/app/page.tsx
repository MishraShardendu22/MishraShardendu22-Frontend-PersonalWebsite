'use client'

import toast from 'react-hot-toast'
import { useEffect, useState, useMemo } from 'react'
import Error from '@/components/extra/Error'
import { navItems } from '@/data/static_link'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import Education from '@/components/main/education'
import { skillsAPI } from '@/util/apiResponse.util'
import ContactSection from '@/components/main/contact'
import { SkillsSkeleton } from '@/components/main/loading'
import { DesktopSidebar } from '@/components/extra/sidebar'
import FooterSection from '@/components/main/FooterSection'
import { LazyProjectsSection } from '@/components/lazy/proj'
import { LazyExperienceSection } from '@/components/lazy/exp'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { MobileNavigation } from '@/components/extra/mobile-nav'
import { LazyCertificationsSection } from '@/components/lazy/cert'
import { StarsBackground } from '@/components/ui/stars-background'
import { LazyVExperienceSection } from '@/components/lazy/volunteer'

// Simplified performance optimization: Detect low-end devices
const usePerformanceMode = () => {
  const [isLowEnd, setIsLowEnd] = useState(false)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkPerformance = () => {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setIsLowEnd(true)
        return
      }
      
      // Check for low-end device indicators
      const connection = (navigator as any).connection
      if (connection) {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setIsLowEnd(true)
          return
        }
        if (connection.downlink < 1) {
          setIsLowEnd(true)
          return
        }
      }
      
      // Check for low memory
      if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) {
        setIsLowEnd(true)
        return
      }
      
      setIsLowEnd(false)
    }
    
    checkPerformance()
    
    // Listen for changes in connection
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', checkPerformance)
      return () => {
        (navigator as any).connection.removeEventListener('change', checkPerformance)
      }
    }
  }, [])
  
  return isLowEnd
}

export default function HomePage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState({
    skills: true,
  })
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('hero')
  
  // Performance optimization
  const isLowEnd = usePerformanceMode()

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1))
      const currentSection = sections.find((section) => {
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

    // Throttle scroll events for better performance
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Only fetch skills immediately since they're needed early
        const skillsRes = await skillsAPI.getSkills()
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setLoading((prev) => ({ ...prev, skills: false }))

        toast.success('Initial data loaded!')
      } catch (err) {
        setError('Failed to load initial data')
        toast.error('Failed to load initial data')
        setLoading({ skills: false })
      }
    }

    fetchInitialData()
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
      <DesktopSidebar activeSection={activeSection} />
      <MobileNavigation activeSection={activeSection} />

      <div className="md:pl-20 transition-all duration-500 ease-out">
        <section id="hero" className="relative">
          <HeroSection />
          <ShootingStars reducedMotion={isLowEnd} />
        </section>

        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          <Education />
          <ShootingStars reducedMotion={isLowEnd} />
        </section>

        <section id="skills" className="scroll-mt-20 relative">
          {loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={skills} />}
        </section>

        <section id="projects">
          <LazyProjectsSection />
        </section>

        <section id="experience">
          <LazyExperienceSection />
        </section>

        <section id="volunteer">
          <LazyVExperienceSection />
        </section>

        <section id="certifications">
          <LazyCertificationsSection />
        </section>

        <section id="contact" className="scroll-mt-20 relative">
          <ContactSection />
          <StarsBackground reducedMotion={isLowEnd} />
        </section>

        <section>
          <FooterSection />
        </section>
      </div>
    </div>
  )
}
