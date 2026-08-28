import React, { memo } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { categoryVisual, type CmsCategoryVisualOverride, type VisualSize, VISUAL_SIZE } from '../visuals/categoryVisuals';
import { COLORS } from '../theme';

type Props = {
  visualKey: string;
  size?: VisualSize;
  market?: string;
  cmsOverride?: CmsCategoryVisualOverride;
  style?: StyleProp<ViewStyle>;
};

export const CategoryArtwork = memo(function CategoryArtwork({ visualKey, size = 'standard', market, cmsOverride, style }: Props) {
  const visual = categoryVisual(visualKey, {
    market: market === 'Uganda' || market === 'Kenya' || market === 'Tanzania' ? market : undefined,
    cmsOverride,
  });
  const pixels = VISUAL_SIZE[size];
  const scale = visual.opticalScale ?? 1;
  const inset = Math.round(pixels * 0.08);
  const transform = [{ translateX: visual.offsetX ?? 0 }, { translateY: visual.offsetY ?? 0 }, { scale }];
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.frame, visual.backgroundMode === 'soft-surface' && styles.softSurface, { width: pixels, height: pixels }, style]}>
      {visual.shadow === 'contact' ? <View style={[styles.contactShadow, { width: pixels * 0.54, top: pixels * 0.74 }]} /> : null}
      {visual.image ? <Image source={visual.image} resizeMode="contain" style={{ width: pixels - inset * 2, height: pixels - inset * 2, borderRadius: Math.max(10, Math.round(pixels * 0.16)), transform }} /> : <View style={[styles.missingArt,{width:pixels-inset*2,height:pixels-inset*2}]} />}
    </View>
  );
});

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  softSurface: { backgroundColor: COLORS.surfaceStrong, borderRadius: 18 },
  missingArt:{backgroundColor:'#F4F1EB',borderRadius:18,borderWidth:1,borderColor:'rgba(0,0,0,.04)'},
  contactShadow: { position: 'absolute', height: 7, borderRadius: 99, backgroundColor: 'rgba(23,23,23,0.09)', transform: [{ scaleY: 0.45 }] },
});
