import React, { useMemo } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

import { assets } from '../assets';
import { ScreenShell } from '../components';
import { KareebuPageHeader } from '../components/KareebuPageHeader';
import { COLORS } from '../theme';
import type { MobilityActions, MobilityData } from './mobilityScreens';
import { promotionsFor } from '../promotions/catalog';
import { PromoCarousel } from '../promotions/PromoCarousel';
import { PromotionalImageBanner } from '../promotions/PromotionalImageBanner';
import { promotionalBannerAssets } from '../promotions/promotionalBannerAssets';
import { marketConfig, mobilityPlaces } from '../markets/config';
import { KareebuDestinationCard, MobilityPlaceRail } from './KareebuDestinationCard';

type BodaMarker = {
  id: string;
  latitude: number;
  longitude: number;
  rotation: number;
  eta: number;
};

type BodaShortcutProps = {
  label: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  width: number;
  onPress: () => void;
};

function nearbyBodas(region: { latitude: number; longitude: number }): BodaMarker[] {
  const offsets = [
    [-0.010, -0.017, 15],
    [-0.013, -0.005, -22],
    [-0.009, 0.008, 31],
    [-0.002, -0.020, 62],
    [-0.004, 0.016, -41],
    [0.003, -0.009, 18],
    [0.006, 0.003, -15],
    [0.008, 0.014, 36],
    [0.014, -0.013, -32],
    [0.016, 0.002, 12],
    [0.011, 0.021, 48],
  ] as const;

  return offsets.map(([lat, lng, rotation], index) => ({
    id: `boda-${index}`,
    latitude: region.latitude + lat,
    longitude: region.longitude + lng,
    rotation,
    eta: 2 + (index % 5),
  }));
}

function BackMenuHeader({
  onBack,
  onMenu,
}: {
  onBack: () => void;
  onMenu: () => void;
}) {
  return (
    <KareebuPageHeader
      title="Boda"
      variant="transaction"
      backEnabled
      onBack={onBack}
      rightIcon="menu"
      onRightAction={onMenu}
    />
  );
}

function BodaMapMarker({ item }: { item: BodaMarker }) {
  return (
    <Marker
      coordinate={{ latitude: item.latitude, longitude: item.longitude }}
      anchor={{ x: 0.5, y: 0.5 }}
      rotation={item.rotation}
      flat
    >
      <View style={styles.bodaMarker}>
        <MaterialCommunityIcons name="motorbike" size={20} color={COLORS.black} />
      </View>
    </Marker>
  );
}

function BodaShortcut({
  label,
  body,
  icon,
  width,
  onPress,
}: BodaShortcutProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shortcutCard, { width }, pressed && styles.pressed]}
    >
      <View style={styles.shortcutArt}>
        <Image source={assets.service.boda} resizeMode="contain" style={styles.shortcutBoda} />
        <View style={styles.shortcutActionBubble}>
          <Ionicons name={icon} size={16} color={COLORS.black} />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.shortcutLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.shortcutBody}>{body}</Text>
    </Pressable>
  );
}

function SafetyFact({
  icon,
  title,
  body,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.safetyFact}>
      <View style={styles.safetyIcon}>
        <Ionicons name={icon} size={20} color={COLORS.black} />
      </View>
      <View style={styles.safetyCopy}>
        <Text style={styles.safetyTitle}>{title}</Text>
        <Text style={styles.safetyBody}>{body}</Text>
      </View>
    </View>
  );
}

function PopularRoute({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.routeCard, pressed && styles.pressed]}>
      <View style={styles.routePin}>
        <Ionicons name="navigate" size={17} color={COLORS.black} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.routeTitle}>{title}</Text>
        <Text style={styles.routeSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="arrow-up-right" size={18} color={COLORS.black} />
    </Pressable>
  );
}

