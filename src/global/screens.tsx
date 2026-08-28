import React, { memo, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { CategoryArtwork, Header, PrimaryButton, ScreenShell } from '../components';
import { COLORS, FONT, SHADOW } from '../theme';
import { formatMoney } from '../locale';
import { GLOBAL_CATALOG_STATS, GLOBAL_DEPARTMENTS, GLOBAL_EDITORIAL_GROUPS, GLOBAL_PRODUCTS, GLOBAL_PROMO_PANELS, globalProducts } from './catalog';
import { estimateGlobalQuote } from './quoteEngine';
import type { GlobalCartLine, GlobalMarketplaceId, GlobalOrder, GlobalProduct } from './types';
import { GLOBAL_MARKETPLACES } from './marketplaces';
import { preparePaymentAttempt } from '../payments/orchestrator';
import type { PaymentRail } from '../payments/types';
import { assessRisk } from '../trust/riskEngine';
import { featureEnabled } from '../policy/featureFlags';
import { PromotionSurface } from '../promotions/PromotionSurface';
import { globalProductCategoryForTaxonomy, normaliseTaxonomyId, taxonomyChildren, taxonomyNode, taxonomyPath, taxonomyProductTerms } from '../taxonomy/registry';

export type GlobalScreenData = { country:string; city:string; query:string; marketplace:string|null; category:string|null; selectedProductId:string|null; cart:GlobalCartLine[]; order:GlobalOrder|null; deliveryAddress:string; paymentMethod:string };
export type GlobalScreenActions = { go:(screen:any)=>void; back:()=>void; setQuery:(value:string)=>void; setMarketplace:(value:string|null)=>void; setCategory:(value:string|null)=>void; selectProduct:(id:string|null)=>void; addLine:(line:GlobalCartLine)=>void; setLineQuantity:(id:string,quantity:number)=>void; placeOrder:(order:GlobalOrder)=>void };

const MARKETPLACES: GlobalMarketplaceId[] = ['amazon','ebay','shein','temu','aliexpress','etsy'];
const CATEGORIES = ['fashion','electronics','beauty','home','kids','sports','automotive','books','pets','accessories'] as const;
const MARKETPLACE_LOGOS:Partial<Record<GlobalMarketplaceId, any>> = {
  amazon: require('../../assets/kareebu-plus/global/marketplaces/amazon.png'),
  ebay: require('../../assets/kareebu-plus/global/marketplaces/ebay.png'),
  shein: require('../../assets/kareebu-plus/global/marketplaces/shein.png'),
  temu: require('../../assets/kareebu-plus/global/marketplaces/temu.png'),
};
const titleCase = (value:string) => value.charAt(0).toUpperCase()+value.slice(1);
const marketplaceName = (value:GlobalMarketplaceId) => GLOBAL_MARKETPLACES[value]?.name ?? titleCase(value);
const sourceMoney = (product:GlobalProduct) => `${product.sourceCurrency==='USD'?'$':product.sourceCurrency==='GBP'?'£':'€'}${product.sourcePrice.toFixed(2)}`;

function globalTaxonomyId(value:string){
  const direct=`global.${value}`;
  if(taxonomyNode(direct))return direct;
  const aliases:Record<string,string>={pets:'global.pets',books:'global.office-school',kids:'global.baby',sports:'global.health-fitness',accessories:'global.accessories',automotive:'global.automotive'};
  return aliases[value]??normaliseTaxonomyId('global',direct);
}
const PRODUCT_TONES=['#F7F3EA','#FFF8DD','#F2F6FA','#F4F7F3','#F7F2F8','#FFF1EE'] as const;
function productTone(id:string){let hash=2166136261;for(let index=0;index<id.length;index+=1){hash^=id.charCodeAt(index);hash=Math.imul(hash,16777619);}return PRODUCT_TONES[(hash>>>0)%PRODUCT_TONES.length]!;}


function MarketplaceLogo({id,compact=false}:{id:GlobalMarketplaceId;compact?:boolean}) {
  const logo=MARKETPLACE_LOGOS[id];
  if(logo) return <Image accessibilityLabel={`${marketplaceName(id)} logo`} source={logo} style={compact?s.logoCompact:s.logo} resizeMode="contain"/>;
  return <View accessibilityLabel={`${marketplaceName(id)} source`} style={[s.logoFallback,compact&&s.logoFallbackCompact]}><Text style={[s.logoFallbackText,compact&&s.logoFallbackTextCompact]}>{marketplaceName(id)}</Text></View>;
}

function GlobalHeader({actions,title='Kareebu Global'}:{actions:GlobalScreenActions;title?:string}) {
  return <Header title={title} onBack={actions.back} right={<Pressable accessibilityRole="button" accessibilityLabel="Open Global basket" onPress={()=>actions.go('globalBasket')} style={s.headerAction}><Ionicons name="bag-handle-outline" size={23} color={COLORS.black}/></Pressable>}/>;
}

const ProductCard = memo(function ProductCard({product,country,onPress,wide=false}:{product:GlobalProduct;country:string;onPress:()=>void;wide?:boolean}) {
  const quote=estimateGlobalQuote(product,country);
  return <Pressable accessibilityRole="button" accessibilityLabel={`${product.title}, estimated ${formatMoney(country,quote.breakdown.total)} delivered`} onPress={onPress} style={({pressed})=>[s.product,wide?s.productWide:s.productGrid,pressed&&s.pressed]}>
    <View style={[s.productImageWrap,{backgroundColor:productTone(product.id)}]}><Image source={product.image} style={s.productImage} resizeMode="contain"/><View style={s.sourceBadge}><MarketplaceLogo id={product.marketplace} compact/></View><View style={s.productBrandBadge}><Text numberOfLines={1} style={s.productBrandBadgeText}>{product.brand}</Text></View></View>
    <Text numberOfLines={2} style={s.productTitle}>{product.title}</Text>
    <Text numberOfLines={1} style={s.meta}>{product.variant}</Text>
    <Text style={s.sourcePrice}>{sourceMoney(product)} at source</Text>
    <Text numberOfLines={1} style={s.price}>{formatMoney(country,quote.breakdown.total)} {quote.state==='requires_review'?'before final duties':'delivered'}</Text>
    <Text style={s.estimate}>Est. {product.deliveryDays[0]}–{product.deliveryDays[1]} days</Text>
  </Pressable>;
});

function SearchBox({value,onChange,placeholder}:{value:string;onChange:(value:string)=>void;placeholder:string}) {
  return <View style={s.search}><Feather name="search" size={18} color={COLORS.muted}/><TextInput accessibilityLabel={placeholder} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={COLORS.muted} style={s.searchInput}/>{value?<Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={()=>onChange('')}><Feather name="x" size={18}/></Pressable>:null}</View>;
}


function SectionTitle({title,meta}:{title:string;meta?:string}) {
  return <View style={s.sectionHead}><Text style={s.heading}>{title}</Text>{meta?<Text style={s.sectionMeta}>{meta}</Text>:null}</View>;
}

function PromoPanel({item,onPress,large=false}:{item:(typeof GLOBAL_PROMO_PANELS)[number];onPress:()=>void;large?:boolean}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={item.title} onPress={onPress} style={({pressed})=>[s.promoPanel,large&&s.promoPanelLarge,{backgroundColor:item.tone},pressed&&s.pressed]}>
    <View style={s.promoCopy}><Text style={s.promoTitle}>{item.title}</Text><Text style={s.promoBody}>{item.body}</Text></View>
    <Image source={item.image} style={large?s.promoImageLarge:s.promoImage} resizeMode="contain"/>
  </Pressable>;
}

function DepartmentTile({item,onPress}:{item:(typeof GLOBAL_DEPARTMENTS)[number];onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} onPress={onPress} style={({pressed})=>[s.departmentTile,pressed&&s.pressed]}>
    <Text style={s.departmentTitle}>{item.title}</Text><Text numberOfLines={2} style={s.departmentSubtitle}>{item.subtitle}</Text><Image source={item.image} style={s.departmentImage} resizeMode="contain"/>
  </Pressable>;
}

function EditorialBlock({item,onPress}:{item:(typeof GLOBAL_EDITORIAL_GROUPS)[number];onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} onPress={onPress} style={({pressed})=>[s.editorialBlock,pressed&&s.pressed]}>
    <Text style={s.editorialTitle}>{item.title}</Text><Text style={s.editorialCta}>{item.cta}</Text><Image source={item.image} style={s.editorialImage} resizeMode="contain"/><Feather name="chevron-right" size={18} color={COLORS.black} style={s.editorialArrow}/>
  </Pressable>;
}

const FIXTURE_GALLERY_LABELS = ['Product', 'Detail', 'Key features', 'Size & fit', 'Variant & source'] as const;

function ProductGalleryMedia({product,index,compact=false}:{product:GlobalProduct;index:number;compact?:boolean}) {
  const source=product.images[index]??product.image;
  const fixture=product.referenceFixture===true;
  if(!fixture) return <Image source={source} style={compact?s.thumbnailImage:s.detailArt} resizeMode="contain"/>;
  const label=FIXTURE_GALLERY_LABELS[index]??`View ${index+1}`;
  if(compact) return <View style={s.fixtureThumbMedia}><Image source={source} style={[s.thumbnailImage,index===1&&s.galleryZoom]} resizeMode="contain"/><Text numberOfLines={1} style={s.fixtureThumbLabel}>{label}</Text></View>;
  return <View style={s.fixtureGalleryMedia}>
    <Image source={source} style={[s.detailArt,index===1&&s.galleryZoom]} resizeMode="contain"/>
    {index===2?<View style={s.galleryCallout}><Text style={s.galleryCalloutTitle}>Key features</Text><Text style={s.galleryCalloutBody}>{product.specifications.slice(0,2).map(item=>`${item.label}: ${item.value}`).join(' · ')}</Text></View>:null}
    {index===3?<View style={s.galleryCallout}><Text style={s.galleryCalloutTitle}>Product size</Text><Text style={s.galleryCalloutBody}>{product.dimensionsCm?`${product.dimensionsCm.length} × ${product.dimensionsCm.width} × ${product.dimensionsCm.height} cm · ${product.weightKg} kg`:`Approx. ${product.weightKg} kg`}</Text></View>:null}
    {index===4?<View style={s.galleryCallout}><Text style={s.galleryCalloutTitle}>{product.variant}</Text><Text style={s.galleryCalloutBody}>Source: {marketplaceName(product.marketplace)} · final media and availability refresh before payment</Text></View>:null}
    <View style={s.galleryLabel}><Text style={s.galleryLabelText}>{label}</Text></View>
  </View>;
}

export function GlobalHomeScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) {
  const [query,setQuery]=useState(data.query);
  const results=useMemo(()=>globalProducts({query,limit:24}),[query]);
  const openProduct=(product:GlobalProduct)=>{actions.selectProduct(product.id);actions.go('globalProduct')};
  const openCategory=(category:string)=>{actions.setCategory(globalTaxonomyId(category));actions.setMarketplace(null);actions.setQuery('');actions.go('globalCollection')};
  const openMarketplace=(marketplace:GlobalMarketplaceId)=>{actions.setMarketplace(marketplace);actions.setCategory(null);actions.setQuery('');actions.go('globalCollection')};
  const updateQuery=(value:string)=>{setQuery(value);actions.setQuery(value)};
  const heroPromos=GLOBAL_PROMO_PANELS.slice(0,2);
  const dealRows=GLOBAL_PROMO_PANELS.slice(2);

  return <ScreenShell><GlobalHeader actions={actions}/><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    <View style={s.globalIntro}><Text style={s.eyebrow}>SHOP THE WORLD</Text><Text style={s.globalIntroTitle}>Pay locally. We handle the rest.</Text><Text style={s.globalIntroBody}>Browse international marketplaces with a Kareebu landed-price estimate for {data.city}.</Text></View>
    <SearchBox value={query} onChange={updateQuery} placeholder="Search global stores and products"/>

    <View style={s.globalNavStrip}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.globalNavContent}>
      {([
        ['Discover',null],['Electronics','electronics'],['Fashion','fashion'],['Beauty','beauty'],['Home','home'],['Toys','toys-games'],['Sports','health-fitness'],['Books','office-school'],
      ] as const).map(([label,category])=><Pressable accessibilityRole="button" key={label} onPress={()=>category?openCategory(category):actions.go('globalHome')} style={s.globalNavButton}><Text style={s.globalNavItem}>{label}</Text></Pressable>)}
    </ScrollView></View>

    <View style={s.heroSplit}>
      <PromoPanel item={heroPromos[0]!} large onPress={()=>openMarketplace(heroPromos[0]!.marketplace??'amazon')}/>
      <View style={s.heroStack}><PromoPanel item={heroPromos[1]!} onPress={()=>openCategory(heroPromos[1]!.category??'home')}/></View>
    </View>

    <SectionTitle title="Marketplaces" meta={`${GLOBAL_CATALOG_STATS.total.toLocaleString()} catalogue items`} />
    <FlatList horizontal data={MARKETPLACES} keyExtractor={item=>item} showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail} renderItem={({item})=><Pressable accessibilityRole="button" accessibilityLabel={`Shop ${marketplaceName(item)}`} onPress={()=>openMarketplace(item)} style={({pressed})=>[s.marketplace,pressed&&s.pressed]}><MarketplaceLogo id={item}/><Text style={s.marketplaceAction}>Shop {marketplaceName(item)}</Text><Text style={s.meta}>Global source · landed-price checkout</Text></Pressable>}/>

    {query?<><SectionTitle title="Search results" meta={`${results.length} shown`}/>{results.length?<FlatList horizontal data={results} keyExtractor={item=>item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail} renderItem={({item})=><ProductCard wide product={item} country={data.country} onPress={()=>openProduct(item)}/>}/>:<View style={s.empty}><Text style={s.emptyTitle}>No Global matches yet</Text><Text style={s.meta}>Try another product, brand, category or marketplace.</Text></View>}</>:null}

    <SectionTitle title="Shop departments" />
    <View style={s.departmentGrid}>{GLOBAL_DEPARTMENTS.slice(0,6).map(item=><DepartmentTile key={item.id} item={item} onPress={()=>openCategory(item.id)}/>)}</View>

    <SectionTitle title="More storefronts to explore" />
    <View style={s.editorialGrid}>{GLOBAL_EDITORIAL_GROUPS.map(item=><EditorialBlock key={item.id} item={item} onPress={()=>openCategory(item.id)}/>)}</View>

    {dealRows.map(item=>{
      const products=globalProducts({category:item.category,limit:10});
      return <View key={item.id} style={s.dealSection}><PromoPanel item={item} onPress={()=>openCategory(item.category??'home')}/>{products.length?<FlatList horizontal data={products} keyExtractor={product=>product.id} showsHorizontalScrollIndicator={false} contentContainerStyle={s.rail} renderItem={({item:product})=><ProductCard wide product={product} country={data.country} onPress={()=>openProduct(product)}/>}/>:null}</View>;
    })}

    <SectionTitle title="Shop more departments" />
    <View style={s.departmentGrid}>{GLOBAL_DEPARTMENTS.slice(6).map(item=><DepartmentTile key={item.id} item={item} onPress={()=>openCategory(item.id)}/>)}</View>

    <View style={s.howItWorks}><Text style={s.heading}>How Kareebu Global works</Text><View style={s.steps}>{[['1','Choose from a supported international source'],['2','Review the estimated landed price in your local currency'],['3','Pay locally and track the entire journey in Activity']].map(([number,label])=><View key={number} style={s.step}><View style={s.stepNumber}><Text style={s.stepNumberText}>{number}</Text></View><Text style={s.stepText}>{label}</Text></View>)}</View><Text style={s.legalNote}>Products are sourced from third-party marketplaces. Kareebu is not the retailer unless stated. Source price and availability are refreshed before payment.</Text></View>
  </ScrollView></ScreenShell>;
}

