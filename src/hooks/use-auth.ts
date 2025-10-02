'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../util/apiResponse.util'
import { AuthRequest } from '../data/types.data'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: AuthRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setLoading: (loading: boolean) => void
  initializeAuth: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: AuthRequest) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(credentials)

          if (!response || typeof response !== 'object') {
            console.error('Login failed: No response or invalid response object')
            set({ isLoading: false })
            return { success: false, error: 'No response from server.' }
          }

          const status = response.status
          const token = response.token

          if ((status === 202 || status === 201 || status === 200) && token) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('jwt_token', token)
            }
            set({
              token,
              isAuthenticated: true,
              isLoading: false,
            })
            return { success: true }
          }

          if (response.message) {
            console.error('Login failed:', response.message)
            set({ isLoading: false })
            return { success: false, error: response.message || 'Login failed. Please try again.' }
          }
          if (!token) {
            console.error('Login failed: Missing token in response', response)
            set({ isLoading: false })
            return { success: false, error: 'Invalid server response. Please contact support.' }
          }

          set({ isLoading: false })
          return { success: false, error: 'Login failed. Please try again.' }
        } catch (error: any) {
          console.error('Login error caught:', error)
          console.error('Error type:', typeof error)
          console.error('Error name:', error?.name)
          console.error('Error message:', error?.message)
          console.error('Error response:', error?.response)
          console.error('Error response data:', error?.response?.data)
          console.error('Error response status:', error?.response?.status)
          console.error('Error code:', error?.code)

          let errorMsg = 'Network error. Please try again.'
          if (error?.response?.data?.message) {
            errorMsg = error.response.data.message
          } else if (error?.response?.data?.error) {
            errorMsg = error.response.data.error
          } else if (error?.message) {
            errorMsg = error.message
          }
          console.error('Final error message:', errorMsg)
          set({ isLoading: false })
          return { success: false, error: errorMsg }
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token')
          window.location.href = '/'
        }
        set({
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      initializeAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('jwt_token')
          if (token) {
            set({
              token,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              token: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
