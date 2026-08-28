import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header, PrimaryButton, RoundedCard, ScreenShell, SectionTitle } from '../components';
import { formatMoney } from '../locale';
import { COLORS, FONT, TYPE } from '../theme';
import type { RideId, Screen } from '../types';
import type { VehicleMode } from './vehicle';
import type { MobilityPlaceConfig } from '../markets/config';
import { captainOffers, RideFareBreakdown, RidePlan, RideProduct, RideReceipt, rideFareBreakdown, rideLabel } from './mobility';

import { KareebuBodaHomeScreen } from './kareebuBodaHome';

export type MobilityData = {
  country: string;
  city: string;
  selectedVehicleMode: VehicleMode;
  selectedRide: RideId;
  selectedRideBidId: string | null;
  scheduledTrip: string | null;
  selectedPaymentLabel: string;
  pickup: string;
  destination: string;
  rideProduct: RideProduct;
  ridePriority: boolean;
  ridePromoCode: string;
  ridePlan: RidePlan;
  lastRideReceipt: RideReceipt | null;
  member: boolean;
  baseFare: number;
};

export type MobilityActions = {
  go: (screen: Screen) => void;
  selectMode: (mode: VehicleMode) => void;
  selectRide: (ride: RideId) => void;
  setRideProduct: (product: RideProduct) => void;
  setRidePriority: (value: boolean) => void;
  setRidePromoCode: (value: string) => void;
  updateRidePlan: (patch: Partial<RidePlan>) => void;
  setScheduledTrip: (value: string | null) => void;
  prefillDestination: (place: MobilityPlaceConfig) => void;
};

function MobilityShortcut({ icon, title, body, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.shortcut}><View style={styles.shortcutIcon}><Ionicons name={icon} size={22} color={COLORS.black}/></View><View style={styles.flex}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.meta}>{body}</Text></View><Feather name="chevron-right" size={21} color={COLORS.black}/></Pressable>;
}

// KAREEBU_BODA_RIDES_PARITY_V1
export function MobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  if (data.selectedVehicleMode === 'BODA') {
    return <KareebuBodaHomeScreen data={data} actions={actions} />;
  }

  return <LegacyMobilityHomeScreen data={data} actions={actions} />;
}

function LegacyMobilityHomeScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  return <ScreenShell>
    <Header title="Rides" onBack={()=>actions.go('home')} right={<Pressable onPress={()=>actions.go('rideHistory')}><Ionicons name="time-outline" size={24} color={COLORS.black}/></Pressable>}/>
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>KAREEBU MOBILITY</Text>
        <Text style={styles.heroTitle}>Where are you going?</Text>
        <Pressable onPress={()=>actions.go('whereTo')} style={styles.destination}><Ionicons name="search" size={22} color={COLORS.black}/><Text style={styles.destinationText}>Enter destination</Text><Feather name="arrow-right" size={20} color={COLORS.black}/></Pressable>
        <View style={styles.modeRow}>
          <Pressable onPress={()=>{actions.selectMode('RIDE');actions.selectRide('economy');actions.go('whereTo')}} style={[styles.modeCard,data.selectedVehicleMode==='RIDE'&&styles.modeCardActive]}><MaterialCommunityIcons name="car-hatchback" size={35} color={COLORS.black}/><Text style={styles.modeTitle}>Ride</Text><Text style={styles.modeMeta}>Cars for every trip</Text></Pressable>
          <Pressable onPress={()=>{actions.selectMode('BODA');actions.selectRide('boda');actions.go('whereTo')}} style={[styles.modeCard,data.selectedVehicleMode==='BODA'&&styles.modeCardActive]}><MaterialCommunityIcons name="motorbike" size={35} color={COLORS.black}/><Text style={styles.modeTitle}>Boda</Text><Text style={styles.modeMeta}>Fast through traffic</Text></Pressable>
        </View>
      </View>

      <SectionTitle title="Plan ahead"/>
      <RoundedCard style={styles.stackCard}>
        <MobilityShortcut icon="calendar-outline" title="Schedule a ride" body={data.scheduledTrip ?? 'Book a pickup for later'} onPress={()=>actions.go('rideSchedule')}/>
        <MobilityShortcut icon="briefcase-outline" title="Work rides" body="Recurring weekday commute" onPress={()=>actions.go('workRide')}/>
        <MobilityShortcut icon="school-outline" title="School runs" body="Safeguarded recurring journeys" onPress={()=>actions.go('schoolRun')}/>
      </RoundedCard>

      <RoundedCard style={styles.priorityCard}>
        <View style={styles.priorityIcon}><Ionicons name="flash" size={22} color={COLORS.black}/></View>
        <View style={styles.flex}><Text style={styles.cardTitle}>Priority matching</Text><Text style={styles.meta}>Move closer to the front of the Captain queue during busy periods.</Text></View>
        <Pressable onPress={()=>actions.setRidePriority(!data.ridePriority)} style={[styles.toggle,data.ridePriority&&styles.toggleOn]}><View style={[styles.knob,data.ridePriority&&styles.knobOn]}/></Pressable>
      </RoundedCard>

      {data.lastRideReceipt ? <><SectionTitle title="Recent trip"/><Pressable onPress={()=>actions.go('rideReceipt')}><RoundedCard style={styles.recent}><View style={styles.recentIcon}><Ionicons name="car-outline" size={23}/></View><View style={styles.flex}><Text style={styles.cardTitle}>{data.lastRideReceipt.destination}</Text><Text style={styles.meta}>{data.lastRideReceipt.dateLabel} · {data.lastRideReceipt.captainName}</Text></View><Text style={styles.amount}>{formatMoney(data.country,data.lastRideReceipt.fare.total)}</Text></RoundedCard></Pressable></> : null}
    </ScrollView>
  </ScreenShell>;
}

