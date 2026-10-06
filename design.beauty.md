# GlowShine Co. — Design System & Product Experience Specification

**Version:** 1.0  
**Project:** E-Business & Retailing — Beauty & Personal Care  
**Brand:** GlowShine Co.  
**Positioning:** Premium beauty commerce + customer intelligence  
**Primary tagline:** Beauty that learns what you love.

---

## 1. Design Direction

GlowShine Co. must look like a real premium beauty-commerce company, not a college CRUD project.

The visual direction combines:

- premium beauty editorial design
- clean product-commerce UX
- editorial storytelling
- subtle luxury
- data-driven personalization
- restrained motion
- professional retail analytics

The site should feel closer to a modern beauty brand + retail intelligence platform than a generic online shopping template.

### Core design principle

**Beauty on the surface. Intelligence underneath.**

The customer sees a refined beauty store. The system quietly learns from behaviour and uses it to improve discovery, recommendations and offers.

---

# 2. Inspiration Benchmark

The design should borrow interaction ideas, not copy layouts, branding, photography or proprietary UI.

## Aesop — Editorial / Premium

Use as inspiration for:

- restrained typography
- editorial product storytelling
- ingredient/formulation presentation
- calm visual hierarchy
- premium whitespace
- category organization
- educational content

Aesop's current skincare experience combines product categories with formulation education and personalized consultation, which supports GlowShine's idea of combining commerce with guided discovery.

**GlowShine adaptation:** create a more digital-native "Beauty Intelligence" layer rather than copying Aesop's minimalism.

---

## Glossier — Friendly / Modern Commerce

Use as inspiration for:

- clean navigation
- simple product cards
- strong product photography
- category-led discovery
- mix-and-match/set merchandising
- quick shopping interactions
- approachable brand voice

Glossier's current storefront uses Shop All, Best Sellers, New, category navigation, sets and skin-type/concern filtering.

**GlowShine adaptation:** add behavioural personalization such as "94% match" and "Because you explored hydration."

---

## Fenty Beauty — High-Impact Product Commerce

Use as inspiration for:

- bold campaign sections
- product-first merchandising
- bestseller/new labels
- quick shop interactions
- category-specific discovery
- shade/variant exploration
- editorial campaign storytelling
- strong promotional hierarchy

**GlowShine adaptation:** use strong visual moments sparingly and connect them to behavioural analytics.

---

## Rare Beauty — Human + Community

Use as inspiration for:

- warm storytelling
- product education
- shade discovery
- community content
- "get the look" / routine-based merchandising
- approachable brand personality

**GlowShine adaptation:** create "GlowRoutine" and "GlowMatch" instead of copying influencer/community modules.

---

## Nykaa — Indian E-Commerce Depth

Use as inspiration for:

- category breadth
- filters
- discounts
- product ratings
- Indian pricing conventions
- beauty discovery
- offers
- product density
- routine/educational content

**GlowShine adaptation:** keep the underlying shopping functionality but present it with a much cleaner premium visual system.

---

## Sephora — Discovery + Retail Intelligence

Use as inspiration for:

- large-scale category discovery
- product comparison
- recommendations
- personalized shopping
- editorial content
- beauty tools
- loyalty-style experiences

**GlowShine adaptation:** turn personalization into a visible brand feature through GlowMatch, GlowScore and GlowRoutine.

---

# 3. What GlowShine Must NOT Look Like

Avoid:

- generic Bootstrap-looking cards
- excessive pink gradients
- random glassmorphism
- huge text everywhere
- excessive rounded cards
- unnecessary floating elements
- neon "AI" effects
- over-animated product cards
- stock-photo-heavy layouts
- dashboard-looking customer pages
- excessive shadows
- template-like hero sections
- 20 different font styles
- animations that slow down shopping

The goal is **premium and intentional**, not flashy.

---

# 4. Brand Personality

GlowShine should communicate:

| Attribute | Expression |
|---|---|
| Premium | Editorial spacing, typography, photography |
| Intelligent | Personalization and data insights |
| Modern | Clean grid and responsive interactions |
| Trustworthy | Clear pricing, reviews, ingredients |
| Human | Warm microcopy |
| Beauty-focused | Product-first visual hierarchy |
| Professional | Consistent design system |

