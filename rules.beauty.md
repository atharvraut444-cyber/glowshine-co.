# GlowShine Co. — Development Rules

## 1. Purpose

This document is the master rulebook for developing the GlowShine Co. website and application.

Every frontend, backend, Firebase, AI, database, authentication, admin, animation, ecommerce, and deployment decision must follow these rules.

The objective is to build GlowShine Co. as a:

- Premium beauty and skincare ecommerce platform
- Fast and responsive web application
- Mobile-first experience
- Secure Firebase-powered system
- Data-driven recommendation platform
- Scalable architecture
- Maintainable codebase
- Production-ready application

Do not implement features that contradict these rules.

---

## 2. Core Development Principle

### Rule 2.1 — Do not build isolated features

Every feature must connect correctly with:

```text
Frontend → Authentication → Firebase → Backend Logic → Database/Storage → UI State
```

A feature is not considered complete if:

- UI works but data is not saved
- Data saves but UI does not update
- Unauthorized users can modify data
- Admin functionality is exposed to customers
- Loading/error states are missing
- Duplicate operations can occur
- Refresh breaks application state
- Mobile layout breaks
- Firebase errors are exposed directly to users

---

## 3. Architecture Rules

Use Firebase as the primary backend platform.

### Firebase services

Use:

- Firebase Authentication
- Cloud Firestore
- Firebase Realtime Database where real-time state is required
- Firebase Cloud Storage
- Firebase Cloud Functions
- Firebase Analytics
- Firebase App Check

### General architecture

```text
GlowShine Frontend
        |
        v
Firebase Authentication
        |
        +------ Firestore
        |
        +------ Realtime Database
        |
        +------ Cloud Storage
        |
        +------ Cloud Functions
        |
        +------ Analytics
        |
        +------ App Check
```

Do not introduce another backend framework unless explicitly required.

Do not duplicate the same data unnecessarily between Firebase services.

---

## 4. Authentication Rules

Firebase Authentication is the only source of truth for user identity.

### Customer authentication

Customers may:

- Register
- Login
- Logout
- Reset password
- Update allowed profile information
- View their own account
- View their own orders
- Manage their own cart
- Manage their own wishlist
- Submit permitted reviews

Customers must never:

- Change their own role
- Grant themselves admin access
- Modify another user's account
- Modify another user's orders
- Modify product inventory
- Modify product prices
- Modify campaigns
- Modify analytics
- Modify recommendations belonging to another user

---

## 5. Admin Authorization

Admin access must NOT depend only on frontend checks.

Never use:

```javascript
if (user.email === "admin@email.com")
```

as the real security mechanism.

Frontend checks are only for UI visibility.

Actual authorization must be enforced by Firebase Security Rules and/or Firebase custom claims.

### Recommended roles

```text
customer
admin
superAdmin
```

### Permissions

**customer**

- Read public products
- Manage own profile
- Manage own cart
- Manage own wishlist
- Create permitted orders
- Read own orders
- Create reviews
- Read public reviews
- Receive recommendations

**admin**

- Manage products
- Manage categories
- Manage inventory
- Manage orders
- Moderate reviews
- Manage campaigns
- View business analytics
- Manage selected content

**superAdmin**

Everything admin can do plus:

- Manage administrators
- Change system-level configuration
- Manage sensitive settings
- Perform destructive administrative operations

---

## 6. Firestore Rules

Cloud Firestore is the primary structured application database.

Expected collections may include:

```text
users
products
categories
carts
wishlists
orders
reviews
recommendations
segments
campaigns
analyticsSnapshots
behaviourEvents
```

Additional collections may be added only when there is a clear requirement.

Every new collection must have:

1. Defined schema
2. Defined owner
3. Defined read permissions
4. Defined write permissions
5. Validation rules
6. Required indexes
7. Test cases

---

## 7. User Data Rules

Users must only be able to modify fields that belong to them.

Example:

```text
/users/{uid}
```

Customer access:

```text
read  → own document
write → own permitted fields
```

Never allow a customer to modify:

```text
role
permissions
admin
isAdmin
createdAt
security metadata
internal flags
```

Server-controlled fields must remain server-controlled.

---

## 8. Product Rules

Products are public-facing content.

Customers may read published products.

Customers must NOT directly modify:

```text
price
stock
costPrice
supplier information
admin metadata
sales statistics
internal analytics
```

Only authorized administrators or trusted backend functions may modify these values.

Product documents should maintain consistent fields such as:

```text
name
slug
description
brand
category
images
price
discountPrice
stock
rating
reviewCount
ingredients
benefits
skinTypes
concerns
tags
isActive
createdAt
updatedAt
```

