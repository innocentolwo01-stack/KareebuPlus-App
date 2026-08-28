import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { CategoryArtwork, KareebuPageHeader, type BrandIconSemantic } from '../components';
import { SellerLogo } from '../commerce/SellerLogo';
import { COLORS, FONT, SHADOW } from '../theme';
import type { SearchContext } from '../search/context';

export type MarketplaceRecommendedMerchant = {
  id: string;
  name: string;
  meta?: string;
  semantic: BrandIconSemantic;
};

export type MarketplaceCategoryTile = {
  id: string;
  label: string;
  semantic: BrandIconSemantic;
};

type PromoCard = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  photo: ImageSourcePropType;
  tone: 'dark' | 'light';
  chip?: string;
};

type PromoTheme = {
  categoryLabel: string;
  hero: PromoCard;
  secondary: PromoCard;
  member: PromoCard;
  tiles: [PromoCard, PromoCard];
};

const PHOTOS = {
  retail: require('../../assets/kareebu-plus/realistic-v9/fashion.jpg'),
  grocery: require('../../assets/kareebu-plus/realistic-v9/groceries.jpg'),
  pharmacy: require('../../assets/kareebu-plus/realistic-v9/pharmacy.jpg'),
  electronics: require('../../assets/kareebu-plus/realistic-v9/electronics.jpg'),
  beauty: require('../../assets/kareebu-plus/realistic-v9/beauty.jpg'),
  pets: require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
  home: require('../../assets/kareebu-plus/realistic-v9/home.jpg'),
  food: require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'),
  market: require('../../assets/kareebu-plus/realistic-v9/groceries.jpg'),
  delivery: require('../../assets/kareebu-plus/realistic-v9/send-business.jpg'),
} as const;

export function marketplaceSemanticForCategory(label: string): BrandIconSemantic {
  const value=label.toLowerCase();
  if (value.includes('pharm') || value.includes('health') || value.includes('wellness')) return 'pharmacies';
  if (value.includes('grocery') || value.includes('super') || value.includes('fresh')) return 'groceries';
  if (value.includes('elect') || value.includes('tech') || value.includes('phone')) return 'electronics';
  if (value.includes('food') || value.includes('restaurant') || value.includes('cafe') || value.includes('pizza') || value.includes('chicken') || value.includes('burger')) return 'food';
  if (value.includes('home') || value.includes('living')) return 'homeCare';
  if (value.includes('service') || value.includes('fix')) return 'fix';
  if (value.includes('gift') || value.includes('flower')) return 'forGood';
  return 'shops';
}

