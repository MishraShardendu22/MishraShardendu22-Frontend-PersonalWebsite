'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Certification } from '../../../data/types.data'
import { certificationsAPI } from '../../../util/apiResponse.util'
import { Award, Calendar, Share2, Copy, Check, Star, Code2, Target } from 'lucide-react'
import { CanvasCard } from '@/components/certificate/canva'
import { MediaSection } from '@/components/certificate/MediaSection'
import { formatDate } from '@/components/certificate/utils/urlHelpers'
import { ProjectsSection } from '@/components/certificate/ProjectsSection'
import { ErrorState, LoadingState } from '@/components/certificate/load-error'
import { CertificationHeader } from '@/components/certificate/CertificationHeader'
import { CertificationDetails } from '@/components/certificate/CertificationDetails'

export default function CertificationDetailPage({ params }: any) {
  const [certification, setCertification] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copyClicked, setCopyClicked] = useState(false)
  const [shareClicked, setShareClicked] = useState(false)

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await certificationsAPI.getCertificationById(params.id)
        setCertification(response.data)
        setError('')
      } catch (err) {
        setError('Failed to load certification')
      } finally {
        setLoading(false)
      }
    }
    fetchCertification()
  }, [params.id])

  const handleCopyMarkdown = async () => {
    if (!certification) return

    const markdownContent = `# ${certification.title}

## Issuer
${certification.issuer}

## Issue Date
${formatDate(certification.issue_date)}

## Skills Gained
${certification.skills.map((skill) => `- ${skill}`).join('\n')}

## Description
${certification.description}

${
  certification.certificate_url
    ? `## Certificate
- **Certificate:** ${certification.certificate_url}`
    : ''
}

---
*Generated from certification portfolio*`

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = markdownContent
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Unable to copy', err)
        }
        document.body.removeChild(textArea)
      }
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    const certificationUrl = `${window.location.origin}/certifications/${params.id}`
    const shareData = {
      title: `${certification?.title} - ${certification?.issuer}`,
      text: `Check out my certification: ${certification?.title} from ${certification?.issuer}`,
      url: certificationUrl,
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(certificationUrl)
      setShareClicked(true)
      setTimeout(() => setShareClicked(false), 2000)
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (error || !certification) {
    return <ErrorState error={error} />
  }

  return (
    <div className="min-h-screen bg-background">
      <CertificationHeader certification={certification} />

      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12 w-full">
          <div className="order-2 lg:order-1 lg:col-span-1 space-y-4 lg:space-y-6">
            <div className="lg:sticky lg:top-24 space-y-4 lg:space-y-6">
              <CanvasCard
                title="Certification Info"
                icon={<Award className="h-6 w-6 text-blue-400" />}
                containerClassName="bg-blue-900"
                colors={[
                  [59, 130, 246],
                  [147, 197, 253],
                ]}
              >
                <div className="space-y-3 sm:space-y-4">
                  <div className="text-center px-1">
                    <h4 className="font-semibold text-sm sm:text-base lg:text-lg leading-tight break-words hyphens-auto">
                      {certification.issuer}
                    </h4>
                    <p className="opacity-80 text-xs sm:text-sm mt-1.5 break-words line-clamp-2">
                      {certification.title}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 opacity-70 text-xs sm:text-sm px-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-center break-words">
                      {formatDate(certification.issue_date)}
                    </span>
                  </div>

                  {certification.certificate_url && (
                    <div className="w-full pt-1">
                      <Link
                        href={certification.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button
                          variant="outline"
                          className="border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:hover:bg-white/20 w-full h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
                        >
                          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span className="truncate font-medium whitespace-nowrap">
                            View Certificate
                          </span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CanvasCard>

              <CanvasCard
                title="Skills Overview"
                icon={<Code2 className="h-6 w-6 text-purple-400" />}
                containerClassName="bg-purple-900"
                colors={[
                  [147, 51, 234],
                  [196, 181, 253],
                ]}
              >
                <div className="space-y-4">
                  <p className="opacity-90 text-sm">Key competencies gained</p>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {certification.skills.slice(0, 6).map((skill, index) => (
                      <Badge
                        key={index}
                        className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {certification.skills.length > 6 && (
                      <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                        +{certification.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CanvasCard>

              <CanvasCard
                title="Quick Actions"
                icon={<Target className="h-6 w-6 text-emerald-400" />}
                containerClassName="bg-emerald-900"
                colors={[
                  [34, 197, 94],
                  [16, 185, 129],
                ]}
              >
                <div className="space-y-4">
                  <p className="opacity-90 text-sm">Share or copy certification details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="justify-center text-sm sm:text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:hover:bg-white/20 group-hover/canvas-card:hover:border-white/50 h-9 sm:h-8"
                      disabled={shareClicked}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      {shareClicked ? 'Copied!' : 'Share'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCopyMarkdown}
                      className="justify-center text-sm sm:text-xs border-border hover:bg-accent group-hover/canvas-card:border-white/30 group-hover/canvas-card:hover:bg-white/20 group-hover/canvas-card:hover:border-white/50 h-9 sm:h-8"
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
                title="Achievement Highlights"
                icon={<Star className="h-6 w-6 text-amber-400" />}
                containerClassName="bg-amber-900"
                colors={[
                  [245, 158, 11],
                  [217, 119, 6],
                ]}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="text-center p-2 lg:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-xl lg:text-2xl font-bold">
                        {certification.skills.length}
                      </div>
                      <div className="text-xs opacity-70">Skills</div>
                    </div>

                    <div className="text-center p-2 lg:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-xl lg:text-2xl font-bold">
                        {certification.projects?.length || 0}
                      </div>
                      <div className="text-xs opacity-70">Projects</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {certification.certificate_url && (
                        <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                          ✓ Certified
                        </Badge>
                      )}
                      {certification.projects && certification.projects.length > 0 && (
                        <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                          ✓ Projects
                        </Badge>
                      )}
                      {certification.images && certification.images.length > 0 && (
                        <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                          ✓ Media
                        </Badge>
                      )}
                      {certification.skills.length > 5 && (
                        <Badge className="text-xs border-border bg-secondary group-hover/canvas-card:bg-white/20 group-hover/canvas-card:border-white/30">
                          ✓ Multi-skill
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CanvasCard>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-2 space-y-6 lg:space-y-8">
            <CertificationDetails certification={certification} />
            <MediaSection certification={certification} />
            <ProjectsSection certification={certification} />
          </div>
        </div>
      </main>
    </div>
  )
}
