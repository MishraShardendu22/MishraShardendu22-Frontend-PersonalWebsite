import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Heart, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { VolunteerExperience } from '@/data/types.data'

interface VolunteerCardProps {
  experience: VolunteerExperience
}

export default function VolunteerCards({ experience }: VolunteerCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  const timeline = experience.volunteer_time_line
  const latestTimeline = timeline.length > 0 ? timeline[0] : null

  return (
    <div className="rounded-2xl h-full w-full overflow-hidden bg-gradient-to-br from-pink-50/90 via-rose-50 to-pink-100/80 border border-pink-200/60 hover:border-pink-400/40 relative z-20 transition-all duration-500 hover:shadow-xl hover:shadow-pink-200/15 backdrop-blur-sm group hover:scale-[1.02]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-200/[0.02] to-rose-200/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-50 h-full flex flex-col p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-heading font-bold text-foreground group-hover:text-pink-600 transition-colors duration-300 leading-tight">
                {latestTimeline?.position || 'Volunteer'}
              </h4>
              <Calendar className="w-4 h-4 text-pink-400 group-hover:text-pink-600 transition-colors duration-300" />
            </div>
            <p className="text-sm font-medium text-pink-700 dark:text-pink-200">{experience.organisation}</p>
          </div>
          {experience.organisation_logo && (
            <img
              src={experience.organisation_logo}
              alt={experience.organisation}
              className="w-12 h-12 object-contain rounded-lg border border-pink-200 bg-white dark:bg-gray-900"
            />
          )}
        </div>

        {/* Timeline */}
        <div className="mb-2 flex flex-wrap gap-2">
          {timeline.map((t, idx) => (
            <Badge key={idx} className="bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-700">
              {t.position} ({formatDate(t.start_date)} - {formatDate(t.end_date)})
            </Badge>
          ))}
        </div>

        {/* Description */}
        <div className="prose prose-sm dark:prose-invert mb-4 line-clamp-5">
          <ReactMarkdown>{experience.description}</ReactMarkdown>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {experience.technologies.map((tech, idx) => (
            <Badge key={idx} className="bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-200 dark:border-rose-700">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Images */}
        {experience.images && experience.images.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {experience.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`volunteer-img-${idx}`}
                className="w-20 h-20 object-cover rounded-lg border border-pink-200 bg-white dark:bg-gray-900"
              />
            ))}
          </div>
        )}

        {/* Projects */}
        {/* You can add project links here if needed */}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <Button asChild variant="ghost" className="text-pink-600 hover:text-pink-800">
            <Link href={`/volunteer/${experience.inline.id}`}>
              View Details <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
