import { Award } from 'lucide-react'
import { LoadingState as SharedLoadingState, ErrorState as SharedErrorState, EmptyState as SharedEmptyState } from '@/components/shared/states'

export function LoadingState() {
  return (
    <SharedLoadingState 
      title="Loading Certifications"
      description="Fetching credentials and achievements..."
    />
  )
}

export function ErrorState({ error }: { error: string }) {
  return <SharedErrorState error={error} />
}

export function EmptyState() {
  return (
    <SharedEmptyState
      title="No certifications found"
      description="Try adjusting your search or filter criteria"
      icon={Award}
    />
  )
}
