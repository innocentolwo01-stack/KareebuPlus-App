# Careem → Kareebu Plus Full Parity Ledger

## Kareebu visual art-direction contract

Customer-facing service and category identity uses modern skeuomorphism: photorealistic or realistic-isometric 3D objects, composite product compositions, transparent backgrounds, three-quarter perspective, soft studio lighting and restrained contact shadows. Utility controls remain minimalist vectors; merchant, restaurant and product content remains logo or photography-led. Typed presentation metadata and the explicit production-art backlog live in `src/visuals/categoryVisuals.ts` and `src/visuals/visualAssetGaps.ts`.

## DineOut first-class mini-app checkpoint

DineOut now owns a dedicated App Engine discovery feed, category/cuisine/editorial/area collection pages, dine-in restaurant detail, shared favourites, and a reservation-enquiry boundary. It remains distinct from Food delivery: no delivery menu, basket or order CTA appears in DineOut. Uganda, Kenya and Tanzania resolve separate city areas, cuisines and reference venue sets; partnership, ratings and table availability are explicitly non-live until backend sources are connected.

Living reconstruction ledger for `codex/full-ux-system-pass`. The Careem APK/ZIP is inspection-only, excluded from Git, and no proprietary binary/source output is copied into Kareebu. Status values: **Implemented**, **Partial**, **Not started**, **Backend**. Emulator status remains **Pending** until the user completes Android review.

## Search and semantic discovery checkpoint

Kareebu now exposes a typed contextual-search contract shared by the global header, Food, Food categories, Shops, commerce verticals, seller catalogues, restaurant menus, services and discovery domains. Page/App Engine definitions can declare scope, placeholder, market, city, category and merchant context; seller and restaurant scopes remain local instead of falling through to global search. The shared search surface uses one compact right-aligned search affordance and the same accessible geometry across yellow service headers and detail content.

Customer-facing categories resolve semantic keys through `src/visuals/categoryVisuals.ts`. Packaged Kareebu artwork is the fallback, while typed CMS remote-image/photo overrides carry alt text, aspect ratio and rights/source metadata. Grocery, pharmacy, Food and Shops keys have explicit object-based visuals; utility vectors remain reserved for controls and documented last-resort category fallbacks.

## Universal category landing checkpoint

Discovery now follows the reusable service → category landing → seller → product hierarchy. `src/categoryLanding/registry.ts` resolves a typed, market-aware category definition and compiles it into an App Engine page rather than requiring a native screen per category. Shared hero, filter, deal, seller, brand, editorial and virtualized all-results organisms cover Food Offers, New Additions and standard cuisine pages as well as Pharmacy, Grocery, Electronics, Pet, Gifts, Beauty, Fashion and Butchery categories. Food remains restaurant-list oriented; retail results use a responsive two-column product grid. Search/filter state is retained per category, and commerce product Back returns to its originating category when applicable.

The remaining parity gap is remote CMS delivery and live category eligibility: seller availability, latest-added ordering, campaign/deal qualification, product price/stock and personalized recommendations currently retain explicit fixture/non-live boundaries. Android visual status remains **Pending**.

## Global search and visual-system refinement

The contextual search contract now resolves through a typed provider registry for global, service, category, seller, restaurant and mobility scopes. Provider definitions declare supported result families, recents/suggestion behaviour and whether results must remain within one entity. Seller search is product-only and requires a seller ID; restaurant search is dish-only and requires a restaurant ID. Detail pages expose one scoped search field rather than a second search button targeting the same task.

`CategoryArtwork` is the shared renderer for semantic category keys. It resolves packaged Kareebu 3D artwork, Uganda/Kenya/Tanzania overrides and CMS-provided remote imagery through one typed path. Shops verticals, commerce category heroes/deals and Home & Care discovery use this renderer. Primary grocery, pharmacy, Food, Electronics, Fashion, Pet, Gifts and general discovery mappings now use object-based packaged artwork; vector rendering remains an explicit unknown-category fallback and utility controls continue using the normal icon family. The shared page header uses safe-area insets on both platforms and retains 48px actions with a 52px search field.

## Home service carousel checkpoint

