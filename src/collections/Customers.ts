import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrProductManager } from './Users'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'email',
      'primaryPhone',
      'orderStats.totalOrders',
      'orderStats.pendingOrders',
      'orderStats.lastOrderDate',
    ],
    group: 'Business',
    description: 'Manage customer information and track order history with WhatsApp integration',
    listSearchableFields: ['name', 'email', 'primaryPhone', 'secondaryPhone'],
  },
  access: {
    // Admins and product managers can create customers
    create: isAdminOrProductManager,
    // Only admins and product managers can read customer data
    read: isAdminOrProductManager,
    // Only admins and product managers can update customers
    update: isAdminOrProductManager,
    // Only admins can delete customers
    delete: isAdmin,
  },
  fields: [
    // Basic Customer Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer full name',
        placeholder: 'Enter customer full name',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Customer email address',
        placeholder: 'customer@example.com',
      },
    },
    {
      name: 'primaryPhone',
      type: 'text',
      required: true,
      admin: {
        description: 'Primary phone number for WhatsApp communication',
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'secondaryPhone',
      type: 'text',
      admin: {
        description: 'Secondary phone number (optional)',
        placeholder: '+94 XX XXX XXXX',
      },
    },

    // Address Information
    {
      name: 'addresses',
      type: 'array',
      admin: {
        description: 'Customer delivery addresses',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Home', value: 'home' },
            { label: 'Office', value: 'office' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'home',
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Complete delivery address',
            placeholder: 'Street address, City, Postal Code',
          },
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Set as default delivery address',
          },
        },
      ],
    },

    // Customer Preferences
    {
      name: 'preferences',
      type: 'group',
      label: 'Customer Preferences',
      fields: [
        {
          name: 'communicationMethod',
          type: 'select',
          defaultValue: 'whatsapp',
          options: [
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
            { label: 'Phone Call', value: 'phone' },
          ],
          admin: {
            description: 'Preferred communication method',
          },
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'english',
          options: [
            { label: 'English', value: 'english' },
            { label: 'Sinhala', value: 'sinhala' },
            { label: 'Tamil', value: 'tamil' },
          ],
          admin: {
            description: 'Preferred language for communication',
          },
        },
        {
          name: 'marketingOptIn',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Customer agrees to receive marketing communications',
          },
        },
      ],
    },

    // WhatsApp Integration
    {
      name: 'whatsapp',
      type: 'group',
      label: 'WhatsApp Integration',
      fields: [
        {
          name: 'isVerified',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'WhatsApp number is verified and active',
          },
        },
        {
          name: 'lastMessageSent',
          type: 'date',
          admin: {
            description: 'Date of last WhatsApp message sent',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        {
          name: 'lastResponse',
          type: 'date',
          admin: {
            description: 'Date of last customer response',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
        {
          name: 'messageHistory',
          type: 'textarea',
          admin: {
            description: 'Brief history of WhatsApp communications',
            placeholder: 'Log important WhatsApp interactions...',
          },
        },
      ],
    },

    // Order Statistics (Auto-calculated)
    {
      name: 'orderStats',
      type: 'group',
      label: 'Order Statistics',
      fields: [
        {
          name: 'totalOrders',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of orders placed',
            readOnly: true,
          },
        },
        {
          name: 'pendingOrders',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of pending/processing orders',
            readOnly: true,
          },
        },
        {
          name: 'completedOrders',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of completed orders',
            readOnly: true,
          },
        },
        {
          name: 'cancelledOrders',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of cancelled orders',
            readOnly: true,
          },
        },
        {
          name: 'totalSpent',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total amount spent (LKR)',
            readOnly: true,
            step: 0.01,
          },
        },
        {
          name: 'averageOrderValue',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Average order value (LKR)',
            readOnly: true,
            step: 0.01,
          },
        },
        {
          name: 'lastOrderDate',
          type: 'date',
          admin: {
            description: 'Date of last order',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'firstOrderDate',
          type: 'date',
          admin: {
            description: 'Date of first order',
            readOnly: true,
            date: {
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
      ],
    },

    // Customer Status and Notes
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'VIP', value: 'vip' },
        { label: 'Blocked', value: 'blocked' },
      ],
      admin: {
        description: 'Customer account status',
      },
    },
    {
      name: 'customerType',
      type: 'select',
      defaultValue: 'regular',
      options: [
        { label: 'Regular', value: 'regular' },
        { label: 'VIP', value: 'vip' },
        { label: 'Wholesale', value: 'wholesale' },
        { label: 'Corporate', value: 'corporate' },
      ],
      admin: {
        description: 'Customer type for special pricing or treatment',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this customer',
        placeholder: 'Add any relevant notes about the customer...',
      },
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Customer tags (comma separated)',
        placeholder: 'frequent-buyer, local-customer, etc.',
      },
    },

    // Social Media and Additional Contact
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook profile URL',
            placeholder: 'https://facebook.com/customer',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram profile URL',
            placeholder: 'https://instagram.com/customer',
          },
        },
      ],
    },

    // Auto-generated fields
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this customer record',
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
        description: 'User who last modified this customer record',
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

        // Ensure only one default address
        type Address = { isDefault?: boolean }
        if (data.addresses && Array.isArray(data.addresses)) {
          const defaultAddresses = data.addresses.filter((addr: Address) => addr.isDefault)
          if (defaultAddresses.length > 1) {
            // Keep only the first default address
            data.addresses.forEach((addr: Address, index: number) => {
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
        // Log customer operations
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
    afterDelete: [
      async ({ req, doc }) => {
        // Log customer deletion
        req.payload.logger.warn(
          `Customer deleted: ${doc.name} (${doc.email}) by ${req.user?.email}`,
        )
      },
    ],
  },
}