export function RideScheduleScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const options=['In 30 minutes','Tonight · 7:00 PM','Tomorrow · 8:00 AM','Tomorrow · 5:30 PM'];
  return <ScreenShell><Header title="Schedule ride" onBack={()=>actions.go('mobilityHome')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <Text style={styles.pageTitle}>When should your Captain arrive?</Text><Text style={styles.pageBody}>Scheduled rides lock in your pickup time before you choose the vehicle and fare.</Text>
    <View style={styles.optionList}>{options.map(option=><Pressable key={option} onPress={()=>{actions.setRideProduct('scheduled');actions.setScheduledTrip(option);actions.updateRidePlan({product:'scheduled',scheduledLabel:option});}} style={[styles.option,data.scheduledTrip===option&&styles.optionActive]}><View><Text style={styles.cardTitle}>{option}</Text><Text style={styles.meta}>{data.city}</Text></View>{data.scheduledTrip===option?<Ionicons name="checkmark-circle" size={23} color={COLORS.red}/>:<View style={styles.radio}/>}</Pressable>)}</View>
    <PrimaryButton disabled={!data.scheduledTrip} label="Choose destination" onPress={()=>actions.go('whereTo')}/>
  </ScrollView></ScreenShell>;
}

function DaySelector({ days, setDays }: { days:string[]; setDays:(days:string[])=>void }) {
  return <View style={styles.days}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day=>{const active=days.includes(day);return <Pressable key={day} onPress={()=>setDays(active?days.filter(item=>item!==day):[...days,day])} style={[styles.day,active&&styles.dayActive]}><Text style={[styles.dayText,active&&styles.dayTextActive]}>{day.slice(0,1)}</Text></Pressable>})}</View>;
}

export function WorkRideScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const [days,setDays]=useState(data.ridePlan.days.length?data.ridePlan.days:['Mon','Tue','Wed','Thu','Fri']);
  const [morning,setMorning]=useState(data.ridePlan.morningTime??'07:30');
  const [evening,setEvening]=useState(data.ridePlan.returnTime??'17:30');
  return <ScreenShell><Header title="Work rides" onBack={()=>actions.go('mobilityHome')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <View style={styles.planHero}><Ionicons name="briefcase-outline" size={40}/><Text style={styles.planTitle}>Set up your commute once</Text><Text style={styles.planBody}>Kareebu can prepare the same journey on the days you work. You stay in control of every booking.</Text></View>
    <SectionTitle title="Days"/><DaySelector days={days} setDays={setDays}/>
    <SectionTitle title="Times"/><RoundedCard style={styles.fieldCard}><Text style={styles.fieldLabel}>Morning pickup</Text><TextInput value={morning} onChangeText={setMorning} style={styles.input} placeholder="07:30"/><Text style={styles.fieldLabel}>Return pickup</Text><TextInput value={evening} onChangeText={setEvening} style={styles.input} placeholder="17:30"/></RoundedCard>
    <PrimaryButton label="Choose commute route" onPress={()=>{actions.setRideProduct('work');actions.updateRidePlan({product:'work',days,morningTime:morning,returnTime:evening});actions.go('whereTo')}}/>
  </ScrollView></ScreenShell>;
}

