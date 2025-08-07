import { Product, ProductVariant } from './product'

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  total: number
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface CartState {
  cart: Cart
  isOpen: boolean
  isLoading: boolean
}

export interface CartActions {
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
}

export interface ShippingOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minimumOrder?: number
  expiresAt?: string
}
