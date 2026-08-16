import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { BrandIcon, type BrandIconSemantic } from '../components';
import { useRegisterBackControl } from '../navigation/AppNavigation';
import { COLORS, FONT, SHADOW } from '../theme';

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
  photo: string;
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
  retail: 'https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?auto=format&fit=crop&w=1800&q=90',
  grocery: 'https://images.unsplash.com/photo-1775830443507-2a047e6eb49a?auto=format&fit=crop&w=1800&q=90',
  pharmacy: 'https://images.unsplash.com/photo-1696861286643-341a8d7a79e9?auto=format&fit=crop&w=1800&q=90',
  electronics: 'https://images.unsplash.com/photo-1641440615796-5302077ce9fe?auto=format&fit=crop&w=1800&q=90',
  beauty: 'https://images.unsplash.com/photo-1757800946096-b3f14edd6809?auto=format&fit=crop&w=1800&q=90',
  pets: 'https://images.unsplash.com/photo-1722336131103-cfaa6461e8d6?auto=format&fit=crop&w=1800&q=90',
  home: 'https://images.unsplash.com/photo-1770385605649-11de1a033064?auto=format&fit=crop&w=1800&q=90',
  food: 'https://images.unsplash.com/photo-1567121938596-6d9d015d348b?auto=format&fit=crop&w=1800&q=90',
  cafe: 'https://images.unsplash.com/photo-1769138885048-4f91ed2353a0?auto=format&fit=crop&w=1800&q=90',
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=90',
  delivery: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=1800&q=90',
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

function promo(
  eyebrow:string,
  title:string,
  body:string,
  cta:string,
  photo:string,
  tone:'dark'|'light'='dark',
  chip?:string,
): PromoCard {
  return {eyebrow,title,body,cta,photo,tone,chip};
}