export function SchoolRunScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const [child,setChild]=useState(data.ridePlan.childName);
  const [school,setSchool]=useState(data.ridePlan.schoolName);
  const [adult,setAdult]=useState(data.ridePlan.authorisedAdult);
  return <ScreenShell><Header title="School run" onBack={()=>actions.go('mobilityHome')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <View style={styles.schoolHero}><Ionicons name="shield-checkmark-outline" size={45}/><Text style={styles.planTitle}>Safeguarded school journeys</Text><Text style={styles.planBody}>Under-16 journeys use enhanced Captain eligibility, pickup verification and authorised-adult controls.</Text></View>
    <RoundedCard style={styles.fieldCard}><Text style={styles.fieldLabel}>Child's name</Text><TextInput value={child} onChangeText={setChild} style={styles.input} placeholder="Child's name"/><Text style={styles.fieldLabel}>School</Text><TextInput value={school} onChangeText={setSchool} style={styles.input} placeholder="School name"/><Text style={styles.fieldLabel}>Authorised adult</Text><TextInput value={adult} onChangeText={setAdult} style={styles.input} placeholder="Parent / guardian"/></RoundedCard>
    <RoundedCard style={styles.safeguard}><SafetyPoint icon="person-circle-outline" text="Verified Captain profile and vehicle"/><SafetyPoint icon="key-outline" text="Pickup PIN required before journey starts"/><SafetyPoint icon="notifications-outline" text="Guardian gets arrival and completion alerts"/><SafetyPoint icon="location-outline" text="Live trip sharing remains active throughout"/></RoundedCard>
    <PrimaryButton disabled={!child.trim()||!school.trim()||!adult.trim()} label="Set school route" onPress={()=>{actions.setRideProduct('school');actions.updateRidePlan({product:'school',childName:child,schoolName:school,authorisedAdult:adult});actions.go('whereTo')}}/>
  </ScrollView></ScreenShell>;
}

function SafetyPoint({icon,text}:{icon:keyof typeof Ionicons.glyphMap;text:string}){return <View style={styles.safetyPoint}><Ionicons name={icon} size={21}/><Text style={styles.safetyPointText}>{text}</Text></View>}

export function RideFareDetailsScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const offer = captainOffers(data.baseFare,data.country,data.selectedVehicleMode).find(item=>item.id===data.selectedRideBidId);
  const fare=rideFareBreakdown({baseFare:data.baseFare,offeredFare:offer?.fare,rideProduct:data.rideProduct,vehicleMode:data.selectedVehicleMode,priority:data.ridePriority,member:data.member,promoCode:data.ridePromoCode,country:data.country});
  return <ScreenShell><Header title="Fare details" onBack={()=>actions.go('confirmBooking')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <RoundedCard style={styles.routeCard}><Text style={styles.routeLabel}>TRIP</Text><Text style={styles.routeMain}>{data.pickup}</Text><View style={styles.routeLine}/><Text style={styles.routeMain}>{data.destination}</Text></RoundedCard>
    <RoundedCard style={styles.fareCard}><FareRow label={offer?`${offer.captainName} offer`:`${rideLabel(data.selectedRide)} fare`} amount={fare.baseFare} country={data.country}/><View style={styles.demandSummary}><View><Text style={styles.demandTitle}>{fare.demandLabel} · {fare.demandMultiplier.toFixed(2)}×</Text><Text style={styles.demandMeta}>{fare.demandReason}</Text></View></View><FareRow label="Demand adjustment" amount={fare.demandAdjustment} country={data.country}/><FareRow label="Booking fee" amount={fare.bookingFee} country={data.country}/>{fare.priorityFee?<FareRow label="Priority matching" amount={fare.priorityFee} country={data.country}/>:null}{fare.membershipSaving?<FareRow label="Kareebu Black saving" amount={-fare.membershipSaving} country={data.country}/>:null}{fare.promoDiscount?<FareRow label="Promotion" amount={-fare.promoDiscount} country={data.country}/>:null}<View style={styles.divider}/><View style={styles.totalRow}><Text style={styles.totalLabel}>Estimated total</Text><Text style={styles.totalAmount}>{formatMoney(data.country,fare.total)}</Text></View></RoundedCard>
    <RoundedCard style={styles.promoCard}><View style={styles.flex}><Text style={styles.cardTitle}>Ride promotion</Text><Text style={styles.meta}>Try RIDE10 for a demo discount.</Text></View><TextInput value={data.ridePromoCode} onChangeText={actions.setRidePromoCode} placeholder="Promo code" autoCapitalize="characters" style={styles.promoInput}/></RoundedCard>
    <Text style={styles.disclaimer}>Your final price can change if the route, waiting time or trip destination changes. Kareebu shows any change before it is charged.</Text>
  </ScrollView></ScreenShell>;
}

