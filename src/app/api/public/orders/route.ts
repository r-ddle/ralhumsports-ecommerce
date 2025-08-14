import { rateLimitConfigs, withRateLimit } from '@/lib/rate-limit'
import { filterOrderData, getSecurityHeaders } from '@/lib/response-filter'
import { OrderInput } from '@/types/api'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { requireAdminOrManager, getAuthContext } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type PayloadError = Error & { status?: number }

// POST /api/public/orders - Create new order (public with rate limiting)
export const POST = withRateLimit(rateLimitConfigs.strict, async (request: NextRequest) => {
  console.log('\x1b[35m[Orders API] Processing order creation request\x1b[0m')
  const origin = request.headers.get('origin')
  try {
    const orderData: OrderInput = await request.json()
    console.log(
      '\x1b[33m[Orders API] Received order data:\x1b[0m',
      JSON.stringify(orderData, null, 2),
    )

    // Validate required fields
    if (!orderData.customer?.fullName || !orderData.customer?.email || !orderData.customer?.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400, headers: getSecurityHeaders(origin || undefined) },
      )
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400, headers: getSecurityHeaders(origin || undefined) },
      )
    }

    const payload = await getPayload({ config })

    // Check for duplicate orders within the last 5 minutes to prevent double submission
    if (orderData.customer?.email) {
      try {
        // Look up existing customer to get their ID for duplicate check
        const existingCustomerCheck = await payload.find({
          collection: 'customers',
          where: { email: { equals: orderData.customer.email } },
          limit: 1,
        })

        if (existingCustomerCheck.docs.length > 0) {
          const existingCustomerId = existingCustomerCheck.docs[0].id.toString()

          const recentOrders = await payload.find({
            collection: 'orders',
            where: {
              customerId: { equals: existingCustomerId },
              createdAt: {
                greater_than: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
              },
            },
            limit: 1,
          })

          if (recentOrders.docs.length > 0) {
            console.log('[Orders API] Duplicate order detected, returning existing order')
            const existingOrder = recentOrders.docs[0]
            return NextResponse.json(
              {
                success: true,
                data: {
                  orderId: existingOrder.id.toString(),
                  orderNumber: existingOrder.orderNumber,
                  customerId: existingOrder.customerId,
                  status: existingOrder.status?.orderStatus || 'pending',
                  total: existingOrder.orderSummary?.orderTotal || 0,
                  createdAt: existingOrder.createdAt,
                },
              },
              { headers: getSecurityHeaders(origin || undefined) },
            )
          }
        }
      } catch (duplicateCheckError) {
        console.warn('[Orders API] Error checking for duplicate orders:', duplicateCheckError)
        // Continue with order creation if duplicate check fails
      }
    }

    // Create or update customer first
    let customer
    try {
      const existingCustomer = await payload.find({
        collection: 'customers',
        where: {
          email: { equals: orderData.customer.email },
        },
        limit: 1,
      })
      console.log('[Orders API] Customer lookup result:', existingCustomer.docs)

      if (existingCustomer.docs.length > 0) {
        console.log('[Orders API] Updating existing customer:', existingCustomer.docs[0].id)
        customer = await payload.update({
          collection: 'customers',
          id: existingCustomer.docs[0].id,
          data: {
            name: orderData.customer.fullName,
            email: orderData.customer.email,
            primaryPhone: orderData.customer.phone,
            secondaryPhone: orderData.customer.secondaryPhone,
            addresses: orderData.customer.address
              ? [
                  {
                    type: 'home',
                    address: `${orderData.customer.address.street}, ${orderData.customer.address.city}, ${orderData.customer.address.postalCode}, ${orderData.customer.address.province}`,
                    isDefault: true,
                  },
                ]
              : [],
            status: 'active',
          },
        })
        console.log('[Orders API] Customer updated:', customer)
      } else {
        console.log('[Orders API] Creating new customer')
        customer = await payload.create({
          collection: 'customers',
          data: {
            name: orderData.customer.fullName,
            email: orderData.customer.email,
            primaryPhone: orderData.customer.phone,
            secondaryPhone: orderData.customer.secondaryPhone,
            addresses: orderData.customer.address
              ? [
                  {
                    type: 'home',
                    address: `${orderData.customer.address.street}, ${orderData.customer.address.city}, ${orderData.customer.address.postalCode}, ${orderData.customer.address.province}`,
                    isDefault: true,
                  },
                ]
              : [],
            status: 'active',
          },
        })
        console.log('[Orders API] Customer created:', customer)
      }
    } catch (customerError) {
      console.error('\x1b[41m[Orders API] Error creating/updating customer:\x1b[0m', customerError)
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create customer',
          details: customerError instanceof Error ? customerError.message : String(customerError),
        },
        { status: 500, headers: getSecurityHeaders(origin || undefined) },
      )
    }

    // Create order with better error handling
    try {
      console.log(
        '\x1b[33m[Orders API] Creating order with data:\x1b[0m',
        JSON.stringify(orderData, null, 2),
      )

      const order = await payload.create({
        collection: 'orders',
        data: {
          orderNumber: '', // Placeholder, will be auto-generated by hook
          customerId: customer.id.toString(), // Store PayloadCMS customer ID as string
          customer: {
            customerName: orderData.customer.fullName,
            customerPhone: orderData.customer.phone,
            customerEmail: orderData.customer.email,
            deliveryAddress: orderData.customer.address
              ? `${orderData.customer.address.street}, ${orderData.customer.address.city}, ${orderData.customer.address.postalCode}, ${orderData.customer.address.province}`
              : '',
          },
          orderItems: orderData.items.map((item) => ({
            productName: item.productName || 'Unknown Product',
            productSku: item.productSku || 'unknown',
            unitPrice: item.unitPrice || 0,
            quantity: item.quantity,
            selectedVariant: parseInt(item.productId) || null, // Product ID for the relationship
            subtotal: item.subtotal || 0,
            variantDetails: {
              size: item.selectedSize,
              color: item.selectedColor,
              sku: item.productSku,
            },
          })),
          whatsapp: {
            messageSent: false,
            messageTemplate: 'order-confirmation',
          },
          status: {
            orderStatus: 'pending', // or another default status
            paymentStatus: 'pending', // or another default payment status
          },
          orderSummary: {
            orderTotal: orderData.items.reduce((sum, item) => sum + (item.subtotal || 0), 0),
          },
        },
      })

      console.log('[Orders API] Order created successfully:', order)

      // --- Post-order: Update product stock (base or variant) ---
      for (const item of orderData.items) {
        try {
          const product = await payload.findByID({
            collection: 'products',
            id: item.productId,
          })
          if (!product) {
            console.error(`[Orders API] Product not found for stock update: ${item.productId}`)
            continue
          }
          // If product has variants, update only the selected variant's inventory
          if (Array.isArray(product.variants) && product.variants.length > 0 && item.variantId) {
            const updatedVariants = product.variants.map((variant) => {
              if (
                (variant.id && variant.id.toString() === item.variantId.toString()) ||
                (variant.sku && variant.sku === item.productSku)
              ) {
                const newStock = Math.max(0, (variant.stock || 0) - item.quantity)
                console.log(
                  `[Orders API] Updating variant stock for product ${item.productId}, variant ${item.variantId}: ${variant.stock} -> ${newStock}`,
                )
                return { ...variant, stock: newStock }
              }
              return variant
            })
            await payload.update({
              collection: 'products',
              id: item.productId,
              data: { variants: updatedVariants },
            })
          } else if (!product.variants || product.variants.length === 0) {
            // No variants: update base stock
            if (typeof product.inventory?.stock === 'number') {
              const newStock = Math.max(0, product.inventory.stock - item.quantity)
              console.log(
                `[Orders API] Updating base stock for product ${item.productId}: ${product.inventory.stock} -> ${newStock}`,
              )
              await payload.update({
                collection: 'products',
                id: item.productId,
                data: { inventory: { ...product.inventory, stock: newStock } },
              })
            } else {
              console.warn(`[Orders API] Product ${item.productId} has no stock field to update.`)
            }
          } else {
            console.warn(
              `[Orders API] Product ${item.productId} has variants but no matching variantId for item.`,
            )
          }
        } catch (err) {
          console.error(`[Orders API] Error updating stock for product ${item.productId}:`, err)
        }
      }

      // Invalidate caches to ensure fresh product data with updated stock
      try {
        // Revalidate product pages to show updated stock levels
        revalidatePath('/products')
        revalidatePath('/api/public/products')

        // Revalidate individual product pages for updated products
        for (const item of orderData.items) {
          revalidatePath(`/products/${item.productId}`)
          revalidatePath(`/api/public/products/${item.productId}`)
        }

        console.log('[Orders API] Cache revalidation completed - product pages refreshed')
      } catch (cacheError) {
        console.warn('[Orders API] Cache revalidation failed:', cacheError)
        // Don't fail the order if cache revalidation fails
      }

      // Return success immediately
      const responseData = {
        orderId: order.id.toString(),
        orderNumber: order.orderNumber,
        customerId: customer.id.toString(), // Return PayloadCMS customer ID
        customerEmail: orderData.customer.email, // Also include email for reference
        status: order.status.orderStatus,
        total: order.orderSummary.orderTotal,
        createdAt: order.createdAt,
      }

      console.log('\x1b[32m[Orders API] Order creation completed:\x1b[0m', responseData)

      return NextResponse.json(
        { success: true, data: responseData },
        { headers: getSecurityHeaders(origin || undefined) },
      )
    } catch (orderError) {
      console.error('\x1b[41m[Orders API] Error creating order:\x1b[0m', orderError)

      let errorMessage = 'Failed to create order'
      let statusCode = 500

      if (orderError instanceof Error) {
        errorMessage = orderError.message

        // Check if it's a Payload validation error
        if ('status' in orderError && typeof (orderError as PayloadError).status === 'number') {
          statusCode = (orderError as PayloadError).status ?? 500
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          ...(process.env.NODE_ENV === 'development' && {
            details: orderError instanceof Error ? orderError.stack : String(orderError),
          }),
        },
        { status: statusCode, headers: getSecurityHeaders() },
      )
    }
  } catch (error) {
    console.error('\x1b[41m[Orders API] General error:\x1b[0m', error)
    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400, headers: getSecurityHeaders() },
    )
  }
})

