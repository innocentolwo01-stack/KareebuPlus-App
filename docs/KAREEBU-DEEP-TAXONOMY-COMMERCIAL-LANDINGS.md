# Kareebu deep taxonomy & commercial landing architecture

## Principle

Browsing does not collapse a meaningful category into a generic product filter. The shared hierarchy is:

`service → marketplace/merchant/vertical → category → subcategory → child category → brand/collection → leaf products → PDP`

The number of levels is determined by real commercial meaning. Price, colour, size, rating, delivery and sort remain filters unless explicitly promoted into a curated editorial collection.

## Shared landing renderer

`src/taxonomy/UniversalTaxonomyLandingScreen.tsx` renders meaningful taxonomy destinations using a shared configuration rather than bespoke screens. It supports contextual search, commercial hero/inline promotion placements, realistic semantic category artwork, child-category discovery, real seller identity, brand discovery, product previews at non-leaves, leaf product grids and photography-led experience cards for GoOut/DineOut.

## Pharmacy

Pharmacy & Wellness now includes Medicines & Health, Vitamins & Supplements, Personal Care, Skincare, Haircare, Baby & Child and Home Health. Medicines branch into Cold/Flu/Cough, allergy, digestive health, pain, first aid and other meaningful needs. Cough, digestive health and first aid contain deeper child nodes where useful.

Pharmacy merchant discovery uses configured identities. Goodlife uses the packaged logo. Gentleman’s Pharmacy uses a wordmark fallback until a rights-cleared merchant logo is supplied. Generic cards named “Nearby pharmacy” and “Health & wellness store” are not merchant identities.

## Other deep taxonomies

- Beauty: Makeup → Face → Foundation/Concealer/Powder/etc.
- Fashion: Women → Dresses → Mini/Midi/Maxi/Occasion/Workwear; Men; Kids; Shoes; Accessories; Sportswear.
- Electronics: Gaming → Consoles/Games/Controllers/etc.; Phones; Accessories; Computers; Audio; TV; Cameras; Smart Home; Wearables; Appliances.
- Groceries: Fresh Produce, Dairy, Meat/Fish, Bakery, Coffee & Tea → Coffee/Tea/Hot Chocolate, beverages, snacks, household, baby, pet and more.
- GoOut: Spa & Wellness → Massage/Spa Days/etc., attractions, events, cinema, kids, outdoor and experiences.
- DineOut: occasion and cuisine landings.
- Home & Care: Cleaning → Home/Deep/Sofa/Carpet Cleaning, plus Laundry, Handyman, AC, Pest Control and Moving.
- Global: marketplace nodes plus deep retail department/category/subcategory landings.

## Visual rules

Application TS/TSX source no longer references the legacy `discovery-3d` or `services-3d` folders. Current discovery resolves through the semantic visual registry, lifestyle/product cutouts, real product media, real food/venue photography and merchant identity. Known missing fashion/beauty production artwork is explicitly recorded in `visualAssetGaps.ts` rather than silently reusing the old generic Kareebu bag compositions.

## Promotions

Taxonomy pages expose contextual `LANDING_*` placements. Campaign context includes current category/subcategory/node/merchant/marketplace so the promotion engine can keep campaigns commercially relevant to the current destination.

## Production boundaries

Reference fixtures are not presented as live price, live stock, real discount, real rating or real ETA unless source-backed. A real merchant logo is used only where a packaged/rights-cleared asset exists; otherwise a labelled wordmark fallback remains explicit.
