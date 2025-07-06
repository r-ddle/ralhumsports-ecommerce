import type {
  Product as PayloadProduct,
  Category as PayloadCategory,
  Brand as PayloadBrand,
  Media as PayloadMedia,
  Order as PayloadOrder,
  Customer as PayloadCustomer,
  User as PayloadUser,
} from '../payload-types' // Adjust path as needed

// General API Response Structures
export interface ApiResponse<T = unknown> {
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

// Product Types DTOs
// Represents a populated image item from Product['images']
export type TransformedProductImage = Pick<PayloadMedia, 'id' | 'url' | 'alt' | 'filename'>;

// Represents a simplified/transformed Category for Product display
export type TransformedProductCategory = Pick<PayloadCategory, 'id' | 'name' | 'slug' | 'description'> | null;

// Represents a simplified/transformed Brand for Product display
export interface TransformedProductBrand extends Pick<PayloadBrand, 'id' | 'name' | 'slug' | 'description' | 'website'> {
  logoUrl?: string | null; // Flattened logo URL
}

// Product DTO for detailed view - Deriving from PayloadProduct
export interface ProductDetailDTO extends
  Pick<PayloadProduct,
    'id' | 'name' | 'slug' | 'price' | 'sku' | 'stock' |
    'status' | 'description' | 'features' | 'specifications' |
    'shipping' | 'seo' | 'analytics' | 'createdAt' | 'updatedAt'
  > {
  originalPrice?: number | null; // From pricing group
  sizes: string[]; // Assuming conversion from string
  colors: string[]; // Assuming conversion from string
  images: TransformedProductImage[];
  category: TransformedProductCategory;
  brand: TransformedProductBrand | null;
  tags: string[]; // Assuming conversion from string
  relatedProducts: string[]; // Assuming conversion from string
}

// Product DTO for list items (potentially more concise)
export interface ProductListItemDTO extends
  Pick<PayloadProduct,
    'id' | 'name' | 'slug' | 'price' | 'sku' | 'stock' | 'status' | 'createdAt' | 'updatedAt'
  > {
  originalPrice?: number | null;
  images: TransformedProductImage[]; // Typically just the main image
  category: Pick<PayloadCategory, 'id' | 'name' | 'slug'> | null;
  brand: Pick<PayloadBrand, 'id' | 'name' | 'slug'> | null;
  rating?: number | null; // from analytics
}


// Category Types
// DTO for Category listing or linking
export interface CategoryLinkDTO extends Pick<PayloadCategory, 'id' | 'name' | 'slug' | 'description' | 'icon' | 'displayOrder' | 'productCount' | 'isFeature' | 'showInNavigation'> {
  image?: Pick<PayloadMedia, 'url' | 'alt'> | null;
}

// Re-defining local Category to use the DTO name for clarity if it's different from PayloadCategory
export type CategoryDTO = CategoryLinkDTO;


// Brand Types
// DTO for Brand listing or linking
export interface BrandLinkDTO extends Pick<PayloadBrand, 'id' | 'name' | 'slug' | 'description' | 'website' | 'countryOfOrigin' | 'isFeatured' | 'isPremium' | 'priceRange' | 'productCount'> {
  logo?: Pick<PayloadMedia, 'url' | 'alt'> | null;
}
// Re-defining local Brand to use the DTO name for clarity
export type BrandDTO = BrandLinkDTO;


// Customer Types
// Aligning CustomerAddress with Payload's structure (assuming it's an array field in Customer)
export type CustomerAddressDTO = NonNullable<PayloadCustomer['addresses']>[0];

// Customer DTO for API responses (excluding sensitive fields if any)
export interface CustomerDTO extends Pick<PayloadCustomer, 'id' | 'name' | 'email' | 'primaryPhone' | 'addresses' | 'preferences' | 'orderStats'> {
  // addresses type will be CustomerAddressDTO[] via Pick
}
// export interface Customer { // Original local definition - now replaced by CustomerDTO or direct PayloadCustomer use.
//   id: number
//   name: string
//   email: string
//   phone: string
//   addresses: CustomerAddress[]
// }

export interface CustomerInput {
  name: string
  email: string
  phone: string // This maps to primaryPhone
  secondaryPhone?: string
  address?: { // This structure is for input, gets transformed into CustomerAddressDTO[]
    street: string
    city: string
    postalCode: string
    province: string
    type?: CustomerAddressDTO['type'];
    isDefault?: boolean;
  }
  preferredLanguage?: PayloadCustomer['preferences']['language'];
  marketingOptIn?: boolean
}

// Order Types
// Aligning OrderItem with Payload's structure
export type OrderItemDTO = NonNullable<PayloadOrder['orderItems']>[0];

// Order DTO for API responses
export interface OrderDTO extends Pick<PayloadOrder,
  'id' | 'orderNumber' | 'customerName' | 'customerEmail' | 'customerPhone' |
  'deliveryAddress' | 'orderItems' | 'orderSubtotal' | 'shippingCost' | 'discount' |
  'orderTotal' | 'orderStatus' | 'paymentStatus' | 'paymentMethod' |
  'specialInstructions' | 'shipping' | 'createdAt' | 'updatedAt'
> {
  // orderItems will be OrderItemDTO[] via Pick
}

// export interface Order { // Original local definition - now replaced by OrderDTO or direct PayloadOrder use.
//   id: number
//   orderNumber: string
//   customerName: string
//   customerEmail: string
//   customerPhone: string
//   deliveryAddress: string
//   orderItems: OrderItem[]
//   orderSubtotal: number
//   shippingCost: number
//   discount: number
//   orderTotal: number
//   orderStatus:
//     | 'pending'
//     | 'confirmed'
//     | 'processing'
//     | 'shipped'
//     | 'delivered'
//     | 'cancelled'
//     | 'refunded'
//   paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed'
//   paymentMethod?: 'cod' | 'bank-transfer' | 'online-payment' | 'card-payment'
//   specialInstructions?: string
//   shipping?: {
//     trackingNumber?: string
//     courier?: string
//     estimatedDelivery?: string
//     actualDelivery?: string
//   }
//   createdAt: string
//   updatedAt: string
// }


export interface OrderPricing { // This seems like an input helper, can be kept
  subtotal: number
  shipping: number
  tax?: number
  discount?: number
  total: number
  exchangeRate?: number
  currency?: string
}

export interface OrderCustomer { // This is clearly an input type for customer details during order creation
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

export interface OrderInput { // This is a key input DTO, keep and refine
  customer: OrderCustomer
  items: Array<{
    id?: string // Cart item ID, not product ID necessarily
    product: { // Information about the product being ordered
      id?: string | number // Payload Product ID
      title?: string // Product name/title
      name?: string
      sku?: string
    }
    variant?: { // If product has variants
      price: number // Variant price
      size?: string
      color?: string
      // other variant identifiers?
    }
    price?: number // Price at time of order if no variant or overridden
    quantity: number
    size?: string // Selected size if not part of variant object
    color?: string // Selected color if not part of variant object
  }>
  pricing: OrderPricing
  specialInstructions?: string
  orderSource?: PayloadOrder['orderSource'] // Use type from PayloadOrder
}


export interface OrderResponse { // This is a specific DTO, can be kept
  orderId: string | number // Align with PayloadOrder['id'] type
  orderNumber: string
  customerId?: number | string // Align with PayloadCustomer['id'] type
  status: PayloadOrder['orderStatus']
  total: number
  createdAt: string
}

// Product Query Parameters
export interface ProductQueryParams {
  page?: number
  limit?: number
  category?: string // slug
  brand?: string // slug
  search?: string
  sort?: Extract<keyof PayloadProduct, 'name' | 'price' | 'createdAt' | 'updatedAt'> | string; // Allow known sortable fields or custom strings
  order?: 'asc' | 'desc'
  status?: PayloadProduct['status']
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

// Filter Types for Frontend
export interface ProductFilters {
  categories: CategoryDTO[] // Use DTO
  brands: BrandDTO[] // Use DTO
  priceRange: {
    min: number
    max: number
  }
  sizes: string[]
  colors: string[]
}

// Cart Types (for frontend integration) - These are likely frontend specific
export interface CartItem {
  id: string // Cart item unique ID
  product: { // Simplified product info for cart
    id: string | number // Product ID
    title: string
    slug: string
    images: TransformedProductImage[] // Use transformed image
    sku: string
  }
  variant: { // Selected variant info
    name: string // e.g., "Large, Red"
    price: number
    size?: string
    color?: string
    // sku?: string; // Variant SKU if applicable
  }
  quantity: number
}

export interface Cart {
  items: CartItem[]
  itemCount: number
  total: number
}

// Search Types
// Using specific DTOs defined earlier
export interface SearchResult {
  products: ProductListItemDTO[]
  categories: CategoryDTO[]
  brands: BrandDTO[]
  totalResults: number
}

export interface SearchParams { // Input for search API
  query: string
  type?: 'all' | 'products' | 'categories' | 'brands'
  limit?: number
}

// API Error Types
export interface ApiError {
  success: false
  error: string
  details?: Record<string, unknown> | { field?: string; message?: string }[]; // Allow more specific error details
}

// Utility Types
export type SortOption = {
  label: string
  value: string // e.g., 'price-asc'
  field: string // e.g., 'price'
  order: 'asc' | 'desc'
}

export type FilterOption = {
  label: string
  value: string // typically an ID or slug
  count?: number
}

// Constants - These are fine as they are, used for UI typically
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
    product: {
      id?: string
      title?: string
      name?: string
      sku?: string
    }
    variant?: {
      price: number
      size?: string
      color?: string
    }
    price?: number
    quantity: number
    size?: string
    color?: string
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
