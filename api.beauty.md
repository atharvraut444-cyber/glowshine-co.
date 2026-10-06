# API Reference

> GlowShine Co. has no REST server. Its "API" is three things: **callable Cloud Functions**, **Firestore data access** governed by Security Rules, and **background functions** that react to data.
> Related: [Architecture](architecture.md) · [Security](security.md) · [Authentication](auth.md) · [Realtime](realtime.md)

---

## 1. Conventions

| Topic | Convention |
|---|---|
| Transport | Firebase SDK; callables over HTTPS |
| Auth | Firebase ID token attached automatically by the SDK |
| Region | Set once in `functions/src/config` (decide with the Firebase billing plan) |
| Currency | Indian Rupees (₹), stored as whole-number rupees |
| Timestamps | Firestore `Timestamp`; always **server** time for events and orders |
| IDs | Firestore auto IDs, except orders (see `placeOrder`) |
| Errors | Callables throw `HttpsError`; the client maps codes to friendly messages |

> The request/response shapes below are the **intended contract** for the build. Treat them as the specification and update this file if an implementation detail changes.

---

## 2. Callable Functions

Called from the frontend with `httpsCallable(functions, name)`. Every callable verifies authentication first.

### 2.1 `placeOrder`

Creates an order. The server re-prices everything and ignores any client totals.

**Access:** signed-in customer

**Request**

