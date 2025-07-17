'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  FolderTree,
  Package,
  TrendingUp,
  Archive,
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in a real app, this would come from your PayloadCMS API
const mockCategories = [
  {
    id: '1',
    name: 'Ball Sports',
    slug: 'ball-sports',
    description: 'Equipment for ball-based sports including cricket, rugby, basketball',
    type: 'category',
    status: 'active',
    productCount: 245,
    parent: null,
    icon: '⚽',
    createdAt: '2024-12-01',
    children: [
      {
        id: '2',
        name: 'Cricket',
        slug: 'cricket',
        description: 'Cricket equipment and accessories',
        type: 'sport',
        status: 'active',
        productCount: 125,
        parent: '1',
        createdAt: '2024-12-01',
        children: [
          {
            id: '3',
            name: 'Cricket Bats',
            slug: 'cricket-bats',
            description: 'Professional and recreational cricket bats',
            type: 'item',
            status: 'active',
            productCount: 45,
            parent: '2',
            createdAt: '2024-12-01',
          },
          {
            id: '4',
            name: 'Cricket Balls',
            slug: 'cricket-balls',
            description: 'Match and practice cricket balls',
            type: 'item',
            status: 'active',
            productCount: 28,
            parent: '2',
            createdAt: '2024-12-01',
          },
          {
            id: '5',
            name: 'Protective Gear',
            slug: 'cricket-protective',
            description: 'Cricket protective equipment',
            type: 'item',
            status: 'active',
            productCount: 52,
            parent: '2',
            createdAt: '2024-12-01',
          },
        ],
      },
      {
        id: '6',
        name: 'Rugby',
        slug: 'rugby',
        description: 'Rugby equipment and accessories',
        type: 'sport',
        status: 'active',
        productCount: 67,
        parent: '1',
        createdAt: '2024-12-01',
        children: [
          {
            id: '7',
            name: 'Rugby Balls',
            slug: 'rugby-balls',
            description: 'Official and training rugby balls',
            type: 'item',
            status: 'active',
            productCount: 35,
            parent: '6',
            createdAt: '2024-12-01',
          },
          {
            id: '8',
            name: 'Rugby Protective Gear',
            slug: 'rugby-protective',
            description: 'Rugby protective equipment',
            type: 'item',
            status: 'active',
            productCount: 32,
            parent: '6',
            createdAt: '2024-12-01',
          },
        ],
      },
      {
        id: '9',
        name: 'Basketball',
        slug: 'basketball',
        description: 'Basketball equipment',
        type: 'sport',
        status: 'active',
        productCount: 53,
        parent: '1',
        createdAt: '2024-12-01',
        children: [
          {
            id: '10',
            name: 'Basketball Balls',
            slug: 'basketball-balls',
            description: 'Professional basketball balls',
            type: 'item',
            status: 'active',
            productCount: 25,
            parent: '9',
            createdAt: '2024-12-01',
          },
          {
            id: '11',
            name: 'Basketball Accessories',
            slug: 'basketball-accessories',
            description: 'Basketball training and accessories',
            type: 'item',
            status: 'active',
            productCount: 28,
            parent: '9',
            createdAt: '2024-12-01',
          },
        ],
      },
    ],
  },
  {
    id: '12',
    name: 'Racquet Sports',
    slug: 'racquet-sports',
    description: 'Professional racquet equipment for tennis, badminton, and squash',
    type: 'category',
    status: 'active',
    productCount: 189,
    parent: null,
    icon: '🎾',
    createdAt: '2024-11-28',
    children: [
      {
        id: '13',
        name: 'Tennis',
        slug: 'tennis',
        description: 'Tennis rackets, strings, and accessories',
        type: 'sport',
        status: 'active',
        productCount: 89,
        parent: '12',
        createdAt: '2024-11-28',
      },
      {
        id: '14',
        name: 'Badminton',
        slug: 'badminton',
        description: 'Badminton rackets, strings, and accessories',
        type: 'sport',
        status: 'active',
        productCount: 67,
        parent: '12',
        createdAt: '2024-11-28',
      },
      {
        id: '15',
        name: 'Squash',
        slug: 'squash',
        description: 'Squash rackets and accessories',
        type: 'sport',
        status: 'active',
        productCount: 33,
        parent: '12',
        createdAt: '2024-11-28',
      },
    ],
  },
]

