# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
- `pnpm dev` - Start the development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm devsafe` - Clean restart (removes .next directory first)

### Testing
- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests with Vitest
- `pnpm test:e2e` - Run end-to-end tests with Playwright

### Payload CMS
- `pnpm payload` - Access Payload CLI
- `pnpm generate:types` - Generate TypeScript types from Payload config
- `pnpm generate:importmap` - Generate import map for admin UI
- `pnpm seed:products` - Seed products data

### Deployment
- `pnpm ci` - Run migrations and build for CI/CD

## Architecture Overview

This is a **Next.js 15** e-commerce application built with **Payload CMS 3.44** as a headless CMS and backend. The architecture follows a monolithic approach with clear separation between frontend and admin interfaces.

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Payload CMS with PostgreSQL (Vercel Postgres)
- **Database**: Vercel Postgres with automatic migrations
- **Storage**: Vercel Blob Storage for media files
- **Payment**: PayHere (Sri Lankan payment gateway)
- **Testing**: Vitest (unit/integration), Playwright (e2e)
- **Deployment**: Vercel with Docker support

### Directory Structure

#### Frontend (`src/app/(frontend)/`)
- Main customer-facing e-commerce site
- Route groups for clean organization
- Pages: home, products, checkout, orders, static pages

#### Admin (`src/app/(payload)/`)
- Payload CMS admin interface at `/admin`
- Custom components for branding and login
- API routes for Payload at `/api/[...slug]`

#### API Routes (`src/app/api/`)
- Public API endpoints separate from Payload
- PayHere payment integration endpoints
- Custom business logic endpoints

#### Collections (`src/collections/`)
- **Products**: Main product catalog with variants and inventory
- **Categories**: Product categorization
- **Brands**: Brand management with logos
- **Orders**: Order management with status tracking
- **Customers**: Customer data (separate from admin Users)
- **Inventory**: Stock management system
- **Media**: File and image storage
- **Users**: Admin users only

### Key Components

#### Payment Integration
- PayHere integration in `src/lib/payhere.ts` and `src/hooks/use-payhere.ts`
- Hash generation endpoint: `/api/payhere/generate-hash`
- Payment notifications: `/api/payhere/notify`

#### Cart System
- Client-side cart with `use-cart` hook
- Persistent cart state with localStorage
- Cart sidebar component for checkout flow

#### Product Management
- Complex product variants with size/color options
- Stock tracking per variant
- Product filtering and search functionality

### Important Configuration

#### Database
- Uses Vercel Postgres adapter with automatic migrations
- Migration files in `src/migrations/`
- Connection via `DATABASE_URL` environment variable

#### Security
- HTTPS enforcement in production
- Enhanced security headers in `next.config.mjs`
- Rate limiting implemented in `src/lib/rate-limit.ts`
- CORS and CSRF protection configured

#### Performance
- Image optimization with multiple formats (WebP, AVIF)
- Bundle optimization with SWC minification
- Performance monitoring with Vercel Analytics

### Development Notes

#### Testing Strategy
- Unit tests: `tests/unit/` for utilities and business logic
- Integration tests: `tests/int/` for API endpoints
- E2E tests: `tests/e2e/` for complete user flows
- Test setup in `vitest.setup.ts`

#### PayHere Integration
- Requires specific Referrer-Policy for cross-origin requests
- Hash generation follows PayHere v4 specification
- Notification handling with order status updates

#### Type Safety
- Generated types from Payload config in `payload-types.ts`
- Custom type definitions in `src/types/`
- Strict TypeScript configuration

### Environment Variables Required
- `DATABASE_URL` - Vercel Postgres connection
- `PAYLOAD_SECRET` - Payload CMS secret key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- PayHere credentials for payment processing