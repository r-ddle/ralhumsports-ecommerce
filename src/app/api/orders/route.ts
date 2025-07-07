import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { requireAdminOrManager } from '@/lib/auth'
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit'
import { filterOrderData, getSecurityHeaders } from '@/lib/response-filter'

// Define PayloadError type for error narrowing

// GET /api/orders - List orders (admin/manager only, with rate limiting)
export const GET = withRateLimit(
  rateLimitConfigs.moderate,
  requireAdminOrManager(async (request: NextRequest, auth) => {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const status = searchParams.get('status')
      const customerEmail = searchParams.get('customerEmail')

      const payload = await getPayload({ config })

      // Build where conditions
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

      const result = await payload.find({
        collection: 'orders',
        where: whereConditions,
        page,
        limit: Math.min(limit, 100), // Limit max results
        sort: '-createdAt', // Newest first
      })

      // Filter sensitive data based on user permissions
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
        { headers: getSecurityHeaders() },
      )
    } catch (error) {
      console.error('Get orders error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch orders' },
        { status: 500, headers: getSecurityHeaders() },
      )
    }
  }),
)
