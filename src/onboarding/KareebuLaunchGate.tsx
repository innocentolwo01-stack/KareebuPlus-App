import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRegisterBackControl } from '../navigation/AppNavigation';

const BRAND = {
  yellow: '#FFC400',
  yellowDeep: '#F5A900',
  yellowSoft: '#FFF8DA',
  black: '#0B0B0D',
  white: '#FFFFFF',
  muted: '#7D818A',
  line: '#ECEDEF',
  green: '#08A94E',
};

const STORAGE = {
  complete: '@kareebu/plus/onboarding-v10-complete',
  country: '@kareebu/plus/onboarding-v10-country',
  services: '@kareebu/plus/onboarding-v10-services',
} as const;
const LEGACY_COMPLETE_KEY = '@kareebu/plus/onboarding-v6-complete';

type LaunchChoice = 'guest' | 'signup' | 'signin';
type ServiceKey = 'rides' | 'food' | 'deliveries' | 'shopping';
type LaunchActions = {
  go: (screen: any) => void;
  setGuest?: (value: boolean) => void;
  setCountry?: (country: string) => void;
  setCity?: (city: string) => void;
};
type LaunchData = { city?: string; country?: string };
type Props = { screen?: unknown; data?: LaunchData; actions: LaunchActions; children: React.ReactNode };
type Country = {
  code: 'UG' | 'KE' | 'TZ';
  country: string;
  city: string;
  image: any;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  cityLatitude: number;
  cityLongitude: number;
};

const art = {
  wordmark: require('../../assets/kareebu-plus/brand/wordmark-v6.png'),
  mark: require('../../assets/kareebu-plus/brand/adaptive-foreground-v10.png'),
  rides: require('../../assets/kareebu-plus/services-3d/rides.png'),
  food: require('../../assets/kareebu-plus/services-3d/food.png'),
  deliveries: require('../../assets/kareebu-plus/services-3d/send.png'),
  shopping: require('../../assets/kareebu-plus/services-3d/shops.png'),
  uganda: require('../../assets/kareebu-plus/country-landmarks/uganda.jpg'),
  kenya: require('../../assets/kareebu-plus/country-landmarks/kenya.jpg'),
  tanzania: require('../../assets/kareebu-plus/country-landmarks/tanzania.jpg'),
};

const SERVICES: Array<{ key: ServiceKey; label: string; body: string; image: any }> = [
  { key: 'rides', label: 'Rides', body: 'Get there your way', image: art.rides },
  { key: 'food', label: 'Food', body: 'Great food, delivered', image: art.food },
  { key: 'deliveries', label: 'Deliveries', body: 'Send anything, anywhere', image: art.deliveries },
  { key: 'shopping', label: 'Shopping', body: 'Groceries, shops and more', image: art.shopping },
];
const COUNTRIES: Country[] = [
  {
    code: 'UG',
    country: 'Uganda',
    city: 'Kampala',
    image: art.uganda,
    latitude: 1.3733,
    longitude: 32.2903,
    latitudeDelta: 6.4,
    longitudeDelta: 6.4,
    cityLatitude: 0.3476,
    cityLongitude: 32.5825,
  },
  {
    code: 'KE',
    country: 'Kenya',
    city: 'Nairobi',
    image: art.kenya,
    latitude: 0.0236,
    longitude: 37.9062,
    latitudeDelta: 7.8,
    longitudeDelta: 7.8,
    cityLatitude: -1.2864,
    cityLongitude: 36.8172,
  },
  {
    code: 'TZ',
    country: 'Tanzania',
    city: 'Dar es Salaam',
    image: art.tanzania,
    latitude: -6.3690,
    longitude: 34.8888,
    latitudeDelta: 9.2,
    longitudeDelta: 9.2,
    cityLatitude: -6.7924,
    cityLongitude: 39.2083,
  },
];

function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <Ionicons name="arrow-forward" size={19} color={BRAND.black} />
    </Pressable>
  );
}

