# Amoi — Next.js Redesign Spec
**Date:** 2026-06-23  
**Reference UI:** jezzafashions.com  
**Approach:** Full Next.js 15 monorepo (App Router) — replaces React+Vite frontend and Express backend

---

## 1. Project Overview

Migrate the Amoi fashion e-commerce platform from a React+Vite frontend + Express backend split into a single Next.js 15 monorepo. All functionality is preserved. The design is fully redesigned — inspired by jezzafashions.com: sophisticated simplicity, product-photography-first, pure black & white palette.

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
- **Product cards:** Image top, product name (`Inter` regular 14px), price (`Inter` medium 14px) — no card background or shadow
- **Announcement bar:** Full-width, black background, white text, scrolling marquee
- **Navbar:** White background, `1px` bottom border, transitions to transparent over hero

---

## 4. Project Structure

```
amoi/
├── app/
│   ├── (store)/                    # Customer storefront
│   │   ├── layout.tsx              # Navbar + Footer wrapper
│   │   ├── page.tsx                # Home
│   │   ├── collection/
│   │   │   └── page.tsx            # Collection with filters
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Product detail (SSR)
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── account/
│   │   │   └── page.tsx            # Login/Register/Forgot (tabbed)
│   │   ├── reset-password/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx              # Dark sidebar layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── products/
│   │   │   ├── page.tsx            # Product list
│   │   │   └── add/
│   │   │       └── page.tsx        # Add product
│   │   └── orders/
│   │       └── page.tsx            # Orders + status update
│   └── api/
│       ├── user/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── admin/route.ts
│       │   ├── forgot-password/route.ts
│       │   └── reset-password/route.ts
│       ├── product/
│       │   ├── list/route.ts
│       │   ├── single/route.ts
│       │   ├── add/route.ts
│       │   └── remove/route.ts
│       ├── cart/
│       │   ├── get/route.ts
│       │   ├── add/route.ts
│       │   └── update/route.ts
│       ├── order/
│       │   ├── place/route.ts
│       │   ├── userorders/route.ts
│       │   ├── list/route.ts
│       │   ├── status/route.ts
│       │   └── payhere/
│       │       ├── checkout/route.ts
│       │       └── notify/route.ts
│       ├── review/
│       │   ├── add/route.ts
│       │   └── [productId]/route.ts
│       └── currency/
│           └── rates/route.ts
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminSidebar.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── ProductRow.tsx
│   │   └── Newsletter.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── SizePicker.tsx
│   │   └── ReviewSection.tsx
│   ├── collection/
│   │   ├── FilterSidebar.tsx
│   │   └── SortDropdown.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── OrderSummary.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── StarRating.tsx
│       └── CurrencySwitcher.tsx
├── lib/
│   ├── mongodb.ts                  # Mongoose connection
│   ├── cloudinary.ts               # Cloudinary config
│   ├── auth.ts                     # JWT helpers (sign, verify)
│   ├── payhere.ts                  # PayHere hash + webhook verify
│   ├── email.ts                    # Nodemailer setup
│   └── currency.ts                 # Exchange rate fetch + cache
├── models/
│   ├── userModel.ts
│   ├── productModel.ts
│   ├── orderModel.ts
│   └── reviewModel.ts
├── context/
│   ├── CartContext.tsx
│   └── CurrencyContext.tsx
├── middleware.ts                   # Protect /admin/* routes
└── .env.local
```

---

## 5. Pages & UI Layouts

### Announcement Bar
- Full-width black bar, white text, scrolling marquee
- Content: `"FREE SHIPPING FOR ORDERS ABOVE LKR 10,000 · AMOI FASHION · SRI LANKA"`

### Navbar
```
[ AMOI (logo, Playfair italic) ]  [ Women  Men  Kids  New ]  [ 🔍  👤  🛍 0 ]
```
- Sticky, white background, `1px` bottom border
- On mobile: hamburger menu slides in from left
- Over hero: transitions to transparent background with white text

### Homepage
1. Announcement bar
2. Navbar
3. **Full-screen hero** — editorial image, white overlay text bottom-left: collection name + `[ SHOP NOW ]` button
4. **Shop by Category** — 2×2 grid of category images (Women, Men, Kids, New Arrivals), each with label + `[ View All ]`
5. **Dresses** — horizontal 4-col product grid + `[ View All ]` link top-right
6. **Bestsellers** — horizontal 4-col product grid + `[ View All ]` link top-right
7. **Newsletter** — centered: heading, subtext "Get 10% off your first order", email input + Subscribe button
8. Footer

### Collection Page
- Left sidebar: Category filter (radio), Subcategory filter (checkbox), Size filter (checkbox)
- Right: sort dropdown, item count, 3-col product grid
- Grid expands to full width on mobile (2-col)

