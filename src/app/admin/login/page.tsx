'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '../../../hooks/use-auth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Eye, EyeOff, Lock, Mail, Shield, X } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  admin_pass: z.string().min(1, 'Admin password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showAdminPass, setShowAdminPass] = useState(false)
  const [error, setError] = useState('')
  const { login, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault()
    setError('')
    try {
      console.log('Submitting login with data:', { email: data.email, admin_pass: data.admin_pass })
      const result = await login(data)
      console.log('Login result:', result)

      if (result.success) {
        toast.success('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 500)
      } else {
        const errorMessage =
          result.error ||
          'Invalid credentials. Please check your email, password, and admin password.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      console.error('Login submission error:', err)
      const errorMessage = 'Something went wrong. Please try again later.'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none opacity-20 flex items-center justify-center">
        <Shield className="w-[420px] h-[420px] text-primary/20 blur-3xl" />
      </div>
      <Card className="w-full max-w-md border-none bg-white/10 dark:bg-black/30 backdrop-blur-2xl rounded-3xl shadow-2xl z-10 px-2 py-2">
        <CardHeader className="text-center space-y-2 pb-2">
          <Shield className="mx-auto h-12 w-12 text-primary drop-shadow-lg" />
          <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Access restricted admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {error && (
              <Alert variant="destructive" className="flex items-center justify-between">
                <AlertDescription className="flex-1 text-sm">{error}</AlertDescription>
                <button onClick={() => setError('')} className="p-1">
                  <X className="w-4 h-4" />
                </button>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 focus:ring-2 focus:ring-primary/40 bg-white/80 dark:bg-black/40 border-none rounded-xl shadow-sm"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 focus:ring-2 focus:ring-primary/40 bg-white/80 dark:bg-black/40 border-none rounded-xl shadow-sm"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-primary hover:text-secondary transition"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="admin_pass" className="font-semibold">
                Admin Password
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="admin_pass"
                  type={showAdminPass ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  className="pl-10 pr-10 focus:ring-2 focus:ring-primary/40 bg-white/80 dark:bg-black/40 border-none rounded-xl shadow-sm"
                  {...register('admin_pass')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-primary hover:text-secondary transition"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  tabIndex={-1}
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.admin_pass && (
                <p className="text-xs text-destructive mt-1">{errors.admin_pass.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 py-3 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-secondary rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
