import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PromotionHero } from './PromotionCards';
import type { PromotionCampaign } from './types';
import { COLORS, SPACE } from '../theme';

export function PromoCarousel({campaigns,onPress,autoAdvanceMs=6000}:{campaigns:PromotionCampaign[];onPress:(campaign:PromotionCampaign)=>void;autoAdvanceMs?:number}){
  const {width}=useWindowDimensions(); const [active,setActive]=useState(0);const [paused,setPaused]=useState(false);const scrollRef=useRef<ScrollView>(null);
  const gap=SPACE.md;
  const cardWidth=useMemo(()=>Math.round(Math.max(272,width-52)),[width]); const interval=cardWidth+gap;
  useEffect(()=>{if(paused||campaigns.length<2||autoAdvanceMs<=0)return;const timer=setTimeout(()=>{const next=(active+1)%campaigns.length;scrollRef.current?.scrollTo({x:next*interval,animated:true});setActive(next)},autoAdvanceMs);return()=>clearTimeout(timer)},[active,autoAdvanceMs,campaigns.length,interval,paused]);
  if(!campaigns.length)return null;
  const settle=(event:NativeSyntheticEvent<NativeScrollEvent>)=>{setActive(Math.max(0,Math.min(campaigns.length-1,Math.round(event.nativeEvent.contentOffset.x/interval))));setPaused(false)};
  return <View accessibilityRole="adjustable" accessibilityLabel={`Promotions, item ${active+1} of ${campaigns.length}`}><ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={interval} snapToAlignment="start" disableIntervalMomentum onScrollBeginDrag={()=>setPaused(true)} onMomentumScrollEnd={settle} contentContainerStyle={styles.rail}>{campaigns.map(campaign=><View key={campaign.id} style={{width:cardWidth}}><PromotionHero campaign={campaign} onPress={onPress}/></View>)}</ScrollView>{campaigns.length>1?<View style={styles.dots}>{campaigns.map((item,index)=><View key={item.id} accessibilityLabel={`Promotion ${index+1}${index===active?', selected':''}`} style={[styles.dot,index===active&&styles.dotActive]}/>)}</View>:null}</View>;
}
const styles=StyleSheet.create({rail:{paddingHorizontal:16,paddingRight:36,gap:SPACE.md},dots:{height:20,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},dot:{width:6,height:6,borderRadius:3,backgroundColor:COLORS.lineDark},dotActive:{width:18,backgroundColor:COLORS.yellowDeep}});