Do not allow arbitrary uncontrolled fields when validation can prevent them.

---

## 9. Inventory Rules

Inventory is business-critical.

Never trust the stock value sent by the client.

The client may request:

```text
productId
quantity
```

but must not decide:

```text
remainingStock
finalPrice
discountAmount
orderTotal
```

Stock updates must be performed through trusted backend logic where necessary.

Prevent:

- Negative stock
- Overselling
- Duplicate stock deduction
- Unauthorized stock modification

Use transactions for operations where multiple users could modify the same inventory.

---

## 10. Cart Rules

Each authenticated customer owns their cart.

Example:

```text
/carts/{uid}
```

Customers can:

- Add products
- Remove products
- Change quantity
- View their cart

Customers cannot modify another customer's cart.

Do not trust client-calculated totals.

The backend must recalculate:

```text
subtotal
discount
tax if applicable
shipping if applicable
final total
```

before creating a trusted order.

---

## 11. Wishlist Rules

Wishlist data belongs to the authenticated user.

Users may:

- Add products
- Remove products
- View their wishlist

Users cannot modify another user's wishlist.

Wishlist operations should be idempotent.

Adding the same product twice should not create uncontrolled duplicates.

---

## 12. Order Rules

Orders are highly sensitive.

Customers can:

- Create an order through the approved checkout flow
- Read their own orders
- View their own order status

Customers cannot:

- Change order ownership
- Change final price
- Change payment status
- Mark an order as delivered
- Change stock
- Change another customer's order
- Change administrative order notes

Order status should be controlled by trusted backend/admin logic.

Possible states:

```text
pending
confirmed
processing
shipped
delivered
cancelled
refunded
```

Do not allow random status strings.

---

## 13. Checkout Rules

Checkout must be treated as a critical transaction.

Never trust these client values:

```text
finalPrice
discount
stock
paymentStatus
orderStatus
```

Recalculate important values on the trusted backend.

Use idempotency protection so repeated clicks or retries do not create duplicate orders.

Example:

```text
checkoutRequestId
```

must uniquely identify a checkout attempt where appropriate.

---

## 14. Review Rules

Customers may submit reviews only for permitted products.

Reviews should contain controlled fields such as:

```text
userId
productId
rating
title
comment
createdAt
updatedAt
status
```

Users may edit/delete only their own review according to product policy.

Users cannot:

- Change another user's review
- Change review ownership
- Fake verification status
- Increase review count
- Modify product rating directly

Aggregated rating and review counts should be calculated or updated by trusted logic.

Admin may moderate reviews.

Possible moderation states:

```text
pending
approved
rejected
```

---

## 15. Firebase Storage Rules

Cloud Storage must not be publicly writable.

Storage paths must be organized.

Example:

```text
products/{productId}/...
users/{uid}/...
reviews/{reviewId}/...
```

### Product images

Only authorized administrators may upload or modify product images.

Customers must not upload files into product-admin directories.

### User files

If profile images are supported:

```text
users/{uid}/...
```

only that user may modify their own files.

Validate:

- File type
- File size
- Ownership
- Upload path

Never allow unrestricted:

```text
allow read, write: if true;
```

in production.

---

## 16. Realtime Database Rules

Use Realtime Database only for data that genuinely requires real-time behaviour.

Potential uses:

```text
presence
liveActivity
real-time status
temporary session state
```

Do not duplicate Firestore collections in Realtime Database without a clear reason.

Every path must have explicit:

```text
.read
.write
.validate
```

rules where appropriate.

Realtime Database also supports validation and indexing through its rules system.

---

## 17. AI / Recommendation Rules

GlowShine Co. may use behavioural data for features such as:

```text
GlowScore
Intent
Segment
Match
Predict
Trend
```

AI/recommendation logic must never be treated as a security mechanism.

AI output can influence:

- Product recommendations
- Personalization
- Product discovery
- Campaign targeting
- User experience

AI must NOT directly grant:

- Admin access
- Discounts without validation
- Payment approval
- Inventory authority
- Security permissions

Recommendations should be explainable at the product level where possible.

Do not claim medical or guaranteed skincare outcomes.

---

## 18. Behaviour Tracking Rules

Behaviour events may include:

```text
product_view
product_search
category_view
wishlist_add
cart_add
cart_remove
checkout_started
purchase_completed
review_submitted
```

Do not collect unnecessary personal information.

Never store:

- Passwords
- Authentication secrets
- Payment card details
- Private tokens
- API secrets

Behaviour data should be structured and scalable.

Use timestamps and stable identifiers.

---

## 19. Analytics Rules

Analytics data should be separated from sensitive user information where possible.

