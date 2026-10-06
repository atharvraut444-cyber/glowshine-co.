# GlowShine Co. --- Backend & Firebase Engineering Specification

**Version:** 1.0\
**Project:** E-Business & Retailing --- Beauty & Personal Care\
**Brand:** GlowShine Co.\
**Backend platform:** Firebase\
**Frontend contract:** React/Vite web application\
**Primary goal:** Build a reliable, secure, testable prototype that
actually works end-to-end.

------------------------------------------------------------------------

## 1. Backend North Star

GlowShine is not a static beauty website with a fake analytics
dashboard.

The backend must support this real flow:

``` text
CUSTOMER ACTION
      ↓
AUTHENTICATED USER / SESSION
      ↓
FIREBASE
      ↓
BEHAVIOUR EVENT
      ↓
CLOUD FUNCTION / AGGREGATION
      ↓
CUSTOMER INTELLIGENCE
      ├── GlowScore
      ├── GlowIntent
      ├── GlowSegment
      ├── GlowMatch
      └── GlowPredict
      ↓
CUSTOMER EXPERIENCE + ADMIN ANALYTICS
```

The backend must be designed so that:

-   customer data is protected
-   customers can only modify their own allowed data
-   admins can manage business data
-   prices and totals cannot be trusted from the browser
-   analytics are based on stored events/orders rather than hardcoded
    numbers
-   duplicate orders/events are handled safely
-   stock cannot become negative because of a race condition
-   failures are visible and recoverable
-   development and production Firebase environments are not
    accidentally mixed
-   every major backend feature can be tested before deployment

------------------------------------------------------------------------

# 2. Firebase Services

Use Firebase as the primary backend.

  -----------------------------------------------------------------------
  Service                             Responsibility
  ----------------------------------- -----------------------------------
  Firebase Authentication             Login, registration, identity

  Cloud Firestore                     Main application database

  Realtime Database                   Live presence and live activity

  Cloud Functions                     Trusted backend logic

  Firebase Storage                    Product/user media

  Firebase Analytics                  Product/customer event analytics

  Firebase App Check                  Help protect Firebase resources
                                      from unauthorized clients

  Firebase Hosting                    Web deployment

  Local Emulator Suite                Local development/testing
  -----------------------------------------------------------------------

Firebase's web SDK provides modules for Authentication, Firestore,
Functions, Storage, Analytics, Realtime Database, App Check and other
Firebase services. citeturn0search9

Do not introduce a second backend server unless a requirement genuinely
cannot be handled by Firebase.

------------------------------------------------------------------------

# 3. Architecture

``` text
                         GLOWSHINE WEB APP
                                │
                         React + Firebase SDK
                                │
              ┌─────────────────┼─────────────────┐
              ↓                 ↓                 ↓
          Auth Layer       Application Data    Analytics
              │                 │                 │
              ↓                 ↓                 ↓
       Firebase Auth       Cloud Firestore   Firebase Analytics
                                │
                     ┌──────────┼──────────┐
                     ↓          ↓          ↓
                 Functions    Storage    Realtime DB
                     │                     │
                     ↓                     ↓
              Intelligence            Live Activity
                     │
          ┌──────────┼───────────┐
          ↓          ↓           ↓
      GlowScore  GlowIntent  GlowMatch
          ↓          ↓           ↓
          └──────────┼───────────┘
                     ↓
              Customer Experience
```

------------------------------------------------------------------------

# 4. Environments

Do not develop directly against the production Firebase project.

Use:

``` text
Development
    ↓
Firebase Emulator Suite
    ↓
Firebase Dev Project
    ↓
Testing
    ↓
Production Firebase Project
```

Recommended project names:

``` text
glowshine-dev
glowshine-prod
```

If only one Firebase project is available for the college prototype,
still use the Emulator Suite for local development and testing.

Never commit secrets, service-account private keys, `.env` files
containing secrets, or Firebase Admin credentials to Git.

------------------------------------------------------------------------

# 5. Firebase Configuration

Frontend Firebase configuration belongs in a dedicated module:

``` text
src/
└── lib/
    └── firebase/
        ├── config.js
        ├── auth.js
        ├── firestore.js
        ├── storage.js
        ├── analytics.js
        ├── realtime.js
        └── appCheck.js
```

The Firebase web configuration is not a substitute for security. Real
protection comes from Authentication, Security Rules, App Check and
trusted server-side logic.

------------------------------------------------------------------------

# 6. Authentication

## Supported methods

Minimum:

-   Email/password
-   Google Sign-In

Optional later:

-   Password reset
-   Email verification
-   Phone authentication

Firebase Authentication supports email/password and federated providers
such as Google. citeturn0search3turn0search17

------------------------------------------------------------------------

## Auth Flow

``` text
Register
  ↓
Firebase Auth creates UID
  ↓
Create users/{uid}
  ↓
Initialize customer profile
  ↓
Redirect to onboarding/home
```

Login:

``` text
Login
  ↓
Firebase Auth
  ↓
onAuthStateChanged
  ↓
Load user profile
  ↓
Check role
  ↓
Route to customer/admin area
```

Never use localStorage as the source of truth for authentication.

------------------------------------------------------------------------

# 7. Roles

Use two primary roles:

``` text
customer
admin
```

Optional future roles:

``` text
manager
analyst
```

The frontend may hide admin routes from customers, but frontend hiding
is not security.

Authorization must be enforced by Firebase Security Rules and trusted
backend logic.

Firebase Security Rules can use the authenticated user's `auth.uid` and
custom claims for role-based access. citeturn0search11

------------------------------------------------------------------------

# 8. Admin Role Strategy

Preferred:

``` text
Firebase Auth
     ↓
Admin custom claim
     ↓
Security Rules
```

Example claim:

``` javascript
{
  admin: true
}
```

Do not allow customers to update their own `role` field.

Do not implement:

``` javascript
if (user.role === "admin")
```

as the only security mechanism.

That is a frontend authorization check, not a secure backend
authorization system.

------------------------------------------------------------------------

# 9. Firestore Data Model

Main collections:

``` text
users
products
categories
brands
behaviourEvents
carts
wishlists
orders
reviews
recommendations
segments
campaigns
analyticsSnapshots
settings
```

------------------------------------------------------------------------

# 10. Users

Path:

``` text
users/{uid}
```

