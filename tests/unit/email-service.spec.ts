import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shouldSendStatusEmail, transformOrderForEmail } from '../../src/lib/email-service'

describe('Email Service', () => {
  describe('shouldSendStatusEmail', () => {
    it('should send email when order is cancelled', () => {
      expect(shouldSendStatusEmail('pending', 'cancelled')).toBe(true)
      expect(shouldSendStatusEmail('processing', 'cancelled')).toBe(true)
      expect(shouldSendStatusEmail('shipped', 'cancelled')).toBe(true)
    })

    it('should send email when order is delivered', () => {
      expect(shouldSendStatusEmail('pending', 'delivered')).toBe(true)
      expect(shouldSendStatusEmail('processing', 'delivered')).toBe(true)
      expect(shouldSendStatusEmail('shipped', 'delivered')).toBe(true)
    })

    it('should NOT send email for minor status changes', () => {
      expect(shouldSendStatusEmail('pending', 'confirmed')).toBe(false)
      expect(shouldSendStatusEmail('confirmed', 'processing')).toBe(false)
      expect(shouldSendStatusEmail('processing', 'shipped')).toBe(false)
    })

    it('should NOT send email if status has not changed', () => {
      expect(shouldSendStatusEmail('pending', 'pending')).toBe(false)
      expect(shouldSendStatusEmail('cancelled', 'cancelled')).toBe(false)
      expect(shouldSendStatusEmail('delivered', 'delivered')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(shouldSendStatusEmail('', 'cancelled')).toBe(true)
      expect(shouldSendStatusEmail('unknown', 'delivered')).toBe(true)
      expect(shouldSendStatusEmail('pending', 'unknown')).toBe(false)
    })
  })

  describe('transformOrderForEmail', () => {
    const mockOrder = {
      orderNumber: 'RS-20240107-ABC12',
      customerId: 'CUST-123',
      customer: {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        deliveryAddress: '123 Main Street, Colombo 03',
      },
      orderItems: [
        {
          productName: 'Wilson Tennis Racket',
          quantity: 1,
          unitPrice: 15000,
          subtotal: 15000,
          variantDetails: {
            size: 'Regular',
            color: 'Red',
          },
        },
        {
          productName: 'Nike Basketball',
          quantity: 2,
          unitPrice: 5000,
          subtotal: 10000,
        },
      ],
      orderSummary: {
        orderTotal: 25000,
      },
      pricing: {
        orderSubtotal: 25000,
      },
      orderDetails: {
        specialInstructions: 'Please call before delivery',
      },
      createdAt: '2024-01-07T10:30:00Z',
    }

    it('should transform order data correctly', () => {
      const result = transformOrderForEmail(mockOrder)

      expect(result).toEqual({
        orderNumber: 'RS-20240107-ABC12',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerId: 'CUST-123',
        items: [
          {
            productName: 'Wilson Tennis Racket',
            quantity: 1,
            unitPrice: 15000,
            subtotal: 15000,
            selectedSize: 'Regular',
            selectedColor: 'Red',
          },
          {
            productName: 'Nike Basketball',
            quantity: 2,
            unitPrice: 5000,
            subtotal: 10000,
            selectedSize: undefined,
            selectedColor: undefined,
          },
        ],
        orderTotal: 25000,
        orderSubtotal: 25000,
        tax: 3750,
        deliveryAddress: '123 Main Street, Colombo 03',
        specialInstructions: 'Please call before delivery',
        createdAt: '2024-01-07T10:30:00Z',
      })
    })

    it('should handle missing customer data', () => {
      const incompleteOrder = {
        ...mockOrder,
        customer: undefined,
      }

      const result = transformOrderForEmail(incompleteOrder)

      expect(result.customerName).toBe('Customer')
      expect(result.customerEmail).toBe('')
      expect(result.deliveryAddress).toBe('')
    })

    it('should handle missing order items', () => {
      const orderWithoutItems = {
        ...mockOrder,
        orderItems: undefined,
      }

      const result = transformOrderForEmail(orderWithoutItems)

      expect(result.items).toEqual([])
    })

    it('should handle missing pricing data', () => {
      const orderWithoutPricing = {
        ...mockOrder,
        orderSummary: undefined,
        pricing: undefined,
      }

      const result = transformOrderForEmail(orderWithoutPricing)

      expect(result.orderTotal).toBe(0)
      expect(result.orderSubtotal).toBe(0)
    })

    it('should handle missing optional fields', () => {
      const minimalOrder = {
        ...mockOrder,
        orderDetails: undefined,
      }

      const result = transformOrderForEmail(minimalOrder)

      expect(result.specialInstructions).toBeUndefined()
    })
  })

  describe('Email quota management', () => {
    it('should limit emails to critical status changes only', () => {
      const statusChanges = [
        ['pending', 'confirmed'],
        ['confirmed', 'processing'],
        ['processing', 'shipped'],
        ['shipped', 'delivered'], // This should send
        ['pending', 'cancelled'], // This should send
      ]

      let emailsSent = 0
      statusChanges.forEach(([old, new_]) => {
        if (shouldSendStatusEmail(old, new_)) {
          emailsSent++
        }
      })

      expect(emailsSent).toBe(2) // Only delivered and cancelled
    })
  })
})