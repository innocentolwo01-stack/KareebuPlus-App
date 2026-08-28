import type { ImageSourcePropType } from 'react-native';
import type { Screen } from '../types';
import type { SearchContext } from '../search/context';
import type { CmsCategoryVisualOverride } from '../visuals/categoryVisuals';

export type AppEnginePageType='home'|'discovery'|'service-landing'|'category-landing'|'listing'|'detail'|'checkout'|'activity'|'account';
export type AppEngineSectionType='hero-banner'|'category-hero'|'banner-carousel'|'service-tile-grid'|'service-tile-carousel'|'quick-action-carousel'|'merchant-carousel'|'product-carousel'|'category-grid'|'category-carousel'|'deal-grid'|'brand-carousel'|'trending-sellers'|'editorial-carousel'|'new-sellers'|'all-sellers'|'all-products'|'rich-cards'|'small-rich-cards'|'recommendation-rail'|'reorder-carousel'|'offers-carousel'|'activity-status-card'|'kareebu-plus-banner'|'rewards-banner'|'search-entry'|'filter-rail'|'information-banner'|'empty-state'|'error-state'|'sticky-cta'|'mobility-map'|'destination-search'|'places-autocomplete'|'route-preview'|'ride-product-sheet'|'payment-method-row'|'driver-matching'|'driver-tracking'|'seller-logo-carousel'|'seller-grid'|'product-grid-2col'|'restaurant-list'|'merchant-hero'|'bestsellers'|'custom';
export type AppEngineLayout='full-width'|'carousel'|'grid-2'|'grid-3'|'grid-4'|'stack'|'compact'|'floating';
export type AppEngineAudience='all'|'guest'|'signed-in'|'member'|'returning';
export type AppEnginePluginType='search'|'selection'|'basket'|'page'|'analytics'|'location';

export type AppEngineRoute={screen:Screen;params?:Record<string,string|number|boolean>};
export type AppEngineAction={id:string;label:string;route:AppEngineRoute;analyticsEvent?:string;requiresConfirmation?:boolean};
export type AppEngineAnalytics={impressionEvent?:string;interactionEvent?:string;conversionEvent?:string;metadata?:Record<string,string|number|boolean>};
export type AppEngineTargeting={countries?:string[];cities?:string[];audiences?:AppEngineAudience[];membershipRequired?:boolean;startAt?:string;endAt?:string};
export type AppEngineCreative={image?:ImageSourcePropType;imageUrl?:string;alt:string;aspectRatio?:number;recommendedPixels?:{width:number;height:number};backgroundTreatment?:'yellow'|'cream'|'charcoal'|'green'|'photo'|'rose'|'blue'};
export type AppEnginePromotion={id:string;slot:string;campaign:string;headline:string;body?:string;badge?:string;creative:AppEngineCreative;cta:AppEngineAction;priority:number;enabled:boolean;targeting?:AppEngineTargeting;analytics?:AppEngineAnalytics};
export type AppEngineItem={id:string;title:string;subtitle?:string;body?:string;meta?:string;badge?:string;visualKey?:string;visual?:CmsCategoryVisualOverride;image?:ImageSourcePropType;imageUrl?:string;route?:AppEngineRoute;cta?:AppEngineAction;analytics?:AppEngineAnalytics;data?:Record<string,unknown>};
export type AppEnginePlugin={id:string;type:AppEnginePluginType;enabled:boolean;configuration?:Record<string,unknown>};
export type AppEngineNavigation={showBottomNavigation:boolean;activeTab?:'home'|'explore'|'wallet'|'activity'|'account';backBehaviour:'none'|'history'|'dismiss';sticky?:boolean};
export type AppEngineSearchConfiguration=SearchContext&{enabled:boolean;suggestionsEnabled?:boolean;recentSearchesEnabled?:boolean};
export type AppEngineHeader={type:'none'|'brand'|'service'|'detail';title?:string;showLocation?:boolean;showSearch?:boolean;search?:AppEngineSearchConfiguration;showNotifications?:boolean;showAccount?:boolean};
export type AppEngineFooter={type:'none'|'brand'|'links';message?:string;actions?:AppEngineAction[]};

export type AppEngineSectionDefinition={id:string;type:AppEngineSectionType;title?:string;subtitle?:string;service?:string;slot?:string;layout:AppEngineLayout;items?:AppEngineItem[];cta?:AppEngineAction;route?:AppEngineRoute;promo?:AppEnginePromotion;targeting?:AppEngineTargeting;enabled:boolean;priority:number;analytics?:AppEngineAnalytics;plugins?:AppEnginePlugin[];rendererKey?:string;data?:Record<string,unknown>};
export type AppEnginePageDefinition={id:string;type:AppEnginePageType;title?:string;version:string;header:AppEngineHeader;navigation:AppEngineNavigation;sections:AppEngineSectionDefinition[];footer?:AppEngineFooter;targeting?:AppEngineTargeting;experiment?:{id:string;variant:string};analytics?:AppEngineAnalytics;metadata?:Record<string,string|number|boolean>;plugins?:AppEnginePlugin[]};

export type AppEngineContext={country:string;city:string;audience:AppEngineAudience;member:boolean;now?:Date;experiments?:Record<string,string>};
export type AppEnginePageState='loading'|'ready'|'empty'|'error';
