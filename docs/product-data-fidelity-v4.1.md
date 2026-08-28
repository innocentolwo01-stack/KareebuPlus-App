# Kareebu Plus product-data fidelity

This phase closes the gap between having product cards/screens and having a retail-grade product detail model.

## Confirmed from the supplied 6amMart V4.0.1 customer source

The donor item/store-category models expose fields for descriptions, brand IDs, manufacturer, unit/unit value/type, stock, maximum cart quantity, variations, add-ons, images/video, tax, discounts, ratings, organic and halal flags, prescription requirements, nutrition names, allergen names, generic/medicine names, free delivery and verified sellers.

The donor item-details UI explicitly renders description, nutrition details, allergic ingredients, generic names, stock/low-stock state, ratings, variations, add-ons, discount/free-delivery state, organic/halal tags, unit/veg state and prescription requirement where applicable.

## Kareebu catalogue enrichments

The donor model inspected does not expose standard retail physical `length × width × height` fields, SKU/barcode, ingredients, country of origin, warranty or return-policy fields as part of its core item model. Kareebu adds these deliberately so its backend can support richer supermarket, pharmacy, electronics and marketplace catalogues.

## Front-end behaviour

The product detail page now has conditional sections for:

- full description
- brand and manufacturer
- unit / pack size
- net weight
- dimensions
- origin
- SKU and barcode
- stock and maximum quantity
- ratings and tax
- generic medicine/common names
- nutritional information
- ingredients
- allergens
- organic / halal / vegetarian / prescription badges
- storage/care instructions
- warranty and returns

Fields are conditional: the UI only displays information supplied by the product record. This lets the same product component serve grocery, pharmacy, electronics, beauty and other Kareebu commerce modules.
