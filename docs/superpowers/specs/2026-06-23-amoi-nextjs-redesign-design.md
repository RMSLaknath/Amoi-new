# Amoi — Next.js 15 Full Redesign
**Date:** 2026-06-23
**Status:** Approved
**Build type:** Greenfield — spec is the sole source of truth
**Build strategy:** Option A — top-down by dependency layer

---

## 1. Overview

Migrate the Amoi fashion e-commerce platform into a single Next.js 15 App Router monorepo. The storefront, admin panel, and all backend logic live in one deployment. The design is fully redesigned: sophisticated simplicity, product-photography-first, pure black & white palette inspired by jezzafashions.com.

---

## 2. Tech Stack

| Concern | Technology |
|---------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB Atlas via Mongoose |
| Auth | JWT in `httpOnly` cookies |
| Images | Cloudinary |
| Payments | PayHere (sandbox → production) |
| Email | Nodemailer + Gmail SMTP |
| Currency | ExchangeRate-API (LKR base, 24h cache) |
| Deployment | Vercel (single deployment) |
| Fonts | Playfair Display (headings) + Inter (body) via `next/font` |

---

## 3. Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#FFFFFF` | Page background |
| `surface` | `#F9F9F9` | Cards, input backgrounds |
| `border` | `#E5E5E5` | Dividers, card borders |
| `text-primary` | `#0A0A0A` | Headings, body text |
| `text-secondary` | `#6B6B6B` | Descriptions, labels |
| `text-muted` | `#A3A3A3` | Placeholders, metadata |
| `cta` | `#0A0A0A` | Primary buttons (black fill) |
| `cta-hover` | `#FFFFFF` | Button hover (inverted) |

### Typography
- **Headings / Logo:** `Playfair Display` — serif, italic for logo wordmark
- **Body / UI:** `Inter` — clean sans-serif
- **Hierarchy:** H1 48px · H2 32px · H3 24px · Body 16px · Small 14px

### Shape & Spacing
- **Border radius:** `0` everywhere — sharp edges, luxury feel
- **Borders:** `1px solid #E5E5E5`
- **Shadows:** None
- **Section spacing:** `80px` vertical padding between homepage sections

### Components
- **Buttons:** Black fill, white text, no radius. Hover → white fill, black border, black text
- **Inputs:** Underline-only style (no box border), `1px solid #0A0A0A` bottom
- **Product cards:** Image top, name (`Inter` regular 14px), price (`Inter` medium 14px) — no card background or shadow
- **Announcement bar:** Full-width black background, white text, scrolling marquee
- **Navbar:** White background, `1px` bottom border, transitions to transparent over hero

---

## 4. Build Order (Option A — Top-down by dependency layer)

### Layer 1 — Project Scaffold
1. `npx create-next-app@latest amoi` with TypeScript + Tailwind CSS 4 + App Router + src-less
2. Install dependencies: `mongoose bcryptjs jsonwebtoken cloudinary nodemailer react-toastify`
3. Configure `tailwind.config.ts`: design tokens, Playfair Display + Inter via `next/font`, zero border-radius
4. Set up `.env.local` with all required environment variables

### Layer 2 — Lib Utilities (`lib/`)
- `mongodb.ts` — Mongoose singleton connection (connection pooling for Vercel)
- `auth.ts` — JWT sign (sets `httpOnly` cookie) + verify (reads cookie from request headers)
- `cloudinary.ts` — Cloudinary v2 config
- `payhere.ts` — MD5 hash generation for checkout + webhook signature verify
- `email.ts` — Nodemailer transporter with Gmail SMTP
- `currency.ts` — ExchangeRate-API fetch with 24h server-side in-memory cache (module-level variable, reset on cold start)

### Layer 3 — Data Models (`models/`)
- `userModel.ts` — `name, email, password, cartData, resetToken, resetTokenExpiry`
- `productModel.ts` — `name, description, price, image[], category, subcategory, sizes[], bestseller, date`
- `orderModel.ts` — `userId, items[], amount, address, status, paymentMethod, payment, date`
- `reviewModel.ts` — `productId, userId, userName, rating, comment, date` + unique index `{productId, userId}`

### Layer 4 — Middleware
- `middleware.ts` at root — protects all `/admin/*` routes, redirects to `/admin/login` if JWT cookie absent or invalid

### Layer 5 — API Routes (`app/api/`)

| Group | Routes | Auth |
|-------|--------|------|
| `user/` | `register`, `login`, `admin`, `forgot-password`, `reset-password` | Public |
| `product/` | `list`, `single`, `add`, `remove` | `add`/`remove` = admin only |
| `cart/` | `get`, `add`, `update` | User JWT |
| `order/` | `place`, `userorders`, `list`, `status`, `payhere/checkout`, `payhere/notify` | Mixed |
| `review/` | `add`, `[productId]` | `add` = user JWT |
| `currency/` | `rates` | Public |

All protected routes read JWT from `httpOnly` cookie via `lib/auth.ts`, return `401` if invalid. Admin routes additionally verify token is for admin credentials.

### Layer 6 — UI Primitives (`components/ui/`)
- `Button.tsx` — black fill / inverted hover, no radius, variants: `primary | outline`
- `Input.tsx` — underline-only style, label + error state
- `StarRating.tsx` — interactive (form) and display (read-only) modes
- `CurrencySwitcher.tsx` — dropdown consuming `CurrencyContext`

