import type { CollectionConfig } from 'payload'
import { isAdmin } from './Users'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'orderTotal', 'orderStatus', 'createdAt'],
    group: 'Business',
    description: 'Manage customer orders and fulfillment',
    listSearchableFields: ['orderNumber', 'customerName', 'customerPhone'],
    pagination: {
      defaultLimit: 25,
    },
  },
  access: {
    create: () => true, // Allow public order creation
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // Auto-generated Order Number
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated order identifier',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && !data?.orderNumber) {
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
      name: 'customer',
      type: 'group',
      label: '👤 Customer Information',
      fields: [
        {
          name: 'customerName',
          type: 'text',
          required: true,
          admin: {
            description: 'Customer full name',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'customerPhone',
              type: 'text',
              required: true,
              admin: {
                description: 'Primary phone number',
                width: '50%',
              },
            },
            {
              name: 'customerEmail',
              type: 'email',
              admin: {
                description: 'Email address (optional)',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'deliveryAddress',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Complete delivery address',
            rows: 3,
          },
        },
      ],
    },

    // Order Items
    {
      name: 'orderItems',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: '📦 Order Items',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'productName',
              type: 'text',
              required: true,
              admin: {
                description: 'Product name',
                width: '60%',
              },
            },
            {
              name: 'quantity',
              type: 'number',
              required: true,
              defaultValue: 1,
              min: 1,
              admin: {
                description: 'Qty',
                width: '20%',
              },
            },
            {
              name: 'unitPrice',
              type: 'number',
              required: true,
              admin: {
                description: 'Unit price',
                step: 0.01,
                width: '20%',
              },
            },
          ],
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Item subtotal (auto-calculated)',
            readOnly: true,
            step: 0.01,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'selectedVariant',
              type: 'relationship',
              relationTo: 'products',
              admin: {
                description: 'Select product variant (if applicable)',
                width: '66%',
              },
            },
            {
              name: 'productSku',
              type: 'text',
              admin: {
                description: 'SKU',
                width: '34%',
              },
            },
          ],
        },

        // Variant details denormalized for UI and record
        {
          name: 'variantDetails',
          type: 'group',
          admin: {
            description: 'Variant details copied from selected variant',
            readOnly: true,
          },
          fields: [
            { name: 'size', type: 'text' },
            { name: 'color', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'price', type: 'number' },
            { name: 'sku', type: 'text' },
          ],
        },
      ],
    },

    // Order Summary
    {
      name: 'orderSummary',
      type: 'group',
      label: '💰 Order Summary',
      fields: [
        {
          name: 'orderTotal',
          type: 'number',
          required: true,
          admin: {
            description: 'Total order amount (LKR)',
            readOnly: true,
            step: 0.01,
          },
        },
      ],
    },

    // Order Status
    {
      name: 'status',
      type: 'group',
      label: '📋 Order Status',
      fields: [
        {
          name: 'orderStatus',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: '⏳ Pending', value: 'pending' },
            { label: '✅ Confirmed', value: 'confirmed' },
            { label: '📦 Processing', value: 'processing' },
            { label: '🚚 Shipped', value: 'shipped' },
            { label: '✅ Delivered', value: 'delivered' },
            { label: '❌ Cancelled', value: 'cancelled' },
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
            { label: '⏳ Pending', value: 'pending' },
            { label: '✅ Paid', value: 'paid' },
            { label: '💰 Partially Paid', value: 'partially-paid' },
            { label: '❌ Failed', value: 'failed' },
            { label: '🔄 Refunded', value: 'refunded' },
          ],
          admin: {
            description: 'Payment status',
          },
        },
      ],
    },

    // Advanced Settings Toggle
    {
      name: 'showAdvanced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: '🔧 Show advanced settings',
        position: 'sidebar',
      },
    },

    // Advanced Order Details
    {
      name: 'orderDetails',
      type: 'group',
      label: '📋 Order Details',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'specialInstructions',
          type: 'textarea',
          admin: {
            description: 'Special delivery instructions',
            rows: 2,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'paymentMethod',
              type: 'select',
              options: [
                { label: '💵 Cash on Delivery', value: 'cod' },
                { label: '🏦 Bank Transfer', value: 'bank-transfer' },
                { label: '💳 Online Payment', value: 'online-payment' },
                { label: '💳 Card Payment', value: 'card-payment' },
              ],
              admin: {
                description: 'Payment method',
                width: '50%',
              },
            },
            {
              name: 'orderSource',
              type: 'select',
              defaultValue: 'website',
              options: [
                { label: '🌐 Website', value: 'website' },
                { label: '📱 WhatsApp', value: 'whatsapp' },
                { label: '📞 Phone', value: 'phone' },
                { label: '🏪 Store', value: 'store' },
                { label: '📱 Social Media', value: 'social' },
              ],
              admin: {
                description: 'Order source',
                width: '50%',
              },
            },
          ],
        },
      ],
    },

    // Pricing Breakdown (Advanced)
    {
      name: 'pricing',
      type: 'group',
      label: '💰 Pricing Breakdown',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'orderSubtotal',
              type: 'number',
              admin: {
                description: 'Subtotal',
                readOnly: true,
                step: 0.01,
                width: '25%',
              },
            },
            {
              name: 'tax',
              type: 'number',
              admin: {
                description: 'Tax',
                readOnly: true,
                step: 0.01,
                width: '25%',
              },
            },
            {
              name: 'shippingCost',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Shipping',
                step: 0.01,
                width: '25%',
              },
            },
            {
              name: 'discount',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Discount',
                step: 0.01,
                width: '25%',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'paymentGateway',
      type: 'group',
      label: '💳 Payment Gateway Details',
      admin: {
        condition: (data: Partial<any>) => data.orderDetails?.paymentMethod === 'online-payment',
      },
      fields: [
        {
          name: 'paymentId',
          label: 'Payment ID (from Gateway)',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'statusCode',
          label: 'Gateway Status Code',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'gatewayResponse',
          label: 'Full Gateway Response',
          type: 'json',
          admin: {
            readOnly: true,
            description: 'The full JSON response from the payment gateway for debugging.',
          },
        },
      ],
    },

    // WhatsApp Integration (Advanced)
    {
      name: 'whatsapp',
      type: 'group',
      label: '📱 WhatsApp Integration',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'messageSent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Confirmation message sent',
          },
        },
        {
          name: 'messageTimestamp',
          type: 'date',
          admin: {
            description: 'Message sent at',
            readOnly: true,
          },
        },
        {
          name: 'messageTemplate',
          type: 'select',
          options: [
            { label: 'Order Confirmation', value: 'order-confirmation' },
            { label: 'Order Update', value: 'order-update' },
            { label: 'Shipping Notification', value: 'shipping-notification' },
            { label: 'Delivery Confirmation', value: 'delivery-confirmation' },
          ],
          admin: {
            description: 'Message template used',
          },
        },
        {
          name: 'customerResponse',
          type: 'textarea',
          admin: {
            description: 'Customer response via WhatsApp',
            rows: 2,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data.orderItems) return data

        for (const item of data.orderItems) {
          if (item.selectedVariant) {
            const productId =
              typeof item.selectedVariant === 'string'
                ? item.selectedVariant
                : item.selectedVariant.id
            if (!productId) continue

            // Fetch product and variants
            const product = await req.payload.findByID({
              collection: 'products',
              id: productId,
              depth: 3, // ensure variants included
            })

            if (product?.variants?.length) {
              // Try to lookup variant that matches SKU if available
              const match = product.variants.find((v: any) => v.sku === item.productSku)

              if (match) {
                item.variantDetails = {
                  size: match.size || '',
                  color: match.color || '',
                  material: match.material || '',
                  price: match.price || product || 0,
                  sku: match.sku,
                }

                // Update subtotal based on variant price * quantity
                const qty = item.quantity ?? 1
                item.subtotal = (match.price ?? product.essentials.price ?? 0) * qty

                // Also set unit price as variant price for clarity
                item.unitPrice = match.price ?? product.essentials.price ?? 0
              }
            }
          }
        }

        return data
      },
    ],
  },
}
