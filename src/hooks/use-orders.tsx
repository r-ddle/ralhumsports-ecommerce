'use client'

import { createContext, useContext, useEffect, useReducer, ReactNode, useCallback } from 'react'
import {
  getCustomerOrders,
  getCustomerOrderCount,
  getCustomerIdForAPI,
  getCustomerInfo,
} from '@/lib/customer-id'
import { toast } from 'sonner'

export interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  selectedSize?: string
  selectedColor?: string
  productSku?: string
  variantDetails?: {
    size?: string
    color?: string
    material?: string
    price?: number
    sku?: string
  }
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  orderItems: OrderItem[]
  orderSubtotal: number
  orderTotal: number
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'partially-paid' | 'refunded' | 'failed'
  paymentMethod?: string
  specialInstructions?: string
  createdAt: string
  updatedAt: string
}

export interface OrdersState {
  orders: Order[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
  orderCount: number
}

export interface OrdersActions {
  fetchOrders: () => Promise<void>
  refreshOrders: (silent?: boolean) => Promise<void>
  toggleOrders: () => void
  closeOrders: () => void
  openOrders: () => void
  getOrderById: (orderId: string) => Order | undefined
  getOrderByNumber: (orderNumber: string) => Order | undefined
}

type OrdersAction =
  | { type: 'TOGGLE_ORDERS' }
  | { type: 'CLOSE_ORDERS' }
  | { type: 'OPEN_ORDERS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER_COUNT'; payload: number }

function ordersReducer(state: OrdersState, action: OrdersAction): OrdersState {
  switch (action.type) {
    case 'TOGGLE_ORDERS':
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case 'CLOSE_ORDERS':
      return {
        ...state,
        isOpen: false,
      }

    case 'OPEN_ORDERS':
      return {
        ...state,
        isOpen: true,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        orderCount: action.payload.length,
        isLoading: false,
        error: null,
      }

    case 'UPDATE_ORDER_COUNT':
      return {
        ...state,
        orderCount: action.payload,
      }

    default:
      return state
  }
}

const OrdersContext = createContext<(OrdersState & OrdersActions) | null>(null)

const ORDERS_STORAGE_KEY = 'ralhum-orders-cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Transform localStorage order data to our Order interface
function transformStorageOrder(storageOrder: any): Order {
  return {
    id: storageOrder.id || storageOrder.orderId,
    orderNumber: storageOrder.orderNumber || storageOrder.orderId,
    customerId: storageOrder.customerId || '',
    customerName: storageOrder.customer?.fullName || storageOrder.customerName || '',
    customerEmail: storageOrder.customer?.email || storageOrder.customerEmail || '',
    customerPhone: storageOrder.customer?.phone || storageOrder.customerPhone || '',
    deliveryAddress: storageOrder.customer?.address
      ? `${storageOrder.customer.address.street}, ${storageOrder.customer.address.city}, ${storageOrder.customer.address.province} ${storageOrder.customer.address.postalCode}`
      : storageOrder.deliveryAddress || '',
    orderItems: (storageOrder.items || storageOrder.orderItems || []).map((item: any) => ({
      id: item.id,
      productName: item.productName || item.product?.title || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice || item.variant?.price || 0,
      subtotal: item.subtotal || item.quantity * (item.unitPrice || item.variant?.price || 0),
      selectedSize: item.selectedSize || item.variant?.size,
      selectedColor: item.selectedColor || item.variant?.color,
      productSku: item.productSku || item.product?.sku,
      variantDetails: item.variantDetails,
    })),
    orderSubtotal: storageOrder.pricing?.subtotal || storageOrder.orderSubtotal || 0,
    orderTotal: storageOrder.pricing?.total || storageOrder.orderTotal || 0,
    orderStatus: storageOrder.status || storageOrder.orderStatus || 'pending',
    paymentStatus: storageOrder.paymentStatus || 'pending',
    paymentMethod: storageOrder.paymentMethod,
    specialInstructions:
      storageOrder.customer?.specialInstructions || storageOrder.specialInstructions,
    createdAt: storageOrder.createdAt || new Date().toISOString(),
    updatedAt: storageOrder.updatedAt || new Date().toISOString(),
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: [],
    isOpen: false,
    isLoading: false,
    error: null,
    orderCount: 0,
  })