function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const logoOpacity=useRef(new Animated.Value(0)).current;
  const logoScale=useRef(new Animated.Value(0.86)).current;
  const logoY=useRef(new Animated.Value(18)).current;
  const taglineOpacity=useRef(new Animated.Value(0)).current;
  const markScale=useRef(new Animated.Value(0.62)).current;
  const markOpacity=useRef(new Animated.Value(0)).current;
  const glow=useRef(new Animated.Value(0)).current;
  const cards=useMemo(()=>SERVICES.map(()=>({opacity:new Animated.Value(0),y:new Animated.Value(28),scale:new Animated.Value(0.88)})),[]);

  useEffect(()=>{
    const glowLoop=Animated.loop(Animated.sequence([
      Animated.timing(glow,{toValue:1,duration:900,useNativeDriver:true}),
      Animated.timing(glow,{toValue:0,duration:900,useNativeDriver:true}),
    ]));
    glowLoop.start();
    const sequence=Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity,{toValue:1,duration:320,useNativeDriver:true}),
        Animated.spring(logoScale,{toValue:1,damping:13,stiffness:125,useNativeDriver:true}),
        Animated.timing(logoY,{toValue:0,duration:430,easing:Easing.out(Easing.cubic),useNativeDriver:true}),
      ]),
      Animated.parallel([
        Animated.timing(taglineOpacity,{toValue:1,duration:260,useNativeDriver:true}),
        Animated.timing(markOpacity,{toValue:0.10,duration:300,useNativeDriver:true}),
        Animated.spring(markScale,{toValue:1,damping:11,stiffness:115,useNativeDriver:true}),
      ]),
      Animated.stagger(90,cards.map(card=>Animated.parallel([
        Animated.timing(card.opacity,{toValue:1,duration:240,useNativeDriver:true}),
        Animated.spring(card.y,{toValue:0,damping:12,stiffness:125,useNativeDriver:true}),
        Animated.spring(card.scale,{toValue:1,damping:12,stiffness:125,useNativeDriver:true}),
      ]))),
      Animated.delay(520),
    ]);
    sequence.start(({finished}: { finished?: boolean })=>{ if(finished) onDone(); });
    return ()=>{ glowLoop.stop(); sequence.stop(); };
  },[cards,glow,logoOpacity,logoScale,logoY,markOpacity,markScale,onDone,taglineOpacity]);

  const glowScale=glow.interpolate({inputRange:[0,1],outputRange:[0.94,1.08]});
  const glowOpacity=glow.interpolate({inputRange:[0,1],outputRange:[0.14,0.28]});
  return (
    <SafeAreaView style={styles.splashRoot} edges={['top','right','bottom','left']}>
      <Animated.View pointerEvents="none" style={[styles.splashGlow,{opacity:glowOpacity,transform:[{scale:glowScale}]}]} />
      <Animated.Image source={art.mark} resizeMode="contain"
        style={[styles.splashWatermark,{opacity:markOpacity,transform:[{scale:markScale},{rotate:'-8deg'}]}]} />
      <View style={styles.splashContent}>
        <Animated.Image source={art.wordmark} resizeMode="contain"
          style={[styles.splashLogo,{opacity:logoOpacity,transform:[{scale:logoScale},{translateY:logoY}]}]} />
        <Animated.View style={[styles.splashTagline,{opacity:taglineOpacity}]}>
          <Text style={styles.splashTaglineMain}>Everything you need.</Text>
          <Text style={styles.splashTaglineAccent}>One app.</Text>
        </Animated.View>
        <View style={styles.splashServiceGrid}>
          {SERVICES.map((service,index)=>{
            const anim=cards[index];
            return <Animated.View key={service.key} style={[styles.splashServiceCard,{opacity:anim.opacity,transform:[{translateY:anim.y},{scale:anim.scale}]}]}>
              <Image source={service.image} resizeMode="contain" style={styles.splashServiceImage}/>
              <Text style={styles.splashServiceLabel}>{service.label}</Text>
            </Animated.View>;
          })}
        </View>
      </View>
      <View pointerEvents="none" style={styles.splashWaveSoft}/><View pointerEvents="none" style={styles.splashWave}/>
    </SafeAreaView>
  );
}