function themeFor(category: string): PromoTheme {
  const value=category.toLowerCase();

  if (value.includes('pharm') || value.includes('health') || value.includes('wellness')) {
    return {
      categoryLabel:'Health & wellness',
      hero:promo('KAREEBU+ HEALTH','Wellness delivered','Trusted pharmacy, personal care and everyday health around you.','Shop health',PHOTOS.pharmacy,'dark','UP TO 30% OFF'),
      secondary:promo('FREE DELIVERY','Member delivery on wellness','Save on delivery from selected health stores.','See stores',PHOTOS.delivery,'dark','KAREEBU+'),
      member:promo('MEMBER PRICE','More value on everyday care','Unlock member-only delivery and selected offers.','Try Kareebu+',PHOTOS.beauty,'dark','60 DAYS'),
      tiles:[
        promo('WELLNESS EDIT','Everyday essentials','Vitamins, personal care and pharmacy favourites.','Explore',PHOTOS.pharmacy,'dark','SAVE MORE'),
        promo('BEAUTY & CARE','Care delivered','Skincare, haircare and personal care offers.','Explore',PHOTOS.beauty,'dark','NEW DEALS'),
      ],
    };
  }

  if (value.includes('grocery') || value.includes('super') || value.includes('fresh')) {
    return {
      categoryLabel:'Groceries',
      hero:promo('KAREEBU+ GROCERIES','Your weekly shop, without the queue','Fresh food, pantry and household essentials from stores around you.','Shop groceries',PHOTOS.grocery,'dark','UP TO 25% OFF'),
      secondary:promo('FRESH TODAY','Fresh for less','Fruit, veg and everyday grocery savings.','Shop fresh',PHOTOS.market,'dark','TODAY'),
      member:promo('KAREEBU+','Free-delivery favourites','Member delivery on selected grocery baskets.','Try Kareebu+',PHOTOS.delivery,'dark','60 DAYS'),
      tiles:[
        promo('FRESH PICKS','Market favourites','Fruit, vegetables and fresh everyday essentials.','Explore',PHOTOS.market,'dark','FRESH'),
        promo('STOCK UP','Pantry & home','Useful bundles for the weekly shop.','Explore',PHOTOS.retail,'dark','SAVE'),
      ],
    };
  }

  if (value.includes('beauty')) {
    return {
      categoryLabel:'Beauty',
      hero:promo('KAREEBU+ BEAUTY','Your beauty edit, delivered','Skincare, haircare, fragrance and everyday personal care.','Shop beauty',PHOTOS.beauty,'dark','UP TO 35% OFF'),
      secondary:promo('TRENDING','Glow favourites','Discover popular beauty and skincare picks.','Explore',PHOTOS.beauty,'dark','NEW'),
      member:promo('MEMBER DELIVERY','More beauty, less delivery','Selected member delivery and exclusive offers.','Try Kareebu+',PHOTOS.delivery,'dark','KAREEBU+'),
      tiles:[
        promo('SKINCARE','Daily essentials','Cleansers, moisturisers and targeted care.','Explore',PHOTOS.beauty,'dark','TRENDING'),
        promo('PERSONAL CARE','Everyday care','Useful favourites delivered around you.','Explore',PHOTOS.pharmacy,'dark','SAVE'),
      ],
    };
  }

  if (value.includes('elect') || value.includes('tech')) {
    return {
      categoryLabel:'Electronics',
      hero:promo('KAREEBU+ TECH','Tech when you need it','Phones, accessories and useful everyday electronics from local stores.','Shop tech',PHOTOS.electronics,'dark','TOP DEALS'),
      secondary:promo('POWER UP','Accessories & power','Chargers, power banks, cables and more.','Explore',PHOTOS.electronics,'dark','FROM UGX 15K'),
      member:promo('FAST DELIVERY','Local tech, delivered','Selected electronics from stores around you.','See stores',PHOTOS.delivery,'dark','KAREEBU+'),
      tiles:[
        promo('MOBILE','Useful upgrades','Phone accessories and everyday essentials.','Explore',PHOTOS.electronics,'dark','POPULAR'),
        promo('HOME TECH','Tech for home','Useful devices and accessories.','Explore',PHOTOS.retail,'dark','DISCOVER'),
      ],
    };
  }

  if (value.includes('pet')) {
    return {
      categoryLabel:'Pets',
      hero:promo('KAREEBU+ PETS','Everything for happy pets','Food, treats, care and everyday pet essentials.','Shop pets',PHOTOS.pets,'dark','PET PICKS'),
      secondary:promo('PET PANTRY','Stock up on favourites','Food and treats for everyday routines.','Explore',PHOTOS.pets,'dark','POPULAR'),
      member:promo('MEMBER DELIVERY','Pet essentials, delivered','Selected Kareebu+ delivery on pet favourites.','Try Kareebu+',PHOTOS.delivery,'dark','KAREEBU+'),
      tiles:[
        promo('FOOD & TREATS','Everyday favourites','Popular pet pantry picks.','Explore',PHOTOS.pets,'dark','SHOP NOW'),
        promo('CARE','Everyday pet care','Useful essentials from nearby stores.','Explore',PHOTOS.retail,'dark','DISCOVER'),
      ],
    };
  }

  if (value.includes('home')) {
    return {
      categoryLabel:'Home',
      hero:promo('KAREEBU+ HOME','Make home easier','Homeware, cleaning and useful everyday essentials.','Shop home',PHOTOS.home,'dark','HOME PICKS'),
      secondary:promo('HOME REFRESH','Useful picks for every room','Practical home and cleaning essentials.','Explore',PHOTOS.home,'dark','DISCOVER'),
      member:promo('MEMBER DELIVERY','Home essentials, delivered','Selected Kareebu+ delivery around you.','Try Kareebu+',PHOTOS.delivery,'dark','KAREEBU+'),
      tiles:[
        promo('EVERYDAY HOME','Useful essentials','Practical picks for home.','Explore',PHOTOS.home,'dark','POPULAR'),
        promo('CLEAN & CARE','Stock up','Cleaning and household favourites.','Explore',PHOTOS.retail,'dark','SAVE'),
      ],
    };
  }

  if (value.includes('food') || value.includes('restaurant') || value.includes('chicken') || value.includes('pizza') || value.includes('burger')) {
    return {
      categoryLabel:'Food',
      hero:promo('KAREEBU+ FOOD','Great food around you','Popular restaurants, fast delivery and offers selected for your area.','Order now',PHOTOS.food,'dark','UP TO 30% OFF'),
      secondary:promo('POPULAR NOW','Local favourites','Restaurants people around you keep ordering from.','Explore',PHOTOS.food,'dark','TRENDING'),
      member:promo('KAREEBU+','Try free delivery','Selected member delivery across popular restaurants.','Try Kareebu+',PHOTOS.delivery,'dark','60 DAYS'),
      tiles:[
        promo('DINNER PICKS','Tonight sorted','Popular meals and local favourites.','Explore',PHOTOS.food,'dark','DINNER'),
        promo('COFFEE & MORE','A little treat','Cafés, breakfast and something sweet.','Explore',PHOTOS.cafe,'dark','POPULAR'),
      ],
    };
  }

  return {
    categoryLabel:'Shops',
    hero:promo('KAREEBU+ SHOPS','Everything you need, around you','Discover local stores, specialist shops and everyday essentials.','Shop now',PHOTOS.retail,'dark','LOCAL DEALS'),
    secondary:promo('NEW FINDS','Discover more for less','Useful products and local stores worth discovering.','Explore',PHOTOS.market,'dark','UP TO 30% OFF'),
    member:promo('KAREEBU+','Try free delivery','Selected member delivery and savings around you.','Try Kareebu+',PHOTOS.delivery,'dark','60 DAYS'),
    tiles:[
      promo('LOCAL FAVOURITES','Stores worth discovering','Popular stores around you.','Explore',PHOTOS.retail,'dark','POPULAR'),
      promo('FRESH FINDS','New offers nearby','Everyday essentials and useful finds.','Explore',PHOTOS.market,'dark','NEW'),
    ],
  };
}

