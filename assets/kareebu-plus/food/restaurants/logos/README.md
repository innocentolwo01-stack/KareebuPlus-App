# Kareebu Uganda restaurant identity pack

This pack contains genuine restaurant identity assets for the Popular Restaurants rail.

## Logo files

- `cafe_javas_logo_white.png`
- `chicken_tonight_uganda_logo.png`
- `java_house_uganda_logo.png`
- `java_house_africa_logo.svg`
- `pizza_inn_africa_logo.png`

## Suggested asset registry keys

- `restaurants.cafeJavas.logo`
- `restaurants.chickenTonight.logo`
- `restaurants.javaHouse.logo`
- `restaurants.pizzaInn.logo`

## Rendering

- Use `contain`, never `cover`.
- Preserve transparent padding and the original aspect ratio.
- Render the white Café Javas mark on a dark brand-compatible tile.
- Render the other marks on clean neutral tiles unless partner brand guidance specifies otherwise.
- Do not turn food photographs, restaurant initials or plain names into substitute logos.

## Verified restaurant-specific Best Seller examples

These are appropriate development-seed examples only when the named restaurant and menu item exist in the Kareebu catalogue:

1. Café Javas — Loaded Chapati Combo — UGX 34,000
2. Chicken Tonight Uganda — Pilau with Beef Stew — UGX 21,000
3. Java House Uganda — Signature Luwombo — use the current catalogue price
4. Pizza Inn Africa — Peri Peri Chicken Pizza — use the current Uganda catalogue price

Every Best Seller card must reference a real restaurant ID and menu-item ID. Production ranking should use completed-order data. A development build may use a deterministic `isBestSeller` seed flag; it must not invent order counts or reviews.

## Source pages

- Café Javas official site: https://cafejavas.co.ug/
- Café Javas Loaded Chapati Combo: https://cafejavas.co.ug/user/productDetails/MTAyOA==?cat=BIG+ON+BREAKFAST&subcat=BREAKFAST+COMBOS
- Chicken Tonight Uganda official site and menu: https://chickentonight.ug/our-menu/
- Java House Uganda official menu: https://javahouseafrica.com/menus/food-menu/uganda/
- Pizza Inn Africa official Simbisa brand page: https://www.simbisabrands.com/our-brands/pizza-inn/

Restaurant names and logos are third-party trademarks. Confirm partner/commercial-use rights before production publication.