export function KareebuBodaHomeScreen({
  data,
  actions,
}: {
  data: MobilityData;
  actions: MobilityActions;
}) {
  const { width } = useWindowDimensions();
  const region = useMemo(() => marketConfig(data.country).map.primaryCityRegion, [data.country]);
  const bodas = useMemo(() => nearbyBodas(region), [region]);
  const pickupName = data.pickup?.trim() ? data.pickup : 'Kareebu Boda pickup';
  const pickupSubtitle = `${data.city || 'Kampala'}, ${data.country || 'Uganda'}`;
  const tileWidth = useMemo(() => {
    const available = width - 28 - 18;
    return Math.max(82, Math.min(108, Math.floor(available / 4)));
  }, [width]);
  const bodaContextPromotions=promotionsFor({service:'boda',country:data.country,city:data.city},'contextual').slice(0,3);
  const places=useMemo(()=>mobilityPlaces(data.country),[data.country]);

  const beginBodaTrip = () => {
    actions.selectMode('BODA');
    actions.selectRide('boda');
    actions.go('whereTo');
  };

  const scheduleBoda = () => {
    actions.selectMode('BODA');
    actions.selectRide('boda');
    actions.go('rideSchedule');
  };

  const shortcuts: Array<{
    label: string;
    body: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }> = [
    { label: 'Schedule', body: 'Ride later', icon: 'calendar-outline', onPress: scheduleBoda },
    { label: 'Send', body: 'Small delivery', icon: 'cube-outline', onPress: () => actions.go('parcel') },
    { label: 'Safety', body: 'Ride protected', icon: 'shield-checkmark-outline', onPress: () => actions.go('rideSafety') },
    { label: 'Your trips', body: 'Past bodas', icon: 'time-outline', onPress: () => actions.go('rideHistory') },
  ];

  return (
    <ScreenShell>
      <ScrollView style={styles.screen} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.mapHero}>
          <MapView
            style={styles.absoluteFill}
            initialRegion={region}
            region={region}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            {bodas.map((item) => <BodaMapMarker key={item.id} item={item} />)}
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
              <View style={styles.userDot} />
            </Marker>
          </MapView>

          <BackMenuHeader onBack={() => actions.go('home')} onMenu={() => actions.go('rideSettings')} />

          <KareebuDestinationCard mode="BODA" pickup={pickupName} city={pickupSubtitle} onDestination={beginBodaTrip} onPickup={beginBodaTrip} onLater={scheduleBoda}/>

          <View style={styles.mapAvailability}>
            <View style={styles.liveDot} />
            <Text style={styles.mapAvailabilityText}>{bodas.length} nearby bodas</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.pageHeading}>Saved & recent places</Text>
          <Text style={styles.pageSubheading}>Choose a familiar place or search somewhere new.</Text>
          <MobilityPlaceRail places={places} onPress={(place)=>actions.prefillDestination(place)}/>

          <PromotionalImageBanner image={promotionalBannerAssets.boda.primary} accessibilityLabel="Explore Kareebu Boda" accessibilityHint="Opens Boda booking" onPress={beginBodaTrip}/>

          <Text style={styles.pageHeading}>Boda for every move</Text>

          <View style={styles.tileRow}>
            {shortcuts.map((shortcut) => (
              <BodaShortcut
                key={shortcut.label}
                label={shortcut.label}
                body={shortcut.body}
                icon={shortcut.icon}
                width={tileWidth}
                onPress={shortcut.onPress}
              />
            ))}
          </View>

          {bodaContextPromotions.length?<View style={{marginHorizontal:-16,marginTop:8}}><PromoCarousel campaigns={bodaContextPromotions} onPress={(campaign)=>actions.go(campaign.ctaScreen)} autoAdvanceMs={0}/></View>:null}

          <Pressable onPress={() => actions.go('plusManage')} style={({ pressed }) => [styles.plusBanner, pressed && styles.pressed]}>
            <View style={styles.plusPatternOne} />
            <View style={styles.plusPatternTwo} />
            <View style={styles.plusCopy}>
              <Text style={styles.plusEyebrow}>Kareebu+ Boda</Text>
              <Text style={styles.plusTitle}>See configured member benefits</Text>
              <Text style={styles.plusBody}>Eligible Boda savings appear here only when enabled for your market.</Text>
            </View>
            <View style={styles.plusBodaBubble}>
              <Image source={assets.service.boda} resizeMode="contain" style={styles.plusBodaImage} />
            </View>
          </Pressable>

          <View style={styles.compactActionRow}>
            <Pressable onPress={() => actions.go('rideSafety')} style={({ pressed }) => [styles.compactAction, pressed && styles.pressed]}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.black}/>
              <Text style={styles.compactActionText}>Safety</Text>
            </Pressable>
            <Pressable onPress={() => actions.go('rideHistory')} style={({ pressed }) => [styles.compactAction, pressed && styles.pressed]}>
              <Ionicons name="time-outline" size={18} color={COLORS.black}/>
              <Text style={styles.compactActionText}>Your bodas</Text>
            </Pressable>
            <Pressable onPress={() => actions.go('rideSettings')} style={({ pressed }) => [styles.compactAction, pressed && styles.pressed]}>
              <Ionicons name="options-outline" size={18} color={COLORS.black}/>
              <Text style={styles.compactActionText}>Settings</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Boda essentials</Text>
            <Pressable onPress={() => actions.go('rideSafety')} style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
              <Text style={styles.linkText}>Safety</Text>
              <Feather name="arrow-right" size={19} color={COLORS.black}/>
            </Pressable>
          </View>

          <View style={styles.safetyGrid}>
            <SafetyFact icon="shield-checkmark-outline" title="Helmet status" body="Confirm helmet availability before starting your trip." />
            <SafetyFact icon="person-outline" title="1 passenger" body="One rider per Boda booking." />
            <SafetyFact icon="bag-handle-outline" title="Light luggage" body="Small bags and backpacks only." />
            <SafetyFact icon="checkmark-circle-outline" title="Rider identity" body="Live identity and bike checks appear when the safety service is connected." />
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Popular around {data.city || 'Kampala'}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeRail}>
            {places.filter(place=>place.kind==='recent'||place.kind==='popular').map(place=><PopularRoute key={place.id} title={place.label} subtitle={`${place.address} · Boda route`} onPress={()=>actions.prefillDestination(place)}/>)}
          </ScrollView>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Offers</Text>
          </View>

          <Pressable onPress={beginBodaTrip} style={({ pressed }) => [styles.offerCard, pressed && styles.pressed]}>
            <View style={styles.offerIcon}>
              <Ionicons name="pricetag-outline" size={24} color={COLORS.black}/>
            </View>
            <View style={styles.flex}>
              <Text style={styles.offerTitle}>Boda Saver</Text>
              <Text style={styles.offerBody}>Check available Boda discounts before you book.</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.black}/>
          </Pressable>

          <Text style={styles.safetyFootnote}>
            Kareebu Boda is intended for short city journeys. Always wear the supplied helmet and follow your Captain's safety instructions.
          </Text>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flex:{flex:1},
  absoluteFill:{position:'absolute',top:0,right:0,bottom:0,left:0},
  pressed:{opacity:.72},
  screen:{flex:1,backgroundColor:COLORS.white},
  page:{paddingBottom:28,backgroundColor:COLORS.white},

  header:{paddingTop:10,paddingHorizontal:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  headerSquare:{width:40,height:40,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white,borderWidth:1,borderColor:'#D7DADD'},
  menuSquare:{width:40,height:40,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.black},
  bodaBrandPill:{height:38,borderRadius:19,backgroundColor:'rgba(255,255,255,.96)',borderWidth:1,borderColor:'#DDE0E1',flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10},
  bodaBrandIcon:{width:27,height:27},
  bodaBrandText:{fontSize:14,lineHeight:18,fontWeight:'900',color:COLORS.black},

  mapHero:{height:405,backgroundColor:'#EFF2F4',overflow:'hidden'},
  userDot:{width:18,height:18,borderRadius:9,backgroundColor:'#4486F3',borderWidth:3,borderColor:COLORS.white},
  bodaMarker:{width:34,height:34,borderRadius:17,backgroundColor:COLORS.yellow,borderWidth:2,borderColor:COLORS.white,alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.13,shadowRadius:5,shadowOffset:{width:0,height:2},elevation:4},
  mapAvailability:{position:'absolute',right:14,bottom:15,height:32,borderRadius:16,backgroundColor:'rgba(255,255,255,.96)',borderWidth:1,borderColor:'#DEE1E2',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:11},
  liveDot:{width:8,height:8,borderRadius:4,backgroundColor:COLORS.green},
  mapAvailabilityText:{fontSize:11.5,lineHeight:15,fontWeight:'800',color:'#3D4246'},

  searchPanel:{position:'absolute',top:70,left:14,right:14,borderRadius:18,backgroundColor:COLORS.white,padding:12,shadowColor:'#000',shadowOpacity:.08,shadowRadius:10,shadowOffset:{width:0,height:4},elevation:3},
  searchPanelTop:{flexDirection:'row',alignItems:'center',gap:12},
  searchBigButton:{flex:1,minHeight:58,borderRadius:14,backgroundColor:'#F4F6F6',paddingHorizontal:14,flexDirection:'row',alignItems:'center'},
  searchIconBox:{width:40,height:40,borderRadius:11,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},
  searchCopy:{flex:1,marginLeft:10},
  searchBigText:{color:'#4A4E52',fontSize:18,lineHeight:22,fontWeight:'900',letterSpacing:-.4},
  searchSubText:{marginTop:2,color:'#8A8F93',fontSize:10.5,lineHeight:13,fontWeight:'600'},
  laterButton:{width:94,minHeight:46,borderRadius:14,borderWidth:1,borderColor:'#D7DBDD',backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:7},
  laterButtonText:{color:'#43474C',fontSize:12.5,lineHeight:16,fontWeight:'800'},
  pickupPanel:{marginTop:8,flexDirection:'row',alignItems:'center',minHeight:48,paddingHorizontal:10},
  pickupBikeIcon:{width:34,height:34,borderRadius:10,backgroundColor:COLORS.yellowSoft,alignItems:'center',justifyContent:'center'},
  pickupPanelCopy:{flex:1,marginLeft:10},
  pickupPanelTitle:{color:'#35393D',fontSize:12,lineHeight:16,fontWeight:'800'},
  pickupPanelSubtitle:{marginTop:2,color:'#81868B',fontSize:12,lineHeight:16,fontWeight:'500'},

  contentSection:{marginTop:-4,paddingTop:16,paddingHorizontal:14,backgroundColor:COLORS.white,borderTopLeftRadius:22,borderTopRightRadius:22},
  pageHeading:{color:'#313437',fontSize:20,lineHeight:24,fontWeight:'900',letterSpacing:-.6},
  pageSubheading:{marginTop:4,color:'#747A7F',fontSize:12.5,lineHeight:17,fontWeight:'500'},
  tileRow:{marginTop:12,flexDirection:'row',justifyContent:'space-between'},
  shortcutCard:{height:122,paddingTop:7,borderRadius:18,backgroundColor:'#F5F6F6',alignItems:'center',paddingHorizontal:5},
  shortcutArt:{width:'100%',height:67,alignItems:'center',justifyContent:'center',position:'relative'},
  shortcutBoda:{width:'88%',height:62},
  shortcutActionBubble:{position:'absolute',right:4,bottom:1,width:26,height:26,borderRadius:13,backgroundColor:COLORS.yellow,borderWidth:2,borderColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  shortcutLabel:{marginTop:5,color:'#363A3E',textAlign:'center',fontSize:12,lineHeight:15,fontWeight:'900'},
  shortcutBody:{marginTop:1,color:'#909497',textAlign:'center',fontSize:9.5,lineHeight:12,fontWeight:'600'},

  plusBanner:{minHeight:116,marginTop:18,borderRadius:18,borderWidth:1.5,borderColor:COLORS.yellow,overflow:'hidden',backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',paddingHorizontal:16},
  plusPatternOne:{position:'absolute',left:-32,right:118,bottom:-16,height:54,backgroundColor:COLORS.black,transform:[{rotate:'-8deg'}]},
  plusPatternTwo:{position:'absolute',right:-18,bottom:-23,width:132,height:76,borderRadius:38,backgroundColor:COLORS.blackSoft},
  plusCopy:{flex:1,paddingRight:10},
  plusEyebrow:{color:COLORS.black,fontSize:17,lineHeight:21,fontWeight:'900'},
  plusTitle:{marginTop:5,color:'#2F3336',fontSize:12.5,lineHeight:16,fontWeight:'900'},
  plusBody:{marginTop:4,color:'#5E6469',fontSize:11.5,lineHeight:15,fontWeight:'500'},
  plusBodaBubble:{width:72,height:72,borderRadius:36,backgroundColor:'#FFF5CE',alignItems:'center',justifyContent:'center'},
  plusBodaImage:{width:67,height:67},

  compactActionRow:{marginTop:12,flexDirection:'row',gap:8},
  compactAction:{flex:1,minHeight:42,borderRadius:12,backgroundColor:'#F5F6F6',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6},
  compactActionText:{color:COLORS.black,fontSize:11,lineHeight:14,fontWeight:'800'},

  sectionHeaderRow:{marginTop:18,marginBottom:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  sectionHeading:{color:'#313437',fontSize:18,lineHeight:22,fontWeight:'900'},
  linkRow:{flexDirection:'row',alignItems:'center',gap:5},
  linkText:{color:COLORS.black,fontSize:12,lineHeight:16,fontWeight:'800'},

  safetyGrid:{borderRadius:16,borderWidth:1,borderColor:'#E5E7E8',backgroundColor:COLORS.white,overflow:'hidden'},
  safetyFact:{minHeight:64,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:12,paddingVertical:9,borderBottomWidth:1,borderBottomColor:'#EEEEEE'},
  safetyIcon:{width:38,height:38,borderRadius:12,backgroundColor:COLORS.yellowSoft,alignItems:'center',justifyContent:'center'},
  safetyCopy:{flex:1},
  safetyTitle:{fontSize:12.5,lineHeight:16,fontWeight:'900',color:COLORS.black},
  safetyBody:{marginTop:2,fontSize:10.5,lineHeight:14,fontWeight:'500',color:'#7A7F83'},

  routeRail:{gap:9,paddingRight:18},
  routeCard:{width:178,minHeight:76,borderRadius:15,borderWidth:1,borderColor:'#E2E4E5',backgroundColor:'#FAFAFA',flexDirection:'row',alignItems:'center',gap:9,padding:11},
  routePin:{width:32,height:32,borderRadius:10,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  routeTitle:{fontSize:12.5,lineHeight:16,fontWeight:'900',color:COLORS.black},
  routeSubtitle:{marginTop:3,fontSize:9.8,lineHeight:13,fontWeight:'500',color:'#7A7F83'},

  offerCard:{minHeight:76,borderRadius:15,backgroundColor:COLORS.yellowWash,borderWidth:1,borderColor:'#F0D267',padding:12,flexDirection:'row',alignItems:'center',gap:11},
  offerIcon:{width:42,height:42,borderRadius:13,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  offerTitle:{fontSize:14,lineHeight:18,fontWeight:'900',color:COLORS.black},
  offerBody:{marginTop:3,fontSize:11.5,lineHeight:15,fontWeight:'500',color:'#666B6F'},
  safetyFootnote:{marginTop:14,color:'#858A8E',fontSize:10.5,lineHeight:15,fontWeight:'500'},
});
