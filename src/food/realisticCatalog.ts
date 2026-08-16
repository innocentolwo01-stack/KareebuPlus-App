import type { DemoMenuItem, DemoRestaurant } from '../demoData';

type MenuTemplate = {
  name: string;
  description: string;
  category: string;
  priceDelta: number;
  badge?: string;
};

const grillMenu: MenuTemplate[] = [
  { name: 'Chargrilled Chicken Plate', description: 'Flame-grilled chicken, seasoned fries, fresh slaw and house sauce.', category: 'Grills', priceDelta: 4500, badge: 'Popular' },
  { name: 'Beef Steak & Pepper Sauce', description: 'Tender grilled beef, pepper sauce, sautéed vegetables and your choice of side.', category: 'Grills', priceDelta: 9000 },
  { name: 'Loaded Chicken Wrap', description: 'Grilled chicken, crisp lettuce, tomato, pickles and garlic sauce in a warm wrap.', category: 'Wraps', priceDelta: 2500 },
  { name: 'Fresh Passion Juice', description: 'Freshly prepared passion fruit juice, served chilled.', category: 'Drinks', priceDelta: -1500 },
  { name: 'Chocolate Fudge Slice', description: 'Rich chocolate cake with smooth fudge icing.', category: 'Desserts', priceDelta: 500 },
];

const cafeMenu: MenuTemplate[] = [
  { name: 'Kampala Breakfast', description: 'Eggs, breakfast potatoes, grilled tomato, sausage, toast and fresh fruit.', category: 'Breakfast', priceDelta: 3500, badge: 'Best seller' },
  { name: 'Chicken Avocado Sandwich', description: 'Grilled chicken, avocado, lettuce and tomato on toasted artisan bread.', category: 'Sandwiches', priceDelta: 2800 },
  { name: 'Creamy Chicken Pasta', description: 'Penne pasta, grilled chicken, mushrooms and parmesan in a creamy herb sauce.', category: 'Pasta', priceDelta: 6200 },
  { name: 'Iced Vanilla Latte', description: 'Espresso, chilled milk and vanilla over ice.', category: 'Coffee & drinks', priceDelta: -800 },
  { name: 'Warm Brownie & Ice Cream', description: 'Chocolate brownie served warm with vanilla ice cream.', category: 'Desserts', priceDelta: 900 },
];

const pizzaMenu: MenuTemplate[] = [
  { name: 'Chicken Supreme Pizza', description: 'Roast chicken, peppers, onions, mozzarella and house tomato sauce.', category: 'Pizza', priceDelta: 6200, badge: 'Popular' },
  { name: 'BBQ Beef Pizza', description: 'Seasoned beef, red onion, mozzarella and smoky barbecue sauce.', category: 'Pizza', priceDelta: 6800 },
  { name: 'Margherita Pizza', description: 'Tomato, mozzarella and basil on a hand-stretched base.', category: 'Pizza', priceDelta: 2500 },
  { name: 'Garlic Bread', description: 'Oven-baked garlic bread finished with herb butter.', category: 'Sides', priceDelta: -2400 },
  { name: 'Family Soda 1.5L', description: 'A chilled 1.5 litre soft drink for sharing.', category: 'Drinks', priceDelta: -3200 },
];

const localMenu: MenuTemplate[] = [
  { name: 'Chicken Luwombo', description: 'Slow-cooked chicken in groundnut sauce, served with matooke and seasonal vegetables.', category: 'Local favourites', priceDelta: 5200, badge: 'Local favourite' },
  { name: 'Beef Pilau Plate', description: 'Fragrant spiced rice with tender beef, kachumbari and house chilli.', category: 'Local favourites', priceDelta: 3000 },
  { name: 'Grilled Tilapia', description: 'Whole grilled tilapia with lemon, fresh salad and your choice of chips or matooke.', category: 'Fish & grills', priceDelta: 8500 },
  { name: 'Rolex Deluxe', description: 'Fresh chapati rolled with eggs, vegetables, avocado and house sauce.', category: 'Street favourites', priceDelta: -1200 },
  { name: 'Fresh Mango Juice', description: 'Fresh mango blended to order and served chilled.', category: 'Drinks', priceDelta: -1800 },
];

