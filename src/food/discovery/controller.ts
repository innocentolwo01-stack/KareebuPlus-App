import { useEffect, useMemo, useState } from 'react';

import { buildFoodHomeDocument } from './document';
import type {
  FoodBestSellerDish,
  FoodDiscoveryAdvancedFilters,
  FoodDiscoverySurface,
  FoodDishSearchResult,
  FoodHomeActions,
  FoodHomeController,
  FoodHomeFilter,
  FoodHomeRestaurant,
} from './types';

const POPULAR_RESTAURANT_ORDER = [
  'cafe-javas',
  'chicken-tonight',
  'java-house',
  'pizza-inn',
] as const;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Ugandan: ['ugandan', 'local', 'matooke', 'rolex'],
  Kenyan: ['kenyan', 'nyama choma', 'pilau'],
  Tanzanian: ['tanzanian', 'pilau', 'grill'],
  Rolex: ['rolex', 'chapati'],
  'Nyama Choma': ['nyama choma', 'grill', 'bbq'],
  Pilau: ['pilau', 'rice'],
  Asian: ['asian', 'chinese', 'thai', 'japanese', 'korean'],
  'Chicken & Wings': ['chicken', 'wings', 'grill'],
  Burger: ['burger', 'fast food'],
  Dessert: ['dessert', 'cake', 'sweet', 'bakery'],
  Pizza: ['pizza', 'italian'],
  Chaat: ['chaat', 'street food'],
  Arabic: ['arabic', 'middle eastern'],
  Lebanese: ['lebanese'],
  Indian: ['indian', 'biryani'],
  Healthy: ['healthy', 'salad'],
  Biryani: ['biryani', 'indian'],
  Egyptian: ['egyptian'],
  Filipino: ['filipino'],
  Iranian: ['iranian', 'persian'],
  Coffee: ['coffee', 'cafe'],
  'Ice Cream': ['ice cream', 'dessert'],
  Italian: ['italian', 'pizza', 'pasta'],
  Burgers: ['burger', 'fast food'],
  'Fried Chicken': ['chicken', 'wings'],
  Grills: ['grill', 'bbq', 'barbecue'],
  'Best Selling': [],
  'New Additions': [],
  'Far-away Gems': [],
  Catering: ['catering'],
  'Gifting Options': ['gift', 'gifting'],
};

const DEFAULT_ADVANCED_FILTERS: FoodDiscoveryAdvancedFilters = {
  sort: 'Recommended',
  minRating: null,
  offersOnly: false,
  plusOnly: false,
  freeDeliveryOnly: false,
};

type Args = {
  city: string;
  country: string;
  restaurants: FoodHomeRestaurant[];
  favouriteIds: string[];
  actions: FoodHomeActions;
  initialSurface?: 'home' | 'search';
};

function searchableRestaurantText(restaurant: FoodHomeRestaurant) {
  return [
    restaurant.name,
    restaurant.cuisine,
    ...restaurant.categories,
  ]
    .join(' ')
    .toLowerCase();
}

function etaMinutes(restaurant: FoodHomeRestaurant) {
  const match = restaurant.eta.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 99;
}

function etaUpperBoundMinutes(restaurant: FoodHomeRestaurant) {
  const values = restaurant.eta.match(/\d+/g)?.map(value => Number.parseInt(value, 10)) ?? [];
  return values.length ? Math.max(...values) : Number.POSITIVE_INFINITY;
}

function filterByCategory(
  restaurants: FoodHomeRestaurant[],
  category: string,
) {
  if (category === 'Best Selling') {
    return [...restaurants].sort((a, b) => b.rating - a.rating);
  }

  if (category === 'New Additions') {
    return [...restaurants].reverse();
  }

  if (category === 'Far-away Gems') {
    return [...restaurants].sort((a, b) => {
      const aDistance = Number.parseFloat(a.distance) || 0;
      const bDistance = Number.parseFloat(b.distance) || 0;
      return bDistance - aDistance;
    });
  }

  const terms = CATEGORY_KEYWORDS[category] ?? [category.toLowerCase()];
  if (terms.length === 0) return restaurants;

  return restaurants.filter((restaurant) => {
    const searchable = searchableRestaurantText(restaurant);
    return terms.some((term) => searchable.includes(term));
  });
}