```json
{
  "checkoutRequestId": "7c1f0c8e-5b9a-4d1e-9d0e-3b1f6a2a1c11",
  "items": [
    { "productId": "prod_102", "quantity": 2 },
    { "productId": "prod_077", "quantity": 1 }
  ],
  "address": {
    "name": "Aanya Sharma",
    "phone": "9876543210",
    "line1": "Flat 4B, Rose Residency",
    "city": "Pune",
    "state": "Maharashtra",
    "pincode": "411001"
  },
  "campaignId": "camp_weekend_skin"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `checkoutRequestId` | string (UUID) | yes | Unique per checkout attempt; makes retries idempotent |
| `items` | array | yes | 1–20 entries; each `quantity` an integer from 1 to 10 |
| `address` | object | yes | All fields present; `phone` 10 digits; `pincode` 6 digits |
| `campaignId` | string | no | Applied only if the server confirms eligibility |

The client must **not** send prices, discounts, totals, stock or status. If sent, they are ignored.

**Response**

```json
{
  "orderId": "ord_9f3c...",
  "status": "confirmed",
  "paymentStatus": "demo",
  "subtotal": 1797,
  "discount": 180,
  "delivery": 0,
  "total": 1617,
  "alreadyExisted": false
}
```

**Server behaviour**

1. Reject if `context.auth` is missing.
2. Validate the payload shape and ranges.
3. Load live product price, discount and stock; reject inactive products.
4. Validate the campaign (active, in window, matches user or segment).
5. In **one transaction**: confirm stock, decrement stock, create `orders/{orderId}`.
6. `orderId` is derived from `uid + checkoutRequestId`. A retry returns the existing order with `alreadyExisted: true`.
7. Write a server-side `purchase` event.

**Errors**

| `HttpsError` code | When | Client message |
|---|---|---|
| `unauthenticated` | No valid ID token | "Please sign in again to continue." |
| `invalid-argument` | Bad payload, address or quantity | "Please check your details and try again." |
| `not-found` | Product missing or inactive | "One of your items is no longer available." |
| `failed-precondition` | Insufficient stock | "Some items are no longer available in that quantity." |
| `permission-denied` | Campaign not eligible (soft-fails to no discount where possible) | "That offer isn't available for this order." |
| `unavailable` / `deadline-exceeded` | Backend timeout | "We couldn't reach the server. Please try again." |

```js
// src/services/orders/placeOrder.js (sketch)
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export async function placeOrder(payload) {
  const call = httpsCallable(functions, 'placeOrder');
  const { data } = await call(payload);
  return data;
}
```

### 2.2 `setAdminRole`

Grants or revokes the admin claim.

**Access:** existing admin (granting requires `superAdmin` once that role is enabled)

```json
{ "targetUid": "abc123", "admin": true }
```

```json
{ "ok": true }
```

Errors: `unauthenticated`, `permission-denied` (caller is not an admin), `invalid-argument`, `not-found` (no such user). Every call is written to `auditLogs`. The target user must refresh their token to see the change.

### 2.3 `computeRecommendations` *(internal or callable)*

Recomputes `recommendations/{uid}` for a user, normally invoked by triggers rather than the browser. If exposed as a callable, it only recomputes the **caller's own** recommendations.

Response: `{ "generatedAt": "2026-10-04T10:15:00Z", "count": 20 }`

### 2.4 Admin Callables *(planned)*

Operations that change sensitive state are callables so they can validate and audit.

| Callable | Purpose | Access |
|---|---|---|
| `updateOrderStatus` | Move an order to a valid next status | Admin |
| `moderateReview` | Approve or reject a review | Admin |
| `createReview` | Create a review after verifying a purchase | Customer |

Allowed order statuses: `pending → confirmed → processing → shipped → delivered`, plus `cancelled` and `refunded`. Arbitrary status strings are rejected.

---

## 3. Firestore Data Access

Accessed through the service layer (`src/services/*`). Access control is defined in [security.md](security.md#3-permission-matrix).

### 3.1 Common Queries

| Purpose | Query | Index |
|---|---|---|
| Shop listing | `products` where `active == true` [and `category == X`] order by `price`, `limit(24)` + cursor | `active, category, price` |
| Product detail | `doc('products', id)` | none |
| My orders | `orders` where `userId == uid` order by `createdAt desc`, `limit(10)` | `userId, createdAt` |
| Product reviews | `reviews` where `productId == id` order by `createdAt desc`, `limit(10)` | `productId, createdAt` |
| My recommendations | `doc('recommendations', uid)` | none |
| My cart | `doc('carts', uid)` (listener) | none |
| Customer timeline (admin) | `behaviourEvents` where `userId == X` order by `timestamp desc`, `limit(100)` | `userId, timestamp` |
| Dashboard KPIs (admin) | `doc('analyticsSnapshots', date)` | none |
| Active campaigns | `campaigns` where `status == 'active'` | single-field |

Rules for queries: always include `limit()`; paginate lists; never download a whole collection; create the required index instead of adding a slower fallback query.

### 3.2 Writes the Client May Perform

| Collection | Operation | Allowed fields |
|---|---|---|
| `users/{uid}` | create (once), update | create: `name, email, role:"customer", createdAt`; update: `name, beautyProfile` |
| `carts/{uid}` | set / update | `items`, display totals, `updatedAt` |
| `wishlists/{uid}/items/{productId}` | set / delete | `productId`, `addedAt` (idempotent: same ID, no duplicates) |
| `behaviourEvents` | create only | See event schema below |

Everything else is written by Cloud Functions or an admin callable.

---

## 4. Behaviour Event API

All events go to `behaviourEvents` via `track(eventType, payload)` in `src/services/behaviour`. Tracking is fire-and-forget: it never blocks the UI and swallows its own errors.

```js
// src/services/behaviour/track.js (sketch)
export function track(eventType, payload = {}) {
  if (!auth.currentUser || isDuplicate(eventType, payload)) return;
  addDoc(collection(db, 'behaviourEvents'), {
    userId: auth.currentUser.uid,
    eventType,
    productId: payload.productId ?? null,
    category: payload.category ?? null,
    query: payload.query ?? null,
    value: payload.value ?? null,
    meta: payload.meta ?? {},
    sessionId: getSessionId(),
    timestamp: serverTimestamp(),
  }).catch(() => { /* never surface tracking errors */ });
  logAnalyticsEvent(eventType, payload); // Firebase Analytics mirror
}
```

**Document shape**

```json
{
  "userId": "abc123",
  "eventType": "product_view",
  "productId": "prod_102",
  "category": "Skincare",
  "query": null,
  "value": null,
  "meta": {},
  "sessionId": "session_82",
  "timestamp": "<server timestamp>"
}
```

**Client-writable event types**

| Event | Trigger | Required fields | GA mapping |
|---|---|---|---|
| `page_view` | Route change | `path` (in `meta`) | `page_view` |
| `search` | Search submitted | `query`, result count (in `meta`) | `search` |
| `category_view` | Category opened | `category` | custom |
| `product_view` | Product detail opened | `productId`, `category` | `view_item` |
| `wishlist_add` / `wishlist_remove` | Heart toggled | `productId` | `add_to_wishlist` / custom |
| `cart_add` / `cart_remove` | Cart change | `productId`, `quantity` | `add_to_cart` / `remove_from_cart` |
| `checkout_start` | Checkout begun | `value` | `begin_checkout` |
| `review_submit` | Review posted | `productId`, rating (in `meta`) | custom |
| `quiz_complete` | Quiz finished | summary (in `meta`) | `glow_quiz_complete` |
| `routine_create` | Routine generated | goal (in `meta`) | `routine_created` |
| `recommendation_click` | Recommendation clicked | `productId`, score, position (in `meta`) | `recommendation_click` |
| `offer_click` | Campaign clicked | `campaignId` (in `meta`) | `offer_click` |

**Server-only:** `purchase` (written by `placeOrder`).

**Client rules:** debounce repeats (same product view within 30 seconds); `timestamp` must be the server timestamp; no updates or deletes.

---

## 5. Background Functions

These have no client-facing request/response. They react to data and schedules.

| Function | Trigger | Reads | Writes |
|---|---|---|---|
| `onBehaviourEventCreated` | `behaviourEvents` create | Event, user analytics | `users/{uid}.analytics`, product counters |
| `onOrderCreated` | `orders` create | Order, user history | Spend, order count, segment, predictions inputs |
| `onReviewCreated` | `reviews` create | Review | `sentiment`, `keywords`, product `rating`, `reviewCount` |
| `onCampaignWritten` | `campaigns` write | Campaign | Normalised `status` |
| `syncPresence` | RTDB `presence/{uid}` write | Presence tree | RTDB `liveActivity` |
| `recomputeSegments` | Daily | Users | Segments, `segments/*` aggregates |
| `aggregateAnalytics` | Hourly / daily | Events, orders | `analyticsSnapshots/{date}` |
| `computePredictions` | Daily | Orders | Per-user prediction fields |
| `detectLostSales` | Hourly | Intent, carts, orders | Lost-sale alert records |

All are **idempotent**: replaying a trigger must not double-count.

---

## 6. Response and Error Handling on the Client

```js
// src/utils/errors.js (sketch)
export function toFriendlyMessage(error) {
  switch (error?.code) {
    case 'functions/unauthenticated':
    case 'unauthenticated':        return 'Please sign in again to continue.';
    case 'functions/permission-denied':
    case 'permission-denied':      return "You don't have access to this.";
    case 'functions/failed-precondition': return 'Some items are no longer available in that quantity.';
    case 'functions/invalid-argument':    return 'Please check your details and try again.';
    case 'functions/unavailable':
    case 'unavailable':            return "We couldn't reach the server. Please try again.";
    default:                       return 'Something went wrong. Please try again.';
  }
}
```

Every data view handles **loading, success, empty, error and retry**. Technical details are logged to the console/logging layer, never shown to customers.

---

## 7. Rate Limits and Abuse Controls

- Client debounce on events; one `placeOrder` in flight at a time (button disabled while pending).
- `checkoutRequestId` prevents duplicate orders from retries.
- App Check on all Firebase services; optional per-UID cooldown on callables.
- Payload size limits enforced in callables.

---

## 8. Local Development

```bash
firebase emulators:start          # Auth, Firestore, Functions, RTDB, Storage
npm run seed                      # populate demo data (emulator or project)
```

Point the SDK at the emulators in development (`connectFirestoreEmulator`, `connectFunctionsEmulator`, `connectAuthEmulator`, `connectDatabaseEmulator`, `connectStorageEmulator`) so no real data is touched.