function menuFor(restaurant: DemoRestaurant): MenuTemplate[] {
  const text = `${restaurant.name} ${restaurant.cuisine}`.toLowerCase();
  if (/pizza|italian/.test(text)) return pizzaMenu;
  if (/cafe|coffee|javas|java house|bakery|breakfast/.test(text)) return cafeMenu;
  if (/grill|chicken|bbq|steak|smoke|roast/.test(text)) return grillMenu;
  return localMenu;
}

function enrichRestaurant(restaurant: DemoRestaurant): DemoRestaurant {
  if (!restaurant.menu.length) return restaurant;

  const existingIds = new Set(
    restaurant.menu.map((item) => item.id),
  );

  // Build this as DemoMenuItem[] directly instead of creating
  // (DemoMenuItem | null)[] and narrowing afterwards. This preserves
  // the optional-field shape of DemoMenuItem exactly as defined by Kareebu.
  const additions = menuFor(restaurant).reduce<DemoMenuItem[]>(
    (items, template, index) => {
      const seed = restaurant.menu[index % restaurant.menu.length];
      if (!seed) return items;

      const id = `${restaurant.id}-v6-${index + 1}`;
      if (existingIds.has(id)) return items;

      const item: DemoMenuItem = {
        ...seed,
        id,
        name: template.name,
        description: template.description,
        category: template.category,
        price: Math.max(3500, seed.price + template.priceDelta),
      };

      if (index === 0 || seed.popular === true) {
        item.popular = true;
      }

      if (template.badge) {
        item.badge = template.badge;
      }

      items.push(item);
      return items;
    },
    [],
  );

  return {
    ...restaurant,

    // DemoRestaurant.categories is a strict RestaurantCategory[].
    // Menu section labels such as "Breakfast", "Wraps" and "Desserts"
    // belong to menu items, not the restaurant-category union, so keep
    // the restaurant's validated category set unchanged.
    categories: restaurant.categories,

    menu: [...restaurant.menu, ...additions],
  };
}

function branchFrom(
  parent: DemoRestaurant,
  id: string,
  name: string,
  eta: string,
  distance: string,
  deliveryFee: number,
  offer: string,
): DemoRestaurant {
  return {
    ...parent,
    id,
    name,
    eta,
    distance,
    deliveryFee,
    offer,
    menu: parent.menu.map((item) => ({ ...item, id: `${id}-${item.id}` })),
  };
}

export function buildKareebuRestaurantCatalog(base: DemoRestaurant[]): DemoRestaurant[] {
  const enriched = base.map(enrichRestaurant);
  const byId = (id: string, fallback = enriched[0]) => enriched.find((item) => item.id === id) ?? fallback;
  const fallback = enriched[0];
  if (!fallback) return enriched;

  const branchSpecs: Array<[DemoRestaurant | undefined, string, string, string, string, number, string]> = [
    [byId('cafe-javas', fallback), 'cafe-javas-acacia', 'Cafe Javas · Acacia', '20–30 min', '2.4 km', 4500, 'Free delivery over UGX 45,000'],
    [byId('cafe-javas', fallback), 'cafe-javas-village', 'Cafe Javas · Village Mall', '25–35 min', '4.1 km', 5500, '15% off selected meals'],
    [byId('pizza-inn', fallback), 'pizza-inn-acacia', 'Pizza Inn · Acacia', '20–30 min', '2.7 km', 4000, 'Buy 1, get selected pizza offers'],
    [byId('chicken-tonight', fallback), 'chicken-tonight-ntinda', 'Chicken Tonight · Ntinda', '25–35 min', '4.8 km', 5000, 'Popular combo deals'],
    [byId('java-house', byId('cafe-javas', fallback)), 'java-house-village', 'Java House · Village Mall', '25–35 min', '4.0 km', 5000, 'Coffee & breakfast picks'],
    [byId('roast-rhyme', fallback), 'roast-rhyme-kololo', 'Roast & Rhyme · Kololo', '30–40 min', '5.2 km', 6000, 'Top-rated grills'],
  ];

  const existing = new Set(enriched.map((item) => item.id));
  const branches = branchSpecs
    .filter(([parent, id]) => Boolean(parent) && !existing.has(id))
    .map(([parent, id, name, eta, distance, deliveryFee, offer]) => branchFrom(parent!, id, name, eta, distance, deliveryFee, offer));

  return [...enriched, ...branches];
}
