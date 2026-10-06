<div align="center">

# GLOWSHINE CO.
### Product Requirements Document (PRD)
**Beauty & Personal-Care E-Commerce with a Customer Behaviour Intelligence Engine**

*Beauty that learns what you love.*

![Status](https://img.shields.io/badge/status-approved%20for%20build-success)
![Version](https://img.shields.io/badge/version-2.1-blue)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Firebase-orange)
![Type](https://img.shields.io/badge/type-working%20prototype-lightgrey)

</div>

---

## Document Control

| Field | Detail |
|---|---|
| **Document** | GlowShine Co. Product Requirements Document |
| **Version** | 2.1 (Firebase architecture + UPI QR payments) |
| **Status** | v2.0 approved for build; v2.1 payment amendment awaiting owner review |
| **Date** | 4 October 2026 |
| **Product owner** | Chetann |
| **Product type** | Full working prototype (college project) |
| **Supersedes** | v1.0 (Flask + MySQL concept); amends v2.0 (demo payment replaced by UPI QR payments) |
| **Audience** | Developer(s), evaluators, project guide |

### Revision History

| Version | Date | Change |
|---|---|---|
| 1.0 | 4 Oct 2026 | Initial PRD based on the Flask/MySQL website plan |
| 2.0 | 4 Oct 2026 | Re-based on the Firebase working-prototype plan: Firestore, Cloud Functions, Realtime Database, security rules, admin RBAC |
| 2.1 | 4 Oct 2026 | Added UPI QR payments: exact-amount QR per order, payment confirmation (provider webhook or admin-verified), order and payment state machines, payments data model, functions, security rules, tests, admin payments console (see 6.1A, 7.10, Appendix E) |

### Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement and Opportunity](#2-problem-statement-and-opportunity)
3. [Vision, Goals and Success Metrics](#3-vision-goals-and-success-metrics)
4. [Scope](#4-scope)
5. [Users, Personas and User Stories](#5-users-personas-and-user-stories)
6. [System Architecture](#6-system-architecture)
7. [Functional Requirements: Customer Application](#7-functional-requirements-customer-application)
8. [Functional Requirements: Behaviour Intelligence Engine](#8-functional-requirements-behaviour-intelligence-engine)
9. [Functional Requirements: Admin Console](#9-functional-requirements-admin-console)
10. [Data Model](#10-data-model)
11. [Backend: Cloud Functions Specification](#11-backend-cloud-functions-specification)
12. [Security and Access Control](#12-security-and-access-control)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [UX and Visual Design](#14-ux-and-visual-design)
15. [Analytics and Instrumentation Plan](#15-analytics-and-instrumentation-plan)
16. [Real vs Simulated Matrix](#16-real-vs-simulated-matrix)
17. [Seed Data Plan](#17-seed-data-plan)
18. [Testing and Quality Strategy](#18-testing-and-quality-strategy)
19. [Demo Scenario](#19-demo-scenario)
20. [Delivery Plan and Milestones](#20-delivery-plan-and-milestones)
21. [Repository Structure](#21-repository-structure)
22. [Risks, Assumptions, Dependencies and Constraints](#22-risks-assumptions-dependencies-and-constraints)
23. [Open Questions](#23-open-questions)
24. [Glossary](#24-glossary)
25. [Appendices](#25-appendices)

> **v2.1 payment additions are in:** 3.2 (G7), 3.3 and 3.4 (KPIs and targets), 4 (scope), 5.2 (stories), 6.1A (payment path), 6.3 (ADR-09 to ADR-12), 7.8 (order flow), 7.10 (Payments), 8.1 (events), 9 (admin payments), 10 (data model), 11 (functions), 12 (security), 13 (NFR-PAY), 14 (UX), 16 (real vs simulated), 18 (TC-15 to TC-27), 19 (demo), 22 and 23 (risks, questions) and **Appendix E (payment technical specification)**.

---

## 1. Executive Summary

GlowShine Co. is a beauty and personal-care e-commerce platform with a built-in **behaviour intelligence engine**. Customers shop through a modern storefront while every meaningful action (search, view, wishlist, cart, checkout, purchase, review) is captured as a structured event. A Firebase-backed engine converts those events into scores, segments, predictions and recommendations that feed back into the shopping experience and into an admin console for the retailer.

```
CUSTOMER SHOPPING → USER BEHAVIOUR → FIREBASE → BEHAVIOUR ENGINE
      → GlowScore · GlowIntent · GlowTrend → PERSONALIZATION
      → Recommendations + Offers + Predictions → MORE PURCHASES → MORE DATA
```

### 1.1 Positioning Statement

> GlowShine Co. is a fully functional beauty and personal-care e-commerce prototype integrated with Firebase Authentication, Firestore, Realtime Database, Storage, Analytics and Cloud Functions, and it accepts UPI payments through a QR code generated for the exact amount of each order. It tracks customer interactions, calculates behavioural scores, segments customers, generates personalized recommendations, analyzes sales and identifies potential lost-sales opportunities.

### 1.2 Core Differentiators

| # | Differentiator | What it means |
|---|---|---|
| 1 | Behaviour-first design | Every important action is an event stored for analysis |
| 2 | Server-side intelligence | Scores are computed in Cloud Functions, not in the browser, so they cannot be tampered with |
| 3 | Explainable personalization | Customers see *why* a product is recommended ("94% Match" with reasons) |
| 4 | Interest vs purchase analytics | Admin can see the gap between what customers look at and what they buy |
| 5 | Closed-loop actions | Insight leads to action: lost-sale alerts lead to targeted campaigns, which lead back to purchases |

---

## 2. Problem Statement and Opportunity

### 2.1 Problem

Small and mid-size beauty retailers typically:

- Treat all visitors the same, with generic banners and unranked catalogues.
- Cannot see the difference between **interest** (views, wishlists, carts) and **conversion** (purchases).
- Lose sales from abandoned carts without knowing who, why or what to offer.
- Lack a simple way to segment customers or time repurchase reminders.

### 2.2 Opportunity

Beauty is a high-frequency, high-consideration, repeat-purchase category (cleanser, sunscreen, serum). Behavioural signals are rich and predictable. A lightweight, transparent, rule-based intelligence layer can deliver measurable value without complex machine learning.

### 2.3 Design Principle

> Be honest about the technology. GlowShine uses **behaviour-based, rule-driven scoring**. It must not be described as advanced AI or machine learning unless it is.

---

## 3. Vision, Goals and Success Metrics

### 3.1 Vision

An e-commerce store that gets smarter with every click and a retailer dashboard that turns that behaviour into decisions.

### 3.2 Product Goals

| ID | Goal | Measure of success |
|---|---|---|
| G1 | Deliver a complete working shopping flow (browse to paid order) | A user can register, shop, pay by UPI QR and see a confirmed order end to end |
| G2 | Capture behaviour reliably | 100% of defined event types are written to `behaviourEvents` |
| G3 | Personalize the experience | Home, GlowMatch and product pages show behaviour-driven recommendations with match % |
| G4 | Provide actionable admin intelligence | Admin can identify a lost-sale product and launch a campaign in under 2 minutes |
| G5 | Secure by design | Customers cannot read other users' data or alter prices, roles or scores |
| G6 | Demo-ready | The 12-step demo runs without manual database edits |
| G7 | Accept payments securely | The QR always encodes the exact server-computed order total; an order is confirmed only after verified payment into the store's account; clients cannot mark an order paid |

### 3.3 Business and Product KPIs (as measured by the platform)

| KPI | Definition | Where shown |
|---|---|---|
| Revenue | Sum of `orders.total` where status is confirmed **and** `paymentStatus` is paid (dashboard labels the figure if it includes demo/test payments) | Admin dashboard |
| Orders | Count of paid, confirmed orders | Admin dashboard |
| Customers / Active users | Registered users / users with an event in the last 30 days | Admin dashboard |
| Conversion rate | Purchasing sessions ÷ total sessions × 100 | Dashboard, funnel |
| Average order value (AOV) | Revenue ÷ orders | Dashboard |
| Cart abandonment rate | 1 − (orders ÷ carts with at least one `checkout_start` or `cart_add`) | Funnel |
| Recommendation CTR | `recommendation_click` ÷ recommendations shown | Analytics |
| Offer redemption rate | Orders using a campaign ÷ campaign impressions | Campaigns |
| Repeat purchase rate | Customers with 2 or more orders ÷ customers with 1 or more | Segments |
| Payment success rate | Orders paid ÷ payment sessions created | Admin payments |
| Payment expiry rate | Payment sessions that expired unpaid ÷ sessions created | Admin payments, funnel |
| Median time to pay | Median of (`paidAt` − payment session `createdAt`) for paid orders | Admin payments |

> **Requirement:** All KPI values must be computed from Firebase data. No hard-coded numbers in the UI. Demo values such as ₹24.8L revenue and 2,450 customers are achieved through seed data, not literals.

### 3.4 Product Acceptance Targets (prototype)

| Target | Threshold |
|---|---|
| Core user journeys passing | 100% of P0 acceptance tests |
| Score update latency after an event | Under 5 seconds typical (under 15 seconds worst case) |
| Page load (catalogue, 50 products) | Under 2.5 s on broadband, Lighthouse Performance 80 or more |
| Security rules test suite | 100% pass, including negative tests |
| Payment confirmation latency | Under 5 s from provider confirmation to the customer seeing "Paid" (under 15 s worst case) |
| Payment test cases | 100% of TC-15 to TC-27 pass |

---

## 4. Scope

### 4.1 In Scope

**Customer app:** registration and login (email/password, Google), Glow Quiz onboarding, catalogue with search and filters, product detail, wishlist, cart, checkout with UPI QR payment, orders, reviews, GlowMatch, GlowRoutine, Glow Profile, Beauty Journey, offers.

**Behaviour engine:** event capture, GlowScore, GlowIntent, segmentation, recommendation scoring, GlowPredict, GlowTrend, review sentiment (rule-based).

**Admin console:** role-protected dashboard, sales analytics, behaviour analytics, product opportunity matrix, funnel and abandonment, customer list and detail with timeline, segments, campaigns, product management, review analytics, live activity.

**Platform:** Firebase Auth, Firestore, Realtime Database, Storage, Analytics, Cloud Functions, Hosting, Security Rules, Emulator Suite.

**Payments (v2.1):** exact-amount UPI QR per order, three payment modes (`gateway`, `direct_upi`, `demo`), server-side payment sessions, signature-verified webhook, order expiry with stock release, admin payments console and manual verification queue, payment events and KPIs.

### 4.2 Out of Scope (v2.0)

Card, netbanking, wallet and cash-on-delivery payments, automated refunds, settlement and bank reconciliation automation, real shipping and logistics, SMS and email delivery, trained ML models, AI chatbot, virtual try-on, multi-vendor marketplace, native mobile apps.

### 4.3 Prioritization (MoSCoW)

| Priority | Features |
|---|---|
| **Must (P0)** | Auth, products, search, filters, product page, wishlist, cart, checkout with UPI QR payment, orders, behaviour tracking, GlowScore, security rules, admin login (RBAC), sales dashboard, behaviour dashboard, product management |
| **Should (P1)** | Glow Quiz, Glow Profile, GlowMatch, GlowIntent, segmentation, opportunity matrix, customer detail timeline, funnel, campaigns, reviews |
| **Could (P2)** | GlowRoutine, GlowPredict, GlowTrend, review analytics, live activity (Realtime Database), Beauty Journey |
| **Won't (now)** | Chatbot, virtual try-on, card/netbanking/COD payments, automated refunds, email/SMS automation, ML models |

---

## 5. Users, Personas and User Stories

### 5.1 Personas

| Persona | Description | Goals | Pain points |
|---|---|---|---|
| **Aanya, the Skincare Explorer** | 22, student, budget ₹500–₹1,000, browses a lot, buys rarely | Find the right hydrating routine without overspending | Too many options, unsure what suits her |
| **Riya, the Loyal Repeater** | 30, working professional, buys the same brands monthly | Fast reorder, reminders, good bundles | Forgets when she runs out |
| **Meera, the Deal Seeker** | 27, price-sensitive, waits for offers | Discounts on products she already wants | Misses promotions |
| **Admin / Retailer** | Store owner or manager | See what sells, what does not, and why; act quickly | No visibility into abandoned interest |

### 5.2 User Stories

**Customer**

| ID | Story | Priority |
|---|---|---|
| US-C01 | As a visitor, I want to register or sign in with email or Google so I can save my profile and cart. | P0 |
| US-C02 | As a customer, I want to search and filter products so I can find what suits my needs and budget. | P0 |
| US-C03 | As a customer, I want to wishlist and carry products to a cart so I can decide later. | P0 |
| US-C04 | As a customer, I want to complete a checkout and see an order confirmation once my payment is received. | P0 |
| US-C10 | As a customer, I want a QR code for the exact amount of my order so I can pay from any UPI app without typing the amount. | P0 |
| US-C11 | As a customer, I want to see my payment status update by itself, retry if it fails or expires, and keep my cart safe meanwhile. | P0 |
| US-C05 | As a new customer, I want to take a short quiz so the store understands my goals. | P1 |
| US-C06 | As a customer, I want to see recommended products with a match percentage and the reason. | P1 |
| US-C07 | As a customer, I want a step-by-step routine with a bundle price so I can buy everything together. | P2 |
| US-C08 | As a returning customer, I want to see my activity and profile so I understand my preferences. | P2 |
| US-C09 | As a customer, I want to receive relevant offers when I return. | P1 |

**Admin**

| ID | Story | Priority |
|---|---|---|
| US-A01 | As an admin, I want a secure login so only I can access analytics and management. | P0 |
| US-A02 | As an admin, I want to add, edit, deactivate products and update stock so the store stays current. | P0 |
| US-A03 | As an admin, I want to see revenue, orders and conversion so I can track performance. | P0 |
| US-A04 | As an admin, I want to compare views, wishlists, carts and purchases per product so I find lost sales. | P1 |
| US-A05 | As an admin, I want to see customer segments and drill into a customer's behaviour timeline. | P1 |
| US-A06 | As an admin, I want to create a targeted campaign for a segment. | P1 |
| US-A07 | As an admin, I want to see live visitor activity. | P2 |
| US-A08 | As an admin, I want to understand review sentiment. | P2 |
| US-A09 | As an admin, I want to see every payment with its status and verify or reject unconfirmed ones so no paid order is missed and no unpaid order is shipped. | P0 |
| US-A10 | As an admin, I want payments to land in my configured account and to see which payment mode is active. | P1 |

---

## 6. System Architecture

### 6.1 High-Level Architecture

```
                         ┌──────────────────────────┐
                         │      React + Vite SPA     │
                         │  Customer UI   Admin UI   │
                         └─────────────┬────────────┘
                                       │ Firebase SDK
     ┌───────────────┬─────────────────┼─────────────────┬────────────────┐
     ▼               ▼                 ▼                 ▼                ▼
┌──────────┐  ┌─────────────┐  ┌───────────────┐  ┌────────────┐  ┌────────────┐
│   Auth   │  │  Firestore  │  │   Realtime DB │  │  Storage   │  │ Analytics  │
│ + claims │  │ (primary)   │  │ presence/live │  │ images     │  │ GA events  │
└────┬─────┘  └──────┬──────┘  └───────┬───────┘  └────────────┘  └────────────┘
     │               │ triggers        │
     │               ▼                 │
     │        ┌─────────────────────────────────────┐
     └───────▶│          Cloud Functions            │◀──────┘
              │ behaviour · scoring · recs · orders │
              │ segmentation · analytics aggregation│
              └─────────────────────────────────────┘
```

### 6.1A Payment Path (v2.1)

```
 Customer browser (React)              Cloud Functions                         Provider / UPI network
 ────────────────────────              ───────────────                         ──────────────────────
 Checkout ── placeOrder ───────────▶   validate stock · reprice in paise
                                       create order = pending_payment
                                       reserve stock · set expiresAt
 Payment page ─ createPaymentSession ▶ read amount FROM THE ORDER ──────────▶  create single-use,
                                       save payments/{id}                      fixed-amount UPI QR
 ◀──────── QR payload (UPI link) ────  ◀───────────────────────────────────    (gateway mode)
 Draw QR for the exact amount          or build the UPI link itself (direct mode)
 Customer scans in any UPI app ─────────────────────────────────────────────▶  UPI payment ─▶ store account
                                       paymentWebhook ◀─────────────────────   signed "payment received"
                                       verify signature · match order/amount · dedupe
                                       markOrderPaid (one transaction):
                                         order = confirmed, paymentStatus = paid
                                         clear cart · count campaign redemption
                                         write `purchase` event
 Order listener flips to "Paid" ◀───   (Firestore real-time listener)
                                       onOrderPaid ─▶ score · segment · recommendations
```

In `direct_upi` mode there is no webhook: the customer submits the UTR (bank reference) and an admin confirms it, after which the same `markOrderPaid` runs. In `demo` mode a dev-only button calls `markOrderPaid`. Full detail is in 7.10 and Appendix E.

### 6.2 Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | React with Vite | SPA, fast dev and build |
| Styling | Tailwind CSS | Utility-first design system |
| Language | JavaScript (TypeScript optional) | Application code |
| Charts | Recharts or Chart.js | Admin visualizations |
| Auth | Firebase Authentication | Email/password, Google Sign-In, custom claims |
| Primary DB | Cloud Firestore | Products, users, orders, events, reviews, etc. |
| Live DB | Firebase Realtime Database | Presence and live activity only |
| Files | Firebase Storage | Product images |
| Backend logic | Cloud Functions for Firebase | Triggers, scheduled jobs, callables |
| Event analytics | Firebase Analytics | Aggregate usage analytics |
| Hosting | Firebase Hosting | Deployment |
| Dev tooling | Firebase Emulator Suite | Local testing of rules and functions |
| Payments | UPI QR through a payment provider (suggested default: Razorpay QR Codes API, single-use fixed-amount UPI QR); direct UPI link as fallback | Dynamic QR plus webhook confirmation; provider swappable (ADR-12) |
| QR rendering | `qrcode.react` (or `qrcode`) | Draws the QR in the browser from the server-supplied payload |
| Secrets | Firebase Functions secrets (Secret Manager) | Provider key secret and webhook secret, never in the repo or client |

### 6.3 Architecture Decision Records

| ADR | Decision | Rationale | Trade-off |
|---|---|---|---|
| ADR-01 | Use Firebase end to end; no separate Flask/Python backend | Fewer moving parts, one deployment, built-in auth and rules | Less flexibility for heavy analytics |
| ADR-02 | Firestore is the primary database; Realtime Database only for presence/live activity | Firestore suits structured queries; RTDB suits ephemeral real-time state | Two databases to manage |
| ADR-03 | All scores computed in Cloud Functions | Prevents client tampering; consistent logic | Slight latency; requires functions deployment |
| ADR-04 | Use both Firebase Analytics and Firestore `behaviourEvents` | GA for aggregate trends; Firestore for per-user logic, timelines and dashboards | Event duplication (small) |
| ADR-05 | Orders are created through a callable function (`placeOrder`) that re-prices items server-side | Prevents price and discount tampering from the client | More backend code than direct writes |
| ADR-06 | Role-based access via custom claims plus Security Rules | Frontend checks are UX only; rules are the real enforcement | Claims need an admin script to set |
| ADR-07 | Rule-based recommendations in v1 | Transparent, explainable, quick to build | Less accurate than ML |
| ADR-08 | ~~Demo payment only~~ **Superseded in v2.1 by ADR-09 to ADR-12** | – | – |
| ADR-09 | Pay by an exact-amount UPI QR generated server-side for each order | UPI is the dominant payment method in India; a QR needs no card data (no card-data compliance scope); the exact amount removes typing mistakes | UPI only at first |
| ADR-10 | `gateway` mode (provider-made dynamic QR plus signed webhook) is the recommended path; `direct_upi` with admin verification is the fallback; `demo` mode exists for tests | A plain UPI QR to a UPI ID cannot tell the server that money arrived. Only a provider callback or a human checking the statement can | Gateway needs a merchant account (KYC) and the Firebase Blaze plan; direct mode is manual |
| ADR-11 | Orders start as `pending_payment` and become `confirmed` only inside one server transaction (`markOrderPaid`) | Unpaid orders never count as revenue or fire `purchase` events; one choke point to test | More states to handle (expiry, late payment) |
| ADR-12 | Provider behind a small interface; money handled as integer paise | Provider can change without rewriting flows; avoids float rounding differences between the order total and the QR amount | Slight abstraction overhead |

### 6.4 Core Backend Flow

```
USER ACTION → Frontend → Firebase Auth (UID) → Firestore behaviourEvent
   → Cloud Function trigger → behaviour calculation
   → update GlowScore · Intent · Segment · Recommendation signals
   → Frontend receives updated data (real-time listener)
```

---

## 7. Functional Requirements: Customer Application

Requirement format: **ID | Requirement | Priority | Acceptance criteria**

### 7.1 Authentication and Account (FR-AUTH)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-AUTH-01 | Register with email and password | P0 | Valid email/password creates an Auth user and a `users/{uid}` document with `role: "customer"` |
| FR-AUTH-02 | Login and logout | P0 | Session persists on refresh; logout clears session and protected routes redirect to login |
| FR-AUTH-03 | Google Sign-In | P1 | First Google login creates a `users/{uid}` doc; later logins reuse it |
| FR-AUTH-04 | Password reset | P1 | Reset email triggers via Firebase Auth; UI confirms |
| FR-AUTH-05 | Protected routes | P0 | Unauthenticated users cannot access cart, checkout, profile, orders |
| FR-AUTH-06 | Role isolation | P0 | A customer navigating to `/admin` is blocked in UI **and** denied by rules |

### 7.2 Home (FR-HOME)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-HOME-01 | Header with logo, nav (Home, Shop, GlowMatch, GlowRoutine, Offers), search, wishlist, profile, cart | P0 | Visible on all customer pages; cart shows live item count |
| FR-HOME-02 | Hero with CTAs "Discover My Glow" and "Explore Products" | P0 | CTA routes to Glow Quiz and Shop respectively |
| FR-HOME-03 | Shop by Goal tiles (Skincare, Makeup, Haircare, Fragrance, Body Care, Personal Care) | P0 | Click filters Shop by category and logs `category_view` |
| FR-HOME-04 | "Picked for you" section for logged-in users | P1 | Shows top recommendations from `recommendations/{uid}` with reason text; falls back to trending for new users |
| FR-HOME-05 | Trending section | P1 | Ranked using aggregated views, wishlists, carts, purchases |
| FR-HOME-06 | "Your Glow Journey" summary | P2 | Shows counts of viewed, wishlisted, carted, purchased from the user's events |
| FR-HOME-07 | Active offer banner | P1 | Shows a personalized campaign when the user's segment matches an active campaign |

### 7.3 Shop and Search (FR-SHOP)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-SHOP-01 | Product grid with category tabs | P0 | Only `active: true` products load; empty state shown when none |
| FR-SHOP-02 | Filters: price, brand, rating, category/subcategory, skin type, concern, discount | P0 | Filters combine (AND) and update results without a full reload |
| FR-SHOP-03 | Sorting: Recommended, Popular, Price low-high, Price high-low, Rating, Newest | P0 | Sort order verified against data |
| FR-SHOP-04 | Search by name, brand, tag, category | P0 | Query returns relevant products; a `search` event is logged with the query string |
| FR-SHOP-05 | Product card (image, wishlist heart, name, brand, rating, price, discount, Add to Cart) | P0 | All fields render; wishlist toggles instantly |
| FR-SHOP-06 | Match badge ("82% Match") on cards for logged-in users | P1 | Badge value comes from the user's recommendation scores |
| FR-SHOP-07 | Pagination or lazy loading | P1 | No more than 24 products rendered per page load |

### 7.4 Product Detail (FR-PDP)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-PDP-01 | Display image, name, brand, rating, price, discount, stock | P0 | Out-of-stock disables Add to Cart |
| FR-PDP-02 | Tabs: Description, Ingredients, How to use, Suitable for, Reviews | P1 | Content loads from the product document and reviews collection |
| FR-PDP-03 | Add to Cart and Wishlist actions | P0 | Each logs `cart_add` / `wishlist_add` |
| FR-PDP-04 | Log `product_view` on load | P0 | One event per product view per session (debounced) |
| FR-PDP-05 | "Why GlowShine recommends this" panel | P1 | Shows match % and ticked reasons (category, goal, budget, behaviour, similar customers) |
| FR-PDP-06 | Similar products | P1 | At least 4 products from the same subcategory |
| FR-PDP-07 | Submit review (verified purchasers only) | P1 | Review form appears only if the user has a delivered or confirmed (paid) order containing the product; `pending_payment`, `expired` and `cancelled` orders do not qualify |

### 7.5 Glow Quiz and Glow Profile (FR-QUIZ, FR-PROF)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-QUIZ-01 | 5-question onboarding: interests, main goal, budget, shopping frequency, what matters most | P1 | Answers saved to `users/{uid}.beautyProfile`; `quiz_complete` event logged |
| FR-QUIZ-02 | Quiz is skippable and retakable | P1 | Skipping does not block shopping; retake overwrites profile |
| FR-PROF-01 | "My Glow Profile" page | P2 | Shows interest breakdown and shopping style (budget sensitivity, brand loyalty, exploration, purchase frequency) |
| FR-PROF-02 | Customer-facing score visibility | P2 | Internal fields (GlowScore, intent, segment) are **not** exposed raw. The profile shows friendly labels only |

> Per the plan, customers do not need to see internal scores. If a GlowScore is shown on the profile page, present it as a friendly "Glow Level".

### 7.6 GlowMatch and GlowRoutine (FR-MATCH, FR-ROUT)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-MATCH-01 | "Made for Your Glow" ranked list with match % | P1 | Top 10 products by recommendation score; descending order |
| FR-MATCH-02 | Reason text per recommendation | P1 | Human-readable explanation (e.g., "You recently explored hydration-focused skincare products.") |
| FR-MATCH-03 | Log `recommendation_click` | P1 | Click logs the product, position and score |
| FR-ROUT-01 | Routine builder by goal (e.g., Hydration) | P2 | Produces ordered steps: Cleanser, Serum, Moisturizer, Sunscreen |
| FR-ROUT-02 | Bundle pricing | P2 | Shows individual total, bundle price and savings (e.g., ₹1,946 vs ₹1,699, save ₹247) |
| FR-ROUT-03 | Add whole routine to cart | P2 | One click adds all steps; logs `routine_create` |

### 7.7 Wishlist (FR-WISH)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-WISH-01 | Add or remove wishlist items | P0 | Stored at `wishlists/{uid}/items/{productId}`; logs `wishlist_add` / `wishlist_remove` |
| FR-WISH-02 | Wishlist page | P0 | Lists items with price, stock and move-to-cart |
| FR-WISH-03 | Wishlist insights | P2 | Price-drop and popularity hints, e.g., "price dropped ₹699 to ₹599" |

### 7.8 Cart, Checkout and Orders (FR-CART, FR-ORD)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-CART-01 | Cart persisted per user at `carts/{uid}` | P0 | Survives refresh and re-login |
| FR-CART-02 | Update quantity and remove items | P0 | Totals recompute; logs `cart_add` / `cart_remove` |
| FR-CART-03 | Totals: subtotal, discount, delivery, total | P0 | Calculation matches the server-side calculation at order time to the paisa; the total shown is exactly the amount the payment QR will request |
| FR-CART-04 | "You may also like" | P1 | Based on co-purchase or category affinity |
| FR-ORD-01 | Checkout steps: Address, Order Summary, Pay by UPI QR | P0 | Cannot skip steps; logs `checkout_start`; the payment step opens only after `placeOrder` succeeds |
| FR-ORD-02 | Order creation via callable `placeOrder` | P0 | Server validates stock, recomputes prices in integer paise, ignores client-submitted totals; creates the order as `pending_payment` with an expiry; repeating the call with the same idempotency key returns the same order |
| FR-ORD-03 | Order confirmation page and "My Orders" | P0 | Confirmation shows only when the order is `confirmed` with `paymentStatus: "paid"`; a pending order shows a "Complete payment" action with the time left |
| FR-ORD-04 | Stock reservation and release | P0 | Stock reduces atomically in the `placeOrder` transaction; it returns to stock exactly once if the order expires or is cancelled |
| FR-ORD-05 | Post-payment effects | P0 | Only after verified payment: `purchase` event created, cart cleared, campaign redemption counted, GlowScore and recommendations refresh |
| FR-ORD-06 | Campaign discount application | P1 | Eligible active campaign applied server-side only; redemption is counted only when the order is paid |
| FR-ORD-07 | Order status lifecycle | P0 | Statuses change only through server code, following the transitions in 7.10.4 |
| FR-ORD-08 | My Orders status chips | P1 | Shows Awaiting payment, Confirmed, Shipped, Delivered, Expired, Cancelled |
| FR-ORD-09 | One open pending order per cart | P0 | Starting checkout again reuses or replaces the open pending order; stock is never reserved twice for the same cart |

### 7.9 Beauty Journey (FR-JRN)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-JRN-01 | Chronological timeline of the user's own activity | P2 | Groups events by day; shows views, wishlist, cart, purchase and recommendations |

### 7.10 Payments: UPI QR (FR-PAY)

Every order is paid by scanning a **QR code that encodes the exact order total**, or, on a phone, by tapping a link that opens the customer's UPI app. The amount is computed on the server from the stored order, never taken from the browser, and the money goes to the **store's payee account**, which the product owner configures (customers cannot change it).

#### 7.10.1 Payment modes

One setting, `PAYMENT_MODE`, switches the mode without a code change.

| Mode | How the QR is produced | How payment is confirmed | Where the money lands | Assurance |
|---|---|---|---|---|
| `gateway` (recommended) | Server asks the payment provider for a single-use, fixed-amount UPI QR for this order | Signed provider webhook, with a status-fetch fallback | Bank account linked to the store's merchant account at the provider (settled on the provider's schedule) | High: automatic and amount-matched |
| `direct_upi` | Server builds a standard UPI payment link for the store's own UPI ID (VPA); the browser draws it as a QR | Customer submits the UTR (bank reference); an admin verifies it against the bank or UPI statement | The store's UPI ID directly, no provider fee | Medium: manual, human in the loop |
| `demo` | Same screen with a placeholder QR | Dev-only "Simulate payment" button (emulator and dev builds only) | Nowhere, no real money | None: for tests and offline demos |

> **Why two real modes:** a plain UPI QR to a UPI ID cannot tell the server that money arrived. Only a provider callback or a person reading the statement can. `gateway` is therefore the way to get "pay, then the order confirms by itself". `direct_upi` is the fallback when no gateway account is available, and it must never auto-confirm.

#### 7.10.2 Requirements

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-PAY-01 | Payment step after order summary | P0 | Opens only after `placeOrder` returns a `pending_payment` order; shows order id, exact amount, QR, countdown and status |
| FR-PAY-02 | Exact amount | P0 | QR amount equals the stored order total (integer paise, shown as ₹ with 2 decimals); the amount is also printed beside the QR; no client input can change it |
| FR-PAY-03 | Server-side payment session | P0 | Callable `createPaymentSession(orderId)` checks auth and ownership, reads the amount from the order (ignores any amount in the request), and is idempotent: a second call returns the existing active session |
| FR-PAY-04 | QR rendering | P0 | Browser draws the QR from the server-supplied payload; at least 220 px with a quiet zone; scannable by common UPI apps |
| FR-PAY-05 | "Pay with UPI app" button | P1 | On mobile, opens the UPI link in an installed UPI app; hidden on desktop; in `direct_upi` mode a "Copy UPI ID" fallback is shown |
| FR-PAY-06 | Expiry | P0 | Session and order expire after `PAYMENT_EXPIRY_MINUTES` (default 15); countdown shown; expired QR is hidden and closed at the provider; the cart is preserved and "Try again" starts a fresh checkout |
| FR-PAY-07 | Live status | P0 | The page listens to the order document and moves to confirmation within 5 s of the server marking it paid; in `gateway` mode a rate-limited `refreshPaymentStatus` poll covers delayed webhooks |
| FR-PAY-08 | Confirm only on verified payment | P0 | `status: confirmed` and `paymentStatus: paid` are set only by server code (`markOrderPaid`) after verification; clients can never set them |
| FR-PAY-09 | Webhook verification (`gateway`) | P0 | Signature checked over the raw request body with the webhook secret; invalid requests rejected; events deduplicated by provider event id |
| FR-PAY-10 | Amount, currency and order match | P0 | Paid amount in paise must equal the order's `amountPaise` and currency must be INR; a mismatch sets `amount_mismatch`, does not confirm the order, and alerts admin |
| FR-PAY-11 | Reference submission (`direct_upi`) | P0 | Customer enters the UTR (12 digits); format validated; unique across all orders; status becomes `reference_submitted` and the UI says "Awaiting store verification" |
| FR-PAY-12 | Late, duplicate, over- and under-payments | P1 | Payment after expiry becomes `paid_after_expiry` and goes to the admin queue (fulfil if stock allows, otherwise refund); a duplicate payment is flagged and never confirms an order twice |
| FR-PAY-13 | Failure and retry | P0 | Provider-reported failure or customer cancel sets `failed` or `cancelled`, shows a clear message, and offers "Try again" with a new QR |
| FR-PAY-14 | Cancel pending order | P1 | Customer can cancel a `pending_payment` order; QR is closed at the provider and stock is released |
| FR-PAY-15 | Receipt | P1 | Confirmation page shows order id, amount paid, masked payment reference, time and is printable |
| FR-PAY-16 | Maximum order value | P1 | Orders above `MAX_UPI_ORDER_VALUE` (default ₹1,00,000, configurable because UPI limits vary by bank and app) are rejected at checkout with a clear message |
| FR-PAY-17 | Mode labelling | P0 | `demo` shows "TEST MODE: no money is charged"; `direct_upi` shows that confirmation is done by the store; the active mode is visible to admins |
| FR-PAY-18 | Payment events | P0 | Server writes `payment_initiated`, `payment_success`, `payment_failed`, `payment_expired`; `purchase` is written on success only |
| FR-PAY-19 | Refund record | P2 | Admin can record a refund as initiated or completed with a reference; the refund itself is made outside the app (provider dashboard or UPI) |
| FR-PAY-20 | Provider downtime handling | P2 | If the provider is unreachable or reports UPI downtime, the page shows a friendly retry message; the order is never confirmed on an error |

#### 7.10.3 Payment page experience

- Large amount (for example **₹629.10**) and "Pay GlowShine Co." above the QR; order id and a countdown (for example 14:32) below it.
- Three short steps: open any UPI app, scan the QR, confirm that the amount shown matches, then keep this page open.
- Status chip that updates itself: Waiting for payment, Verifying, Paid, Expired, Failed.
- Mobile: "Pay with UPI app" button; desktop: QR only.
- `direct_upi` mode: "I have paid" opens a field for the UTR, then shows "Awaiting store verification".
- Reassurance line: your UPI PIN is entered only inside your UPI app; GlowShine never sees it.
- Secondary actions: Cancel order, Back to cart (after expiry), Contact support.
- Collapsible order summary; works at 360 px width.

#### 7.10.4 State machines

**Order `status`** (changed only by server code)

| Status | Meaning | Can move to |
|---|---|---|
| `pending_payment` | Order created, stock reserved, QR active | `confirmed`, `expired`, `cancelled` |
| `confirmed` | Payment verified | `shipped`, `delivered`, `cancelled` (with refund record) |
| `shipped` / `delivered` | Simulated fulfilment (status values only) | `delivered`; none |
| `expired` | Payment window ended unpaid, stock released | none (customer starts a new checkout) |
| `cancelled` | Cancelled by customer or admin | none |

**Payment `paymentStatus`**

| Status | Meaning |
|---|---|
| `awaiting_payment` | QR created and shown |
| `reference_submitted` | `direct_upi` only: UTR entered, waiting for admin |
| `paid` | Verified; order confirmed |
| `failed` | Provider failure or admin rejection |
| `expired` | Window ended unpaid |
| `cancelled` | Customer or admin cancelled |
| `amount_mismatch` | Amount or currency differs from the order; admin review |
| `paid_after_expiry` | Money arrived after the order expired; admin review |
| `refund_pending` / `refunded` | Refund recorded by admin |

---

## 8. Functional Requirements: Behaviour Intelligence Engine

### 8.1 Event Catalogue (FR-EVT)

All events are written to `behaviourEvents` and, where applicable, mirrored to Firebase Analytics.

| Event type | Trigger | Required fields | GA mapping |
|---|---|---|---|
| `page_view` | Route change | userId, sessionId, path | `page_view` |
| `search` | Search submitted | query, resultCount | `search` |
| `category_view` | Category opened | category | custom |
| `product_view` | Product detail opened | productId, category | `view_item` |
| `wishlist_add` | Heart on | productId | `add_to_wishlist` |
| `wishlist_remove` | Heart off | productId | custom |
| `cart_add` | Add to cart | productId, quantity | `add_to_cart` |
| `cart_remove` | Remove from cart | productId | `remove_from_cart` |
| `checkout_start` | Checkout begun | cartValue | `begin_checkout` |
| `purchase` | **Payment verified** and order confirmed (server-written) | orderId, value | `purchase` |
| `payment_initiated` | Payment QR created (server-written) | orderId, amount, mode | `add_payment_info` |
| `payment_success` | Payment verified (server-written) | orderId, amount, mode | custom |
| `payment_failed` | Payment failed or rejected (server-written) | orderId, reason | custom |
| `payment_expired` | Window ended unpaid (server-written) | orderId, amount | custom |
| `review_submit` | Review posted | productId, rating | custom |
| `quiz_complete` | Quiz finished | answers summary | `glow_quiz_complete` |
| `routine_create` | Routine generated | goal | `routine_created` |
| `recommendation_click` | Recommendation clicked | productId, score, position | `recommendation_click` |
| `offer_click` | Campaign clicked | campaignId | `offer_click` |

**Requirements**

| ID | Requirement | Pri |
|---|---|---|
| FR-EVT-01 | Event writes are append-only; clients may only create events for their own UID with an allow-listed `eventType` | P0 |
| FR-EVT-02 | Every event carries `userId`, `eventType`, `timestamp` (server time), `sessionId` | P0 |
| FR-EVT-03 | Duplicate suppression for rapid repeats (e.g., same product view within 30 seconds) | P1 |
| FR-EVT-04 | Event tracking must never block or break the UI (fire-and-forget with error handling) | P0 |
| FR-EVT-05 | Anonymous (not logged-in) browsing may be tracked under an anonymous Auth UID and merged on login | P2 |
| FR-EVT-06 | `purchase` and all `payment_*` events are written only by Cloud Functions; they are not in the client allow-list | P0 |

### 8.2 GlowScore (FR-SCORE)

**Purpose:** a 0–100 engagement-and-value indicator per customer, computed server-side.

**Event point values (from plan)**

| Event | Points |
|---|---|
| Product view | +2 |
| Search | +3 |
| Wishlist add | +5 |
| Add to cart | +10 |
| Checkout start | +15 |
| Purchase | +25 |
| Review | +5 |
| Repeat purchase | +15 |

**Sub-scores**

| Sub-score | Inputs | Meaning |
|---|---|---|
| Engagement | Views + searches + wishlist | How actively they explore |
| Purchase Intent | Cart + checkout + repeat visits | How close they are to buying |
| Loyalty | Repeat purchases + same-brand purchases | How strongly they return |
| Price Sensitivity | Discount purchases + offer clicks + sale browsing | How deal-driven they are |

**Computation (proposed defaults, configurable in one config file)**

```
GlowScore = clamp(0..100,
    0.30 × Engagement
  + 0.30 × PurchaseIntent
  + 0.25 × Loyalty
  + 0.15 × Monetary(totalSpend, orderCount) )
Each sub-score is normalised to 0–100 using a capped scale:
    sub = min(100, rawPoints / capForSubScore × 100)
```

Price Sensitivity is stored as a separate profile attribute (Low/Medium/High) and is **not** part of the GlowScore sum.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-SCORE-01 | Recompute on each qualifying event via Cloud Function | P1 | `users/{uid}.analytics.glowScore` updated within 15 s |
| FR-SCORE-02 | Score is computed only server-side; clients cannot write it | P0 | Rules reject any client write to `analytics.*` |
| FR-SCORE-03 | Weights and caps live in a single config document or file | P1 | Changing config changes results without code edits |
| FR-SCORE-04 | Time decay (optional): events older than 90 days count at reduced weight | P2 | Documented and testable |

### 8.3 GlowIntent (FR-INTENT)

Rolling **7-day** purchase-intent score, clamped to 0–100.

| Signal | Points |
|---|---|
| Views | +10 |
| Repeated views of the same product | +10 |
| Wishlist | +15 |
| Cart | +25 |
| Checkout started | +30 |

| Band | Range |
|---|---|
| Low | 0–30 |
| Medium | 31–65 |
| High | 66–100 |

Worked example: views 10 + wishlist 15 + cart 25 + checkout 30 = **80 → High intent**.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-INTENT-01 | Compute per user; store score and band | P1 | Stored in `users/{uid}.analytics.purchaseIntent` |
| FR-INTENT-02 | A confirmed (paid) purchase resets cart and checkout intent for the purchased items | P1 | Intent drops after payment is verified, not after the order is merely created |
| FR-INTENT-03 | High intent plus no paid order within a configurable window flags a **lost-sale alert** | P1 | Alert visible in admin with product, user and cart value; an expired or abandoned payment session is shown with the reason "Payment abandoned" |

### 8.4 Customer Segmentation (FR-SEG)

| Segment | Rule (proposed thresholds, configurable) |
|---|---|
| 👑 Glow Elite | `totalSpend > 5000` AND `purchases ≥ 4` |
| 💰 Glow Saver | `discountPurchases / totalPurchases > 0.6` |
| 🔍 Glow Explorer | `views > 15` AND `purchases < 2` |
| ❤️ Glow Loyal | `repeatBrandPurchases ≥ 3` |
| 🌱 Glow Care | Skincare is the dominant category (50% or more of purchases or views) |
| 💄 Glow Glam | Makeup is the dominant category (50% or more of purchases or views) |
| 💤 Glow Dormant | `daysSinceLastPurchase > 60` |

**Precedence (first match wins):** Elite → Dormant → Loyal → Saver → Explorer → Care / Glam → *Unsegmented (new)*.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-SEG-01 | Segment assigned/refreshed by function (on order and on a daily schedule) | P1 | `users/{uid}.analytics.segment` populated |
| FR-SEG-02 | Segment counts and metrics aggregated for admin | P1 | Count, revenue, AOV, favourite category and brands, conversion, purchase frequency per segment |
| FR-SEG-03 | Segment change is logged | P2 | History kept for transitions (e.g., Explorer → Care) |

### 8.5 Recommendation Engine (FR-REC)

**Recommendation score per (user, product), 0–100**

| Component | Max points | Logic |
|---|---|---|
| Interest match | 30 | Product category/subcategory in quiz interests or goal |
| Category match | 20 | Based on recent view/cart/purchase category affinity |
| Price match | 15 | Price within the user's budget band |
| Purchase history | 15 | Complements past purchases (e.g., bought cleanser, so moisturizer scores high); penalty if recently bought |
| Behaviour similarity | 10 | Similar to viewed/wishlisted products (tags, concerns, skin types) |
| Popularity | 10 | Normalised trending score |
| **Total** | **100** | Displayed as "94% Match" |

**Seed rule examples (also used for reason text)**

- More than 3 skincare views → boost skincare.
- Purchased cleanser → recommend moisturizer.
- Wishlisted sunscreen → recommend similar sunscreens.
- Frequent Brand A purchases → prioritise Brand A.
- High price sensitivity → prioritise discounted products.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-REC-01 | Compute top-N recommendations per user and store at `recommendations/{uid}` | P1 | N is 20 or more; each item has `productId`, `score`, `reasons[]` |
| FR-REC-02 | Refresh on purchase, quiz completion, and significant behaviour change | P1 | Recommendations differ before/after a relevant event |
| FR-REC-03 | Cold start | P1 | New users see trending and goal-based products |
| FR-REC-04 | Exclude inactive and out-of-stock products | P0 | Never recommend unavailable items |
| FR-REC-05 | Explainability | P1 | Every recommendation includes human-readable reasons |

### 8.6 GlowPredict (FR-PRED)

Predicts the likely next repurchase.

```
avgInterval   = mean(days between purchases of the same product/subcategory)
daysSince     = today − lastPurchaseDate
ratio         = daysSince / avgInterval
```

| Ratio | Likelihood |
|---|---|
| ≥ 0.85 | High |
| 0.60 – 0.85 | Medium |
| < 0.60 | Low |

Example: face wash, 30-day interval, 27 days since purchase → ratio 0.90 → **High; expected within 3–5 days**.

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-PRED-01 | Requires 2 or more purchases of an item/subcategory, otherwise uses category default interval | P2 | Documented fallback |
| FR-PRED-02 | Daily scheduled computation | P2 | Results stored per user |
| FR-PRED-03 | Admin sees "due soon" customers; customer sees a restock nudge | P2 | Visible in both UIs |

### 8.7 GlowTrend (FR-TREND)

```
activity(window) = Σ (event points for views, searches, wishlist, cart, purchases)
growth%          = (activity(last 7d) − activity(previous 7d)) / activity(previous 7d) × 100
```

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-TREND-01 | Compute growth per product and category | P2 | Stored in `analyticsSnapshots` |
| FR-TREND-02 | Minimum-volume threshold to avoid noisy percentages | P2 | Items below threshold are excluded |
| FR-TREND-03 | "Rising products" list (e.g., Sunscreen +28%) shown to admin and on Home trending | P2 | Sorted by growth |

### 8.8 Review Sentiment (FR-SENT)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-SENT-01 | Rule-based classification (rating + keyword lists) on review create | P2 | Review gets `sentiment: positive / neutral / negative` |
| FR-SENT-02 | Keyword extraction for common positive/negative terms (e.g., hydrating, lightweight vs expensive, packaging) | P2 | Top terms shown in admin |

### 8.9 Offers and Campaign Targeting (FR-OFFER)

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-OFFER-01 | Campaign defined by segment, category, discount %, start, end | P1 | Stored in `campaigns` |
| FR-OFFER-02 | Eligible customers see the offer on Home/Cart | P1 | Logged as impression; click logs `offer_click` |
| FR-OFFER-03 | Personalized offer for a specific user (lost-sale recovery) | P1 | Admin can target one user and a product |
| FR-OFFER-04 | Discount applied server-side in `placeOrder` | P0 | Client cannot forge discounts |

---

## 9. Functional Requirements: Admin Console

**Navigation:** Dashboard · Sales · Customers · Behaviour · Products · Segments · Campaigns · Reviews · Payments

| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| FR-ADM-01 | Admin-only access (UI guard + custom claim `admin: true` + rules) | P0 | Non-admin read/write to admin data fails at the database |
| FR-ADM-02 | **Dashboard KPIs:** Revenue, Customers, Active Users, Conversion, AOV | P0 | Values derived from Firebase; refresh on load |
| FR-ADM-03 | **Sales:** revenue over time, category revenue, best sellers, orders, AOV | P0 | Date-range filter (7d / 30d / 90d / custom) |
| FR-ADM-04 | **Behaviour:** most viewed, searched, wishlisted, carted, purchased | P0 | Top-10 lists per metric |
| FR-ADM-05 | **Product Opportunity Matrix** (interest vs purchase scatter or quadrant) | P1 | Product click opens funnel metrics and recommended action |
| FR-ADM-06 | **Funnel:** Visitors → Views → Engagement → Cart → Checkout → Payment started → Purchase | P1 | Conversion computed at each step |
| FR-ADM-07 | **Cart abandonment** | P1 | Carts created vs checkouts vs payments started vs purchases; abandoned count; "payment abandoned or expired" is a measured reason, other reasons are shown only if collected (otherwise labelled "demo estimate") |
| FR-ADM-08 | **Customers:** searchable list with segment, score, intent, orders, spend | P1 | Sort and filter |
| FR-ADM-09 | **Customer detail:** profile, scores, segment, favourites, orders, behaviour timeline | P1 | Timeline displays events chronologically with timestamps |
| FR-ADM-10 | **Segments dashboard:** counts, revenue, AOV, favourite category/brands, conversion | P1 | Click a segment to see members |
| FR-ADM-11 | **Product management:** add, edit, deactivate, stock, image upload | P0 | Changes appear on the storefront immediately |
| FR-ADM-12 | **Campaign builder** | P1 | Create / edit / pause campaigns; see impressions, clicks, redemptions |
| FR-ADM-13 | **Review analytics:** sentiment split, top keywords | P2 | Positive / neutral / negative percentages |
| FR-ADM-14 | **Live activity:** customers browsing now, viewing a category, carts created in the last 5 minutes | P2 | Driven by Realtime Database; updates without refresh |
| FR-ADM-15 | **Lost-sales alerts** | P1 | List of high-intent users/products without purchase, with "Create offer" action |
| FR-ADM-16 | **Payments console** | P0 | List and filter payments by status, mode and date; search by order id, UTR or provider id; detail view with timeline; badge for items needing action (`reference_submitted`, `amount_mismatch`, `paid_after_expiry`) |
| FR-ADM-17 | **Verify or reject payments** | P0 | In `direct_upi` mode the admin confirms or rejects a submitted UTR after matching it to the statement and the amount; action is audit-logged; non-admins are denied |
| FR-ADM-18 | **Payment settings** | P1 | Shows the active mode, payee display name, masked payee UPI ID and expiry minutes; changing the payee needs re-authentication and a confirmation dialog and is audit-logged; secrets are never displayed |
| FR-ADM-19 | **Reconciliation report** | P2 | Day-wise paid totals and counts exportable as CSV, to compare with the provider settlement or bank statement; includes a clear label when demo/test payments are present |

### 9.1 Opportunity Matrix Definition

```
                    HIGH PURCHASE
                         ↑
        WINNERS          |          STAR
                         |
 ────────────────────────┼─────────────────────→ HIGH INTEREST
                         |
      LOW PRIORITY       |       LOST SALES
                         ↓
                    LOW PURCHASE
```

- **Interest index** = weighted views + wishlists + carts (normalised).
- **Purchase index** = purchases (normalised) or conversion rate.
- Thresholds are the median of each axis by default.
- **Flag:** "High interest, low conversion" when interest is above the median and conversion is below the median.

Example: Niacinamide Serum has 1,240 views, 382 wishlists, 214 carts and 68 purchases. The system flags it with the action "Create targeted offer".

---

## 10. Data Model

### 10.1 Firestore Overview

```
Firestore
├── users/{uid}
├── products/{productId}
├── categories/{categoryId}
├── brands/{brandId}
├── behaviourEvents/{eventId}
├── carts/{uid}
├── wishlists/{uid}/items/{productId}
├── orders/{orderId}
├── payments/{paymentId}               # v2.1 (written only by Cloud Functions)
├── paymentEvents/{providerEventId}   # v2.1 (server-only audit and idempotency)
├── utrIndex/{utr}                    # v2.1 (direct_upi: one UTR, one order)
├── reviews/{reviewId}
├── recommendations/{uid}
├── segments/{segmentId}
├── campaigns/{campaignId}
├── analyticsSnapshots/{date}
├── auditLogs/{logId}                 # v2.1 (admin payment actions and settings changes)
└── config/payment                    # v2.1 (server-only; mode, expiry, payee details)
Realtime Database: presence/{uid}, liveActivity/
Storage: /products/{category}/…, /user-assets/…
```

### 10.2 Collection Schemas

**`users/{uid}`**

```js
{
  name: "Chetan",
  email: "user@email.com",
  role: "customer",                 // server-managed; mirrors custom claim
  beautyProfile: {
    interests: ["skincare", "haircare"],
    goals: ["hydration"],
    budget: "500-1000",
    shoppingFrequency: "monthly",
    priority: "ingredients"
  },
  analytics: {                      // WRITTEN ONLY BY CLOUD FUNCTIONS
    glowScore: 82,
    purchaseIntent: 74,
    intentBand: "medium",
    segment: "Glow Explorer",
    priceSensitivity: "medium",
    totalSpend: 6420,
    orderCount: 7,
    lastPurchaseAt: Timestamp,
    updatedAt: Timestamp
  },
  createdAt: Timestamp
}
```

**`products/{productId}`**

```js
{
  name: "Hydrating Face Serum",
  brand: "GlowCare",
  category: "Skincare",
  subcategory: "Serum",
  description: "…", ingredients: "…", howToUse: "…",
  price: 599,
  discount: 10,                     // percent
  rating: 4.6,
  reviewCount: 248,
  skinTypes: ["Oily", "Combination", "Normal"],
  concerns: ["Dryness", "Dullness"],
  tags: ["hydrating", "daily-use"],
  stock: 120,
  imageUrl: "…",
  active: true,
  createdAt: Timestamp, updatedAt: Timestamp
}
```

**`behaviourEvents/{eventId}`**

```js
{
  userId: "abc123",
  eventType: "product_view",
  productId: "prod_102",            // when applicable
  category: "Skincare",
  query: null,                      // for search events
  value: null,                      // cart/purchase value
  meta: {},                         // e.g., position, score, campaignId
  sessionId: "session_82",
  timestamp: Timestamp              // server timestamp
}
```

**`carts/{uid}`**

```js
{
  items: [{ productId: "p101", quantity: 2, price: 599 }],
  subtotal: 1198, discount: 100, total: 1098,
  updatedAt: Timestamp
}
```
> Client cart totals are display-only; `placeOrder` recomputes everything.

**`orders/{orderId}`**

```js
{
  userId: "abc123",
  items: [{ productId, name, quantity, unitPrice, discountApplied }],
  subtotal: 1598, discount: 200, delivery: 0, total: 1398,   // ₹, up to 2 decimals, derived from amountPaise
  amountPaise: 139800,              // SOURCE OF TRUTH for payment (integer paise)
  currency: "INR",
  campaignId: null,
  address: { name, phone, line1, city, state, pincode },
  status: "pending_payment",        // pending_payment, confirmed, shipped, delivered, expired, cancelled
  paymentStatus: "awaiting_payment",// see 7.10.4
  paymentId: "pay_001",
  paymentMode: "gateway",           // gateway, direct_upi, demo (seeded history uses "seed")
  idempotencyKey: "cart-hash-or-uuid",
  expiresAt: Timestamp,             // set while pending_payment
  paidAt: null,                     // Timestamp once verified
  stockReleased: false,             // guards against releasing stock twice
  createdAt: Timestamp
}
```
> All payment arithmetic is done in **integer paise**. Discounts are calculated per line and rounded half-up to the nearest paisa; the rounding rule lives in the central config. `total` (₹) is derived from `amountPaise`, never the other way round. Example: ₹699 with a 10% offer gives 62910 paise, shown as ₹629.10.

**`payments/{paymentId}`** (written only by Cloud Functions)

```js
{
  orderId: "ord_123", userId: "abc123",
  mode: "gateway",                  // gateway, direct_upi, demo
  provider: "razorpay",             // null for direct_upi and demo
  providerRef: "qr_XXXX",           // provider's QR id (gateway)
  providerPaymentId: null,          // set when the provider reports the payment
  amountPaise: 139800, currency: "INR",
  status: "awaiting_payment",       // same values as orders.paymentStatus
  upiPayload: "upi://pay?...",      // the string the browser turns into a QR
  payeeVpaMasked: "st****@bank",    // never the full account details
  reference: null,                  // UTR (direct_upi) or provider payment id
  referenceSubmittedAt: null,
  verifiedBy: null,                 // "webhook", an admin uid, or "demo"
  failureReason: null,
  createdAt: Timestamp, expiresAt: Timestamp, paidAt: null
}
```

**`paymentEvents/{providerEventId}`** (server-only): `{ provider, eventType, receivedAt, paymentId, orderId, payloadHash, rawPayload, result }`. The document id is the provider event id, which is what makes webhook handling idempotent.

**`utrIndex/{utr}`** (server-only): `{ orderId, paymentId, createdAt }`, created in a transaction so one UTR can never confirm two orders.

**`config/payment`** (server-only): `{ mode, expiryMinutes, maxOrderValue, payeeName, payeeVpa, merchantCategoryCode, provider }`. API secrets are **not** stored here; they live in Functions secrets.

**`auditLogs/{logId}`** (admin-read, server-write): `{ actor, action, target, before, after, at }`.

**`reviews/{reviewId}`**

```js
{ userId, productId, orderId, rating: 5, text: "…", sentiment: "positive", keywords: ["hydrating"], createdAt }
```

**`recommendations/{uid}`**

```js
{ items: [{ productId, score: 94, reasons: ["Category match", "Budget match"] }], generatedAt: Timestamp }
```

**`segments/{segmentId}`**: `{ name, description, rules, memberCount, revenue, avgOrderValue, topCategory, topBrands[], conversion, updatedAt }`

**`campaigns/{campaignId}`**

```js
{
  name: "Weekend Skincare Offer",
  targetSegment: "Glow Saver",      // or targetUserId
  category: "Skincare",
  discountPercent: 15,
  startAt: Timestamp, endAt: Timestamp,
  status: "active",                 // draft | active | paused | ended
  stats: { impressions, clicks, redemptions },
  createdBy: "adminUid"
}
```

**`analyticsSnapshots/{date}`**: `{ revenue, orders, newCustomers, activeUsers, conversion, aov, categoryRevenue{}, topProducts[], funnel{}, trending[], productStats{ [productId]: {views, wishlists, carts, purchases} } }`

**Realtime Database**

```json
{
  "presence": { "<uid>": { "online": true, "lastSeen": 1730000000000, "area": "skincare" } },
  "liveActivity": { "browsing": 28, "categories": { "skincare": 7 }, "recentCarts": 3 }
}
```

### 10.3 Indexes (planned)

| Collection | Index | Used for |
|---|---|---|
| `behaviourEvents` | `userId` ASC + `timestamp` DESC | Timeline, per-user scoring |
| `behaviourEvents` | `eventType` ASC + `timestamp` DESC | Admin aggregates |
| `behaviourEvents` | `productId` ASC + `eventType` ASC + `timestamp` DESC | Product analytics |
| `orders` | `userId` ASC + `createdAt` DESC | My Orders |
| `products` | `active` + `category` + `price` | Shop filters |
| `reviews` | `productId` + `createdAt` DESC | Product reviews |
| `orders` | `status` ASC + `expiresAt` ASC | Expiry job for unpaid orders |
| `payments` | `orderId` ASC | Look up the session for an order |
| `payments` | `status` ASC + `createdAt` DESC | Admin payments queue |
| `payments` | `userId` ASC + `createdAt` DESC | Customer payment history |

### 10.4 Data Retention and Volume

- Prototype scale: 40–60 products, a few thousand seeded events, a few hundred seeded customers.
- To keep reads low, dashboards read from `analyticsSnapshots` where possible rather than scanning `behaviourEvents`.
- Events older than 180 days may be archived or deleted by a scheduled function (optional).

---

## 11. Backend: Cloud Functions Specification

| Function | Type | Trigger | Responsibility | Pri |
|---|---|---|---|---|
| `onBehaviourEventCreated` | Firestore trigger | `behaviourEvents/{id}` created | Update user counters, GlowScore, GlowIntent; enqueue recs refresh; update product counters | P0 |
| `placeOrder` | Callable (HTTPS) | Client call | Validate auth, stock and cart; reprice in paise; apply campaign; in one transaction create the order as `pending_payment`, reserve (decrement) stock and set `expiresAt`; honour the idempotency key. Does **not** write `purchase` | P0 |
| `createPaymentSession` | Callable (HTTPS) | Payment page opens | Check auth, ownership and order status; read the amount from the order; (`gateway`) create a single-use fixed-amount QR at the provider; (`direct_upi`) build the UPI link; write `payments/{id}`; log `payment_initiated`; idempotent | P0 |
| `paymentWebhook` | HTTPS | Provider calls the server | Verify signature on the raw body; deduplicate by event id; match order, amount and currency; call `markOrderPaid` or flag `amount_mismatch` / `paid_after_expiry` | P0 (`gateway`) |
| `markOrderPaid` | Shared server function | Webhook, status refresh, admin verify, demo button | The only place that confirms an order: one transaction sets `confirmed` and `paid`, `paidAt`, clears the cart, counts campaign redemption, writes `purchase` and `payment_success`; idempotent | P0 |
| `refreshPaymentStatus` | Callable (HTTPS) | Payment page poll | `gateway`: fetch QR/payment status from the provider and call `markOrderPaid` if paid; rate-limited per order | P1 |
| `submitPaymentReference` | Callable (HTTPS) | Customer enters UTR | `direct_upi` only: validate format, reserve the UTR in `utrIndex`, set `reference_submitted` | P0 (`direct_upi`) |
| `adminVerifyPayment` | Callable (admin) | Admin action | Confirm or reject a submitted reference; on confirm call `markOrderPaid`; write `auditLogs` | P0 (`direct_upi`) |
| `cancelOrder` | Callable (HTTPS) | Customer or admin | Cancel a `pending_payment` order; close the QR at the provider; release stock once | P1 |
| `expireUnpaidOrders` | Scheduled (every 5 min) | Cron | Find `pending_payment` orders past `expiresAt`; re-check the provider once; expire them; release stock once; log `payment_expired` | P0 |
| `updatePaymentSettings` | Callable (admin) | Admin action | Update non-secret payment config after re-authentication; write `auditLogs` | P1 |
| `onOrderPaid` | Firestore trigger | `orders/{id}` updated and `paymentStatus` becomes `paid` | Update spend/orders, segment, GlowPredict inputs, recommendations (replaces the v2.0 `onOrderCreated`) | P1 |
| `computeRecommendations` | Internal / callable | After key events | Calculate scores and write `recommendations/{uid}` | P1 |
| `recomputeSegments` | Scheduled (daily) | Cron | Re-evaluate all customers; refresh segment aggregates | P1 |
| `aggregateAnalytics` | Scheduled (hourly/daily) | Cron | Build `analyticsSnapshots` (KPIs, funnel, category revenue, product stats, trending) | P0 |
| `computePredictions` | Scheduled (daily) | Cron | GlowPredict per user | P2 |
| `detectLostSales` | Scheduled (hourly) | Cron | Flag high-intent users with unpurchased carts | P1 |
| `onReviewCreated` | Firestore trigger | `reviews/{id}` created | Sentiment, keywords, product rating aggregate | P2 |
| `onCampaignWritten` | Firestore trigger | `campaigns/{id}` | Validate window; update status | P2 |
| `setAdminRole` | Admin-only callable / script | Manual | Set custom claim `admin: true` for a UID (bootstrapped via script) | P0 |
| `syncPresence` | RTDB trigger | `presence/{uid}` | Update `liveActivity` aggregates | P2 |

**Function requirements**

| ID | Requirement |
|---|---|
| FR-FN-01 | Functions must be idempotent (a retried trigger must not double-count) |
| FR-FN-02 | Callable functions must verify `context.auth` and reject unauthenticated calls |
| FR-FN-03 | No secrets in client code; configuration via environment config |
| FR-FN-04 | Structured logging for scoring decisions (inputs and outputs) for debugging and demos |
| FR-FN-05 | All thresholds and weights read from a central config module |
| FR-FN-06 | Webhook handlers verify the signature over the **raw** request body before parsing, and reject anything else |
| FR-FN-07 | `markOrderPaid` is the only code path that sets an order to paid; webhook, refresh, admin verify and the demo button all call it |
| FR-FN-08 | Provider keys and the webhook secret are Functions secrets; payee details are server-only config; none appear in the repo, client bundle or logs |
| FR-FN-09 | Provider calls use timeouts and safe retries; a provider error never confirms an order |
| FR-FN-10 | The provider sits behind an interface (`createQr`, `fetchStatus`, `verifyWebhook`, `closeQr`) so it can be swapped |

---

## 12. Security and Access Control

### 12.1 Principles

1. Security Rules are part of the schema. They are written **with** the data model and tested in the Emulator Suite, not added at the end.
2. The frontend hides; the rules enforce.
3. Customers cannot change their role, scores, prices, stock or other people's data.

### 12.2 Roles

| Role | Mechanism | Capabilities |
|---|---|---|
| Visitor (unauthenticated) | No auth | Read active products, categories, brands |
| Customer | Auth user, no admin claim | Own profile (limited fields), own cart, wishlist, orders (read), create own events and reviews, read own recommendations |
| Admin | Custom claim `admin: true` | Manage products/categories/brands/campaigns, read all orders, customers, events, analytics, reviews |
| Cloud Functions | Admin SDK | Bypass rules; sole writer of analytics, segments, recommendations, snapshots, payments and the payment state of orders |

### 12.3 Permission Matrix

| Resource | Visitor | Customer | Admin | Functions |
|---|---|---|---|---|
| `products` (active) | Read | Read | Read / Write | Write (stock, ratings) |
| `categories`, `brands` | Read | Read | Read / Write | – |
| `users/{uid}` | – | Read own; update own profile fields only | Read all | Write `analytics` |
| `behaviourEvents` | – | Create own; read own | Read all | Read / Write |
| `carts/{uid}` | – | Read / Write own | Read | – |
| `wishlists/{uid}/items` | – | Read / Write own | Read | – |
| `orders` | – | Read own; create **via `placeOrder` only**; never write status or payment fields | Read; status changes via callables | Create, confirm, expire |
| `payments` | – | Read own | Read; verify/reject via callable | Write (sole writer) |
| `paymentEvents`, `auditLogs` | – | – | Read | Write |
| `utrIndex`, `config/payment` | – | – | – (settings via callable) | Read / Write |
| `reviews` | Read | Create own (verified purchase); read all | Read / moderate | Write sentiment |
| `recommendations/{uid}` | – | Read own | Read | Write |
| `segments`, `analyticsSnapshots` | – | – | Read | Write |
| `campaigns` | – | Read active matching | Read / Write | Update stats |
| RTDB `presence/{uid}` | – | Write own | Read all | Write `liveActivity` |
| Storage `/products/**` | Read | Read | Write | – |

### 12.4 Illustrative Firestore Rules (to be completed and tested)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }
    function isAdmin() { return isSignedIn() && request.auth.token.admin == true; }

    match /products/{id} {
      allow read: if resource.data.active == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    match /users/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid)
        && request.resource.data.role == 'customer'
        && !('analytics' in request.resource.data);
      allow update: if isOwner(uid)
        && request.resource.data.diff(resource.data).affectedKeys()
             .hasOnly(['name', 'beautyProfile']);
    }

    match /behaviourEvents/{id} {
      allow create: if isSignedIn()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.eventType in [
          'page_view','search','category_view','product_view','wishlist_add',
          'wishlist_remove','cart_add','cart_remove','checkout_start',
          'review_submit','quiz_complete','routine_create',
          'recommendation_click','offer_click'];
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow update, delete: if false;
    }

    match /orders/{id} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create, update, delete: if false;   // via placeOrder / admin callable only
    }

    match /payments/{id} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow write: if false;                    // Cloud Functions only
    }
    match /paymentEvents/{id} { allow read: if isAdmin(); allow write: if false; }
    match /auditLogs/{id}     { allow read: if isAdmin(); allow write: if false; }
    match /utrIndex/{id}      { allow read, write: if false; }
    match /config/{id}        { allow read, write: if false; }   // admin edits via callable

    match /carts/{uid}          { allow read, write: if isOwner(uid) || isAdmin(); }
    match /wishlists/{uid}/items/{pid} { allow read, write: if isOwner(uid) || isAdmin(); }
    match /recommendations/{uid} { allow read: if isOwner(uid) || isAdmin(); allow write: if false; }
    match /segments/{id}        { allow read: if isAdmin(); allow write: if false; }
    match /analyticsSnapshots/{id} { allow read: if isAdmin(); allow write: if false; }
  }
}
```

> Notes: `purchase` and `payment_*` events are written by the server (not allow-listed for clients). Review creation rules must additionally check a verified purchase, using a function-written flag or a callable. The rules above are a starting point and must be finalised and tested.

### 12.5 Security Requirements

| ID | Requirement | Pri |
|---|---|---|
| SEC-01 | Admin routes protected in UI, rules and (for callables) server checks | P0 |
| SEC-02 | Role cannot be self-assigned; claim set only by a trusted script or admin function | P0 |
| SEC-03 | Prices, discounts, totals and stock never trusted from the client | P0 |
| SEC-04 | Score and segment fields are write-protected from clients | P0 |
| SEC-05 | Rules unit tests include negative cases (reading others' data, forging events, changing role) | P0 |
| SEC-06 | Input validation on all forms (client) and callables (server) | P0 |
| SEC-07 | Storage rules restrict uploads to admins, with file type and size limits | P1 |
| SEC-08 | No API keys/secrets in the repo beyond public Firebase web config; `.env` files git-ignored | P0 |
| SEC-09 | Rate limiting/abuse guard for event writes (client debounce plus optional App Check) | P2 |
| SEC-10 | The payment amount comes only from the server-held order; any amount in a request is ignored | P0 |
| SEC-11 | Only server code can set an order to confirmed/paid; rules deny client writes to `orders` and `payments` | P0 |
| SEC-12 | Webhook authenticity: HMAC signature on the raw body with a constant-time compare, plus replay protection by event id | P0 |
| SEC-13 | Provider secrets in Secret Manager; payee details in server-only config; neither is logged | P0 |
| SEC-14 | Ownership check (`order.userId == auth.uid`) on session creation, refresh, reference submission and cancel | P0 |
| SEC-15 | UTR is single-use; amount and currency must match; admin verification needs the admin claim and is audit-logged | P0 |
| SEC-16 | Rate limits on session creation (for example 5 per order) and status refresh (at most one per 5 s); App Check recommended on callables | P1 |
| SEC-17 | No UPI PIN, card or bank credentials are ever requested or stored; payment references are masked in the UI and logs | P0 |
| SEC-18 | Changing the payee account requires admin re-authentication, a confirmation step and an audit entry | P1 |

---

## 13. Non-Functional Requirements

| Category | ID | Requirement |
|---|---|---|
| **Performance** | NFR-PERF-01 | Catalogue first render under 2.5 s (broadband); route changes feel instant with skeletons |
| | NFR-PERF-02 | Score/recommendation refresh visible within 15 s of the triggering action |
| | NFR-PERF-03 | Admin dashboards load from snapshots, not full collection scans |
| **Scalability** | NFR-SCAL-01 | Design supports thousands of customers and hundreds of thousands of events without schema change (prototype is tested at far smaller scale) |
| **Reliability** | NFR-REL-01 | Event logging failures never block shopping actions |
| | NFR-REL-02 | Cloud Functions are idempotent and retry-safe |
| **Security** | NFR-SEC-01 | See section 12 |
| **Privacy** | NFR-PRIV-01 | Behaviour data is used only for personalization and analytics within the app; privacy notice shown at registration |
| | NFR-PRIV-02 | A user can request account/data deletion (manual process acceptable for the prototype) |
| **Usability** | NFR-UX-01 | Mobile-first responsive layout (360 px and up) |
| | NFR-UX-02 | Clear loading, empty and error states on every data view |
| **Accessibility** | NFR-A11Y-01 | Target WCAG 2.1 AA basics: contrast, labels, keyboard navigation, alt text |
| **Compatibility** | NFR-COMP-01 | Latest two versions of Chrome, Edge, Firefox, Safari; Android and iOS browsers |
| **Maintainability** | NFR-MAINT-01 | Modular services layer; scoring config centralised; README with setup and seed instructions |
| **Observability** | NFR-OBS-01 | Function logs for scoring; admin-visible "last updated" timestamps on aggregates |
| **Cost** | NFR-COST-01 | Stay within Firebase free-tier quotas where possible; avoid unbounded listeners and full-collection reads. Note: Cloud Functions need the Blaze plan, and calls to a payment provider need outbound networking |
| **Payments** | NFR-PAY-01 | QR visible within 2 s of opening the payment page (3 s typical in `gateway` mode) |
| | NFR-PAY-02 | Customer sees "Paid" within 5 s of provider confirmation; within 15 s worst case via the polling fallback |
| | NFR-PAY-03 | All payment handling is idempotent: duplicate webhooks, double clicks, two tabs and replayed triggers cause no double effects |
| | NFR-PAY-04 | Payment page works at 360 px; QR is scannable from a laptop screen and a phone can pay through the in-app UPI link |
| | NFR-PAY-05 | Mode, expiry and limits are configuration, not code |

---

## 14. UX and Visual Design

### 14.1 Brand

**Feel:** premium, clean, modern, trustworthy. **Tagline:** "Beauty that learns what you love."

### 14.2 Design Tokens

| Token | Customer app | Admin console |
|---|---|---|
| Background | Cream / white (`#FFFAF5` / `#FFFFFF`) | White / light cream |
| Primary accent | Soft pink (`#F4C2C2` family) | Neutral charcoal with a pink accent |
| Secondary accent | Champagne / gold (`#C9A66B`) | Same, used sparingly |
| Text | Dark brown / charcoal (`#3B2F2F`) | Charcoal |
| Surfaces | Rounded cards (12–16 px radius), soft shadows | Clean cards, subtle borders |
| Imagery | Large, clean product photos | Data-first, minimal imagery |

> Avoid a dark "AI dashboard" look in either application. Colour values above are starting suggestions to be confirmed in Phase 1.

### 14.3 Typography

A refined serif or display face for headings (e.g., Playfair Display) with a clean sans-serif for body and UI (e.g., Inter or Poppins). Admin tables use tabular figures for numbers.

### 14.4 Core Components

Navbar, hero, category tiles, product card (with match badge), filter sidebar/drawer, product gallery, tabs, quiz stepper, match list with reasons, routine stepper, cart drawer, checkout stepper, payment QR card with countdown and status chip, toast notifications, KPI card, chart card, data table with filters, segment chip, intent badge, timeline.

### 14.5 Page and Route Inventory

| Area | Route | Page | Access |
|---|---|---|---|
| Public | `/` | Home | All |
| Public | `/shop` | Shop / search results | All |
| Public | `/product/:id` | Product detail | All |
| Public | `/login`, `/register` | Authentication | Visitors |
| Customer | `/quiz` | Discover Your Glow | Customer |
| Customer | `/glowmatch` | GlowMatch | Customer |
| Customer | `/routine` | GlowRoutine | Customer |
| Customer | `/wishlist` | Wishlist | Customer |
| Customer | `/cart` | Cart | Customer |
| Customer | `/checkout` | Checkout | Customer |
| Customer | `/checkout/pay/:orderId` | Pay by UPI QR | Customer (order owner) |
| Customer | `/orders`, `/orders/:id` | Orders | Customer |
| Customer | `/profile` | My Glow Profile | Customer |
| Customer | `/journey` | My Beauty Journey | Customer |
| Customer | `/offers` | Offers | All / personalized |
| Admin | `/admin` | Dashboard | Admin |
| Admin | `/admin/sales` | Sales analytics | Admin |
| Admin | `/admin/behaviour` | Behaviour and opportunity matrix | Admin |
| Admin | `/admin/customers`, `/admin/customers/:id` | Customers and detail | Admin |
| Admin | `/admin/products`, `/admin/products/new`, `/admin/products/:id` | Product management | Admin |
| Admin | `/admin/segments` | Segments | Admin |
| Admin | `/admin/campaigns` | Campaigns | Admin |
| Admin | `/admin/reviews` | Review analytics | Admin |
| Admin | `/admin/payments`, `/admin/payments/:id` | Payments console, verification queue, settings | Admin |

### 14.6 Key UX Rules

- Every personalized element explains itself (reason text or tooltip).
- Customers never see raw internal metrics such as "Intent: 84".
- Destructive admin actions (deactivate product) require confirmation.
- Loading skeletons for lists and charts; helpful empty states ("No orders yet, start with your Glow Quiz").
- The amount on the payment page is large, shown in text next to the QR, and must match the order summary; the mode banner is always visible in `demo` and `direct_upi`.
- Never show an order as confirmed while its payment is unverified; use "Awaiting payment" or "Awaiting store verification".

---

## 15. Analytics and Instrumentation Plan

| Layer | Tool | Purpose | Examples |
|---|---|---|---|
| Aggregate usage | Firebase Analytics | Traffic, engagement, e-commerce funnel trends | `view_item`, `search`, `add_to_cart`, `add_to_wishlist`, `begin_checkout`, `purchase` |
| Custom product events | Firebase Analytics | Feature usage | `glow_quiz_complete`, `glow_match_click`, `routine_created`, `recommendation_click`, `offer_click` |
| Payment events | Firebase Analytics and Firestore | Payment funnel and failure analysis | `add_payment_info`, `purchase`, `payment_success`, `payment_failed`, `payment_expired` |
| Per-user behaviour | Firestore `behaviourEvents` | Scoring, segmentation, timelines, admin dashboards | All event types in section 8.1 |
| Aggregates | Firestore `analyticsSnapshots` | Fast dashboards | KPIs, funnel, trending |
| Live state | Realtime Database | Presence and live counters | Customers browsing now |

**Requirement:** Event names and parameters are defined once in a shared constants module and used by both loggers to prevent drift.

---

## 16. Real vs Simulated Matrix

| Capability | Status | Notes |
|---|---|---|
| Register, login, logout, Google auth | **Real** | Firebase Authentication |
| Product loading, search, filters, details | **Real** | Firestore |
| Wishlist, cart, checkout, orders | **Real** | Persisted; orders via `placeOrder` |
| User profile and quiz | **Real** | Stored in Firestore |
| Behaviour tracking | **Real** | Written for every defined event |
| GlowScore, intent, segmentation, recommendations | **Real** | Cloud Functions computing from data |
| Admin login and product management | **Real** | Custom claim plus rules |
| Sales, customer and behaviour analytics | **Real** | Computed from Firebase data (seed plus live) |
| Payment, `gateway` mode | **Real** | UPI QR from the provider; money settles to the store's account; confirmation by signed webhook. Use the provider's test mode for rehearsals so no real money moves |
| Payment, `direct_upi` mode | **Real money, manual confirmation** | Customer pays the store's UPI ID; an admin verifies the UTR; labelled "Awaiting store verification" |
| Payment, `demo` mode | **Simulated** | Placeholder QR and a dev-only simulate button; banner "TEST MODE: no money is charged" |
| Shipping and delivery tracking | **Simulated** | Status values only |
| SMS and email | **Simulated** | Not sent; optional placeholder UI |
| Sentiment analysis | **Simulated (rule-based)** | Rating plus keywords |
| Prediction | **Simulated (statistical rule)** | Interval-based, not ML |

> **Integrity rule:** Simulated features must be labelled as such in the UI and documentation. Do not present `demo` mode as a real payment, and never show `direct_upi` payments as verified until an admin has confirmed them. Any revenue figure that includes demo, test or seeded payments must say so.

---

## 17. Seed Data Plan

| Dataset | Volume | Notes |
|---|---|---|
| Categories / subcategories | ~5 / ~29 | Skincare, Makeup, Haircare, Fragrance, Personal Care and their subcategories |
| Brands | 8–12 | Mix of fictional brands, including "GlowCare" |
| Products | 40–60 | Realistic names, ₹ prices from about ₹199 to ₹2,499, tags, concerns, skin types, images |
| Customers | 150–300 synthetic | Varied profiles across segments |
| Events | 5,000–20,000 | Generated with realistic funnel drop-offs |
| Orders | 300–800 | Spread over 5–6 months for trend charts; mostly `confirmed` with `paymentStatus: paid`, `paymentMode: seed` and a matching `payments` document, plus a few `expired`, `cancelled`, `failed` and `reference_submitted` examples for the admin payments console |
| Reviews | 150–400 | Mixed sentiment |
| Campaigns | 2–3 | One active, one ended |
| Special demo customers | 2 | "Customer A" (demo hero), "Admin" |

**Requirements**

| ID | Requirement |
|---|---|
| FR-SEED-01 | A seed script (Node, using the Admin SDK or Emulator) populates all collections reproducibly |
| FR-SEED-02 | Seeded data produces at least one product in each Opportunity Matrix quadrant, including a clear "Lost Sales" example |
| FR-SEED-03 | Seeded aggregates equal what the functions would compute; run `aggregateAnalytics` after seeding |
| FR-SEED-04 | Seed script can reset the demo to its start state |
| FR-SEED-05 | Seed includes at least one payment in each admin-action state (`reference_submitted`, `amount_mismatch`, `paid_after_expiry`) so the verification queue is demonstrable |

---

## 18. Testing and Quality Strategy

### 18.1 Test Levels

| Level | Scope | Tools |
|---|---|---|
| Unit | Scoring, segmentation, recommendation, prediction, trend functions | Vitest / Jest |
| Security rules | Allow/deny matrix for all collections, RTDB and Storage | Emulator Suite plus rules-unit-testing |
| Integration | Event → function → updated score; `placeOrder` transaction | Emulator Suite |
| End to end | Register → shop → order → admin sees it | Playwright or Cypress (optional), otherwise a manual script |
| UI / responsive | Mobile, tablet, desktop | Manual plus browser dev tools |
| Performance | Lighthouse on Home, Shop, Product | Lighthouse |
| Accessibility | Basic automated plus keyboard walk-through | axe / Lighthouse |

### 18.2 Critical Test Cases

| ID | Scenario | Expected result |
|---|---|---|
| TC-01 | Customer tries to read another user's cart/orders/events | Denied |
| TC-02 | Customer tries to set `role: "admin"` or edit `analytics` | Denied |
| TC-03 | Non-admin opens `/admin` | Redirected; direct DB reads denied |
| TC-04 | Client submits a cart with a tampered price | `placeOrder` charges the server price |
| TC-05 | Order for out-of-stock quantity | Rejected with a clear message |
| TC-06 | Two simultaneous orders for the last unit | Only one succeeds (transaction) |
| TC-07 | View → wishlist → cart → checkout events | Intent rises into the High band; lost-sale alert appears if no purchase |
| TC-08 | Purchase completes | Score updates; segment re-evaluated; recommendations change |
| TC-09 | New user with no history | Sees trending / goal-based recommendations, no errors |
| TC-10 | Admin adds a product with an image | Appears in the storefront immediately |
| TC-11 | Admin deactivates a product | Disappears from shop and recommendations |
| TC-12 | Campaign for "Glow Saver" | Only matching users see/receive the discount |
| TC-13 | Event logging fails (offline) | Shopping continues; no UI error |
| TC-14 | Replayed function trigger | No double counting |
| TC-15 | Client tampers with the amount or total sent to checkout or payment | Server amount is used; QR amount equals the stored order total |
| TC-16 | Customer tries to write `orders.status`, `orders.paymentStatus` or any `payments` document | Denied by rules |
| TC-17 | Webhook with a missing or invalid signature | Rejected; order unchanged; attempt logged |
| TC-18 | Same webhook delivered twice | Order confirmed once; one `purchase` event; no double score, stock or redemption effect |
| TC-19 | Webhook amount differs from the order total | Payment flagged `amount_mismatch`; order not confirmed; admin alerted |
| TC-20 | QR expires unpaid | Order `expired`; stock restored exactly once; cart intact; `payment_expired` logged; lost-sale logic sees it |
| TC-21 | Money arrives after expiry | Payment becomes `paid_after_expiry` and appears in the admin queue; nothing is confirmed silently |
| TC-22 | Customer B tries to create, refresh, submit a reference for or cancel Customer A's payment | Denied |
| TC-23 | `direct_upi`: same UTR submitted for two orders | Second submission rejected |
| TC-24 | `direct_upi`: admin verifies and rejects references | Order confirmed or payment failed accordingly; audit entry written; non-admin denied |
| TC-25 | Double click on checkout, two tabs, `placeOrder` retried | One order, one session, stock reserved once |
| TC-26 | Provider API unavailable when the session is created | Friendly error, retry works, nothing confirmed |
| TC-27 | Mode banner and controls per mode | `demo` banner and simulate button only in `demo` on dev builds; `gateway` and `direct_upi` never show the simulate button |

### 18.3 Definition of Done

A feature is done when: it meets its acceptance criteria; security rules cover it with tests; it has loading/empty/error states; it works at 360 px width; it logs the right events; and it is demonstrable using seed data.

---

## 19. Demo Scenario

Use one fictional customer ("Customer A"). Rehearse using the seed reset.

| Step | Actor | Action | Expected system behaviour |
|---|---|---|---|
| 1 | Customer A | Registers and completes the quiz (Skincare, ₹500–₹1,000, Hydration) | Profile saved; `quiz_complete` logged; recommendations generated |
| 2 | Customer A | Browses Serum → Serum → Moisturizer → Sunscreen | `product_view` events; skincare affinity rises |
| 3 | Customer A | Wishlists a serum; adds sunscreen to cart; leaves | `wishlist_add`, `cart_add` events |
| 4 | Admin | Opens dashboard | Live activity shows Customer A; **High Intent** (e.g., GlowScore 78, Intent 84) |
| 5 | Admin | Opens Opportunity Matrix / Lost Sales | "Potential lost sale: sunscreen, checkout abandoned" |
| 6 | Admin | Creates a 10% personalized offer for Customer A | Campaign stored |
| 7 | Customer A | Logs in again | Banner: "Welcome back! Here's 10% off your sunscreen." |
| 8 | Customer A | Checks out the ₹699 sunscreen with the 10% offer | `placeOrder` applies the discount server-side; order created as `pending_payment` for ₹629.10 (62910 paise); payment page shows a QR for exactly ₹629.10 |
| 8a | Customer A | Scans the QR in a UPI app and pays (test mode or a tiny real amount for rehearsal) | Webhook verified; order flips to Paid on screen within seconds; `payment_success` and `purchase` events written. In `direct_upi` mode the customer submits the UTR and the admin verifies it |
| 9 | System | Post-order processing | GlowScore 78 → 91; segment Glow Explorer → Glow Care |
| 10 | Admin | Refreshes customer detail | Timeline shows the full journey; GlowPredict shows expected sunscreen repurchase in about 30 days |

**Demo success criteria:** all steps run without manual database edits, and the numbers on screen come from the live system.

---

## 20. Delivery Plan and Milestones

| Phase | Name | Key deliverables | Exit criteria |
|---|---|---|---|
| 1 | Foundation | React/Vite/Tailwind setup, Firebase project, Auth, Firestore, initial Security Rules, routing, UI system, Emulator Suite | Login works; rules tests run; deployed hello-world |
| 2 | E-commerce | Products, categories, search, filters, product page, wishlist, cart, checkout, orders (`placeOrder`, `pending_payment`) | A user can create a pending order end to end |
| 2B | Payments | Payment modes and config, `createPaymentSession`, QR payment page, `markOrderPaid`, webhook, expiry job, direct-UPI verification, admin payments console, payment tests TC-15 to TC-27 | A user can pay an exact-amount QR and the order confirms itself (test mode), and an unpaid order expires and releases stock |
| 3 | Behaviour | Event tracker, search/view/wishlist/cart/checkout/purchase events, Analytics mirroring | Events visible in Firestore and GA |
| 4 | Intelligence | GlowScore, GlowIntent, segments, GlowMatch, GlowPredict, GlowTrend | Scores update from events; recommendations differ per user |
| 5 | Admin | Dashboard, sales, customers, behaviour, products, segments, campaigns, reviews | Admin completes US-A01 to US-A06 |
| 6 | Backend hardening | Scheduled aggregations, recommendation refresh, Storage rules, Realtime activity | Dashboards load from snapshots; live activity works |
| 7 | Testing and polish | Rules testing, customer/admin permission tests, order/cart/payment tests, analytics tests, responsive polish, seed and demo rehearsal | All P0 tests pass; demo runs clean twice in a row |

**Build order within the project:** project structure → Firebase schema → Security Rules → seed data → frontend pages → backend functions.

**Suggested sequencing guidance:** if time is short, protect this order of value: (1) Auth, products, cart, orders and UPI payment, (2) event tracking, (3) admin dashboards, (4) GlowScore and segments, (5) recommendations, (6) the rest.

---

## 21. Repository Structure

```
glowshine-co/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── customer/
│   │   └── admin/
│   ├── layouts/
│   ├── hooks/
│   ├── context/
│   ├── services/
│   │   ├── firebase/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/        # session call, status listener, QR helpers
│   │   ├── behaviour/
│   │   └── analytics/
│   ├── utils/
│   ├── data/
│   └── App.jsx
├── functions/
│   └── src/
│       ├── behaviour/
│       ├── recommendations/
│       ├── analytics/
│       ├── orders/
│       ├── payments/        # session, webhook, markOrderPaid, expiry, admin verify, providers/
│       └── users/
├── scripts/                 # seed + admin-claim scripts
├── firestore.rules
├── firestore.indexes.json
├── database.rules.json
├── storage.rules
├── firebase.json
└── README.md
```

---

## 22. Risks, Assumptions, Dependencies and Constraints

### 22.1 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Scope too large for the timeline | High | High | Follow MoSCoW and the value order in section 20; cut P2 first |
| R2 | Cloud Functions deployment needs the Blaze (pay-as-you-go) plan, and payment-provider calls need outbound networking | High | High | Confirm the plan early; develop on the Emulator Suite; keep usage low and set a budget alert |
| R3 | Security rules mistakes expose data | Medium | High | Write rules with schema; negative tests; review before deploy |
| R4 | Unrealistic demo data makes charts look fake | Medium | Medium | Generate seed data with realistic distributions; include clear quadrant examples |
| R5 | Score logic unclear or inconsistent | Medium | Medium | Single config; documented formulas; unit tests with worked examples |
| R6 | Firestore read costs/latency from heavy dashboards | Medium | Medium | Use `analyticsSnapshots`; paginate; avoid full scans |
| R7 | Event volume and duplicate counting | Medium | Medium | Debounce; idempotent functions |
| R8 | Over-claiming "AI" in presentation | Low | Medium | Use "behaviour-based, rule-driven intelligence" wording |
| R9 | Brand name overlaps with existing "Glow" brands | Medium | Low | Check domain, social handles and trademark before any public launch |
| R10 | Admin claim bootstrap confusion | Low | Medium | Provide a documented script and README steps |
| R11 | Provider merchant account (KYC) takes time or is unavailable | Medium | High | Start early; build against `demo` and the provider's test mode; fall back to `direct_upi` |
| R12 | `direct_upi` cannot auto-verify, so fake screenshots or wrong UTRs are possible | Medium | High | Never auto-confirm; admin matches UTR and amount to the statement; UTR single-use; label as manual |
| R13 | A UPI app lets the payer change the amount, or a personal UPI ID is flagged for business collection | Medium | Medium | Verify the paid amount server-side; use `gateway` or a merchant UPI ID for real sales |
| R14 | Late, duplicate or webhook-delayed payments confuse order state | Medium | Medium | Idempotent `markOrderPaid`, polling fallback, `paid_after_expiry` queue, reconciliation report |
| R15 | Taking real money creates tax, refund-policy and regulatory duties (GST invoicing, terms, privacy) | Medium | High | Use test mode or tiny amounts for the college demo; complete the go-live checklist in Appendix E before any public launch |

### 22.2 Assumptions

- A single developer builds the prototype with Firebase as the only backend.
- The audience evaluates functionality and concept; production-scale traffic is not required.
- Product images are available (licensed or self-created) or placeholders are acceptable.
- Demo uses Indian Rupees (₹) and an Indian address format.
- Customers have a UPI app; UPI is the only payment method in v2.1.
- The product owner supplies the payee details (merchant account at a provider, or a UPI ID) before any real-money test.

### 22.3 Dependencies

Firebase project and services, Node.js toolchain, Firebase CLI and Emulator Suite, charting library, image assets, Google Sign-In configuration (OAuth consent/authorised domains), a payment-provider merchant account (or a UPI ID for `direct_upi`), Functions secrets, the Blaze plan, a public HTTPS URL for the webhook, and a QR rendering library.

### 22.4 Constraints

Prototype timeline, free-tier quotas where possible (payments need the Blaze plan), UPI only with no card, netbanking, wallet or COD, no automated refunds, no ML training, and no separate Python backend (ADR-01).

---

## 23. Open Questions

| # | Question | Owner | Needed by |
|---|---|---|---|
| Q1 | Final GlowScore weights and normalisation caps (defaults in 8.2 are proposals) | Product owner | Phase 4 |
| Q2 | Segment precedence and thresholds (8.4) | Product owner | Phase 4 |
| Q3 | GlowIntent maximum from the listed signals is 90. Should purchase history or comparison add points to reach 100? | Product owner | Phase 4 |
| Q4 | JavaScript or TypeScript? | Developer | Phase 1 |
| Q5 | Chart library: Recharts or Chart.js? | Developer | Phase 5 |
| Q6 | Will anonymous (pre-login) browsing be tracked and merged? | Product owner | Phase 3 |
| Q7 | Source of product images and brand names | Product owner | Phase 2 |
| Q8 | Cart abandonment *reasons* (shipping, price, payment, doubt): collect via an exit survey or label as a demo estimate? | Product owner | Phase 5 |
| Q9 | Firebase billing plan and region for Functions/Storage | Developer | Phase 1 |
| Q10 | Do customers see a "Glow Level" at all, or only recommendations? | Product owner | Phase 4 |
| Q11 | Which payment mode is used for the final demo: `gateway` (needs provider account) or `direct_upi` (no gateway, manual verification)? | Product owner | Phase 2B |
| Q12 | Which account receives the money: the merchant account's settlement bank account, or which UPI ID (personal or merchant)? Details are supplied by the owner and never committed to the repo | Product owner | Phase 2B |
| Q13 | Which provider (Razorpay is the suggested default; others offer similar dynamic UPI QR)? Confirm test-mode behaviour for QR payments before the demo | Developer | Phase 2B |
| Q14 | Payment window and stock hold: is 15 minutes right? | Product owner | Phase 2B |
| Q15 | Cancellation and refund policy, and who performs refunds (manual in the provider dashboard or UPI)? | Product owner | Phase 2B |
| Q16 | Is a delivery charge applied, and above what order value is it free? (affects the exact QR amount) | Product owner | Phase 2 |

---

## 24. Glossary

| Term | Meaning |
|---|---|
| **GlowScore** | 0–100 server-computed customer engagement and value score |
| **GlowIntent** | Rolling 7-day purchase-intent score (Low / Medium / High) |
| **GlowMatch** | Personalized ranked recommendation experience with match % |
| **GlowRoutine** | Goal-based product routine with bundle pricing |
| **GlowPredict** | Next-repurchase prediction based on purchase intervals |
| **GlowTrend** | Growth in product/category activity versus the prior period |
| **GlowOffer** | Segment- or user-targeted campaign |
| **Lost sale** | High interest/intent with no purchase |
| **Opportunity Matrix** | Interest vs purchase quadrant chart for products |
| **Behaviour event** | A recorded customer action in `behaviourEvents` |
| **Custom claim** | A role flag stored in a user's Firebase Auth token |
| **AOV** | Average order value |
| **MoSCoW** | Must / Should / Could / Won't prioritisation |
| **UPI** | Unified Payments Interface, India's instant bank-to-bank payment system |
| **VPA / UPI ID** | Virtual payment address, for example `name@bank`, that identifies the payee |
| **UTR** | 12-digit unique transaction reference that a UPI payment produces; used for manual verification |
| **Payment session** | The `payments` document and QR created for one order attempt |
| **Webhook** | A signed HTTPS call from the payment provider telling the server that a payment happened |
| **Paise** | One hundredth of a rupee; all payment amounts are stored as integer paise |
| **markOrderPaid** | The single server function allowed to confirm an order after verified payment |

---

## 25. Appendices

### Appendix A: Requirement Traceability (summary)

| Goal | Primary requirements | Primary tests |
|---|---|---|
| G1 Complete shopping flow | FR-AUTH, FR-SHOP, FR-PDP, FR-WISH, FR-CART, FR-ORD, FR-PAY | TC-04, TC-05, TC-06, TC-15 to TC-27, E2E |
| G2 Reliable behaviour capture | FR-EVT-01 to 05 | TC-07, TC-13, TC-14 |
| G3 Personalization | FR-HOME-04, FR-MATCH, FR-REC, FR-SCORE, FR-SEG | TC-08, TC-09 |
| G4 Actionable admin intelligence | FR-ADM-02 to 15, FR-OFFER | TC-10, TC-11, TC-12 |
| G5 Secure by design | SEC-01 to 09, section 12 | TC-01, TC-02, TC-03 |
| G6 Demo-ready | FR-SEED, section 19 | Demo rehearsal |
| G7 Accept payments securely | FR-PAY, FR-ORD-02 to 09, FR-FN-06 to 10, SEC-10 to 18, FR-ADM-16 to 19 | TC-15 to TC-27 |

### Appendix B: Worked Examples

**B1: GlowIntent**
Views +10, wishlist +15, cart +25, checkout +30 = 80 → **High (66–100)**.

**B2: Recommendation score (Hydrating Serum for Customer A)**

| Component | Score |
|---|---|
| Interest match (skincare + hydration) | 29 / 30 |
| Category match (recent skincare views) | 19 / 20 |
| Price match (₹599 within ₹500–₹1,000) | 15 / 15 |
| Purchase history (no serum bought; cleanser owned) | 14 / 15 |
| Behaviour similarity (viewed 2 serums) | 9 / 10 |
| Popularity | 8 / 10 |
| **Total** | **94 → "94% Match"** |

**B3: GlowRoutine bundle**
Cleanser ₹399 + Serum ₹599 + Moisturizer ₹449 + Sunscreen ₹499 = **₹1,946**. Bundle price ₹1,699. Saving **₹247**.

**B4: GlowPredict**
Face wash, 30-day average interval, 27 days since last purchase → ratio 0.90 → **High**, expected repurchase in 3–5 days.

**B5: Conversion and funnel**
Visitors 10,000 → Views 6,500 → Engagement 3,100 → Cart 1,400 → Checkout 900 → Payment started 780 → Purchase 650. Conversion = 650 ÷ 10,000 = **6.5%**. Payment success rate = 650 ÷ 780 = **83%**; the 130 unpaid sessions feed the "Payment abandoned" lost-sale reason.

**B6: Payment amount**
Hydrating Serum ₹699 × 1 with a 10% personalised offer: discount = ₹69.90, total = **₹629.10**, `amountPaise` = **62910**, UPI amount parameter `am=629.10`. The server computes this once at `placeOrder`; the QR, the order and the receipt all use the same number.

**B7: Payment timeline (happy path and expiry)**

| Time | Event |
|---|---|
| 0:00 | `placeOrder`: order `pending_payment`, stock reserved, `expiresAt` = 0:15 |
| 0:02 | Payment page opens: `createPaymentSession`, QR for ₹629.10 shown, `payment_initiated` logged |
| 0:48 | Customer scans and pays in a UPI app |
| 0:51 | Webhook received, signature and amount verified, `markOrderPaid` runs |
| 0:52 | Order `confirmed`, cart cleared, `purchase` event written, page shows Paid |
| 0:55 | `onOrderPaid`: GlowScore, segment and recommendations refresh |
| Alternative | Nobody pays: at 0:15 `expireUnpaidOrders` sets `expired`, stock returns once, `payment_expired` is logged, cart is untouched |

### Appendix C: Product Catalogue Taxonomy

| Category | Subcategories |
|---|---|
| Skincare | Cleanser, Face Wash, Serum, Moisturizer, Sunscreen, Toner, Face Mask |
| Makeup | Foundation, Concealer, Lipstick, Lip Tint, Blush, Mascara, Eyeliner |
| Haircare | Shampoo, Conditioner, Hair Serum, Hair Mask, Hair Oil |
| Fragrance | Perfume, Body Mist, Deodorant |
| Personal Care | Body Wash, Body Lotion, Hand Cream, Lip Balm |

### Appendix D: Feature Hierarchy

| Tier | Features |
|---|---|
| 🔴 **Core** | Authentication, products, search, cart, wishlist, orders, UPI QR payment, Firebase database, admin |
| 🟠 **Signature** | Glow Profile, behaviour tracking, GlowScore, GlowMatch, GlowIntent, customer segmentation |
| 🟡 **Advanced** | GlowPredict, GlowTrend, GlowRoutine, Lost Sales Detector, personalized campaigns, review analytics, live customer activity |
| 🟢 **Optional** | AI chatbot, virtual try-on, card/netbanking payments, automated refunds, email automation, SMS, machine learning |

### Appendix E: Payment Technical Specification (v2.1)

#### E1. Configuration

| Key | Example / default | Notes |
|---|---|---|
| `PAYMENT_MODE` | `gateway` | `gateway`, `direct_upi` or `demo` |
| `PAYMENT_PROVIDER` | `razorpay` | Used in `gateway` mode; behind the provider interface |
| `PAYMENT_EXPIRY_MINUTES` | `15` | QR validity and order hold; the provider may enforce its own minimum for QR lifetime |
| `MAX_UPI_ORDER_VALUE` | `100000` (₹) | UPI limits vary by bank and app |
| `PAYEE_NAME` | `GlowShine Co.` | Shown in the UPI app |
| `PAYEE_VPA` | supplied by the owner | `direct_upi` only; server-only config, never in the repo |
| `PAYEE_MCC` | optional | Merchant category code for registered merchants |
| Secrets | provider key secret, webhook secret | Functions secrets (Secret Manager) |
| Rounding | half-up to the nearest paisa, per line | Central config |

The settlement bank account for `gateway` mode is set in the provider's dashboard during merchant onboarding, not in this application.

#### E2. UPI payment link (used by `direct_upi`, and by the in-app button where the provider returns a UPI link)

```
upi://pay?pa=<payee UPI ID>&pn=<payee name, URL-encoded>&am=<amount in rupees, 2 decimals>&cu=INR&tn=<note>&tr=<order id>
```

| Parameter | Meaning |
|---|---|
| `pa` | Payee UPI ID (VPA) |
| `pn` | Payee name |
| `am` | Amount in rupees with up to 2 decimals, taken from `amountPaise ÷ 100` |
| `cu` | Currency, always `INR` |
| `tn` | Short note, for example the order id |
| `tr` | Transaction reference, set to the order id |
| `mc` | Optional merchant category code |

Example for ₹629.10 (placeholder UPI ID): `upi://pay?pa=store@examplebank&pn=GlowShine%20Co.&am=629.10&cu=INR&tn=Order%20GS-10482&tr=GS-10482`

> A UPI app may let the payer edit the amount or may ignore `tr`, so a link can never prove what was paid. That is why `direct_upi` requires human verification, and why `gateway` mode (a fixed-amount QR plus a provider callback) is recommended.

#### E3. Sequence

See 6.1A for the full diagram. Key invariants: (1) the amount is read from the order, (2) the browser only draws what the server returns, (3) `markOrderPaid` is the only path to `confirmed`, (4) every external event is verified and deduplicated.

#### E4. Edge cases

| Situation | Handling |
|---|---|
| Customer pays then closes the tab | Webhook still confirms; My Orders shows the order as paid |
| Webhook delayed or lost | `refreshPaymentStatus` poll; `expireUnpaidOrders` re-checks the provider once before expiring |
| Webhook delivered twice | Deduplicated by provider event id; `markOrderPaid` is idempotent |
| Paid amount differs from the order | `amount_mismatch`; not confirmed; admin decides (top-up, refund) |
| Paid after the order expired | `paid_after_expiry`; admin fulfils if stock allows, otherwise records a refund |
| Customer pays twice | Second payment flagged as duplicate; admin records a refund |
| Double click, two tabs, retry | Idempotent `placeOrder` and `createPaymentSession`; one order, one session |
| Provider down or slow | Friendly retry message; nothing confirmed; optional downtime check before showing the QR |
| `direct_upi`: customer pays but never submits the UTR | Order expires; admin can still find the payment by amount and time and handle it as `paid_after_expiry` |
| `direct_upi`: fake or reused UTR | Admin matches UTR and amount to the real statement; `utrIndex` blocks reuse; never auto-confirmed |
| Refund needed | Admin records `refund_pending` then `refunded`; money is returned outside the app |

#### E5. Illustrative code (to be completed and tested)

Browser: draw the QR from the server payload.

```jsx
import { QRCodeSVG } from 'qrcode.react';
// session = result of the createPaymentSession callable
<QRCodeSVG value={session.upiPayload} size={240} includeMargin />
<p>Pay exactly ₹{(session.amountPaise / 100).toFixed(2)}</p>
```

Cloud Function: create the session (amount from the order only).

```js
exports.createPaymentSession = onCall({ secrets: [KEY_SECRET] }, async (req) => {
  const uid = requireAuth(req);
  const order = await getOrder(req.data.orderId);
  if (order.userId !== uid || order.status !== 'pending_payment') throw denied();
  const existing = await findActiveSession(order.id);          // idempotent
  if (existing) return toClient(existing);
  const cfg = await getPaymentConfig();
  const session = cfg.mode === 'gateway'
    ? await provider.createQr({ amountPaise: order.amountPaise, orderId: order.id, closeBy: order.expiresAt })
    : buildUpiLink({ vpa: cfg.payeeVpa, name: cfg.payeeName, amountPaise: order.amountPaise, ref: order.id });
  return toClient(await savePayment(order, session));          // also logs payment_initiated
});
```

Cloud Function: webhook (verify, dedupe, match, confirm).

```js
exports.paymentWebhook = onRequest({ secrets: [WEBHOOK_SECRET] }, async (req, res) => {
  // For Razorpay: HMAC-SHA256 of the raw body with the webhook secret, compared with the signature header
  if (!provider.verifyWebhook(req.rawBody, req.headers)) return res.status(401).end();
  const evt = provider.parse(req.body);
  if (!(await claimEvent(evt.id))) return res.status(200).end();   // duplicate: already handled
  const order = await getOrderByProviderRef(evt.providerRef);
  if (evt.amountPaise !== order.amountPaise || evt.currency !== 'INR') await flag(order, 'amount_mismatch');
  else if (order.status === 'expired') await flag(order, 'paid_after_expiry');
  else await markOrderPaid(order.id, { verifiedBy: 'webhook', reference: evt.paymentId });
  res.status(200).end();
});
```

#### E6. Go-live checklist (before any real money)

1. Merchant account activated and verified at the provider; settlement account confirmed (or the payee UPI ID confirmed for `direct_upi`).
2. Webhook URL registered, secret stored as a Functions secret, a test event received and verified.
3. All TC-15 to TC-27 pass in the emulator and in provider test mode.
4. One small real payment made end to end, matched in the provider dashboard and bank statement.
5. Refund and cancellation policy, terms, and privacy notice published; tax invoicing requirements checked for the business.
6. Blaze plan active with a budget alert; alerts on webhook failures and `amount_mismatch`.
7. `demo` mode and the simulate button confirmed absent from the production build.

### Appendix F: Sign-off

| Role | Name | Decision | Date |
|---|---|---|---|
| Product owner | Chetann | v2.0 approved; v2.1 payment changes pending review | |
| Project guide / evaluator | | Review | |

---

<div align="center">

**GlowShine Co. is not just a beauty website. It is a beauty retail intelligence system presented as an e-commerce store.**

*End of document*

</div>
