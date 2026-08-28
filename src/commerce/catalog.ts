import type { DemoShop } from '../demoData';
import type { ProductMetadata } from '../catalog/types';
import {
  KAREEBU_CATALOG_CATEGORIES,
  KAREEBU_CATALOG_SUBCATEGORIES,
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

function storeAffinity(store:DemoShop){
  const value=`${store.category} ${store.name}`.toLowerCase();
  if(value.includes('pharm')||value.includes('chemist')||value.includes('health')) return {domains:['shops'] as const,verticals:['shops:pharmacy']};
  if(value.includes('nutrition')) return {domains:['shops'] as const,verticals:['shops:sports','shops:pharmacy']};
  if(value.includes('eye care')||value.includes('vision')) return {domains:['shops'] as const,verticals:['shops:pharmacy']};
  if(value.includes('elect')||value.includes('techpoint')) return {domains:['electronics'] as const,verticals:[] as string[]};
  if(value.includes('marketplace')||value.includes('jumia')) return {domains:['electronics','shops'] as const,verticals:['shops:electronics','shops:fashion','shops:home-living','shops:beauty']};
  if(value.includes('beauty')) return {domains:['shops'] as const,verticals:['shops:beauty']};
  if(value.includes('pet')) return {domains:['shops'] as const,verticals:['shops:pet-stores']};
  if(value.includes('home')) return {domains:['shops'] as const,verticals:['shops:home-living']};
  if(value.includes('grocery')||value.includes('supermarket')||value.includes('convenience')||value.includes('carrefour')||value.includes('naivas')||value.includes('quickmart')||value.includes('shoppers')) return {domains:['groceries'] as const,verticals:[] as string[]};
  return {domains:['shops'] as const,verticals:[] as string[]};
}

function productsMatchingStore(store:DemoShop){
  const affinity=storeAffinity(store);
  const allowedDomains=new Set<string>(affinity.domains);
  const allowedVerticals=new Set<string>(affinity.verticals);
  const candidates=KAREEBU_UNIFIED_ITEMS.filter(item=>item.type==='product'&&allowedDomains.has(item.domainId));
  const verticalMatches=allowedVerticals.size?candidates.filter(item=>allowedVerticals.has(item.verticalId)):candidates;
  return verticalMatches.length?verticalMatches:candidates;
}

function adapt(item:UnifiedCatalogItem):CommerceProduct{
  const pharmacyContext=`${item.verticalId} ${item.categoryId} ${item.subcategoryId}`.toLowerCase();
  const prescriptionRequired=/prescription|pharmacy:medicines/.test(pharmacyContext);
  return {
    ...item,
    basePrice:item.basePriceUGX,
    prescriptionRequired,
    detail:item.providerOrBrand,
    description:`Explore ${item.name}, available options and seller details. Review the selected variant, delivery information and final availability before adding it to your basket.`,
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
      stock:undefined,
      maximumCartQuantity:item.domainId==='electronics'?5:12,
      averageRating:undefined,
      ratingCount:undefined,
      verifiedSeller:false,
      freeDelivery:false,
      taxRatePercent:18,
      returnPolicy:'Returns remain subject to merchant, safety and product-condition rules.',
    },
  };
}

function merchantAssortmentTerms(store:DemoShop){
  const byId:Record<string,string[]>={
    carrefour:['pantry','household','personal','fresh','baby'],
    capital:['fresh','household','pantry','dairy'],
    quality:['fresh','dairy','bakery','breakfast'],
    naivas:['fresh','pantry','drinks','household'],
    quickmart:['drinks','snacks','breakfast','frozen'],
    'shoppers-tz':['pantry','fresh','household','drinks'],
    'village-tz':['fresh','bakery','dairy','breakfast'],
    goodlife:['vitamin','wellness','personal','baby','first-aid'],
    beautybasket:['skin','beauty','hair','personal'],
    techpoint:['mobile','audio','power','gaming','computing'],
    jumia:['electronics','fashion','home','beauty'],
    petcare:['pet','dog','cat','food','care'],
    homehub:['home','kitchen','storage','cleaning'],
  };
  return byId[store.id]??[];
}

function assortmentScore(store:DemoShop,item:UnifiedCatalogItem){
  const text=`${item.verticalId} ${item.categoryId} ${item.subcategoryId} ${item.name}`.toLowerCase();
  const terms=merchantAssortmentTerms(store);
  const preference=terms.reduce((score,term,index)=>text.includes(term)?score+(terms.length-index)*500:score,0);
  return preference+(stableHash(`${store.id}:${item.id}`)%499);
}

export function commerceProductsFor(store:DemoShop):CommerceProduct[]{
  const candidates=productsMatchingStore(store);
  // Each development merchant receives a deterministic assortment bias so two
  // supermarkets or specialist sellers do not render as the same store with a
  // different logo. Production will replace this with the merchant catalogue.
  return [...candidates].sort((a,b)=>assortmentScore(store,b)-assortmentScore(store,a)).slice(0,64).map(adapt);
}

export function commerceProductsForTaxonomy(store:DemoShop,context?:{domainId?:string;categoryId?:string;categoryLabel?:string}):CommerceProduct[]{
  if(!context?.categoryId&&!context?.categoryLabel)return commerceProductsFor(store);
  const domain=context.domainId==='pharmacy'?'shops':context.domainId;
  const label=context.categoryLabel?.trim().toLowerCase();
  const stableId=context.categoryId?.replace('.',':');
  const categoryIds=new Set<string>(KAREEBU_CATALOG_CATEGORIES.filter(node=>node.domainId===domain&&(node.id===stableId||node.title.toLowerCase()===label||node.title.toLowerCase().includes(label??'\u0000'))).map(node=>node.id));
  const subcategoryIds=new Set<string>(KAREEBU_CATALOG_SUBCATEGORIES.filter(node=>node.domainId===domain&&(node.id===stableId||node.title.toLowerCase()===label||node.title.toLowerCase().includes(label??'\u0000')||categoryIds.has(node.categoryId))).map(node=>node.id));
  const products=KAREEBU_UNIFIED_ITEMS.filter(item=>item.type==='product'&&item.domainId===domain&&(categoryIds.has(item.categoryId)||subcategoryIds.has(item.subcategoryId))).map(adapt);
  return products.length?products.slice(0,64):commerceProductsFor(store).filter(item=>!label||`${item.name} ${item.category} ${item.subcategory}`.toLowerCase().includes(label));
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
