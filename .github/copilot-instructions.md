# Copilot Instructions for Ralhum Sports Ecommerce

## Project Architecture
- **Monorepo Structure:** All code (frontend, backend, admin, API, types, migrations, tests) is under `src/`, `collections/`, `components/`, and related folders.
- **Frontend:** Located in `src/app/(frontend)/` using Next.js and Tailwind CSS. Global styles: `globals.css`. Page-level components and layouts are in subfolders.
- **Admin Dashboard:** Located in `src/app/(admin)/`. Custom layouts and middleware for admin-only routes.
- **Backend/API:** API routes in `src/api/`. PayloadCMS config in `src/payload.config.ts`. Collections (data models) in `collections/`.
- **Types:** Shared TypeScript types in `src/types/` and `src/payload-types.ts`.
- **Components:** Reusable React components in `components/`, with subfolders for admin, cart, and UI.
- **Lib:** Utility and helper functions in `src/lib/`.
- **Migrations:** Database migrations in `src/migrations/`.

## Developer Workflows
- **Install dependencies:** `pnpm install`
- **Run dev server:** `pnpm dev` (Next.js frontend + PayloadCMS backend)
- **Build:** `pnpm build`
- **Test:**
  - Unit: `pnpm test` or `pnpm vitest`
  - E2E: Playwright specs in `tests/e2e/`
- **Lint:** `pnpm lint` (uses ESLint config in `eslint.config.mjs`)
- **Typecheck:** `pnpm typecheck`
- **Migrations:** Use scripts in `src/migrations/` for DB changes.

## Patterns & Conventions
- **Collections:** Each model (Products, Orders, Users, etc.) is defined in `collections/` as a PayloadCMS schema.
- **API:** RESTful endpoints in `src/api/`, using shared types and utility functions.
- **Component Design:** Prefer functional React components. Use hooks from `src/hooks/` for state and logic.
- **Styling:** Tailwind CSS for all UI. Config in `tailwind.config.ts`.
- **Testing:**
  - Unit tests in `tests/unit/`
  - Integration tests in `tests/int/`
  - E2E tests in `tests/e2e/`
- **Error Handling:** Use `error-boundary.tsx` for React error boundaries.
- **Performance:** Use `performance-optimizer.tsx` for frontend optimizations.
- **Accessibility:** Use `accessibility-enhancements.tsx` for a11y improvements.

## Integration Points
- **PayloadCMS:** Main backend, configured in `src/payload.config.ts`.
- **External APIs:** Integrate via `src/lib/api.ts` and related utils.
- **Media:** Managed via `collections/Media.ts` and `public/` assets.
- **Authentication:** Handled in `src/lib/auth.server.ts`.
- **Rate Limiting/Security:** See `src/lib/rate-limit.ts` and `src/lib/security-utils.ts`.

## Examples
- To add a new product model: create a schema in `collections/Products.ts`, update types in `src/types/product.ts`, and expose via API in `src/api/products/`.
- To add a new frontend page: create a folder in `src/app/(frontend)/`, add a `page.tsx`, and update navigation in `components/navigation.tsx`.

---

For more details, see `README.md` and explore the `src/`, `collections/`, and `components/` folders for patterns and examples.
