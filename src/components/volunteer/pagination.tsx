import { Button } from '@/components/ui/button'

interface VolunteerPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function VolunteerPagination({ currentPage, totalPages, onPageChange }: VolunteerPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center mt-8 gap-2">
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'bg-pink-500 text-white' : ''}
        >
          {page}
        </Button>
      ))}
    </div>
  )
}
