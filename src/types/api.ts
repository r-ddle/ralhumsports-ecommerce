export interface ApiResponse<T = unknown> {
  // ✅ Fix: Line 1
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T = unknown> {
  // ✅ Fix: Line 7
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Product Types
export interface ProductImage {
  id: string
  url: string
  alt: string
  filename: string
}

export interface ProductCategory {
  id: number
  name: string
  slug: string
  description?: string
}

export interface ProductBrand {
  id: number
  name: string
  slug: string
  logo?: string
  description?: string
  website?: string
}

export interface ProductSpecifications {
  material?: string
  weight?: string
  dimensions?: string
  careInstructions?: string
}

export interface ProductShipping {
  freeShipping?: boolean
  islandWideDelivery?: boolean
  easyReturn?: boolean
  shippingWeight?: number
}

export interface ProductSEO {
  title?: string
  description?: string
}

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  sku: string
  stock: number
  status: 'active' | 'inactive' | 'draft' | 'out-of-stock' | 'discontinued'
  sizes: string[]
  colors: string[]
  images: ProductImage[]
  category: ProductCategory | null
  brand: ProductBrand | null
  description?: Record<string, unknown> | string // ✅ Fix: More specific than any
  features: string[]
  specifications?: ProductSpecifications
  shipping?: ProductShipping
  seo?: ProductSEO
  rating?: number
  reviewCount?: number
  viewCount?: number
  tags: string[]
  relatedProducts: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  size?: string
  color?: string
  price: number
  inventory: number
}

export interface ProductListItem {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  sku: string
  stock: number
  status: string
  sizes: string[]
  colors: string[]
  images: ProductImage[]
  variants?: ProductVariant[]
  category: ProductCategory | null
  brand: ProductBrand | null
  description?: Record<string, unknown> | string // ✅ Fix: More specific than any
  features: string[]
  specifications?: ProductSpecifications
  shipping?: ProductShipping
  seo?: ProductSEO
  rating?: number
  reviewCount?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Category Types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: {
    url: string
    alt: string
  }
  icon?: string
  displayOrder: number
  productCount?: number
  isFeature?: boolean
  showInNavigation?: boolean
}

// Brand Types
export interface Brand {
  id: number
  name: string
  slug: string
  description?: string
  logo?: {
    url: string
    alt: string
  }
  website?: string
  countryOfOrigin?: string
  isFeatured?: boolean
  isPremium?: boolean
  priceRange?: 'budget' | 'mid-range' | 'premium' | 'luxury'
  productCount?: number
}

// Customer Types
export interface CustomerAddress {
  type: 'home' | 'office' | 'other'
  address: string
  isDefault?: boolean
}

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  addresses: CustomerAddress[]
}

export interface CustomerInput {
  name: string
  email: string
  phone: string
  secondaryPhone?: string
  address?: {
    street: string
    city: string
    postalCode: string
    province: string
  }
  preferredLanguage?: 'english' | 'sinhala' | 'tamil'
  marketingOptIn?: boolean
}

// Order Types
export interface OrderItem {
  productId: string
  productName: string
  productSku: string
  unitPrice: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
  subtotal: number
}

export interface OrderPricing {
  subtotal: number
  shipping: number
  tax?: number
  discount?: number
  total: number
  exchangeRate?: number
  currency?: string
}

export interface OrderCustomer {
  fullName: string
  email: string
  phone: string
  secondaryPhone?: string
  address: {
    street: string
    city: string
    postalCode: string
    province: string
  }
  specialInstructions?: string
  preferredLanguage?: string
  marketingOptIn?: boolean
}

export interface OrderInput {
  customer: OrderCustomer
  items: Array<{
    id?: string
    productId: string
    productName: string
    productSku: string
    variantId: string
    unitPrice: number
    quantity: number
    selectedSize?: string
    selectedColor?: string
    subtotal: number
  }>
  pricing: OrderPricing
  specialInstructions?: string
  orderSource?: 'website' | 'whatsapp' | 'phone' | 'store' | 'social'
}

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  orderItems: OrderItem[]
  orderSubtotal: number
  shippingCost: number
  discount: number
  orderTotal: number
  orderStatus:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed'
  paymentMethod?: 'cod' | 'bank-transfer' | 'online-payment' | 'card-payment'
  specialInstructions?: string
  shipping?: {
    trackingNumber?: string
    courier?: string
    estimatedDelivery?: string
    actualDelivery?: string
  }
  createdAt: string
  updatedAt: string
}

export interface OrderResponse {
  orderId: string
  orderNumber: string
  customerId: number
  status: string
  total: number
  createdAt: string
}

// Product Query Parameters
export interface ProductQueryParams {
  page?: number
  limit?: number
  category?: string
  brand?: string
  search?: string
  sort?: 'name' | 'price' | 'createdAt' | 'updatedAt'
  order?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'draft' | 'out-of-stock' | 'discontinued'
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

// Filter Types for Frontend
export interface ProductFilters {
  categories: Category[]
  brands: Brand[]
  priceRange: {
    min: number
    max: number
  }
  sizes: string[]
  colors: string[]
}

// Cart Types (for frontend integration)
export interface CartItem {
  id: string
  product: {
    id: string
    title: string
    slug: string
    images: ProductImage[]
    sku: string
  }
  variant: {
    name: string
    price: number
    size?: string
    color?: string
  }
  quantity: number
}

export interface Cart {
  items: CartItem[]
  itemCount: number
  total: number
}

// Search Types
export interface SearchResult {
  products: ProductListItem[]
  categories: Category[]
  brands: Brand[]
  totalResults: number
}

export interface SearchParams {
  query: string
  type?: 'all' | 'products' | 'categories' | 'brands'
  limit?: number
}

// API Error Types
export interface ApiError {
  success: false
  error: string
  details?: Record<string, unknown> // ✅ Fix: More specific than any
}

// Utility Types
export type SortOption = {
  label: string
  value: string
  field: string
  order: 'asc' | 'desc'
}

export type FilterOption = {
  label: string
  value: string
  count?: number
}

// Constants
export const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First', value: 'newest', field: 'createdAt', order: 'desc' },
  { label: 'Price: Low to High', value: 'price-asc', field: 'price', order: 'asc' },
  { label: 'Price: High to Low', value: 'price-desc', field: 'price', order: 'desc' },
  { label: 'Name: A to Z', value: 'name-asc', field: 'name', order: 'asc' },
  { label: 'Name: Z to A', value: 'name-desc', field: 'name', order: 'desc' },
]

export const PRODUCT_STATUSES = {
  active: 'Active',
  inactive: 'Inactive',
  draft: 'Draft',
  'out-of-stock': 'Out of Stock',
  discontinued: 'Discontinued',
} as const

export const ORDER_STATUSES = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
} as const

export const PAYMENT_STATUSES = {
  pending: 'Pending',
  paid: 'Paid',
  'partially-paid': 'Partially Paid',
  refunded: 'Refunded',
  failed: 'Failed',
} as const

// SKU Verification Response
export interface SKUVerificationResponse {
  verified: boolean
  product?: {
    id: number
    name: string
    sku: string
    brand: string
    category: string
    price: number
    inStock: boolean
  }
  message?: string
}

// Order Tracking Response
export interface OrderTrackingResponse {
  found: boolean
  order?: {
    id: number
    orderNumber: string
    orderStatus:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled'
      | 'refunded'
    paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed'
    orderItems: Array<{
      productName: string
      quantity: number
      unitPrice: number
    }>
    orderTotal: number
    orderDate: string
    estimatedDelivery?: string
    shipping?: {
      courier?: string
      trackingNumber?: string
    }
  }
  message?: string
}
