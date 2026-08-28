import type { AppEnginePageDefinition, AppEngineSectionDefinition } from '../appEngine/types';

const section = (id:string,type:AppEngineSectionDefinition['type'],priority:number,title:string,layout:AppEngineSectionDefinition['layout']='carousel'):AppEngineSectionDefinition => ({id,type,priority,title,layout,enabled:true,service:'global',data:{cmsControlled:true}});

export function globalHomePage(country:string,city:string):AppEnginePageDefinition {
  return {id:'kareebu-global-home',type:'service-landing',title:'Kareebu Global',version:'1.0.0',header:{type:'service',title:'Kareebu Global',showLocation:true,showSearch:true,search:{enabled:true,scope:'global',placeholder:'Search global stores and products',market:country,city,suggestionsEnabled:true,recentSearchesEnabled:true}},navigation:{showBottomNavigation:true,activeTab:'explore',backBehaviour:'history'},sections:[
    section('GLOBAL_HERO','hero-banner',1000,'Shop the world','full-width'),
    section('GLOBAL_MARKETPLACES','seller-logo-carousel',950,'Marketplaces'),
    section('GLOBAL_TRENDING','product-carousel',900,'Explore global picks'),
    section('GLOBAL_CATEGORIES','category-grid',850,'Shop by category','grid-3'),
    section('GLOBAL_PROMO','banner-carousel',800,'Global discovery','full-width'),
    section('GLOBAL_POPULAR','product-grid-2col',750,'Browse products','grid-2'),
    section('GLOBAL_MARKET_POPULAR','recommendation-rail',700,`Explore in ${city}`),
    section('GLOBAL_BRANDS','brand-carousel',650,'Brands'),
    section('GLOBAL_DEALS','deal-grid',600,'Campaign offers','grid-2'),
    section('GLOBAL_UNDER_PRICE','product-carousel',550,'Under your budget'),
    section('GLOBAL_RECENT','reorder-carousel',500,'Recently viewed'),
  ],targeting:{countries:[country],cities:[city]},metadata:{quoteProviderBoundary:true,internationalFulfilment:true,cmsControlsMerchandisingOnly:true}};
}

export function globalCollectionPage(country:string,city:string,scope:'marketplace'|'category'):AppEnginePageDefinition {
  return {id:`kareebu-global-${scope}`,type:'category-landing',title:'Kareebu Global',version:'1.0.0',header:{type:'service',title:'Kareebu Global',showSearch:true,search:{enabled:true,scope:'global',placeholder:'Search within this collection',market:country,city}},navigation:{showBottomNavigation:true,activeTab:'explore',backBehaviour:'history'},sections:[section('GLOBAL_CATEGORY_HERO','category-hero',1000,'Global collection','full-width'),section('GLOBAL_MARKETPLACE_FILTERS','filter-rail',900,'Sources'),section('GLOBAL_CATEGORY_PROMO','banner-carousel',800,'Featured','full-width'),section('GLOBAL_CATEGORY_PRODUCTS','product-grid-2col',700,'All products','grid-2')],targeting:{countries:[country],cities:[city]}};
}
