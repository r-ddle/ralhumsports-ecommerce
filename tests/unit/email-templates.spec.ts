import { describe, it, expect, vi } from 'vitest'
import {
  generateOrderConfirmationEmail,
  generatePaymentSuccessEmail,
  generateAdminCustomEmail,
  type OrderEmailData,
  type PaymentSuccessData,
  type AdminCustomEmailData,
} from '../../src/lib/email-templates'

// Mock site config
vi.mock('../../src/config/site-config', () => ({
  SITE_CONFIG: {
    siteUrl: 'https://ralhumsports.lk',
    contact: {
      email: 'support@ralhumsports.lk',
      phone: '+94 11 123 4567',
    },
  },
}))

describe('Email Templates', () => {
  const mockOrderData: OrderEmailData = {
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
      },
    ],
    orderTotal: 28750,
    orderSubtotal: 25000,
    tax: 3750,
    deliveryAddress: '123 Main Street, Colombo 03, Sri Lanka',
    specialInstructions: 'Please call before delivery',
    createdAt: '2024-01-07T10:30:00Z',
  }

  describe('generateOrderConfirmationEmail', () => {
    it('should generate a complete HTML email', () => {
      const html = generateOrderConfirmationEmail(mockOrderData)
      
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('Order Confirmation')
      expect(html).toContain('John Doe')
      expect(html).toContain('RS-20240107-ABC12')
      expect(html).toContain('Wilson Tennis Racket')
      expect(html).toContain('LKR 28,750')
      expect(html).toContain('ralhumlogo.svg')
      expect(html).toContain('30 Years of Athletic Excellence')
    })

    it('should include all order items', () => {
      const html = generateOrderConfirmationEmail(mockOrderData)
      
      expect(html).toContain('Wilson Tennis Racket')
      expect(html).toContain('Nike Basketball')
      expect(html).toContain('Size: Regular')
      expect(html).toContain('Color: Red')
    })

    it('should include tracking URL', () => {
      const html = generateOrderConfirmationEmail(mockOrderData)
      
      expect(html).toContain('https://ralhumsports.lk/orders/track?id=RS-20240107-ABC12')
      expect(html).toContain('Track Order')
    })

    it('should handle missing optional fields', () => {
      const minimalData: OrderEmailData = {
        ...mockOrderData,
        specialInstructions: undefined,
      }
      
      const html = generateOrderConfirmationEmail(minimalData)
      expect(html).not.toContain('Special Instructions')
      expect(html).toContain('John Doe') // Should still work
    })
  })

  describe('generatePaymentSuccessEmail', () => {
    const paymentData: PaymentSuccessData = {
      ...mockOrderData,
      paymentMethod: 'VISA',
      paymentId: 'PAY_123456789',
      paymentDate: '2024-01-07T10:35:00Z',
    }

    it('should generate payment success email', () => {
      const html = generatePaymentSuccessEmail(paymentData)
      
      expect(html).toContain('Payment Successful')
      expect(html).toContain('PAY_123456789')
      expect(html).toContain('VISA')
      expect(html).toContain('Payment Received Successfully!')
      expect(html).toContain('LKR 28,750')
    })

    it('should include payment details table', () => {
      const html = generatePaymentSuccessEmail(paymentData)
      
      expect(html).toContain('Payment ID:')
      expect(html).toContain('Payment Method:')
      expect(html).toContain('Payment Date:')
      expect(html).toContain('Amount Paid:')
    })
  })

  describe('generateAdminCustomEmail', () => {
    const adminEmailData: AdminCustomEmailData = {
      orderNumber: 'RS-20240107-ABC12',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      subject: 'Important Update About Your Order',
      customMessage: 'We need to inform you about a delay in your order.\\nPlease contact us if you have questions.',
      adminName: 'Sarah Admin',
    }

    it('should generate admin custom email', () => {
      const html = generateAdminCustomEmail(adminEmailData)
      
      expect(html).toContain('Important Update About Your Order')
      expect(html).toContain('Hello John Doe')
      expect(html).toContain('RS-20240107-ABC12')
      expect(html).toContain('delay in your order')
      expect(html).toContain('Sarah Admin')
    })

    it('should handle multiline messages', () => {
      const html = generateAdminCustomEmail(adminEmailData)
      
      expect(html).toContain('<p style="margin: 0 0 12px 0;">We need to inform you about a delay in your order.</p>')
      expect(html).toContain('<p style="margin: 0 0 12px 0;">Please contact us if you have questions.</p>')
    })

    it('should include contact information', () => {
      const html = generateAdminCustomEmail(adminEmailData)
      
      expect(html).toContain('Need Help?')
      expect(html).toContain('support@ralhumsports.lk')
      expect(html).toContain('+94 11 123 4567')
    })
  })

  describe('Email consistency', () => {
    it('should use consistent branding across all templates', () => {
      const confirmationHtml = generateOrderConfirmationEmail(mockOrderData)
      const paymentHtml = generatePaymentSuccessEmail({ 
        ...mockOrderData, 
        paymentMethod: 'VISA', 
        paymentId: 'PAY_123', 
        paymentDate: '2024-01-07T10:35:00Z' 
      })
      const adminHtml = generateAdminCustomEmail({
        orderNumber: 'RS-20240107-ABC12',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        subject: 'Test',
        customMessage: 'Test message',
        adminName: 'Admin',
      })

      // All should contain logo
      expect(confirmationHtml).toContain('ralhumlogo.svg')
      expect(paymentHtml).toContain('ralhumlogo.svg')
      expect(adminHtml).toContain('ralhumlogo.svg')

      // All should contain branding
      expect(confirmationHtml).toContain('30 Years of Athletic Excellence')
      expect(paymentHtml).toContain('30 Years of Athletic Excellence')
      expect(adminHtml).toContain('Ralhum Sports')

      // All should use consistent styling
      expect(confirmationHtml).toContain('font-family: -apple-system')
      expect(paymentHtml).toContain('font-family: -apple-system')
      expect(adminHtml).toContain('font-family: -apple-system')
    })

    it('should include tracking buttons in all relevant templates', () => {
      const confirmationHtml = generateOrderConfirmationEmail(mockOrderData)
      const paymentHtml = generatePaymentSuccessEmail({ 
        ...mockOrderData, 
        paymentMethod: 'VISA', 
        paymentId: 'PAY_123', 
        paymentDate: '2024-01-07T10:35:00Z' 
      })

      expect(confirmationHtml).toContain('Track Order')
      expect(paymentHtml).toContain('Track Order')
      
      // Both should have the same tracking URL
      expect(confirmationHtml).toContain('/orders/track?id=RS-20240107-ABC12')
      expect(paymentHtml).toContain('/orders/track?id=RS-20240107-ABC12')
    })
  })
})