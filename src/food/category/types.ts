import type { ImageSourcePropType } from 'react-native';
import type { FoodHomeRestaurant } from '../discovery/types';
import type { SearchContext } from '../../search/context';
import type { CategoryFilterConfig, CategoryLandingKind } from '../../categoryLanding/types';

export type FoodCategorySectionType = 'featured_seller'|'brand_carousel'|'deal_grid'|'new_sellers'|'trending_sellers'|'editorial_seller_carousel'|'promotion'|'all_restaurants';
export type FoodCategoryBrand = {id:string;name:string;restaurantId?:string;image?:ImageSourcePropType;market:string;referenceFixture:true;partnerStatus:'unknown';liveAvailability:false};
export type FoodCategoryHero = {slot:string;title:string;subtitle:string;creative:ImageSourcePropType;category:string;market:string;enabled:boolean};
export type FoodCategorySection = {id:string;type:FoodCategorySectionType;title?:string;subtitle?:string;restaurantIds?:string[];brands?:FoodCategoryBrand[];enabled:boolean;priority:number};
export type FoodCategoryLandingConfig = {id:string;category:string;market:string;city:string;kind:CategoryLandingKind;search:SearchContext;hero:FoodCategoryHero;filters:CategoryFilterConfig[];editorialTitle:string;sections:FoodCategorySection[]};
export type FoodCategoryLandingProps = {
  category:string;country:string;city:string;restaurants:FoodHomeRestaurant[];favouriteIds:string[];
  onBack:()=>void;onOpenRestaurant:(id:string)=>void;onToggleFavourite:(id:string)=>void;
};
