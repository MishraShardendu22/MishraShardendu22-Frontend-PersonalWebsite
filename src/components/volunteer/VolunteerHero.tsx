import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar } from 'lucide-react'
import { VolunteerExperience } from '@/data/types.data'

interface VolunteerHeroProps {
  experience: VolunteerExperience
}

export default function VolunteerHero({ experience }: VolunteerHeroProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  const latestTimeline = experience.volunteer_time_line.length > 0 ? experience.volunteer_time_line[0] : null

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800">
      <CardHeader className="space-y-6">
        <div className="flex items-start gap-6">
          {experience.organisation_logo && (
            <div className="flex-shrink-0">
              <img
                src={experience.organisation_logo}
                alt={experience.organisation}
                className="w-20 h-20 object-contain rounded-xl border-2 border-pink-200 bg-white dark:bg-gray-900 shadow-lg"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {latestTimeline?.position || 'Volunteer'}
              </h1>
              <p className="text-xl text-pink-700 dark:text-pink-300 font-medium">
                {experience.organisation}
              </p>
            </div>

            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span className="font-medium">Timeline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline badges */}
        <div className="flex flex-wrap gap-3">
          {experience.volunteer_time_line.map((timeline, idx) => (
            <Badge key={idx} className="bg-pink-100 text-pink-700 border-pink-300 px-3 py-1 text-sm">
              {timeline.position} • {formatDate(timeline.start_date)} - {formatDate(timeline.end_date)}
            </Badge>
          ))}
        </div>

        {/* Technologies */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Technologies & Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {experience.technologies.map((tech, idx) => (
              <Badge key={idx} variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
