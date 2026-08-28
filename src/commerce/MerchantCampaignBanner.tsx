import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import type { DemoShop } from '../demoData';
import { COLORS, FONT, RADIUS, SHADOW, SPACE } from '../theme';
import { commerceProductsFor } from './catalog';
import { commerceProductVisual } from './productVisuals';
import { SellerLogo } from './SellerLogo';

function productVisualFor(shop: DemoShop, index: number) {
  const product = commerceProductsFor(shop)[index];
  if (!product) return undefined;
  return {
    product,
    visual: commerceProductVisual({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      detail: product.detail,
      brand: product.brand,
      imageKey: product.metadata.imageKey,
      storeCategory: shop.category,
    }),
  };
}

export const MerchantCampaignBanner = memo(function MerchantCampaignBanner({
  shop,
  onPress,
  compact = false,
}: {
  shop: DemoShop;
  onPress: () => void;
  compact?: boolean;
}) {
  const items = [0, 1, 2].map(index => productVisualFor(shop, index)).filter(Boolean) as Array<NonNullable<ReturnType<typeof productVisualFor>>>;
  const live = Boolean(shop.contentTrust?.liveAvailability);
  const category=`${shop.category} ${shop.name}`.toLowerCase();
  const supermarket=/grocery|groceries|supermarket|shoppers|carrefour|naivas|quickmart/.test(category);
  const pharmacy=/pharm|chemist|health/.test(category);
  const tone=supermarket?'#FFF5CC':pharmacy?'#F8EEF2':'#F3F5F1';
  const headline=supermarket?'Fresh food, pantry & household':shop.inventoryHint ?? shop.category;
  const body=supermarket
    ? 'Move through fresh produce, pantry, drinks, household and everyday essentials from this store.'
    : `Browse ${shop.inventoryHint ?? shop.category} by department and product.`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${shop.name}. ${headline}. Open store departments.`}
      onPress={onPress}
      style={({ pressed }) => [styles.banner, compact && styles.bannerCompact, {backgroundColor:tone}, pressed && styles.pressed]}
    >
      <View style={styles.copyColumn}>
        <View style={styles.identityRow}>
          <View style={styles.logoWrap}><SellerLogo name={shop.name} /></View>
          <View style={styles.identityCopy}>
            <Text style={styles.eyebrow}>SHOP {shop.name.toUpperCase()}</Text>
            <Text numberOfLines={1} style={styles.storeName}>{shop.name}</Text>
          </View>
        </View>
        <Text numberOfLines={2} style={styles.headline}>{headline}</Text>
        <Text numberOfLines={3} style={styles.body}>{body}</Text>
        {live && shop.deal ? <View style={styles.liveOffer}><Ionicons name="pricetag-outline" size={14} color={COLORS.black}/><Text numberOfLines={1} style={styles.liveOfferText}>{shop.deal}</Text></View> : null}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Browse departments</Text>
          <Feather name="arrow-right" size={15} color={COLORS.black} />
        </View>
        <Text numberOfLines={2} style={styles.trust}>{live ? 'Live store data connected' : 'Availability and commercial details confirmed at checkout'}</Text>
      </View>

      <View style={styles.productColumn}>
        {items.slice(0,compact?2:3).map(({ product, visual },index) => (
          <View key={product.id} style={[styles.productTile,index===0&&styles.productTilePrimary,{ backgroundColor: visual.background }]}>
            {visual.image?<Image source={visual.image} resizeMode="cover" style={styles.productImage}/>:<View style={{width:72,height:72,borderRadius:16,backgroundColor:'#F4F1EB'}}/>}
          </View>
        ))}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  banner:{width:330,minHeight:228,borderRadius:RADIUS.xl,overflow:'hidden',flexDirection:'row',borderWidth:1,borderColor:'rgba(23,23,23,.06)',...SHADOW},
  bannerCompact:{width:'100%',minHeight:222},
  copyColumn:{flex:1,padding:SPACE.md,justifyContent:'center',zIndex:2},
  identityRow:{flexDirection:'row',alignItems:'center',gap:9,marginBottom:10},
  logoWrap:{width:58,height:42,borderRadius:12,backgroundColor:COLORS.white,overflow:'hidden'},
  identityCopy:{flex:1,minWidth:0},
  eyebrow:{fontFamily:FONT.bold,fontSize:8.8,lineHeight:12,fontWeight:'900',letterSpacing:.85,color:COLORS.black,opacity:.52},
  storeName:{color:COLORS.black,fontFamily:FONT.bold,fontSize:12.5,lineHeight:16,fontWeight:'900',marginTop:1},
  headline:{color:COLORS.black,fontFamily:FONT.bold,fontSize:23,lineHeight:27,fontWeight:'900',maxWidth:210,letterSpacing:-.5},
  body:{color:'#4D5052',fontFamily:FONT.regular,fontSize:11.5,lineHeight:16.5,marginTop:6,maxWidth:215},
  liveOffer:{alignSelf:'flex-start',marginTop:8,minHeight:28,borderRadius:14,backgroundColor:'#FFFFFF',paddingHorizontal:9,flexDirection:'row',alignItems:'center',gap:5},
  liveOfferText:{fontFamily:FONT.bold,fontSize:10.5,color:COLORS.black,maxWidth:165},
  cta:{alignSelf:'flex-start',marginTop:10,height:34,borderRadius:17,backgroundColor:COLORS.yellow,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:6},
  ctaText:{color:COLORS.black,fontFamily:FONT.bold,fontSize:11.5,fontWeight:'900'},
  trust:{color:'#727678',fontFamily:FONT.regular,fontSize:9.3,lineHeight:12.5,marginTop:8,maxWidth:210},
  productColumn:{width:116,paddingVertical:14,paddingRight:12,gap:9,justifyContent:'center',zIndex:2},
  productTile:{height:76,borderRadius:18,padding:6,justifyContent:'center',alignItems:'center',overflow:'hidden',transform:[{rotate:'2deg'}]},
  productTilePrimary:{height:92,transform:[{rotate:'-2deg'}]},
  productImage:{width:'92%',height:'92%'},
  pressed:{opacity:.9,transform:[{scale:.992}]},
});
