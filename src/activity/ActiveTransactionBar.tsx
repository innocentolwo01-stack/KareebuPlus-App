import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, TYPE } from '../theme';
import type { Screen } from '../types';
import type { AppData } from '../screens';
import type { UnifiedTransaction } from './transactionEngine';

type CommonStatus = 'Choosing' | 'Confirming' | 'Finding / preparing' | 'In progress' | 'Completed';
type ActiveTransaction = { service: string; status: CommonStatus; detail: string; progress: number; screen: Screen };

export function activeTransactionFor(data: AppData): ActiveTransaction | null {
  if (data.captainRideStatus === 'requested') return { service:'Ride',status:'Finding / preparing',detail:'Finding your captain',progress:.4,screen:'driver' };
  if (data.captainRideStatus === 'accepted') return { service:'Ride',status:'Confirming',detail:'Captain is heading to pickup',progress:.58,screen:'driver' };
  if (data.captainRideStatus === 'ongoing') return { service:'Ride',status:'In progress',detail:'Trip underway',progress:.78,screen:'onTrip' };
  if (data.lastFoodOrder?.status === 'confirmed') return { service:'Food',status:'Finding / preparing',detail:`Order ${data.lastFoodOrder.id}`,progress:.42,screen:'orderTracking' };
  if (data.lastCommerceOrder?.status === 'confirmed') return { service:'Shop',status:'Finding / preparing',detail:`Order ${data.lastCommerceOrder.id}`,progress:.42,screen:'commerceOrderSuccess' };
  if (data.lastParcelOrder) return { service:'Send',status:'In progress',detail:`Parcel ${data.lastParcelOrder.id}`,progress:.65,screen:'parcelTracking' };
  if (data.lastServiceBooking) return { service:'Home & Care',status:'Confirming',detail:'Service booking',progress:.3,screen:'serviceTracking' };
  if (data.lastGlobalOrder && !['delivered','cancelled','refunded'].includes(data.lastGlobalOrder.status)) return { service:'Global',status:'In progress',detail:data.lastGlobalOrder.status.replaceAll('_',' '),progress:.5,screen:'globalTracking' };
  return null;
}

export function unifiedActiveTransaction(data: AppData): UnifiedTransaction | null {
  const active=activeTransactionFor(data); if(!active)return null;
  return {id:`active-${active.service.toLowerCase()}`,kind:active.service==='Global'?'global':active.service==='Food'?'food':active.service==='Shop'?'shops':active.service==='Send'?'send':active.service==='Ride'?'rides':'services',phase:active.status==='In progress'?'in_progress':active.status==='Confirming'?'confirming':'processing',substate:active.detail,title:active.service,detail:active.detail,updatedAt:new Date().toISOString(),screen:active.screen,active:true,source:'local-session'};
}

export function ActiveTransactionBar({ data, go }: { data: AppData; go: (screen: Screen) => void }) {
  const active = activeTransactionFor(data); if (!active) return null;
  return <Pressable accessibilityRole="button" accessibilityLabel={`${active.service}, ${active.status}, ${active.detail}`} onPress={() => go(active.screen)} style={styles.root}>
    <View style={styles.icon}><Ionicons name="navigate" size={18} color={COLORS.black}/></View><View style={styles.copy}><Text style={styles.title}>{active.service} · {active.status}</Text><Text numberOfLines={1} style={styles.detail}>{active.detail}</Text><View style={styles.track}><View style={[styles.progress,{width:`${active.progress*100}%`}]}/></View></View><Ionicons name="chevron-forward" size={20} color={COLORS.muted}/>
  </Pressable>;
}
const styles=StyleSheet.create({root:{minHeight:62,marginHorizontal:12,marginBottom:4,borderRadius:RADIUS.lg,backgroundColor:COLORS.yellowWash,borderWidth:1,borderColor:'#F5E5A9',paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:10,shadowColor:'#000',shadowOpacity:.06,shadowRadius:9,shadowOffset:{width:0,height:3},elevation:2},icon:{width:36,height:36,borderRadius:18,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},copy:{flex:1},title:{...TYPE.bodyStrong,color:COLORS.black},detail:{...TYPE.small,color:COLORS.muted,marginTop:1},track:{height:3,borderRadius:2,backgroundColor:'#E8DFC4',marginTop:6,overflow:'hidden'},progress:{height:3,backgroundColor:COLORS.yellowDeep},});
