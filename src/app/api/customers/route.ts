import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { getSecurityHeaders } from '@/lib/response-filter'

// ✅ Define proper types instead of using any
type CustomerAddress = {
  type: 'home' | 'office' | 'other'
  address: string
  isDefault: boolean
  id?: string | null
}

type CustomerUpdateData = {
  name?: string
  primaryPhone?: string
  secondaryPhone?: string
  addresses?: CustomerAddress[]
}

export const POST = withRateLimit(rateLimitConfigs.strict, async (request: NextRequest) => {
  try {
    const payload = await getPayload({ config })
    const data = await request.json()

    const {
      name,
      email,
      phone,
      secondaryPhone,
      address,
      preferredLanguage = 'english',
      marketingOptIn = true,
    } = data

    // Check if customer already exists
    const existingCustomers = await payload.find({
      collection: 'customers',
      where: {
        email: { equals: email },
      },
    })

    let customer

    if (existingCustomers.docs.length > 0) {
      // Update existing customer
      customer = existingCustomers.docs[0]

      // ✅ Fix: Properly type updateData instead of any
      const updateData: CustomerUpdateData = {}

      if (name && name !== customer.name) updateData.name = name
      if (phone && phone !== customer.primaryPhone) updateData.primaryPhone = phone
      if (secondaryPhone && secondaryPhone !== customer.secondaryPhone)
        updateData.secondaryPhone = secondaryPhone

      // Add new address if provided and not already exists
      if (address) {
        // ✅ Fix: Properly type addresses instead of any
        const addresses: CustomerAddress[] = (customer.addresses || []).map(
          (addr: Record<string, unknown>) => {
            let type: 'home' | 'office' | 'other' = 'home'
            if (addr.type === 'office' || addr.type === 'other') {
              type = addr.type
            }
            return {
              type,
              address: String(addr.address || ''),
              isDefault: Boolean(addr.isDefault),
              id: typeof addr.id === 'string' ? addr.id : undefined,
            }
          },
        )

        const addressExists = addresses.some(
          (addr: CustomerAddress) =>
            addr.address ===
            `${address.street}, ${address.city}, ${address.postalCode}, ${address.province}`,
        )

        if (!addressExists) {
          addresses.push({
            type: 'home',
            address: `${address.street}, ${address.city}, ${address.postalCode}, ${address.province}`,
            isDefault: addresses.length === 0,
          })
          updateData.addresses = addresses
        }
      }

      if (Object.keys(updateData).length > 0) {
        customer = await payload.update({
          collection: 'customers',
          id: customer.id,
          data: updateData,
        })
      }
    } else {
      // Create new customer
      customer = await payload.create({
        collection: 'customers',
        data: {
          name,
          email,
          primaryPhone: phone,
          secondaryPhone,
          addresses: address
            ? [
                {
                  type: 'home',
                  address: `${address.street}, ${address.city}, ${address.postalCode}, ${address.province}`,
                  isDefault: true,
                },
              ]
            : [],
          preferences: {
            communicationMethod: 'whatsapp',
            language: preferredLanguage,
            marketingOptIn,
          },
          whatsapp: {
            isVerified: false,
          },
          status: 'active',
          customerType: 'regular',
        },
      })
    }

    // ✅ Fix: Remove unused variable and properly type
    // const addresses: CustomerAddress[] = (customer.addresses || []).map((addr: any) => ({

    // Remove 'any' usage by using type guards and safe property access
    function extractCustomerData(customer: unknown) {
      if (
        customer &&
        typeof customer === 'object' &&
        'id' in customer &&
        'name' in customer &&
        'email' in customer &&
        'primaryPhone' in customer &&
        'addresses' in customer
      ) {
        return {
          id: (customer as { id: string }).id,
          name: (customer as { name: string }).name,
          email: (customer as { email: string }).email,
          phone: (customer as { primaryPhone: string }).primaryPhone,
          addresses: (customer as { addresses: CustomerAddress[] }).addresses,
        }
      }
      // If customer.doc exists, fallback to that
      if (
        customer &&
        typeof customer === 'object' &&
        'doc' in customer &&
        customer.doc &&
        typeof (customer as { doc: unknown }).doc === 'object'
      ) {
        const doc = (
          customer as {
            doc: {
              id: string
              name: string
              email: string
              primaryPhone: string
              addresses: CustomerAddress[]
            }
          }
        ).doc
        return {
          id: doc.id,
          name: doc.name,
          email: doc.email,
          phone: doc.primaryPhone,
          addresses: doc.addresses,
        }
      }
      return {
        id: undefined,
        name: undefined,
        email: undefined,
        phone: undefined,
        addresses: undefined,
      }
    }

    const customerData = extractCustomerData(customer)
    return NextResponse.json(
      {
        success: true,
        data: customerData,
      },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    console.error('Error creating/updating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create/update customer' },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
})
