'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface BlogHeaderContextType {
  title?: string
  subtitle?: string
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  clearCustomization: () => void
  // Create page specific
  onPreview?: () => void
  setOnPreview: (handler: (() => void) | undefined) => void
  onPublish?: () => void
  setOnPublish: (handler: (() => void) | undefined) => void
  isPublishing: boolean
  setIsPublishing: (value: boolean) => void
  canPublish: boolean
  setCanPublish: (value: boolean) => void
}

const BlogHeaderContext = createContext<BlogHeaderContextType | undefined>(undefined)

export const BlogHeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string | undefined>()
  const [subtitle, setSubtitle] = useState<string | undefined>()
  const [onPreview, setOnPreview] = useState<(() => void) | undefined>()
  const [onPublish, setOnPublish] = useState<(() => void) | undefined>()
  const [isPublishing, setIsPublishing] = useState(false)
  const [canPublish, setCanPublish] = useState(true)

  const clearCustomization = () => {
    setTitle(undefined)
    setSubtitle(undefined)
    setOnPreview(undefined)
    setOnPublish(undefined)
    setIsPublishing(false)
    setCanPublish(true)
  }

  return (
    <BlogHeaderContext.Provider
      value={{
        title,
        subtitle,
        setTitle,
        setSubtitle,
        clearCustomization,
        onPreview,
        setOnPreview,
        onPublish,
        setOnPublish,
        isPublishing,
        setIsPublishing,
        canPublish,
        setCanPublish,
      }}
    >
      {children}
    </BlogHeaderContext.Provider>
  )
}

export const useBlogHeader = () => {
  const context = useContext(BlogHeaderContext)
  if (!context) {
    throw new Error('useBlogHeader must be used within BlogHeaderProvider')
  }
  return context
}