export function marketplaceVisualKeyForCategory(label:string):string {
  const value=label.toLowerCase().replace(/&/g,'and').trim();

  // Primary marketplace categories use one cohesive commerce-art family.
  // Subcategories continue into their more specific semantic artwork below.
  if(value==='restaurants'||value==='restaurant') return 'commerce.restaurants';
  if(value==='pharmacy'||value==='pharmacies') return 'commerce.pharmacy';
  if(value==='fashion') return 'commerce.fashion';
  if(value==='home'||value==='home and living'||value==='home living') return 'commerce.home';
  if(value==='groceries'||value==='grocery') return 'commerce.groceries';
  if(value==='electronics'||value==='tech') return 'commerce.electronics';
  if(value==='beauty') return 'commerce.beauty';
  if(value==='pet supplies'||value==='pets'||value==='pet stores') return 'commerce.pets';

  // Pharmacy subcategories must never fall through to generic Shops artwork.
  if(value.includes('cold')||value.includes('flu')) return 'pharmacy.cold-flu';
  if(value.includes('pain')) return 'pharmacy.pain-relief';
  if(value.includes('allergy')||value.includes('antihist')) return 'pharmacy.allergy';
  if(value.includes('digest')||value.includes('stomach')) return 'pharmacy.digestive';
  if(value.includes('first aid')||value.includes('first-aid')||value.includes('bandage')||value.includes('plaster')) return 'pharmacy.first-aid';
  if(value.includes('vitamin')||value.includes('supplement')) return 'pharmacy.vitamins';
  if(value.includes('baby care')) return 'pharmacy.baby-care';
  if(value.includes('personal care')) return 'pharmacy.personal-care';
  if(value.includes("women's health")||value.includes('womens health')) return 'pharmacy.womens-health';
  if(value.includes("men's health")||value.includes('mens health')) return 'pharmacy.mens-health';
  if(value.includes('pharm')||value.includes('health')||value.includes('wellness')) return 'shops.pharmacy';

  if(value.includes('grocery')||value.includes('super')||value.includes('fresh')) return 'shops.supermarket';
  if(value.includes('phone')||value.includes('mobile')) return 'electronics.phones';
  if(value.includes('gaming')||value.includes('console')) return 'electronics.gaming';
  if(value.includes('audio')||value.includes('headphone')||value.includes('speaker')) return 'electronics.audio';
  if(value.includes('elect')||value.includes('tech')||value.includes('computer')||value.includes('laptop')) return 'electronics.computing';
  if(value.includes('women')) return 'fashion.women';
  if(value.includes('men')) return 'fashion.men';
  if(value.includes('kid')||value.includes('child')) return 'fashion.children';
  if(value.includes('shoe')||value.includes('trainer')) return 'fashion.shoes';
  if(value.includes('makeup')) return 'beauty.makeup';
  if(value.includes('fragrance')||value.includes('perfume')) return 'beauty.fragrance';
  if(value.includes('hair')) return 'beauty.hair';
  if(value.includes('beauty')) return 'beauty.skincare';
  if(value.includes('gift')||value.includes('flower')) return 'gifts.flowers';
  if(value.includes('pet')) return 'shops.petSupplies';
  if(value.includes('home')||value.includes('living')) return 'home.decor';
  if(value.includes('ugandan')) return 'food.ugandan';
  if(value.includes('kenyan')) return 'food.kenyan';
  if(value.includes('tanzanian')) return 'food.tanzanian';
  if(value.includes('african')) return 'food.african';
  if(value.includes('food')||value.includes('restaurant')||value.includes('cafe')||value.includes('pizza')||value.includes('chicken')||value.includes('burger')) return 'food.food';
  return 'shops.specialty';
}

function promo(
  eyebrow:string,
  title:string,
  body:string,
  cta:string,
  photo:ImageSourcePropType,
  tone:'dark'|'light'='dark',
  chip?:string,
): PromoCard {
  return {eyebrow,title,body,cta,photo,tone,chip};
}

function visualKeyForCategory(label:string){
  const value=label.toLowerCase();
  if(/pharm|health|wellness/.test(value)) return 'commerce.pharmacy';
  if(/grocery|super|fresh|pantry/.test(value)) return 'commerce.groceries';
  if(/elect|tech|phone|computer|audio|gaming/.test(value)) return 'commerce.electronics';
  if(/food|restaurant|cafe|pizza|chicken|burger/.test(value)) return 'commerce.restaurants';
  if(/beauty|skin|hair|fragrance/.test(value)) return 'commerce.beauty';
  if(/fashion|clothing|women|men|kids|shoe|accessor/.test(value)) return 'commerce.fashion';
  if(/pet/.test(value)) return 'commerce.pets';
  if(/gift|flower/.test(value)) return 'shops.giftsFlowers';
  if(/home|living|kitchen|decor/.test(value)) return 'commerce.home';
  return 'commerce.fashion';
}

