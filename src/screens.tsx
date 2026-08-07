import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  AppField,
  BottomNav,
  Header,
  LocationDot,
  MenuRow,
  PaymentLogo,
  PrimaryButton,
  RoundedCard,
  ScreenShell,
  SectionTitle,
  ServiceTile,
  TextButton,
  TrustNote,
} from './components';
import { assets } from './assets';
import { BottomTab, RideId, Screen } from './types';
import { COLORS, FONT, SHADOW } from './theme';

export type AppData = {
  guest: boolean;
  authReturn: Screen;
  city: string;
  phone: string;
  otp: string[];
  fullName: string;
  email: string;
  locationAllowed: boolean;
  notificationsAllowed: boolean;
  selectedRide: RideId;
  selectedPayment: 'mtn' | 'airtel' | 'visa';
  rating: number;
  tip: number;
};

export type AppActions = {
  go: (screen: Screen) => void;
  setGuest: (value: boolean) => void;
  setAuthReturn: (value: Screen) => void;
  setCity: (value: string) => void;
  setPhone: (value: string) => void;
  setOtp: (value: string[]) => void;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setLocationAllowed: (value: boolean) => void;
  setNotificationsAllowed: (value: boolean) => void;
  setSelectedRide: (value: RideId) => void;
  setSelectedPayment: (value: 'mtn' | 'airtel' | 'visa') => void;
  setRating: (value: number) => void;
  setTip: (value: number) => void;
};

const cities = ['Kampala', 'Entebbe', 'Jinja', 'Mbarara', 'Gulu'];
const rideData: Array<{ id: RideId; name: string; eta: string; fare: string; icon: ImageSourcePropType }> = [
  { id: 'boda', name: 'Boda', eta: '2 min away', fare: 'UGX 2,000', icon: assets.service.boda },
  { id: 'economy', name: 'Economy', eta: '4 min away', fare: 'UGX 6,500', icon: assets.service.rides },
  { id: 'comfort', name: 'Comfort', eta: '6 min away', fare: 'UGX 11,000', icon: assets.service.rides },
  { id: 'xl', name: 'XL', eta: '7 min away', fare: 'UGX 16,000', icon: assets.service.rides },
  { id: 'delivery', name: 'Delivery', eta: '10 min away', fare: 'UGX 5,000', icon: assets.service.send },
];

const serviceData: Array<{ label: string; image: ImageSourcePropType; screen: Screen }> = [
  { label: 'Rides', image: assets.service.rides, screen: 'whereTo' },
  { label: 'Boda', image: assets.service.boda, screen: 'whereTo' },
  { label: 'Food', image: assets.service.food, screen: 'food' },
  { label: 'Shops', image: assets.service.shops, screen: 'shops' },
  { label: 'Send', image: assets.service.send, screen: 'parcel' },
  { label: 'Groceries', image: assets.service.groceries, screen: 'shops' },
  { label: 'Pay', image: assets.service.pay, screen: 'wallet' },
  { label: 'All services', image: assets.service.all, screen: 'home' },
];

function OnboardingFrame({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <ScreenShell>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.onboardingBody}>{children}</View>
        {footer ? <View style={styles.onboardingFooter}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

export function SplashScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <Pressable style={styles.splash} onPress={() => go('welcome')}>
      <Image source={assets.wordmark} style={styles.splashWordmark} resizeMode="contain" />
      <View style={styles.splashTagline}>
        <Text style={styles.splashTaglineWhite}>Everything you need,</Text>
        <Text style={styles.splashTaglineYellow}>all in one place.</Text>
      </View>
      <Image source={assets.ribbons} style={styles.splashRibbons} resizeMode="cover" />
    </Pressable>
  );
}

export function WelcomeScreen({ go, setGuest }: Pick<AppActions, 'go' | 'setGuest'>) {
  return (
    <ScreenShell contentStyle={styles.welcomeScreen}>
      <View style={styles.welcomeTop}>
        <Text style={styles.welcomeKicker}>Welcome to</Text>
        <Text style={styles.welcomeTitle}>Kareebu+</Text>
        <Text style={styles.welcomeRed}>Everything you need,</Text>
        <Text style={styles.welcomeLine}>all in one place.</Text>
      </View>
      <View style={styles.welcomeHeroFrame}>
        <Image source={assets.welcomeHero} style={styles.welcomeHero} resizeMode="contain" />
      </View>
      <View style={styles.welcomeServices}>
        {[
          ['Rides', assets.service.rides],
          ['Food', assets.service.food],
          ['Shops', assets.service.shops],
          ['Payments', assets.service.pay],
        ].map(([label, image]) => (
          <View key={label as string} style={styles.welcomeServiceItem}>
            <Image source={image as ImageSourcePropType} style={styles.welcomeServiceIcon} resizeMode="contain" />
            <Text style={styles.welcomeServiceLabel}>{label as string}</Text>
          </View>
        ))}
      </View>
      <View style={styles.welcomeActions}>
        <PrimaryButton label="Get started" onPress={() => { setGuest(false); go('location'); }} />
        <TextButton label="Continue as guest" onPress={() => { setGuest(true); go('home'); }} color={COLORS.black} />
      </View>
    </ScreenShell>
  );
}

export function LocationScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <OnboardingFrame footer={<PrimaryButton label="Continue" onPress={() => actions.go('phone')} />}>
      <Header onBack={() => actions.go('welcome')} />
      <View style={styles.onboardingPadding}>
        <Text style={styles.onboardingTitle}>Where are you?</Text>
        <Text style={styles.onboardingSubtitle}>Choose your country{`\n`}and city to continue</Text>
        <RoundedCard style={styles.countryCard}>
          <Image source={assets.flag} style={styles.flagImage} />
          <Text style={styles.countryName}>Uganda</Text>
          <Feather name="chevron-right" size={23} color={COLORS.muted} />
        </RoundedCard>
        <Text style={styles.groupLabel}>Popular cities</Text>
        <RoundedCard style={styles.cityCard}>
          {cities.map((city, index) => {
            const selected = data.city === city;
            return (
              <Pressable key={city} onPress={() => actions.setCity(city)} style={[styles.cityRow, selected && styles.cityRowSelected, !selected && index < cities.length - 1 && styles.rowDivider]}>
                <Text style={styles.cityName}>{city}</Text>
                <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <Feather name="check" size={14} color={COLORS.white} /> : null}</View>
              </Pressable>
            );
          })}
        </RoundedCard>
      </View>
    </OnboardingFrame>
  );
}

export function PhoneScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <OnboardingFrame>
      <Header onBack={() => actions.go('location')} />
      <View style={[styles.onboardingPadding, styles.phoneContent]}>
        <Text style={styles.onboardingTitle}>Sign in with{`\n`}your phone</Text>
        <Text style={styles.onboardingSubtitle}>We’ll send you a code to{`\n`}verify your number</Text>
        <View style={styles.phoneFields}>
          <RoundedCard style={styles.countryCodeCard}>
            <Image source={assets.flag} style={styles.flagImageSmall} />
            <Text style={styles.countryCode}>+256</Text>
            <Feather name="chevron-down" size={22} color={COLORS.black} />
          </RoundedCard>
          <AppField value={data.phone} onChangeText={actions.setPhone} keyboardType="phone-pad" placeholder="7 123 456 789" />
          <PrimaryButton label="Send code" onPress={() => actions.go('otp')} disabled={data.phone.replace(/\D/g, '').length < 9} />
        </View>
        <View style={styles.bottomTrust}><TrustNote icon="lock-outline" title="Secure and private" body="Your number is safe with us." /></View>
      </View>
    </OnboardingFrame>
  );
}

export function OtpScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const refs = useRef<Array<any>>([]);
  const setDigit = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...data.otp]; next[index] = digit; actions.setOtp(next);
    if (digit && index < 5) refs.current[index + 1]?.focus();
    if (next.every(Boolean)) setTimeout(() => actions.go('profile'), 180);
  };
  return (
    <OnboardingFrame>
      <Header onBack={() => actions.go('phone')} />
      <View style={[styles.onboardingPadding, styles.otpContent]}>
        <Text style={styles.onboardingTitle}>Enter the code{`\n`}we sent you</Text>
        <Text style={styles.onboardingSubtitle}>We’ve sent a 6-digit code to</Text>
        <Text style={styles.phoneSummary}>+256 {data.phone || '7 123 456 789'}</Text>
        <View style={styles.otpRow}>
          {data.otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { refs.current[index] = ref; }}
              value={digit}
              onChangeText={(value) => setDigit(value, index)}
              onKeyPress={({ nativeEvent }) => { if (nativeEvent.key === 'Backspace' && !digit && index > 0) refs.current[index - 1]?.focus(); }}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpBox}
              textAlign="center"
            />
          ))}
        </View>
        <View style={styles.resendRow}>
          <Ionicons name="refresh" size={23} color={COLORS.red} />
          <Text style={styles.resendText}>Resend code in <Text style={styles.resendTime}>00:28</Text></Text>
        </View>
        <View style={styles.bottomTrust}><TrustNote icon="shield-check-outline" title="Didn’t receive the code?" body="Check your SMS or resend." /></View>
      </View>
    </OnboardingFrame>
  );
}

export function ProfileScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <OnboardingFrame footer={<PrimaryButton label="Continue" onPress={() => actions.go('permissions')} disabled={!data.fullName.trim()} />}>
      <Header onBack={() => actions.go('otp')} />
      <ScrollView contentContainerStyle={styles.onboardingPadding} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.onboardingTitle}>Let’s set up{`\n`}your profile</Text>
        <Text style={styles.onboardingSubtitle}>Tell us a bit about yourself</Text>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={86} color="#C8C9CD" />
          <View style={styles.avatarCamera}><Feather name="camera" size={18} color={COLORS.black} /></View>
        </View>
        <View style={styles.profileFields}>
          <AppField label="Full name" value={data.fullName} onChangeText={actions.setFullName} placeholder="Nalubega Sarah" />
          <AppField label="Email address (optional)" value={data.email} onChangeText={actions.setEmail} keyboardType="email-address" placeholder="nalubega.sarah@gmail.com" autoCapitalize="none" />
          <Text style={styles.formHelp}>We’ll use this for receipts{`\n`}and important updates.</Text>
        </View>
      </ScrollView>
    </OnboardingFrame>
  );
}