function OnboardingChrome({step,back}:{step:number;back?:()=>void}){
  useRegisterBackControl(Boolean(back));
  return <View style={styles.chrome}>
    <View style={styles.chromeSide}>{back?<Pressable hitSlop={12} onPress={back} style={styles.backButton}><Ionicons name="arrow-back" size={21} color={BRAND.black}/></Pressable>:null}</View>
    <Image source={art.wordmark} resizeMode="contain" style={styles.chromeLogo}/>
    <View style={[styles.chromeSide,styles.chromeRight]}><View style={styles.stepPill}><Text style={styles.stepPillText}>{step} of 3</Text></View></View>
  </View>;
}

function CountryStep({selectedIndex,setSelectedIndex,next}:{selectedIndex:number;setSelectedIndex:(index:number)=>void;next:()=>void}){
  const {width}=useWindowDimensions();
  const cardWidth=Math.min(300,Math.max(238,width*0.72));
  const interval=cardWidth+12;
  const side=Math.max(18,(width-cardWidth)/2);
  const scrollRef=useRef<any>(null);
  const mapRef=useRef<any>(null);
  const selected=COUNTRIES[selectedIndex] ?? COUNTRIES[0];

  const headerOpacity=useRef(new Animated.Value(0)).current;
  const headerY=useRef(new Animated.Value(-12)).current;
  const mapOpacity=useRef(new Animated.Value(0)).current;
  const cardsOpacity=useRef(new Animated.Value(0)).current;
  const cardsY=useRef(new Animated.Value(24)).current;
  const footerOpacity=useRef(new Animated.Value(0)).current;
  const footerY=useRef(new Animated.Value(16)).current;

  useEffect(()=>{
    const sequence=Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity,{toValue:1,duration:250,useNativeDriver:true}),
        Animated.spring(headerY,{toValue:0,damping:15,stiffness:140,useNativeDriver:true}),
      ]),
      Animated.timing(mapOpacity,{toValue:1,duration:300,useNativeDriver:true}),
      Animated.parallel([
        Animated.timing(cardsOpacity,{toValue:1,duration:240,useNativeDriver:true}),
        Animated.spring(cardsY,{toValue:0,damping:14,stiffness:132,useNativeDriver:true}),
      ]),
      Animated.parallel([
        Animated.timing(footerOpacity,{toValue:1,duration:200,useNativeDriver:true}),
        Animated.spring(footerY,{toValue:0,damping:14,stiffness:132,useNativeDriver:true}),
      ]),
    ]);
    sequence.start();
    return ()=>sequence.stop();
  },[cardsOpacity,cardsY,footerOpacity,footerY,headerOpacity,headerY,mapOpacity]);

  const moveMap=(country:Country)=>{
    mapRef.current?.animateToRegion?.({
      latitude:country.latitude,
      longitude:country.longitude,
      latitudeDelta:country.latitudeDelta,
      longitudeDelta:country.longitudeDelta,
    },420);
  };

  const choose=(index:number,scroll=true)=>{
    const nextCountry=COUNTRIES[index] ?? COUNTRIES[0];
    setSelectedIndex(index);
    moveMap(nextCountry);
    if(scroll) scrollRef.current?.scrollTo({x:index*interval,animated:true});
  };

  return (
    <View style={styles.countryPage}>
      <Animated.View style={[styles.countryHeader,{opacity:headerOpacity,transform:[{translateY:headerY}]}]}>
        <OnboardingChrome step={1}/>
        <View style={styles.countryHeadingRow}>
          <View style={styles.countryHeadingCopy}>
            <Text style={styles.onboardingTitle}>Select your country</Text>
            <Text style={styles.onboardingSubtitle}>Choose where you want Kareebu+ to work for you.</Text>
          </View>
          <View style={styles.googleMapBadge}>
            <Ionicons name="map-outline" size={15} color={BRAND.black}/>
            <Text style={styles.googleMapBadgeText}>Live map</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.countryMapStage,{opacity:mapOpacity}]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude:selected.latitude,
            longitude:selected.longitude,
            latitudeDelta:selected.latitudeDelta,
            longitudeDelta:selected.longitudeDelta,
          }}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          showsCompass={false}
          showsBuildings
        >
          <Marker
            coordinate={{latitude:selected.cityLatitude,longitude:selected.cityLongitude}}
            tracksViewChanges={false}
          >
            <View style={styles.liveMarker}>
              <View style={styles.liveMarkerDot}/>
              <View style={styles.liveMarkerBubble}>
                <Text style={styles.liveMarkerCountry}>{selected.country}</Text>
                <Text style={styles.liveMarkerCity}>{selected.city}</Text>
              </View>
            </View>
          </Marker>
        </MapView>

        <View pointerEvents="none" style={styles.mapTopFade}/>

        <View style={styles.countryMapTopRow} pointerEvents="box-none">
          <View style={styles.selectedCountryPill}>
            <View style={styles.selectedCountryDot}/>
            <View>
              <Text style={styles.selectedCountryPillTitle}>{selected.country}</Text>
              <Text style={styles.selectedCountryPillSub}>{selected.city}</Text>
            </View>
          </View>
          <Pressable
            onPress={()=>moveMap(selected)}
            hitSlop={8}
            style={({pressed})=>[styles.recenterButton,pressed&&styles.pressed]}
          >
            <Ionicons name="locate" size={20} color={BRAND.black}/>
          </Pressable>
        </View>

        <Animated.View style={[styles.countryCarouselOverlay,{opacity:cardsOpacity,transform:[{translateY:cardsY}]}]}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={interval}
            decelerationRate="fast"
            contentContainerStyle={{paddingHorizontal:side,gap:12}}
            onMomentumScrollEnd={(event:any)=>{
              const i=Math.max(0,Math.min(COUNTRIES.length-1,Math.round(event.nativeEvent.contentOffset.x/interval)));
              choose(i,false);
            }}
          >
            {COUNTRIES.map((item,index)=>{
              const active=selectedIndex===index;
              return (
                <Pressable
                  key={item.code}
                  onPress={()=>choose(index)}
                  style={({pressed})=>[
                    styles.countryCard,
                    {width:cardWidth},
                    active&&styles.countryCardActive,
                    pressed&&styles.countryCardPressed,
                  ]}
                >
                  <Image source={item.image} resizeMode="cover" style={styles.countryImage}/>
                  <View style={styles.countryGradient}/>
                  <View style={styles.countryCopy}>
                    <View>
                      <Text style={styles.countryCity}>{item.city}</Text>
                      <Text style={styles.countryName}>{item.country}</Text>
                    </View>
                    <View style={[styles.countryCheck,active&&styles.countryCheckActive]}>
                      {active?<Ionicons name="checkmark" size={17} color={BRAND.black}/>:null}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.dots}>
            {COUNTRIES.map((item,index)=><View key={item.code} style={[styles.dot,index===selectedIndex&&styles.dotActive]}/>)}
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.countryFooter,{opacity:footerOpacity,transform:[{translateY:footerY}]}]}>
        <PrimaryButton label={`Continue with ${selected.country}`} onPress={next}/>
      </Animated.View>
    </View>
  );
}

