export type SearchScope =
  | 'global'
  | 'food'
  | 'food_category'
  | 'shops'
  | 'shop_vertical'
  | 'seller'
  | 'restaurant'
  | 'groceries'
  | 'pharmacy'
  | 'electronics'
  | 'pets'
  | 'gifts'
  | 'dineout'
  | 'services'
  | 'rides'
  | 'boda';

export type SearchContext = {
  scope: SearchScope;
  placeholder: string;
  market?: string;
  city?: string;
  vertical?: string;
  category?: string;
  sellerId?: string;
  restaurantId?: string;
};

type ContextOptions = Omit<Partial<SearchContext>, 'scope'>;

const PLACEHOLDERS: Record<Exclude<SearchScope, 'food_category' | 'shop_vertical' | 'seller' | 'restaurant'>, string> = {
  global: 'Search Kareebu',
  food: 'Search dishes and restaurants',
  shops: 'Search shops, products and brands',
  groceries: 'Search groceries',
  pharmacy: 'Search medicines & wellness',
  electronics: 'Search phones, tech and appliances',
  pets: 'Search pet food, toys and care',
  gifts: 'Search gifts, flowers and hampers',
  dineout: 'Search restaurants',
  services: 'Search services',
  rides: 'Search destinations',
  boda: 'Search destinations',
};

export function searchContext(scope: keyof typeof PLACEHOLDERS, options: ContextOptions = {}): SearchContext {
  return { scope, placeholder: PLACEHOLDERS[scope], ...options };
}

export function foodCategorySearchContext(category: string, options: ContextOptions = {}): SearchContext {
  return {
    scope: 'food_category',
    category,
    placeholder: `Search ${category.toLowerCase()} restaurants`,
    ...options,
  };
}

export function verticalSearchContext(
  vertical: string,
  placeholder: string,
  options: ContextOptions = {},
): SearchContext {
  return { scope: 'shop_vertical', vertical, placeholder, ...options };
}

export function sellerSearchContext(
  sellerId: string,
  sellerName?: string,
  options: ContextOptions = {},
): SearchContext {
  return {
    scope: 'seller',
    sellerId,
    placeholder: sellerName ? `Search ${sellerName}` : 'Search this shop',
    ...options,
  };
}

export function restaurantSearchContext(
  restaurantId: string,
  options: ContextOptions = {},
): SearchContext {
  return { scope: 'restaurant', restaurantId, placeholder: 'Search this menu', ...options };
}

export function searchContextForVertical(
  vertical: string,
  placeholder: string,
  options: ContextOptions = {},
): SearchContext {
  const scoped: Partial<Record<string, SearchScope>> = {
    pharmacy: 'pharmacy',
    groceries: 'groceries',
    electronics: 'electronics',
    pets: 'pets',
    gifts: 'gifts',
  };
  return {
    scope: scoped[vertical] ?? 'shop_vertical',
    vertical,
    placeholder,
    ...options,
  };
}
