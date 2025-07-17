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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Download,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Filter,
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in a real app, this would come from your PayloadCMS API
const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+94 77 123 4567',
    address: 'Colombo 03, Sri Lanka',
    totalOrders: 12,
    totalSpent: 345000,
    averageOrderValue: 28750,
    lastOrder: '2024-12-10',
    registeredDate: '2024-03-15',
    status: 'active',
    customerType: 'premium',
    notes: 'Frequent buyer, prefers cricket equipment',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+94 71 987 6543',
    address: 'Kandy, Sri Lanka',
    totalOrders: 8,
    totalSpent: 125000,
    averageOrderValue: 15625,
    lastOrder: '2024-12-08',
    registeredDate: '2024-06-22',
    status: 'active',
    customerType: 'regular',
    notes: 'Interested in tennis equipment',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+94 70 456 7890',
    address: 'Galle, Sri Lanka',
    totalOrders: 25,
    totalSpent: 780000,
    averageOrderValue: 31200,
    lastOrder: '2024-12-12',
    registeredDate: '2023-11-10',
    status: 'active',
    customerType: 'vip',
    notes: 'Bulk orders for sports club',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+94 76 234 5678',
    address: 'Negombo, Sri Lanka',
    totalOrders: 3,
    totalSpent: 45000,
    averageOrderValue: 15000,
    lastOrder: '2024-11-28',
    registeredDate: '2024-09-05',
    status: 'active',
    customerType: 'new',
    notes: 'First-time buyer, interested in hockey gear',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    phone: '+94 72 345 6789',
    address: 'Matara, Sri Lanka',
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    lastOrder: null,
    registeredDate: '2024-12-01',
    status: 'inactive',
    customerType: 'new',
    notes: 'Registered but no orders yet',
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Filter customers based on search and filters
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesType = typeFilter === 'all' || customer.customerType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'orders':
          return b.totalOrders - a.totalOrders
        case 'spent':
          return b.totalSpent - a.totalSpent
        case 'recent':
        default:
          return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime()
      }
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

  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case 'vip':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200">
            VIP
          </Badge>
        )
      case 'premium':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
            Premium
          </Badge>
        )
      case 'regular':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            Regular
          </Badge>
        )
      case 'new':
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
            New
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Customers</h1>
          <p className="text-text-secondary mt-2">Manage your customer relationships and data</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{customers.length}</div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">+3</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              {customers.filter((c) => c.status === 'active').length}
            </div>
            <p className="text-xs text-text-secondary">
              {Math.round(
                (customers.filter((c) => c.status === 'active').length / customers.length) * 100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              {Math.round(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length)}
            </div>
            <p className="text-xs text-text-secondary">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              LKR{' '}
              {Math.round(
                customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length,
              ).toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Management</CardTitle>
          <CardDescription>Search, filter, and manage customer relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search customers by name, email, or phone..."
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
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="new">New</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="orders">Most Orders</SelectItem>
                <SelectItem value="spent">Highest Spent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`}
                        />
                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-text-primary">{customer.name}</p>
                        <p className="text-sm text-text-secondary">
                          Joined {new Date(customer.registeredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{customer.address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCustomerTypeBadge(customer.customerType)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.totalOrders}</div>
                    {customer.averageOrderValue > 0 && (
                      <div className="text-xs text-text-secondary">
                        Avg: LKR {customer.averageOrderValue.toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    LKR {customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {customer.lastOrder ? (
                      <div>
                        <div className="text-sm">
                          {new Date(customer.lastOrder).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {Math.ceil(
                            (new Date().getTime() - new Date(customer.lastOrder).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{' '}
                          days ago
                        </div>
                      </div>
                    ) : (
                      <span className="text-text-secondary">No orders</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/customers/${customer.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/customers/${customer.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          View Orders
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No customers found</h3>
              <p className="text-text-secondary mb-4">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start building your customer base by adding your first customer.'}
              </p>
              {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                <Button asChild>
                  <Link href="/dashboard/customers/new">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Customer
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Insights</CardTitle>
          <CardDescription>Key customer metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Types Distribution */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Customer Types</h4>
              <div className="space-y-2">
                {['vip', 'premium', 'regular', 'new'].map((type) => {
                  const count = customers.filter((c) => c.customerType === type).length
                  const percentage = Math.round((count / customers.length) * 100)
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-text-secondary">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Customers */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Top Customers by Spent</h4>
              <div className="space-y-2">
                {customers
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .slice(0, 3)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <span className="text-sm">{customer.name}</span>
                      <span className="text-sm font-medium">
                        LKR {customer.totalSpent.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {customers
                  .filter((c) => c.lastOrder)
                  .sort(
                    (a, b) => new Date(b.lastOrder!).getTime() - new Date(a.lastOrder!).getTime(),
                  )
                  .slice(0, 3)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <span className="text-sm">{customer.name}</span>
                      <span className="text-xs text-text-secondary">
                        {Math.ceil(
                          (new Date().getTime() - new Date(customer.lastOrder!).getTime()) /
                            (1000 * 60 * 60 * 24),
                        )}{' '}
                        days ago
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
