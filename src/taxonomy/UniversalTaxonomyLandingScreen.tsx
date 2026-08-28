import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryArtwork, KareebuPageHeader, KareebuSearchField, SectionTitle } from '../components';
import { CategoryLandingBanner } from '../components/CategoryLandingBanner';
import { categoryBannerFor, type CategoryBannerDomain } from '../assets/categoryBannerResolver';
import { SellerLogo } from '../commerce/SellerLogo';
import { commerceProductVisual } from '../commerce/productVisuals';
import type { CategoryProduct, CategorySeller } from '../categoryLanding/types';
import type { PromotionCampaign } from '../promotions/types';
import { PromotionSurface } from '../promotions/PromotionSurface';
import { SquarePromotionCarousel } from '../promotions/SquarePromotionCarousel';
import {
  mainPromotionalBannerForCategory,
  promotionalAssetsFor,
} from '../promotions/promotionalContentRegistry';
import { searchContextForVertical } from '../search/context';
import { COLORS, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import type { TaxonomyNode } from './types';

const TONES = [COLORS.yellowWash, '#FFF0EE', '#EEF4FA', '#EFF9F2', '#F7F3EA'];
type SortMode = 'relevant' | 'price' | 'name';

export type TaxonomyExperience = {
  id: string;
  name: string;
  subtitle: string;
  image?: any;
  fallbackImage: any;
  rating?: number;
};

type Props = {
  node: TaxonomyNode;
  ancestors: TaxonomyNode[];
  children: TaxonomyNode[];
  sellers: CategorySeller[];
  products: CategoryProduct[];
  experiences?: TaxonomyExperience[];
  country: string;
  city: string;
  marketplaceId?: string | null;
  sellerId?: string;
  onBack: () => void;
  onOpenChild: (node: TaxonomyNode) => void;
  onOpenSeller: (id: string) => void;
  onOpenProduct: (id: string) => void;
  onOpenExperience?: (id: string) => void;
  onOpenPromotion?: (campaign: PromotionCampaign) => void;
};

const ProductTile = memo(function ProductTile({ item, onPress }:{ item:CategoryProduct; onPress:()=>void }) {
  const visual=commerceProductVisual({id:item.id,name:item.title,brand:item.brand,detail:item.pack,imageKey:item.visualKey});
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.title}`} onPress={onPress} style={({pressed})=>[styles.product,pressed&&styles.pressed]}>
    <View style={[styles.productArt,{backgroundColor:visual.background}]}>{item.image||visual.image?<Image source={item.image??visual.image} resizeMode="cover" style={styles.productImage}/>:<View style={{width:96,height:96,borderRadius:16,backgroundColor:'#F4F1EB'}}/>}</View>
    {item.brand?<Text numberOfLines={1} style={styles.brand}>{item.brand}</Text>:null}
    <Text numberOfLines={2} style={styles.productTitle}>{item.title}</Text>
    <Text numberOfLines={1} style={styles.meta}>{item.pack??'Details at seller'}</Text>
    <View style={styles.productFooter}><Text style={styles.price}>{item.isLivePrice&&item.referencePrice?`${item.currency} ${item.referencePrice.toLocaleString()}`:'Price at seller'}</Text><View style={styles.add}><Feather name="plus" size={18} color={COLORS.black}/></View></View>
  </Pressable>;
});

const ChildCard = memo(function ChildCard({node,index,onPress,grid=false}:{node:TaxonomyNode;index:number;onPress:()=>void;grid?:boolean}){
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${node.title}`} onPress={onPress} style={({pressed})=>[styles.child,grid&&styles.childGridCard,pressed&&styles.pressed]}>
    <View style={[styles.childArt,{backgroundColor:TONES[index%TONES.length]}]}><CategoryArtwork visualKey={node.visualKey} size="large"/></View>
    <Text numberOfLines={2} style={styles.childTitle}>{node.title}</Text>
    <View style={styles.childAction}><Text style={styles.childActionText}>Browse</Text><Feather name="chevron-right" size={12} color={COLORS.muted}/></View>
  </Pressable>;
});

