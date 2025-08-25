import { volunteerExperiencesAPI } from '../../../util/apiResponse.util'

export default async function VolunteerLayout({ children, params }: { children: React.ReactNode, params: { id: string } }) {
  try {
    const response = await volunteerExperiencesAPI.getVolunteerExperienceById(params.id)
    
    if (!response.data) {
      return <div>Volunteer experience not found</div>
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 dark:from-gray-900 dark:via-pink-900 dark:to-rose-900">
        {children}
      </div>
    )
  } catch (error) {
    return <div>Error loading volunteer experience</div>
  }
}
