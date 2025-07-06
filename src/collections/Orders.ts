import type { CollectionConfig } from 'payload'
import { isAdmin } from './Users'

// Define proper types for order calculations
interface OrderItemData {
  unitPrice?: number
  quantity?: number
  subtotal?: number
  productId?: string
  productName?: string
  productSku?: string
  selectedSize?: string
  selectedColor?: string
  [key: string]: string | number | undefined // ✅ Fix: More specific than any
}

interface OrderData {
  orderItems?: OrderItemData[]
  orderSubtotal?: number
  shippingCost?: number
  discount?: number
  orderTotal?: number
  whatsapp?: {
    messageSent?: boolean
    messageTimestamp?: string | Date
  }
  createdBy?: number
  lastModifiedBy?: number
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryAddress?: string
  orderStatus?: string
  paymentStatus?: string
  [key: string]: unknown // ✅ Fix: More specific than any
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: [
      'orderNumber',
      'customerName',
      'customerPhone',
      'orderTotal',
      'orderStatus',
      'createdAt',
    ],
    group: 'Business',
    description: 'Manage customer orders and WhatsApp integration tracking',
    listSearchableFields: ['orderNumber', 'customerName', 'customerEmail', 'customerPhone'],
  },
  access: {
    // Admins and above can create orders (for manual order entry)
    create: isAdmin,
    // Admins and product managers can read orders, plus customers can read their own
    read: ({ req }) => {
      const user = req.user

      if (!user) {
        return false
      }

      // Admins and managers can read all orders
      if (['super-admin', 'admin', 'product-manager'].includes(user.role ? user.role : '')) {
        return true
      }

      // Other authenticated users can't read orders
      // (Customer order access should be handled via API with email/phone verification)
      return false
    },
    // Admins and above can update orders
    update: isAdmin,
    // Only admins can delete orders
    delete: isAdmin,
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order identifier',
        placeholder: 'auto-generated if empty',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && !data?.orderNumber) {
              // Generate order number: RS-YYYYMMDD-XXXXX
              const date = new Date()
              const dateStr =
                date.getFullYear().toString() +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                date.getDate().toString().padStart(2, '0')
              const random = Math.random().toString(36).substring(2, 7).toUpperCase()
              return `RS-${dateStr}-${random}`
            }
          },
        ],
      },
    },

    // Customer Information
    {
      name: 'customerName',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
        placeholder: 'Enter customer name',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
        placeholder: 'customer@example.com',
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer primary phone number for WhatsApp communication',
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'customerSecondaryPhone',
      type: 'text',
      admin: {
        description: 'Customer secondary phone number (optional)',
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'deliveryAddress',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Complete delivery address',
        placeholder: 'Street address, City, Postal Code',
      },
    },
    {
      name: 'specialInstructions',
      type: 'textarea',
      admin: {
        description: 'Special delivery instructions or customer notes',
        placeholder: 'Any special requirements or notes',
      },
    },

    // Order Items
    {
      name: 'orderItems',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Products in this order',
      },
      fields: [
        {
          name: 'productId',
          type: 'text',
          required: true,
          admin: {
            description: 'Product ID reference',
            placeholder: 'Enter product ID',
          },
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          admin: {
            description: 'Product name (for record keeping)',
            placeholder: 'Product name at time of order',
          },
        },
        {
          name: 'productSku',
          type: 'text',
          required: true,
          admin: {
            description: 'Product SKU (for record keeping)',
            placeholder: 'Product SKU at time of order',
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Price per unit in LKR',
            step: 0.01,
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
          admin: {
            description: 'Quantity ordered',
            step: 1,
          },
          min: 1,
        },
        {
          name: 'selectedSize',
          type: 'text',
          admin: {
            description: 'Selected size (if applicable)',
            placeholder: 'M, L, 42, etc.',
          },
        },
        {
          name: 'selectedColor',
          type: 'text',
          admin: {
            description: 'Selected color (if applicable)',
            placeholder: 'Black, Red, etc.',
          },
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Subtotal for this item (unit price × quantity)',
            step: 0.01,
            readOnly: true,
          },
        },
      ],
    },

    // Order Totals
    {
      name: 'orderSubtotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Order subtotal (before shipping and taxes)',
        step: 0.01,
        readOnly: true,
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Shipping cost in LKR',
        step: 0.01,
      },
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Discount amount in LKR',
        step: 0.01,
      },
    },
    {
      name: 'orderTotal',
      type: 'number',
      required: true,
      admin: {
        description: 'Final order total',
        step: 0.01,
        readOnly: true,
      },
    },

    // Order Status and Tracking
    {
      name: 'orderStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Current order status',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Partially Paid',
          value: 'partially-paid',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      admin: {
        description: 'Payment status',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        {
          label: 'Cash on Delivery',
          value: 'cod',
        },
        {
          label: 'Bank Transfer',
          value: 'bank-transfer',
        },
        {
          label: 'Online Payment',
          value: 'online-payment',
        },
        {
          label: 'Card Payment',
          value: 'card-payment',
        },
      ],
      admin: {
        description: 'Payment method chosen by customer',
      },
    },

    // WhatsApp Integration
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp Integration',
      fields: [
        {
          name: 'messageSent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'WhatsApp confirmation message sent to customer',
          },
        },
        {
          name: 'messageTimestamp',
          type: 'date',
          admin: {
            description: 'When the WhatsApp message was sent',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        {
          name: 'messageTemplate',
          type: 'select',
          options: [
            {
              label: 'Order Confirmation',
              value: 'order-confirmation',
            },
            {
              label: 'Order Update',
              value: 'order-update',
            },
            {
              label: 'Shipping Notification',
              value: 'shipping-notification',
            },
            {
              label: 'Delivery Confirmation',
              value: 'delivery-confirmation',
            },
          ],
          admin: {
            description: 'WhatsApp message template used',
          },
        },
        {
          name: 'customerResponse',
          type: 'textarea',
          admin: {
            description: 'Customer response or feedback via WhatsApp',
            placeholder: 'Record any customer responses or feedback',
          },
        },
      ],
    },

    // Shipping Information
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Information',
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
          admin: {
            description: 'Shipping tracking number',
            placeholder: 'Enter tracking number when shipped',
          },
        },
        {
          name: 'courier',
          type: 'select',
          options: [
            {
              label: 'Pronto Express',
              value: 'pronto',
            },
            {
              label: 'Kapruka',
              value: 'kapruka',
            },
            {
              label: 'DHL',
              value: 'dhl',
            },
            {
              label: 'FedEx',
              value: 'fedex',
            },
            {
              label: 'Local Delivery',
              value: 'local',
            },
            {
              label: 'Customer Pickup',
              value: 'pickup',
            },
          ],
          admin: {
            description: 'Courier service used for delivery',
          },
        },
        {
          name: 'estimatedDelivery',
          type: 'date',
          admin: {
            description: 'Estimated delivery date',
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'actualDelivery',
          type: 'date',
          admin: {
            description: 'Actual delivery date',
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
      ],
    },

    // Internal Notes
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes for team reference (not visible to customer)',
        placeholder: 'Add any internal notes or comments',
      },
      access: {
        read: isAdmin,
        update: isAdmin,
      },
    },

    // Source Information
    {
      name: 'orderSource',
      type: 'select',
      defaultValue: 'website',
      options: [
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'WhatsApp',
          value: 'whatsapp',
        },
        {
          label: 'Phone Call',
          value: 'phone',
        },
        {
          label: 'In Store',
          value: 'store',
        },
        {
          label: 'Social Media',
          value: 'social',
        },
      ],
      admin: {
        description: 'How the customer placed this order',
      },
    },

    // Auto-generated fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this order',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id
            }
          },
        ],
      },
    },
    {
      name: 'lastModifiedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who last modified this order',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'update' && req.user) {
              return req.user.id
            }
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, operation, data }) => {
        const typedData = data as OrderData

        // Set created/modified by
        if (operation === 'create') {
          typedData.createdBy = req.user?.id
        }
        if (operation === 'update') {
          typedData.lastModifiedBy = req.user?.id
        }

        // Calculate order totals with proper type checking
        if (typedData.orderItems && Array.isArray(typedData.orderItems)) {
          let subtotal = 0

          // Calculate subtotal for each item and overall subtotal
          typedData.orderItems.forEach((item) => {
            const unitPrice = item.unitPrice ?? 0
            const quantity = item.quantity ?? 0

            if (unitPrice >= 0 && quantity > 0) {
              item.subtotal = unitPrice * quantity
              subtotal += item.subtotal
            } else {
              item.subtotal = 0
            }
          })

          typedData.orderSubtotal = subtotal

          // Calculate final total with proper null checking
          const shipping = typedData.shippingCost ?? 0
          const discount = typedData.discount ?? 0
          typedData.orderTotal = Math.max(0, subtotal + shipping - discount)
        }

        // Set WhatsApp message timestamp when message is marked as sent
        if (typedData.whatsapp?.messageSent && !typedData.whatsapp?.messageTimestamp) {
          typedData.whatsapp.messageTimestamp = new Date()
        }

        return typedData
      },
    ],
    afterChange: [
      async ({ req, operation, doc, previousDoc }) => {
        // Log order operations
        if (operation === 'create') {
          req.payload.logger.info(
            `Order created: ${doc.orderNumber} for ${doc.customerName} (${doc.customerPhone})`,
          )

          // ---- START: Update Customer and Product Stats ----
          try {
            // Update Customer Statistics
            if (doc.customerEmail) {
              const customersResult = await req.payload.find({
                collection: 'customers',
                where: {
                  email: {
                    equals: doc.customerEmail,
                  },
                },
                limit: 1,
              })

              if (customersResult.docs.length > 0) {
                const customer = customersResult.docs[0]
                const currentTotalOrders = customer.orderStats?.totalOrders || 0
                const currentTotalSpent = customer.orderStats?.totalSpent || 0

                const customerUpdateData: Partial<typeof customer.orderStats> = {
                  totalOrders: currentTotalOrders + 1,
                  totalSpent: currentTotalSpent + (doc.orderTotal || 0),
                  lastOrderDate: doc.createdAt || new Date().toISOString(),
                }

                if (!customer.orderStats?.firstOrderDate) {
                  customerUpdateData.firstOrderDate = doc.createdAt || new Date().toISOString()
                }

                // Ensure orderStats object exists
                const updatedOrderStats = {
                  ...(customer.orderStats || {}),
                  ...customerUpdateData,
                }

                await req.payload.update({
                  collection: 'customers',
                  id: customer.id,
                  data: {
                    orderStats: updatedOrderStats,
                  },
                })
                req.payload.logger.info(
                  `Updated order stats for customer ${customer.email} (Order: ${doc.orderNumber})`,
                )
              } else {
                req.payload.logger.warn(
                  `Customer with email ${doc.customerEmail} not found for order ${doc.orderNumber}. Cannot update stats.`,
                )
              }
            } else {
              req.payload.logger.warn(
                `Order ${doc.orderNumber} does not have a customer email. Cannot update customer stats.`,
              )
            }

            // Update Product Stock and Order Count
            if (doc.orderItems && Array.isArray(doc.orderItems)) {
              for (const item of doc.orderItems) {
                if (item.productId && typeof item.productId === 'string') {
                  try {
                    const productResult = await req.payload.findByID({
                      collection: 'products',
                      id: item.productId,
                    })

                    if (productResult) {
                      const currentStock = productResult.stock || 0
                      const currentOrderCount = productResult.analytics?.orderCount || 0

                      // Ensure analytics object exists
                      const updatedAnalytics = {
                        ...(productResult.analytics || {}),
                        orderCount: currentOrderCount + 1,
                      }

                      await req.payload.update({
                        collection: 'products',
                        id: item.productId,
                        data: {
                          stock: currentStock - (item.quantity || 0),
                          analytics: updatedAnalytics,
                        },
                      })
                      req.payload.logger.info(
                        `Updated stock and order count for product ${item.productId} (Order: ${doc.orderNumber})`,
                      )
                    } else {
                      req.payload.logger.warn(
                        `Product with ID ${item.productId} not found for order ${doc.orderNumber}. Cannot update stock.`,
                      )
                    }
                  } catch (productError) {
                    req.payload.logger.error(
                      `Error updating product ${item.productId} for order ${doc.orderNumber}: ${productError instanceof Error ? productError.message : String(productError)}`,
                    )
                  }
                } else {
                  req.payload.logger.warn(
                    `OrderItem in order ${doc.orderNumber} has invalid productId. Skipping stock update.`,
                  )
                }
              }
            }
          } catch (error) {
            req.payload.logger.error(
              `Error updating customer/product stats for order ${doc.orderNumber}: ${error instanceof Error ? error.message : String(error)}`,
            )
          }
          // ---- END: Update Customer and Product Stats ----
        } else if (operation === 'update') {
          req.payload.logger.info(`Order updated: ${doc.orderNumber} by ${req.user?.email}`)

          // Log status changes
          if (previousDoc && previousDoc.orderStatus !== doc.orderStatus) {
            req.payload.logger.info(
              `Order status changed: ${doc.orderNumber} ${previousDoc.orderStatus} → ${doc.orderStatus}`,
            )
            // Potentially add logic here if an order is cancelled to revert stock, etc.
            // For now, we are only handling updates on creation.
          }

          // Log payment status changes
          if (previousDoc && previousDoc.paymentStatus !== doc.paymentStatus) {
            req.payload.logger.info(
              `Payment status changed: ${doc.orderNumber} ${previousDoc.paymentStatus} → ${doc.paymentStatus}`,
            )
          }
        }

        // Alert on high-value orders
        if (doc.orderTotal > 50000) {
          req.payload.logger.info(
            `High-value order alert: ${doc.orderNumber} - LKR ${doc.orderTotal}`,
          )
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // Log order deletion
        req.payload.logger.warn(`Order deleted: ${doc.orderNumber} by ${req.user?.email}`)
      },
    ],
  },
}
