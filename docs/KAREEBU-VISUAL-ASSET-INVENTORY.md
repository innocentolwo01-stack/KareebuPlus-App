# Kareebu visual asset inventory

## Production lifestyle atlas

The canonical high-frequency cut-outs live in `assets/kareebu-plus/lifestyle-cutouts/`.
They are semantic 512–640px PNG masters with alpha, natural colour, consistent
three-quarter/slightly-overhead framing, and no baked-in card UI.

| Customer context | Canonical assets | Status / usage |
| --- | --- | --- |
| Mobility | `service-rides`, `service-boda` | Replaced; Home/service registry |
| Food delivery | `service-food` | Replaced; prepared meal, distinct from Grocery |
| Grocery service | `service-groceries` | Replaced; reusable bag lifestyle composition |
| Grocery fresh | `grocery-fresh-food` | Replaced; exact Grocery taxonomy |
| Grocery butcher | `grocery-beef`, `grocery-chicken`, `grocery-goat`, `grocery-fish`, `grocery-seafood` | Replaced; raw retail meat and seafood only |
| Grocery bakery/dairy/drinks | `grocery-bakery`, `grocery-dairy-eggs`, `grocery-drinks` | Replaced; exact node mappings |
| Grocery pantry/snacks | `grocery-cooking-staples`, `grocery-snacks` | Replaced; unbranded retail compositions |
| Household/personal care | `grocery-household-cleaning`, `grocery-personal-care` | Replaced; exact node mappings |
| Pharmacy | `service-pharmacy`, `pharmacy-vitamins` | Replaced; neutral, unbranded health products |
| Electronics | `service-electronics`, `electronics-phones`, `electronics-computing`, `electronics-tv` | Replaced; distinct device silhouettes |
| Delivery/services | `service-send`, `service-fix`, `service-home-care` | Replaced; parcel, tools and home-care compositions |
| Dining | `service-dineout` | Replaced; restaurant table setting, distinct from delivery Food |
| Local shopping / leisure | `service-shops`, `service-go-out` | Replaced; real retail and entertainment compositions |

## Retained assets

- Existing real merchant/product/restaurant photography remains the source of truth
  for sellers, products and venues.
- Existing `raw-beef-v2` and `raw-chicken-v2` masters remain for compatibility, but
  runtime category resolution uses their stable semantic lifestyle filenames.
- Existing DineOut category cut-outs and Rides vehicle-class cut-outs are retained
  where they already meet the realistic alpha-asset standard.
- Small navigation and utility controls intentionally remain vector icons.

## Legacy review atlas

`services-3d/` and `discovery-3d/` contain older compatibility assets. Many contain
toy-like dioramas, brand-colour recolouring or baked-in pedestals. They are not the
preferred source for the primary services and commerce nodes listed above. Lower
frequency legacy mappings can migrate incrementally without breaking routes that
still depend on them.

## Resolution contract

`resolveCategoryVisual()` resolves by stable taxonomy context:

1. exact taxonomy node key;
2. explicit semantic parent key;
3. domain visual key;
4. neutral fallback.

Display-label substring matching is not used by the visual registry.
