# Kareebu+ v3.5 — Onboarding Flow + Local Stores

- Fixed the Welcome/Get Started race by making splash navigation timer-owned instead of tap + timer owned.
- Get started now deterministically enters Country selection, then City selection, then delivery-location confirmation.
- Removed the duplicated PLUS overlay and reduced the welcome wordmark so it renders cleanly on white.
- Refined welcome proportions to better match the approved reference: smaller logo, tighter feature circles, calmer hierarchy and balanced hero/CTA spacing.
- Country selection now uses the approved wordmark directly on white and clearly shows onboarding progress.
- City "Use current location" now requests foreground GPS permission, selects the nearest supported city when possible, and hands the current coordinate to the location picker.
- Popular stores are now filtered by selected country/city instead of using a fixed Kampala-first list.
- Popular store cards are logo-first, with Carrefour, Goodlife and Jumia image marks plus branded fallbacks for other local demo merchants.