Example:

``` javascript
{
  uid: "firebase-auth-uid",
  name: "Customer Name",
  email: "customer@example.com",

  role: "customer",

  photoURL: null,

  beautyProfile: {
    interests: ["skincare"],
    goals: ["hydration"],
    skinType: "combination",
    budgetMin: 500,
    budgetMax: 1000
  },

  intelligence: {
    glowScore: 42,
    glowIntent: 20,
    segmentId: "glow-explorer",
    totalOrders: 0,
    totalSpend: 0
  },

  createdAt: "server timestamp",
  updatedAt: "server timestamp"
}
```

Do not store passwords in Firestore.

Firebase Authentication owns credentials.

------------------------------------------------------------------------

# 11. Products

Path:

``` text
products/{productId}
```

Schema:

``` javascript
{
  name: "Hydrating Serum",
  slug: "hydrating-serum",

  brandId: "brand_001",
  categoryId: "skincare",
  subcategoryId: "serum",

  description: "...",

  price: 699,
  compareAtPrice: 799,

  currency: "INR",

  images: [
    "storage-url-1",
    "storage-url-2"
  ],

  skinTypes: [
    "oily",
    "combination",
    "normal"
  ],

  concerns: [
    "dryness",
    "dullness"
  ],

  tags: [
    "hydrating",
    "daily-use"
  ],

  rating: 4.7,
  reviewCount: 328,

  stock: 120,
  lowStockThreshold: 10,

  active: true,

  createdAt: "server timestamp",
  updatedAt: "server timestamp"
}
```

------------------------------------------------------------------------

# 12. Price Rules

The browser must never be trusted for final order totals.

Bad:

``` text
frontend sends:
price = 699
discount = 200
total = 499
```

Better:

``` text
frontend sends:
productId
quantity
campaignId
```

Trusted backend:

``` text
load product
→ verify active
→ verify stock
→ read server-side price
→ calculate discount
→ calculate subtotal
→ calculate final total
→ create order
```

This prevents simple client-side price manipulation.

------------------------------------------------------------------------

# 13. Categories

Path:

``` text
categories/{categoryId}
```

Example:

``` javascript
{
  name: "Skincare",
  slug: "skincare",
  imageUrl: "...",
  active: true,
  sortOrder: 1
}
```

Initial categories:

``` text
Skincare
Makeup
Haircare
Fragrance
Personal Care
```

------------------------------------------------------------------------

# 14. Brands

Path:

``` text
brands/{brandId}
```

Example:

``` javascript
{
  name: "GlowCare",
  slug: "glowcare",
  logoUrl: "...",
  active: true
}
```

------------------------------------------------------------------------

# 15. Behaviour Events

Path:

``` text
behaviourEvents/{eventId}
```

Every meaningful interaction creates an event.

Example:

``` javascript
{
  userId: "uid",
  sessionId: "session-id",

  eventType: "product_view",

  productId: "prod_001",
  categoryId: "skincare",

  metadata: {
    source: "search",
    query: "hydrating serum"
  },

  createdAt: "server timestamp"
}
```

------------------------------------------------------------------------

# 16. Behaviour Event Types

Supported events:

``` text
page_view
search
category_view
product_view
wishlist_add
wishlist_remove
cart_add
cart_remove
begin_checkout
purchase
review_submit
quiz_complete
routine_create
recommendation_view
recommendation_click
offer_view
offer_click
```

Do not create a new event name for every tiny UI animation.

Only record behaviour that is useful for product/business intelligence.

------------------------------------------------------------------------

# 17. Event Validation

Every event must have:

``` text
eventType
createdAt
sessionId
```

Optional:

``` text
productId
categoryId
campaignId
query
source
```

Allowed event types should be validated.

Do not let the client invent arbitrary Firestore fields or unlimited
nested objects.

------------------------------------------------------------------------

# 18. Anonymous vs Authenticated Behaviour

Visitors may browse before logging in.

Use:

``` text
anonymous sessionId
```

Once the user logs in:

``` text
anonymous session
        ↓
authenticated UID
```

Optionally associate prior anonymous events with the authenticated user.

Do not store unnecessary personal information in anonymous analytics
events.

------------------------------------------------------------------------

# 19. Firebase Analytics

Use Firebase Analytics for broader product analytics.

Core e-commerce events:

``` text
view_item
search
add_to_cart
add_to_wishlist
begin_checkout
purchase
```

Custom GlowShine events:

``` text
glow_quiz_complete
glow_match_view
glow_match_click
routine_created
offer_view
offer_click
```

Use Firestore behaviour events for application-specific intelligence and
Firebase Analytics for broader analytics/reporting.

------------------------------------------------------------------------

# 20. Event Tracking Architecture

Create one central event service.

``` text
src/services/behaviour/
├── eventTracker.js
├── eventTypes.js
└── session.js
```

Usage:

``` javascript
trackEvent("product_view", {
  productId
});
```

Do not scatter raw Firestore writes throughout 30 React components.

Bad:

``` text
ProductCard → Firestore
ProductPage → Firestore
Wishlist → Firestore
Cart → Firestore
```

Better:

``` text
UI
 ↓
trackEvent()
 ↓
event service
 ↓
Firebase
```

------------------------------------------------------------------------

# 21. Sessions

Create a session ID when the user starts browsing.

Store only what is needed:

``` javascript
{
  sessionId,
  startedAt,
  lastActivityAt
}
```

A session can expire after inactivity.

Recommended prototype threshold:

``` text
30 minutes inactivity
```

------------------------------------------------------------------------

# 22. Cart

Path:

``` text
carts/{uid}
```

Schema:

``` javascript
{
  items: [
    {
      productId: "prod_001",
      quantity: 2,
      addedAt: "timestamp"
    }
  ],

  updatedAt: "timestamp"
}
```

Do not store the final price as the authoritative value in the cart.

Prices should be re-read when creating the order.

------------------------------------------------------------------------

# 23. Wishlist

Path:

``` text
wishlists/{uid}/items/{productId}
```

Example:

``` javascript
{
  productId: "prod_001",
  addedAt: "timestamp"
}
```

Use deterministic product IDs here to prevent duplicate wishlist
entries.

------------------------------------------------------------------------

# 24. Orders

Path:

``` text
orders/{orderId}
```

Schema:

