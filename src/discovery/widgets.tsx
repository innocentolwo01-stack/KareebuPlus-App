import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BrandIcon, type BrandIconSemantic } from '../components';
import { DiscoveryArt } from './art';
import { COLORS, FONT, SHADOW, TYPE } from '../theme';
import type {
  KareebuDiscoveryController,
  KareebuDiscoveryItem,
  KareebuDiscoveryPromo,
} from './types';

function semanticFor(title:string,fallback:BrandIconSemantic):BrandIconSemantic{
  const value=title.toLowerCase();
  if(/pharm|health|wellness|lab|vaccine/.test(value)) return 'pharmacies';
  if(/grocery|fresh|pantry|dairy|bakery|snack|drink/.test(value)) return 'groceries';
  if(/elect|mobile|computer|audio|gaming|camera|network|storage|smart/.test(value)) return 'electronics';
  if(/food|cuisine|dish|restaurant|breakfast|dessert|coffee/.test(value)) return 'food';
  if(/clean|laundry|salon|home|furniture|moving|pest/.test(value)) return 'homeCare';
  if(/fix|repair|plumb|electrical|ac|lock|paint|carpentry/.test(value)) return 'fix';
  if(/gift|flower/.test(value)) return 'forGood';
  return fallback;
}

function money(value:number){
  return `UGX ${Math.max(0,value).toLocaleString('en-US')}`;
}

function SectionHeading({title,subtitle}:{title:string;subtitle?:string}){
  return <View style={styles.sectionHeading}><View style={styles.flex}><Text style={styles.sectionTitle}>{title}</Text>{subtitle?<Text style={styles.sectionSubtitle}>{subtitle}</Text>:null}</View></View>;
}

function HeroCard({
  promo,
  domainId,
  cardWidth,
  onOffer,
}:{
  promo:KareebuDiscoveryPromo;
  domainId:KareebuDiscoveryController['domainId'];
  cardWidth:number;
  onOffer:()=>void;
}){
  const [failed,setFailed]=useState(false);
  return <Pressable onPress={onOffer} style={({pressed})=>[styles.hero,{width:cardWidth},pressed&&styles.pressed]}>
    <View style={styles.heroImage}>
      {!failed?<Image source={{uri:promo.photo}} resizeMode="cover" style={StyleSheet.absoluteFill} onError={()=>setFailed(true)}/>:null}
      {failed?<View style={styles.heroFallback}><DiscoveryArt title={promo.title} domainId={domainId} size={176}/></View>:null}
      <View style={styles.heroShade}/>
      <View style={styles.heroTop}>
        <View style={styles.heroChip}><Text style={styles.heroChipText}>{promo.chip}</Text></View>
        <View style={styles.plusMark}><Text style={styles.plusMarkText}>K+</Text></View>
      </View>
      <View style={styles.heroCopy}>
        <Text style={styles.heroEyebrow}>{promo.eyebrow}</Text>
        <Text style={styles.heroTitle}>{promo.title}</Text>
        <Text numberOfLines={2} style={styles.heroBody}>{promo.body}</Text>
        <View style={styles.heroCta}><Text style={styles.heroCtaText}>{promo.cta}</Text><Feather name="arrow-right" size={15} color={COLORS.black}/></View>
      </View>
    </View>
  </Pressable>;
}

export function DiscoveryHeroCarousel({
  items,
  onOffer,
  domainId,
}:{
  items:KareebuDiscoveryPromo[];
  onOffer:()=>void;
  domainId:KareebuDiscoveryController['domainId'];
}){
  const {width}=useWindowDimensions();
  const cardWidth=Math.max(290,width-28);
  const [active,setActive]=useState(0);
  return <View>
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={cardWidth}
      onMomentumScrollEnd={(event)=>{
        setActive(Math.max(0,Math.min(items.length-1,Math.round(event.nativeEvent.contentOffset.x/cardWidth))));
      }}
    >
      {items.map((promo)=>(
        <HeroCard key={promo.id} promo={promo} domainId={domainId} cardWidth={cardWidth} onOffer={onOffer}/>
      ))}

    </ScrollView>
    <View style={styles.dots}>{items.map((item,index)=><View key={item.id} style={[styles.dot,index===active&&styles.dotActive]}/>)}</View>
  </View>;
}