function FareRow({label,amount,country}:{label:string;amount:number;country:string}){return <View style={styles.fareRow}><Text style={styles.fareLabel}>{label}</Text><Text style={styles.fareValue}>{amount<0?'-':''}{formatMoney(country,Math.abs(amount))}</Text></View>}

export function CaptainProfileScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const offers=captainOffers(data.baseFare,data.country,data.selectedVehicleMode);
  const captain=offers.find(item=>item.id===data.selectedRideBidId)??offers[0];
  return <ScreenShell><Header title="Captain" onBack={()=>actions.go('driver')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <View style={styles.captainHero}><View style={styles.avatar}><Text style={styles.avatarText}>{captain.captainName[0]}</Text></View><Text style={styles.captainName}>{captain.captainName}</Text><Text style={styles.captainRating}>★ {captain.rating} · {captain.completedTrips.toLocaleString()} completed trips</Text><View style={styles.verify}><Ionicons name="shield-checkmark" size={17} color={COLORS.green}/><Text style={styles.verifyText}>Identity and vehicle verified</Text></View></View>
    <RoundedCard style={styles.vehicleCard}><Text style={styles.routeLabel}>VEHICLE</Text><Text style={styles.vehicleTitle}>{captain.vehicleMake} {captain.vehicleModel}</Text><Text style={styles.meta}>{captain.colour} · {captain.registration}</Text><View style={styles.vehicleFacts}><Fact label="ETA" value={`${captain.etaMinutes} min`}/><Fact label="Rating" value={`${captain.rating} ★`}/><Fact label="Fare" value={formatMoney(data.country,captain.fare)}/></View></RoundedCard>
    <RoundedCard style={styles.safeguard}><SafetyPoint icon="card-outline" text="Captain licence and identity verified"/><SafetyPoint icon="car-outline" text="Vehicle registration checked"/><SafetyPoint icon="star-outline" text="Ratings based on completed Kareebu trips"/>{captain.safetyEligible?<SafetyPoint icon="school-outline" text="Eligible for enhanced safeguarded journeys"/>:null}</RoundedCard>
    <PrimaryButton label="Back to trip" onPress={()=>actions.go('driver')}/>
  </ScrollView></ScreenShell>;
}

function Fact({label,value}:{label:string;value:string}){return <View><Text style={styles.factLabel}>{label}</Text><Text style={styles.factValue}>{value}</Text></View>}

export function RideHistoryScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const sample = data.lastRideReceipt ? [data.lastRideReceipt] : [];
  return <ScreenShell><Header title="Ride activity" onBack={()=>actions.go('mobilityHome')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    {sample.length?sample.map(item=><Pressable key={item.id} onPress={()=>actions.go('rideReceipt')}><RoundedCard style={styles.historyCard}><View style={styles.historyIcon}><Ionicons name="car-outline" size={22}/></View><View style={styles.flex}><Text style={styles.cardTitle}>{item.destination}</Text><Text style={styles.meta}>{item.dateLabel}</Text><Text style={styles.meta}>{item.captainName} · {item.vehicle}</Text></View><View style={{alignItems:'flex-end'}}><Text style={styles.amount}>{formatMoney(data.country,item.fare.total)}</Text><Feather name="chevron-right" size={20}/></View></RoundedCard></Pressable>):<RoundedCard style={styles.empty}><Ionicons name="car-outline" size={36}/><Text style={styles.cardTitle}>No completed rides yet</Text><Text style={styles.meta}>Your ride receipts and trip history will appear here.</Text><PrimaryButton label="Book a ride" onPress={()=>actions.go('whereTo')}/></RoundedCard>}
  </ScrollView></ScreenShell>;
}