type CollectionSort='relevant'|'price'|'delivery';
type GlobalPriceFilter='all'|'under-100'|'100-300'|'300-plus';
type GlobalDeliveryFilter='all'|'ten-days'|'two-weeks';
type GlobalDeliveredPriceFilter='all'|'lower'|'mid'|'premium';
type SmartphonePlatformFilter='all'|'ios'|'android';
type SmartphoneStorageFilter='all'|'128GB'|'256GB'|'512GB';

function FilterChoice({label,active,onPress}:{label:string;active:boolean;onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} onPress={onPress} style={[s.filterChoice,active&&s.filterChoiceActive]}><Text style={[s.filterChoiceText,active&&s.filterChoiceTextActive]}>{label}</Text></Pressable>;
}

function BrandChoice({brand,count,active,onPress}:{brand:string;count:number;active:boolean;onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} accessibilityLabel={`${brand}, ${count} products`} onPress={onPress} style={[s.brandChoice,active&&s.brandChoiceActive]}>
    <View style={[s.brandChoiceMark,active&&s.brandChoiceMarkActive]}><Text numberOfLines={1} adjustsFontSizeToFit style={s.brandChoiceMarkText}>{brand}</Text></View>
    <View style={s.brandChoiceCopy}><Text numberOfLines={1} style={s.brandChoiceName}>{brand}</Text><Text style={s.brandChoiceCount}>{count} {count===1?'product':'products'}</Text></View>
    <Feather name="chevron-right" size={16} color={COLORS.black}/>
  </Pressable>;
}