const ExperienceTile = memo(function ExperienceTile({item,onPress}:{item:TaxonomyExperience;onPress:()=>void}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.name}`} onPress={onPress} style={({pressed})=>[styles.experience,pressed&&styles.pressed]}>
    <Image source={item.image??item.fallbackImage} resizeMode={item.image?'cover':'contain'} style={item.image?styles.experiencePhoto:styles.experienceFallback}/>
    <Text numberOfLines={2} style={styles.experienceTitle}>{item.name}</Text>
    <Text numberOfLines={1} style={styles.meta}>{item.subtitle}</Text>
    {item.rating!==undefined?<Text style={styles.experienceRating}>★ {item.rating.toFixed(1)}</Text>:null}
  </Pressable>;
});

function BrandCard({brand,count,active,onPress}:{brand:string;count:number;active:boolean;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} accessibilityLabel={`${brand}, ${count} products`} onPress={onPress} style={[styles.brandCard,active&&styles.brandCardActive]}>
    <View style={[styles.brandWordmark,active&&styles.brandWordmarkActive]}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={.62} style={[styles.brandWordmarkText,active&&styles.brandWordmarkTextActive]}>{brand}</Text></View>
    <View style={styles.brandCardCopy}><Text style={[styles.brandCount,active&&styles.brandCountActive]}>{count} {count===1?'item':'items'}</Text><Text style={[styles.brandBrowse,active&&styles.brandBrowseActive]}>Shop brand →</Text></View>
  </Pressable>;
}

function SortChip({label,active,onPress}:{label:string;active:boolean;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} onPress={onPress} style={[styles.sortChip,active&&styles.sortChipActive]}><Text style={[styles.sortChipText,active&&styles.sortChipTextActive]}>{label}</Text></Pressable>;
}

function sectionTitle(node:TaxonomyNode){
  if(node.type==='marketplace')return 'Shop by department';
  if(node.domain==='groceries'&&/vegetables/i.test(node.title))return 'Shop vegetables by type';
  if(node.domain==='electronics'&&/phone|smartphone/i.test(node.title))return 'Shop phones by type';
  if(node.domain==='pharmacy')return `Shop ${node.title.toLowerCase()} by need`;
  if(node.type==='vertical')return node.domain==='groceries'?'Shop grocery departments':node.domain==='electronics'?'Shop electronics':node.domain==='fashion'?'Shop fashion':node.domain==='beauty'?'Shop beauty':node.domain==='pets'?'Shop pet supplies':'Shop departments';
  return `Explore ${node.title}`;
}

function sectionIntro(node:TaxonomyNode){
  if(node.domain==='groceries'&&/vegetables/i.test(node.title))return 'Choose the vegetables you need, then compare the products available in that aisle.';
  if(node.domain==='electronics'&&/phone|smartphone/i.test(node.title))return 'Narrow the range before comparing brands, specifications and prices.';
  if(node.domain==='pharmacy')return 'Browse by health or personal-care need, then continue into the most relevant aisle.';
  if(node.domain==='fashion')return 'Start with the department that matches who or what you are shopping for.';
  if(node.domain==='beauty')return 'Browse by routine, product type or beauty category.';
  return `Browse the most useful sections of ${node.title}.`;
}

function sellerSectionCopy(node:TaxonomyNode){
  if(node.domain==='pharmacy')return 'Browse pharmacies serving this category. Stock, price and delivery details are confirmed in the storefront.';
  if(node.domain==='groceries')return 'Open a store and keep browsing inside this department.';
  return 'Choose a seller to continue shopping without losing this category.';
}

export function UniversalTaxonomyLandingScreen({node,ancestors,children,sellers,products,experiences=[],country,city,sellerId,onBack,onOpenChild,onOpenSeller,onOpenProduct,onOpenExperience,onOpenPromotion}:Props){
  const insets=useSafeAreaInsets();
  const [query,setQuery]=useState('');
  const [brandFilter,setBrandFilter]=useState<string|null>(null);
  const [sort,setSort]=useState<SortMode>('relevant');
  const uniqueChildren=useMemo(()=>[...new Map(children.map(child=>[child.id,child])).values()],[children]);
  const search=useMemo(()=>searchContextForVertical(node.domain==='global'?'shops':node.domain==='goout'||node.domain==='dineout'||node.domain==='services'?'shops':node.domain,node.searchPlaceholder,{market:country,city,category:node.id}),[city,country,node]);
  const productSource=useMemo(()=>uniqueChildren.length?products.slice(0,8):products,[products,uniqueChildren.length]);
  const brandCounts=useMemo(()=>{
    const counts=new Map<string,number>();
    products.forEach(item=>{if(item.brand)counts.set(item.brand,(counts.get(item.brand)??0)+1)});
    return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12);
  },[products]);
  const filtered=useMemo(()=>{
    const term=query.trim().toLowerCase();
    const unique=[...new Map(productSource.map(item=>[item.id,item])).values()]
      .filter(item=>(!brandFilter||item.brand===brandFilter)&&(!term||`${item.title} ${item.brand??''} ${item.pack??''}`.toLowerCase().includes(term)));
    if(sort==='name')unique.sort((a,b)=>a.title.localeCompare(b.title));
    if(sort==='price')unique.sort((a,b)=>{
      const ap=a.isLivePrice&&a.referencePrice!==undefined?a.referencePrice:Number.POSITIVE_INFINITY;
      const bp=b.isLivePrice&&b.referencePrice!==undefined?b.referencePrice:Number.POSITIVE_INFINITY;
      return ap-bp||a.title.localeCompare(b.title);
    });
    return unique;
  },[brandFilter,productSource,query,sort]);
  const renderChild=useCallback(({item,index}:{item:TaxonomyNode;index:number})=><ChildCard node={item} index={index} onPress={()=>onOpenChild(item)}/>,[onOpenChild]);
  const renderProduct=useCallback(({item}:{item:CategoryProduct})=><ProductTile item={item} onPress={()=>onOpenProduct(item.id)}/>,[onOpenProduct]);
  const breadcrumb=ancestors.length?ancestors.slice(-3).map(item=>item.shortTitle??item.title).join('  ›  '):'';
  const canSortPrice=products.some(item=>item.isLivePrice&&item.referencePrice!==undefined);
  const useChildGrid=uniqueChildren.length>0&&(node.type==='vertical'||node.type==='department'||node.type==='marketplace'||uniqueChildren.length<=9);
  const squarePromotions=useMemo(()=>promotionalAssetsFor({type:'square-promotion',category:node.domain,placement:node.type==='vertical'?'category-landing':'subcategory-landing'}),[node.domain,node.type]);
  const squareTargets=useMemo(()=>squarePromotions.map(asset=>({asset,target:uniqueChildren.find(child=>child.id===asset.destination.categoryId||child.id.endsWith(`.${asset.destination.categoryId}`))})).filter((entry):entry is {asset:(typeof squarePromotions)[number];target:TaxonomyNode}=>Boolean(entry.target)),[squarePromotions,uniqueChildren]);
  const metricItems=[
    uniqueChildren.length?`${uniqueChildren.length} ${uniqueChildren.length===1?'category':'categories'}`:null,
    brandCounts.length?`${brandCounts.length} ${brandCounts.length===1?'brand':'brands'}`:null,
    sellers.length?`${sellers.length} ${sellers.length===1?'seller':'sellers'}`:null,
  ].filter((value):value is string=>Boolean(value));
  const sellerSection=sellers.length?<View style={styles.section}><SectionTitle title={node.domain==='pharmacy'?'Pharmacies to shop':node.domain==='groceries'?'Stores in this category':'Stores & sellers'}/><Text style={styles.sectionBody}>{sellerSectionCopy(node)}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{sellers.map(seller=><Pressable key={seller.id} accessibilityRole="button" accessibilityLabel={`Open ${seller.name}`} onPress={()=>onOpenSeller(seller.id)} style={styles.seller}><View style={styles.sellerLogo}>{seller.logo?<Image source={seller.logo} resizeMode="contain" style={styles.logoImage}/>:<SellerLogo name={seller.name}/>}</View><Text numberOfLines={2} style={styles.sellerName}>{seller.name}</Text><Text numberOfLines={1} style={styles.meta}>{seller.subtitle??'Browse seller'}</Text><Text numberOfLines={1} style={styles.sellerState}>{seller.liveAvailability?'Current availability supplied by seller':'Reference seller · confirm availability'}</Text></Pressable>)}</ScrollView></View>:null;

  const bannerDomain:CategoryBannerDomain|undefined=node.domain==='groceries'||node.domain==='pharmacy'||node.domain==='electronics'||node.domain==='fashion'||node.domain==='beauty'||node.domain==='goout'?node.domain:undefined;
  const landingBanner=bannerDomain
    ? categoryBannerFor({domain:bannerDomain,id:node.id,title:node.title})
    : node.type==='vertical'
      ? mainPromotionalBannerForCategory(node.domain)
      : undefined;
  const bannerTargetLabel=uniqueChildren[0]?.title??experiences[0]?.name??sellers[0]?.name??products[0]?.title;
  const openBannerTarget=uniqueChildren[0]?()=>onOpenChild(uniqueChildren[0]):experiences[0]&&onOpenExperience?()=>onOpenExperience(experiences[0]!.id):sellers[0]?()=>onOpenSeller(sellers[0]!.id):products[0]?()=>onOpenProduct(products[0]!.id):undefined;
  const experienceDomain=node.domain==='goout'||node.domain==='dineout';
  const emptyTitle=experienceDomain?'No places are listed here yet':uniqueChildren.length?'Choose a category to continue':'More inventory will appear here';
  const emptyBody=experienceDomain?'Places and experiences will appear here when catalogue data is available for your market.':uniqueChildren.length?'Choose a category above to narrow your search.':'Products will appear here as they become available in your market.';

  const header=<View>
    {landingBanner&&openBannerTarget?<View style={styles.bannerWrap}><CategoryLandingBanner banner={landingBanner} onPress={openBannerTarget} accessibilityLabel={`${landingBanner.accessibilityLabel} Opens ${bannerTargetLabel}.`}/><Text style={styles.bannerContext}>{node.description}</Text>{metricItems.length?<View style={styles.approvedMetrics}>{metricItems.map(item=><View key={item} style={styles.metricPill}><Text style={styles.metricText}>{item}</Text></View>)}</View>:null}</View>:<View style={styles.intro}>
      {breadcrumb?<View style={styles.breadcrumbPill}><Text numberOfLines={1} style={styles.breadcrumb}>{breadcrumb}</Text></View>:null}
      <View style={styles.introRow}><View style={styles.introCopy}><Text style={styles.eyebrow}>{node.type.replace(/_/g,' ').toUpperCase()}</Text><Text style={styles.title}>{node.title}</Text><Text style={styles.subtitle}>{node.description}</Text>{metricItems.length?<View style={styles.metrics}>{metricItems.map(item=><View key={item} style={styles.metricPill}><Text style={styles.metricText}>{item}</Text></View>)}</View>:null}</View><View style={styles.heroArt}><CategoryArtwork visualKey={node.visualKey} size="hero"/></View></View>
    </View>}
    <View style={styles.search}><KareebuSearchField context={search} value={query} onChangeText={setQuery} elevated={false}/></View>

    {!landingBanner&&onOpenPromotion?<View style={styles.section}><PromotionSurface service={node.promotionService} placement={node.heroPlacement??'LANDING_HERO'} country={country} city={city} categoryId={node.id} subcategoryId={node.parentId} sellerId={sellerId} nodeId={node.id} nodeType={node.type} layout="compact" onPress={onOpenPromotion}/></View>:null}

    {uniqueChildren.length?<View style={styles.section}><SectionTitle title={sectionTitle(node)}/><Text style={styles.sectionBody}>{sectionIntro(node)}</Text>{useChildGrid?<View style={styles.childGrid}>{uniqueChildren.map((item,index)=><View key={`${node.id}:${item.id}`} style={styles.childGridItem}><ChildCard node={item} index={index} grid onPress={()=>onOpenChild(item)}/></View>)}</View>:<FlatList horizontal data={uniqueChildren} keyExtractor={item=>`${node.id}:${item.id}`} renderItem={renderChild} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childRail} initialNumToRender={6} maxToRenderPerBatch={5} windowSize={5} removeClippedSubviews/>}</View>:null}

    {squareTargets.length?<View style={styles.section}><SectionTitle title="Fresh picks"/><SquarePromotionCarousel assets={squareTargets.map(entry=>entry.asset)} onPress={asset=>{const entry=squareTargets.find(candidate=>candidate.asset.id===asset.id);if(entry)onOpenChild(entry.target)}}/></View>:null}

    {onOpenPromotion?<View style={styles.section}><PromotionSurface service={node.promotionService} placement={node.inlinePlacement??'LANDING_INLINE_1'} country={country} city={city} categoryId={node.id} subcategoryId={node.parentId} sellerId={sellerId} nodeId={node.id} nodeType={node.type} layout="compact" onPress={onOpenPromotion}/></View>:null}

    {sellerSection}

    {experiences.length?<View style={styles.section}><SectionTitle title={node.domain==='dineout'?'Places to eat':node.domain==='goout'?'Experiences & places':'Featured places'}/><Text style={styles.sectionBody}>Photography-led places and experiences relevant to this destination.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>{experiences.slice(0,8).map(item=><ExperienceTile key={item.id} item={item} onPress={()=>onOpenExperience?.(item.id)}/>)}</ScrollView></View>:null}

    {brandCounts.length>=2?<View style={styles.section}><SectionTitle title="Shop by brand"/><Text style={styles.sectionBody}>Choose a brand to narrow this selection. Tap the selected brand again to see everything.</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRail}>{brandCounts.map(([brand,count])=><BrandCard key={brand} brand={brand} count={count} active={brandFilter===brand} onPress={()=>setBrandFilter(current=>current===brand?null:brand)}/>)}</ScrollView></View>:null}

    {products.length||(!experiences.length&&node.domain!=='goout'&&node.domain!=='dineout')?<View style={styles.productSectionHeader}><View style={styles.productHeadingRow}><View style={styles.flex}><SectionTitle title={uniqueChildren.length?`Featured in ${node.title}`:`Shop ${node.title}`}/><Text style={styles.sectionBody}>{filtered.length} {filtered.length===1?'product':'products'}{brandFilter?` · ${brandFilter}`:''}. {uniqueChildren.length?'Choose a category above for a more focused selection.':'Compare the products available in this section.'}</Text></View></View>{products.length?<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRail}><SortChip label="Relevant" active={sort==='relevant'} onPress={()=>setSort('relevant')}/>{canSortPrice?<SortChip label="Lowest price" active={sort==='price'} onPress={()=>setSort('price')}/>:null}<SortChip label="A–Z" active={sort==='name'} onPress={()=>setSort('name')}/>{brandFilter?<SortChip label="Clear brand" active={false} onPress={()=>setBrandFilter(null)}/>:null}</ScrollView>:null}</View>:null}
  </View>;

  return <View style={styles.root}><KareebuPageHeader title={node.shortTitle??node.title} country={country} city={city} locationEnabled={false} onBack={onBack}/><FlatList data={filtered} numColumns={2} keyExtractor={item=>`${node.id}:${item.id}`} renderItem={renderProduct} columnWrapperStyle={styles.columns} ListHeaderComponent={header} contentContainerStyle={{paddingBottom:Math.max(insets.bottom,20)+40}} ListEmptyComponent={products.length?<View style={styles.empty}><Ionicons name="options-outline" size={36}/><Text style={styles.emptyTitle}>Nothing matches these filters</Text><Text style={styles.emptyBody}>Clear the brand or search term, or choose another subcategory.</Text></View>:<View style={styles.empty}><Ionicons name={experienceDomain?'compass-outline':'search-outline'} size={36}/><Text style={styles.emptyTitle}>{emptyTitle}</Text><Text style={styles.emptyBody}>{emptyBody}</Text></View>} initialNumToRender={8} maxToRenderPerBatch={6} windowSize={7} removeClippedSubviews/></View>;
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.surface},flex:{flex:1},pressed:{opacity:.78,transform:[{scale:.98}]},
  bannerWrap:{margin:SPACE.lg,gap:SPACE.sm},bannerContext:{...TYPE.small,color:COLORS.muted,lineHeight:18},approvedHero:{margin:SPACE.lg,gap:SPACE.sm},approvedMetrics:{flexDirection:'row',flexWrap:'wrap',gap:6},
  intro:{margin:SPACE.lg,borderRadius:28,backgroundColor:COLORS.yellow,padding:SPACE.lg,overflow:'hidden',...SHADOW},
  breadcrumbPill:{alignSelf:'flex-start',maxWidth:'92%',borderRadius:13,backgroundColor:'rgba(255,255,255,.72)',paddingHorizontal:9,paddingVertical:5,marginBottom:SPACE.sm},
  breadcrumb:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},introRow:{flexDirection:'row',alignItems:'center',gap:SPACE.sm},introCopy:{flex:1,zIndex:2},heroArt:{width:142,height:142,alignItems:'center',justifyContent:'center',marginRight:-8},
  eyebrow:{...TYPE.caption,fontWeight:'900',letterSpacing:.8,color:COLORS.black,opacity:.62},title:{...TYPE.screenTitle,fontSize:30,lineHeight:34,color:COLORS.black,marginTop:4},subtitle:{...TYPE.small,color:'#3E3A29',lineHeight:19,marginTop:7,maxWidth:225},
  metrics:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:12},metricPill:{borderRadius:12,backgroundColor:'rgba(255,255,255,.78)',paddingHorizontal:8,paddingVertical:5},metricText:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  search:{paddingHorizontal:SPACE.lg,paddingBottom:SPACE.lg},section:{paddingHorizontal:SPACE.lg,paddingBottom:SPACE.xl},sectionBody:{...TYPE.small,color:COLORS.muted,marginTop:4,marginBottom:SPACE.md,lineHeight:18},
  childRail:{gap:SPACE.md,paddingRight:SPACE.xl,paddingBottom:2},childGrid:{flexDirection:'row',flexWrap:'wrap',gap:10},childGridItem:{width:'31.3%'},child:{width:132,minHeight:174,borderRadius:22,backgroundColor:COLORS.white,padding:8,...SHADOW},childGridCard:{width:'100%',minHeight:148,borderRadius:19},childArt:{width:'100%',aspectRatio:1,borderRadius:16,alignItems:'center',justifyContent:'center',overflow:'hidden'},childTitle:{...TYPE.small,fontSize:13.5,lineHeight:17,color:COLORS.black,fontWeight:'900',textAlign:'left',marginTop:8},childAction:{flexDirection:'row',alignItems:'center',gap:2,marginTop:4},childActionText:{...TYPE.caption,color:COLORS.muted,fontWeight:'700'},
  rail:{gap:SPACE.md,paddingRight:SPACE.lg},seller:{width:176,minHeight:204,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,padding:SPACE.sm,...SHADOW},sellerLogo:{height:92,borderRadius:RADIUS.md,backgroundColor:COLORS.yellowWash,overflow:'hidden',alignItems:'center',justifyContent:'center'},logoImage:{width:'82%',height:'82%'},sellerName:{...TYPE.cardTitle,marginTop:SPACE.sm},sellerState:{...TYPE.caption,color:COLORS.muted,marginTop:7,fontWeight:'700'},meta:{...TYPE.caption,color:COLORS.muted,marginTop:3},
  brandRail:{gap:10,paddingRight:SPACE.xl},brandCard:{width:164,minHeight:94,borderRadius:20,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,padding:11,justifyContent:'space-between'},brandCardActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},brandWordmark:{height:40,borderRadius:13,backgroundColor:COLORS.yellowSoft,paddingHorizontal:9,alignItems:'center',justifyContent:'center'},brandWordmarkActive:{backgroundColor:COLORS.yellow},brandWordmarkText:{fontSize:17,lineHeight:20,fontWeight:'900',color:COLORS.black,textAlign:'center'},brandWordmarkTextActive:{color:COLORS.black},brandCardCopy:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:8,marginTop:8},brandCount:{...TYPE.caption,color:COLORS.muted},brandCountActive:{color:'#C9C9C9'},brandBrowse:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},brandBrowseActive:{color:COLORS.yellow},
  productSectionHeader:{paddingHorizontal:SPACE.lg,paddingBottom:SPACE.md},productHeadingRow:{flexDirection:'row',alignItems:'flex-start'},sortRail:{gap:8,paddingBottom:4,paddingRight:SPACE.lg},sortChip:{height:36,borderRadius:18,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:13,alignItems:'center',justifyContent:'center'},sortChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},sortChipText:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},sortChipTextActive:{color:COLORS.white},
  columns:{paddingHorizontal:SPACE.lg,gap:SPACE.md},product:{flex:1,maxWidth:'48.5%',minHeight:260,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,marginBottom:SPACE.md,...SHADOW},productArt:{height:132,borderRadius:RADIUS.md,alignItems:'center',justifyContent:'center'},productImage:{width:116,height:116},brand:{...TYPE.caption,color:COLORS.muted,fontWeight:'800',textTransform:'uppercase',marginTop:SPACE.sm},productTitle:{...TYPE.cardTitle,marginTop:4},productFooter:{marginTop:'auto',paddingTop:SPACE.sm,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},price:{...TYPE.caption,fontWeight:'800',color:COLORS.muted},add:{width:36,height:36,borderRadius:12,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  empty:{margin:SPACE.xl,padding:SPACE.xl,alignItems:'center',backgroundColor:COLORS.yellowWash,borderRadius:RADIUS.lg},emptyTitle:{...TYPE.sectionTitle,textAlign:'center',marginTop:SPACE.sm},emptyBody:{...TYPE.body,color:COLORS.muted,textAlign:'center',marginTop:5},
  experience:{width:230,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,...SHADOW},experiencePhoto:{width:'100%',height:142,borderRadius:RADIUS.md},experienceFallback:{width:'100%',height:142,borderRadius:RADIUS.md,backgroundColor:COLORS.yellowWash},experienceTitle:{...TYPE.cardTitle,marginTop:SPACE.sm},experienceRating:{...TYPE.caption,fontWeight:'900',color:COLORS.black,marginTop:4},
});
