'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { SITE_CONFIG } from '@/config/site-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  Calendar,
  DollarSign,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Database,
  Settings,
  Star,
  Target,
  Award,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  products: {
    total: number
    active: number
    outOfStock: number
    lowStock: number
  }
  orders: {
    total: number
    pending: number
    processing: number
    completed: number
    revenue: number
  }
  customers: {
    total: number
    new: number
  }
  brands: {
    total: number
    active: number
  }
  categories: {
    total: number
    active: number
  }
}

interface RecentActivity {
  id: string
  type: 'order' | 'product' | 'customer' | 'user'
  message: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

export default function CustomDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // In a real implementation, you'd fetch this data from your API
        // For now, we'll simulate the data
        const mockStats: DashboardStats = {
          products: {
            total: 248,
            active: 215,
            outOfStock: 12,
            lowStock: 23,
          },
          orders: {
            total: 1456,
            pending: 23,
            processing: 45,
            completed: 1388,
            revenue: 8750000, // LKR
          },
          customers: {
            total: 3421,
            new: 87,
          },
          brands: {
            total: 12,
            active: 11,
          },
          categories: {
            total: 18,
            active: 16,
          },
        }

        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'order',
            message: 'New order #RS-20241209-ABC12 received from John Doe',
            timestamp: '2 minutes ago',
            status: 'success',
          },
          {
            id: '2',
            type: 'product',
            message: 'Product "Gray-Nicolls Bat GN500" is running low on stock (3 remaining)',
            timestamp: '15 minutes ago',
            status: 'warning',
          },
          {
            id: '3',
            type: 'order',
            message: 'Order #RS-20241209-XYZ89 has been shipped via Pronto Express',
            timestamp: '32 minutes ago',
            status: 'success',
          },
          {
            id: '4',
            type: 'customer',
            message: 'New customer registration: Sarah Wilson',
            timestamp: '1 hour ago',
            status: 'success',
          },
          {
            id: '5',
            type: 'product',
            message: 'Product "Molten Basketball BGM7X" went out of stock',
            timestamp: '2 hours ago',
            status: 'error',
          },
        ]

        setStats(mockStats)
        setRecentActivity(mockActivity)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Create a new product',
      icon: Package,
      color: 'bg-brand-primary',
      href: '/admin/collections/products/create',
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      icon: ShoppingCart,
      color: 'bg-brand-secondary',
      href: '/admin/collections/orders',
    },
    {
      title: 'Manage Users',
      description: 'User administration',
      icon: Users,
      color: 'bg-brand-accent',
      href: '/admin/collections/users',
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      color: 'bg-success',
      href: '/admin/analytics',
    },
  ]

  const collectionCards = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      count: stats?.products.total || 0,
      href: '/admin/collections/products',
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
    },
    {
      title: 'Orders',
      description: 'Track and manage orders',
      icon: ShoppingCart,
      count: stats?.orders.total || 0,
      href: '/admin/collections/orders',
      color: 'text-brand-secondary',
      bgColor: 'bg-brand-secondary/10',
    },
    {
      title: 'Customers',
      description: 'Customer management',
      icon: Users,
      count: stats?.customers.total || 0,
      href: '/admin/collections/customers',
      color: 'text-brand-accent',
      bgColor: 'bg-brand-accent/10',
    },
    {
      title: 'Brands',
      description: 'Manage brand information',
      icon: Award,
      count: stats?.brands.total || 0,
      href: '/admin/collections/brands',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg" />
              <div className="h-64 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {getGreeting()}, {user?.firstName || user?.email?.split('@')[0] || 'Admin'}!
            </h1>
            <p className="text-text-secondary mt-1">
              Welcome to your {SITE_CONFIG.branding.logoText} admin dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
            >
              <Zap className="w-3 h-3 mr-1" />
              Live Dashboard
            </Badge>
            <Badge
              variant="secondary"
              className="bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
            >
              {user?.role?.replace('-', ' ').toUpperCase() || 'USER'}
            </Badge>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatCurrency(stats?.orders.revenue || 0)}
                  </p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="bg-success/10 p-3 rounded-lg">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Active Products</p>
                  <p className="text-2xl font-bold text-text-primary">{stats?.products.active}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {stats?.products.total} total products
                  </p>
                </div>
                <div className="bg-brand-primary/10 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Pending Orders</p>
                  <p className="text-2xl font-bold text-text-primary">{stats?.orders.pending}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {stats?.orders.processing} processing
                  </p>
                </div>
                <div className="bg-brand-secondary/10 p-3 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-brand-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-brand-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">Total Customers</p>
                  <p className="text-2xl font-bold text-text-primary">{stats?.customers.total}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <Plus className="w-3 h-3" />
                    {stats?.customers.new} new this month
                  </p>
                </div>
                <div className="bg-brand-accent/10 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-brand-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {stats && (stats.products.outOfStock > 0 || stats.products.lowStock > 0) && (
          <Alert className="border-warning bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              <strong>Inventory Alert:</strong> {stats.products.outOfStock} products are out of
              stock and {stats.products.lowStock} products are running low on inventory.{' '}
              <Link
                href="/admin/collections/products"
                className="underline hover:no-underline font-medium"
              >
                Review inventory now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions & Collections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used admin functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className="flex flex-col items-center p-4 rounded-lg border border-brand-border hover:bg-brand-background transition-colors group"
                    >
                      <div className={`${action.color} p-3 rounded-lg text-white mb-3`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-text-primary text-sm text-center group-hover:text-brand-primary transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-text-secondary text-center mt-1">
                        {action.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collections Overview */}
            <Card className="bg-white border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand-secondary" />
                  Collections Overview
                </CardTitle>
                <CardDescription>Manage your data collections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {collectionCards.map((collection, index) => (
                    <Link
                      key={index}
                      href={collection.href}
                      className="flex items-center p-4 rounded-lg border border-brand-border hover:bg-brand-background transition-colors group"
                    >
                      <div className={`${collection.bgColor} p-3 rounded-lg mr-4`}>
                        <collection.icon className={`w-6 h-6 ${collection.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                          {collection.title}
                        </h3>
                        <p className="text-sm text-text-secondary">{collection.description}</p>
                        <p className="text-lg font-bold text-text-primary mt-1">
                          {collection.count.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-white border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-success" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Database Performance</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="w-20 h-2" />
                    <span className="text-sm font-medium text-success">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">API Response Time</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="w-20 h-2" />
                    <span className="text-sm font-medium text-success">85ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Storage Usage</span>
                  <div className="flex items-center gap-2">
                    <Progress value={67} className="w-20 h-2" />
                    <span className="text-sm font-medium text-brand-primary">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-accent" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`p-1.5 rounded-full ${
                          activity.status === 'success'
                            ? 'bg-success/10'
                            : activity.status === 'warning'
                              ? 'bg-warning/10'
                              : 'bg-error/10'
                        }`}
                      >
                        {activity.status === 'success' ? (
                          <CheckCircle
                            className={`w-3 h-3 ${
                              activity.status === 'success' ? 'text-success' : ''
                            }`}
                          />
                        ) : activity.status === 'warning' ? (
                          <AlertTriangle className="w-3 h-3 text-warning" />
                        ) : (
                          <XCircle className="w-3 h-3 text-error" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-primary">{activity.message}</p>
                        <p className="text-xs text-text-secondary">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white border-0">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 p-3 rounded-lg inline-block mb-4">
                  <img src="/logo.svg" alt="Ralhum Sports" className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">{SITE_CONFIG.branding.logoText}</h3>
                <p className="text-white/90 text-sm mb-4">{SITE_CONFIG.about.tagline}</p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Est. {SITE_CONFIG.about.established}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{SITE_CONFIG.about.yearsOfExcellence}+ Years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="bg-white border-brand-border">
              <CardHeader>
                <CardTitle className="text-lg text-text-primary flex items-center gap-2">
                  <Settings className="w-5 h-5 text-text-secondary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/admin/collections/products/create"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background transition-colors"
                >
                  <Plus className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm text-text-primary">Add New Product</span>
                </Link>
                <Link
                  href="/admin/collections/orders"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-brand-secondary" />
                  <span className="text-sm text-text-primary">Manage Orders</span>
                </Link>
                <Link
                  href="/admin/collections/customers"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background transition-colors"
                >
                  <Users className="w-4 h-4 text-brand-accent" />
                  <span className="text-sm text-text-primary">Customer Management</span>
                </Link>
                <Separator className="my-2" />
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background transition-colors"
                >
                  <Globe className="w-4 h-4 text-success" />
                  <span className="text-sm text-text-primary">View Website</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
