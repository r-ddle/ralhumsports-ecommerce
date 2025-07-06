import type { CollectionConfig, PayloadRequest, CollectionBeforeLoginHook, CollectionAfterLoginHook, CollectionBeforeChangeHook, CollectionAfterChangeHook, Access, Condition, FieldHook } from 'payload/types'
import type { User } from '@/payload-types' // User type from generated types
import { APIError } from 'payload/errors'

// UserRole can be derived from the User type if its 'role' field is a select with options
// Assuming User['role'] is 'super-admin' | 'admin' | 'product-manager' | 'content-editor' | null | undefined
export type UserRole = NonNullable<User['role']>; // Use this if User['role'] is correctly defined in payload-types.ts

// Helper to assert user type if needed, though PayloadRequest should provide it.
const ensureUser = (reqUser: any): User | null => {
  // Add more checks if req.user structure is uncertain
  return reqUser && typeof reqUser === 'object' && 'id' in reqUser ? (reqUser as User) : null;
}

// Role-based access control functions with proper type safety using imported User type
export const isAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  const user = ensureUser(req.user);
  return Boolean(user && user.role && ['super-admin', 'admin'].includes(user.role));
}

export const isSuperAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  const user = ensureUser(req.user);
  return Boolean(user && user.role === 'super-admin');
}

export const isAdminOrProductManager = ({ req }: { req: PayloadRequest }): boolean => {
  const user = ensureUser(req.user);
  return Boolean(
    user && user.role && ['super-admin', 'admin', 'product-manager'].includes(user.role),
  );
}

export const isAdminOrContentEditor = ({ req }: { req: PayloadRequest }): boolean => {
  const user = ensureUser(req.user);
  return Boolean(
    user && user.role && ['super-admin', 'admin', 'content-editor'].includes(user.role),
  );
}

const adminOrSelfAccess: Access<User, User> = ({ req }: { req: PayloadRequest }) => {
  const user = ensureUser(req.user);

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
    create: isSuperAdmin as Access<User, User>,
    read: adminOrSelfAccess, // Already correctly typed via const assertion
    update: adminOrSelfAccess, // Already correctly typed via const assertion
    delete: isSuperAdmin as Access<User, User>,
    admin: (({ req: { user } }: { req: { user?: User | null } }) => Boolean(user)) as Access<User, User>,
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
        condition: (_, { user }: { user?: User | null }) => // Typed user from siblingData
          Boolean(user && user.role === 'super-admin'),
      },
      access: {
        update: isSuperAdmin as Access<User, User>, // Typed access
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Deactivate user to prevent login without deleting account',
        condition: (_, { user }: { user?: User | null }) => // Typed user
          Boolean(user && user.role === 'super-admin'),
      },
      access: {
        update: isSuperAdmin as Access<User, User>, // Typed access
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
      // Removed field hook for lastLogin as it's handled in beforeLogin collection hook
    },
    {
      name: 'loginAttempts',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Number of failed login attempts',
        condition: (_, { user }: { user?: User | null }) => // Typed user
          Boolean(user && user.role === 'super-admin'),
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
        condition: (_, { user }: { user?: User | null }) => // Typed user
          Boolean(user && user.role === 'super-admin'),
      },
      access: { // Typed access
        read: isSuperAdmin as Access<User, User>,
        update: isSuperAdmin as Access<User, User>,
      },
    },
  ],
  hooks: {
    beforeLogin: [
      (async ({ req, user }) => {
        const userDoc = user as User; // Assert User type
        const payload = req.payload;

        if (!userDoc.isActive) {
          throw new APIError('Account is deactivated. Please contact administrator.', 403); // Forbidden
        }

        try {
          await payload.update({
            collection: 'users',
            id: userDoc.id,
            data: {
              loginAttempts: 0,
              lastLogin: new Date().toISOString(),
            },
          });
        } catch (e) {
            payload.logger.error(`Error updating lastLogin for user ${userDoc.email}: ${(e as Error).message}`);
            // Do not block login if this update fails, but log it.
        }
        // No explicit return needed for beforeLogin if not modifying the user object further for auth
      }) as CollectionBeforeLoginHook<User>,
    ],
    afterLogin: [
      (async ({ req, user }) => {
        const loggedInUser = user as User;
        req.payload.logger.info(
          `User ${loggedInUser.email} (Role: ${loggedInUser.role || 'N/A'}) logged in successfully.`,
        );
      }) as CollectionAfterLoginHook<User>,
    ],
    beforeChange: [
      (async ({ req, operation, data }) => {
        const userData = data as Partial<User>;
        const payload = req.payload;

        if (operation === 'create') {
          const { totalDocs } = await payload.count({ collection: 'users' });
          if (totalDocs === 0) {
            userData.role = 'super-admin';
            userData.isActive = true;
            payload.logger.info(`First user being created. Assigning super-admin role to ${userData.email}`);
          }
        }
        // Add other beforeChange validations if needed, e.g., password complexity if not handled by auth options.
        return userData;
      }) as CollectionBeforeChangeHook<User>,
    ],
    afterChange: [
      (async ({ req, operation, doc }) => {
        const changedUser = doc as User;
        const performingUser = req.user as User | undefined | null;
        const payload = req.payload;

        if (operation === 'create') {
          payload.logger.info(`New user created: ${changedUser.email} (Role: ${changedUser.role || 'N/A'}) by ${performingUser?.email || 'system'}`);
        } else if (operation === 'update') {
          payload.logger.info(`User updated: ${changedUser.email} (Role: ${changedUser.role || 'N/A'}) by ${performingUser?.email || 'system'}`);
        }
      }) as CollectionAfterChangeHook<User>,
    ],
    // No afterDelete hook provided in original, can be added if specific actions are needed on user deletion
  },
}
