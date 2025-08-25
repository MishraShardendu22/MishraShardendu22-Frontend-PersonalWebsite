import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Calendar, Users } from 'lucide-react'
import { VolunteerExperience } from '@/data/types.data'

interface VolunteerSidebarProps {
  experience: VolunteerExperience
}

export default function VolunteerSidebar({ experience }: VolunteerSidebarProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const totalDuration = () => {
    if (experience.volunteer_time_line.length === 0) return 'Unknown'
    
    const earliestStart = experience.volunteer_time_line.reduce((earliest, timeline) => {
      return new Date(timeline.start_date) < new Date(earliest.start_date) ? timeline : earliest
    })
    
    const latestEnd = experience.volunteer_time_line.reduce((latest, timeline) => {
      if (!timeline.end_date) return { ...timeline, end_date: new Date().toISOString().split('T')[0] }
      return new Date(timeline.end_date) > new Date(latest.end_date || '1900-01-01') ? timeline : latest
    })

    const start = new Date(earliestStart.start_date)
    const end = new Date(latestEnd.end_date || new Date())
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const years = Math.floor(months / 12)
    
    if (years > 0) {
      const remainingMonths = months % 12
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }
    return `${months} month${months > 1 ? 's' : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-500" />
            Quick Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Organisation</h4>
            <p className="text-gray-600 dark:text-gray-400">{experience.organisation}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Duration</h4>
            <p className="text-gray-600 dark:text-gray-400">{totalDuration()}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Positions Held</h4>
            <p className="text-gray-600 dark:text-gray-400">{experience.volunteer_time_line.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-pink-500" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.volunteer_time_line.map((timeline, idx) => (
            <div key={idx} className="border-l-2 border-pink-200 pl-4 pb-4 last:pb-0">
              <h4 className="font-semibold text-gray-900 dark:text-white">{timeline.position}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formatDate(timeline.start_date)} - {formatDate(timeline.end_date)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Technologies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5 text-pink-500" />
            Skills & Technologies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, idx) => (
              <Badge key={idx} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-700">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
