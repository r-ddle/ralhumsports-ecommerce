import { describe, it, expect } from 'vitest'
import { validateSriLankanPhone, formatSriLankanPhone } from '@/lib/whatsapp'

describe('Sri Lankan Phone Number Validation and Formatting', () => {
  describe('validateSriLankanPhone', () => {
    it('should validate mobile numbers in local format (with leading 0)', () => {
      expect(validateSriLankanPhone('0772350712')).toBe(true)
      expect(validateSriLankanPhone('0712345678')).toBe(true)
      expect(validateSriLankanPhone('0742350712')).toBe(true)
      expect(validateSriLankanPhone('0752350712')).toBe(true)
      expect(validateSriLankanPhone('0762350712')).toBe(true)
      expect(validateSriLankanPhone('0782350712')).toBe(true)
    })

    it('should validate mobile numbers in international format', () => {
      expect(validateSriLankanPhone('+94772350712')).toBe(true)
      expect(validateSriLankanPhone('+94712345678')).toBe(true)
      expect(validateSriLankanPhone('+94742350712')).toBe(true)
    })

    it('should validate mobile numbers without country code or leading 0', () => {
      expect(validateSriLankanPhone('772350712')).toBe(true)
      expect(validateSriLankanPhone('712345678')).toBe(true)
      expect(validateSriLankanPhone('742350712')).toBe(true)
    })

    it('should validate mobile numbers with country code but no +', () => {
      expect(validateSriLankanPhone('94772350712')).toBe(true)
      expect(validateSriLankanPhone('94712345678')).toBe(true)
    })

    it('should validate landline numbers in local format', () => {
      expect(validateSriLankanPhone('0112345678')).toBe(true)
      expect(validateSriLankanPhone('0312345678')).toBe(true)
      expect(validateSriLankanPhone('0812345678')).toBe(true)
      expect(validateSriLankanPhone('0912345678')).toBe(true)
    })

    it('should validate landline numbers in international format', () => {
      expect(validateSriLankanPhone('+94112345678')).toBe(true)
      expect(validateSriLankanPhone('+94312345678')).toBe(true)
      expect(validateSriLankanPhone('+94812345678')).toBe(true)
    })

    it('should handle phone numbers with spaces, dashes, and brackets', () => {
      expect(validateSriLankanPhone('077 235 0712')).toBe(true)
      expect(validateSriLankanPhone('077-235-0712')).toBe(true)
      expect(validateSriLankanPhone('(077) 235-0712')).toBe(true)
      expect(validateSriLankanPhone('+94 77 235 0712')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validateSriLankanPhone('')).toBe(false)
      expect(validateSriLankanPhone('123456789')).toBe(false) // Wrong prefix
      expect(validateSriLankanPhone('072345678')).toBe(false) // Too short (9 digits)
      expect(validateSriLankanPhone('07723507123')).toBe(false) // Too long
      expect(validateSriLankanPhone('0872350712')).toBe(false) // Invalid mobile prefix
      expect(validateSriLankanPhone('abc1234567')).toBe(false) // Non-numeric
      expect(validateSriLankanPhone('+91772350712')).toBe(false) // Wrong country code
    })
  })

  describe('formatSriLankanPhone', () => {
    it('should format local mobile numbers to international format', () => {
      expect(formatSriLankanPhone('0772350712')).toBe('+94772350712')
      expect(formatSriLankanPhone('0712345678')).toBe('+94712345678')
    })

    it('should format local landline numbers to international format', () => {
      expect(formatSriLankanPhone('0112345678')).toBe('+94112345678')
      expect(formatSriLankanPhone('0312345678')).toBe('+94312345678')
    })

    it('should add + to numbers with country code but missing +', () => {
      expect(formatSriLankanPhone('94772350712')).toBe('+94772350712')
      expect(formatSriLankanPhone('94112345678')).toBe('+94112345678')
    })

    it('should add country code to numbers without any prefix', () => {
      expect(formatSriLankanPhone('772350712')).toBe('+94772350712')
      expect(formatSriLankanPhone('112345678')).toBe('+94112345678')
    })

    it('should handle alternative international format (0094)', () => {
      expect(formatSriLankanPhone('0094772350712')).toBe('+94772350712')
      expect(formatSriLankanPhone('0094112345678')).toBe('+94112345678')
    })

    it('should keep already correctly formatted numbers unchanged', () => {
      expect(formatSriLankanPhone('+94772350712')).toBe('+94772350712')
      expect(formatSriLankanPhone('+94112345678')).toBe('+94112345678')
    })

    it('should handle phone numbers with spaces and special characters', () => {
      expect(formatSriLankanPhone('077 235 0712')).toBe('+94772350712')
      expect(formatSriLankanPhone('077-235-0712')).toBe('+94772350712')
      expect(formatSriLankanPhone('(077) 235-0712')).toBe('+94772350712')
    })

    it('should handle edge cases', () => {
      expect(formatSriLankanPhone('')).toBe('')
      expect(formatSriLankanPhone('invalid')).toBe('invalid')
    })
  })

  describe('Real-world test cases', () => {
    const testCases = [
      { input: '0772350712', valid: true, formatted: '+94772350712' },
      { input: '+94772350712', valid: true, formatted: '+94772350712' },
      { input: '772350712', valid: true, formatted: '+94772350712' },
      { input: '94772350712', valid: true, formatted: '+94772350712' },
      { input: '0112345678', valid: true, formatted: '+94112345678' },
      { input: '+94112345678', valid: true, formatted: '+94112345678' },
      { input: '112345678', valid: true, formatted: '+94112345678' },
      { input: '077 235 0712', valid: true, formatted: '+94772350712' },
      { input: '+94 77 235 0712', valid: true, formatted: '+94772350712' },
    ]

    testCases.forEach(({ input, valid, formatted }) => {
      it(`should handle "${input}" correctly`, () => {
        expect(validateSriLankanPhone(input)).toBe(valid)
        if (valid) {
          expect(formatSriLankanPhone(input)).toBe(formatted)
        }
      })
    })
  })
})
