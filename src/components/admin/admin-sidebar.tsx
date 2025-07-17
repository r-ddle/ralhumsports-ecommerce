'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  FolderOpen,
  Building2,
  UserCheck,
  ClipboardList,
  Shield,
  TrendingUp,
} from 'lucide-react'
import { AuthUser } from '@/lib/auth'
import Image from 'next/image'

interface AdminSidebarProps {
  user: AuthUser | null
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  description?: string
  roles?: string[]
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview and analytics',
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
    description: 'Manage product catalog',
    roles: ['super-admin', 'admin', 'product-manager'],
    children: [
      {
        title: 'All Products',
        href: '/dashboard/products',
        icon: Package,
        description: 'View and manage all products',
      },
      {
        title: 'Add Product',
        href: '/dashboard/products/new',
        icon: Package,
        description: 'Create new product',
      },
    ],
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: FolderOpen,
    description: 'Categories, brands & media',
    roles: ['super-admin', 'admin', 'product-manager', 'content-editor'],
    children: [
      {
        title: 'Categories',
        href: '/dashboard/inventory/categories',
        icon: FolderOpen,
        description: 'Manage product categories',
      },
      {
        title: 'Brands',
        href: '/dashboard/inventory/brands',
        icon: Building2,
        description: 'Manage brands',
      },
      {
        title: 'Media Library',
        href: '/dashboard/inventory/media',
        icon: Image,
        description: 'Manage images and files',
      },
    ],
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    description: 'Order management',
    roles: ['super-admin', 'admin'],
    children: [
      {
        title: 'All Orders',
        href: '/dashboard/orders',
        icon: ShoppingCart,
        description: 'View and manage orders',
      },
      {
        title: 'Order Analytics',
        href: '/dashboard/orders/analytics',
        icon: TrendingUp,
        description: 'Order reports and insights',
      },
    ],
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    description: 'Customer management',
    roles: ['super-admin', 'admin'],
    children: [
      {
        title: 'All Customers',
        href: '/dashboard/customers',
        icon: Users,
        description: 'View customer list',
      },
      {
        title: 'Customer Analytics',
        href: '/dashboard/customers/analytics',
        icon: BarChart3,
        description: 'Customer insights',
      },
    ],
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: UserCheck,
    description: 'User & role management',
    roles: ['super-admin'],
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Reports and insights',
    roles: ['super-admin', 'admin'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration',
    roles: ['super-admin', 'admin'],
  },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href],
    )
  }

  const hasAccess = (roles?: string[]) => {
    if (!roles || !user) return true
    return roles.includes(user.role)
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
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

  return (
    <div
      className={cn(
        'bg-brand-surface border-r border-brand-border flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-brand-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Image src="/logo.svg" alt="Ralhum Sports" width={32} height={32} />
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Ralhum Sports</h2>
                <p className="text-xs text-text-secondary">Admin Dashboard</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-brand-border">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-brand-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.email}</p>
                <Badge variant="outline" className={cn('text-xs', getRoleBadgeColor(user.role))}>
                  {user.role.replace('-', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map((item) => {
          if (!hasAccess(item.roles)) return null

          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.href)
          const itemIsActive = isActive(item.href)

          return (
            <div key={item.href}>
              {hasChildren ? (
                <Button
                  variant="ghost"
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    'w-full justify-start text-left h-auto p-3',
                    itemIsActive && 'bg-brand-primary/10 text-brand-primary',
                    isCollapsed && 'justify-center',
                  )}
                >
                  <item.icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-text-secondary">{item.description}</div>
                      )}
                    </div>
                  )}
                  {!isCollapsed && hasChildren && (
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'transform rotate-90',
                      )}
                    />
                  )}
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start text-left h-auto p-3',
                      itemIsActive && 'bg-brand-primary/10 text-brand-primary',
                      isCollapsed && 'justify-center',
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-text-secondary">{item.description}</div>
                        )}
                      </div>
                    )}
                    {item.badge && !isCollapsed && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* Children Navigation */}
              {hasChildren && isExpanded && !isCollapsed && (
                <div className="ml-4 mt-2 space-y-1 border-l border-brand-border pl-4">
                  {item.children?.map((child) => (
                    <Link key={child.href} href={child.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start text-left h-auto p-2 text-sm',
                          isActive(child.href) && 'bg-brand-primary/5 text-brand-primary',
                        )}
                      >
                        <child.icon className="h-3 w-3 mr-2" />
                        <div className="flex-1">
                          <div className="font-medium">{child.title}</div>
                          {child.description && (
                            <div className="text-xs text-text-secondary">{child.description}</div>
                          )}
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-brand-border">
          <div className="text-xs text-text-secondary text-center">
            <p>Ralhum Sports Admin</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  )
}