function themeFor(category: string): PromoTheme {
  const value=category.toLowerCase();
  const isPharmacy=/pharm|health|wellness/.test(value);
  const isGrocery=/grocery|super|fresh/.test(value);
  const isElectronics=/elect|tech|phone/.test(value);
  const isBeauty=/beauty|skin|hair|fragrance/.test(value);
  const isPets=/pet/.test(value);
  const isHome=/home|living/.test(value);
  const isFood=/food|restaurant|cafe|pizza|chicken|burger/.test(value);
  const photo=isPharmacy?PHOTOS.pharmacy:isGrocery?PHOTOS.grocery:isElectronics?PHOTOS.electronics:isBeauty?PHOTOS.beauty:isPets?PHOTOS.pets:isHome?PHOTOS.home:isFood?PHOTOS.food:PHOTOS.retail;
  const categoryLabel=isPharmacy?'Health & wellness':isGrocery?'Groceries':isElectronics?'Electronics':isBeauty?'Beauty':isPets?'Pet supplies':isHome?'Home & living':isFood?'Food':'Shops';
  return {
    categoryLabel,
    hero:promo('EXPLORE',`Shop ${categoryLabel}`,`Browse ${categoryLabel.toLowerCase()} from stores available in your area.`,'Browse',photo,'dark'),
    secondary:promo('DISCOVER','Find what you need','Open a category or store to see current products, prices and delivery details.','Explore',photo,'dark'),
    member:promo('KAREEBU+','Your marketplace, in one place','Availability, price and delivery details are confirmed from the active catalogue.','Browse',PHOTOS.delivery,'dark'),
    tiles:[
      promo('BROWSE','Explore the range',`Discover more across ${categoryLabel.toLowerCase()}.`,'Explore',photo,'dark'),
      promo('STORES','Shop by store','Choose a store to see its current catalogue.','See stores',photo,'dark'),
    ],
  };
}

export function MarketplaceCategoryHeader({
  location,
  searchPlaceholder,
  searchContext,
  searchValue,
  onSearchChange,
  onSearchPress,
  onBack,
  onMenu,
  onLocation,
}: {
  location: string;
  searchPlaceholder: string;
  searchContext?: SearchContext;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchPress?: () => void;
  onBack: () => void;
  onMenu: () => void;
  onLocation?: () => void;
}) {
  return <KareebuPageHeader
    title="Deliver to"
    city={location}
    locationEnabled
    onLocationPress={onLocation}
    onBack={onBack}
    rightIcon="menu-outline"
    rightLabel="Browse categories"
    onRightAction={onMenu}
    searchEnabled
    searchContext={searchContext ?? {scope:'shops',placeholder:searchPlaceholder}}
    searchValue={searchValue}
    onSearchChange={onSearchChange}
    onSearchPress={onSearchPress}
  />;
}

function PromotionCard({
  item,
  width,
  onPress,
}: {
  item: PromoCard;
  width: number;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({pressed})=>[styles.heroCard,{width},pressed&&styles.pressed]}>
      <ImageBackground source={item.photo} resizeMode="cover" style={styles.heroImage}>
        <View style={styles.heroShade}/>
        <View style={styles.heroTop}>
          {item.chip ? <View style={styles.heroChip}><Text style={styles.heroChipText}>{item.chip}</Text></View> : <View/>}
          <View style={styles.heroK}><Text style={styles.heroKText}>K+</Text></View>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroEyebrow}>{item.eyebrow}</Text>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.heroBody}>{item.body}</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>{item.cta}</Text>
            <Feather name="arrow-right" size={15} color={COLORS.black}/>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

