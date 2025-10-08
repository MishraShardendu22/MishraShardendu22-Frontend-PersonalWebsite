import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'

export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      icon: <CheckCircle className="w-5 h-5" />,
      style: {
        background: '#00c896',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid #00b085',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow:
          '0 10px 25px -5px rgba(0, 200, 150, 0.4), 0 8px 10px -6px rgba(0, 200, 150, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        minWidth: '280px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#00c896',
      },
      ...options,
    })
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      icon: <XCircle className="w-5 h-5" />,
      style: {
        background: '#ef4444',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid #dc2626',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow:
          '0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        minWidth: '280px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#ef4444',
      },
      ...options,
    })
  },

  info: (message: string, options?: any) => {
    return toast(message, {
      icon: <Info className="w-5 h-5" />,
      style: {
        background: '#3b82f6',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid #2563eb',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow:
          '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        minWidth: '280px',
      },
      ...options,
    })
  },

  warning: (message: string, options?: any) => {
    return toast(message, {
      icon: <AlertTriangle className="w-5 h-5" />,
      style: {
        background: '#f59e0b',
        color: '#ffffff',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid #d97706',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow:
          '0 10px 25px -5px rgba(245, 158, 11, 0.4), 0 8px 10px -6px rgba(245, 158, 11, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        minWidth: '280px',
      },
      ...options,
    })
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid hsl(var(--border))',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
        minWidth: '280px',
      },
      ...options,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
    options?: any
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...options,
        style: {
          minWidth: '280px',
          ...options?.style,
        },
      }
    )
  },

  custom: (message: string, options?: any) => {
    return toast(message, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--card-foreground))',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '2px solid hsl(var(--border))',
        fontSize: '14px',
        fontWeight: '600',
        minWidth: '280px',
      },
      ...options,
    })
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },
}

export { toast }