---

# 5. Color System

Do not use a rainbow beauty palette.

Use a restrained neutral base with one warm brand accent.

## Primary

- `#F7F4EF` — Warm Ivory
- `#111111` — Ink
- `#FFFFFF` — White

## Secondary

- `#E8DED4` — Soft Sand
- `#CDBBA8` — Champagne
- `#74685E` — Taupe

## Accent

- `#B87568` — Rose Clay

## Semantic

- Success: muted green
- Warning: warm amber
- Error: muted red
- Info: muted blue

### Rule

Use accent colors for:

- CTAs
- active states
- match scores
- important badges
- selected filters

Do not color every component.

---

# 6. Typography

Use one primary type family plus an optional display face.

## Primary UI font

**Inter** or **Manrope**

Use for:

- navigation
- product names
- prices
- buttons
- analytics
- forms
- tables

## Editorial/display font

**DM Serif Display** or **Cormorant Garamond**

Use only for:

- hero headlines
- campaign statements
- editorial quotes
- major section titles

### Example

**BEAUTY,  
BUT PERSONAL.**

Display serif.

Small supporting text:

**Discover products selected around your preferences, goals and behaviour.**

Sans-serif.

---

# 7. Spacing System

Use an 8px base system.

```text
4px
8px
16px
24px
32px
48px
64px
80px
96px
128px
```

Desktop sections should generally use:

- 80–128px vertical spacing
- 24–32px card gaps
- 48–64px major content gaps

Mobile:

- 32–64px section spacing
- 16–20px card gaps

---

# 8. Grid System

Desktop:

```text
12-column grid
Max width: 1440px
Page padding: 40–64px
Column gap: 20–24px
```

Tablet:

```text
8-column grid
Page padding: 24–32px
```

Mobile:

```text
4-column grid
Page padding: 16–20px
```

Product grids:

Desktop:
4 products per row

Large desktop:
5 products per row where appropriate

Tablet:
3 products

Mobile:
2 products

---

# 9. Global Navigation

## Desktop

```text
┌───────────────────────────────────────────────────────────┐
│ GLOWSHINE CO.                                             │
│                                                           │
│ Shop   Discover   GlowMatch   GlowRoutine   Journal       │
│                                                           │
│ Search                         ♡    Account    Bag        │
└───────────────────────────────────────────────────────────┘
```

Keep the header compact.

### Navigation behaviour

On scroll:

- header becomes slightly smaller
- background becomes opaque
- subtle border appears
- transition duration: 250–350ms

Do not create a giant sticky header.

---

# 10. Announcement Bar

Use only when necessary.

Example:

> FREE SHIPPING ON ORDERS OVER ₹999 · PERSONALIZED PICKS AVAILABLE

Animation:

- horizontal marquee only if the message is promotional
- speed should be slow
- pause on hover
- respect reduced-motion preferences

---

# 11. Homepage Architecture

The homepage should tell a story.

```text
Announcement
      ↓
Navigation
      ↓
Hero
      ↓
Shop by Need
      ↓
Personalized Discovery
      ↓
Bestsellers / Trending
      ↓
GlowMatch
      ↓
Editorial Story
      ↓
GlowRoutine
      ↓
Customer Behaviour Insight
      ↓
Journal / Education
      ↓
Newsletter
      ↓
Footer
```

---

# 12. Hero Section

Do NOT use a standard e-commerce hero with:

"SALE 50% OFF"

Instead:

## Headline

**BEAUTY,  
BUT PERSONAL.**

Supporting text:

**A smarter beauty store that learns what works for you.**

CTA:

**Discover Your Glow**

Secondary CTA:

**Shop All**

### Visual

Use one premium product composition or a controlled beauty still-life.

### Motion

On page load:

1. Background image fade + subtle scale from 1.04 to 1.0
2. Headline lines reveal upward
3. Supporting text fades in
4. CTA slides upward
5. product object gets a very small parallax movement

Do not animate every element independently.

---

# 13. Hero Animation Specification

### GSAP

Use for:

- timeline orchestration
- scroll-linked sequences
- hero reveal
- pinned sections

