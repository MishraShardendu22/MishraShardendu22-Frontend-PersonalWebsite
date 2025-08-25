import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { VolunteerExperience } from '@/data/types.data'
import ReactMarkdown from 'react-markdown'

interface VolunteerDescriptionProps {
  experience: VolunteerExperience
}

export default function VolunteerDescription({ experience }: VolunteerDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-pink-500" />
          About This Volunteer Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown>{experience.description}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  )
}
