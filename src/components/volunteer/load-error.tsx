import { Building2 } from 'lucide-react'
import { LoadingState as SharedLoadingState, ErrorState as SharedErrorState, EmptyState as SharedEmptyState } from '@/components/shared/states'

export function LoadingState() {
  return (
    <SharedLoadingState 
      title="Loading Experiences"
      description="Fetching professional journey..."
    />
  )
}

export function ErrorState({ error }: { error: string }) {
  return <SharedErrorState error={error} />
}

export function EmptyState() {
  return (
    <SharedEmptyState
      title="No experiences found"
      description="Try adjusting your search or filter criteria"
      icon={Building2}
    />
  )
}
