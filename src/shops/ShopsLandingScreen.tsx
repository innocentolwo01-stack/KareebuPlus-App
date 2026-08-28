import React, { memo, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { CategoryArtwork, KareebuPageHeader, ScreenShell, SectionTitle } from '../components';
import { COLORS, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import { PromoCarousel } from '../promotions/PromoCarousel';
import { promotionalBannerAssets } from '../promotions/promotionalBannerAssets';
import type { PromotionCampaign } from '../promotions/types';
import type { DemoShop } from '../demoData';
import type { Screen } from '../types';
import { SellerLogo } from '../commerce/SellerLogo';
import { commerceProductsFor } from '../commerce/catalog';
import { commerceProductVisual } from '../commerce/productVisuals';
import { MerchantCampaignBanner } from '../commerce/MerchantCampaignBanner';
import { searchContext } from '../search/context';

export type ShopAvailability='open'|'closed'|'temporarily-unavailable'|'unknown';
export type ShopVerticalTile={id:string;label:string;description:string;visualKey:string;screen:Screen};

const VERTICALS:ShopVerticalTile[]=[
  {id:'pharmacy',label:'Pharmacy',description:'Medicine & wellness',visualKey:'shops.pharmacy',screen:'pharmacyHome'},
  {id:'gifts',label:'Gifts & Flowers',description:'Flowers, gifts & hampers',visualKey:'shops.giftsFlowers',screen:'giftsFlowersHome'},
  {id:'groceries',label:'Supermarket',description:'Groceries & essentials',visualKey:'shops.supermarket',screen:'groceries'},
  {id:'butchery',label:'Butchery & Seafood',description:'Fresh cuts & fish',visualKey:'shops.butcherySeafood',screen:'butcherySeafoodHome'},
  {id:'pets',label:'Pet Supplies',description:'Food, toys & care',visualKey:'shops.petSupplies',screen:'petStoresHome'},
  {id:'beauty',label:'Health & Beauty',description:'Beauty & personal care',visualKey:'shops.healthBeauty',screen:'beautyHome'},
  {id:'electronics',label:'Electronics',description:'Phones, tech & appliances',visualKey:'electronics.phones',screen:'electronicsHome'},
  {id:'fashion',label:'Fashion',description:'Clothing & accessories',visualKey:'fashion.women',screen:'fashionHome'},
  {id:'home',label:'Home',description:'Kitchen, décor & storage',visualKey:'home.decor',screen:'homeShoppingHome'},
];

function availabilityFor(shop:DemoShop):ShopAvailability {
  return shop.contentTrust?.liveAvailability?'open':'unknown';
}

export const ShopSellerRow=memo(function ShopSellerRow({shop,onPress}:{shop:DemoShop;onPress:()=>void}){
  const state=availabilityFor(shop);
  const disabled=state==='temporarily-unavailable';
  const label=state==='open'?'Open':state==='closed'?'Closed':state==='temporarily-unavailable'?'Temporarily unavailable':'Check availability';
  return <Pressable accessibilityRole="button" accessibilityLabel={`${shop.name}. ${label}.`} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[styles.sellerRow,state==='closed'&&styles.muted,pressed&&styles.pressed]}>
    <View style={styles.sellerImage}><SellerLogo name={shop.name}/></View>
    <View style={styles.flex}><Text numberOfLines={1} style={styles.sellerName}>{shop.name}</Text><Text numberOfLines={1} style={styles.meta}>{state==='open'?`${shop.category} · ★ ${shop.rating.toFixed(1)} (${shop.reviews??'New'})`:`${shop.category} · Reference listing`}</Text><Text style={[styles.availability,state==='closed'&&styles.closed]}>{label}{state==='open'?` · ${shop.eta}`:''}</Text></View>
    <Feather name="chevron-right" size={20} color={COLORS.muted}/>
  </Pressable>;
});


const VerticalTile=memo(function VerticalTile({item,onPress}:{item:ShopVerticalTile;onPress:()=>void}){
  return <Pressable accessibilityRole="button" accessibilityLabel={`${item.label}. ${item.description}`} onPress={onPress} style={({pressed})=>[styles.verticalTile,pressed&&styles.pressed]}>
    <View style={styles.verticalArt}><CategoryArtwork visualKey={item.visualKey} size="large"/></View>
    <Text numberOfLines={1} style={styles.verticalLabel}>{item.label}</Text><Text numberOfLines={1} style={styles.verticalDescription}>{item.description}</Text>
  </Pressable>;
});

export function ShopsLandingScreen({country,city,shops,onGo,onOpenShop,onLocation}:{country:string;city:string;shops:DemoShop[];onGo:(screen:Screen)=>void;onOpenShop:(id:string)=>void;onLocation:()=>void}){
  const [query,setQuery]=useState('');
  const filtered=useMemo(()=>{const term=query.trim().toLowerCase();return term?shops.filter(shop=>`${shop.name} ${shop.category} ${shop.inventoryHint??''}`.toLowerCase().includes(term)):shops;},[query,shops]);
  const hero=useMemo<PromotionCampaign[]>(()=>{
    return [{id:`shops-${country}-hero`,cmsSlot:'SHOPS_HERO',slot:'hero',service:'shops',campaign:'shops-local',headline:`Fresh finds around ${city}`,body:'Browse local shops and marketplace discovery.',image:promotionalBannerAssets.marketplace.primary,imageOnly:true,backgroundTreatment:'photo',ctaLabel:'Browse shops',ctaScreen:'allStores',priority:100,country,city,enabled:true}];
  }, [city,country]);
  const secondary=useMemo<PromotionCampaign[]>(()=>[{id:`shops-${country}-promo-02`,cmsSlot:'SHOPS_PROMO_02',slot:'secondary',service:'shops',campaign:'shops-editorial',headline:`Shopping around ${city}`,body:'Open a store to browse its catalogue.',image:promotionalBannerAssets.marketplace.secondary,imageOnly:true,backgroundTreatment:'photo',ctaLabel:'See all shops',ctaScreen:'allStores',priority:80,country,city,enabled:true}], [city,country]);
  const columns=useMemo(()=>{const result:ShopVerticalTile[][]=[];for(let i=0;i<VERTICALS.length;i+=2)result.push(VERTICALS.slice(i,i+2));return result;},[]);
  return <ScreenShell>
    <KareebuPageHeader title="Deliver to" country={country} city={city} locationEnabled onLocationPress={onLocation} searchEnabled searchContext={searchContext('shops',{market:country,city})} searchValue={query} onSearchChange={setQuery} rightIcon="menu-outline" rightLabel="Browse shop categories" onRightAction={()=>onGo('categories')}/>
    <FlatList data={filtered} keyExtractor={item=>item.id} renderItem={({item})=><ShopSellerRow shop={item} onPress={()=>onOpenShop(item.id)}/>} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false} initialNumToRender={8} maxToRenderPerBatch={6} windowSize={7} ListHeaderComponent={<View style={styles.headerModules}>
      <PromoCarousel campaigns={hero} onPress={campaign=>onGo(campaign.ctaScreen)}/>
      <View><SectionTitle title="Recommended shops" action="See all" onAction={()=>onGo('allStores')}/><Text style={styles.subtitle}>Recognisable sellers for this market · availability is not live</Text><FlatList horizontal data={shops.slice(0,6)} keyExtractor={item=>`recommended-${item.id}`} renderItem={({item})=><Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.name}`} onPress={()=>onOpenShop(item.id)} style={styles.logoCard}><View style={styles.logoImage}><SellerLogo name={item.name}/></View><Text numberOfLines={2} style={styles.logoName}>{item.name}</Text></Pressable>} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}/></View>
      <View><SectionTitle title="Featured storefronts"/><Text style={styles.subtitle}>Each card belongs to a named store and previews the catalogue you will find inside</Text><FlatList horizontal data={shops.slice(0,6)} keyExtractor={item=>`campaign-${item.id}`} renderItem={({item})=><MerchantCampaignBanner shop={item} onPress={()=>onOpenShop(item.id)}/>} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}/></View>
      <View><SectionTitle title="Shop by vertical"/><Text style={styles.subtitle}>Enter a curated mini-app, not a generic filter</Text><FlatList horizontal data={columns} keyExtractor={(_,index)=>`vertical-column-${index}`} renderItem={({item})=><View style={styles.verticalColumn}>{item.map(vertical=><VerticalTile key={vertical.id} item={vertical} onPress={()=>onGo(vertical.screen)}/>)}</View>} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}/></View>
      <PromoCarousel campaigns={secondary} onPress={campaign=>onGo(campaign.ctaScreen)}/>
      <View><SectionTitle title="All shops"/><Text style={styles.subtitle}>Seller availability, delivery and commercial details are shown only when live data is connected.</Text></View>
    </View>} ListEmptyComponent={<View style={styles.empty}><Ionicons name="search-outline" size={40}/><Text style={styles.sellerName}>No matching shops</Text><Text style={styles.meta}>Try another shop, product or brand.</Text></View>}/>
  </ScreenShell>;
}

const styles=StyleSheet.create({flex:{flex:1},fill:{width:'100%',height:'100%'},page:{paddingHorizontal:SPACE.lg,paddingBottom:40,gap:0},headerModules:{gap:SPACE.xl,marginHorizontal:-SPACE.lg,paddingTop:SPACE.md,paddingBottom:SPACE.lg},subtitle:{...TYPE.small,color:COLORS.muted,marginTop:-SPACE.sm,paddingHorizontal:SPACE.lg},rail:{gap:SPACE.md,paddingHorizontal:SPACE.lg,paddingVertical:4},logoCard:{width:112,minHeight:118,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,alignItems:'center',justifyContent:'center',...SHADOW},logoImage:{width:64,height:54,borderRadius:RADIUS.md,resizeMode:'contain'},logoName:{...TYPE.caption,fontWeight:'800',textAlign:'center',marginTop:SPACE.sm},verticalColumn:{gap:SPACE.md},verticalTile:{width:190,minHeight:170,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.md,...SHADOW},verticalArt:{height:94,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.yellowWash,borderRadius:RADIUS.md,overflow:'hidden'},verticalLabel:{...TYPE.cardTitle,marginTop:SPACE.sm},verticalDescription:{...TYPE.caption,color:COLORS.muted,marginTop:2},sellerRow:{minHeight:92,flexDirection:'row',alignItems:'center',gap:SPACE.md,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:COLORS.lineDark,paddingVertical:SPACE.md},sellerImage:{width:64,height:64,borderRadius:RADIUS.md,backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center',overflow:'hidden'},sellerName:{...TYPE.cardTitle,color:COLORS.black},meta:{...TYPE.caption,color:COLORS.muted,marginTop:4},availability:{...TYPE.caption,color:COLORS.muted,fontWeight:'800',marginTop:5},closed:{color:COLORS.red},muted:{opacity:.56},pressed:{opacity:.76,transform:[{scale:.99}]},empty:{alignItems:'center',paddingVertical:48,gap:SPACE.sm}});
