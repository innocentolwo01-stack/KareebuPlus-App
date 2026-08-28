import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header, PrimaryButton, ScreenShell } from '../components';
import { COLORS, FONT, SHADOW } from '../theme';
import type { Screen } from '../types';
import { COUNTRY_COMPLIANCE_PACKS } from '../policy/countryCompliance';
import { DEMO_TRUST_CASES } from './disputes';

export type TrustScreenActions={go:(screen:Screen)=>void;back:()=>void};

function TrustRow({icon,title,detail,onPress,status}:{icon:keyof typeof Ionicons.glyphMap;title:string;detail:string;onPress?:()=>void;status?:string}){
  const body=<><View style={s.icon}><Ionicons name={icon} size={20} color={COLORS.black}/></View><View style={s.flex}><Text style={s.rowTitle}>{title}</Text><Text style={s.rowDetail}>{detail}</Text></View>{status?<View style={s.status}><Text style={s.statusText}>{status}</Text></View>:null}{onPress?<Feather name="chevron-right" size={20} color={COLORS.muted}/>:null}</>;
  return onPress?<Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[s.row,pressed&&s.pressed]}>{body}</Pressable>:<View style={s.row}>{body}</View>;
}

export function SecurityCenterScreen({country,city,actions}:{country:string;city:string;actions:TrustScreenActions}){
  const pack=COUNTRY_COMPLIANCE_PACKS[country as keyof typeof COUNTRY_COMPLIANCE_PACKS]??COUNTRY_COMPLIANCE_PACKS.Uganda;
  return <ScreenShell><Header title="Security & privacy" onBack={actions.back}/><ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.hero}><View style={s.heroIcon}><Ionicons name="shield-checkmark-outline" size={30} color={COLORS.black}/></View><Text style={s.heroTitle}>Protect your Kareebu account</Text><Text style={s.heroBody}>Identity, devices, payment protection and privacy controls stay together here. High-risk actions can require extra verification.</Text></View>
    <Text style={s.section}>Account protection</Text>
    <View style={s.card}>
      <TrustRow icon="phone-portrait-outline" title="Trusted devices" detail="Review devices and sign out sessions you do not recognise." status="1 trusted"/>
      <TrustRow icon="finger-print-outline" title="Biometric & passkey protection" detail="Provider-ready control for sensitive actions and new-device step-up." status="Ready"/>
      <TrustRow icon="key-outline" title="PIN & recovery changes" detail="Recent PIN, phone or recovery changes are risk signals for sensitive transactions."/>
    </View>
    <Text style={s.section}>Identity & payments</Text>
    <View style={s.card}>
      <TrustRow icon="person-circle-outline" title="Identity verification" detail="Basic → Verified → Enhanced depending on transaction risk and regulatory need." onPress={()=>actions.go('verification')}/>
      <TrustRow icon="card-outline" title="Payment methods" detail="Payments are routed through configured external providers and verified server-side before fulfilment." onPress={()=>actions.go('paymentMethods')}/>
      <TrustRow icon="alert-circle-outline" title="Report suspicious activity" detail="Open a support case if you notice a payment, order or login you do not recognise." onPress={()=>actions.go('disputeCenter')}/>
    </View>
    <Text style={s.section}>Privacy & market rules</Text>
    <View style={s.card}>
      <TrustRow icon="lock-closed-outline" title="Privacy controls" detail={`${pack.privacyRegime}. Data retention and deletion are purpose-based, not unlimited.`} onPress={()=>actions.go('accountPrivacy')}/>
      <TrustRow icon="location-outline" title="Current market" detail={`${city}, ${country} · market-specific payment, tax and policy configuration`}/>
    </View>
    <Text style={s.foot}>Device integrity, sanctions/PEP screening, KYC and payment verification are provider boundaries until production services are connected. Kareebu should never claim a check succeeded when the provider is unavailable.</Text>
  </ScrollView></ScreenShell>;
}

