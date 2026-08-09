import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, RoundedCard, ScreenShell, SectionTitle } from '../components';
import { formatMoney, primaryMobileMoneyFor, secondaryMobileMoneyFor } from '../locale';
import { COLORS, FONT, TYPE } from '../theme';
import type { CommercePaymentMethod, ParcelDraft, ParcelOrder } from '../parity/types';
import { applyDemand, demandQuote } from '../pricing/demand';

export type ParcelScreenData = {
  country: string;
  city: string;
  draft: ParcelDraft;
  lastOrder: ParcelOrder | null;
};

export type ParcelScreenActions = {
  go: (screen: any) => void;
  updateDraft: (patch: Partial<ParcelDraft>) => void;
  placeOrder: (order: ParcelOrder) => void;
};

const parcelTypes: Array<{ id: ParcelDraft['parcelType']; weight: number; body: string; icon: string }> = [
  { id:'Documents', weight:1, body:'Letters, paperwork and small documents', icon:'document-text-outline' },
  { id:'Small parcel', weight:3, body:'Small boxed items up to 3kg', icon:'cube-outline' },
  { id:'Medium parcel', weight:8, body:'Medium parcels up to 8kg', icon:'file-tray-stacked-outline' },
  { id:'Large parcel', weight:20, body:'Large items up to 20kg', icon:'archive-outline' },
];

function estimate(draft: ParcelDraft) {
  const base = draft.mode === 'city' ? 5000 : 12000;
  const type = parcelTypes.find((item) => item.id === draft.parcelType) ?? parcelTypes[0]!;
  const weightFee = Math.max(0, draft.weightKg - 1) * (draft.mode === 'city' ? 1200 : 2000);
  const baseFee = Math.round(base + weightFee + type.weight * 250);
  const demand = demandQuote('parcel-delivery', { scheduled: draft.mode === 'country' });
  const priced = applyDemand(baseFee, demand);
  return { ...priced, demand };
}

