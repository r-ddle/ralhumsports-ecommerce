import type { CollectionConfig, PayloadRequest } from 'payload'

// Define user roles with specific permissions
export type UserRole = 'super-admin' | 'admin' | 'product-manager' | 'content-editor'

// Role-based access control functions with proper type safety
export const isAdmin = ({ req }: { req: PayloadRequest }) => {
  const user = req.user
  return Boolean(user && user.role && ['super-admin', 'admin'].includes(user.role))
}

export const isSuperAdmin = ({ req }: { req: PayloadRequest }) => {
  const user = req.user
  return Boolean(user && user.role === 'super-admin')
}

export const isAdminOrProductManager = ({ req }: { req: PayloadRequest }) => {
  const user = req.user
  return Boolean(
    user && user.role && ['super-admin', 'admin', 'product-manager'].includes(user.role),
  )
}

export const isAdminOrContentEditor = ({ req }: { req: PayloadRequest }) => {
  const user = req.user
  return Boolean(
    user && user.role && ['super-admin', 'admin', 'content-editor'].includes(user.role),
  )
}

// Only allow admins to access user management, disable public registration
const adminOrSelfAccess = ({ req }: { req: PayloadRequest }) => {
  const user = req.user

  // Super admins can access all users
  if (user && user.role === 'super-admin') {
    return true
  }

  // Users can only access their own profile
  if (user) {
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // No access for unauthenticated users
  return false
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'role', 'isActive'],
    group: 'System',
    description: 'Manage user accounts and permissions',
  },
  auth: {
    // Disable user registration - only admins can create users
    verify: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  access: {
    // Only super admins can create new users
    create: isSuperAdmin,
    // Users can read their own profile, super admins can read all
    read: adminOrSelfAccess,
    // Users can update their own profile, super admins can update all
    update: adminOrSelfAccess,
    // Only super admins can delete users
    delete: isSuperAdmin,
    // Only authenticated users can access admin panel
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    // Personal Information
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Enter first name',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        placeholder: 'Enter last name',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        placeholder: '+94 XX XXX XXXX',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a profile picture',
      },
    },

    // Role and Permissions
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'content-editor',
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Product Manager',
          value: 'product-manager',
        },
        {
          label: 'Content Editor',
          value: 'content-editor',
        },
      ],
      admin: {
        description: 'User role determines access permissions',
        condition: (_, { user }) => {
          // Only super admins can change roles
          return Boolean(user && user.role === 'super-admin')
        },
      },
      access: {
        // Only super admins can update roles
        update: isSuperAdmin,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Deactivate user to prevent login without deleting account',
        condition: (_, { user }) => {
          // Only super admins can activate/deactivate users
          return Boolean(user && user.role === 'super-admin')
        },
      },
      access: {
        update: isSuperAdmin,
      },
    },

    // Audit Trail
    {
      name: 'lastLogin',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last successful login timestamp',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            // Update last login on authentication
            if (operation === 'update' && req.user) {
              return new Date()
            }
          },
        ],
      },
    },
    {
      name: 'loginAttempts',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of failed login attempts',
        condition: (_, { user }) => {
          return Boolean(user && user.role === 'super-admin')
        },
      },
      defaultValue: 0,
    },

    // Department and Notes (for admin reference)
    {
      name: 'department',
      type: 'select',
      options: [
        { label: 'Management', value: 'management' },
        { label: 'Products', value: 'products' },
        { label: 'Content', value: 'content' },
        { label: 'Customer Service', value: 'customer-service' },
        { label: 'Marketing', value: 'marketing' },
      ],
      admin: {
        description: 'User department for organizational purposes',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this user (only visible to super admins)',
        condition: (_, { user }) => {
          return Boolean(user && user.role === 'super-admin')
        },
      },
      access: {
        read: isSuperAdmin,
        update: isSuperAdmin,
      },
    },
  ],
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        // Check if user account is active
        if (!user.isActive) {
          throw new Error('Account is deactivated. Please contact administrator.')
        }

        // Update last login timestamp
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            loginAttempts: 0, // Reset failed attempts on successful login
            lastLogin: new Date().toISOString(),
          },
        })
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        // Log successful login for audit trail
        req.payload.logger.info(
          `User ${user.email} (${user.role || 'no-role'}) logged in successfully`,
        )
      },
    ],
    beforeChange: [
      async ({ req, operation, data }) => {
        // Ensure first user is super admin
        if (operation === 'create') {
          const existingUsers = await req.payload.count({
            collection: 'users',
          })

          if (existingUsers.totalDocs === 0) {
            data.role = 'super-admin'
            data.isActive = true
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ req, operation, doc }) => {
        // Log user changes for audit trail
        if (operation === 'create') {
          req.payload.logger.info(`New user created: ${doc.email} (${doc.role || 'no-role'})`)
        } else if (operation === 'update') {
          req.payload.logger.info(`User updated: ${doc.email} (${doc.role || 'no-role'})`)
        }
      },
    ],
  },
}
