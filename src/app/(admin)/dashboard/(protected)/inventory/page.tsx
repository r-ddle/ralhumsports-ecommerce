import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FolderOpen,
  Building2,
  Image,
  Plus,
  TrendingUp,
  Package,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in a real app, this would come from your PayloadCMS API
const inventoryStats = {
  categories: {
    total: 12,
    active: 10,
    inactive: 2,
    withProducts: 8,
  },
  brands: {
    total: 9,
    active: 9,
    inactive: 0,
    withProducts: 7,
  },
  media: {
    total: 456,
    images: 398,
    videos: 12,
    documents: 46,
    sizeUsed: '2.3 GB',
    sizeLimit: '10 GB',
  },
}

const recentActivity = [
  {
    type: 'category',
    action: 'created',
    item: 'Training Equipment',
    time: '2 hours ago',
    user: 'Admin',
  },
  {
    type: 'brand',
    action: 'updated',
    item: 'Gray-Nicolls',
    time: '5 hours ago',
    user: 'Product Manager',
  },
  {
    type: 'media',
    action: 'uploaded',
    item: '15 product images',
    time: '1 day ago',
    user: 'Content Editor',
  },
  {
    type: 'category',
    action: 'updated',
    item: 'Cricket Equipment',
    time: '2 days ago',
    user: 'Admin',
  },
]

const topCategories = [
  { name: 'Cricket Equipment', products: 125, percentage: 35 },
  { name: 'Tennis & Racquet Sports', products: 89, percentage: 25 },
  { name: 'Rugby Equipment', products: 67, percentage: 18 },
  { name: 'Field Hockey', products: 45, percentage: 12 },
  { name: 'Training Equipment', products: 32, percentage: 10 },
]

const topBrands = [
  { name: 'Gray-Nicolls', products: 95, percentage: 28 },
  { name: 'Gilbert', products: 78, percentage: 23 },
  { name: 'Babolat', products: 65, percentage: 19 },
  { name: 'Grays', products: 54, percentage: 16 },
  { name: 'Molten', products: 48, percentage: 14 },
]

export default function InventoryPage() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'category':
        return <FolderOpen className="h-4 w-4 text-blue-500" />
      case 'brand':
        return <Building2 className="h-4 w-4 text-green-500" />
      case 'media':
        return <Image className="h-4 w-4 text-purple-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'category':
        return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'brand':
        return 'bg-green-500/10 text-green-700 border-green-200'
      case 'media':
        return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Inventory Management</h1>
          <p className="text-text-secondary mt-2">
            Manage categories, brands, and media assets for your products
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium text-blue-900">Categories</CardTitle>
              <CardDescription className="text-blue-700">Product organization</CardDescription>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {inventoryStats.categories.total}
            </div>
            <p className="text-sm text-blue-700 mt-2">
              <span className="font-medium">{inventoryStats.categories.active}</span> active,{' '}
              <span className="font-medium">{inventoryStats.categories.withProducts}</span> with
              products
            </p>
            <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700" size="sm">
              <Link href="/dashboard/inventory/categories">
                Manage Categories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Brands Card */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium text-green-900">Brands</CardTitle>
              <CardDescription className="text-green-700">Brand partnerships</CardDescription>
            </div>
            <Building2 className="h-8 w-8 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{inventoryStats.brands.total}</div>
            <p className="text-sm text-green-700 mt-2">
              <span className="font-medium">{inventoryStats.brands.active}</span> active,{' '}
              <span className="font-medium">{inventoryStats.brands.withProducts}</span> with
              products
            </p>
            <Button asChild className="w-full mt-4 bg-green-600 hover:bg-green-700" size="sm">
              <Link href="/dashboard/inventory/brands">
                Manage Brands
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Media Card */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium text-purple-900">Media Library</CardTitle>
              <CardDescription className="text-purple-700">Assets and files</CardDescription>
            </div>
            <Image className="h-8 w-8 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{inventoryStats.media.total}</div>
            <p className="text-sm text-purple-700 mt-2">
              {inventoryStats.media.sizeUsed} / {inventoryStats.media.sizeLimit} used
            </p>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
            <Button asChild className="w-full mt-4 bg-purple-600 hover:bg-purple-700" size="sm">
              <Link href="/dashboard/inventory/media">
                Manage Media
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Categories with the most products</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/inventory/categories">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{category.name}</p>
                      <p className="text-sm text-text-secondary">{category.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <p className="text-sm text-text-secondary mt-1">{category.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Brands */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Brands</CardTitle>
                <CardDescription>Brands with the most products</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/inventory/brands">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBrands.map((brand, index) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{brand.name}</p>
                      <p className="text-sm text-text-secondary">{brand.products} products</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <p className="text-sm text-text-secondary mt-1">{brand.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes to categories, brands, and media</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-brand-border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="font-medium text-text-primary">
                      {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}{' '}
                      {activity.item}
                    </p>
                    <p className="text-sm text-text-secondary">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getActivityColor(activity.type)}>
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common inventory management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/inventory/categories/new">
                <FolderOpen className="h-6 w-6 text-blue-600" />
                <span>Add Category</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/inventory/brands/new">
                <Building2 className="h-6 w-6 text-green-600" />
                <span>Add Brand</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/dashboard/inventory/media">
                <Image className="h-6 w-6 text-purple-600" />
                <span>Upload Media</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