Home services now resolve from `src/services/serviceRegistry.ts`, which owns label, route, visual key, East African market availability, analytics identity, optional mobility/shop setup and Home placement. The Home renderer groups eight entries per logical page and renders four columns by two rows inside a horizontal virtualized, snapping carousel. Core order is fixed as Rides/Food/Groceries/Pharmacy above Boda/Shops/Send/More; a second page exposes only implemented secondary destinations. Rides and Boda share infrastructure but set their mode before entering the distinct map-led experience.

The same registry now drives the searchable, grouped All Services page. An App Engine `service-tile-carousel` definition exposes two rows, four visible columns and route-validated items for eventual CMS ordering/targeting. `validate:home-services` fails on duplicate IDs, missing route cases, missing visual keys, invalid market ownership or core-order drift. Android gesture, snap and optical review remains **Pending**.

## Reference evidence inspected

- APK package resources expose `com.careem.appengine.lib.organism.resources`, including a reorder placeholder and organism strings.
- Decompiled package structure exposes separate Food, Shops and Order Anything App Engine view models plus App Engine container/bottom-sheet navigation.
- Home API models explicitly separate `HomeDataResponse`, `Widget`, `ServiceTile`, `Services`, `BannerCard` and resource data; banner rendering carries independent view/click tracking links and CTA deep links.
- Global Search exposes recent-search models, autosuggestions, service tiles, groceries merchants, restaurant/shop/place response families and separate APIs.
- Activities exposes history/detail models, filters, payment details, invoice URLs, rewards/cashback banners, server-supplied CTAs and status adapters.
- Global basket and global location modules are independently packaged.
- The user-supplied class inventory records Home App Engine fragments/view models, banner pager/indicator, tile containers, categorized tile rows and All Services.

## Platform and cross-app architecture

| Careem capability | Careem pattern | Kareebu equivalent | Status | Implementation files | Remaining parity gap | Backend dependency | Emulator |
|---|---|---|---|---|---|---|---|
| App Engine pages | Page/metadata/blueprint/feed configuration | Typed page, section, action, route, targeting, creative, plugin and analytics definitions | Implemented foundation | `src/appEngine/types.ts`, `src/appEngine/runtime.ts` | Remote blueprint decoding, caching, schema migration and signed delivery | CMS/App Engine endpoint | Pending |
| Organism renderer | Grid/carousel/rich-card organism families | Virtualized `AppEnginePage` plus screen-specific organism registry | Partial | `src/appEngine/AppEnginePage.tsx`, `src/home/HomeDiscoveryFeed.tsx` | Shared registries for every mini-app; sticky/bottom-sheet organisms | Remote page payloads | Pending |
| Targeting | Market, audience, experiment configuration | Country/city/audience/member/date resolver | Implemented foundation | `src/appEngine/runtime.ts` | Remote experiments and eligibility provider | Experiment service | Pending |
| Navigation metadata | Route/action/navigation-bar models | Typed routes, actions and page navigation policy | Partial | `src/appEngine/types.ts`, `src/navigation/AppNavigation.tsx` | Parameterized deep-link resolver and modal route policy | Deep-link registry | Pending |
| Plugins | Search/selection/basket/page plugins | Typed plugin boundary | Implemented foundation | `src/appEngine/types.ts` | Runtime plugin adapters | Search, basket, selection APIs | Pending |
| Analytics | Widget/page event configuration | Privacy-safe page/section metadata and existing vendor-neutral events | Partial | `src/appEngine/types.ts`, `src/analytics.ts` | Impression visibility tracking and remote event dictionaries | Analytics endpoint | Pending |
| Loading/error/empty | Server-driven page states | App Engine loading, empty and error states | Implemented foundation | `src/appEngine/AppEnginePage.tsx` | Branded skeleton organisms and retry orchestration | Page endpoint | Pending |
| Market configuration | City/service availability | Central Uganda/Kenya/Tanzania locale, map, mobility, content and availability configuration | Partial | `src/markets/config.ts`, `src/content/markets/*`, `src/locale.ts` | Remote service, merchant and inventory availability | Availability APIs | Pending |

## Customer areas

