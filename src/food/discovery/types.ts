import type { ImageSourcePropType } from 'react-native';

export type FoodHomeMenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: ImageSourcePropType;
  popular?: boolean;
  badge?: string;
};

export type FoodHomeRestaurant = {
  id: string;
  name: string;
  cuisine: string;
  categories: string[];
  rating: number;
  reviews: string;
  eta: string;
  distance: string;
  neighborhood?: string;
  priceLevel?: '$' | '$$' | '$$$';
  featuredDish?: string;
  deliveryLabel: string;
  offer: string | null;
  plus: boolean;
  image: ImageSourcePropType;
  fallbackImage?: ImageSourcePropType;
  menu: FoodHomeMenuItem[];
};

export type FoodHomeFilter =
  | '4.7+ Rated'
  | 'Top Choices'
  | 'Calorie info'
  | '30% Off';

export type FoodDiscoverySort =
  | 'Recommended'
  | 'Top rated'
  | 'Fastest';

export type FoodDiscoveryAdvancedFilters = {
  sort: FoodDiscoverySort;
  minRating: number | null;
  offersOnly: boolean;
  plusOnly: boolean;
  freeDeliveryOnly: boolean;
};

export type FoodDiscoverySurface =
  | { kind: 'home' }
  | { kind: 'search' }
  | { kind: 'filters' }
  | {
      kind: 'listing';
      title: string;
      source: 'category' | 'nearby' | 'best-sellers' | 'promo' | 'brand';
      value?: string;
      restaurantId?: string | null;
    };

export type FoodDishSearchResult = {
  restaurantId: string;
  restaurantName: string;
  item: FoodHomeMenuItem;
};

export type FoodHomeWidget =
  | { id: 'filters'; type: 'filter-rail' }
  | { id: 'categories'; type: 'category-carousel' }
  | { id: 'iconic-banner'; type: 'image-banner'; asset: 'iconic-spots' }
  | { id: 'iconic-restaurants'; type: 'restaurant-carousel'; source: 'featured' }
  | { id: 'promos'; type: 'promo-carousel' }
  | { id: 'best-sellers'; type: 'best-sellers' }
  | { id: 'most-ordered'; type: 'most-ordered' }
  | { id: 'popular-brands'; type: 'popular-brands' }
  | { id: 'nearby'; type: 'nearby' }
  | { id: 'bank-savings'; type: 'bank-savings' }
  | {
      id: 'top-rated-restaurants';
      type: 'stacked-restaurant-rail';
      variant: 'top-rated';
    }
  | {
      id: 'inspired-by-orders';
      type: 'stacked-restaurant-rail';
      variant: 'inspired';
    }
  | {
      id: 'popular-today';
      type: 'stacked-restaurant-rail';
      variant: 'popular';
    }
  | {
      id: 'trending-near-you';
      type: 'stacked-restaurant-rail';
      variant: 'trending';
    }
  | {
      id: 'just-landed';
      type: 'stacked-restaurant-rail';
      variant: 'just-landed';
    }
  | { id: 'all-restaurants'; type: 'all-restaurants-enhanced' };

export type FoodHomeDocument = {
  page: 'food-discovery-home';
  version: 1;
  market: {
    city: string;
    country: string;
  };
  widgets: FoodHomeWidget[];
};

export type FoodHomeActions = {
  openRestaurant: (restaurantId: string) => void;
  openFoodItem: (restaurantId: string, itemId: string) => void;
  openSearch: () => void;
  openFoodHome: () => void;
  openOffers: () => void;
  openMembership: () => void;
  toggleFavourite: (restaurantId: string) => void;
};

export type FoodHomeController = {
  document: FoodHomeDocument;
  restaurants: FoodHomeRestaurant[];
  visibleRestaurants: FoodHomeRestaurant[];
  rankedRestaurants: FoodHomeRestaurant[];
  nearbyRestaurants: FoodHomeRestaurant[];
  restaurantSearchResults: FoodHomeRestaurant[];
  dishSearchResults: FoodDishSearchResult[];
  listingRestaurants: FoodHomeRestaurant[];
  activeFilter: FoodHomeFilter | null;
  activeCategory: string | null;
  favouriteIds: string[];
  query: string;
  setQuery: (query: string) => void;
  surface: FoodDiscoverySurface;
  advancedFilters: FoodDiscoveryAdvancedFilters;
  hasAdvancedFilters: boolean;
  setAdvancedFilters: (patch: Partial<FoodDiscoveryAdvancedFilters>) => void;
  clearAdvancedFilters: () => void;
  selectFilter: (filter: FoodHomeFilter) => void;
  selectCategory: (category: string) => void;
  openCategory: (category: string) => void;
  openNearby: () => void;
  openBestSellers: () => void;
  openPromo: (promoId?: string) => void;
  openBrand: (brand: string, restaurantId?: string | null) => void;
  openFilters: () => void;
  back: () => void;
  actions: FoodHomeActions;
};
