import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'primaryPhone', 'status'],
    group: 'Business',
    description: 'Manage customer information and relationships',
    listSearchableFields: ['name', 'email', 'primaryPhone'],
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
    // Essential Customer Information - Name at root level
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
      },
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value !== 'string' || value.length < 2) {
          return 'Customer name must be at least 2 characters long'
        }
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Customer email',
      },
    },
    {
      name: 'primaryPhone',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary phone number',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: '✅ Active', value: 'active' },
        { label: '⏸️ Inactive', value: 'inactive' },
        { label: '⭐ VIP', value: 'vip' },
        { label: '🚫 Blocked', value: 'blocked' },
      ],
      admin: {
        description: 'Customer account status',
      },
    },
    {
      name: 'defaultAddress',
      type: 'textarea',
      admin: {
        description: 'Default delivery address',
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

    // Additional Contact (Advanced)
    {
      name: 'secondaryPhone',
      type: 'text',
      admin: {
        description: 'Secondary phone number',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },

    // Multiple Addresses (Advanced)
    {
      name: 'addresses',
      type: 'array',
      admin: {
        description: 'Additional delivery addresses',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: '🏠 Home', value: 'home' },
            { label: '🏢 Office', value: 'office' },
            { label: '📍 Other', value: 'other' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Address label',
            placeholder: 'Main Office, Parents House',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          admin: {
            rows: 2,
          },
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Set as default address',
          },
        },
      ],
    },

    // Customer Preferences (Advanced)
    {
      name: 'communicationMethod',
      type: 'select',
      defaultValue: 'whatsapp',
      options: [
        { label: '📱 WhatsApp', value: 'whatsapp' },
        { label: '📧 Email', value: 'email' },
        { label: '📞 Phone Call', value: 'phone' },
      ],
      admin: {
        description: 'Preferred communication method',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },
    {
      name: 'marketingOptIn',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: '📢 Receive marketing communications',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },

    // Order Statistics (Advanced - Read Only)
    {
      name: 'totalOrders',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total orders placed',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total amount spent (LKR)',
        step: 0.01,
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },
    {
      name: 'lastOrderDate',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last order date',
        condition: (_, siblingData) => siblingData?.showAdvanced,
      },
    },

    // Customer Notes (Advanced)
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal customer notes',
        condition: (_, siblingData) => siblingData?.showAdvanced,
        rows: 4,
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

        // Ensure only one default address
        if (data.addresses && Array.isArray(data.addresses)) {
          const defaultAddresses = data.addresses.filter((addr: any) => addr.isDefault)
          if (defaultAddresses.length > 1) {
            data.addresses.forEach((addr: any, index: number) => {
              if (index > 0 && addr.isDefault) {
                addr.isDefault = false
              }
            })
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc }) => {
        if (operation === 'create') {
          req.payload.logger.info(
            `Customer created: ${doc.name} (${doc.email}) by ${req.user?.email}`,
          )
        } else if (operation === 'update') {
          req.payload.logger.info(
            `Customer updated: ${doc.name} (${doc.email}) by ${req.user?.email}`,
          )
        }
      },
    ],
  },
}