export function ParcelStartScreen({ data, actions }: { data: ParcelScreenData; actions: ParcelScreenActions }) {
  const quote = estimate(data.draft);
  return <ScreenShell><Header title="Send parcel" onBack={() => actions.go('home')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
    <View style={styles.segment}><Pressable onPress={() => actions.updateDraft({ mode:'city' })} style={[styles.segmentItem,data.draft.mode==='city'&&styles.segmentActive]}><Text style={[styles.segmentText,data.draft.mode==='city'&&styles.segmentTextActive]}>Within {data.city}</Text></Pressable><Pressable onPress={() => actions.updateDraft({ mode:'country' })} style={[styles.segmentItem,data.draft.mode==='country'&&styles.segmentActive]}><Text style={[styles.segmentText,data.draft.mode==='country'&&styles.segmentTextActive]}>Across {data.country}</Text></Pressable></View>
    <Text style={styles.title}>What are you sending?</Text><Text style={styles.subtitle}>Choose a parcel type, then confirm pickup and destination.</Text>
    <View style={styles.typeGrid}>{parcelTypes.map((item) => { const active=data.draft.parcelType===item.id; return <Pressable key={item.id} onPress={() => actions.updateDraft({ parcelType:item.id, weightKg:item.weight })} style={[styles.typeCard,active&&styles.typeCardActive]}><View style={styles.typeIcon}><Ionicons name={item.icon as any} size={25} color={active?COLORS.white:COLORS.black}/></View><Text style={[styles.typeName,active&&{color:COLORS.white}]}>{item.id}</Text><Text style={[styles.typeBody,active&&{color:'#EDEDED'}]}>{item.body}</Text></Pressable>; })}</View>
    <SectionTitle title="Route" />
    <Field icon="location-outline" label="Pickup address" value={data.draft.pickupAddress} onChange={(value)=>actions.updateDraft({pickupAddress:value})}/>
    <Field icon="flag-outline" label="Drop-off address" value={data.draft.dropoffAddress} onChange={(value)=>actions.updateDraft({dropoffAddress:value})}/>
    <View style={styles.weightRow}><View><Text style={styles.fieldLabel}>Weight</Text><Text style={styles.weightMeta}>Adjust if needed</Text></View><View style={styles.stepper}><Pressable onPress={()=>actions.updateDraft({weightKg:Math.max(.5,data.draft.weightKg-.5)})}><Feather name="minus" size={17}/></Pressable><Text style={styles.stepperValue}>{data.draft.weightKg}kg</Text><Pressable onPress={()=>actions.updateDraft({weightKg:Math.min(20,data.draft.weightKg+.5)})}><Feather name="plus" size={17}/></Pressable></View></View>
    <RoundedCard style={styles.estimate}><Ionicons name="calculator-outline" size={23}/><View style={styles.flex}><Text style={styles.estimateTitle}>Estimated price</Text><Text style={styles.estimateBody}>{data.draft.mode==='city'?'30–60 min':'Same day / next day'} · {formatMoney(data.country,quote.totalFee)}</Text></View></RoundedCard><RoundedCard style={styles.demandCard}><Ionicons name="pulse-outline" size={20} color={COLORS.red}/><View style={styles.flex}><Text style={styles.demandTitle}>{quote.demand.label} · {quote.demand.multiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>Courier demand is included in this estimate.</Text></View></RoundedCard>
    <PrimaryButton disabled={!data.draft.pickupAddress.trim()||!data.draft.dropoffAddress.trim()} label="Continue" onPress={()=>actions.go('parcelContacts')}/>
  </ScrollView></ScreenShell>;
}

function Field({ icon, label, value, onChange, keyboardType='default' }: { icon:string; label:string; value:string; onChange:(value:string)=>void; keyboardType?:'default'|'phone-pad' }) {
  return <View style={styles.field}><View style={styles.fieldIcon}><Ionicons name={icon as any} size={20}/></View><View style={styles.flex}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChange} keyboardType={keyboardType} placeholder={label} placeholderTextColor={COLORS.muted} style={styles.fieldInput}/></View></View>;
}

export function ParcelContactsScreen({ data, actions }: { data: ParcelScreenData; actions: ParcelScreenActions }) {
  const valid=data.draft.senderName.trim()&&data.draft.senderPhone.trim()&&data.draft.receiverName.trim()&&data.draft.receiverPhone.trim();
  return <ScreenShell><Header title="Sender & receiver" onBack={()=>actions.go('parcel')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
    <SectionTitle title="Sender"/><Field icon="person-outline" label="Sender name" value={data.draft.senderName} onChange={(senderName)=>actions.updateDraft({senderName})}/><Field icon="call-outline" label="Sender phone" value={data.draft.senderPhone} keyboardType="phone-pad" onChange={(senderPhone)=>actions.updateDraft({senderPhone})}/>
    <SectionTitle title="Receiver"/><Field icon="person-outline" label="Receiver name" value={data.draft.receiverName} onChange={(receiverName)=>actions.updateDraft({receiverName})}/><Field icon="call-outline" label="Receiver phone" value={data.draft.receiverPhone} keyboardType="phone-pad" onChange={(receiverPhone)=>actions.updateDraft({receiverPhone})}/>
    <SectionTitle title="Delivery instructions"/><TextInput value={data.draft.instructions} onChangeText={(instructions)=>actions.updateDraft({instructions})} placeholder="Gate, landmark, fragile item, call on arrival…" placeholderTextColor={COLORS.muted} multiline style={styles.note}/>
    <PrimaryButton disabled={!valid} label="Review delivery" onPress={()=>actions.go('parcelReview')}/>
  </ScrollView></ScreenShell>;
}

export function ParcelReviewScreen({ data, actions }: { data: ParcelScreenData; actions: ParcelScreenActions }) {
  const quote=estimate(data.draft);
  const payments:Array<{id:CommercePaymentMethod;label:string}>=[{id:'mtn',label:primaryMobileMoneyFor(data.country)},{id:'airtel',label:secondaryMobileMoneyFor(data.country)},{id:'visa',label:'Visa •••• 4242'},{id:'cash',label:'Cash'}];
  return <ScreenShell><Header title="Review parcel" onBack={()=>actions.go('parcelContacts')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <RoundedCard style={styles.routeCard}><RouteLine icon="radio-button-on-outline" title={data.draft.pickupAddress} body={`${data.draft.senderName} · ${data.draft.senderPhone}`}/><View style={styles.connector}/><RouteLine icon="location-outline" title={data.draft.dropoffAddress} body={`${data.draft.receiverName} · ${data.draft.receiverPhone}`}/></RoundedCard>
    <RoundedCard style={styles.summary}><Summary label="Parcel" value={`${data.draft.parcelType} · ${data.draft.weightKg}kg`}/><Summary label="Delivery" value={data.draft.mode==='city'?'30–60 min':'Same day / next day'}/>{data.draft.instructions?<Summary label="Instructions" value={data.draft.instructions}/>:null}</RoundedCard>
    <SectionTitle title="Payment"/><RoundedCard style={styles.paymentCard}>{payments.map((payment)=>{const active=data.draft.paymentMethod===payment.id;return <Pressable key={payment.id} onPress={()=>actions.updateDraft({paymentMethod:payment.id})} style={styles.paymentRow}><View style={[styles.radio,active&&styles.radioActive]}>{active?<View style={styles.radioDot}/>:null}</View><Text style={styles.paymentText}>{payment.label}</Text></Pressable>})}</RoundedCard>
    <RoundedCard style={styles.demandCard}><Ionicons name="pulse-outline" size={20} color={COLORS.red}/><View style={styles.flex}><Text style={styles.demandTitle}>{quote.demand.label} · {quote.demand.multiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>{quote.demand.reason}</Text></View></RoundedCard><RoundedCard style={styles.summary}><Summary label="Base delivery" value={formatMoney(data.country,quote.baseFee)}/>{quote.demandAdjustment!==0?<Summary label="Demand adjustment" value={`${quote.demandAdjustment>0?'+':'−'}${formatMoney(data.country,Math.abs(quote.demandAdjustment))}`}/>:null}</RoundedCard><RoundedCard style={styles.totalCard}><View><Text style={styles.totalLabel}>Delivery total</Text><Text style={styles.totalMeta}>Demand-adjusted quote before dispatch</Text></View><Text style={styles.totalValue}>{formatMoney(data.country,quote.totalFee)}</Text></RoundedCard>
    <PrimaryButton label={`Book delivery · ${formatMoney(data.country,quote.totalFee)}`} onPress={()=>{actions.placeOrder({id:`P${Date.now().toString().slice(-6)}`,fee:quote.totalFee,eta:data.draft.mode==='city'?'30–60 min':'Same day / next day',status:'confirmed',pickupAddress:data.draft.pickupAddress,dropoffAddress:data.draft.dropoffAddress,receiverName:data.draft.receiverName,parcelType:data.draft.parcelType});actions.go('parcelSuccess')}}/>
  </ScrollView></ScreenShell>;
}

function RouteLine({icon,title,body}:{icon:string;title:string;body:string}){return <View style={styles.routeLine}><View style={styles.routeIcon}><Ionicons name={icon as any} size={20} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.routeTitle}>{title}</Text><Text style={styles.routeBody}>{body}</Text></View></View>}
function Summary({label,value}:{label:string;value:string}){return <View style={styles.summaryRow}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>}

export function ParcelSuccessScreen({ data, actions }: { data: ParcelScreenData; actions: ParcelScreenActions }) {
  const order=data.lastOrder;
  if(!order)return <ParcelStartScreen data={data} actions={actions}/>;
  return <ScreenShell><View style={styles.success}><View style={styles.successIcon}><Feather name="check" size={42}/></View><Text style={styles.successTitle}>Courier request confirmed</Text><Text style={styles.successBody}>Parcel #{order.id} is being matched to a nearby courier. You can follow every handover from pickup to delivery.</Text><RoundedCard style={styles.totalCard}><View><Text style={styles.totalLabel}>{order.parcelType}</Text><Text style={styles.totalMeta}>{order.pickupAddress} → {order.dropoffAddress}</Text></View><Text style={styles.totalValue}>{formatMoney(data.country,order.fee)}</Text></RoundedCard><PrimaryButton label="Track parcel" onPress={()=>actions.go('parcelTracking')}/><Pressable onPress={()=>actions.go('home')}><Text style={styles.link}>Back to home</Text></Pressable></View></ScreenShell>;
}

export function ParcelTrackingScreen({ data, actions }: { data: ParcelScreenData; actions: ParcelScreenActions }) {
  const order=data.lastOrder;
  const steps=['Confirmed','Courier assigned','Picked up','In transit','Delivered'];
  return <ScreenShell><Header title="Track parcel" onBack={()=>actions.go('orders')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>{order?<><Text style={styles.trackingId}>Parcel #{order.id}</Text><Text style={styles.trackingEta}>{order.eta}</Text><RoundedCard style={styles.routeCard}><RouteLine icon="radio-button-on-outline" title={order.pickupAddress} body="Pickup"/><View style={styles.connector}/><RouteLine icon="location-outline" title={order.dropoffAddress} body={`Receiver · ${order.receiverName}`}/></RoundedCard><View style={styles.timeline}>{steps.map((step,index)=><View key={step} style={styles.timelineRow}><View style={[styles.timelineDot,index<2&&styles.timelineDotActive]}>{index<2?<Feather name="check" size={11}/>:null}</View><View><Text style={[styles.timelineTitle,index<2&&styles.timelineTitleActive]}>{step}</Text><Text style={styles.timelineBody}>{index===0?'Booking received':index===1?'Peter is 7 min from pickup':'Updates appear here as the courier moves'}</Text></View></View>)}</View><PrimaryButton label="Contact courier" onPress={()=>actions.go('messages')}/></>:<Text style={styles.subtitle}>No active parcel delivery.</Text>}</ScrollView></ScreenShell>;
}

const styles=StyleSheet.create({
  flex:{flex:1},scroll:{paddingHorizontal:20,paddingTop:14,paddingBottom:34,gap:16},title:{fontFamily:FONT.bold,fontSize:28,fontWeight:'900'},subtitle:{...TYPE.body,color:COLORS.muted,lineHeight:21},segment:{height:48,borderRadius:16,backgroundColor:COLORS.surface,flexDirection:'row',padding:4},segmentItem:{flex:1,borderRadius:12,alignItems:'center',justifyContent:'center'},segmentActive:{backgroundColor:COLORS.black},segmentText:{...TYPE.small,fontWeight:'800'},segmentTextActive:{color:COLORS.white},typeGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},typeCard:{width:'48.5%',minHeight:152,borderWidth:1,borderColor:COLORS.line,borderRadius:18,padding:14,gap:7},typeCardActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},typeIcon:{width:40,height:40,borderRadius:13,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},typeName:{...TYPE.cardTitle},typeBody:{...TYPE.small,color:COLORS.muted,lineHeight:17},field:{minHeight:72,borderWidth:1,borderColor:COLORS.line,borderRadius:17,padding:12,flexDirection:'row',alignItems:'center',gap:11},fieldIcon:{width:38,height:38,borderRadius:12,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},fieldLabel:{...TYPE.caption,color:COLORS.muted},fieldInput:{fontFamily:FONT.bold,fontSize:15,fontWeight:'800',paddingVertical:3,color:COLORS.black},weightRow:{minHeight:66,borderWidth:1,borderColor:COLORS.line,borderRadius:17,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},weightMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},stepper:{height:36,borderWidth:1,borderColor:COLORS.line,borderRadius:12,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:10},stepperValue:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900'},demandCard:{padding:13,flexDirection:'row',alignItems:'center',gap:10,backgroundColor:'#FFF8E8',shadowOpacity:0},demandTitle:{...TYPE.bodyStrong,color:COLORS.black},demandMeta:{...TYPE.small,color:COLORS.muted,marginTop:2},estimate:{padding:14,flexDirection:'row',alignItems:'center',gap:11,shadowOpacity:0},estimateTitle:{...TYPE.cardTitle},estimateBody:{...TYPE.small,color:COLORS.muted,marginTop:3},note:{minHeight:96,borderWidth:1,borderColor:COLORS.line,borderRadius:17,padding:14,textAlignVertical:'top',fontFamily:FONT.regular,fontSize:15},routeCard:{padding:15,shadowOpacity:0},routeLine:{minHeight:54,flexDirection:'row',gap:10,alignItems:'center'},routeIcon:{width:34,height:34,borderRadius:17,backgroundColor:'#FFF0EE',alignItems:'center',justifyContent:'center'},routeTitle:{...TYPE.cardTitle},routeBody:{...TYPE.small,color:COLORS.muted,marginTop:3},connector:{width:2,height:17,backgroundColor:COLORS.lineDark,marginLeft:16},summary:{padding:15,gap:10,shadowOpacity:0},summaryRow:{flexDirection:'row',justifyContent:'space-between',gap:16},summaryLabel:{...TYPE.body,color:COLORS.muted},summaryValue:{...TYPE.bodyStrong,flex:1,textAlign:'right'},paymentCard:{paddingHorizontal:14,shadowOpacity:0},paymentRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:COLORS.line},radio:{width:23,height:23,borderRadius:12,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},radioActive:{borderColor:COLORS.red},radioDot:{width:11,height:11,borderRadius:6,backgroundColor:COLORS.red},paymentText:{...TYPE.bodyStrong},totalCard:{padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between',shadowOpacity:0},totalLabel:{...TYPE.cardTitle},totalMeta:{...TYPE.small,color:COLORS.muted,marginTop:3,maxWidth:230},totalValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900'},success:{flex:1,paddingHorizontal:24,justifyContent:'center',gap:18},successIcon:{width:84,height:84,borderRadius:42,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',alignSelf:'center'},successTitle:{fontFamily:FONT.bold,fontSize:29,fontWeight:'900',textAlign:'center'},successBody:{...TYPE.body,color:COLORS.muted,lineHeight:22,textAlign:'center'},link:{...TYPE.action,color:COLORS.red,textAlign:'center'},trackingId:{...TYPE.screenTitle},trackingEta:{...TYPE.body,color:COLORS.muted},timeline:{gap:0},timelineRow:{minHeight:72,flexDirection:'row',gap:12},timelineDot:{width:24,height:24,borderRadius:12,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},timelineDotActive:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellow},timelineTitle:{...TYPE.cardTitle,color:COLORS.muted},timelineTitleActive:{color:COLORS.black},timelineBody:{...TYPE.small,color:COLORS.muted,marginTop:3},
});