``` javascript
{
  userId: "uid",

  items: [
    {
      productId: "prod_001",
      nameSnapshot: "Hydrating Serum",
      unitPrice: 699,
      quantity: 1,
      lineTotal: 699
    }
  ],

  subtotal: 699,
  discount: 0,
  shipping: 0,
  total: 699,

  currency: "INR",

  status: "confirmed",
  paymentStatus: "demo",

  shippingAddress: {
    name: "...",
    phone: "...",
    addressLine1: "...",
    city: "...",
    state: "...",
    postalCode: "..."
  },

  createdAt: "server timestamp",
  updatedAt: "server timestamp"
}
```

Snapshot product name and price into the order so historical orders
remain correct even if the product changes later.

------------------------------------------------------------------------

# 25. Order Status

Use controlled states:

``` text
pending
confirmed
processing
shipped
delivered
cancelled
```

Prototype payment:

``` text
demo
```

Do not claim real payment processing if no gateway is connected.

------------------------------------------------------------------------

# 26. Safe Order Creation

Order creation must be handled by trusted backend logic.

Flow:

``` text
Checkout
 ↓
Cloud Function / trusted backend
 ↓
Read cart
 ↓
Read products
 ↓
Verify active products
 ↓
Verify stock
 ↓
Calculate prices
 ↓
Calculate discounts
 ↓
Create order
 ↓
Decrease stock
 ↓
Clear cart
 ↓
Create purchase event
 ↓
Update intelligence
```

Use a Firestore transaction where stock/order consistency requires
reading current values and updating them atomically. Firestore
transactions are atomic and retry on relevant concurrent modifications.
citeturn0search0turn0search16

------------------------------------------------------------------------

# 27. Stock Protection

Never do this only in the frontend:

``` javascript
stock = stock - quantity;
```

Two users could purchase the last item simultaneously.

Use a transaction or trusted backend operation.

Condition:

``` text
requested quantity <= current stock
```

If false:

``` text
OUT_OF_STOCK
```

Do not create the order.

------------------------------------------------------------------------

# 28. Idempotency

This is a major requirement because duplicate requests can happen.

Example:

``` text
Customer clicks "Place Order"
 ↓
network delay
 ↓
clicks again
```

The system must not create two orders accidentally.

Use an idempotency key such as:

``` text
checkoutId
```

The backend checks whether that checkout has already been processed.

------------------------------------------------------------------------

# 29. Recommendations

Path:

``` text
recommendations/{uid}
```

Example:

``` javascript
{
  generatedAt: "timestamp",

  products: [
    {
      productId: "prod_001",
      score: 94,
      reasons: [
        "goal_match",
        "budget_match",
        "behaviour_match"
      ]
    }
  ]
}
```

------------------------------------------------------------------------

# 30. GlowMatch Algorithm

Prototype scoring:

``` text
Goal match             30 points
Category interest      20 points
Budget match           15 points
Behaviour similarity   15 points
Purchase history       10 points
Popularity             10 points
-------------------------------
Maximum               100
```

Example:

``` text
Goal match       30
Category         20
Budget           15
Behaviour        15
History          10
Popularity        4
-------------------
Match            94
```

Do not claim this is machine learning.

For this prototype it is a deterministic recommendation engine.

------------------------------------------------------------------------

# 31. GlowScore

GlowScore measures engagement, not "beauty quality."

Example signals:

``` text
product_view       +2
search             +3
wishlist_add       +5
cart_add           +10
begin_checkout     +15
purchase           +25
review             +5
repeat_purchase    +15
```

Clamp final score:

``` text
0–100
```

Use time decay later so old activity does not dominate forever.

------------------------------------------------------------------------

# 32. GlowIntent

Score purchase intent:

``` text
Repeated product views     +10
Wishlist                   +15
Cart                       +25
Checkout                   +30
Recent purchase behaviour  +20
```

Normalize:

``` text
0–100
```

Labels:

``` text
0–30    Low
31–65   Medium
66–100  High
```

------------------------------------------------------------------------

# 33. GlowSegment

Initial segments:

``` text
Glow Explorer
Glow Saver
Glow Loyal
Glow Elite
Glow Care
Glow Dormant
```

Example:

``` text
Glow Loyal:
repeat purchases >= 3
```

``` text
Glow Saver:
discount-driven purchase ratio >= 60%
```

``` text
Glow Dormant:
no purchase for configured inactivity period
```

Keep segment rules in one backend module so they can be changed without
rewriting the frontend.

------------------------------------------------------------------------

# 34. GlowPredict

For the prototype:

``` text
average purchase interval
+
last purchase date
+
product/category history
```

Example:

``` text
Average interval: 30 days
Last purchase: 27 days ago

Prediction:
Likely repurchase within 3–5 days
```

This is a heuristic prediction, not an ML model.

Label it honestly.

------------------------------------------------------------------------

# 35. GlowTrend

Calculate trend using:

``` text
views
searches
wishlists
cart adds
purchases
```

Example:

``` text
Trend score =
recent interest
+
recent purchase growth
+
wishlist growth
```

Compare time windows:

``` text
current 7 days
vs
previous 7 days
```

Output:

``` text
+28%
```

Do not display fabricated trend percentages.

------------------------------------------------------------------------

# 36. Analytics Aggregation

Do not make the admin dashboard query thousands of raw behaviour events
every time the dashboard opens.

Use aggregation documents.

Example:

``` text
analyticsSnapshots/{YYYY-MM-DD}
```

Schema:

``` javascript
{
  date: "2026-10-04",

  revenue: 248000,
  orders: 1284,
  customers: 2450,

  productViews: 42890,
  searches: 14220,
  wishlistAdds: 5842,
  cartAdds: 4219,

  conversionRate: 6.5,
  averageOrderValue: 1247
}
```

Cloud Functions can maintain these summaries as events/orders change.

------------------------------------------------------------------------

# 37. Category Analytics

Use aggregate documents or carefully designed queries.

Example:

``` text
analyticsSnapshots/2026-10-04/categories/skincare
```

Possible metrics:

``` text
views
wishlists
cartAdds
orders
revenue
conversionRate
```

------------------------------------------------------------------------

# 38. Product Analytics

Create:

``` text
productAnalytics/{productId}
```

Example:

