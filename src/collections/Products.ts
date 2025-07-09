import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'
import { hasAvailableStock, getProductStatus } from '@/lib/product-utils'

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
    // Public read access for e-commerce - anyone can view products
    read: () => true,
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
      required: false,
      defaultValue: 0,
      admin: {
        description: 'Available stock quantity (only used when no variants are defined)',
        step: 1,
        condition: (data: any) => {
          // Only show base stock field when there are no variants
          return !data.variants || data.variants.length === 0
        },
      },
      min: 0,
      validate: (value: any, { data }: any) => {
        // If variants exist, base stock is not required
        if (data.variants && data.variants.length > 0) {
          return true
        }
        // If no variants, base stock is required
        if (value === undefined || value === null || value < 0) {
          return 'Stock is required when no variants are defined'
        }
        return true
      },
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
      required: false,
      admin: {
        description:
          'Product variants (e.g., different sizes/colors with individual inventory tracking). Leave empty to use base stock instead.',
      },
      fields: [
        { name: 'name', type: 'text', required: true, admin: { placeholder: 'e.g. Large / Red' } },
        {
          name: 'sku',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            description: 'Auto-generated variant SKU',
            placeholder: 'auto-generated if empty',
          },
          hooks: {
            beforeValidate: [
              ({ value, siblingData, operation }) => {
                if ((operation === 'create' || operation === 'update') && !value) {
                  // Generate variant SKU if not provided
                  const timestamp = Date.now().toString().slice(-6)
                  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
                  const size = siblingData?.size ? `-${siblingData.size}` : ''
                  const color = siblingData?.color ? `-${siblingData.color}` : ''
                  return `RSV-${timestamp}-${random}${size}${color}`
                }
                return value
              },
            ],
          },
        },
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
      validate: (value: any, { data }: any) => {
        const hasVariants = value && Array.isArray(value) && value.length > 0
        const hasBaseStock = data.stock !== undefined && data.stock !== null && data.stock >= 0

        // Must have either variants OR base stock, but not both
        if (!hasVariants && !hasBaseStock) {
          return 'Product must have either variants with inventory OR base stock'
        }

        if (hasVariants && hasBaseStock && data.stock > 0) {
          return 'Product cannot have both variants and base stock. Use variants for inventory tracking or base stock for simple products.'
        }

        return true
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

        // Helper function to check if product has available stock
        const hasStock = hasAvailableStock(data)

        // Auto-set out of stock status based on actual availability
        if (data.status === 'active' && !hasStock) {
          data.status = 'out-of-stock'
        }
        // Auto-set active status if stock becomes available and status was out-of-stock
        else if (data.status === 'out-of-stock' && hasStock) {
          data.status = 'active'
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

          // Log stock changes (base stock or variants)
          if (previousDoc && previousDoc.stock !== doc.stock) {
            req.payload.logger.info(
              `Base stock updated for ${doc.name}: ${previousDoc.stock} → ${doc.stock}`,
            )
          }

          // Check for variant stock changes
          if (previousDoc && previousDoc.variants && doc.variants) {
            const prevVariants = previousDoc.variants || []
            const currVariants = doc.variants || []

            currVariants.forEach((variant: any, index: number) => {
              const prevVariant = prevVariants[index]
              if (prevVariant && prevVariant.inventory !== variant.inventory) {
                req.payload.logger.info(
                  `Variant stock updated for ${doc.name} (${variant.name}): ${prevVariant.inventory || 0} → ${variant.inventory || 0}`,
                )
              }
            })
          }

          // Alert on low stock (check both base stock and variants)
          const currentAvailability = hasAvailableStock(doc)
          const lowStockThreshold = doc.pricing?.lowStockThreshold || 5

          if (doc.variants && Array.isArray(doc.variants) && doc.variants.length > 0) {
            // Check each variant for low stock
            doc.variants.forEach((variant: any) => {
              if (variant.inventory <= lowStockThreshold && variant.inventory > 0) {
                req.payload.logger.warn(
                  `Low variant stock alert: ${doc.name} (${variant.name}) - ${variant.inventory} remaining`,
                )
              }
            })
          } else if (doc.stock <= lowStockThreshold && doc.stock > 0) {
            // Check base stock for low stock
            req.payload.logger.warn(
              `Low stock alert: ${doc.name} (${doc.sku}) - ${doc.stock} remaining`,
            )
          }

          // Status change based on actual availability
          const previousAvailability = previousDoc ? hasAvailableStock(previousDoc) : true
          if (previousAvailability && !currentAvailability && doc.status === 'active') {
            // Product went out of stock
            await req.payload.update({
              collection: 'products',
              id: doc.id,
              data: { status: 'out-of-stock' },
            })
            req.payload.logger.info(
              `Product status changed to out-of-stock: ${doc.name} (${doc.sku}) - no available inventory`,
            )
          } else if (
            !previousAvailability &&
            currentAvailability &&
            doc.status === 'out-of-stock'
          ) {
            // Product came back in stock
            await req.payload.update({
              collection: 'products',
              id: doc.id,
              data: { status: 'active' },
            })
            req.payload.logger.info(
              `Product status changed to active: ${doc.name} (${doc.sku}) - inventory available`,
            )
          }
        }

        // Update category product count
        const updateCategoryCount = async (categoryId: number | string) => {
          try {
            // Count active products in this category
            const productCount = await req.payload.count({
              collection: 'products',
              where: {
                and: [{ category: { equals: categoryId } }, { status: { equals: 'active' } }],
              },
            })

            // Update the category with the new count
            await req.payload.update({
              collection: 'categories',
              id: categoryId,
              data: {
                productCount: productCount.totalDocs,
              },
            })

            req.payload.logger.info(
              `Updated category ${categoryId} product count: ${productCount.totalDocs}`,
            )
          } catch (error) {
            req.payload.logger.error(`Failed to update category product count: ${error}`)
          }
        }

        // Update brand product count
        const updateBrandCount = async (brandId: number | string) => {
          try {
            // Count active products for this brand
            const productCount = await req.payload.count({
              collection: 'products',
              where: {
                and: [{ brand: { equals: brandId } }, { status: { equals: 'active' } }],
              },
            })

            // Update the brand with the new count
            await req.payload.update({
              collection: 'brands',
              id: brandId,
              data: {
                productCount: productCount.totalDocs,
              },
            })

            req.payload.logger.info(
              `Updated brand ${brandId} product count: ${productCount.totalDocs}`,
            )
          } catch (error) {
            req.payload.logger.error(`Failed to update brand product count: ${error}`)
          }
        }

        // Handle product count updates based on operation
        if (operation === 'create' && doc.status === 'active') {
          // New active product - update counts
          if (doc.category) {
            const categoryId = typeof doc.category === 'object' ? doc.category.id : doc.category
            await updateCategoryCount(categoryId)
          }
          if (doc.brand) {
            const brandId = typeof doc.brand === 'object' ? doc.brand.id : doc.brand
            await updateBrandCount(brandId)
          }
        } else if (operation === 'update') {
          // Handle category changes
          const prevCategoryId = previousDoc?.category
            ? typeof previousDoc.category === 'object'
              ? previousDoc.category.id
              : previousDoc.category
            : null
          const currCategoryId = doc.category
            ? typeof doc.category === 'object'
              ? doc.category.id
              : doc.category
            : null

          // If category changed, update both old and new
          if (prevCategoryId !== currCategoryId) {
            if (prevCategoryId) {
              await updateCategoryCount(prevCategoryId)
            }
            if (currCategoryId) {
              await updateCategoryCount(currCategoryId)
            }
          } else if (currCategoryId && previousDoc?.status !== doc.status) {
            // Status changed but category didn't - update count
            await updateCategoryCount(currCategoryId)
          }

          // Handle brand changes
          const prevBrandId = previousDoc?.brand
            ? typeof previousDoc.brand === 'object'
              ? previousDoc.brand.id
              : previousDoc.brand
            : null
          const currBrandId = doc.brand
            ? typeof doc.brand === 'object'
              ? doc.brand.id
              : doc.brand
            : null

          // If brand changed, update both old and new
          if (prevBrandId !== currBrandId) {
            if (prevBrandId) {
              await updateBrandCount(prevBrandId)
            }
            if (currBrandId) {
              await updateBrandCount(currBrandId)
            }
          } else if (currBrandId && previousDoc?.status !== doc.status) {
            // Status changed but brand didn't - update count
            await updateBrandCount(currBrandId)
          }
        }
      },

      // Also add to afterDelete hook to update counts when products are deleted
      async ({ req, doc }) => {
        // Log product deletion
        req.payload.logger.warn(`Product deleted: ${doc.name} (${doc.sku}) by ${req.user?.email}`)

        // Update category count after deletion
        if (doc.category && doc.status === 'active') {
          const categoryId = typeof doc.category === 'object' ? doc.category.id : doc.category
          try {
            const productCount = await req.payload.count({
              collection: 'products',
              where: {
                and: [{ category: { equals: categoryId } }, { status: { equals: 'active' } }],
              },
            })

            await req.payload.update({
              collection: 'categories',
              id: categoryId,
              data: {
                productCount: productCount.totalDocs,
              },
            })
          } catch (error) {
            req.payload.logger.error(`Failed to update category count after deletion: ${error}`)
          }
        }

        // Update brand count after deletion
        if (doc.brand && doc.status === 'active') {
          const brandId = typeof doc.brand === 'object' ? doc.brand.id : doc.brand
          try {
            const productCount = await req.payload.count({
              collection: 'products',
              where: {
                and: [{ brand: { equals: brandId } }, { status: { equals: 'active' } }],
              },
            })

            await req.payload.update({
              collection: 'brands',
              id: brandId,
              data: {
                productCount: productCount.totalDocs,
              },
            })
          } catch (error) {
            req.payload.logger.error(`Failed to update brand count after deletion: ${error}`)
          }
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
