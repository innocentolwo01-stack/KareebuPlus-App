import React, { memo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { assets } from '../assets';
import { COLORS, RADIUS, SHADOW, SPACE, TYPE } from '../theme';
import type { MobilityPlaceConfig } from '../markets/config';
import type { VehicleMode } from './vehicle';

export const KareebuDestinationCard=memo(function KareebuDestinationCard({mode,pickup,city,onDestination,onPickup,onLater}:{mode:VehicleMode;pickup:string;city:string;onDestination:()=>void;onPickup:()=>void;onLater:()=>void}){
  const boda=mode==='BODA';
  return <View style={styles.card}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Choose destination for ${boda?'Boda':'Rides'}`} onPress={onDestination} style={styles.destination}>
      <View style={styles.destinationArt}><Image source={boda?assets.service.boda:assets.service.rides} resizeMode="contain" style={styles.art}/></View>
      <View style={styles.flex}><Text style={styles.where}>Where to?</Text><Text style={styles.support}>Search destination</Text></View><Feather name="arrow-right" size={21}/>
    </Pressable>
    <View style={styles.connector}/>
    <Pressable accessibilityRole="button" accessibilityLabel={`Change pickup from ${pickup}`} onPress={onPickup} style={styles.pickup}><View style={styles.pickupDot}/><View style={styles.flex}><Text style={styles.pickupLabel}>Pickup</Text><Text numberOfLines={1} style={styles.pickupValue}>{pickup} · {city}</Text></View><Feather name="chevron-right" size={18} color={COLORS.muted}/></Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Schedule for later" onPress={onLater} style={styles.later}><Ionicons name="calendar-outline" size={17}/><Text style={styles.laterText}>Later</Text></Pressable>
  </View>;
});

export const MobilityPlaceRail=memo(function MobilityPlaceRail({places,onPress}:{places:MobilityPlaceConfig[];onPress:(place:MobilityPlaceConfig)=>void}){
  const icon=(kind:MobilityPlaceConfig['kind'])=>kind==='home'?'home-outline':kind==='work'?'briefcase-outline':kind==='airport'?'airplane-outline':'time-outline';
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.places}>{places.map(place=><Pressable key={place.id} accessibilityRole="button" accessibilityLabel={`${place.label}. ${place.address}`} onPress={()=>onPress(place)} style={styles.place}><View style={styles.placeIcon}><Ionicons name={icon(place.kind)} size={22}/></View><View style={styles.flex}><Text numberOfLines={1} style={styles.placeTitle}>{place.label}</Text><Text numberOfLines={1} style={styles.placeMeta}>{place.address}</Text></View></Pressable>)}</ScrollView>;
});

const styles=StyleSheet.create({flex:{flex:1},card:{position:'absolute',top:70,left:16,right:16,borderRadius:RADIUS.lg,backgroundColor:COLORS.white,padding:SPACE.sm,...SHADOW},destination:{minHeight:54,flexDirection:'row',alignItems:'center',gap:SPACE.sm},destinationArt:{width:42,height:42,borderRadius:14,backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center'},art:{width:42,height:42},where:{...TYPE.cardTitle,color:COLORS.black},support:{...TYPE.caption,color:COLORS.muted,marginTop:1},connector:{height:1,backgroundColor:COLORS.line,marginLeft:50},pickup:{minHeight:42,flexDirection:'row',alignItems:'center',gap:SPACE.sm,paddingTop:4,paddingRight:70},pickupDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.yellow,borderWidth:2,borderColor:COLORS.black},pickupLabel:{...TYPE.caption,color:COLORS.muted,fontWeight:'800'},pickupValue:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},later:{position:'absolute',right:SPACE.sm,bottom:SPACE.sm,minHeight:34,borderRadius:11,backgroundColor:COLORS.surface,paddingHorizontal:SPACE.sm,flexDirection:'row',alignItems:'center',gap:4},laterText:{...TYPE.caption,fontWeight:'800'},places:{gap:SPACE.sm,paddingHorizontal:SPACE.lg,paddingVertical:4},place:{width:176,minHeight:68,borderRadius:RADIUS.md,backgroundColor:COLORS.white,padding:SPACE.sm,flexDirection:'row',alignItems:'center',gap:SPACE.sm,...SHADOW},placeIcon:{width:40,height:40,borderRadius:13,backgroundColor:COLORS.yellowWash,alignItems:'center',justifyContent:'center'},placeTitle:{...TYPE.small,fontWeight:'900'},placeMeta:{...TYPE.caption,color:COLORS.muted,marginTop:2}});
