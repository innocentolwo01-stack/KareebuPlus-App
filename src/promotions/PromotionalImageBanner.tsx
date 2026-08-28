import React from 'react';
import { Image, Pressable, StyleSheet, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../theme';
import { KAREEBU_BANNER_ASPECT_RATIO } from '../assets/kareebuBannerRegistry';

export function PromotionalImageBanner({image,onPress,accessibilityLabel,accessibilityHint,aspectRatio=KAREEBU_BANNER_ASPECT_RATIO,borderRadius=RADIUS.xl,style}:{image:ImageSourcePropType;onPress:()=>void;accessibilityLabel:string;accessibilityHint?:string;aspectRatio?:number;borderRadius?:number;style?:StyleProp<ViewStyle>}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint} onPress={onPress} style={({pressed})=>[styles.banner,{aspectRatio,borderRadius},style,pressed&&styles.pressed]}><Image accessibilityIgnoresInvertColors source={image} resizeMode="contain" style={styles.image}/></Pressable>;
}

const styles=StyleSheet.create({banner:{width:'100%',overflow:'hidden',backgroundColor:COLORS.white},image:{width:'100%',height:'100%'},pressed:{opacity:.92}});
