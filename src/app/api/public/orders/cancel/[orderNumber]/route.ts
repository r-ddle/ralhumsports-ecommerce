import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getSecurityHeaders } from '@/lib/response-filter'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const { orderNumber } = await params
    const body = await request.json()
    const { action, customerId } = body

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    if (action !== 'cancel') {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Only "cancel" is supported.' },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    const payload = await getPayload({ config })

    console.log(`[Order Cancellation] Looking for order: ${orderNumber}, customer: ${customerId}`)

    // First, find the order to ensure it exists and belongs to the customer
    const orderResult = await payload.find({
      collection: 'orders',
      where: {
        and: [{ orderNumber: { equals: orderNumber } }, { customerId: { equals: customerId } }],
      },
      limit: 1,
    })

    console.log(`[Order Cancellation] Order search result:`, {
      found: orderResult.docs.length,
      orderNumbers: orderResult.docs.map((o) => o.orderNumber),
      customerIds: orderResult.docs.map((o) => o.customerId),
    })

    if (!orderResult.docs.length) {
      // Try searching without customer ID to see if order exists at all
      const orderCheck = await payload.find({
        collection: 'orders',
        where: { orderNumber: { equals: orderNumber } },
        limit: 1,
      })

      console.log(`[Order Cancellation] Order exists check:`, {
        exists: orderCheck.docs.length > 0,
        actualCustomerId: orderCheck.docs[0]?.customerId,
        providedCustomerId: customerId,
      })

      return NextResponse.json(
        { success: false, error: 'Order not found or access denied' },
        { status: 404, headers: getSecurityHeaders() },
      )
    }

    const order = orderResult.docs[0]

    // Check if order can be cancelled (only if payment is pending)
    const currentPaymentStatus = order.status?.paymentStatus || 'pending'
    const currentOrderStatus = order.status?.orderStatus || 'pending'

    if (currentPaymentStatus !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          error: 'Order cannot be cancelled. Payment has been processed.',
        },
        { status: 400, headers: getSecurityHeaders() },
      )
    }

    if (currentOrderStatus === 'cancelled') {
      console.log(
        `[Order Cancellation] Order ${orderNumber} is already cancelled - returning success`,
      )
      return NextResponse.json(
        {
          success: true,
          message: 'Order is already cancelled',
          data: {
            orderNumber: order.orderNumber,
            orderStatus: 'cancelled',
            cancelledAt: order.updatedAt,
            alreadyCancelled: true,
            // Don't clear cart and orders - just acknowledge cancellation
            clearCart: true,
            clearPendingOrders: false,
          },
        },
        { headers: getSecurityHeaders() },
      )
    }

    // Update order status to cancelled
    console.log(`[Order Cancellation] Updating order ${order.id} to cancelled status`)
    const updatedOrder = await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: {
          orderStatus: 'cancelled',
          paymentStatus: currentPaymentStatus, // Keep current payment status
        },
      },
    })
    console.log(`[Order Cancellation] Order updated successfully:`, updatedOrder.id)

    // Restore inventory for all order items
    console.log(`[Order Cancellation] Restoring inventory for order ${orderNumber}`)

    try {
      for (const orderItem of order.orderItems || []) {
        console.log(
          `[Order Cancellation] Processing order item:`,
          JSON.stringify(orderItem, null, 2),
        )

        const { selectedVariant, quantity, productSku, variantDetails } = orderItem

        if (!selectedVariant || !quantity) {
          console.warn(`[Order Cancellation] Skipping invalid order item:`, {
            selectedVariant,
            quantity,
            productSku,
            hasVariantDetails: !!variantDetails,
          })
          continue
        }

        try {
          // Extract product ID from selectedVariant (it's a relationship reference)
          let productId: string | number
          if (typeof selectedVariant === 'number') {
            productId = selectedVariant
          } else if (typeof selectedVariant === 'object' && selectedVariant?.id) {
            productId = selectedVariant.id
          } else {
            console.error(`[Order Cancellation] Invalid selectedVariant format:`, selectedVariant)
            continue
          }

          // Fetch the current product data
          const product = await payload.findByID({
            collection: 'products',
            id: productId,
          })

          if (!product) {
            console.error(`[Order Cancellation] Product not found: ${productId}`)
            continue
          }

          console.log(`[Order Cancellation] Restoring stock for product ${productId}:`, {
            hasVariants: Array.isArray(product.variants) && product.variants.length > 0,
            variantCount: product.variants?.length || 0,
            productSku,
            variantDetails,
            currentBaseStock: product.inventory?.stock,
          })

          // Restore stock based on whether product has variants or not
          if (Array.isArray(product.variants) && product.variants.length > 0 && productSku) {
            // Product has variants - restore specific variant stock by matching SKU
            console.log(
              `[Order Cancellation] Product ${productId} has variants, looking for SKU: ${productSku}`,
            )

            const updatedVariants = product.variants.map((variant) => {
              if (variant.sku === productSku) {
                const newStock = (variant.stock || 0) + quantity
                console.log(
                  `[Order Cancellation] Restoring variant stock for product ${productId}, SKU ${productSku}: ${variant.stock || 0} -> ${newStock}`,
                )
                return { ...variant, stock: newStock }
              }
              return variant
            })

            // Check if we found and updated the variant
            const variantFound = updatedVariants.some(
              (variant, index) =>
                variant.sku === productSku &&
                variant.stock !== (product.variants?.[index]?.stock || 0),
            )

            if (!variantFound) {
              console.warn(
                `[Order Cancellation] Variant with SKU ${productSku} not found in product ${productId}`,
              )
              continue
            }

            console.log(`[Order Cancellation] Updating product ${productId} with variants`)
            await payload.update({
              collection: 'products',
              id: productId,
              data: {
                variants: updatedVariants,
                // Update product status if it was out of stock and now has stock
                status:
                  updatedVariants.some((v) => (v.stock || 0) > 0) &&
                  product.status === 'out-of-stock'
                    ? 'active'
                    : product.status,
              },
            })
            console.log(`[Order Cancellation] Product ${productId} variants updated successfully`)
          } else if (!product.variants || product.variants.length === 0) {
            // No variants - restore base stock
            if (typeof product.inventory?.stock === 'number') {
              const newStock = product.inventory.stock + quantity
              console.log(
                `[Order Cancellation] Restoring base stock for product ${productId}: ${product.inventory.stock} -> ${newStock}`,
              )

              await payload.update({
                collection: 'products',
                id: productId,
                data: {
                  inventory: {
                    ...product.inventory,
                    stock: newStock,
                  },
                  // Update product status if it was out of stock
                  status:
                    newStock > 0 && product.status === 'out-of-stock' ? 'active' : product.status,
                },
              })
              console.log(
                `[Order Cancellation] Product ${productId} base stock updated successfully`,
              )
            } else {
              console.warn(`[Order Cancellation] Product ${productId} has no stock field to update`)
            }
          } else {
            console.warn(
              `[Order Cancellation] Product ${productId} has variants but no SKU provided for restoration`,
            )
          }
        } catch (productError) {
          console.error(
            `[Order Cancellation] Error restoring stock for product ${selectedVariant}:`,
            productError,
          )
          // Continue with other items even if one fails
        }
      }

      console.log(`[Order Cancellation] Inventory restoration completed for order ${orderNumber}`)
    } catch (inventoryError) {
      console.error(`[Order Cancellation] Error during inventory restoration:`, inventoryError)
      // Don't fail the cancellation if inventory restoration fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order cancelled successfully',
        data: {
          orderNumber: order.orderNumber,
          orderStatus: 'cancelled',
          cancelledAt: new Date().toISOString(),
          inventoryRestored: true,
          // Don't clear all pending orders - just update this specific order
          clearCart: false,
          clearPendingOrders: false,
        },
      },
      { headers: getSecurityHeaders() },
    )
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cancel order',
      },
      { status: 500, headers: getSecurityHeaders() },
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new Response(null, {
    status: 200,
    headers: getSecurityHeaders(origin || undefined),
  })
}
