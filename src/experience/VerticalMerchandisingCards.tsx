import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import type { VerticalProduct, VerticalSeller } from './verticalLandingBlueprint';
import { SellerLogo } from '../commerce/SellerLogo';

export const SellerCard = memo(function SellerCard({ seller, onPress }: { seller: VerticalSeller; onPress: () => void }) {
  const closed=seller.availabilityStatus==='closed';
  const availability=seller.availabilityStatus==='open'?'Open':closed?'Closed':seller.availabilityStatus==='temporarily-unavailable'?'Temporarily unavailable':'Check availability';
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${seller.name}. ${availability}.`} onPress={onPress} style={({ pressed }) => [styles.seller,closed&&styles.closedSeller, pressed && styles.pressed]}>
    <View style={styles.sellerVisual}><SellerLogo name={seller.name}/></View>
    <Text numberOfLines={2} style={styles.title}>{seller.name}</Text>
    <Text numberOfLines={1} style={styles.meta}>Browse seller</Text>
    <View style={styles.reference}><Text style={styles.referenceText}>{availability}</Text></View>
  </Pressable>;
});

export const ProductCard = memo(function ProductCard({ product, onPress }: { product: VerticalProduct; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${product.name}. Open product details.`} onPress={onPress} style={({ pressed }) => [styles.product, pressed && styles.pressed]}>
    <View style={styles.productVisual}>{product.imageUrl ? <Image source={{ uri: product.imageUrl }} style={styles.fill} resizeMode="cover" /> : product.image ? <Image source={product.image} style={styles.productImage} resizeMode="contain" /> : <Ionicons name="cube-outline" size={42} color={COLORS.black} />}</View>
    {product.brand ? <Text numberOfLines={1} style={styles.brand}>{product.brand}</Text> : null}
    <Text numberOfLines={2} style={styles.title}>{product.name}</Text>
    <Text numberOfLines={1} style={styles.meta}>{product.pack ?? 'Product details at seller'}</Text>
    <View style={styles.productFooter}><Text style={styles.nonLive}>Price at seller</Text><View style={styles.add}><Feather name="plus" size={18} color={COLORS.black} /></View></View>
  </Pressable>;
});

const styles = StyleSheet.create({
  seller:{width:190,minHeight:220,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,...SHADOW},
  product:{width:164,minHeight:252,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,...SHADOW},
  sellerVisual:{height:108,borderRadius:RADIUS.md,backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  productVisual:{height:126,borderRadius:RADIUS.md,backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  fill:{width:'100%',height:'100%'},productImage:{width:104,height:104},
  title:{...TYPE.cardTitle,color:COLORS.black,marginTop:SPACE.sm},brand:{...TYPE.caption,color:COLORS.muted,fontWeight:'800',marginTop:SPACE.sm,textTransform:'uppercase'},
  meta:{...TYPE.caption,color:COLORS.muted,marginTop:4},reference:{alignSelf:'flex-start',marginTop:SPACE.sm,borderRadius:RADIUS.lg,backgroundColor:COLORS.yellowWash,paddingHorizontal:SPACE.sm,paddingVertical:5},referenceText:{fontSize:10,fontWeight:'800',color:COLORS.black},
  productFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:'auto',paddingTop:SPACE.sm},nonLive:{...TYPE.caption,color:COLORS.muted,fontWeight:'700'},add:{width:36,height:36,borderRadius:12,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},pressed:{opacity:.78,transform:[{scale:.98}]},
  closedSeller:{opacity:.55},
});