// Flatten categories for table view
function flattenCategories(categories: any[], level = 0): any[] {
  let result: any[] = []
  for (const category of categories) {
    result.push({ ...category, level })
    if (category.children) {
      result = result.concat(flattenCategories(category.children, level + 1))
    }
  }
  return result
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'tree' | 'table'>('tree')

  const flatCategories = flattenCategories(categories)

  // Filter categories based on search and filters
  const filteredCategories = flatCategories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || category.status === statusFilter
    const matchesType = typeFilter === 'all' || category.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
            Inactive
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-200">
            {status}
          </Badge>
        )
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'category':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
            Category
          </Badge>
        )
      case 'sport':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200">
            Sport
          </Badge>
        )
      case 'item':
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
            Item
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-700 border-gray-200">
            {type}
          </Badge>
        )
    }
  }

  const renderTreeView = (categories: any[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-3 border border-brand-border rounded-lg ${
            level > 0 ? 'ml-' + level * 6 : ''
          }`}
          style={{ marginLeft: level * 24 }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {category.type === 'category' && <FolderOpen className="h-5 w-5 text-blue-500" />}
              {category.type === 'sport' && <Package className="h-5 w-5 text-purple-500" />}
              {category.type === 'item' && <Archive className="h-5 w-5 text-orange-500" />}
              {category.icon && <span className="text-lg">{category.icon}</span>}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-text-primary">{category.name}</h3>
                {getTypeBadge(category.type)}
                {getStatusBadge(category.status)}
              </div>
              <p className="text-sm text-text-secondary mt-1">{category.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-text-secondary">
                  {category.productCount} products
                </span>
                <span className="text-xs text-text-secondary">/{category.slug}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  View Products
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {category.children && (
          <div className="mt-3 space-y-3">{renderTreeView(category.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/inventory">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Categories</h1>
            <p className="text-text-secondary mt-2">
              Organize products into hierarchical categories
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="flex border border-brand-border rounded-lg">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              className="rounded-r-none"
            >
              <FolderTree className="h-4 w-4 mr-2" />
              Tree
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="rounded-l-none"
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          <Button asChild>
            <Link href="/dashboard/inventory/categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Management</CardTitle>
          <CardDescription>Search and filter product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="category">Categories</SelectItem>
                <SelectItem value="sport">Sports</SelectItem>
                <SelectItem value="item">Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Display */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'tree' ? (
            <div className="p-6 space-y-4">{renderTreeView(categories)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div style={{ marginLeft: category.level * 16 }}>
                          <div className="flex items-center space-x-2">
                            {category.type === 'category' && (
                              <FolderOpen className="h-4 w-4 text-blue-500" />
                            )}
                            {category.type === 'sport' && (
                              <Package className="h-4 w-4 text-purple-500" />
                            )}
                            {category.type === 'item' && (
                              <Archive className="h-4 w-4 text-orange-500" />
                            )}
                            {category.icon && <span>{category.icon}</span>}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{category.name}</p>
                          <p className="text-sm text-text-secondary">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(category.type)}</TableCell>
                    <TableCell>{getStatusBadge(category.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {category.productCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary font-mono text-sm">
                      /{category.slug}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredCategories.length === 0 && (
            <div className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No categories found</h3>
              <p className="text-text-secondary mb-4">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first category.'}
              </p>
              {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                <Button asChild>
                  <Link href="/dashboard/inventory/categories/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Category
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-text-primary">{flatCategories.length}</div>
            <p className="text-xs text-text-secondary">Total Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {flatCategories.filter((c) => c.type === 'category').length}
            </div>
            <p className="text-xs text-text-secondary">Main Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {flatCategories.filter((c) => c.type === 'sport').length}
            </div>
            <p className="text-xs text-text-secondary">Sports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {flatCategories.filter((c) => c.type === 'item').length}
            </div>
            <p className="text-xs text-text-secondary">Sport Items</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
