import { useState, useCallback } from 'react'
import { authService, type ApiResponse } from '@/services'

interface ServiceState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useBackendServices = () => {
  const [state, setState] = useState<ServiceState<any>>({
    data: null,
    loading: false,
    error: null,
  })

  const executeService = useCallback(
    async <T>(serviceCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T> | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const response = await serviceCall()

        if (response.success) {
          setState((prev) => ({ ...prev, data: response.data, loading: false }))
        } else {
          setState((prev) => ({
            ...prev,
            error: response.error || 'Operation failed',
            loading: false,
          }))
        }

        return response
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
        return null
      }
    },
    []
  )

  const clearState = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    executeService,
    clearState,

    login: (credentials: { email: string; password: string }) =>
      executeService(() => authService.login(credentials)),

    register: (userData: { email: string; username: string; password: string }) =>
      executeService(() => authService.register(userData)),

    logout: () => executeService(() => authService.logout()),

    getCurrentUser: () => executeService(() => authService.getCurrentUser()),
  }
}