function ServicesStep({selected,setSelected,back,next}:{selected:ServiceKey[];setSelected:React.Dispatch<React.SetStateAction<ServiceKey[]>>;back:()=>void;next:()=>void}){
  const opacity=useRef(new Animated.Value(0)).current; const y=useRef(new Animated.Value(24)).current;
  useEffect(()=>{const a=Animated.parallel([Animated.timing(opacity,{toValue:1,duration:300,useNativeDriver:true}),Animated.spring(y,{toValue:0,damping:14,stiffness:128,useNativeDriver:true})]);a.start();return()=>a.stop();},[opacity,y]);
  const toggle=(key:ServiceKey)=>setSelected(current=>current.includes(key)?current.filter(item=>item!==key):[...current,key]);
  return <Animated.View style={[styles.onboardingPage,{opacity,transform:[{translateY:y}]}]}><OnboardingChrome step={2} back={back}/><Text style={styles.onboardingTitle}>What matters most to you?</Text><Text style={styles.onboardingSubtitle}>Choose your favourite Kareebu+ services. You can change this later.</Text>
    <View style={styles.serviceGrid}>{SERVICES.map(service=>{const active=selected.includes(service.key);return <Pressable key={service.key} onPress={()=>toggle(service.key)} style={({pressed})=>[styles.serviceCard,active&&styles.serviceCardActive,pressed&&styles.pressed]}>
      <View style={[styles.serviceCheck,active&&styles.serviceCheckActive]}>{active?<Ionicons name="checkmark" size={15} color={BRAND.black}/>:<Ionicons name="add" size={16} color={BRAND.muted}/>}</View><Image source={service.image} resizeMode="contain" style={styles.serviceImage}/><Text style={styles.serviceTitle}>{service.label}</Text><Text style={styles.serviceBody}>{service.body}</Text>
    </Pressable>;})}</View><View style={styles.pageFooter}><PrimaryButton label="Continue" disabled={selected.length===0} onPress={next}/></View>
  </Animated.View>;
}