``` javascript
{
  views: 1240,
  wishlistAdds: 382,
  cartAdds: 214,
  purchases: 68,
  revenue: 47532,

  conversionRate: 5.48,

  updatedAt: "timestamp"
}
```

This makes the admin product analytics page fast.

------------------------------------------------------------------------

# 39. Lost Sales Detector

Condition:

``` text
high views
+
high wishlist/cart activity
+
low purchase conversion
```

Example:

``` text
views > threshold
cartAdds > threshold
conversionRate < threshold
```

Output:

``` text
HIGH INTEREST
LOW CONVERSION
```

Possible reasons displayed by the UI should be clearly labelled as
hypotheses:

``` text
Possible price hesitation
Possible product mismatch
Possible stock issue
Possible checkout friction
```

Do not present these hypotheses as proven facts.

------------------------------------------------------------------------

# 40. Campaigns

Path:

``` text
campaigns/{campaignId}
```

Schema:

``` javascript
{
  name: "Weekend Skincare Offer",

  targetSegment: "glow-saver",

  categoryId: "skincare",

  discountType: "percentage",
  discountValue: 15,

  startAt: "timestamp",
  endAt: "timestamp",

  active: true,

  createdBy: "adminUid",

  createdAt: "timestamp"
}
```

------------------------------------------------------------------------

# 41. Campaign Eligibility

Customer eligibility:

``` text
authenticated
+
segment matches
+
campaign active
+
current date within campaign period
```

Do not trust a campaign discount sent from the browser.

The backend must validate the campaign.

------------------------------------------------------------------------

# 42. Reviews

Path:

``` text
reviews/{reviewId}
```

Schema:

``` javascript
{
  productId: "prod_001",
  userId: "uid",

  rating: 5,
  title: "Very good",
  body: "..."

  verifiedPurchase: true,

  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

Only allow verified purchasers to create a verified review.

Do not let the client set:

``` text
verifiedPurchase: true
```

That field must be determined by trusted backend logic.

------------------------------------------------------------------------

# 43. Review Rating Aggregation

When a review is created/updated/deleted:

``` text
review
 ↓
Cloud Function
 ↓
recalculate rating
 ↓
update products/{productId}
```

Store:

``` text
rating
reviewCount
```

on the product for fast display.

------------------------------------------------------------------------

# 44. Realtime Database

Use Realtime Database only for genuinely live data.

Suggested:

``` text
presence/{uid}
liveActivity/{activityId}
```

Presence:

``` javascript
{
  online: true,
  lastSeen: timestamp,
  currentPage: "/shop/skincare"
}
```

Live activity:

``` javascript
{
  userId: "anonymous/session",
  type: "product_view",
  productId: "prod_001",
  timestamp: timestamp
}
```

Do not store permanent order/product/customer data in Realtime Database
just because it is called "realtime."

------------------------------------------------------------------------

# 45. Live Admin Metrics

Admin can see:

``` text
Currently browsing
Products being viewed
Live category interest
Recent cart activity
```

For privacy, do not expose unnecessary personally identifying
information.

Prefer:

``` text
anonymous visitor
customer segment
city only if genuinely collected and needed
```

rather than displaying private customer information.

------------------------------------------------------------------------

# 46. Firebase Storage

Storage structure:

``` text
products/
  skincare/
  makeup/
  haircare/
  fragrance/
  personal-care/

brands/

users/
```

Product images should be uploaded by admins.

Customer uploads should be restricted to intended paths and file types.

------------------------------------------------------------------------

# 47. Storage Validation

Validate:

``` text
file type
file size
path ownership
admin permission
```

Example allowed product images:

``` text
image/jpeg
image/png
image/webp
```

Set reasonable file-size limits.

Do not allow arbitrary executable uploads.

------------------------------------------------------------------------

# 48. Security Rules Philosophy

Start locked.

Then open only what the application needs.

Firebase recommends starting with restrictive rules and treating
Security Rules as part of the data schema, not as a final afterthought.
citeturn0search4turn0search10

Core rule principle:

``` text
PUBLIC READ:
active product/category/brand data

CUSTOMER:
own profile
own cart
own wishlist
own allowed events
own orders
own reviews

ADMIN:
business management

SERVER:
trusted calculated fields
```

------------------------------------------------------------------------

# 49. Firestore Security Rules

Conceptual access matrix:

  Collection                  Public Read     Customer Read                  Customer Write        Admin
  -------------------- ------------------ ----------------- ------------------------------- ------------
  products               Yes, active only               Yes                              No         Full
  categories                          Yes               Yes                              No         Full
  brands                              Yes               Yes                              No         Full
  users                                No          Own only              Own allowed fields   Controlled
  carts                                No               Own                             Own   Controlled
  wishlists                            No               Own                             Own   Controlled
  orders                               No               Own   No direct status/total writes   Controlled
  reviews                       Published   Own + published               Own create/update     Moderate
  behaviourEvents                      No               Own                  Limited create         Read
  recommendations                      No               Own                              No         Read
  campaigns                 Public active          Eligible                              No         Full
  analyticsSnapshots                   No                No                              No         Read

------------------------------------------------------------------------

# 50. Critical Security Rule Principle

The customer must never be allowed to write trusted calculated fields
such as:

``` text
role
glowScore
glowIntent
segmentId
totalSpend
totalOrders
verifiedPurchase
rating aggregates
productAnalytics
analyticsSnapshots
```

These are server-controlled fields.

------------------------------------------------------------------------

# 51. User Update Rules

Customer may update:

``` text
name
photoURL
beautyProfile
```

But not:

``` text
role
email ownership
totalSpend
GlowScore
segment
```

Email identity belongs to Firebase Authentication.

------------------------------------------------------------------------

# 52. Order Security

Customer can:

``` text
read own order
```

Customer cannot:

``` text
change total
change paymentStatus
change userId
change price
mark delivered
```

Admin/backend controls order state.

------------------------------------------------------------------------

# 53. Product Security

Customer:

``` text
read active products
```

Customer cannot:

``` text
change price
change stock
change discount
delete product
```

Admin can manage these.

------------------------------------------------------------------------

# 54. App Check

Enable Firebase App Check for supported services.

For web, Firebase documents reCAPTCHA Enterprise as a recommended App
Check provider for new integrations. citeturn0search5turn0search15

Use App Check as an additional protection layer.

Do not confuse App Check with user authentication:

``` text
Authentication = WHO is the user?

