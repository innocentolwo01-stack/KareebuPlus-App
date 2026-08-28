import React, { memo, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View, type ListRenderItem } from 'react-native';
import { COLORS, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import type { ServicePreference } from '../preferences';
import { servicesForMarket, type KareebuServiceDefinition } from '../services/serviceRegistry';
import { ServiceArtwork } from '../components/ServiceArtwork';

const ITEMS_PER_PAGE=8;
const COLUMNS_PER_PAGE=4;
const COLUMN_GAP=8;
const PAGE_GAP=12;

type Props={country:string;onOpen:(service:KareebuServiceDefinition)=>void;preferences?:ServicePreference[]};

function pagesOf(items:KareebuServiceDefinition[]):KareebuServiceDefinition[][] {
  const pages:KareebuServiceDefinition[][]=[];
  for(let index=0;index<items.length;index+=ITEMS_PER_PAGE)pages.push(items.slice(index,index+ITEMS_PER_PAGE));
  return pages;
}

const ServiceTile=memo(function ServiceTile({item,width,preferences,onOpen}:{item:KareebuServiceDefinition;width:number;preferences:ServicePreference[];onOpen:(service:KareebuServiceDefinition)=>void}){
  const preferred=Boolean(item.preference&&preferences.includes(item.preference));
  const artSize=Math.max(52,Math.min(66,width-4));
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${item.label}. ${item.description}`} accessibilityHint={`Opens ${item.label}`} accessibilityState={{selected:preferred}} onPress={()=>onOpen(item)} style={({pressed})=>[styles.tile,{width},preferred&&styles.preferred,pressed&&styles.pressed]}>
    {item.badge?<View style={styles.badge}><Text style={styles.badgeText}>{item.badge}</Text></View>:null}
    <View style={styles.artRegion}>
      <ServiceArtwork visualKey={item.visualKey} size="large" maxWidth={artSize}/>
    </View>
    <View style={styles.labelRegion}><Text numberOfLines={2} style={styles.label}>{item.label}</Text></View>
  </Pressable>;
});

export function KareebuServiceCarousel({country,onOpen,preferences=[]}:Props){
  const {width:screenWidth}=useWindowDimensions();
  const viewportWidth=Math.min(520,Math.max(240,screenWidth-SPACE.lg*2));
  const pageWidth=viewportWidth-12;
  const tileWidth=(pageWidth-COLUMN_GAP*(COLUMNS_PER_PAGE-1))/COLUMNS_PER_PAGE;
  const pages=useMemo(()=>pagesOf(servicesForMarket(country,true)),[country]);
  const [activePage,setActivePage]=useState(0);
  const renderPage:ListRenderItem<KareebuServiceDefinition[]>=({item})=><View accessibilityRole="list" style={[styles.page,{width:pageWidth}]}>{item.map(service=><ServiceTile key={service.id} item={service} width={tileWidth} preferences={preferences} onOpen={onOpen}/>)}</View>;
  return <View style={styles.shell}>
    <FlatList horizontal style={{width:viewportWidth}} data={pages} keyExtractor={(_,index)=>`service-page-${index}`} renderItem={renderPage} ItemSeparatorComponent={()=> <View style={{width:PAGE_GAP}}/>} getItemLayout={(_,index)=>({length:pageWidth+PAGE_GAP,offset:(pageWidth+PAGE_GAP)*index,index})} showsHorizontalScrollIndicator={false} snapToInterval={pageWidth+PAGE_GAP} snapToAlignment="start" decelerationRate="fast" disableIntervalMomentum directionalLockEnabled nestedScrollEnabled scrollEnabled contentContainerStyle={styles.track} initialNumToRender={2} maxToRenderPerBatch={2} windowSize={3} onMomentumScrollEnd={event=>setActivePage(Math.max(0,Math.min(pages.length-1,Math.round(event.nativeEvent.contentOffset.x/(pageWidth+PAGE_GAP)))))}/>
    {pages.length>1?<View accessibilityLabel={`Service page ${activePage+1} of ${pages.length}`} style={styles.dots}>{pages.map((_,index)=><View key={`service-dot-${index}`} style={[styles.dot,index===activePage&&styles.dotActive]}/>)}</View>:null}
  </View>;
}

const styles=StyleSheet.create({shell:{marginRight:-SPACE.lg},track:{paddingRight:16},page:{height:222,flexDirection:'row',flexWrap:'wrap',columnGap:COLUMN_GAP,rowGap:8},tile:{height:104,borderRadius:RADIUS.lg,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'flex-start',paddingHorizontal:2,...SHADOW},preferred:{backgroundColor:COLORS.yellowWash,borderWidth:1,borderColor:COLORS.yellow},pressed:{opacity:.72,transform:[{scale:.97}]},artRegion:{height:68,width:'100%',alignItems:'center',justifyContent:'center',overflow:'visible'},labelRegion:{height:34,alignItems:'center',justifyContent:'center',paddingHorizontal:1},label:{...TYPE.caption,fontSize:11,lineHeight:13,fontWeight:'800',color:COLORS.black,textAlign:'center'},badge:{position:'absolute',right:3,top:3,zIndex:2,minHeight:16,borderRadius:8,backgroundColor:COLORS.black,paddingHorizontal:4,alignItems:'center',justifyContent:'center'},badgeText:{...TYPE.caption,fontSize:8,lineHeight:10,fontWeight:'900',color:COLORS.yellow},dots:{height:10,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:4},dot:{width:5,height:5,borderRadius:3,backgroundColor:COLORS.lineDark},dotActive:{width:14,backgroundColor:COLORS.yellowDeep}});
