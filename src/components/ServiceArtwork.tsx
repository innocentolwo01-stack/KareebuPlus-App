import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { serviceVisual, type VisualSize, VISUAL_SIZE } from '../visuals/categoryVisuals';
import { COLORS } from '../theme';

export const ServiceArtwork=memo(function ServiceArtwork({visualKey,size='large',maxWidth}:{visualKey:string;size?:VisualSize;maxWidth?:number}){
  const visual=serviceVisual(visualKey);
  const pixels=Math.min(VISUAL_SIZE[size],maxWidth??Number.POSITIVE_INFINITY);
  const width=pixels*(visual.aspectRatio??1);
  const transform=[{translateX:visual.offsetX??0},{translateY:visual.offsetY??0},{scale:visual.opticalScale??1}];
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.frame,visual.backgroundMode==='soft-surface'&&styles.softSurface,{width:pixels,height:pixels}]}>
    {visual.shadow==='contact'?<View style={[styles.shadow,{width:pixels*.54,top:pixels*.75}]}/>:null}
    {visual.image
      ?<Image source={visual.image} resizeMode="contain" style={{width,height:pixels,transform}}/>
      :<Ionicons name={visual.icon??'grid'} size={Math.round(pixels*.62)} color={COLORS.black}/>}
  </View>;
});

const styles=StyleSheet.create({
  frame:{alignItems:'center',justifyContent:'center',overflow:'visible'},
  softSurface:{backgroundColor:COLORS.surfaceStrong,borderRadius:18},
  shadow:{position:'absolute',height:7,borderRadius:99,backgroundColor:'rgba(23,23,23,0.09)',transform:[{scaleY:.45}]},
});