App Check = IS this request coming from an expected app?
```

------------------------------------------------------------------------

# 55. Cloud Functions

Recommended function groups:

``` text
functions/
└── src/
    ├── auth/
    ├── orders/
    ├── behaviour/
    ├── recommendations/
    ├── analytics/
    ├── reviews/
    ├── campaigns/
    └── admin/
```

------------------------------------------------------------------------

# 56. Function Responsibilities

## Auth

``` text
onUserCreated
```

Create initial user profile.

------------------------------------------------------------------------

## Behaviour

``` text
onBehaviourEventCreated
```

Update relevant aggregate signals.

------------------------------------------------------------------------

## Orders

``` text
createOrder
```

Trusted checkout.

``` text
onOrderCreated
```

Update analytics and customer intelligence.

------------------------------------------------------------------------

## Reviews

``` text
onReviewCreated
```

Update product rating aggregates.

------------------------------------------------------------------------

## Recommendations

``` text
refreshRecommendations
```

Generate GlowMatch results.

------------------------------------------------------------------------

## Analytics

``` text
updateDailyAnalytics
updateProductAnalytics
updateCategoryAnalytics
```

------------------------------------------------------------------------

# 57. Do Not Create a Function for Everything

Avoid:

``` text
one function per button
```

Functions should represent business operations.

Good:

``` text
createOrder
processBehaviourEvent
refreshRecommendations
```

Bad:

``` text
onRedButtonClicked
onGreenButtonClicked
onWishlistIconClicked
```

------------------------------------------------------------------------

# 58. Cloud Function Error Handling

Every callable/backend operation should return predictable errors.

Example:

``` text
UNAUTHENTICATED
PERMISSION_DENIED
PRODUCT_NOT_FOUND
PRODUCT_INACTIVE
OUT_OF_STOCK
INVALID_QUANTITY
CAMPAIGN_EXPIRED
INVALID_CHECKOUT
DUPLICATE_REQUEST
INTERNAL_ERROR
```

Frontend converts these into user-friendly messages.

------------------------------------------------------------------------

# 59. Frontend Error Mapping

Backend:

``` text
OUT_OF_STOCK
```

Frontend:

> This product just sold out. Please remove it from your bag.

Backend:

``` text
PERMISSION_DENIED
```

Frontend:

> You don't have permission to perform this action.

Never expose raw backend stack traces to users.

------------------------------------------------------------------------

# 60. Firestore Queries

Design queries before building screens.

Required queries:

``` text
active products
products by category
products by brand
products by price range
products by rating
user orders
user wishlist
user cart
user recommendations
customer segment
product analytics
daily sales
behaviour trends
```

Create composite indexes only where required.

Firestore automatically indexes many fields, but index design should be
reviewed for actual queries and write cost. Firebase's Firestore best
practices specifically call out index fanout and unnecessary indexing as
performance/cost concerns. citeturn0search12

------------------------------------------------------------------------

# 61. Pagination

Never load:

``` text
all products
all customers
all orders
all behaviour events
```

Use:

``` text
limit()
startAfter()
```

Recommended prototype page size:

``` text
20–30 documents
```

Admin tables should paginate.

------------------------------------------------------------------------

# 62. Search

For the prototype:

``` text
normalized name
normalized brand
normalized category
tags
```

Do not pretend Firestore is a full-text search engine.

If the project later requires typo tolerance, relevance ranking or
large-scale search, add a dedicated search service.

For the college prototype, keep search simple and reliable.

------------------------------------------------------------------------

# 63. Product Filtering

Filter queries should be composed from supported fields.

Example:

``` text
categoryId
brandId
price
rating
active
```

Avoid building one impossible mega-query with every filter combination.

Test actual filter combinations and create required indexes.

------------------------------------------------------------------------

# 64. Analytics Cost Control

Do not write dozens of events for every mouse movement.

Never track:

``` text
mousemove
scroll every 1%
hover every frame
cursor position
```

Track meaningful business events.

This keeps the prototype:

-   faster
-   cheaper
-   easier to analyze
-   easier to secure

------------------------------------------------------------------------

# 65. Behaviour Event Rate Limiting

Add basic client throttling/debouncing for high-frequency event sources.

Example:

``` text
search:
track after meaningful search submission

product_view:
once per product/session window

recommendation_view:
once per rendered recommendation group
```

Do not let a single page create hundreds of unnecessary Firestore
writes.

------------------------------------------------------------------------

# 66. Atomic Operations

Use transactions when:

``` text
current value must be read
+
new value depends on current value
```

Examples:

``` text
stock update
counter update
sequence-like state
```

Use batched writes when:

``` text
multiple independent writes
```

must succeed atomically.

Firestore supports atomic transactions and batched writes.
citeturn0search0

------------------------------------------------------------------------

# 67. Offline Strategy

Firestore supports offline persistence on web and synchronizes local
changes when connectivity returns. citeturn0search1

For GlowShine:

Use offline support cautiously.

Good candidates:

``` text
product browsing cache
recently viewed data
non-critical UI state
```

Do not assume offline checkout is safe.

Critical operations such as order creation should require confirmed
backend completion.

------------------------------------------------------------------------

# 68. Loading States

Every Firebase operation must have:

``` text
loading
success
error
empty
```

Example:

``` text
Products loading...
Products loaded
No products found
Unable to load products
```

Never leave the UI frozen while Firebase is waiting.

------------------------------------------------------------------------

# 69. Retry Strategy

Retry safe read operations.

Do not blindly retry order creation.

For writes:

``` text
idempotency key
+
backend validation
```

is more important than automatic retries.

------------------------------------------------------------------------

# 70. Data Validation

Validate on the backend:

``` text
quantity >= 1
quantity <= maximumAllowed
rating between 1 and 5
price from database
discount from campaign
product exists
product active
user authenticated
campaign active
```

Frontend validation is for UX.

Backend validation is for correctness.

------------------------------------------------------------------------

# 71. Admin Product CRUD

Admin functions:

``` text
createProduct
updateProduct
archiveProduct
restoreProduct
updateStock
uploadProductImage
```

Prefer archive/deactivate instead of hard deletion for products that
already appear in historical orders.

------------------------------------------------------------------------

# 72. Admin Customer Management

Admin can view:

``` text
customer profile
orders
spend
GlowScore
GlowIntent
segment
behaviour summary
```

Admin should not edit sensitive authentication credentials from
arbitrary Firestore fields.

------------------------------------------------------------------------

# 73. Analytics Dashboard Data Flow

``` text
Orders / Behaviour
        ↓
