import React from 'react';

import type {
  FoodHomeController,
  FoodHomeWidget,
} from './types';
import {
  AllRestaurantsEnhanced,
  BankSavings,
  BestSellers,
  CategoryCarousel,
  FilterRail,
  IconicBanner,
  MostOrdered,
  Nearby,
  PopularBrands,
  PromoCarousel,
  RestaurantCarousel,
  StackedRestaurantRail,
} from './widgets/sections';

export function renderKareebuFoodWidget(
  widget: FoodHomeWidget,
  controller: FoodHomeController,
): React.ReactNode {
  switch (widget.type) {
    case 'filter-rail':
      return <FilterRail controller={controller} />;

    case 'category-carousel':
      return <CategoryCarousel controller={controller} />;

    case 'image-banner':
      return <IconicBanner />;

    case 'restaurant-carousel':
      return <RestaurantCarousel controller={controller} />;

    case 'promo-carousel':
      return <PromoCarousel controller={controller} />;

    case 'best-sellers':
      return <BestSellers controller={controller} />;

    case 'most-ordered':
      return <MostOrdered controller={controller} />;

    case 'popular-brands':
      return <PopularBrands controller={controller} />;

    case 'nearby':
      return <Nearby controller={controller} />;

    case 'bank-savings':
      return <BankSavings controller={controller} />;

    case 'stacked-restaurant-rail':
      return (
        <StackedRestaurantRail
          controller={controller}
          variant={widget.variant}
        />
      );

    case 'all-restaurants-enhanced':
      return <AllRestaurantsEnhanced controller={controller} />;

    default:
      return null;
  }
}