function PermissionCard({
  icon,
  title,
  body,
  enabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.permissionCard, pressed && styles.pressed]}>
      <Ionicons name={icon} size={27} color={COLORS.black} />
      <View style={styles.flex}>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionBody}>{body}</Text>
      </View>
      <View style={[styles.permissionCheck, enabled && styles.permissionCheckEnabled]}>{enabled ? <Feather name="check" size={16} color={COLORS.white} /> : null}</View>
    </Pressable>
  );
}

export function PermissionsScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell scroll contentStyle={styles.permissionsScroll}>
      <View style={styles.permissionsPadding}>
        <Text style={styles.permissionsTitle}>Allow permissions</Text>
        <Text style={styles.permissionsSubtitle}>To give you the best Kareebu+{`\n`}experience</Text>
        <View style={styles.permissionStack}>
          <PermissionCard icon="location-outline" title="Location access" body="Helps us find your location, show nearby services and estimate ride fares." enabled={data.locationAllowed} onPress={() => actions.setLocationAllowed(!data.locationAllowed)} />
          <PermissionCard icon="notifications-outline" title="Notifications" body="Get updates on rides, orders, offers and important alerts." enabled={data.notificationsAllowed} onPress={() => actions.setNotificationsAllowed(!data.notificationsAllowed)} />
        </View>
        <Text style={styles.previewTitle}>Home preview</Text>
        <Text style={styles.previewSubtitle}>Here’s a quick look</Text>
        <RoundedCard style={styles.homePreview}>
          <View style={styles.previewHeader}><Ionicons name="location" size={20} color={COLORS.red} /><Text style={styles.previewLocation}>{data.city}, Uganda</Text><View style={styles.previewBalance}><Image source={assets.mark} style={styles.miniMark} /><Text style={styles.previewBalanceText}>UGX 52,000</Text></View></View>
          <View style={styles.previewSearch}><Feather name="search" size={18} color={COLORS.black} /><Text style={styles.previewSearchText}>What do you need?</Text></View>
          <View style={styles.previewServices}>{serviceData.slice(0, 4).map((s) => <View key={s.label} style={styles.previewService}><Image source={s.image} style={styles.previewServiceIcon} /><Text style={styles.previewServiceText}>{s.label}</Text></View>)}</View>
        </RoundedCard>
        <PrimaryButton label={data.authReturn === 'home' ? 'Go to Home' : 'Continue'} onPress={() => { const next = data.authReturn; actions.setAuthReturn('home'); actions.go(next); }} />
      </View>
    </ScreenShell>
  );
}

function HomeHeader({ city, go }: { city: string; go: (screen: Screen) => void }) {
  return (
    <View style={styles.homeHeader}>
      <Pressable style={styles.homeLocation} onPress={() => go('location')}>
        <Ionicons name="location" size={23} color={COLORS.red} />
        <Text style={styles.homeLocationText}>{city}, Uganda</Text>
        <Feather name="chevron-down" size={17} color={COLORS.black} />
      </Pressable>
      <Pressable style={styles.balancePill} onPress={() => go('wallet')}>
        <Image source={assets.mark} style={styles.balanceMark} />
        <Text style={styles.balanceText}>UGX 52,000</Text>
      </Pressable>
    </View>
  );
}

function KareebuBlackPromo({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.kareebuPromo, pressed && styles.pressed]}>
      <Image source={assets.promoVisual} style={styles.kareebuPromoVisual} resizeMode="cover" />
      <View style={styles.kareebuPromoCopy}>
        <Text style={styles.kareebuPromoBrand}>Kareebu</Text>
        <Text style={styles.kareebuPromoTier}>BLACK</Text>
        <Text style={styles.kareebuPromoBody}>More rewards.{`\n`}Priority support.{`\n`}Exclusive perks.</Text>
        <View style={styles.kareebuPromoButton}><Text style={styles.kareebuPromoButtonText}>Join Kareebu Black</Text></View>
      </View>
      <View style={styles.kareebuPromoMiniCard}>
        <Text style={styles.kareebuPromoCardBrand}>Kareebu</Text>
        <Text style={styles.kareebuPromoCardTier}>BLACK</Text>
      </View>
    </Pressable>
  );
}

function RecentActivity({ go }: { go: (screen: Screen) => void }) {
  const rows = [
    { title: 'Ride to Work', meta: 'Today, 8:15 AM', amount: 'UGX 6,500', image: assets.service.rides, screen: 'activity' as Screen },
    { title: 'Pizza from Cafe Javas', meta: 'Yesterday, 7:45 PM', amount: 'UGX 24,000', image: assets.service.food, screen: 'orders' as Screen },
    { title: 'Groceries from Capital Shoppers', meta: 'Oct 18, 2:30 PM', amount: 'UGX 18,400', image: assets.service.groceries, screen: 'orders' as Screen },
  ];
  return (
    <View>
      <SectionTitle title="Recent activity" action="See all" onAction={() => go('activity')} />
      <RoundedCard style={styles.activityCard}>
        {rows.map((row, index) => (
          <Pressable key={row.title} style={[styles.activityRow, index < rows.length - 1 && styles.rowDivider]} onPress={() => go(row.screen)}>
            <Image source={row.image} style={styles.activityIcon} resizeMode="contain" />
            <View style={styles.flex}><Text numberOfLines={1} style={styles.activityTitle}>{row.title}</Text><Text style={styles.activityMeta}>{row.meta}</Text></View>
            <Text style={styles.activityAmount}>{row.amount}</Text>
          </Pressable>
        ))}
      </RoundedCard>
    </View>
  );
}

function HomeFoodSection({ go }: { go: (screen: Screen) => void }) {
  const items = [
    { title: 'Cafe Javas', image: assets.food.cafeJavas, rating: '4.6', meta: '20–30 min' },
    { title: 'Chicken Tonight', image: assets.food.chickenTonight, rating: '4.5', meta: '25–35 min' },
    { title: 'Tamara Thai', image: assets.food.tamaraThai, rating: '4.7', meta: '30–40 min' },
  ];
  return (
    <View>
      <SectionTitle title="Food near you" action="See all" onAction={() => go('food')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {items.map((item) => (
          <Pressable key={item.title} onPress={() => go('restaurant')} style={({ pressed }) => [styles.homeFoodCard, pressed && styles.pressed]}>
            <Image source={item.image} style={styles.homeFoodImage} />
            <Text numberOfLines={1} style={styles.homeFoodTitle}>{item.title}</Text>
            <Text style={styles.homeFoodMeta}><Text style={styles.star}>★</Text> {item.rating} · {item.meta}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function HomeShopSection({ go }: { go: (screen: Screen) => void }) {
  return (
    <View>
      <SectionTitle title="Shops & groceries" action="See all" onAction={() => go('shops')} />
      <View style={styles.homeShopRow}>
        {[['Jumia', assets.shops.jumia], ['Carrefour', assets.shops.carrefour], ['Pharmacy', assets.shops.pharmacy]].map(([label, image]) => (
          <Pressable key={label as string} onPress={() => go('shops')} style={({ pressed }) => [styles.homeShopCard, pressed && styles.pressed]}>
            <Image source={image as ImageSourcePropType} style={styles.homeShopLogo} resizeMode="contain" />
            <Text style={styles.homeShopLabel}>{label as string}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function HomeScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell>
      <HomeHeader city={data.city} go={actions.go} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.homeScroll} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.searchBar} onPress={() => actions.go('whereTo')}>
          <Feather name="search" size={24} color={COLORS.black} />
          <Text style={styles.searchPlaceholder}>What do you need?</Text>
        </Pressable>
        <View style={styles.serviceGrid}>
          {serviceData.map((service) => <ServiceTile key={service.label} label={service.label} image={service.image} onPress={() => actions.go(service.screen)} />)}
        </View>
        <KareebuBlackPromo onPress={() => actions.go(data.guest ? 'account' : 'wallet')} />
        <RecentActivity go={actions.go} />
        <HomeFoodSection go={actions.go} />
        <HomeShopSection go={actions.go} />
      </ScrollView>
      <BottomNav active="home" go={actions.go} />
    </ScreenShell>
  );
}

function PlaceRow({ icon, title, subtitle, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.placeRow, pressed && styles.pressed]}>
      <Ionicons name={icon} size={27} color={COLORS.black} />
      <View style={styles.flex}><Text style={styles.placeTitle}>{title}</Text><Text style={styles.placeSubtitle}>{subtitle}</Text></View>
      <Feather name="chevron-right" size={25} color={COLORS.black} />
    </Pressable>
  );
}

export function WhereToScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Where to?" onBack={() => actions.go('home')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.whereScroll} showsVerticalScrollIndicator={false}>
        <RoundedCard style={styles.routeCard}>
          <View style={styles.routeLineRow}>
            <LocationDot />
            <View style={styles.flex}><Text style={styles.routeLabel}>Pickup location</Text><Text style={styles.routeValue}>Kyadondo Rd, Kampala</Text></View>
            <Pressable style={styles.smallOutlineButton}><Text style={styles.smallOutlineText}>Change</Text></Pressable>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeLineRow}>
            <LocationDot color={COLORS.red} />
            <View style={styles.flex}><Text style={styles.routeLabel}>Destination</Text><Text style={styles.routeValue}>Acacia Mall</Text></View>
            <Pressable style={styles.plusButton} onPress={() => actions.go('chooseRide')}><Feather name="plus" size={27} color={COLORS.black} /></Pressable>
          </View>
        </RoundedCard>
        <Image source={assets.maps.where} style={styles.whereMap} resizeMode="cover" />
        <RoundedCard style={styles.suggestedCard}>
          <Text style={styles.suggestedTitle}>Suggested places</Text>
          <PlaceRow icon="home-outline" title="Home" subtitle="Kisementi, Kampala" onPress={() => actions.go('chooseRide')} />
          <PlaceRow icon="bag-handle-outline" title="Acacia Mall" subtitle="Kisementi, Kampala" onPress={() => actions.go('chooseRide')} />
          <PlaceRow icon="location-outline" title="Ntinda" subtitle="Ntinda, Kampala" onPress={() => actions.go('chooseRide')} />
          <PlaceRow icon="airplane-outline" title="Entebbe International Airport" subtitle="Entebbe, Wakiso" onPress={() => actions.go('chooseRide')} />
        </RoundedCard>
      </ScrollView>
    </ScreenShell>
  );
}

function RideOption({ item, selected, onPress }: { item: typeof rideData[number]; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rideOption, selected && styles.rideOptionSelected, pressed && styles.pressed]}>
      <Image source={item.icon} style={styles.rideIcon} resizeMode="contain" />
      <View style={styles.flex}><Text style={styles.rideName}>{item.name}</Text><Text style={styles.rideEta}>{item.eta}</Text></View>
      <Text style={styles.rideFare}>{item.fare}</Text>
      <View style={[styles.rideRadio, selected && styles.rideRadioSelected]}>{selected ? <Feather name="check" size={15} color={COLORS.white} /> : null}</View>
    </Pressable>
  );
}

