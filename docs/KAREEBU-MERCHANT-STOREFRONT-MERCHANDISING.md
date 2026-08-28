# Kareebu Merchant Storefront & Supermarket Merchandising

## Product principle

Kareebu merchant pages are no longer generic seller-filtered product lists. The shared `MerchantStorefrontEngine` builds a seller-scoped page configuration from merchant identity, merchant type, deterministic development inventory and central PromotionEngine campaigns.

The same renderer supports supermarkets, pharmacies, electronics, beauty, pet and home merchants while allowing each merchant to present a different assortment and module order.

## Supermarkets

Supermarkets use the highest local merchandising density. Depending on the seller assortment, the page can render:

- seller header, logo, location and scoped search;
- delivery/fee/minimum summary with reference/live disclosure;
- seller campaign;
- supermarket hero campaign;
- Best Sellers;
- product-derived Shop by Category;
- Fresh Finds;
- Coffee & Tea;
- Weekly Highlights;
- Household Essentials;
- Health & Personal Care;
- Family & Baby;
- seller brand rail;
- final virtualized two-column product grid.

Categories with insufficient matching inventory are suppressed. The development catalogue is deterministic, but individual supermarket assortments are biased differently so two sellers do not render as identical stores with different logos.

## Specialist retailers

Electronics, pharmacy, beauty, pet and home sellers receive different merchandising plans. Examples include Mobile Accessories Must-Haves, Gaming Hub, Vitamins & Wellness, Skincare, Food & Treats, and Kitchen/Storage.

## Promotions

Store promotions reuse the central PromotionEngine. Store/supermarket/electronics placements were added rather than creating a second promotional runtime. Merchant type, seller and category context can participate in campaign eligibility.

Development campaigns use discovery language rather than inventing percentage discounts, free delivery or merchant partnerships. Reference merchants sanitize their legacy `deal` copy unless live commercial data is connected.

## Navigation

Seller category pages use the `shopCategory` route while retaining `sellerId`, category context and route history. Product detail preserves seller context and basket lines remain store scoped.

## Production gaps

- Replace development wordmark fallbacks with rights-cleared merchant logos where available.
- Replace reference merchant photography with merchant-approved storefront creative when contracted.
- Connect actual store catalogues, inventory, prices, offers and delivery estimates.
- Feed real sales/recommendation signals into merchandising ranking.
- Add CMS-managed campaign landing documents when the production App Engine backend is available.
