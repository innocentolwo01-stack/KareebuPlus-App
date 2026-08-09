import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { RoundedCard } from '../components';
import { COLORS, FONT, TYPE } from '../theme';

/**
 * Passenger-visible lifecycle inferred from the CabBook/Deligo driver APK.
 * The driver donor exposes pending/accepted/on-way/ongoing/completed/rejected/
 * cancelled ride states plus a Ride OTP gate. Kareebu Plus keeps those
 * semantics in a provider-neutral contract so Kareebu Captain can drive them
 * over realtime backend events later.
 */
export type CaptainRideStatus =
  | 'idle'
  | 'requested'
  | 'accepted'
  | 'on_way'
  | 'arrived'
  | 'otp_required'
  | 'ongoing'
  | 'complete'
  | 'rejected'
  | 'cancelled';

export type CaptainJobType = 'ride' | 'intercity' | 'courier';

export type CaptainDriverSnapshot = {
  isOnline: boolean;
  isRiding: boolean;
  distanceRemainingMeters: number | null;
  servicePreference: 'ride' | 'courier' | 'both';
  rating: number;
  ratingsCount: number;
};

/**
 * API semantics recovered from cabbook_driver.apk. These are intentionally
 * paths only — no vendor host, tokens or secrets are carried into Kareebu.
 */
export const CABBOOK_DRIVER_API_SURFACE = {
  login: 'api/login',
  register: 'api/register',
  user: 'api/user',
  pushNotification: 'api/user/push-notification',
  rides: 'api/ride/rides',
  rideById: 'api/ride/rides/',
  drivers: 'api/ride/drivers/',
  driverRatingsSummary: 'api/ride/drivers/ratings/summary/',
  vehicleTypes: 'api/ride/vehicle-types',
  deliveries: 'api/delivery',
  deliveryById: 'api/delivery/',
  deliveryRequests: 'api/delivery/request/',
  walletBalance: 'api/user/wallet/balance',
  walletEarnings: 'api/user/wallet/earnings',
  walletTransactions: 'api/user/wallet/transactions',
  walletPayout: 'api/user/wallet/payout',
  support: 'api/support',
  faq: 'api/faq',
} as const;

export const CAPTAIN_STATUS_ORDER: CaptainRideStatus[] = [
  'requested',
  'accepted',
  'on_way',
  'arrived',
  'otp_required',
  'ongoing',
  'complete',
];

export function captainStatusPresentation(status: CaptainRideStatus, captainName = 'Captain') {
  switch (status) {
    case 'requested': return { title: 'Finding a Captain', body: 'Your request has been sent to nearby Captains.', icon: 'radio-outline' as const };
    case 'accepted': return { title: `${captainName} accepted`, body: 'Your Captain has accepted the trip and is preparing to move.', icon: 'checkmark-circle-outline' as const };
    case 'on_way': return { title: `${captainName} is on the way`, body: 'Live Captain location updates are active.', icon: 'navigate-outline' as const };
    case 'arrived': return { title: `${captainName} has arrived`, body: 'Meet your Captain and verify the vehicle before sharing your Ride OTP.', icon: 'location-outline' as const };
    case 'otp_required': return { title: 'Verify pickup', body: 'Share the Ride OTP only after you are with the correct Captain.', icon: 'key-outline' as const };
    case 'ongoing': return { title: 'Trip in progress', body: 'The Captain has verified pickup and started the trip.', icon: 'car-outline' as const };
    case 'complete': return { title: 'Trip completed', body: 'The Captain has completed the trip.', icon: 'flag-outline' as const };
    case 'rejected': return { title: 'Captain unavailable', body: 'That Captain rejected or missed the request. Kareebu can match another Captain.', icon: 'close-circle-outline' as const };
    case 'cancelled': return { title: 'Trip cancelled', body: 'This trip is no longer active.', icon: 'ban-outline' as const };
    default: return { title: 'Ready to request', body: 'Choose a trip and Kareebu will contact nearby Captains.', icon: 'car-outline' as const };
  }
}

export function isCaptainActiveStatus(status: CaptainRideStatus) {
  return ['accepted', 'on_way', 'arrived', 'otp_required', 'ongoing'].includes(status);
}