| Careem capability | Careem pattern | Kareebu equivalent | Status | Implementation files | Remaining parity gap | Backend dependency | Emulator |
|---|---|---|---|---|---|---|---|
| Home | AppEngineHome, tile containers, banner pager, contextual feed | App Engine-backed Home blueprint, primary tiles, quick actions, campaigns, activity and curated modules | Partial | `src/home/homeFeed.ts`, `src/home/HomeDiscoveryFeed.tsx`, `src/screens.tsx` | Visual measurement against running reference; replace local fallback content with remote blueprint | Home page/CMS, recommendations | Pending |
| All Services | Categorized tile rows and AllServicesActivity | Existing More/Services route | Partial | `src/screens.tsx`, `src/home/KareebuServiceCarousel.tsx` | Rebuild as categorized App Engine page with search and availability | Service catalogue | Pending |
| Promotions | BannerPager/BannerIndicator | Typed promotions, dominant carousel, named slots | Partial | `src/promotions/*`, `src/appEngine/types.ts` | Remote creative URLs, cache/prefetch, impression eligibility | Promotions CMS | Pending |
| Global Search | One cross-super-app search with recents/autosuggest | Existing unified search across services, merchants and places | Partial | `src/screens.tsx` | Persisted recents, autosuggestions, product aggregation, App Engine search plugin | Search aggregation APIs | Pending |
| City selector | Dedicated selector and availability | Country/city onboarding and animated market-aware map camera | Partial | `src/markets/config.ts`, `src/onboarding/KareebuLaunchGate.tsx`, `src/screens.tsx` | Remote service/merchant availability and additional city map bounds | Market configuration | Pending |
| Activities | Active/history tabs and server-driven details/CTAs | Unified activity, order views and active transaction bar | Partial | `src/activity/ActiveTransactionBar.tsx`, `src/screens.tsx` | Unified typed ledger, tabs, receipt/detail route and backend statuses | Transaction aggregation API | Pending |
| Rides | Destination, products, estimates, captain lifecycle | Map-led car-only landing with shared destination card, saved places, airport shortcut, car campaigns and market pricing | Partial | `src/ride/KareebuDestinationCard.tsx`, `src/ride/kareebuRidesHome.tsx`, `src/markets/config.ts`, `src/screens.tsx` | Live estimates, events, polling, eligibility, surge, captain and receipt services | Mobility/CMS backends | Pending |
| Boda | Mobility patterns adapted to motorcycles | Map-led motorcycle-only landing, Boda markers, destination card, Send handoff, pricing and safety integration boundaries | Partial | `src/ride/KareebuDestinationCard.tsx`, `src/ride/kareebuBodaHome.tsx`, `src/ride/mobilityLanding.ts` | Live rider supply, helmet/safety status, CMS events and trip polling | Mobility/CMS backends | Pending |
| Food | App Engine discovery, filters, restaurants, reorder | Typed Food document/controller and discovery surfaces | Partial | `src/food/discovery/*`, `src/food/screens.tsx` | Migrate document to shared App Engine schema; remote restaurants/menu/reorder | Food catalogue/order backend | Pending |
| Groceries/Quik | Location, aisles, reorder, basket, tracking | Dedicated Groceries vertical and shared commerce | Partial | `src/experience/*`, `src/commerce/*` | Dedicated product feed, persistent basket and fulfilment tracking | Grocery inventory/order backend | Pending |
| Shops | App Engine discovery and genuine mini-app | Virtualized Shops Home, recommended sellers, two-row vertical rail, campaigns and all-seller list | Partial | `src/shops/ShopsLandingScreen.tsx`, `src/experience/*`, `src/commerce/*` | Remote Shops blueprint and live seller/product content | Marketplace APIs | Pending |
| Pharmacy | Merchant-first vertical with need-based discovery | Compact reusable vertical page, two-up campaign rail, nearby sellers and distinct need visuals | Partial | `src/experience/VerticalLandingScreen.tsx`, `src/experience/verticals.ts`, `src/experience/categoryVisuals.ts` | Live pharmacy catalogue, prescription-review integration and reorder | Regulated pharmacy partner | Pending |
| Butchery & Seafood | Specialist vertical, campaigns and availability-aware seller list | Dedicated reusable vertical configuration with fresh-cut/seafood taxonomy and closed-state support | Partial | `src/experience/verticals.ts`, `src/experience/verticalLandingBlueprint.ts` | Licensed merchant imagery, weights/cuts, live stock and fulfilment | Marketplace APIs | Pending |
| Pet Stores | Dedicated pet/category landing | Configured vertical mini-app | Partial | `src/experience/verticals.ts` | Live merchants/products/reorder | Marketplace APIs | Pending |
| Gifts & Flowers | Occasion/category/schedule architecture | Configured vertical mini-app | Partial | `src/experience/verticals.ts` | Schedule selection and confirmed delivery slots | Merchant scheduling API | Pending |
| Electronics | Seller/stock/warranty/returns | Configured vertical mini-app and trust boundary | Partial | `src/experience/verticals.ts`, `src/commerce/*` | Product-level stock, warranty and returns payloads | Marketplace APIs | Pending |
| DineOut | Planning/discovery/reservation | Separate location/time/party/reservation-intent flow | Partial | `src/home/KareebuDineOutSection.tsx`, `src/screens.tsx` | Live restaurant availability and confirmed reservation states | Reservation backend | Pending |
| Send | Structured parcel quote and tracking | Parcel draft/review/success/tracking flow | Partial | `src/parcels/*` | Shared place picker everywhere, live quotes/courier/proof | Parcel backend | Pending |
| Home & Care | Partner service landing and fulfilment | Service-specific diagnostic requests and booking flow | Partial | `src/services/*` | Live providers, quotes, booking/payment/tracking | Services marketplace | Pending |
| Pay | Wallet/top-up/P2P/bills/remittance/history | Market-aware Pay hub and regulated quote boundary | Partial | `src/parity/customerParity.tsx`, `src/locale.ts` | Live rails, KYC, refunds and regulated remittance | Licensed payment providers | Pending |
| Kareebu+ | Membership landing/benefits/manage | Membership pages and benefit messaging | Partial | `src/parity/customerParity.tsx`, `src/promotions/*` | Eligibility, subscription billing and savings ledger | Membership backend | Pending |
| Rewards | Balance/earn/redeem/history/campaigns | Rewards surface integrated into Home and Pay | Partial | `src/engagement/screens.tsx`, `src/screens.tsx` | Reward detail, history and live earning rules | Rewards backend | Pending |
| Kareebu Global | Kareebu-specific international mini-app | Clearly labelled preview module | Partial | `src/home/HomeDiscoveryFeed.tsx` | Dedicated landing, retailer adapters, duties/shipping/checkout | International commerce partners | Pending |
| Account | Cross-app identity/settings/support | Existing account, privacy, support and preference surfaces | Partial | `src/screens.tsx`, `src/engagement/*` | App Engine account page and unified settings contracts | Identity/support APIs | Pending |