Track useful business metrics such as:

```text
product views
conversion
cart abandonment
orders
revenue
popular products
category performance
campaign performance
```

Do not allow customers to write business analytics directly.

Analytics aggregation should be performed by trusted backend logic.

---

## 20. Campaign Rules

Campaigns may contain:

```text
name
description
banner
startDate
endDate
targetSegment
status
```

Customers can read active/public campaigns.

Only authorized admins can create, update, activate, deactivate, or delete campaigns.

Campaign targeting must not bypass security rules.

---

## 21. Admin Dashboard Rules

Admin dashboard must have two layers of protection.

### Layer 1 — Frontend

Hide admin UI from normal users.

### Layer 2 — Firebase Security

Actually deny unauthorized requests.

Frontend hiding is NOT security.

Every admin operation must still fail when directly called by an unauthorized client.

---

## 22. Validation Rules

Validate data at multiple levels:

```text
Frontend validation
        +
Backend validation
        +
Firebase Security Rules
```

Never depend only on frontend validation.

Validate:

- Required fields
- Data types
- String lengths
- Numeric ranges
- Valid IDs
- Valid enum values
- Ownership
- Role permissions
- File types
- File sizes

---

## 23. Security Rules Principle

Production Firebase rules must follow:

```text
DENY BY DEFAULT
```

Then explicitly allow required operations.

Never use:

```text
allow read, write: if true;
```

for production application data.

Firebase specifically recommends starting from locked/deny-by-default rules and adding access only to required resources.

---

## 24. Avoid Broad Rules

Do not create a broad rule such as:

```text
match /{document=**} {
    allow read, write: if request.auth != null;
}
```

and then assume individual collections are protected.

Firebase rules can match overlapping paths, and broad permissions can unintentionally grant access.

Each important collection must have intentional access control.

---

## 25. Secrets

Never store secrets in:

```text
frontend JavaScript
HTML
CSS
Firestore
Realtime Database
Git repository
public configuration
```

Sensitive credentials include:

```text
service account private keys
server secrets
payment secrets
private API keys
admin credentials
FCM server credentials
```

Firebase-provisioned client API keys are not equivalent to server secrets, but third-party API keys must still be properly restricted.

---

## 26. App Check

Firebase App Check should be enabled for supported backend services.

Purpose:

```text
Real application
      ↓
App Check
      ↓
Firebase services
```

This reduces unauthorized automated access to backend resources.

App Check should complement, not replace, Authentication and Security Rules.

---

## 27. Error Handling

Never expose raw Firebase errors to customers.

Bad:

```text
FirebaseError: PERMISSION_DENIED...
```

Use human-readable messages:

```text
Unable to update your account.
Please try again.
```

Log technical details appropriately for developers/admins.

Every major Firebase operation must handle:

```text
loading
success
failure
empty state
retry
```

---

## 28. Loading States

Every network-dependent feature must have a loading state.

Examples:

```text
Product loading
Cart loading
Order loading
Recommendation loading
Admin analytics loading
Profile loading
```

Never show a blank screen while Firebase is loading.

Use skeletons/spinners appropriate to the GlowShine visual design.

---

## 29. Empty States

Every collection/list must have an intentional empty state.

Examples:

```text
No products found
Your wishlist is empty
Your cart is empty
No orders yet
No recommendations available
No reviews yet
```

Do not leave blank containers.

---

## 30. Offline / Network Failure

The application must gracefully handle:

```text
slow internet
Firebase unavailable
request timeout
permission denied
expired authentication
failed upload
failed checkout
```

Never lose user-entered information unnecessarily.

For critical transactions, show clear retry behaviour.

---

## 31. Duplicate Operations

Important actions must be protected against duplicate execution.

Examples:

```text
Place Order
Add to Cart
Submit Review
Apply Campaign
Upload Product
Process Payment
```

Disable or guard duplicate submissions while an operation is processing.

Backend operations that can be retried must be designed to be idempotent where appropriate.

---

## 32. Data Consistency

Do not maintain multiple conflicting sources of truth.

For example:

Bad:

```text
Product stock in Firestore
Product stock in Realtime Database
Product stock in localStorage
```

unless there is a clearly defined synchronization strategy.

Define one authoritative source for every critical piece of data.

---

## 33. Local Storage Rules

localStorage may be used for:

- UI preferences
- Temporary non-sensitive state
- Theme preference
- Non-critical cached state

Never store:

```text
passwords
service account credentials
payment secrets
admin authorization
private tokens
```

Do not use localStorage as the real authorization mechanism.

---

## 34. Animation Rules

GlowShine is intended to have a premium visual experience.

