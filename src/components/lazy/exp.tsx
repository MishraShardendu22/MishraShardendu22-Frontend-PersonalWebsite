import toast from 'react-hot-toast'
import ExperienceSection from '../main/exp'
import { Experience } from '@/data/types.data'
import { useIntersectionObserver } from './obs'
import { ExperienceSkeleton } from '../main/loading'
import { LoadingState } from '../experience/load-error'
import { experiencesAPI } from '@/util/apiResponse.util'
import { useCallback, useEffect, useRef, useState } from 'react'

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

      const validExperiences = Array.isArray(experiencesRes.data)
        ? experiencesRes.data.filter((exp: Experience) => {
            const isValidExperience =
              exp.company_name &&
              !exp.company_name.toLowerCase().includes('institute') &&
              !exp.company_name.toLowerCase().includes('school') &&
              !exp.company_name.toLowerCase().includes('college') &&
              !exp.company_name.toLowerCase().includes('university')

            if (!isValidExperience) {
              console.warn('Filtering out education data from experience API:', exp)
            }

            return isValidExperience
          })
        : []

      if (validExperiences.length === 0) {
        toast.error('API returned education data instead of work experience. Using mock data.')
      } else {
        setExperiences(validExperiences)
      }

      setLoaded(true)
    } catch (err) {
      toast.error('Failed to load experiences from API. Using mock data.')
      setLoaded(true)
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
    <div ref={sectionRef} className="scroll-mt-20 relative" id="experience-section">
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