export function RideReceiptScreen({ data, actions }: { data: MobilityData; actions: MobilityActions }) {
  const item=data.lastRideReceipt;
  if(!item)return <RideHistoryScreen data={data} actions={actions}/>;
  return <ScreenShell><Header title="Ride receipt" onBack={()=>actions.go('rideHistory')}/><ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
    <View style={styles.receiptHero}><Ionicons name="checkmark-circle" size={52} color={COLORS.green}/><Text style={styles.pageTitle}>Trip completed</Text><Text style={styles.meta}>{item.dateLabel}</Text></View>
    <RoundedCard style={styles.routeCard}><Text style={styles.routeMain}>{item.pickup}</Text><View style={styles.routeLine}/><Text style={styles.routeMain}>{item.destination}</Text></RoundedCard>
    <RoundedCard style={styles.vehicleCard}><Text style={styles.cardTitle}>{item.captainName}</Text><Text style={styles.meta}>{item.vehicle} · {item.registration}</Text><Text style={styles.meta}>Paid with {item.paymentLabel}</Text></RoundedCard>
    <RoundedCard style={styles.fareCard}><FareRow label="Ride fare" amount={item.fare.baseFare} country={data.country}/><FareRow label="Demand adjustment" amount={item.fare.demandAdjustment} country={data.country}/><FareRow label="Booking fee" amount={item.fare.bookingFee} country={data.country}/>{item.fare.priorityFee?<FareRow label="Priority" amount={item.fare.priorityFee} country={data.country}/>:null}{item.fare.membershipSaving?<FareRow label="Membership saving" amount={-item.fare.membershipSaving} country={data.country}/>:null}{item.fare.promoDiscount?<FareRow label="Promotion" amount={-item.fare.promoDiscount} country={data.country}/>:null}<View style={styles.divider}/><View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalAmount}>{formatMoney(data.country,item.fare.total)}</Text></View></RoundedCard>
    <PrimaryButton label="Book this route again" onPress={()=>actions.go('whereTo')}/>
  </ScrollView></ScreenShell>;
}

