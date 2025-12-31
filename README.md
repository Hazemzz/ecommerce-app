# Route Shop E-Commerce (Next.js)

Production-ready e-commerce frontend built with Next.js App Router, TypeScript, Tailwind CSS, React Query, and the Route REST API.

## Features
- Auth flow: login, register, forgot/reset, change password with token persistence
- Catalog: products, brands, categories with pagination and detail pages
- Cart with optimistic updates, wishlist, addresses, checkout (cash / online), orders history
- Shared UI: cards, skeletons, toasts, navbar/footer, responsive layout
- Centralized API layer using Axios and React Query caching

## Getting Started
1) Install dependencies
```
npm install
```
2) Run dev server
```
npm run dev
```
3) Open http://localhost:3000

## Scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — lint with ESLint

## Project Structure
- `src/app/(auth)` — auth pages (login, register, forgot/reset, change password)
- `src/app/(shop)` — public shop pages (home, products, brands, categories)
- `src/app/cart`, `wishlist`, `orders`, `checkout`, `addresses` — user flows
- `src/components` — layout, shared, and UI components
- `src/services` — API service layer
- `src/context` — auth, cart, wishlist providers
- `src/hooks` — custom hooks (addresses)
- `src/lib` — API client, query client, storage helpers
- `src/utils` — constants and shared types

## Environment
- Uses the public API at https://ecommerce.routemisr.com/api/v1
- No additional env vars required for base functionality

## Notes
- React Query Devtools are included; open from the bottom-left button in dev
- Toast notifications use Sonner