// GET /api/public/orders - List orders (admin/manager only OR customer-specific with rate limiting)
export const GET = withRateLimit(rateLimitConfigs.moderate, async (request: NextRequest) => {
  const origin = request.headers.get('origin')
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const customerEmail = searchParams.get('customerEmail')
    const customerId = searchParams.get('customerId')

    const payload = await getPayload({ config })

    // If customerId is provided, this is a customer request (public access)
    if (customerId) {
      console.log('\x1b[36m[Orders API] Customer order request\x1b[0m', { customerId, page, limit })

      let whereCondition: any

      // Check if customerId looks like an email (backward compatibility)
      if (customerId.includes('@')) {
        console.log(
          '\x1b[33m[Orders API] Using email-based lookup for backward compatibility\x1b[0m',
          customerId,
        )
        whereCondition = {
          'customer.customerEmail': { equals: customerId },
        }
      } else {
        console.log('\x1b[33m[Orders API] Using PayloadCMS customer ID lookup\x1b[0m', customerId)
        whereCondition = {
          customerId: { equals: customerId },
        }
      }

      // Find orders for this customer
      const result = await payload.find({
        collection: 'orders',
        where: whereCondition,
        limit: Math.min(limit, 50), // Max 50 for customer requests
        page,
        sort: '-createdAt', // Most recent first
        depth: 1,
      })

      // Transform the data to match frontend Order interface
      const transformedOrders = result.docs.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        customerName: order.customer?.customerName || '',
        customerEmail: order.customer?.customerEmail || '',
        customerPhone: order.customer?.customerPhone || '',
        deliveryAddress: order.customer?.deliveryAddress || '',
        orderItems: (order.orderItems || []).map((item: any) => ({
          id: item.id || `${item.productName}-${Date.now()}`,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          selectedSize: item.variantDetails?.size,
          selectedColor: item.variantDetails?.color,
          productSku: item.productSku,
          variantDetails: item.variantDetails,
        })),
        orderSubtotal: order.pricing?.orderSubtotal || order.orderSummary?.orderTotal || 0,
        orderTotal: order.orderSummary?.orderTotal || 0,
        orderStatus: order.status?.orderStatus || 'pending',
        paymentStatus: order.status?.paymentStatus || 'pending',
        paymentMethod: order.orderDetails?.paymentMethod || order.paymentInfo?.paymentMethod,
        specialInstructions: order.orderDetails?.specialInstructions,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }))

      return NextResponse.json(
        {
          success: true,
          data: transformedOrders,
          pagination: {
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            totalDocs: result.totalDocs,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
          },
        },
        { headers: getSecurityHeaders(origin || undefined) },
      )
    }

    // Admin/Manager request - check authentication
    const auth = await getAuthContext(request)
    if (!auth.isAuthenticated || !auth.isAdminOrManager) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers: getSecurityHeaders(origin || undefined) },
      )
    }

    // Build where conditions for admin requests
    type OrderWhereConditions = {
      orderStatus?: { equals: string }
      customerEmail?: { equals: string }
    }

    const whereConditions: OrderWhereConditions = {}

    if (status) {
      whereConditions.orderStatus = { equals: status }
    }

    if (customerEmail && auth?.isAdmin) {
      whereConditions.customerEmail = { equals: customerEmail }
    }

    console.log('\x1b[36m[Orders API] Admin order request\x1b[0m', {
      page,
      limit,
      status,
      customerEmail,
    })

    const result = await payload.find({
      collection: 'orders',
      where: whereConditions,
      page,
      limit: Math.min(limit, 100),
      sort: '-createdAt',
    })

    console.log(`\x1b[32m[Orders API] DB Query Success\x1b[0m`, {
      total: result.totalDocs,
      page: result.page,
      limit: result.limit,
    })

    const filteredOrders = result.docs
      .map((order) => filterOrderData(order as unknown as Record<string, unknown>, auth!))
      .filter((order) => order !== null)

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
      { headers: getSecurityHeaders(origin || undefined) },
    )
  } catch (error) {
    console.error('\x1b[41m\x1b[37m[Orders API ERROR]\x1b[0m', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: getSecurityHeaders(origin || undefined) },
    )
  }
})

// OPTIONS /api/public/orders - Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}
