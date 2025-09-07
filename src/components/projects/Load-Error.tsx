import { Code2 } from 'lucide-react'
import { LoadingState as SharedLoadingState, ErrorState as SharedErrorState, EmptyState as SharedEmptyState } from '@/components/shared/states'

export function LoadingState() {
  return (
    <SharedLoadingState 
      title="Loading Projects"
      description="Fetching amazing work..."
    />
  )
}

export function ErrorState({ error }: { error: string }) {
  return <SharedErrorState error={error} />
}

export function EmptyState() {
  return (
    <SharedEmptyState
      title="No projects yet"
      description="Amazing projects will appear here soon. Stay tuned for updates!"
      icon={Code2}
    />
  )
}