export function ChooseRideScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const selected = rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0];
  return (
    <ScreenShell>
      <Header title="Choose ride" onBack={() => actions.go('whereTo')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.rideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.rideList}>{rideData.map((ride) => <RideOption key={ride.id} item={ride} selected={data.selectedRide === ride.id} onPress={() => actions.setSelectedRide(ride.id)} />)}</View>
        <RoundedCard style={styles.scheduleCard}>
          <View style={styles.scheduleRow}><Ionicons name="calendar-outline" size={28} color={COLORS.red} /><View style={styles.flex}><Text style={styles.scheduleTitle}>Scheduled</Text><Text style={styles.scheduleSubtitle}>Book for later</Text></View><Feather name="chevron-right" size={24} color={COLORS.black} /></View>
        </RoundedCard>
        <RoundedCard style={styles.paymentSummary}>
          <PaymentLogo source={assets.payment.mtn} />
          <View style={styles.flex}><Text style={styles.paymentTitle}>MTN Mobile Money</Text><Text style={styles.paymentSubtitle}>0772 123456</Text></View>
          <TextButton label="Change" onPress={() => actions.go('wallet')} color={COLORS.muted} />
        </RoundedCard>
        <PrimaryButton label={data.guest ? `Sign in to book ${selected.name}` : `Confirm ${selected.name}`} onPress={() => { if (data.guest) { actions.setAuthReturn('confirmBooking'); actions.setGuest(false); actions.go('phone'); } else { actions.go('confirmBooking'); } }} />
        <Text style={styles.estimatedLabel}>Estimated fare</Text>
        <Text style={styles.estimatedFare}>{selected.fare}</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function PaymentChoice({ id, data, actions }: { id: 'mtn' | 'airtel' | 'visa'; data: AppData; actions: AppActions }) {
  const config = {
    mtn: { logo: assets.payment.mtn, title: 'MTN Mobile Money', detail: '0772 123456' },
    airtel: { logo: assets.payment.airtel, title: 'Airtel Money', detail: '0701 123456' },
    visa: { logo: assets.payment.visa, title: 'Visa •••• 4242', detail: '' },
  }[id];
  const selected = data.selectedPayment === id;
  return (
    <Pressable onPress={() => actions.setSelectedPayment(id)} style={[styles.paymentChoice, selected && styles.paymentChoiceSelected]}>
      <PaymentLogo source={config.logo} />
      <View style={styles.flex}><Text style={styles.paymentTitle}>{config.title}</Text>{config.detail ? <Text style={styles.paymentSubtitle}>{config.detail}</Text> : null}</View>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <Feather name="check" size={14} color={COLORS.white} /> : null}</View>
    </Pressable>
  );
}

export function ConfirmBookingScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const selected = rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0];
  const base = Number(selected.fare.replace(/\D/g, ''));
  const total = base + 500;
  return (
    <ScreenShell>
      <Header title="Confirm booking" onBack={() => actions.go('chooseRide')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.confirmScroll} showsVerticalScrollIndicator={false}>
        <RoundedCard style={styles.confirmRouteCard}>
          <View style={styles.confirmRouteRow}><LocationDot /><Text style={styles.confirmRouteText}>Kyadondo Rd, Kampala</Text></View>
          <View style={styles.confirmRouteConnector} />
          <View style={styles.confirmRouteRow}><LocationDot color={COLORS.red} /><Text style={styles.confirmRouteText}>Acacia Mall</Text></View>
          <Text style={styles.confirmRouteMeta}>2.8 km  ·  12 min</Text>
        </RoundedCard>
        <SectionTitle title="Payment method" action="Change" onAction={() => actions.go('wallet')} />
        <RoundedCard style={styles.paymentChoices}>
          <PaymentChoice id="mtn" data={data} actions={actions} />
          <PaymentChoice id="airtel" data={data} actions={actions} />
          <PaymentChoice id="visa" data={data} actions={actions} />
        </RoundedCard>
        <Text style={styles.priceTitle}>Price details</Text>
        <View style={styles.priceRow}><Text style={styles.priceLabel}>{selected.name} fare</Text><Text style={styles.priceValue}>{selected.fare}</Text></View>
        <View style={styles.priceRow}><Text style={styles.priceLabel}>Booking fee</Text><Text style={styles.priceValue}>UGX 500</Text></View>
        <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>UGX {total.toLocaleString()}</Text></View>
        <PrimaryButton label={`Book ${selected.name}`} onPress={() => actions.go('driver')} />
        <Text style={styles.cancelPolicy}>You can cancel for free within 1 min.</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function DriverProfile({ rating = '4.8', actions }: { rating?: string; actions: AppActions }) {
  return (
    <RoundedCard style={styles.driverProfile}>
      <Image source={assets.avatars.driver} style={styles.driverAvatar} />
      <View style={styles.flex}><Text style={styles.driverName}>Peter</Text><Text style={styles.driverRating}><Text style={styles.star}>★</Text> {rating}</Text><Text style={styles.driverMeta}>Boda  ·  UFA 123Q</Text></View>
      <Pressable style={styles.circleAction}><Ionicons name="call" size={24} color={COLORS.black} /></Pressable>
      <Pressable style={styles.circleAction}><Ionicons name="chatbubble-outline" size={24} color={COLORS.black} /></Pressable>
    </RoundedCard>
  );
}

export function DriverScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Driver on the way" onBack={() => actions.go('chooseRide')} right={<TextButton label="Emergency" onPress={() => {}} color={COLORS.red} />} />
      <Text style={styles.etaText}>2 min away</Text>
      <ScrollView style={styles.flex} contentContainerStyle={styles.driverScroll} showsVerticalScrollIndicator={false}>
        <Image source={assets.maps.driver} style={styles.driverMap} resizeMode="cover" />
        <DriverProfile actions={actions} />
        <View style={styles.driverActionGrid}>
          {[['call', 'Call'], ['chatbubble-outline', 'Chat'], ['share-social-outline', 'Share'], ['close', 'Cancel']].map(([icon, label]) => (
            <Pressable key={label} style={styles.driverAction}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={label === 'Cancel' ? COLORS.red : COLORS.black} /><Text style={styles.driverActionLabel}>{label}</Text></Pressable>
          ))}
        </View>
        <PrimaryButton label="Start trip" onPress={() => actions.go('onTrip')} />
      </ScrollView>
    </ScreenShell>
  );
}

export function OnTripScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="On trip" onBack={() => actions.go('driver')} right={<TextButton label="Emergency" onPress={() => {}} color={COLORS.red} />} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.tripScroll} showsVerticalScrollIndicator={false}>
        <Image source={assets.maps.onTrip} style={styles.tripMap} resizeMode="cover" />
        <RoundedCard style={styles.tripSummary}>
          <Text style={styles.tripLabel}>Ride to</Text><Text style={styles.tripDestination}>Acacia Mall</Text>
          <View style={styles.tripRule} />
          <View style={styles.tripStats}>
            {[['Distance','8.3 km'],['Time','12 min'],['Fare','UGX 6,500']].map(([label,value]) => <View key={label}><Text style={styles.tripStatLabel}>{label}</Text><Text style={styles.tripStatValue}>{value}</Text></View>)}
          </View>
          <View style={styles.tripButtons}><Pressable style={styles.tripSecondary}><Feather name="share" size={21} /><Text style={styles.tripSecondaryText}>Share trip</Text></Pressable><Pressable style={styles.tripSecondary}><MaterialCommunityIcons name="shield-check-outline" size={23} /><Text style={styles.tripSecondaryText}>Safety toolkit</Text></Pressable></View>
          <PrimaryButton label="End trip" onPress={() => actions.go('tripComplete')} />
        </RoundedCard>
        <DriverProfile rating="4.8" actions={actions} />
      </ScrollView>
    </ScreenShell>
  );
}

export function TripCompleteScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Trip completed" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.completeScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.completeBadge}><Feather name="check" size={56} color={COLORS.white} /></View>
        <Text style={styles.completeThankYou}>Thanks for riding with Kareebu+!</Text>
        <RoundedCard style={styles.completeRouteCard}>
          <View style={styles.completePlace}><LocationDot /><Text style={styles.completePlaceText}>Kyadondo Rd, Kampala</Text></View>
          <View style={styles.completePlace}><LocationDot color={COLORS.red} /><Text style={styles.completePlaceText}>Acacia Mall</Text></View>
          <Text style={styles.completeMeta}>2.8 km  ·  12 min</Text>
        </RoundedCard>
        <RoundedCard style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Fare breakdown</Text>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Boda fare</Text><Text style={styles.priceValue}>UGX 2,000</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Booking fee</Text><Text style={styles.priceValue}>UGX 500</Text></View>
          <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>UGX 2,500</Text></View>
          <View style={styles.paidWith}><PaymentLogo source={data.selectedPayment === 'airtel' ? assets.payment.airtel : data.selectedPayment === 'visa' ? assets.payment.visa : assets.payment.mtn} /><View><Text style={styles.paymentSubtitle}>Paid with</Text><Text style={styles.paymentTitle}>{data.selectedPayment === 'airtel' ? 'Airtel Money' : data.selectedPayment === 'visa' ? 'Visa •••• 4242' : 'MTN Mobile Money'}</Text></View></View>
        </RoundedCard>
        <PrimaryButton label="Rate this trip" onPress={() => actions.go('rateTrip')} />
        <TextButton label="Download receipt" onPress={() => {}} color={COLORS.black} />
      </ScrollView>
    </ScreenShell>
  );
}

