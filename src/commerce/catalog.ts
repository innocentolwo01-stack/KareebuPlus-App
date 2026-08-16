import type { DemoShop } from '../demoData';
import type { ProductMetadata } from '../catalog/types';
import {
  KAREEBU_UNIFIED_ITEMS,
  type UnifiedCatalogItem,
} from '../catalog/master/kareebuUnifiedCatalog';

export type CommerceProduct = Omit<UnifiedCatalogItem,'metadata'> & {
  basePrice: number;
  prescriptionRequired: boolean;
  detail: string;
  description: string;
  category: string;
  subcategory: string;
  icon: string;
  badge?: string;
  brand?: string;
  variants?: Array<{id:string;label:string;priceDelta:number}>;
  metadata: ProductMetadata;
};

function stableHash(value:string){
  let h=2166136261;
  for(let i=0;i<value.length;i+=1){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}

function domainsFor(store:DemoShop){
  const value=store.category.toLowerCase();
  if(value.includes('pharm')||value.includes('health')||value.includes('nutrition')) return ['shops'] as const;
  if(value.includes('elect')) return ['electronics'] as const;
  if(value.includes('grocery')||value.includes('supermarket')||value.includes('convenience')) return ['groceries'] as const;
  return ['shops','electronics'] as const;
}

function adapt(item:UnifiedCatalogItem):CommerceProduct{
  const pharmacyContext=`${item.verticalId} ${item.categoryId} ${item.subcategoryId}`.toLowerCase();
  const prescriptionRequired=/prescription|pharmacy:medicines/.test(pharmacyContext);
  return {
    ...item,
    basePrice:item.basePriceUGX,
    prescriptionRequired,
    detail:item.providerOrBrand,
    description:`${item.name} in Kareebu ${item.domainId}. Final brand, specifications, inventory and media will come from the merchant/AppEngine feed.`,
    category:item.verticalId.split(':').slice(-1)[0]?.replaceAll('-',' ') ?? item.domainId,
    subcategory:item.subcategoryId.split(':').slice(-1)[0]?.replaceAll('-',' ') ?? '',
    icon:'bag-outline',
    badge:'Kareebu+',
    brand:item.providerOrBrand,
    variants:[
      {id:'standard',label:'Standard',priceDelta:0},
      {id:'plus',label:'Premium option',priceDelta:Math.max(1000,Math.round(item.basePriceUGX*.2/1000)*1000)},
    ],
    metadata:{
      brand:{id:`brand-${item.providerOrBrand.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,name:item.providerOrBrand},
      manufacturer:`${item.providerOrBrand} Supply`,
      sku:`KRB-${stableHash(item.id).toString(16).toUpperCase()}`,
      unitType:'item',
      unitValue:'1 item',
      countryOfOrigin:'Varies by merchant',
      stock:8+(stableHash(item.id)%90),
      maximumCartQuantity:item.domainId==='electronics'?5:12,
      averageRating:item.rating,
      ratingCount:item.reviewCount,
      verifiedSeller:true,
      freeDelivery:item.basePriceUGX>=60000,
      taxRatePercent:18,
      returnPolicy:'Returns remain subject to merchant, safety and product-condition rules.',
    },
  };
}

export function commerceProductsFor(store:DemoShop):CommerceProduct[]{
  const allowed=new Set<string>(domainsFor(store));
  const candidates=KAREEBU_UNIFIED_ITEMS.filter((item)=>item.type==='product'&&allowed.has(item.domainId));
  const start=stableHash(store.id)%Math.max(1,candidates.length);
  return [...candidates.slice(start),...candidates.slice(0,start)].slice(0,64).map(adapt);
}

export function commerceProductFor(store:DemoShop,productId:string|null){
  const products=commerceProductsFor(store);
  if(productId){
    const inMerchant=products.find((item)=>item.id===productId);
    if(inMerchant) return inMerchant;
    const globalItem=KAREEBU_UNIFIED_ITEMS.find((item)=>item.id===productId&&item.type==='product');
    if(globalItem) return adapt(globalItem);
  }
  return products[0]!;
}

export function commerceLongDescriptionFor(product:CommerceProduct){return product.description;}
export function commerceProductMetadataFor(product:CommerceProduct):ProductMetadata{return product.metadata;}
