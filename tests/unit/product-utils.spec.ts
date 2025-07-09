import { describe, it, expect } from 'vitest'
import {
  hasAvailableStock,
  getTotalAvailableInventory,
  isLowStock,
  getProductStatus,
  findVariant,
  updateProductStockAfterOrder,
  restoreProductStockAfterCancellation,
} from '@/lib/product-utils'

describe('Product Utils', () => {
  describe('hasAvailableStock', () => {
    it('should return true for product with base stock', () => {
      const product = { stock: 10 }
      expect(hasAvailableStock(product)).toBe(true)
    })

    it('should return false for product with no base stock', () => {
      const product = { stock: 0 }
      expect(hasAvailableStock(product)).toBe(false)
    })

    it('should return true for product with variant inventory', () => {
      const product = {
        stock: 0,
        variants: [
          { name: 'Small', inventory: 5 },
          { name: 'Large', inventory: 0 },
        ],
      }
      expect(hasAvailableStock(product)).toBe(true)
    })

    it('should return false for product with no variant inventory', () => {
      const product = {
        stock: 0,
        variants: [
          { name: 'Small', inventory: 0 },
          { name: 'Large', inventory: 0 },
        ],
      }
      expect(hasAvailableStock(product)).toBe(false)
    })
  })

  describe('getTotalAvailableInventory', () => {
    it('should return base stock when no variants', () => {
      const product = { stock: 10 }
      expect(getTotalAvailableInventory(product)).toBe(10)
    })

    it('should return sum of variant inventory', () => {
      const product = {
        stock: 0,
        variants: [
          { name: 'Small', inventory: 5 },
          { name: 'Large', inventory: 3 },
        ],
      }
      expect(getTotalAvailableInventory(product)).toBe(8)
    })
  })

  describe('getProductStatus', () => {
    it('should return active for product with stock', () => {
      const product = { stock: 10 }
      expect(getProductStatus(product)).toBe('active')
    })

    it('should return out-of-stock for product without stock', () => {
      const product = { stock: 0 }
      expect(getProductStatus(product)).toBe('out-of-stock')
    })

    it('should return active for product with variant stock', () => {
      const product = {
        stock: 0,
        variants: [{ name: 'Small', inventory: 5 }],
      }
      expect(getProductStatus(product)).toBe('active')
    })
  })

  describe('updateProductStockAfterOrder', () => {
    it('should update base stock for product without variants', () => {
      const product = { stock: 10 }
      const updated = updateProductStockAfterOrder(product, 3)

      expect(updated.stock).toBe(7)
      expect(updated.status).toBe('active')
    })

    it('should update variant inventory for product with variants', () => {
      const product = {
        stock: 0,
        variants: [
          { name: 'Small', size: 'S', inventory: 5 },
          { name: 'Large', size: 'L', inventory: 3 },
        ],
      }
      const updated = updateProductStockAfterOrder(product, 2, 'S')

      expect(updated.variants[0].inventory).toBe(3)
      expect(updated.variants[1].inventory).toBe(3)
      expect(updated.status).toBe('active')
    })

    it('should set status to out-of-stock when no inventory left', () => {
      const product = {
        stock: 0,
        variants: [{ name: 'Small', size: 'S', inventory: 2 }],
      }
      const updated = updateProductStockAfterOrder(product, 2, 'S')

      expect(updated.variants[0].inventory).toBe(0)
      expect(updated.status).toBe('out-of-stock')
    })
  })

  describe('findVariant', () => {
    const variants = [
      { id: '1', name: 'Small Red', size: 'S', color: 'Red', inventory: 5 },
      { id: '2', name: 'Large Blue', size: 'L', color: 'Blue', inventory: 0 },
      { id: '3', name: 'Medium Green', size: 'M', color: 'Green', inventory: 3 },
    ]

    it('should find variant by size', () => {
      const variant = findVariant(variants, 'M')
      expect(variant?.id).toBe('3')
    })

    it('should find variant by color', () => {
      const variant = findVariant(variants, undefined, 'Blue')
      expect(variant?.id).toBe('2')
    })

    it('should return first available variant when no match', () => {
      const variant = findVariant(variants)
      expect(variant?.id).toBe('1') // First available (inventory > 0)
    })

    it('should return first variant if no available variants', () => {
      const noStockVariants = variants.map((v) => ({ ...v, inventory: 0 }))
      const variant = findVariant(noStockVariants)
      expect(variant?.id).toBe('1')
    })
  })
})