export function DiscoveryFilterRail({controller}:{controller:KareebuDiscoveryController}){
  const widget=controller.document.widgets.find((entry)=>entry.type==='filter-rail');
  const filters=widget?.type==='filter-rail'?widget.items:[];
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRail}>
    <Pressable onPress={()=>controller.setFiltersOpen(true)} style={({pressed})=>[styles.filterChip,styles.filterChipPrimary,pressed&&styles.pressed]}>
      <Feather name="sliders" size={15} color={COLORS.black}/>
      <Text style={styles.filterTextStrong}>Filters{controller.activeFilters.length?` (${controller.activeFilters.length})`:''}</Text>
    </Pressable>
    {filters.map((filter)=>{
      const active=controller.activeFilters.includes(filter.id);
      return <Pressable key={filter.id} onPress={()=>controller.toggleFilter(filter.id)} style={({pressed})=>[styles.filterChip,active&&styles.filterChipActive,pressed&&styles.pressed]}>
        <Feather name={filter.icon as any} size={14} color={COLORS.black}/>
        <Text style={[styles.filterText,active&&styles.filterTextActive]}>{filter.label}</Text>
      </Pressable>;
    })}
  </ScrollView>;
}

export function DiscoveryVerticalGrid({
  controller,
  title,
  items,
  activeId,
}:{
  controller:KareebuDiscoveryController;
  title:string;
  items:KareebuDiscoveryController['document']['widgets'][number] extends never?never:any[];
  activeId:string|null;
}){
  const {width}=useWindowDimensions();
  const tileWidth=Math.floor((width-28-24)/4);
  const fallback=controller.document.header.semantic;
  return <View style={styles.section}>
    <SectionHeading title={title}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.verticalRail}>
      {items.map((item:any)=>{
        const active=item.id===activeId;
        return <Pressable key={item.id} onPress={()=>controller.selectVertical(item.id)} style={({pressed})=>[styles.verticalTile,{width:tileWidth},active&&styles.verticalTileActive,pressed&&styles.pressed]}>
          <View style={styles.verticalArt}><DiscoveryArt title={item.title} domainId={controller.domainId} size={58} fallback={semanticFor(item.title,fallback)}/></View>
          <Text numberOfLines={2} style={[styles.verticalLabel,active&&styles.verticalLabelActive]}>{item.title}</Text>
        </Pressable>;
      })}
    </ScrollView>
  </View>;
}

export function DiscoveryCategoryRail({
  controller,
  title,
  items,
  activeId,
}:{
  controller:KareebuDiscoveryController;
  title:string;
  items:any[];
  activeId:string|null;
}){
  return <View style={styles.section}>
    <SectionHeading title={title}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRail}>
      {items.map((item)=>{
        const active=item.id===activeId;
        return <Pressable key={item.id} onPress={()=>controller.selectCategory(item.id)} style={({pressed})=>[styles.categoryPill,active&&styles.categoryPillActive,pressed&&styles.pressed]}>
          <Text style={[styles.categoryPillText,active&&styles.categoryPillTextActive]}>{item.title}</Text>
        </Pressable>;
      })}
    </ScrollView>
  </View>;
}

