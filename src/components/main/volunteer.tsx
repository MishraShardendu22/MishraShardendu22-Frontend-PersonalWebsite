import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VolunteerExperience } from '@/data/types.data'
import { Heart, ArrowRight, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

interface VolunteerSectionProps {
  experiences: VolunteerExperience[]
}

export default function VolunteerSection({ experiences }: VolunteerSectionProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  // If no experiences, show a message
  if (!experiences || experiences.length === 0) {
    return (
      <section id="volunteer" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Volunteer Experience
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              My journey of giving back to the community through technology and leadership
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No volunteer experiences found. Please check the backend connection.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
      <section id="volunteer" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Volunteer Experience
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My journey of giving back to the community through technology and leadership
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {experiences.slice(0, 4).map((experience) => {
            const latestTimeline = experience.volunteer_time_line.length > 0 ? experience.volunteer_time_line[0] : null
            
            return (
              <div
                key={experience.inline.id}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start gap-4 mb-4">
                  {experience.organisation_logo && (
                    <Image
                      src={experience.organisation_logo}
                      alt={experience.organisation}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain rounded-lg border border-border bg-white dark:bg-gray-900"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {latestTimeline?.position || 'Volunteer'}
                    </h3>
                    <p className="text-secondary font-medium dark:text-secondary">
                      {experience.organisation}
                    </p>
                    
                    {latestTimeline && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(latestTimeline.start_date)} - {formatDate(latestTimeline.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm dark:prose-invert mb-4 line-clamp-3">
                  <ReactMarkdown>{experience.description.substring(0, 200) + '...'}</ReactMarkdown>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {experience.technologies.slice(0, 3).map((tech, idx) => (
                    <Badge key={idx} className="bg-muted/20 text-muted-foreground border-border">
                      {tech}
                    </Badge>
                  ))}
                  {experience.technologies.length > 3 && (
                    <Badge variant="outline" className="text-gray-500">
                      +{experience.technologies.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button asChild variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-muted">
                  <Link href={`/volunteer/${experience.inline.id}`}>
                    View Details <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>

        {experiences.length > 4 && (
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              <Link href="/volunteer">
                View All Volunteer Experiences <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
