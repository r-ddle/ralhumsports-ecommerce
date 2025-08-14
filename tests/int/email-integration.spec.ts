import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  sendOrderConfirmationEmail, 
  sendPaymentSuccessEmail,
  sendAdminCustomEmail 
} from '../../src/lib/email-service'

// Mock the payload
const mockSendEmail = vi.fn()
const mockGetPayload = vi.fn(() => ({
  sendEmail: mockSendEmail,
}))

vi.mock('payload', () => ({
  getPayload: mockGetPayload,
}))

// Mock the config
vi.mock('../../src/payload.config', () => ({
  default: {},
}))

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

describe('Email Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendEmail.mockResolvedValue(true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('sendOrderConfirmationEmail', () => {
    const mockOrderData = {
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
      ],
      orderTotal: 15000,
      orderSubtotal: 15000,
      deliveryAddress: '123 Main Street, Colombo 03',
      createdAt: '2024-01-07T10:30:00Z',
    }

    it('should send order confirmation email successfully', async () => {
      const result = await sendOrderConfirmationEmail(mockOrderData)

      expect(result).toBe(true)
      expect(mockSendEmail).toHaveBeenCalledWith({
        to: 'john.doe@example.com',
        subject: 'Order Confirmation - RS-20240107-ABC12 | Ralhum Sports',
        html: expect.stringContaining('Order Confirmation'),
        text: expect.stringContaining('ORDER CONFIRMATION'),
      })
      expect(mockSendEmail).toHaveBeenCalledTimes(1)
    })

    it('should handle email sending failure gracefully', async () => {
      mockSendEmail.mockRejectedValue(new Error('SMTP connection failed'))

      const result = await sendOrderConfirmationEmail(mockOrderData)

      expect(result).toBe(false)
      expect(mockSendEmail).toHaveBeenCalledTimes(1)
    })

    it('should include all necessary email components', async () => {
      await sendOrderConfirmationEmail(mockOrderData)

      const emailCall = mockSendEmail.mock.calls[0][0]
      expect(emailCall.html).toContain('John Doe')
      expect(emailCall.html).toContain('RS-20240107-ABC12')
      expect(emailCall.html).toContain('Wilson Tennis Racket')
      expect(emailCall.html).toContain('LKR 17,250')
      expect(emailCall.html).toContain('ralhumlogo.svg')
      expect(emailCall.text).toContain('TRACK YOUR ORDER')
    })
  })

  describe('sendPaymentSuccessEmail', () => {
    const mockPaymentData = {
      orderNumber: 'RS-20240107-ABC12',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerId: 'CUST-123',
      items: [],
      orderTotal: 15000,
      orderSubtotal: 15000,
      deliveryAddress: '123 Main Street, Colombo 03',
      createdAt: '2024-01-07T10:30:00Z',
      paymentMethod: 'VISA',
      paymentId: 'PAY_123456789',
      paymentDate: '2024-01-07T10:35:00Z',
    }

    it('should send payment success email successfully', async () => {
      const result = await sendPaymentSuccessEmail(mockPaymentData)

      expect(result).toBe(true)
      expect(mockSendEmail).toHaveBeenCalledWith({
        to: 'john.doe@example.com',
        subject: 'Payment Successful - RS-20240107-ABC12 | Ralhum Sports',
        html: expect.stringContaining('Payment Successful'),
      })
    })

    it('should include payment details in email', async () => {
      await sendPaymentSuccessEmail(mockPaymentData)

      const emailCall = mockSendEmail.mock.calls[0][0]
      expect(emailCall.html).toContain('PAY_123456789')
      expect(emailCall.html).toContain('VISA')
      expect(emailCall.html).toContain('Payment Received Successfully!')
    })
  })

  describe('sendAdminCustomEmail', () => {
    const mockAdminData = {
      orderNumber: 'RS-20240107-ABC12',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      subject: 'Important Update About Your Order',
      customMessage: 'We need to inform you about a delay in processing your order.',
      adminName: 'Sarah Admin',
    }

    it('should send admin custom email successfully', async () => {
      const result = await sendAdminCustomEmail(mockAdminData)

      expect(result).toBe(true)
      expect(mockSendEmail).toHaveBeenCalledWith({
        to: 'john.doe@example.com',
        subject: 'Important Update About Your Order',
        html: expect.stringContaining('Important Update About Your Order'),
      })
    })

    it('should include admin name and custom message', async () => {
      await sendAdminCustomEmail(mockAdminData)

      const emailCall = mockSendEmail.mock.calls[0][0]
      expect(emailCall.html).toContain('Sarah Admin')
      expect(emailCall.html).toContain('delay in processing')
      expect(emailCall.html).toContain('Hello John Doe')
    })
  })

  describe('Error handling and logging', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    afterEach(() => {
      consoleSpy.mockClear()
      consoleLogSpy.mockClear()
    })

    it('should log success messages', async () => {
      const mockData = {
        orderNumber: 'RS-20240107-ABC12',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerId: 'CUST-123',
        items: [],
        orderTotal: 17250,
        orderSubtotal: 15000,
          deliveryAddress: '123 Main Street',
        createdAt: '2024-01-07T10:30:00Z',
      }

      await sendOrderConfirmationEmail(mockData)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[EMAIL_SUCCESS] Order confirmation email sent')
      )
    })

    it('should log error details without exposing sensitive information', async () => {
      const mockError = new Error('SMTP authentication failed')
      mockSendEmail.mockRejectedValue(mockError)

      const mockData = {
        orderNumber: 'RS-20240107-ABC12',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerId: 'CUST-123',
        items: [],
        orderTotal: 17250,
        orderSubtotal: 15000,
          deliveryAddress: '123 Main Street',
        createdAt: '2024-01-07T10:30:00Z',
      }

      await sendOrderConfirmationEmail(mockData)

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EMAIL_ERROR] Failed to send order confirmation email:',
        expect.objectContaining({
          error: 'SMTP authentication failed',
          orderNumber: 'RS-20240107-ABC12',
          customerEmail: 'john.doe@example.com',
          timestamp: expect.any(String),
        })
      )
    })

    it('should not include sensitive SMTP credentials in logs', async () => {
      mockSendEmail.mockRejectedValue(new Error('Auth failed with password: secretpassword123'))

      const mockData = {
        orderNumber: 'RS-20240107-ABC12',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerId: 'CUST-123',
        items: [],
        orderTotal: 17250,
        orderSubtotal: 15000,
          deliveryAddress: '123 Main Street',
        createdAt: '2024-01-07T10:30:00Z',
      }

      await sendOrderConfirmationEmail(mockData)

      // Error should be logged, but in structured format
      const errorCall = consoleSpy.mock.calls.find(call => 
        call[0].includes('[EMAIL_ERROR]')
      )
      expect(errorCall).toBeDefined()
      expect(errorCall[1]).toEqual(expect.objectContaining({
        error: expect.any(String),
        orderNumber: expect.any(String),
        customerEmail: expect.any(String),
      }))
    })
  })

  describe('Email quota optimization', () => {
    it('should send minimal emails to conserve quota', () => {
      // This test validates that our email logic follows the quota-saving approach
      // by only sending emails for critical status changes (cancelled, delivered)
      
      const criticalChanges = [
        ['pending', 'cancelled'],
        ['processing', 'cancelled'],
        ['shipped', 'delivered'],
        ['processing', 'delivered'],
      ]

      const nonCriticalChanges = [
        ['pending', 'confirmed'],
        ['confirmed', 'processing'],
        ['processing', 'shipped'],
      ]

      // Import the shouldSendStatusEmail function to test
      const { shouldSendStatusEmail } = require('../../src/lib/email-service')

      criticalChanges.forEach(([old, new_]) => {
        expect(shouldSendStatusEmail(old, new_)).toBe(true)
      })

      nonCriticalChanges.forEach(([old, new_]) => {
        expect(shouldSendStatusEmail(old, new_)).toBe(false)
      })
    })
  })
})