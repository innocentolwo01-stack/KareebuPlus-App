import {
  KAREEBU_CATALOG_CATEGORIES,
  KAREEBU_CATALOG_SUBCATEGORIES,
  KAREEBU_CATALOG_VERTICALS,
  KAREEBU_UNIFIED_ITEMS,
  type KareebuDomainId,
} from '../catalog/master/kareebuUnifiedCatalog';
import { KAREEBU_DISCOVERY_DOMAIN_CONFIG } from './domainConfig';
import type {
  KareebuDiscoveryDocument,
  KareebuDiscoveryFilterId,
  KareebuDiscoveryItem,
  KareebuDiscoverySort,
} from './types';

function stableHash(value:string){
  let h=2166136261;
  for(let index=0;index<value.length;index+=1){
    h^=value.charCodeAt(index);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}

function decorateItem(
  item:(typeof KAREEBU_UNIFIED_ITEMS)[number],
  photos:string[],
):KareebuDiscoveryItem{
  const seed=stableHash(item.id);
  return {
    ...item,
    etaMinutes:12+(seed%42),
    distanceKm:Number((0.8+((seed%89)/10)).toFixed(1)),
    freeDelivery:seed%3===0,
    offerLabel:seed%4===0?'20% off':seed%7===0?'Kareebu+ offer':null,
    verified:true,
    photo:photos[seed%photos.length]!,
  };
}

function filterItem(item:KareebuDiscoveryItem,filter:KareebuDiscoveryFilterId){
  switch(filter){
    case 'offers': return item.offerLabel!==null;
    case 'rating': return item.rating>=4.5;
    case 'fast': return item.etaMinutes<=30;
    case 'free-delivery': return item.freeDelivery;
    case 'price': return item.basePriceUGX<=75000;
    case 'nearby': return item.distanceKm<=5;
    case 'available-now': return stableHash(item.id+'available')%5!==0;
    case 'today': return item.etaMinutes<=45;
    case 'verified': return item.verified;
    case 'emergency': return item.etaMinutes<=25;
    case 'member': return item.freeDelivery||item.offerLabel==='Kareebu+ offer';
    default: return true;
  }
}

function sortItems(items:KareebuDiscoveryItem[],sort:KareebuDiscoverySort){
  const rows=[...items];
  switch(sort){
    case 'top-rated': return rows.sort((a,b)=>b.rating-a.rating);
    case 'fastest': return rows.sort((a,b)=>a.etaMinutes-b.etaMinutes);
    case 'price-low': return rows.sort((a,b)=>a.basePriceUGX-b.basePriceUGX);
    case 'price-high': return rows.sort((a,b)=>b.basePriceUGX-a.basePriceUGX);
    default:
      return rows.sort((a,b)=>{
        const aScore=(a.rating*100)-a.etaMinutes+(a.offerLabel?20:0)+(a.freeDelivery?12:0);
        const bScore=(b.rating*100)-b.etaMinutes+(b.offerLabel?20:0)+(b.freeDelivery?12:0);
        return bScore-aScore;
      });
  }
}

export function buildKareebuDiscoveryDocument(input:{
  domainId:KareebuDomainId;
  city:string;
  country:string;
  query:string;
  verticalId:string|null;
  categoryId:string|null;
  subcategoryId:string|null;
  filters:KareebuDiscoveryFilterId[];
  sort:KareebuDiscoverySort;
}):KareebuDiscoveryDocument{
  const config=KAREEBU_DISCOVERY_DOMAIN_CONFIG[input.domainId];
  const verticals=KAREEBU_CATALOG_VERTICALS.filter((node)=>node.domainId===input.domainId);
  const selectedVertical=
    verticals.find((node)=>node.id===input.verticalId) ??
    verticals[0] ??
    null;

  const categories=selectedVertical
    ? KAREEBU_CATALOG_CATEGORIES.filter((node)=>node.verticalId===selectedVertical.id)
    : [];

  const selectedCategory=
    categories.find((node)=>node.id===input.categoryId) ??
    categories[0] ??
    null;

  const subcategories=selectedCategory
    ? KAREEBU_CATALOG_SUBCATEGORIES.filter((node)=>node.categoryId===selectedCategory.id)
    : [];

  const selectedSubcategory=
    subcategories.find((node)=>node.id===input.subcategoryId) ??
    null;

  let baseItems=KAREEBU_UNIFIED_ITEMS.filter((item)=>
    item.domainId===input.domainId &&
    (!selectedVertical||item.verticalId===selectedVertical.id) &&
    (!selectedCategory||item.categoryId===selectedCategory.id) &&
    (!selectedSubcategory||item.subcategoryId===selectedSubcategory.id)
  );

  const terms=input.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(terms.length){
    baseItems=baseItems.filter((item)=>
      terms.every((term)=>
        item.name.toLowerCase().includes(term) ||
        item.providerOrBrand.toLowerCase().includes(term) ||
        item.searchTerms.some((value)=>value.includes(term))
      )
    );
  }

  let decorated=baseItems.map((item)=>decorateItem(item,config.photos));
  for(const filter of input.filters){
    decorated=decorated.filter((item)=>filterItem(item,filter));
  }
  decorated=sortItems(decorated,input.sort);

  const recommendationPool=KAREEBU_UNIFIED_ITEMS.filter((item)=>
    item.domainId===input.domainId &&
    (!selectedVertical||item.verticalId===selectedVertical.id) &&
    (!selectedCategory||item.categoryId===selectedCategory.id)
  );

  const recommended=sortItems(
    recommendationPool
      .slice(0,180)
      .map((item)=>decorateItem(item,config.photos)),
    'recommended',
  ).slice(0,10);

  return {
    page:'kareebu-discovery',
    version:1,
    domainId:input.domainId,
    city:input.city,
    country:input.country,
    header:{
      title:config.title,
      locationEyebrow:config.locationEyebrow,
      searchPlaceholder:config.searchPlaceholder,
      semantic:config.semantic,
    },
    widgets:[
      {id:'hero',type:'hero-carousel',items:config.promos},
      {id:'filters',type:'filter-rail',items:config.filters},
      {id:'verticals',type:'vertical-grid',title:config.verticalHeading,items:verticals,activeId:selectedVertical?.id??null},
      {id:'categories',type:'category-rail',title:selectedVertical?.title??config.categoryHeading,items:categories,activeId:selectedCategory?.id??null},
      {id:'subcategories',type:'subcategory-grid',title:selectedCategory?.title??config.subcategoryHeading,items:subcategories,activeId:selectedSubcategory?.id??null},
      {id:'recommended',type:'item-rail',title:config.recommendedHeading,subtitle:`Popular around ${input.city}`,items:recommended},
      {id:'all-items',type:'item-list',title:config.allHeading,subtitle:selectedSubcategory?.title??selectedCategory?.title??selectedVertical?.title??config.title,items:decorated.slice(0,80)},
      {id:'membership',type:'membership-strip'},
    ],
  };
}
