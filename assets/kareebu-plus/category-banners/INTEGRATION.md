# Kareebu category banners — application integration

The supplied production pack is retained here without recolouring, renaming, or recompression. `manifest.json` remains the canonical asset-to-route reference and every production PNG is 420×200.

Application code must import banners through `src/assets/categoryBannerAssets.ts`. That registry contains 97 explicit static React Native `require()` calls grouped as `main`, `food`, `groceries`, `pharmacy`, `fashionBeauty`, `electronics`, `homeCare`, `goOut`, and `send`. `src/assets/categoryBannerResolver.ts` resolves current route IDs and titles within the requested vertical only; an unresolved route receives its own vertical’s main banner and can never leak artwork from another vertical.

`src/components/CategoryLandingBanner.tsx` is the only shared renderer. It uses the supplied 420:200 ratio, `resizeMode="cover"`, no text overlay, and makes the artwork accessible and pressable when an onward action exists.

Category landing order is banner, data-backed promotions when present, relevant restaurant/store/provider/place identity, then its menu/products/services/listings. Current reference-fixture promotion surfaces are omitted rather than presented as live offers.

Known catalogue gaps as of 2026-08-28:

- There is no completed/fulfilled-order aggregation with service-area and active-item filtering, so Food intentionally omits `Most Ordered` rather than ranking menu flags or manufacturing order popularity.
- The app has no coordinate-based restaurant proximity result, so the restaurant rail is labelled `Popular Restaurants`, not `Popular Restaurants Near You`.
- Market-only Food shortcuts such as Rolex, Kenyan and Tanzanian do not have matching files in this pack; they use the Food vertical banner until a semantic banner is supplied.
- Home & Care has no provider records for Handyman or Laundry & Dry Cleaning in the current booking seed. Their banners are registered, but those categories are not falsely attached to an existing provider.
- Go Out has no current Day Trips place inventory. Its category/banner route can render a truthful empty state until place data is supplied.
- No category promotion is shown unless an active campaign source supplies it; the banner artwork itself is not treated as proof of a discount, availability, ETA, rating, or inventory.