Cloud Functions
        ↓
Aggregate documents
        ↓
Admin dashboard
        ↓
Charts
```

Do not make the dashboard calculate all historical analytics in the
browser every time.

------------------------------------------------------------------------

# 74. Dashboard KPIs

Required:

``` text
Revenue
Orders
Customers
Average Order Value
Conversion Rate
Product Views
Searches
Wishlist Adds
Cart Adds
```

Optional:

``` text
Repeat Purchase Rate
Abandoned Cart Rate
Top Category
Top Product
Customer Lifetime Value
```

For a prototype, only show metrics that can be computed correctly from
available data.

------------------------------------------------------------------------

# 75. Conversion Definition

Use one consistent definition.

Example:

``` text
conversionRate =
customersWithPurchase /
customersWithShoppingSession
× 100
```

Document the definition.

Do not mix:

``` text
orders / page views
```

with:

``` text
customers / sessions
```

and label both "conversion."

------------------------------------------------------------------------

# 76. AOV

Use:

``` text
AOV =
completed order revenue /
completed orders
```

Exclude cancelled orders.

Document this rule in analytics code.

------------------------------------------------------------------------

# 77. Revenue

For the prototype:

``` text
revenue =
sum of confirmed/completed order totals
```

Choose one business rule and use it everywhere.

Do not calculate revenue from cart values.

------------------------------------------------------------------------

# 78. Abandoned Cart

Define:

``` text
cart has items
+
no successful order
+
last cart activity older than configured threshold
```

Example:

``` text
24 hours
```

This should be labelled as an analytical definition, not a universal
e-commerce standard.

------------------------------------------------------------------------

# 79. Lost Sales

A product can be marked as an opportunity when:

``` text
high interest
+
high cart activity
+
low purchase conversion
```

Store the computed result:

``` text
lostSalesOpportunities/{productId}
```

with:

``` javascript
{
  score: 82,
  reasonCodes: [
    "HIGH_CART_ACTIVITY",
    "LOW_CONVERSION"
  ],
  calculatedAt: "timestamp"
}
```

------------------------------------------------------------------------

# 80. Customer Intelligence Update Flow

``` text
Customer views product
        ↓
behaviourEvents
        ↓
processBehaviourEvent
        ↓
update:
  engagement signals
  recent interests
  category affinity
        ↓
recalculate:
  GlowScore
  GlowIntent
  segment
        ↓
refresh recommendation signals
```

Do not recompute expensive historical analytics on every page click.

Use incremental aggregates where possible.

------------------------------------------------------------------------

# 81. Recommendation Refresh Strategy

Refresh when:

``` text
Glow profile changes significantly
purchase completed
wishlist changes
major category interest changes
```

Do not regenerate 100 recommendations on every mouse movement.

------------------------------------------------------------------------

# 82. Data Retention

For the college prototype:

Keep enough event data to demonstrate the system.

Suggested:

``` text
raw behaviour events:
retain during project/demo period
```

If this becomes a real product, define:

-   retention period
-   deletion policy
-   user data export
-   account deletion
-   privacy policy
-   analytics consent where required

------------------------------------------------------------------------

# 83. User Deletion

Provide a future-safe design for:

``` text
Delete account
```

Flow:

``` text
Firebase Auth user
+
Firestore personal profile
+
wishlist
+
cart
+
personal behaviour data
```

Historical order records may need a different retention/anonymization
policy.

Do not casually delete financial/order records without defining the
business rule.

------------------------------------------------------------------------

# 84. Privacy

Collect only what GlowShine actually needs.

Do not collect:

``` text
unnecessary contacts
precise location
device identifiers
private messages
```

unless there is a clear requirement.

Behaviour analytics should be designed around shopping relevance.

------------------------------------------------------------------------

# 85. Secrets

Never put:

``` text
serviceAccountKey.json
private keys
Admin SDK credentials
secret API keys
```

inside:

``` text
src/
public/
Git repository
```

Use environment variables or managed server-side configuration where
appropriate.

Firebase's security guidance specifically warns that service-account
private keys are sensitive and must be kept secret. citeturn0search4

------------------------------------------------------------------------

# 86. Gitignore

At minimum:

``` text
.env
.env.*
!.env.example

node_modules/

.firebase/
firebase-debug.log

serviceAccountKey.json
*-service-account.json

functions/.env
functions/.env.*
```

Never commit actual credentials.

------------------------------------------------------------------------

# 87. Local Emulator Suite

Use emulators for:

``` text
Authentication
Firestore
Realtime Database
Functions
Storage
```

Development flow:

``` text
npm run dev
+
Firebase emulators
```

This prevents accidental writes to production while building.

------------------------------------------------------------------------

# 88. Security Testing

Create tests for:

``` text
unauthenticated user
customer user
admin user
```

Test:

``` text
customer cannot read another customer's profile
customer cannot edit another customer's cart
customer cannot change order total
customer cannot change role
customer cannot change GlowScore
customer cannot modify product price
admin can manage products
admin can read analytics
```

Firebase recommends testing Security Rules with the Local Emulator Suite
and incorporating rule testing into development/CI. citeturn0search4

------------------------------------------------------------------------

# 89. Core Test Matrix

## Authentication

``` text
Register
Login
Logout
Wrong password
Duplicate email
Password reset
Google login
```

## Products

``` text
List
Search
Filter
Details
Inactive product
Out-of-stock product
```

## Cart

``` text
Add
Remove
Quantity update
Empty cart
Unavailable product
```

## Checkout

``` text
Valid order
Invalid quantity
Out of stock
Duplicate click
Price changed
Expired campaign
```

## Analytics

``` text
View tracked
Search tracked
Wishlist tracked
Cart tracked
Purchase tracked
Dashboard updates
```

------------------------------------------------------------------------

# 90. Failure Recovery

If an operation fails:

``` text
do not silently fail
```

Show:

``` text
user-friendly error
```

Log:

``` text
function name
error code
timestamp
correlation/request ID if available
```

Do not expose secrets or raw stack traces to the customer.

------------------------------------------------------------------------

# 91. Observability

Monitor:

``` text
Cloud Function errors
Firestore usage
Storage usage
Authentication errors
failed checkouts
permission errors
```

Firebase's security guidance recommends monitoring and alerting for
backend services and considering abuse protection. citeturn0search4

------------------------------------------------------------------------

# 92. Performance Rules

Backend:

-   paginate large collections
-   avoid unnecessary listeners
-   avoid excessive event writes
-   use aggregate documents
-   use transactions only where needed
-   use batched writes where appropriate
-   create required indexes
-   avoid oversized documents

Frontend:

-   lazy load product images
-   cache safe reads
-   avoid unnecessary realtime listeners
-   unsubscribe listeners on unmount

------------------------------------------------------------------------

# 93. Realtime Listener Cleanup

Every `onSnapshot` / realtime listener must be unsubscribed.

Pattern:

``` text
component mounts
 ↓