export function MarketplaceCategoryHeader({
  location,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearchPress,
  onBack,
  onMenu,
  onLocation,
}: {
  location: string;
  searchPlaceholder: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchPress?: () => void;
  onBack: () => void;
  onMenu: () => void;
  onLocation?: () => void;
}) {
  useRegisterBackControl(true);

  const search = onSearchChange ? (
    <View style={styles.searchBox}>
      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder={searchPlaceholder}
        placeholderTextColor="#73777A"
        style={styles.searchInput}
        returnKeyType="search"
      />
      {searchValue ? (
        <Pressable onPress={() => onSearchChange('')} hitSlop={8} style={styles.searchAction}>
          <Ionicons name="close-circle" size={21} color="#686D70" />
        </Pressable>
      ) : (
        <View style={styles.searchAction}>
          <Feather name="search" size={26} color="#25292B" />
        </View>
      )}
    </View>
  ) : (
    <Pressable onPress={onSearchPress} style={({pressed})=>[styles.searchBox,pressed&&styles.pressed]}>
      <Text numberOfLines={1} style={styles.searchPlaceholder}>{searchPlaceholder}</Text>
      <View style={styles.searchAction}>
        <Feather name="search" size={26} color="#25292B" />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.headerShell}>
      <View style={styles.topRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={({pressed})=>[styles.headerButton,pressed&&styles.pressed]}>
          <Feather name="arrow-left" size={23} color="#292D2F" />
        </Pressable>

        <Pressable onPress={onLocation} disabled={!onLocation} style={styles.locationBlock}>
          <Text style={styles.deliverLabel}>Deliver to</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#292D2F" />
            <Text numberOfLines={1} style={styles.locationText}>{location}</Text>
            <Feather name="chevron-down" size={18} color="#292D2F" />
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" accessibilityLabel="Browse categories" onPress={onMenu} style={({pressed})=>[styles.headerButton,pressed&&styles.pressed]}>
          <Feather name="menu" size={23} color="#292D2F" />
        </Pressable>
      </View>

      {search}

      <View pointerEvents="none" style={styles.whiteSheetBridge}/>
    </View>
  );
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
      <ImageBackground source={{uri:item.photo}} resizeMode="cover" style={styles.heroImage}>
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
  const cardWidth=Math.max(280,viewportWidth-28);
  const [active,setActive]=useState(0);
  const theme=useMemo(()=>themeFor(category),[category]);
  const promotions=[theme.hero,theme.secondary,theme.member];

  return (
    <View style={styles.heroSection}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth}
        onMomentumScrollEnd={(event)=>{
          const next=Math.round(event.nativeEvent.contentOffset.x/cardWidth);
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
          <Text style={styles.sectionSub}>Popular around your delivery location</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.merchantRail}>
        {merchants.map((merchant)=>(
          <Pressable key={merchant.id} onPress={()=>onPress?.(merchant.id)} style={({pressed})=>[styles.merchantCard,pressed&&styles.pressed]}>
            <View style={styles.merchantLogo}>
              <BrandIcon semantic={merchant.semantic} size={52}/>
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
  const cardWidth=Math.floor((usable-gap*3)/4);

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
                <BrandIcon semantic={tile.semantic} size={56}/>
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
          <Text style={styles.sectionTitle}>Offers for you</Text>
          <Text style={styles.sectionSub}>Fresh promotions in {theme.categoryLabel}</Text>
        </View>
      </View>
      <View style={styles.promoGrid}>
        {theme.tiles.map((item,index)=>(
          <Pressable key={item.title} onPress={()=>onPress?.(index as 0|1)} style={({pressed})=>[styles.promoTile,pressed&&styles.pressed]}>
            <ImageBackground source={{uri:item.photo}} resizeMode="cover" style={styles.promoTileImage}>
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
        <Text style={styles.memberTitle}>Try free delivery for 60 days</Text>
        <Text style={styles.memberBody}>Kareebu+ member delivery and savings</Text>
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
  heroRail:{gap:0},
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
    height:127,borderRadius:14,
    backgroundColor:'#F4F5F5',
    alignItems:'center',justifyContent:'center',
    paddingHorizontal:5,
    borderWidth:1,borderColor:'transparent',
  },
  categoryCardSelected:{backgroundColor:'#FFF7D9',borderColor:'#EFCB37'},
  categoryVisual:{height:72,alignItems:'center',justifyContent:'center'},
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
