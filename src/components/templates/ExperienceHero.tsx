import Image from 'next/image'
import { Calendar } from 'lucide-react'
import { Experience } from '@/data/types.data'

interface ExperienceHeroProps {
  experience: Experience
}

export function ExperienceHero({ experience }: ExperienceHeroProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  const position = experience.experience_time_line?.[0]?.position ?? ''
  const startDate = experience.experience_time_line?.[0]?.start_date ?? ''
  const endDate = experience.experience_time_line?.[0]?.end_date ?? ''

  return (
    <section className="mb-8 w-full">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{position}</h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            {experience.company_logo && (
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-border/20">
                <Image
                  src={experience.company_logo}
                  alt={`${experience.company_name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-xl text-foreground font-medium">{experience.company_name}</p>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
