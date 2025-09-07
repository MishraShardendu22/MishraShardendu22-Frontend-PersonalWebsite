import { DetailErrorState } from '@/components/shared/detail-states'

interface ErrorStateProps {
  error?: string
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <DetailErrorState 
      error={error || "The experience you're looking for doesn't exist or has been removed."}
      backUrl="/volunteer"
      backLabel="Back to Volunteer"
    />
  )
}
