import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'
import { hasAvailableStock } from '@/lib/product-utils'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'sportsCategory', 'sports', 'sportsItem', 'price', 'status'],
    group: 'Catalog',
    description: 'Manage your product catalog with three-tier categorization',
    listSearchableFields: ['name', 'sku', 'description'],
    pagination: {
      defaultLimit: 25,
    },
  },
  access: {
    create: isAdminOrProductManager,
    read: () => true,
    update: isAdminOrProductManager,
    delete: isAdmin,
  },
  fields: [
    // Essential Product Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Product name as shown to customers',
        placeholder: 'Enter descriptive product name',
      },
      validate: (value: string | string[] | null | undefined) => {
        if (Array.isArray(value)) {
          if (value.length === 0 || value.some((v) => !v || v.length < 3)) {
            return 'Product name must be at least 3 characters long'
          }
        } else {
          if (!value || value.length < 3) {
            return 'Product name must be at least 3 characters long'
          }
        }
        return true
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: true,
      admin: {
        condition: () => false, // Hide from admin UI
      },
      hooks: {
        beforeValidate: [
          ({ data, operation }) => {
            if ((operation === 'create' || operation === 'update') && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
          },
        ],
      },
    },

    // Three-Tier Category System
    {
      name: 'categorySelection',
      type: 'group',
      label: '🏷️ Product Categories',
      fields: [
        {
          name: 'sportsCategory',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: {
            description: '🏆 Select Sports Category (Level 1)',
            allowCreate: false,
          },
          filterOptions: {
            type: { equals: 'sports-category' },
            status: { equals: 'active' },
          },
        },
        {
          name: 'sports',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: {
            description: '⚽ Select Sports (Level 2)',
            // FIX: Access the field via the group name 'categorySelection'
            condition: (data) => !!data.categorySelection?.sportsCategory,
            allowCreate: false,
          },
          // FIX: Access the field via the group name 'categorySelection'
          filterOptions: ({ data }) => ({
            type: { equals: 'sports' },
            status: { equals: 'active' },
            parentCategory: { equals: data.categorySelection?.sportsCategory },
          }),
        },
        {
          name: 'sportsItem',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: {
            description: '👕 Select Sports Item (Level 3)',
            // FIX: Access the field via the group name 'categorySelection'
            condition: (data) => !!data.categorySelection?.sports,
            allowCreate: false,
          },
          // FIX: Access the field via the group name 'categorySelection'
          filterOptions: ({ data }) => ({
            type: { equals: 'sports-item' },
            status: { equals: 'active' },
            parentCategory: { equals: data.categorySelection?.sports },
          }),
        },
      ],
    },

    // Brand and Pricing
    {
      name: 'essentials',
      type: 'group',
      label: '💰 Essential Details',
      fields: [
        {
          name: 'brand',
          type: 'relationship',
          relationTo: 'brands',
          required: true,
          admin: {
            description: 'Product brand',
            allowCreate: false,
          },
          filterOptions: {
            status: { equals: 'active' },
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          admin: {
            description: 'Product price (LKR)',
            step: 0.01,
          },
          min: 0,
          validate: (value: number | number[] | null | undefined) => {
            if (Array.isArray(value)) {
              if (
                value.length === 0 ||
                value.some((v) => v === undefined || v === null || v <= 0)
              ) {
                return 'Price must be greater than 0'
              }
            } else {
              if (value === undefined || value === null || value <= 0) {
                return 'Price must be greater than 0'
              }
            }
            return true
          },
        },
      ],
    },

    // Product Images
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      admin: {
        description: '📸 Product images (first image is the main image)',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          filterOptions: {
            category: { equals: 'products' },
          },
        },
        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'Image description (auto-generated if empty)',
          },
          hooks: {
            beforeValidate: [
              ({ data, siblingData }) => {
                if (!data && siblingData?.image && typeof siblingData.image === 'object') {
                  return `${siblingData.image.filename || 'Product image'}`
                }
              },
            ],
          },
        },
      ],
    },

    // Status and Description
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: '✅ Active', value: 'active' },
        { label: '📝 Draft', value: 'draft' },
        { label: '⏸️ Inactive', value: 'inactive' },
        { label: '📦 Out of Stock', value: 'out-of-stock' },
      ],
      admin: {
        description: 'Product availability status',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed product description',
      },
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

    // Auto-generated Category Path
    {
      name: 'categoryPath',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Full category path',
        position: 'sidebar',
      },
    },

    // Advanced Product Details
    {
      name: 'productDetails',
      type: 'group',
      label: '📋 Product Details',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showAdvanced),
      },
      fields: [
        {
          name: 'sku',
          type: 'text',
          unique: true,
          admin: {
            description: 'Product SKU (auto-generated if empty)',
          },
          hooks: {
            beforeValidate: [
              ({ data, operation }) => {
                if (operation === 'create' && !data?.sku) {
                  const timestamp = Date.now().toString().slice(-6)
                  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
                  return `RS-${timestamp}-${random}`
                }
              },
            ],
          },
        },
        {
          name: 'originalPrice',
          type: 'number',
          admin: {
            description: 'Original price (for showing discounts)',
            step: 0.01,
          },
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            description: 'Product tags (comma separated)',
            placeholder: 'waterproof, lightweight, breathable',
          },
        },
      ],
    },

    // Inventory Management
    {
      name: 'inventory',
      type: 'group',
      label: '📦 Inventory Management',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable inventory tracking',
          },
        },
        {
          name: 'stock',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Stock quantity (when not using variants)',
            condition: (_, siblingData) => siblingData?.trackInventory && !siblingData?.hasVariants,
          },
          min: 0,
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 5,
          admin: {
            description: 'Alert when stock falls below this number',
            condition: (_, siblingData) => siblingData?.trackInventory,
          },
        },
      ],
    },

    // Product Variants
    {
      name: 'hasVariants',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'This product has variants (sizes, colors, etc.)',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },
    {
      name: 'variants',
      type: 'array',
      admin: {
        description: 'Product variants with individual pricing and inventory',
        condition: (_, siblingData) => siblingData?.showAdvanced && siblingData?.hasVariants,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Large Red, Size 42',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'size',
              type: 'text',
              admin: {
                placeholder: 'L, XL, 42',
                width: '33%',
              },
            },
            {
              name: 'color',
              type: 'text',
              admin: {
                placeholder: 'Red, Blue',
                width: '33%',
              },
            },
            {
              name: 'material',
              type: 'text',
              admin: {
                placeholder: 'Cotton, Leather',
                width: '34%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'price',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                step: 0.01,
                width: '50%',
              },
            },
            {
              name: 'stock',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Stock for this variant',
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'sku',
          type: 'text',
          admin: {
            description: 'Variant SKU (auto-generated if empty)',
          },
          hooks: {
            beforeValidate: [
              ({ value, siblingData, operation }) => {
                if ((operation === 'create' || operation === 'update') && !value) {
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
      ],
    },

    // Product Features
    {
      name: 'features',
      type: 'array',
      admin: {
        description: 'Key product features and benefits',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Waterproof, Lightweight, Breathable',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Feature description (optional)',
            rows: 2,
          },
        },
      ],
    },

    // Specifications
    {
      name: 'specifications',
      type: 'group',
      label: '📏 Specifications',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'weight',
              type: 'text',
              admin: {
                placeholder: '250g, 1.2kg',
                width: '33%',
              },
            },
            {
              name: 'dimensions',
              type: 'text',
              admin: {
                placeholder: '30x20x10 cm',
                width: '33%',
              },
            },
            {
              name: 'material',
              type: 'text',
              admin: {
                placeholder: 'Cotton, Polyester',
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'gender',
          type: 'select',
          options: [
            { label: 'Unisex', value: 'unisex' },
            { label: 'Men', value: 'men' },
            { label: 'Women', value: 'women' },
            { label: 'Kids', value: 'kids' },
          ],
          admin: {
            description: 'Target gender',
          },
        },
        {
          name: 'careInstructions',
          type: 'textarea',
          admin: {
            description: 'Care and maintenance instructions',
            rows: 2,
          },
        },
      ],
    },

    // SEO Settings
    {
      name: 'seo',
      type: 'group',
      label: '🔍 SEO Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (auto-generated if empty)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description',
            rows: 2,
          },
        },
      ],
    },

    // Related Products
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        description: 'Related products for cross-selling',
        condition: (_, siblingData) => siblingData?.showAdvanced,
        allowCreate: false,
      },
      filterOptions: {
        status: { equals: 'active' },
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
        }

        // Auto-set out of stock status
        if (data.trackInventory) {
          const hasStock = hasAvailableStock(data)
          if (data.status === 'active' && !hasStock) {
            data.status = 'out-of-stock'
          } else if (data.status === 'out-of-stock' && hasStock) {
            data.status = 'active'
          }
        }

        // Generate category path
        try {
          let categoryPath = ''

          if (data.sportsCategory) {
            const sportsCategory =
              typeof data.sportsCategory === 'object'
                ? data.sportsCategory
                : await req.payload.findByID({ collection: 'categories', id: data.sportsCategory })
            categoryPath += sportsCategory.name
          }

          if (data.sports) {
            const sports =
              typeof data.sports === 'object'
                ? data.sports
                : await req.payload.findByID({ collection: 'categories', id: data.sports })
            categoryPath += ` > ${sports.name}`
          }

          if (data.sportsItem) {
            const sportsItem =
              typeof data.sportsItem === 'object'
                ? data.sportsItem
                : await req.payload.findByID({ collection: 'categories', id: data.sportsItem })
            categoryPath += ` > ${sportsItem.name}`
          }

          data.categoryPath = categoryPath
        } catch (error) {
          req.payload.logger.error(`Failed to generate category path: ${error}`)
        }

        // Auto-generate SEO title if empty
        if (!data.seo?.title && data.name && data.brand) {
          const brandName = typeof data.brand === 'object' ? data.brand.name : 'Brand'
          data.seo = {
            ...data.seo,
            title: `${data.name} - ${brandName} | Ralhum Sports`,
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc, previousDoc }) => {
        if (operation === 'create') {
          req.payload.logger.info(`Product created: ${doc.name} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Product updated: ${doc.name} by ${req.user?.email}`)
        }

        // Update category product counts
        const updateCategoryCount = async (categoryId: string) => {
          try {
            const productCount = await req.payload.count({
              collection: 'products',
              where: {
                and: [
                  {
                    or: [
                      { sportsCategory: { equals: categoryId } },
                      { sports: { equals: categoryId } },
                      { sportsItem: { equals: categoryId } },
                    ],
                  },
                  { status: { equals: 'active' } },
                ],
              },
            })

            await req.payload.update({
              collection: 'categories',
              id: categoryId,
              data: { productCount: productCount.totalDocs },
            })
          } catch (error) {
            req.payload.logger.error(`Failed to update category product count: ${error}`)
          }
        }

        // Update counts for all related categories
        const categoriesToUpdate = new Set()

        if (doc.sportsCategory) {
          const categoryId =
            typeof doc.sportsCategory === 'object' ? doc.sportsCategory.id : doc.sportsCategory
          categoriesToUpdate.add(categoryId)
        }
        if (doc.sports) {
          const categoryId = typeof doc.sports === 'object' ? doc.sports.id : doc.sports
          categoriesToUpdate.add(categoryId)
        }
        if (doc.sportsItem) {
          const categoryId = typeof doc.sportsItem === 'object' ? doc.sportsItem.id : doc.sportsItem
          categoriesToUpdate.add(categoryId)
        }

        // Also update previous categories if they changed
        if (previousDoc) {
          ;['sportsCategory', 'sports', 'sportsItem'].forEach((field) => {
            if (previousDoc[field]) {
              const categoryId =
                typeof previousDoc[field] === 'object' ? previousDoc[field].id : previousDoc[field]
              categoriesToUpdate.add(categoryId)
            }
          })
        }

        // Update all affected categories
        for (const categoryId of categoriesToUpdate) {
          await updateCategoryCount(categoryId as string)
        }
      },
    ],
  },
}