function AccessStep({back,finish}:{back:()=>void;finish:(choice:LaunchChoice)=>void}){
  const opacity=useRef(new Animated.Value(0)).current;const y=useRef(new Animated.Value(24)).current;const heroScale=useRef(new Animated.Value(0.84)).current;
  useEffect(()=>{const a=Animated.parallel([Animated.timing(opacity,{toValue:1,duration:300,useNativeDriver:true}),Animated.spring(y,{toValue:0,damping:14,stiffness:128,useNativeDriver:true}),Animated.spring(heroScale,{toValue:1,damping:12,stiffness:120,useNativeDriver:true})]);a.start();return()=>a.stop();},[heroScale,opacity,y]);
  return <Animated.View style={[styles.onboardingPage,{opacity,transform:[{translateY:y}]}]}><OnboardingChrome step={3} back={back}/><Animated.View style={[styles.accessHero,{transform:[{scale:heroScale}]}]}><View style={styles.accessHeroGlow}/><Image source={art.mark} resizeMode="contain" style={styles.accessMark}/></Animated.View><Text style={[styles.onboardingTitle,{textAlign:'center'}]}>You’re all set.</Text><Text style={[styles.onboardingSubtitle,{textAlign:'center',alignSelf:'center'}]}>Browse first. Sign in when you need to book, order, send or pay.</Text>
    <View style={styles.accessButtons}><Pressable onPress={()=>finish('guest')} style={({pressed})=>[styles.accessPrimary,pressed&&styles.pressed]}><Ionicons name="person-outline" size={20} color={BRAND.black}/><Text style={styles.accessPrimaryText}>Continue as guest</Text><Ionicons name="arrow-forward" size={18} color={BRAND.black}/></Pressable><Pressable onPress={()=>finish('signup')} style={({pressed})=>[styles.accessSecondary,pressed&&styles.pressed]}><Ionicons name="person-add-outline" size={20} color={BRAND.black}/><Text style={styles.accessSecondaryText}>Create account</Text></Pressable><Pressable onPress={()=>finish('signin')} style={({pressed})=>[styles.accessSecondary,pressed&&styles.pressed]}><Ionicons name="lock-closed-outline" size={19} color={BRAND.black}/><Text style={styles.accessSecondaryText}>Sign in</Text></Pressable></View>
    <View style={styles.trustBox}><View style={styles.trustIcon}><Ionicons name="shield-checkmark" size={17} color={BRAND.green}/></View><View style={{flex:1}}><Text style={styles.trustTitle}>Your preferences are saved</Text><Text style={styles.trustText}>Kareebu+ uses your country and chosen services to personalise your experience.</Text></View></View>
  </Animated.View>;
}