export function CaptainLifecycleCard({
  status,
  captainName,
  pickupCode,
}: {
  status: CaptainRideStatus;
  captainName: string;
  pickupCode?: string;
}) {
  const presentation = captainStatusPresentation(status, captainName);
  const currentIndex = CAPTAIN_STATUS_ORDER.indexOf(status);
  const visibleStages = CAPTAIN_STATUS_ORDER.slice(0, 6);

  return (
    <RoundedCard style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.icon}><Ionicons name={presentation.icon} size={21} color={COLORS.black} /></View>
        <View style={styles.flex}>
          <Text style={styles.title}>{presentation.title}</Text>
          <Text style={styles.body}>{presentation.body}</Text>
        </View>
        {isCaptainActiveStatus(status) ? <View style={styles.live}><View style={styles.liveDot}/><Text style={styles.liveText}>LIVE</Text></View> : null}
      </View>
      <View style={styles.timeline}>
        {visibleStages.map((stage, index) => {
          const done = currentIndex >= index && currentIndex >= 0;
          const active = stage === status;
          const label = stage === 'requested' ? 'Request' : stage === 'accepted' ? 'Accepted' : stage === 'on_way' ? 'On way' : stage === 'arrived' ? 'Arrived' : stage === 'otp_required' ? 'OTP' : 'Trip';
          return <View key={stage} style={styles.stage}><View style={[styles.stageDot, done && styles.stageDone, active && styles.stageActive]}>{done ? <Feather name="check" size={10} color={COLORS.white}/> : null}</View><Text style={[styles.stageText, active && styles.stageTextActive]}>{label}</Text>{index < visibleStages.length - 1 ? <View style={[styles.line, done && currentIndex > index && styles.lineDone]}/> : null}</View>;
        })}
      </View>
      {(status === 'arrived' || status === 'otp_required') && pickupCode ? <View style={styles.otpRow}><Ionicons name="shield-checkmark-outline" size={20}/><View style={styles.flex}><Text style={styles.otpLabel}>Ride OTP</Text><Text style={styles.otpHelp}>Only share this after checking the Captain and vehicle.</Text></View><Text style={styles.otp}>{pickupCode}</Text></View> : null}
    </RoundedCard>
  );
}

const styles = StyleSheet.create({
  card:{padding:15,gap:14,shadowOpacity:0},
  headingRow:{flexDirection:'row',alignItems:'center',gap:11},
  icon:{width:42,height:42,borderRadius:13,backgroundColor:'#FFF2C8',alignItems:'center',justifyContent:'center'},
  flex:{flex:1},
  title:{...TYPE.cardTitle,fontFamily:FONT.bold,fontWeight:'900'},
  body:{...TYPE.small,color:COLORS.muted,marginTop:3,lineHeight:17},
  live:{flexDirection:'row',alignItems:'center',gap:5,borderRadius:13,backgroundColor:'#EDF9F1',paddingHorizontal:8,paddingVertical:5},
  liveDot:{width:7,height:7,borderRadius:4,backgroundColor:COLORS.green},
  liveText:{fontFamily:FONT.bold,fontSize:9,fontWeight:'900',color:COLORS.green,letterSpacing:.7},
  timeline:{flexDirection:'row',alignItems:'flex-start'},
  stage:{flex:1,alignItems:'center',position:'relative'},
  stageDot:{width:20,height:20,borderRadius:10,borderWidth:2,borderColor:COLORS.lineDark,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',zIndex:2},
  stageDone:{backgroundColor:COLORS.green,borderColor:COLORS.green},
  stageActive:{borderColor:COLORS.red,backgroundColor:COLORS.red},
  stageText:{fontFamily:FONT.medium,fontSize:9,color:COLORS.muted,marginTop:5,textAlign:'center'},
  stageTextActive:{fontFamily:FONT.bold,fontWeight:'900',color:COLORS.black},
  line:{position:'absolute',top:9,left:'60%',right:'-40%',height:2,backgroundColor:COLORS.line,zIndex:1},
  lineDone:{backgroundColor:COLORS.green},
  otpRow:{minHeight:64,borderRadius:14,backgroundColor:'#F7F7F7',paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:10},
  otpLabel:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900'},
  otpHelp:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  otp:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',letterSpacing:2},
});
