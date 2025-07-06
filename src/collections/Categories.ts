import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'displayOrder', 'productCount'],
    group: 'Products',
    description: 'Manage product categories for organization and navigation',
  },
  access: {
    // Product managers and above can create categories
    create: isAdminOrProductManager,
    // All authenticated users can read categories
    read: ({ req }) => Boolean(req.user),
    // Product managers and above can update categories
    update: isAdminOrProductManager,
    // Only admins can delete categories
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Category name - must be unique',
        placeholder: 'Enter category name (e.g., Running Shoes, Cricket Equipment)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly version of the category name',
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
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the category',
        placeholder: 'Describe what products belong in this category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category banner or representative image',
      },
      filterOptions: {
        category: {
          equals: 'products',
        },
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon class or Unicode for category display (optional)',
        placeholder: 'fa-running, 🏃, etc.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
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
      ],
      admin: {
        description: 'Category visibility status',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Order for displaying categories (lower numbers appear first)',
        step: 1,
      },
    },
    {
      name: 'parentCategory',
      type: 'text',
      admin: {
        description: 'Parent category ID for hierarchical organization (optional)',
        placeholder: 'Enter parent category ID if this is a subcategory',
      },
    },
    {
      name: 'isFeature',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this category on homepage or in navigation',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display this category in main navigation menu',
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
            description: 'SEO title for category page',
            placeholder: 'Category Name - Ralhum Sports',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description for category page',
            placeholder: 'Browse our selection of category products at Ralhum Sports...',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords separated by commas',
            placeholder: 'sports, equipment, category name, Sri Lanka',
          },
        },
      ],
    },

    // Category Configuration
    {
      name: 'config',
      type: 'group',
      label: 'Category Configuration',
      fields: [
        {
          name: 'allowProducts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow products to be assigned to this category',
          },
        },
        {
          name: 'requiresSize',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Products in this category require size selection',
          },
        },
        {
          name: 'requiresColor',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Products in this category require color selection',
          },
        },
        {
          name: 'customFields',
          type: 'textarea',
          admin: {
            description: 'JSON configuration for category-specific product fields',
            placeholder: '{"material": "required", "warranty": "optional"}',
          },
        },
      ],
    },

    // Auto-generated fields
    {
      name: 'productCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of active products in this category',
      },
      defaultValue: 0,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this category',
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
        description: 'User who last modified this category',
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
        // Validate parent category (prevent circular references)
        if (data.parentCategory && operation === 'update') {
          // This would need more complex logic to prevent deep circular references
          // For now, just prevent direct self-reference
          // Prevent self-reference validation would go here
          // More complex validation needed for deep circular references
        }

        // Set created/modified by
        if (operation === 'create') {
          data.createdBy = req.user?.id
        }
        if (operation === 'update') {
          data.lastModifiedBy = req.user?.id
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc }) => {
        // Update product count after category changes
        if (operation === 'update' && doc.status === 'inactive') {
          // Log when categories are deactivated as it affects products
          req.payload.logger.info(
            `Category deactivated: ${doc.name} - this may affect product visibility`,
          )
        }

        // Log category operations
        if (operation === 'create') {
          req.payload.logger.info(`Category created: ${doc.name} by ${req.user?.email}`)
        } else if (operation === 'update') {
          req.payload.logger.info(`Category updated: ${doc.name} by ${req.user?.email}`)
        }
      },
    ],
    afterDelete: [
      async ({ req, doc }) => {
        // Log category deletion
        req.payload.logger.warn(`Category deleted: ${doc.name} by ${req.user?.email}`)

        // Note: In a production system, you'd want to handle reassigning products
        // from deleted categories or prevent deletion of categories with products
      },
    ],
  },
}
