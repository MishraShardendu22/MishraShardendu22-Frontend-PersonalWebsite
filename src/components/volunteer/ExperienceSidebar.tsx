import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CanvasCard } from '@/components/certificate/canva'
import { VolunteerExperience } from '@/data/types.data'
import {
  Building2,
  Code2,
  Rocket,
  Star,
  Award,
  Clock,
  Share2,
  Copy,
  Check,
  Users,
  Briefcase,
  Calendar,
} from 'lucide-react'

interface ExperienceSidebarProps {
  experience: VolunteerExperience
  onShare: () => void
  onCopyMarkdown: () => void
  shareClicked: boolean
  copyClicked: boolean
}

export function ExperienceSidebar({
  experience,
  onShare,
  onCopyMarkdown,
  shareClicked,
  copyClicked,
}: ExperienceSidebarProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="sticky top-24 space-y-6">
        <CanvasCard
          animationSpeed={4}
          title="Company Info"
          icon={<Building2 className="h-6 w-6 text-blue-400" />}
          containerClassName="bg-blue-900"
          colors={[
            [59, 130, 246],
            [147, 197, 253],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <div className="text-center">
              {experience.organisation_logo && (
                <div className="relative h-16 w-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={experience.organisation_logo}
                    alt={`${experience.organisation} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h4 className="font-semibold text-lg">{experience.organisation}</h4>
              <p className="opacity-80 text-sm">
                {experience.volunteer_time_line?.[0]?.position ?? ''}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-70 text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {formatDate(experience.volunteer_time_line?.[0]?.start_date ?? '')} -{' '}
                {formatDate(experience.volunteer_time_line?.[0]?.end_date ?? '')}
              </span>
            </div>
          </div>
        </CanvasCard>

        <CanvasCard
          title="Tech Stack"
          icon={<Code2 className="h-6 w-6 text-purple-400" />}
          animationSpeed={4}
          containerClassName="bg-purple-900"
          colors={[
            [147, 51, 234],
            [196, 181, 253],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="opacity-90 text-sm">Technologies used in this role</p>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.slice(0, 6).map((tech, index) => (
                <Badge
                  key={index}
                  className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30"
                >
                  {tech}
                </Badge>
              ))}
              {experience.technologies.length > 6 && (
                <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                  +{experience.technologies.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </CanvasCard>

        <CanvasCard
          title="Quick Actions"
          icon={<Rocket className="h-6 w-6 text-emerald-400" />}
          animationSpeed={2.5}
          containerClassName="bg-emerald-900"
          colors={[
            [34, 197, 94],
            [16, 185, 129],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="opacity-90 text-sm">Share or copy experience details</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onShare}
                className="justify-center text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:hover:bg-white/20 group-hover/canvas-card:hover:border-white/50"
                size="sm"
                disabled={shareClicked}
              >
                <Share2 className="w-3 h-3 mr-1" />
                {shareClicked ? 'Copied!' : 'Share'}
              </Button>

              <Button
                variant="outline"
                onClick={onCopyMarkdown}
                className="justify-center text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:hover:bg-white/20 group-hover/canvas-card:hover:border-white/50"
                size="sm"
                disabled={copyClicked}
              >
                {copyClicked ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy MD
                  </>
                )}
              </Button>
            </div>
          </div>
        </CanvasCard>

        <CanvasCard
          animationSpeed={4}
          title="Experience Highlights"
          icon={<Star className="h-6 w-6 text-amber-400" />}
          containerClassName="bg-amber-900"
          colors={[
            [245, 158, 11],
            [217, 119, 6],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">{experience.technologies.length}</div>
                <div className="text-xs opacity-70">Technologies</div>
              </div>

              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold">
                  {experience.projects.length + experience.images.length}
                </div>
                <div className="text-xs opacity-70">Projects</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Features:</div>
              <div className="flex flex-wrap gap-2">
                {experience.projects.length > 0 && (
                  <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                    ✓ Projects
                  </Badge>
                )}
                {experience.images.length > 0 && (
                  <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                    ✓ Media
                  </Badge>
                )}
                {experience.technologies.length > 5 && (
                  <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                    ✓ Multi-tech
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CanvasCard>

        <CanvasCard
          animationSpeed={3}
          title="Timeline Legend"
          icon={<Users className="h-6 w-6 text-indigo-400" />}
          containerClassName="bg-indigo-900"
          colors={[
            [99, 102, 241],
            [139, 92, 246],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="opacity-90 text-sm">Timeline indicators guide</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border border-white/30 flex items-center justify-center shadow-sm">
                  <Award className="w-2 h-2 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Current Position</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="h-4 w-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 border border-white/30 flex items-center justify-center shadow-sm">
                  <Briefcase className="w-2 h-2 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Past Position</div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/20">
                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2 py-0.5 bg-green-500/30 text-green-200 text-[10px] font-semibold rounded-full border border-green-400/30">
                    CURRENT
                  </div>
                  <span className="opacity-80 text-[11px]">Active role</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2 py-0.5 bg-amber-500/30 text-amber-200 text-[10px] font-semibold rounded-full border border-amber-400/30">
                    Latest
                  </div>
                  <span className="opacity-80 text-[11px]">Most recent</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/20">
              <div className="flex items-center gap-2 text-xs opacity-70">
                <div className="w-4 h-[2px] bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-full"></div>
                <span className="text-[11px]">Recent → Earlier</span>
              </div>
            </div>
          </div>
        </CanvasCard>

        <CanvasCard
          animationSpeed={2.5}
          title="Position Timeline"
          icon={<Calendar className="h-6 w-6 text-violet-400" />}
          containerClassName="bg-violet-900"
          colors={[
            [139, 92, 246],
            [168, 85, 247],
          ]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="opacity-90 text-sm">Role progression timeline</p>

            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-violet-400 via-purple-400 to-violet-400"></div>

              <div className="space-y-4">
                {experience.volunteer_time_line
                  .slice()
                  .reverse()
                  .slice(0, 4)
                  .map((timeline, index) => {
                    const isCurrentPosition =
                      !timeline.end_date || new Date(timeline.end_date) > new Date()

                    return (
                      <div key={index} className="flex items-start gap-3 relative">
                        <div
                          className={`w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center shadow-sm z-10 ${
                            isCurrentPosition
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}
                        >
                          {isCurrentPosition ? (
                            <Award className="w-3 h-3 text-white" />
                          ) : (
                            <Briefcase className="w-3 h-3 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 pb-2">
                          <div className="font-medium text-sm leading-tight">
                            {timeline.position}
                          </div>
                          <div className="opacity-70 text-xs mt-1">
                            {formatDate(timeline.start_date)} -{' '}
                            {timeline.end_date ? formatDate(timeline.end_date) : 'Present'}
                          </div>
                          {isCurrentPosition && (
                            <div className="inline-block px-2 py-0.5 bg-green-500/30 text-green-200 text-[10px] font-semibold rounded-full border border-green-400/30 mt-1">
                              CURRENT
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                {experience.volunteer_time_line.length > 4 && (
                  <div className="flex items-center gap-3 relative">
                    <div className="w-6 h-6 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                    <div className="opacity-70 text-xs">
                      {experience.volunteer_time_line.length - 4} more positions
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CanvasCard>
      </div>
    </div>
  )
}