### Layer 7 — Contexts (`context/`)
- `CartContext.tsx` — syncs to DB when authenticated, falls back to localStorage for guests; merges on login
- `CurrencyContext.tsx` — LKR base rate, fetches `/api/currency/rates`, caches 24h in localStorage

### Layer 8 — Layout Components (`components/layout/`)
- `AnnouncementBar.tsx` — `"FREE SHIPPING FOR ORDERS ABOVE LKR 10,000 · AMOI FASHION · SRI LANKA"`, CSS marquee
- `Navbar.tsx` — sticky, white bg + `1px` bottom border; transparent white-text mode over hero; mobile hamburger slides in from left
- `Footer.tsx` — links, social, copyright
- `AdminSidebar.tsx` — dark `#0A0A0A` bg, Amoi logo, nav items (Dashboard, Products, Orders), Logout

### Layer 9 — Feature Components

**Home (`components/home/`)**
- `Hero.tsx` — full-screen editorial image, white overlay text bottom-left, SHOP NOW button
- `CategoryGrid.tsx` — 2×2 grid with category image + label + View All link
- `ProductRow.tsx` — label + View All link + 4-col horizontal product grid
- `Newsletter.tsx` — centered heading, subtext, email input + Subscribe

**Product (`components/product/`)**
- `ProductCard.tsx` — image, name, price; no shadow, no card background
- `ProductGrid.tsx` — responsive grid wrapper
- `ImageGallery.tsx` — large main image + 4 thumbnails below
- `SizePicker.tsx` — box buttons, selected = black fill
- `ReviewSection.tsx` — average rating, paginated review list, write-review form (auth only)

**Collection (`components/collection/`)**
- `FilterSidebar.tsx` — Category (radio), Subcategory (checkbox), Size (checkbox)
- `SortDropdown.tsx` — Relevant / Low to High / High to Low / Newest

**Cart (`components/cart/`)**
- `CartItem.tsx` — thumbnail, name, size, quantity −/+ controls, price, remove
- `OrderSummary.tsx` — subtotal, delivery fee, total, CTA button (configurable label)

### Layer 10 — Pages & Layouts

**Store route group `app/(store)/`**
- `layout.tsx` — AnnouncementBar + Navbar + `{children}` + Footer
- `page.tsx` — Hero → CategoryGrid → ProductRow(Dresses) → ProductRow(Bestsellers) → Newsletter
- `collection/page.tsx` — FilterSidebar (left) + SortDropdown + count + ProductGrid
- `product/[id]/page.tsx` — SSR with `revalidate: 60`, ImageGallery + SizePicker + Add to Cart + Buy Now + ReviewSection
- `cart/page.tsx` — CartItem list + sticky OrderSummary
- `checkout/page.tsx` — address form + OrderSummary + COD/PayHere radio + Place Order
- `orders/page.tsx` — order list with status timeline
- `account/page.tsx` — tabbed: Sign In / Create Account / Forgot Password
- `reset-password/[token]/page.tsx` — new password form
- `about/page.tsx`, `contact/page.tsx` — static content

**Admin route group `app/admin/`**
- `layout.tsx` — AdminSidebar + white main content area
- `login/page.tsx` — standalone (no sidebar), centered form
- `page.tsx` — dashboard: total product count, total order count, all-time revenue (sum of paid orders in LKR)
- `products/page.tsx` — search bar, Add Product button, table with thumbnail/name/category/price/date/actions
- `products/add/page.tsx` — Cloudinary image upload (up to 4), product fields, sizes checkboxes, bestseller toggle
- `orders/page.tsx` — table with inline status dropdown (Order Placed → Packing → Shipped → Out for delivery → Delivered)

---

## 5. State Management

| Concern | Solution |
|---------|----------|
| Auth token | `httpOnly` cookie set by `/api/user/login` |
| Cart | `CartContext` — DB (authed), localStorage (guest), merge on login |
| Currency | `CurrencyContext` — fetches `/api/currency/rates` (server caches 24h in-memory), client caches result in localStorage for 24h |
| Products (SSR) | `fetch()` in server components with `next: { revalidate: 60 }` |
| Forms | Native React `useState` |
| Notifications | `react-toastify` |

---

## 6. Auth & Security

- JWT signed with `JWT_SECRET`, stored in `httpOnly` cookie (never localStorage)
- `middleware.ts` protects all `/admin/*` routes — redirects to `/admin/login` if cookie absent or invalid
- API routes validate token from cookie via `lib/auth.ts`; admin routes additionally verify admin credentials
- Passwords hashed with bcrypt
- Password reset: time-limited token (1 hour), emailed via Nodemailer

---

## 7. Payment Flow

**Cash on Delivery:** POST `/api/order/place` → order created (`payment: false`) → cart cleared → redirect `/orders`

**PayHere:**
1. POST `/api/order/payhere/checkout` → order created (`payment: false`) + MD5 hash returned
2. User pays on PayHere gateway
3. PayHere POSTs to `/api/order/payhere/notify` webhook
4. Backend verifies MD5 hash → sets `payment: true` → clears cart
5. User lands on `/orders`

---

## 8. Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EXCHANGE_RATE_API_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_NOTIFY_URL=https://<domain>/api/order/payhere/notify
PAYHERE_SANDBOX=true
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
EMAIL_USER=
EMAIL_PASS=
```

---

## 9. Deployment

- Single Vercel deployment from monorepo root
- `next build` output — no separate backend process
- MongoDB Atlas connection pooled via singleton in `lib/mongodb.ts`
- Cloudinary uploads handled server-side in `/api/product/add` (multipart form)