## Current checkpoint

- [x] Inspect APK/ZIP structural evidence without adding reference files to Git.
- [x] Establish App Engine page, organism, route, creative, targeting, plugin and analytics contracts.
- [x] Add page resolution, targeting and schema validation boundaries.
- [x] Add a virtualized App Engine page renderer with loading/error/empty states.
- [x] Migrate Home’s local fallback blueprint through the App Engine page model.
- [x] Centralise East African map cameras, market content packs, mobility products and non-live fare configurations.
- [x] Separate car and Boda products throughout ride selection and market campaigns.
- [x] Replace vertical mini-app hardcoding with a virtualized merchandising blueprint, typed seller/product fixtures and CMS-addressable promo slots.
- [x] Add reusable Food category landing blueprints and preserve Food → category → restaurant → product navigation context.
- [x] Reconstruct Restaurant detail with hero controls, reference-aware commercial metadata and scroll-linked sticky menu navigation.
- [x] Replace generic Shops routing with a virtualized Shops landing, explicit vertical entry routes, compact vertical chrome and reusable seller availability states.
- [x] Rebuild Rides and Boda around a shared destination-first card while keeping cars, motorcycles, markers, pricing, campaigns and safety messaging mode-specific.
- [x] Remove customer-facing Rides/Boda switching and fare/captain selection; use map-led autocomplete, product estimates, compact review and automatic matching.
- [x] Standardise retailer discovery on seller logos and move seller product browsing to a responsive two-column grid while retaining restaurant lists and menu rows.
- [x] Generalise category discovery into an App Engine-compatible landing registry with Food Offers/New Additions variants, state restoration and virtualized Food/retail result families.
- [x] Replace the static Home service grid with a responsive two-row horizontal carousel backed by one market-aware, route-validated service registry and a grouped All Services page.
- [ ] Connect a remote CMS blueprint provider with cache and fallback.
- [ ] Complete visual emulator review.
- [ ] Begin checkpoint 2: Global Search, city/location and unified Activities parity.