### Anime.js

Use for:

- micro-interactions
- icon motion
- counters
- simple transitions

### Theatre.js

Use only for selected cinematic scenes.

Do not make Theatre.js responsible for the entire website.

### Lenis

Use for:

- smooth scrolling

But disable or reduce it for:

- mobile if performance suffers
- reduced-motion users

---

# 14. Scroll Philosophy

Animations should reveal hierarchy, not hide it.

### Good

```text
section enters
→ opacity 0 → 1
→ translateY 24 → 0
```

### Bad

```text
section rotates
→ scales
→ blurs
→ spins
→ flies in
```

Every section should still be understandable with animations disabled.

---

# 15. Shop by Need

Instead of only categories, use customer goals.

## Find what you need

```text
HYDRATION
BRIGHTENING
ACNE CARE
SUN PROTECTION
HAIR REPAIR
EVERYDAY MAKEUP
FRAGRANCE
BODY CARE
```

Each tile has:

- image
- title
- short description
- hover interaction

### Hover

Image scale:

`1 → 1.04`

Overlay:

`0 → 0.08`

Text:

`translateY(6px) → 0`

Duration:

`400ms`

---

# 16. Product Card

The product card should feel premium and informative.

```text
┌──────────────────────────┐
│                          │
│       PRODUCT IMAGE      │
│                          │
│  BESTSELLER        ♡     │
│                          │
├──────────────────────────┤
│ Brand                    │
│ Product Name             │
│ ★ 4.7 (328)              │
│ ₹699                     │
│                          │
│ 94% MATCH                │
└──────────────────────────┘
```

### Hover

Desktop:

- image gently scales
- secondary image crossfades
- quick-add appears
- match badge rises slightly

Do not make the entire card jump.

---

# 17. Product Image Interaction

For product cards with two images:

```text
Image 1
   ↓ hover
Image 2 crossfade
```

Duration:

`350–500ms`

Use opacity crossfade rather than aggressive sliding.

---

# 18. GlowMatch Section

This is the signature visual section.

## Headline

**THE STORE GETS TO KNOW YOU.**

Text:

**Your preferences, discoveries and shopping habits help us surface products that fit you better.**

CTA:

**Build My Glow Profile**

Visual:

A large animated circular "GlowScore" interface.

Example:

```text
        94%
     YOUR MATCH

   Hydration Serum
```

### Animation

The score draws from 0 → 94.

Use:

- SVG stroke animation
- Anime.js
- number interpolation

Duration:

`1200–1600ms`

Trigger:

when section enters viewport.

---

# 19. GlowMatch Product Reveal

When the user clicks:

**See why this matches me**

show:

```text
94% MATCH

✓ Matches your hydration goal
✓ Within your usual budget
✓ Similar to products you viewed
✓ Popular with similar shoppers
```

Animation:

- modal/panel slides from right
- individual reasons appear sequentially
- no dramatic zoom

---

# 20. GlowRoutine Section

Create a horizontal routine builder.

```text
CLEANSE
   ↓
TREAT
   ↓
HYDRATE
   ↓
PROTECT
```

Each step contains:

- product image
- product name
- price
- reason

### Interaction

User selects a goal:

```text
Hydration
Acne Care
Glow
Hair Repair
Daily Essentials
```

Routine changes dynamically.

---

# 21. Editorial Section

This is where GlowShine gets the premium-brand feel.

Example:

```text
THE SCIENCE OF
A GOOD ROUTINE

Understand ingredients,
textures and product layering.

READ THE GUIDE →
```

Use:

- large typography
- editorial photography
- asymmetrical grid

Avoid standard blog-card grids.

---

# 22. Trending Section

Title:

**WHAT'S MOVING THROUGH THE GLOWSHINE COMMUNITY**

Show products based on actual behaviour.

Example:

```text
↑ 28%
SPF 50 Sunscreen

↑ 22%
Hydrating Serum

↑ 17%
Hair Repair Mask
```

This visually connects the store to the analytics backend.

---

# 23. Live Behaviour Micro-UI

A subtle feature:

```text
● LIVE

128 shoppers are exploring skincare
```

or:

