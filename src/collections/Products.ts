import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'brand', 'price', 'stock', 'status'],
    group: 'Products',
    description: 'Manage product catalog with comprehensive details',
    listSearchableFields: ['name', 'sku', 'description'],
  },
  access: {
    // Product managers and above can create products
    create: isAdminOrProductManager,
    // All authenticated users can read products
    read: ({ req }) => Boolean(req.user),
    // Product managers and above can update products
    update: isAdminOrProductManager,
    // Only admins can delete products
    delete: isAdmin,
  },
  fields: [
    // Required Core Fields
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name as displayed to customers',
        placeholder: 'Enter product name (e.g., Nike Air Max Running Shoes)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the product name',
        placeholder: 'auto-generated from name',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' || operation === 'update') {
              if (data?.name) {
                // Generate slug from name
                return data.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
              }
            }
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: {
        description: 'Product category for organization',
      },
      filterOptions: {
        status: {
          equals: 'active',
        },
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
      admin: {
        description: 'Product brand',
      },
      filterOptions: {
        status: {
          equals: 'active',
        },
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Product price in LKR',
        placeholder: '5000.00',
        step: 0.01,
      },
      min: 0,
    },
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Stock Keeping Unit - unique product identifier',
        placeholder: 'auto-generated if empty',
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if (operation === 'create' && !data?.sku) {
              // Generate SKU if not provided
              const timestamp = Date.now().toString().slice(-6)
              const random = Math.random().toString(36).substring(2, 5).toUpperCase()
              return `RS-${timestamp}-${random}`
            }
          },
        ],
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Available stock quantity',
        step: 1,
      },
      min: 0,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      admin: {
        description: 'Product images (first image will be the main image)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            category: {
              equals: 'products',
            },
          },
        },
        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'Alternative text for this specific image',
            placeholder: 'Describe this product image',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Out of Stock',
          value: 'out-of-stock',
        },
        {
          label: 'Discontinued',
          value: 'discontinued',
        },
      ],
      admin: {
        description: 'Product availability status',
      },
    },

    // Optional Product Information
    // Removed 'sizes' and 'colors' fields; use variants array instead.,
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed product description with rich formatting',
      },
    },

    // SEO Fields
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title for product page',
            placeholder: 'Product Name - Brand | Ralhum Sports',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for product page',
            placeholder: 'Shop product name at Ralhum Sports. High-quality sports equipment...',
          },
        },
      ],
    },

    // Product Specifications Group
    {
      name: 'specifications',
      type: 'group',
      label: 'Product Specifications',
      fields: [
        {
          name: 'material',
          type: 'text',
          admin: {
            description: 'Primary material used',
            placeholder: 'Cotton, Polyester, Leather, etc.',
          },
        },
        {
          name: 'weight',
          type: 'text',
          admin: {
            description: 'Product weight',
            placeholder: '250g, 1.2kg, etc.',
          },
        },
        {
          name: 'dimensions',
          type: 'text',
          admin: {
            description: 'Product dimensions',
            placeholder: '30cm x 20cm x 10cm',
          },
        },
        {
          name: 'careInstructions',
          type: 'textarea',
          admin: {
            description: 'Care and maintenance instructions',
            placeholder: 'Machine wash cold, air dry...',
          },
        },
      ],
    },

    // Shipping Configuration
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping Configuration',
      fields: [
        {
          name: 'freeShipping',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Offer free shipping for this product',
          },
        },
        {
          name: 'islandWideDelivery',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Available for island-wide delivery',
          },
        },
        {
          name: 'easyReturn',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Eligible for easy return policy',
          },
        },
        {
          name: 'shippingWeight',
          type: 'number',
          admin: {
            description: 'Shipping weight in kg',
            placeholder: '0.5',
            step: 0.1,
          },
        },
      ],
    },

    // Pricing and Inventory
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing & Inventory',
      fields: [
        {
          name: 'originalPrice',
          type: 'number',
          admin: {
            description: 'Original price (for displaying discounts)',
            placeholder: '6000.00',
            step: 0.01,
          },
        },
        {
          name: 'costPrice',
          type: 'number',
          admin: {
            description: 'Cost price for profit calculations (admin only)',
            step: 0.01,
            condition: (_, { user }) => {
              return user && ['super-admin', 'admin'].includes(user.role)
            },
          },
          access: {
            read: isAdmin,
            update: isAdmin,
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Alert when stock falls below this number',
            step: 1,
          },
        },
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Track inventory for this product',
          },
        },
      ],
    },

    // Product Features and Tags
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'Key product features and selling points',
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Breathable fabric, Waterproof, Lightweight',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Product tags for search and filtering (comma separated)',
        placeholder: 'running, outdoor, breathable, comfortable',
      },
    },

    // Related Products and Variants
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Select related products (shown as recommendations)',
        placeholder: 'Choose related products',
      },
      filterOptions: {
        status: {
          equals: 'active',
        },
      },
    },

    // Product Analytics and Metrics
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics',
      fields: [
        {
          name: 'orderCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of times ordered',
          },
        },
      ],
    },

    {
      name: 'variants',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Product variants (e.g., different sizes/colors, inventory tracking)',
      },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { placeholder: 'e.g. Large / Red' } },
        { name: 'sku', type: 'text', required: true, unique: true },
        { name: 'size', type: 'text', admin: { placeholder: 'e.g. L, XL, 42' } },
        { name: 'color', type: 'text', admin: { placeholder: 'e.g. Red, Blue' } },
        { name: 'price', type: 'number', required: true, min: 0 },
        {
          name: 'inventory',
          type: 'number',
          required: true,
          min: 0,
          admin: { description: 'Stock for this variant' },
        },
      ],
      hooks: {
        beforeValidate: [
          ({ value, siblingData, operation }) => {
            if ((operation === 'create' || operation === 'update') && !value) {
              const timestamp = Date.now().toString().slice(-6)
              const random = Math.random().toString(36).substring(2, 5).toUpperCase()
              const size = siblingData?.size ? `-${siblingData.size}` : ''
              const color = siblingData?.color ? `-${siblingData.color}` : ''
              return `RS-${timestamp}-${random}${size}${color}`
            }
            return value
          },
        ],
      },
    },

    // Automatic Fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this product',
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
        description: 'User who last modified this product',
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
        // Set created/modified by
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        if (operation === 'update') {
          data.lastModifiedBy = req.user?.id
        }

        // Auto-set out of stock status if stock is 0
        if (data.stock === 0 && data.status === 'active') {
          data.status = 'out-of-stock'
        }

        // Validate pricing
        if (data.originalPrice && data.price && data.originalPrice < data.price) {
          throw new Error('Original price cannot be less than current price')
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc, previousDoc }) => {
        // Log product operations
        if (operation === 'create') {
          req.payload.logger.info(`Product created: ${doc.name} (${doc.sku}) by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Product updated: ${doc.name} (${doc.sku}) by ${req.user?.email}`)

          // Log stock changes
          if (previousDoc && previousDoc.stock !== doc.stock) {
            req.payload.logger.info(
              `Stock updated for ${doc.name}: ${previousDoc.stock} → ${doc.stock}`,
            )
          }

          // Alert on low stock
          if (doc.stock <= doc.pricing?.lowStockThreshold && doc.status === 'active') {
            req.payload.logger.warn(
              `Low stock alert: ${doc.name} (${doc.sku}) - ${doc.stock} remaining`,
            )
          }

          // Status change if stock is 0
          if (previousDoc && previousDoc.stock > 0 && doc.stock === 0) {
            doc.status = 'out-of-stock'
            req.payload.logger.info(
              `Product status changed to out-of-stock: ${doc.name} (${doc.sku})`,
            )
          }
        }

        // Update category and brand product counts
        if (operation === 'create' || (operation === 'update' && doc.status === 'active')) {
          // Update category product count
          if (doc.category) {
            try {
              const _category = await req.payload.findByID({
                collection: 'categories',
                id: typeof doc.category === 'object' ? doc.category.id : doc.category,
              })

              // Update category product count logic would go here
              // Simplified for now due to TypeScript constraints
            } catch (error) {
              req.payload.logger.error(`Failed to update category product count: ${error}`)
            }
          }

          // Update brand product count logic would go here
          // Simplified for now due to TypeScript constraints
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // Log product deletion
        req.payload.logger.warn(`Product deleted: ${doc.name} (${doc.sku}) by ${req.user?.email}`)
      },
    ],
  },
}
