import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap } from 'lucide-react'

interface ErrorStateProps {
  error?: string
  backUrl: string
  backLabel: string
}

interface LoadingStateProps {
  title: string
  description: string
}

export function DetailLoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-heading text-foreground">{title}</h2>
          <p className="text-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function DetailErrorState({ error, backUrl, backLabel }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Not Found</h2>
            <p className="text-foreground max-w-md">
              {error || "The item you're looking for doesn't exist or has been removed."}
            </p>
            <Link href={backUrl}>
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}