Animation libraries such as:

```text
Anime.js
Theatre.js
GSAP
Intersection Observer
CSS animations
```

may be used where appropriate.

But animation must never compromise:

- Performance
- Accessibility
- Navigation
- Product usability
- Checkout
- Mobile responsiveness

Do not animate every element.

Animations should communicate hierarchy, interaction, transition, or brand identity.

---

## 35. Performance Rules

Avoid:

- Unnecessary Firebase reads
- Unnecessary listeners
- Huge image files
- Duplicate API calls
- Excessive animations
- Unnecessary re-renders
- Loading all products at once
- Loading all analytics at once

Use:

```text
pagination
lazy loading
image optimization
query limits
caching where appropriate
debouncing
code splitting
```

---

## 36. Firebase Query Rules

Every query must have a reason.

Avoid downloading entire collections when only a small subset is needed.

Use:

```text
limit()
where()
orderBy()
pagination
```

where appropriate.

If Firestore requires an index, create the correct index rather than adding inefficient fallback queries.

---

## 37. Security Testing

Before production:

Test every important path with:

```text
unauthenticated user
customer
admin
superAdmin
invalid user
wrong owner
malicious input
duplicate request
expired session
```

Verify both:

```text
allowed operations
denied operations
```

Security Rules must be tested with the Firebase Local Emulator Suite before production deployment. Firebase explicitly recommends emulator-based rule testing and CI integration.

---

## 38. Environment Rules

Maintain separate environments where practical:

```text
development
staging
production
```

Do not test dangerous experimental rules directly against production data.

Firebase recommends separating development/staging/production environments for safer deployment.

---

## 39. Deployment Rules

Before deployment:

```text
Build
↓
Lint
↓
Test
↓
Firebase Rules test
↓
Authentication test
↓
Firestore test
↓
Storage test
↓
Critical user-flow test
↓
Production deployment
```

Never deploy major backend changes without testing.

---

## 40. Database Schema Change Rules

When adding a new collection or field:

1. Define its purpose.
2. Define ownership.
3. Define read permission.
4. Define write permission.
5. Add validation.
6. Add required indexes.
7. Update Security Rules.
8. Update backend logic.
9. Update frontend.
10. Test existing functionality.

Security Rules should evolve alongside the data schema rather than being written only at the end.

---

## 41. Code Organization

Keep responsibilities separated.

```text
components/
pages/
services/
firebase/
hooks/
utils/
admin/
features/
styles/
```

Firebase calls should not be randomly scattered throughout UI components.

Prefer:

```text
UI
 ↓
Service layer
 ↓
Firebase
```

This makes debugging and future migration easier.

---

## 42. No Fake Functionality

Do not create buttons that only appear functional.

Every important button must either:

- Perform the intended action, or
- Clearly state that the feature is unavailable.

Never use fake:

```text
checkout success
payment success
order confirmation
admin updates
analytics numbers
stock values
AI recommendations
```

during production operation.

Mock data may only be used explicitly in development/demo mode.

---

## 43. Data Privacy

Collect only data required for GlowShine functionality.

Do not collect personal information merely because it is technically possible.

Sensitive information must have:

- Clear purpose
- Restricted access
- Appropriate retention strategy

User data must never be exposed through public queries.

---

## 44. Accessibility

The website must support:

- Keyboard navigation
- Readable contrast
- Semantic HTML
- Accessible buttons
- Alt text for meaningful images
- Reduced-motion preferences
- Visible focus states

Animations must respect reduced-motion preferences.

---

## 45. Responsive Design

The website must work on:

```text
mobile
tablet
laptop
desktop
large desktop
```

Do not design only for desktop.

Checkout, product browsing, cart, account and navigation must be fully usable on mobile.

---

## 46. SEO Rules

Public product/category/content pages should use:

- Meaningful titles
- Descriptions
- Semantic HTML
- Proper headings
- Clean URLs/slugs
- Optimized images
- Structured metadata where appropriate

Do not expose private user pages to search engines.

---

## 47. UX Rules

GlowShine should minimize unnecessary friction.

Core flow:

```text
Discover
 ↓
Explore
 ↓
Product
 ↓
Understand
 ↓
Add to Cart
 ↓
Checkout
 ↓
Order
 ↓
Track
 ↓
Review
 ↓
Personalized Discovery
```

Do not force unnecessary registration before basic product discovery.

---

## 48. Product Detail Rules

Product pages should clearly communicate:

- Product name
- Product images
- Price
- Discount where applicable
- Availability
- Description
- Benefits
- Ingredients where available
- Suitable skin type/concerns where applicable
- Reviews
- Related products
- Add-to-cart action