```text
Trending now
+24% interest in SPF
```

This data should eventually come from Firebase.

Do not fabricate "live" numbers in the production prototype.

---

# 24. Product Detail Page

Layout:

```text
┌───────────────────────────────────────────────────┐
│                                                   │
│   IMAGE GALLERY       PRODUCT INFORMATION         │
│                                                   │
│                       Brand                       │
│                       Product Name                │
│                       ★ 4.7                       │
│                       ₹699                        │
│                                                   │
│                       94% MATCH                   │
│                                                   │
│                       Add to Bag                  │
│                       ♡ Wishlist                  │
│                                                   │
└───────────────────────────────────────────────────┘
```

Below:

- description
- ingredients
- how to use
- suitability
- reviews
- related products

---

# 25. Product Page Signature Feature

## WHY THIS PRODUCT FOR YOU?

Use a visual score:

```text
94% MATCH
━━━━━━━━━━━━━━━━━━

Goal              ██████████  100%
Budget            █████████   90%
Category          ██████████  100%
Past Behaviour    ████████    82%
```

This is the bridge between retail UI and customer analytics.

---

# 26. Search Experience

Search should feel premium.

When user clicks search:

Screen expands into an overlay.

```text
WHAT ARE YOU LOOKING FOR?

[ Search skincare, serum, SPF... ]

Trending searches:
Sunscreen
Niacinamide
Hair serum
Lip tint
```

For logged-in users:

```text
Based on your activity:
Hydrating serum
SPF 50
Barrier repair
```

Track every meaningful search as a behaviour event.

---

# 27. Filters

Filters should not visually overwhelm the page.

Desktop:

left sidebar or compact filter bar.

Mobile:

bottom-sheet filter panel.

Filters:

- category
- price
- skin type
- concern
- rating
- brand
- availability
- discount

Use progressive disclosure.

---

# 28. Cart Drawer

Use a right-side drawer rather than navigating immediately.

```text
YOUR BAG

Product
Qty
Price

────────────────

YOU MAY ALSO LIKE

[product]
[product]

Subtotal

[Checkout]
```

Animation:

- drawer enters from right
- background overlay fades in
- cart item count morphs smoothly

Duration:

`350–450ms`

---

# 29. Wishlist Animation

When heart is clicked:

```text
outline heart
      ↓
filled heart
      ↓
small particle burst
```

Keep particle count low.

Maximum:

`6–10 particles`

Duration:

`400–600ms`

---

# 30. Checkout

Checkout must be intentionally boring.

Do not animate checkout heavily.

Steps:

```text
1. Address
2. Delivery
3. Payment
4. Confirmation
```

Use strong hierarchy and clear totals.

For the college prototype:

**Payment = Demo Payment**

After confirmation:

```text
ORDER CONFIRMED

Your Glow journey continues.

Order #GS10248
```

---

# 31. Order Confirmation

Make this one of the few celebratory moments.

Animation:

- subtle radial glow
- checkmark drawing
- order card fades upward

Then:

**Recommended next step**

> Based on your routine, you may need a moisturizer in approximately 24 days.

This connects purchase analytics to the customer experience.

---

# 32. My Glow Profile

Profile should feel like a personal dashboard.

```text
YOUR GLOW PROFILE

GlowScore
82

Skincare        42%
Haircare        18%
Fragrance       12%
Makeup          10%
Body Care       18%
```

Include:

- preferences
- beauty goals
- favourite categories
- favourite brands
- recent behaviour
- orders
- wishlist
- recommendations

---

# 33. Glow Journey

Use a vertical timeline.

```text
TODAY
Viewed SPF 50

YESTERDAY
Added serum to wishlist

SEPT 30
Purchased cleanser

SEPT 15
Completed Glow Quiz
```

Animate timeline nodes as they enter the viewport.

---

# 34. Admin Design Direction

Customer website:

**Beauty + editorial**

Admin:

**Beauty + data**

Do not make admin look like a completely unrelated SaaS dashboard.

Use the same:

- typography
- colors
- spacing
- logo
- components

But increase information density.

---

# 35. Admin Navigation

