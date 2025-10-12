'use client'

import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { useAuth } from '../../../hooks/use-auth'
import { User, Mail, Shield, Calendar, Award, Briefcase, FolderKanban, Clock } from 'lucide-react'
import api from '../../../util/api'
import { ProfileData } from '@/data/types.data'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { logout } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/auth', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') || ''}`,
          },
        })
        console.log('Here is response: ', response)
        setProfile(response.data.data)
      } catch {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    )
  if (error)
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-4xl">😢</span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
          <p className="text-foreground text-lg">{error}</p>
        </div>
      </div>
    )

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30">
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
          Admin Profile
        </h1>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          Manage your account information and view your portfolio statistics
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Information Card */}
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border-2 border-border/50 hover:border-primary/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
              <User className="w-6 h-6" />
              Account Information
            </CardTitle>
            <CardDescription className="text-foreground/60">
              Your registered account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-sm text-foreground/80">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </Label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted/50 border-muted text-foreground font-medium"
                />
                <p className="text-xs text-foreground/60">Primary contact email</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-sm text-foreground/80">
                  <Shield className="w-4 h-4 text-secondary" />
                  User ID
                </Label>
                <Input
                  value={profile?.inline?.id || ''}
                  disabled
                  className="bg-muted/50 border-muted text-foreground font-mono text-xs"
                />
                <p className="text-xs text-foreground/60">Unique identifier</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-sm text-foreground/80">
                  <Calendar className="w-4 h-4 text-accent" />
                  Account Created
                </Label>
                <Input
                  value={
                    profile?.inline?.created_at
                      ? new Date(profile.inline.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''
                  }
                  disabled
                  className="bg-muted/50 border-muted text-foreground font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-sm text-foreground/80">
                  <Clock className="w-4 h-4 text-green-500" />
                  Last Updated
                </Label>
                <Input
                  value={
                    profile?.inline?.updated_at
                      ? new Date(profile.inline.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''
                  }
                  disabled
                  className="bg-muted/50 border-muted text-foreground font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-500/20">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Administrator Access</p>
                    <p className="text-xs text-foreground/60">Full system privileges enabled</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border-2 border-border/50 hover:border-secondary/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-secondary">Portfolio Stats</CardTitle>
            <CardDescription className="text-foreground/60">Your content overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FolderKanban className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Projects</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {profile?.projects?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Briefcase className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium text-foreground">Experiences</span>
                </div>
                <span className="text-2xl font-bold text-secondary">
                  {profile?.experiences?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium text-foreground">Certifications</span>
                </div>
                <span className="text-2xl font-bold text-accent">
                  {profile?.certifications?.length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card - Full Width */}
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-md border-2 border-border/50 hover:border-primary/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
              <Shield className="w-6 h-6 text-primary" />
              Security & Session
            </CardTitle>
            <CardDescription className="text-foreground/60">
              Manage your active session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">Active Session</p>
                  <p className="text-sm text-foreground/60 mt-1">
                    Authenticated with full admin privileges
                  </p>
                </div>
              </div>

              <Button
                onClick={logout}
                variant="outline"
                className="border-2 border-foreground/20 hover:border-foreground/40 hover:bg-muted/50 text-foreground font-semibold px-6 py-3 transition-all"
              >
                <Shield className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
