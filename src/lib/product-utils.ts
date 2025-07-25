/**
 * Product utility functions for inventory and availability management
 */

/**
 * Check if a product has available stock
 * @param product - Product data from Payload
 * @returns boolean indicating if product has stock
 */
export function hasAvailableStock(product: any): boolean {
  // If product has variants, check variant inventory
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.some((variant: any) => (variant.inventory || 0) > 0)
  }
  // Otherwise check base stock
  return (product.stock || 0) > 0
}

/**
 * Get total available inventory for a product
 * @param product - Product data from Payload
 * @returns total available inventory
 */
export function getTotalAvailableInventory(product: any): number {
  // If product has variants, sum variant inventory
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.reduce((total: number, variant: any) => {
      return total + (variant.inventory || 0)
    }, 0)
  }
  // Otherwise return base stock
  return product.stock || 0
}

/**
 * Check if a product is low stock
 * @param product - Product data from Payload
 * @param threshold - Low stock threshold (default: 5)
 * @returns boolean indicating if product is low stock
 */
export function isLowStock(product: any, threshold: number = 5): boolean {
  const totalInventory = getTotalAvailableInventory(product)
  return totalInventory > 0 && totalInventory <= threshold
}

/**
 * Get the appropriate status for a product based on inventory
 * @param product - Product data from Payload
 * @returns appropriate status string
 */
export function getProductStatus(product: any): 'active' | 'out-of-stock' {
  return hasAvailableStock(product) ? 'active' : 'out-of-stock'
}

/**
 * Check if a specific variant is available
 * @param variant - Variant data
 * @returns boolean indicating if variant has stock
 */
export function isVariantAvailable(variant: any): boolean {
  return (variant.inventory || 0) > 0
}

/**
 * Find variant by selection criteria
 * @param variants - Array of variants
 * @param size - Selected size
 * @param color - Selected color
 * @returns matching variant or first variant if no specific match
 */
export function findVariant(variants: any[], size?: string, color?: string): any | null {
  if (!variants || variants.length === 0) return null

  // Try to find exact match
  const exactMatch = variants.find(
    (v: any) => (size && v.size === size) || (color && v.color === color),
  )

  if (exactMatch) return exactMatch

  // Return first available variant
  return variants.find((v: any) => isVariantAvailable(v)) || variants[0]
}

/**

/**
 * Update product stock after order
 * @param product - Product data
 * @param quantity - Quantity purchased
 * @param options - Object containing variantId, sku, size, color
 * @returns updated product data
 */
export function updateProductStockAfterOrder(
  product: any,
  quantity: number,
  options?: { variantId?: string; sku?: string; size?: string; color?: string },
): any {
  const updatedProduct = { ...product }

  // If product has variants, update variant inventory
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    let variantIndex = -1
    if (options) {
      if (options.variantId) {
        variantIndex = product.variants.findIndex((v: any) => v.id === options.variantId)
      }
      if (variantIndex === -1 && options.sku) {
        variantIndex = product.variants.findIndex((v: any) => v.sku === options.sku)
      }
      if (variantIndex === -1 && (options.size || options.color)) {
        variantIndex = product.variants.findIndex(
          (v: any) =>
            (options.size && v.size === options.size) ||
            (options.color && v.color === options.color),
        )
      }
    }
    // Default to first variant if no selection
    if (variantIndex === -1) {
      variantIndex = 0
    }

    if (variantIndex !== -1) {
      const updatedVariants = [...product.variants]
      const currentInventory = updatedVariants[variantIndex].inventory || 0
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        inventory: Math.max(0, currentInventory - quantity),
      }
      updatedProduct.variants = updatedVariants
    }
  } else {
    // Update base stock
    const currentStock = product.stock || 0
    updatedProduct.stock = Math.max(0, currentStock - quantity)
  }

  // Update status based on availability
  updatedProduct.status = getProductStatus(updatedProduct)

  return updatedProduct
}

/**
 * Restore product stock after order cancellation
 * @param product - Product data
 * @param quantity - Quantity to restore
 * @param size - Selected size (optional)
 * @param color - Selected color (optional)
 * @returns updated product data
 */
export function restoreProductStockAfterCancellation(
  product: any,
  quantity: number,
  size?: string,
  color?: string,
): any {
  const updatedProduct = { ...product }

  // If product has variants, restore variant inventory
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const variantIndex = product.variants.findIndex(
      (v: any) => (size && v.size === size) || (color && v.color === color) || (!size && !color), // Default to first variant if no selection
    )

    if (variantIndex !== -1) {
      const updatedVariants = [...product.variants]
      const currentInventory = updatedVariants[variantIndex].inventory || 0
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        inventory: currentInventory + quantity,
      }
      updatedProduct.variants = updatedVariants
    }
  } else {
    // Restore base stock
    const currentStock = product.stock || 0
    updatedProduct.stock = currentStock + quantity
  }

  // Update status based on availability
  updatedProduct.status = getProductStatus(updatedProduct)

  return updatedProduct
}

// Enhanced utility functions for product operations

export const calculateTotalStock = (product: any): number => {
  if (!product) return 0

  // If product has variants, sum variant inventory
  if (
    product.hasVariants &&
    product.variants &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    return product.variants.reduce((total: number, variant: any) => {
      return total + (variant.stock || 0)
    }, 0)
  }

  // Otherwise return base stock
  return product.stock || 0
}

export const getAvailableStock = (product: any): number => {
  if (!product) return 0

  // If product has variants, sum available variant inventory
  if (
    product.hasVariants &&
    product.variants &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    return product.variants.reduce((total: number, variant: any) => {
      const stock = variant.stock || 0
      const reserved = variant.reserved || 0
      return total + Math.max(0, stock - reserved)
    }, 0)
  }

  // Otherwise return available base stock
  const stock = product.stock || 0
  const reserved = product.reserved || 0
  return Math.max(0, stock - reserved)
}

export const generateCategoryPath = (sportsCategory: any, sports: any, sportsItem: any): string => {
  let path = ''

  if (sportsCategory) {
    path += typeof sportsCategory === 'object' ? sportsCategory.name : sportsCategory
  }

  if (sports) {
    const sportsName = typeof sports === 'object' ? sports.name : sports
    path += path ? ` > ${sportsName}` : sportsName
  }

  if (sportsItem) {
    const itemName = typeof sportsItem === 'object' ? sportsItem.name : sportsItem
    path += path ? ` > ${itemName}` : itemName
  }

  return path
}

export const validateCategoryHierarchy = (data: any): string[] => {
  const errors = []

  // Check if all three categories are selected
  if (!data.sportsCategory) {
    errors.push('Sports Category is required')
  }

  if (!data.sports) {
    errors.push('Sports is required')
  }

  if (!data.sportsItem) {
    errors.push('Sports Item is required')
  }

  return errors
}
