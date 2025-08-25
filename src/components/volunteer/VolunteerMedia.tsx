import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image, Camera } from 'lucide-react'
import { VolunteerExperience } from '@/data/types.data'

interface VolunteerMediaProps {
  experience: VolunteerExperience
}

export default function VolunteerMedia({ experience }: VolunteerMediaProps) {
  if (!experience.images || experience.images.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-500" />
          Media & Photos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experience.images.map((image, idx) => (
            <div key={idx} className="relative group">
              <img
                src={image}
                alt={`Volunteer experience media ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg border border-pink-200 shadow-md group-hover:shadow-lg transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
