import type { SearchContext, SearchScope } from './context';

export type SearchResultType = 'service' | 'category' | 'merchant' | 'restaurant' | 'product' | 'dish' | 'place' | 'payment' | 'activity';

export type SearchProviderDefinition = {
  scope: SearchScope;
  resultTypes: SearchResultType[];
  localEntityOnly: boolean;
  suggestions: boolean;
  recentSearches: boolean;
};

const PROVIDERS: Record<SearchScope, SearchProviderDefinition> = {
  global: { scope:'global', resultTypes:['service','category','merchant','restaurant','product','dish','place','payment','activity'], localEntityOnly:false, suggestions:true, recentSearches:true },
  food: { scope:'food', resultTypes:['restaurant','dish','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  food_category: { scope:'food_category', resultTypes:['restaurant','dish'], localEntityOnly:false, suggestions:true, recentSearches:true },
  shops: { scope:'shops', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  shop_vertical: { scope:'shop_vertical', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  seller: { scope:'seller', resultTypes:['product'], localEntityOnly:true, suggestions:true, recentSearches:false },
  restaurant: { scope:'restaurant', resultTypes:['dish'], localEntityOnly:true, suggestions:true, recentSearches:false },
  groceries: { scope:'groceries', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  pharmacy: { scope:'pharmacy', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  electronics: { scope:'electronics', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  pets: { scope:'pets', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  gifts: { scope:'gifts', resultTypes:['merchant','product','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  dineout: { scope:'dineout', resultTypes:['restaurant','place'], localEntityOnly:false, suggestions:true, recentSearches:true },
  services: { scope:'services', resultTypes:['service','category'], localEntityOnly:false, suggestions:true, recentSearches:true },
  rides: { scope:'rides', resultTypes:['place'], localEntityOnly:false, suggestions:true, recentSearches:true },
  boda: { scope:'boda', resultTypes:['place'], localEntityOnly:false, suggestions:true, recentSearches:true },
};

export function searchProviderFor(context: SearchContext): SearchProviderDefinition {
  const provider = PROVIDERS[context.scope];
  if (provider.localEntityOnly && context.scope === 'seller' && !context.sellerId) throw new Error('Seller search requires sellerId');
  if (provider.localEntityOnly && context.scope === 'restaurant' && !context.restaurantId) throw new Error('Restaurant search requires restaurantId');
  return provider;
}
