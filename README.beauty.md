<div align="center">

# GlowShine Co.

**Beauty that learns what you love.**

A beauty and personal-care e-commerce platform with a built-in customer behaviour intelligence engine, powered end to end by Firebase.

![Status](https://img.shields.io/badge/status-in%20development-blue)
![Version](https://img.shields.io/badge/PRD-v2.0-informational)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Functions-FFCA28?logo=firebase&logoColor=black)
![Type](https://img.shields.io/badge/type-working%20prototype-lightgrey)

[Features](#features) · [Quick Start](#quick-start) · [Architecture](#architecture) · [Documentation](#documentation) · [Roadmap](#roadmap)

</div>

---

## Overview

GlowShine Co. is more than a storefront. Every meaningful customer action (search, view, wishlist, cart, checkout, purchase, review) is captured as a structured event. Cloud Functions turn those events into scores, segments, predictions and recommendations that flow back into the shopping experience and into an admin console for the retailer.

```text
Customer shopping → Behaviour events → Firebase → Behaviour engine
   → GlowScore · GlowIntent · GlowTrend → Personalisation
   → Recommendations + Offers → More purchases → More data
```

**Why it is different**

| | |
|---|---|
| **Behaviour-first** | Every important action becomes an event stored for analysis |
| **Tamper-proof intelligence** | Scores are computed server-side in Cloud Functions, never in the browser |
| **Explainable personalisation** | Customers see *why* a product is recommended, for example "94% Match" with reasons |
| **Interest vs purchase insight** | Admins see the gap between what people look at and what they buy |
| **Closed-loop actions** | Lost-sale alerts lead to targeted campaigns, which lead back to purchases |

> GlowShine uses **behaviour-based, rule-driven scoring**. It is not described as machine learning.

---

## Features

### Customer storefront

- Email and Google sign-in, password reset
- Catalogue with search, filters and pagination
- Product detail with ingredients, benefits, skin types, reviews and related products
- Wishlist, persistent cart, three-step checkout, order history
- **Glow Quiz** onboarding, **GlowMatch** recommendations with match %, **GlowRoutine** bundles
- **Glow Profile** and **Beauty Journey** timeline
- Personalised offers and campaigns

### Behaviour intelligence engine

| Module | What it does |
|---|---|
| **GlowScore** | 0–100 engagement and value score per customer |
| **GlowIntent** | Rolling 7-day purchase intent: Low, Medium or High |
| **Segmentation** | Glow Elite, Loyal, Saver, Explorer, Care, Glam, Dormant |
| **GlowMatch** | Ranked recommendations with human-readable reasons |
| **GlowPredict** | Likely next repurchase timing |
| **GlowTrend** | 7-day growth for products and categories |
| **Lost Sales Detector** | High interest, no purchase, with a one-click offer |

### Admin console

- Role-protected dashboard: revenue, orders, customers, conversion, AOV
- Sales analytics, behaviour analytics, **Product Opportunity Matrix**
- Funnel and cart-abandonment analysis
- Customer list and detail with behaviour timeline
- Segments, campaign builder, product and inventory management
- Review analytics and live visitor activity

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Charts | Recharts or Chart.js |
| Authentication | Firebase Authentication (email/password, Google, custom claims) |
| Database | Cloud Firestore (primary), Realtime Database (presence and live activity) |
| Storage | Cloud Storage for product images |
| Backend | Cloud Functions for Firebase |
| Analytics | Firebase Analytics |
| Hosting | Firebase Hosting |
| Tooling | Firebase Emulator Suite, Vitest, ESLint |

---

## Architecture

```text
              ┌──────────────────────────────┐
              │     React + Vite SPA         │
              │   Customer UI  ·  Admin UI   │
              └──────────────┬───────────────┘
                             │ Firebase SDK
   ┌──────────┬──────────────┼──────────────┬──────────┐
   ▼          ▼              ▼              ▼          ▼
 Auth     Firestore     Realtime DB      Storage   Analytics
(claims)  (primary)    (presence/live)  (images)
              │ triggers
              ▼
        Cloud Functions
  behaviour · scoring · recommendations
  orders · segmentation · aggregation
```

Key decisions: Firebase end to end with no separate backend, all scores computed server-side, orders created only through the `placeOrder` callable, and roles enforced by custom claims plus Security Rules. See [docs/architecture.md](docs/architecture.md).

---

## Quick Start

### Prerequisites

- Node.js 20 or later
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (use the Emulator Suite for local development)

### 1. Install

```bash
git clone <your-repo-url> glowshine-co
cd glowshine-co
npm install
cd functions && npm install && cd ..
```

### 2. Configure environment

Copy the example file and fill in your Firebase web config.

```bash
cp .env.example .env
```

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_USE_EMULATORS=true
```

The web config identifies your project and is not a secret, but restrict the API key by HTTP referrer. Never commit service account keys or `.env` files.

### 3. Start the emulators

```bash
firebase emulators:start
```

### 4. Seed demo data

```bash
npm run seed
```

The seed script creates categories, brands, products, synthetic customers, events, orders, reviews and campaigns, plus a demo customer and an admin account. It can also reset the demo to its starting state.

### 5. Create the first admin

```bash
node scripts/set-admin.js <uid>
```

Sign out and back in so the new claim appears on your token.

### 6. Run the app

```bash
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

> Script names above are the intended convention. Adjust them to match your `package.json`.

---

## Common Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint the codebase |
| `npm test` | Unit tests |
| `npm run test:rules` | Security Rules tests in the emulator |
| `npm run seed` | Seed or reset demo data |
| `firebase deploy` | Deploy hosting, rules, indexes and functions |

---

## Project Structure

```text
glowshine-co/
├── src/
│   ├── components/        shared UI
│   ├── layouts/           customer and admin layouts
│   ├── pages/
│   │   ├── customer/
│   │   └── admin/
│   ├── hooks/
│   ├── context/
│   ├── services/          the only layer that talks to Firebase
│   │   ├── firebase/  auth/  products/  orders/  behaviour/  analytics/
│   ├── utils/
│   ├── data/
│   └── App.jsx
├── functions/src/         behaviour · recommendations · analytics · orders · users
├── scripts/               seed data, admin-claim bootstrap
├── docs/                  project documentation
├── firestore.rules
├── firestore.indexes.json
├── database.rules.json
├── storage.rules
└── firebase.json
```

---

## Security at a Glance

- **Deny by default** on Firestore, Storage and Realtime Database
- Roles via **custom claims**, enforced by Security Rules and callables (the UI only hides things)
- Customers can never change their role, prices, stock, scores or anyone else's data
- Orders are created only by the `placeOrder` callable, which re-prices items, checks stock in a transaction, and is idempotent
- Behaviour events are append-only with an allow-listed set of types and server timestamps
- App Check enabled; no secrets in the client; raw Firebase errors never shown to users

Full details: [docs/security.md](docs/security.md).

---

## Design Principles

GlowShine is meant to feel premium, clean, modern and trustworthy.

| Token | Value (starting point) |
|---|---|
| Background | Cream / white `#FFFAF5` / `#FFFFFF` |
| Primary accent | Soft pink `#F4C2C2` family |
| Secondary accent | Champagne gold `#C9A66B` |
| Text | Deep brown / charcoal `#3B2F2F` |
| Headings | Refined serif, for example Playfair Display |
| Body and UI | Clean sans-serif, for example Inter or Poppins |
| Surfaces | Rounded cards (12–16 px), soft shadows |

**Quality bar for every screen**

- Mobile-first from 360 px, fully usable on tablet, laptop and desktop
- Loading skeletons, empty states, friendly error states and retry
- Keyboard navigation, visible focus, readable contrast, alt text
- Motion is purposeful and respects `prefers-reduced-motion`
- Fast: lazy-loaded images, route-level code splitting, paginated queries
- SEO basics on public pages: titles, descriptions, semantic headings, clean slugs; private pages are `noindex`

---

## Documentation

| Document | Contents |
|---|---|
| [docs/architecture.md](docs/architecture.md) | System design, data flows, ADRs, environments |
| [docs/auth.md](docs/auth.md) | Sign-in methods, roles, claims, route guards |
| [docs/security.md](docs/security.md) | Rules, permission matrix, secrets, test plan |
| [docs/api.md](docs/api.md) | Callable functions, data access, event schema |
| [docs/realtime.md](docs/realtime.md) | Presence, live activity, Firestore listeners |
| `PRD` | Full product requirements (v2.0) |

---

## Testing

| Level | Tooling |
|---|---|
| Unit (scoring, segments, recommendations) | Vitest |
| Security Rules (allow and deny) | Emulator Suite + rules-unit-testing |
| Integration (event → score, `placeOrder`) | Emulator Suite |
| End to end | Playwright or Cypress (optional) |
| Performance and accessibility | Lighthouse, axe |

A feature is **done** only when the UI works, Firebase works, security rules cover it (including denial cases), validation and error handling exist, it works on mobile and desktop, refresh does not break it, duplicate actions are handled, and the relevant tests pass.

---

## Real vs Simulated

| Real | Simulated (clearly labelled in the UI) |
|---|---|
| Auth, catalogue, cart, wishlist, orders | Payment (`paymentStatus: "demo"`) |
| Behaviour tracking and scoring | Shipping and delivery tracking |
| Recommendations and segmentation | SMS and email delivery |
| Admin analytics from live data | Sentiment and prediction (rule-based, not ML) |

---

## Roadmap

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation: Vite, Tailwind, Firebase, Auth, rules, emulators | ☐ |
| 2 | E-commerce: catalogue, cart, checkout, `placeOrder` | ☐ |
| 3 | Behaviour: event tracking and Analytics mirroring | ☐ |
| 4 | Intelligence: GlowScore, Intent, segments, GlowMatch | ☐ |
| 5 | Admin console and analytics | ☐ |
| 6 | Hardening: schedules, storage rules, realtime activity | ☐ |
| 7 | Testing, polish, demo rehearsal | ☐ |

Out of scope for now: real payments, real shipping, SMS and email delivery, trained ML models, chatbot, virtual try-on, native mobile apps.

---

## Contributing

1. Read the docs in `/docs` and the PRD.
2. Branch from `main` and keep changes focused.
3. Update Security Rules, indexes and tests together with any schema change.
4. Run lint, unit tests and rules tests before opening a pull request.

---

## Author

**Chetann** — Computer Engineering, VIT Pune

GlowShine Co. is a college project.

## License

Add a license before sharing publicly (for example MIT). The brand name "GlowShine" overlaps with other "Glow" brands, so check domain, social handles and trademark before any public launch.

---

<div align="center">

*GlowShine Co. is not just a beauty website. It is a beauty retail intelligence system presented as an e-commerce store.*

</div>