export function RateTripScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Rate your trip" onBack={() => actions.go('tripComplete')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.rateScroll} showsVerticalScrollIndicator={false}>
        <DriverProfile actions={actions} />
        <Text style={styles.rateQuestion}>How was your ride?</Text>
        <View style={styles.starsRow}>{[1,2,3,4,5].map((star) => <Pressable key={star} onPress={() => actions.setRating(star)}><Ionicons name={data.rating >= star ? 'star' : 'star-outline'} size={45} color={COLORS.yellow} /></Pressable>)}</View>
        <Text style={styles.rateWord}>{data.rating >= 5 ? 'Excellent' : data.rating >= 4 ? 'Great' : data.rating >= 3 ? 'Good' : 'Tell us more'}</Text>
        <RoundedCard style={styles.tipCard}>
          <Text style={styles.tipTitle}>Add a tip for Peter</Text><Text style={styles.tipSubtitle}>100% goes to your driver</Text>
          <View style={styles.tipRow}>{[500,1000,2000,0].map((tip) => <Pressable key={tip} onPress={() => actions.setTip(tip)} style={[styles.tipOption, data.tip === tip && styles.tipOptionSelected]}><Text style={[styles.tipOptionText, data.tip === tip && styles.tipOptionTextSelected]}>{tip ? `UGX ${tip.toLocaleString()}` : 'Other'}</Text></Pressable>)}</View>
          <View style={styles.priceRow}><Text style={styles.totalLabel}>Total to driver</Text><Text style={styles.totalValue}>UGX {data.tip.toLocaleString()}</Text></View>
        </RoundedCard>
        <PrimaryButton label="Submit" onPress={() => actions.go('home')} />
        <TextButton label="Skip" onPress={() => actions.go('home')} color={COLORS.muted} />
      </ScrollView>
    </ScreenShell>
  );
}

function CommerceHeader({ title, location, cart, go }: { title: string; location?: string; cart?: boolean; go: (screen: Screen) => void }) {
  return (
    <View style={styles.commerceHeader}>
      <Text style={styles.commerceTitle}>{title}</Text>
      {location ? <Pressable style={styles.commerceLocation}><Ionicons name="location" size={21} color={COLORS.red} /><Text style={styles.commerceLocationText}>{location}</Text><Feather name="chevron-down" size={20} color={COLORS.black} /></Pressable> : null}
      {cart ? <Pressable onPress={() => go('cart')} style={styles.cartButton}><Ionicons name="cart-outline" size={30} color={COLORS.black} /></Pressable> : null}
    </View>
  );
}

function CategoryPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <Pressable style={styles.categoryItem}><View style={styles.categoryCircle}>{icon}</View><Text style={styles.categoryLabel}>{label}</Text></Pressable>;
}

export function FoodScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={styles.commerceScroll} showsVerticalScrollIndicator={false}>
        <CommerceHeader title="Food" location="Kampala" go={actions.go} />
        <Pressable style={styles.searchBar} onPress={() => {}}><Feather name="search" size={23} /><Text style={styles.searchPlaceholder}>Search for restaurants or dishes</Text></Pressable>
        <View style={styles.categoryPanel}>
          <CategoryPill icon={<Ionicons name="grid-outline" size={25} color={COLORS.red} />} label="All" />
          <CategoryPill icon={<Text style={styles.categoryEmoji}>🍕</Text>} label="Pizza" />
          <CategoryPill icon={<Text style={styles.categoryEmoji}>🍗</Text>} label="Chicken" />
          <CategoryPill icon={<Text style={styles.categoryEmoji}>🍔</Text>} label="Burgers" />
          <CategoryPill icon={<Text style={styles.categoryEmoji}>🥗</Text>} label="Local" />
          <CategoryPill icon={<Ionicons name="ellipsis-horizontal" size={24} />} label="More" />
        </View>
        <Pressable onPress={() => actions.go('restaurant')}><Image source={assets.food.promo} style={styles.commercePromo} resizeMode="cover" /></Pressable>
        <SectionTitle title="Popular restaurants" action="See all" onAction={() => {}} />
        <View style={styles.restaurantRow}>
          {[
            ['Cafe Javas', assets.food.cafeJavas, '4.6', '20–30 min · UGX 10,000'],
            ['Chicken Tonight', assets.food.chickenTonight, '4.5', '25–35 min · UGX 12,000'],
            ['Tamara Thai', assets.food.tamaraThai, '4.7', '30–40 min · UGX 14,000'],
          ].map(([name,image,rating,meta]) => (
            <Pressable key={name as string} onPress={() => actions.go('restaurant')} style={styles.restaurantCard}>
              <Image source={image as ImageSourcePropType} style={styles.restaurantImage} />
              <Text numberOfLines={1} style={styles.restaurantName}>{name as string}</Text>
              <Text style={styles.restaurantRating}><Text style={styles.star}>★</Text> {rating as string}</Text>
              <Text numberOfLines={1} style={styles.restaurantMeta}>{meta as string}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <FoodBottomNav go={actions.go} active="food" />
    </ScreenShell>
  );
}

function FoodBottomNav({ go, active }: { go: (screen: Screen) => void; active: 'home'|'food'|'orders'|'cart'|'account' }) {
  const items: Array<{ key: typeof active; label: string; icon: keyof typeof Ionicons.glyphMap; screen: Screen }> = [
    { key: 'home', label: 'Home', icon: 'home-outline', screen: 'home' },
    { key: 'food', label: 'Food', icon: 'search-outline', screen: 'food' },
    { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'orders' },
    { key: 'cart', label: 'Cart', icon: 'cart-outline', screen: 'cart' },
    { key: 'account', label: 'Account', icon: 'person-outline', screen: 'account' },
  ];
  return <View style={styles.bottomNav}>{items.map((item) => <Pressable key={item.key} onPress={() => go(item.screen)} style={styles.bottomNavItem}><Ionicons name={item.key === active ? String(item.icon).replace('-outline','') as keyof typeof Ionicons.glyphMap : item.icon} size={24} color={item.key===active?COLORS.red:COLORS.muted}/><Text style={[styles.bottomNavLabel,item.key===active&&styles.bottomNavLabelActive]}>{item.label}</Text></Pressable>)}</View>;
}

export function RestaurantScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header onBack={() => actions.go('food')} right={<Pressable><Ionicons name="heart-outline" size={27} /></Pressable>} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.restaurantDetailScroll} showsVerticalScrollIndicator={false}>
        <Image source={assets.food.cafeJavas} style={styles.restaurantHero} />
        <Text style={styles.restaurantDetailName}>Café Javas</Text>
        <Text style={styles.restaurantDetailMeta}><Text style={styles.star}>★</Text> 4.4 (1.2k)  ·  Café  ·  $$</Text>
        <Text style={styles.restaurantDetailSub}>20–30 min  ·  UGX 2,000 delivery</Text>
        <View style={styles.badgeRow}>{['Nearby','Great reviews','Fast delivery'].map((badge)=><View key={badge} style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>)}</View>
        <SectionTitle title="Recommended" />
        {[['Javas Breakfast','UGX 16,000',assets.food.cafeJavas],['Chicken Sandwich','UGX 18,000',assets.food.chickenTonight],['Iced Vanilla Latte','UGX 9,000',assets.food.tamaraThai]].map(([name,price,image])=><View key={name as string} style={styles.menuItem}><Image source={image as ImageSourcePropType} style={styles.menuImage}/><View style={styles.flex}><Text style={styles.menuName}>{name as string}</Text><Text style={styles.menuPrice}>{price as string}</Text></View><Pressable style={styles.addButton}><Feather name="plus" size={20} color={COLORS.red}/></Pressable></View>)}
      </ScrollView>
      <Pressable onPress={()=>actions.go('cart')} style={styles.viewCartBar}><View><Text style={styles.viewCartTitle}>View cart</Text><Text style={styles.viewCartMeta}>2 items  ·  UGX 34,000</Text></View><Ionicons name="cart" size={28} color={COLORS.white}/></Pressable>
    </ScreenShell>
  );
}

export function CartScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Your cart" onBack={() => actions.go('restaurant')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.cartScroll}>
        <Text style={styles.cartRestaurant}>Café Javas</Text>
        {[['Javas Breakfast','UGX 16,000',assets.food.cafeJavas],['Chicken Sandwich','UGX 18,000',assets.food.chickenTonight]].map(([name,price,image])=><View key={name as string} style={styles.cartItem}><Image source={image as ImageSourcePropType} style={styles.cartImage}/><View style={styles.flex}><Text style={styles.menuName}>{name as string}</Text><Text style={styles.menuPrice}>{price as string}</Text></View><View style={styles.quantity}><Feather name="minus" size={17}/><Text style={styles.quantityText}>1</Text><Feather name="plus" size={17}/></View></View>)}
        <AppField placeholder="Add a note (optional)" value="" onChangeText={()=>{}} />
        <View style={styles.cartTotals}><View style={styles.priceRow}><Text style={styles.priceLabel}>Items total</Text><Text style={styles.priceValue}>UGX 34,000</Text></View><View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery fee</Text><Text style={styles.priceValue}>UGX 2,000</Text></View><View style={styles.priceRow}><Text style={styles.priceLabel}>Platform fee</Text><Text style={styles.priceValue}>UGX 1,000</Text></View><View style={[styles.priceRow,styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>UGX 37,000</Text></View></View>
        <RoundedCard style={styles.paymentSummary}><PaymentLogo source={assets.payment.mtn}/><View style={styles.flex}><Text style={styles.paymentTitle}>MTN Mobile Money</Text><Text style={styles.paymentSubtitle}>0772 123456</Text></View><TextButton label="Change" onPress={()=>actions.go('wallet')}/></RoundedCard>
        <PrimaryButton label="Place order · UGX 37,000" onPress={()=>actions.go('orderTracking')} />
      </ScrollView>
    </ScreenShell>
  );
}

