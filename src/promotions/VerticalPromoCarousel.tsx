import React, { memo, useMemo, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PromotionHero } from './PromotionCards';
import type { PromotionCampaign } from './types';
import { SPACE } from '../theme';

export const VerticalPromoCarousel=memo(function VerticalPromoCarousel({campaigns,onPress}:{campaigns:PromotionCampaign[];onPress:(campaign:PromotionCampaign)=>void}){
  const {width}=useWindowDimensions();
  const [active,setActive]=useState(0);
  const gap=SPACE.md;
  const cardWidth=useMemo(()=>Math.round(Math.max(272,width-52)),[width]);
  const interval=cardWidth+gap;
  const settle=(event:NativeSyntheticEvent<NativeScrollEvent>)=>setActive(Math.max(0,Math.min(campaigns.length-1,Math.round(event.nativeEvent.contentOffset.x/interval))));
  return <View accessibilityRole="adjustable" accessibilityLabel={`Featured promotions, item ${active+1} of ${campaigns.length}`}><FlatList horizontal data={campaigns} keyExtractor={item=>item.id} renderItem={({item})=><View style={{width:cardWidth}}><PromotionHero campaign={item} onPress={onPress}/></View>} ItemSeparatorComponent={()=> <View style={{width:gap}}/>} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail} decelerationRate="fast" snapToInterval={interval} snapToAlignment="start" disableIntervalMomentum onMomentumScrollEnd={settle}/>{campaigns.length>1?<View style={styles.dots}>{campaigns.map((item,index)=><View key={item.id} style={[styles.dot,index===active&&styles.dotActive]}/>)}</View>:null}</View>;
});

const styles=StyleSheet.create({rail:{paddingHorizontal:SPACE.lg,paddingRight:SPACE.xl},dots:{height:20,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},dot:{width:6,height:6,borderRadius:3,backgroundColor:'#CBC7BA'},dotActive:{width:18,backgroundColor:'#C9A800'}});