const styles=StyleSheet.create({
  flex:{flex:1},scroll:{paddingHorizontal:14,paddingTop:14,paddingBottom:36,gap:12},hero:{borderRadius:26,backgroundColor:COLORS.black,padding:20,gap:12},heroEyebrow:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.8,color:COLORS.yellow},heroTitle:{fontFamily:FONT.bold,fontSize:29,fontWeight:'900',color:COLORS.white},destination:{minHeight:58,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:15},destinationText:{...TYPE.cardTitle,flex:1},modeRow:{flexDirection:'row',gap:10},modeCard:{flex:1,borderRadius:18,backgroundColor:'#1D1D1D',padding:14,gap:4,borderWidth:1,borderColor:'#343434'},modeCardActive:{borderColor:COLORS.yellow,backgroundColor:'#28230E'},modeTitle:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900',color:COLORS.white},modeMeta:{fontFamily:FONT.regular,fontSize:11,color:'#C8C8C8'},stackCard:{padding:0,overflow:'hidden',shadowOpacity:0},shortcut:{minHeight:76,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:COLORS.line},shortcutIcon:{width:43,height:43,borderRadius:14,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},cardTitle:{...TYPE.cardTitle},meta:{...TYPE.small,color:COLORS.muted,marginTop:3},priorityCard:{padding:15,flexDirection:'row',alignItems:'center',gap:12,shadowOpacity:0},priorityIcon:{width:44,height:44,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},toggle:{width:48,height:28,borderRadius:14,backgroundColor:COLORS.lineDark,padding:3},toggleOn:{backgroundColor:COLORS.green},knob:{width:22,height:22,borderRadius:11,backgroundColor:COLORS.white},knobOn:{alignSelf:'flex-end'},recent:{padding:14,flexDirection:'row',alignItems:'center',gap:12,shadowOpacity:0},recentIcon:{width:44,height:44,borderRadius:14,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},amount:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},pageTitle:{fontFamily:FONT.bold,fontSize:27,fontWeight:'900'},pageBody:{...TYPE.body,color:COLORS.muted,lineHeight:21},optionList:{gap:10},option:{minHeight:72,borderWidth:1,borderColor:COLORS.line,borderRadius:18,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},optionActive:{borderColor:COLORS.red,backgroundColor:'#FFF7F5'},radio:{width:22,height:22,borderRadius:11,borderWidth:2,borderColor:COLORS.lineDark},planHero:{minHeight:180,borderRadius:24,backgroundColor:COLORS.yellow,padding:20,alignItems:'center',justifyContent:'center',gap:8},schoolHero:{minHeight:190,borderRadius:24,backgroundColor:'#EEF8F0',padding:20,alignItems:'center',justifyContent:'center',gap:8},planTitle:{fontFamily:FONT.bold,fontSize:23,fontWeight:'900',textAlign:'center'},planBody:{...TYPE.body,textAlign:'center',lineHeight:21},days:{flexDirection:'row',justifyContent:'space-between'},day:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},dayActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},dayText:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900'},dayTextActive:{color:COLORS.white},fieldCard:{padding:15,gap:8,shadowOpacity:0},fieldLabel:{fontFamily:FONT.bold,fontSize:12,fontWeight:'800',color:COLORS.muted,marginTop:4},input:{minHeight:50,borderRadius:14,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:13,fontFamily:FONT.regular,fontSize:15,color:COLORS.black},safeguard:{padding:0,overflow:'hidden',shadowOpacity:0},safetyPoint:{minHeight:60,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:14,borderBottomWidth:1,borderBottomColor:COLORS.line},safetyPointText:{...TYPE.body,flex:1},routeCard:{padding:16,shadowOpacity:0},routeLabel:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.4,color:COLORS.muted},routeMain:{...TYPE.cardTitle,marginTop:7},routeLine:{height:20,borderLeftWidth:2,borderLeftColor:COLORS.lineDark,marginLeft:6,marginVertical:5},fareCard:{padding:16,gap:12,shadowOpacity:0},demandSummary:{borderRadius:14,backgroundColor:'#FFF8E8',padding:12},demandTitle:{...TYPE.bodyStrong,color:COLORS.black},demandMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},fareRow:{flexDirection:'row',justifyContent:'space-between',gap:10},fareLabel:{...TYPE.body,color:COLORS.muted},fareValue:{fontFamily:FONT.bold,fontSize:14,fontWeight:'800'},divider:{height:1,backgroundColor:COLORS.line},totalRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},totalLabel:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},totalAmount:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900'},promoCard:{padding:15,gap:12,shadowOpacity:0},promoInput:{height:48,borderWidth:1,borderColor:COLORS.line,borderRadius:14,paddingHorizontal:13,fontFamily:FONT.bold,fontSize:13,textTransform:'uppercase'},disclaimer:{...TYPE.small,color:COLORS.muted,lineHeight:17},captainHero:{minHeight:210,alignItems:'center',justifyContent:'center',gap:6},avatar:{width:80,height:80,borderRadius:40,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},avatarText:{fontFamily:FONT.bold,fontSize:30,fontWeight:'900'},captainName:{fontFamily:FONT.bold,fontSize:27,fontWeight:'900'},captainRating:{...TYPE.body,color:COLORS.muted},verify:{flexDirection:'row',alignItems:'center',gap:6,marginTop:5},verifyText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'800',color:COLORS.green},vehicleCard:{padding:16,shadowOpacity:0},vehicleTitle:{fontFamily:FONT.bold,fontSize:21,fontWeight:'900',marginTop:7},vehicleFacts:{flexDirection:'row',justifyContent:'space-between',marginTop:18},factLabel:{fontFamily:FONT.bold,fontSize:10,fontWeight:'800',color:COLORS.muted},factValue:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',marginTop:3},historyCard:{padding:14,flexDirection:'row',alignItems:'center',gap:12,shadowOpacity:0},historyIcon:{width:43,height:43,borderRadius:14,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},empty:{padding:22,alignItems:'center',gap:10,shadowOpacity:0},receiptHero:{alignItems:'center',paddingVertical:18,gap:6},
});