export function DisputeCenterScreen({actions}:{actions:TrustScreenActions}){
  return <ScreenShell><Header title="Disputes & refunds" onBack={actions.back}/><ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.hero}><View style={s.heroIcon}><Ionicons name="chatbox-ellipses-outline" size={30}/></View><Text style={s.heroTitle}>A clear path when something goes wrong</Text><Text style={s.heroBody}>Payment, delivery, refund, merchant, captain and Global issues should have visible case states instead of disappearing into support.</Text></View>
    <PrimaryButton label="Report a new problem" onPress={()=>actions.go('support')}/>
    <Text style={s.section}>Your cases</Text>
    {DEMO_TRUST_CASES.map(item=><View key={item.id} style={s.caseCard}><View style={s.caseTop}><Text style={s.rowTitle}>{item.title}</Text><View style={s.status}><Text style={s.statusText}>{item.status.replace('_',' ')}</Text></View></View><Text style={s.rowDetail}>{item.reference}</Text><View style={s.timeline}>{item.timeline.map((step,index)=><View key={`${step.at}-${step.label}`} style={s.timelineRow}><View style={[s.dot,index===item.timeline.length-1&&s.dotActive]}/><View><Text style={s.timelineTitle}>{step.label}</Text><Text style={s.timelineDate}>{new Date(step.at).toLocaleDateString()}</Text></View></View>)}</View></View>)}
    <Text style={s.section}>How Kareebu handles refunds</Text>
    <View style={s.card}><TrustRow icon="flash-outline" title="Low-risk claims" detail="Eligible low-value claims can be resolved quickly."/><TrustRow icon="search-outline" title="Standard review" detail="Order, merchant/courier evidence and payment state are checked."/><TrustRow icon="shield-outline" title="Manual investigation" detail="High-value, repeated or conflicting claims go to Trust & Safety."/></View>
    <Text style={s.foot}>Automated risk scoring may route a case, but final high-impact decisions should remain explainable and reviewable.</Text>
  </ScrollView></ScreenShell>;
}

export function ReceiptsDocumentsScreen({country,actions,hasGlobalOrder=false}:{country:string;actions:TrustScreenActions;hasGlobalOrder?:boolean}){
  return <ScreenShell><Header title="Receipts & documents" onBack={actions.back}/><ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.hero}><View style={s.heroIcon}><Ionicons name="document-text-outline" size={30}/></View><Text style={s.heroTitle}>Your transaction records in one place</Text><Text style={s.heroBody}>Receipts, refund records and future fiscal/customs documents can be retained by transaction type and market.</Text></View>
    <View style={s.card}>
      <TrustRow icon="receipt-outline" title="Orders & service receipts" detail="Food, Shops, Rides, Boda, Send and service receipts." onPress={()=>actions.go('orders')}/>
      <TrustRow icon="globe-outline" title="Global landed-cost documents" detail={hasGlobalOrder?'Your latest international-order record is available from Global tracking.':'Global customs and landed-cost records appear after an international order.'} onPress={hasGlobalOrder?()=>actions.go('globalTracking'):undefined}/>
      <TrustRow icon="return-down-back-outline" title="Refund & credit records" detail="Refund cases and completed refund records." onPress={()=>actions.go('disputeCenter')}/>
      <TrustRow icon="business-outline" title="Fiscal & tax documents" detail={`${country} fiscalisation integration remains a secure provider boundary until formally connected.`}/>
    </View>
    <Text style={s.foot}>Document retention must follow the relevant legal purpose and country-specific retention policy. Identity documents are not exposed here.</Text>
  </ScrollView></ScreenShell>;
}

const s=StyleSheet.create({
  page:{padding:16,paddingBottom:120,gap:14},flex:{flex:1},hero:{borderRadius:22,backgroundColor:COLORS.yellow,padding:18,gap:8},heroIcon:{width:48,height:48,borderRadius:16,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},heroTitle:{fontFamily:FONT.bold,fontSize:24,lineHeight:28,color:COLORS.black},heroBody:{fontFamily:FONT.regular,fontSize:13,lineHeight:19,color:COLORS.black},section:{fontFamily:FONT.bold,fontSize:18,color:COLORS.black,marginTop:5},card:{borderRadius:18,backgroundColor:COLORS.white,overflow:'hidden',...SHADOW},row:{minHeight:76,paddingHorizontal:14,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:11,borderBottomWidth:1,borderBottomColor:COLORS.line},icon:{width:40,height:40,borderRadius:13,backgroundColor:'#FFF5C5',alignItems:'center',justifyContent:'center'},rowTitle:{fontFamily:FONT.bold,fontSize:14,color:COLORS.black},rowDetail:{fontFamily:FONT.regular,fontSize:12,lineHeight:17,color:COLORS.muted,marginTop:3},status:{borderRadius:999,backgroundColor:'#FFF3B2',paddingHorizontal:9,paddingVertical:5},statusText:{fontFamily:FONT.bold,fontSize:10,color:COLORS.black,textTransform:'capitalize'},pressed:{opacity:.72},foot:{fontFamily:FONT.regular,fontSize:11,lineHeight:17,color:COLORS.muted,paddingHorizontal:4},caseCard:{borderRadius:18,backgroundColor:COLORS.white,padding:15,gap:10,...SHADOW},caseTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},timeline:{gap:8,marginTop:3},timelineRow:{flexDirection:'row',gap:10,alignItems:'center'},dot:{width:10,height:10,borderRadius:5,backgroundColor:'#D6D9DD'},dotActive:{backgroundColor:COLORS.yellow,borderWidth:2,borderColor:COLORS.black},timelineTitle:{fontFamily:FONT.medium,fontSize:12,color:COLORS.black},timelineDate:{fontFamily:FONT.regular,fontSize:10,color:COLORS.muted},
});