export function GlobalCollectionScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) {
  const [query,setQuery]=useState(data.query);
  const [sort,setSort]=useState<CollectionSort>('relevant');
  const [visibleLimit,setVisibleLimit]=useState(40);
  const [brandFilter,setBrandFilter]=useState<string|null>(null);
  const [marketplaceFilter,setMarketplaceFilter]=useState<GlobalMarketplaceId|null>(null);
  const [priceFilter,setPriceFilter]=useState<GlobalPriceFilter>('all');
  const [deliveryFilter,setDeliveryFilter]=useState<GlobalDeliveryFilter>('all');
  const [deliveredPriceFilter,setDeliveredPriceFilter]=useState<GlobalDeliveredPriceFilter>('all');
  const [phonePlatformFilter,setPhonePlatformFilter]=useState<SmartphonePlatformFilter>('all');
  const [phoneStorageFilter,setPhoneStorageFilter]=useState<SmartphoneStorageFilter>('all');
  const [showFilters,setShowFilters]=useState(false);
  const marketplaceId=(data.marketplace??'') as GlobalMarketplaceId;
  const categoryNodeId=data.category?normaliseTaxonomyId('global',data.category):null;
  const categoryPath=categoryNodeId?taxonomyPath(categoryNodeId):undefined;
  const marketplaceNode=data.marketplace?taxonomyNode(`global.marketplace.${data.marketplace}`):undefined;
  const node=categoryPath?.node??marketplaceNode??taxonomyNode('global')!;
  const children=categoryPath?.children??(data.marketplace?taxonomyChildren('global').filter(item=>item.type==='department'):taxonomyChildren(node.id));
  const title=node.title;
  const coarseCategory=categoryNodeId?globalProductCategoryForTaxonomy(categoryNodeId):undefined;
  const productTerms=categoryNodeId?taxonomyProductTerms(categoryNodeId).map(term=>term.toLowerCase()):[];
  const childMode=node.type==='brand'?'model':children.length&&children.every(child=>child.type==='brand')?'brand':node.type==='marketplace'?'department':'category';
  const smartphoneContext=node.id.startsWith('global.electronics.phones.smartphones');
  const nodeBrand=node.brands?.[0]??null;

  useEffect(()=>{
    setBrandFilter(null);setMarketplaceFilter(null);setPriceFilter('all');setDeliveryFilter('all');setDeliveredPriceFilter('all');setPhonePlatformFilter('all');setPhoneStorageFilter('all');setSort('relevant');setVisibleLimit(40);setShowFilters(false);
  },[node.id]);

  const cataloguePool=useMemo(()=>{
    const base=[...globalProducts({query,marketplace:data.marketplace??undefined,category:coarseCategory as GlobalProduct['category']|undefined})];
    const shouldNarrow=Boolean(categoryNodeId&&categoryNodeId.split('.').length>2&&productTerms.length);
    const narrowed=shouldNarrow?base.filter(product=>{
      const hay=`${product.title} ${product.brand} ${product.variant} ${product.category}`.toLowerCase();
      const termMatch=productTerms.some(term=>hay.includes(term));
      const phoneMatch=!smartphoneContext||/iphone|galaxy|pixel|smartphone|xiaomi|oneplus|motorola|nokia|tecno|infinix|oppo|vivo|huawei/i.test(product.title);
      const brandMatch=!nodeBrand||product.brand===nodeBrand;
      return termMatch&&phoneMatch&&brandMatch;
    }):base;
    return shouldNarrow?narrowed:base.filter(product=>(!smartphoneContext||/iphone|galaxy|pixel|smartphone|xiaomi|oneplus|motorola|nokia|tecno|infinix|oppo|vivo|huawei/i.test(product.title))&&(!nodeBrand||product.brand===nodeBrand));
  },[categoryNodeId,coarseCategory,data.marketplace,nodeBrand,productTerms.join('|'),query,smartphoneContext]);

  const brandCounts=useMemo(()=>{
    const counts=new Map<string,number>();
    cataloguePool.forEach(product=>counts.set(product.brand,(counts.get(product.brand)??0)+1));
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12);
  },[cataloguePool]);
  const marketplaces=useMemo(()=>[...new Set(cataloguePool.map(product=>product.marketplace))],[cataloguePool]);
  const deliveredPriceBands=useMemo(()=>{
    const totals=cataloguePool.map(product=>estimateGlobalQuote(product,data.country).breakdown.total).sort((a,b)=>a-b);
    if(!totals.length)return null;
    const lower=totals[Math.floor((totals.length-1)*.34)]!;
    const upper=totals[Math.floor((totals.length-1)*.67)]!;
    return {lower,upper};
  },[cataloguePool,data.country]);

  const products=useMemo(()=>{
    const items=cataloguePool.filter(product=>{
      if(brandFilter&&product.brand!==brandFilter)return false;
      if(marketplaceFilter&&product.marketplace!==marketplaceFilter)return false;
      if(priceFilter==='under-100'&&product.sourcePrice>=100)return false;
      if(priceFilter==='100-300'&&(product.sourcePrice<100||product.sourcePrice>=300))return false;
      if(priceFilter==='300-plus'&&product.sourcePrice<300)return false;
      if(deliveryFilter==='ten-days'&&product.deliveryDays[1]>10)return false;
      if(deliveryFilter==='two-weeks'&&product.deliveryDays[1]>14)return false;
      if(deliveredPriceFilter!=='all'&&deliveredPriceBands){
        const delivered=estimateGlobalQuote(product,data.country).breakdown.total;
        if(deliveredPriceFilter==='lower'&&delivered>deliveredPriceBands.lower)return false;
        if(deliveredPriceFilter==='mid'&&(delivered<=deliveredPriceBands.lower||delivered>deliveredPriceBands.upper))return false;
        if(deliveredPriceFilter==='premium'&&delivered<=deliveredPriceBands.upper)return false;
      }
      if(smartphoneContext&&phonePlatformFilter==='ios'&&product.brand!=='Apple')return false;
      if(smartphoneContext&&phonePlatformFilter==='android'&&product.brand==='Apple')return false;
      if(smartphoneContext&&phoneStorageFilter!=='all'&&product.variant!==phoneStorageFilter)return false;
      return true;
    });
    if(sort==='price') items.sort((a,b)=>estimateGlobalQuote(a,data.country).breakdown.total-estimateGlobalQuote(b,data.country).breakdown.total);
    if(sort==='delivery') items.sort((a,b)=>a.deliveryDays[1]-b.deliveryDays[1]);
    return items;
  },[brandFilter,cataloguePool,data.country,deliveredPriceBands,deliveredPriceFilter,deliveryFilter,marketplaceFilter,phonePlatformFilter,phoneStorageFilter,priceFilter,smartphoneContext,sort]);

  const visibleProducts=products.slice(0,visibleLimit);
  const openChild=(childId:string)=>{actions.setCategory(childId);actions.setQuery('');setQuery('');setVisibleLimit(40);};
  const openAncestor=(id:string)=>{actions.setCategory(id);actions.setQuery('');setQuery('');};
  const activeFilterCount=(brandFilter?1:0)+(marketplaceFilter?1:0)+(priceFilter!=='all'?1:0)+(deliveredPriceFilter!=='all'?1:0)+(deliveryFilter!=='all'?1:0)+(smartphoneContext&&phonePlatformFilter!=='all'?1:0)+(smartphoneContext&&phoneStorageFilter!=='all'?1:0);

  const header=<View style={s.collectionHeader}>
    <SearchBox value={query} onChange={(value)=>{setQuery(value);setVisibleLimit(40);actions.setQuery(value)}} placeholder={`Search within ${title}`}/>

    {categoryPath?.ancestors?.length?<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.breadcrumbRail}>
      {categoryPath.ancestors.filter(item=>item.id!=='global').map(item=><Pressable key={item.id} onPress={()=>openAncestor(item.id)} style={s.breadcrumbChip}><Text style={s.breadcrumbText}>{item.title}</Text><Feather name="chevron-right" size={12} color={COLORS.muted}/></Pressable>)}
      <Text style={s.breadcrumbCurrent}>{title}</Text>
    </ScrollView>:null}

    <View style={s.collectionHero}>
      <View style={s.collectionHeroCopy}>{data.marketplace?<MarketplaceLogo id={marketplaceId}/>:<Text style={s.eyebrow}>KAREEBU GLOBAL</Text>}<Text style={s.collectionTitle}>{title}</Text><Text style={s.heroBody}>{node.description} Delivered-price estimates are refreshed before payment.</Text></View>
      <View style={s.collectionHeroArt}><CategoryArtwork visualKey={node.visualKey} size="hero"/></View>
    </View>
    <PromotionSurface service="global" placement="LANDING_HERO" country={data.country} city={data.city} categoryId={node.id} subcategoryId={node.parentId} marketplaceId={data.marketplace??undefined} nodeId={node.id} nodeType={node.type} layout="compact" onPress={campaign=>actions.go(campaign.ctaScreen)}/>

    {children.length?<View style={s.globalChildSection}><SectionTitle title={childMode==='brand'?'Shop by brand':childMode==='model'?'Shop by model family':childMode==='department'?'Shop by department':`Explore ${title}`} meta={`${children.length} ${childMode==='brand'?'brands':childMode==='model'?'model groups':'destinations'}`}/><Text style={s.globalChildIntro}>{childMode==='brand'?'Choose a phone brand, then compare the models and source marketplaces available for that brand.':childMode==='model'?'Choose a model family, then compare storage options, source marketplaces and delivered estimates.':'Choose a category to narrow the products shown below.'}</Text><View style={s.globalChildGrid}>{children.map((child,index)=>{const brandName=child.title.replace('Apple iPhone','Apple').replace('Samsung Galaxy','Samsung');return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${child.title}`} key={child.id} onPress={()=>openChild(child.id)} style={({pressed})=>[s.globalChildCard,childMode==='brand'&&s.globalBrandChildCard,pressed&&s.pressed]}>{childMode==='brand'?<View style={[s.globalBrandChildArt,{backgroundColor:PRODUCT_TONES[index%PRODUCT_TONES.length]}]}><View style={s.globalBrandWordmark}><Text numberOfLines={1} adjustsFontSizeToFit style={s.globalBrandWordmarkText}>{brandName}</Text><Text style={s.globalBrandCategoryText}>Shop smartphones</Text></View><View style={s.globalBrandArrow}><Feather name="arrow-up-right" size={17} color={COLORS.black}/></View></View>:<><View style={[s.globalChildArt,{backgroundColor:PRODUCT_TONES[index%PRODUCT_TONES.length]}]}><CategoryArtwork visualKey={child.visualKey} size="large"/></View><Text numberOfLines={2} style={s.globalChildTitle}>{child.title}</Text></>}</Pressable>})}</View><PromotionSurface service="global" placement="LANDING_INLINE_1" country={data.country} city={data.city} categoryId={node.id} subcategoryId={node.parentId} marketplaceId={data.marketplace??undefined} nodeId={node.id} nodeType={node.type} layout="compact" onPress={campaign=>actions.go(campaign.ctaScreen)}/></View>:null}

    {brandCounts.length>=3&&childMode!=='brand'?<View style={s.brandSection}><SectionTitle title="Shop by brand" meta={smartphoneContext?'Choose a phone maker':'Brands represented in this catalogue'}/><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.brandChoiceRail}>{brandCounts.map(([brand,count])=><BrandChoice key={brand} brand={brand} count={count} active={brandFilter===brand} onPress={()=>{setBrandFilter(current=>current===brand?null:brand);setVisibleLimit(40)}}/>)}</ScrollView></View>:null}

    <View style={s.collectionControls}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRail}>
        {([['relevant','Relevant'],['price','Lowest delivered price'],['delivery','Fastest delivery']] as const).map(([value,label])=><Pressable key={value} onPress={()=>setSort(value)} style={[s.chip,sort===value&&s.chipSelected]}><Text style={[s.chipText,sort===value&&s.chipTextSelected]}>{label}</Text></Pressable>)}
        <Pressable onPress={()=>setShowFilters(value=>!value)} style={[s.filterButton,showFilters&&s.filterButtonActive]}><Feather name="sliders" size={15} color={showFilters?COLORS.white:COLORS.black}/><Text style={[s.filterButtonText,showFilters&&s.filterButtonTextActive]}>Filters{activeFilterCount?` (${activeFilterCount})`:''}</Text></Pressable>
      </ScrollView>
    </View>

    {showFilters?<View style={s.filterPanel}>
      {brandCounts.length>=3?<View><Text style={s.filterLabel}>Brand</Text><View style={s.filterWrap}><FilterChoice label="All brands" active={!brandFilter} onPress={()=>setBrandFilter(null)}/>{brandCounts.slice(0,8).map(([brand])=><FilterChoice key={brand} label={brand} active={brandFilter===brand} onPress={()=>setBrandFilter(brand)}/>)}</View></View>:null}
      {smartphoneContext?<View><Text style={s.filterLabel}>Phone platform</Text><View style={s.filterWrap}><FilterChoice label="Any platform" active={phonePlatformFilter==='all'} onPress={()=>setPhonePlatformFilter('all')}/><FilterChoice label="iPhone / iOS" active={phonePlatformFilter==='ios'} onPress={()=>setPhonePlatformFilter('ios')}/><FilterChoice label="Android" active={phonePlatformFilter==='android'} onPress={()=>setPhonePlatformFilter('android')}/></View></View>:null}
      {smartphoneContext?<View><Text style={s.filterLabel}>Storage</Text><View style={s.filterWrap}><FilterChoice label="Any storage" active={phoneStorageFilter==='all'} onPress={()=>setPhoneStorageFilter('all')}/>{(['128GB','256GB','512GB'] as const).map(storage=><FilterChoice key={storage} label={storage} active={phoneStorageFilter===storage} onPress={()=>setPhoneStorageFilter(storage)}/>)}</View></View>:null}
      {marketplaces.length>1?<View><Text style={s.filterLabel}>Source marketplace</Text><View style={s.filterWrap}><FilterChoice label="All sources" active={!marketplaceFilter} onPress={()=>setMarketplaceFilter(null)}/>{marketplaces.map(id=><FilterChoice key={id} label={marketplaceName(id)} active={marketplaceFilter===id} onPress={()=>setMarketplaceFilter(id)}/>)}</View></View>:null}
      <View><Text style={s.filterLabel}>Source price</Text><View style={s.filterWrap}><FilterChoice label="Any source price" active={priceFilter==='all'} onPress={()=>setPriceFilter('all')}/><FilterChoice label="Under $100" active={priceFilter==='under-100'} onPress={()=>setPriceFilter('under-100')}/><FilterChoice label="$100–$300" active={priceFilter==='100-300'} onPress={()=>setPriceFilter('100-300')}/><FilterChoice label="$300+" active={priceFilter==='300-plus'} onPress={()=>setPriceFilter('300-plus')}/></View></View>
      {deliveredPriceBands?<View><Text style={s.filterLabel}>Estimated delivered total</Text><View style={s.filterWrap}><FilterChoice label="Any delivered total" active={deliveredPriceFilter==='all'} onPress={()=>setDeliveredPriceFilter('all')}/><FilterChoice label={`Up to ${formatMoney(data.country,deliveredPriceBands.lower)}`} active={deliveredPriceFilter==='lower'} onPress={()=>setDeliveredPriceFilter('lower')}/><FilterChoice label={`${formatMoney(data.country,deliveredPriceBands.lower)}–${formatMoney(data.country,deliveredPriceBands.upper)}`} active={deliveredPriceFilter==='mid'} onPress={()=>setDeliveredPriceFilter('mid')}/><FilterChoice label={`${formatMoney(data.country,deliveredPriceBands.upper)}+`} active={deliveredPriceFilter==='premium'} onPress={()=>setDeliveredPriceFilter('premium')}/></View></View>:null}
      <View><Text style={s.filterLabel}>Estimated delivery</Text><View style={s.filterWrap}><FilterChoice label="Any estimate" active={deliveryFilter==='all'} onPress={()=>setDeliveryFilter('all')}/><FilterChoice label="Within 10 days" active={deliveryFilter==='ten-days'} onPress={()=>setDeliveryFilter('ten-days')}/><FilterChoice label="Within 2 weeks" active={deliveryFilter==='two-weeks'} onPress={()=>setDeliveryFilter('two-weeks')}/></View></View>
      {activeFilterCount?<Pressable onPress={()=>{setBrandFilter(null);setMarketplaceFilter(null);setPriceFilter('all');setDeliveredPriceFilter('all');setDeliveryFilter('all');setPhonePlatformFilter('all');setPhoneStorageFilter('all')}} style={s.clearFilters}><Text style={s.clearFiltersText}>Clear all filters</Text></Pressable>:null}
    </View>:null}
    <Text style={s.resultCount}>{products.length.toLocaleString()} {products.length===1?'product':'products'} · showing {visibleProducts.length.toLocaleString()}</Text>
  </View>;
  return <ScreenShell><GlobalHeader actions={actions} title={title}/><FlatList data={visibleProducts} keyExtractor={item=>item.id} numColumns={2} columnWrapperStyle={s.columns} contentContainerStyle={s.listContent} ListHeaderComponent={header} ListEmptyComponent={<View style={s.empty}><Text style={s.emptyTitle}>Nothing matches these filters</Text><Text style={s.meta}>Clear a filter, choose another brand or try a different search.</Text></View>} ListFooterComponent={visibleLimit<products.length?<Pressable accessibilityRole="button" onPress={()=>setVisibleLimit(value=>Math.min(products.length,value+40))} style={s.loadMore}><Text style={s.loadMoreText}>Load more products</Text><Feather name="chevron-down" size={18}/></Pressable>:null} renderItem={({item})=><ProductCard product={item} country={data.country} onPress={()=>{actions.selectProduct(item.id);actions.go('globalProduct')}}/>}/></ScreenShell>;
}

function InfoAccordion({title,children,openByDefault=false}:{title:string;children:React.ReactNode;openByDefault?:boolean}) {
  const [open,setOpen]=useState(openByDefault);
  return <View style={s.accordion}><Pressable accessibilityRole="button" accessibilityState={{expanded:open}} onPress={()=>setOpen(value=>!value)} style={s.accordionHead}><Text style={s.trustTitle}>{title}</Text><Feather name={open?'chevron-up':'chevron-down'} size={20}/></Pressable>{open?<View style={s.accordionBody}>{children}</View>:null}</View>;
}

export function GlobalProductScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) {
  const product=GLOBAL_PRODUCTS.find(item=>item.id===data.selectedProductId)??GLOBAL_PRODUCTS[0];
  const [variant,setVariant]=useState(product.variant);
  const [quantity,setQuantity]=useState(1);
  const [refreshKey,setRefreshKey]=useState(0);
  const [imageIndex,setImageIndex]=useState(0);
  const quote=useMemo(()=>estimateGlobalQuote(product,data.country,quantity),[data.country,product,quantity,refreshKey]);
  const unavailable=quote.state==='unavailable';
  const unitQuote=estimateGlobalQuote(product,data.country,1);
  return <ScreenShell><GlobalHeader actions={actions}/><View style={s.detailRoot}><ScrollView contentContainerStyle={s.detailPage} showsVerticalScrollIndicator={false}>
    <View style={s.detailImage}><ProductGalleryMedia product={product} index={imageIndex}/><View style={s.imageCount}><Text style={s.imageCountText}>{imageIndex+1} / {product.images.length}</Text></View></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.thumbnailRail}>{product.images.map((_,index)=><Pressable accessibilityRole="button" accessibilityLabel={`View ${product.title} ${FIXTURE_GALLERY_LABELS[index]??`image ${index+1}`}`} key={`${product.id}-${index}`} onPress={()=>setImageIndex(index)} style={[s.thumbnail,imageIndex===index&&s.thumbnailActive]}><ProductGalleryMedia product={product} index={index} compact/></Pressable>)}</ScrollView>
    <View style={s.sourceIdentity}><MarketplaceLogo id={product.marketplace}/><View style={s.sourceCopy}><Text style={s.trustTitle}>Sourced via {product.sourceRegion}</Text><Text style={s.meta}>{product.seller?`Sold by ${product.seller}`:'Seller confirmed before payment'}</Text></View></View>
    <Text style={s.detailTitle}>{product.title}</Text><Text style={s.brand}>{product.brand}</Text>
    <View style={s.pricePanel}><View><Text style={s.priceLabel}>Source price</Text><Text style={s.sourcePriceLarge}>{sourceMoney(product)}</Text></View><View style={s.priceDivider}/><View style={s.deliveredPrice}><Text style={s.priceLabel}>Estimated delivered total</Text><Text style={s.detailPrice}>{unavailable?'Unavailable':formatMoney(data.country,quote.breakdown.total)}</Text></View></View>
    <View style={s.quoteStatus}><View style={s.statusDot}/><View style={s.sourceCopy}><Text style={s.trustTitle}>Estimated quote</Text><Text style={s.meta}>Calculated now · confirmed before payment</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Refresh price estimate" onPress={()=>setRefreshKey(value=>value+1)} style={s.refresh}><Feather name="refresh-cw" size={16}/><Text style={s.refreshText}>Refresh</Text></Pressable></View>
    <Text style={s.notice}>{quote.estimateNotice}</Text>
    <View style={s.deliveryDestination}><Ionicons name="location-outline" size={22}/><View style={s.sourceCopy}><Text style={s.priceLabel}>Deliver to</Text><Text style={s.trustTitle}>{data.deliveryAddress}, {data.country}</Text></View></View>
    <Text style={s.heading}>Choose a variant</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipRail}>{product.variants.map(item=><Pressable key={item} onPress={()=>setVariant(item)} style={[s.variant,variant===item&&s.variantSelected]}><Text style={[s.variantText,variant===item&&s.variantTextSelected]}>{item}</Text></Pressable>)}</ScrollView>
    <View style={s.quantityRow}><Text style={s.heading}>Quantity</Text><View style={s.quantity}><Pressable accessibilityRole="button" accessibilityLabel="Decrease quantity" onPress={()=>setQuantity(value=>Math.max(1,value-1))} style={s.qty}><Text style={s.qtyText}>−</Text></Pressable><Text style={s.quantityValue}>{quantity}</Text><Pressable accessibilityRole="button" accessibilityLabel="Increase quantity" onPress={()=>setQuantity(value=>value+1)} style={s.qty}><Text style={s.qtyText}>+</Text></Pressable></View></View>
    <View style={s.deliveryCard}><Ionicons name="airplane-outline" size={24}/><View style={s.sourceCopy}><Text style={s.trustTitle}>Estimated delivery: {product.deliveryDays[0]}–{product.deliveryDays[1]} days</Text><Text style={s.meta}>International fulfilment, import processing and Kareebu local delivery.</Text></View></View>
    <InfoAccordion title="Landed-price breakdown" openByDefault><View style={s.breakdown}>{[['Item price',quote.breakdown.product],['International shipping',quote.breakdown.internationalDelivery],['Estimated import costs',quote.breakdown.estimatedDutyTax],['Kareebu Global service',quote.breakdown.kareebuLogistics],['Local delivery',quote.breakdown.localDelivery]].map(([label,value])=><View key={String(label)} style={s.row}><Text style={s.meta}>{label}</Text><Text style={s.rowValue}>{Number(value)===0?'Included':formatMoney(data.country,Number(value))}</Text></View>)}<View style={s.totalRow}><Text style={s.trustTitle}>Estimated delivered total</Text><Text style={s.totalValue}>{formatMoney(data.country,quote.breakdown.total)}</Text></View><Text style={s.legalNote}>Import costs are included in this estimate and confirmed before payment.</Text></View></InfoAccordion>
    <InfoAccordion title="Product details"><Text style={s.body}>{product.description}</Text>{product.specifications.map(spec=><View key={spec.label} style={s.specRow}><Text style={s.meta}>{spec.label}</Text><Text style={s.specValue}>{spec.value}</Text></View>)}</InfoAccordion>
    {product.compatibilityNote?<InfoAccordion title="Import & compatibility"><Text style={s.body}>{product.compatibilityNote}</Text></InfoAccordion>:null}
    <InfoAccordion title="Returns, cancellation & warranty"><Text style={s.trustTitle}>Returns & refunds</Text><Text style={s.body}>{product.returnNote}</Text><Text style={s.trustTitle}>Cancellation</Text><Text style={s.body}>{product.cancellationNote}</Text>{product.warrantyNote?<><Text style={s.trustTitle}>Warranty</Text><Text style={s.body}>{product.warrantyNote}</Text></>:null}</InfoAccordion>
    <InfoAccordion title="Source information"><Text style={s.body}>Source: {product.sourceRegion}</Text><Text style={s.body}>Reference: {product.sourceReference}</Text><Text style={s.legalNote}>This reference listing is not presented as live stock or a marketplace partnership. Availability and source seller are checked at final quote.</Text></InfoAccordion>
  </ScrollView><View style={s.stickyCta}><PrimaryButton label={unavailable?'Not available in this market':`Add to Global Basket · ${formatMoney(data.country,quote.breakdown.total)}`} disabled={unavailable} onPress={()=>{actions.addLine({id:`GL-${product.id}-${variant}`,productId:product.id,quantity,variant,quote:unitQuote});actions.go('globalBasket')}}/><Text style={s.stickyHint}>Estimated delivered total · final price confirmed before payment</Text></View></View></ScreenShell>;
}

export function GlobalBasketScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) { const total=data.cart.reduce((sum,line)=>sum+line.quote.breakdown.total*line.quantity,0); return <ScreenShell><GlobalHeader actions={actions} title="Global Basket"/><ScrollView contentContainerStyle={s.page}>{data.cart.length?data.cart.map(line=>{const product=GLOBAL_PRODUCTS.find(item=>item.id===line.productId)!;return <View key={line.id} style={s.cartLine}><Image source={product.image} style={s.cartImage}/><View style={s.sourceCopy}><Text numberOfLines={2} style={s.productTitle}>{product.title}</Text><View style={s.cartSource}><MarketplaceLogo id={product.marketplace} compact/><Text style={s.meta}>{line.variant}</Text></View><Text style={s.price}>{formatMoney(data.country,line.quote.breakdown.total*line.quantity)}</Text><View style={s.quantity}><Pressable onPress={()=>actions.setLineQuantity(line.id,line.quantity-1)} style={s.qty}><Text>−</Text></Pressable><Text>{line.quantity}</Text><Pressable onPress={()=>actions.setLineQuantity(line.id,line.quantity+1)} style={s.qty}><Text>+</Text></Pressable></View></View></View>}):<View style={s.empty}><Text style={s.emptyTitle}>Your Global Basket is empty</Text><Text style={s.meta}>Explore products from supported international sources.</Text></View>}<View style={s.total}><Text style={s.heading}>Estimated delivered total</Text><Text style={s.detailPrice}>{formatMoney(data.country,total)}</Text><Text style={s.estimate}>Quotes are confirmed again before payment. Local and Global fulfilment remain separate.</Text></View>{data.cart.length?<PrimaryButton label={`Review Global checkout · ${formatMoney(data.country,total)}`} onPress={()=>actions.go('globalCheckout')}/>:<PrimaryButton label="Explore Kareebu Global" onPress={()=>actions.go('globalHome')}/>}</ScrollView></ScreenShell>; }

export function GlobalCheckoutScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) {
  const total=data.cart.reduce((sum,line)=>sum+line.quote.breakdown.total*line.quantity,0);
  const ugxEquivalent=data.country==='Kenya'?total*28:data.country==='Tanzania'?total*1.45:total;
  const risk=assessRisk({transactionValue:ugxEquivalent,globalPurchase:true,accountAgeDays:30,newDevice:false,newPaymentInstrument:false});
  const paymentRail:PaymentRail=/m-pesa/i.test(data.paymentMethod)?'mpesa':/airtel/i.test(data.paymentMethod)?'airtel_money':/mtn/i.test(data.paymentMethod)?'mtn_momo':'card';
  const procurementEnabled=featureEnabled(data.country,'global_procurement');
  return <ScreenShell><Header title="Review Global order" onBack={actions.back}/><ScrollView contentContainerStyle={s.page}>
    <Text style={s.heading}>Delivery</Text><View style={s.info}><Text style={s.trustTitle}>{data.deliveryAddress}, {data.country}</Text><Text style={s.meta}>International fulfilment followed by Kareebu local delivery.</Text></View>
    <Text style={s.heading}>Payment</Text><View style={s.info}><Text style={s.trustTitle}>{data.paymentMethod}</Text><Text style={s.meta}>Kareebu orchestrates the payment through the configured licensed provider. Fulfilment must wait for provider-side verification; a client callback is not treated as settlement proof.</Text></View>
    <Text style={s.heading}>Order protection</Text><View style={s.info}><Text style={s.trustTitle}>{risk.action==='allow'?'Standard checks':risk.action==='allow_monitor'?'Monitored order':'Verification may be required'}</Text><Text style={s.meta}>High-value or unusual Global purchases can be held for identity/payment review before Kareebu procures the item overseas. This protects the customer and Kareebu from account takeover and payment fraud.</Text></View>
    <Text style={s.heading}>Import & returns</Text><View style={s.info}><Text style={s.body}>Import costs use country-specific, effective-dated tariff rules. Uganda estimates distinguish customs cost, recoverable/creditable tax cash-flow and Kareebu commercial fees. Kenya and Tanzania require their own tariff provider before a payable quote is locked.</Text></View>
    <View style={s.total}><Text style={s.meta}>Estimated delivered total</Text><Text style={s.detailPrice}>{formatMoney(data.country,total)}</Text><Text style={s.estimate}>Source price, FX, shipping, tariff and availability are refreshed before payment confirmation.</Text></View>
    {!procurementEnabled?<View style={s.info}><Text style={s.trustTitle}>Global purchasing is temporarily unavailable</Text><Text style={s.meta}>Browsing and order tracking remain available. New international procurement is paused for this market by Kareebu's policy controls.</Text></View>:null}
    <PrimaryButton label={procurementEnabled?`Place Global order · ${formatMoney(data.country,total)}`:'Global purchasing paused'} disabled={!data.cart.length||!procurementEnabled} onPress={()=>{if(!procurementEnabled)return;const marketplace=GLOBAL_PRODUCTS.find(product=>product.id===data.cart[0]?.productId)?.marketplace??'amazon';const orderId=`KG-${String(Date.now()).slice(-7)}`;const payment=preparePaymentAttempt({country:data.country,amount:total,currency:data.cart[0]?.quote.currency??'UGX',rail:paymentRail,purpose:'global',orderId,riskDecisionId:risk.id,idempotencyKey:`${orderId}-${total}`});const held=['step_up','hold','manual_review','decline'].includes(risk.action);actions.placeOrder({id:orderId,marketplace,lines:data.cart,total,currency:data.cart[0]?.quote.currency??'UGX',status:held?'verification_hold':'order_confirmed',createdAt:new Date().toISOString(),deliveryAddress:data.deliveryAddress,paymentMethod:data.paymentMethod,source:'local-session',paymentAttemptId:payment.id,paymentState:payment.state,riskAction:risk.action,verificationState:held?'required':'not_required'});actions.go('globalTracking')}}/>
  </ScrollView></ScreenShell>;
}

const TIMELINE=['verification_hold','order_confirmed','retailer_processing','retailer_dispatched','hub_received','international_preparation','international_transit','customs','destination_arrival','local_delivery','delivered'];
export function GlobalTrackingScreen({data,actions}:{data:GlobalScreenData;actions:GlobalScreenActions}) { const order=data.order; const current=Math.max(0,TIMELINE.indexOf(order?.status??'order_confirmed')); return <ScreenShell><Header title="Global tracking" onBack={actions.back}/><ScrollView contentContainerStyle={s.page}>{order?<><View style={s.collectionHero}><MarketplaceLogo id={order.marketplace}/><Text style={s.eyebrow}>ORDER {order.id}</Text><Text style={s.collectionTitle}>{titleCase(order.status.replace(/_/g,' '))}</Text><Text style={s.heroBody}>{formatMoney(data.country,order.total)}</Text></View><View style={s.timeline}>{TIMELINE.map((state,index)=><View key={state} style={s.timelineRow}><View style={[s.timelineDot,index<=current&&s.timelineDotActive]}/><View style={s.sourceCopy}><Text style={[s.timelineTitle,index>current&&s.timelineFuture]}>{titleCase(state.replace(/_/g,' '))}</Text>{index===current?<Text style={s.meta}>Current order status</Text>:null}</View></View>)}</View><Pressable onPress={()=>actions.go('globalReturns')} style={s.link}><Text style={s.linkText}>Returns, refunds & support</Text><Feather name="chevron-right" size={20}/></Pressable></>:<View style={s.empty}><Text style={s.emptyTitle}>No Global order yet</Text><Text style={s.meta}>International orders and their journey appear here.</Text></View>}</ScrollView></ScreenShell>; }

export function GlobalReturnsScreen({actions}:{actions:GlobalScreenActions}) { return <ScreenShell><Header title="Global order support" onBack={actions.back}/><ScrollView contentContainerStyle={s.page}><Text style={s.heading}>International order help</Text>{['Cancel before retailer purchase','Retailer cancellation or price change','Damaged, wrong or lost item','Return eligibility review','Partial or retailer refund','Import rejection or delay'].map(item=><View key={item} style={s.info}><Text style={s.trustTitle}>{item}</Text><Text style={s.meta}>Eligibility and next steps come from the source seller, logistics status and Kareebu support review.</Text></View>)}<PrimaryButton label="Contact Kareebu support" onPress={()=>actions.go('support')}/></ScrollView></ScreenShell>; }

const s=StyleSheet.create({
  page:{padding:16,paddingBottom:130,gap:14},detailRoot:{flex:1},detailPage:{padding:16,paddingBottom:28,gap:14},listContent:{paddingHorizontal:16,paddingBottom:120},collectionHeader:{gap:14,paddingBottom:14},columns:{gap:12,marginBottom:12},
  headerAction:{width:40,height:40,borderRadius:14,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  hero:{minHeight:206,borderRadius:24,backgroundColor:COLORS.yellow,padding:20,overflow:'hidden',flexDirection:'row'},heroCopy:{flex:1,zIndex:2,maxWidth:'58%'},heroArt:{position:'absolute',width:190,height:190,right:-18,bottom:-12},eyebrow:{fontSize:11,fontFamily:FONT.bold,letterSpacing:1.3,color:COLORS.black},heroTitle:{fontSize:27,lineHeight:30,fontFamily:FONT.bold,color:COLORS.black,marginTop:8},heroBody:{fontSize:13,lineHeight:19,fontFamily:FONT.regular,color:COLORS.black,marginTop:8},
  search:{height:50,borderRadius:16,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',paddingHorizontal:15,gap:10,...SHADOW},searchInput:{flex:1,fontFamily:FONT.regular,fontSize:15,color:COLORS.black},sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},heading:{fontSize:20,fontFamily:FONT.bold,color:COLORS.black,marginTop:6},sectionMeta:{fontSize:12,fontFamily:FONT.regular,color:COLORS.muted},rail:{gap:10,paddingRight:16},
  marketplace:{width:154,height:108,borderRadius:18,backgroundColor:COLORS.white,padding:14,justifyContent:'space-between',...SHADOW},logo:{width:92,height:34},logoCompact:{width:48,height:18},logoFallback:{minWidth:92,height:34,borderRadius:10,backgroundColor:'#F2EFE8',alignItems:'center',justifyContent:'center',paddingHorizontal:8},logoFallbackCompact:{minWidth:48,height:18,borderRadius:6,paddingHorizontal:5},logoFallbackText:{fontSize:13,fontFamily:FONT.bold,color:COLORS.black},logoFallbackTextCompact:{fontSize:8},marketplaceAction:{fontSize:13,fontFamily:FONT.bold,color:COLORS.black},
  product:{backgroundColor:COLORS.white,borderRadius:18,padding:10,...SHADOW},productGrid:{flex:1,minWidth:0},productWide:{width:178},pressed:{transform:[{scale:.98}],opacity:.9},productImageWrap:{height:142,borderRadius:14,backgroundColor:'#F6F3EA',alignItems:'center',justifyContent:'center'},productImage:{width:'88%',height:'88%'},sourceBadge:{position:'absolute',left:7,top:7,backgroundColor:COLORS.white,borderRadius:10,paddingHorizontal:7,paddingVertical:5,...SHADOW},productBrandBadge:{position:'absolute',right:7,bottom:7,maxWidth:'72%',borderRadius:9,backgroundColor:'rgba(255,255,255,.9)',paddingHorizontal:7,paddingVertical:4},productBrandBadgeText:{fontSize:9,fontFamily:FONT.bold,color:COLORS.black},productTitle:{fontSize:14,lineHeight:18,fontFamily:FONT.bold,color:COLORS.black,marginTop:9,minHeight:36},sourcePrice:{fontSize:11,fontFamily:FONT.regular,color:COLORS.muted,marginTop:6},price:{fontSize:14,fontFamily:FONT.bold,color:COLORS.black,marginTop:3},estimate:{fontSize:11,lineHeight:16,fontFamily:FONT.regular,color:COLORS.muted,marginTop:2},meta:{fontSize:12,lineHeight:17,fontFamily:FONT.regular,color:COLORS.muted},
  categoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:9},category:{width:'48%',height:54,borderRadius:15,backgroundColor:'#F4F1E8',paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},categoryText:{fontSize:14,fontFamily:FONT.bold},howItWorks:{borderRadius:22,backgroundColor:'#FFF8D7',padding:18,gap:12},steps:{gap:10},step:{flexDirection:'row',alignItems:'center',gap:10},stepNumber:{width:28,height:28,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},stepNumberText:{fontFamily:FONT.bold},stepText:{fontSize:13,fontFamily:FONT.medium,color:COLORS.black},legalNote:{fontSize:11,lineHeight:16,fontFamily:FONT.regular,color:COLORS.muted},
  empty:{padding:24,borderRadius:18,backgroundColor:'#F7F5F0',alignItems:'center',gap:5},loadMore:{height:48,borderRadius:15,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:8,marginBottom:16},loadMoreText:{fontSize:14,fontFamily:FONT.bold,color:COLORS.black},emptyTitle:{fontSize:17,fontFamily:FONT.bold},
  breadcrumbRail:{gap:4,alignItems:'center',paddingRight:16},breadcrumbChip:{height:28,flexDirection:'row',alignItems:'center',gap:3},breadcrumbText:{fontSize:11,fontFamily:FONT.medium,color:COLORS.muted},breadcrumbCurrent:{fontSize:11,fontFamily:FONT.bold,color:COLORS.black,paddingHorizontal:4},
  collectionHero:{minHeight:190,borderRadius:24,backgroundColor:COLORS.yellow,padding:20,flexDirection:'row',alignItems:'center',overflow:'hidden'},collectionHeroCopy:{flex:1,zIndex:2,paddingRight:8},collectionHeroArt:{width:118,height:150,alignItems:'center',justifyContent:'center',marginRight:-4},collectionTitle:{fontSize:27,lineHeight:31,fontFamily:FONT.bold,color:COLORS.black},
  brandSection:{gap:10},brandChoiceRail:{gap:10,paddingRight:16},brandChoice:{width:190,minHeight:76,borderRadius:18,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,padding:10,flexDirection:'row',alignItems:'center',gap:9,...SHADOW},brandChoiceActive:{backgroundColor:'#FFF5C5',borderColor:'#EFCB37'},brandChoiceMark:{width:62,height:48,borderRadius:15,backgroundColor:'#F5F2EA',alignItems:'center',justifyContent:'center',paddingHorizontal:7},brandChoiceMarkActive:{backgroundColor:COLORS.yellow},brandChoiceMarkText:{fontSize:13,fontFamily:FONT.bold,color:COLORS.black,textAlign:'center'},brandChoiceCopy:{flex:1,minWidth:0},brandChoiceName:{fontSize:12,fontFamily:FONT.bold,color:COLORS.black},brandChoiceCount:{fontSize:10,fontFamily:FONT.regular,color:COLORS.muted,marginTop:2},
  collectionControls:{marginTop:2},chipRail:{gap:8,paddingRight:16},chip:{height:38,borderRadius:19,backgroundColor:'#F2EFE8',paddingHorizontal:14,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'transparent'},chipSelected:{backgroundColor:COLORS.yellow,borderColor:'#EFCB37'},chipText:{fontSize:12,fontFamily:FONT.medium,color:COLORS.black},chipTextSelected:{fontFamily:FONT.bold},filterButton:{height:38,borderRadius:19,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.lineDark,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:7},filterButtonActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},filterButtonText:{fontSize:12,fontFamily:FONT.bold,color:COLORS.black},filterButtonTextActive:{color:COLORS.white},
  filterPanel:{borderRadius:20,backgroundColor:'#F8F6F0',padding:15,gap:15,borderWidth:1,borderColor:COLORS.line},filterLabel:{fontSize:12,fontFamily:FONT.bold,color:COLORS.black,marginBottom:7},filterWrap:{flexDirection:'row',flexWrap:'wrap',gap:7},filterChoice:{minHeight:34,borderRadius:17,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:11,alignItems:'center',justifyContent:'center'},filterChoiceActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},filterChoiceText:{fontSize:11,fontFamily:FONT.medium,color:COLORS.black},filterChoiceTextActive:{fontFamily:FONT.bold,color:COLORS.white},clearFilters:{alignSelf:'flex-start',minHeight:34,borderRadius:17,backgroundColor:'#FFF0EC',paddingHorizontal:12,alignItems:'center',justifyContent:'center'},clearFiltersText:{fontSize:11,fontFamily:FONT.bold,color:'#B43724'},resultCount:{fontSize:12,fontFamily:FONT.regular,color:COLORS.muted},
  detailImage:{height:310,borderRadius:24,backgroundColor:'#F6F3EA',alignItems:'center',justifyContent:'center'},detailArt:{width:'88%',height:'88%'},imageCount:{position:'absolute',right:12,bottom:12,backgroundColor:'rgba(23,23,23,.78)',borderRadius:12,paddingHorizontal:9,paddingVertical:5},imageCountText:{fontSize:11,fontFamily:FONT.bold,color:COLORS.white},sourceIdentity:{minHeight:62,borderRadius:17,backgroundColor:COLORS.white,padding:13,flexDirection:'row',alignItems:'center',gap:12,...SHADOW},sourceCopy:{flex:1},detailTitle:{fontSize:25,lineHeight:30,fontFamily:FONT.bold},brand:{fontSize:14,fontFamily:FONT.medium,color:COLORS.muted},pricePanel:{borderRadius:20,backgroundColor:'#FFF8D7',padding:16,flexDirection:'row',alignItems:'center',gap:14},priceLabel:{fontSize:11,fontFamily:FONT.regular,color:COLORS.muted},sourcePriceLarge:{fontSize:17,fontFamily:FONT.bold,marginTop:3},priceDivider:{width:1,height:42,backgroundColor:'#E6DDAE'},deliveredPrice:{flex:1},detailPrice:{fontSize:22,fontFamily:FONT.bold,color:COLORS.black,marginTop:2},quoteStatus:{borderRadius:16,backgroundColor:COLORS.white,padding:13,flexDirection:'row',alignItems:'center',gap:10,...SHADOW},statusDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.yellow},refresh:{height:34,borderRadius:12,backgroundColor:'#F2EFE8',paddingHorizontal:10,flexDirection:'row',alignItems:'center',gap:6},refreshText:{fontSize:12,fontFamily:FONT.bold},notice:{fontSize:12,lineHeight:18,fontFamily:FONT.regular,color:COLORS.muted},deliveryDestination:{borderRadius:17,backgroundColor:'#F6F3EA',padding:14,flexDirection:'row',alignItems:'center',gap:10},variant:{minHeight:38,borderWidth:1,borderColor:COLORS.lineDark,borderRadius:13,paddingHorizontal:14,alignItems:'center',justifyContent:'center'},variantSelected:{borderColor:COLORS.black,backgroundColor:COLORS.yellow},variantText:{fontSize:13,fontFamily:FONT.medium},variantTextSelected:{fontFamily:FONT.bold},quantityRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},quantity:{flexDirection:'row',alignItems:'center',gap:14},qty:{width:34,height:34,borderRadius:17,backgroundColor:'#F2EFE8',alignItems:'center',justifyContent:'center'},qtyText:{fontSize:18,fontFamily:FONT.medium},quantityValue:{minWidth:20,textAlign:'center',fontFamily:FONT.bold},deliveryCard:{borderRadius:18,backgroundColor:'#FFF8D7',padding:16,flexDirection:'row',gap:12,alignItems:'flex-start'},accordion:{borderTopWidth:1,borderColor:COLORS.line},accordionHead:{minHeight:56,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},accordionBody:{gap:10,paddingBottom:16},trustTitle:{fontSize:14,fontFamily:FONT.bold,color:COLORS.black},body:{fontSize:13,lineHeight:19,fontFamily:FONT.regular,color:COLORS.black},breakdown:{gap:10},row:{flexDirection:'row',justifyContent:'space-between'},rowValue:{fontSize:13,fontFamily:FONT.bold},totalRow:{borderTopWidth:1,borderColor:COLORS.line,paddingTop:12,flexDirection:'row',justifyContent:'space-between'},totalValue:{fontSize:15,fontFamily:FONT.bold},specRow:{minHeight:32,flexDirection:'row',justifyContent:'space-between',gap:20},specValue:{flex:1,textAlign:'right',fontSize:13,fontFamily:FONT.medium},stickyCta:{padding:12,paddingBottom:10,backgroundColor:COLORS.white,borderTopWidth:1,borderColor:COLORS.line,...SHADOW},stickyHint:{fontSize:10,fontFamily:FONT.regular,color:COLORS.muted,textAlign:'center',marginTop:5},
  cartLine:{flexDirection:'row',gap:12,padding:12,borderRadius:18,backgroundColor:COLORS.white,...SHADOW},cartImage:{width:96,height:96,resizeMode:'contain',backgroundColor:'#F6F3EA',borderRadius:14},cartSource:{flexDirection:'row',alignItems:'center',gap:7},total:{borderRadius:20,backgroundColor:'#F6F3EA',padding:18,gap:4},info:{borderRadius:17,backgroundColor:'#F6F3EA',padding:16,gap:4},timeline:{backgroundColor:COLORS.white,borderRadius:20,padding:16,...SHADOW},timelineRow:{minHeight:58,flexDirection:'row',gap:12},timelineDot:{width:14,height:14,borderRadius:7,backgroundColor:'#D8D4CA',marginTop:2},timelineDotActive:{backgroundColor:COLORS.yellow,borderWidth:3,borderColor:COLORS.black},timelineTitle:{fontSize:14,fontFamily:FONT.bold,textTransform:'capitalize'},timelineFuture:{color:COLORS.muted},link:{minHeight:56,borderRadius:16,backgroundColor:'#F6F3EA',paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},linkText:{fontSize:14,fontFamily:FONT.bold},

  globalIntro:{borderRadius:20,backgroundColor:COLORS.yellow,padding:16,gap:4},globalIntroTitle:{fontSize:22,lineHeight:26,fontFamily:FONT.bold,color:COLORS.black},globalIntroBody:{fontSize:12,lineHeight:17,fontFamily:FONT.regular,color:COLORS.black},globalNavStrip:{marginHorizontal:-16,backgroundColor:'#202733',minHeight:42,justifyContent:'center'},globalNavContent:{paddingHorizontal:16,gap:8,alignItems:'center'},globalNavButton:{minHeight:42,paddingHorizontal:9,alignItems:'center',justifyContent:'center'},globalNavItem:{fontSize:12,fontFamily:FONT.bold,color:COLORS.white},heroSplit:{flexDirection:'row',gap:12},heroStack:{flex:1,gap:12},promoPanel:{minHeight:156,borderRadius:20,padding:16,overflow:'hidden',position:'relative'},promoPanelLarge:{flex:1,minHeight:236},promoCopy:{maxWidth:'62%',zIndex:2,gap:6},promoTitle:{fontSize:19,lineHeight:22,fontFamily:FONT.bold,color:COLORS.black},promoBody:{fontSize:12,lineHeight:17,fontFamily:FONT.medium,color:COLORS.black},promoImage:{position:'absolute',right:6,bottom:5,width:110,height:110},promoImageLarge:{position:'absolute',right:0,bottom:0,width:180,height:180},departmentGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},departmentTile:{width:'48%',minHeight:176,borderRadius:18,backgroundColor:COLORS.white,padding:14,overflow:'hidden',...SHADOW},departmentTitle:{fontSize:17,fontFamily:FONT.bold,color:COLORS.black},departmentSubtitle:{marginTop:5,fontSize:11,lineHeight:15,fontFamily:FONT.regular,color:COLORS.muted,maxWidth:'68%'},departmentImage:{position:'absolute',right:5,bottom:5,width:94,height:94},editorialGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},editorialBlock:{width:'48%',minHeight:162,borderRadius:18,backgroundColor:'#F6F3EA',padding:14,overflow:'hidden'},editorialTitle:{fontSize:17,fontFamily:FONT.bold,color:COLORS.black,paddingRight:24},editorialCta:{marginTop:6,fontSize:11,lineHeight:15,fontFamily:FONT.regular,color:COLORS.black,opacity:.72,maxWidth:'64%'},editorialImage:{position:'absolute',right:6,bottom:5,width:92,height:92},editorialArrow:{position:'absolute',right:12,top:13},dealSection:{gap:10},thumbnailRail:{gap:9,paddingRight:16},thumbnail:{width:72,height:72,borderRadius:15,backgroundColor:'#F6F3EA',borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',overflow:'hidden'},thumbnailActive:{borderColor:COLORS.black,backgroundColor:'#FFF8D7'},thumbnailImage:{width:'82%',height:'82%'},fixtureThumbMedia:{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'},fixtureThumbLabel:{position:'absolute',left:3,right:3,bottom:2,fontSize:7,lineHeight:9,textAlign:'center',fontFamily:FONT.bold,color:COLORS.black,backgroundColor:'rgba(255,255,255,.86)',borderRadius:4,paddingVertical:1},fixtureGalleryMedia:{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',overflow:'hidden'},galleryZoom:{transform:[{scale:1.35}]},galleryCallout:{position:'absolute',left:14,right:14,bottom:14,borderRadius:14,backgroundColor:'rgba(255,255,255,.94)',padding:11,...SHADOW},galleryCalloutTitle:{fontSize:13,fontFamily:FONT.bold,color:COLORS.black},galleryCalloutBody:{marginTop:3,fontSize:10,lineHeight:14,fontFamily:FONT.regular,color:COLORS.muted},galleryLabel:{position:'absolute',left:12,top:12,borderRadius:10,backgroundColor:'rgba(23,23,23,.76)',paddingHorizontal:8,paddingVertical:4},galleryLabelText:{fontSize:10,fontFamily:FONT.bold,color:COLORS.white},
  globalChildSection:{gap:12},
  globalChildIntro:{fontSize:12,lineHeight:17,fontFamily:FONT.regular,color:COLORS.muted,marginTop:-4},
  globalChildGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  globalChildCard:{width:'31.2%',minHeight:126,alignItems:'center'},
  globalBrandChildCard:{width:'48.5%',minHeight:104,alignItems:'stretch'},
  globalChildArt:{width:'100%',aspectRatio:1,borderRadius:18,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  globalBrandChildArt:{width:'100%',height:104,borderRadius:20,padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',overflow:'hidden',borderWidth:1,borderColor:'rgba(23,23,23,.05)'},
  globalBrandWordmark:{flex:1,minWidth:0},globalBrandWordmarkText:{fontSize:19,lineHeight:22,fontFamily:FONT.bold,color:COLORS.black},globalBrandCategoryText:{fontSize:10,fontFamily:FONT.medium,color:COLORS.muted,marginTop:5},globalBrandArrow:{width:34,height:34,borderRadius:12,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  globalChildTitle:{fontSize:12,lineHeight:15,fontFamily:FONT.bold,color:COLORS.black,textAlign:'center',marginTop:6},

});
