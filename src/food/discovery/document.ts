import type { FoodHomeDocument } from './types';

export function buildFoodHomeDocument(
  city: string,
  country: string,
): FoodHomeDocument {
  return {
    page: 'food-discovery-home',
    version: 1,
    market: { city, country },
    widgets: [
      { id: 'filters', type: 'filter-rail' },
      { id: 'categories', type: 'category-carousel' },
      { id: 'iconic-banner', type: 'image-banner', asset: 'iconic-spots' },
      { id: 'iconic-restaurants', type: 'restaurant-carousel', source: 'featured' },
      { id: 'promos', type: 'promo-carousel' },
      { id: 'best-sellers', type: 'best-sellers' },
      { id: 'most-ordered', type: 'most-ordered' },
      { id: 'popular-brands', type: 'popular-brands' },
      { id: 'nearby', type: 'nearby' },
      { id: 'bank-savings', type: 'bank-savings' },

      // Reference modules supplied on 15 Aug 2026.
      { id: 'top-rated-restaurants', type: 'stacked-restaurant-rail', variant: 'top-rated' },
      { id: 'inspired-by-orders', type: 'stacked-restaurant-rail', variant: 'inspired' },
      { id: 'popular-today', type: 'stacked-restaurant-rail', variant: 'popular' },
      { id: 'trending-near-you', type: 'stacked-restaurant-rail', variant: 'trending' },
      { id: 'just-landed', type: 'stacked-restaurant-rail', variant: 'just-landed' },

      // Keep the full restaurant catalogue at the end of discovery.
      { id: 'all-restaurants', type: 'all-restaurants-enhanced' },
    ],
  };
}