export function OrderTrackingScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Order in progress" onBack={() => actions.go('home')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.orderTrackingScroll}>
        <Text style={styles.orderId}>Order #ORD-984512</Text><Text style={styles.orderEta}>Arriving in 22 min</Text><Text style={styles.orderRestaurant}>Café Javas</Text>
        <Image source={assets.maps.driver} style={styles.orderMap}/>
        <DriverProfile actions={actions}/>
        <RoundedCard style={styles.referralCard}><Ionicons name="gift-outline" size={26} color={COLORS.black}/><View style={styles.flex}><Text style={styles.referralTitle}>Invite friends, get UGX 5,000</Text><Text style={styles.referralBody}>Share Kareebu+ and earn rewards.</Text></View><Feather name="chevron-right" size={24}/></RoundedCard>
      </ScrollView>
    </ScreenShell>
  );
}

export function ShopsScreen({ actions }: { actions: AppActions }) {
  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={styles.commerceScroll} showsVerticalScrollIndicator={false}>
        <CommerceHeader title="Shops" cart go={actions.go} />
        <Text style={styles.deliverLabel}>Deliver to</Text><Pressable style={styles.deliverRow}><Ionicons name="location" size={21} color={COLORS.green}/><Text style={styles.deliverAddress}>Kyadondo Rd, Kampala</Text><Feather name="chevron-down" size={20}/></Pressable>
        <Pressable style={styles.searchBar}><Feather name="search" size={23}/><Text style={styles.searchPlaceholder}>Search products or stores</Text></Pressable>
        <View style={styles.categoryPanel}><CategoryPill icon={<Ionicons name="grid-outline" size={25}/>} label="All"/><CategoryPill icon={<Ionicons name="phone-portrait-outline" size={25}/>} label="Phones"/><CategoryPill icon={<Ionicons name="shirt-outline" size={25}/>} label="Fashion"/><CategoryPill icon={<Ionicons name="color-palette-outline" size={25}/>} label="Beauty"/><CategoryPill icon={<Ionicons name="home-outline" size={25}/>} label="Home"/><CategoryPill icon={<Ionicons name="ellipsis-horizontal" size={25}/>} label="More"/></View>
        <Image source={assets.shops.promo} style={styles.commercePromo}/>
        <SectionTitle title="Popular stores" action="See all" onAction={()=>{}} />
        <View style={styles.storeRow}>{[
          ['Jumia',assets.shops.jumia,'4.5'],['Carrefour',assets.shops.carrefour,'4.6'],['Game',assets.shops.game,'4.3'],['Pharmacy',assets.shops.pharmacy,'4.6']
        ].map(([name,image,rating])=><Pressable key={name as string} style={styles.storeCard}><Image source={image as ImageSourcePropType} style={styles.storeLogo} resizeMode="contain"/><Text style={styles.storeName}>{name as string}</Text><Text style={styles.storeRating}>{rating as string} <Text style={styles.star}>★</Text></Text></Pressable>)}</View>
      </ScrollView>
      <FoodBottomNav go={actions.go} active="home" />
    </ScreenShell>
  );
}

function ParcelCard({ icon, label, value, detail, chevron, color }: { icon: React.ReactNode; label: string; value: string; detail?: string; chevron?: boolean; color?: string }) {
  return <RoundedCard style={styles.parcelCard}><View style={styles.parcelIcon}>{icon}</View><View style={styles.flex}><Text style={styles.parcelLabel}>{label}</Text><Text style={[styles.parcelValue,color?{color}:undefined]}>{value}</Text>{detail?<Text style={styles.parcelDetail}>{detail}</Text>:null}</View>{chevron?<Feather name="chevron-right" size={25}/>:null}</RoundedCard>;
}

export function ParcelScreen({ actions }: { actions: AppActions }) {
  const [mode,setMode]=useState<'city'|'uganda'>('city');
  return (
    <ScreenShell>
      <Header title="Send parcel" onBack={()=>actions.go('home')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.parcelScroll}>
        <View style={styles.segmented}><Pressable onPress={()=>setMode('city')} style={[styles.segment,mode==='city'&&styles.segmentActive]}><Text style={[styles.segmentText,mode==='city'&&styles.segmentTextActive]}>Within the city</Text></Pressable><Pressable onPress={()=>setMode('uganda')} style={[styles.segment,mode==='uganda'&&styles.segmentActive]}><Text style={[styles.segmentText,mode==='uganda'&&styles.segmentTextActive]}>Across Uganda</Text></Pressable></View>
        <ParcelCard icon={<LocationDot/>} label="Pickup location" value="Kyadondo Rd, Kampala"/>
        <ParcelCard icon={<LocationDot color={COLORS.red}/>} label="Drop-off location" value={mode==='city'?'Acacia Mall, Kisementi':'Entebbe, Uganda'}/>
        <ParcelCard icon={<Feather name="box" size={29}/>} label="Parcel type" value="Documents" detail="Up to 1kg" chevron/>
        <ParcelCard icon={<PaymentLogo source={assets.payment.mtn}/>} label="Payment method" value="MTN Mobile Money" detail="0772 123456" chevron/>
        <PrimaryButton label="Continue" onPress={()=>actions.go('orders')}/><Text style={styles.parcelEstimate}>Prices shown are estimates</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function WalletAction({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return <Pressable style={styles.walletAction}><MaterialCommunityIcons name={icon} size={29} color={COLORS.black}/><Text style={styles.walletActionLabel}>{label}</Text></Pressable>;
}

function WalletPayment({ id, data, actions }: { id:'mtn'|'airtel'|'visa'; data:AppData; actions:AppActions }) {
  const selected=data.selectedPayment===id;
  const cfg={mtn:[assets.payment.mtn,'MTN Mobile Money','0772 123456'],airtel:[assets.payment.airtel,'Airtel Money','0701 123456'],visa:[assets.payment.visa,'Visa •••• 4242','']}[id];
  return <Pressable onPress={()=>actions.setSelectedPayment(id)} style={styles.walletPayment}><PaymentLogo source={cfg[0] as ImageSourcePropType}/><View style={styles.flex}><Text style={styles.walletPaymentTitle}>{cfg[1] as string}</Text>{cfg[2]?<Text style={styles.walletPaymentSub}>{cfg[2] as string}</Text>:null}</View><View style={[styles.walletRadio,selected&&styles.walletRadioSelected]}>{selected?<Feather name="check" size={15}/>:null}</View></Pressable>;
}

export function WalletScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Wallet" onBack={()=>actions.go('home')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.walletScroll}>
        <View style={styles.walletCard}><Text style={styles.walletCardLabel}>Kareebu+ Wallet</Text><Text style={styles.walletBalance}>UGX 52,000</Text><Text style={styles.walletCardSub}>Wallet balance</Text><Pressable style={styles.topUpButton}><Text style={styles.topUpText}>Top up</Text></Pressable><Image source={assets.mark} style={styles.walletCardMark}/></View>
        <View style={styles.walletActions}><WalletAction icon="send-circle-outline" label="Send money"/><WalletAction icon="receipt-text-outline" label="Pay bills"/><WalletAction icon="account-plus-outline" label="Add money"/><WalletAction icon="history" label="History"/></View>
        <Text style={styles.walletSectionTitle}>Payment methods</Text>
        <RoundedCard style={styles.walletPayments}><WalletPayment id="mtn" data={data} actions={actions}/><WalletPayment id="airtel" data={data} actions={actions}/><WalletPayment id="visa" data={data} actions={actions}/></RoundedCard>
        <View style={styles.walletSectionHeader}><Text style={styles.walletSectionTitle}>Kareebu Business</Text><TextButton label="Switch" onPress={()=>{}}/></View>
        <RoundedCard style={styles.businessCard}><View style={styles.businessIcon}><Ionicons name="briefcase" size={22} color={COLORS.white}/></View><Text style={styles.businessText}>Kareebu Business Account</Text><Feather name="chevron-right" size={24} color={COLORS.muted}/></RoundedCard>
      </ScrollView>
      <BottomNav active="wallet" go={actions.go}/>
    </ScreenShell>
  );
}

export function AccountScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  if(data.guest){
    return <ScreenShell><Header title="Account" right={<Ionicons name="settings-outline" size={27}/>}/><View style={styles.guestAccount}><View style={styles.guestAvatar}><Ionicons name="person-outline" size={65} color={COLORS.muted}/></View><Text style={styles.guestAccountTitle}>You’re browsing as a guest</Text><Text style={styles.guestAccountText}>Sign in to save trips, addresses, payment methods, receipts and Kareebu+ rewards.</Text><PrimaryButton label="Sign in or create account" onPress={()=>{actions.setGuest(false);actions.go('location');}}/></View><BottomNav active="account" go={actions.go}/></ScreenShell>;
  }
  return (
    <ScreenShell>
      <Header title="Account" right={<Ionicons name="settings-outline" size={28} color={COLORS.black}/>} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.accountScroll}>
        <View style={styles.accountProfile}><Image source={assets.avatars.account} style={styles.accountAvatar}/><View style={styles.flex}><Text style={styles.accountName}>{data.fullName || 'John Ssekandi'}</Text><Text style={styles.accountPhone}>+256 {data.phone || '772 123456'}</Text><Text style={styles.viewProfile}>View profile</Text></View></View>
        <Pressable style={styles.blackMembership}><Image source={assets.mark} style={styles.membershipMark}/><Text style={styles.membershipText}>Kareebu Black</Text><Text style={styles.membershipStatus}>Member</Text><Feather name="chevron-right" size={25} color={COLORS.white}/></Pressable>
        <RoundedCard style={styles.accountMenu}><MenuRow icon="car-outline" label="Your trips" onPress={()=>actions.go('activity')}/><MenuRow icon="location-outline" label="Addresses"/><MenuRow icon="card-outline" label="Payment methods" onPress={()=>actions.go('wallet')}/><MenuRow icon="pricetag-outline" label="Promotions"/><MenuRow icon="help-circle-outline" label="Help & support"/><MenuRow icon="settings-outline" label="Settings"/></RoundedCard>
      </ScrollView>
      <BottomNav active="account" go={actions.go}/>
    </ScreenShell>
  );
}

