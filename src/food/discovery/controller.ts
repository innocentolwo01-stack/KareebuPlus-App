import { useEffect, useMemo, useState } from 'react';

import { buildFoodHomeDocument } from './document';
import type {
  FoodDiscoveryAdvancedFilters,
  FoodDiscoverySurface,
  FoodDishSearchResult,
  FoodHomeActions,
  FoodHomeController,
  FoodHomeFilter,
  FoodHomeRestaurant,
} from './types';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
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
    rows = rows.filter((restaurant) => restaurant.rating >= filters.minRating!);
  }

  if (filters.offersOnly) {
    rows = rows.filter((restaurant) => Boolean(restaurant.offer));
  }

  if (filters.plusOnly) {
    rows = rows.filter((restaurant) => restaurant.plus);
  }

  if (filters.freeDeliveryOnly) {
    rows = rows.filter((restaurant) =>
      restaurant.deliveryLabel.toLowerCase().includes('free delivery'),
    );
  }

  if (filters.sort === 'Top rated') {
    rows.sort((a, b) => b.rating - a.rating);
  }

  if (filters.sort === 'Fastest') {
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

    if (activeFilter === '4.7+ Rated') {
      rows = rows.filter((restaurant) => restaurant.rating >= 4.7);
    }

    if (activeFilter === 'Top Choices') {
      rows = [...rows].sort((a, b) => b.rating - a.rating);
    }

    if (activeFilter === '30% Off') {
      rows = rows.filter((restaurant) =>
        (restaurant.offer ?? '').toLowerCase().includes('30'),
      );
    }

    // The current restaurant model does not expose calorie data, so the chip
    // remains selectable without fabricating nutritional values.

    if (activeCategory) {
      rows = filterByCategory(rows, activeCategory);
    }

    return rows;
  }, [activeCategory, activeFilter, restaurants]);

  const rankedRestaurants = useMemo(
    () => [...restaurants].sort((a, b) => b.rating - a.rating),
    [restaurants],
  );

  const nearbyRestaurants = useMemo(
    () => [...restaurants].sort((a, b) => etaMinutes(a) - etaMinutes(b)),
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

    if (surface.source === 'best-sellers') {
      return rankedRestaurants;
    }

    if (surface.source === 'promo') {
      return restaurants.filter((restaurant) => Boolean(restaurant.offer));
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
  }, [nearbyRestaurants, rankedRestaurants, restaurants, surface]);

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
    if (category === 'Offers' || category === 'Exclusive Offers') {
      actions.openOffers();
      return;
    }

    if (category === 'Best Selling') {
      setSurface({
        kind: 'listing',
        title: 'Best sellers',
        source: 'best-sellers',
      });
      return;
    }

    setActiveCategory(category);
    setSurface({
      kind: 'listing',
      title: category,
      source: 'category',
      value: category,
    });
  };

  const openNearby = () => {
    setSurface({
      kind: 'listing',
      title: 'Nearby',
      source: 'nearby',
    });
  };

  const openBestSellers = () => {
    setSurface({
      kind: 'listing',
      title: 'Best sellers',
      source: 'best-sellers',
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
      actions.openFoodHome();
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
    openBestSellers,
    openPromo,
    openBrand,
    openFilters,
    back,
    actions,
  };
}
