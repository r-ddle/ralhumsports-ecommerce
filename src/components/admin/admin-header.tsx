'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Shield,
  MessageCircle,
  Plus,
  HelpCircle,
} from 'lucide-react'
import { AuthUser } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface AdminHeaderProps {
  user: AuthUser | null
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      })
      router.push('/dashboard/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-500/10 text-red-700 border-red-200'
      case 'admin':
        return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'product-manager':
        return 'bg-green-500/10 text-green-700 border-green-200'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const quickActions = [
    {
      label: 'Add Product',
      href: '/dashboard/products/new',
      icon: Plus,
      roles: ['super-admin', 'admin', 'product-manager'],
    },
    {
      label: 'View Orders',
      href: '/dashboard/orders',
      icon: MessageCircle,
      roles: ['super-admin', 'admin'],
    },
  ]

  const hasAccess = (roles?: string[]) => {
    if (!roles || !user) return true
    return roles.includes(user.role)
  }

  return (
    <header className="bg-brand-surface border-b border-brand-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-brand-border focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {quickActions
              .filter((action) => hasAccess(action.roles))
              .map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(action.href)}
                  className="border-brand-border hover:bg-brand-primary hover:text-white"
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-brand-primary rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-text-secondary">
                    5 products are running low on inventory
                  </p>
                  <p className="text-xs text-text-secondary">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Order Received</p>
                  <p className="text-xs text-text-secondary">
                    Order #RS-20241215-A1B2C from John Doe
                  </p>
                  <p className="text-xs text-text-secondary">5 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Payment Confirmed</p>
                  <p className="text-xs text-text-secondary">
                    Payment received for Order #RS-20241214-X9Y8Z
                  </p>
                  <p className="text-xs text-text-secondary">1 day ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Notifications
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="sm">
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-brand-primary/5"
              >
                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-brand-primary" />
                </div>
                {user && (
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-text-primary">{user.email}</p>
                    <Badge
                      variant="outline"
                      className={cn('text-xs', getRoleBadgeColor(user.role))}
                    >
                      {user.role.replace('-', ' ')}
                    </Badge>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="space-y-1">
                  <p className="font-medium">{user?.email}</p>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getRoleBadgeColor(user?.role || ''))}
                  >
                    {user?.role.replace('-', ' ')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/profile')}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/settings')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