```text
GLOWSHINE
INTELLIGENCE

Overview
Sales
Customers
Behaviour
Products
Orders
Segments
Campaigns
Reviews
Settings
```

---

# 36. Admin Dashboard

Top:

```text
Good morning.

Retail intelligence overview
04 OCT 2026
```

KPI row:

```text
Revenue
₹24.8L

Orders
1,284

Customers
2,450

Conversion
6.5%

AOV
₹1,247
```

Use small trend indicators:

```text
↑ 12.4%
```

---

# 37. Sales Analytics

Main chart:

**Revenue Performance**

Controls:

```text
7D
30D
90D
1Y
```

Secondary:

- revenue by category
- orders
- average order value
- discount impact

---

# 38. Customer Behaviour Dashboard

Main title:

**WHAT CUSTOMERS ARE DOING**

Cards:

```text
Product Views
42,890

Searches
14,220

Wishlists
5,842

Cart Adds
4,219

Purchases
1,284
```

Then funnel:

```text
VISIT
 ↓
VIEW
 ↓
WISHLIST
 ↓
CART
 ↓
CHECKOUT
 ↓
PURCHASE
```

Animate funnel numbers when loaded.

---

# 39. Interest vs Purchase Matrix

This should be the hero analytics visualization.

X-axis:

**Customer Interest**

Y-axis:

**Purchase Conversion**

Quadrants:

```text
                HIGH CONVERSION
                      ↑
                      |
     WINNERS          |       STARS
                      |
LOW INTEREST ─────────┼───────── HIGH INTEREST
                      |
   LOW PRIORITY       |       LOST SALES
                      |
                      ↓
                LOW CONVERSION
```

Clicking a product opens detailed analytics.

---

# 40. Lost Sales Detector

Title:

**OPPORTUNITIES**

Example:

```text
NIACINAMIDE SERUM

1,240 views
382 wishlists
214 carts
68 purchases

HIGH INTEREST
LOW CONVERSION

Potential issue:
Price / product hesitation

Recommended action:
Create targeted offer
```

Use amber/red only for genuine alerts.

---

# 41. Customer Segmentation

Visual:

```text
GLOW ELITE       280
GLOW SAVER       438
GLOW EXPLORER    520
GLOW LOYAL       310
GLOW CARE        620
GLOW DORMANT     315
```

Click segment → customer list.

---

# 42. Customer Detail

Show:

```text
CUSTOMER #1042

GlowScore        82
GlowIntent       74
Segment          Glow Explorer

Revenue          ₹6,420
Orders           7
AOV              ₹917
```

Then:

**Behaviour Timeline**

```text
Search
View
Wishlist
Cart
Checkout
Purchase
Review
```

---

# 43. Product Analytics

Product header:

```text
SPF 50 SUNSCREEN

₹699
★ 4.7
```

Metrics:

- views
- searches
- wishlists
- carts
- purchases
- conversion
- revenue
- returns
- rating

Then:

**Behaviour → Purchase funnel**

---

# 44. Campaign Builder

Admin can create:

```text
CAMPAIGN

Name
Target segment
Category
Discount
Start date
End date
Message

[Create Campaign]
```

Preview:

```text
FOR YOUR GLOW

15% off selected skincare

SHOP NOW →
```

---

# 45. Motion Design System

Use motion as a system.

## Motion speeds

### Micro

`150–250ms`

Buttons, icons, hover states.

### Standard

`300–500ms`

Cards, drawers, modals.

### Editorial

`600–1000ms`

Hero, major sections.

### Cinematic

`1000–1800ms`

Only selected hero/editorial scenes.

---

# 46. Easing

Preferred:

- `easeOutCubic`
- `easeOutQuart`
- `easeInOutCubic`
- spring-like easing for small UI interactions

Avoid constant linear motion except marquees/progress.

---

# 47. Animation Library Responsibilities

Do not randomly use every library.

## GSAP

Primary animation orchestration.

Use for:

- hero timelines
- ScrollTrigger
- pinned storytelling
- complex sequences

## Anime.js

Use for:

- counters
- SVG strokes
- small UI animations
- GlowScore

## Theatre.js

Use for:

- one or two cinematic 3D/hero scenes
- product composition movement

## Lenis

Use for:

