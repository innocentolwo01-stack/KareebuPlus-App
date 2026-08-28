import type { ImageSourcePropType } from 'react-native';
import type { SearchContext } from '../search/context';

export type CategoryService='food'|'groceries'|'pharmacy'|'electronics'|'pets'|'gifts'|'beauty'|'fashion'|'butchery'|'shops';
export type CategoryLandingKind='standard'|'offers'|'new-additions';
export type CategoryLandingSectionType='featured_seller'|'featured_product'|'deal_grid'|'seller_carousel'|'brand_carousel'|'product_carousel'|'trending_sellers'|'editorial_carousel'|'new_sellers'|'nearby'|'best_sellers'|'most_ordered'|'promo'|'all_sellers'|'all_products';
export type CategoryFilterConfig={id:string;label:string;kind:'rating'|'offers'|'delivery'|'membership'|'sort'|'category';value?:string};
export type CategoryHeroConfig={slot:string;title:string;subtitle:string;visualKey:string;backgroundTreatment?:'yellow'|'cream'|'photo';campaign?:string;enabled:boolean};
export type CategoryLandingSection={id:string;type:CategoryLandingSectionType;title:string;subtitle?:string;enabled:boolean;priority:number;slot?:string;itemIds?:string[]};
export type CategoryLandingConfig={id:string;pageType:'categoryLanding';service:CategoryService;category:string;kind:CategoryLandingKind;title:string;subtitle:string;market:string;city:string;hero:CategoryHeroConfig;search:SearchContext;filters:CategoryFilterConfig[];sections:CategoryLandingSection[];version:string};
export type CategorySeller={id:string;name:string;subtitle?:string;logo?:ImageSourcePropType;rating?:number;eta?:string;referenceFixture:boolean;liveAvailability:boolean};
export type CategoryProduct={id:string;title:string;brand?:string;pack?:string;image?:ImageSourcePropType;visualKey?:string;referencePrice?:number;currency?:string;isLivePrice:boolean;isLiveStock:boolean};
export type CategoryDeal={id:string;title:string;body:string;visualKey:string;eligibilityKnown:boolean};
