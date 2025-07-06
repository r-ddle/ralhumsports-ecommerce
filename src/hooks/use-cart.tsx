'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import { Cart, CartItem, CartState, CartActions } from '@/types/cart'
import { Product, ProductVariant } from '@/types/product'
import { toast } from 'sonner'

type CartAction =
  | {
      type: 'ADD_ITEM'
      payload: { product: Product; variant: ProductVariant; quantity: number }
    }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'LOAD_CART'; payload: Cart }
  | { type: 'SET_LOADING'; payload: boolean }

// All values in LKR
const FREE_SHIPPING_THRESHOLD_LKR = 50000
const STANDARD_SHIPPING_LKR = 3150

function calculateShipping(subtotal: number, threshold: number) {
  return subtotal >= threshold ? 0 : STANDARD_SHIPPING_LKR
}

function calculateTax(amount: number) {
  return Math.round(amount * 0.08)
}

function calculateCartTotals(items: CartItem[]): {
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
} {
  const subtotalLKR = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  const shipping = calculateShipping(subtotalLKR, FREE_SHIPPING_THRESHOLD_LKR)
  const tax = calculateTax(subtotalLKR + shipping)
  const total = subtotalLKR + shipping + tax
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    subtotal: subtotalLKR,
    tax,
    shipping,
    total,
    itemCount,
  }
}

function createEmptyCart(): Cart {
  return {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existingItemIndex = state.cart.items.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id,
      )

      let newItems: CartItem[]

      if (existingItemIndex > -1) {
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString(),
        }
        newItems = [...state.cart.items, newItem]
      }

      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter((item) => item.id !== action.payload.itemId)
      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { itemId } })
      }

      const newItems = state.cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      )
      const totals = calculateCartTotals(newItems)
      const updatedCart: Cart = {
        ...state.cart,
        items: newItems,
        ...totals,
        updatedAt: new Date().toISOString(),
      }

      return {
        ...state,
        cart: updatedCart,
      }
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        cart: createEmptyCart(),
      }
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      }
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      }
    }

    case 'LOAD_CART': {
      return {
        ...state,
        cart: action.payload,
      }
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      }
    }

    default:
      return state
  }
}

const CartContext = createContext<(CartState & CartActions) | null>(null)

const CART_STORAGE_KEY = 'ralhum-sports-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: createEmptyCart(),
    isOpen: false,
    isLoading: false,
  })

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [state.cart])

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    if (variant.inventory < quantity) {
      toast.error(`Only ${variant.inventory} items available in stock`)
      return
    }

    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } })
    toast.success(`${product.title} added to cart`)
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = state.cart.items.find((item) => item.id === itemId)
    if (item && item.variant.inventory < quantity) {
      toast.error(`Only ${item.variant.inventory} items available in stock`)
      return
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const contextValue = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    openCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export function useCartItem(productId: string, variantId: string) {
  const { cart } = useCart()
  return cart.items.find((item) => item.product.id === productId && item.variant.id === variantId)
}

export function useCartSummary() {
  const { cart } = useCart()
  return {
    subtotal: cart.subtotal,
    tax: cart.tax,
    shipping: cart.shipping,
    total: cart.total,
    itemCount: cart.itemCount,
    freeShippingEligible: cart.subtotal >= FREE_SHIPPING_THRESHOLD_LKR,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD_LKR - cart.subtotal),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD_LKR,
  }
}
