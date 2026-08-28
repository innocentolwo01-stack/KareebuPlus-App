import type { GlobalMarketplaceId } from './types';

export type GlobalMarketplaceCapabilityState='REFERENCE_ONLY'|'CATALOGUE_CONNECTED'|'PRICE_CONNECTED'|'PROCUREMENT_SUPPORTED'|'CHECKOUT_CONNECTED'|'FULLY_CONNECTED';
export type MarketplaceCapability={
  id:GlobalMarketplaceId;
  name:string;
  capabilityState:GlobalMarketplaceCapabilityState;
  catalogueSearch:'supported'|'provider_required'|'unsupported';
  itemDetails:'supported'|'provider_required'|'unsupported';
  livePrice:'supported'|'provider_required'|'unsupported';
  availability:'supported'|'provider_required'|'unsupported';
  checkout:'supported'|'approval_required'|'provider_required'|'unsupported';
  orderTracking:'supported'|'provider_required'|'unsupported';
  returns:'supported'|'provider_required'|'unsupported';
  partnerStatus:'partner'|'independent-source'|'unknown';
  notes:string[];
};

export const GLOBAL_MARKETPLACES:Record<GlobalMarketplaceId,MarketplaceCapability>={
  amazon:{id:'amazon',name:'Amazon',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'unsupported',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['Amazon App Submission API is not a retail catalogue API.','SP-API requires appropriate authorised seller/vendor access and is not treated as unrestricted consumer checkout.']},
  ebay:{id:'ebay',name:'eBay',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'approval_required',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['Browse/Catalog/Taxonomy capabilities belong behind a secure server adapter.','Production checkout must remain capability-gated until approved.']},
  shein:{id:'shein',name:'SHEIN',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'provider_required',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['No unsupported official API capability is assumed.']},
  temu:{id:'temu',name:'Temu',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'provider_required',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['No unsupported official API capability is assumed.']},
  aliexpress:{id:'aliexpress',name:'AliExpress',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'provider_required',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['Provider integration required before live catalogue/checkout claims.']},
  etsy:{id:'etsy',name:'Etsy',capabilityState:'REFERENCE_ONLY',catalogueSearch:'provider_required',itemDetails:'provider_required',livePrice:'provider_required',availability:'provider_required',checkout:'provider_required',orderTracking:'provider_required',returns:'provider_required',partnerStatus:'unknown',notes:['Provider integration required before live catalogue/checkout claims.']},
};

export interface GlobalMarketplaceAdapter {
  id:GlobalMarketplaceId;
  capabilities:MarketplaceCapability;
  search(query:string):Promise<unknown[]>;
  getItem(sourceProductId:string):Promise<unknown|null>;
  refreshPrice(sourceProductId:string):Promise<{price:number;currency:string;available:boolean}|null>;
}

export const referenceMarketplaceAdapter=(id:GlobalMarketplaceId):GlobalMarketplaceAdapter=>({
  id,
  capabilities:GLOBAL_MARKETPLACES[id],
  async search(){return [];},
  async getItem(){return null;},
  async refreshPrice(){return null;},
});