export function ActivityScreen({ actions }: { actions: AppActions }) {
  return <ScreenShell><Header title="Activity"/><ScrollView style={styles.flex} contentContainerStyle={styles.genericScroll}><RecentActivity go={actions.go}/><SectionTitle title="Earlier"/><RoundedCard><MenuRow icon="cube-outline" label="Parcel to Entebbe" detail="UGX 12,000"/><MenuRow icon="bag-handle-outline" label="Carrefour order" detail="UGX 48,500"/></RoundedCard></ScrollView><BottomNav active="activity" go={actions.go}/></ScreenShell>;
}

export function OrdersScreen({ actions }: { actions: AppActions }) {
  return <ScreenShell><Header title="Orders"/><ScrollView style={styles.flex} contentContainerStyle={styles.genericScroll}><RoundedCard style={styles.orderCard}><Image source={assets.food.cafeJavas} style={styles.orderImage}/><View style={styles.flex}><Text style={styles.orderTitle}>Café Javas</Text><Text style={styles.orderMeta}>2 items · Preparing</Text><Text style={styles.orderPrice}>UGX 37,000</Text></View><Pressable onPress={()=>actions.go('orderTracking')}><Feather name="chevron-right" size={26}/></Pressable></RoundedCard><RoundedCard style={styles.orderCard}><Image source={assets.service.send} style={styles.orderImage}/><View style={styles.flex}><Text style={styles.orderTitle}>Parcel to Entebbe</Text><Text style={styles.orderMeta}>Documents · In transit</Text><Text style={styles.orderPrice}>UGX 12,000</Text></View><Feather name="chevron-right" size={26}/></RoundedCard></ScrollView><BottomNav active="orders" go={actions.go}/></ScreenShell>;
}

export function renderScreen(screen: Screen, data: AppData, actions: AppActions) {
  switch (screen) {
    case 'splash': return <SplashScreen go={actions.go}/>;
    case 'welcome': return <WelcomeScreen go={actions.go} setGuest={actions.setGuest}/>;
    case 'location': return <LocationScreen data={data} actions={actions}/>;
    case 'phone': return <PhoneScreen data={data} actions={actions}/>;
    case 'otp': return <OtpScreen data={data} actions={actions}/>;
    case 'profile': return <ProfileScreen data={data} actions={actions}/>;
    case 'permissions': return <PermissionsScreen data={data} actions={actions}/>;
    case 'home': return <HomeScreen data={data} actions={actions}/>;
    case 'whereTo': return <WhereToScreen actions={actions}/>;
    case 'chooseRide': return <ChooseRideScreen data={data} actions={actions}/>;
    case 'confirmBooking': return <ConfirmBookingScreen data={data} actions={actions}/>;
    case 'driver': return <DriverScreen actions={actions}/>;
    case 'onTrip': return <OnTripScreen actions={actions}/>;
    case 'tripComplete': return <TripCompleteScreen data={data} actions={actions}/>;
    case 'rateTrip': return <RateTripScreen data={data} actions={actions}/>;
    case 'food': return <FoodScreen actions={actions}/>;
    case 'restaurant': return <RestaurantScreen actions={actions}/>;
    case 'cart': return <CartScreen actions={actions}/>;
    case 'orderTracking': return <OrderTrackingScreen actions={actions}/>;
    case 'shops': return <ShopsScreen actions={actions}/>;
    case 'parcel': return <ParcelScreen actions={actions}/>;
    case 'wallet': return <WalletScreen data={data} actions={actions}/>;
    case 'account': return <AccountScreen data={data} actions={actions}/>;
    case 'activity': return <ActivityScreen actions={actions}/>;
    case 'orders': return <OrdersScreen actions={actions}/>;
  }
}

