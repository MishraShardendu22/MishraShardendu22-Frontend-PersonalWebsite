import { Heart, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-300/30 border-t-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-rose-400 rounded-full animate-spin animate-reverse"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-heading text-foreground">Loading Volunteer Experiences</h2>
          <p className="text-foreground">Fetching community journey...</p>
        </div>
      </div>
    </div>
  )
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <Zap className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-heading text-foreground">Oops! Something went wrong</h2>
          <p className="text-foreground">{error}</p>
        </div>
      </div>
    </div>
  )
}

export function EmptyState({ hasFilters }: { hasFilters?: boolean }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-xl mx-auto border-2 border-dashed border-pink-400/25">
        <CardContent className="text-center py-12 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center">
            <Heart className="w-8 h-8 text-pink-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-heading text-foreground">No volunteer experiences found</h3>
            <p className="text-foreground text-sm">
              {hasFilters ? 'Try adjusting your search or filter criteria' : 'No volunteer experiences to show yet.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
