import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Order } from '@/payload-types'
import { getSecurityHeaders } from '@/lib/response-filter' // Assuming this is for security headers
// Import authentication/authorization if these endpoints require it
// import { requireAdminOrManager, AuthenticatedUser } from '@/lib/auth';

// Define PayloadError type for error narrowing, consistent with other routes
type PayloadError = Error & {
  status?: number
  data?: { field?: string; message?: string }[]
}

// Define a more specific type for the update payload, derived from Order
// This makes it easier to manage allowed updatable fields.
type OrderUpdatePayload = Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>>

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }, // params is already an object
) {
  const payload = await getPayload({ config })
  const orderId = parseInt(params.id, 10)

  if (isNaN(orderId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid order ID format.' },
      { status: 400, headers: getSecurityHeaders() },
    )
  }

  try {
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 2, // Adjust depth as necessary
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404, headers: getSecurityHeaders() },
      )
    }

    // Potentially filter order data before sending if GET is public or based on user role
    // For now, assuming it's an admin/internal endpoint or already secured.
    return NextResponse.json({ success: true, data: order }, { headers: getSecurityHeaders() })
  } catch (error) {
    const err = error as PayloadError
    payload.logger.error({ msg: `Error fetching order ${orderId}`, err })
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: err.status || 500, headers: getSecurityHeaders() },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }, // params is already an object
) {
  const payload = await getPayload({ config })
  const orderId = parseInt(params.id, 10)

  if (isNaN(orderId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid order ID format.' },
      { status: 400, headers: getSecurityHeaders() },
    )
  }

  let updateData: OrderUpdatePayload

  try {
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      const payloadData = formData.get('_payload') // Payload admin UI often sends data this way
      if (payloadData && typeof payloadData === 'string') {
        updateData = JSON.parse(payloadData) as OrderUpdatePayload
      } else {
        // Handle other form fields if not using _payload, or reject
        return NextResponse.json(
          { success: false, error: "Invalid form data: missing '_payload' field." },
          { status: 400, headers: getSecurityHeaders() },
        )
      }
    } else if (contentType?.includes('application/json')) {
      updateData = (await request.json()) as OrderUpdatePayload
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported Content-Type. Please use application/json or multipart/form-data.' },
        { status: 415, headers: getSecurityHeaders() },
      )
    }
  } catch (parseError) {
    payload.logger.error({ msg: `Error parsing PATCH request body for order ${orderId}`, err: parseError })
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body.',
        details: parseError instanceof Error && process.env.NODE_ENV === 'development' ? parseError.message : undefined,
      },
      { status: 400, headers: getSecurityHeaders() },
    )
  }

  // Optional: Add specific validation for fields in updateData here using Zod or manual checks
  // e.g., validate orderStatus, paymentStatus against allowed enum values from payload-types.ts

  try {
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: orderId,
      data: updateData,
      // Consider adding user to data if lastModifiedBy is to be automatically set by system
      // user: req.user, // if using requireAuth middleware that provides user
    })

    return NextResponse.json(
      { success: true, data: updatedOrder, message: 'Order updated successfully.' },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    const err = error as PayloadError
    payload.logger.error({ msg: `Error updating order ${orderId}`, updateData, err })
    let userMessage = 'Failed to update order.'
     if (err.status === 404) {
      userMessage = 'Order not found.'
    } else if (err.data && err.data[0]?.message) {
      userMessage = `Validation Error: ${err.data[0].message} for field ${err.data[0].field}`
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
}

export async function DELETE(
  request: NextRequest, // request might be unused if no auth or specific headers needed
  { params }: { params: { id: string } },
) {
  const payload = await getPayload({ config })
  const orderId = parseInt(params.id, 10)

  if (isNaN(orderId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid order ID format.' },
      { status: 400, headers: getSecurityHeaders() },
    )
  }

  try {
    await payload.delete({
      collection: 'orders',
      id: orderId,
    })

    return NextResponse.json(
      { success: true, message: 'Order deleted successfully.' },
      { status: 200, headers: getSecurityHeaders() }, // Or 204 No Content if preferred
    )
  } catch (error) {
    const err = error as PayloadError
    payload.logger.error({ msg: `Error deleting order ${orderId}`, err })
    let userMessage = 'Failed to delete order.'
    if (err.status === 404) { // Payload typically returns 404 if not found
        userMessage = 'Order not found.'
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
}
