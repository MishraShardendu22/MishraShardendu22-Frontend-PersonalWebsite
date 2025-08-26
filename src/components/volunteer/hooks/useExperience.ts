import { useState, useEffect } from 'react'
import { VolunteerExperience } from '@/data/types.data'
import { volunteerExperiencesAPI } from '@/util/apiResponse.util'

export function useExperience(id: string) {
  const [experience, setExperience] = useState<VolunteerExperience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await volunteerExperiencesAPI.getVolunteerExperienceById(id)
        setExperience(response.data)
      } catch {
        setError('Failed to load experience')
      } finally {
        setLoading(false)
      }
    }
    fetchExperience()
  }, [id])

  return { experience, loading, error }
}
