'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Award } from 'lucide-react'
import { Certification } from '@/data/types.data'
import { formatDate } from './utils/urlHelpers'

interface CertificationHeaderProps {
  certification: Certification
}

export const CertificationHeader: React.FC<CertificationHeaderProps> = ({ certification }) => {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/certifications')
    }
  }

  return (
    <>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground h-8 sm:h-9 px-2 sm:px-3"
              onClick={handleBack}
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </Button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground max-w-[50%] sm:max-w-none">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{certification.issuer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative mb-6 sm:mb-8 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 overflow-hidden">
        {/* Background Gradient Blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight px-2">
            {certification.title}
          </h1>

          {/* Issuer and Date Info */}
          <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
            <p className="text-base sm:text-lg md:text-xl text-foreground font-medium px-2 break-words max-w-full">
              {certification.issuer}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatDate(certification.issue_date)}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
