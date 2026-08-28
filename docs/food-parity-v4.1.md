# Kareebu Plus — 6amMart V4.1 Food parity pass

## Source of truth

This implementation was built from the supplied 6amMart V4.0.1 Flutter customer source plus the supplied 6amMart V4.1 customer APK. The objective is behavioural parity in Kareebu Plus while retaining the Expo / React Native / TypeScript codebase and Kareebu branding.

## Implemented in this pass

- donor-style Food module section flow:
  - Find your food
  - promotions
  - featured restaurants
  - Just for you
  - Quick delivery
  - last order return path
  - Trending dishes
  - Explore restaurants
- restaurant details and menu sections
- item details screen
- required single-choice variations
- optional add-ons
- price deltas per variation/add-on
- item quantity limits
- special item instructions
- configured cart-line IDs so different variations can coexist in the cart
- cart quantity editing
- delivery vs pickup
- delivery address return flow
- scheduled ordering choices
- delivery instructions
- coupon application
- delivery-fee coupon
- courier tips
- MTN / M-PESA-style primary mobile money slot
- Airtel / secondary mobile money slot
- Visa
- Cash on delivery
- checkout totals
- order creation
- order-success receipt
- handoff into live order tracking

## Deliberately not marked complete yet

These donor behaviours still need production-equivalent backend wiring or a later parity pass:

- live store availability / opening hours
- stock and low-stock warnings
- server-side item variation IDs and add-on IDs
- server-side cart synchronisation
- zone-specific delivery pricing and surge/bad-weather charges
- production coupons
- tax rules
- partial payments
- offline payment methods
- payment gateway execution
- real order placement endpoint
- delivery-man assignment from backend
- real-time order status stream
- cancellations, refunds and review submission
- monthly/subscription ordering

A feature should not be called fully ported until its visible UI, interaction, data model, service/API behaviour, loading/error states and Android smoke test all pass against the donor flow.