export function MarketplacePromoBanner({
  category,
  onPress,
}: {
  category: string;
  onPress?: () => void;
}) {
  const {width:viewportWidth}=useWindowDimensions();
  const gap=12;
  const cardWidth=Math.max(276,Math.min(520,viewportWidth-52));
  const interval=cardWidth+gap;
  const [active,setActive]=useState(0);
  const theme=useMemo(()=>themeFor(category),[category]);
  const promotions=[theme.hero,theme.secondary,theme.member];

  return (
    <View style={styles.heroSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={interval}
        snapToAlignment="start"
        disableIntervalMomentum
        onMomentumScrollEnd={(event)=>{
          const next=Math.round(event.nativeEvent.contentOffset.x/interval);
          setActive(Math.max(0,Math.min(promotions.length-1,next)));
        }}
        contentContainerStyle={styles.heroRail}
      >
        {promotions.map((item,index)=>(
          <PromotionCard key={`${category}-${item.title}`} item={item} width={cardWidth} onPress={onPress}/>
        ))}
      </ScrollView>
      <View style={styles.heroDots}>
        {promotions.map((_,index)=><View key={index} style={[styles.heroDot,index===active&&styles.heroDotActive]}/>)}
      </View>
    </View>
  );
}

export function MarketplaceRecommendedRail({
  title = 'Recommended Shops',
  merchants,
  onPress,
}: {
  title?: string;
  merchants: MarketplaceRecommendedMerchant[];
  onPress?: (id: string) => void;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSub}>Stores around your delivery location</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.merchantRail}>
        {merchants.map((merchant)=>(
          <Pressable key={merchant.id} onPress={()=>onPress?.(merchant.id)} style={({pressed})=>[styles.merchantCard,pressed&&styles.pressed]}>
            <View style={styles.merchantLogo}>
              <SellerLogo name={merchant.name}/>
            </View>
            <Text numberOfLines={2} style={styles.merchantName}>{merchant.name}</Text>
            {merchant.meta?<Text numberOfLines={1} style={styles.merchantMeta}>{merchant.meta}</Text>:null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function MarketplaceCategoryGrid({
  tiles,
  selectedId,
  onPress,
}: {
  tiles: MarketplaceCategoryTile[];
  selectedId?: string;
  onPress?: (id: string) => void;
}) {
  const {width}=useWindowDimensions();
  const usable=width-28;
  const gap=8;
  const cardWidth=Math.floor((usable-gap*2)/3);

  return (
    <View style={styles.categorySection}>
      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Shop by category</Text>
          <Text style={styles.sectionSub}>Find exactly what you need</Text>
        </View>
      </View>
      <View style={styles.categoryGrid}>
        {tiles.slice(0,8).map((tile)=>{
          const selected=selectedId===tile.id;
          return (
            <Pressable key={tile.id} onPress={()=>onPress?.(tile.id)} style={({pressed})=>[styles.categoryCard,{width:cardWidth},selected&&styles.categoryCardSelected,pressed&&styles.pressed]}>
              <View style={styles.categoryVisual}>
                <CategoryArtwork visualKey={marketplaceVisualKeyForCategory(tile.label)} size="large"/>
              </View>
              <Text numberOfLines={2} style={[styles.categoryLabel,selected&&styles.categoryLabelSelected]}>{tile.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function MarketplacePromoGrid({
  category,
  onPress,
}: {
  category: string;
  onPress?: (index: 0|1) => void;
}) {
  const theme=themeFor(category);

  return (
    <View style={styles.promoSection}>
      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Discover more</Text>
          <Text style={styles.sectionSub}>Curated {theme.categoryLabel.toLowerCase()} discovery</Text>
        </View>
      </View>
      <View style={styles.promoGrid}>
        {theme.tiles.map((item,index)=>(
          <Pressable key={item.title} onPress={()=>onPress?.(index as 0|1)} style={({pressed})=>[styles.promoTile,pressed&&styles.pressed]}>
            <ImageBackground source={item.photo} resizeMode="cover" style={styles.promoTileImage}>
              <View style={styles.promoShade}/>
              <View style={styles.promoTop}>
                {item.chip?<View style={styles.promoChip}><Text style={styles.promoChipText}>{item.chip}</Text></View>:null}
              </View>
              <View style={styles.promoCopy}>
                <Text style={styles.promoEyebrow}>{item.eyebrow}</Text>
                <Text style={styles.promoTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.promoBody}>{item.body}</Text>
                <View style={styles.promoAction}>
                  <Text style={styles.promoActionText}>{item.cta}</Text>
                  <Feather name="arrow-up-right" size={15} color={COLORS.black}/>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function MarketplaceMembershipStrip({
  onPress,
}: {
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({pressed})=>[styles.memberStrip,pressed&&styles.pressed]}>
      <View style={styles.memberMark}><Text style={styles.memberMarkText}>K+</Text></View>
      <View style={styles.memberRule}/>
      <View style={styles.memberCopy}>
        <Text style={styles.memberTitle}>Explore Kareebu+ benefits</Text>
        <Text style={styles.memberBody}>Eligible benefits are shown for your market before you join</Text>
      </View>
      <View style={styles.memberArrow}><Feather name="arrow-right" size={18} color={COLORS.black}/></View>
    </Pressable>
  );
}

const styles=StyleSheet.create({
  pressed:{opacity:.76},

  headerShell:{
    position:'relative',
    zIndex:5,
    backgroundColor:COLORS.yellow,
    paddingHorizontal:14,
    paddingTop:14,
    paddingBottom:26,
  },
  topRow:{flexDirection:'row',alignItems:'center',gap:12},
  headerButton:{
    width:54,height:54,borderRadius:15,
    backgroundColor:'rgba(255,255,255,.96)',
    alignItems:'center',justifyContent:'center',
    borderWidth:1,borderColor:'rgba(0,0,0,.07)',
    ...SHADOW,
  },
  locationBlock:{flex:1,minWidth:0,paddingHorizontal:1},
  deliverLabel:{
    fontFamily:FONT.bold,fontSize:25,lineHeight:29,fontWeight:'900',
    color:COLORS.black,letterSpacing:-.75,
  },
  locationRow:{marginTop:3,flexDirection:'row',alignItems:'center',gap:5},
  locationText:{
    flexShrink:1,fontFamily:FONT.bold,fontSize:13.5,lineHeight:18,
    fontWeight:'800',color:'#2F3335',
  },

  searchBox:{
    marginTop:17,height:58,borderRadius:14,
    backgroundColor:'rgba(255,255,255,.97)',
    borderWidth:1,borderColor:'rgba(0,0,0,.07)',
    paddingLeft:17,paddingRight:8,
    flexDirection:'row',alignItems:'center',gap:8,
    ...SHADOW,
  },
  searchInput:{flex:1,fontFamily:FONT.regular,fontSize:16.5,lineHeight:22,color:'#282C2E',paddingVertical:0},
  searchPlaceholder:{flex:1,fontFamily:FONT.regular,fontSize:16.5,lineHeight:22,color:'#555A5D'},
  searchAction:{width:42,height:42,borderRadius:12,alignItems:'center',justifyContent:'center'},
  whiteSheetBridge:{
    position:'absolute',height:16,left:0,right:0,bottom:-1,
    backgroundColor:'#FFFFFF',
    borderTopLeftRadius:28,borderTopRightRadius:28,
  },

  heroSection:{marginTop:5},
  heroRail:{gap:12,paddingHorizontal:14,paddingRight:34},
  heroCard:{height:198,borderRadius:17,overflow:'hidden'},
  heroImage:{flex:1,justifyContent:'space-between'},
  heroShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.31)'},
  heroTop:{padding:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  heroChip:{minHeight:27,borderRadius:14,backgroundColor:COLORS.yellow,paddingHorizontal:10,alignItems:'center',justifyContent:'center'},
  heroChipText:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:13,fontWeight:'900',color:COLORS.black},
  heroK:{width:32,height:32,borderRadius:10,backgroundColor:'rgba(255,255,255,.92)',alignItems:'center',justifyContent:'center'},
  heroKText:{fontFamily:FONT.bold,fontSize:11.5,fontWeight:'900',color:COLORS.black},
  heroCopy:{paddingHorizontal:16,paddingBottom:15,maxWidth:'77%'},
  heroEyebrow:{fontFamily:FONT.bold,fontSize:10,lineHeight:13,fontWeight:'900',letterSpacing:.85,color:'rgba(255,255,255,.9)'},
  heroTitle:{fontFamily:FONT.bold,fontSize:23,lineHeight:26,fontWeight:'900',letterSpacing:-.6,color:'#FFFFFF',marginTop:3},
  heroBody:{fontFamily:FONT.regular,fontSize:12,lineHeight:16,color:'rgba(255,255,255,.92)',marginTop:5},
  heroCta:{alignSelf:'flex-start',height:32,borderRadius:16,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:11,marginTop:10},
  heroCtaText:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:14,fontWeight:'900',color:COLORS.black},
  heroDots:{height:22,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},
  heroDot:{width:6,height:6,borderRadius:3,backgroundColor:'#D8DADC'},
  heroDotActive:{width:18,backgroundColor:COLORS.black},

  section:{marginTop:11},
  sectionHeading:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginBottom:11},
  sectionTitle:{fontFamily:FONT.bold,fontSize:20.5,lineHeight:25,fontWeight:'900',letterSpacing:-.45,color:'#2E3234'},
  sectionSub:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:'#8A8E91',marginTop:2},
  merchantRail:{gap:9,paddingRight:14},
  merchantCard:{
    width:122,minHeight:118,borderRadius:15,
    backgroundColor:'#FFFFFF',
    borderWidth:1,borderColor:'#E9EBEC',
    paddingHorizontal:8,paddingVertical:9,
    justifyContent:'space-between',
  },
  merchantLogo:{height:59,alignItems:'center',justifyContent:'center'},
  merchantName:{fontFamily:FONT.bold,fontSize:11.3,lineHeight:14.5,fontWeight:'900',textAlign:'center',color:'#303436'},
  merchantMeta:{fontFamily:FONT.regular,fontSize:9.3,lineHeight:12,textAlign:'center',color:'#8C9093',marginTop:3},

  categorySection:{marginTop:21},
  categoryGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},
  categoryCard:{
    minHeight:142,borderRadius:16,
    backgroundColor:'#F4F5F5',
    alignItems:'center',justifyContent:'center',
    paddingHorizontal:5,
    borderWidth:1,borderColor:'transparent',
  },
  categoryCardSelected:{backgroundColor:'#FFF7D9',borderColor:'#EFCB37'},
  categoryVisual:{height:90,alignItems:'center',justifyContent:'center'},
  categoryLabel:{fontFamily:FONT.bold,fontSize:11.2,lineHeight:14.5,fontWeight:'800',textAlign:'center',color:'#3A3E40'},
  categoryLabelSelected:{color:COLORS.black},

  promoSection:{marginTop:22},
  promoGrid:{flexDirection:'row',gap:9},
  promoTile:{flex:1,height:218,borderRadius:16,overflow:'hidden'},
  promoTileImage:{flex:1,justifyContent:'space-between'},
  promoShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,.28)'},
  promoTop:{padding:11,minHeight:44},
  promoChip:{alignSelf:'flex-start',minHeight:25,borderRadius:13,backgroundColor:COLORS.yellow,paddingHorizontal:9,alignItems:'center',justifyContent:'center'},
  promoChipText:{fontFamily:FONT.bold,fontSize:9.5,lineHeight:12,fontWeight:'900',color:COLORS.black},
  promoCopy:{padding:12},
  promoEyebrow:{fontFamily:FONT.bold,fontSize:9.2,lineHeight:12,fontWeight:'900',letterSpacing:.7,color:'rgba(255,255,255,.82)'},
  promoTitle:{fontFamily:FONT.bold,fontSize:16.5,lineHeight:20,fontWeight:'900',color:'#FFFFFF',marginTop:2},
  promoBody:{fontFamily:FONT.regular,fontSize:10.3,lineHeight:13.5,color:'rgba(255,255,255,.9)',marginTop:4},
  promoAction:{alignSelf:'flex-start',height:29,borderRadius:15,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:9,marginTop:9},
  promoActionText:{fontFamily:FONT.bold,fontSize:9.5,lineHeight:12,fontWeight:'900',color:COLORS.black},

  memberStrip:{
    minHeight:62,marginTop:21,borderRadius:31,
    backgroundColor:COLORS.black,
    flexDirection:'row',alignItems:'center',
    paddingHorizontal:13,gap:10,
  },
  memberMark:{width:35,height:35,borderRadius:18,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  memberMarkText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  memberRule:{width:1,height:31,backgroundColor:'rgba(255,255,255,.35)'},
  memberCopy:{flex:1},
  memberTitle:{fontFamily:FONT.bold,fontSize:13,lineHeight:17,fontWeight:'900',color:COLORS.white},
  memberBody:{fontFamily:FONT.regular,fontSize:9.7,lineHeight:13,color:'rgba(255,255,255,.68)',marginTop:2},
  memberArrow:{width:34,height:34,borderRadius:17,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
});
