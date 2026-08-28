# Kareebu+ v3.8 — UX consolidation

This release is a product-wide UX pass focused on removing ambiguity, protecting the onboarding sequence and carrying market context consistently through the super app.

## Onboarding

- Keeps one launch path: native splash → one Welcome screen → Country → City → Location.
- Removes reliance on a JavaScript splash timer, preventing the duplicate Welcome/Get Started race.
- Adds a consistent three-step location setup: Country 1/3, City 2/3, Location 3/3.
- Makes **Use my location** the only automatic GPS permission trigger during onboarding.
- GPS success can detect the supported country/city and save the current coordinate without making the customer place the pin again.
- GPS denial/error remains recoverable through manual city and map/search selection.
- Switching country/city clears stale delivery, focus and ride-destination context.
- Guest onboarding keeps country/city/location setup, then enters Home without account creation.
- Account-creation progress is simplified to four account steps after location.

## Safe area and branding

- Adds Android status-bar inset handling to the shared screen shell.
- Moves the Home logo/balance row further below the system status area.
- Retains the approved Kareebu+ full wordmark on white for primary brand surfaces and the approved K mark for compact surfaces.
- Uses consistent compact Kareebu+ context branding across commerce, rides, search and account surfaces.

## Navigation and dead-end reduction

- Adds a real **All Services** screen for the Home `More` action.
- Adds a functional local **Storefront** screen instead of sending store cards to generic/non-specific destinations.
- Groceries and Pharmacies enter Shops with the appropriate category preset.
- Account now exposes **Country & city** as an editable preference and returns to Account after the locale flow.
- Previously decorative settings, safety, call/chat/share, cancel, receipt, wallet and business controls now route somewhere useful or provide explicit feedback.
- Guest sign-in no longer marks the user authenticated before the account flow actually finishes.

## Local market context

- Adds a shared locale utility for country dial code, currency display and primary/secondary mobile-money labels.
- Extends country/city context beyond Popular stores into Shops, universal search, parcel, Activity, Orders, Wallet and key ride/payment surfaces.
- Adds city-aware ride destination suggestions instead of Kampala-only suggestions.
- Filters store search/catalogues by the selected market.
- Uses locale-specific merchant sets for Uganda, Kenya and Tanzania.

## Commerce and discovery

- Local merchant cards display merchant branding rather than generic cart/pharmacy icons where branded treatments are available.
- Storefront supports product search, local demo pricing and add/remove basket controls.
- Universal search separates app-wide discovery from ride destination search and keeps local shop/place results relevant to the current market.
- Home continues to use compact Offers, Big brands near you and Recent activity sections.

## Technical

- Preserves the `AnimatedRegion.timing()` React Native type compatibility fix.
- No new native dependencies are introduced in v3.8.
