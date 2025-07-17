'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

import { useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
  slug: string
  category: string | null
  brand: string | null
  price: number
  images: any[]
  status: string
  createdAt: string
  updatedAt: string
}

type Order = {
  id: string
  customerName: string
  orderTotal: number
  orderStatus: string
  createdAt: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const prodRes = await fetch('/api/public/products')
        const prodJson = await prodRes.json()
        setProducts(prodJson.formatted || prodJson.docs || [])
        const orderRes = await fetch('/api/public/orders')
        const orderJson = await orderRes.json()
        setOrders(orderJson.docs || [])
      } catch (e: any) {
        setError(e.message || 'Failed to fetch dashboard data')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  // Compute dashboard stats from products
  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === 'active').length
  const outOfStock = products.filter((p) => p.status === 'out-of-stock').length
  const lowStockProducts = products.filter((p) => {
    // Check base stock and variants if present
    if ('stock' in p && typeof (p as any).stock === 'number') {
      return (
        (p as any).stock > 0 && (p as any).stock <= ((p as any).pricing?.lowStockThreshold || 5)
      )
    }
    if ('variants' in p && Array.isArray((p as any).variants)) {
      return (p as any).variants.some(
        (v: any) => v.inventory > 0 && v.inventory <= ((p as any).pricing?.lowStockThreshold || 5),
      )
    }
    return false
  })

  // Compute order stats
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length
  const completedOrders = orders.filter(
    (o) => o.orderStatus === 'completed' || o.orderStatus === 'delivered',
  ).length
  const recentOrders = orders.slice(0, 4)

  // Placeholder for customer stats (requires customer API)
  const totalCustomers = 0
  const newCustomers = 0

  // Revenue stats (requires order data with totals)
  const monthlyRevenue = orders.reduce((acc, o) => acc + (o.orderTotal || 0), 0)
  const averageOrderValue = totalOrders > 0 ? monthlyRevenue / totalOrders : 0

  if (loading) {
    return <div className="text-center py-12 text-lg text-text-secondary">Loading dashboard...</div>
  }
  if (error) {
    return <div className="text-center py-12 text-lg text-red-600">Error: {error}</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'shipped':
        return 'bg-purple-500/10 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-500/10 text-green-700 border-green-200'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{totalProducts}</div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">{activeProducts - outOfStock}</span> active products
            </p>
            <div className="mt-2 flex space-x-2">
              <Badge variant="outline" className="text-xs">
                {activeProducts} Active
              </Badge>
              <Badge variant="outline" className="text-xs text-red-600">
                {outOfStock} Out of Stock
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Orders Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{totalOrders}</div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">{completedOrders}</span> completed
            </p>
            <div className="mt-2 flex space-x-2">
              <Badge variant="outline" className="text-xs text-yellow-600">
                {pendingOrders} Pending
              </Badge>
              <Badge variant="outline" className="text-xs text-green-600">
                {completedOrders} Completed
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Customers Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{totalCustomers}</div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">+{newCustomers}</span> new this month
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs text-blue-600">
                Active Users
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              LKR {monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">
                {totalOrders > 0 ? ((monthlyRevenue / totalOrders) * 100).toFixed(2) : '0'}%
              </span>{' '}
              average order value
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Avg: LKR {averageOrderValue.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders and their status</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/orders">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border border-brand-border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-text-primary">{order.id}</p>
                    <p className="text-sm text-text-secondary">{order.customerName}</p>
                    <p className="text-xs text-text-secondary">{order.createdAt}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-text-primary">
                      LKR {order.orderTotal?.toLocaleString()}
                    </p>
                    <Badge variant="outline" className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Low Stock Alerts
                </CardTitle>
                <CardDescription>Products that need attention</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/products?filter=low-stock">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex items-center justify-between p-3 border border-brand-border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-text-primary">{product.name}</p>
                    <p className="text-sm text-text-secondary">
                      Threshold: {(product as any).pricing?.lowStockThreshold || 5} units
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
                      {(product as any).stock !== undefined
                        ? (product as any).stock
                        : (product as any).variants
                          ? (product as any).variants.reduce(
                              (acc: number, v: any) => acc + (v.inventory || 0),
                              0,
                            )
                          : 0}{' '}
                      left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/products/new">
                <Package className="h-6 w-6 text-brand-primary" />
                <span>Add New Product</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/orders">
                <ShoppingCart className="h-6 w-6 text-brand-primary" />
                <span>Process Orders</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/customers">
                <Users className="h-6 w-6 text-brand-primary" />
                <span>Manage Customers</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