### Product Detail Page (SSR)
- Left: large main image + thumbnail strip below (4 thumbnails)
- Right: breadcrumb, product name (Playfair Display H2), price (LKR), size picker (box buttons), `[ ADD TO CART ]` button (full width, black), `[ BUY NOW ]` button (full width, outlined), description, shipping note
- Below (full width): Reviews section — average star rating, review list (paginated), write a review form (authenticated users only)

### Cart Page
- Line items: thumbnail, name, size, quantity controls (−/+), price, remove
- Right panel (sticky): subtotal, delivery fee, total, `[ PROCEED TO CHECKOUT ]`

### Checkout Page
- Left: address form (first name, last name, email, phone, street, city, state, zip, country)
- Right: order summary (items, subtotal, delivery, total), payment method (COD / PayHere radio)
- `[ PLACE ORDER ]` button at bottom

### Account Page
- Tabbed: `Sign In` / `Create Account` / `Forgot Password`
- Minimal centered layout, underline inputs

### Orders Page
- List of orders, each showing: order date, items (thumbnail + name), total, payment method, status badge, status timeline

### Admin Layout
- Dark left sidebar (`#0A0A0A`): Amoi logo, nav items (Dashboard, Products, Orders), Logout
- White main content area

### Admin — Product List
- Search bar, `[ + Add Product ]` button
- Table: image thumbnail, name, category, price, date, Edit / Delete actions

### Admin — Add Product
- Image upload (up to 4, drag & drop)
- Fields: name, description, price, category (dropdown), subcategory (dropdown), sizes (multi-select checkboxes), bestseller toggle
- `[ ADD PRODUCT ]` submit button

### Admin — Orders
- Table: order ID, customer name, items count, amount, payment method, payment status, status dropdown
- Status options: Order Placed → Packing → Shipped → Out for delivery → Delivered

---

## 6. State Management

| Concern | Solution |
|---------|----------|
| Auth token | `httpOnly` cookie set by `/api/user/login` route |
| Cart | `CartContext` — syncs to DB (authenticated), localStorage (guest) |
| Currency | `CurrencyContext` — LKR base, rates cached 24h in localStorage |
| Products (SSR) | `fetch()` in server components with `next: { revalidate: 60 }` |
| Forms | Native React `useState` |
| Notifications | `react-toastify` |

---

## 7. Auth & Security

- JWT signed with `JWT_SECRET`, stored in `httpOnly` cookie (not localStorage)
- `middleware.ts` protects all `/admin/*` routes — redirects to `/admin/login` if cookie absent or invalid
- API routes validate token from cookie using `lib/auth.ts`
- Admin routes additionally verify token is for admin credentials
- Password hashing: bcrypt (same as current)
- Password reset: time-limited token (1 hour), emailed via Nodemailer

---

## 8. Data Models

Unchanged from current system:

- **User:** `name, email, password, cartData, resetToken, resetTokenExpiry`
- **Product:** `name, description, price, image[], category, subcategory, sizes[], bestseller, date`
- **Order:** `userId, items[], amount, address, status, paymentMethod, payment, date`
- **Review:** `productId, userId, userName, rating, comment, date` — unique index on `{productId, userId}`

---

## 9. Payment Flow

### Cash on Delivery
1. User submits checkout → `POST /api/order/place`
2. Order created (`payment: false`), cart cleared, redirect to `/orders`

### PayHere
1. User selects PayHere → `POST /api/order/payhere/checkout`
2. Backend creates order (`payment: false`), returns PayHere form data with MD5 hash
3. User completes payment on PayHere gateway
4. PayHere calls `POST /api/order/payhere/notify` webhook
5. Backend verifies hash → sets `payment: true`, clears cart
6. User redirected to `/orders`

---

## 10. Environment Variables (.env.local)

```env
MONGODB_URI=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EXCHANGE_RATE_API_KEY=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
PAYHERE_MERCHANT_ID=...
PAYHERE_MERCHANT_SECRET=...
PAYHERE_NOTIFY_URL=https://<domain>/api/order/payhere/notify
PAYHERE_SANDBOX=true
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
EMAIL_USER=...
EMAIL_PASS=...
```

---

## 11. Deployment

- Single Vercel deployment from monorepo root
- `next build` output — no separate backend process
- MongoDB Atlas connection pooled via singleton pattern in `lib/mongodb.ts`
- Cloudinary uploads handled in `/api/product/add` route (multipart form)

---

## 12. Migration Notes

- **From:** React+Vite (frontend) + Express (backend) + separate admin React+Vite app
- **To:** Single Next.js 15 monorepo
- All Express controllers map 1:1 to Next.js API route handlers
- All React pages map 1:1 to Next.js App Router pages
- Admin moves from separate app → `/admin/*` route group in same project
- Auth changes: localStorage JWT → `httpOnly` cookie JWT
- MongoDB models and business logic are **unchanged**
