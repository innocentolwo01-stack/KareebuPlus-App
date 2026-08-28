import React from 'react';
import { View } from 'react-native';
import { PromotionHero } from '../../promotions/PromotionCards';
import type { PromotionCampaign } from '../../promotions/types';

import type {
  FoodHomeController,
  FoodHomeWidget,
} from './types';
import {
  AllRestaurantsEnhanced,
  BankSavings,
  CategoryCarousel,
  FilterRail,
  Nearby,
  PopularRestaurants,
  PromoCarousel,
  RestaurantCarousel,
  StackedRestaurantRail,
} from './widgets/sections';

export function renderKareebuFoodWidget(
  widget: FoodHomeWidget,
  controller: FoodHomeController,
  campaigns: PromotionCampaign[] = [],
  onOpenPromotion?: (campaign: PromotionCampaign) => void,
): React.ReactNode {
  switch (widget.type) {
    case 'campaign': {
      const campaign = campaigns.find((item) => item.cmsSlot === widget.slot);
      return campaign && onOpenPromotion ? <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}><PromotionHero campaign={campaign} onPress={onOpenPromotion}/></View> : null;
    }
    case 'filter-rail':
      return <FilterRail controller={controller} />;

    case 'category-carousel':
      return <CategoryCarousel controller={controller} />;

    case 'restaurant-carousel':
      return <RestaurantCarousel controller={controller} />;

    case 'promo-carousel':
      return <PromoCarousel controller={controller} />;

    case 'popular-restaurants':
      return <PopularRestaurants controller={controller} />;

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