- smooth scrolling

## Lottie

Use for:

- small prebuilt illustrations
- success/loading states

## Framer Motion / Motion

If React Motion is preferred, use it for:

- component transitions
- route transitions
- modal/drawer animations

Do not use GSAP + Framer Motion + Anime.js for the exact same component.

---

# 48. Route Transitions

Route transitions should be subtle.

Example:

```text
Current page
opacity 1
      ↓
opacity 0.92
      ↓
New page
opacity 0 → 1
translateY 8 → 0
```

Duration:

`250–400ms`

Do not use full-screen curtain animations for every page.

---

# 49. Scroll Reveal Rules

Default:

```text
opacity: 0 → 1
y: 24 → 0
```

Stagger:

`60–100ms`

Use once per content group.

Do not animate each product individually on every scroll.

---

# 50. Magnetic Buttons

Optional premium interaction.

For desktop pointer devices:

```text
pointer approaches
→ button moves 2–5px
```

Use only for:

- hero CTA
- primary brand CTA

Do not use for every button.

---

# 51. Cursor Interaction

Optional custom cursor:

- tiny dot
- expands on interactive elements
- changes label for special actions

Example:

```text
VIEW
```

But disable on touch devices.

Never replace the actual browser accessibility cursor.

---

# 52. Product 3D

Optional.

For one hero product only:

- slow rotation
- pointer parallax
- subtle light movement

Do not create 3D versions of every product.

If assets aren't available, use high-quality product images instead.

---

# 53. Page Loading

Create a branded loading state.

```text
GLOWSHINE CO.

[ subtle progress line ]

discover your glow
```

Maximum duration should be determined by actual loading, not artificial delay.

Avoid forcing users to watch a 3-second intro.

---

# 54. Skeleton Loading

Product cards:

```text
████████████
████████
████
```

Use shimmer very subtly.

Prefer skeletons over spinners for content.

---

# 55. Empty States

Wishlist:

> **Nothing saved yet.**

> Save products you're curious about and we'll keep them here.

Cart:

> **Your bag is waiting.**

Search:

> **We couldn't find that.**

Keep empty states useful, not decorative.

---

# 56. Responsive Design

## Desktop

Use editorial layouts.

## Tablet

Reduce grid complexity.

## Mobile

Prioritize:

1. Search
2. Categories
3. Products
4. Cart
5. Personalization

Bottom navigation can be:

```text
Home
Shop
Glow
Wishlist
Bag
```

Only on mobile.

---

# 57. Mobile Animation Rules

Mobile should use fewer animations.

Avoid:

- large parallax
- heavy blur
- 3D scenes
- continuous background animations

Use:

- fade
- slide
- scale
- micro interactions

---

# 58. Accessibility

Must support:

- keyboard navigation
- visible focus
- sufficient contrast
- alt text
- semantic HTML
- accessible forms
- accessible buttons
- reduced motion

Implement:

```css
@media (prefers-reduced-motion: reduce) {
  /* remove non-essential motion */
}
```

When reduced motion is enabled:

- remove parallax
- remove large transforms
- shorten transitions
- disable continuous animation

---

# 59. Performance Rules

Animation cannot destroy the shopping experience.

Target:

- fast initial render
- optimized images
- lazy loading
- responsive images
- code splitting
- limited third-party libraries
- GPU-friendly transforms
- avoid layout-triggering animations

Animate:

- `transform`
- `opacity`

Avoid constantly animating:

- `width`
- `height`
- `top`
- `left`
- layout-heavy properties

---

# 60. Firebase Data → UI Design

The design must visibly use the backend.

Customer UI examples:

```text
94% Match
```

comes from:

```text
recommendation score
```

```text
Trending +28%
```

comes from:

```text
behaviour analytics
```

```text
Likely needed in 5 days
```

comes from:

```text
purchase history
```

Admin:

```text
Lost Sales Opportunity
```

comes from:

```text
views + wishlist + cart + purchase conversion
```

This prevents the analytics concept from becoming a separate disconnected dashboard.

---

# 61. Design Tokens

Create CSS variables.

