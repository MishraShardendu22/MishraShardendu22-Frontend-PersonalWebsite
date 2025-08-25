import { useEffect, useState } from 'react'
import { VolunteerExperience } from '@/data/types.data'
import VolunteerSection from './volunteer'
import { volunteerExperiencesAPI } from '@/util/apiResponse.util'
import toast from 'react-hot-toast'

export default function VolunteerAlwaysSection() {
  const [experiences, setExperiences] = useState<VolunteerExperience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await volunteerExperiencesAPI.getAllVolunteerExperiences()
        setExperiences(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        toast.error('Failed to load volunteer experiences')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="min-h-[200px] flex items-center justify-center">Loading volunteer experiences...</div>
  return <VolunteerSection experiences={experiences} />
}
