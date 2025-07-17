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
  ShoppingCart,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Plus,
  Filter,
  Calendar,
  CreditCard,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'

// Mock data - in a real app, this would come from your PayloadCMS API
const mockOrders = [
  {
    id: '1',
    orderNumber: 'RS-20241215-A1B2C',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '+94 77 123 4567',
    deliveryAddress: 'No. 45, Galle Road, Colombo 03, Sri Lanka',
    orderItems: [
      {
        productName: 'Gray-Nicolls Ventus Cricket Bat',
        productSku: 'RS-001-GN-VENTUS',
        quantity: 1,
        unitPrice: 25000,
        subtotal: 25000,
      },
      {
        productName: 'Cricket Protective Pads',
        productSku: 'RS-010-PADS',
        quantity: 1,
        unitPrice: 8500,
        subtotal: 8500,
      },
    ],
    orderSubtotal: 33500,
    shippingCost: 1000,
    discount: 0,
    orderTotal: 34500,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    orderSource: 'website',
    whatsappSent: false,
    specialInstructions: 'Please call before delivery',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'RS-20241214-X9Y8Z',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '+94 71 987 6543',
    deliveryAddress: 'Temple Road, Kandy, Sri Lanka',
    orderItems: [
      {
        productName: 'Babolat Tennis Racket Pure',
        productSku: 'RS-003-BB-PURE',
        quantity: 1,
        unitPrice: 18000,
        subtotal: 18000,
      },
    ],
    orderSubtotal: 18000,
    shippingCost: 1500,
    discount: 1500,
    orderTotal: 18000,
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'bank-transfer',
    orderSource: 'website',
    whatsappSent: true,
    specialInstructions: null,
    createdAt: '2024-12-14T14:20:00Z',
    updatedAt: '2024-12-14T15:45:00Z',
  },
  {
    id: '3',
    orderNumber: 'RS-20241213-M5N6P',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.johnson@example.com',
    customerPhone: '+94 70 456 7890',
    deliveryAddress: 'Sports Club, Galle Fort, Galle, Sri Lanka',
    orderItems: [
      {
        productName: 'Gilbert Rugby Ball Official',
        productSku: 'RS-002-GL-RUGBY',
        quantity: 5,
        unitPrice: 8500,
        subtotal: 42500,
      },
      {
        productName: 'Rugby Training Cones',
        productSku: 'RS-015-CONES',
        quantity: 1,
        unitPrice: 3500,
        subtotal: 3500,
      },
    ],
    orderSubtotal: 46000,
    shippingCost: 2000,
    discount: 2000,
    orderTotal: 46000,
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'online-payment',
    orderSource: 'phone',
    whatsappSent: true,
    specialInstructions: 'Bulk order for sports club training',
    createdAt: '2024-12-13T09:15:00Z',
    updatedAt: '2024-12-14T11:30:00Z',
  },
  {
    id: '4',
    orderNumber: 'RS-20241212-Q2R3S',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    customerPhone: '+94 76 234 5678',
    deliveryAddress: 'Lewis Place, Negombo, Sri Lanka',
    orderItems: [
      {
        productName: 'Grays Hockey Stick Pro',
        productSku: 'RS-005-GR-STICK',
        quantity: 1,
        unitPrice: 15000,
        subtotal: 15000,
      },
    ],
    orderSubtotal: 15000,
    shippingCost: 1200,
    discount: 0,
    orderTotal: 16200,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    orderSource: 'website',
    whatsappSent: true,
    specialInstructions: null,
    createdAt: '2024-12-12T16:45:00Z',
    updatedAt: '2024-12-13T10:20:00Z',
  },
  {
    id: '5',
    orderNumber: 'RS-20241211-T4U5V',
    customerName: 'David Brown',
    customerEmail: 'david.brown@example.com',
    customerPhone: '+94 72 345 6789',
    deliveryAddress: 'Beach Road, Matara, Sri Lanka',
    orderItems: [
      {
        productName: 'Molten Basketball Official',
        productSku: 'RS-004-MT-BALL',
        quantity: 2,
        unitPrice: 12000,
        subtotal: 24000,
      },
    ],
    orderSubtotal: 24000,
    shippingCost: 1800,
    discount: 0,
    orderTotal: 25800,
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'bank-transfer',
    orderSource: 'whatsapp',
    whatsappSent: true,
    specialInstructions: 'Customer requested cancellation',
    createdAt: '2024-12-11T12:30:00Z',
    updatedAt: '2024-12-12T09:15:00Z',
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')

  // Filter orders based on search and filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)

    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter
    const matchesSource = sourceFilter === 'all' || order.orderSource === sourceFilter

    // Date range filtering (simplified)
    let matchesDate = true
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      const daysDiff = Math.ceil((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (dateRange) {
        case 'today':
          matchesDate = daysDiff <= 1
          break
        case 'week':
          matchesDate = daysDiff <= 7
          break
        case 'month':
          matchesDate = daysDiff <= 30
          break
      }
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesSource && matchesDate
  })

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200">
            <Package className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        )
      case 'shipped':
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 border-indigo-200">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        )
      case 'delivered':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Cancelled
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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
            Paid
          </Badge>
        )
      case 'partially-paid':
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-200">
            Partial
          </Badge>
        )
      case 'refunded':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
            Refunded
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">
            Failed
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

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'cod':
        return (
          <Badge variant="outline" className="text-xs">
            Cash on Delivery
          </Badge>
        )
      case 'bank-transfer':
        return (
          <Badge variant="outline" className="text-xs">
            Bank Transfer
          </Badge>
        )
      case 'online-payment':
        return (
          <Badge variant="outline" className="text-xs">
            Online Payment
          </Badge>
        )
      case 'card-payment':
        return (
          <Badge variant="outline" className="text-xs">
            Card Payment
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {method}
          </Badge>
        )
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'website':
        return (
          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 border-blue-200">
            Website
          </Badge>
        )
      case 'whatsapp':
        return (
          <Badge
            variant="outline"
            className="text-xs bg-green-500/10 text-green-700 border-green-200"
          >
            WhatsApp
          </Badge>
        )
      case 'phone':
        return (
          <Badge
            variant="outline"
            className="text-xs bg-purple-500/10 text-purple-700 border-purple-200"
          >
            Phone
          </Badge>
        )
      case 'store':
        return (
          <Badge
            variant="outline"
            className="text-xs bg-orange-500/10 text-orange-700 border-orange-200"
          >
            In Store
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {source}
          </Badge>
        )
    }
  }

  const getTotalItemsCount = (order: any) => {
    return order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Orders</h1>
          <p className="text-text-secondary mt-2">Manage and track customer orders and payments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/orders/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">{orders.length}</div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">+5</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.orderStatus === 'pending').length}
            </div>
            <p className="text-xs text-text-secondary">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              LKR {orders.reduce((sum, order) => sum + order.orderTotal, 0).toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <Package className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-text-primary">
              LKR{' '}
              {Math.round(
                orders.reduce((sum, order) => sum + order.orderTotal, 0) / orders.length,
              ).toLocaleString()}
            </div>
            <p className="text-xs text-text-secondary">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Management</CardTitle>
          <CardDescription>Search, filter, and manage customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search orders by number, customer, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially-paid">Partially Paid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="store">In Store</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const dateTime = formatDate(order.createdAt)
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-primary">{order.orderNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {order.whatsappSent && (
                            <MessageCircle className="h-3 w-3 text-green-500" />
                          )}
                          {order.specialInstructions && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text-primary">{order.customerName}</p>
                        <div className="text-xs text-text-secondary space-y-0.5">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{order.customerEmail}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{order.customerPhone}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getTotalItemsCount(order)} items</p>
                        <p className="text-xs text-text-secondary">
                          {order.orderItems.length} product
                          {order.orderItems.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">LKR {order.orderTotal.toLocaleString()}</p>
                        {order.discount > 0 && (
                          <p className="text-xs text-green-600">
                            -{order.discount.toLocaleString()} discount
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPaymentStatusBadge(order.paymentStatus)}
                        {getPaymentMethodBadge(order.paymentMethod)}
                      </div>
                    </TableCell>
                    <TableCell>{getSourceBadge(order.orderSource)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{dateTime.date}</p>
                        <p className="text-xs text-text-secondary">{dateTime.time}</p>
                      </div>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
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
                            <Download className="mr-2 h-4 w-4" />
                            Download Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No orders found</h3>
              <p className="text-text-secondary mb-4">
                {searchQuery ||
                statusFilter !== 'all' ||
                paymentFilter !== 'all' ||
                sourceFilter !== 'all' ||
                dateRange !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Orders will appear here as customers place them.'}
              </p>
              {!searchQuery &&
                statusFilter === 'all' &&
                paymentFilter === 'all' &&
                sourceFilter === 'all' &&
                dateRange === 'all' && (
                  <Button asChild>
                    <Link href="/dashboard/orders/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Order
                    </Link>
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Overview</CardTitle>
          <CardDescription>Summary of orders by status and recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Order Status Distribution</h4>
              <div className="space-y-3">
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                  (status) => {
                    const count = orders.filter((o) => o.orderStatus === status).length
                    const percentage = Math.round((count / orders.length) * 100)
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getOrderStatusBadge(status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{count}</span>
                          <span className="text-xs text-text-secondary">({percentage}%)</span>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </div>

            {/* Payment Status Distribution */}
            <div>
              <h4 className="font-medium text-text-primary mb-3">Payment Status Distribution</h4>
              <div className="space-y-3">
                {['pending', 'paid', 'partially-paid', 'refunded', 'failed'].map((status) => {
                  const count = orders.filter((o) => o.paymentStatus === status).length
                  const percentage = count > 0 ? Math.round((count / orders.length) * 100) : 0
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPaymentStatusBadge(status)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{count}</span>
                        <span className="text-xs text-text-secondary">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