export function KareebuLaunchGate({screen,data,actions,children}:Props){
  const [bootState,setBootState]=useState<'splash'|'onboarding'|'app'>('splash');
  const [splashFinished,setSplashFinished]=useState(false);
  const [storedCompletion,setStoredCompletion]=useState<boolean|null>(null);
  const [step,setStep]=useState(0);
  const [countryIndex,setCountryIndex]=useState(()=>{const index=COUNTRIES.findIndex(item=>item.country===data?.country);return index>=0?index:0;});
  const [selectedServices,setSelectedServices]=useState<ServiceKey[]>(SERVICES.map(item=>item.key));
  const actionsRef=useRef(actions); actionsRef.current=actions; void screen;
  const handleSplashDone=useCallback(()=>setSplashFinished(true),[]);
  useEffect(()=>{let active=true;AsyncStorage.getItem(STORAGE.complete).then(value=>active&&setStoredCompletion(value==='1')).catch(()=>active&&setStoredCompletion(false));return()=>{active=false;};},[]);
  useEffect(()=>{if(!splashFinished||storedCompletion===null||bootState!=='splash')return;if(storedCompletion){actionsRef.current.go('home');setBootState('app');}else setBootState('onboarding');},[bootState,splashFinished,storedCompletion]);
  const continueCountry=async()=>{const selected=COUNTRIES[countryIndex]??COUNTRIES[0];actionsRef.current.setCountry?.(selected.country);actionsRef.current.setCity?.(selected.city);try{await AsyncStorage.setItem(STORAGE.country,selected.code);}catch{}setStep(1);};
  const continueServices=async()=>{try{await AsyncStorage.setItem(STORAGE.services,JSON.stringify(selectedServices));}catch{}setStep(2);};
  const finish=async(choice:LaunchChoice)=>{const selected=COUNTRIES[countryIndex]??COUNTRIES[0];try{await AsyncStorage.multiSet([[STORAGE.complete,'1'],[STORAGE.country,selected.code],[STORAGE.services,JSON.stringify(selectedServices)],[LEGACY_COMPLETE_KEY,'1']]);}catch{}if(choice==='guest'){actionsRef.current.setGuest?.(true);actionsRef.current.go('home');}else if(choice==='signup')actionsRef.current.go('signUp');else actionsRef.current.go('signIn');setBootState('app');};
  if(bootState==='app')return <>{children}</>;
  if(bootState==='splash')return <AnimatedSplash onDone={handleSplashDone}/>;
  return <SafeAreaView style={styles.root} edges={['top','right','bottom','left']}>{step===0?<CountryStep selectedIndex={countryIndex} setSelectedIndex={setCountryIndex} next={()=>void continueCountry()}/>:step===1?<ServicesStep selected={selectedServices} setSelected={setSelectedServices} back={()=>setStep(0)} next={()=>void continueServices()}/>:<AccessStep back={()=>setStep(1)} finish={choice=>void finish(choice)}/>}</SafeAreaView>;
}

