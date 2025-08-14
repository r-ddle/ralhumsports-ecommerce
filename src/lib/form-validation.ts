/**
 * Enhanced form validation utilities with proper error messages
 * Provides comprehensive validation for contact and checkout forms
 */

import { getProvinceForCity, isValidSriLankanCity } from './sri-lanka-locations'

export interface ValidationError {
  field: string
  message: string
  type: 'required' | 'format' | 'mismatch' | 'invalid'
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
  fieldErrors: Record<string, string>
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sri Lankan phone number validation regex
const SRI_LANKAN_PHONE_REGEX = /^(\+94|0)?[1-9]\d{8}$/

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email.trim()) {
    return {
      field: 'email',
      message: 'Email address is required',
      type: 'required'
    }
  }
  
  if (!EMAIL_REGEX.test(email.trim())) {
    return {
      field: 'email',
      message: 'Please enter a valid email address (e.g., john@example.com)',
      type: 'format'
    }
  }
  
  return null
}

/**
 * Validate Sri Lankan phone number
 */
export function validateSriLankanPhone(phone: string): ValidationError | null {
  if (!phone.trim()) {
    return {
      field: 'phone',
      message: 'Phone number is required',
      type: 'required'
    }
  }
  
  const cleanPhone = phone.replace(/[\s-]/g, '')
  
  if (!SRI_LANKAN_PHONE_REGEX.test(cleanPhone)) {
    return {
      field: 'phone',
      message: 'Please enter a valid Sri Lankan phone number (e.g., +94 77 123 4567 or 077 123 4567)',
      type: 'format'
    }
  }
  
  return null
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string, displayName: string): ValidationError | null {
  if (!value?.trim()) {
    return {
      field: fieldName,
      message: `${displayName} is required`,
      type: 'required'
    }
  }
  
  return null
}

/**
 * Validate city and auto-update province
 */
export function validateCityProvince(city: string, province: string): {
  cityError: ValidationError | null
  provinceError: ValidationError | null
  suggestedProvince: string | null
} {
  const cityError = validateRequired(city, 'city', 'City')
  let provinceError: ValidationError | null = null
  let suggestedProvince: string | null = null
  
  if (!cityError && city.trim()) {
    // Check if city is valid
    if (!isValidSriLankanCity(city)) {
      return {
        cityError: {
          field: 'city',
          message: 'Please enter a valid Sri Lankan city name',
          type: 'invalid'
        },
        provinceError: null,
        suggestedProvince: null
      }
    }
    
    // Get the correct province for this city
    const correctProvince = getProvinceForCity(city)
    if (correctProvince && province && correctProvince !== province) {
      suggestedProvince = correctProvince
      provinceError = {
        field: 'province',
        message: `${city} is in ${correctProvince}, not ${province}. Province will be auto-updated.`,
        type: 'mismatch'
      }
    } else if (correctProvince && !province) {
      suggestedProvince = correctProvince
    }
  }
  
  if (!province?.trim() && !suggestedProvince) {
    provinceError = {
      field: 'province',
      message: 'Province is required',
      type: 'required'
    }
  }
  
  return { cityError, provinceError, suggestedProvince }
}

/**
 * Validate contact form
 */
export function validateContactForm(formData: {
  name: string
  email: string
  phone?: string
  sport: string
  message: string
}): FormValidationResult {
  const errors: ValidationError[] = []
  
  // Validate required fields
  const nameError = validateRequired(formData.name, 'name', 'Full Name')
  if (nameError) errors.push(nameError)
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.push(emailError)
  
  // Phone is optional for contact form, but validate format if provided
  if (formData.phone?.trim()) {
    const phoneError = validateSriLankanPhone(formData.phone)
    if (phoneError) errors.push(phoneError)
  }
  
  const sportError = validateRequired(formData.sport, 'sport', 'Sport Category')
  if (sportError) errors.push(sportError)
  
  const messageError = validateRequired(formData.message, 'message', 'Message')
  if (messageError) errors.push(messageError)
  
  // Create field errors map for easy access
  const fieldErrors: Record<string, string> = {}
  errors.forEach(error => {
    fieldErrors[error.field] = error.message
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
}

/**
 * Validate checkout form
 */
export function validateCheckoutForm(formData: {
  fullName: string
  email: string
  phone: string
  secondaryPhone?: string
  address: {
    street: string
    city: string
    postalCode: string
    province: string
  }
}): FormValidationResult & { suggestedProvince?: string } {
  const errors: ValidationError[] = []
  let suggestedProvince: string | undefined
  
  // Validate customer info
  const nameError = validateRequired(formData.fullName, 'fullName', 'Full Name')
  if (nameError) errors.push(nameError)
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.push(emailError)
  
  const phoneError = validateSriLankanPhone(formData.phone)
  if (phoneError) errors.push(phoneError)
  
  // Validate secondary phone if provided
  if (formData.secondaryPhone?.trim()) {
    const secondaryPhoneError = validateSriLankanPhone(formData.secondaryPhone)
    if (secondaryPhoneError) {
      errors.push({
        ...secondaryPhoneError,
        field: 'secondaryPhone'
      })
    }
  }
  
  // Validate address
  const streetError = validateRequired(formData.address.street, 'street', 'Street Address')
  if (streetError) errors.push(streetError)
  
  const postalCodeError = validateRequired(formData.address.postalCode, 'postalCode', 'Postal Code')
  if (postalCodeError) errors.push(postalCodeError)
  
  // Validate postal code format (Sri Lankan postal codes are 5 digits)
  if (!postalCodeError && formData.address.postalCode.trim()) {
    const postalCode = formData.address.postalCode.trim()
    if (!/^\d{5}$/.test(postalCode)) {
      errors.push({
        field: 'postalCode',
        message: 'Postal code must be 5 digits (e.g., 10400)',
        type: 'format'
      })
    }
  }
  
  // Validate city and province relationship
  const { cityError, provinceError, suggestedProvince: cityProvinceSuggestion } = validateCityProvince(
    formData.address.city,
    formData.address.province
  )
  
  if (cityError) errors.push(cityError)
  if (provinceError && provinceError.type !== 'mismatch') errors.push(provinceError)
  
  // Set suggested province for auto-update
  if (cityProvinceSuggestion) {
    suggestedProvince = cityProvinceSuggestion
  }
  
  // Create field errors map
  const fieldErrors: Record<string, string> = {}
  errors.forEach(error => {
    fieldErrors[error.field] = error.message
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
    suggestedProvince
  }
}

/**
 * Get user-friendly validation message for disabled buttons
 */
export function getButtonDisabledReason(errors: ValidationError[]): string {
  if (errors.length === 0) return ''
  
  const requiredFields = errors.filter(e => e.type === 'required').map(e => e.field)
  const formatErrors = errors.filter(e => e.type === 'format')
  
  if (requiredFields.length > 0) {
    if (requiredFields.length === 1) {
      return `Please fill in the ${requiredFields[0]} field`
    } else if (requiredFields.length === 2) {
      return `Please fill in the ${requiredFields[0]} and ${requiredFields[1]} fields`
    } else {
      return `Please fill in ${requiredFields.length} required fields`
    }
  }
  
  if (formatErrors.length > 0) {
    return `Please fix the ${formatErrors[0].field} format`
  }
  
  return 'Please fix the form errors'
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('94')) {
    // +94 format
    const number = cleaned.slice(2)
    if (number.length >= 9) {
      return `+94 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 9)}`
    }
  } else if (cleaned.startsWith('0')) {
    // Local format
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`
    }
  }
  
  return phone
}