  // Load orders from localStorage with caching
  const loadOrdersFromStorage = useCallback((): Order[] => {
    try {
      // Check cache first
      const cached = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data.map(transformStorageOrder)
        }
      }

      // Load fresh data
      const customerOrders = getCustomerOrders()
      const transformedOrders = customerOrders.map(transformStorageOrder)

      // Cache the result
      localStorage.setItem(
        ORDERS_STORAGE_KEY,
        JSON.stringify({
          data: customerOrders,
          timestamp: Date.now(),
        }),
      )

      return transformedOrders
    } catch (error) {
      console.error('Failed to load orders from storage:', error)
      return []
    }
  }, [])

  // Fetch orders from API (placeholder for future API integration)
  const fetchOrdersFromAPI = useCallback(async (): Promise<Order[]> => {
    // First try PayloadCMS customer ID, then fall back to email-based lookup
    let customerId = localStorage.getItem('ralhum-payload-customer-id')

    if (!customerId) {
      // Fallback: try to get customer info and use email
      const customerInfo = getCustomerInfo()
      if (customerInfo?.email) {
        customerId = customerInfo.email
        console.log('[useOrders] Using email as customer ID (fallback):', customerId)
      } else {
        console.warn('[useOrders] No customer ID or email found')
        return []
      }
    } else {
      console.log('[useOrders] Using PayloadCMS customer ID:', customerId)
    }

    try {
      // For now, we'll simulate API call with localStorage data
      // In the future, this would be a real API call to PayloadCMS
      const response = await fetch(`/api/public/orders?customerId=${customerId}`)

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          return result.data.map(transformStorageOrder)
        }
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to localStorage:', error)
    } // Fallback to localStorage
    return loadOrdersFromStorage()
  }, [loadOrdersFromStorage])

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    if (state.isLoading) return

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const orders = await fetchOrdersFromAPI()
      dispatch({ type: 'SET_ORDERS', payload: orders })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      console.error('Error fetching orders:', error)
    }
  }, [state.isLoading, fetchOrdersFromAPI])

  // Refresh orders (clear cache and fetch fresh)
  const refreshOrders = useCallback(
    async (silent = false) => {
      try {
        localStorage.removeItem(ORDERS_STORAGE_KEY)
        await fetchOrders()
        if (!silent) {
          toast.success('Orders refreshed')
        }
      } catch (error) {
        if (!silent) {
          toast.error('Failed to refresh orders')
        }
      }
    },
    [fetchOrders],
  )

  // Toggle orders sidebar
  const toggleOrders = useCallback(() => {
    dispatch({ type: 'TOGGLE_ORDERS' })
  }, [])

  // Close orders sidebar
  const closeOrders = useCallback(() => {
    dispatch({ type: 'CLOSE_ORDERS' })
  }, [])

  // Open orders sidebar
  const openOrders = useCallback(() => {
    dispatch({ type: 'OPEN_ORDERS' })
    // Fetch orders when opening if not already loaded
    if (state.orders.length === 0 && !state.isLoading) {
      fetchOrders()
    }
  }, [state.orders.length, state.isLoading, fetchOrders])

  // Get order by ID
  const getOrderById = useCallback(
    (orderId: string): Order | undefined => {
      return state.orders.find((order) => order.id === orderId)
    },
    [state.orders],
  )

  // Get order by order number
  const getOrderByNumber = useCallback(
    (orderNumber: string): Order | undefined => {
      return state.orders.find((order) => order.orderNumber === orderNumber)
    },
    [state.orders],
  )

  // Load initial orders on mount
  useEffect(() => {
    const orders = loadOrdersFromStorage()
    if (orders.length > 0) {
      dispatch({ type: 'SET_ORDERS', payload: orders })
    }

    // Update order count
    const count = getCustomerOrderCount()
    dispatch({ type: 'UPDATE_ORDER_COUNT', payload: count })
  }, [loadOrdersFromStorage])

  // Listen for storage changes (when orders are added from checkout)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ralhum-orders' || e.key === 'ralhum-customer-orders') {
        // Clear cache and reload orders
        localStorage.removeItem(ORDERS_STORAGE_KEY)
        const orders = loadOrdersFromStorage()
        dispatch({ type: 'SET_ORDERS', payload: orders })

        const count = getCustomerOrderCount()
        dispatch({ type: 'UPDATE_ORDER_COUNT', payload: count })
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadOrdersFromStorage])

  // Periodic refresh of order count
  useEffect(() => {
    const interval = setInterval(() => {
      const count = getCustomerOrderCount()
      if (count !== state.orderCount) {
        dispatch({ type: 'UPDATE_ORDER_COUNT', payload: count })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [state.orderCount])

  const contextValue = {
    ...state,
    fetchOrders,
    refreshOrders,
    toggleOrders,
    closeOrders,
    openOrders,
    getOrderById,
    getOrderByNumber,
  }

  return <OrdersContext.Provider value={contextValue}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}

// Convenience hooks similar to useCart
export function useOrdersSummary() {
  const { orders, orderCount, isLoading } = useOrders()
  return {
    orders,
    orderCount,
    isLoading,
    hasOrders: orderCount > 0,
    recentOrders: orders.slice(0, 5), // Last 5 orders
  }
}

export function useOrderTracking(orderNumber?: string) {
  const { getOrderByNumber, isLoading } = useOrders()

  if (!orderNumber) {
    return { order: null, isLoading, found: false }
  }

  const order = getOrderByNumber(orderNumber)
  return {
    order,
    isLoading,
    found: !!order,
  }
}
