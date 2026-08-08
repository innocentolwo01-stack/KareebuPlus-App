# Kareebu+ v4.0 — Reference UI + Live Kareebu AI

- Reworked Welcome layout around the approved Kareebu+ artwork and hero illustration.
- Refined Country selection presentation while preserving landmark imagery and market selection.
- Expanded Home into a longer marketplace feed with hero promotion, local new finds, rewards/vouchers, brands, popular stores, weekend picks, food, shops and activity.
- Rebuilt Where to? around pickup/destination, place search, live/open routing map, ETA and suggested places.
- Rebuilt Choose ride to compare Boda, Economy, Comfort, XL and Delivery in one clear list, with payment and scheduling below.
- Reworked Food discovery to match the approved promo/brand/category/filter/list hierarchy.
- Reworked Shops/Pharmacy with category-specific hero promotions, richer pharmacy brand grid and offer-led store rows.
- Expanded Uganda demo pharmacy catalogue and food brands for realistic marketplace density.
- Upgraded Kareebu AI to display grounded recommendation cards and route customers directly to recommended merchants/services.
- Added `server/kareebu-ai-api.mjs`, a server-side OpenAI Responses API endpoint using Structured Outputs. No OpenAI secret is embedded in React Native.
- Added recent conversation context to the live AI request so Kareebu AI can answer follow-up questions instead of treating every message as isolated.
- Gave Economy, Comfort and XL distinct native vehicle silhouettes in Choose ride rather than reusing one car image for all car tiers.
