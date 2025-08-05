import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Brands } from './collections/Brands'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Customers } from './collections/Customers'
import { Inventory } from './collections/Inventory'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Ralhum Sports Admin',
      // ogImage: '/admin-og-image.png',
    },
    disable: false,
    components: {
      // Custom admin components can be added here
      // graphics: {
      //   Logo: './components/Logo',
      //   Icon: './components/Icon',
      // },
      graphics: {
        Logo: './components/admin/customlogo',
        Icon: './components/admin/customicon',
      },
      views: {
        login: {
          Component: './components/admin/customlogin',
          path: '/admin/login',
        },
      },
    },
    livePreview: {
      // Enable live preview for content
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [
    // System Collections
    Users,
    Media,
    // Product Management
    Categories,
    Brands,
    Products,
    // Business Operations
    Orders,
    Customers,
    Inventory,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      // Add custom editor features if needed
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.NODE_ENV === 'development',
  }),
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
    'https://ralhumsports.lk',
    'https://www.ralhumsports.lk',
    'https://admin.ralhumsports.lk',
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
    'https://ralhumsports.lk',
    'https://www.ralhumsports.lk',
    'https://admin.ralhumsports.lk',
    'http://localhost:3000',
    'https://localhost:3000',
  ].filter(Boolean),
  // Temporarily disable email until we fix the configuration
  // email: nodemailerAdapter({
  //   defaultFromAddress: process.env.SMTP_FROM || 'noreply@ralhumsports.lk',
  //   defaultFromName: 'Ralhum Sports',
  //   transport: {
  //     host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  //     port: parseInt(process.env.SMTP_PORT || '2525'),
  //     secure: false,
  //     auth: {
  //       user: process.env.SMTP_USER || '',
  //       pass: process.env.SMTP_PASS || '',
  //     },
  //   },
  // }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  upload: {
    limits: {
      fileSize: 20000000, // 20MB
    },
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  localization: {
    locales: ['en'],
    defaultLocale: 'en',
    fallback: true,
  },
})
