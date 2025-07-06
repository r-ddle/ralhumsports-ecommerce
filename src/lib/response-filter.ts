import { AuthContext } from './auth'

/**
 * Sensitive fields that should be removed from public responses
 */
const SENSITIVE_FIELDS = {
  user: [
    'salt',
    'hash',
    'resetPasswordToken',
    'resetPasswordExpiration',
    'loginAttempts',
    'lockUntil',
    'sessions',
    'notes',
  ],
  customer: [
    'notes',
    'createdBy',
    'lastModifiedBy',
    'socialMedia',
    'whatsapp.messageHistory',
    'orderStats.totalSpent',
  ],
  order: ['internalNotes', 'createdBy', 'lastModifiedBy', 'whatsapp.customerResponse'],
  product: ['pricing.costPrice', 'createdBy', 'lastModifiedBy', 'analytics.viewCount'],
}

/**
 * Admin-only fields that should only be visible to admins
 */
const ADMIN_ONLY_FIELDS = {
  customer: ['notes', 'orderStats.totalSpent', 'whatsapp.messageHistory'],
  order: ['internalNotes', 'whatsapp.customerResponse'],
  product: ['pricing.costPrice', 'analytics'],
  user: ['notes', 'loginAttempts'],
}

/**
 * Remove sensitive fields from object based on user permissions
 */
function removeFields(obj: unknown, fieldsToRemove: string[]): unknown {
  // ✅ Fix: Line 42
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeFields(item, fieldsToRemove))
  }

  const filtered = { ...(obj as Record<string, unknown>) } // ✅ Fix: Line 42

  for (const field of fieldsToRemove) {
    if (field.includes('.')) {
      // Handle nested fields like 'whatsapp.messageHistory'
      const [parent, child] = field.split('.')
      if (filtered[parent] && typeof filtered[parent] === 'object') {
        filtered[parent] = { ...(filtered[parent] as Record<string, unknown>) }
        delete (filtered[parent] as Record<string, unknown>)[child]
      }
    } else {
      delete filtered[field]
    }
  }

  return filtered
}

/**
 * Filter user data based on permissions
 */
export function filterUserData(
  user: Record<string, unknown> | null,
  auth: AuthContext,
): Record<string, unknown> | null {
  // ✅ Fix: Line 72
  if (!user) return user

  const fieldsToRemove = [...SENSITIVE_FIELDS.user]

  // Non-admins can't see admin-only fields
  if (!auth.isAdmin) {
    fieldsToRemove.push(...ADMIN_ONLY_FIELDS.user)
  }

  // Users can only see their own sensitive data
  if (auth.user?.id !== user.id && !auth.isAdmin) {
    fieldsToRemove.push('email', 'phone', 'department')
  }

  return removeFields(user, fieldsToRemove) as Record<string, unknown>
}

/**
 * Filter customer data based on permissions
 */
export function filterCustomerData(
  customer: Record<string, unknown> | null,
  auth: AuthContext,
): Record<string, unknown> | null {
  // ✅ Fix: Line 93
  if (!customer) return customer

  const fieldsToRemove = [...SENSITIVE_FIELDS.customer]

  // Only admins and managers can see customer data
  if (!auth.isAdminOrManager) {
    return null // Hide completely for non-managers
  }

  // Non-admins can't see admin-only fields
  if (!auth.isAdmin) {
    fieldsToRemove.push(...ADMIN_ONLY_FIELDS.customer)
  }

  return removeFields(customer, fieldsToRemove) as Record<string, unknown>
}

/**
 * Filter order data based on permissions
 */
export function filterOrderData(
  order: Record<string, unknown> | null,
  auth: AuthContext,
  customerEmail?: string,
): Record<string, unknown> | null {
  // ✅ Fix: Line 114
  if (!order) return order

  const fieldsToRemove = [...SENSITIVE_FIELDS.order]

  // Check if user can access this order
  const canAccess =
    auth.isAdminOrManager || (customerEmail && order.customerEmail === customerEmail)

  if (!canAccess) {
    return null // Hide completely
  }

  // Non-admins can't see admin-only fields
  if (!auth.isAdmin) {
    fieldsToRemove.push(...ADMIN_ONLY_FIELDS.order)
  }

  // Customers can only see limited order info
  if (!auth.isAdminOrManager) {
    fieldsToRemove.push(
      'customerSecondaryPhone',
      'whatsapp',
      'shipping.trackingNumber',
      'orderSource',
      'createdBy',
      'lastModifiedBy',
    )
  }

  return removeFields(order, fieldsToRemove) as Record<string, unknown>
}

/**
 * Filter product data based on permissions
 */
export function filterProductData(
  product: Record<string, unknown> | null,
  auth: AuthContext,
): Record<string, unknown> | null {
  // ✅ Fix: Line 150
  if (!product) return product

  const fieldsToRemove = [...SENSITIVE_FIELDS.product]

  // Non-managers can't see admin-only fields
  if (!auth.isAdminOrManager) {
    fieldsToRemove.push(...ADMIN_ONLY_FIELDS.product)
  }

  return removeFields(product, fieldsToRemove) as Record<string, unknown>
}

/**
 * Create filtered response based on user permissions
 */
export function createFilteredResponse(
  data: unknown, // ✅ Fix: Line 198
  auth: AuthContext,
  options?: {
    type?: 'user' | 'customer' | 'order' | 'product'
    customerEmail?: string
  },
) {
  if (!data) {
    return { success: true, data: null }
  }

  let filteredData = data

  if (options?.type) {
    if (Array.isArray(data)) {
      filteredData = filterArrayData(data, options.type, auth, options)
    } else {
      switch (options.type) {
        case 'user':
          filteredData = filterUserData(data as Record<string, unknown>, auth) ?? {}
          break
        case 'customer':
          filteredData = filterCustomerData(data as Record<string, unknown>, auth) ?? {}
          break
        case 'order':
          filteredData =
            filterOrderData(data as Record<string, unknown>, auth, options.customerEmail) ?? {}
          break
        case 'product':
          filteredData = filterProductData(data as Record<string, unknown>, auth) ?? {}
          break
      }
    }
  }

  /**
   * Helper to filter arrays of data by type
   */
  function filterArrayData(
    arr: unknown[],
    type: 'user' | 'customer' | 'order' | 'product',
    auth: AuthContext,
    options?: { customerEmail?: string },
  ) {
    switch (type) {
      case 'user':
        return arr.map((item) => filterUserData(item as Record<string, unknown>, auth))
      case 'customer':
        return arr.map((item) => filterCustomerData(item as Record<string, unknown>, auth))
      case 'order':
        return arr.map((item) =>
          filterOrderData(item as Record<string, unknown>, auth, options?.customerEmail),
        )
      case 'product':
        return arr.map((item) => filterProductData(item as Record<string, unknown>, auth))
      default:
        return arr
    }
  }

  return {
    success: true,
    data: filteredData,
  }
}

/**
 * Security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'",
  }
}
