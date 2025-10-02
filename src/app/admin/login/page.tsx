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
      const result = await login(data)

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background p-4">
      <div className="space-y-8 max-w-md w-full">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30">
              <Shield className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent leading-tight">
            Admin Access Portal
          </h1>
          <p className="text-base text-foreground">
            Secure authentication required for admin panel access
          </p>
        </div>

        <Card className="border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl animate-fade-in">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-secondary">Sign In</CardTitle>
            <CardDescription className="text-foreground">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="flex items-center justify-between animate-fade-in"
                >
                  <AlertDescription className="flex-1 text-sm">{error}</AlertDescription>
                  <button onClick={() => setError('')} className="p-1 hover:opacity-70 transition">
                    <X className="w-4 h-4" />
                  </button>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10 focus:ring-2 focus:ring-secondary/40 bg-background/80 border-border rounded-xl h-11"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-foreground">
                  User Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 focus:ring-2 focus:ring-secondary/40 bg-background/80 border-border rounded-xl h-11"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
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

              <div className="space-y-2">
                <Label htmlFor="admin_pass" className="font-semibold text-foreground">
                  Admin Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary" />
                  <Input
                    id="admin_pass"
                    type={showAdminPass ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    className="pl-10 pr-10 focus:ring-2 focus:ring-secondary/40 bg-background/80 border-border rounded-xl h-11"
                    {...register('admin_pass')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
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
                className="w-full mt-4 h-11 text-base font-semibold shadow-md hover:shadow-xl transition-all duration-200 rounded-xl"
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
                    Authenticating...
                  </span>
                ) : (
                  'Sign In to Dashboard'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-foreground/70">
          <p>Authorized personnel only. All access is monitored and logged.</p>
        </div>
      </div>
    </div>
  )
}
