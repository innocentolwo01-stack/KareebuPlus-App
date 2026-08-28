import type { ImageSourcePropType } from 'react-native';

export type FoodHomeMenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: ImageSourcePropType;
  popular?: boolean;
  isBestSeller?: boolean;
  imageSource?: 'restaurant-catalogue';
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
  availabilityLabel?: string;
  liveAvailability: boolean;
  offer: string | null;
  plus: boolean;
  image: ImageSourcePropType;
  fallbackImage?: ImageSourcePropType;
  logo?: ImageSourcePropType;
  logoBackgroundColor?: string;
  isPopularRestaurant?: boolean;
  menu: FoodHomeMenuItem[];
};

export type FoodBestSellerDish = {
  restaurantId: string;
  restaurantName: string;
  restaurantLogo: ImageSourcePropType;
  restaurantLogoBackgroundColor: string;
  menuItemId: string;
  dishName: string;
  dishImage: ImageSourcePropType;
  priceUGX: number;
  route: {
    restaurantId: string;
    menuItemId: string;
  };
  availability: 'available' | 'confirm-when-opened';
  item: FoodHomeMenuItem;
};

export type FoodHomeFilter =
  | 'Offers'
  | 'Top rated'
  | 'Fast delivery'
  | 'Healthy'
  | 'Kareebu+'
  | 'Under 30 mins'
  | 'Free delivery';

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
    source: 'category' | 'nearby' | 'speedy' | 'best-sellers' | 'popular-restaurants' | 'promo' | 'brand';
      value?: string;
      restaurantId?: string | null;
    };

export type FoodDishSearchResult = {
  restaurantId: string;
  restaurantName: string;
  item: FoodHomeMenuItem;
};

export type FoodHomeWidget =
  | { id: 'hero'; type: 'campaign'; slot: 'FOOD_HERO' }
  | { id: 'filters'; type: 'filter-rail' }
  | { id: 'categories'; type: 'category-carousel' }
  | { id: 'food-promo-02'; type: 'campaign'; slot: 'FOOD_PROMO_02' }
  | { id: 'featured'; type: 'restaurant-carousel'; source: 'featured' }
  | { id: 'food-promo-03'; type: 'campaign'; slot: 'FOOD_PROMO_03' }
  | { id: 'promos'; type: 'promo-carousel' }
  | { id: 'popular-restaurants'; type: 'popular-restaurants' }
  | { id: 'nearby'; type: 'nearby' }
  | { id: 'food-promo-04'; type: 'campaign'; slot: 'FOOD_PROMO_04' }
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
  version: 2;
  market: {
    city: string;
    country: string;
  };
  slots: FoodCmsSlot[];
  widgets: FoodHomeWidget[];
};

export type FoodCmsSlot =
  | 'FOOD_HERO'
  | 'FOOD_FILTERS'
  | 'FOOD_CATEGORIES'
  | 'FOOD_PROMO_02'
  | 'FOOD_FEATURED'
  | 'FOOD_PROMO_03'
  | 'FOOD_BRANDS'
  | 'FOOD_NEARBY'
  | 'FOOD_PROMO_04'
  | 'FOOD_ALL_RESTAURANTS';

export type FoodHomeActions = {
  openRestaurant: (restaurantId: string) => void;
  openFoodItem: (restaurantId: string, itemId: string) => void;
  openSearch: () => void;
  openFoodHome: () => void;
  openCategoryLanding: (category: string) => void;
  exitFood: () => void;
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
  speedyRestaurants: FoodHomeRestaurant[];
  bestSellerDishes: FoodBestSellerDish[];
  popularRestaurants: FoodHomeRestaurant[];
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
  openSpeedyDelivery: () => void;
  openBestSellers: () => void;
  openPopularRestaurants: () => void;
  openPromo: (promoId?: string) => void;
  openBrand: (brand: string, restaurantId?: string | null) => void;
  openFilters: () => void;
  back: () => void;
  actions: FoodHomeActions;
};
