import type { FoodHomeDocument } from './types';

export function buildFoodHomeDocument(
  city: string,
  country: string,
): FoodHomeDocument {
  return {
    page: 'food-discovery-home',
    version: 2,
    market: { city, country },
    slots: ['FOOD_HERO','FOOD_FILTERS','FOOD_CATEGORIES','FOOD_PROMO_02','FOOD_FEATURED','FOOD_PROMO_03','FOOD_BRANDS','FOOD_NEARBY','FOOD_PROMO_04','FOOD_ALL_RESTAURANTS'],
    widgets: [
      { id: 'hero', type: 'campaign', slot: 'FOOD_HERO' },
      { id: 'filters', type: 'filter-rail' },
      { id: 'categories', type: 'category-carousel' },
      { id: 'food-promo-02', type: 'campaign', slot: 'FOOD_PROMO_02' },
      { id: 'featured', type: 'restaurant-carousel', source: 'featured' },
      { id: 'food-promo-03', type: 'campaign', slot: 'FOOD_PROMO_03' },
      { id: 'popular-restaurants', type: 'popular-restaurants' },
      { id: 'nearby', type: 'nearby' },
      { id: 'food-promo-04', type: 'campaign', slot: 'FOOD_PROMO_04' },
      { id: 'all-restaurants', type: 'all-restaurants-enhanced' },
    ],
  };
}