Avoid unsupported medical claims.

---

## 49. Recommendation Rules

Recommendations should be based on meaningful signals such as:

```text
user preferences
product category
skin-related preferences provided by user
view behaviour
wishlist
cart behaviour
purchase history
product similarity
trends
```

Do not make sensitive inferences that are unnecessary for the product experience.

Recommendation failure must never break the main shopping experience.

If recommendation services fail:

```text
Main ecommerce experience continues.
```

---

## 50. Admin Analytics Rules

Admin analytics may include:

```text
Revenue
Orders
Customers
Product performance
Top products
Conversion
Cart abandonment
Campaign performance
Review statistics
```

Analytics dashboards must not expose unnecessary customer personal information.

Use aggregated data wherever possible.

---

## 51. Logging

Logs should help developers diagnose failures without leaking secrets.

Never log:

```text
passwords
authentication tokens
payment credentials
private keys
sensitive personal information
```

Use structured logging for important backend operations.

---

## 52. Destructive Actions

Delete operations must be protected.

Examples:

```text
Delete product
Delete campaign
Delete review
Cancel order
Delete user data
```

For dangerous admin actions:

```text
confirmation
authorization
audit logging
```

should be considered mandatory.

---

## 53. Audit Trail

Important administrative actions should be traceable.

Where appropriate, record:

```text
adminId
action
targetId
timestamp
actionType
```

Do not allow normal customers to modify audit records.

---

## 54. Frontend Security Rule

Never assume that hiding an element makes it secure.

This:

```javascript
if (isAdmin) {
   showAdminButton();
}
```

is only UX.

Security must exist in Firebase rules/backend authorization.

---

## 55. Backend Security Rule

Never trust client-provided:

```text
role
price
discount
stock
order total
payment status
review verification
analytics
admin status
```

Trusted backend logic must determine sensitive values.

---

## 56. Failure Prevention Rule

Before declaring a feature complete, test:

```text
Normal flow
Refresh
Logout/login
Wrong user
No internet
Slow internet
Invalid input
Duplicate click
Mobile
Desktop
Firebase permission failure
Empty database
Missing document
Deleted document
```

If any critical flow breaks, the feature is not complete.

---

## 57. Final Production Checklist

Before GlowShine goes live:

### Authentication

- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works
- [ ] Customer/admin roles are protected
- [ ] Unauthorized admin access is blocked

### Database

- [ ] Firestore schema is defined
- [ ] Rules are deployed
- [ ] Validation exists
- [ ] Indexes are correct
- [ ] Ownership checks work
- [ ] Sensitive fields are protected

### Storage

- [ ] Product uploads protected
- [ ] User uploads protected
- [ ] File size validation works
- [ ] File type validation works

### Ecommerce

- [ ] Product browsing works
- [ ] Search works
- [ ] Cart works
- [ ] Wishlist works
- [ ] Checkout works
- [ ] Duplicate orders are prevented
- [ ] Inventory is protected
- [ ] Order status is protected

### AI

- [ ] Recommendations work
- [ ] Recommendation failure does not break shopping
- [ ] Behaviour tracking is controlled
- [ ] AI cannot modify security permissions

### Admin

- [ ] Product management works
- [ ] Inventory management works
- [ ] Order management works
- [ ] Review moderation works
- [ ] Campaign management works
- [ ] Analytics work

### Security

- [ ] No open production rules
- [ ] App Check configured
- [ ] Secrets removed from frontend
- [ ] Security Rules tested
- [ ] Emulator tests completed
- [ ] Production environment separated

### UX

- [ ] Mobile responsive
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessible navigation
- [ ] Reduced-motion support
- [ ] Animations do not block usability

### Performance

- [ ] Images optimized
- [ ] Lazy loading used
- [ ] Firebase reads minimized
- [ ] Queries limited
- [ ] Pagination implemented where needed
- [ ] No unnecessary real-time listeners

---

## 58. Golden Rule

When there is a conflict between:

```text
visual appearance
speed of development
security
data correctness
```

the priority is:

```text
Security
   ↓
Data correctness
   ↓
Functionality
   ↓
Performance
   ↓
UX
   ↓
Visual polish
```

A beautiful feature that is insecure or unreliable is considered incomplete.

---

## 59. Definition of Done

A GlowShine feature is considered DONE only when:

```text
UI works
+
Firebase works
+
Security works
+
Validation works
+
Error handling works
+
Mobile works
+
Desktop works
+
Refresh works
+
Unauthorized access fails
+
Duplicate operations are handled
+
Loading/empty/error states exist
+
Relevant tests pass
```

Do not mark a feature complete simply because the screen looks finished.