const styles = StyleSheet.create({
  flex:{flex:1}, pressed:{opacity:.62}, rowDivider:{borderBottomWidth:1,borderBottomColor:COLORS.line}, star:{color:'#F8A900'},
  onboardingBody:{flex:1}, onboardingFooter:{paddingHorizontal:24,paddingBottom:18,paddingTop:10,backgroundColor:COLORS.white}, onboardingPadding:{paddingHorizontal:24},
  onboardingTitle:{fontFamily:FONT.bold,fontSize:38,lineHeight:46,fontWeight:'900',letterSpacing:-1,color:COLORS.black,marginTop:8}, onboardingSubtitle:{fontFamily:FONT.regular,fontSize:18,lineHeight:27,color:COLORS.muted,marginTop:14},
  splash:{flex:1,backgroundColor:'#050506',alignItems:'center',justifyContent:'center',overflow:'hidden'}, splashWordmark:{width:'84%',height:245,marginTop:-120}, splashTagline:{alignItems:'center',marginTop:34,zIndex:2}, splashTaglineWhite:{fontFamily:FONT.bold,fontSize:22,fontWeight:'800',color:COLORS.white}, splashTaglineYellow:{fontFamily:FONT.bold,fontSize:22,fontWeight:'800',color:COLORS.yellow,marginTop:4}, splashRibbons:{position:'absolute',left:-100,right:-100,bottom:-75,width:'140%',height:500}, splashHint:{position:'absolute',bottom:27,color:'rgba(255,255,255,.55)',fontFamily:FONT.regular,fontSize:12},
  welcomeScreen:{flex:1,paddingHorizontal:22,paddingTop:8,paddingBottom:10}, welcomeTop:{flexShrink:0,marginTop:2}, welcomeKicker:{fontFamily:FONT.bold,fontSize:20,fontWeight:'800',color:COLORS.black}, welcomeTitle:{fontFamily:FONT.bold,fontSize:48,lineHeight:53,fontWeight:'900',letterSpacing:-1.25,color:COLORS.black,marginTop:0}, welcomeRed:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',color:COLORS.red,marginTop:9}, welcomeLine:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',color:COLORS.black,marginTop:1}, welcomeHeroFrame:{flex:1,minHeight:190,alignItems:'center',justifyContent:'center',overflow:'hidden',marginTop:2}, welcomeHero:{width:'100%',height:'100%'}, welcomeServices:{height:84,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:COLORS.line,borderRadius:19,paddingHorizontal:7,backgroundColor:COLORS.white,...SHADOW}, welcomeServiceItem:{alignItems:'center',justifyContent:'center',width:'24%',gap:3}, welcomeServiceIcon:{width:42,height:42}, welcomeServiceLabel:{fontFamily:FONT.medium,fontSize:13,fontWeight:'700',color:COLORS.black}, welcomeActions:{paddingTop:13,alignItems:'stretch',gap:1}, guestNote:{fontFamily:FONT.regular,fontSize:12,lineHeight:18,color:COLORS.muted,textAlign:'center',paddingHorizontal:24},
  countryCard:{height:78,flexDirection:'row',alignItems:'center',paddingHorizontal:18,gap:13,marginTop:28},flagImage:{width:44,height:44,borderRadius:22},countryName:{flex:1,fontFamily:FONT.bold,fontSize:21,fontWeight:'800'},groupLabel:{fontFamily:FONT.bold,fontSize:18,fontWeight:'800',marginTop:28,marginBottom:13},cityCard:{paddingHorizontal:15},cityRow:{height:68,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10,borderRadius:16},cityRowSelected:{borderWidth:1.5,borderColor:COLORS.red,backgroundColor:'#FFF7F7',marginVertical:5},cityName:{fontFamily:FONT.medium,fontSize:18,fontWeight:'700'},radio:{width:24,height:24,borderRadius:12,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},radioSelected:{backgroundColor:COLORS.red,borderColor:COLORS.red},
  phoneContent:{flex:1},phoneFields:{marginTop:70,gap:18},countryCodeCard:{height:64,flexDirection:'row',alignItems:'center',paddingHorizontal:18,gap:14},flagImageSmall:{width:40,height:40,borderRadius:20},countryCode:{flex:1,fontFamily:FONT.bold,fontSize:24,fontWeight:'800'},bottomTrust:{marginTop:'auto',paddingBottom:20},phoneSummary:{fontFamily:FONT.bold,fontSize:20,fontWeight:'800',marginTop:5},otpContent:{flex:1},otpRow:{flexDirection:'row',justifyContent:'space-between',marginTop:105},otpBox:{width:48,height:60,borderWidth:1.2,borderColor:COLORS.line,borderRadius:13,fontFamily:FONT.bold,fontSize:25,fontWeight:'800',color:COLORS.black,backgroundColor:COLORS.white},resendRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,marginTop:70},resendText:{fontFamily:FONT.medium,fontSize:16,color:COLORS.muted},resendTime:{color:COLORS.red,fontWeight:'800'},avatarPlaceholder:{alignSelf:'center',width:188,height:188,borderRadius:94,backgroundColor:'#F0F1F3',alignItems:'center',justifyContent:'center',marginTop:58},avatarCamera:{position:'absolute',right:8,bottom:14,width:46,height:46,borderRadius:23,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',borderWidth:4,borderColor:COLORS.white},profileFields:{gap:22,marginTop:55,paddingBottom:20},formHelp:{fontFamily:FONT.regular,fontSize:15,lineHeight:22,color:COLORS.muted},
  permissionsScroll:{paddingBottom:26},permissionsPadding:{paddingHorizontal:24,paddingTop:32,gap:18},permissionsTitle:{fontFamily:FONT.bold,fontSize:34,fontWeight:'900'},permissionsSubtitle:{fontFamily:FONT.regular,fontSize:20,lineHeight:28,color:COLORS.muted,marginBottom:10},permissionStack:{gap:0},permissionCard:{minHeight:132,borderWidth:1,borderColor:COLORS.line,borderRadius:22,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:17,padding:20,...SHADOW},permissionTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'800'},permissionBody:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.muted,marginTop:5},permissionCheck:{width:32,height:32,borderRadius:16,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},permissionCheckEnabled:{backgroundColor:COLORS.red,borderColor:COLORS.red},previewTitle:{fontFamily:FONT.bold,fontSize:24,fontWeight:'900',marginTop:10},previewSubtitle:{fontFamily:FONT.regular,fontSize:15,color:COLORS.muted,marginTop:-12},homePreview:{padding:15,gap:11},previewHeader:{flexDirection:'row',alignItems:'center',gap:7},previewLocation:{flex:1,fontFamily:FONT.bold,fontSize:13,fontWeight:'800'},previewBalance:{flexDirection:'row',alignItems:'center',gap:5,borderWidth:1,borderColor:COLORS.line,borderRadius:12,padding:7},miniMark:{width:20,height:20},previewBalanceText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800'},previewSearch:{height:42,borderWidth:1,borderColor:COLORS.line,borderRadius:13,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:12},previewSearchText:{fontFamily:FONT.regular,color:COLORS.muted,fontSize:12},previewServices:{flexDirection:'row',gap:7},previewService:{flex:1,alignItems:'center',gap:4,borderWidth:1,borderColor:COLORS.line,borderRadius:12,paddingVertical:7},previewServiceIcon:{width:30,height:30},previewServiceText:{fontFamily:FONT.medium,fontSize:10,fontWeight:'700'},
  homeHeader:{height:74,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},homeLocation:{flexDirection:'row',alignItems:'center',gap:6,flexShrink:1},homeLocationText:{fontFamily:FONT.bold,fontSize:19,fontWeight:'900',letterSpacing:-.25,flexShrink:1},balancePill:{height:50,borderWidth:1,borderColor:COLORS.line,borderRadius:15,flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:12},balanceMark:{width:27,height:27},balanceText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},homeScroll:{paddingHorizontal:20,paddingBottom:34,gap:26},searchBar:{height:62,borderWidth:1,borderColor:COLORS.line,borderRadius:19,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:17},searchPlaceholder:{fontFamily:FONT.regular,fontSize:19,color:COLORS.mutedLight},serviceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:12},kareebuPromo:{height:160,borderRadius:20,overflow:'hidden',backgroundColor:'#0D0D0E',position:'relative',...SHADOW},kareebuPromoVisual:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},kareebuPromoCopy:{position:'absolute',left:18,top:14,bottom:13,width:'54%',justifyContent:'space-between'},kareebuPromoBrand:{fontFamily:FONT.bold,fontSize:24,lineHeight:27,fontWeight:'900',color:COLORS.white},kareebuPromoTier:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900',letterSpacing:5,color:COLORS.yellow,marginTop:-2},kareebuPromoBody:{fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.white,marginTop:4},kareebuPromoButton:{height:32,alignSelf:'flex-start',borderRadius:9,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',paddingHorizontal:12},kareebuPromoButtonText:{fontFamily:FONT.bold,fontSize:11.5,fontWeight:'900',color:COLORS.black},kareebuPromoMiniCard:{position:'absolute',right:13,bottom:13,width:78,height:45,borderRadius:9,borderWidth:1,borderColor:'#765D16',backgroundColor:'#141414',alignItems:'center',justifyContent:'center'},kareebuPromoCardBrand:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.white},kareebuPromoCardTier:{fontFamily:FONT.bold,fontSize:7,fontWeight:'900',letterSpacing:2.2,color:COLORS.yellow,marginTop:2},activityCard:{shadowOpacity:0},activityRow:{minHeight:76,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:15},activityIcon:{width:44,height:44},activityImage:{width:45,height:45,borderRadius:22},activityTitle:{fontFamily:FONT.bold,fontSize:15.5,fontWeight:'800',paddingRight:5},activityMeta:{fontFamily:FONT.regular,fontSize:12.5,color:COLORS.muted,marginTop:3},activityAmount:{fontFamily:FONT.bold,fontSize:15,fontWeight:'800'},horizontalList:{gap:14,paddingRight:10},homeFoodCard:{width:158},homeFoodImage:{width:158,height:118,borderRadius:18},homeFoodTitle:{fontFamily:FONT.bold,fontSize:15,fontWeight:'800',marginTop:9},homeFoodMeta:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,marginTop:4},homeShopRow:{flexDirection:'row',justifyContent:'space-between'},homeShopCard:{width:'31%',alignItems:'center',borderWidth:1,borderColor:COLORS.line,borderRadius:18,padding:12,gap:7},homeShopLogo:{width:70,height:70,borderRadius:15},homeShopLabel:{fontFamily:FONT.medium,fontSize:13,fontWeight:'700'},
  whereScroll:{paddingHorizontal:0,paddingBottom:20},routeCard:{marginHorizontal:20,zIndex:2,shadowOpacity:.08},routeLineRow:{minHeight:88,flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:18},routeDivider:{height:1,backgroundColor:COLORS.line,marginLeft:50,marginRight:18},routeLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},routeValue:{fontFamily:FONT.bold,fontSize:19,fontWeight:'800',marginTop:4},smallOutlineButton:{borderWidth:1,borderColor:COLORS.line,borderRadius:13,paddingHorizontal:13,paddingVertical:10},smallOutlineText:{fontFamily:FONT.medium,fontWeight:'700'},plusButton:{width:48,height:48,borderWidth:1,borderColor:COLORS.line,borderRadius:14,alignItems:'center',justifyContent:'center'},whereMap:{width:'100%',aspectRatio:1.35,marginTop:-2},suggestedCard:{marginHorizontal:12,marginTop:-20,paddingHorizontal:16,paddingTop:18},suggestedTitle:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',marginBottom:4},placeRow:{minHeight:79,flexDirection:'row',alignItems:'center',gap:16,borderBottomWidth:1,borderBottomColor:COLORS.line},placeTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'800'},placeSubtitle:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:3},
  rideScroll:{paddingHorizontal:20,paddingBottom:28,gap:14},rideList:{gap:10},rideOption:{minHeight:94,borderWidth:1,borderColor:COLORS.line,borderRadius:20,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:15},rideOptionSelected:{borderColor:COLORS.red,borderWidth:2},rideIcon:{width:65,height:65},rideName:{fontFamily:FONT.bold,fontSize:19,fontWeight:'800'},rideEta:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:3},rideFare:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},rideRadio:{width:26,height:26,borderRadius:13,borderWidth:2,borderColor:COLORS.mutedLight,alignItems:'center',justifyContent:'center'},rideRadioSelected:{backgroundColor:COLORS.red,borderColor:COLORS.red},scheduleCard:{shadowOpacity:0},scheduleRow:{height:73,flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:16},scheduleTitle:{fontFamily:FONT.bold,fontSize:17,fontWeight:'800'},scheduleSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},paymentSummary:{minHeight:70,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:15,shadowOpacity:0},paymentTitle:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},paymentSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:2},estimatedLabel:{fontFamily:FONT.regular,fontSize:15,color:COLORS.muted,textAlign:'center',marginTop:2},estimatedFare:{fontFamily:FONT.bold,fontSize:25,fontWeight:'900',textAlign:'center'},
  confirmScroll:{paddingHorizontal:20,paddingBottom:28,gap:18},confirmRouteCard:{padding:18,shadowOpacity:0},confirmRouteRow:{flexDirection:'row',alignItems:'center',gap:12,minHeight:42},confirmRouteText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},confirmRouteConnector:{width:2,height:20,backgroundColor:COLORS.lineDark,marginLeft:8},confirmRouteMeta:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:10,marginLeft:30},paymentChoices:{paddingHorizontal:14,shadowOpacity:0},paymentChoice:{minHeight:70,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},paymentChoiceSelected:{},priceTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',marginTop:3},priceRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:30},priceLabel:{fontFamily:FONT.regular,fontSize:15,color:COLORS.muted},priceValue:{fontFamily:FONT.medium,fontSize:15,color:COLORS.black},totalRow:{borderTopWidth:1,borderTopColor:COLORS.line,marginTop:5,paddingTop:9},totalLabel:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},totalValue:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900'},cancelPolicy:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,textAlign:'center'},
  etaText:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:COLORS.red,textAlign:'center',marginBottom:10},driverScroll:{paddingHorizontal:18,paddingBottom:25,gap:15},driverMap:{width:'100%',height:310,borderRadius:22},driverProfile:{minHeight:108,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:14,shadowOpacity:.04},driverAvatar:{width:70,height:70,borderRadius:35},driverName:{fontFamily:FONT.bold,fontSize:21,fontWeight:'900'},driverRating:{fontFamily:FONT.medium,fontSize:15,color:COLORS.muted,marginTop:2},driverMeta:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:3},circleAction:{width:49,height:49,borderRadius:25,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},driverActionGrid:{flexDirection:'row',justifyContent:'space-between'},driverAction:{width:'23%',height:72,borderWidth:1,borderColor:COLORS.line,borderRadius:17,alignItems:'center',justifyContent:'center',gap:6},driverActionLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.black},tripScroll:{paddingHorizontal:14,paddingBottom:24,gap:14},tripMap:{width:'100%',height:284,borderRadius:22},tripSummary:{padding:20,shadowOpacity:.05},tripLabel:{fontFamily:FONT.regular,fontSize:17,color:COLORS.muted},tripDestination:{fontFamily:FONT.bold,fontSize:28,fontWeight:'900',marginTop:5},tripRule:{height:1,backgroundColor:COLORS.line,marginVertical:18},tripStats:{flexDirection:'row',justifyContent:'space-between'},tripStatLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},tripStatValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',marginTop:7},tripButtons:{flexDirection:'row',gap:10,marginVertical:22},tripSecondary:{flex:1,height:54,borderWidth:1,borderColor:COLORS.line,borderRadius:16,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},tripSecondaryText:{fontFamily:FONT.medium,fontSize:14,fontWeight:'700'},
  completeScroll:{paddingHorizontal:22,paddingBottom:24,alignItems:'stretch',gap:17},completeBadge:{width:112,height:112,borderRadius:56,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:15},completeThankYou:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',textAlign:'center'},completeRouteCard:{padding:18,gap:12,shadowOpacity:0},completePlace:{flexDirection:'row',alignItems:'center',gap:12},completePlaceText:{fontFamily:FONT.medium,fontSize:16,fontWeight:'700'},completeMeta:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginLeft:29},receiptCard:{padding:18,gap:8,shadowOpacity:0},receiptTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',marginBottom:5},paidWith:{flexDirection:'row',alignItems:'center',gap:12,borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:14,marginTop:5},rateScroll:{paddingHorizontal:20,paddingBottom:25,gap:20},rateQuestion:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',textAlign:'center'},starsRow:{flexDirection:'row',justifyContent:'center',gap:5},rateWord:{fontFamily:FONT.medium,fontSize:15,color:COLORS.muted,textAlign:'center',marginTop:-12},tipCard:{padding:18,shadowOpacity:0},tipTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900'},tipSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},tipRow:{flexDirection:'row',gap:8,marginVertical:18},tipOption:{flex:1,minHeight:42,borderWidth:1,borderColor:COLORS.line,borderRadius:11,alignItems:'center',justifyContent:'center'},tipOptionSelected:{borderColor:COLORS.red,backgroundColor:'#FFF2F2'},tipOptionText:{fontFamily:FONT.medium,fontSize:12,fontWeight:'700'},tipOptionTextSelected:{color:COLORS.red},
  commerceScroll:{paddingHorizontal:20,paddingBottom:24,gap:22},commerceHeader:{minHeight:64,flexDirection:'row',alignItems:'center'},commerceTitle:{fontFamily:FONT.bold,fontSize:32,fontWeight:'900',flex:1},commerceLocation:{flexDirection:'row',alignItems:'center',gap:6},commerceLocationText:{fontFamily:FONT.medium,fontSize:17,fontWeight:'700'},cartButton:{width:42,alignItems:'flex-end'},categoryPanel:{minHeight:116,borderWidth:1,borderColor:COLORS.line,borderRadius:22,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:5},categoryItem:{alignItems:'center',gap:8},categoryCircle:{width:49,height:49,borderRadius:25,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},categoryLabel:{fontFamily:FONT.medium,fontSize:12,fontWeight:'700'},categoryEmoji:{fontSize:24},commercePromo:{width:'100%',height:157,borderRadius:22},restaurantRow:{flexDirection:'row',justifyContent:'space-between'},restaurantCard:{width:'31%'},restaurantImage:{width:'100%',aspectRatio:.76,borderRadius:17},restaurantName:{fontFamily:FONT.medium,fontSize:15,fontWeight:'700',marginTop:9},restaurantRating:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:5},restaurantMeta:{fontFamily:FONT.regular,fontSize:11,color:COLORS.muted,marginTop:4},bottomNav:{minHeight:78,paddingBottom:8,borderTopWidth:1,borderTopColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},bottomNavItem:{flex:1,alignItems:'center',justifyContent:'center',gap:4},bottomNavLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted},bottomNavLabelActive:{color:COLORS.red,fontFamily:FONT.bold,fontWeight:'800'},
  restaurantDetailScroll:{paddingHorizontal:20,paddingBottom:105},restaurantHero:{width:'100%',height:250,borderRadius:24},restaurantDetailName:{fontFamily:FONT.bold,fontSize:30,fontWeight:'900',marginTop:18},restaurantDetailMeta:{fontFamily:FONT.regular,fontSize:15,color:COLORS.muted,marginTop:7},restaurantDetailSub:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:5},badgeRow:{flexDirection:'row',gap:8,marginTop:13,marginBottom:25},badge:{borderWidth:1,borderColor:COLORS.line,borderRadius:16,paddingHorizontal:11,paddingVertical:7},badgeText:{fontFamily:FONT.medium,fontSize:12,fontWeight:'700'},menuItem:{minHeight:92,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},menuImage:{width:70,height:70,borderRadius:15},menuName:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},menuPrice:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:5},addButton:{width:38,height:38,borderWidth:1,borderColor:COLORS.line,borderRadius:19,alignItems:'center',justifyContent:'center'},viewCartBar:{position:'absolute',left:20,right:20,bottom:16,height:70,borderRadius:18,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18},viewCartTitle:{fontFamily:FONT.bold,fontSize:15,fontWeight:'900',color:COLORS.white},viewCartMeta:{fontFamily:FONT.regular,fontSize:13,color:'#D8D8D8',marginTop:3},cartScroll:{paddingHorizontal:20,paddingBottom:28,gap:18},cartRestaurant:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900'},cartItem:{minHeight:92,flexDirection:'row',alignItems:'center',gap:12},cartImage:{width:72,height:72,borderRadius:15},quantity:{height:38,borderWidth:1,borderColor:COLORS.line,borderRadius:13,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:9},quantityText:{fontFamily:FONT.bold,fontWeight:'800'},cartTotals:{gap:5},orderTrackingScroll:{paddingHorizontal:20,paddingBottom:24,gap:10},orderId:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},orderEta:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900',color:COLORS.red},orderRestaurant:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},orderMap:{width:'100%',height:310,borderRadius:22,marginVertical:10},referralCard:{minHeight:74,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16,backgroundColor:COLORS.yellowSoft,shadowOpacity:0},referralTitle:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900'},referralBody:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,marginTop:3},deliverLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:-15},deliverRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:-15},deliverAddress:{fontFamily:FONT.medium,fontSize:17,fontWeight:'700'},storeRow:{flexDirection:'row',justifyContent:'space-between'},storeCard:{width:'23%',alignItems:'center'},storeLogo:{width:'100%',aspectRatio:1,borderWidth:1,borderColor:COLORS.line,borderRadius:18},storeName:{fontFamily:FONT.medium,fontSize:13,fontWeight:'700',marginTop:9},storeRating:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,marginTop:5},
  parcelScroll:{paddingHorizontal:20,paddingBottom:28,gap:16},segmented:{height:60,borderWidth:1,borderColor:COLORS.line,borderRadius:19,flexDirection:'row',padding:4},segment:{flex:1,borderRadius:15,alignItems:'center',justifyContent:'center'},segmentActive:{backgroundColor:COLORS.white,...SHADOW},segmentText:{fontFamily:FONT.medium,fontSize:16,color:COLORS.muted},segmentTextActive:{color:COLORS.black,fontWeight:'800'},parcelCard:{minHeight:112,flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:17,shadowOpacity:0},parcelIcon:{width:48,alignItems:'center'},parcelLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},parcelValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'800',marginTop:6},parcelDetail:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:4},parcelEstimate:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,textAlign:'center'},
  walletScroll:{paddingHorizontal:20,paddingBottom:25,gap:24},walletCard:{height:210,borderRadius:22,backgroundColor:'#151515',padding:22,overflow:'hidden'},walletCardLabel:{fontFamily:FONT.regular,fontSize:17,color:COLORS.white},walletBalance:{fontFamily:FONT.bold,fontSize:39,fontWeight:'900',color:COLORS.white,marginTop:10},walletCardSub:{fontFamily:FONT.regular,fontSize:17,color:COLORS.white,marginTop:5},topUpButton:{width:110,height:48,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginTop:17},topUpText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},walletCardMark:{position:'absolute',right:18,bottom:16,width:50,height:50},walletActions:{flexDirection:'row',justifyContent:'space-between'},walletAction:{width:'24%',alignItems:'center',gap:8},walletActionLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,textAlign:'center'},walletSectionTitle:{fontFamily:FONT.bold,fontSize:21,fontWeight:'900'},walletSectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},walletPayments:{paddingHorizontal:15,shadowOpacity:0},walletPayment:{minHeight:74,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},walletPaymentTitle:{fontFamily:FONT.bold,fontSize:17,fontWeight:'800'},walletPaymentSub:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},walletRadio:{width:27,height:27,borderRadius:14,borderWidth:2,borderColor:COLORS.mutedLight,alignItems:'center',justifyContent:'center'},walletRadioSelected:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellow},businessCard:{minHeight:75,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16,shadowOpacity:0},businessIcon:{width:42,height:42,borderRadius:11,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center'},businessText:{flex:1,fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},
  accountScroll:{paddingHorizontal:20,paddingBottom:25,gap:24},accountProfile:{flexDirection:'row',alignItems:'center',gap:18},accountAvatar:{width:112,height:112,borderRadius:56},accountName:{fontFamily:FONT.bold,fontSize:26,fontWeight:'900'},accountPhone:{fontFamily:FONT.regular,fontSize:17,color:COLORS.muted,marginTop:5},viewProfile:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800',color:COLORS.red,marginTop:8},blackMembership:{height:78,borderRadius:18,backgroundColor:'#171717',flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16},membershipMark:{width:38,height:38},membershipText:{flex:1,fontFamily:FONT.bold,fontSize:18,fontWeight:'800',color:COLORS.white},membershipStatus:{fontFamily:FONT.regular,fontSize:14,color:COLORS.white},accountMenu:{shadowOpacity:.04},guestAccount:{flex:1,paddingHorizontal:28,alignItems:'center',justifyContent:'center',gap:18},guestAvatar:{width:135,height:135,borderRadius:68,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'center'},guestAccountTitle:{fontFamily:FONT.bold,fontSize:25,fontWeight:'900',textAlign:'center'},guestAccountText:{fontFamily:FONT.regular,fontSize:16,lineHeight:24,color:COLORS.muted,textAlign:'center',marginBottom:10},genericScroll:{padding:20,gap:20},orderCard:{minHeight:110,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:15,shadowOpacity:0},orderImage:{width:76,height:76,borderRadius:17},orderTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900'},orderMeta:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:5},orderPrice:{fontFamily:FONT.bold,fontSize:15,fontWeight:'800',marginTop:5},
});
