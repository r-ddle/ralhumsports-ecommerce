import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Where } from 'payload/types'
import config from '@/payload.config'
import type { OrderInput } from '@/types/api' // Assuming OrderInput is well-defined
import type { Customer, Order } from '@/payload-types' // Import specific Payload types
import { requireAdminOrManager, AuthenticatedUser } from '@/lib/auth'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { filterOrderData, getSecurityHeaders } from '@/lib/response-filter'

// Define PayloadError type for error narrowing
type PayloadError = Error & {
  status?: number
  data?: { field?: string; message?: string }[] // More specific error data
}

// POST /api/orders - Create new order (public with rate limiting)
export const POST = withRateLimit(
  rateLimitConfigs.strict, // Strict rate limiting for order creation
  async (request: NextRequest) => {
    const payload = await getPayload({ config })
    let orderData: OrderInput

    try {
      orderData = await request.json()
    } catch (e) {
      payload.logger.error({ msg: 'Invalid JSON in request body', err: e })
      return NextResponse.json(
        { success: false, error: 'Invalid request format. Expected JSON.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    // Validate required fields (basic validation, consider Zod for complex cases)
    if (
      !orderData.customer?.fullName ||
      !orderData.customer?.email ||
      !orderData.customer?.phone
    ) {
      payload.logger.warn('Customer information is missing in order creation request')
      return NextResponse.json(
        { success: false, error: 'Customer full name, email, and phone are required.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    if (!orderData.items || orderData.items.length === 0) {
      payload.logger.warn('Order items are missing in order creation request')
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }
    // Add more specific validation for item structure, pricing, etc. if needed.

    try {
      // Create or update customer
      // Define the type for customer data for create and update operations
      const customerData: Partial<Customer> = {
        name: orderData.customer.fullName,
        email: orderData.customer.email,
        primaryPhone: orderData.customer.phone,
        secondaryPhone: orderData.customer.secondaryPhone,
        addresses: orderData.customer.address
          ? [
              {
                type: 'home', // Assuming 'home' is a valid type in your Customer collection
                address: `${orderData.customer.address.street}, ${orderData.customer.address.city}, ${orderData.customer.address.postalCode}, ${orderData.customer.address.province}`,
                isDefault: true,
              },
            ]
          : [],
        preferences: {
          communicationMethod: 'whatsapp', // Assuming 'whatsapp' is valid
          marketingOptIn: orderData.customer.marketingOptIn || false,
        },
        whatsapp: { isVerified: false }, // Assuming default
        status: 'active', // Assuming 'active' is valid
        customerType: 'regular', // Assuming 'regular' is valid
      }

      const existingCustomers = await payload.find({
        collection: 'customers',
        where: { email: { equals: orderData.customer.email } },
        limit: 1,
      })

      if (existingCustomers.docs.length > 0) {
        await payload.update({
          collection: 'customers',
          id: existingCustomers.docs[0].id,
          data: customerData,
        })
      } else {
        await payload.create({
          collection: 'customers',
          data: customerData as Customer, // Cast if confident all required fields for create are present
        })
      }
    } catch (customerError) {
      const err = customerError as PayloadError
      payload.logger.error({ msg: 'Error creating/updating customer during order placement', err })
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process customer information.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: 500, headers: getSecurityHeaders() },
      )
    }

    // Create order
    try {
      const deliveryAddress = orderData.customer.address
        ? `${orderData.customer.address.street}, ${orderData.customer.address.city}, ${orderData.customer.address.postalCode}, ${orderData.customer.address.province}`
        : 'Address not provided'

      const newOrderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'> & {
        orderNumber?: string
      } = {
        customerName: orderData.customer.fullName,
        customerEmail: orderData.customer.email,
        customerPhone: orderData.customer.phone,
        customerSecondaryPhone: orderData.customer.secondaryPhone,
        deliveryAddress,
        specialInstructions: orderData.specialInstructions,
        orderItems: orderData.items.map((item) => ({
          productId: String(item.product.id) || 'unknown', // Ensure productId is string
          productName: item.product.title || item.product.name || 'Unknown Product',
          productSku: item.product.sku || 'unknown',
          unitPrice: item.variant?.price || item.price || 0,
          quantity: item.quantity,
          selectedSize: item.variant?.size || item.size,
          selectedColor: item.variant?.color || item.color,
          subtotal: (item.variant?.price || item.price || 0) * item.quantity,
        })),
        orderSubtotal: orderData.pricing.subtotal,
        shippingCost: orderData.pricing.shipping || 0,
        discount: 0, // Assuming default
        orderTotal: orderData.pricing.total,
        orderStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'cod', // Defaulting to 'cod', ensure this is intended
        orderSource: orderData.orderSource || 'website',
        whatsapp: {
          messageSent: false,
          messageTemplate: 'order-confirmation',
        },
      }

      const order = await payload.create({
        collection: 'orders',
        data: newOrderData,
      })

      const responseData = {
        orderNumber: order.orderNumber,
        id: order.id,
        status: order.orderStatus,
        total: order.orderTotal,
        currency: 'LKR', // Consider making this dynamic if you support multiple currencies
        createdAt: order.createdAt,
      }

      return NextResponse.json(
        { success: true, data: responseData },
        { status: 201, headers: getSecurityHeaders() }, // 201 Created
      )
    } catch (orderError) {
      const err = orderError as PayloadError
      payload.logger.error({ msg: 'Error creating order', orderData, err })
      let userMessage = 'Failed to create order.'
      if (err.data && err.data[0]?.message) {
        userMessage = `Validation Error: ${err.data[0].message} for field ${err.data[0].field}`
      } else if (err.message.includes('duplicat')) {
        userMessage = 'An order with similar details may already exist.' // More user-friendly for unique constraint violations
      }

      return NextResponse.json(
        {
          success: false,
          error: userMessage,
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: err.status || 500, headers: getSecurityHeaders() },
      )
    }
  },
)

// GET /api/orders - List orders (admin/manager only, with rate limiting)
export const GET = withRateLimit(
  rateLimitConfigs.moderate,
  requireAdminOrManager(async (request: NextRequest, auth: AuthenticatedUser) => {
    const payload = await getPayload({ config })
    try {
      const { searchParams } = new URL(request.url)
      const pageParam = searchParams.get('page')
      const limitParam = searchParams.get('limit')
      const status = searchParams.get('status')
      const customerEmail = searchParams.get('customerEmail')

      const page = pageParam ? parseInt(pageParam, 10) : 1
      const limit = limitParam ? parseInt(limitParam, 10) : 20

      if (isNaN(page) || page < 1) {
        return NextResponse.json(
          { success: false, error: 'Invalid page number.' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return NextResponse.json(
          { success: false, error: 'Invalid limit. Must be between 1 and 100.' },
          { status: 400, headers: getSecurityHeaders() },
        )
      }

      const whereConditions: Where = {}

      if (status) {
        // Ensure status is a valid OrderStatus value if possible
        whereConditions.orderStatus = { equals: status }
      }

      if (customerEmail) {
        if (auth.role && ['super-admin', 'admin'].includes(auth.role)) {
           whereConditions.customerEmail = { equals: customerEmail }
        } else {
            // Non-admins/super-admins should not be able to filter by arbitrary customer emails for security/privacy.
            // Or, if they are a manager, they might only see orders related to their scope.
            // For now, restrict this.
             payload.logger.warn(`User ${auth.email} (role: ${auth.role}) attempted to filter orders by customerEmail without sufficient permissions.`);
        }
      }


      const result = await payload.find({
        collection: 'orders',
        where: whereConditions,
        page,
        limit,
        sort: '-createdAt', // Newest first
        depth: 1, // Adjust depth as needed for related data, 1 is usually efficient for lists
      })

      const filteredOrders = result.docs
        .map((order) => filterOrderData(order as Order, auth)) // Pass typed order
        .filter((order): order is NonNullable<typeof order> => order !== null)

      return NextResponse.json(
        {
          success: true,
          data: filteredOrders,
          pagination: {
            page: result.page || 1,
            limit: result.limit,
            totalPages: result.totalPages,
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
          },
        },
        { headers: getSecurityHeaders() },
      )
    } catch (error) {
      const err = error as Error // PayloadError or generic Error
      payload.logger.error({ msg: 'Failed to fetch orders', err })
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch orders.',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined,
        },
        { status: 500, headers: getSecurityHeaders() },
      )
    }
  }),
)
