import type { Screen } from '../types';

export type CommerceEntrySource = 'service-home' | 'category' | 'seller' | 'home-banner' | 'home-recommendation' | 'search' | 'favourites' | 'activity' | 'promotion' | 'deep-link';

export type CommerceRouteContext = {
  domainId: 'groceries' | 'pharmacy' | 'electronics' | 'shops' | 'pets' | 'gifts' | 'beauty' | 'fashion' | 'butchery' | 'home';
  verticalId?: string;
  categoryId?: string;
  categoryLabel?: string;
  subcategoryId?: string;
  taxonomyNodeId?: string;
  taxonomyPath?: string[];
  sellerId?: string;
  productId?: string;
  entrySource: CommerceEntrySource;
  campaignId?: string;
  entryScreen?: Screen;
};

export const initialCommerceContext: CommerceRouteContext = { domainId:'shops', entrySource:'service-home' };

export function mergeCommerceContext(current:CommerceRouteContext,patch:Partial<CommerceRouteContext>):CommerceRouteContext {
  const domainChanged=patch.domainId!==undefined&&patch.domainId!==current.domainId;
  return domainChanged?{domainId:patch.domainId!,entrySource:patch.entrySource??'service-home',...patch}:{...current,...patch};
}

export function commerceBreadcrumb(context:CommerceRouteContext,sellerName?:string) {
  const hierarchy=context.taxonomyPath?.length?context.taxonomyPath:[context.categoryLabel].filter((value):value is string=>Boolean(value));
  return [context.domainId.charAt(0).toUpperCase()+context.domainId.slice(1),...hierarchy,sellerName].filter(Boolean).join(' › ');
}
