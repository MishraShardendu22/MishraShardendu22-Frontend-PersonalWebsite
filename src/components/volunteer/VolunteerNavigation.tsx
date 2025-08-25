'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart } from 'lucide-react'

export default function VolunteerNavigation() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/volunteer')
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Volunteer</span>
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Volunteer Experience</span>
          </div>
        </div>
      </div>
    </div>
  )
}