export function DiscoverySubcategoryGrid({
  controller,
  title,
  items,
  activeId,
}:{
  controller:KareebuDiscoveryController;
  title:string;
  items:any[];
  activeId:string|null;
}){
  const {width}=useWindowDimensions();
  const tileWidth=Math.floor((width-28-24)/4);
  const fallback=controller.document.header.semantic;
  if(!items.length) return null;
  return <View style={styles.section}>
    <SectionHeading title={title}/>
    <View style={styles.subGrid}>
      {items.slice(0,12).map((item)=>{
        const active=item.id===activeId;
        return <Pressable key={item.id} onPress={()=>controller.selectSubcategory(item.id)} style={({pressed})=>[styles.subTile,{width:tileWidth},active&&styles.subTileActive,pressed&&styles.pressed]}>
          <DiscoveryArt title={item.title} domainId={controller.domainId} size={47} fallback={semanticFor(item.title,fallback)}/>
          <Text numberOfLines={2} style={[styles.subLabel,active&&styles.subLabelActive]}>{item.title}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}

function ItemPhoto({item,style}:{item:KareebuDiscoveryItem;style:any}){
  const [failed,setFailed]=useState(false);
  return <View style={[style,styles.itemPhotoWrap]}>
    {!failed?<Image source={{uri:item.photo}} resizeMode="cover" style={StyleSheet.absoluteFill} onError={()=>setFailed(true)}/>:null}
    {failed?<View style={styles.itemPhotoFallback}><DiscoveryArt title={item.name} domainId={item.domainId} size={64}/></View>:null}
    {item.offerLabel?<View style={styles.itemOffer}><Text style={styles.itemOfferText}>{item.offerLabel}</Text></View>:null}
  </View>;
}

function ItemMeta({item}:{item:KareebuDiscoveryItem}){
  const service=item.type==='service'||item.type==='experience';
  const dineOut=item.domainId==='dineout';
  return <>
    <Text numberOfLines={1} style={styles.itemName}>{dineOut?item.providerOrBrand:item.name}</Text>
    <Text numberOfLines={1} style={styles.itemProvider}>{dineOut?item.name:item.providerOrBrand}</Text>
    <Text style={styles.itemRating}>★ {item.rating.toFixed(1)} · {item.etaMinutes} min · {item.distanceKm} km</Text>
    <Text style={styles.itemDelivery}>{service?`${money(item.basePriceUGX)}${item.durationMinutes?` · ${item.durationMinutes} min`:''}`:item.freeDelivery?'Free delivery':money(item.basePriceUGX)}</Text>
  </>;
}

export function DiscoveryItemRail({
  controller,
  title,
  subtitle,
  items,
}:{
  controller:KareebuDiscoveryController;
  title:string;
  subtitle:string;
  items:KareebuDiscoveryItem[];
}){
  return <View style={styles.section}>
    <SectionHeading title={title} subtitle={subtitle}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemRail}>
      {items.map((item)=>(
        <Pressable key={item.id} onPress={()=>controller.openItem(item)} style={({pressed})=>[styles.itemCard,pressed&&styles.pressed]}>
          <ItemPhoto item={item} style={styles.itemCardPhoto}/>
          <View style={styles.itemCardCopy}><ItemMeta item={item}/></View>
        </Pressable>
      ))}
    </ScrollView>
  </View>;
}

export function DiscoveryItemList({
  controller,
  title,
  subtitle,
  items,
}:{
  controller:KareebuDiscoveryController;
  title:string;
  subtitle:string;
  items:KareebuDiscoveryItem[];
}){
  return <View style={styles.section}>
    <SectionHeading title={title} subtitle={subtitle}/>
    {items.length?items.map((item)=>(
      <Pressable key={item.id} onPress={()=>controller.openItem(item)} style={({pressed})=>[styles.itemRow,pressed&&styles.pressed]}>
        <ItemPhoto item={item} style={styles.itemRowPhoto}/>
        <View style={styles.itemRowCopy}><ItemMeta item={item}/></View>
        <Feather name="chevron-right" size={19} color="#929699"/>
      </Pressable>
    )):<View style={styles.empty}>
      <View style={styles.emptyIcon}><Feather name="search" size={24} color={COLORS.black}/></View>
      <Text style={styles.emptyTitle}>Nothing matches those filters</Text>
      <Text style={styles.emptyBody}>Try another category or clear some filters.</Text>
      <Pressable onPress={controller.clearFilters} style={styles.emptyButton}><Text style={styles.emptyButtonText}>Clear filters</Text></Pressable>
    </View>}
  </View>;
}

export function DiscoveryMembershipStrip({controller}:{controller:KareebuDiscoveryController}){
  return <Pressable onPress={controller.openMembership} style={({pressed})=>[styles.member,pressed&&styles.pressed]}>
    <View style={styles.memberMark}><Text style={styles.memberMarkText}>K+</Text></View>
    <View style={styles.memberRule}/>
    <View style={styles.flex}><Text style={styles.memberTitle}>Try free delivery with Kareebu+</Text><Text style={styles.memberBody}>Member offers and delivery savings across Kareebu+</Text></View>
    <View style={styles.memberArrow}><Feather name="arrow-right" size={18} color={COLORS.black}/></View>
  </Pressable>;
}

const styles=StyleSheet.create({
  flex:{flex:1},
  pressed:{opacity:.72},
  section:{marginTop:15},
  sectionHeading:{paddingHorizontal:14,marginBottom:10,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},
  sectionTitle:{fontFamily:FONT.bold,fontSize:20,lineHeight:24,fontWeight:'900',letterSpacing:-.35,color:COLORS.black},
  sectionSubtitle:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  hero:{height:186,borderRadius:17,overflow:'hidden'},
  heroImage:{flex:1,justifyContent:'space-between',position:'relative',overflow:'hidden'},
  heroFallback:{...StyleSheet.absoluteFill,backgroundColor:'#F3F4F4',alignItems:'center',justifyContent:'center'},
  heroShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.31)'},
  heroTop:{padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  heroChip:{minHeight:27,borderRadius:14,backgroundColor:COLORS.yellow,paddingHorizontal:10,alignItems:'center',justifyContent:'center'},
  heroChipText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  plusMark:{width:32,height:32,borderRadius:10,backgroundColor:'rgba(255,255,255,.94)',alignItems:'center',justifyContent:'center'},
  plusMarkText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.black},
  heroCopy:{paddingHorizontal:16,paddingBottom:15,maxWidth:'80%'},
  heroEyebrow:{...TYPE.caption,color:'rgba(255,255,255,.86)',fontWeight:'900',letterSpacing:.8},
  heroTitle:{fontFamily:FONT.bold,fontSize:23,lineHeight:27,fontWeight:'900',letterSpacing:-.5,color:COLORS.white,marginTop:3},
  heroBody:{...TYPE.small,color:'rgba(255,255,255,.92)',marginTop:5},
  heroCta:{alignSelf:'flex-start',height:32,borderRadius:16,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:11,marginTop:9},
  heroCtaText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  dots:{height:22,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},
  dot:{width:6,height:6,borderRadius:3,backgroundColor:'#D7DADD'},
  dotActive:{width:18,backgroundColor:COLORS.black},
  filterRail:{paddingHorizontal:14,paddingRight:28,gap:7},
  filterChip:{height:36,borderRadius:18,borderWidth:1,borderColor:COLORS.lineDark,backgroundColor:COLORS.white,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:6},
  filterChipPrimary:{backgroundColor:COLORS.surfaceStrong},
  filterChipActive:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellowDeep},
  filterText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},
  filterTextStrong:{...TYPE.small,color:COLORS.black,fontWeight:'900'},
  filterTextActive:{fontWeight:'900'},
  verticalRail:{paddingHorizontal:14,paddingRight:28,gap:8},
  verticalTile:{height:104,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#F6F7F7',alignItems:'center',justifyContent:'center',paddingHorizontal:4},
  verticalTileActive:{backgroundColor:COLORS.yellowWash,borderColor:COLORS.yellowDeep},
  verticalArt:{height:58,alignItems:'center',justifyContent:'center'},
  verticalLabel:{...TYPE.caption,color:'#34383A',fontWeight:'800',textAlign:'center'},
  verticalLabelActive:{color:COLORS.black,fontWeight:'900'},
  categoryRail:{paddingHorizontal:14,paddingRight:28,gap:8},
  categoryPill:{minHeight:38,borderRadius:19,borderWidth:1,borderColor:COLORS.lineDark,backgroundColor:COLORS.white,paddingHorizontal:15,alignItems:'center',justifyContent:'center'},
  categoryPillActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  categoryPillText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},
  categoryPillTextActive:{color:COLORS.white,fontWeight:'900'},
  subGrid:{paddingHorizontal:14,flexDirection:'row',flexWrap:'wrap',gap:8},
  subTile:{height:99,borderRadius:14,backgroundColor:'#F5F6F6',alignItems:'center',justifyContent:'center',paddingHorizontal:5,borderWidth:1,borderColor:'transparent'},
  subTileActive:{backgroundColor:COLORS.yellowWash,borderColor:COLORS.yellowDeep},
  subLabel:{...TYPE.caption,color:'#3A3E40',fontWeight:'800',textAlign:'center',marginTop:4},
  subLabelActive:{color:COLORS.black,fontWeight:'900'},
  itemRail:{paddingHorizontal:14,paddingRight:28,gap:10},
  itemCard:{width:198,borderRadius:16,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,overflow:'hidden',...SHADOW},
  itemCardPhoto:{height:116,width:'100%'},
  itemCardCopy:{padding:11},
  itemPhotoWrap:{backgroundColor:COLORS.surfaceStrong,overflow:'hidden',position:'relative'},
  itemPhotoFallback:{...StyleSheet.absoluteFill,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.surfaceStrong},
  itemOffer:{position:'absolute',left:8,top:8,minHeight:25,borderRadius:13,backgroundColor:COLORS.yellow,paddingHorizontal:8,alignItems:'center',justifyContent:'center'},
  itemOfferText:{...TYPE.caption,color:COLORS.black,fontWeight:'900'},
  itemName:{...TYPE.cardTitle,color:COLORS.black},
  itemProvider:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  itemRating:{...TYPE.caption,color:COLORS.black,fontWeight:'700',marginTop:5},
  itemDelivery:{...TYPE.caption,color:COLORS.green,fontWeight:'800',marginTop:3},
  itemRow:{marginHorizontal:14,minHeight:108,borderBottomWidth:1,borderBottomColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:11,paddingVertical:10},
  itemRowPhoto:{width:94,height:88,borderRadius:13},
  itemRowCopy:{flex:1},
  empty:{marginHorizontal:14,borderRadius:18,backgroundColor:COLORS.surface,padding:20,alignItems:'center'},
  emptyIcon:{width:46,height:46,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  emptyTitle:{...TYPE.cardTitle,color:COLORS.black,marginTop:11},
  emptyBody:{...TYPE.small,color:COLORS.muted,textAlign:'center',marginTop:3},
  emptyButton:{height:36,borderRadius:18,backgroundColor:COLORS.black,paddingHorizontal:14,alignItems:'center',justifyContent:'center',marginTop:12},
  emptyButtonText:{...TYPE.label,color:COLORS.white},
  member:{marginHorizontal:14,marginTop:22,marginBottom:24,minHeight:64,borderRadius:32,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',paddingHorizontal:13,gap:10},
  memberMark:{width:36,height:36,borderRadius:18,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  memberMarkText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  memberRule:{width:1,height:31,backgroundColor:'rgba(255,255,255,.34)'},
  memberTitle:{...TYPE.label,color:COLORS.white,fontWeight:'900'},
  memberBody:{...TYPE.caption,color:'rgba(255,255,255,.66)',marginTop:2},
  memberArrow:{width:34,height:34,borderRadius:17,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
});
