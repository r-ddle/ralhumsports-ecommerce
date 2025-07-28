import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['productName', 'sku', 'currentStock', 'lowStockAlert', 'location'],
    group: 'Business',
    description: 'Track inventory levels and stock movements',
    listSearchableFields: ['productName', 'sku', 'location'],
    pagination: {
      defaultLimit: 50,
    },
  },
  access: {
    create: isAdminOrProductManager,
    read: isAdminOrProductManager,
    update: isAdminOrProductManager,
    delete: isAdmin,
  },
  fields: [
    // Product Reference at root level
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      admin: {
        description: 'Select the product',
        allowCreate: false,
      },
    },
    {
      name: 'productName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Product name (auto-filled)',
      },
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Product SKU (auto-filled)',
      },
    },

    // Additional Product Info
    {
      name: 'productInfo',
      type: 'group',
      label: '📦 Additional Product Information',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showAdvanced),
      },
      fields: [
        {
          name: 'variantId',
          type: 'text',
          admin: {
            description: 'Variant ID if tracking variant inventory',
          },
        },
      ],
    },

    // Stock Information
    {
      name: 'stockInfo',
      type: 'group',
      label: '📊 Stock Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'currentStock',
              type: 'number',
              required: true,
              defaultValue: 0,
              admin: {
                description: 'Current stock level',
                step: 1,
                width: '33%',
              },
              min: 0,
            },
            {
              name: 'reservedStock',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Reserved stock',
                step: 1,
                readOnly: true,
                width: '33%',
              },
              min: 0,
            },
            {
              name: 'availableStock',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Available stock',
                step: 1,
                readOnly: true,
                width: '34%',
              },
              min: 0,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'lowStockThreshold',
              type: 'number',
              defaultValue: 5,
              admin: {
                description: 'Low stock alert threshold',
                step: 1,
                width: '50%',
              },
              min: 0,
            },
            {
              name: 'lowStockAlert',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '🚨 Low stock alert active',
                readOnly: true,
                width: '50%',
              },
            },
          ],
        },
      ],
    },

    // Location and Storage
    {
      name: 'storage',
      type: 'group',
      label: '📍 Storage Location',
      fields: [
        {
          name: 'location',
          type: 'select',
          defaultValue: 'main-warehouse',
          options: [
            { label: '🏢 Main Warehouse', value: 'main-warehouse' },
            { label: '🏪 Store Front', value: 'store-front' },
            { label: '📦 Secondary Storage', value: 'secondary-storage' },
            { label: '🚚 Supplier', value: 'supplier' },
            { label: '🔄 In Transit', value: 'in-transit' },
          ],
          admin: {
            description: 'Storage location',
          },
        },
        {
          name: 'binLocation',
          type: 'text',
          admin: {
            description: 'Specific bin or shelf location',
            placeholder: 'A1-B2, Shelf 3, etc.',
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

    // Cost Information (Advanced)
    {
      name: 'costInfo',
      type: 'group',
      label: '💰 Cost Information',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'costPrice',
          type: 'number',
          admin: {
            description: 'Cost price per unit',
            step: 0.01,
          },
          access: {
            read: isAdmin,
            update: isAdmin,
          },
        },
        {
          name: 'totalValue',
          type: 'number',
          admin: {
            description: 'Total inventory value (cost × quantity)',
            step: 0.01,
            readOnly: true,
          },
          access: {
            read: isAdmin,
            update: isAdmin,
          },
        },
      ],
    },

    // Stock Movement Tracking (Advanced)
    {
      name: 'movements',
      type: 'group',
      label: '📈 Stock Movements',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'lastStockIn',
              type: 'date',
              admin: {
                description: 'Last stock received',
                readOnly: true,
                width: '50%',
              },
            },
            {
              name: 'lastStockOut',
              type: 'date',
              admin: {
                description: 'Last stock sold/removed',
                readOnly: true,
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'lastUpdated',
          type: 'date',
          admin: {
            description: 'Last inventory update',
            readOnly: true,
          },
        },
      ],
    },

    // Supplier Information (Advanced)
    {
      name: 'supplierInfo',
      type: 'group',
      label: '🏭 Supplier Information',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'supplier',
          type: 'text',
          admin: {
            description: 'Primary supplier name',
          },
        },
        {
          name: 'supplierSku',
          type: 'text',
          admin: {
            description: 'Supplier SKU/part number',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'leadTime',
              type: 'number',
              admin: {
                description: 'Lead time (days)',
                step: 1,
                width: '33%',
              },
            },
            {
              name: 'reorderPoint',
              type: 'number',
              admin: {
                description: 'Reorder point',
                step: 1,
                width: '33%',
              },
            },
            {
              name: 'reorderQuantity',
              type: 'number',
              admin: {
                description: 'Reorder quantity',
                step: 1,
                width: '34%',
              },
            },
          ],
        },
      ],
    },

    // Status and Notes
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '✅ Active', value: 'active' },
        { label: '⏸️ Inactive', value: 'inactive' },
        { label: '🚫 Discontinued', value: 'discontinued' },
        { label: '⏳ On Hold', value: 'on-hold' },
      ],
      admin: {
        description: 'Inventory status',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal inventory notes',
        condition: (_, siblingData) => siblingData?.showAdvanced,
        rows: 3,
      },
    },

    // Audit Fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        position: 'sidebar',
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
        position: 'sidebar',
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
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        if (operation === 'update') {
          data.lastModifiedBy = req.user?.id
          data.lastUpdated = new Date()
        }

        // Calculate available stock
        data.availableStock = (data.currentStock || 0) - (data.reservedStock || 0)

        // Set low stock alert
        data.lowStockAlert = (data.currentStock || 0) <= (data.lowStockThreshold || 0)

        // Calculate total value if cost price is available
        if (data.costPrice && data.currentStock) {
          data.totalValue = data.costPrice * data.currentStock
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc, previousDoc }) => {
        if (operation === 'create') {
          req.payload.logger.info(`Inventory created: ${doc.productName} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Inventory updated: ${doc.productName} by ${req.user?.email}`)

          // Log stock changes
          if (previousDoc && previousDoc.currentStock !== doc.currentStock) {
            req.payload.logger.info(
              `Stock updated for ${doc.productName}: ${previousDoc.currentStock} → ${doc.currentStock}`,
            )
          }

          // Alert on low stock
          if (doc.lowStockAlert && (!previousDoc || !previousDoc.lowStockAlert)) {
            req.payload.logger.warn(
              `Low stock alert: ${doc.productName} (${doc.sku}) - ${doc.currentStock} remaining`,
            )
          }
        }
      },
    ],
  },
}
