import { describe, it, expect } from 'vitest'
import { updateProductStockAfterOrder } from '@/lib/product-utils'

// Helper: create a product with 3 variants
function makeProduct() {
  return {
    stock: 0,
    variants: [
      { id: 'v1', name: 'Small', sku: 'SKU1', inventory: 5 },
      { id: 'v2', name: 'Medium', sku: 'SKU2', inventory: 3 },
      { id: 'v3', name: 'Large', sku: 'SKU3', inventory: 7 },
    ],
    status: 'active',
  }
}

describe('Variant stock update behavior', () => {
  it('should only update the purchased variant inventory', () => {
    const product = makeProduct()
    // Simulate purchasing the Medium variant (id: v2)
    const updated = updateProductStockAfterOrder(product, 2, { variantId: 'v2' })
    expect(updated.variants[0].inventory).toBe(5) // Small unchanged
    expect(updated.variants[1].inventory).toBe(1) // Medium decremented
    expect(updated.variants[2].inventory).toBe(7) // Large unchanged
  })

  it('should not affect other variants or product status if only one variant is out of stock', () => {
    const product = makeProduct()
    // Deplete Medium variant
    let updated = updateProductStockAfterOrder(product, 3, { variantId: 'v2' })
    expect(updated.variants[1].inventory).toBe(0)
    expect(updated.status).toBe('active') // Product still has other variants in stock
    // Simulate UI: only Medium should be disabled
    const disabled = updated.variants.map((v) => v.inventory === 0)
    expect(disabled).toEqual([false, true, false])
  })

  it('should set product status to out-of-stock only if all variants are depleted', () => {
    let product = makeProduct()
    // Deplete all variants
    product = updateProductStockAfterOrder(product, 5, undefined, 'v1')
    product = updateProductStockAfterOrder(product, 3, { variantId: 'v2' })
    product = updateProductStockAfterOrder(product, 7, { variantId: 'v3' })
    expect(product.variants.every((v) => v.inventory === 0)).toBe(true)
    expect(product.status).toBe('out-of-stock')
  })
})

// UI logic (pseudo):
// If variant.inventory === 0, disable purchase button for that variant only.
// Product is out of sale (disable all) only if all variants are depleted.