const styles=StyleSheet.create({
  root:{flex:1,backgroundColor:BRAND.white},pressed:{opacity:.76,transform:[{scale:.99}]},disabled:{opacity:.45},
  splashRoot:{flex:1,backgroundColor:BRAND.white,overflow:'hidden'},splashContent:{flex:1,justifyContent:'center',alignItems:'center',paddingHorizontal:22,paddingBottom:54},splashGlow:{position:'absolute',width:390,height:390,borderRadius:195,backgroundColor:BRAND.yellow,top:-205,left:-115},splashWatermark:{position:'absolute',width:320,height:320,right:-92,bottom:18},splashLogo:{width:305,height:94},splashTagline:{alignItems:'center',marginTop:2,marginBottom:26},splashTaglineMain:{color:BRAND.black,fontSize:27,lineHeight:32,fontWeight:'900',letterSpacing:-.65},splashTaglineAccent:{color:BRAND.yellowDeep,fontSize:30,lineHeight:35,fontWeight:'900',letterSpacing:-.7},splashServiceGrid:{width:'100%',flexDirection:'row',flexWrap:'wrap',gap:10},splashServiceCard:{width:'48.5%',minHeight:116,borderRadius:26,backgroundColor:'#FFFDF8',borderWidth:1,borderColor:'#FFF0B4',alignItems:'center',justifyContent:'center',paddingVertical:10,shadowColor:'#D89D00',shadowOpacity:.10,shadowRadius:15,shadowOffset:{width:0,height:7},elevation:3},splashServiceImage:{width:72,height:72},splashServiceLabel:{color:BRAND.black,fontSize:14,fontWeight:'900',marginTop:2},splashWaveSoft:{position:'absolute',width:520,height:190,borderRadius:260,backgroundColor:'#FFE9A0',left:-110,bottom:-118,transform:[{rotate:'-7deg'}]},splashWave:{position:'absolute',width:480,height:180,borderRadius:240,backgroundColor:BRAND.yellow,right:-160,bottom:-126,transform:[{rotate:'9deg'}]},
  onboardingPage:{flex:1,paddingHorizontal:20,paddingBottom:14},
  countryPage:{flex:1,backgroundColor:BRAND.white},
  countryHeader:{paddingHorizontal:20,backgroundColor:BRAND.white,zIndex:3},
  countryHeadingRow:{flexDirection:'row',alignItems:'flex-end',gap:12,paddingBottom:15},
  countryHeadingCopy:{flex:1},
  googleMapBadge:{height:32,borderRadius:16,backgroundColor:BRAND.yellowSoft,paddingHorizontal:10,flexDirection:'row',alignItems:'center',gap:5,marginBottom:1},
  googleMapBadgeText:{fontSize:11.5,fontWeight:'900',color:BRAND.black},
  countryMapStage:{flex:1,minHeight:390,overflow:'hidden',backgroundColor:'#EAF1F4'},
  mapTopFade:{position:'absolute',left:0,right:0,top:0,height:92,backgroundColor:'rgba(255,255,255,0.08)'},
  countryMapTopRow:{position:'absolute',left:16,right:16,top:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  selectedCountryPill:{minHeight:50,borderRadius:17,backgroundColor:'rgba(255,255,255,0.96)',paddingHorizontal:12,paddingVertical:8,flexDirection:'row',alignItems:'center',gap:9,shadowColor:'#000',shadowOpacity:.11,shadowRadius:12,shadowOffset:{width:0,height:5},elevation:5},
  selectedCountryDot:{width:10,height:10,borderRadius:5,backgroundColor:BRAND.yellow},
  selectedCountryPillTitle:{fontSize:13,fontWeight:'900',color:BRAND.black},
  selectedCountryPillSub:{fontSize:10.5,fontWeight:'700',color:BRAND.muted,marginTop:1},
  recenterButton:{width:46,height:46,borderRadius:23,backgroundColor:'rgba(255,255,255,0.96)',alignItems:'center',justifyContent:'center',shadowColor:'#000',shadowOpacity:.11,shadowRadius:12,shadowOffset:{width:0,height:5},elevation:5},
  liveMarker:{alignItems:'center'},
  liveMarkerDot:{width:22,height:22,borderRadius:11,backgroundColor:BRAND.yellow,borderWidth:5,borderColor:BRAND.white,shadowColor:'#000',shadowOpacity:.18,shadowRadius:7,elevation:4},
  liveMarkerBubble:{marginTop:5,minWidth:98,borderRadius:14,backgroundColor:BRAND.white,paddingHorizontal:11,paddingVertical:7,alignItems:'center',shadowColor:'#000',shadowOpacity:.12,shadowRadius:9,shadowOffset:{width:0,height:4},elevation:4},
  liveMarkerCountry:{fontSize:12,fontWeight:'900',color:BRAND.black},
  liveMarkerCity:{fontSize:10.5,fontWeight:'700',color:BRAND.muted,marginTop:1},
  countryCarouselOverlay:{position:'absolute',left:0,right:0,bottom:10},
  countryFooter:{backgroundColor:BRAND.white,paddingHorizontal:20,paddingTop:13,paddingBottom:14,borderTopWidth:1,borderTopColor:'#F0F0F0'},
chrome:{height:68,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},chromeSide:{width:88,minHeight:42,justifyContent:'center'},chromeRight:{alignItems:'flex-end'},backButton:{width:42,height:42,borderRadius:21,backgroundColor:'#F7F7F8',alignItems:'center',justifyContent:'center'},chromeLogo:{width:152,height:48},stepPill:{borderRadius:20,backgroundColor:'#F6F4EF',paddingHorizontal:12,paddingVertical:8},stepPillText:{color:BRAND.muted,fontSize:12,fontWeight:'900'},onboardingTitle:{marginTop:10,color:BRAND.black,fontSize:29,lineHeight:35,fontWeight:'900',letterSpacing:-.75},onboardingSubtitle:{marginTop:7,color:BRAND.muted,fontSize:14.5,lineHeight:21,maxWidth:350},
  countryCard:{height:124,borderRadius:22,overflow:'hidden',borderWidth:2,borderColor:'rgba(255,255,255,.75)',backgroundColor:'#EEE',shadowColor:'#000',shadowOpacity:.16,shadowRadius:12,shadowOffset:{width:0,height:6},elevation:5},countryCardActive:{borderColor:BRAND.yellow},countryCardPressed:{transform:[{scale:.985}]},countryImage:{...StyleSheet.absoluteFill,width:'100%',height:'100%'},countryGradient:{...StyleSheet.absoluteFill,backgroundColor:'rgba(0,0,0,0.22)'},countryCopy:{position:'absolute',left:14,right:14,bottom:13,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},countryCity:{color:BRAND.white,fontSize:20,fontWeight:'900',textShadowColor:'rgba(0,0,0,.25)',textShadowRadius:3},countryName:{color:'rgba(255,255,255,.92)',fontSize:12.5,fontWeight:'700',marginTop:2},countryCheck:{width:30,height:30,borderRadius:15,backgroundColor:'rgba(255,255,255,.85)',alignItems:'center',justifyContent:'center'},countryCheckActive:{backgroundColor:BRAND.yellow},dots:{height:24,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7},dot:{width:7,height:7,borderRadius:4,backgroundColor:'#D9DADC'},dotActive:{width:20,backgroundColor:BRAND.yellow},
  pageFooter:{marginTop:'auto',paddingTop:10},primaryButton:{minHeight:62,borderRadius:20,backgroundColor:BRAND.yellow,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:11,paddingHorizontal:20,shadowColor:'#D89D00',shadowOpacity:.16,shadowRadius:12,shadowOffset:{width:0,height:7},elevation:3},primaryButtonText:{color:BRAND.black,fontSize:17,fontWeight:'900'},
  serviceGrid:{marginTop:22,flexDirection:'row',flexWrap:'wrap',gap:12},serviceCard:{width:'48%',minHeight:190,borderRadius:27,borderWidth:1.5,borderColor:BRAND.line,backgroundColor:BRAND.white,padding:14,shadowColor:'#000',shadowOpacity:.045,shadowRadius:12,shadowOffset:{width:0,height:6},elevation:2},serviceCardActive:{borderColor:BRAND.yellow,backgroundColor:'#FFFEF8'},serviceCheck:{position:'absolute',right:11,top:11,zIndex:2,width:29,height:29,borderRadius:15,backgroundColor:'#F0F1F2',alignItems:'center',justifyContent:'center'},serviceCheckActive:{backgroundColor:BRAND.yellow},serviceImage:{width:91,height:91,alignSelf:'center',marginTop:3},serviceTitle:{color:BRAND.black,fontSize:17,fontWeight:'900',marginTop:7},serviceBody:{color:BRAND.muted,fontSize:12.5,lineHeight:17,marginTop:3,paddingRight:6},
  accessHero:{height:188,alignItems:'center',justifyContent:'center',marginTop:18,marginBottom:12},accessHeroGlow:{position:'absolute',width:184,height:184,borderRadius:58,backgroundColor:BRAND.yellowSoft,transform:[{rotate:'8deg'}]},accessMark:{width:156,height:156},accessButtons:{marginTop:24,gap:10},accessPrimary:{minHeight:62,borderRadius:20,backgroundColor:BRAND.yellow,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,paddingHorizontal:18},accessPrimaryText:{color:BRAND.black,fontSize:16,fontWeight:'900',flex:1,textAlign:'center'},accessSecondary:{minHeight:58,borderRadius:19,borderWidth:1.3,borderColor:'#E5E6E8',backgroundColor:BRAND.white,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10},accessSecondaryText:{color:BRAND.black,fontSize:15.5,fontWeight:'800'},trustBox:{marginTop:'auto',borderRadius:20,backgroundColor:'#F7F9F7',padding:15,flexDirection:'row',alignItems:'flex-start',gap:11},trustIcon:{width:34,height:34,borderRadius:17,backgroundColor:'#E5F6EA',alignItems:'center',justifyContent:'center'},trustTitle:{color:BRAND.black,fontSize:13.5,fontWeight:'900'},trustText:{color:BRAND.muted,fontSize:12,lineHeight:17,marginTop:3},
});
