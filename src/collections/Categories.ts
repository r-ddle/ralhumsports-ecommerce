import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'parentCategory', 'status', 'productCount', 'displayOrder'],
    group: 'Catalog',
    description: 'Manage hierarchical categories: Sports Category → Sports → Sports Item',
    listSearchableFields: ['name', 'description'],
    pagination: {
      defaultLimit: 50,
    },
  },
  access: {
    create: isAdminOrProductManager,
    read: () => true,
    update: isAdminOrProductManager,
    delete: isAdmin,
  },
  fields: [
    // Essential Fields
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Category name',
        placeholder: 'e.g., Team Sports, Football, Football Boots',
      },
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value === 'string') {
          if (!value || value.length < 2) {
            return 'Category name must be at least 2 characters long'
          }
          return true
        }
        if (Array.isArray(value)) {
          if (value.length === 0 || value.some((v) => !v || v.length < 2)) {
            return 'Each category name must be at least 2 characters long'
          }
          return true
        }
        return 'Category name is required'
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated URL slug',
        position: 'sidebar',
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
    // Related Brands (multi-select relationship)
    {
      name: 'relatedBrands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
      admin: {
        description: 'Select brands related to this category (for navigation and filtering)',
        width: '100%',
      },
      filterOptions: {
        status: { equals: 'active' },
      },
      index: true,
    },

    // Hierarchy Type
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: '🏆 Sports Category (Level 1)',
          value: 'sports-category',
        },
        {
          label: '⚽ Sports (Level 2)',
          value: 'sports',
        },
        {
          label: '👕 Sports Item (Level 3)',
          value: 'sports-item',
        },
      ],
      admin: {
        description: 'Select the hierarchy level for this category',
        isClearable: false,
      },
    },

    // Parent Category with Smart Filtering
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Select parent category',
        condition: (data) => data?.type !== 'sports-category',
        allowCreate: false,
      },
      filterOptions: ({ data }) => {
        if (data?.type === 'sports') {
          return {
            type: { equals: 'sports-category' },
            status: { equals: 'active' },
          }
        }
        if (data?.type === 'sports-item') {
          return {
            type: { equals: 'sports' },
            status: { equals: 'active' },
          }
        }
        return true
      },
      validate: (value: unknown, { data }: { data: any }) => {
        if (data?.type === 'sports-category' && value) {
          return 'Sports Category (Level 1) cannot have a parent'
        }
        if ((data?.type === 'sports' || data?.type === 'sports-item') && !value) {
          return 'This category type requires a parent category'
        }
        return true
      },
    },

    // Status and Display
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '✅ Active', value: 'active' },
        { label: '⏸️ Inactive', value: 'inactive' },
        { label: '📝 Draft', value: 'draft' },
      ],
      admin: {
        description: 'Category status',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first)',
        step: 1,
      },
    },

    // Quick Settings Row
    {
      type: 'row',
      fields: [
        {
          name: 'isFeature',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: '⭐ Feature this category',
            width: '50%',
          },
        },
        {
          name: 'showInNavigation',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: '🧭 Show in navigation',
            width: '50%',
          },
        },
      ],
    },

    // Description (Always visible)
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Category description for customers',
        rows: 3,
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

    // Advanced Visual Settings
    {
      name: 'visual',
      type: 'group',
      label: 'Visual Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Icon class or emoji',
            placeholder: '⚽ or fa-football',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Category banner image',
          },
          filterOptions: {
            category: { equals: 'general' },
          },
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'Brand color (hex code)',
            placeholder: '#FF5733',
          },
        },
      ],
    },

    // Category Configuration
    {
      name: 'config',
      type: 'group',
      label: 'Category Configuration',
      admin: {
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'allowProducts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow products in this category',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'requiresSize',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '📏 Requires size',
                width: '33%',
              },
            },
            {
              name: 'requiresColor',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '🎨 Requires color',
                width: '33%',
              },
            },
            {
              name: 'requiresGender',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '👤 Requires gender',
                width: '34%',
              },
            },
          ],
        },
        {
          name: 'commonSizes',
          type: 'text',
          admin: {
            description: 'Common sizes (comma separated)',
            placeholder: 'XS, S, M, L, XL or 6, 7, 8, 9, 10, 11, 12',
            condition: (_, siblingData) => siblingData?.requiresSize,
          },
        },
        {
          name: 'commonColors',
          type: 'text',
          admin: {
            description: 'Common colors (comma separated)',
            placeholder: 'Black, White, Red, Blue, Green',
            condition: (_, siblingData) => siblingData?.requiresColor,
          },
        },
      ],
    },

    // SEO Settings
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
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
          hooks: {
            beforeValidate: [
              ({ data, siblingData }) => {
                if (!data && siblingData?.name) {
                  return `${siblingData.name} | Ralhum Sports`
                }
              },
            ],
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
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma separated)',
          },
        },
      ],
    },

    // Auto-calculated Display Fields
    {
      name: 'fullPath',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Full category path',
        position: 'sidebar',
      },
    },
    {
      name: 'level',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Hierarchy level',
        position: 'sidebar',
      },
    },
    {
      name: 'productCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Active products count',
        position: 'sidebar',
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

        // Set level based on type
        switch (data.type) {
          case 'sports-category':
            data.level = 1
            break
          case 'sports':
            data.level = 2
            break
          case 'sports-item':
            data.level = 3
            break
        }

        // Generate full path
        if (data.parentCategory && typeof data.parentCategory === 'object') {
          const parentPath = data.parentCategory.fullPath || data.parentCategory.name
          data.fullPath = `${parentPath} > ${data.name}`
        } else if (data.parentCategory) {
          data.fullPath = `[Parent] > ${data.name}`
        } else {
          data.fullPath = data.name
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc }) => {
        if (operation === 'create') {
          req.payload.logger.info(
            `Category created: ${doc.name} (${doc.type}) by ${req.user?.email}`,
          )
        } else if (operation === 'update') {
          req.payload.logger.info(
            `Category updated: ${doc.name} (${doc.type}) by ${req.user?.email}`,
          )
        }

        // Update full path if parent was just an ID
        if (doc.parentCategory && typeof doc.parentCategory === 'string') {
          try {
            const parent = await req.payload.findByID({
              collection: 'categories',
              id: doc.parentCategory,
            })

            if (parent) {
              const parentPath = parent.fullPath || parent.name
              const newFullPath = `${parentPath} > ${doc.name}`

              if (doc.fullPath !== newFullPath) {
                await req.payload.update({
                  collection: 'categories',
                  id: doc.id,
                  data: { fullPath: newFullPath },
                })
              }
            }
          } catch (error) {
            req.payload.logger.error(`Failed to update category path: ${error}`)
          }
        }

        // Update child categories' paths
        if (operation === 'update') {
          try {
            const children = await req.payload.find({
              collection: 'categories',
              where: {
                parentCategory: { equals: doc.id },
              },
            })

            for (const child of children.docs) {
              const newChildPath = `${doc.fullPath} > ${child.name}`
              if (child.fullPath !== newChildPath) {
                await req.payload.update({
                  collection: 'categories',
                  id: child.id,
                  data: { fullPath: newChildPath },
                })
              }
            }
          } catch (error) {
            req.payload.logger.error(`Failed to update child category paths: ${error}`)
          }
        }
      },
    ],
  },
}
