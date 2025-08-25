// components/sections/LazyExperienceSection.tsx
import toast from 'react-hot-toast'
import ExperienceSection from '../main/exp'
import { Experience } from '@/data/types.data'
import { useIntersectionObserver } from './obs'
import { ExperienceSkeleton } from '../main/loading'
import { experiencesAPI } from '@/util/apiResponse.util'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LoadingState } from '../experience/load-error'

export const LazyExperienceSection = () => {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  
  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.05,
    rootMargin: '100px',
  })

  const fetchExperiences = useCallback(async () => {
    if (loaded || loading) return

    setLoading(true)
    try {
      const experiencesRes = await experiencesAPI.getAllExperiences()
      setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
      setLoaded(true)
    } catch (err) {
      toast.error('Failed to load experiences')
      console.error('Experiences fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  useEffect(() => {
    if (hasBeenVisible && !loaded && !loading) {
      fetchExperiences()
    }
  }, [hasBeenVisible, loaded, loading, fetchExperiences])

  return (
    <div 
      ref={sectionRef} 
      className="scroll-mt-20 relative" 
      id="experience-section"
    >
      {loading ? (
        <div className="w-full">
          <ExperienceSkeleton />
        </div>
      ) : loaded ? (
        <ExperienceSection experiences={experiences} />
      ) : (
        <div className="min-h-[300px] w-full flex items-center justify-center py-20">
          <LoadingState />
        </div>
      )}
    </div>
  )
}
