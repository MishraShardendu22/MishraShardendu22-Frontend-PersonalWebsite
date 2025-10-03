'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Construction } from 'lucide-react'

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 max-w-full">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-muted/50 p-6 rounded-lg border border-border/50">
              <Construction className="w-12 h-12 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                Under Development
              </h1>

              <p className="text-lg text-muted-foreground">
                This section is currently being developed
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              This account is not yet available. Please check back later and explore other projects
              of mine.
            </p>
          </div>

          <div className="pt-6">
            <Link href="/">
              <Button size="lg" variant="default" className="hover:bg-primary/90 transition-colors">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Additional content will be added in future updates
          </p>
        </div>
      </div>
    </div>
  )
}

export default page
