import toast from 'react-hot-toast'
import { useIntersectionObserver } from './obs'
import { Experience, VolunteerExperience } from '@/data/types.data'
import { ExperienceSkeleton } from '../main/loading'
import { LoadingState } from '../experience/load-error'
import { useCallback, useEffect, useRef, useState } from 'react'
import { experiencesAPI, volunteerExperiencesAPI } from '@/util/apiResponse.util'
import CombinedTimeline from '../main/timeline'

export const LazyTimelineSection = () => {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [volunteerExperiences, setVolunteerExperiences] = useState<VolunteerExperience[]>([])

  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.05,
    rootMargin: '100px',
  })

  const fetchData = useCallback(async () => {
    if (loaded || loading) return

    setLoading(true)
    try {
      const [experiencesRes, volunteerRes] = await Promise.all([
        experiencesAPI.getAllExperiences(),
        volunteerExperiencesAPI.getAllVolunteerExperiences(),
      ])

      setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
      setVolunteerExperiences(Array.isArray(volunteerRes.data) ? volunteerRes.data : [])
      setLoaded(true)
    } catch (err) {
      toast.error('Failed to load timeline data')
      console.error('Timeline fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  useEffect(() => {
    if (hasBeenVisible && !loaded && !loading) {
      fetchData()
    }
  }, [hasBeenVisible, loaded, loading, fetchData])

  return (
    <div
      ref={sectionRef}
      className="scroll-mt-20 relative bg-gradient-to-b from-background via-muted/10 to-background"
      id="timeline-section"
    >
      {loading ? (
        <div className="w-full">
          <ExperienceSkeleton />
        </div>
      ) : loaded ? (
        <CombinedTimeline experiences={experiences} volunteerExperiences={volunteerExperiences} />
      ) : (
        <div className="min-h-[300px] w-full flex items-center justify-center py-20">
          <LoadingState />
        </div>
      )}
    </div>
  )
}
