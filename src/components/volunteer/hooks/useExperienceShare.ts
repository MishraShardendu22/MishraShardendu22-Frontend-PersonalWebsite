import { useState } from 'react'
import { VolunteerExperience } from '@/data/types.data'

export function useExperienceShare(experience: VolunteerExperience | null) {
  const [shareClicked, setShareClicked] = useState(false)
  const [copyClicked, setCopyClicked] = useState(false)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  const handleCopyMarkdown = async () => {
    if (!experience) return

  const position = experience.volunteer_time_line?.[0]?.position ?? ''
  const start = experience.volunteer_time_line?.[0]?.start_date ?? ''
  const end = experience.volunteer_time_line?.[0]?.end_date ?? ''

  const markdownContent = `# ${position} at ${experience.organisation}

## Duration
${formatDate(start)} - ${formatDate(end)}

## Technologies Used
${experience.technologies.map((tech) => `- ${tech}`).join('\n')}

## Description
${experience.description}

---
*Generated from experience portfolio*`

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = markdownContent
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Unable to copy', err)
        }
        document.body.removeChild(textArea)
      }
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleShare = async () => {
    if (!experience) return

    const position = experience.volunteer_time_line?.[0]?.position ?? ''
    const experienceUrl = `${window.location.origin}/experiences/${experience.organisation}`
    const shareData = {
      title: `${position} at ${experience.organisation}`,
      text: `Check out my experience: ${position} at ${experience.organisation}`,
      url: experienceUrl,
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(experienceUrl)
      setShareClicked(true)
      setTimeout(() => setShareClicked(false), 2000)
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return {
    handleShare,
    handleCopyMarkdown,
    shareClicked,
    copyClicked,
  }
}