listener created
 ↓
component unmounts
 ↓
listener unsubscribed
```

Otherwise the app can accumulate listeners and produce duplicate
updates.

------------------------------------------------------------------------

# 94. Firestore Document Size Discipline

Do not put:

``` text
thousands of behaviour events
```

inside one user document.

Bad:

``` text
users/{uid}
  events: [10,000 objects]
```

Good:

``` text
behaviourEvents/{eventId}
```

and aggregate:

``` text
users/{uid}.intelligence
```

------------------------------------------------------------------------

# 95. Avoid Giant Documents

Keep documents focused.

Example:

``` text
users
products
orders
behaviourEvents
analytics
```

rather than:

``` text
one massive user document containing everything
```

------------------------------------------------------------------------

# 96. Backend Naming Convention

Use consistent names.

Collections:

``` text
camelCase
```

Fields:

``` text
camelCase
```

IDs:

``` text
auto/generated IDs
```

Avoid manually sequential IDs such as:

``` text
product1
product2
product3
```

Firestore's best-practice guidance notes that sequential IDs can
contribute to hotspots. citeturn0search12

Use Firestore-generated IDs or carefully designed identifiers.

------------------------------------------------------------------------

# 97. Recommended Project Structure

``` text
glowshine-co/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── context/
│   │
│   ├── lib/
│   │   └── firebase/
│   │       ├── config.js
│   │       ├── auth.js
│   │       ├── firestore.js
│   │       ├── storage.js
│   │       ├── analytics.js
│   │       ├── realtime.js
│   │       └── appCheck.js
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── orders/
│   │   ├── reviews/
│   │   ├── behaviour/
│   │   ├── recommendations/
│   │   └── analytics/
│   │
│   └── utils/
│
├── functions/
│   └── src/
│       ├── auth/
│       ├── behaviour/
│       ├── orders/
│       ├── recommendations/
│       ├── analytics/
│       ├── reviews/
│       ├── campaigns/
│       └── admin/
│
├── tests/
│   ├── rules/
│   ├── functions/
│   └── integration/
│
├── firestore.rules
├── firestore.indexes.json
├── database.rules.json
├── storage.rules
├── firebase.json
├── .firebaserc
├── .env.example
└── README.md
```

------------------------------------------------------------------------

# 98. Service Layer Rule

React components should not contain large Firebase queries.

Bad:

``` text
ProductPage.jsx
  300 lines of Firestore logic
```

Better:

``` text
ProductPage
 ↓
productService.getProduct()
 ↓
Firebase
```

This makes errors easier to isolate.

------------------------------------------------------------------------

# 99. Repository/Service Responsibilities

Example:

``` text
productService
    getProducts()
    getProductById()
    searchProducts()
    getProductsByCategory()

cartService
    getCart()
    addToCart()
    updateQuantity()
    removeFromCart()

orderService
    createOrder()
    getOrders()
    getOrder()

behaviourService
    trackEvent()

recommendationService
    getRecommendations()

analyticsService
    getDashboardMetrics()
```

------------------------------------------------------------------------

# 100. Single Source of Truth

For each data type:

``` text
Authentication identity
→ Firebase Auth

Product
→ Firestore products

Cart
→ Firestore carts

Order
→ Firestore orders

Behaviour
→ behaviourEvents

Calculated customer intelligence
→ backend-owned fields/documents

Live presence
→ Realtime Database
```

Do not duplicate authoritative values unnecessarily.

------------------------------------------------------------------------

# 101. Backend-Owned Fields

These fields are server controlled:

``` text
order total
order status
product analytics
customer spend
customer order count
GlowScore
GlowIntent
segment
recommendation score
verifiedPurchase
daily revenue
conversion metrics
```

------------------------------------------------------------------------

# 102. Client-Owned Fields

Customer can control:

``` text
name
beauty preferences
skin type
goals
budget preference
wishlist actions
cart actions
review text/rating
```

Subject to validation.

------------------------------------------------------------------------

# 103. Admin-Owned Fields

Admin can control:

``` text
product price
product stock
product status
campaigns
categories
brands
editorial content
```

Security Rules must enforce this.

------------------------------------------------------------------------

# 104. Demo Payment Architecture

For the college prototype:

``` text
Checkout
 ↓
Demo Payment
 ↓
"Payment Successful"
 ↓
create order
```

The UI must clearly identify this as demo/simulated payment.

If a real gateway is added later:

``` text
Frontend
 ↓
trusted backend
 ↓
payment provider
 ↓
verified payment result
 ↓
