'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        className: '',
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          border: '2px solid hsl(var(--border))',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(12px)',
          fontSize: '14px',
          fontWeight: '600',
          minWidth: '280px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#00c896',
            color: '#ffffff',
            border: '2px solid #00b085',
            boxShadow:
              '0 10px 25px -5px rgba(0, 200, 150, 0.4), 0 8px 10px -6px rgba(0, 200, 150, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#00c896',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#ffffff',
            border: '2px solid #dc2626',
            boxShadow:
              '0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: '#3b82f6',
            color: '#ffffff',
            border: '2px solid #2563eb',
            boxShadow:
              '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  )
}
