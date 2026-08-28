# Kareebu+ v3.8 — product UX audit

## Audit scope

The review covered launch/onboarding, Home/navigation, universal search, Ride/Boda, Food, Shops/storefront, parcel delivery, Wallet, Account, Activity/Orders, location state, locale state, visible controls and branding/safe-area behaviour.

## Findings addressed in this patch

### 1. Launch and onboarding could lose the customer's mental model

**Finding:** a splash/Welcome race could make the Welcome/Get Started screen appear again after the customer had already acted. Location permission could also appear at an unexpected point.

**Fix:** React Native starts on one Welcome screen after the native splash. Both Welcome actions move to Country. Country moves to City. City either explicitly requests GPS through **Use my location**, or moves to the manual map/search picker. No passive onboarding screen asks for GPS.

### 2. Header content was too close to Android system UI

**Finding:** the Home logo and wallet balance could visually collide with signal/network/status indicators on Android.

**Fix:** the shared screen shell now accounts for Android `StatusBar.currentHeight`, and the Home brand header has additional top breathing room. The same protection benefits other screens that use the shared shell.

### 3. Country selection was not being treated as persistent product context

**Finding:** some flows still behaved like Kampala/Uganda even after choosing Kenya or Tanzania.

**Fix:** locale context now informs merchant lists, search, currencies, mobile-money labels, parcel wording, orders/activity and ride destination suggestions. Changing country/city invalidates stale location/destination data.

### 4. Several controls looked actionable but did little or nothing

**Finding:** dead controls damage trust because customers cannot distinguish demos from functioning actions.

**Fix:** `More` opens All Services; store cards open Storefront; safety/call/chat/share/cancel/receipt/wallet/account controls now navigate, update state, confirm an action or explain the demo boundary instead of silently doing nothing.

### 5. Discovery and task search needed clearer separation

**Finding:** app-wide search and ride destination search can easily be conflated in a super app.

**Fix:** Home remains universal Kareebu+ search. Ride/Boda destination selection remains a dedicated place-search task. Universal search is filtered for the current market and routes results to the correct service.

### 6. Guest/account state could become inconsistent

**Finding:** starting sign-in could mark a guest as signed in before verification/profile setup completed.

**Fix:** guest state changes only when the account setup finishes. Backing out of sign-in leaves the user in guest mode.

### 7. Commerce lacked a direct merchant journey

**Finding:** local merchant cards need to lead to something concrete.

**Fix:** Storefront provides merchant branding, delivery/minimum information, searchable demo products and a working local basket state.

### 8. Ride discovery was too Kampala-specific

**Finding:** fixed Kampala suggestions are confusing after selecting Nairobi, Mombasa, Dar es Salaam, Arusha, etc.

**Fix:** local ride suggestions now change by selected city, while Photon/Valhalla remain the live search/routing provider path.

## Product improvements included because they reduce friction

- Editable Country & city from Account.
- Consistent service/category presets when entering Shops from Home or Search.
- Dynamic time-of-day greeting.
- Explicit progress language through location/account setup.
- Location errors displayed inline instead of failing silently.
- Store and restaurant favourites retain visible state.
- Live route data and seeded demo turn guidance are explicitly distinguished.

## Remaining production priorities

These are not claimed as completed in the demo and should be treated as the next implementation backlog.

### P0 — required before real customers/transactions

- Real authentication/session persistence and secure token storage.
- Persisted onboarding, country/city, addresses, favourites and basket state across app restarts.
- Production merchant catalogue, inventory, pricing, opening-hours and availability APIs.
- Real payment initiation, callbacks, reconciliation, refunds and receipts for each market.
- Production Ride/Boda dispatch, driver availability, driver identity/vehicle state and live trip backend.
- Production order lifecycle for Food/Shops/Parcel.
- Network timeout/retry/offline states and idempotent transaction handling.
- Privacy/consent, terms and country-specific legal/compliance review.

### P1 — trust, safety and operational quality

- Real push-notification permission and notification service.
- Live support and emergency/safety integrations instead of demo alerts.
- Accessibility QA: screen readers, dynamic text, contrast, focus order and 44px+ hit targets.
- Analytics funnel instrumentation and crash/error reporting.
- Maps/search/routing production SLA or self-hosting strategy; caching and provider failover.
- Pharmacy guardrails for regulated products and prescription workflows where applicable.

### P2 — experience maturity

- Language/localisation framework and local-language content.
- Personalised recommendations based on consented behaviour, city and time of day.
- Better empty states, saved searches and reorder/rebook shortcuts.
- Haptics and motion polish with reduced-motion support.
- Smart address labels (Home, Work, School) and shared/family addresses.
- Loyalty/rewards state synchronized to real orders and rides.

## Product principle after v3.8

Every prominent control should either complete a task, move the customer to the next logical task, change visible state, or explain why an action is unavailable. Country/city/location are shared app context rather than onboarding-only answers.
