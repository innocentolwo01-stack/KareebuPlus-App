# Kareebu Plus category banner pack

This pack contains **97 production-sized PNG banners**, each exactly **420 × 200 pixels**.

## Brand direction

- Primary colours: Kareebu sunny yellow (`#FFD21F`) and white (`#FFFFFF`)
- Supporting colour: restrained black (`#111111`) for typography and CTA buttons
- Visual style: bright, photographic, polished and credible for Uganda / East Africa
- No third-party branding or fabricated venue logos

## Folder inventory

| Folder | Contents | Count |
|---|---|---:|
| `00_main` | Main app verticals | 8 |
| `food` | Restaurant cuisine and discovery categories | 15 |
| `groceries` | Grocery and essentials categories | 12 |
| `pharmacy` | Pharmacy and wellness categories | 12 |
| `fashion_beauty` | Fashion and beauty categories | 12 |
| `electronics` | Electronics and appliance categories | 12 |
| `home_care` | Home-service categories | 8 |
| `07_go_out` | Leisure, dining and city-discovery categories | 14 |
| `send` | Delivery-service categories | 4 |
| **Total** |  | **97** |

## Intended app flow

These banners are designed for a consistent category and subcategory landing-page pattern:

1. Category or subcategory banner
2. Truthful, data-backed promotions
3. Relevant restaurants, stores, providers or places
4. The selected merchant or provider's listings

For food categories, the CTA is deliberately **Find restaurants**. A Burgers banner should open the landing page containing restaurants that specialise in burgers; it should not jump straight to a generic burger product listing.

## Integration

Use `manifest.json` as the central registry. It includes each banner's semantic ID, label, section, suggested route, file path, CTA and dimensions. Adjust the suggested routes to match the app's current navigation names rather than scattering image imports across screens.

The imagery is category/editorial creative. It does not claim to depict a particular named restaurant, shop, provider or attraction.