```css
:root {
  --color-bg: #F7F4EF;
  --color-surface: #FFFFFF;
  --color-text: #111111;
  --color-muted: #74685E;
  --color-border: #E8DED4;
  --color-accent: #B87568;

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --space-8: 96px;
}
```

---

# 62. Component Library

Build reusable components first.

```text
Button
IconButton
Navbar
Footer
SearchOverlay
ProductCard
ProductGrid
ProductBadge
Rating
Price
MatchScore
FilterBar
FilterDrawer
CartDrawer
WishlistButton
Modal
Toast
Tabs
Accordion
ProgressBar
GlowScore
GlowMatchCard
RoutineCard
KPI
ChartCard
DataTable
SegmentBadge
Timeline
```

---

# 63. Component States

Every interactive component needs:

```text
Default
Hover
Focus
Active
Disabled
Loading
Error
Success
```

Do not design only the happy path.

---

# 64. UX Writing

Use short, confident copy.

Instead of:

> "Our sophisticated artificial intelligence algorithm analyzes your data..."

Use:

> **Picked for you.**

Instead of:

> "Based on your previous customer interactions..."

Use:

> **Because you explored hydration.**

Instead of:

> "Customer segmentation category..."

Use:

> **Your Glow Profile**

---

# 65. Brand Vocabulary

Use:

- Glow
- Match
- Routine
- Discover
- Curated
- Picks
- Journey
- Profile
- Intelligence
- Trends

Avoid overusing:

- AI
- algorithm
- machine learning
- data mining

The technology should power the experience rather than dominate the customer-facing copy.

---

# 66. Final Sitemap

```text
/
├── home
├── shop
│   ├── skincare
│   ├── makeup
│   ├── haircare
│   ├── fragrance
│   └── personal-care
│
├── product/:id
├── search
├── glowmatch
├── glowroutine
├── glow-profile
├── journey
├── wishlist
├── cart
├── checkout
├── order-confirmation
├── login
├── register
│
└── admin
    ├── dashboard
    ├── sales
    ├── behaviour
    ├── customers
    ├── products
    ├── orders
    ├── segments
    ├── campaigns
    └── reviews
```

---

# 67. Signature Features

GlowShine should be remembered for five things:

## 1. GlowMatch

Personalized product matching.

## 2. GlowScore

Customer engagement profile.

## 3. GlowRoutine

Goal-based product routines.

## 4. GlowTrend

Real behaviour-based trend discovery.

## 5. Lost Sales Detector

Products with high interest but weak conversion.

These five features differentiate the prototype from a normal beauty store.

---

# 68. Final Visual Experience

The ideal journey:

```text
ENTER
  ↓
beautiful editorial hero
  ↓
discover a beauty need
  ↓
browse products
  ↓
personalized match appears
  ↓
product interaction
  ↓
routine recommendation
  ↓
cart
  ↓
checkout
  ↓
purchase
  ↓
GlowScore updates
  ↓
next personalized recommendation
```

The website should feel **quietly intelligent**.

Not:

> "LOOK! THIS WEBSITE HAS AI!"

Instead:

> "This website seems to understand what I need."

That is the design objective.

---

# 69. Definition of Done

The design is complete when:

- every customer page follows the same visual system
- every admin page follows the same visual system
- product cards are reusable
- responsive layouts are defined
- animations have defined purposes
- reduced-motion behaviour is defined
- loading states exist
- empty states exist
- error states exist
- Firebase-driven data has visual representations
- GlowMatch has a clear UI
- GlowScore has a clear UI
- GlowRoutine has a clear UI
- analytics have a clear visual hierarchy
- admin and customer experiences feel like the same brand
- animations do not interfere with shopping
- mobile remains fast and usable

---

# 70. Design North Star

## GLOWSHINE CO.

### **BEAUTY, BUT PERSONAL.**

A premium beauty commerce experience where every interaction contributes to a smarter, more personalized shopping journey.

**Visual rule:** editorial beauty.

**UX rule:** frictionless commerce.

**Data rule:** every meaningful interaction can become an insight.

**Animation rule:** motion communicates hierarchy.

**Brand rule:** premium, restrained and human.

**Technical rule:** the design must be implementable with React + Firebase and must not depend on visual effects that compromise performance.