order confirmation
```

Never mark a real order paid solely because the browser says payment
succeeded.

------------------------------------------------------------------------

# 105. Email/SMS

Do not make email/SMS a core dependency of the first prototype.

Optional later:

``` text
order confirmation
campaign message
abandoned cart
```

The website should remain functional if notification services are
disabled.

------------------------------------------------------------------------

# 106. AI/ML Boundary

The first working prototype does not need machine learning.

Use:

``` text
rules
weighted scoring
aggregates
behaviour trends
```

Then optionally add:

``` text
ML recommendation model
sentiment analysis
purchase prediction
```

later.

Do not add AI just to put "AI-powered" on the homepage.

------------------------------------------------------------------------

# 107. Backend Build Order

Follow this exact order.

## Phase 1 --- Firebase Foundation

``` text
Firebase project
↓
Web app registration
↓
Auth
↓
Firestore
↓
Storage
↓
Realtime Database
↓
Functions
↓
Analytics
↓
App Check
```

------------------------------------------------------------------------

## Phase 2 --- Security First

``` text
Firestore rules
Storage rules
Realtime rules
Admin claims
Emulator tests
```

Do not postpone this.

------------------------------------------------------------------------

## Phase 3 --- Core Data

``` text
users
products
categories
brands
```

Seed 40--60 products.

------------------------------------------------------------------------

## Phase 4 --- Commerce

``` text
cart
wishlist
checkout
orders
stock
```

Make checkout transactional/idempotent.

------------------------------------------------------------------------

## Phase 5 --- Behaviour

``` text
session
event tracker
behaviour events
Analytics events
```

------------------------------------------------------------------------

## Phase 6 --- Intelligence

``` text
GlowScore
GlowIntent
GlowSegment
GlowMatch
GlowPredict
GlowTrend
```

------------------------------------------------------------------------

## Phase 7 --- Admin Analytics

``` text
sales
behaviour
customers
products
segments
lost sales
campaigns
```

------------------------------------------------------------------------

## Phase 8 --- Reliability

``` text
error handling
loading states
pagination
indexes
listener cleanup
emulator tests
security tests
```

------------------------------------------------------------------------

# 108. Definition of Done

The backend is not finished when the page "looks connected."

It is finished when:

-   user registration works
-   login works
-   logout works
-   user profile is created
-   role-based routing works
-   Security Rules block unauthorized access
-   products load from Firestore
-   admin can create/update products
-   images upload to Storage
-   search works
-   filters work
-   wishlist works
-   cart works
-   quantity updates work
-   stock is validated
-   checkout creates exactly one order
-   order totals are calculated from trusted data
-   orders are stored
-   purchase events are generated
-   behaviour events are stored
-   GlowScore updates
-   GlowIntent updates
-   segments update
-   recommendations load
-   analytics update
-   admin dashboard uses real Firebase data
-   live activity works where implemented
-   error states work
-   empty states work
-   loading states work
-   mobile works
-   security tests pass
-   no secret credentials are committed
-   production rules are not left in test mode

------------------------------------------------------------------------

# 109. Final End-to-End Test

Use this scenario before presenting.

``` text
1. Register customer
        ↓
2. Complete Glow Profile
        ↓
3. Search "sunscreen"
        ↓
4. View 3 products
        ↓
5. Wishlist 1
        ↓
6. Add 1 to cart
        ↓
7. Begin checkout
        ↓
8. Place demo order
        ↓
9. Verify order in Firestore
        ↓
10. Verify purchase event
        ↓
11. Verify GlowScore update
        ↓
12. Verify recommendation update
        ↓
13. Open Admin
        ↓
14. Verify revenue changed
        ↓
15. Verify product analytics changed
        ↓
16. Verify customer behaviour changed
        ↓
17. Verify segment/intelligence changed
```

If this sequence works from a fresh account, the core prototype works.

------------------------------------------------------------------------

# 110. Failure Checklist Before Demo

Before presenting, test:

``` text
[ ] Fresh user registration
[ ] Existing user login
[ ] Wrong password
[ ] Product loading
[ ] Product image loading
[ ] Search
[ ] Filters
[ ] Wishlist
[ ] Cart
[ ] Quantity
[ ] Out-of-stock product
[ ] Checkout
[ ] Duplicate checkout click
[ ] Order creation
[ ] Order history
[ ] Review
[ ] Behaviour tracking
[ ] GlowScore
[ ] GlowMatch
[ ] Admin login
[ ] Admin product CRUD
[ ] Dashboard metrics
[ ] Security rules
[ ] Mobile layout
[ ] Refresh on every important route
[ ] Firebase emulator tests
```

------------------------------------------------------------------------

# 111. The Three Rules That Prevent a Repeat of the KisanSathi-Type Problem

## Rule 1 --- Never fake backend state

If the dashboard says:

``` text
₹24.8L revenue
```

that number must come from Firebase data.

Not:

``` javascript
const revenue = 2480000;
```

------------------------------------------------------------------------

## Rule 2 --- Never trust the client

The browser cannot decide:

``` text
price
discount
stock
role
GlowScore
order total
verified purchase
```

The backend owns those values.

------------------------------------------------------------------------

## Rule 3 --- Test every feature immediately after connecting it

Do not build:

``` text
10 pages
+
50 components
+
Firebase
```

and test at the end.

Build:

``` text
Auth
→ test

Products
→ test

Cart
→ test

Orders
→ test

Behaviour
→ test

Analytics
→ test
```

This isolates failures before they spread.

------------------------------------------------------------------------

# 112. Final Backend Architecture

``` text
                         GLOWSHINE CO.
                              │
                         React Frontend
                              │
                   ┌──────────┴──────────┐
                   ↓                     ↓
             Firebase Auth          App Check
                   │                     │
                   └──────────┬──────────┘
                              ↓
                       Cloud Firestore
                              │
       ┌──────────────┬───────┼──────────────┬──────────────┐
       ↓              ↓       ↓              ↓              ↓
     Users         Products  Cart         Orders       Behaviour
       │              │       │              │              │
       └──────────────┴───────┴──────────────┴──────────────┘
                              ↓
                       Cloud Functions
                              │
             ┌────────────────┼─────────────────┐
             ↓                ↓                 ↓
        Intelligence      Analytics         Validation
             │                │                 │
      ┌──────┼──────┐         ↓                 ↓
      ↓      ↓      ↓    Admin Dashboard   Trusted Orders
    Score  Intent Segment
      │      │      │
      └──────┼──────┘
             ↓
         GlowMatch
             ↓
      Personalized Store

Realtime Database → live presence/activity

Storage → product/user media

Firebase Analytics → broader event analytics

Hosting → deployed web application

Emulator Suite → local testing
```

------------------------------------------------------------------------

# 113. Backend North Star

**GlowShine Co. must behave like a real small-scale e-commerce system,
not a collection of connected screens.**

The customer-facing layer should feel:

> **Premium. Personal. Fast.**

The backend should be:

> **Secure. Consistent. Observable. Testable.**

And the intelligence layer should turn:

> **Behaviour → Insight → Recommendation → Purchase → New Behaviour.**

That loop is the actual backend identity of GlowShine Co.