function applyAdvancedFilters(
  restaurants: FoodHomeRestaurant[],
  filters: FoodDiscoveryAdvancedFilters,
) {
  let rows = [...restaurants];

  if (filters.minRating !== null) {
    rows = rows.filter((restaurant) => restaurant.liveAvailability && restaurant.rating >= filters.minRating!);
  }

  if (filters.offersOnly) {
    rows = rows.filter((restaurant) => restaurant.liveAvailability && Boolean(restaurant.offer));
  }

  if (filters.plusOnly) {
    rows = rows.filter((restaurant) => restaurant.plus);
  }

  if (filters.freeDeliveryOnly) {
    rows = rows.filter((restaurant) =>
      restaurant.liveAvailability && restaurant.deliveryLabel.toLowerCase().includes('free delivery'),
    );
  }

  if (filters.sort === 'Top rated') {
    rows = rows.filter((restaurant) => restaurant.liveAvailability);
    rows.sort((a, b) => b.rating - a.rating);
  }

  if (filters.sort === 'Fastest') {
    rows = rows.filter((restaurant) => restaurant.liveAvailability);
    rows.sort((a, b) => etaMinutes(a) - etaMinutes(b));
  }

  return rows;
}

export function useKareebuFoodHomeController({
  city,
  country,
  restaurants,
  favouriteIds,
  actions,
  initialSurface = 'home',
}: Args): FoodHomeController {
  const [activeFilter, setActiveFilter] = useState<FoodHomeFilter | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [advancedFilters, setAdvancedFiltersState] =
    useState<FoodDiscoveryAdvancedFilters>(DEFAULT_ADVANCED_FILTERS);
  const [surface, setSurface] = useState<FoodDiscoverySurface>(
    initialSurface === 'search' ? { kind: 'search' } : { kind: 'home' },
  );
  const [filterReturnSurface, setFilterReturnSurface] =
    useState<FoodDiscoverySurface>(
      initialSurface === 'search' ? { kind: 'search' } : { kind: 'home' },
    );

  useEffect(() => {
    if (initialSurface === 'search') {
      setSurface({ kind: 'search' });
      return;
    }

    setSurface((current) =>
      current.kind === 'search' ? { kind: 'home' } : current,
    );
  }, [initialSurface]);

  const document = useMemo(
    () => buildFoodHomeDocument(city, country),
    [city, country],
  );

  const visibleRestaurants = useMemo(() => {
    let rows = restaurants;

    if (activeFilter === 'Top rated') {
      rows = rows.filter((restaurant) => restaurant.liveAvailability && restaurant.rating >= 4.7);
    }

    if (activeFilter === 'Kareebu+') {
      rows = rows.filter((restaurant) => restaurant.plus);
    }

    if (activeFilter === 'Offers') {
      rows = rows.filter((restaurant) => restaurant.liveAvailability && Boolean(restaurant.offer));
    }

    if (activeFilter === 'Fast delivery') {
      rows = rows.filter((restaurant) => restaurant.liveAvailability && etaUpperBoundMinutes(restaurant) <= 30);
    }

    if (activeFilter === 'Under 30 mins') {
      rows = rows.filter((restaurant) => restaurant.liveAvailability && etaUpperBoundMinutes(restaurant) < 30);
    }

    if (activeFilter === 'Free delivery') {
      rows = rows.filter((restaurant) => restaurant.liveAvailability && restaurant.deliveryLabel.toLowerCase().includes('free'));
    }

    if (activeFilter === 'Healthy') {
      rows = rows.filter((restaurant) =>
        `${restaurant.cuisine} ${restaurant.categories.join(' ')}`.toLowerCase().includes('healthy'),
      );
    }

    if (activeCategory) {
      rows = filterByCategory(rows, activeCategory);
    }

    return rows;
  }, [activeCategory, activeFilter, restaurants]);

  const rankedRestaurants = useMemo(
    () =>
      restaurants
        .filter((restaurant) => restaurant.liveAvailability)
        .slice()
        .sort((a, b) => b.rating - a.rating),
    [restaurants],
  );

  const nearbyRestaurants = useMemo(
    () =>
      restaurants
        .filter((restaurant) => restaurant.liveAvailability)
        .slice()
        .sort((a, b) => etaMinutes(a) - etaMinutes(b)),
    [restaurants],
  );

  const speedyRestaurants = useMemo(
    () => restaurants.filter(
      restaurant => restaurant.liveAvailability && etaUpperBoundMinutes(restaurant) <= 20,
    ),
    [restaurants],
  );

  const popularRestaurants = useMemo(() => {
    const order = new Map<string, number>(
      POPULAR_RESTAURANT_ORDER.map((id, index) => [id, index]),
    );

    return restaurants
      .filter(
        (restaurant) =>
          restaurant.isPopularRestaurant === true && Boolean(restaurant.logo),
      )
      .slice()
      .sort(
        (a, b) =>
          (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
          (order.get(b.id) ?? Number.MAX_SAFE_INTEGER),
      );
  }, [restaurants]);

  const bestSellerDishes = useMemo<FoodBestSellerDish[]>(
    () =>
      restaurants.flatMap((restaurant) => {
        if (!restaurant.logo) return [];

        return restaurant.menu
          .filter(
            (item) =>
              item.isBestSeller === true &&
              item.imageSource === 'restaurant-catalogue',
          )
          .map((item) => ({
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantLogo: restaurant.logo!,
            restaurantLogoBackgroundColor:
              restaurant.logoBackgroundColor ?? '#FFFFFF',
            menuItemId: item.id,
            dishName: item.name,
            dishImage: item.image,
            priceUGX: item.price,
            route: {
              restaurantId: restaurant.id,
              menuItemId: item.id,
            },
            availability: restaurant.liveAvailability
              ? ('available' as const)
              : ('confirm-when-opened' as const),
            item,
          }));
      }),
    [restaurants],
  );

  const hasAdvancedFilters = useMemo(
    () =>
      advancedFilters.sort !== 'Recommended' ||
      advancedFilters.minRating !== null ||
      advancedFilters.offersOnly ||
      advancedFilters.plusOnly ||
      advancedFilters.freeDeliveryOnly,
    [advancedFilters],
  );

  const searchRestaurants = useMemo(
    () => applyAdvancedFilters(restaurants, advancedFilters),
    [advancedFilters, restaurants],
  );

  const restaurantSearchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return searchRestaurants.filter((restaurant) =>
      searchableRestaurantText(restaurant).includes(term),
    );
  }, [query, searchRestaurants]);

  const dishSearchResults = useMemo<FoodDishSearchResult[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const allowedRestaurantIds = new Set(
      searchRestaurants.map((restaurant) => restaurant.id),
    );

    return restaurants.flatMap((restaurant) => {
      if (!allowedRestaurantIds.has(restaurant.id)) return [];

      return restaurant.menu
        .filter((item) =>
          [item.name, item.description, item.category, restaurant.name]
            .join(' ')
            .toLowerCase()
            .includes(term),
        )
        .map((item) => ({
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          item,
        }));
    });
  }, [query, restaurants, searchRestaurants]);

  const listingBaseRestaurants = useMemo(() => {
    if (surface.kind !== 'listing') return restaurants;

    if (surface.source === 'nearby') {
      return nearbyRestaurants;
    }

    if (surface.source === 'speedy') {
      return speedyRestaurants;
    }

    if (surface.source === 'best-sellers') {
      const restaurantIds = new Set(
        bestSellerDishes.map((dish) => dish.restaurantId),
      );
      return restaurants.filter((restaurant) =>
        restaurantIds.has(restaurant.id),
      );
    }

    if (surface.source === 'popular-restaurants') {
      return popularRestaurants;
    }

    if (surface.source === 'promo') {
      return restaurants.filter(
        (restaurant) => restaurant.liveAvailability && Boolean(restaurant.offer),
      );
    }

    if (surface.source === 'brand') {
      if (surface.restaurantId) {
        return restaurants.filter(
          (restaurant) => restaurant.id === surface.restaurantId,
        );
      }

      const brand = (surface.value ?? '').toLowerCase();
      return restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(brand),
      );
    }

    if (surface.source === 'category' && surface.value) {
      return filterByCategory(restaurants, surface.value);
    }

    return restaurants;
  }, [bestSellerDishes, nearbyRestaurants, popularRestaurants, restaurants, speedyRestaurants, surface]);

  const listingRestaurants = useMemo(
    () => applyAdvancedFilters(listingBaseRestaurants, advancedFilters),
    [advancedFilters, listingBaseRestaurants],
  );

  const selectFilter = (filter: FoodHomeFilter) => {
    setActiveFilter((current) => (current === filter ? null : filter));
  };

  const selectCategory = (category: string) => {
    setActiveCategory((current) =>
      current === category ? null : category,
    );
  };

  const openCategory = (category: string) => {
    if (category === 'Best Selling') {
      setSurface({
        kind: 'listing',
        title: 'Restaurant menu picks',
        source: 'best-sellers',
      });
      return;
    }

    actions.openCategoryLanding(category);
    return;
  };

  const openNearby = () => {
    setSurface({
      kind: 'listing',
      title: 'Nearby',
      source: 'nearby',
    });
  };

  const openSpeedyDelivery = () => {
    setSurface({
      kind: 'listing',
      title: 'Restaurants within 20 minutes',
      source: 'speedy',
    });
  };

  const openBestSellers = () => {
    setSurface({
      kind: 'listing',
      title: 'Restaurant menu picks',
      source: 'best-sellers',
    });
  };

  const openPopularRestaurants = () => {
    setSurface({
      kind: 'listing',
      title: 'Popular restaurants',
      source: 'popular-restaurants',
    });
  };

  const openPromo = (promoId?: string) => {
    setSurface({
      kind: 'listing',
      title: 'Offers for you',
      source: 'promo',
      value: promoId,
    });
  };

  const openBrand = (brand: string, restaurantId?: string | null) => {
    setSurface({
      kind: 'listing',
      title: brand.replace(/\n/g, ' '),
      source: 'brand',
      value: brand.replace(/\n/g, ' '),
      restaurantId,
    });
  };

  const openFilters = () => {
    if (surface.kind !== 'filters') {
      setFilterReturnSurface(surface);
    }
    setSurface({ kind: 'filters' });
  };

  const setAdvancedFilters = (
    patch: Partial<FoodDiscoveryAdvancedFilters>,
  ) => {
    setAdvancedFiltersState((current) => ({ ...current, ...patch }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFiltersState(DEFAULT_ADVANCED_FILTERS);
  };

  const back = () => {
    if (surface.kind === 'filters') {
      setSurface(filterReturnSurface);
      return;
    }

    if (surface.kind === 'home') {
      actions.exitFood();
      return;
    }

    if (surface.kind === 'search' && initialSurface === 'search') {
      actions.openFoodHome();
      return;
    }

    setSurface({ kind: 'home' });
  };

  return {
    document,
    restaurants,
    visibleRestaurants,
    rankedRestaurants,
    nearbyRestaurants,
    speedyRestaurants,
    bestSellerDishes,
    popularRestaurants,
    restaurantSearchResults,
    dishSearchResults,
    listingRestaurants,
    activeFilter,
    activeCategory,
    favouriteIds,
    query,
    setQuery,
    surface,
    advancedFilters,
    hasAdvancedFilters,
    setAdvancedFilters,
    clearAdvancedFilters,
    selectFilter,
    selectCategory,
    openCategory,
    openNearby,
    openSpeedyDelivery,
    openBestSellers,
    openPopularRestaurants,
    openPromo,
    openBrand,
    openFilters,
    back,
    actions,
  };
}
