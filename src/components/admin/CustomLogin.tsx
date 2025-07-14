'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import { SITE_CONFIG } from '@/config/site-config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Users,
  Database,
  Settings,
  Trophy,
  Package,
  ShoppingCart,
} from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

export default function CustomLogin() {
  const { login, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const emailInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError('')

      try {
        await login({
          email: formData.email,
          password: formData.password,
        })

        // Redirect after successful login
        if (redirect) {
          router.push(redirect)
        } else {
          router.push('/admin')
        }
      } catch (err) {
        console.error('Login error:', err)
        setError('Invalid email or password. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [formData, login, router, redirect],
  )

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }))
        // Clear error when user starts typing
        if (error) setError('')
      }
    },
    [error],
  )

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push(redirect || '/admin')
    }
  }, [user, router, redirect])

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background flex items-center justify-center p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding and Information */}
        <div className="hidden lg:block space-y-8">
          {/* Main Logo and Tagline */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-brand-border">
                <img src="/logo.svg" alt="Ralhum Sports" className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-brand-secondary">
                  {SITE_CONFIG.branding.logoText}
                </h1>
                <p className="text-lg text-brand-primary font-medium">Admin Dashboard</p>
              </div>
            </div>
            <p className="text-xl text-text-primary font-medium mb-2">
              {SITE_CONFIG.about.tagline}
            </p>
            <p className="text-text-secondary">
              Manage your sports equipment business with our comprehensive admin system
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            {SITE_CONFIG.stats.slice(0, 4).map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-brand-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Admin Features */}
          <Card className="bg-white/80 backdrop-blur-sm border-brand-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-brand-secondary flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-4 h-4 text-brand-primary" />
                <span>Product & Inventory Management</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShoppingCart className="w-4 h-4 text-brand-primary" />
                <span>Order Processing & Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-brand-primary" />
                <span>Customer Relationship Management</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Database className="w-4 h-4 text-brand-primary" />
                <span>Analytics & Reporting</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Trophy className="w-4 h-4 text-brand-primary" />
                <span>Brand & Category Management</span>
              </div>
            </CardContent>
          </Card>

          {/* Heritage Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <Badge
                variant="secondary"
                className="bg-brand-accent/10 text-brand-accent border-brand-accent/20"
              >
                Est. {SITE_CONFIG.about.established}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
              >
                {SITE_CONFIG.about.yearsOfExcellence}+ Years
              </Badge>
            </div>
            <p className="text-sm text-text-secondary">{SITE_CONFIG.about.legacy.legacyText}</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white shadow-xl border-brand-border">
            <CardHeader className="text-center pb-6">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <div className="bg-brand-background p-2 rounded-lg">
                  <img src="/logo.svg" alt="Ralhum Sports" className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-brand-secondary">
                    {SITE_CONFIG.branding.logoText}
                  </h1>
                  <p className="text-sm text-brand-primary">Admin</p>
                </div>
              </div>

              <CardTitle className="text-2xl font-bold text-text-primary">Welcome Back</CardTitle>
              <CardDescription className="text-text-secondary">
                Sign in to access your admin dashboard
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-primary font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    ref={emailInputRef}
                    type="email"
                    placeholder="admin@ralhumsports.lk"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    disabled={isLoading}
                    className="border-brand-border focus:ring-brand-secondary focus:border-brand-secondary"
                    autoComplete="email"
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-text-primary font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      required
                      disabled={isLoading}
                      className="border-brand-border focus:ring-brand-secondary focus:border-brand-secondary pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                      tabIndex={-1}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary text-white font-medium py-2.5 mt-6"
                  disabled={isLoading || !formData.email || !formData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Sign In to Dashboard
                    </div>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Security Notice */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-text-secondary mb-2">
                  <Shield className="w-3 h-3" />
                  <span>Secure Admin Access</span>
                </div>
                <p className="text-xs text-text-secondary">
                  This is a restricted area. Only authorized personnel with valid credentials can
                  access this admin dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-text-secondary">
            <p>
              © {currentYear} {SITE_CONFIG.branding.companyName}. All rights reserved.
            </p>
            <p className="mt-1">
              Need help? Contact{' '}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-brand-primary hover:text-brand-secondary transition-colors"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
