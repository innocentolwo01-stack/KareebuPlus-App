import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, MarkerAnimated, Polyline, Region } from 'react-native-maps';
import * as Location from 'expo-location';
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
import { VEHICLE_MODE_CONFIG, VehicleGpsPayload, VehicleMode, bearingBetween, rideBelongsToMode, vehicleModeForRide } from './ride/vehicle';
import { useAnimatedVehicle } from './ride/useAnimatedVehicle';
import { PlaceSelection, PlaceSuggestion, placeAttribution, resolvePlaceSuggestion, reverseGeocodePlace } from './places/provider';
import { usePlaceAutocomplete } from './places/usePlaceAutocomplete';
import { routingAttribution } from './routing/provider';
import { useRouteEstimate } from './routing/useRouteEstimate';
import { COLORS, FONT, SHADOW, TYPE } from './theme';
import { dialCodeFor, formatMoney, localeProfile, primaryMobileMoneyFor, secondaryMobileMoneyFor } from './locale';
import { DEMO_PROMOTIONS, DEMO_RESTAURANTS, DEMO_SHOPS, HOME_REAL_BRANDS, HOME_RETAIL_PROMOTIONS, DemoMenuItem, DemoRestaurant, DemoShop, HomeRealBrand, HomeRetailPromotion, demoDirections } from './demoData';
import { askKareebuAssistant, KareebuAssistantAction, KareebuAssistantRecommendation } from './ai/kareebuAssistant';

export type AppData = {
  guest: boolean;
  authReturn: Screen;
  locationReturn: Screen;
  country: string;
  city: string;
  phone: string;
  otp: string[];
  fullName: string;
  email: string;
  locationAllowed: boolean;
  notificationsAllowed: boolean;
  destinationPlace: PlaceSelection | null;
  deliveryPlace: PlaceSelection | null;
  focusedPlace: PlaceSelection | null;
  selectedVehicleMode: VehicleMode;
  selectedRide: RideId;
  selectedPayment: 'mtn' | 'airtel' | 'visa';
  walletBalance: number;
  scheduledTrip: string | null;
  rating: number;
  tip: number;
  selectedRestaurantId: string;
  selectedShopId: string;
  shopCategoryPreset: string;
  cartQuantities: Record<string, number>;
  favoriteRestaurantIds: string[];
  favoriteShopIds: string[];
};

export type AppActions = {
  go: (screen: Screen) => void;
  setGuest: (value: boolean) => void;
  setAuthReturn: (value: Screen) => void;
  setLocationReturn: (value: Screen) => void;
  setCountry: (value: string) => void;
  setCity: (value: string) => void;
  setPhone: (value: string) => void;
  setOtp: (value: string[]) => void;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setLocationAllowed: (value: boolean) => void;
  setNotificationsAllowed: (value: boolean) => void;
  setDestinationPlace: (value: PlaceSelection | null) => void;
  setDeliveryPlace: (value: PlaceSelection | null) => void;
  setFocusedPlace: (value: PlaceSelection | null) => void;
  setSelectedVehicleMode: (value: VehicleMode) => void;
  setSelectedRide: (value: RideId) => void;
  setSelectedPayment: (value: 'mtn' | 'airtel' | 'visa') => void;
  setWalletBalance: (value: number) => void;
  setScheduledTrip: (value: string | null) => void;
  setRating: (value: number) => void;
  setTip: (value: number) => void;
  selectRestaurant: (restaurantId: string) => void;
  selectShop: (shopId: string) => void;
  setShopCategoryPreset: (category: string) => void;
  setCartItemQuantity: (itemId: string, quantity: number) => void;
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  toggleFavoriteShop: (shopId: string) => void;
};

const countryCities: Record<string, string[]> = {
  Uganda: ['Kampala', 'Entebbe', 'Jinja', 'Wakiso', 'Mbarara', 'Gulu'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  Tanzania: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya'],
};

const countryData = [
  { name: 'Uganda', code: 'UG', dial: '+256', capital: 'Kampala', icon: 'sunny-outline' as const },
  { name: 'Kenya', code: 'KE', dial: '+254', capital: 'Nairobi', icon: 'business-outline' as const },
  { name: 'Tanzania', code: 'TZ', dial: '+255', capital: 'Dar es Salaam', icon: 'images-outline' as const },
];

// Bundled onboarding photography is required directly here instead of being
// read through the shared `assets` object. This makes the Country screen
// resilient when Metro has a stale copy of src/assets.ts after applying a
// patch: the photos are part of this module's dependency graph and cannot
// resolve to an undefined `countrySelection` namespace.
const COUNTRY_SELECTION_ASSETS = {
  map: require('../assets/kareebu-plus/country-landmarks/map.jpg'),
  Uganda: require('../assets/kareebu-plus/country-landmarks/uganda.jpg'),
  Kenya: require('../assets/kareebu-plus/country-landmarks/kenya.jpg'),
  Tanzania: require('../assets/kareebu-plus/country-landmarks/tanzania.jpg'),
} as const;

const COUNTRY_REGIONS: Record<string, Region> = {
  Uganda: { latitude: 1.25, longitude: 32.65, latitudeDelta: 6.2, longitudeDelta: 5.5 },
  Kenya: { latitude: 0.15, longitude: 37.80, latitudeDelta: 9.2, longitudeDelta: 8.0 },
  Tanzania: { latitude: -6.15, longitude: 35.25, latitudeDelta: 10.6, longitudeDelta: 9.2 },
};

const EAST_AFRICA_COUNTRY_REGION: Region = {
  latitude: -1.25,
  longitude: 35.25,
  latitudeDelta: 12.2,
  longitudeDelta: 10.8,
};

const REAL_COUNTRY_LANDMARKS: Record<string, { city: string; landmark: string; image: ImageSourcePropType }> = {
  Uganda: {
    city: 'Kampala',
    landmark: 'Kampala landmark',
    image: COUNTRY_SELECTION_ASSETS.Uganda,
  },
  Kenya: {
    city: 'Nairobi',
    landmark: 'Nairobi landmark',
    image: COUNTRY_SELECTION_ASSETS.Kenya,
  },
  Tanzania: {
    city: 'Dar es Salaam',
    landmark: 'Dar es Salaam landmark',
    image: COUNTRY_SELECTION_ASSETS.Tanzania,
  },
};

const COUNTRY_MAP_STYLE: any[] = [
  { elementType: 'geometry', stylers: [{ color: '#F5F7F9' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6E7480' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }, { weight: 2 }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#BEC5CE' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#D8DDE3' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#E9EDF1' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#CDE5FA' }] },
];
function countryCodeFor(country: string) {
  return countryData.find((item) => item.name === country)?.code ?? 'UG';
}

const rideData: Array<{ id: RideId; name: string; eta: string; baseFare: number; icon: ImageSourcePropType }> = [
  { id: 'boda', name: 'Boda', eta: '2 min away', baseFare: 2000, icon: assets.service.boda },
  { id: 'economy', name: 'Economy', eta: '4 min away', baseFare: 6500, icon: assets.service.rides },
  { id: 'comfort', name: 'Comfort', eta: '6 min away', baseFare: 11000, icon: assets.service.rides },
  { id: 'xl', name: 'XL', eta: '7 min away', baseFare: 16000, icon: assets.service.rides },
  { id: 'delivery', name: 'Delivery', eta: '10 min away', baseFare: 5000, icon: assets.service.send },
];

function selectVehicleMode(actions: AppActions, mode: VehicleMode) {
  actions.setSelectedVehicleMode(mode);
  actions.setSelectedRide(VEHICLE_MODE_CONFIG[mode].defaultRide);
}


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

const homeServiceData: Array<{ label: string; screen: Screen; image?: ImageSourcePropType; icon?: keyof typeof Ionicons.glyphMap }> = [
  { label: 'Food', screen: 'food', image: assets.service.food },
  { label: 'Rides', screen: 'whereTo', image: assets.service.rides },
  { label: 'Boda', screen: 'whereTo', image: assets.service.boda },
  { label: 'Groceries', screen: 'shops', image: assets.service.groceries },
  { label: 'Pharmacies', screen: 'shops', icon: 'medical-outline' },
  { label: 'Stores', screen: 'shops', image: assets.service.shops },
  { label: 'Send', screen: 'parcel', image: assets.service.send },
  { label: 'More', screen: 'home', icon: 'grid-outline' },
];

type StoreBrand = 'jumia' | 'carrefour' | 'game' | 'pharmacy';

const storeData: Array<{ id: StoreBrand; name: string; rating: string; meta: string; delivery: string }> = [
  { id: 'jumia', name: 'Jumia', rating: '4.5', meta: 'Marketplace', delivery: '25–35 min' },
  { id: 'carrefour', name: 'Capital Shoppers', rating: '4.6', meta: 'Groceries & home', delivery: '20–30 min' },
  { id: 'game', name: 'Quality Supermarket', rating: '4.4', meta: 'Groceries & household', delivery: '25–40 min' },
  { id: 'pharmacy', name: 'Goodlife Pharmacy', rating: '4.7', meta: 'Health & wellness', delivery: '15–25 min' },
];

function StoreBrandMark({ brand, compact = false }: { brand: StoreBrand; compact?: boolean }) {
  const config = {
    jumia: { label: 'J', background: COLORS.yellow, color: COLORS.black, icon: 'sparkles-outline' as const },
    carrefour: { label: 'C', background: COLORS.red, color: COLORS.white, icon: 'cart-outline' as const },
    game: { label: 'G', background: COLORS.black, color: COLORS.yellow, icon: 'pricetag-outline' as const },
    pharmacy: { label: '+', background: COLORS.yellowSoft, color: COLORS.red, icon: 'medical-outline' as const },
  }[brand];
  return (
    <View style={[styles.storeBrandMark, compact && styles.storeBrandMarkCompact, { backgroundColor: config.background }]}>
      <Ionicons name={config.icon} size={compact ? 18 : 23} color={config.color} />
      <Text style={[styles.storeBrandLetter, compact && styles.storeBrandLetterCompact, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}



function shopIconName(icon: DemoShop['icon']): keyof typeof Ionicons.glyphMap {
  if (icon === 'phone-portrait') return 'phone-portrait-outline';
  if (icon === 'home') return 'home-outline';
  if (icon === 'paw') return 'paw-outline';
  if (icon === 'sparkles') return 'sparkles-outline';
  if (icon === 'cart') return 'cart-outline';
  if (icon === 'medical') return 'medical-outline';
  return 'bag-handle-outline';
}

const KAMPALA_REGION: Region = {
  latitude: 0.3476,
  longitude: 32.5825,
  latitudeDelta: 0.24,
  longitudeDelta: 0.21,
};

const CITY_REGIONS: Record<string, Region> = {
  Kampala: KAMPALA_REGION,
  Entebbe: { latitude: 0.0512, longitude: 32.4637, latitudeDelta: 0.16, longitudeDelta: 0.14 },
  Jinja: { latitude: 0.4479, longitude: 33.2026, latitudeDelta: 0.16, longitudeDelta: 0.14 },
  Wakiso: { latitude: 0.4044, longitude: 32.4594, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Mbarara: { latitude: -0.6072, longitude: 30.6545, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Gulu: { latitude: 2.7746, longitude: 32.2990, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Nairobi: { latitude: -1.2864, longitude: 36.8172, latitudeDelta: 0.22, longitudeDelta: 0.19 },
  Mombasa: { latitude: -4.0435, longitude: 39.6682, latitudeDelta: 0.20, longitudeDelta: 0.18 },
  Kisumu: { latitude: -0.0917, longitude: 34.7680, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Nakuru: { latitude: -0.3031, longitude: 36.0800, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Eldoret: { latitude: 0.5143, longitude: 35.2698, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  'Dar es Salaam': { latitude: -6.7924, longitude: 39.2083, latitudeDelta: 0.22, longitudeDelta: 0.19 },
  Arusha: { latitude: -3.3869, longitude: 36.6830, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Mwanza: { latitude: -2.5164, longitude: 32.9175, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Dodoma: { latitude: -6.1630, longitude: 35.7516, latitudeDelta: 0.18, longitudeDelta: 0.16 },
  Mbeya: { latitude: -8.9094, longitude: 33.4608, latitudeDelta: 0.18, longitudeDelta: 0.16 },
};

const LOCAL_PLACE_COORDS: Record<string, { latitude: number; longitude: number; address: string }> = {
  'Acacia Mall': { latitude: 0.3476, longitude: 32.5825, address: 'Kisementi, Kampala' },
  Home: { latitude: 0.3429, longitude: 32.5871, address: 'Kisementi, Kampala' },
  Ntinda: { latitude: 0.3548, longitude: 32.6125, address: 'Ntinda, Kampala' },
  'Entebbe International Airport': { latitude: 0.0424, longitude: 32.4435, address: 'Entebbe, Wakiso' },
};

type LocalRideSuggestion = { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; latitude: number; longitude: number };

function localRideSuggestions(data: AppData): LocalRideSuggestion[] {
  const region = CITY_REGIONS[data.city] ?? KAMPALA_REGION;
  const names: Record<string, [string, string, string]> = {
    Kampala: ['Acacia Mall', 'Ntinda', 'Entebbe International Airport'],
    Nairobi: ['Westgate', 'Kilimani', 'Jomo Kenyatta International Airport'],
    Mombasa: ['Nyali', 'Bamburi', 'Moi International Airport'],
    Kisumu: ['Kisumu CBD', 'Milimani', 'Kisumu International Airport'],
    Nakuru: ['Nakuru CBD', 'Section 58', 'Lanet'],
    Eldoret: ['Eldoret CBD', 'Elgon View', 'Eldoret International Airport'],
    'Dar es Salaam': ['Mlimani City', 'Masaki', 'Julius Nyerere International Airport'],
    Arusha: ['Arusha CBD', 'Njiro', 'Kilimanjaro International Airport'],
    Mwanza: ['Mwanza CBD', 'Capri Point', 'Mwanza Airport'],
    Dodoma: ['Dodoma CBD', 'Kisasa', 'Dodoma Airport'],
    Mbeya: ['Mbeya CBD', 'Uyole', 'Mbeya Airport'],
  };
  const [first, second, airport] = names[data.city] ?? [`${data.city} centre`, `Popular area in ${data.city}`, `${data.city} airport`];
  const points: Array<[string, keyof typeof Ionicons.glyphMap, number, number]> = [
    [first, 'business-outline', 0.010, 0.008],
    ['Home', 'home-outline', -0.008, 0.006],
    [second, 'location-outline', 0.006, -0.011],
    [airport, 'airplane-outline', -0.026, 0.020],
  ];
  return points.map(([title, icon, latOffset, lngOffset]) => ({
    icon,
    title,
    subtitle: title === 'Home' ? `Saved address · ${data.city}` : `${data.city}, ${data.country}`,
    latitude: region.latitude + latOffset,
    longitude: region.longitude + lngOffset,
  }));
}

function pickupLabel(data: AppData) {
  return data.deliveryPlace?.name || `Current location · ${data.city}`;
}

function destinationLabel(data: AppData) {
  return data.destinationPlace?.name || `${data.city} destination`;
}

async function shareTrip(data: AppData) {
  try {
    await Share.share({
      title: 'Kareebu+ trip',
      message: `I’m travelling with Kareebu+ from ${pickupLabel(data)} to ${destinationLabel(data)} in ${data.city}. Vehicle: ${data.selectedVehicleMode === 'BODA' ? 'Boda' : 'Ride'}.`,
    });
  } catch {
    Alert.alert('Share unavailable', 'Your device could not open the share sheet right now.');
  }
}

async function shareReferral(data: AppData) {
  try {
    await Share.share({
      title: 'Try Kareebu+',
      message: `Try Kareebu+ for rides, food, shops and delivery in ${data.city}. Join me on Kareebu+.`,
    });
  } catch {
    Alert.alert('Share unavailable', 'Your device could not open the share sheet right now.');
  }
}

async function shareReceipt(data: AppData) {
  const ride = rideData.find((item) => item.id === data.selectedRide) ?? rideData[0];
  const fare = (ride?.baseFare ?? 0) + 500;
  try {
    await Share.share({
      title: 'Kareebu+ receipt',
      message: `Kareebu+ receipt\n${pickupLabel(data)} → ${destinationLabel(data)}\n${ride?.name ?? 'Trip'}\nTotal: ${formatMoney(data.country, fare)}`,
    });
  } catch {
    Alert.alert('Receipt unavailable', 'Your device could not open the share sheet right now.');
  }
}

function destinationCoordinate(data: AppData) {
  if (!data.destinationPlace) return null;
  return { latitude: data.destinationPlace.latitude, longitude: data.destinationPlace.longitude };
}

function pickupCoordinate(data: AppData) {
  if (data.deliveryPlace) return { latitude: data.deliveryPlace.latitude, longitude: data.deliveryPlace.longitude };
  const cityRegion = CITY_REGIONS[data.city] ?? KAMPALA_REGION;
  return { latitude: cityRegion.latitude, longitude: cityRegion.longitude };
}

function formatRouteDistance(distanceMeters?: number) {
  if (!distanceMeters || distanceMeters <= 0) return '—';
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
  return `${(distanceMeters / 1000).toFixed(distanceMeters < 10000 ? 1 : 0)} km`;
}

function formatRouteDuration(durationSeconds?: number) {
  if (!durationSeconds || durationSeconds <= 0) return '—';
  const minutes = Math.max(1, Math.round(durationSeconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

const ROUTE_POINTS = [
  { latitude: 0.3389, longitude: 32.5796 },
  { latitude: 0.3418, longitude: 32.5829 },
  { latitude: 0.3441, longitude: 32.5862 },
  { latitude: 0.3483, longitude: 32.5905 },
];

const NEARBY_VEHICLE_POINTS = [
  { latitude: 0.3404, longitude: 32.5778, heading: 74 },
  { latitude: 0.3454, longitude: 32.5838, heading: 132 },
  { latitude: 0.3503, longitude: 32.5884, heading: 218 },
];

function VehicleMarkerVisual({ vehicleMode, compact = false }: { vehicleMode: VehicleMode; compact?: boolean }) {
  return (
    <View style={[styles.vehicleMarkerShell, compact && styles.vehicleMarkerShellCompact, vehicleMode === 'BODA' ? styles.vehicleMarkerBoda : styles.vehicleMarkerRide]}>
      <MaterialCommunityIcons name={vehicleMode === 'BODA' ? 'motorbike' : 'car-side'} size={compact ? 21 : 26} color={vehicleMode === 'BODA' ? COLORS.black : COLORS.white} />
      <View style={[styles.vehicleMarkerNose, vehicleMode === 'BODA' ? styles.vehicleMarkerNoseBoda : styles.vehicleMarkerNoseRide]} />
    </View>
  );
}

function LiveVehicleMarker({ vehicleMode, payload }: { vehicleMode: VehicleMode; payload: VehicleGpsPayload }) {
  const tracker = useAnimatedVehicle(payload);

  useEffect(() => {
    tracker.applyGpsPayload(payload, 1050);
  }, [payload.latitude, payload.longitude, payload.heading, payload.vehicleType]);

  return (
    <MarkerAnimated
      ref={tracker.markerRef}
      coordinate={tracker.coordinate as any}
      rotation={tracker.heading}
      flat
      anchor={{ x: 0.5, y: 0.5 }}
      tracksViewChanges={false}
      title={vehicleMode === 'BODA' ? 'Your boda' : 'Your driver'}
    >
      <VehicleMarkerVisual vehicleMode={vehicleMode} />
    </MarkerAnimated>
  );
}

function InteractiveKareebuMap({
  mode = 'preview',
  onOpen,
  onPinChange,
  initialRegion = KAMPALA_REGION,
  requestLocationOnMount = false,
  onLocationPermissionChange,
  vehicleMode = 'RIDE',
  focusCoordinate,
  originCoordinate,
  destinationCoordinate,
  routePath,
  destinationLabel = 'Destination',
  pickerPinMode = 'marker',
  pickerPinColor = COLORS.red,
  hidePickerControls = false,
  onMapRegionChange,
}: {
  mode?: 'preview' | 'picker' | 'route' | 'driver' | 'trip';
  onOpen?: () => void;
  onPinChange?: (coordinate: { latitude: number; longitude: number }) => void;
  pickerPinMode?: 'marker' | 'center';
  pickerPinColor?: string;
  hidePickerControls?: boolean;
  onMapRegionChange?: (region: Region) => void;
  initialRegion?: Region;
  requestLocationOnMount?: boolean;
  onLocationPermissionChange?: (allowed: boolean) => void;
  vehicleMode?: VehicleMode;
  focusCoordinate?: { latitude: number; longitude: number } | null;
  originCoordinate?: { latitude: number; longitude: number } | null;
  destinationCoordinate?: { latitude: number; longitude: number } | null;
  routePath?: Array<{ latitude: number; longitude: number }> | null;
  destinationLabel?: string;
}) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(initialRegion);
  const [pin, setPin] = useState({ latitude: initialRegion.latitude, longitude: initialRegion.longitude });
  const [hasLocation, setHasLocation] = useState(false);
  const modeConfig = VEHICLE_MODE_CONFIG[vehicleMode];
  const animationPath = useMemo(() => {
    const source = routePath && routePath.length >= 2 ? routePath : ROUTE_POINTS;
    if (source.length <= 8) return source;
    return Array.from({ length: 8 }, (_, index) => source[Math.round((source.length - 1) * (index / 7))]);
  }, [routePath]);
  const [liveVehicle, setLiveVehicle] = useState<VehicleGpsPayload>(() => ({
    driverId: 'demo-peter',
    vehicleType: modeConfig.vehicleType,
    latitude: ROUTE_POINTS[0].latitude,
    longitude: ROUTE_POINTS[0].longitude,
    heading: bearingBetween(ROUTE_POINTS[0] as any, ROUTE_POINTS[1] as any),
    timestamp: Date.now(),
  }));

  useEffect(() => {
    setLiveVehicle((current) => ({ ...current, vehicleType: modeConfig.vehicleType, timestamp: Date.now() }));
  }, [modeConfig.vehicleType]);

  useEffect(() => {
    if (!focusCoordinate) return;
    const next = { ...focusCoordinate, latitudeDelta: 0.045, longitudeDelta: 0.04 };
    setRegion(next);
    if (mode === 'picker') {
      setPin(focusCoordinate);
      onPinChange?.(focusCoordinate);
    }
    requestAnimationFrame(() => mapRef.current?.animateToRegion(next, 320));
  }, [focusCoordinate?.latitude, focusCoordinate?.longitude, mode]);

  useEffect(() => {
    if (mode !== 'driver' && mode !== 'trip') return;
    let index = mode === 'driver' ? 0 : 1;
    const tick = () => {
      const from = animationPath[index % animationPath.length];
      const to = animationPath[(index + 1) % animationPath.length];
      setLiveVehicle({
        driverId: 'demo-peter',
        vehicleType: modeConfig.vehicleType,
        latitude: to.latitude,
        longitude: to.longitude,
        heading: bearingBetween(from as any, to as any),
        speedMps: vehicleMode === 'BODA' ? 8.5 : 6.8,
        timestamp: Date.now(),
      });
      index = (index + 1) % animationPath.length;
    };
    tick();
    const timer = setInterval(tick, 1250);
    return () => clearInterval(timer);
  }, [mode, modeConfig.vehicleType, vehicleMode, animationPath]);

  useEffect(() => {
    if (mode !== 'preview' && mode !== 'picker') return;
    let active = true;
    void (async () => {
      try {
        let permission = await Location.getForegroundPermissionsAsync();
        if (requestLocationOnMount && permission.status !== 'granted' && permission.canAskAgain) {
          permission = await Location.requestForegroundPermissionsAsync();
        }
        const allowed = permission.status === 'granted';
        onLocationPermissionChange?.(allowed);
        if (!allowed) return;
        const current = (await Location.getLastKnownPositionAsync()) ??
          (requestLocationOnMount ? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }) : null);
        if (!active || !current) return;
        const coordinate = { latitude: current.coords.latitude, longitude: current.coords.longitude };
        setHasLocation(true);
        if (mode === 'picker') {
          setPin(coordinate);
          onPinChange?.(coordinate);
        }
        const next = { ...coordinate, latitudeDelta: 0.12, longitudeDelta: 0.105 };
        setRegion(next);
        requestAnimationFrame(() => mapRef.current?.animateToRegion(next, 320));
      } catch {
        // The selected city remains the fallback when the device has no GPS fix.
      }
    })();
    return () => { active = false; };
  }, [mode, requestLocationOnMount]);

  const animate = (next: Region) => {
    setRegion(next);
    mapRef.current?.animateToRegion(next, 260);
  };

  const zoom = (direction: 'in' | 'out') => {
    const factor = direction === 'in' ? 0.55 : 1.8;
    animate({
      ...region,
      latitudeDelta: Math.min(0.3, Math.max(0.006, region.latitudeDelta * factor)),
      longitudeDelta: Math.min(0.3, Math.max(0.006, region.longitudeDelta * factor)),
    });
  };

  const locate = async () => {
    try {
      let permission = await Location.getForegroundPermissionsAsync();
      if (permission.status !== 'granted') permission = await Location.requestForegroundPermissionsAsync();
      const allowed = permission.status === 'granted';
      onLocationPermissionChange?.(allowed);
      if (!allowed) return;
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coordinate = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      setHasLocation(true);
      setPin(coordinate);
      onPinChange?.(coordinate);
      animate({ ...coordinate, latitudeDelta: 0.085, longitudeDelta: 0.074 });
    } catch {
      // Keep Kampala as the reliable fallback when the emulator/device has no GPS fix.
    }
  };

  const isPreview = mode === 'preview';
  const isPicker = mode === 'picker';
  const showRoute = mode === 'route' || mode === 'driver' || mode === 'trip';
  const routeOrigin = originCoordinate ?? ROUTE_POINTS[0];
  const routeCoordinates = routePath && routePath.length >= 2
    ? routePath
    : destinationCoordinate
      ? [routeOrigin, destinationCoordinate]
      : ROUTE_POINTS;
  const needsCloserZoom = isPicker && region.latitudeDelta > 0.085;

  useEffect(() => {
    if (!showRoute || routeCoordinates.length < 2) return;
    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(routeCoordinates, {
        edgePadding: { top: 72, right: 52, bottom: 84, left: 52 },
        animated: true,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [showRoute, routePath?.length, routeCoordinates[0]?.latitude, routeCoordinates[0]?.longitude, routeCoordinates[routeCoordinates.length - 1]?.latitude, routeCoordinates[routeCoordinates.length - 1]?.longitude]);

  return (
    <View style={[styles.liveMapShell, isPreview ? styles.liveMapSquare : styles.liveMapWide, isPicker && styles.liveMapPicker]}>
      <MapView
        ref={mapRef}
        style={styles.liveMap}
        initialRegion={initialRegion}
        onRegionChangeComplete={(nextRegion) => {
          setRegion(nextRegion);
          onMapRegionChange?.(nextRegion);
          if (isPicker && pickerPinMode === 'center') {
            const coordinate = { latitude: nextRegion.latitude, longitude: nextRegion.longitude };
            setPin(coordinate);
            onPinChange?.(coordinate);
          }
        }}
        onPress={(event) => {
          if (!isPicker) return;
          const coordinate = event.nativeEvent.coordinate;
          if (pickerPinMode === 'center') {
            animate({ ...region, latitude: coordinate.latitude, longitude: coordinate.longitude });
            return;
          }
          setPin(coordinate);
          onPinChange?.(coordinate);
        }}
        scrollEnabled
        zoomEnabled
        showsCompass={!isPreview}
        showsScale={!isPreview}
        rotateEnabled={false}
        pitchEnabled={false}
        showsUserLocation={hasLocation}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        loadingEnabled
        onMapReady={() => {
          if (showRoute) {
            mapRef.current?.fitToCoordinates(routeCoordinates, {
              edgePadding: { top: 72, right: 52, bottom: 84, left: 52 },
              animated: false,
            });
          }
        }}
      >
        {showRoute ? <Polyline coordinates={routeCoordinates} strokeColor={COLORS.black} strokeWidth={routePath?.length ? 5 : destinationCoordinate ? 3 : 5} lineDashPattern={routePath?.length ? undefined : destinationCoordinate ? [8, 8] : undefined} /> : null}
        {showRoute ? <Marker coordinate={routeOrigin} pinColor={COLORS.green} title="Pickup" /> : null}
        {showRoute ? <Marker coordinate={destinationCoordinate ?? ROUTE_POINTS[ROUTE_POINTS.length - 1]} pinColor={COLORS.red} title={destinationCoordinate ? destinationLabel : 'Acacia Mall'} /> : null}
        {isPicker && pickerPinMode === 'marker' ? <Marker coordinate={pin} pinColor={pickerPinColor} draggable onDragEnd={(event) => { const coordinate = event.nativeEvent.coordinate; setPin(coordinate); onPinChange?.(coordinate); }} /> : null}
        {mode === 'route' ? NEARBY_VEHICLE_POINTS.map((vehicle, index) => (
          <Marker key={`${vehicleMode}-${index}`} coordinate={{ latitude: vehicle.latitude, longitude: vehicle.longitude }} rotation={vehicle.heading} flat anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
            <VehicleMarkerVisual vehicleMode={vehicleMode} compact />
          </Marker>
        )) : null}
        {mode === 'driver' || mode === 'trip' ? <LiveVehicleMarker vehicleMode={vehicleMode} payload={liveVehicle} /> : null}
      </MapView>

      {!hidePickerControls ? <View style={[styles.mapControls, isPicker && styles.mapControlsPicker]}>
        <Pressable accessibilityLabel="Zoom in" onPress={() => zoom('in')} style={styles.mapControlButton}><Feather name="plus" size={22} color={COLORS.black} /></Pressable>
        <View style={styles.mapControlDivider} />
        <Pressable accessibilityLabel="Zoom out" onPress={() => zoom('out')} style={styles.mapControlButton}><Feather name="minus" size={22} color={COLORS.black} /></Pressable>
        {!isPicker ? <><View style={styles.mapControlDivider} /><Pressable accessibilityLabel="Use my location" onPress={locate} style={styles.mapControlButton}><Ionicons name="locate-outline" size={20} color={COLORS.black} /></Pressable></> : null}
      </View> : null}
      {isPicker && !hidePickerControls ? <Pressable accessibilityLabel="Use my location" onPress={locate} style={styles.mapLocateButton}><Ionicons name="locate-outline" size={24} color={COLORS.black} /></Pressable> : null}
      {isPicker && pickerPinMode === 'center' ? <View pointerEvents="none" style={styles.v36MapCenterPin}><View style={styles.v36MapCenterPinInner} /></View> : null}

      {isPreview ? (
        <>
          <View style={styles.mapLocationChip}><Ionicons name="location" size={14} color={COLORS.red} /><Text style={styles.mapLocationChipText}>Kampala</Text></View>
          {onOpen ? <Pressable onPress={onOpen} style={styles.mapExpandButton}><Feather name="maximize-2" size={16} color={COLORS.black} /></Pressable> : null}
        </>
      ) : null}
      {isPicker ? <View pointerEvents="none" style={[styles.mapPickerHint, pickerPinMode === 'center' && styles.v36MapPickerHint]}><Text style={[styles.mapPickerHintText, pickerPinMode === 'center' && styles.v36MapPickerHintText]}>{needsCloserZoom ? 'Zoom in to place the pin' : pickerPinMode === 'center' ? 'Move the map to your address' : 'Move pin to your address'}</Text></View> : null}
    </View>
  );
}

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

function OnboardingBrandRail({ step, label }: { step: number; label: string }) {
  const progressWidth = `${Math.min(100, Math.max(8, (step / 4) * 100))}%` as `${number}%`;
  return (
    <View style={styles.v30OnboardingBrandRail}>
      <Image source={assets.wordmark} style={styles.v30OnboardingWordmark} resizeMode="contain" />
      <View style={styles.v30OnboardingProgress}>
        <Text style={styles.v30OnboardingProgressLabel}>{label}</Text>
        <View style={styles.v30OnboardingProgressTrack}><View style={[styles.v30OnboardingProgressFill,{width:progressWidth}]} /></View>
        <Text style={styles.v30OnboardingProgressCount}>{step}/4</Text>
      </View>
    </View>
  );
}

export function SplashScreen({ go }: { go: (screen: Screen) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => go('welcome'), 1550);
    return () => clearTimeout(timer);
    // `go` is intentionally captured once: a splash timer must never restart
    // because unrelated app state caused a render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenShell dark contentStyle={styles.v402Splash}>
      <Image source={assets.ribbons} style={styles.v402SplashContours} resizeMode="cover" />
      <View pointerEvents="none" style={styles.v402SplashArcRed} />
      <View pointerEvents="none" style={styles.v402SplashArcYellow} />

      <View style={styles.v402SplashCenter}>
        <Image source={assets.mark} style={styles.v402SplashMark} resizeMode="contain" />
        <Text style={styles.v402SplashBrand}>Karibu</Text>
        <View style={styles.v402SplashTagline}>
          <Text style={styles.v402SplashTaglineWhite}>Everything you need,</Text>
          <Text style={styles.v402SplashTaglineYellow}>all in one place.</Text>
        </View>
      </View>
    </ScreenShell>
  );
}

export function WelcomeScreen({ go, setGuest }: Pick<AppActions, 'go' | 'setGuest'>) {
  const leavingRef = useRef(false);
  const beginOnboarding = (asGuest: boolean) => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setGuest(asGuest);
    go('country');
  };

  return (
    <ScreenShell contentStyle={styles.v40WelcomeScreen}>
      <View style={styles.v40WelcomeBrandBlock}>
        <Image source={assets.wordmark} style={styles.v40WelcomeLogo} resizeMode="contain" />
      </View>

      <View style={styles.v40WelcomeCopy}>
        <Text style={styles.v40WelcomeTitle}>Welcome to <Text style={styles.v40WelcomeTitleAccent}>Kareebu+</Text></Text>
        <Text style={styles.v40WelcomeSubtitle}>Rides, food, deliveries and shopping —{`
`}all in one place.</Text>
      </View>

      <View style={styles.v40WelcomeHeroFrame}>
        <View style={styles.v40WelcomeRideBubble}>
          <Image source={assets.service.rides} style={styles.v40WelcomeRideIcon} resizeMode="contain" />
          <Text style={styles.v40WelcomeRideText}>Rides</Text>
        </View>
        <Image source={assets.welcomeHero} style={styles.v40WelcomeHero} resizeMode="contain" />
      </View>

      <View style={styles.v40WelcomeActions}>
        <Pressable
          accessibilityRole="button"
          onPress={() => beginOnboarding(false)}
          style={({ pressed }) => [styles.v40WelcomePrimaryButton, pressed && styles.v32WelcomePrimaryButtonPressed]}
        >
          <Text style={styles.v40WelcomePrimaryText}>Get started</Text>
        </Pressable>
        <Pressable onPress={() => beginOnboarding(true)} hitSlop={10} style={({pressed})=>[styles.v40WelcomeGuest,pressed&&styles.pressed]}>
          <Text style={styles.v40WelcomeGuestText}>Continue as guest</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function CountrySelectionMap({ country }: { country: string }) {
  return (
    <View style={styles.v36CountryMapWrap} pointerEvents="none">
      <Image source={COUNTRY_SELECTION_ASSETS.map} style={styles.v36CountryMap} resizeMode="cover" />
      <View style={styles.v36CountryMapFadeTop} />
      <View style={styles.v36CountryMapFadeBottom} />
    </View>
  );
}

function CountryPreviewVisual({ country, selected }: { country: string; selected: boolean }) {
  const landmark = REAL_COUNTRY_LANDMARKS[country] ?? REAL_COUNTRY_LANDMARKS.Uganda;
  return (
    <View style={[styles.v39CountryPreviewVisual, selected && styles.v39CountryPreviewVisualSelected]}>
      <Image
        source={landmark.image}
        style={styles.v39CountryLandmarkImage}
        resizeMode="cover"
        accessibilityLabel={`${landmark.landmark}, ${landmark.city}`}
      />
      <View style={styles.v401CountryPhotoShade} />
      <View style={styles.v401CountryLocationPill}>
        <Ionicons name="location" size={15} color={COLORS.red} />
        <Text numberOfLines={1} style={styles.v401CountryLocationText}>{landmark.city}</Text>
      </View>
      {selected ? (
        <View style={styles.v401CountrySelectedBadge}>
          <Ionicons name="checkmark" size={17} color={COLORS.black} />
        </View>
      ) : null}
    </View>
  );
}

export function CountryScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const flags: Record<string, string> = { Uganda: '🇺🇬', Kenya: '🇰🇪', Tanzania: '🇹🇿' };
  const [pickerOpen, setPickerOpen] = useState(false);
  const selectedCountry = countryData.find((item) => item.name === data.country) ?? countryData[0];
  const selectedIndex = countryData.findIndex((item) => item.name === selectedCountry.name);
  const ordered = [
    countryData[(selectedIndex + countryData.length - 1) % countryData.length],
    selectedCountry,
    countryData[(selectedIndex + 1) % countryData.length],
  ];

  const chooseCountry = (name: string, capital: string) => {
    if (name !== data.country) {
      actions.setDeliveryPlace(null);
      actions.setFocusedPlace(null);
      actions.setDestinationPlace(null);
    }
    actions.setCountry(name);
    actions.setCity(countryCities[name]?.[0] ?? capital);
    setPickerOpen(false);
  };

  return (
    <ScreenShell contentStyle={styles.v36CountryScreen}>
      <View style={styles.v38OnboardingTopline}>
        {data.locationReturn !== 'home' ? <Pressable onPress={()=>{const back=data.locationReturn;actions.setLocationReturn('home');actions.go(back);}} style={styles.v38OnboardingBack} hitSlop={10}><Feather name="arrow-left" size={21} color={COLORS.black}/></Pressable> : <View style={styles.v38OnboardingBackPlaceholder}/>}
        <Image source={assets.wordmark} style={styles.v40CountryWordmark} resizeMode="contain" />
        <Text style={styles.v38OnboardingStep}>1 of 3</Text>
      </View>
      <Text style={styles.v40CountryTitle}>Select your country</Text>

      <View style={styles.v36CountryStage}>
        <CountrySelectionMap country={selectedCountry.name} />
        <View style={styles.v36CountryCarouselViewport}>
          <View style={styles.v36CountryCarousel}>
            {ordered.map((country, index) => {
              const selected = index === 1;
              return (
                <Pressable
                  key={`${country.name}-${index}`}
                  onPress={() => chooseCountry(country.name, country.capital)}
                  style={[
                    styles.v36CountryCard,
                    selected ? styles.v36CountryCardSelected : styles.v36CountryCardSide,
                    !selected && index === 0 ? styles.v401CountryCardLeft : null,
                    !selected && index === 2 ? styles.v401CountryCardRight : null,
                  ]}
                >
                  <CountryPreviewVisual country={country.name} selected={selected} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Change selected country" style={styles.v40CountrySelector} onPress={() => setPickerOpen(true)}>
        <Text style={styles.v36CountrySelectorFlag}>{flags[selectedCountry.name]}</Text>
        <Text style={styles.v36CountrySelectorText}>{selectedCountry.name}</Text>
        <Feather name="chevron-down" size={19} color={COLORS.black} />
      </Pressable>

      <Text style={styles.v40CountrySupport}>Choose where you want Kareebu+ to work for you.</Text>
      <Pressable accessibilityRole="button" onPress={() => actions.go('city')} style={({ pressed }) => [styles.v40CountryContinue, pressed && styles.v36BlackContinuePressed]}>
        <Text style={styles.v36BlackContinueText}>Continue</Text>
      </Pressable>

      <Modal transparent visible={pickerOpen} animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.v38CountryModalBackdrop} onPress={() => setPickerOpen(false)}>
          <Pressable style={styles.v38CountryModalCard} onPress={(event) => event.stopPropagation()}>
            <View style={styles.v38CountryModalHandle} />
            <Text style={styles.v38CountryModalTitle}>Choose your country</Text>
            <Text style={styles.v38CountryModalBody}>You can change your country and city later from Account settings.</Text>
            {countryData.map((country) => {
              const selected = country.name === data.country;
              return (
                <Pressable key={country.code} onPress={() => chooseCountry(country.name, country.capital)} style={[styles.v38CountryModalRow, selected && styles.v38CountryModalRowSelected]}>
                  <Text style={styles.v38CountryModalFlag}>{flags[country.name]}</Text>
                  <View style={styles.flex}><Text style={styles.v38CountryModalName}>{country.name}</Text><Text style={styles.v38CountryModalMeta}>{country.capital} · {country.dial}</Text></View>
                  {selected ? <Ionicons name="checkmark-circle" size={22} color={COLORS.red} /> : <Feather name="chevron-right" size={20} color={COLORS.muted} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenShell>
  );
}

function CityThumb({ city, selected }: { city: string; selected: boolean }) {
  const cityImages: Record<string, ImageSourcePropType> = {
    Kampala: assets.cities.kampala,
    Entebbe: assets.cities.entebbe,
    Jinja: assets.cities.jinja,
    Wakiso: assets.cities.wakiso,
    Mbarara: assets.cities.mbarara,
    Gulu: assets.cities.gulu,
  };
  const image = cityImages[city];
  if (image) {
    return (
      <View style={[styles.onboardingCityThumb, selected && styles.onboardingCityThumbSelected]}>
        <Image source={image} style={styles.onboardingCityThumbImage} resizeMode="cover" />
      </View>
    );
  }
  return (
    <View style={[styles.onboardingCityThumb, styles.onboardingCityThumbFallback, selected && styles.onboardingCityThumbSelected]}>
      <Ionicons name="location-outline" size={24} color={COLORS.black} />
    </View>
  );
}

export function CityScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const cities = countryCities[data.country] ?? countryCities.Uganda;
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState('');
  const filteredCities = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return cities;
    return cities.filter((city) => city.toLowerCase().includes(term));
  }, [cities, query]);
  const chooseCity = (city: string) => {
    if (city !== data.city) {
      actions.setDeliveryPlace(null);
      actions.setFocusedPlace(null);
      actions.setDestinationPlace(null);
    }
    actions.setCity(city);
  };

  const openLocation = async (useCurrentLocation = false) => {
    if (locating) return;
    const nextAfterLocation: Screen = data.locationReturn !== 'home' ? data.locationReturn : (data.deliveryPlace ? 'home' : data.guest ? 'home' : 'phone');
    actions.setLocationReturn(nextAfterLocation);
    setLocationNote('');

    if (useCurrentLocation) {
      setLocating(true);
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status === 'granted') {
          actions.setLocationAllowed(true);
          const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

          let detectedCountry = data.country;
          let detectedAddress: any;
          try {
            const [address] = await Location.reverseGeocodeAsync({
              latitude: current.coords.latitude,
              longitude: current.coords.longitude,
            });
            detectedAddress = address;
            const byIso: Record<string, string> = { UG: 'Uganda', KE: 'Kenya', TZ: 'Tanzania' };
            const iso = address?.isoCountryCode?.toUpperCase();
            if (iso && byIso[iso]) detectedCountry = byIso[iso];
          } catch {
            // Nearest-city fallback works even when reverse geocoding is unavailable.
          }

          const candidateCities = countryCities[detectedCountry] ?? cities;
          const supported = candidateCities
            .map((city) => ({ city, region: CITY_REGIONS[city] }))
            .filter((item): item is { city: string; region: Region } => Boolean(item.region));
          const nearest = supported
            .map((item) => ({
              ...item,
              distance: Math.hypot(
                current.coords.latitude - item.region.latitude,
                (current.coords.longitude - item.region.longitude) * Math.cos(current.coords.latitude * Math.PI / 180),
              ),
            }))
            .sort((a, b) => a.distance - b.distance)[0];

          actions.setCountry(detectedCountry);
          if (nearest) actions.setCity(nearest.city);
          const resolvedCity = nearest?.city ?? data.city;
          const detectedLabel = detectedAddress?.name || detectedAddress?.street || detectedAddress?.district || 'Current location';
          const detectedAddressLine = [detectedAddress?.street, detectedAddress?.district, resolvedCity, detectedCountry].filter(Boolean).filter((value,index,array)=>array.indexOf(value)===index).join(', ');
          const gpsPlace: PlaceSelection = {
            placeId: `gps-${current.coords.latitude.toFixed(5)}-${current.coords.longitude.toFixed(5)}`,
            name: detectedLabel,
            address: detectedAddressLine || `${resolvedCity}, ${detectedCountry}`,
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
            types: ['street_address'],
            provider: 'manual',
          };
          actions.setDeliveryPlace(gpsPlace);
          actions.setFocusedPlace(gpsPlace);
          actions.setLocationReturn('home');
          actions.go(nextAfterLocation);
          return;
        }
        setLocationNote('Location access was not granted. Choose a city or continue to place your pin manually.');
      } catch {
        setLocationNote('We could not get your location just now. Choose a city or continue to the map.');
      } finally {
        setLocating(false);
      }
      return;
    }

    actions.go('locationPicker');
  };

  return (
    <ScreenShell contentStyle={styles.v36CityScreen}>
      <View style={styles.v38OnboardingTopline}>
        <Pressable onPress={() => actions.go('country')} style={styles.v38OnboardingBack} hitSlop={10}>
          <Feather name="arrow-left" size={21} color={COLORS.black} />
        </Pressable>
        <Image source={assets.mark} style={styles.v38OnboardingMark} resizeMode="contain" />
        <Text style={styles.v38OnboardingStep}>2 of 3</Text>
      </View>
      <Text style={styles.v36CityTitle}>Select your city</Text>
      <Text style={styles.v36CitySubtitle}>Choose a city in {data.country}, or let Kareebu+ find the nearest supported city for you.</Text>

      <View style={styles.v36CitySearch}>
        <Feather name="search" size={21} color={COLORS.black} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search city or area"
          placeholderTextColor={COLORS.mutedLight}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.v36CitySearchInput}
        />
        {query ? <Pressable onPress={() => setQuery('')} hitSlop={10}><Ionicons name="close-circle" size={20} color={COLORS.muted} /></Pressable> : null}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.v36CityList} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {filteredCities.length ? filteredCities.map((city) => {
          const selected = data.city === city;
          return (
            <Pressable key={city} onPress={() => chooseCity(city)} style={[styles.v36CityOption, selected && styles.v36CityOptionSelected]}>
              <CityThumb city={city} selected={selected} />
              <Text style={styles.v36CityOptionName}>{city}</Text>
              <View style={[styles.v36CityRadio, selected && styles.v36CityRadioSelected]}>{selected ? <View style={styles.v36CityRadioDot} /> : null}</View>
            </Pressable>
          );
        }) : (
          <View style={styles.onboardingCityEmpty}><Text style={styles.onboardingCityEmptyTitle}>No matching city</Text><Text style={styles.onboardingCityEmptyBody}>Try another spelling or use your current location.</Text></View>
        )}
      </ScrollView>

      {locationNote ? <View style={styles.v38LocationNote}><Ionicons name="information-circle-outline" size={18} color={COLORS.red}/><Text style={styles.v38LocationNoteText}>{locationNote}</Text></View> : null}
      <Pressable disabled={locating} onPress={() => void openLocation(true)} style={({ pressed }) => [styles.v36UseLocationRow, pressed && !locating && styles.v26CardPressed, locating && styles.buttonDisabled]}>
        <View style={styles.v36UseLocationIcon}>{locating ? <ActivityIndicator size="small" color={COLORS.red}/> : <Ionicons name="locate" size={21} color={COLORS.red} />}</View>
        <View style={styles.flex}><Text style={styles.v36UseLocationTitle}>{locating ? 'Finding your location…' : 'Use my location'}</Text><Text style={styles.v36UseLocationBody}>Use GPS to choose your country, city and delivery area automatically</Text></View>
        {!locating ? <Feather name="chevron-right" size={21} color={COLORS.black} /> : null}
      </Pressable>

      <Pressable disabled={locating} accessibilityRole="button" onPress={() => void openLocation(false)} style={({ pressed }) => [styles.v36BlackContinue, pressed && !locating && styles.v36BlackContinuePressed, locating && styles.buttonDisabled]}>
        <Text style={styles.v36BlackContinueText}>Continue with {data.city}</Text>
      </Pressable>
    </ScreenShell>
  );
}

export function LocationScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return <CityScreen data={data} actions={actions} />;
}

export function PhoneScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <OnboardingFrame>
      <Header onBack={() => actions.go('locationPicker')} />
      <OnboardingBrandRail step={1} label="Create your account" />
      <View style={[styles.onboardingPadding, styles.phoneContent]}>
        <Text style={styles.onboardingTitle}>Sign in with{`\n`}your phone</Text>
        <Text style={styles.onboardingSubtitle}>We’ll send you a code to{`\n`}verify your number</Text>
        <View style={styles.phoneFields}>
          <RoundedCard style={styles.countryCodeCard}>
            <Text style={styles.countryFlagEmoji}>{{ Uganda: '🇺🇬', Kenya: '🇰🇪', Tanzania: '🇹🇿' }[data.country] ?? '🇺🇬'}</Text>
            <Text style={styles.countryCode}>{countryData.find((item) => item.name === data.country)?.dial ?? '+256'}</Text>
            <Ionicons name="checkmark-circle" size={21} color={COLORS.green} />
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
  const [resendIn, setResendIn] = useState(28);
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);
  const setDigit = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...data.otp]; next[index] = digit; actions.setOtp(next);
    if (digit && index < 5) refs.current[index + 1]?.focus();
    if (next.every(Boolean)) setTimeout(() => actions.go('profile'), 180);
  };
  const resend = () => {
    if (resendIn > 0) return;
    actions.setOtp(['', '', '', '', '', '']);
    setResendIn(30);
    Alert.alert('Code sent', `A new verification code was sent to ${dialCodeFor(data.country)} ${data.phone}.`);
    refs.current[0]?.focus();
  };
  return (
    <OnboardingFrame>
      <Header onBack={() => actions.go('phone')} />
      <OnboardingBrandRail step={2} label="Verify your number" />
      <View style={[styles.onboardingPadding, styles.otpContent]}>
        <Text style={styles.onboardingTitle}>Enter the code{`\n`}we sent you</Text>
        <Text style={styles.onboardingSubtitle}>We’ve sent a 6-digit code to</Text>
        <Text style={styles.phoneSummary}>{dialCodeFor(data.country)} {data.phone || '7 123 456 789'}</Text>
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
        <Pressable disabled={resendIn > 0} onPress={resend} style={[styles.resendRow, resendIn > 0 && {opacity:.72}]}>
          <Ionicons name="refresh" size={23} color={COLORS.red} />
          <Text style={styles.resendText}>{resendIn > 0 ? <>Resend code in <Text style={styles.resendTime}>00:{String(resendIn).padStart(2,'0')}</Text></> : <Text style={styles.resendTime}>Resend code</Text>}</Text>
        </Pressable>
        <View style={styles.bottomTrust}><TrustNote icon="shield-check-outline" title="Didn’t receive the code?" body="Check your SMS or resend when the timer ends." /></View>
      </View>
    </OnboardingFrame>
  );
}

export function ProfileScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <OnboardingFrame footer={<PrimaryButton label="Continue" onPress={() => actions.go('permissions')} disabled={!data.fullName.trim()} />}>
      <Header onBack={() => actions.go('otp')} />
      <OnboardingBrandRail step={3} label="Your profile" />
      <ScrollView contentContainerStyle={styles.onboardingPadding} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.onboardingTitle}>Let’s set up{`\n`}your profile</Text>
        <Text style={styles.onboardingSubtitle}>Tell us a bit about yourself</Text>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={86} color="#C8C9CD" />
          <Pressable onPress={()=>Alert.alert('Profile photo','Choose camera or photo library in the production profile flow.')} style={styles.avatarCamera}><Feather name="camera" size={18} color={COLORS.black} /></Pressable>
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
  const requestLocation = async () => {
    if (data.locationAllowed) {
      Alert.alert('Location enabled', 'Kareebu+ can use your location for nearby services, pickup and delivery estimates.');
      return;
    }
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      actions.setLocationAllowed(permission.status === 'granted');
      if (permission.status !== 'granted') Alert.alert('Location not enabled', 'You can continue and enter addresses manually.');
    } catch {
      Alert.alert('Location unavailable', 'You can continue and enter addresses manually.');
    }
  };
  return (
    <ScreenShell scroll contentStyle={styles.permissionsScroll}>
      <View style={styles.permissionsPadding}>
        <OnboardingBrandRail step={4} label="Final preferences" />
        <Text style={styles.permissionsTitle}>Almost ready</Text>
        <Text style={styles.permissionsSubtitle}>Choose how Kareebu+ should keep you updated. You can change these later.</Text>
        <View style={styles.permissionStack}>
          <PermissionCard icon="location-outline" title={data.locationAllowed ? 'Location enabled' : 'Enable location'} body={data.locationAllowed ? `Using location for nearby services around ${data.city}.` : 'Optional. Helps with pickup, delivery addresses and nearby services.'} enabled={data.locationAllowed} onPress={() => void requestLocation()} />
          <PermissionCard icon="notifications-outline" title="Order & trip updates" body="Receive useful ride, delivery and order status updates." enabled={data.notificationsAllowed} onPress={() => actions.setNotificationsAllowed(!data.notificationsAllowed)} />
        </View>
        <Text style={styles.previewTitle}>Ready for {data.city}</Text>
        <Text style={styles.previewSubtitle}>Your local Kareebu+ experience is set</Text>
        <RoundedCard style={styles.homePreview}>
          <View style={styles.previewHeader}><Ionicons name="location" size={20} color={COLORS.red} /><Text style={styles.previewLocation}>{data.city}, {data.country}</Text><View style={styles.previewBalance}><Image source={assets.mark} style={styles.miniMark} /><Text style={styles.previewBalanceText}>{formatMoney(data.country, data.walletBalance)}</Text></View></View>
          <View style={styles.previewSearch}><Feather name="search" size={18} color={COLORS.black} /><Text style={styles.previewSearchText}>Search all of Kareebu+</Text></View>
          <View style={styles.previewServices}>{serviceData.slice(0, 4).map((service) => <View key={service.label} style={styles.previewService}><Image source={service.image} style={styles.previewServiceIcon} /><Text style={styles.previewServiceText}>{service.label}</Text></View>)}</View>
        </RoundedCard>
        <PrimaryButton label={data.authReturn === 'home' ? 'Start using Kareebu+' : 'Continue'} onPress={() => { const next = data.authReturn; actions.setGuest(false); actions.setAuthReturn('home'); actions.go(next); }} />
      </View>
    </ScreenShell>
  );
}

function HomeHeader({ city, country, balance, go, onLocation }: { city: string; country: string; balance: number; go: (screen: Screen) => void; onLocation: () => void }) {
  return (
    <View style={styles.v31HomeHeader}>
      <View style={styles.v31HomeTopRow}>
        <View style={styles.v31HomeLogoSurface}>
          <Image source={assets.wordmark} style={styles.v31HomeWordmark} resizeMode="contain" />
        </View>
        <Pressable style={styles.v31BalancePill} onPress={() => go('wallet')}>
          <Image source={assets.mark} style={styles.v31BalanceMark} resizeMode="contain" />
          <Text style={styles.v31BalanceText}>{formatMoney(country, balance)}</Text>
        </Pressable>
      </View>
      <View style={styles.v31LocationUtilityRow}>
        <Pressable style={styles.v31HomeLocation} onPress={onLocation}>
          <Ionicons name="location" size={19} color={COLORS.red} />
          <Text style={styles.v31HomeLocationLabel}>Deliver to</Text>
          <Text numberOfLines={1} style={styles.v31HomeLocationText}>{city}, {country}</Text>
          <Feather name="chevron-down" size={16} color={COLORS.black} />
        </Pressable>
        <View style={styles.v31HeaderActions}>
          <Pressable style={styles.v31HeaderCircle} onPress={() => go('activity')}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.black} />
          </Pressable>
          <Pressable style={styles.v31HeaderMarkButton} onPress={() => go('account')}>
            <Image source={assets.mark} style={styles.v31HeaderMark} resizeMode="contain" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function KareebuBlackPromo({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.kareebuPromo, pressed && styles.pressed]}>
      <Image source={assets.promoVisual} style={styles.kareebuPromoVisual} resizeMode="cover" />
      <View style={styles.kareebuPromoCopy}>
        <View>
          <Text style={styles.kareebuPromoBrand}>Kareebu</Text>
          <Text style={styles.kareebuPromoTier}>BLACK</Text>
        </View>
        <Text style={styles.kareebuPromoBody}>Priority rides · better rewards · member-only delivery perks</Text>
        <View style={styles.kareebuPromoButton}><Text style={styles.kareebuPromoButtonText}>Explore membership</Text></View>
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
      <InteractiveKareebuMap mode="preview" onOpen={() => go('locationPicker')} />
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

function HomeFoodSection({ data, actions }: { data: AppData; actions: AppActions }) {
  const items = DEMO_RESTAURANTS.slice(0, 6);
  return (
    <View>
      <SectionTitle title="Food near you" action="See all" onAction={() => actions.go('food')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {items.map((item) => (
          <Pressable key={item.id} onPress={() => { actions.selectRestaurant(item.id); actions.go('restaurant'); }} style={({ pressed }) => [styles.homeFoodCard, pressed && styles.v26CardPressed]}>
            <Image source={assets.food[item.image]} style={styles.homeFoodImage} />
            {item.offer ? <View style={styles.v30MiniOffer}><Text style={styles.v30MiniOfferText}>{item.offer}</Text></View> : null}
            <View style={styles.v27HomeFoodCopy}>
              <Text numberOfLines={1} style={styles.homeFoodTitle}>{localisedRestaurantName(item, data.country, data.city)}</Text>
              <Text numberOfLines={1} style={styles.v30RestaurantCuisine}>{item.cuisine}</Text>
              <Text style={styles.homeFoodMeta}><Text style={styles.star}>★</Text> {item.rating.toFixed(1)} · {item.eta}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const LOCAL_POPULAR_STORE_IDS: Record<string, Record<string, string[]>> = {
  Uganda: {
    Kampala: ['carrefour', 'goodlife', 'capital', 'quality', 'jumia', 'healthplus', 'sunlife', 'tyros', 'silverglow', 'lifecare', 'rapid', 'careplus', 'mediq', 'beautybasket', 'nutrition-hub', 'eye-care', 'techpoint', 'homehub', 'petcare'],
    Entebbe: ['carrefour', 'goodlife', 'jumia', 'healthplus', 'sunlife', 'lifecare'],
    Wakiso: ['carrefour', 'goodlife', 'capital', 'quality', 'jumia', 'healthplus', 'sunlife', 'lifecare', 'rapid'],
    Jinja: ['goodlife', 'jumia', 'quality'],
    Mbarara: ['goodlife', 'jumia', 'quality'],
    Gulu: ['goodlife', 'jumia'],
  },
  Kenya: {
    Nairobi: ['naivas', 'quickmart', 'carrefour', 'goodlife', 'jumia'],
    Mombasa: ['naivas', 'quickmart', 'carrefour', 'goodlife', 'jumia'],
    Kisumu: ['naivas', 'goodlife', 'jumia'],
    Nakuru: ['naivas', 'quickmart', 'goodlife', 'jumia'],
    Eldoret: ['naivas', 'quickmart', 'goodlife', 'jumia'],
  },
  Tanzania: {
    'Dar es Salaam': ['shoppers-tz', 'village-tz', 'breeze-tz'],
    Arusha: ['shoppers-tz'],
    Mwanza: ['breeze-tz'],
    Dodoma: ['shoppers-tz'],
    Mbeya: ['breeze-tz'],
  },
};

function localisedStoreName(store: DemoShop, country: string) {
  if (store.id === 'carrefour') return country === 'Kenya' ? 'Carrefour Kenya' : 'Carrefour Uganda';
  if (store.id === 'jumia') return country === 'Kenya' ? 'Jumia Kenya' : 'Jumia Uganda';
  return store.name;
}

function localeStoreIds(country: string, city: string) {
  const defaultCity = countryCities[country]?.[0] ?? city;
  return LOCAL_POPULAR_STORE_IDS[country]?.[city] ?? LOCAL_POPULAR_STORE_IDS[country]?.[defaultCity] ?? [];
}

function localeStores(country: string, city: string) {
  const ids = localeStoreIds(country, city);
  return ids.map((id) => DEMO_SHOPS.find((store) => store.id === id)).filter((store): store is DemoShop => Boolean(store));
}

function localisedRestaurantName(restaurant: DemoRestaurant, country: string, city: string) {
  if (country === 'Uganda') return restaurant.name;
  if (restaurant.id === 'kampala-grill') return `${city} Grill House`;
  if (restaurant.id === 'urban-bowl') return `Urban Bowl ${city}`;
  if (restaurant.id === 'kampala-bites') return `${city} Bites`;
  if (restaurant.id === 'rolex-stop') return country === 'Kenya' ? 'Chapati & Wrap Stop' : 'Chapati & Chipsi Stop';
  return restaurant.name;
}

function PopularStoreLogo({ store }: { store: DemoShop }) {
  const imageById: Partial<Record<string, ImageSourcePropType>> = {
    carrefour: assets.homeBrands.carrefour,
    goodlife: assets.homeBrands.goodlife,
    jumia: assets.homeBrands.jumia,
  };
  const logo = imageById[store.id];
  if (logo) {
    return <Image source={logo} style={styles.v35StoreBrandImage} resizeMode="contain" />;
  }
  if (store.id === 'capital') {
    return <View style={styles.v35CapitalLogo}><Ionicons name="cart" size={22} color="#087A3E"/><Text style={styles.v35CapitalLogoText}>CAPITAL</Text></View>;
  }
  if (store.id === 'quality') {
    return <View style={styles.v35QualityLogo}><Text style={styles.v35QualityQ}>Q</Text><Text style={styles.v35QualityText}>QUALITY</Text></View>;
  }
  if (store.id === 'kareebu-health') {
    return <View style={styles.v35KareebuStoreLogo}><Image source={assets.mark} style={styles.v35KareebuStoreMark} resizeMode="contain"/><Text style={styles.v35KareebuStoreText}>HEALTH</Text></View>;
  }
  if (store.id === 'naivas') {
    return <View style={styles.v37NaivasLogo}><Text style={styles.v37NaivasName}>Naivas</Text><View style={styles.v37NaivasLeaf}/></View>;
  }
  if (store.id === 'quickmart') {
    return <View style={styles.v37QuickmartLogo}><Text style={styles.v37QuickmartQuick}>Quick</Text><Text style={styles.v37QuickmartMart}>mart</Text></View>;
  }
  if (store.id === 'shoppers-tz') {
    return <View style={styles.v37ShoppersLogo}><Text style={styles.v37ShoppersName}>SHOPPERS</Text><Text style={styles.v37ShoppersSub}>SUPERMARKET</Text></View>;
  }
  if (store.id === 'village-tz') {
    return <View style={styles.v37VillageLogo}><Text style={styles.v37VillageName}>Village</Text><Text style={styles.v37VillageSub}>SUPERMARKET</Text></View>;
  }
  if (store.id === 'breeze-tz') {
    return <View style={styles.v37BreezeLogo}><Ionicons name="medical" size={20} color="#1B83C5"/><View><Text style={styles.v37BreezeName}>Breeze</Text><Text style={styles.v37BreezeSub}>PHARMACY</Text></View></View>;
  }
  return <View style={styles.v35FallbackStoreLogo}><Ionicons name={shopIconName(store.icon)} size={25} color={COLORS.black}/><Text numberOfLines={1} style={styles.v35FallbackStoreText}>{store.name}</Text></View>;
}

function HomeShopSection({ data, actions }: { data: AppData; actions: AppActions }) {
  const items = localeStores(data.country, data.city);
  return (
    <View>
      <View style={styles.v35PopularStoresHeader}><View><Text style={styles.v35PopularStoresTitle}>Popular stores</Text><Text style={styles.v35PopularStoresLocale}>Near {data.city}</Text></View><TextButton label="See all" onPress={() => actions.go('shops')} color={COLORS.red} /></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.homeStoreList}>
        {items.map((store) => (
          <Pressable key={store.id} onPress={() => { actions.selectShop(store.id); actions.go('shop'); }} style={({ pressed }) => [styles.homeStoreCard, styles.v35HomeStoreCard, pressed && styles.v26CardPressed]}>
            <View style={styles.v35StoreLogoArea}><PopularStoreLogo store={store} /></View>
            <Text numberOfLines={2} style={[styles.homeStoreName, styles.v35HomeStoreName]}>{localisedStoreName(store, data.country)}</Text>
            <Text numberOfLines={1} style={styles.v27HomeStoreType}>{store.category}</Text>
            <Text style={styles.homeStoreMeta}><Text style={styles.star}>★</Text> {store.rating.toFixed(1)} · {store.eta}</Text>
            <Text numberOfLines={1} style={styles.v30StoreDeal}>{store.deal}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function HomeServiceCard({ item, onPress }: { item: typeof homeServiceData[number]; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.v31ServiceCard, pressed && styles.v26CardPressed]}>
      <View style={styles.v31ServiceVisual}>
        {item.image ? <Image source={item.image} style={styles.v31ServiceImage} resizeMode="contain" /> : <Ionicons name={item.icon ?? 'grid-outline'} size={32} color={COLORS.black} />}
      </View>
      <Text numberOfLines={1} style={styles.v31ServiceLabel}>{item.label}</Text>
    </Pressable>
  );
}

function HomeCampaignCard({ eyebrow, title, body, tone, image, width, cta = 'Explore', onPress }: { eyebrow: string; title: string; body: string; tone: 'red'|'yellow'|'black'; image: ImageSourcePropType; width?: number; cta?: string; onPress?: () => void }) {
  const backgroundColor = tone === 'red' ? COLORS.red : tone === 'yellow' ? COLORS.yellow : COLORS.black;
  const foreground = tone === 'yellow' ? COLORS.black : COLORS.white;
  const secondary = tone === 'yellow' ? '#5D4800' : tone === 'black' ? '#E6E6E6' : '#FFF1EF';
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.v25CampaignCard, width ? { width } : null, { backgroundColor }, pressed && styles.v26CardPressed]}>
      <View style={styles.v25CampaignCopy}>
        <Text style={[styles.v25CampaignEyebrow, { color: foreground }]}>{eyebrow}</Text>
        <Text style={[styles.v25CampaignTitle, { color: foreground }]}>{title}</Text>
        <Text style={[styles.v25CampaignBody, { color: secondary }]}>{body}</Text>
        <View style={[styles.v25CampaignCta, { backgroundColor: tone === 'yellow' ? COLORS.black : COLORS.yellow }]}><Text style={[styles.v25CampaignCtaText, { color: tone === 'yellow' ? COLORS.white : COLORS.black }]}>{cta}</Text><Feather name="arrow-right" size={14} color={tone === 'yellow' ? COLORS.white : COLORS.black} /></View>
      </View>
      <View style={styles.v25CampaignVisual}><Image source={image} style={styles.v25CampaignImage} resizeMode="contain" /></View>
    </Pressable>
  );
}

function HomeNewFinds({ go }: { go: (screen: Screen) => void }) {
  return (
    <View style={styles.v25SurfaceSection}>
      <View style={styles.v25SectionHeadingRow}>
        <View><Text style={styles.v25SectionTitle}>New finds up to <Text style={{ color: COLORS.red }}>30% off</Text></Text><Text style={styles.v25SectionSubtitle}>Discover more, spend less</Text></View>
        <TextButton label="See all" onPress={() => go('shops')} color={COLORS.red} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v25MerchantRow}>
        {storeData.map((store) => (
          <Pressable key={store.id} onPress={() => go('shops')} style={styles.v25MerchantCard}>
            <StoreBrandMark brand={store.id} compact />
            <Text numberOfLines={1} style={styles.v25MerchantName}>{store.name}</Text>
            <Text style={styles.v25MerchantMeta}><Text style={styles.star}>★</Text> {store.rating}</Text>
            <Text style={styles.v25MerchantEta}>{store.delivery}</Text>
            <Text style={styles.v25MerchantDelivery}>{store.id === 'pharmacy' ? 'Free delivery' : 'From UGX 2,000'}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function HomeRedeemSave({ go }: { go: (screen: Screen) => void }) {
  return (
    <View>
      <SectionTitle title="Redeem and save" />
      <View style={styles.v25RedeemRow}>
        <Pressable onPress={() => go('wallet')} style={[styles.v25RedeemCard, styles.v25RedeemYellow]}><View style={styles.v25RedeemIcon}><Ionicons name="trophy-outline" size={28} color={COLORS.black} /></View><View style={styles.flex}><Text style={styles.v25RedeemTitle}>Rewards</Text><Text style={styles.v25RedeemBody}>Earn points on every order</Text></View><Feather name="chevron-right" size={20} color={COLORS.black} /></Pressable>
        <Pressable onPress={() => go('wallet')} style={[styles.v25RedeemCard, styles.v25RedeemRed]}><View style={styles.v25RedeemIcon}><Ionicons name="ticket-outline" size={28} color={COLORS.red} /></View><View style={styles.flex}><Text style={styles.v25RedeemTitle}>Vouchers</Text><Text style={styles.v25RedeemBody}>Unlock exclusive deals</Text></View><Feather name="chevron-right" size={20} color={COLORS.black} /></Pressable>
      </View>
    </View>
  );
}


function homeBrandIcon(brand: string): keyof typeof Ionicons.glyphMap {
  const normalized = brand.toLowerCase();
  if (normalized.includes('goodlife')) return 'medical-outline';
  if (normalized.includes('jumia')) return 'phone-portrait-outline';
  if (normalized.includes('chicken') || normalized.includes('javas')) return 'restaurant-outline';
  return 'cart-outline';
}

function homeBrandAccent(accent: HomeRetailPromotion['accent'] | HomeRealBrand['accent']) {
  if (accent === 'red') return COLORS.red;
  if (accent === 'yellow') return COLORS.yellow;
  if (accent === 'green') return COLORS.green;
  return COLORS.black;
}

function homeReferenceOfferCreative(promoId: string): ImageSourcePropType | null {
  if (promoId === 'glovo-daily-deals') return assets.homeOffers.glovo;
  if (promoId === 'carrefour-weekend-deals') return assets.homeOffers.carrefour;
  if (promoId === 'goodlife-stay-well') return assets.homeOffers.goodlife;
  if (promoId === 'jumia-tech-week') return assets.homeOffers.jumia;
  return null;
}

function HomeRetailPromoCard({ promo, onPress, width, height }: { promo: HomeRetailPromotion; onPress: () => void; width: number; height: number }) {
  const referenceCreative = homeReferenceOfferCreative(promo.id);
  if (referenceCreative) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${promo.brand}: ${promo.headline}`}
        onPress={onPress}
        style={({ pressed }) => [styles.v33ReferencePromoCard, { width, height }, pressed && styles.v26CardPressed]}
      >
        <Image source={referenceCreative} style={styles.v33ReferencePromoImage} resizeMode="stretch" />
      </Pressable>
    );
  }

  const accent = homeBrandAccent(promo.accent);
  const darkAccent = promo.accent === 'black' || promo.accent === 'red' || promo.accent === 'green';
  const image = promo.visual === 'food' ? assets.service.food : promo.visual === 'groceries' ? assets.service.groceries : promo.visual === 'tech' ? assets.service.shops : undefined;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.v31PromoCard, { width, height }, pressed && styles.v26CardPressed]}>
      <View style={styles.v31PromoBrandRow}>
        <View style={[styles.v31PromoBrandIcon, { backgroundColor: accent }]}>
          <Ionicons name={homeBrandIcon(promo.brand)} size={15} color={darkAccent ? COLORS.white : COLORS.black} />
        </View>
        <Text numberOfLines={2} style={styles.v31PromoBrand}>{promo.brand}</Text>
      </View>
      <Text style={[styles.v31PromoEyebrow, { color: promo.accent === 'green' ? COLORS.green : promo.accent === 'yellow' ? '#A06B00' : accent }]}>{promo.eyebrow}</Text>
      <Text numberOfLines={2} style={styles.v31PromoHeadline}>{promo.headline}</Text>
      <Text numberOfLines={3} style={styles.v31PromoDetail}>{promo.detail}</Text>
      <View style={styles.v31PromoVisualArea}>
        {image ? <Image source={image} style={styles.v31PromoImage} resizeMode="contain" /> : <View style={[styles.v31PromoPharmacyVisual,{borderColor:COLORS.green}]}><Ionicons name="medical" size={35} color={COLORS.green}/></View>}
      </View>
      {promo.priceLine ? <Text numberOfLines={2} style={styles.v31PromoPrice}>{promo.priceLine}</Text> : null}
      <View style={[styles.v31PromoCta, { backgroundColor: accent }]}>
        <Text style={[styles.v31PromoCtaText, { color: darkAccent ? COLORS.white : COLORS.black }]}>{promo.cta}</Text>
      </View>
    </Pressable>
  );
}

function homeReferenceBrandLogo(brandId: string): ImageSourcePropType {
  if (brandId === 'carrefour-uganda') return assets.homeBrands.carrefour;
  if (brandId === 'jumia-uganda') return assets.homeBrands.jumia;
  if (brandId === 'glovo') return assets.homeBrands.glovo;
  if (brandId === 'goodlife-pharmacy') return assets.homeBrands.goodlife;
  return assets.homeBrands.pizzahut;
}

function localeHomePromotions(country: string, city: string): HomeRetailPromotion[] {
  if (country === 'Uganda') return HOME_RETAIL_PROMOTIONS.slice(0, 4);
  const stores = localeStores(country, city).slice(0, 4);
  const accents: HomeRetailPromotion['accent'][] = ['red', 'yellow', 'green', 'black'];
  return stores.map((store, index) => ({
    id: `locale-${country.toLowerCase()}-${store.id}`,
    brand: localisedStoreName(store, country),
    eyebrow: store.category === 'Pharmacy' ? 'HEALTH & WELLNESS' : 'LOCAL DEALS',
    headline: store.category === 'Groceries' ? 'Fresh basket picks' : store.deal,
    detail: `${store.eta} delivery around ${city}.`,
    priceLine: store.deliveryFee === 0 ? 'Free delivery on selected baskets' : `${formatMoney(country, store.deliveryFee)} delivery`,
    cta: 'Shop now',
    target: 'shops',
    visual: store.category === 'Pharmacy' ? 'pharmacy' : store.category === 'Marketplace' ? 'tech' : 'groceries',
    accent: accents[index % accents.length],
    demoLabel: 'Local demo offer',
  }));
}

function HomeRealBrands({ data, actions }: { data: AppData; actions: AppActions }) {
  const { width: viewportWidth } = useWindowDimensions();
  const brandWidth = Math.max(56, Math.min(82, (viewportWidth - 36 - 32) / 5));
  if (data.country === 'Uganda') {
    const openBrand = (brand: HomeRealBrand) => {
      const shopByBrand: Record<string, string> = {
        'carrefour-uganda': 'carrefour',
        'jumia-uganda': 'jumia',
        'goodlife-pharmacy': 'goodlife',
      };
      const shopId = shopByBrand[brand.id];
      if (shopId) {
        actions.selectShop(shopId);
        actions.go('shop');
        return;
      }
      // Food/delivery brands open the relevant discovery surface until a dedicated live merchant catalogue is connected.
      actions.go('food');
    };
    return (
      <View>
        <View style={styles.v31SectionRow}><Text style={styles.v34SectionTitle}>Big brands near you</Text><TextButton label="See all" onPress={() => actions.go('shops')} color={COLORS.red}/></View>
        <View style={styles.v34BrandList}>
          {HOME_REAL_BRANDS.map((brand) => (
            <Pressable key={brand.id} accessibilityRole="button" accessibilityLabel={`${brand.name}, ${brand.eta}`} onPress={() => openBrand(brand)} style={({pressed}) => [styles.v34BrandTile,{width:brandWidth},pressed&&styles.v26CardPressed]}>
              <View style={styles.v34BrandLogoWrap}><Image source={homeReferenceBrandLogo(brand.id)} style={styles.v34BrandLogo} resizeMode="contain" /></View>
              <Text numberOfLines={1} style={styles.v34BrandEta}>{brand.eta}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  const brands = localeStores(data.country, data.city).slice(0, 5);
  return (
    <View>
      <View style={styles.v31SectionRow}><View><Text style={styles.v34SectionTitle}>Big brands near you</Text><Text style={styles.v38SectionLocale}>{data.city}</Text></View><TextButton label="See all" onPress={() => actions.go('shops')} color={COLORS.red}/></View>
      <View style={styles.v34BrandList}>
        {brands.map((store) => (
          <Pressable key={store.id} onPress={() => { actions.selectShop(store.id); actions.go('shop'); }} style={({pressed}) => [styles.v34BrandTile,{width:brandWidth},pressed&&styles.v26CardPressed]}>
            <View style={styles.v34BrandLogoWrap}><PopularStoreLogo store={store}/></View>
            <Text numberOfLines={1} style={styles.v34BrandEta}>{store.eta}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function HomeRecentActivityCompact({ data, go }: { data: AppData; go: (screen: Screen) => void }) {
  const { width: viewportWidth } = useWindowDimensions();
  const mapWidth = Math.max(92, Math.min(124, viewportWidth * 0.27));
  const cityRegion = CITY_REGIONS[data.city] ?? KAMPALA_REGION;
  const miniRegion: Region = { ...cityRegion, latitudeDelta: Math.min(0.055, cityRegion.latitudeDelta), longitudeDelta: Math.min(0.045, cityRegion.longitudeDelta) };
  const recentStore = localeStores(data.country, data.city)[0] ?? DEMO_SHOPS[0]!;
  return (
    <View>
      <View style={styles.v31SectionRow}><Text style={styles.v34SectionTitle}>Recent activity</Text><TextButton label="See all" onPress={() => go('activity')} color={COLORS.red}/></View>
      <Pressable onPress={() => go('orders')} style={({pressed}) => [styles.v34RecentCard,pressed&&styles.v26CardPressed]}>
        <View style={styles.v34RecentBrand}><PopularStoreLogo store={recentStore}/></View>
        <View style={styles.v34RecentCopy}>
          <Text numberOfLines={1} style={styles.v34RecentTitle}>{localisedStoreName(recentStore, data.country)}</Text>
          <Text numberOfLines={1} style={styles.v34RecentMeta}>{recentStore.category} · Delivered</Text>
          <Text numberOfLines={1} style={styles.v34RecentTime}>Today, 9:15 AM</Text>
        </View>
        <View style={styles.v34RecentAmountWrap}>
          <Text numberOfLines={1} style={styles.v34RecentAmount}>{formatMoney(data.country, 45000)}</Text>
          <View style={styles.v34DeliveredPill}><Text style={styles.v34DeliveredText}>Delivered</Text></View>
        </View>
        <View style={[styles.v34RecentMapWrap,{width:mapWidth}]} pointerEvents="none">
          <MapView style={StyleSheet.absoluteFill} initialRegion={miniRegion} scrollEnabled={false} zoomEnabled={false} rotateEnabled={false} pitchEnabled={false} toolbarEnabled={false} liteMode={Platform.OS === 'android'}>
            <Marker coordinate={{latitude:miniRegion.latitude, longitude:miniRegion.longitude}}><View style={styles.v31MapPin}><Ionicons name="location" size={16} color={COLORS.white}/></View></Marker>
          </MapView>
        </View>
      </Pressable>
    </View>
  );
}


function V40HomeHeroBanner({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <Pressable onPress={() => { actions.setShopCategoryPreset('Beauty'); actions.go('shops'); }} style={({pressed})=>[styles.v40HomeHeroBanner,pressed&&styles.v26CardPressed]}>
      <View style={styles.v40HomeHeroCopy}>
        <Image source={assets.wordmark} style={styles.v40HomeHeroLogo} resizeMode="contain" />
        <Text style={styles.v40HomeHeroTitle}>Glowing{`
`}<Text style={styles.v40HomeHeroTitleAccent}>Summer</Text></Text>
        <Text style={styles.v40HomeHeroDiscount}>UP TO 70% OFF</Text>
        <Text style={styles.v40HomeHeroBody}>Top brands. Lower prices.{`
`}Delivered around {data.city}.</Text>
        <View style={styles.v40HomeHeroCta}><Text style={styles.v40HomeHeroCtaText}>Shop now</Text><Feather name="arrow-right" size={16} color={COLORS.red}/></View>
      </View>
      <View style={styles.v40HomeHeroVisual}>
        <View style={styles.v40HomeHeroFree}><Ionicons name="bicycle-outline" size={14} color={COLORS.red}/><Text style={styles.v40HomeHeroFreeText}>FREE DELIVERY</Text></View>
        <Image source={assets.shops.pharmacy} style={styles.v40HomeHeroProductA} resizeMode="contain" />
        <Image source={assets.service.shops} style={styles.v40HomeHeroProductB} resizeMode="contain" />
      </View>
    </Pressable>
  );
}

function V40NewFinds({ data, actions }: { data: AppData; actions: AppActions }) {
  const stores = localeStores(data.country, data.city).slice(0, 5);
  return (
    <View>
      <View style={styles.v40SectionHeader}><View><Text style={styles.v40SectionTitle}>New finds up to <Text style={styles.v40AccentText}>30% off</Text></Text><Text style={styles.v40SectionSub}>Discover more, spend less</Text></View><TextButton label="See all" onPress={()=>actions.go('shops')} color={COLORS.red}/></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FindsRow}>
        {stores.map((store)=><Pressable key={store.id} onPress={()=>{actions.selectShop(store.id);actions.go('shop')}} style={({pressed})=>[styles.v40FindCard,pressed&&styles.v26CardPressed]}><View style={styles.v40FindLogo}><PopularStoreLogo store={store}/></View><Text numberOfLines={1} style={styles.v40FindName}>{localisedStoreName(store,data.country)}</Text><Text style={styles.v40FindMeta}>★ {store.rating.toFixed(1)} · {store.eta}</Text><Text style={[styles.v40FindDelivery,store.deliveryFee===0&&styles.v40FindDeliveryFree]}>{store.deliveryFee===0?`${formatMoney(data.country,0)} delivery`:`${formatMoney(data.country,store.deliveryFee)} delivery`}</Text></Pressable>)}
      </ScrollView>
    </View>
  );
}

function V40PopularStores({ data, actions }: { data: AppData; actions: AppActions }) {
  const stores = localeStores(data.country, data.city).slice(0, 4);
  return (
    <View>
      <View style={styles.v40SectionHeader}><View><Text style={styles.v40SectionTitle}>Popular stores</Text><Text style={styles.v40SectionSub}>Around {data.city}</Text></View><TextButton label="See all" onPress={()=>actions.go('shops')} color={COLORS.red}/></View>
      <View style={styles.v40PopularStoreList}>{stores.map((store)=><Pressable key={store.id} onPress={()=>{actions.selectShop(store.id);actions.go('shop')}} style={({pressed})=>[styles.v40PopularStoreRow,pressed&&styles.v26CardPressed]}><View style={styles.v40PopularStoreLogo}><PopularStoreLogo store={store}/></View><View style={styles.flex}><Text numberOfLines={1} style={styles.v40PopularStoreName}>{localisedStoreName(store,data.country)}</Text><Text numberOfLines={1} style={styles.v40PopularStoreMeta}>{store.category} · {store.eta} · {store.deliveryFee===0?`${formatMoney(data.country,0)} delivery`:`${formatMoney(data.country,store.deliveryFee)} delivery`}</Text></View><View style={styles.v40PopularStoreRight}><Text style={styles.v40PopularStoreRating}>★ {store.rating.toFixed(1)}</Text><Text numberOfLines={1} style={styles.v40PopularStoreDeal}>{store.deal}</Text></View></Pressable>)}</View>
    </View>
  );
}

function V40WeekendPicks({ data, actions }: { data: AppData; actions: AppActions }) {
  const picks = DEMO_RESTAURANTS.slice(0,3);
  return (
    <View style={styles.v40WeekendPanel}>
      <View style={styles.v40WeekendLead}><Text style={styles.v40WeekendTitle}>Weekend{`
`}<Text style={styles.v40AccentText}>picks</Text></Text><Text style={styles.v40WeekendBody}>Great deals. Delivered fast.</Text><Pressable onPress={()=>actions.go('food')} style={styles.v40WeekendCta}><Text style={styles.v40WeekendCtaText}>See offers</Text><Feather name="arrow-right" size={14} color={COLORS.red}/></Pressable></View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40WeekendCards}>{picks.map((restaurant,index)=><Pressable key={restaurant.id} onPress={()=>{actions.selectRestaurant(restaurant.id);actions.go('restaurant')}} style={styles.v40WeekendCard}><Text style={styles.v40WeekendOffer}>{index===2?'Free delivery':`${30-index*5}% off`}</Text><Text numberOfLines={1} style={styles.v40WeekendRestaurant}>{localisedRestaurantName(restaurant,data.country,data.city)}</Text><Image source={assets.food[restaurant.image]} style={styles.v40WeekendImage} resizeMode="cover"/></Pressable>)}</ScrollView>
    </View>
  );
}

export function HomeScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const openService = (label: string, screen: Screen) => {
    if (label === 'Boda') selectVehicleMode(actions, 'BODA');
    if (label === 'Rides') selectVehicleMode(actions, 'RIDE');
    if (label === 'Groceries') actions.setShopCategoryPreset('Groceries');
    if (label === 'Pharmacies') actions.setShopCategoryPreset('Pharmacy');
    if (label === 'Stores') actions.setShopCategoryPreset('All');
    if (label === 'More') return actions.go('services');
    actions.go(screen);
  };
  return (
    <ScreenShell>
      <HomeHeader city={data.city} country={data.country} balance={data.walletBalance} go={actions.go} onLocation={() => { actions.setLocationReturn('home'); actions.go('locationPicker'); }} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.v40HomeScroll} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.v40HomeSearch} onPress={() => actions.go('search')}><Feather name="search" size={20} color={COLORS.black}/><Text style={styles.v40HomeSearchText}>Search for food, groceries, medicine and more</Text></Pressable>

        <Pressable onPress={() => actions.go('assistant')} style={({pressed})=>[styles.v40AiStrip,pressed&&styles.v26CardPressed]}><View style={styles.v40AiStripIcon}><Ionicons name="sparkles" size={18} color={COLORS.black}/></View><View style={styles.flex}><Text style={styles.v40AiStripTitle}>Ask Kareebu AI</Text><Text style={styles.v40AiStripBody}>Tell me what you need and I’ll recommend the best options nearby.</Text></View><Feather name="chevron-right" size={18} color={COLORS.white}/></Pressable>

        <View style={styles.v40ServiceGrid}>{homeServiceData.map((service)=><HomeServiceCard key={service.label} item={service} onPress={()=>openService(service.label,service.screen)}/>)}</View>

        <V40HomeHeroBanner data={data} actions={actions}/>
        <PromoDots count={4}/>
        <V40NewFinds data={data} actions={actions}/>
        <HomeRedeemSave go={actions.go}/>
        <HomeRealBrands data={data} actions={actions}/>
        <V40PopularStores data={data} actions={actions}/>
        <V40WeekendPicks data={data} actions={actions}/>
        <HomeFoodSection data={data} actions={actions}/>
        <HomeShopSection data={data} actions={actions}/>
        <HomeRecentActivityCompact data={data} go={actions.go}/>
        <View style={styles.v40HomeEndSpacer}><Image source={assets.wordmark} style={styles.v40HomeEndLogo} resizeMode="contain"/><Text style={styles.v40HomeEndText}>Everything you need, around {data.city}.</Text></View>
      </ScrollView>
      <BottomNav active="home" go={actions.go}/>
    </ScreenShell>
  );
}

type GlobalSearchKind = 'Service' | 'Food' | 'Shop' | 'Place' | 'Kareebu+';
type GlobalSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  kind: GlobalSearchKind;
  icon: keyof typeof Ionicons.glyphMap;
  keywords: string[];
  screen: Screen;
  ride?: RideId;
  restaurantId?: string;
  shopId?: string;
};

const GLOBAL_SEARCH_ITEMS: GlobalSearchItem[] = [
  { id:'rides', title:'Rides', subtitle:'Book a car across the city', kind:'Service', icon:'car-outline', keywords:['taxi','cab','car','ride','transport','travel'], screen:'whereTo', ride:'economy' },
  { id:'boda', title:'Boda', subtitle:'Fast motorcycle rides nearby', kind:'Service', icon:'bicycle-outline', keywords:['boda','bike','motorcycle','ride','transport'], screen:'whereTo', ride:'boda' },
  { id:'food', title:'Food', subtitle:'Restaurants, meals and delivery', kind:'Food', icon:'restaurant-outline', keywords:['food','restaurant','meal','lunch','dinner','breakfast','delivery'], screen:'food' },
  { id:'groceries', title:'Groceries', subtitle:'Supermarkets and everyday essentials', kind:'Shop', icon:'basket-outline', keywords:['groceries','supermarket','food shopping','essentials','market'], screen:'shops' },
  { id:'pharmacy', title:'Pharmacies', subtitle:'Health, medicine and wellness', kind:'Shop', icon:'medical-outline', keywords:['pharmacy','chemist','medicine','health','wellness','drugs'], screen:'shops' },
  { id:'shops', title:'Shops', subtitle:'Stores, products and local brands', kind:'Shop', icon:'bag-handle-outline', keywords:['shop','shops','store','shopping','products','marketplace'], screen:'shops' },
  { id:'parcel', title:'Send a parcel', subtitle:'Courier delivery in the city or across Uganda', kind:'Service', icon:'cube-outline', keywords:['send','parcel','package','courier','delivery','documents'], screen:'parcel' },
  { id:'wallet', title:'Wallet & Pay', subtitle:'Pay, top up and manage payment methods', kind:'Kareebu+', icon:'wallet-outline', keywords:['wallet','pay','payment','money','mtn','airtel','mobile money','top up'], screen:'wallet' },
  { id:'orders', title:'Orders', subtitle:'Track food, shopping and parcel orders', kind:'Kareebu+', icon:'receipt-outline', keywords:['order','orders','track','tracking','receipt'], screen:'orders' },
  { id:'activity', title:'Activity', subtitle:'Recent rides, purchases and deliveries', kind:'Kareebu+', icon:'time-outline', keywords:['activity','history','recent','trips','purchases'], screen:'activity' },
  { id:'account', title:'Account', subtitle:'Profile, addresses, payments and settings', kind:'Kareebu+', icon:'person-circle-outline', keywords:['account','profile','address','settings','support'], screen:'account' },
  { id:'assistant', title:'Kareebu AI', subtitle:'Ask for rides, food, shops, places or help in your own words', kind:'Kareebu+', icon:'sparkles-outline', keywords:['ai','assistant','ask','concierge','help','recommend'], screen:'assistant' },
  { id:'cafe-javas', title:'Cafe Javas', subtitle:'Restaurant · Coffee, burgers and local favourites', kind:'Food', icon:'cafe-outline', keywords:['cafe javas','coffee','burger','restaurant','food'], screen:'restaurant', restaurantId:'cafe-javas' },
  { id:'chicken-tonight', title:'Chicken Tonight', subtitle:'Restaurant · Grilled chicken and meals', kind:'Food', icon:'restaurant-outline', keywords:['chicken tonight','chicken','grill','restaurant','food'], screen:'restaurant', restaurantId:'chicken-tonight' },
  { id:'pizza-inn', title:'Pizza Inn', subtitle:'Restaurant · Pizza and fast delivery', kind:'Food', icon:'pizza-outline', keywords:['pizza inn','pizza','restaurant','food'], screen:'restaurant', restaurantId:'pizza-inn' },
  { id:'goodlife', title:'Goodlife Pharmacy', subtitle:'Pharmacy · Health and wellness', kind:'Shop', icon:'medical-outline', keywords:['goodlife','pharmacy','medicine','health'], screen:'shop', shopId:'goodlife' },
  { id:'capital-shoppers', title:'Capital Shoppers', subtitle:'Supermarket · Groceries and home', kind:'Shop', icon:'cart-outline', keywords:['capital shoppers','supermarket','groceries','shop'], screen:'shop', shopId:'capital' },
  { id:'acacia-mall', title:'Acacia Mall', subtitle:'Place · Kisementi, Kampala', kind:'Place', icon:'location-outline', keywords:['acacia mall','acacia','kisementi','destination','place'], screen:'whereTo' },
  { id:'entebbe-airport', title:'Entebbe International Airport', subtitle:'Place · Entebbe', kind:'Place', icon:'airplane-outline', keywords:['entebbe airport','airport','entebbe','destination','place'], screen:'whereTo' },
  { id:'kololo', title:'Kololo', subtitle:'Place · Kampala', kind:'Place', icon:'location-outline', keywords:['kololo','kampala','destination','place'], screen:'whereTo' },
  ...DEMO_RESTAURANTS.filter((restaurant) => !['cafe-javas','chicken-tonight','pizza-inn'].includes(restaurant.id)).map((restaurant) => ({ id:`restaurant-${restaurant.id}`, title:restaurant.name, subtitle:`Restaurant · ${restaurant.cuisine}`, kind:'Food' as const, icon:'restaurant-outline' as const, keywords:[restaurant.name,restaurant.cuisine,...restaurant.categories,...restaurant.menu.map((item)=>item.name)], screen:'restaurant' as Screen, restaurantId:restaurant.id })),
  ...DEMO_SHOPS.filter((shop) => !['goodlife','capital'].includes(shop.id)).map((shop) => ({ id:`shop-${shop.id}`, title:shop.name, subtitle:`${shop.category} · ${shop.eta}`, kind:'Shop' as const, icon:shopIconName(shop.icon), keywords:[shop.name,shop.category,shop.deal], screen:'shop' as Screen, shopId:shop.id })),
];

const GLOBAL_SEARCH_ORDER: GlobalSearchKind[] = ['Service','Food','Shop','Place','Kareebu+'];

function GlobalSearchResult({ item, onPress }: { item: GlobalSearchItem; onPress: () => void }) {
  const tone = item.kind === 'Food' ? COLORS.red : item.kind === 'Shop' ? COLORS.yellow : item.kind === 'Place' ? COLORS.black : item.kind === 'Kareebu+' ? COLORS.yellowSoft : COLORS.surface;
  const iconColor = tone === COLORS.black ? COLORS.white : COLORS.black;
  return (
    <Pressable onPress={onPress} style={({pressed}) => [styles.globalSearchResult, pressed && styles.pressed]}>
      <View style={[styles.globalSearchResultIcon,{backgroundColor:tone}]}><Ionicons name={item.icon} size={22} color={iconColor}/></View>
      <View style={styles.flex}><Text style={styles.globalSearchResultTitle}>{item.title}</Text><Text numberOfLines={1} style={styles.globalSearchResultSubtitle}>{item.subtitle}</Text></View>
      <Feather name="chevron-right" size={21} color={COLORS.muted}/>
    </Pressable>
  );
}

export function GlobalSearchScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [query,setQuery]=useState('');
  const normalized=query.trim().toLowerCase();
  const localStoreIdSet = useMemo(() => new Set(localeStoreIds(data.country, data.city)), [data.country, data.city]);
  const sourceItems = useMemo(() => {
    const localPlace: GlobalSearchItem = { id:'local-place-search', title:`Places in ${data.city}`, subtitle:`Search addresses, landmarks and destinations in ${data.country}`, kind:'Place', icon:'location-outline', keywords:[data.city,data.country,'place','address','destination','landmark'], screen:'whereTo' };
    return [
      ...GLOBAL_SEARCH_ITEMS.filter((item) => {
        if (item.kind === 'Place') return data.country === 'Uganda';
        if (item.kind !== 'Shop' || ['groceries','pharmacy','shops'].includes(item.id)) return true;
        const shopId = item.shopId ?? (item.id.startsWith('shop-') ? item.id.slice(5) : null);
        return shopId ? localStoreIdSet.has(shopId) : true;
      }).map((item) => item.id === 'parcel' ? { ...item, subtitle:`Courier delivery in ${data.city} or across ${data.country}` } : item),
      ...(data.country === 'Uganda' ? [] : [localPlace]),
    ];
  }, [data.country, data.city, localStoreIdSet]);
  const results=useMemo(() => {
    if(!normalized) return sourceItems;
    return sourceItems.filter((item) => [item.title,item.subtitle,...item.keywords].join(' ').toLowerCase().includes(normalized));
  },[normalized, sourceItems]);
  const openItem=(item:GlobalSearchItem) => {
    if(item.ride) {
      actions.setSelectedRide(item.ride);
      actions.setSelectedVehicleMode(vehicleModeForRide(item.ride));
    }
    if(item.restaurantId) actions.selectRestaurant(item.restaurantId);
    if(item.shopId) actions.selectShop(item.shopId);
    if(item.id === 'groceries') actions.setShopCategoryPreset('Groceries');
    if(item.id === 'pharmacy') actions.setShopCategoryPreset('Pharmacy');
    if(item.id === 'shops') actions.setShopCategoryPreset('All');
    actions.go(item.screen);
  };
  const popular=['Food','Boda','Groceries','Pharmacy',data.city];
  return (
    <ScreenShell>
      <View style={styles.globalSearchHeader}>
        <Pressable onPress={()=>actions.go('home')} style={styles.globalSearchBack}><Feather name="arrow-left" size={24} color={COLORS.black}/></Pressable>
        <View style={styles.globalSearchInputWrap}>
          <Feather name="search" size={22} color={COLORS.black}/>
          <TextInput autoFocus value={query} onChangeText={setQuery} placeholder={`Search Kareebu+ in ${data.city}`} placeholderTextColor={COLORS.mutedLight} style={styles.globalSearchInput} returnKeyType="search" />
          {query.length>0?<Pressable onPress={()=>setQuery('')} style={styles.globalSearchClear}><Feather name="x" size={18} color={COLORS.black}/></Pressable>:null}
        </View>
      </View>
      <KareebuContextBar label={`Search rides, food, shops and places around ${data.city}`} />
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.flex} contentContainerStyle={styles.globalSearchScroll} showsVerticalScrollIndicator={false}>
        {!normalized ? <>
          <View><Text style={styles.globalSearchTitle}>Search all of Kareebu+</Text><Text style={styles.globalSearchIntro}>One search for rides, restaurants, local stores, services and places.</Text></View>
          <View><Text style={styles.globalSearchSectionTitle}>Popular near you</Text><View style={styles.globalSearchChips}>{popular.map((label)=><Pressable key={label} onPress={()=>setQuery(label)} style={styles.globalSearchChip}><Feather name="search" size={14} color={COLORS.black}/><Text style={styles.globalSearchChipText}>{label}</Text></Pressable>)}</View></View>
          <View><Text style={styles.globalSearchSectionTitle}>Browse Kareebu+</Text><View style={styles.globalSearchBrowseGrid}>{sourceItems.slice(0,8).map((item)=><Pressable key={item.id} onPress={()=>openItem(item)} style={({pressed})=>[styles.globalSearchBrowseCard,pressed&&styles.pressed]}><View style={styles.globalSearchBrowseIcon}><Ionicons name={item.icon} size={25} color={COLORS.black}/></View><Text style={styles.globalSearchBrowseTitle}>{item.title}</Text><Text numberOfLines={2} style={styles.globalSearchBrowseSub}>{item.subtitle}</Text></Pressable>)}</View></View>
        </> : null}
        {normalized && results.length===0 ? <View style={styles.globalSearchEmpty}><View style={styles.globalSearchEmptyIcon}><Feather name="search" size={28} color={COLORS.black}/></View><Text style={styles.globalSearchEmptyTitle}>No results for “{query.trim()}”</Text><Text style={styles.globalSearchEmptyText}>Try another service, restaurant, local store, product category or place.</Text></View> : null}
        {normalized ? GLOBAL_SEARCH_ORDER.map((kind)=>{
          const group=results.filter((item)=>item.kind===kind);
          if(!group.length) return null;
          return <View key={kind} style={styles.globalSearchGroup}><Text style={styles.globalSearchSectionTitle}>{kind === 'Kareebu+' ? 'In Kareebu+' : kind === 'Food' ? 'Food & restaurants' : kind === 'Shop' ? 'Shops & essentials' : kind === 'Place' ? 'Places' : 'Services'}</Text><View style={styles.globalSearchResultList}>{group.map((item)=><GlobalSearchResult key={item.id} item={item} onPress={()=>openItem(item)}/>)}</View></View>;
        }) : null}
      </ScrollView>
    </ScreenShell>
  );
}


const ALL_SERVICE_OPTIONS: Array<{label:string; description:string; screen:Screen; image?:ImageSourcePropType; icon?:keyof typeof Ionicons.glyphMap; category?:string; mode?:VehicleMode}> = [
  { label:'Food', description:'Restaurants, takeaway and delivery', screen:'food', image:assets.service.food },
  { label:'Rides', description:'Cars for everyday trips', screen:'whereTo', image:assets.service.rides, mode:'RIDE' },
  { label:'Boda', description:'Fast motorcycle rides', screen:'whereTo', image:assets.service.boda, mode:'BODA' },
  { label:'Groceries', description:'Supermarkets and fresh essentials', screen:'shops', image:assets.service.groceries, category:'Groceries' },
  { label:'Pharmacies', description:'Health and wellness stores', screen:'shops', icon:'medical-outline', category:'Pharmacy' },
  { label:'Stores', description:'Local shops and marketplaces', screen:'shops', image:assets.service.shops, category:'All' },
  { label:'Send parcel', description:'Tracked city and intercity delivery', screen:'parcel', image:assets.service.send },
  { label:'Wallet & Pay', description:'Payments, balance and methods', screen:'wallet', image:assets.service.pay },
  { label:'Orders', description:'Track food, shops and parcels', screen:'orders', icon:'receipt-outline' },
  { label:'Activity', description:'Trips, orders and receipts', screen:'activity', icon:'time-outline' },
  { label:'Kareebu AI', description:'Ask for rides, food, shops and help in your own words', screen:'assistant', icon:'sparkles-outline' },
];


type AssistantMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: KareebuAssistantAction[];
  recommendations?: KareebuAssistantRecommendation[];
  source?: 'live' | 'demo';
};

export function KareebuAssistantScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hi — I’m Kareebu AI. I can help you find rides, food, shops, pharmacies, parcels and payments around ${data.city}. What do you need?`,
      source: process.env.EXPO_PUBLIC_KAREEBU_AI_URL ? 'live' : 'demo',
    },
  ]);
  const scrollRef = useRef<ScrollView>(null);
  const quickPrompts = [
    `Food near me in ${data.city}`,
    'Book me a Boda',
    'Find a nearby pharmacy',
    'Show grocery stores',
  ];

  const openAction = (action: KareebuAssistantAction) => {
    if (action.rideMode) selectVehicleMode(actions, action.rideMode);
    if (action.shopCategory) actions.setShopCategoryPreset(action.shopCategory);
    if (action.entityId && action.screen === 'restaurant') actions.selectRestaurant(action.entityId);
    if (action.entityId && action.screen === 'shop') actions.selectShop(action.entityId);
    actions.go(action.screen);
  };

  const send = async (text = input) => {
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    setInput('');
    const userMessage: AssistantMessage = { id: `u-${Date.now()}`, role: 'user', text: message };
    setMessages((current) => [...current, userMessage]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 40);
    const history = messages.slice(-8).map((item) => ({ role: item.role, text: item.text }));
    const reply = await askKareebuAssistant(message, { country: data.country, city: data.city, guest: data.guest, history });
    setMessages((current) => [...current, { id: `a-${Date.now()}`, role: 'assistant', text: reply.text, actions: reply.actions, recommendations: reply.recommendations, source: reply.source }]);
    setSending(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  };

  return (
    <ScreenShell>
      <View style={styles.v39AiHeader}>
        <Pressable onPress={() => actions.go('home')} style={styles.v39AiBack}><Feather name="arrow-left" size={22} color={COLORS.black}/></Pressable>
        <Image source={assets.mark} style={styles.v39AiMark} resizeMode="contain"/>
        <View style={styles.flex}><Text style={styles.v39AiHeaderTitle}>Kareebu AI</Text><Text style={styles.v39AiHeaderMeta}>{data.city} · your super-app concierge</Text></View>
        <View style={styles.v39AiLiveDot}/>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={8}>
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.v39AiMessages} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.v39AiPrivacyNote}><Ionicons name="shield-checkmark-outline" size={17} color={COLORS.black}/><Text style={styles.v39AiPrivacyText}>Ask naturally. Kareebu AI uses your selected city and country to make suggestions more relevant.</Text></View>
          {messages.map((message) => (
            <View key={message.id} style={[styles.v39AiBubble, message.role === 'user' ? styles.v39AiUserBubble : styles.v39AiAssistantBubble]}>
              {message.role === 'assistant' ? <View style={styles.v39AiBubbleBrand}><Ionicons name="sparkles" size={15} color={COLORS.black}/><Text style={styles.v39AiBubbleBrandText}>Kareebu AI</Text>{message.source === 'demo' ? <Text style={styles.v39AiDemoTag}>Demo</Text> : null}</View> : null}
              <Text style={[styles.v39AiMessageText, message.role === 'user' && styles.v39AiUserMessageText]}>{message.text}</Text>
              {message.recommendations?.length ? <View style={styles.v40AiRecommendations}>{message.recommendations.map((recommendation) => <Pressable key={`${message.id}-${recommendation.id}`} onPress={() => openAction(recommendation.action)} style={styles.v40AiRecommendationCard}><View style={styles.v40AiRecommendationTop}><Text numberOfLines={1} style={styles.v40AiRecommendationTitle}>{recommendation.title}</Text>{recommendation.badge ? <Text style={styles.v40AiRecommendationBadge}>{recommendation.badge}</Text> : null}</View><Text style={styles.v40AiRecommendationSubtitle}>{recommendation.subtitle}</Text><Text style={styles.v40AiRecommendationReason}>{recommendation.reason}</Text><View style={styles.v40AiRecommendationAction}><Text style={styles.v40AiRecommendationActionText}>{recommendation.action.label}</Text><Feather name="arrow-up-right" size={14} color={COLORS.red}/></View></Pressable>)}</View> : null}
              {message.actions?.length ? <View style={styles.v39AiActionRow}>{message.actions.map((action) => <Pressable key={`${message.id}-${action.label}`} onPress={() => openAction(action)} style={styles.v39AiActionChip}><Text style={styles.v39AiActionChipText}>{action.label}</Text><Feather name="arrow-up-right" size={14} color={COLORS.black}/></Pressable>)}</View> : null}
            </View>
          ))}
          {sending ? <View style={[styles.v39AiBubble, styles.v39AiAssistantBubble, styles.v39AiTyping]}><ActivityIndicator size="small" color={COLORS.red}/><Text style={styles.v39AiTypingText}>Kareebu AI is thinking…</Text></View> : null}
          {messages.length <= 1 ? <View><Text style={styles.v39AiTryTitle}>Try asking</Text><View style={styles.v39AiQuickWrap}>{quickPrompts.map((prompt) => <Pressable key={prompt} onPress={() => send(prompt)} style={styles.v39AiQuickChip}><Text style={styles.v39AiQuickText}>{prompt}</Text></Pressable>)}</View></View> : null}
        </ScrollView>
        <View style={styles.v39AiComposerWrap}>
          <View style={styles.v39AiComposer}>
            <TextInput value={input} onChangeText={setInput} placeholder="Ask Kareebu+ anything…" placeholderTextColor={COLORS.mutedLight} style={styles.v39AiInput} multiline maxLength={500} onSubmitEditing={() => send()} blurOnSubmit={false}/>
            <Pressable disabled={!input.trim() || sending} onPress={() => send()} style={[styles.v39AiSend, (!input.trim() || sending) && styles.v39AiSendDisabled]}><Ionicons name="arrow-up" size={20} color={COLORS.white}/></Pressable>
          </View>
          <Text style={styles.v39AiFooterNote}>AI suggestions can be wrong. Check prices, availability and trip details before confirming.</Text>
        </View>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

export function AllServicesScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const open = (item: typeof ALL_SERVICE_OPTIONS[number]) => {
    if (item.mode) selectVehicleMode(actions, item.mode);
    if (item.category) actions.setShopCategoryPreset(item.category);
    actions.go(item.screen);
  };
  return (
    <ScreenShell>
      <Header title="All services" onBack={()=>actions.go('home')}/>
      <KareebuContextBar label={`Everything Kareebu+ can do around ${data.city}`} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.v38ServicesScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.v38ServicesIntro}>Choose what you need. Kareebu+ keeps the same delivery location, payment methods and activity across every service.</Text>
        <View style={styles.v38ServicesGrid}>
          {ALL_SERVICE_OPTIONS.map((item)=><Pressable key={item.label} onPress={()=>open(item)} style={({pressed})=>[styles.v38ServiceCard,pressed&&styles.v26CardPressed]}>
            <View style={styles.v38ServiceIconWrap}>{item.image?<Image source={item.image} style={styles.v38ServiceImage} resizeMode="contain"/>:<Ionicons name={item.icon ?? 'grid-outline'} size={29} color={COLORS.black}/>}</View>
            <Text style={styles.v38ServiceTitle}>{item.label}</Text>
            <Text style={styles.v38ServiceBody}>{item.description}</Text>
            <Feather name="arrow-up-right" size={18} color={COLORS.red}/>
          </Pressable>)}
        </View>
      </ScrollView>
      <BottomNav active="home" go={actions.go}/>
    </ScreenShell>
  );
}

type StorefrontProduct = { id:string; name:string; detail:string; basePrice:number; icon:keyof typeof Ionicons.glyphMap };

function storefrontProducts(store: DemoShop): StorefrontProduct[] {
  if (store.category === 'Pharmacy') return [
    {id:'wellness',name:'Daily wellness essentials',detail:'Everyday vitamins and self-care',basePrice:18000,icon:'medical-outline'},
    {id:'first-aid',name:'First aid essentials',detail:'Home and travel basics',basePrice:24000,icon:'medkit-outline'},
    {id:'personal-care',name:'Personal care bundle',detail:'Daily hygiene essentials',basePrice:32000,icon:'sparkles-outline'},
    {id:'baby-care',name:'Baby care essentials',detail:'Gentle everyday care',basePrice:28000,icon:'heart-outline'},
    {id:'skin-care',name:'Skin care picks',detail:'Cleansing and moisturising',basePrice:35000,icon:'water-outline'},
    {id:'oral-care',name:'Oral care pack',detail:'Brush, paste and rinse',basePrice:22000,icon:'medical-outline'},
  ];
  if (store.category === 'Marketplace' || store.category === 'Electronics') return [
    {id:'power-bank',name:'20,000mAh power bank',detail:'Fast-charge portable battery',basePrice:85000,icon:'battery-charging-outline'},
    {id:'earbuds',name:'Wireless earbuds',detail:'Compact everyday audio',basePrice:72000,icon:'headset-outline'},
    {id:'charger',name:'Fast wall charger',detail:'USB-C charging adapter',basePrice:45000,icon:'flash-outline'},
    {id:'cable',name:'USB-C cable',detail:'Durable charging cable',basePrice:22000,icon:'link-outline'},
    {id:'phone-case',name:'Protective phone case',detail:'Shock-resistant cover',basePrice:30000,icon:'phone-portrait-outline'},
    {id:'speaker',name:'Portable speaker',detail:'Bluetooth audio',basePrice:95000,icon:'volume-high-outline'},
  ];
  return [
    {id:'milk',name:'Fresh milk',detail:'1 litre',basePrice:4500,icon:'water-outline'},
    {id:'bread',name:'Fresh bread',detail:'Family loaf',basePrice:5500,icon:'restaurant-outline'},
    {id:'rice',name:'Premium rice',detail:'2 kg bag',basePrice:16000,icon:'basket-outline'},
    {id:'oil',name:'Cooking oil',detail:'2 litre bottle',basePrice:18000,icon:'water-outline'},
    {id:'fruit',name:'Fresh fruit basket',detail:'Seasonal selection',basePrice:24000,icon:'nutrition-outline'},
    {id:'home',name:'Home essentials pack',detail:'Cleaning and household basics',basePrice:38000,icon:'home-outline'},
  ];
}

export function StorefrontScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const local = localeStores(data.country, data.city);
  const store = local.find((item)=>item.id===data.selectedShopId) ?? local[0] ?? DEMO_SHOPS[0]!;
  const [query,setQuery]=useState('');
  const [basket,setBasket]=useState<Record<string,number>>({});
  const [basketOpen,setBasketOpen]=useState(false);
  const favorite=data.favoriteShopIds.includes(store.id);
  const allProducts=storefrontProducts(store);
  const products=allProducts.filter((item)=>!query.trim()||`${item.name} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  const count=Object.values(basket).reduce((sum,n)=>sum+n,0);
  const total=allProducts.reduce((sum,item)=>sum+item.basePrice*(basket[item.id]??0),0);
  const basketItems=allProducts.filter((item)=>(basket[item.id]??0)>0);
  const minimumRemaining=Math.max(0,store.minOrder-total);
  const orderTotal=total+store.deliveryFee;
  const change=(id:string,delta:number)=>setBasket((current)=>{const next={...current};const value=Math.max(0,(next[id]??0)+delta);if(value===0)delete next[id];else next[id]=value;return next;});
  return (
    <ScreenShell>
      <Header onBack={()=>actions.go('shops')} right={<Pressable onPress={()=>actions.toggleFavoriteShop(store.id)} style={styles.v30HeaderHeart}><Ionicons name={favorite?'heart':'heart-outline'} size={25} color={favorite?COLORS.red:COLORS.black}/></Pressable>}/>
      <ScrollView style={styles.flex} contentContainerStyle={styles.v38StorefrontScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.v38StorefrontHero}>
          <View style={styles.v38StorefrontLogo}><PopularStoreLogo store={store}/></View>
          <Text style={styles.v38StorefrontName}>{localisedStoreName(store,data.country)}</Text>
          <Text style={styles.v38StorefrontMeta}>{store.category} · {store.rating.toFixed(1)} ★ · {store.eta}</Text>
          <View style={styles.v38StorefrontDeal}><Ionicons name="pricetag-outline" size={16} color={COLORS.red}/><Text style={styles.v38StorefrontDealText}>{store.deal}</Text></View>
        </View>
        <View style={styles.v25SearchBar}><Feather name="search" size={21} color={COLORS.black}/><TextInput value={query} onChangeText={setQuery} placeholder={`Search ${localisedStoreName(store,data.country)}`} placeholderTextColor={COLORS.mutedLight} style={styles.v30CommerceSearchInput}/>{query?<Pressable onPress={()=>setQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.muted}/></Pressable>:null}</View>
        <View style={styles.v38StorefrontInfoRow}><View><Text style={styles.v38StorefrontInfoLabel}>Delivery</Text><Text style={styles.v38StorefrontInfoValue}>{store.deliveryFee===0?'Free':formatMoney(data.country,store.deliveryFee)}</Text></View><View><Text style={styles.v38StorefrontInfoLabel}>Minimum</Text><Text style={styles.v38StorefrontInfoValue}>{formatMoney(data.country,store.minOrder)}</Text></View><View><Text style={styles.v38StorefrontInfoLabel}>Location</Text><Text style={styles.v38StorefrontInfoValue}>{data.city}</Text></View></View>
        <SectionTitle title="Popular products" />
        <View style={styles.v38ProductGrid}>{products.map((item)=>{const qty=basket[item.id]??0;return <View key={item.id} style={styles.v38ProductCard}><View style={styles.v38ProductVisual}><Ionicons name={item.icon} size={34} color={COLORS.black}/></View><Text numberOfLines={2} style={styles.v38ProductName}>{item.name}</Text><Text numberOfLines={1} style={styles.v38ProductDetail}>{item.detail}</Text><Text style={styles.v38ProductPrice}>{formatMoney(data.country,item.basePrice)}</Text>{qty===0?<Pressable onPress={()=>change(item.id,1)} style={styles.v38ProductAdd}><Text style={styles.v38ProductAddText}>Add</Text></Pressable>:<View style={styles.v38ProductQty}><Pressable onPress={()=>change(item.id,-1)}><Feather name="minus" size={16}/></Pressable><Text style={styles.v38ProductQtyText}>{qty}</Text><Pressable onPress={()=>change(item.id,1)}><Feather name="plus" size={16}/></Pressable></View>}</View>})}</View>
      </ScrollView>
      {count>0?<Pressable onPress={()=>setBasketOpen(true)} style={styles.v38StoreBasketBar}><View style={styles.v38StoreBasketCount}><Text style={styles.v38StoreBasketCountText}>{count}</Text></View><Text style={styles.v38StoreBasketLabel}>View basket</Text><Text style={styles.v38StoreBasketTotal}>{formatMoney(data.country,total)}</Text><Feather name="chevron-right" size={21} color={COLORS.white}/></Pressable>:null}
      <Modal visible={basketOpen} transparent animationType="slide" onRequestClose={()=>setBasketOpen(false)}>
        <Pressable style={styles.v38BasketBackdrop} onPress={()=>setBasketOpen(false)}>
          <Pressable style={styles.v38BasketSheet} onPress={(event)=>event.stopPropagation()}>
            <View style={styles.v38BasketHandle}/>
            <View style={styles.v38BasketHeader}><View><Text style={styles.v38BasketTitle}>Your basket</Text><Text style={styles.v38BasketMeta}>{localisedStoreName(store,data.country)} · {count} {count===1?'item':'items'}</Text></View><Pressable onPress={()=>setBasketOpen(false)} style={styles.v38BasketClose}><Feather name="x" size={20} color={COLORS.black}/></Pressable></View>
            <ScrollView style={styles.v38BasketItems} showsVerticalScrollIndicator={false}>
              {basketItems.map((item)=>{const qty=basket[item.id]??0;return <View key={item.id} style={styles.v38BasketRow}><View style={styles.v38BasketRowIcon}><Ionicons name={item.icon} size={22} color={COLORS.black}/></View><View style={styles.flex}><Text style={styles.v38BasketRowName}>{item.name}</Text><Text style={styles.v38BasketRowPrice}>{formatMoney(data.country,item.basePrice*qty)}</Text></View><View style={styles.v38ProductQty}><Pressable onPress={()=>change(item.id,-1)}><Feather name="minus" size={15}/></Pressable><Text style={styles.v38ProductQtyText}>{qty}</Text><Pressable onPress={()=>change(item.id,1)}><Feather name="plus" size={15}/></Pressable></View></View>})}
            </ScrollView>
            <View style={styles.v38BasketSummary}><View style={styles.v38BasketSummaryRow}><Text style={styles.v38BasketSummaryLabel}>Items</Text><Text style={styles.v38BasketSummaryValue}>{formatMoney(data.country,total)}</Text></View><View style={styles.v38BasketSummaryRow}><Text style={styles.v38BasketSummaryLabel}>Delivery</Text><Text style={styles.v38BasketSummaryValue}>{store.deliveryFee===0?'Free':formatMoney(data.country,store.deliveryFee)}</Text></View><View style={[styles.v38BasketSummaryRow,styles.v38BasketTotalRow]}><Text style={styles.v38BasketTotalLabel}>Total</Text><Text style={styles.v38BasketTotalValue}>{formatMoney(data.country,orderTotal)}</Text></View></View>
            {minimumRemaining>0?<View style={styles.v38BasketMinimum}><Ionicons name="information-circle-outline" size={17} color={COLORS.red}/><Text style={styles.v38BasketMinimumText}>Add {formatMoney(data.country,minimumRemaining)} more to reach this store’s minimum order.</Text></View>:null}
            <Pressable disabled={minimumRemaining>0} onPress={()=>{setBasketOpen(false);Alert.alert('Demo checkout','Your basket is ready. Production checkout will confirm address, payment and stock before placing the order.');actions.go('orders');}} style={[styles.v38BasketCheckout,minimumRemaining>0&&styles.buttonDisabled]}><Text style={styles.v38BasketCheckoutText}>{minimumRemaining>0?'Minimum not reached':'Continue to checkout'}</Text></Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenShell>
  );
}

export function LocationPickerScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const cityRegion = CITY_REGIONS[data.city] ?? KAMPALA_REGION;
  // Manual city selection should never trigger a surprise permission prompt.
  // GPS is requested only when the customer explicitly taps “Use my location” on the city screen.
  const onboardingLocation = false;
  const searchRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection | null>(data.deliveryPlace);
  const [focusCoordinate, setFocusCoordinate] = useState<{ latitude: number; longitude: number } | null>(
    data.deliveryPlace ? { latitude: data.deliveryPlace.latitude, longitude: data.deliveryPlace.longitude } : null,
  );
  const [pinCoordinate, setPinCoordinate] = useState<{ latitude: number; longitude: number }>(
    focusCoordinate ?? { latitude: cityRegion.latitude, longitude: cityRegion.longitude },
  );
  const [zoomedIn, setZoomedIn] = useState(Boolean(data.deliveryPlace));
  const [confirming, setConfirming] = useState(false);
  const places = usePlaceAutocomplete(query, {
    countryCode: countryCodeFor(data.country),
    bias: { latitude: cityRegion.latitude, longitude: cityRegion.longitude, radiusMeters: 55000 },
  });

  const finish = async (resolvePin = true) => {
    if (confirming) return;
    setConfirming(true);
    let finalPlace = selectedPlace;
    if (!finalPlace && resolvePin) {
      try {
        finalPlace = await reverseGeocodePlace(pinCoordinate.latitude, pinCoordinate.longitude);
      } catch {
        // The centre pin remains usable if reverse geocoding is temporarily unavailable.
      }
    }
    actions.setDeliveryPlace(finalPlace ?? {
      placeId: `pin-${pinCoordinate.latitude.toFixed(5)}-${pinCoordinate.longitude.toFixed(5)}`,
      name: `${data.city} delivery location`,
      address: `${data.city}, ${data.country}`,
      latitude: pinCoordinate.latitude,
      longitude: pinCoordinate.longitude,
      types: ['street_address'],
      provider: 'manual',
    });
    const next = data.locationReturn;
    actions.setLocationReturn('home');
    actions.go(next);
    setConfirming(false);
  };

  const chooseSuggestion = async (suggestion: PlaceSuggestion) => {
    try {
      const details = await resolvePlaceSuggestion(suggestion, places.sessionToken);
      setSelectedPlace(details);
      setQuery(details.name);
      setFocusCoordinate({ latitude: details.latitude, longitude: details.longitude });
      setPinCoordinate({ latitude: details.latitude, longitude: details.longitude });
      setZoomedIn(true);
      places.resetSession();
    } catch {
      // Keep the map available so the customer can still place the pin manually.
    }
  };

  const readyToConfirm = zoomedIn || Boolean(selectedPlace);

  return (
    <ScreenShell contentStyle={styles.v36LocationScreen}>
      <View style={styles.v36LocationMapLayer}>
        <InteractiveKareebuMap
          mode="picker"
          initialRegion={cityRegion}
          focusCoordinate={focusCoordinate}
          requestLocationOnMount={onboardingLocation}
          onLocationPermissionChange={actions.setLocationAllowed}
          onPinChange={(coordinate) => setPinCoordinate(coordinate)}
          pickerPinMode="center"
          pickerPinColor={COLORS.black}
          hidePickerControls
          onMapRegionChange={(region) => setZoomedIn(region.latitudeDelta <= 0.085)}
        />
      </View>

      <View style={styles.v38LocationTopbar}>
        <Pressable onPress={() => actions.go('city')} style={styles.v38LocationBack} hitSlop={10}>
          <Feather name="arrow-left" size={21} color={COLORS.black} />
        </Pressable>
        <View style={styles.v38LocationBrandRow}>
          <Image source={assets.mark} style={styles.v38LocationBrandMark} resizeMode="contain" />
          <View><Text style={styles.v38LocationBrandTitle}>Set your location</Text><Text style={styles.v38LocationBrandMeta}>{data.city}, {data.country} · 3 of 3</Text></View>
        </View>
      </View>

      <View style={styles.v36LocationSearchWrap}>
        <View style={styles.v36LocationSearch}>
          <TextInput
            ref={searchRef}
            value={query}
            onChangeText={(value) => { setQuery(value); if (selectedPlace && value !== selectedPlace.name) setSelectedPlace(null); }}
            placeholder="Search for your building, area..."
            placeholderTextColor={COLORS.muted}
            returnKeyType="search"
            style={styles.v36LocationSearchInput}
          />
          {places.loading ? <Text style={styles.placesLoadingText}>•••</Text> : query ? <Pressable onPress={() => { setQuery(''); setSelectedPlace(null); }} hitSlop={10}><Ionicons name="close-circle" size={20} color={COLORS.muted} /></Pressable> : <Feather name="search" size={25} color={COLORS.black} />}
        </View>
        {query.trim().length >= 2 && places.suggestions.length ? (
          <View style={styles.v36PlacesOverlay}>
            {places.suggestions.slice(0, 5).map((suggestion) => (
              <Pressable key={suggestion.placeId} onPress={() => void chooseSuggestion(suggestion)} style={styles.placesSuggestionRow}>
                <View style={styles.placesSuggestionIcon}><Ionicons name="location-outline" size={19} color={COLORS.black} /></View>
                <View style={styles.flex}><Text numberOfLines={1} style={styles.placesSuggestionTitle}>{suggestion.primaryText}</Text><Text numberOfLines={1} style={styles.placesSuggestionSubtitle}>{suggestion.secondaryText}</Text></View>
                <Feather name="arrow-up-left" size={17} color={COLORS.muted} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.v36LocationSheet}>
        <View style={styles.v36LocationInstructionCard}>
          <View style={styles.v36LocationInstructionIcon}><MaterialCommunityIcons name="image-filter-center-focus" size={25} color={COLORS.black} /></View>
          <View style={styles.flex}>
            <Text style={styles.v36LocationInstructionTitle}>{readyToConfirm ? (selectedPlace?.name || 'Set this location') : 'Zoom in'}</Text>
            <Text numberOfLines={2} style={styles.v36LocationInstructionBody}>{selectedPlace?.address || (readyToConfirm ? 'Move the map until the pin is exactly where you want deliveries.' : 'Pinch in or search to find your location')}</Text>
          </View>
        </View>
        <Pressable
          disabled={confirming}
          onPress={() => readyToConfirm ? void finish(true) : searchRef.current?.focus()}
          style={[styles.v36LocationPrimary, confirming && styles.buttonDisabled]}
        >
          <Text style={styles.v36LocationPrimaryText}>{confirming ? 'Confirming…' : readyToConfirm ? 'Confirm location' : 'Search for your location'}</Text>
        </Pressable>
        <Pressable disabled={confirming} onPress={() => void finish(false)} style={styles.v36LocationSkip}>
          <Text style={styles.v36LocationSkipText}>Skip for now</Text>
        </Pressable>
        <Text style={styles.v36LocationAttribution}>{placeAttribution()}</Text>
      </View>
    </ScreenShell>
  );
}

function VehicleModeSelector({ value, onChange }: { value: VehicleMode; onChange: (mode: VehicleMode) => void }) {
  return (
    <View style={styles.vehicleModeSelector}>
      {(['RIDE', 'BODA'] as VehicleMode[]).map((mode) => {
        const selected = value === mode;
        const config = VEHICLE_MODE_CONFIG[mode];
        return (
          <Pressable key={mode} onPress={() => onChange(mode)} style={[styles.vehicleModeOption, selected && styles.vehicleModeOptionSelected]}>
            <Image source={config.marker} style={styles.vehicleModeOptionImage} resizeMode="contain" />
            <View style={styles.flex}>
              <Text style={[styles.vehicleModeOptionTitle, selected && styles.vehicleModeOptionTitleSelected]}>{config.label}</Text>
              <Text style={[styles.vehicleModeOptionMeta, selected && styles.vehicleModeOptionMetaSelected]}>{mode === 'BODA' ? 'Motorbike' : 'Car'}</Text>
            </View>
            <View style={[styles.vehicleModeRadio, selected && styles.vehicleModeRadioSelected]}>{selected ? <View style={styles.vehicleModeRadioDot} /> : null}</View>
          </Pressable>
        );
      })}
    </View>
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

export function WhereToScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const cityRegion = CITY_REGIONS[data.city] ?? KAMPALA_REGION;
  const places = useMemo(() => localRideSuggestions(data), [data.city, data.country]);
  const [destination, setDestination] = useState(data.destinationPlace?.name ?? '');
  const placeSearch = usePlaceAutocomplete(destination, {
    countryCode: countryCodeFor(data.country),
    bias: { latitude: cityRegion.latitude, longitude: cityRegion.longitude, radiusMeters: 70000 },
  });
  const routeState = useRouteEstimate(pickupCoordinate(data), data.destinationPlace ? destinationCoordinate(data) : null, data.selectedVehicleMode);
  const localResults = useMemo(() => {
    const term = destination.trim().toLowerCase();
    if (!term) return places;
    return places.filter((place) => `${place.title} ${place.subtitle}`.toLowerCase().includes(term));
  }, [destination, places]);

  const chooseLocalPlace = (place: LocalRideSuggestion) => {
    actions.setDestinationPlace({ placeId: `local-${place.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name: place.title, address: place.subtitle, latitude: place.latitude, longitude: place.longitude, types: ['point_of_interest'], provider: 'manual' });
    setDestination(place.title);
  };

  const chooseSearchPlace = async (suggestion: PlaceSuggestion) => {
    try {
      const details = await resolvePlaceSuggestion(suggestion, placeSearch.sessionToken);
      actions.setDestinationPlace(details);
      setDestination(details.name);
      placeSearch.resetSession();
    } catch {
      // Keep local suggestions usable when remote search is unavailable.
    }
  };

  const showingRemote = destination.trim().length >= 2 && placeSearch.suggestions.length > 0;
  const canContinue = Boolean(data.destinationPlace);

  return (
    <ScreenShell>
      <View style={styles.v40WhereHeader}><Pressable onPress={()=>actions.go('home')} style={styles.v40CircleBack}><Feather name="arrow-left" size={23} color={COLORS.black}/></Pressable><Text style={styles.v40WhereTitle}>Where to?</Text><View style={styles.v40CircleBackPlaceholder}/></View>
      <View style={styles.v40WhereRouteCard}>
        <View style={styles.v40WhereRouteRow}><View style={styles.v40WherePickupDot}/><View style={styles.flex}><Text numberOfLines={1} style={styles.v40WhereRouteValue}>{pickupLabel(data)}</Text><Text style={styles.v40WhereRouteLabel}>Pickup location</Text></View><Pressable onPress={()=>{actions.setLocationReturn('whereTo');actions.go('locationPicker')}} style={styles.v40WhereChange}><Text style={styles.v40WhereChangeText}>Change</Text></Pressable></View>
        <View style={styles.v40WhereConnector}/>
        <View style={styles.v40WhereRouteRow}><View style={styles.v40WhereDestinationDot}/><View style={styles.flex}><TextInput value={destination} onChangeText={(value)=>{setDestination(value);if(data.destinationPlace&&value!==data.destinationPlace.name)actions.setDestinationPlace(null)}} placeholder="Add destination" placeholderTextColor={COLORS.muted} style={styles.v40WhereDestinationInput} returnKeyType="search"/><Text style={styles.v40WhereRouteLabel}>{data.destinationPlace?.address || 'Search a place, landmark or address'}</Text></View>{destination?<Pressable onPress={()=>{setDestination('');actions.setDestinationPlace(null)}} style={styles.v40WhereAdd}><Feather name="x" size={21} color={COLORS.black}/></Pressable>:<View style={styles.v40WhereAdd}><Feather name="plus" size={22} color={COLORS.black}/></View>}</View>
      </View>

      <View style={styles.v40WhereMapWrap}>
        <InteractiveKareebuMap mode="route" vehicleMode={data.selectedVehicleMode} originCoordinate={pickupCoordinate(data)} destinationCoordinate={data.destinationPlace ? destinationCoordinate(data) : null} routePath={routeState.route?.coordinates} destinationLabel={destinationLabel(data)}/>
        {routeState.route ? <View style={styles.v40WhereEtaBubble}><Text style={styles.v40WhereEtaText}>{formatRouteDuration(routeState.route.durationSeconds)}</Text></View> : null}
        <View style={styles.v40WhereRouteMeta}><Ionicons name={data.selectedVehicleMode==='BODA'?'bicycle-outline':'car-outline'} size={15} color={COLORS.black}/><Text style={styles.v40WhereRouteMetaText}>{routeState.loading?'Calculating route…':routeState.route?`${formatRouteDistance(routeState.route.distanceMeters)} · ${routingAttribution()}`:`Explore ${data.city}`}</Text></View>
      </View>

      <View style={styles.v40WhereSheet}>
        <View style={styles.v40WhereHandle}/>
        <Text style={styles.v40WhereSuggestedTitle}>{destination ? 'Places & suggestions' : 'Suggested places'}</Text>
        <ScrollView style={styles.v40WhereSuggestionScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {showingRemote ? placeSearch.suggestions.slice(0,6).map((suggestion)=><Pressable key={suggestion.placeId} onPress={()=>void chooseSearchPlace(suggestion)} style={styles.v40WhereSuggestionRow}><View style={styles.v40WhereSuggestionIcon}><Ionicons name="location-outline" size={19} color={COLORS.black}/></View><View style={styles.flex}><Text numberOfLines={1} style={styles.v40WhereSuggestionName}>{suggestion.primaryText}</Text><Text numberOfLines={1} style={styles.v40WhereSuggestionAddress}>{suggestion.secondaryText}</Text></View><Feather name="chevron-right" size={20} color={COLORS.black}/></Pressable>) : localResults.slice(0,6).map((place)=><Pressable key={place.title} onPress={()=>chooseLocalPlace(place)} style={styles.v40WhereSuggestionRow}><View style={styles.v40WhereSuggestionIcon}><Ionicons name={place.icon} size={19} color={COLORS.black}/></View><View style={styles.flex}><Text style={styles.v40WhereSuggestionName}>{place.title}</Text><Text style={styles.v40WhereSuggestionAddress}>{place.subtitle}</Text></View><Feather name="chevron-right" size={20} color={COLORS.black}/></Pressable>)}
        </ScrollView>
        {canContinue ? <Pressable onPress={()=>actions.go('chooseRide')} style={styles.v40WhereContinue}><Text style={styles.v40WhereContinueText}>See ride options</Text><Feather name="arrow-right" size={18} color={COLORS.white}/></Pressable> : null}
      </View>
    </ScreenShell>
  );
}


function KareebuContextBar({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <View style={[styles.v30ContextBar, dark && styles.v30ContextBarDark]}>
      <Image source={assets.mark} style={styles.v30ContextMark} resizeMode="contain" />
      <Text style={[styles.v30ContextText, dark && styles.v30ContextTextDark]}>{label}</Text>
      <View style={styles.v30ContextBars}><View style={[styles.v30ContextBarDash,{backgroundColor:COLORS.black}]} /><View style={[styles.v30ContextBarDash,{backgroundColor:COLORS.yellow}]} /><View style={[styles.v30ContextBarDash,{backgroundColor:COLORS.red}]} /></View>
    </View>
  );
}

function DemoDirectionsCard({ data, compact = false }: { data: AppData; compact?: boolean }) {
  const directions = demoDirections(data.selectedVehicleMode, destinationLabel(data));
  return (
    <RoundedCard style={[styles.v30DirectionsCard, compact && styles.v30DirectionsCardCompact]}>
      <View style={styles.v30DirectionsHeader}>
        <View style={styles.v30DirectionsIcon}><Ionicons name={data.selectedVehicleMode === 'BODA' ? 'bicycle-outline' : 'car-outline'} size={21} color={COLORS.black}/></View>
        <View style={styles.flex}><Text style={styles.v30DirectionsTitle}>{directions.routeName}</Text><Text style={styles.v30DirectionsSummary}>{directions.summary}</Text></View>
        <View style={styles.v30TrafficPill}><View style={styles.liveDot}/><Text style={styles.v30TrafficText}>{directions.traffic}</Text></View>
      </View>
      {!compact ? <View style={styles.v30DirectionSteps}>{directions.steps.map((step,index)=><View key={`${step.instruction}-${index}`} style={styles.v30DirectionStep}><View style={styles.v30DirectionStepIcon}><Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={18} color={index===directions.steps.length-1?COLORS.red:COLORS.black}/></View><Text style={styles.v30DirectionInstruction}>{step.instruction}</Text><Text style={styles.v30DirectionDistance}>{step.distance}</Text></View>)}</View> : null}
      <Text style={styles.v30DirectionsDemoNote}>Demo navigation guidance · live routing uses the configured route provider.</Text>
    </RoundedCard>
  );
}

function RideOption({ item, country, selected, onPress }: { item: typeof rideData[number]; country: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.rideOption, selected && styles.rideOptionSelected, pressed && styles.pressed]}>
      <Image source={item.icon} style={styles.rideIcon} resizeMode="contain" />
      <View style={styles.flex}><Text style={styles.rideName}>{item.name}</Text><Text style={styles.rideEta}>{item.eta}</Text></View>
      <Text style={styles.rideFare}>{formatMoney(country, item.baseFare)}</Text>
      <View style={[styles.rideRadio, selected && styles.rideRadioSelected]}>{selected ? <Feather name="check" size={15} color={COLORS.white} /> : null}</View>
    </Pressable>
  );
}

function RideVehicleVisual({ rideId }: { rideId: RideId }) {
  if (rideId === 'boda') return <Image source={assets.service.boda} style={styles.v40RideImage} resizeMode="contain"/>;
  if (rideId === 'delivery') return <Image source={assets.service.send} style={[styles.v40RideImage, styles.v40DeliveryImage]} resizeMode="contain"/>;
  const icon = rideId === 'economy' ? 'car-hatchback' : rideId === 'comfort' ? 'car-sports' : 'car-estate';
  return <View style={[styles.v40RideNativeVehicle, rideId === 'comfort' && styles.v40RideNativeVehicleComfort, rideId === 'xl' && styles.v40RideNativeVehicleXL]}><MaterialCommunityIcons name={icon as any} size={rideId === 'xl' ? 67 : 62} color={COLORS.black}/></View>;
}

export function ChooseRideScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const selected = rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0];
  const routeState = useRouteEstimate(pickupCoordinate(data), destinationCoordinate(data), data.selectedVehicleMode);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const scheduleOptions = ['In 30 minutes', 'Tonight · 7:00 PM', 'Tomorrow · 8:00 AM'];
  const descriptions: Record<RideId, string> = {
    boda: 'Fastest through city traffic',
    economy: 'Affordable everyday car',
    comfort: 'Newer car · extra comfort',
    xl: 'More room · up to 6 riders',
    delivery: 'Small parcel or item delivery',
  };
  const selectRide = (ride: typeof rideData[number]) => {
    actions.setSelectedRide(ride.id);
    actions.setSelectedVehicleMode(vehicleModeForRide(ride.id));
  };
  return (
    <ScreenShell>
      <View style={styles.v40RideHeader}><Pressable onPress={()=>actions.go('whereTo')} style={styles.v40CircleBack}><Feather name="arrow-left" size={23} color={COLORS.black}/></Pressable><View style={styles.flex}><Text style={styles.v40RideHeaderTitle}>Choose ride</Text><Text style={styles.v40RideHeaderSub}>{routeState.loading?'Calculating route…':routeState.route?`${formatRouteDistance(routeState.route.distanceMeters)} · ${formatRouteDuration(routeState.route.durationSeconds)}`:`${pickupLabel(data)} → ${destinationLabel(data)}`}</Text></View><View style={styles.v40CircleBackPlaceholder}/></View>
      <ScrollView style={styles.flex} contentContainerStyle={styles.v40RideScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.v40RideList}>
          {rideData.map((ride)=>{const active=data.selectedRide===ride.id;return <Pressable key={ride.id} onPress={()=>selectRide(ride)} style={({pressed})=>[styles.v40RideCard,active&&styles.v40RideCardActive,pressed&&styles.v26CardPressed]}><View style={styles.v40RideImageWrap}><RideVehicleVisual rideId={ride.id}/></View><View style={styles.flex}><Text style={styles.v40RideName}>{ride.name}</Text><Text style={styles.v40RideEta}>{ride.eta}</Text><Text numberOfLines={1} style={styles.v40RideDescription}>{descriptions[ride.id]}</Text></View><View style={styles.v40RidePriceWrap}><Text style={styles.v40RidePrice}>{formatMoney(data.country,ride.baseFare)}</Text><View style={[styles.v40RideRadio,active&&styles.v40RideRadioActive]}>{active?<View style={styles.v40RideRadioDot}/>:null}</View></View></Pressable>})}
        </View>

        <Pressable onPress={()=>setScheduleOpen(true)} style={({pressed})=>[styles.v40RideUtilityCard,pressed&&styles.v26CardPressed]}><View style={styles.v40RideUtilityIcon}><Ionicons name="calendar-outline" size={27} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.v40RideUtilityTitle}>Scheduled</Text><Text style={styles.v40RideUtilitySub}>{data.scheduledTrip ?? 'Book for later'}</Text></View>{data.scheduledTrip?<Pressable hitSlop={10} onPress={()=>actions.setScheduledTrip(null)}><Ionicons name="close-circle" size={22} color={COLORS.muted}/></Pressable>:<Feather name="chevron-right" size={22} color={COLORS.black}/>}</Pressable>

        <View style={styles.v40RidePayment}><LocalPaymentLogo id={data.selectedPayment} country={data.country}/><View style={styles.flex}><Text style={styles.v40RidePaymentTitle}>{paymentMethodTitle(data.selectedPayment,data.country)}</Text><Text style={styles.v40RidePaymentSub}>Selected payment method</Text></View><TextButton label="Change" onPress={()=>setPaymentOpen(true)} color={COLORS.red}/></View>

        <Pressable onPress={()=>{if(selected.id==='delivery'){actions.go('parcel');return;}if(data.guest){actions.setAuthReturn('confirmBooking');actions.go('phone');}else actions.go('confirmBooking')}} style={({pressed})=>[styles.v40RideConfirm,pressed&&styles.v26CardPressed]}><Text style={styles.v40RideConfirmText}>{selected.id==='delivery'?'Continue to delivery':data.guest?`Sign in to book ${selected.name}`:`Confirm ${selected.name}`}</Text></Pressable>
        <View style={styles.v40RideFareFooter}><Text style={styles.v40RideFareLabel}>Estimated fare</Text><Text style={styles.v40RideFareValue}>{formatMoney(data.country,selected.baseFare)}</Text></View>
        <Text style={styles.v40RideFareNote}>Final fare is shown before dispatch. Live route and demand can affect the estimate.</Text>
      </ScrollView>
      <Modal visible={scheduleOpen} transparent animationType="fade" onRequestClose={()=>setScheduleOpen(false)}>
        <Pressable style={styles.v404ScheduleBackdrop} onPress={()=>setScheduleOpen(false)}>
          <Pressable style={styles.v404ScheduleSheet} onPress={(event)=>event.stopPropagation()}>
            <View style={styles.v404ScheduleHandle}/><Text style={styles.v404ScheduleTitle}>Schedule pickup</Text><Text style={styles.v404ScheduleBody}>Choose when you want your {selected.id==='boda'?'Boda':'ride'} to arrive.</Text>
            {scheduleOptions.map((option)=><Pressable key={option} onPress={()=>{actions.setScheduledTrip(option);setScheduleOpen(false);}} style={[styles.v404ScheduleOption,data.scheduledTrip===option&&styles.v404ScheduleOptionActive]}><View><Text style={styles.v404ScheduleOptionTitle}>{option}</Text><Text style={styles.v404ScheduleOptionMeta}>{pickupLabel(data)} → {destinationLabel(data)}</Text></View>{data.scheduledTrip===option?<Ionicons name="checkmark-circle" size={22} color={COLORS.red}/>:<Feather name="chevron-right" size={20} color={COLORS.muted}/>}</Pressable>)}
          </Pressable>
        </Pressable>
      </Modal>
      <Modal visible={paymentOpen} transparent animationType="fade" onRequestClose={()=>setPaymentOpen(false)}>
        <Pressable style={styles.v404ModalBackdrop} onPress={()=>setPaymentOpen(false)}>
          <Pressable style={styles.v404PaymentSheet} onPress={(event)=>event.stopPropagation()}>
            <View style={styles.v404SheetHandle}/><Text style={styles.v404TopUpTitle}>Payment method</Text><Text style={styles.v404TopUpBody}>Choose how you want to pay for this trip.</Text>
            {(['mtn','airtel','visa'] as const).map((id)=><Pressable key={id} onPress={()=>{actions.setSelectedPayment(id);setPaymentOpen(false)}} style={styles.v404PaymentOption}><LocalPaymentLogo id={id} country={data.country}/><View style={styles.flex}><Text style={styles.v404PaymentOptionTitle}>{paymentMethodTitle(id,data.country)}</Text><Text style={styles.v404PaymentOptionMeta}>{id==='visa'?'Card payment':'Mobile money'}</Text></View>{data.selectedPayment===id?<Ionicons name="checkmark-circle" size={22} color={COLORS.red}/>:<View style={styles.v404PaymentRadio}/>}</Pressable>)}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenShell>
  );
}


function LocalPaymentLogo({ id, country }: { id: 'mtn'|'airtel'|'visa'; country: string }) {
  if (id === 'visa') return <PaymentLogo source={assets.payment.visa}/>;
  if (id === 'airtel') return <PaymentLogo source={assets.payment.airtel}/>;
  if (country === 'Uganda') return <PaymentLogo source={assets.payment.mtn}/>;
  return <View style={styles.v38MobileMoneyLogo}><Text style={styles.v38MobileMoneyLogoText}>M</Text></View>;
}

function paymentMethodTitle(id: 'mtn'|'airtel'|'visa', country: string) {
  if (id === 'visa') return 'Visa •••• 4242';
  return id === 'airtel' ? secondaryMobileMoneyFor(country) : primaryMobileMoneyFor(country);
}

function PaymentChoice({ id, data, actions }: { id: 'mtn' | 'airtel' | 'visa'; data: AppData; actions: AppActions }) {
  const selected = data.selectedPayment === id;
  const detail = id === 'visa' ? '' : id === 'airtel' ? 'Secondary mobile money' : 'Primary mobile money';
  return (
    <Pressable onPress={() => actions.setSelectedPayment(id)} style={[styles.paymentChoice, selected && styles.paymentChoiceSelected]}>
      <LocalPaymentLogo id={id} country={data.country}/>
      <View style={styles.flex}><Text style={styles.paymentTitle}>{paymentMethodTitle(id, data.country)}</Text>{detail ? <Text style={styles.paymentSubtitle}>{detail}</Text> : null}</View>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <Feather name="check" size={14} color={COLORS.white} /> : null}</View>
    </Pressable>
  );
}

export function ConfirmBookingScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const selected = rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0];
  const base = selected.baseFare;
  const total = base + 500;
  const routeState = useRouteEstimate(pickupCoordinate(data), destinationCoordinate(data), data.selectedVehicleMode);
  const routeMeta = `${formatRouteDistance(routeState.route?.distanceMeters)}  ·  ${formatRouteDuration(routeState.route?.durationSeconds)}`;
  return (
    <ScreenShell>
      <Header title="Confirm booking" onBack={() => actions.go('chooseRide')} />
      <KareebuContextBar label="Kareebu+ trip summary" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.confirmScroll} showsVerticalScrollIndicator={false}>
        {data.scheduledTrip ? <RoundedCard style={styles.v404ScheduledSummary}><View style={styles.v404ScheduledSummaryIcon}><Ionicons name="calendar-outline" size={20} color={COLORS.red}/></View><View style={styles.flex}><Text style={styles.v404ScheduledSummaryLabel}>Scheduled pickup</Text><Text style={styles.v404ScheduledSummaryValue}>{data.scheduledTrip}</Text></View><TextButton label="Change" onPress={()=>actions.go('chooseRide')} color={COLORS.red}/></RoundedCard> : null}
        <RoundedCard style={styles.confirmRouteCard}>
          <View style={styles.confirmRouteRow}><LocationDot /><Text style={styles.confirmRouteText}>{pickupLabel(data)}</Text></View>
          <View style={styles.confirmRouteConnector} />
          <View style={styles.confirmRouteRow}><LocationDot color={COLORS.red} /><Text style={styles.confirmRouteText}>{destinationLabel(data)}</Text></View>
          <Text style={styles.confirmRouteMeta}>{routeState.loading ? 'Calculating route…' : routeState.error ? 'Route temporarily unavailable' : routeMeta}</Text>
        </RoundedCard>
        <DemoDirectionsCard data={data} compact />
        <SectionTitle title="Payment method" />
        <RoundedCard style={styles.paymentChoices}>
          <PaymentChoice id="mtn" data={data} actions={actions} />
          <PaymentChoice id="airtel" data={data} actions={actions} />
          <PaymentChoice id="visa" data={data} actions={actions} />
        </RoundedCard>
        <Text style={styles.priceTitle}>Price details</Text>
        <View style={styles.priceRow}><Text style={styles.priceLabel}>{selected.name} fare</Text><Text style={styles.priceValue}>{formatMoney(data.country, selected.baseFare)}</Text></View>
        <View style={styles.priceRow}><Text style={styles.priceLabel}>Booking fee</Text><Text style={styles.priceValue}>{formatMoney(data.country, 500)}</Text></View>
        <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatMoney(data.country, total)}</Text></View>
        <PrimaryButton label={`Book ${selected.name}`} onPress={() => actions.go('driver')} />
        <Text style={styles.cancelPolicy}>You can cancel for free within 1 min.</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function DriverProfile({ rating = '4.8', actions, vehicleMode = 'BODA', country = 'Uganda' }: { rating?: string; actions: AppActions; vehicleMode?: VehicleMode; country?: string }) {
  const plates = country === 'Kenya' ? { boda: 'KMG 412Q', car: 'KDA 321P' } : country === 'Tanzania' ? { boda: 'T 842 DQK', car: 'T 321 ARP' } : { boda: 'UFA 123Q', car: 'UAX 321P' };
  const vehicleMeta = vehicleMode === 'BODA' ? `Boda · ${plates.boda}` : `Toyota Premio · ${plates.car}`;
  return (
    <RoundedCard style={styles.driverProfile}>
      <Image source={assets.avatars.driver} style={styles.driverAvatar} />
      <View style={styles.flex}><Text style={styles.driverName}>Peter</Text><Text style={styles.driverRating}><Text style={styles.star}>★</Text> {rating}</Text><Text style={styles.driverMeta}>{vehicleMeta}</Text></View>
      <Pressable onPress={()=>Alert.alert('Call driver','Calling is available once a live driver is matched.')} style={styles.circleAction}><Ionicons name="call" size={24} color={COLORS.black} /></Pressable>
      <Pressable onPress={()=>Alert.alert('Chat with driver','Secure trip chat is available once a live driver is matched.')} style={styles.circleAction}><Ionicons name="chatbubble-outline" size={24} color={COLORS.black} /></Pressable>
    </RoundedCard>
  );
}

export function DriverScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const origin = pickupCoordinate(data);
  const destination = destinationCoordinate(data);
  const routeState = useRouteEstimate(origin, destination, data.selectedVehicleMode);
  return (
    <ScreenShell>
      <Header title="Peter is on the way" right={<TextButton label="Safety" onPress={() => Alert.alert('Safety toolkit','Share your trip, contact support or get emergency guidance here.')} color={COLORS.red} />} />
      <KareebuContextBar label="Driver matched · location sharing active" />
      <View style={styles.rideStatusBar}>
        <View><Text style={styles.rideStatusEyebrow}>PICKUP</Text><Text style={styles.rideStatusTitle}>2 min away</Text></View>
        <View style={styles.liveChip}><View style={styles.liveDot} /><Text style={styles.liveChipText}>Live</Text></View>
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={styles.driverScroll} showsVerticalScrollIndicator={false}>
        <InteractiveKareebuMap mode="driver" vehicleMode={data.selectedVehicleMode} originCoordinate={origin} destinationCoordinate={destination} routePath={routeState.route?.coordinates} destinationLabel={destinationLabel(data)} />
        <DemoDirectionsCard data={data} compact />
        <DriverProfile actions={actions} vehicleMode={data.selectedVehicleMode} country={data.country} />
        <RoundedCard style={styles.pickupCodeCard}>
          <View style={styles.pickupCodeIcon}><MaterialCommunityIcons name="shield-key-outline" size={24} color={COLORS.black} /></View>
          <View style={styles.flex}>
            <Text style={styles.pickupCodeLabel}>Your pickup code</Text>
            <Text style={styles.pickupCode}>4821</Text>
            <Text style={styles.pickupCodeHelp}>Only share this code with Peter once you are together.</Text>
          </View>
        </RoundedCard>
        <View style={styles.driverActionGrid}>
          {[["call", "Call"], ["chatbubble-outline", "Chat"], ["share-social-outline", "Share trip"], ["close", "Cancel"]].map(([icon, label]) => (
            <Pressable key={label} onPress={()=>{
              if(label==='Cancel') return Alert.alert('Cancel trip?','You can cancel free within the stated cancellation window.',[{text:'Keep trip',style:'cancel'},{text:'Cancel trip',style:'destructive',onPress:()=>actions.go('home')}]);
              if(label==='Share trip') return void shareTrip(data);
              Alert.alert(label==='Call'?'Call driver':'Chat with driver',label==='Call'?'Calling is available once a live driver is matched.':'Secure trip chat is available once a live driver is matched.');
            }} style={styles.driverAction}><Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={23} color={label === 'Cancel' ? COLORS.red : COLORS.black} /><Text style={styles.driverActionLabel}>{label}</Text></Pressable>
          ))}
        </View>
        <PrimaryButton label="I’m with Peter" onPress={() => actions.go('onTrip')} />
        <Text style={styles.flowHelp}>In the live app, your trip starts automatically when the driver confirms pickup.</Text>
      </ScrollView>
    </ScreenShell>
  );
}

export function OnTripScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const origin = pickupCoordinate(data);
  const destination = destinationCoordinate(data);
  const routeState = useRouteEstimate(origin, destination, data.selectedVehicleMode);
  const distance = formatRouteDistance(routeState.route?.distanceMeters);
  const duration = formatRouteDuration(routeState.route?.durationSeconds);
  return (
    <ScreenShell>
      <Header title="On trip" right={<TextButton label="Safety" onPress={() => Alert.alert('Safety toolkit','Share your trip, contact support or get emergency guidance here.')} color={COLORS.red} />} />
      <KareebuContextBar label="Live trip · Kareebu+ safety tools available" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.tripScroll} showsVerticalScrollIndicator={false}>
        <InteractiveKareebuMap mode="trip" vehicleMode={data.selectedVehicleMode} originCoordinate={origin} destinationCoordinate={destination} routePath={routeState.route?.coordinates} destinationLabel={destinationLabel(data)} />
        <DemoDirectionsCard data={data} />
        <RoundedCard style={styles.tripSummary}>
          <Text style={styles.tripLabel}>Ride to</Text><Text style={styles.tripDestination}>{destinationLabel(data)}</Text>
          <View style={styles.tripRule} />
          <View style={styles.tripStats}>
            {[['Distance',distance],['Time',duration],['Fare', formatMoney(data.country, (rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0]).baseFare)]].map(([label,value]) => <View key={label}><Text style={styles.tripStatLabel}>{label}</Text><Text style={styles.tripStatValue}>{value}</Text></View>)}
          </View>
          <View style={styles.tripButtons}><Pressable onPress={()=>void shareTrip(data)} style={styles.tripSecondary}><Feather name="share" size={21} /><Text style={styles.tripSecondaryText}>Share trip</Text></Pressable><Pressable onPress={()=>Alert.alert('Safety toolkit','Access support, trusted contacts and emergency guidance here.')} style={styles.tripSecondary}><MaterialCommunityIcons name="shield-check-outline" size={23} /><Text style={styles.tripSecondaryText}>Safety toolkit</Text></Pressable></View>
          <PrimaryButton label="I’ve arrived" onPress={() => actions.go('tripComplete')} />
          <Text style={styles.flowHelp}>Trip completion is normally confirmed automatically by the driver.</Text>
        </RoundedCard>
        <DriverProfile rating="4.8" actions={actions} vehicleMode={data.selectedVehicleMode} country={data.country} />
      </ScrollView>
    </ScreenShell>
  );
}

export function TripCompleteScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const selected = rideData.find((ride) => ride.id === data.selectedRide) ?? rideData[0];
  const base = selected.baseFare;
  const total = base + 500;
  const routeState = useRouteEstimate(pickupCoordinate(data), destinationCoordinate(data), data.selectedVehicleMode);
  const routeMeta = `${formatRouteDistance(routeState.route?.distanceMeters)}  ·  ${formatRouteDuration(routeState.route?.durationSeconds)}`;
  return (
    <ScreenShell>
      <Header title="Trip completed" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.completeScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.completeBadge}><Feather name="check" size={56} color={COLORS.white} /></View>
        <Text style={styles.completeThankYou}>Thanks for riding with Kareebu+!</Text>
        <RoundedCard style={styles.completeRouteCard}>
          <View style={styles.completePlace}><LocationDot /><Text style={styles.completePlaceText}>{pickupLabel(data)}</Text></View>
          <View style={styles.completePlace}><LocationDot color={COLORS.red} /><Text style={styles.completePlaceText}>{destinationLabel(data)}</Text></View>
          <Text style={styles.completeMeta}>{routeState.error ? 'Route summary unavailable' : routeMeta}</Text>
        </RoundedCard>
        <RoundedCard style={styles.receiptCard}>
          <Text style={styles.receiptTitle}>Fare breakdown</Text>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>{selected.name} fare</Text><Text style={styles.priceValue}>{formatMoney(data.country, selected.baseFare)}</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Booking fee</Text><Text style={styles.priceValue}>{formatMoney(data.country, 500)}</Text></View>
          <View style={[styles.priceRow, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatMoney(data.country, total)}</Text></View>
          <View style={styles.paidWith}><LocalPaymentLogo id={data.selectedPayment} country={data.country}/><View><Text style={styles.paymentSubtitle}>Paid with</Text><Text style={styles.paymentTitle}>{paymentMethodTitle(data.selectedPayment,data.country)}</Text></View></View>
        </RoundedCard>
        <PrimaryButton label="Rate this trip" onPress={() => actions.go('rateTrip')} />
        <TextButton label="Share receipt" onPress={() => void shareReceipt(data)} color={COLORS.black} />
      </ScrollView>
    </ScreenShell>
  );
}

export function RateTripScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <ScreenShell>
      <Header title="Rate your trip" onBack={() => actions.go('tripComplete')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.rateScroll} showsVerticalScrollIndicator={false}>
        <DriverProfile actions={actions} vehicleMode={data.selectedVehicleMode} country={data.country} />
        <Text style={styles.rateQuestion}>How was your ride?</Text>
        <View style={styles.starsRow}>{[1,2,3,4,5].map((star) => <Pressable key={star} onPress={() => actions.setRating(star)}><Ionicons name={data.rating >= star ? 'star' : 'star-outline'} size={45} color={COLORS.yellow} /></Pressable>)}</View>
        <Text style={styles.rateWord}>{data.rating >= 5 ? 'Excellent' : data.rating >= 4 ? 'Great' : data.rating >= 3 ? 'Good' : 'Tell us more'}</Text>
        <RoundedCard style={styles.tipCard}>
          <Text style={styles.tipTitle}>Add a tip for Peter</Text><Text style={styles.tipSubtitle}>100% goes to your driver</Text>
          <View style={styles.tipRow}>{[500,1000,2000,0].map((tip) => <Pressable key={tip} onPress={() => actions.setTip(tip)} style={[styles.tipOption, data.tip === tip && styles.tipOptionSelected]}><Text style={[styles.tipOptionText, data.tip === tip && styles.tipOptionTextSelected]}>{tip ? formatMoney(data.country, tip) : 'Other'}</Text></Pressable>)}</View>
          <View style={styles.priceRow}><Text style={styles.totalLabel}>Total to driver</Text><Text style={styles.totalValue}>{formatMoney(data.country, data.tip)}</Text></View>
        </RoundedCard>
        <PrimaryButton label="Submit" onPress={() => actions.go('home')} />
        <TextButton label="Skip" onPress={() => actions.go('home')} color={COLORS.muted} />
      </ScrollView>
    </ScreenShell>
  );
}

function CommerceHeader({ title, location, cart, cartCount = 0, go, onLocation }: { title: string; location?: string; cart?: boolean; cartCount?: number; go: (screen: Screen) => void; onLocation?: () => void }) {
  return (
    <View style={styles.v40CommerceHeader}>
      <View style={styles.v40CommerceTopRow}>
        <View style={styles.v40CommerceBrandWrap}><Image source={assets.wordmark} style={styles.v40CommerceWordmark} resizeMode="contain" /></View>
        <View style={styles.v40CommerceActions}><Pressable onPress={()=>Alert.alert('Saved favourites','Your favourite restaurants and stores are saved here.')} style={styles.v40CommerceIconButton}><Ionicons name="heart-outline" size={25} color={COLORS.black}/></Pressable>{cart?<Pressable onPress={()=>go('cart')} style={styles.v40CommerceIconButton}><Ionicons name="bag-handle-outline" size={25} color={COLORS.black}/>{cartCount>0?<View style={styles.v25CartBadge}><Text style={styles.v25CartBadgeText}>{Math.min(99,cartCount)}</Text></View>:null}</Pressable>:null}</View>
      </View>
      {location?<Pressable style={styles.v40CommerceLocationRow} onPress={onLocation??(()=>go('locationPicker'))}><Ionicons name="location" size={18} color={COLORS.red}/><Text style={styles.v40CommerceLocationPrefix}>Deliver to </Text><Text numberOfLines={1} style={styles.v40CommerceLocationText}>{location}</Text><Feather name="chevron-down" size={16} color={COLORS.black}/></Pressable>:null}
    </View>
  );
}

function CategoryPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <Pressable style={styles.categoryItem}><View style={styles.categoryCircle}>{icon}</View><Text style={styles.categoryLabel}>{label}</Text></Pressable>;
}

function MarketplacePromoCard({
  eyebrow,
  title,
  body,
  background,
  accent,
  icon,
}: {
  eyebrow: string;
  title: string;
  body: string;
  background: string;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable style={[styles.marketPromoCard, { backgroundColor: background }]}>
      <View style={styles.marketPromoCopy}>
        <Text style={[styles.marketPromoEyebrow, { color: accent }]}>{eyebrow}</Text>
        <Text style={styles.marketPromoTitle}>{title}</Text>
        <Text style={styles.marketPromoBody}>{body}</Text>
        <View style={[styles.marketPromoCta, { backgroundColor: accent }]}><Text style={styles.marketPromoCtaText}>Explore</Text></View>
      </View>
      <View style={[styles.marketPromoIcon, { backgroundColor: `${accent}18` }]}><Ionicons name={icon} size={58} color={accent} /></View>
    </Pressable>
  );
}

function PromoDots({ count = 3, active = 0 }: { count?: number; active?: number }) {
  return <View style={styles.promoDots}>{Array.from({ length: count }).map((_, index) => <View key={index} style={[styles.promoDot, index === active && styles.promoDotActive]} />)}</View>;
}

function FilterChip({ label, active = false, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.filterChip, active && styles.filterChipActive, pressed && styles.filterChipPressed]}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function DealCard({ image, label, price, oldPrice, badge }: { image: ImageSourcePropType; label: string; price: string; oldPrice: string; badge: string }) {
  return (
    <Pressable style={styles.dealCard}>
      <View style={styles.dealImageWrap}><Image source={image} style={styles.dealImage} resizeMode="contain" /><View style={styles.dealBadge}><Text style={styles.dealBadgeText}>{badge}</Text></View></View>
      <Text style={styles.dealPrice}>{price}</Text><Text style={styles.dealOldPrice}>{oldPrice}</Text><Text numberOfLines={2} style={styles.dealLabel}>{label}</Text>
      <View style={styles.dealAdd}><Feather name="plus" size={18} color={COLORS.black} /></View>
    </Pressable>
  );
}



function OfferSquare({ eyebrow, title, foot, tone = 'red' }: { eyebrow: string; title: string; foot: string; tone?: 'red'|'yellow'|'black' }) {
  const bg = tone === 'red' ? '#FFF0EE' : tone === 'yellow' ? '#FFF5C8' : '#EEEAE2';
  const accent = tone === 'red' ? COLORS.red : tone === 'yellow' ? COLORS.black : COLORS.black;
  return <Pressable style={[styles.v25OfferSquare,{backgroundColor:bg}]}><Text style={[styles.v25OfferEyebrow,{color:accent}]}>{eyebrow}</Text><Text style={styles.v25OfferTitle}>{title}</Text><View style={[styles.v25OfferUnderline,{backgroundColor:tone==='yellow'?COLORS.yellow:COLORS.red}]} /><Text style={styles.v25OfferFoot}>{foot}</Text></Pressable>;
}

function RestaurantBrandTile({ name, tone, go }: { name: string; tone: 'red'|'yellow'|'black'; go: () => void }) {
  const bg = tone === 'red' ? COLORS.red : tone === 'yellow' ? COLORS.yellow : COLORS.black;
  const color = tone === 'yellow' ? COLORS.black : COLORS.white;
  return <Pressable onPress={go} style={styles.v25RestaurantBrand}><View style={[styles.v25RestaurantBrandLogo,{backgroundColor:bg}]}><Text numberOfLines={2} style={[styles.v25RestaurantBrandText,{color}]}>{name}</Text></View><View style={styles.v25OfferBadge}><Text style={styles.v25OfferBadgeText}>Offers</Text></View></Pressable>;
}

function FoodCategoryBubble({ label, image }: { label: string; image: ImageSourcePropType }) {
  return <Pressable style={styles.v25FoodCategory}><View style={styles.v25FoodCategoryCircle}><Image source={image} style={styles.v25FoodCategoryImage} resizeMode="cover" /></View><Text style={styles.v25FoodCategoryLabel}>{label}</Text></Pressable>;
}

function RestaurantListItem({ name, image, rating, eta, fee, badge, go }: { name: string; image: ImageSourcePropType; rating: string; eta: string; fee: string; badge: string; go: () => void }) {
  return (
    <Pressable onPress={go} style={styles.v25RestaurantRow}>
      <View style={styles.v25RestaurantThumbWrap}><Image source={image} style={styles.v25RestaurantThumb} resizeMode="cover" /><View style={styles.v25DiscountBadge}><Text style={styles.v25DiscountText}>{badge}</Text></View><View style={styles.v25HeartFloat}><Ionicons name="heart-outline" size={20} color={COLORS.white} /></View></View>
      <View style={styles.v25RestaurantInfo}><View style={styles.v25RestaurantTitleRow}><View style={styles.v25ProBadge}><Text style={styles.v25ProBadgeText}>plus</Text></View><Text numberOfLines={1} style={styles.v25RestaurantName}>{name}</Text></View><Text style={styles.v25RestaurantMeta}><Text style={styles.star}>★</Text> {rating} · {eta} · {fee}</Text><View style={styles.v25RestaurantPill}><Text style={styles.v25RestaurantPillText}>Popular near you</Text></View></View>
    </Pressable>
  );
}

const pharmacyBrands = [
  ['Goodlife Pharmacy','10–20 min'],['HealthPlus Pharmacy','10–25 min'],['Sunlife Pharmacy','10–25 min'],['LifeCare Pharmacy','15–30 min'],['Rapid Chemist','10–20 min'],['Care Plus','15–30 min'],['MediQ Pharmacy','10–20 min'],['Kareebu Health','15–25 min'],
] as const;

function PharmacyBrandTile({ name, eta, index }: { name: string; eta: string; index: number }) {
  const tone = index % 3;
  const bg = tone === 0 ? COLORS.black : tone === 1 ? COLORS.yellow : COLORS.red;
  const fg = tone === 1 ? COLORS.black : COLORS.white;
  return <Pressable style={styles.v25PharmacyBrand}><View style={[styles.v25PharmacyLogo,{backgroundColor:bg}]}><Ionicons name="medical" size={22} color={fg}/><Text numberOfLines={2} style={[styles.v25PharmacyLogoText,{color:fg}]}>{name.replace(' Pharmacy','')}</Text></View><Text style={styles.v25PharmacyEta}>{eta}</Text></Pressable>;
}


function V40FoodPromoCard({ kind }: { kind: 'exclusive'|'discount'|'delivery' }) {
  const config = kind === 'exclusive'
    ? { bg:'#FFF0EC', eyebrow:'Only on', title:'Kareebu+', body:'Great food. Only here.', icon:'bag-handle' as const, accent:COLORS.red }
    : kind === 'discount'
      ? { bg:'#FFF6DE', eyebrow:'30% off', title:'full menu', body:'Big savings on your favourites.', icon:'pricetag' as const, accent:COLORS.red }
      : { bg:'#EEF8EF', eyebrow:'Lower', title:'delivery fee', body:'More value. Delivered fast.', icon:'bicycle' as const, accent:'#168342' };
  return <View style={[styles.v40FoodPromoCard,{backgroundColor:config.bg}]}><View style={styles.flex}><Text style={[styles.v40FoodPromoEyebrow,{color:config.accent}]}>{config.eyebrow}</Text><Text style={styles.v40FoodPromoTitle}>{config.title}</Text><Text style={styles.v40FoodPromoBody}>{config.body}</Text></View><View style={styles.v40FoodPromoIcon}><Ionicons name={config.icon} size={32} color={config.accent}/></View></View>;
}

function restaurantReason(restaurant: DemoRestaurant) {
  if (restaurant.id === 'cafe-javas' || restaurant.id === 'java-house') return 'Popular for Coffee & Burgers';
  if (restaurant.id === 'chicken-tonight') return 'Best for Grilled Chicken';
  if (restaurant.id === 'pizza-inn') return 'Hot & Cheesy Pizzas';
  if (restaurant.categories.includes('Local dishes')) return 'Local favourites near you';
  if (restaurant.categories.includes('Desserts')) return 'Sweet treats & desserts';
  return restaurant.cuisine.split('·')[0].trim();
}

export function FoodScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [activeFilter, setActiveFilter] = useState('Offers');
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<'Recommended'|'Fastest'|'Top rated'|'Lowest fee'>('Recommended');
  const categories = ['Burgers','Chicken','Grills','Pizza','Local dishes','Desserts'] as const;
  const featuredIds = ['java-house','pizza-inn','chicken-tonight','cafe-javas','roast-rhyme','smokery'];
  const featured = featuredIds.map((id)=>DEMO_RESTAURANTS.find((restaurant)=>restaurant.id===id)).filter((restaurant): restaurant is DemoRestaurant=>Boolean(restaurant));
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const rows = DEMO_RESTAURANTS.filter((restaurant) => {
      const queryMatch = !term || [restaurant.name, restaurant.cuisine, ...restaurant.menu.map((item) => item.name)].join(' ').toLowerCase().includes(term);
      const categoryMatch = activeCategory === 'All' || restaurant.categories.includes(activeCategory as any);
      const filterMatch = activeFilter === 'Offers' ? Boolean(restaurant.offer) : activeFilter === 'Rating 4.0+' ? restaurant.rating >= 4.0 : activeFilter === 'Fast delivery' ? Number(restaurant.eta.split('–')[0]) <= 22 : true;
      return queryMatch && categoryMatch && filterMatch;
    });
    if (sortMode === 'Fastest') rows.sort((a,b)=>Number(a.eta.split('–')[0])-Number(b.eta.split('–')[0]));
    if (sortMode === 'Top rated') rows.sort((a,b)=>b.rating-a.rating);
    if (sortMode === 'Lowest fee') rows.sort((a,b)=>a.deliveryFee-b.deliveryFee);
    return rows;
  }, [query, activeCategory, activeFilter, sortMode]);
  const openRestaurant = (restaurant: DemoRestaurant) => { actions.selectRestaurant(restaurant.id); actions.go('restaurant'); };
  const cartCount = Object.values(data.cartQuantities).reduce((sum, quantity) => sum + quantity, 0);
  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={styles.v40CommerceScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <CommerceHeader title="Food" location={data.deliveryPlace?.name || data.city} cart cartCount={cartCount} go={actions.go} onLocation={() => { actions.setLocationReturn('food'); actions.go('locationPicker'); }} />
        <View style={styles.v40CommerceSearch}><Feather name="search" size={21} color={COLORS.black}/><TextInput value={query} onChangeText={setQuery} placeholder="Search for pizza, burgers or restaurants" placeholderTextColor={COLORS.mutedLight} style={styles.v40CommerceSearchInput}/>{query?<Pressable onPress={()=>setQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.muted}/></Pressable>:null}</View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FoodPromoRow}><V40FoodPromoCard kind="exclusive"/><V40FoodPromoCard kind="discount"/><V40FoodPromoCard kind="delivery"/></ScrollView>

        <View style={styles.v40FoodFeaturedPanel}>
          <View style={styles.v40SectionHeader}><View><Text style={styles.v40SectionTitle}>Top restaurants near you</Text><Text style={styles.v40SectionSub}>Based on what everyone loves nearby</Text></View><TextButton label="See all" onPress={()=>setActiveFilter('All restaurants')} color={COLORS.red}/></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40RestaurantBrandRow}>{featured.map((restaurant,index)=><Pressable key={restaurant.id} onPress={()=>openRestaurant(restaurant)} style={styles.v40RestaurantBrandTile}><View style={[styles.v40RestaurantBrandLogo,{backgroundColor:index%3===0?'#FFF2EC':index%3===1?'#FFF9D9':'#F5F5F5'}]}><Text numberOfLines={2} style={styles.v40RestaurantBrandText}>{localisedRestaurantName(restaurant,data.country,data.city)}</Text></View><View style={styles.v40RestaurantOfferTag}><Ionicons name="pricetag-outline" size={11} color={COLORS.black}/><Text style={styles.v40RestaurantOfferTagText}>Offers</Text></View></Pressable>)}</ScrollView>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FoodCategoryRow}>{categories.map((label,index)=>{const image=[assets.food.cafeJavas,assets.food.chickenTonight,assets.food.tamaraThai][index%3];const selected=activeCategory===label;return <Pressable key={label} onPress={()=>setActiveCategory(selected?'All':label)} style={styles.v40FoodCategory}><View style={[styles.v40FoodCategoryCircle,selected&&styles.v40FoodCategoryCircleActive]}><Image source={image} style={styles.v40FoodCategoryImage} resizeMode="cover"/></View><Text style={[styles.v40FoodCategoryText,selected&&styles.v40FoodCategoryTextActive]}>{label}</Text></Pressable>})}</ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FilterRow}><FilterChip label={sortMode==='Recommended'?'Sort by':`Sort: ${sortMode}`} active={sortMode!=='Recommended'} onPress={()=>setSortMode(sortMode==='Recommended'?'Fastest':sortMode==='Fastest'?'Top rated':sortMode==='Top rated'?'Lowest fee':'Recommended')}/>{['Offers','Rating 4.0+','Fast delivery'].map((filter)=><FilterChip key={filter} label={filter} active={activeFilter===filter} onPress={()=>setActiveFilter(activeFilter===filter?'All restaurants':filter)}/>)}</ScrollView>

        <View style={styles.v40RestaurantList}>{filtered.map((restaurant)=><Pressable key={restaurant.id} onPress={()=>openRestaurant(restaurant)} style={({pressed})=>[styles.v40RestaurantRow,pressed&&styles.v26CardPressed]}><View style={styles.v40RestaurantImageWrap}><Image source={assets.food[restaurant.image]} style={styles.v40RestaurantImage} resizeMode="cover"/>{restaurant.offer?<View style={styles.v40RestaurantDiscount}><Text style={styles.v40RestaurantDiscountText}>{restaurant.offer.split(' ').slice(0,2).join(' ')}</Text></View>:null}</View><View style={styles.v40RestaurantCopy}><View style={styles.v40RestaurantNameRow}><View style={styles.v40ProTag}><Text style={styles.v40ProTagText}>pro</Text></View><Text numberOfLines={1} style={styles.v40RestaurantName}>{localisedRestaurantName(restaurant,data.country,data.city)}</Text><Pressable onPress={()=>actions.toggleFavoriteRestaurant(restaurant.id)}><Ionicons name={data.favoriteRestaurantIds.includes(restaurant.id)?'heart':'heart-outline'} size={21} color={data.favoriteRestaurantIds.includes(restaurant.id)?COLORS.red:COLORS.black}/></Pressable></View><Text style={styles.v40RestaurantMeta}>{restaurant.rating.toFixed(1)} <Text style={styles.star}>★</Text> ({restaurant.reviews}) · {restaurant.eta} · {restaurant.deliveryFee===0?formatMoney(data.country,0):formatMoney(data.country,restaurant.deliveryFee)}</Text><View style={styles.v40RestaurantReason}><Text style={styles.v40RestaurantReasonText}>{restaurantReason(restaurant)}</Text></View><Text numberOfLines={1} style={styles.v40RestaurantCuisine}>{restaurant.cuisine}</Text></View></Pressable>)}</View>
        {filtered.length===0?<RoundedCard style={styles.v30EmptyState}><Ionicons name="restaurant-outline" size={32} color={COLORS.muted}/><Text style={styles.v30EmptyTitle}>No restaurants match</Text><Text style={styles.v30EmptyBody}>Try another category, filter or search.</Text></RoundedCard>:null}
      </ScrollView>
      <FoodBottomNav go={actions.go} active="food" />
    </ScreenShell>
  );
}

function FoodBottomNav({ go, active }: { go: (screen: Screen) => void; active: 'home'|'food'|'shops'|'orders'|'cart' }) {
  // Food and Shops remain commerce sub-flows while sharing the same global navigation pattern.
  return <BottomNav active={active === 'orders' ? 'orders' : 'home'} go={go} />;
}

export function RestaurantScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const restaurant = DEMO_RESTAURANTS.find((item) => item.id === data.selectedRestaurantId) ?? DEMO_RESTAURANTS[0]!;
  const favorite = data.favoriteRestaurantIds.includes(restaurant.id);
  const categories = Array.from(new Set(restaurant.menu.map((item) => item.category)));
  const cartCount = restaurant.menu.reduce((sum,item) => sum + (data.cartQuantities[item.id] ?? 0),0);
  const cartTotal = restaurant.menu.reduce((sum,item) => sum + item.price * (data.cartQuantities[item.id] ?? 0),0);
  const changeQuantity = (item: DemoMenuItem, delta: number) => actions.setCartItemQuantity(item.id, Math.max(0,(data.cartQuantities[item.id] ?? 0)+delta));
  return (
    <ScreenShell>
      <Header onBack={() => actions.go('food')} right={<Pressable onPress={() => actions.toggleFavoriteRestaurant(restaurant.id)} style={styles.v30HeaderHeart}><Ionicons name={favorite?'heart':'heart-outline'} size={25} color={favorite?COLORS.red:COLORS.black} /></Pressable>} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.restaurantDetailScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.v30RestaurantHeroWrap}>
          <Image source={assets.food[restaurant.image]} style={styles.restaurantHero} />
          <View style={styles.v30RestaurantHeroBadge}><Image source={assets.mark} style={styles.v30RestaurantHeroMark}/><Text style={styles.v30RestaurantHeroBadgeText}>Kareebu+ partner</Text></View>
          {restaurant.offer ? <View style={styles.v30RestaurantOfferBadge}><Text style={styles.v30RestaurantOfferBadgeText}>{restaurant.offer}</Text></View> : null}
        </View>
        <Text style={styles.restaurantDetailName}>{restaurant.name}</Text>
        <Text style={styles.restaurantDetailMeta}><Text style={styles.star}>★</Text> {restaurant.rating.toFixed(1)} ({restaurant.reviews})  ·  {restaurant.cuisine}</Text>
        <Text style={styles.restaurantDetailSub}>{restaurant.eta}  ·  {restaurant.distance}  ·  {restaurant.deliveryFee===0?'Free delivery':`${formatMoney(data.country, restaurant.deliveryFee)} delivery`}</Text>
        <View style={styles.badgeRow}>{[restaurant.plus?'Kareebu+':'Local favourite','Great reviews','Live order tracking'].map((badge)=><View key={badge} style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>)}</View>
        <View style={styles.v30RestaurantInfoStrip}><View><Text style={styles.v30InfoValue}>{restaurant.eta}</Text><Text style={styles.v30InfoLabel}>Delivery</Text></View><View style={styles.v30InfoRule}/><View><Text style={styles.v30InfoValue}>{restaurant.rating.toFixed(1)} ★</Text><Text style={styles.v30InfoLabel}>Rating</Text></View><View style={styles.v30InfoRule}/><View><Text style={styles.v30InfoValue}>{restaurant.distance}</Text><Text style={styles.v30InfoLabel}>Distance</Text></View></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v30MenuCategoryRow}>{categories.map((category,index)=><View key={category} style={[styles.v30MenuCategoryChip,index===0&&styles.v30MenuCategoryChipActive]}><Text style={[styles.v30MenuCategoryText,index===0&&styles.v30MenuCategoryTextActive]}>{category}</Text></View>)}</ScrollView>
        {categories.map((category) => (
          <View key={category} style={styles.v30MenuSection}>
            <View style={styles.v30MenuSectionHeading}><Text style={styles.v30MenuSectionTitle}>{category}</Text><Text style={styles.v30MenuSectionCount}>{restaurant.menu.filter((item)=>item.category===category).length} items</Text></View>
            {restaurant.menu.filter((item)=>item.category===category).map((item) => {
              const quantity = data.cartQuantities[item.id] ?? 0;
              return <View key={item.id} style={styles.v30MenuItem}><View style={styles.v30MenuCopy}><View style={styles.v30MenuNameRow}><Text style={styles.menuName}>{item.name}</Text>{item.popular?<View style={styles.v30PopularPill}><Text style={styles.v30PopularPillText}>Popular</Text></View>:null}</View><Text numberOfLines={2} style={styles.v30MenuDescription}>{item.description}</Text><Text style={styles.v30MenuPrice}>{formatMoney(data.country, item.price)}</Text>{item.badge?<Text style={styles.v30MenuBadgeText}>{item.badge}</Text>:null}</View><View style={styles.v30MenuVisualWrap}><Image source={assets.food[item.image]} style={styles.v30MenuImage}/>{quantity===0?<Pressable onPress={()=>changeQuantity(item,1)} style={styles.v30MenuAddButton}><Feather name="plus" size={20} color={COLORS.red}/></Pressable>:<View style={styles.v30MenuQuantity}><Pressable onPress={()=>changeQuantity(item,-1)}><Feather name="minus" size={16} color={COLORS.black}/></Pressable><Text style={styles.v30MenuQuantityText}>{quantity}</Text><Pressable onPress={()=>changeQuantity(item,1)}><Feather name="plus" size={16} color={COLORS.black}/></Pressable></View>}</View></View>;
            })}
          </View>
        ))}
      </ScrollView>
      {cartCount > 0 ? <Pressable onPress={()=>actions.go('cart')} style={styles.viewCartBar}><View style={styles.v30CartCountBubble}><Text style={styles.v30CartCountText}>{cartCount}</Text></View><View style={styles.flex}><Text style={styles.viewCartTitle}>View cart</Text><Text style={styles.viewCartMeta}>{restaurant.name}</Text></View><View style={styles.v30CartBarRight}><Text style={styles.v30CartBarTotal}>{formatMoney(data.country, cartTotal)}</Text><Feather name="chevron-right" size={21} color={COLORS.white}/></View></Pressable> : null}
    </ScreenShell>
  );
}

export function CartScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const restaurant = DEMO_RESTAURANTS.find((item) => item.id === data.selectedRestaurantId) ?? DEMO_RESTAURANTS[0]!;
  const [note,setNote]=useState('');
  const [promo,setPromo]=useState('');
  const [appliedPromo,setAppliedPromo]=useState<'SAVE10'|'PLUSFREE'|null>(null);
  const items = restaurant.menu.filter((item) => (data.cartQuantities[item.id] ?? 0)>0);
  const itemsTotal = items.reduce((sum,item)=>sum+item.price*(data.cartQuantities[item.id]??0),0);
  const discount = appliedPromo==='SAVE10' ? Math.round(itemsTotal*.10) : 0;
  const delivery = appliedPromo==='PLUSFREE' ? 0 : restaurant.deliveryFee;
  const platformFee = itemsTotal > 0 ? 1000 : 0;
  const total = Math.max(0,itemsTotal-discount+delivery+platformFee);
  const applyPromo=()=>{ const code=promo.trim().toUpperCase(); if(code==='SAVE10'||code==='PLUSFREE') setAppliedPromo(code); else setAppliedPromo(null); };
  return (
    <ScreenShell>
      <Header title="Your cart" onBack={() => actions.go('restaurant')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.cartScroll} keyboardShouldPersistTaps="handled">
        <View style={styles.v30CartRestaurantRow}><View><Text style={styles.cartRestaurant}>{restaurant.name}</Text><Text style={styles.v30CartRestaurantMeta}>{restaurant.eta} · {restaurant.distance}</Text></View><Pressable onPress={()=>actions.go('restaurant')}><Text style={styles.v30AddMore}>Add more</Text></Pressable></View>
        {items.length ? items.map((item)=>{const quantity=data.cartQuantities[item.id]??0;return <View key={item.id} style={styles.cartItem}><Image source={assets.food[item.image]} style={styles.cartImage}/><View style={styles.flex}><Text style={styles.menuName}>{item.name}</Text><Text numberOfLines={1} style={styles.v30CartItemDesc}>{item.description}</Text><Text style={styles.v30MenuPrice}>{formatMoney(data.country, item.price*quantity)}</Text></View><View style={styles.quantity}><Pressable onPress={()=>actions.setCartItemQuantity(item.id,quantity-1)}><Feather name="minus" size={17}/></Pressable><Text style={styles.quantityText}>{quantity}</Text><Pressable onPress={()=>actions.setCartItemQuantity(item.id,quantity+1)}><Feather name="plus" size={17}/></Pressable></View></View>}) : <RoundedCard style={styles.v30EmptyState}><Ionicons name="bag-handle-outline" size={32} color={COLORS.muted}/><Text style={styles.v30EmptyTitle}>Your cart is empty</Text><Text style={styles.v30EmptyBody}>Add a few favourites from {restaurant.name}.</Text><TextButton label="Browse menu" onPress={()=>actions.go('restaurant')} color={COLORS.red}/></RoundedCard>}
        <AppField placeholder="Add a note for the restaurant (optional)" value={note} onChangeText={setNote} />
        <View style={styles.v30PromoApply}><View style={styles.v30PromoInputWrap}><Ionicons name="ticket-outline" size={20} color={COLORS.red}/><TextInput value={promo} onChangeText={setPromo} placeholder="Promo code · try SAVE10" placeholderTextColor={COLORS.mutedLight} autoCapitalize="characters" style={styles.v30PromoInput}/></View><Pressable onPress={applyPromo} style={styles.v30PromoApplyButton}><Text style={styles.v30PromoApplyText}>Apply</Text></Pressable></View>
        {promo && !appliedPromo ? <Text style={styles.v30PromoHelp}>Demo codes: SAVE10 or PLUSFREE</Text> : null}
        {appliedPromo ? <View style={styles.v30PromoSuccess}><Feather name="check-circle" size={18} color={COLORS.green}/><Text style={styles.v30PromoSuccessText}>{appliedPromo==='SAVE10'?'10% demo discount applied':'Free delivery demo applied'}</Text></View> : null}
        <View style={styles.cartTotals}><View style={styles.priceRow}><Text style={styles.priceLabel}>Items total</Text><Text style={styles.priceValue}>{formatMoney(data.country, itemsTotal)}</Text></View>{discount>0?<View style={styles.priceRow}><Text style={[styles.priceLabel,{color:COLORS.green}]}>Promo discount</Text><Text style={[styles.priceValue,{color:COLORS.green}]}>−{formatMoney(data.country, discount)}</Text></View>:null}<View style={styles.priceRow}><Text style={styles.priceLabel}>Delivery fee</Text><Text style={styles.priceValue}>{delivery===0?'FREE':formatMoney(data.country, delivery)}</Text></View><View style={styles.priceRow}><Text style={styles.priceLabel}>Platform fee</Text><Text style={styles.priceValue}>{formatMoney(data.country, platformFee)}</Text></View><View style={[styles.priceRow,styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatMoney(data.country, total)}</Text></View></View>
        <RoundedCard style={styles.paymentSummary}><LocalPaymentLogo id={data.selectedPayment} country={data.country}/><View style={styles.flex}><Text style={styles.paymentTitle}>{paymentMethodTitle(data.selectedPayment,data.country)}</Text><Text style={styles.paymentSubtitle}>Payment method</Text></View><TextButton label="Change" onPress={()=>actions.go('wallet')}/></RoundedCard>
        <PrimaryButton label={`Place order · ${formatMoney(data.country, total)}`} onPress={()=>actions.go('orderTracking')} disabled={items.length===0} />
        <Text style={styles.v30CheckoutTrust}>🔒 Secure checkout · Live order updates · Kareebu+ support</Text>
      </ScrollView>
    </ScreenShell>
  );
}

export function OrderTrackingScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const restaurant = DEMO_RESTAURANTS.find((item) => item.id === data.selectedRestaurantId) ?? DEMO_RESTAURANTS[0]!;
  return (
    <ScreenShell>
      <Header title="Order in progress" onBack={() => actions.go('home')} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.orderTrackingScroll}>
        <View style={styles.v30TrackingBrand}><Image source={assets.wordmark} style={styles.v30TrackingWordmark} resizeMode="contain"/><View style={styles.liveChip}><View style={styles.liveDot}/><Text style={styles.liveChipText}>Live</Text></View></View>
        <Text style={styles.orderId}>Order #ORD-984512</Text><Text style={styles.orderEta}>Arriving in 22 min</Text><Text style={styles.orderRestaurant}>{localisedRestaurantName(restaurant,data.country,data.city)}</Text>
        <View style={styles.v30OrderProgress}>{['Confirmed','Preparing','Picked up','Delivered'].map((label,index)=><View key={label} style={styles.v30OrderProgressItem}><View style={[styles.v30OrderProgressDot,index<2&&styles.v30OrderProgressDotActive]}>{index<2?<Feather name="check" size={11} color={COLORS.black}/>:null}</View><Text style={[styles.v30OrderProgressLabel,index<2&&styles.v30OrderProgressLabelActive]}>{label}</Text></View>)}</View>
        <InteractiveKareebuMap mode="driver" originCoordinate={{latitude:(CITY_REGIONS[data.city]??KAMPALA_REGION).latitude+0.012,longitude:(CITY_REGIONS[data.city]??KAMPALA_REGION).longitude-0.008}} destinationCoordinate={pickupCoordinate(data)} destinationLabel={pickupLabel(data)} />
        <DriverProfile actions={actions} country={data.country}/>
        <Pressable onPress={()=>void shareReferral(data)}><RoundedCard style={styles.referralCard}><Ionicons name="gift-outline" size={26} color={COLORS.black}/><View style={styles.flex}><Text style={styles.referralTitle}>Invite friends, get {formatMoney(data.country,5000)}</Text><Text style={styles.referralBody}>Share Kareebu+ and earn rewards.</Text></View><Feather name="chevron-right" size={24}/></RoundedCard></Pressable>
      </ScrollView>
    </ScreenShell>
  );
}


function V40ShopHeroBanner({ category, country }: { category: string; country: string }) {
  const config = category === 'Pharmacy'
    ? { title:'Weekend', accent:'Wellness Drop', offer:'UP TO 70% OFF', body:'Top care. Lower prices. Delivered to you.', bg:'#F5EEFF', image:assets.shops.pharmacy }
    : category === 'Groceries'
      ? { title:'Fresh', accent:'Basket Deals', offer:'UP TO 30% OFF', body:'Groceries, pantry and home essentials.', bg:'#EFF8E9', image:assets.service.groceries }
      : category === 'Beauty'
        ? { title:'Glowing', accent:'Summer', offer:'UP TO 70% OFF', body:'Beauty, skincare and personal care picks.', bg:'#FFF2E7', image:assets.service.shops }
        : category === 'Nutrition'
          ? { title:'Everyday', accent:'Wellness', offer:'SAVE ON BUNDLES', body:'Nutrition and wellness essentials.', bg:'#FFF7DA', image:assets.shops.pharmacy }
          : { title:'Kareebu+', accent:'Store Deals', offer:'LOCAL SAVINGS', body:`Shop top picks available in ${country}.`, bg:'#FFF4EE', image:assets.service.shops };
  return <View style={[styles.v40ShopHero,{backgroundColor:config.bg}]}><View style={styles.v40ShopHeroCopy}><Text style={styles.v40ShopHeroTitle}>{config.title}{`
`}<Text style={styles.v40ShopHeroAccent}>{config.accent}</Text></Text><Text style={styles.v40ShopHeroOffer}>{config.offer}</Text><Text style={styles.v40ShopHeroBody}>{config.body}</Text></View><Image source={config.image} style={styles.v40ShopHeroImage} resizeMode="contain"/><View style={styles.v40ShopHeroFree}><Ionicons name="bicycle-outline" size={13} color={COLORS.red}/><Text style={styles.v40ShopHeroFreeText}>FREE DELIVERY</Text></View></View>;
}

export function ShopsScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [activeCategory, setActiveCategory] = useState(data.shopCategoryPreset || 'All');
  const [activeFilter, setActiveFilter] = useState('Offers');
  const [query,setQuery]=useState('');
  const countryStores = useMemo(() => localeStores(data.country, data.city), [data.country, data.city]);
  const availableCategories = useMemo(() => Array.from(new Set(countryStores.map((shop) => shop.category))), [countryStores]);
  const priority = ['Pharmacy','Beauty','Nutrition','Eye care','Pets','Groceries','Marketplace','Electronics','Home'];
  const categories = ['All', ...priority.filter((category)=>availableCategories.includes(category)), ...availableCategories.filter((category)=>!priority.includes(category))];
  const filtered = useMemo(()=>{
    const term=query.trim().toLowerCase();
    return countryStores.filter((shop)=>{
      const q=!term||`${localisedStoreName(shop,data.country)} ${shop.category} ${shop.deal}`.toLowerCase().includes(term);
      const c=activeCategory==='All'||shop.category===activeCategory;
      const f=activeFilter==='Offers'?Boolean(shop.deal):activeFilter==='Free delivery'?shop.deliveryFee===0:activeFilter==='Under 30 mins'?Number(shop.eta.split('–')[0])<30:activeFilter==='Rating 4.7+'?shop.rating>=4.7:true;
      return q&&c&&f;
    });
  },[query,activeCategory,activeFilter,countryStores,data.country]);
  const topStores = (activeCategory==='All'?countryStores:countryStores.filter((shop)=>shop.category===activeCategory)).slice(0,9);
  const cartCount = Object.values(data.cartQuantities).reduce((sum, quantity) => sum + quantity, 0);
  return (
    <ScreenShell>
      <ScrollView style={styles.flex} contentContainerStyle={styles.v40CommerceScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <CommerceHeader title="Shops" location={data.deliveryPlace?.name || data.city} cart cartCount={cartCount} go={actions.go} onLocation={() => { actions.setLocationReturn('shops'); actions.go('locationPicker'); }} />
        <View style={styles.v40CommerceSearch}><Feather name="search" size={21} color={COLORS.black}/><TextInput value={query} onChangeText={setQuery} placeholder={activeCategory==='Pharmacy'?'Search for medicines or pharmacies':'Search stores, products or categories'} placeholderTextColor={COLORS.mutedLight} style={styles.v40CommerceSearchInput}/>{query?<Pressable onPress={()=>setQuery('')}><Ionicons name="close-circle" size={20} color={COLORS.muted}/></Pressable>:null}</View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40ShopCategoryRow}>{categories.map((label)=>{const selected=activeCategory===label;const icon=(label==='All'?'storefront-outline':label==='Pharmacy'?'medical-outline':label==='Groceries'?'basket-outline':label==='Beauty'?'sparkles-outline':label==='Nutrition'?'nutrition-outline':label==='Eye care'?'eye-outline':label==='Pets'?'paw-outline':'bag-handle-outline') as keyof typeof Ionicons.glyphMap;return <Pressable key={label} onPress={()=>setActiveCategory(label)} style={styles.v40ShopCategory}><View style={[styles.v40ShopCategoryCircle,selected&&styles.v40ShopCategoryCircleActive]}><Ionicons name={icon} size={25} color={selected?COLORS.red:COLORS.black}/></View><Text style={[styles.v40ShopCategoryText,selected&&styles.v40ShopCategoryTextActive]}>{label}</Text></Pressable>})}</ScrollView>

        <V40ShopHeroBanner category={activeCategory} country={data.country}/>
        <PromoDots count={4}/>

        <View style={styles.v40SectionHeader}><Text style={styles.v40SectionTitle}>{activeCategory==='Pharmacy'?'Top pharmacy brands near you':activeCategory==='All'?'Top stores near you':`Top ${activeCategory.toLowerCase()} stores`}</Text><TextButton label="See all" onPress={()=>setActiveFilter('All stores')} color={COLORS.red}/></View>
        {activeCategory==='Pharmacy' ? <View style={styles.v40PharmacyGrid}>{topStores.map((shop)=><Pressable key={shop.id} onPress={()=>{actions.selectShop(shop.id);actions.go('shop')}} style={styles.v40PharmacyBrandCard}><View style={styles.v40PharmacyBrandLogo}><PopularStoreLogo store={shop}/></View><Text numberOfLines={1} style={styles.v40PharmacyBrandEta}>{shop.eta}</Text></Pressable>)}</View> : <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40TopShopRow}>{topStores.map((shop)=><Pressable key={shop.id} onPress={()=>{actions.selectShop(shop.id);actions.go('shop')}} style={styles.v40TopShopCard}><View style={styles.v40TopShopLogo}><PopularStoreLogo store={shop}/></View><Text numberOfLines={2} style={styles.v40TopShopName}>{localisedStoreName(shop,data.country)}</Text><Text style={styles.v40TopShopEta}>{shop.eta}</Text></Pressable>)}</ScrollView>}

        <Text style={styles.v40BrowseTitle}>{activeCategory==='Pharmacy'?'Browse pharmacies':'Browse stores'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.v40FilterRow}>{['Offers','Free delivery','Under 30 mins','Rating 4.7+'].map((filter)=><FilterChip key={filter} label={filter} active={activeFilter===filter} onPress={()=>setActiveFilter(activeFilter===filter?'All stores':filter)}/>)}</ScrollView>

        <View style={styles.v40ShopList}>{filtered.map((shop)=>{const favorite=data.favoriteShopIds.includes(shop.id);return <Pressable key={shop.id} onPress={()=>{actions.selectShop(shop.id);actions.go('shop')}} style={({pressed})=>[styles.v40ShopRow,pressed&&styles.v26CardPressed]}><View style={styles.v40ShopRowLogo}><PopularStoreLogo store={shop}/></View><View style={styles.flex}><View style={styles.v40ShopNameRow}><Text numberOfLines={1} style={styles.v40ShopName}>{localisedStoreName(shop,data.country)}</Text><Text style={styles.v40ShopRating}>{shop.rating.toFixed(1)} <Text style={styles.star}>★</Text></Text></View><Text style={styles.v40ShopMeta}>{shop.eta} · Minimum order {formatMoney(data.country,shop.minOrder)}</Text><View style={styles.v40ShopBadges}><View style={styles.v40ShopDeal}><Ionicons name="pricetag-outline" size={12} color={COLORS.black}/><Text numberOfLines={1} style={styles.v40ShopDealText}>{shop.deal}</Text></View>{shop.deliveryFee===0?<View style={styles.v40ShopFree}><Ionicons name="bicycle-outline" size={12} color="#167A38"/><Text style={styles.v40ShopFreeText}>FREE DELIVERY</Text></View>:null}</View></View><Pressable onPress={()=>actions.toggleFavoriteShop(shop.id)} style={styles.v40ShopHeart}><Ionicons name={favorite?'heart':'heart-outline'} size={21} color={favorite?COLORS.red:COLORS.muted}/></Pressable></Pressable>})}</View>
        {filtered.length===0?<RoundedCard style={styles.v30EmptyState}><Ionicons name="bag-handle-outline" size={32} color={COLORS.muted}/><Text style={styles.v30EmptyTitle}>No stores match</Text><Text style={styles.v30EmptyBody}>Try another category, filter or search.</Text></RoundedCard>:null}
      </ScrollView>
      <FoodBottomNav go={actions.go} active="shops" />
    </ScreenShell>
  );
}

function ParcelCard({ icon, label, value, detail, chevron, color }: { icon: React.ReactNode; label: string; value: string; detail?: string; chevron?: boolean; color?: string }) {
  return <RoundedCard style={styles.parcelCard}><View style={styles.parcelIcon}>{icon}</View><View style={styles.flex}><Text style={styles.parcelLabel}>{label}</Text><Text style={[styles.parcelValue,color?{color}:undefined]}>{value}</Text>{detail?<Text style={styles.parcelDetail}>{detail}</Text>:null}</View>{chevron?<Feather name="chevron-right" size={25}/>:null}</RoundedCard>;
}

export function ParcelScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [mode,setMode]=useState<'city'|'country'>('city');
  const otherCity = (countryCities[data.country] ?? []).find((item) => item !== data.city) ?? data.city;
  const pickup = data.deliveryPlace?.name || data.city;
  return (
    <ScreenShell>
      <Header title="Send parcel" onBack={()=>actions.go('home')} />
      <KareebuContextBar label={`Kareebu+ Send · ${data.city}, ${data.country}`} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.parcelScroll}>
        <View style={styles.segmented}><Pressable onPress={()=>setMode('city')} style={[styles.segment,mode==='city'&&styles.segmentActive]}><Text style={[styles.segmentText,mode==='city'&&styles.segmentTextActive]}>Within {data.city}</Text></Pressable><Pressable onPress={()=>setMode('country')} style={[styles.segment,mode==='country'&&styles.segmentActive]}><Text style={[styles.segmentText,mode==='country'&&styles.segmentTextActive]}>Across {data.country}</Text></Pressable></View>
        <ParcelCard icon={<LocationDot/>} label="Pickup location" value={pickup} detail={`${data.city}, ${data.country}`} chevron/>
        <ParcelCard icon={<LocationDot color={COLORS.red}/>} label="Drop-off location" value={mode==='city'?`${data.city} centre`:`${otherCity}, ${data.country}`} detail="Tap to choose exact address" chevron/>
        <ParcelCard icon={<Feather name="box" size={29}/>} label="Parcel type" value="Documents" detail="Up to 1kg" chevron/>
        <ParcelCard icon={<LocalPaymentLogo id={data.selectedPayment} country={data.country}/>} label="Payment method" value={paymentMethodTitle(data.selectedPayment, data.country)} detail={data.selectedPayment==='visa'?'Card':'Mobile money'} chevron/>
        <RoundedCard style={styles.v38ParcelEstimateCard}><Ionicons name="calculator-outline" size={22} color={COLORS.black}/><View style={styles.flex}><Text style={styles.v38ParcelEstimateTitle}>Estimated delivery</Text><Text style={styles.v38ParcelEstimateBody}>{mode==='city'?'30–60 min':'Same day / next day'} · from {formatMoney(data.country, mode==='city'?5000:12000)}</Text></View></RoundedCard>
        <PrimaryButton label="Continue" onPress={()=>actions.go('orders')}/><Text style={styles.parcelEstimate}>Final price is confirmed before dispatch.</Text>
      </ScrollView>
    </ScreenShell>
  );
}

function WalletAction({ icon, label, onPress }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({pressed})=>[styles.walletAction,pressed&&styles.pressed]}><MaterialCommunityIcons name={icon} size={29} color={COLORS.black}/><Text style={styles.walletActionLabel}>{label}</Text></Pressable>;
}

function WalletPayment({ id, data, actions }: { id:'mtn'|'airtel'|'visa'; data:AppData; actions:AppActions }) {
  const selected=data.selectedPayment===id;
  const detail = id==='visa'?'Card':id==='airtel'?'Secondary mobile money':'Primary mobile money';
  return <Pressable onPress={()=>actions.setSelectedPayment(id)} style={styles.walletPayment}><LocalPaymentLogo id={id} country={data.country}/><View style={styles.flex}><Text style={styles.walletPaymentTitle}>{paymentMethodTitle(id,data.country)}</Text><Text style={styles.walletPaymentSub}>{detail}</Text></View><View style={[styles.walletRadio,selected&&styles.walletRadioSelected]}>{selected?<Feather name="check" size={15}/>:null}</View></Pressable>;
}

export function WalletScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const topUpAmounts = [5000, 10000, 20000, 50000];
  const applyTopUp = (amount: number) => {
    actions.setWalletBalance(data.walletBalance + amount);
    setTopUpOpen(false);
  };

  return (
    <ScreenShell>
      <Header title="Wallet" onBack={()=>actions.go('home')} />
      <KareebuContextBar label="Kareebu+ Wallet · pay across the super app" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.walletScroll}>
        <View style={styles.walletCard}><Text style={styles.walletCardLabel}>Kareebu+ Wallet</Text><Text style={styles.walletBalance}>{formatMoney(data.country,data.walletBalance)}</Text><Text style={styles.walletCardSub}>Wallet balance · {data.country}</Text><Pressable onPress={()=>setTopUpOpen(true)} style={styles.topUpButton}><Text style={styles.topUpText}>Top up</Text></Pressable><Image source={assets.mark} style={styles.walletCardMark}/></View>
        <View style={styles.walletActions}><WalletAction icon="send-circle-outline" label="Send money" onPress={()=>Alert.alert('Send money','Choose a Kareebu+ contact or mobile-money number in the live payments flow.')}/><WalletAction icon="receipt-text-outline" label="Pay bills" onPress={()=>Alert.alert('Pay bills','Bill categories will appear here as local payment partners are connected.')}/><WalletAction icon="account-plus-outline" label="Add money" onPress={()=>setTopUpOpen(true)}/><WalletAction icon="history" label="History" onPress={()=>actions.go('activity')}/></View>
        <Text style={styles.walletSectionTitle}>Payment methods</Text>
        <RoundedCard style={styles.walletPayments}><WalletPayment id="mtn" data={data} actions={actions}/><WalletPayment id="airtel" data={data} actions={actions}/><WalletPayment id="visa" data={data} actions={actions}/></RoundedCard>
        <View style={styles.walletSectionHeader}><Text style={styles.walletSectionTitle}>Kareebu Business</Text><TextButton label="Switch" onPress={()=>Alert.alert('Kareebu Business','Business account switching will appear here when a business profile is connected.')}/></View>
        <Pressable onPress={()=>Alert.alert('Kareebu Business','Create or connect a business profile to manage business payments.')}><RoundedCard style={styles.businessCard}><View style={styles.businessIcon}><Ionicons name="briefcase" size={22} color={COLORS.white}/></View><Text style={styles.businessText}>Kareebu Business Account</Text><Feather name="chevron-right" size={24} color={COLORS.muted}/></RoundedCard></Pressable>
      </ScrollView>
      <BottomNav active="wallet" go={actions.go}/>

      <Modal visible={topUpOpen} transparent animationType="fade" onRequestClose={()=>setTopUpOpen(false)}>
        <Pressable style={styles.v404ModalBackdrop} onPress={()=>setTopUpOpen(false)}>
          <Pressable style={styles.v404TopUpSheet} onPress={(event)=>event.stopPropagation()}>
            <View style={styles.v404SheetHandle}/><Text style={styles.v404TopUpTitle}>Add money</Text>
            <Text style={styles.v404TopUpBody}>Choose an amount to add with {paymentMethodTitle(data.selectedPayment,data.country)}.</Text>
            <View style={styles.v404TopUpGrid}>{topUpAmounts.map((amount)=><Pressable key={amount} onPress={()=>applyTopUp(amount)} style={styles.v404TopUpOption}><Text style={styles.v404TopUpOptionText}>{formatMoney(data.country,amount)}</Text></Pressable>)}</View>
            <Pressable onPress={()=>setTopUpOpen(false)} style={styles.v404TopUpCancel}><Text style={styles.v404TopUpCancelText}>Cancel</Text></Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenShell>
  );
}

export function AccountScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  if(data.guest){
    return <ScreenShell><Header title="Account" right={<Pressable onPress={()=>Alert.alert('Settings','Sign in to save and manage notification, privacy, language and security preferences.')} hitSlop={10}><Ionicons name="settings-outline" size={27} color={COLORS.black}/></Pressable>}/><View style={styles.guestAccount}><View style={styles.guestAvatar}><Ionicons name="person-outline" size={65} color={COLORS.muted}/></View><Text style={styles.guestAccountTitle}>You’re browsing as a guest</Text><Text style={styles.guestAccountText}>Sign in to save trips, addresses, payment methods, receipts and Kareebu+ rewards.</Text><PrimaryButton label="Sign in or create account" onPress={()=>{actions.setAuthReturn('account');actions.go('phone');}}/></View><BottomNav active="account" go={actions.go}/></ScreenShell>;
  }
  return (
    <ScreenShell>
      <Header title="Account" right={<Pressable onPress={()=>Alert.alert('Settings','Manage notifications, privacy, language and security here.')}><Ionicons name="settings-outline" size={28} color={COLORS.black}/></Pressable>} />
      <KareebuContextBar label="Your Kareebu+ profile, rewards and preferences" />
      <ScrollView style={styles.flex} contentContainerStyle={styles.accountScroll}>
        <View style={styles.accountProfile}><Image source={assets.avatars.account} style={styles.accountAvatar}/><View style={styles.flex}><Text style={styles.accountName}>{data.fullName || 'John Ssekandi'}</Text><Text style={styles.accountPhone}>{dialCodeFor(data.country)} {data.phone || '772 123456'}</Text><Text style={styles.viewProfile}>View profile</Text></View></View>
        <Pressable onPress={()=>Alert.alert('Kareebu Black','Your membership benefits, priority support and local partner perks will appear here.')} style={styles.blackMembership}><Image source={assets.mark} style={styles.membershipMark}/><Text style={styles.membershipText}>Kareebu Black</Text><Text style={styles.membershipStatus}>Member</Text><Feather name="chevron-right" size={25} color={COLORS.white}/></Pressable>
        <RoundedCard style={styles.accountMenu}><MenuRow icon="car-outline" label="Your trips" onPress={()=>actions.go('activity')}/><MenuRow icon="globe-outline" label="Country & city" detail={`${data.city}, ${data.country}`} onPress={()=>{actions.setLocationReturn('account');actions.go('country');}}/><MenuRow icon="location-outline" label="Addresses" onPress={()=>{actions.setLocationReturn('account');actions.go('locationPicker');}}/><MenuRow icon="card-outline" label="Payment methods" onPress={()=>actions.go('wallet')}/><MenuRow icon="pricetag-outline" label="Promotions" onPress={()=>actions.go('shops')}/><MenuRow icon="help-circle-outline" label="Help & support" onPress={()=>Alert.alert('Help & support','Choose chat, call or report an issue in the live support centre.')}/><MenuRow icon="settings-outline" label="Settings" onPress={()=>Alert.alert('Settings','Manage notifications, privacy, language and security here.')}/></RoundedCard>
      </ScrollView>
      <BottomNav active="account" go={actions.go}/>
    </ScreenShell>
  );
}

export function ActivityScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const localStores = localeStores(data.country, data.city);
  const merchant = localStores[0];
  const otherCity = (countryCities[data.country] ?? []).find((item)=>item!==data.city) ?? data.city;
  return <ScreenShell><Header title="Activity"/><KareebuContextBar label={`Your Kareebu+ activity in ${data.country}`}/><ScrollView style={styles.flex} contentContainerStyle={styles.genericScroll}><HomeRecentActivityCompact data={data} go={actions.go}/><SectionTitle title="Earlier"/><RoundedCard><MenuRow icon="cube-outline" label={`Parcel to ${otherCity}`} detail={formatMoney(data.country,12000)} onPress={()=>actions.go('orders')}/><MenuRow icon="bag-handle-outline" label={`${merchant?localisedStoreName(merchant,data.country):'Local store'} order`} detail={formatMoney(data.country,48500)} onPress={()=>actions.go('orders')}/></RoundedCard></ScrollView><BottomNav active="activity" go={actions.go}/></ScreenShell>;
}

export function OrdersScreen({ data, actions }: { data: AppData; actions: AppActions }) {
  const otherCity = (countryCities[data.country] ?? []).find((item)=>item!==data.city) ?? data.city;
  const restaurantName = localisedRestaurantName(DEMO_RESTAURANTS[0]!, data.country, data.city);
  return <ScreenShell><Header title="Orders"/><KareebuContextBar label={`Food, shops and parcels · ${data.city}`}/><ScrollView style={styles.flex} contentContainerStyle={styles.genericScroll}><Pressable onPress={()=>actions.go('orderTracking')}><RoundedCard style={styles.orderCard}><Image source={assets.food.cafeJavas} style={styles.orderImage}/><View style={styles.flex}><Text style={styles.orderTitle}>{restaurantName}</Text><Text style={styles.orderMeta}>2 items · Preparing</Text><Text style={styles.orderPrice}>{formatMoney(data.country,37000)}</Text></View><Feather name="chevron-right" size={26}/></RoundedCard></Pressable><RoundedCard style={styles.orderCard}><Image source={assets.service.send} style={styles.orderImage}/><View style={styles.flex}><Text style={styles.orderTitle}>Parcel to {otherCity}</Text><Text style={styles.orderMeta}>Documents · In transit</Text><Text style={styles.orderPrice}>{formatMoney(data.country,12000)}</Text></View><Feather name="chevron-right" size={26}/></RoundedCard></ScrollView><BottomNav active="orders" go={actions.go}/></ScreenShell>;
}

export function renderScreen(screen: Screen, data: AppData, actions: AppActions) {
  switch (screen) {
    case 'splash': return <SplashScreen go={actions.go}/>;
    case 'welcome': return <WelcomeScreen go={actions.go} setGuest={actions.setGuest}/>;
    case 'country': return <CountryScreen data={data} actions={actions}/>;
    case 'city': return <CityScreen data={data} actions={actions}/>;
    case 'location': return <LocationScreen data={data} actions={actions}/>;
    case 'locationPicker': return <LocationPickerScreen data={data} actions={actions}/>;
    case 'phone': return <PhoneScreen data={data} actions={actions}/>;
    case 'otp': return <OtpScreen data={data} actions={actions}/>;
    case 'profile': return <ProfileScreen data={data} actions={actions}/>;
    case 'permissions': return <PermissionsScreen data={data} actions={actions}/>;
    case 'home': return <HomeScreen data={data} actions={actions}/>;
    case 'search': return <GlobalSearchScreen data={data} actions={actions}/>;
    case 'assistant': return <KareebuAssistantScreen data={data} actions={actions}/>;
    case 'services': return <AllServicesScreen data={data} actions={actions}/>;
    case 'place': return <GlobalSearchScreen data={data} actions={actions}/>;
    case 'whereTo': return <WhereToScreen data={data} actions={actions}/>;
    case 'chooseRide': return <ChooseRideScreen data={data} actions={actions}/>;
    case 'confirmBooking': return <ConfirmBookingScreen data={data} actions={actions}/>;
    case 'driver': return <DriverScreen data={data} actions={actions}/>;
    case 'onTrip': return <OnTripScreen data={data} actions={actions}/>;
    case 'tripComplete': return <TripCompleteScreen data={data} actions={actions}/>;
    case 'rateTrip': return <RateTripScreen data={data} actions={actions}/>;
    case 'food': return <FoodScreen data={data} actions={actions}/>;
    case 'restaurant': return <RestaurantScreen data={data} actions={actions}/>;
    case 'cart': return <CartScreen data={data} actions={actions}/>;
    case 'orderTracking': return <OrderTrackingScreen data={data} actions={actions}/>;
    case 'shops': return <ShopsScreen data={data} actions={actions}/>;
    case 'shop': return <StorefrontScreen data={data} actions={actions}/>;
    case 'parcel': return <ParcelScreen data={data} actions={actions}/>;
    case 'wallet': return <WalletScreen data={data} actions={actions}/>;
    case 'account': return <AccountScreen data={data} actions={actions}/>;
    case 'activity': return <ActivityScreen data={data} actions={actions}/>;
    case 'orders': return <OrdersScreen data={data} actions={actions}/>;
  }
}

const styles = StyleSheet.create({
  flex:{flex:1}, pressed:{opacity:.62}, rowDivider:{borderBottomWidth:1,borderBottomColor:COLORS.line}, star:{color:COLORS.yellow},
  globalSearchHeader:{flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:18,paddingTop:9,paddingBottom:10,backgroundColor:COLORS.white,borderBottomWidth:1,borderBottomColor:COLORS.line},
  globalSearchBack:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},
  globalSearchInputWrap:{flex:1,height:50,borderRadius:16,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14},
  globalSearchInput:{flex:1,...TYPE.body,color:COLORS.black,paddingVertical:0}, globalSearchClear:{width:30,height:30,borderRadius:15,backgroundColor:COLORS.line,alignItems:'center',justifyContent:'center'},
  globalSearchScroll:{paddingHorizontal:20,paddingTop:18,paddingBottom:34,gap:22}, globalSearchTitle:{...TYPE.screenTitle,color:COLORS.black}, globalSearchIntro:{...TYPE.body,color:COLORS.muted,marginTop:7,lineHeight:21},
  globalSearchSectionTitle:{...TYPE.sectionTitle,color:COLORS.black,marginBottom:10}, globalSearchChips:{flexDirection:'row',flexWrap:'wrap',gap:9}, globalSearchChip:{height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:13}, globalSearchChipText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},
  globalSearchBrowseGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10}, globalSearchBrowseCard:{width:'48.6%',minHeight:112,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:13}, globalSearchBrowseIcon:{width:38,height:38,borderRadius:12,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginBottom:9}, globalSearchBrowseTitle:{...TYPE.cardTitle,color:COLORS.black}, globalSearchBrowseSub:{...TYPE.small,color:COLORS.muted,marginTop:4,lineHeight:17},
  globalSearchGroup:{gap:0}, globalSearchResultList:{borderWidth:1,borderColor:COLORS.line,borderRadius:18,overflow:'hidden',backgroundColor:COLORS.white}, globalSearchResult:{minHeight:66,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:COLORS.line}, globalSearchResultIcon:{width:40,height:40,borderRadius:13,alignItems:'center',justifyContent:'center'}, globalSearchResultTitle:{...TYPE.cardTitle,color:COLORS.black}, globalSearchResultSubtitle:{...TYPE.small,color:COLORS.muted,marginTop:3},
  globalSearchEmpty:{alignItems:'center',paddingVertical:72,paddingHorizontal:28}, globalSearchEmptyIcon:{width:64,height:64,borderRadius:32,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginBottom:18}, globalSearchEmptyTitle:{...TYPE.sectionTitle,textAlign:'center',color:COLORS.black}, globalSearchEmptyText:{...TYPE.body,textAlign:'center',color:COLORS.muted,marginTop:8,lineHeight:21},
  onboardingBody:{flex:1}, onboardingFooter:{paddingHorizontal:24,paddingBottom:18,paddingTop:10,backgroundColor:COLORS.white}, onboardingPadding:{paddingHorizontal:24},
  onboardingTitle:{...TYPE.screenTitle,color:COLORS.black,marginTop:8}, onboardingSubtitle:{...TYPE.body,color:COLORS.muted,marginTop:10},
  splash:{flex:1,backgroundColor:'#050506',alignItems:'center',justifyContent:'center',overflow:'hidden'}, splashWordmark:{width:'84%',height:245,marginTop:-120}, splashTagline:{alignItems:'center',marginTop:34,zIndex:2}, splashTaglineWhite:{fontFamily:FONT.bold,fontSize:22,fontWeight:'800',color:COLORS.white}, splashTaglineYellow:{fontFamily:FONT.bold,fontSize:22,fontWeight:'800',color:COLORS.yellow,marginTop:4}, splashRibbons:{position:'absolute',left:-100,right:-100,bottom:-75,width:'140%',height:500}, splashHint:{position:'absolute',bottom:27,color:'rgba(255,255,255,.55)',fontFamily:FONT.regular,fontSize:12},
  welcomeScreen:{flex:1,paddingHorizontal:22,paddingTop:8,paddingBottom:10}, welcomeTop:{flexShrink:0,marginTop:2}, welcomeKicker:{fontFamily:FONT.bold,fontSize:20,fontWeight:'800',color:COLORS.black}, welcomeTitle:{fontFamily:FONT.bold,fontSize:28,lineHeight:34,fontWeight:'900',letterSpacing:-1.25,color:COLORS.black,marginTop:0}, welcomeRed:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',color:COLORS.red,marginTop:9}, welcomeLine:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',color:COLORS.black,marginTop:1}, welcomeHeroFrame:{flex:1,minHeight:190,alignItems:'center',justifyContent:'center',overflow:'hidden',marginTop:2}, welcomeHero:{width:'100%',height:'100%'}, welcomeServices:{height:84,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:COLORS.line,borderRadius:19,paddingHorizontal:7,backgroundColor:COLORS.white,...SHADOW}, welcomeServiceItem:{alignItems:'center',justifyContent:'center',width:'24%',gap:3}, welcomeServiceIcon:{width:42,height:42}, welcomeServiceLabel:{fontFamily:FONT.medium,fontSize:13,fontWeight:'700',color:COLORS.black}, welcomeActions:{paddingTop:13,alignItems:'stretch',gap:1}, guestNote:{fontFamily:FONT.regular,fontSize:12,lineHeight:18,color:COLORS.muted,textAlign:'center',paddingHorizontal:24},
  countryCard:{height:78,flexDirection:'row',alignItems:'center',paddingHorizontal:18,gap:13,marginTop:28},flagImage:{width:44,height:44,borderRadius:22},countryName:{flex:1,...TYPE.sectionTitle},groupLabel:{...TYPE.sectionTitle,marginTop:28,marginBottom:13},cityCard:{paddingHorizontal:15},cityRow:{height:68,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10,borderRadius:16},cityRowSelected:{borderWidth:1.5,borderColor:COLORS.red,backgroundColor:'#FFF7F7',marginVertical:5},cityName:{...TYPE.bodyStrong},radio:{width:24,height:24,borderRadius:12,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},radioSelected:{backgroundColor:COLORS.red,borderColor:COLORS.red},
  phoneContent:{flex:1},phoneFields:{marginTop:70,gap:18},countryCodeCard:{height:64,flexDirection:'row',alignItems:'center',paddingHorizontal:18,gap:14},flagImageSmall:{width:40,height:40,borderRadius:20},countryFlagEmoji:{fontSize:29},countryCode:{flex:1,...TYPE.sectionTitle},bottomTrust:{marginTop:'auto',paddingBottom:20},phoneSummary:{...TYPE.sectionTitle,marginTop:5},otpContent:{flex:1},otpRow:{flexDirection:'row',justifyContent:'space-between',marginTop:105},otpBox:{width:48,height:60,borderWidth:1.2,borderColor:COLORS.line,borderRadius:13,fontFamily:FONT.bold,fontSize:25,fontWeight:'800',color:COLORS.black,backgroundColor:COLORS.white},resendRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,marginTop:70},resendText:{...TYPE.bodyStrong,color:COLORS.muted},resendTime:{color:COLORS.red,fontWeight:'800'},avatarPlaceholder:{alignSelf:'center',width:188,height:188,borderRadius:94,backgroundColor:'#F0F1F3',alignItems:'center',justifyContent:'center',marginTop:58},avatarCamera:{position:'absolute',right:8,bottom:14,width:46,height:46,borderRadius:23,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',borderWidth:4,borderColor:COLORS.white},profileFields:{gap:22,marginTop:55,paddingBottom:20},formHelp:{...TYPE.body,color:COLORS.muted},
  permissionsScroll:{paddingBottom:26},permissionsPadding:{paddingHorizontal:24,paddingTop:32,gap:18},permissionsTitle:{...TYPE.screenTitle},permissionsSubtitle:{...TYPE.body,color:COLORS.muted,marginBottom:10},permissionStack:{gap:0},permissionCard:{minHeight:132,borderWidth:1,borderColor:COLORS.line,borderRadius:22,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:17,padding:20,...SHADOW},permissionTitle:{...TYPE.cardTitle},permissionBody:{...TYPE.small,color:COLORS.muted,marginTop:5},permissionCheck:{width:32,height:32,borderRadius:16,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},permissionCheckEnabled:{backgroundColor:COLORS.red,borderColor:COLORS.red},previewTitle:{...TYPE.sectionTitle,marginTop:10},previewSubtitle:{...TYPE.body,color:COLORS.muted,marginTop:-12},homePreview:{padding:15,gap:11},previewHeader:{flexDirection:'row',alignItems:'center',gap:7},previewLocation:{flex:1,fontFamily:FONT.bold,fontSize:13,fontWeight:'800'},previewBalance:{flexDirection:'row',alignItems:'center',gap:5,borderWidth:1,borderColor:COLORS.line,borderRadius:12,padding:7},miniMark:{width:20,height:20},previewBalanceText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800'},previewSearch:{height:42,borderWidth:1,borderColor:COLORS.line,borderRadius:13,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:12},previewSearchText:{fontFamily:FONT.regular,color:COLORS.muted,fontSize:12},previewServices:{flexDirection:'row',gap:7},previewService:{flex:1,alignItems:'center',gap:4,borderWidth:1,borderColor:COLORS.line,borderRadius:12,paddingVertical:7},previewServiceIcon:{width:30,height:30},previewServiceText:{fontFamily:FONT.medium,fontSize:10,fontWeight:'700'},
  homeHeader:{height:70,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},homeLocation:{flexDirection:'row',alignItems:'center',gap:6,flexShrink:1},homeLocationText:{...TYPE.cardTitle,flexShrink:1},balancePill:{height:42,borderWidth:1,borderColor:COLORS.line,borderRadius:14,flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:10,backgroundColor:COLORS.white},balanceMark:{width:25,height:25},balanceText:{...TYPE.bodyStrong},homeScroll:{paddingHorizontal:20,paddingBottom:34,gap:24},searchBar:{height:58,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16},searchPlaceholder:{...TYPE.body,color:COLORS.mutedLight,flexShrink:1},serviceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},kareebuPromo:{height:146,borderRadius:18,overflow:'hidden',backgroundColor:'#0D0D0E',position:'relative',...SHADOW},kareebuPromoVisual:{...StyleSheet.absoluteFill,width:'100%',height:'100%'},kareebuPromoCopy:{position:'absolute',left:17,top:13,bottom:13,width:'52%',justifyContent:'space-between'},kareebuPromoBrand:{fontFamily:FONT.bold,fontSize:22,lineHeight:24,fontWeight:'900',color:COLORS.white},kareebuPromoTier:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',letterSpacing:4.5,color:COLORS.yellow,marginTop:0},kareebuPromoBody:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:15,color:'#F1F1F1',marginVertical:4},kareebuPromoButton:{height:30,alignSelf:'flex-start',borderRadius:9,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',paddingHorizontal:11},kareebuPromoButtonText:{fontFamily:FONT.bold,fontSize:10.5,fontWeight:'900',color:COLORS.black},kareebuPromoMiniCard:{position:'absolute',right:13,bottom:13,width:78,height:45,borderRadius:9,borderWidth:1,borderColor:'#765D16',backgroundColor:'#141414',alignItems:'center',justifyContent:'center'},kareebuPromoCardBrand:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.white},kareebuPromoCardTier:{fontFamily:FONT.bold,fontSize:7,fontWeight:'900',letterSpacing:2.2,color:COLORS.yellow,marginTop:2},recentActivityMap:{width:'100%',aspectRatio:1,borderRadius:20,overflow:'hidden',backgroundColor:COLORS.surface,marginBottom:14,...SHADOW},recentActivityMapImage:{width:'100%',height:'100%'},recentActivityMapLocation:{position:'absolute',left:12,top:12,height:34,borderRadius:17,paddingHorizontal:11,backgroundColor:'rgba(255,255,255,0.96)',flexDirection:'row',alignItems:'center',gap:5,borderWidth:1,borderColor:COLORS.line},recentActivityMapLocationText:{fontFamily:FONT.bold,fontSize:12.5,fontWeight:'800',color:COLORS.black},recentActivityMapExpand:{position:'absolute',right:12,top:12,width:34,height:34,borderRadius:17,backgroundColor:'rgba(255,255,255,0.96)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:COLORS.line},activityCard:{shadowOpacity:0,borderRadius:18},activityRow:{minHeight:66,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:13},activityIcon:{width:36,height:36},activityImage:{width:45,height:45,borderRadius:22},activityTitle:{...TYPE.cardTitle,paddingRight:5},activityMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},activityAmount:{...TYPE.bodyStrong},horizontalList:{gap:11,paddingRight:8},homeFoodCard:{width:158,borderWidth:1,borderColor:COLORS.line,borderRadius:17,backgroundColor:COLORS.white,overflow:'hidden',...SHADOW},homeFoodImage:{width:'100%',height:94,backgroundColor:COLORS.surface},homeFoodTitle:{...TYPE.cardTitle},homeFoodMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},homeShopRow:{flexDirection:'row',justifyContent:'space-between'},homeShopCard:{width:'31%',alignItems:'center',borderWidth:1,borderColor:COLORS.line,borderRadius:18,padding:12,gap:7},homeShopLogo:{width:70,height:70,borderRadius:15},homeShopLabel:{fontFamily:FONT.medium,fontSize:13,fontWeight:'700'},
  whereScroll:{paddingHorizontal:20,paddingBottom:24,gap:14},routeCard:{zIndex:2,shadowOpacity:.04},routeLineRow:{minHeight:70,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:15},routeDivider:{height:1,backgroundColor:COLORS.line,marginLeft:44,marginRight:15},routeLabel:{...TYPE.caption,color:COLORS.muted},routeValue:{...TYPE.cardTitle,marginTop:2},smallOutlineButton:{borderWidth:1,borderColor:COLORS.line,borderRadius:12,paddingHorizontal:11,paddingVertical:8},smallOutlineText:{...TYPE.label,color:COLORS.black},plusButton:{width:46,height:46,borderWidth:1,borderColor:COLORS.line,borderRadius:14,alignItems:'center',justifyContent:'center'},whereMap:{width:'100%',aspectRatio:1.35,marginTop:-2},suggestedCard:{paddingHorizontal:14,paddingTop:14,shadowOpacity:0},suggestedTitle:{...TYPE.sectionTitle,marginBottom:2},placeRow:{minHeight:70,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},placeTitle:{...TYPE.cardTitle},placeSubtitle:{...TYPE.small,color:COLORS.muted,marginTop:2},
  rideScroll:{paddingHorizontal:20,paddingBottom:28,gap:13},rideList:{gap:9},rideOption:{minHeight:86,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14},rideOptionSelected:{borderColor:COLORS.red,borderWidth:1.8,backgroundColor:'#FFF4F1'},rideIcon:{width:58,height:58},rideName:{...TYPE.cardTitle},rideEta:{...TYPE.small,color:COLORS.muted,marginTop:2},rideFare:{...TYPE.cardTitle,color:COLORS.black},rideRadio:{width:25,height:25,borderRadius:13,borderWidth:2,borderColor:COLORS.mutedLight,alignItems:'center',justifyContent:'center'},rideRadioSelected:{backgroundColor:COLORS.red,borderColor:COLORS.red},scheduleCard:{shadowOpacity:0},scheduleRow:{height:66,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:14},scheduleTitle:{...TYPE.cardTitle},scheduleSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},paymentSummary:{minHeight:66,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:14,shadowOpacity:0},paymentTitle:{...TYPE.cardTitle},paymentSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:2},estimatedLabel:{...TYPE.caption,color:COLORS.muted},estimatedFare:{fontFamily:FONT.bold,fontSize:23,lineHeight:28,fontWeight:'900',color:COLORS.black,marginTop:1},
  confirmScroll:{paddingHorizontal:20,paddingBottom:28,gap:15},confirmRouteCard:{padding:18,shadowOpacity:0},confirmRouteRow:{flexDirection:'row',alignItems:'center',gap:12,minHeight:42},confirmRouteText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},confirmRouteConnector:{width:2,height:20,backgroundColor:COLORS.lineDark,marginLeft:8},confirmRouteMeta:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:10,marginLeft:30},paymentChoices:{paddingHorizontal:14,shadowOpacity:0},paymentChoice:{minHeight:70,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},paymentChoiceSelected:{},priceTitle:{...TYPE.cardTitle,marginTop:3},priceRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',minHeight:30},priceLabel:{fontFamily:FONT.regular,fontSize:15,color:COLORS.muted},priceValue:{fontFamily:FONT.medium,fontSize:15,color:COLORS.black},totalRow:{borderTopWidth:1,borderTopColor:COLORS.line,marginTop:5,paddingTop:9},totalLabel:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},totalValue:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900'},cancelPolicy:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,textAlign:'center'},
  etaText:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:COLORS.red,textAlign:'center',marginBottom:10},driverScroll:{paddingHorizontal:20,paddingBottom:25,gap:13},driverMap:{width:'100%',height:310,borderRadius:22},driverProfile:{minHeight:108,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:14,shadowOpacity:.04},driverAvatar:{width:70,height:70,borderRadius:35},driverName:{fontFamily:FONT.bold,fontSize:21,fontWeight:'900'},driverRating:{fontFamily:FONT.medium,fontSize:15,color:COLORS.muted,marginTop:2},driverMeta:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,marginTop:3},circleAction:{width:49,height:49,borderRadius:25,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},driverActionGrid:{flexDirection:'row',justifyContent:'space-between'},driverAction:{width:'23%',height:72,borderWidth:1,borderColor:COLORS.line,borderRadius:17,alignItems:'center',justifyContent:'center',gap:6},driverActionLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.black},tripScroll:{paddingHorizontal:20,paddingBottom:24,gap:13},tripMap:{width:'100%',height:284,borderRadius:22},tripSummary:{padding:17,shadowOpacity:.04},tripLabel:{fontFamily:FONT.regular,fontSize:17,color:COLORS.muted},tripDestination:{...TYPE.screenTitle,marginTop:4},tripRule:{height:1,backgroundColor:COLORS.line,marginVertical:18},tripStats:{flexDirection:'row',justifyContent:'space-between'},tripStatLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},tripStatValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',marginTop:7},tripButtons:{flexDirection:'row',gap:10,marginVertical:22},tripSecondary:{flex:1,height:54,borderWidth:1,borderColor:COLORS.line,borderRadius:16,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},tripSecondaryText:{fontFamily:FONT.medium,fontSize:14,fontWeight:'700'},
  completeScroll:{paddingHorizontal:22,paddingBottom:24,alignItems:'stretch',gap:17},completeBadge:{width:112,height:112,borderRadius:56,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',alignSelf:'center',marginTop:15},completeThankYou:{fontFamily:FONT.bold,fontSize:22,fontWeight:'900',textAlign:'center'},completeRouteCard:{padding:18,gap:12,shadowOpacity:0},completePlace:{flexDirection:'row',alignItems:'center',gap:12},completePlaceText:{fontFamily:FONT.medium,fontSize:16,fontWeight:'700'},completeMeta:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginLeft:29},receiptCard:{padding:18,gap:8,shadowOpacity:0},receiptTitle:{...TYPE.cardTitle,marginBottom:5},paidWith:{flexDirection:'row',alignItems:'center',gap:12,borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:14,marginTop:5},rateScroll:{paddingHorizontal:20,paddingBottom:25,gap:20},rateQuestion:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',textAlign:'center'},starsRow:{flexDirection:'row',justifyContent:'center',gap:5},rateWord:{fontFamily:FONT.medium,fontSize:15,color:COLORS.muted,textAlign:'center',marginTop:-12},tipCard:{padding:18,shadowOpacity:0},tipTitle:{...TYPE.cardTitle},tipSubtitle:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},tipRow:{flexDirection:'row',gap:8,marginVertical:18},tipOption:{flex:1,minHeight:42,borderWidth:1,borderColor:COLORS.line,borderRadius:11,alignItems:'center',justifyContent:'center'},tipOptionSelected:{borderColor:COLORS.red,backgroundColor:'#FFF2F2'},tipOptionText:{fontFamily:FONT.medium,fontSize:12,fontWeight:'700'},tipOptionTextSelected:{color:COLORS.red},
  commerceScroll:{paddingHorizontal:20,paddingBottom:28,gap:20},commerceHeader:{minHeight:60,flexDirection:'row',alignItems:'center'},commerceTitle:{...TYPE.screenTitle,flex:1},commerceLocation:{flexDirection:'row',alignItems:'center',gap:6},commerceLocationText:{...TYPE.bodyStrong},cartButton:{width:42,alignItems:'flex-end'},categoryPanel:{minHeight:116,borderWidth:1,borderColor:COLORS.line,borderRadius:22,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:5},categoryItem:{alignItems:'center',gap:8},categoryCircle:{width:49,height:49,borderRadius:25,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},categoryLabel:{...TYPE.label},categoryEmoji:{fontSize:24},commercePromo:{width:'100%',height:157,borderRadius:22},restaurantRow:{flexDirection:'row',justifyContent:'space-between'},restaurantCard:{width:'31%'},restaurantImage:{width:'100%',aspectRatio:.76,borderRadius:17},restaurantName:{...TYPE.bodyStrong,marginTop:9},restaurantRating:{...TYPE.small,color:COLORS.muted,marginTop:5},restaurantMeta:{...TYPE.caption,color:COLORS.muted,marginTop:4},bottomNav:{minHeight:78,paddingBottom:8,borderTopWidth:1,borderTopColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},bottomNavItem:{flex:1,alignItems:'center',justifyContent:'center',gap:4},bottomNavLabel:{...TYPE.label,fontFamily:FONT.regular,fontWeight:'400',color:COLORS.muted},bottomNavLabelActive:{color:COLORS.red,fontFamily:FONT.bold,fontWeight:'800'},
  restaurantDetailScroll:{paddingHorizontal:20,paddingBottom:105},restaurantHero:{width:'100%',height:250,borderRadius:24},restaurantDetailName:{...TYPE.screenTitle,marginTop:18},restaurantDetailMeta:{...TYPE.body,color:COLORS.muted,marginTop:7},restaurantDetailSub:{...TYPE.small,color:COLORS.muted,marginTop:5},badgeRow:{flexDirection:'row',gap:8,marginTop:13,marginBottom:25},badge:{borderWidth:1,borderColor:COLORS.line,borderRadius:16,paddingHorizontal:11,paddingVertical:7},badgeText:{...TYPE.label},menuItem:{minHeight:92,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},menuImage:{width:70,height:70,borderRadius:15},menuName:{...TYPE.cardTitle},menuPrice:{...TYPE.small,color:COLORS.muted,marginTop:5},addButton:{width:38,height:38,borderWidth:1,borderColor:COLORS.line,borderRadius:19,alignItems:'center',justifyContent:'center'},viewCartBar:{position:'absolute',left:20,right:20,bottom:12,height:70,borderRadius:18,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18},viewCartTitle:{...TYPE.bodyStrong,color:COLORS.white},viewCartMeta:{...TYPE.small,color:'#D8D8D8',marginTop:3},cartScroll:{paddingHorizontal:20,paddingBottom:28,gap:18},cartRestaurant:{...TYPE.sectionTitle},cartItem:{minHeight:92,flexDirection:'row',alignItems:'center',gap:12},cartImage:{width:72,height:72,borderRadius:15},quantity:{height:38,borderWidth:1,borderColor:COLORS.line,borderRadius:13,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:9},quantityText:{fontFamily:FONT.bold,fontWeight:'800'},cartTotals:{gap:5},orderTrackingScroll:{paddingHorizontal:20,paddingBottom:24,gap:10},orderId:{...TYPE.cardTitle},orderEta:{...TYPE.cardTitle,color:COLORS.red},orderRestaurant:{...TYPE.small,color:COLORS.muted},orderMap:{width:'100%',height:310,borderRadius:22,marginVertical:10},referralCard:{minHeight:74,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16,backgroundColor:COLORS.yellowSoft,shadowOpacity:0},referralTitle:{...TYPE.cardTitle},referralBody:{...TYPE.small,color:COLORS.muted,marginTop:3},deliverLabel:{...TYPE.small,color:COLORS.muted,marginTop:-10},deliverRow:{flexDirection:'row',alignItems:'center',gap:6,marginTop:-12},deliverAddress:{...TYPE.bodyStrong},storeRow:{flexDirection:'row',justifyContent:'space-between'},storeCard:{width:'23%',alignItems:'center'},storeLogo:{width:'100%',aspectRatio:1,borderWidth:1,borderColor:COLORS.line,borderRadius:18},storeName:{...TYPE.label,marginTop:9},storeRating:{...TYPE.caption,color:COLORS.muted,marginTop:5},
  parcelScroll:{paddingHorizontal:20,paddingBottom:28,gap:16},segmented:{height:60,borderWidth:1,borderColor:COLORS.line,borderRadius:19,flexDirection:'row',padding:4},segment:{flex:1,borderRadius:15,alignItems:'center',justifyContent:'center'},segmentActive:{backgroundColor:COLORS.white,...SHADOW},segmentText:{fontFamily:FONT.medium,fontSize:16,color:COLORS.muted},segmentTextActive:{color:COLORS.black,fontWeight:'800'},parcelCard:{minHeight:112,flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:17,shadowOpacity:0},parcelIcon:{width:48,alignItems:'center'},parcelLabel:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted},parcelValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'800',marginTop:6},parcelDetail:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:4},parcelEstimate:{fontFamily:FONT.regular,fontSize:14,color:COLORS.muted,textAlign:'center'},
  walletScroll:{paddingHorizontal:20,paddingBottom:25,gap:24},walletCard:{height:210,borderRadius:22,backgroundColor:'#151515',padding:22,overflow:'hidden'},walletCardLabel:{fontFamily:FONT.regular,fontSize:17,color:COLORS.white},walletBalance:{fontFamily:FONT.bold,fontSize:39,fontWeight:'900',color:COLORS.white,marginTop:10},walletCardSub:{fontFamily:FONT.regular,fontSize:17,color:COLORS.white,marginTop:5},topUpButton:{width:110,height:48,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginTop:17},topUpText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900'},walletCardMark:{position:'absolute',right:18,bottom:16,width:50,height:50},walletActions:{flexDirection:'row',justifyContent:'space-between'},walletAction:{width:'24%',alignItems:'center',gap:8},walletActionLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted,textAlign:'center'},walletSectionTitle:{...TYPE.sectionTitle},walletSectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},walletPayments:{paddingHorizontal:15,shadowOpacity:0},walletPayment:{minHeight:74,flexDirection:'row',alignItems:'center',gap:13,borderBottomWidth:1,borderBottomColor:COLORS.line},walletPaymentTitle:{...TYPE.cardTitle},walletPaymentSub:{fontFamily:FONT.regular,fontSize:13,color:COLORS.muted,marginTop:3},walletRadio:{width:27,height:27,borderRadius:14,borderWidth:2,borderColor:COLORS.mutedLight,alignItems:'center',justifyContent:'center'},walletRadioSelected:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellow},businessCard:{minHeight:75,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16,shadowOpacity:0},businessIcon:{width:42,height:42,borderRadius:11,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center'},businessText:{flex:1,fontFamily:FONT.bold,fontSize:16,fontWeight:'800'},
  accountScroll:{paddingHorizontal:20,paddingBottom:25,gap:24},accountProfile:{flexDirection:'row',alignItems:'center',gap:18},accountAvatar:{width:112,height:112,borderRadius:56},accountName:{...TYPE.screenTitle},accountPhone:{...TYPE.body,color:COLORS.muted,marginTop:5},viewProfile:{...TYPE.action,color:COLORS.red,marginTop:8},blackMembership:{height:78,borderRadius:18,backgroundColor:'#171717',flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16},membershipMark:{width:38,height:38},membershipText:{flex:1,...TYPE.cardTitle,color:COLORS.white},membershipStatus:{...TYPE.small,color:COLORS.white},accountMenu:{shadowOpacity:.04},guestAccount:{flex:1,paddingHorizontal:28,alignItems:'center',justifyContent:'center',gap:18},guestAvatar:{width:135,height:135,borderRadius:68,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'center'},guestAccountTitle:{...TYPE.screenTitle,textAlign:'center'},guestAccountText:{...TYPE.body,color:COLORS.muted,textAlign:'center',marginBottom:10},genericScroll:{padding:20,gap:20},orderCard:{minHeight:110,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:15,shadowOpacity:0},orderImage:{width:76,height:76,borderRadius:17},orderTitle:{...TYPE.cardTitle},orderMeta:{...TYPE.small,color:COLORS.muted,marginTop:5},orderPrice:{...TYPE.bodyStrong,marginTop:5},

  homeStoreList:{gap:10,paddingRight:8},homeStoreCard:{width:142,borderWidth:1,borderColor:COLORS.line,borderRadius:17,backgroundColor:COLORS.white,padding:10,...SHADOW},homeStoreName:{...TYPE.cardTitle,marginTop:8},homeStoreMeta:{...TYPE.caption,color:COLORS.muted,marginTop:4},
  v35PopularStoresHeader:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:4,marginBottom:12},v35PopularStoresTitle:{...TYPE.sectionTitle,color:COLORS.black},v35PopularStoresLocale:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v35HomeStoreCard:{width:154,minHeight:192,padding:12},v35StoreLogoArea:{height:52,borderRadius:13,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',paddingHorizontal:8},v35StoreBrandImage:{width:'100%',height:34},v35HomeStoreName:{fontSize:15,lineHeight:18,minHeight:36,marginTop:9},
  v35CapitalLogo:{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4},v35CapitalLogoText:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:'#E1282D',letterSpacing:.2},
  v35QualityLogo:{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,backgroundColor:'#60358E',borderRadius:9,paddingVertical:7,paddingHorizontal:8},v35QualityQ:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',color:COLORS.white},v35QualityText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.white,letterSpacing:.5},
  v35KareebuStoreLogo:{flexDirection:'row',alignItems:'center',gap:6},v35KareebuStoreMark:{width:26,height:26},v35KareebuStoreText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black,letterSpacing:1.4},v35FallbackStoreLogo:{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},v35FallbackStoreText:{maxWidth:88,...TYPE.caption,fontWeight:'800',color:COLORS.black},
  v37NaivasLogo:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:3},v37NaivasName:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',color:'#159447',letterSpacing:-.5},v37NaivasLeaf:{width:8,height:12,borderTopLeftRadius:8,borderBottomRightRadius:8,backgroundColor:'#E5332A',transform:[{rotate:'-22deg'}]},
  v37QuickmartLogo:{flexDirection:'row',alignItems:'baseline',justifyContent:'center'},v37QuickmartQuick:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:'#1E8D44'},v37QuickmartMart:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:'#F28B22'},
  v37ShoppersLogo:{alignItems:'center',justifyContent:'center'},v37ShoppersName:{fontFamily:FONT.bold,fontSize:15,fontWeight:'900',color:'#C62828',letterSpacing:.8},v37ShoppersSub:{fontFamily:FONT.bold,fontSize:7,fontWeight:'800',color:'#4A4A4A',letterSpacing:1.4,marginTop:1},
  v37VillageLogo:{alignItems:'center',justifyContent:'center'},v37VillageName:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',color:'#161616',letterSpacing:-.3},v37VillageSub:{fontFamily:FONT.bold,fontSize:7,fontWeight:'800',color:'#B08A3B',letterSpacing:1.2,marginTop:1},
  v37BreezeLogo:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},v37BreezeName:{fontFamily:FONT.bold,fontSize:15,fontWeight:'900',color:'#1B83C5'},v37BreezeSub:{fontFamily:FONT.bold,fontSize:6.5,fontWeight:'800',color:'#6A7C88',letterSpacing:1.1},
  storeBrandMark:{height:76,borderRadius:15,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},storeBrandMarkCompact:{height:58},storeBrandLetter:{fontFamily:FONT.bold,fontSize:29,fontWeight:'900'},storeBrandLetterCompact:{fontSize:23},
  rideRouteSummary:{padding:15,shadowOpacity:0,backgroundColor:COLORS.surface},rideRouteTop:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},rideRouteEyebrow:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.6,color:COLORS.muted},rideRouteEta:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.green},rideRoutePlace:{...TYPE.cardTitle,marginTop:7},rideRouteMeta:{...TYPE.small,color:COLORS.muted,marginTop:4},
  rideStatusBar:{paddingHorizontal:20,paddingBottom:9,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},rideStatusEyebrow:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.5,color:COLORS.muted},rideStatusTitle:{...TYPE.sectionTitle,marginTop:2},liveChip:{height:30,borderRadius:15,backgroundColor:COLORS.greenSoft,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10},liveDot:{width:8,height:8,borderRadius:4,backgroundColor:COLORS.green},liveChipText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.green},pickupCodeCard:{minHeight:112,flexDirection:'row',alignItems:'center',gap:14,padding:16,shadowOpacity:0,backgroundColor:COLORS.yellowSoft},pickupCodeIcon:{width:44,height:44,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},pickupCodeLabel:{fontFamily:FONT.medium,fontSize:12,color:COLORS.muted},pickupCode:{fontFamily:FONT.bold,fontSize:27,fontWeight:'900',letterSpacing:6,marginTop:1},pickupCodeHelp:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:15,color:COLORS.muted,marginTop:3},flowHelp:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.muted,textAlign:'center',paddingHorizontal:14,marginTop:7},
  categoryScroll:{gap:10,paddingRight:8},commerceCategory:{minWidth:72,alignItems:'center',gap:7},commerceCategoryIcon:{width:48,height:48,borderRadius:16,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},commerceCategoryIconActive:{backgroundColor:COLORS.orange,borderColor:COLORS.orange},shopCategoryIconActive:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellow},commerceCategoryLabel:{...TYPE.label,color:COLORS.black},commerceCategoryLabelActive:{color:COLORS.orange},
  foodHero:{height:154,borderRadius:20,backgroundColor:COLORS.orange,overflow:'hidden',position:'relative'},foodHeroCopy:{position:'absolute',left:18,top:16,bottom:14,width:'62%',zIndex:2},foodHeroEyebrow:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.6,color:'#FFE1CF'},foodHeroTitle:{...TYPE.sectionTitle,color:COLORS.white,marginTop:4},foodHeroBody:{...TYPE.small,color:'#FFF2E8',marginTop:5},foodHeroButton:{height:29,alignSelf:'flex-start',borderRadius:9,backgroundColor:COLORS.white,paddingHorizontal:11,alignItems:'center',justifyContent:'center',marginTop:'auto'},foodHeroButtonText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.orange},foodHeroImage:{position:'absolute',right:-10,bottom:-10,width:148,height:148},restaurantHorizontalList:{gap:13,paddingRight:8},restaurantCardWide:{width:205},restaurantImageWide:{width:205,height:126,borderRadius:17,backgroundColor:COLORS.surfaceStrong},restaurantNameWide:{...TYPE.cardTitle,marginTop:8},restaurantRatingWide:{...TYPE.small,color:COLORS.black,marginTop:4},restaurantMetaWide:{...TYPE.small,color:COLORS.muted,marginTop:3},quickPickRow:{flexDirection:'row',gap:9},quickPickCard:{flex:1,minHeight:88,borderRadius:16,padding:12,justifyContent:'space-between'},quickPickText:{...TYPE.label,color:COLORS.black},
  shopHero:{height:158,borderRadius:20,backgroundColor:COLORS.yellow,overflow:'hidden',position:'relative'},shopHeroCopy:{position:'absolute',left:18,top:15,bottom:14,width:'64%',zIndex:2},shopHeroEyebrow:{fontFamily:FONT.bold,fontSize:10,fontWeight:'900',letterSpacing:1.5,color:'#6B5200'},shopHeroTitle:{...TYPE.sectionTitle,color:COLORS.black,marginTop:4},shopHeroBody:{...TYPE.small,color:'#594700',marginTop:5},shopHeroButton:{height:29,alignSelf:'flex-start',borderRadius:9,backgroundColor:COLORS.black,paddingHorizontal:11,alignItems:'center',justifyContent:'center',marginTop:'auto'},shopHeroButtonText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'900',color:COLORS.white},shopHeroImage:{position:'absolute',right:-8,bottom:-13,width:142,height:142},storeHorizontalList:{gap:12,paddingRight:8},storeCardWide:{width:162,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,padding:12,...SHADOW},storeNameWide:{...TYPE.cardTitle,marginTop:10},storeRatingWide:{...TYPE.small,color:COLORS.black,marginTop:4},storeMetaWide:{...TYPE.small,color:COLORS.muted,marginTop:3},shopNeedGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},shopNeedCard:{width:'48.5%',minHeight:104,borderRadius:17,padding:14,justifyContent:'space-between'},shopNeedText:{...TYPE.cardTitle,color:COLORS.black},

  liveMapShell:{position:'relative',overflow:'hidden',backgroundColor:COLORS.surfaceStrong,borderRadius:20,borderWidth:1,borderColor:COLORS.line,...SHADOW},
  liveMapSquare:{width:'100%',aspectRatio:1,marginBottom:14},
  liveMapWide:{width:'100%',height:430,borderRadius:0,borderLeftWidth:0,borderRightWidth:0},
  liveMapPicker:{height:'100%',borderRadius:0,borderWidth:0},
  liveMap:{...StyleSheet.absoluteFill},
  mapControls:{position:'absolute',right:14,bottom:14,width:48,borderRadius:18,backgroundColor:'rgba(255,255,255,0.98)',borderWidth:1,borderColor:COLORS.line,overflow:'hidden',...SHADOW},
  mapControlsPicker:{bottom:318},
  mapLocateButton:{position:'absolute',right:14,bottom:260,width:48,height:48,borderRadius:17,backgroundColor:'rgba(255,255,255,0.98)',borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',...SHADOW},
  mapControlButton:{height:48,alignItems:'center',justifyContent:'center'},
  mapControlDivider:{height:1,backgroundColor:COLORS.line},
  mapLocationChip:{position:'absolute',left:12,top:12,height:34,borderRadius:17,paddingHorizontal:11,backgroundColor:'rgba(255,255,255,0.97)',flexDirection:'row',alignItems:'center',gap:5,borderWidth:1,borderColor:COLORS.line},
  mapLocationChipText:{...TYPE.label,color:COLORS.black},
  mapExpandButton:{position:'absolute',right:12,top:12,width:36,height:36,borderRadius:18,backgroundColor:'rgba(255,255,255,0.97)',alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:COLORS.line},
  mapPickerHint:{position:'absolute',top:'35%',left:58,right:58,alignItems:'center'},
  mapPickerHintText:{fontFamily:FONT.medium,fontSize:14,lineHeight:18,fontWeight:'700',color:COLORS.black,backgroundColor:'rgba(255,255,255,0.97)',paddingHorizontal:14,paddingVertical:9,borderRadius:14,overflow:'hidden',...SHADOW},
  driverMapMarker:{width:52,height:52,borderRadius:26,backgroundColor:COLORS.white,borderWidth:2,borderColor:COLORS.red,alignItems:'center',justifyContent:'center',...SHADOW},
  driverMapMarkerImage:{width:40,height:40},
  locationPickerScreen:{flex:1,backgroundColor:COLORS.white},
  locationPickerTop:{paddingHorizontal:18,paddingTop:8,paddingBottom:12,gap:12},
  locationPickerBack:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},
  locationPickerSearch:{height:58,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:16,...SHADOW},
  locationPickerSearchText:{...TYPE.body,color:COLORS.muted,flex:1},
  locationPickerMapWrap:{flex:1,paddingHorizontal:0},
  locationPickerSheet:{paddingHorizontal:20,paddingTop:12,paddingBottom:14,gap:12,backgroundColor:COLORS.white,borderTopLeftRadius:24,borderTopRightRadius:24},
  locationPickerHandle:{alignSelf:'center',width:42,height:4,borderRadius:2,backgroundColor:COLORS.lineDark,marginBottom:2},
  locationPickerTitle:{...TYPE.sectionTitle},
  locationPickerBody:{...TYPE.small,color:COLORS.muted},
  locationPickerAddress:{minHeight:72,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14,shadowOpacity:0},
  locationPickerAddressTitle:{...TYPE.cardTitle},
  locationPickerAddressMeta:{...TYPE.small,color:COLORS.muted,marginTop:2},
  cartBadge:{position:'absolute',right:-5,top:-5,minWidth:20,height:20,borderRadius:10,backgroundColor:COLORS.orange,alignItems:'center',justifyContent:'center',paddingHorizontal:5},
  cartBadgeText:{...TYPE.label,color:COLORS.white},
  marketCategoryRow:{gap:13,paddingRight:8},
  marketCategoryItem:{width:78,alignItems:'center',gap:7},
  marketCategoryCircle:{width:68,height:68,borderRadius:34,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  marketCategoryCircleActive:{borderWidth:2,borderColor:COLORS.black},
  marketCategoryLabel:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
  marketCategoryLabelActive:{...TYPE.bodyStrong,fontSize:13,lineHeight:18,color:COLORS.black},
  marketPromoRow:{gap:12,paddingRight:8},
  marketPromoCard:{width:310,height:158,borderRadius:22,overflow:'hidden',position:'relative',padding:18},
  marketPromoCopy:{width:'64%',height:'100%',justifyContent:'space-between',zIndex:2},
  marketPromoEyebrow:{...TYPE.label,letterSpacing:1.2},
  marketPromoTitle:{...TYPE.sectionTitle,color:COLORS.black},
  marketPromoBody:{...TYPE.small,color:COLORS.muted},
  marketPromoCta:{height:30,alignSelf:'flex-start',paddingHorizontal:12,borderRadius:10,justifyContent:'center'},
  marketPromoCtaText:{...TYPE.label,color:COLORS.white},
  marketPromoIcon:{position:'absolute',right:-6,bottom:-4,width:132,height:132,borderRadius:66,alignItems:'center',justifyContent:'center'},
  brandGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:14},
  brandGridItem:{width:'23%',alignItems:'center'},
  brandGridName:{...TYPE.label,fontSize:12.5,lineHeight:17,color:COLORS.black,marginTop:7,textAlign:'center'},
  brandGridEta:{...TYPE.small,fontSize:11.5,lineHeight:16,color:COLORS.muted,marginTop:3,textAlign:'center'},
  filterChipRow:{gap:8,paddingRight:8,marginTop:-7},
  filterChip:{height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.lineDark,paddingHorizontal:14,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},
  filterChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  filterChipText:{...TYPE.small,color:COLORS.black},
  filterChipTextActive:{color:COLORS.white,fontFamily:FONT.medium,fontWeight:'700'},
  storeBrowseCard:{shadowOpacity:0},
  storeBrowseRow:{minHeight:78,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:12},
  storeBrowseName:{...TYPE.cardTitle},
  storeBrowseMeta:{...TYPE.small,color:COLORS.muted,marginTop:2},
  storeBrowseRating:{flexDirection:'row',alignItems:'center',gap:3},
  storeBrowseRatingText:{...TYPE.small,color:COLORS.black},
  dealRow:{gap:12,paddingRight:8},
  dealCard:{width:166,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,padding:10,position:'relative',...SHADOW},
  dealImageWrap:{height:124,borderRadius:14,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',position:'relative'},
  dealImage:{width:94,height:94},
  dealBadge:{position:'absolute',left:7,top:7,backgroundColor:COLORS.orange,borderRadius:8,paddingHorizontal:7,paddingVertical:4},
  dealBadgeText:{...TYPE.label,fontSize:10,lineHeight:13,color:COLORS.white},
  dealPrice:{...TYPE.cardTitle,color:COLORS.orange,marginTop:9},
  dealOldPrice:{...TYPE.small,color:COLORS.muted,textDecorationLine:'line-through',marginTop:1},
  dealLabel:{...TYPE.small,color:COLORS.black,marginTop:5,minHeight:36},
  dealAdd:{position:'absolute',right:9,bottom:9,width:34,height:34,borderRadius:17,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},
  promoDots:{height:14,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginTop:-10},
  promoDot:{width:7,height:7,borderRadius:4,backgroundColor:COLORS.lineDark},
  promoDotActive:{width:20,backgroundColor:COLORS.black},
  flashSaleSection:{marginHorizontal:-20,paddingHorizontal:20,paddingTop:18,paddingBottom:20,backgroundColor:'#FFFBE0'},
  flashSaleIntro:{...TYPE.small,color:COLORS.muted,marginTop:-8,marginBottom:14},

  // Kareebu+ v2.5 brand system and discovery surfaces.
  // Kareebu+ v2.6.1 approved brand lockup.
  v402Splash:{flex:1,backgroundColor:'#030303',overflow:'hidden',alignItems:'center',justifyContent:'center'},
  v402SplashContours:{position:'absolute',left:-120,right:-120,bottom:0,width:'135%',height:'44%',opacity:.055,tintColor:'#6A6A6A'},
  v402SplashCenter:{alignItems:'center',justifyContent:'center',marginTop:-86,zIndex:4},
  v402SplashMark:{width:126,height:126},
  v402SplashBrand:{fontFamily:FONT.bold,fontSize:54,lineHeight:62,fontWeight:'900',color:'#FFFFFF',letterSpacing:-1.2,marginTop:8},
  v402SplashTagline:{alignItems:'center',marginTop:34},
  v402SplashTaglineWhite:{fontFamily:FONT.regular,fontSize:22,lineHeight:29,color:'#FFFFFF'},
  v402SplashTaglineYellow:{fontFamily:FONT.medium,fontSize:22,lineHeight:29,fontWeight:'800',color:COLORS.yellow,marginTop:3},
  v402SplashArcRed:{position:'absolute',width:930,height:930,borderRadius:465,borderWidth:34,borderColor:'#F20D16',left:-285,bottom:-715,transform:[{rotate:'-8deg'}],zIndex:2},
  v402SplashArcYellow:{position:'absolute',width:900,height:900,borderRadius:450,borderWidth:34,borderColor:'#FFC313',left:-260,bottom:-670,transform:[{rotate:'-8deg'}],zIndex:3},
  v261SplashLogo:{width:330,height:92},
  v261WelcomeLogo:{width:178,height:48},
  v261CountryLogo:{width:178,height:49},
  v261LocationLogo:{width:142,height:38},
  v261HomeMark:{width:30,height:30},

  v25Splash:{flex:1,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  v25SplashGlowTop:{position:'absolute',left:-140,top:-180,width:430,height:430,borderRadius:215,backgroundColor:'rgba(255,201,40,0.12)'},
  v25SplashGlowBottom:{position:'absolute',right:-170,bottom:-210,width:520,height:520,borderRadius:260,backgroundColor:'rgba(242,56,50,0.15)'},
  v25SplashBrandLockup:{width:'100%',alignItems:'center',justifyContent:'center',zIndex:2,paddingHorizontal:28},
  v25SplashMark:{width:64,height:64},
  v25SplashBrandText:{fontFamily:FONT.bold,fontSize:50,lineHeight:56,fontWeight:'900',letterSpacing:-1.6,color:COLORS.white},
  v25SplashBrandPlus:{color:COLORS.yellow},
  v25SplashTagline:{alignItems:'center',marginTop:22,zIndex:2},
  v25SplashTaglineWhite:{...TYPE.cardTitle,color:COLORS.white},
  v25SplashTaglineYellow:{...TYPE.sectionTitle,color:COLORS.yellow,marginTop:3},
  v25SplashLoader:{position:'absolute',bottom:76,flexDirection:'row',alignItems:'center',gap:8},
  v25SplashLoaderDot:{width:8,height:8,borderRadius:4,backgroundColor:'rgba(255,255,255,.45)'},
  v25SplashLoaderDotActive:{width:25,height:8,borderRadius:4,backgroundColor:COLORS.red},

  v25WelcomeScreen:{flex:1,paddingHorizontal:24,paddingTop:8,paddingBottom:10,backgroundColor:COLORS.white},
  v25WelcomeBrandRow:{height:54,width:210,alignSelf:'center',alignItems:'center',justifyContent:'center',borderRadius:15,backgroundColor:COLORS.black,paddingHorizontal:12},
  v25WelcomeBrandMark:{width:30,height:30},
  v25WelcomeBrandText:{fontFamily:FONT.bold,fontSize:23,fontWeight:'900',letterSpacing:-.5,color:COLORS.black},
  v25WelcomeTop:{alignItems:'center',paddingTop:10},
  v25WelcomeTitle:{fontFamily:FONT.bold,fontSize:28,lineHeight:34,fontWeight:'900',letterSpacing:-.8,textAlign:'center',color:COLORS.black},
  v25WelcomeTitleAccent:{color:COLORS.red},
  v25WelcomeSubtitle:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.muted,textAlign:'center',marginTop:10,maxWidth:320},
  v25WelcomeFeatureRow:{height:108,flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around',paddingTop:14},
  v25WelcomeFeatureItem:{alignItems:'center',width:'30%',gap:5},
  v25WelcomeFeatureCircle:{width:68,height:68,borderRadius:34,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',...SHADOW},
  v25WelcomeFeatureIcon:{width:52,height:52},
  v25WelcomeFeatureLabel:{...TYPE.label,color:COLORS.black},
  v25WelcomeHeroFrame:{flex:1,minHeight:210,alignItems:'center',justifyContent:'center',overflow:'hidden',marginTop:-2},
  v25WelcomeHero:{width:'100%',height:'100%'},
  v25WelcomeActions:{paddingTop:8,alignItems:'stretch',gap:2},


  // Kareebu+ v3.2 — approved welcome-screen reference match.
  v32WelcomeScreen:{flex:1,paddingHorizontal:24,paddingTop:6,paddingBottom:8,backgroundColor:COLORS.white},
  v32WelcomeBrandBlock:{height:68,alignItems:'center',justifyContent:'center',marginTop:2},
  v32WelcomeLogo:{width:216,height:58},
  v32WelcomeCopy:{alignItems:'center',marginTop:3},
  v32WelcomeTitle:{fontFamily:FONT.bold,fontSize:26,lineHeight:31,fontWeight:'900',letterSpacing:-.5,textAlign:'center',color:COLORS.black},
  v32WelcomeTitleAccent:{fontFamily:FONT.bold,fontSize:27,lineHeight:32,fontWeight:'900',letterSpacing:-.6,textAlign:'center',color:COLORS.red,marginTop:-1},
  v32WelcomeSubtitle:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.muted,textAlign:'center',marginTop:10,maxWidth:320},
  v32WelcomeFeatureRow:{height:94,flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',paddingHorizontal:30,paddingTop:10},
  v32WelcomeFeatureItem:{alignItems:'center',width:76,gap:5},
  v32WelcomeFeatureCircle:{width:58,height:58,borderRadius:29,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',...SHADOW},
  v32WelcomeFeatureIcon:{width:42,height:42},
  v32WelcomeFeatureLabel:{fontFamily:FONT.bold,fontSize:14,lineHeight:18,fontWeight:'800',color:COLORS.black,textAlign:'center'},
  v32WelcomeHeroFrame:{flex:1,minHeight:220,maxHeight:315,alignItems:'center',justifyContent:'center',overflow:'hidden',marginHorizontal:-4,marginTop:-2},
  v32WelcomeHero:{width:'100%',height:'100%'},
  v32WelcomeActions:{paddingTop:8,paddingBottom:0,alignItems:'stretch',gap:4},
  v32WelcomePrimaryButton:{height:54,borderRadius:18,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative',...SHADOW},
  v32WelcomePrimaryButtonPressed:{backgroundColor:COLORS.redDark,transform:[{scale:.995}]},
  v32WelcomeButtonGlow:{position:'absolute',left:-20,top:-36,width:210,height:130,borderRadius:70,backgroundColor:'rgba(255,255,255,.08)',transform:[{rotate:'-14deg'}]},
  v32WelcomePrimaryText:{fontFamily:FONT.bold,fontSize:18,lineHeight:22,fontWeight:'900',color:COLORS.white},


  // v3.6 — reference-led country/city/location onboarding
  v36CountryScreen:{flex:1,backgroundColor:COLORS.white,paddingHorizontal:0,paddingBottom:14},
  v36CountryTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:26,fontWeight:'900',letterSpacing:-.35,color:COLORS.black,textAlign:'center',paddingTop:4,paddingBottom:6},
  v36CountryStage:{flex:1,minHeight:430,position:'relative',overflow:'hidden'},
  v36CountryMapWrap:{...StyleSheet.absoluteFill,overflow:'hidden'},
  v36CountryMap:{...StyleSheet.absoluteFill},
  v36CountryMapFadeTop:{position:'absolute',left:0,right:0,top:0,height:54,backgroundColor:'rgba(252,251,248,.16)'},
  v36CountryMapFadeBottom:{position:'absolute',left:0,right:0,bottom:0,height:150,backgroundColor:'rgba(252,251,248,.74)'},
  v36CountryNameOverlay:{position:'absolute',left:0,right:0,top:'43%',alignItems:'center'},
  v36CountryNameOverlayText:{fontFamily:FONT.bold,fontSize:33,lineHeight:39,fontWeight:'900',letterSpacing:-.8,color:COLORS.black,textShadowColor:'rgba(255,255,255,.88)',textShadowRadius:7,textShadowOffset:{width:0,height:1}},
  v36CountryCarouselViewport:{position:'absolute',left:0,right:0,bottom:2,height:252,overflow:'hidden',justifyContent:'center'},
  v36CountryCarousel:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14},
  v36CountryCard:{borderRadius:29,borderWidth:6,borderColor:COLORS.white,backgroundColor:COLORS.white,overflow:'hidden',...SHADOW},
  v36CountryCardSelected:{width:232,height:242,transform:[{scale:1.01}]},
  v36CountryCardSide:{width:148,height:190,opacity:.98},
  v36CountryPreviewVisual:{flex:1,backgroundColor:'#DCEBFA',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'},
  v36CountryPreviewVisualSelected:{backgroundColor:'#BBDCF6'},
  v36CountryPreviewSky:{position:'absolute',left:0,right:0,top:0,height:'52%',backgroundColor:'rgba(255,255,255,.38)'},
  v36CountryPreviewCaption:{position:'absolute',left:9,right:9,bottom:9,minHeight:30,borderRadius:13,backgroundColor:'rgba(255,255,255,.90)',paddingHorizontal:8,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5},
  v36CountryPreviewFlag:{fontSize:18},
  v36CountryPreviewCapital:{fontFamily:FONT.bold,fontSize:11,lineHeight:14,fontWeight:'800',color:COLORS.black,flexShrink:1},
  v36CountrySelector:{height:56,alignSelf:'center',minWidth:170,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingHorizontal:17,marginTop:8,marginBottom:14,...SHADOW},
  v36CountrySelectorFlag:{fontSize:23},
  v36CountrySelectorText:{fontFamily:FONT.bold,fontSize:17,lineHeight:21,fontWeight:'800',color:COLORS.black},
  v36BlackContinue:{height:60,borderRadius:18,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',marginHorizontal:24},
  v36BlackContinuePressed:{opacity:.82,transform:[{scale:.996}]},
  v36BlackContinueText:{fontFamily:FONT.bold,fontSize:18,lineHeight:22,fontWeight:'900',color:COLORS.white},

  v36CityScreen:{flex:1,backgroundColor:COLORS.white,paddingHorizontal:22,paddingBottom:14},
  v36CityHeader:{height:72,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingTop:8},
  v36CityBack:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  v36CityHeaderSpacer:{width:42,height:42},
  v36CityTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:26,fontWeight:'900',letterSpacing:-.35,color:COLORS.black,textAlign:'center'},
  v36CitySubtitle:{fontFamily:FONT.regular,fontSize:13.5,lineHeight:19,color:COLORS.muted,textAlign:'center',paddingHorizontal:24,marginBottom:16},
  v36CitySearch:{height:56,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,marginBottom:12,...SHADOW},
  v36CitySearchInput:{flex:1,fontFamily:FONT.regular,fontSize:15,lineHeight:20,color:COLORS.black,paddingVertical:0},
  v36CityList:{gap:8,paddingBottom:10},
  v36CityOption:{minHeight:66,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:13},
  v36CityOptionSelected:{borderWidth:1.6,borderColor:COLORS.red,backgroundColor:'#FFF8F6'},
  v36CityOptionName:{flex:1,fontFamily:FONT.bold,fontSize:15.5,lineHeight:20,fontWeight:'800',color:COLORS.black},
  v36CityRadio:{width:26,height:26,borderRadius:13,borderWidth:1.7,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},
  v36CityRadioSelected:{borderColor:COLORS.red,borderWidth:2},
  v36CityRadioDot:{width:12,height:12,borderRadius:6,backgroundColor:COLORS.red},
  v36UseLocationRow:{minHeight:68,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14,marginTop:8,marginBottom:10},
  v36UseLocationIcon:{width:40,height:40,borderRadius:20,backgroundColor:'#FFF2EF',alignItems:'center',justifyContent:'center'},
  v36UseLocationTitle:{fontFamily:FONT.bold,fontSize:14.5,lineHeight:18,fontWeight:'800',color:COLORS.black},
  v36UseLocationBody:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.muted,marginTop:2},

  v36LocationScreen:{flex:1,backgroundColor:COLORS.white,position:'relative'},
  v36LocationMapLayer:{...StyleSheet.absoluteFill},
  v36LocationSearchWrap:{position:'absolute',left:20,right:20,top:76,zIndex:30},
  v36LocationSearch:{height:64,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:17,...SHADOW},
  v36LocationSearchInput:{flex:1,fontFamily:FONT.medium,fontSize:16,lineHeight:21,fontWeight:'600',color:COLORS.black,paddingVertical:0},
  v36PlacesOverlay:{marginTop:8,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,borderRadius:18,overflow:'hidden',...SHADOW},
  v36LocationSheet:{position:'absolute',left:18,right:18,bottom:18,borderRadius:28,backgroundColor:COLORS.white,padding:16,zIndex:25,...SHADOW},
  v36LocationInstructionCard:{minHeight:86,borderRadius:20,backgroundColor:'#F3F4F7',flexDirection:'row',alignItems:'center',gap:15,paddingHorizontal:18,paddingVertical:14},
  v36LocationInstructionIcon:{width:42,height:42,alignItems:'center',justifyContent:'center'},
  v36LocationInstructionTitle:{fontFamily:FONT.bold,fontSize:18,lineHeight:22,fontWeight:'900',color:COLORS.black},
  v36LocationInstructionBody:{fontFamily:FONT.regular,fontSize:13.5,lineHeight:19,color:COLORS.muted,marginTop:4},
  v36LocationPrimary:{height:60,borderRadius:18,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',marginTop:14},
  v36LocationPrimaryText:{fontFamily:FONT.bold,fontSize:18,lineHeight:22,fontWeight:'900',color:COLORS.white},
  v36LocationSkip:{height:45,alignItems:'center',justifyContent:'center',marginTop:5},
  v36LocationSkipText:{fontFamily:FONT.bold,fontSize:14.5,lineHeight:19,fontWeight:'800',color:COLORS.black,textDecorationLine:'underline'},
  v36LocationAttribution:{fontFamily:FONT.regular,fontSize:10,lineHeight:12,color:COLORS.mutedLight,textAlign:'center',marginTop:-2},
  v36MapCenterPin:{position:'absolute',left:'50%',top:'50%',width:54,height:54,marginLeft:-27,marginTop:-47,borderRadius:27,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',transform:[{rotate:'45deg'}],...SHADOW},
  v36MapCenterPinInner:{width:17,height:17,borderRadius:9,backgroundColor:COLORS.white,transform:[{rotate:'-45deg'}]},
  v36MapPickerHint:{top:'39%',backgroundColor:'#FFE9CF',borderRadius:13,paddingHorizontal:14,paddingVertical:10},
  v36MapPickerHintText:{fontFamily:FONT.medium,fontSize:15,lineHeight:19,fontWeight:'600',color:'#C85B2C'},

  countryScreen:{flex:1,paddingHorizontal:22,paddingBottom:16,backgroundColor:COLORS.white},
  countryBrandRow:{height:58,width:'100%',alignSelf:'center',flexDirection:'row',alignItems:'center',justifyContent:'center',position:'relative',marginTop:2},
  countryStepPill:{position:'absolute',right:0,top:13,height:30,borderRadius:15,backgroundColor:COLORS.surface,paddingHorizontal:11,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:COLORS.line},
  countryStepPillText:{...TYPE.caption,fontWeight:'800',color:COLORS.muted},
  countryBrandMark:{width:26,height:26},
  countryBrandText:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',letterSpacing:-.35,color:COLORS.black},
  countryScreenTitle:{fontFamily:FONT.bold,fontSize:22,lineHeight:27,fontWeight:'900',letterSpacing:-.4,textAlign:'center',marginTop:5,color:COLORS.black},
  countryScreenSubtitle:{fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.muted,textAlign:'center',marginTop:6,paddingHorizontal:40},
  countryMapWrap:{height:250,marginHorizontal:-22,marginTop:4,overflow:'hidden'},
  countryMap:{...StyleSheet.absoluteFill},
  countryMapFadeTop:{position:'absolute',left:0,right:0,top:0,height:56,backgroundColor:'rgba(252,251,248,.78)'},
  countryMapFadeBottom:{position:'absolute',left:0,right:0,bottom:0,height:74,backgroundColor:'rgba(252,251,248,.78)'},
  countryCarouselViewport:{height:150,marginHorizontal:-22,marginTop:-24,overflow:'hidden',justifyContent:'center'},
  countryCarousel:{flexDirection:'row',gap:10,justifyContent:'center',alignItems:'center'},
  countryChoice:{borderRadius:20,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:9,alignItems:'center',justifyContent:'center',position:'relative',...SHADOW},
  countryChoiceSide:{width:102,height:118,opacity:.82},
  countryChoiceSelected:{width:168,height:142,borderWidth:2,borderColor:COLORS.black,backgroundColor:COLORS.white,transform:[{scale:1.01}]},
  countryChoiceVisual:{width:48,height:48,borderRadius:16,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',marginBottom:3},
  countryChoiceVisualSelected:{width:62,height:62,borderRadius:20,backgroundColor:COLORS.yellow},
  countryChoiceFlag:{fontSize:22},
  countryChoiceName:{fontFamily:FONT.bold,fontSize:14,lineHeight:18,fontWeight:'800',color:COLORS.black,marginTop:2,textAlign:'center'},
  countryChoiceNameSelected:{fontSize:16,lineHeight:20,color:COLORS.black},
  countryChoiceCapital:{fontFamily:FONT.regular,fontSize:11,lineHeight:15,color:COLORS.muted,marginTop:1,textAlign:'center'},
  countrySelectedBadge:{position:'absolute',right:8,top:8,width:22,height:22,borderRadius:11,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:COLORS.yellow},
  countrySelectedPill:{height:48,alignSelf:'center',minWidth:170,borderRadius:24,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingHorizontal:17,marginTop:4,marginBottom:14,...SHADOW},
  countrySelectedPillFlag:{fontSize:22},
  countrySelectedPillText:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'800',color:COLORS.black},

  cityScreenBody:{flex:1,paddingHorizontal:24,paddingBottom:18},
  cityScreenSubtitle:{...TYPE.body,color:COLORS.muted,textAlign:'center',paddingHorizontal:34,marginTop:-3,marginBottom:20},
  citySearch:{height:58,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,marginBottom:14},
  citySearchText:{...TYPE.body,color:COLORS.mutedLight},
  cityList:{gap:10,paddingBottom:14},
  cityOption:{minHeight:76,borderWidth:1,borderColor:COLORS.line,borderRadius:19,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:14},
  cityOptionSelected:{borderWidth:1.7,borderColor:COLORS.red,backgroundColor:'#FFF5F3'},
  cityOptionIcon:{width:46,height:46,borderRadius:14,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  cityOptionIconSelected:{backgroundColor:COLORS.yellow},
  cityOptionName:{flex:1,...TYPE.cardTitle,color:COLORS.black},
  cityOptionRadio:{width:28,height:28,borderRadius:14,borderWidth:2,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},
  cityOptionRadioSelected:{borderColor:COLORS.red},
  cityOptionRadioDot:{width:14,height:14,borderRadius:7,backgroundColor:COLORS.red},
  useCurrentLocationRow:{minHeight:68,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16},
  useCurrentLocationText:{flex:1,...TYPE.bodyStrong,color:COLORS.black},

  onboardingCityScreen:{flex:1,backgroundColor:COLORS.white,paddingHorizontal:22,paddingBottom:12},
  onboardingCityHeader:{minHeight:126,flexDirection:'row',alignItems:'flex-start',paddingTop:12},
  onboardingCityBack:{width:46,height:46,borderRadius:23,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',marginTop:2},
  onboardingCityHeadingWrap:{flex:1,alignItems:'center',paddingHorizontal:8},
  onboardingCityHeaderSpacer:{width:46,height:46},
  onboardingCityTitle:{fontFamily:FONT.bold,fontSize:22,lineHeight:27,fontWeight:'900',letterSpacing:-.45,color:COLORS.black,textAlign:'center',marginTop:2},
  onboardingCitySubtitle:{fontFamily:FONT.regular,fontSize:13.5,lineHeight:19,color:COLORS.muted,textAlign:'center',marginTop:8},
  onboardingCitySearch:{height:54,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:17,marginBottom:14,...SHADOW},
  onboardingCitySearchText:{fontFamily:FONT.regular,fontSize:15,lineHeight:20,color:COLORS.mutedLight},
  onboardingCitySearchInput:{flex:1,fontFamily:FONT.regular,fontSize:15,lineHeight:20,color:COLORS.black,paddingVertical:0},
  onboardingCityEmpty:{minHeight:108,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',paddingHorizontal:24,gap:5},
  onboardingCityEmptyTitle:{...TYPE.cardTitle,color:COLORS.black},
  onboardingCityEmptyBody:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
  onboardingCityList:{gap:9,paddingBottom:12},
  onboardingCityOption:{minHeight:70,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:14},
  onboardingCityOptionSelected:{borderWidth:1.6,borderColor:COLORS.red,backgroundColor:COLORS.white},
  onboardingCityThumb:{width:46,height:46,borderRadius:14,alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative',backgroundColor:COLORS.surface},
  onboardingCityThumbSelected:{borderWidth:1,borderColor:COLORS.yellow},
  onboardingCityThumbImage:{width:'100%',height:'100%'},
  onboardingCityThumbFallback:{backgroundColor:COLORS.yellowSoft},
  onboardingCityOptionName:{flex:1,fontFamily:FONT.bold,fontSize:16,lineHeight:21,fontWeight:'800',color:COLORS.black},
  onboardingCityRadio:{width:28,height:28,borderRadius:14,borderWidth:1.7,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},
  onboardingCityRadioSelected:{borderColor:COLORS.red,borderWidth:2},
  onboardingCityRadioDot:{width:14,height:14,borderRadius:7,backgroundColor:COLORS.red},
  onboardingUseLocationRow:{minHeight:68,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:13,paddingHorizontal:16},
  onboardingUseLocationText:{flex:1,fontFamily:FONT.bold,fontSize:15.5,lineHeight:20,fontWeight:'800',color:COLORS.black},
  onboardingCityFooter:{paddingTop:8},

  onboardingLocationScreen:{flex:1,backgroundColor:COLORS.white,position:'relative'},
  onboardingLocationHeader:{paddingHorizontal:20,paddingTop:4,paddingBottom:10,gap:8,backgroundColor:COLORS.white,zIndex:4},
  onboardingLocationBrandRow:{height:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  onboardingLocationBrandLockup:{height:38,width:154,borderRadius:11,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',paddingHorizontal:8},
  onboardingLocationBrandMark:{width:28,height:28},
  onboardingLocationBrandText:{fontFamily:FONT.bold,fontSize:21,lineHeight:25,fontWeight:'900',letterSpacing:-.55,color:COLORS.black},
  onboardingLocationHeaderActions:{flexDirection:'row',alignItems:'center',gap:10},
  onboardingLocationHeaderIcon:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',position:'relative'},
  onboardingLocationCartBadge:{position:'absolute',right:-1,top:-1,minWidth:19,height:19,borderRadius:10,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',paddingHorizontal:4},
  onboardingLocationCartBadgeText:{fontFamily:FONT.bold,fontSize:10,lineHeight:12,fontWeight:'900',color:COLORS.white},
  onboardingLocationDeliveryRow:{minHeight:30,flexDirection:'row',alignItems:'center',gap:3},
  onboardingLocationDeliveryPrefix:{fontFamily:FONT.regular,fontSize:14,lineHeight:19,color:COLORS.black},
  onboardingLocationDeliveryText:{fontFamily:FONT.bold,fontSize:14,lineHeight:19,fontWeight:'800',color:COLORS.black,flexShrink:1},
  onboardingLocationSearch:{height:58,borderWidth:1,borderColor:COLORS.line,borderRadius:19,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16,...SHADOW},
  onboardingLocationSearchText:{fontFamily:FONT.regular,fontSize:16,lineHeight:21,color:COLORS.mutedLight,flex:1},
  onboardingLocationSearchInput:{flex:1,fontFamily:FONT.regular,fontSize:16,lineHeight:21,color:COLORS.black,paddingVertical:0},
  placesLoadingText:{fontFamily:FONT.bold,fontSize:12,letterSpacing:2,color:COLORS.muted},
  placesOverlay:{position:'absolute',left:20,right:20,top:130,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,borderRadius:18,overflow:'hidden',zIndex:20,...SHADOW},
  placesSuggestionRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,borderBottomWidth:1,borderBottomColor:COLORS.line},
  placesSuggestionIcon:{width:36,height:36,borderRadius:12,backgroundColor:COLORS.yellowSoft,alignItems:'center',justifyContent:'center'},
  placesSuggestionTitle:{...TYPE.bodyStrong,color:COLORS.black},
  placesSuggestionSubtitle:{...TYPE.small,color:COLORS.muted,marginTop:2},
  googlePlacesAttribution:{...TYPE.caption,color:COLORS.muted,textAlign:'right',paddingHorizontal:12,paddingTop:8,paddingBottom:2},
  onboardingLocationMapWrap:{flex:1,marginTop:0},
  onboardingLocationSheet:{position:'absolute',left:0,right:0,bottom:0,minHeight:294,paddingHorizontal:24,paddingTop:12,paddingBottom:16,backgroundColor:COLORS.white,borderTopLeftRadius:30,borderTopRightRadius:30,...SHADOW},
  onboardingLocationHandle:{alignSelf:'center',width:46,height:5,borderRadius:3,backgroundColor:COLORS.lineDark,marginBottom:18},
  onboardingLocationSheetIntro:{flexDirection:'row',alignItems:'flex-start',gap:15,marginBottom:18},
  onboardingLocationPinBubble:{width:64,height:64,borderRadius:32,backgroundColor:'#FFF4EC',alignItems:'center',justifyContent:'center',position:'relative'},
  onboardingLocationPinRing:{position:'absolute',bottom:9,width:28,height:8,borderRadius:14,borderWidth:1.5,borderColor:COLORS.red,transform:[{scaleY:.45}]},
  onboardingLocationTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:26,fontWeight:'900',letterSpacing:-.35,color:COLORS.black,marginTop:2},
  onboardingLocationBody:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.muted,marginTop:7},
  onboardingLocationConfirmButton:{height:58,borderRadius:17,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},
  onboardingLocationConfirmText:{fontFamily:FONT.bold,fontSize:17,lineHeight:21,fontWeight:'800',color:COLORS.white},
  onboardingLocationSkipButton:{alignSelf:'center',minHeight:42,alignItems:'center',justifyContent:'center',marginTop:8},
  onboardingLocationSkipText:{fontFamily:FONT.medium,fontSize:14,lineHeight:19,fontWeight:'700',color:COLORS.black,textDecorationLine:'underline',textDecorationStyle:'dotted'},
  onboardingLocationDebug:{position:'absolute',width:1,height:1,opacity:0},

  v25HomeHeader:{paddingHorizontal:20,paddingTop:6,paddingBottom:8,gap:7,backgroundColor:COLORS.white},
  v25HomeBrandRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v25HomeBrandLockup:{height:38,width:38,borderRadius:12,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},
  v25HomeBrandMark:{width:28,height:28},
  v25HomeBrandText:{fontFamily:FONT.bold,fontSize:21,fontWeight:'900',letterSpacing:-.6,color:COLORS.black},
  v25HomeLocation:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:3,minHeight:28,paddingHorizontal:2},
  v25HomeLocationLabel:{...TYPE.small,color:COLORS.muted},
  v25HomeLocationText:{...TYPE.bodyStrong,color:COLORS.black,flexShrink:1},
  v25HomeScroll:{paddingHorizontal:20,paddingBottom:28,gap:18},
  v25SearchBar:{height:54,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:15,...SHADOW},
  v25SearchPlaceholder:{...TYPE.body,color:COLORS.mutedLight,flex:1},
  v25ServiceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:9},
  v25ServiceCard:{width:'23.3%',minHeight:92,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',paddingVertical:8,gap:4,...SHADOW},
  v25ServiceVisual:{height:50,alignItems:'center',justifyContent:'center'},
  v25ServiceImage:{width:50,height:50},
  v25ServiceLabel:{...TYPE.label,color:COLORS.black,textAlign:'center'},
  v25CampaignRow:{gap:10,paddingRight:0},
  v25CampaignCard:{width:325,height:154,borderRadius:20,overflow:'hidden',position:'relative',padding:16},
  v25CampaignCopy:{width:'62%',height:'100%',zIndex:2},
  v25CampaignEyebrow:{...TYPE.label,letterSpacing:1.1},
  v25CampaignTitle:{...TYPE.sectionTitle,marginTop:3},
  v25CampaignBody:{...TYPE.small,marginTop:5},
  v25CampaignCta:{height:32,alignSelf:'flex-start',borderRadius:10,paddingHorizontal:11,flexDirection:'row',gap:6,alignItems:'center',justifyContent:'center',marginTop:'auto'},
  v25CampaignCtaText:{...TYPE.label},
  v25CampaignVisual:{position:'absolute',right:-8,bottom:-14,width:138,height:138,borderRadius:69,backgroundColor:'rgba(255,255,255,.16)',alignItems:'center',justifyContent:'center'},
  v25CampaignImage:{width:108,height:108},
  v25SurfaceSection:{marginHorizontal:-20,paddingHorizontal:20,paddingVertical:16,backgroundColor:COLORS.surface,borderTopWidth:1,borderBottomWidth:1,borderColor:COLORS.line},
  v25SectionHeadingRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:11},
  v25SectionTitle:{...TYPE.sectionTitle,color:COLORS.black,flexShrink:1},
  v25SectionSubtitle:{...TYPE.small,color:COLORS.muted,marginTop:3},
  v25MerchantRow:{gap:10,paddingRight:8},
  v25MerchantCard:{width:138,minHeight:126,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:10,...SHADOW},
  v25MerchantName:{...TYPE.label,color:COLORS.black,marginTop:8},
  v25MerchantMeta:{...TYPE.caption,color:COLORS.black,marginTop:3},
  v25MerchantEta:{...TYPE.caption,color:COLORS.muted,marginTop:1},
  v25MerchantDelivery:{...TYPE.caption,color:COLORS.red,marginTop:4,fontWeight:'700'},
  v25RedeemRow:{flexDirection:'row',gap:10},
  v25RedeemCard:{flex:1,minHeight:86,borderRadius:18,borderWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10,padding:11},
  v25RedeemYellow:{backgroundColor:'#FFF9E7'},
  v25RedeemRed:{backgroundColor:'#FFF1EF'},
  v25RedeemIcon:{width:42,height:42,borderRadius:13,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  v25RedeemTitle:{...TYPE.cardTitle,color:COLORS.black},
  v25RedeemBody:{...TYPE.caption,color:COLORS.muted,marginTop:2},

  v25CommerceScroll:{paddingHorizontal:20,paddingBottom:26,gap:16},
  v25CommerceHeader:{marginHorizontal:-20,paddingHorizontal:20,paddingTop:3,paddingBottom:4},
  v25CommerceTopRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:12},
  v25CommerceBack:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},
  v25CommerceTitle:{...TYPE.navTitle,color:COLORS.black},
  v25CommerceActions:{marginLeft:'auto',flexDirection:'row',gap:7},
  v25CommerceIconButton:{width:40,height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',position:'relative'},
  v25CartBadge:{position:'absolute',right:-3,top:-4,minWidth:20,height:20,borderRadius:10,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',paddingHorizontal:4},
  v25CartBadgeText:{...TYPE.label,color:COLORS.white},
  v25CommerceLocation:{flexDirection:'row',alignItems:'center',minHeight:22,marginTop:1},
  v25CommerceLocationPrefix:{...TYPE.caption,color:COLORS.muted},
  v25CommerceLocationText:{...TYPE.small,color:COLORS.black,fontFamily:FONT.medium,fontWeight:'700',maxWidth:150},
  v25OfferRow:{gap:10,paddingRight:8},
  v25OfferSquare:{width:168,height:138,borderRadius:18,padding:14,overflow:'hidden',justifyContent:'space-between',borderWidth:1,borderColor:COLORS.line},
  v25OfferEyebrow:{...TYPE.label,letterSpacing:1.1},
  v25OfferTitle:{fontFamily:FONT.bold,fontSize:22,lineHeight:25,fontWeight:'900',letterSpacing:-.45,color:COLORS.black},
  v25OfferUnderline:{height:8,width:64,borderRadius:4},
  v25OfferFoot:{...TYPE.small,color:COLORS.muted},
  v25WarmPanel:{marginHorizontal:-20,paddingHorizontal:20,paddingVertical:16,backgroundColor:COLORS.surface,borderTopWidth:1,borderBottomWidth:1,borderColor:COLORS.line},
  v25BrandRow:{gap:11,paddingRight:8},
  v25RestaurantBrand:{width:92,alignItems:'center'},
  v25RestaurantBrandLogo:{width:84,height:84,borderRadius:18,alignItems:'center',justifyContent:'center',paddingHorizontal:7},
  v25RestaurantBrandText:{fontFamily:FONT.bold,fontSize:13,lineHeight:16,fontWeight:'900',textAlign:'center'},
  v25OfferBadge:{marginTop:-8,backgroundColor:COLORS.yellow,borderRadius:7,paddingHorizontal:8,paddingVertical:3},
  v25OfferBadgeText:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  v25FoodCategoryRow:{gap:11,paddingRight:8},
  v25FoodCategory:{width:70,alignItems:'center',gap:5},
  v25FoodCategoryCircle:{width:64,height:64,borderRadius:32,borderWidth:1,borderColor:COLORS.line,overflow:'hidden',backgroundColor:COLORS.surface},
  v25FoodCategoryImage:{width:'100%',height:'100%'},
  v25FoodCategoryLabel:{...TYPE.small,color:COLORS.black,textAlign:'center'},
  v25FilterRow:{gap:8,paddingRight:8},
  v25RestaurantList:{gap:10},
  v25RestaurantRow:{minHeight:120,flexDirection:'row',gap:12,padding:10,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,...SHADOW},
  v25RestaurantThumbWrap:{width:126,height:100,borderRadius:15,overflow:'hidden',position:'relative',backgroundColor:COLORS.surface},
  v25RestaurantThumb:{width:'100%',height:'100%'},
  v25DiscountBadge:{position:'absolute',left:6,bottom:6,borderRadius:7,backgroundColor:COLORS.yellow,paddingHorizontal:8,paddingVertical:4},
  v25DiscountText:{...TYPE.label,color:COLORS.black},
  v25HeartFloat:{position:'absolute',right:7,top:7,width:30,height:30,borderRadius:15,backgroundColor:'rgba(11,11,13,.48)',alignItems:'center',justifyContent:'center'},
  v25RestaurantInfo:{flex:1,justifyContent:'center'},
  v25RestaurantTitleRow:{flexDirection:'row',alignItems:'center',gap:7},
  v25ProBadge:{height:19,borderRadius:5,backgroundColor:COLORS.black,paddingHorizontal:6,alignItems:'center',justifyContent:'center'},
  v25ProBadgeText:{...TYPE.caption,color:COLORS.yellow,fontWeight:'900'},
  v25RestaurantName:{flex:1,...TYPE.cardTitle,color:COLORS.black},
  v25RestaurantMeta:{...TYPE.small,color:COLORS.muted,marginTop:6},
  v25RestaurantPill:{alignSelf:'flex-start',marginTop:7,borderRadius:10,backgroundColor:COLORS.surface,paddingHorizontal:9,paddingVertical:4},
  v25RestaurantPillText:{...TYPE.caption,color:COLORS.black},
  v25BottomNav:{minHeight:72,paddingBottom:5,borderTopWidth:1,borderTopColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'space-around'},
  v25BottomNavItem:{flex:1,alignItems:'center',justifyContent:'center',gap:4},
  v25BottomNavLabel:{...TYPE.label,color:COLORS.muted,fontWeight:'400'},
  v25BottomNavLabelActive:{color:COLORS.red,fontWeight:'800'},

  v25ShopCategoryRow:{gap:9,paddingRight:8},
  v25ShopCategory:{width:72,alignItems:'center',gap:5},
  v25ShopCategoryCircle:{width:64,height:64,borderRadius:32,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  v25ShopCategoryCircleActive:{borderWidth:2,borderColor:COLORS.red,backgroundColor:'#FFF3F0'},
  v25ShopCategoryText:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
  v25ShopCategoryTextActive:{...TYPE.bodyStrong,fontSize:13,lineHeight:18,color:COLORS.red},
  v25WellnessBanner:{height:164,borderRadius:20,overflow:'hidden',backgroundColor:'#FFF5E7',borderWidth:1,borderColor:COLORS.line,position:'relative',padding:16},
  v25WellnessCopy:{width:'58%',zIndex:2},
  v25WellnessKicker:{...TYPE.label,color:COLORS.black,letterSpacing:1.2},
  v25WellnessTitle:{fontFamily:FONT.bold,fontSize:22,lineHeight:25,fontWeight:'900',letterSpacing:-.5,color:COLORS.red,marginTop:1},
  v25WellnessDiscount:{alignSelf:'flex-start',marginTop:8,borderRadius:8,backgroundColor:COLORS.black,paddingHorizontal:10,paddingVertical:5},
  v25WellnessDiscountText:{...TYPE.label,color:COLORS.yellow},
  v25WellnessBody:{...TYPE.small,color:COLORS.muted,marginTop:8},
  v25WellnessVisual:{position:'absolute',right:10,top:25,width:122,height:110,borderRadius:24,backgroundColor:'rgba(255,201,40,.3)',alignItems:'center',justifyContent:'center'},
  v25WellnessImage:{position:'absolute',right:-3,bottom:-8,width:72,height:72},
  v25FreeDeliveryBadge:{position:'absolute',right:12,bottom:12,borderWidth:1,borderColor:COLORS.red,borderRadius:9,backgroundColor:COLORS.white,paddingHorizontal:9,paddingVertical:5},
  v25FreeDeliveryText:{...TYPE.caption,color:COLORS.red,fontWeight:'900'},
  v25PharmacyGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},
  v25PharmacyBrand:{width:'23%',alignItems:'center'},
  v25PharmacyLogo:{width:'100%',aspectRatio:1,borderRadius:17,alignItems:'center',justifyContent:'center',padding:7},
  v25PharmacyLogoText:{...TYPE.caption,fontWeight:'900',textAlign:'center',marginTop:3},
  v25PharmacyEta:{...TYPE.caption,color:COLORS.muted,marginTop:5,textAlign:'center'},
  v25StoreListCard:{shadowOpacity:0},
  v25StoreListRow:{minHeight:96,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:12,paddingVertical:9},
  v25StoreListLogo:{width:58,height:58,borderRadius:15,alignItems:'center',justifyContent:'center'},
  v25StoreNameRow:{flexDirection:'row',alignItems:'center',gap:6},
  v25StoreName:{...TYPE.cardTitle,color:COLORS.black,flexShrink:1},
  v25StoreMeta:{...TYPE.caption,color:COLORS.muted,marginTop:3},
  v25DealTag:{alignSelf:'flex-start',marginTop:6,borderRadius:7,backgroundColor:COLORS.yellow,paddingHorizontal:7,paddingVertical:3},
  v25DealTagText:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  v25StoreRight:{alignItems:'flex-end',gap:12},
  v25StoreRating:{...TYPE.small,color:COLORS.black},
  v25StoreDelivery:{...TYPE.caption,color:COLORS.red,fontWeight:'700'},


  // Ride/Boda vehicle mode + dynamic map marker system.
  vehicleModeSectionLabel:{...TYPE.small,color:COLORS.muted,marginBottom:7,fontWeight:'700'},
  vehicleModeSelector:{flexDirection:'row',gap:10},
  vehicleModeOption:{flex:1,minHeight:72,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:11,paddingVertical:9},
  vehicleModeOptionSelected:{borderColor:COLORS.black,borderWidth:1.8,backgroundColor:COLORS.yellowSoft},
  vehicleModeOptionImage:{width:43,height:43},
  vehicleModeOptionTitle:{...TYPE.cardTitle,color:COLORS.black},
  vehicleModeOptionTitleSelected:{fontWeight:'900'},
  vehicleModeOptionMeta:{...TYPE.caption,color:COLORS.muted,marginTop:1},
  vehicleModeOptionMetaSelected:{color:COLORS.black},
  vehicleModeRadio:{width:22,height:22,borderRadius:11,borderWidth:1.5,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},
  vehicleModeRadioSelected:{borderColor:COLORS.red},
  vehicleModeRadioDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.red},
  chooseRideMapWrap:{height:205,borderRadius:20,overflow:'hidden',backgroundColor:COLORS.surface,position:'relative'},
  routeProviderMeta:{position:'absolute',left:10,bottom:8,maxWidth:'84%',...TYPE.caption,color:COLORS.black,backgroundColor:'rgba(252,251,248,.92)',borderRadius:8,paddingHorizontal:8,paddingVertical:4,overflow:'hidden'},
  vehicleMarkerShell:{width:46,height:46,borderRadius:23,alignItems:'center',justifyContent:'center',borderWidth:2.5,borderColor:COLORS.white,...SHADOW,position:'relative'},
  vehicleMarkerShellCompact:{width:36,height:36,borderRadius:18,borderWidth:2},
  vehicleMarkerRide:{backgroundColor:COLORS.black},
  vehicleMarkerBoda:{backgroundColor:COLORS.yellow},
  vehicleMarkerNose:{position:'absolute',top:-6,width:0,height:0,borderLeftWidth:5,borderRightWidth:5,borderBottomWidth:8,borderLeftColor:'transparent',borderRightColor:'transparent'},
  vehicleMarkerNoseRide:{borderBottomColor:COLORS.black},
  vehicleMarkerNoseBoda:{borderBottomColor:COLORS.yellow},

  // Kareebu+ v2.7 layout architecture: tighter hierarchy, clearer grouping and responsive cards.
  v27HomeHeroBlock:{gap:13},
  v27SearchAllBadge:{height:28,minWidth:38,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',paddingHorizontal:9},
  v27SearchAllBadgeText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  v27SectionHeaderCompact:{flexDirection:'row',alignItems:'baseline',justifyContent:'space-between',gap:12},
  v27SectionHeaderTitle:{...TYPE.sectionTitle,color:COLORS.black},
  v27SectionHeaderHint:{...TYPE.caption,color:COLORS.muted},
  v27HomeFoodCopy:{paddingHorizontal:11,paddingTop:9,paddingBottom:11},
  v27HomeStoreTop:{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'},
  v27HomeStoreArrow:{width:26,height:26,borderRadius:13,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',marginLeft:8},
  v27HomeStoreType:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v27CommerceHeading:{flex:1,minWidth:0,justifyContent:'center'},
  v27BookingFooter:{minHeight:62,borderTopWidth:1,borderBottomWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:9,paddingHorizontal:2},
  v27FareNote:{...TYPE.caption,color:COLORS.muted,textAlign:'right',maxWidth:130},


  v26DestinationRow:{minHeight:62,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:16},
  v26DestinationInput:{flex:1,...TYPE.bodyStrong,color:COLORS.black,paddingVertical:10},
  v26MapPreviewWrap:{height:220,borderRadius:22,overflow:'hidden',backgroundColor:COLORS.surface},
  v26NoDestination:{minHeight:126,alignItems:'center',justifyContent:'center',gap:5,paddingHorizontal:24},
  v26NoDestinationTitle:{...TYPE.cardTitle,color:COLORS.black},
  v26NoDestinationBody:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
  v26CardPressed:{opacity:.82,transform:[{scale:.985}]},
  buttonDisabled:{opacity:.58},
  filterChipPressed:{opacity:.72,transform:[{scale:.985}]},
  v26FoodCategoryActive:{opacity:1},
  v26FoodCategoryCircleActive:{borderWidth:2,borderColor:COLORS.red,backgroundColor:COLORS.yellowSoft},
  v26FoodCategoryLabelActive:{color:COLORS.red,fontFamily:FONT.bold,fontWeight:'800'},
  // Kareebu+ v3.1 compact production-style Home dashboard.
  v31HomeHeader:{paddingHorizontal:18,paddingTop:14,paddingBottom:8,gap:7,backgroundColor:'#FFFFFF'},
  v31HomeTopRow:{height:46,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v31HomeLogoSurface:{width:126,height:40,backgroundColor:'#FFFFFF',alignItems:'flex-start',justifyContent:'center',overflow:'hidden'},
  v31HomeWordmark:{width:120,height:36},
  v31BalancePill:{height:40,borderRadius:14,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:11,...SHADOW},
  v31BalanceMark:{width:25,height:25},
  v31BalanceText:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'900',color:COLORS.black},
  v31LocationUtilityRow:{minHeight:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  v31HomeLocation:{flex:1,minWidth:0,flexDirection:'row',alignItems:'center',gap:5},
  v31HomeLocationLabel:{fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.muted},
  v31HomeLocationText:{fontFamily:FONT.bold,fontSize:14,lineHeight:19,fontWeight:'800',color:COLORS.black,flexShrink:1},
  v31HeaderActions:{flexDirection:'row',alignItems:'center',gap:8},
  v31HeaderCircle:{width:36,height:36,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},
  v31HeaderMarkButton:{width:38,height:38,borderRadius:13,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},
  v31HeaderMark:{width:27,height:27},
  v31HomeScroll:{paddingHorizontal:18,paddingTop:6,paddingBottom:24,gap:15,backgroundColor:'#FFFFFF'},
  v31GreetingBlock:{gap:1},
  v31HomeGreeting:{fontFamily:FONT.bold,fontSize:22,lineHeight:27,fontWeight:'900',letterSpacing:-.3,color:COLORS.black},
  v31HomeGreetingSub:{fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.muted},
  v31SearchBar:{height:50,borderWidth:1,borderColor:COLORS.line,borderRadius:17,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14,...SHADOW},
  v31SearchPlaceholder:{fontFamily:FONT.regular,fontSize:14,lineHeight:19,color:COLORS.mutedLight,flex:1},
  v31SearchAllBadge:{height:32,minWidth:44,borderRadius:16,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',paddingHorizontal:11},
  v31SearchAllBadgeText:{fontFamily:FONT.bold,fontSize:12,lineHeight:16,fontWeight:'900',color:COLORS.black},
  v31SectionRow:{minHeight:30,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  v31SectionRowCompact:{minHeight:26,flexDirection:'row',alignItems:'baseline',justifyContent:'space-between',gap:10},
  v31SectionTitle:{fontFamily:FONT.bold,fontSize:18,lineHeight:23,fontWeight:'900',letterSpacing:-.2,color:COLORS.black},
  v31SectionHint:{fontFamily:FONT.regular,fontSize:11,lineHeight:15,color:COLORS.muted},
  v31ServiceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:8},
  v31ServiceCard:{width:'23.5%',height:84,borderWidth:1,borderColor:COLORS.line,borderRadius:17,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',paddingVertical:7,gap:2,...SHADOW},
  v31ServiceVisual:{height:43,alignItems:'center',justifyContent:'center'},
  v31ServiceImage:{width:44,height:44},
  v31ServiceLabel:{fontFamily:FONT.medium,fontSize:12,lineHeight:15,fontWeight:'700',color:COLORS.black,textAlign:'center'},
  v31PromoList:{gap:10,paddingRight:8},
  // v3.3 approved Offers-for-you reference: four slim retailer creatives visible together.
  v33PromoList:{gap:8,paddingTop:6,paddingRight:8},
  v33ReferencePromoCard:{borderRadius:15,overflow:'hidden',backgroundColor:'#FFFFFF'},
  v33ReferencePromoImage:{width:'100%',height:'100%'},
  v31PromoCard:{width:154,height:244,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#FFFFFF',padding:11,overflow:'hidden',...SHADOW},
  v31PromoBrandRow:{height:34,flexDirection:'row',alignItems:'center',gap:7},
  v31PromoBrandIcon:{width:27,height:27,borderRadius:9,alignItems:'center',justifyContent:'center'},
  v31PromoBrand:{flex:1,fontFamily:FONT.bold,fontSize:12,lineHeight:14,fontWeight:'900',color:COLORS.black},
  v31PromoEyebrow:{fontFamily:FONT.bold,fontSize:9,lineHeight:12,fontWeight:'900',letterSpacing:.55,marginTop:6},
  v31PromoHeadline:{fontFamily:FONT.bold,fontSize:16,lineHeight:19,fontWeight:'900',color:COLORS.black,marginTop:3},
  v31PromoDetail:{fontFamily:FONT.regular,fontSize:10,lineHeight:14,color:COLORS.muted,marginTop:3,minHeight:40},
  v31PromoVisualArea:{height:60,alignItems:'center',justifyContent:'center',marginTop:4},
  v31PromoImage:{width:64,height:64},
  v31PromoPharmacyVisual:{width:54,height:54,borderRadius:18,borderWidth:2,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.greenSoft},
  v31PromoPrice:{fontFamily:FONT.bold,fontSize:10,lineHeight:13,fontWeight:'800',color:COLORS.black,minHeight:26,textAlign:'center'},
  v31PromoCta:{height:28,borderRadius:14,alignItems:'center',justifyContent:'center',paddingHorizontal:10,marginTop:4},
  v31PromoCtaText:{fontFamily:FONT.bold,fontSize:10,lineHeight:13,fontWeight:'900',textTransform:'uppercase'},
  v31PromoDemoLabel:{fontFamily:FONT.regular,fontSize:8,lineHeight:10,color:COLORS.mutedLight,textAlign:'center',marginTop:4},
  v31BrandList:{gap:8,paddingRight:8},
  v31BrandTile:{width:104,minHeight:92,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingVertical:8,...SHADOW},
  v31BrandIcon:{width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center',marginBottom:6},
  v31BrandName:{fontFamily:FONT.bold,fontSize:11,lineHeight:14,fontWeight:'800',textAlign:'center',color:COLORS.black,minHeight:28},
  v31BrandEta:{fontFamily:FONT.regular,fontSize:9,lineHeight:12,color:COLORS.muted,marginTop:2},
  v31RecentCard:{height:92,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',paddingLeft:11,paddingRight:8,gap:9,overflow:'hidden',...SHADOW},
  v31RecentBrand:{width:38,height:38,borderRadius:12,backgroundColor:'#FFF1EF',alignItems:'center',justifyContent:'center'},
  v31RecentCopy:{flex:1,minWidth:0},
  v31RecentTitle:{fontFamily:FONT.bold,fontSize:12,lineHeight:16,fontWeight:'800',color:COLORS.black},
  v31RecentMeta:{fontFamily:FONT.regular,fontSize:10,lineHeight:14,color:COLORS.muted,marginTop:2},
  v31RecentTime:{fontFamily:FONT.regular,fontSize:9,lineHeight:12,color:COLORS.mutedLight,marginTop:1},
  v31RecentAmountWrap:{alignItems:'flex-end',justifyContent:'center',gap:5},
  v31RecentAmount:{fontFamily:FONT.bold,fontSize:11,lineHeight:14,fontWeight:'900',color:COLORS.black},
  v31DeliveredPill:{height:20,borderRadius:10,backgroundColor:COLORS.greenSoft,alignItems:'center',justifyContent:'center',paddingHorizontal:7},
  v31DeliveredText:{fontFamily:FONT.medium,fontSize:8,lineHeight:10,fontWeight:'800',color:COLORS.green},
  v31RecentMapWrap:{width:88,height:70,borderRadius:13,overflow:'hidden',backgroundColor:COLORS.surface},
  v31MapPin:{width:24,height:24,borderRadius:12,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:COLORS.white},

  // v3.4 approved Big brands + Recent activity reference match.
  v34SectionTitle:{fontFamily:FONT.bold,fontSize:16,lineHeight:20,fontWeight:'900',letterSpacing:-.15,color:COLORS.black},
  v34BrandList:{flexDirection:'row',alignItems:'stretch',justifyContent:'space-between',gap:8},
  v34BrandTile:{height:78,borderRadius:13,borderWidth:1,borderColor:'#ECEBE8',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',paddingHorizontal:5,paddingVertical:8,...SHADOW},
  v34BrandLogoWrap:{width:'100%',height:33,alignItems:'center',justifyContent:'center',marginBottom:7},
  v34BrandLogo:{width:'92%',height:'100%'},
  v34BrandEta:{fontFamily:FONT.regular,fontSize:9,lineHeight:12,color:'#404247',textAlign:'center'},
  v34RecentCard:{height:76,borderRadius:14,borderWidth:1,borderColor:'#ECEBE8',backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',paddingLeft:8,paddingRight:7,gap:8,overflow:'hidden',...SHADOW},
  v34RecentBrand:{width:46,height:46,borderRadius:12,borderWidth:1,borderColor:'#ECEBE8',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',padding:5},
  v34RecentBrandLogo:{width:'100%',height:'100%'},
  v34RecentCopy:{flex:1,minWidth:82},
  v34RecentTitle:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:14,fontWeight:'800',color:COLORS.black},
  v34RecentMeta:{fontFamily:FONT.regular,fontSize:9,lineHeight:12,color:COLORS.muted,marginTop:1},
  v34RecentTime:{fontFamily:FONT.regular,fontSize:8.5,lineHeight:11,color:COLORS.mutedLight,marginTop:1},
  v34RecentAmountWrap:{width:72,alignItems:'center',justifyContent:'center',gap:5},
  v34RecentAmount:{fontFamily:FONT.bold,fontSize:9.5,lineHeight:12,fontWeight:'900',color:COLORS.black,textAlign:'center'},
  v34DeliveredPill:{height:18,borderRadius:9,backgroundColor:COLORS.greenSoft,alignItems:'center',justifyContent:'center',paddingHorizontal:7},
  v34DeliveredText:{fontFamily:FONT.medium,fontSize:8,lineHeight:10,fontWeight:'800',color:COLORS.green},
  v34RecentMapWrap:{height:62,borderRadius:12,overflow:'hidden',backgroundColor:'#F5F0E8'},
  v34StartDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.green,borderWidth:2,borderColor:COLORS.white},

  // Kareebu+ v3.0 realistic demo content, richer commerce and product-wide branding.
  v30OnboardingBrandRail:{paddingHorizontal:22,paddingBottom:10,flexDirection:'row',alignItems:'center',gap:14},
  v30OnboardingWordmark:{width:96,height:32},
  v30OnboardingProgress:{flex:1,flexDirection:'row',alignItems:'center',gap:8},
  v30OnboardingProgressLabel:{...TYPE.caption,color:COLORS.muted,flexShrink:1},
  v30OnboardingProgressTrack:{flex:1,height:4,borderRadius:2,backgroundColor:COLORS.line,overflow:'hidden'},
  v30OnboardingProgressFill:{height:'100%',borderRadius:2,backgroundColor:COLORS.red},
  v30OnboardingProgressCount:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  v30HomeWordmark:{width:118,height:38},
  v30WelcomeBackRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v30HomeGreeting:{...TYPE.sectionTitle,color:COLORS.black},
  v30HomeGreetingSub:{...TYPE.small,color:COLORS.muted,marginTop:2},
  v30BrandPulse:{width:44,height:44,borderRadius:15,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center'},
  v30BrandPulseMark:{width:29,height:29},
  v30SectionLabelRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v30SectionLabel:{...TYPE.sectionTitle,color:COLORS.black},
  v30SectionCounter:{...TYPE.caption,color:COLORS.red,fontWeight:'800'},
  v30MiniOffer:{position:'absolute',left:8,top:8,maxWidth:'84%',backgroundColor:COLORS.yellow,borderRadius:8,paddingHorizontal:7,paddingVertical:4,zIndex:3},
  v30MiniOfferText:{...TYPE.caption,color:COLORS.black,fontWeight:'900'},
  v30RestaurantCuisine:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v30StoreIcon:{width:48,height:48,borderRadius:14,alignItems:'center',justifyContent:'center'},
  v30StoreDeal:{...TYPE.caption,color:COLORS.red,fontWeight:'700',marginTop:6},
  v30ContextBar:{minHeight:38,marginHorizontal:18,marginBottom:8,borderRadius:13,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:11,borderWidth:1,borderColor:COLORS.line},
  v30ContextBarDark:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  v30ContextMark:{width:22,height:22},
  v30ContextText:{flex:1,...TYPE.caption,color:COLORS.muted,fontWeight:'700'},
  v30ContextTextDark:{color:COLORS.white},
  v30ContextBars:{flexDirection:'row',gap:3},
  v30ContextBarDash:{width:10,height:4,borderRadius:2},
  v30CommerceTitleRow:{flexDirection:'row',alignItems:'center',gap:8},
  v30CommerceMark:{width:25,height:25},
  v30CommerceBrandLine:{minHeight:38,borderRadius:14,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12},
  v30CommerceWordmark:{width:84,height:28},
  v30CommerceBrandCopy:{flex:1,...TYPE.caption,color:COLORS.white},
  v30CommerceSearchInput:{flex:1,...TYPE.bodyStrong,color:COLORS.black,paddingVertical:0},
  v30CountPill:{...TYPE.label,minWidth:30,height:30,borderRadius:15,backgroundColor:COLORS.yellow,textAlign:'center',textAlignVertical:'center',paddingTop:7,color:COLORS.black,fontWeight:'900'},
  v30ResultsHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v30ResultsTitle:{...TYPE.cardTitle,color:COLORS.black},
  v30ResultsSub:{...TYPE.caption,color:COLORS.muted},
  v30EmptyState:{minHeight:150,alignItems:'center',justifyContent:'center',gap:7,padding:22,shadowOpacity:0},
  v30EmptyTitle:{...TYPE.cardTitle,color:COLORS.black},
  v30EmptyBody:{...TYPE.small,color:COLORS.muted,textAlign:'center'},
  v30HeaderHeart:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},
  v30RestaurantHeroWrap:{position:'relative'},
  v30RestaurantHeroBadge:{position:'absolute',left:12,top:12,height:32,borderRadius:16,backgroundColor:'rgba(11,11,13,.92)',flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:9},
  v30RestaurantHeroMark:{width:20,height:20},
  v30RestaurantHeroBadgeText:{...TYPE.caption,color:COLORS.white,fontWeight:'800'},
  v30RestaurantOfferBadge:{position:'absolute',left:12,bottom:12,backgroundColor:COLORS.yellow,borderRadius:9,paddingHorizontal:10,paddingVertical:6},
  v30RestaurantOfferBadgeText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  v30RestaurantInfoStrip:{minHeight:70,borderRadius:17,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:12,marginBottom:16},
  v30InfoValue:{...TYPE.bodyStrong,color:COLORS.black,textAlign:'center'},
  v30InfoLabel:{...TYPE.caption,color:COLORS.muted,textAlign:'center',marginTop:2},
  v30InfoRule:{width:1,height:34,backgroundColor:COLORS.lineDark},
  v30MenuCategoryRow:{gap:8,paddingBottom:14},
  v30MenuCategoryChip:{height:36,borderRadius:18,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:13,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.white},
  v30MenuCategoryChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  v30MenuCategoryText:{...TYPE.small,color:COLORS.black,fontWeight:'700'},
  v30MenuCategoryTextActive:{color:COLORS.white},
  v30MenuSection:{marginTop:8},
  v30MenuSectionHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:10},
  v30MenuSectionTitle:{...TYPE.sectionTitle,color:COLORS.black},
  v30MenuSectionCount:{...TYPE.caption,color:COLORS.muted},
  v30MenuItem:{minHeight:124,flexDirection:'row',gap:12,paddingVertical:13,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v30MenuCopy:{flex:1,paddingRight:2},
  v30MenuNameRow:{flexDirection:'row',alignItems:'center',gap:7},
  v30PopularPill:{backgroundColor:COLORS.yellowSoft,borderRadius:7,paddingHorizontal:6,paddingVertical:3},
  v30PopularPillText:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  v30MenuDescription:{...TYPE.small,color:COLORS.muted,marginTop:4,lineHeight:18},
  v30MenuPrice:{...TYPE.bodyStrong,color:COLORS.black,marginTop:7},
  v30MenuBadgeText:{...TYPE.caption,color:COLORS.red,fontWeight:'800',marginTop:3},
  v30MenuVisualWrap:{width:96,height:96,position:'relative'},
  v30MenuImage:{width:96,height:96,borderRadius:16},
  v30MenuAddButton:{position:'absolute',right:-3,bottom:-3,width:38,height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',...SHADOW},
  v30MenuQuantity:{position:'absolute',right:-4,bottom:-4,minWidth:88,height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:7,...SHADOW},
  v30MenuQuantityText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  v30CartCountBubble:{width:34,height:34,borderRadius:12,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginRight:11},
  v30CartCountText:{...TYPE.label,color:COLORS.black,fontWeight:'900'},
  v30CartBarRight:{flexDirection:'row',alignItems:'center',gap:7},
  v30CartBarTotal:{...TYPE.bodyStrong,color:COLORS.white},
  v30CartRestaurantRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v30CartRestaurantMeta:{...TYPE.small,color:COLORS.muted,marginTop:3},
  v30AddMore:{...TYPE.action,color:COLORS.red},
  v30CartItemDesc:{...TYPE.caption,color:COLORS.muted,marginTop:3},
  v30PromoApply:{flexDirection:'row',gap:8},
  v30PromoInputWrap:{flex:1,height:52,borderWidth:1,borderColor:COLORS.line,borderRadius:15,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:12},
  v30PromoInput:{flex:1,...TYPE.small,color:COLORS.black},
  v30PromoApplyButton:{height:52,borderRadius:15,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',paddingHorizontal:18},
  v30PromoApplyText:{...TYPE.action,color:COLORS.white},
  v30PromoHelp:{...TYPE.caption,color:COLORS.muted,marginTop:-10},
  v30PromoSuccess:{minHeight:42,borderRadius:13,backgroundColor:COLORS.greenSoft,flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:12},
  v30PromoSuccessText:{...TYPE.small,color:COLORS.green,fontWeight:'800'},
  v30CheckoutTrust:{...TYPE.caption,color:COLORS.muted,textAlign:'center'},
  v30TrackingBrand:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v30TrackingWordmark:{width:104,height:34},
  v30OrderProgress:{flexDirection:'row',justifyContent:'space-between',marginVertical:10},
  v30OrderProgressItem:{flex:1,alignItems:'center',gap:5},
  v30OrderProgressDot:{width:24,height:24,borderRadius:12,backgroundColor:COLORS.surfaceStrong,alignItems:'center',justifyContent:'center'},
  v30OrderProgressDotActive:{backgroundColor:COLORS.yellow},
  v30OrderProgressLabel:{...TYPE.caption,color:COLORS.muted,textAlign:'center'},
  v30OrderProgressLabelActive:{color:COLORS.black,fontWeight:'800'},
  v30ShopPromoRow:{gap:10,paddingRight:10},
  v30ShopPromo:{width:300,height:150,borderRadius:20,padding:16,flexDirection:'row',overflow:'hidden'},
  v30ShopPromoEyebrow:{...TYPE.label,letterSpacing:1.1,fontWeight:'900'},
  v30ShopPromoTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:25,fontWeight:'900',marginTop:5},
  v30ShopPromoBody:{...TYPE.small,marginTop:6,maxWidth:185},
  v30ShopPromoImage:{width:92,height:92,alignSelf:'center'},
  v30TopShopRow:{gap:10,paddingRight:8},
  v30TopShopCard:{width:104,alignItems:'center'},
  v30TopShopIcon:{width:70,height:70,borderRadius:19,alignItems:'center',justifyContent:'center'},
  v30TopShopName:{...TYPE.label,color:COLORS.black,textAlign:'center',marginTop:7,minHeight:32},
  v30TopShopMeta:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v30ShopList:{gap:9},
  v30ShopRow:{minHeight:106,borderWidth:1,borderColor:COLORS.line,borderRadius:18,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,padding:11,...SHADOW},
  v30ShopRowIcon:{width:62,height:62,borderRadius:17,alignItems:'center',justifyContent:'center'},
  v30ShopNameRow:{flexDirection:'row',alignItems:'center',gap:7},
  v30ShopName:{...TYPE.cardTitle,color:COLORS.black,flex:1},
  v30ShopRating:{...TYPE.caption,color:COLORS.black,fontWeight:'800'},
  v30ShopMeta:{...TYPE.caption,color:COLORS.muted,marginTop:4},
  v30ShopDealRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:7,flexWrap:'wrap'},
  v30ShopDelivery:{...TYPE.caption,color:COLORS.red,fontWeight:'800'},
  v30ShopHeart:{width:36,height:36,borderRadius:18,alignItems:'center',justifyContent:'center'},
  v30DirectionsCard:{padding:14,shadowOpacity:0,backgroundColor:COLORS.white},
  v30DirectionsCardCompact:{paddingBottom:10},
  v30DirectionsHeader:{flexDirection:'row',alignItems:'center',gap:10},
  v30DirectionsIcon:{width:40,height:40,borderRadius:13,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v30DirectionsTitle:{...TYPE.cardTitle,color:COLORS.black},
  v30DirectionsSummary:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v30TrafficPill:{height:28,borderRadius:14,backgroundColor:COLORS.greenSoft,flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:8},
  v30TrafficText:{fontFamily:FONT.medium,fontSize:10,fontWeight:'800',color:COLORS.green},
  v30DirectionSteps:{marginTop:12,borderTopWidth:1,borderTopColor:COLORS.line},
  v30DirectionStep:{minHeight:46,flexDirection:'row',alignItems:'center',gap:9,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v30DirectionStepIcon:{width:28,alignItems:'center'},
  v30DirectionInstruction:{flex:1,...TYPE.small,color:COLORS.black},
  v30DirectionDistance:{...TYPE.caption,color:COLORS.muted},
  v30DirectionsDemoNote:{...TYPE.caption,color:COLORS.muted,marginTop:8},

  // v3.8 product-wide UX consolidation
  v38OnboardingTopline:{height:44,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:2,marginTop:2},
  v38OnboardingBack:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  v38OnboardingBackPlaceholder:{width:38,height:38},
  v38OnboardingMark:{width:30,height:30},
  v38OnboardingStep:{fontFamily:FONT.bold,fontSize:12,lineHeight:16,fontWeight:'800',color:COLORS.muted,backgroundColor:COLORS.surface,borderRadius:14,paddingHorizontal:10,paddingVertical:6,overflow:'hidden'},
  v38CountrySupport:{fontFamily:FONT.regular,fontSize:12.5,lineHeight:18,color:COLORS.muted,textAlign:'center',paddingHorizontal:26,marginTop:6,marginBottom:2},
  v38CountryModalBackdrop:{flex:1,backgroundColor:'rgba(11,11,13,.36)',justifyContent:'flex-end'},
  v38CountryModalCard:{backgroundColor:COLORS.white,borderTopLeftRadius:28,borderTopRightRadius:28,paddingHorizontal:20,paddingTop:10,paddingBottom:28},
  v38CountryModalHandle:{width:42,height:5,borderRadius:3,backgroundColor:COLORS.lineDark,alignSelf:'center',marginBottom:15},
  v38CountryModalTitle:{fontFamily:FONT.bold,fontSize:20,lineHeight:25,fontWeight:'900',color:COLORS.black},
  v38CountryModalBody:{fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.muted,marginTop:5,marginBottom:12},
  v38CountryModalRow:{minHeight:64,borderTopWidth:1,borderTopColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:7},
  v38CountryModalRowSelected:{backgroundColor:'#FFF8F6',borderRadius:16,borderTopColor:'transparent'},
  v38CountryModalFlag:{fontSize:26},
  v38CountryModalName:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'800',color:COLORS.black},
  v38CountryModalMeta:{fontFamily:FONT.regular,fontSize:12,lineHeight:16,color:COLORS.muted,marginTop:2},
  v38LocationNote:{minHeight:42,borderRadius:13,backgroundColor:'#FFF4F1',flexDirection:'row',alignItems:'center',gap:8,paddingHorizontal:11,marginBottom:4},
  v38LocationNoteText:{flex:1,fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.black},
  v38LocationTopbar:{position:'absolute',left:18,right:18,top:10,zIndex:32,height:54,borderRadius:18,backgroundColor:'rgba(255,255,255,.98)',borderWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:10,...SHADOW},
  v38LocationBack:{width:36,height:36,borderRadius:18,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  v38LocationBrandRow:{flex:1,flexDirection:'row',alignItems:'center',gap:8},
  v38LocationBrandMark:{width:27,height:27},
  v38LocationBrandTitle:{fontFamily:FONT.bold,fontSize:14,lineHeight:18,fontWeight:'900',color:COLORS.black},
  v38LocationBrandMeta:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,marginTop:1},
  v38MobileMoneyLogo:{width:42,height:42,borderRadius:13,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v38MobileMoneyLogoText:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',color:COLORS.black},
  v38SectionLocale:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,marginTop:1},
  v38ServicesScroll:{paddingHorizontal:18,paddingTop:8,paddingBottom:100},
  v38ServicesIntro:{fontFamily:FONT.regular,fontSize:13,lineHeight:19,color:COLORS.muted,marginBottom:16},
  v38ServicesGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},
  v38ServiceCard:{width:'48.5%',minHeight:156,borderRadius:20,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:14,...SHADOW},
  v38ServiceIconWrap:{width:52,height:52,borderRadius:17,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',marginBottom:11},
  v38ServiceImage:{width:42,height:42},
  v38ServiceTitle:{fontFamily:FONT.bold,fontSize:16,lineHeight:20,fontWeight:'900',color:COLORS.black},
  v38ServiceBody:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.muted,minHeight:34,marginTop:4,marginBottom:6},
  v38StorefrontScroll:{paddingHorizontal:18,paddingBottom:118,gap:15},
  v38StorefrontHero:{alignItems:'center',paddingTop:2,paddingBottom:5},
  v38StorefrontLogo:{width:92,height:58,borderRadius:16,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:8},
  v38StorefrontName:{fontFamily:FONT.bold,fontSize:21,lineHeight:25,fontWeight:'900',color:COLORS.black,textAlign:'center',marginTop:9},
  v38StorefrontMeta:{fontFamily:FONT.regular,fontSize:12.5,lineHeight:17,color:COLORS.muted,marginTop:4},
  v38StorefrontDeal:{minHeight:32,borderRadius:16,backgroundColor:'#FFF4F1',flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10,marginTop:9},
  v38StorefrontDealText:{fontFamily:FONT.bold,fontSize:11.5,lineHeight:15,fontWeight:'800',color:COLORS.red},
  v38StorefrontInfoRow:{minHeight:70,borderRadius:18,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'center',justifyContent:'space-around',paddingHorizontal:8},
  v38StorefrontInfoLabel:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,textAlign:'center'},
  v38StorefrontInfoValue:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:17,fontWeight:'800',color:COLORS.black,textAlign:'center',marginTop:3,maxWidth:105},
  v38ProductGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},
  v38ProductCard:{width:'48.5%',minHeight:220,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:12},
  v38ProductVisual:{height:72,borderRadius:15,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center',marginBottom:10},
  v38ProductName:{fontFamily:FONT.bold,fontSize:14,lineHeight:18,fontWeight:'800',color:COLORS.black,minHeight:36},
  v38ProductDetail:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,marginTop:2},
  v38ProductPrice:{fontFamily:FONT.bold,fontSize:13.5,lineHeight:18,fontWeight:'900',color:COLORS.black,marginTop:7},
  v38ProductAdd:{height:34,borderRadius:12,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',marginTop:10},
  v38ProductAddText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  v38ProductQty:{height:34,borderRadius:12,borderWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginTop:10,paddingHorizontal:5},
  v38ProductQtyText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  v38StoreBasketBar:{position:'absolute',left:18,right:18,bottom:12,height:58,borderRadius:18,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14,...SHADOW},
  v38StoreBasketCount:{width:30,height:30,borderRadius:10,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v38StoreBasketCountText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  v38StoreBasketLabel:{flex:1,fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:COLORS.white},
  v38StoreBasketTotal:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900',color:COLORS.white},
  v38BasketBackdrop:{flex:1,backgroundColor:'rgba(11,11,13,.34)',justifyContent:'flex-end'},
  v38BasketSheet:{maxHeight:'78%',backgroundColor:COLORS.white,borderTopLeftRadius:28,borderTopRightRadius:28,paddingHorizontal:18,paddingTop:10,paddingBottom:22},
  v38BasketHandle:{width:42,height:5,borderRadius:3,backgroundColor:COLORS.lineDark,alignSelf:'center',marginBottom:14},
  v38BasketHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},
  v38BasketTitle:{fontFamily:FONT.bold,fontSize:20,lineHeight:25,fontWeight:'900',color:COLORS.black},
  v38BasketMeta:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.muted,marginTop:2},
  v38BasketClose:{width:38,height:38,borderRadius:19,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  v38BasketItems:{maxHeight:250},
  v38BasketRow:{minHeight:68,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:COLORS.line,paddingVertical:8},
  v38BasketRowIcon:{width:44,height:44,borderRadius:13,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  v38BasketRowName:{fontFamily:FONT.bold,fontSize:13,lineHeight:17,fontWeight:'800',color:COLORS.black},
  v38BasketRowPrice:{fontFamily:FONT.regular,fontSize:11,lineHeight:15,color:COLORS.muted,marginTop:3},
  v38BasketSummary:{paddingTop:11,gap:7},
  v38BasketSummaryRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v38BasketSummaryLabel:{fontFamily:FONT.regular,fontSize:12.5,lineHeight:17,color:COLORS.muted},
  v38BasketSummaryValue:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:17,fontWeight:'800',color:COLORS.black},
  v38BasketTotalRow:{borderTopWidth:1,borderTopColor:COLORS.line,paddingTop:9,marginTop:2},
  v38BasketTotalLabel:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'900',color:COLORS.black},
  v38BasketTotalValue:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'900',color:COLORS.black},
  v38BasketMinimum:{minHeight:40,borderRadius:12,backgroundColor:'#FFF4F1',flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:10,marginTop:11},
  v38BasketMinimumText:{flex:1,fontFamily:FONT.regular,fontSize:11,lineHeight:15,color:COLORS.black},
  v38BasketCheckout:{height:54,borderRadius:17,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',marginTop:13},
  v38BasketCheckoutText:{fontFamily:FONT.bold,fontSize:15,lineHeight:19,fontWeight:'900',color:COLORS.white},
  v38ParcelEstimateCard:{minHeight:66,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:14,shadowOpacity:0,backgroundColor:COLORS.surface},
  v38ParcelEstimateTitle:{fontFamily:FONT.bold,fontSize:13.5,lineHeight:18,fontWeight:'800',color:COLORS.black},
  v38ParcelEstimateBody:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:16,color:COLORS.muted,marginTop:2},

  // v3.9 landmark country selection
  v39CountryPreviewVisual:{flex:1,backgroundColor:COLORS.surface,position:'relative',overflow:'hidden'},
  v39CountryPreviewVisualSelected:{backgroundColor:COLORS.white},
  v39CountryLandmarkImage:{...StyleSheet.absoluteFill,width:'100%',height:'100%'},
  v39CountryImageShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(11,11,13,.08)'},
  v39CountryPreviewCaption:{position:'absolute',left:9,right:9,bottom:9,minHeight:44,borderRadius:14,backgroundColor:'rgba(255,255,255,.94)',paddingHorizontal:9,paddingVertical:6,flexDirection:'row',alignItems:'center',gap:7},
  v39CountryPreviewFlag:{fontSize:19},
  v39CountryPreviewName:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:16,fontWeight:'900',color:COLORS.black},
  v39CountryPreviewCapital:{fontFamily:FONT.regular,fontSize:10,lineHeight:13,color:COLORS.muted,marginTop:1},
  v401CountryCardLeft:{transform:[{rotate:'-4deg'},{translateX:-7}]},
  v401CountryCardRight:{transform:[{rotate:'4deg'},{translateX:7}]},
  v401CountryPhotoShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(11,11,13,.035)'},
  v401CountryLocationPill:{position:'absolute',left:12,bottom:12,minHeight:34,maxWidth:'78%',borderRadius:17,backgroundColor:'rgba(255,255,255,.96)',paddingHorizontal:11,flexDirection:'row',alignItems:'center',gap:5,...SHADOW},
  v401CountryLocationText:{fontFamily:FONT.bold,fontSize:12.5,lineHeight:16,fontWeight:'900',color:COLORS.black},
  v401CountrySelectedBadge:{position:'absolute',right:12,top:12,width:30,height:30,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:COLORS.white,...SHADOW},
  v401CountryMapCity:{minHeight:30,borderRadius:15,backgroundColor:'rgba(255,255,255,.94)',paddingHorizontal:9,flexDirection:'row',alignItems:'center',gap:6,borderWidth:1,borderColor:'rgba(11,11,13,.08)'},
  v401CountryMapDot:{width:8,height:8,borderRadius:4,backgroundColor:COLORS.red},
  v401CountryMapCityText:{fontFamily:FONT.bold,fontSize:11.5,lineHeight:15,fontWeight:'800',color:COLORS.black},

  // v3.9 AI concierge
  v39AiHomeCard:{minHeight:68,borderRadius:20,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:14,paddingVertical:11,marginTop:-4,marginBottom:5,...SHADOW},
  v39AiHomeIcon:{width:42,height:42,borderRadius:14,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v39AiHomeTitle:{fontFamily:FONT.bold,fontSize:14.5,lineHeight:18,fontWeight:'900',color:COLORS.white},
  v39AiHomeBody:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:'#D9D9DC',marginTop:3},
  v39AiHeader:{minHeight:66,borderBottomWidth:1,borderBottomColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:16},
  v39AiBack:{width:38,height:38,borderRadius:19,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  v39AiMark:{width:34,height:34},
  v39AiHeaderTitle:{fontFamily:FONT.bold,fontSize:17,lineHeight:21,fontWeight:'900',color:COLORS.black},
  v39AiHeaderMeta:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,marginTop:1},
  v39AiLiveDot:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.green,borderWidth:2,borderColor:COLORS.greenSoft},
  v39AiMessages:{paddingHorizontal:16,paddingTop:14,paddingBottom:24,gap:10},
  v39AiPrivacyNote:{minHeight:48,borderRadius:15,backgroundColor:COLORS.yellowSoft,flexDirection:'row',alignItems:'center',gap:9,paddingHorizontal:12,paddingVertical:9,marginBottom:4},
  v39AiPrivacyText:{flex:1,fontFamily:FONT.regular,fontSize:10.5,lineHeight:15,color:COLORS.black},
  v39AiBubble:{maxWidth:'88%',borderRadius:20,paddingHorizontal:14,paddingVertical:11},
  v39AiAssistantBubble:{alignSelf:'flex-start',backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.line},
  v39AiUserBubble:{alignSelf:'flex-end',backgroundColor:COLORS.black,borderBottomRightRadius:7},
  v39AiBubbleBrand:{flexDirection:'row',alignItems:'center',gap:5,marginBottom:6},
  v39AiBubbleBrandText:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:13,fontWeight:'900',color:COLORS.black},
  v39AiDemoTag:{fontFamily:FONT.bold,fontSize:9,lineHeight:12,fontWeight:'800',color:COLORS.red,backgroundColor:'#FFF1EE',borderRadius:8,paddingHorizontal:6,paddingVertical:2},
  v39AiMessageText:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.black},
  v39AiUserMessageText:{color:COLORS.white},
  v39AiActionRow:{flexDirection:'row',flexWrap:'wrap',gap:7,marginTop:10},
  v39AiActionChip:{minHeight:34,borderRadius:17,backgroundColor:COLORS.yellow,flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10},
  v39AiActionChipText:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:14,fontWeight:'900',color:COLORS.black},
  v39AiTyping:{flexDirection:'row',alignItems:'center',gap:8},
  v39AiTypingText:{fontFamily:FONT.regular,fontSize:11.5,lineHeight:15,color:COLORS.muted},
  v39AiTryTitle:{fontFamily:FONT.bold,fontSize:13.5,lineHeight:18,fontWeight:'900',color:COLORS.black,marginTop:8,marginBottom:8},
  v39AiQuickWrap:{flexDirection:'row',flexWrap:'wrap',gap:7},
  v39AiQuickChip:{minHeight:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,justifyContent:'center',paddingHorizontal:12},
  v39AiQuickText:{fontFamily:FONT.medium,fontSize:11,lineHeight:15,fontWeight:'600',color:COLORS.black},
  v39AiComposerWrap:{borderTopWidth:1,borderTopColor:COLORS.line,backgroundColor:COLORS.white,paddingHorizontal:14,paddingTop:10,paddingBottom:9},
  v39AiComposer:{minHeight:54,maxHeight:112,borderRadius:21,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,flexDirection:'row',alignItems:'flex-end',gap:8,paddingLeft:14,paddingRight:7,paddingVertical:7},
  v39AiInput:{flex:1,maxHeight:88,fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.black,paddingVertical:8},
  v39AiSend:{width:40,height:40,borderRadius:14,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center'},
  v39AiSendDisabled:{backgroundColor:COLORS.lineDark},
  v39AiFooterNote:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.muted,textAlign:'center',marginTop:6,paddingHorizontal:8},


  // v4.0 reference-aligned onboarding, marketplace, rides and AI recommendations.
  v40WelcomeScreen:{flex:1,backgroundColor:COLORS.white,paddingHorizontal:24,paddingTop:18,paddingBottom:14},
  v40WelcomeBrandBlock:{height:74,alignItems:'center',justifyContent:'flex-end'},
  v40WelcomeLogo:{width:220,height:62},
  v40WelcomeCopy:{alignItems:'center',paddingTop:8},
  v40WelcomeTitle:{fontFamily:FONT.bold,fontSize:28,lineHeight:34,fontWeight:'900',color:COLORS.black,textAlign:'center'},
  v40WelcomeTitleAccent:{color:COLORS.red},
  v40WelcomeSubtitle:{fontFamily:FONT.regular,fontSize:15,lineHeight:22,color:COLORS.muted,textAlign:'center',marginTop:10},
  v40WelcomeHeroFrame:{flex:1,minHeight:370,alignItems:'center',justifyContent:'center',position:'relative',marginTop:2},
  v40WelcomeHero:{width:'100%',height:'100%',maxHeight:500},
  v40WelcomeRideBubble:{position:'absolute',left:12,top:60,zIndex:3,width:98,height:98,borderRadius:49,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',...SHADOW},
  v40WelcomeRideIcon:{width:54,height:42},
  v40WelcomeRideText:{fontFamily:FONT.bold,fontSize:13,fontWeight:'800',color:COLORS.black,marginTop:2},
  v40WelcomeActions:{gap:9,paddingTop:6},
  v40WelcomePrimaryButton:{height:58,borderRadius:18,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center',...SHADOW},
  v40WelcomePrimaryText:{fontFamily:FONT.bold,fontSize:18,lineHeight:22,fontWeight:'900',color:COLORS.white},
  v40WelcomeGuest:{height:42,alignItems:'center',justifyContent:'center'},
  v40WelcomeGuestText:{fontFamily:FONT.bold,fontSize:15,fontWeight:'800',color:COLORS.black},

  v40CountryWordmark:{width:142,height:44},
  v40CountryTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:26,fontWeight:'900',letterSpacing:-.7,color:COLORS.black,textAlign:'center',marginTop:4,marginBottom:6},
  v40CountrySelector:{alignSelf:'center',minWidth:224,height:60,borderRadius:22,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:11,paddingHorizontal:20,...SHADOW},
  v40CountrySupport:{fontFamily:FONT.regular,fontSize:14,lineHeight:20,color:COLORS.muted,textAlign:'center',paddingHorizontal:42,marginTop:12,marginBottom:14},
  v40CountryContinue:{height:58,borderRadius:17,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',marginHorizontal:2,marginBottom:3},

  v40HomeScroll:{paddingHorizontal:18,paddingTop:4,paddingBottom:34,gap:18},
  v40HomeSearch:{height:54,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:15,...SHADOW},
  v40HomeSearchText:{flex:1,fontFamily:FONT.regular,fontSize:13,lineHeight:18,color:COLORS.muted},
  v40AiStrip:{minHeight:60,borderRadius:18,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12,paddingVertical:9},
  v40AiStripIcon:{width:38,height:38,borderRadius:13,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v40AiStripTitle:{fontFamily:FONT.bold,fontSize:13.5,fontWeight:'900',color:COLORS.white},
  v40AiStripBody:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:'#DADADC',marginTop:2},
  v40ServiceGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},
  v40HomeHeroBanner:{minHeight:205,borderRadius:22,backgroundColor:'#FFF3DF',overflow:'hidden',flexDirection:'row',position:'relative',borderWidth:1,borderColor:'#F3E3CB'},
  v40HomeHeroCopy:{width:'55%',padding:18,paddingRight:5,zIndex:2},
  v40HomeHeroLogo:{width:78,height:24,alignSelf:'flex-start',marginBottom:6},
  v40HomeHeroTitle:{fontFamily:FONT.bold,fontSize:22,lineHeight:25,fontWeight:'900',color:COLORS.black},
  v40HomeHeroTitleAccent:{color:COLORS.red},
  v40HomeHeroDiscount:{alignSelf:'flex-start',fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black,backgroundColor:COLORS.yellow,borderRadius:7,paddingHorizontal:8,paddingVertical:4,marginTop:7},
  v40HomeHeroBody:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:15,color:'#4E4A45',marginTop:7},
  v40HomeHeroCta:{alignSelf:'flex-start',height:34,borderRadius:10,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:7,paddingHorizontal:11,marginTop:8},
  v40HomeHeroCtaText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800',color:COLORS.red},
  v40HomeHeroVisual:{flex:1,position:'relative',justifyContent:'flex-end',alignItems:'center'},
  v40HomeHeroFree:{position:'absolute',right:8,top:10,height:28,borderRadius:10,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:8,zIndex:3},
  v40HomeHeroFreeText:{fontFamily:FONT.bold,fontSize:8.5,fontWeight:'900',color:COLORS.black},
  v40HomeHeroProductA:{position:'absolute',right:-10,bottom:4,width:126,height:150,opacity:.95},
  v40HomeHeroProductB:{position:'absolute',left:-5,bottom:4,width:88,height:105},
  v40SectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10},
  v40SectionTitle:{fontFamily:FONT.bold,fontSize:18,lineHeight:23,fontWeight:'900',color:COLORS.black},
  v40SectionSub:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.muted,marginTop:2},
  v40AccentText:{color:COLORS.red},
  v40FindsRow:{gap:9,paddingRight:8},
  v40FindCard:{width:112,minHeight:134,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:9,alignItems:'center'},
  v40FindLogo:{height:47,width:'100%',alignItems:'center',justifyContent:'center'},
  v40FindName:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800',color:COLORS.black,marginTop:5,maxWidth:'100%'},
  v40FindMeta:{fontFamily:FONT.regular,fontSize:9,lineHeight:12,color:COLORS.muted,marginTop:4},
  v40FindDelivery:{fontFamily:FONT.medium,fontSize:8.8,lineHeight:12,color:COLORS.muted,marginTop:3},
  v40FindDeliveryFree:{color:'#197842'},
  v40PopularStoreList:{borderRadius:18,borderWidth:1,borderColor:COLORS.line,overflow:'hidden',backgroundColor:COLORS.white},
  v40PopularStoreRow:{minHeight:68,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:10,paddingVertical:8,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v40PopularStoreLogo:{width:48,height:48,borderRadius:13,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  v40PopularStoreName:{fontFamily:FONT.bold,fontSize:12.5,fontWeight:'900',color:COLORS.black},
  v40PopularStoreMeta:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.muted,marginTop:3},
  v40PopularStoreRight:{maxWidth:120,alignItems:'flex-end'},
  v40PopularStoreRating:{fontFamily:FONT.bold,fontSize:10.5,fontWeight:'800',color:COLORS.black},
  v40PopularStoreDeal:{fontFamily:FONT.medium,fontSize:8.5,lineHeight:11,color:COLORS.black,backgroundColor:'#FFF4D9',borderRadius:7,paddingHorizontal:6,paddingVertical:3,marginTop:5,maxWidth:120},
  v40WeekendPanel:{minHeight:180,borderRadius:20,backgroundColor:'#FFF4E5',padding:12,flexDirection:'row',gap:8,overflow:'hidden'},
  v40WeekendLead:{width:92,justifyContent:'center'},
  v40WeekendTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:21,fontWeight:'900',color:COLORS.black},
  v40WeekendBody:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.muted,marginTop:6},
  v40WeekendCta:{height:31,borderRadius:9,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:5,marginTop:8},
  v40WeekendCtaText:{fontFamily:FONT.bold,fontSize:9.5,fontWeight:'800',color:COLORS.red},
  v40WeekendCards:{gap:8},
  v40WeekendCard:{width:118,height:154,borderRadius:14,backgroundColor:COLORS.white,padding:9,overflow:'hidden'},
  v40WeekendOffer:{fontFamily:FONT.bold,fontSize:12.5,fontWeight:'900',color:COLORS.black},
  v40WeekendRestaurant:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.black,marginTop:3},
  v40WeekendImage:{position:'absolute',left:6,right:6,bottom:6,width:106,height:86,borderRadius:10},
  v40HomeEndSpacer:{alignItems:'center',justifyContent:'center',minHeight:105,borderRadius:18,backgroundColor:COLORS.surface,marginTop:2},
  v40HomeEndLogo:{width:120,height:34},
  v40HomeEndText:{fontFamily:FONT.regular,fontSize:10.5,color:COLORS.muted,marginTop:4},

  v40WhereHeader:{height:62,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18,borderBottomWidth:1,borderBottomColor:COLORS.line,backgroundColor:COLORS.white},
  v40CircleBack:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center'},
  v40CircleBackPlaceholder:{width:40,height:40},
  v40WhereTitle:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',color:COLORS.black},
  v40WhereRouteCard:{marginHorizontal:18,marginTop:10,borderRadius:22,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,paddingHorizontal:16,paddingVertical:11,...SHADOW},
  v40WhereRouteRow:{minHeight:58,flexDirection:'row',alignItems:'center',gap:12},
  v40WherePickupDot:{width:18,height:18,borderRadius:9,backgroundColor:'#16C465',borderWidth:5,borderColor:'#D9F8E7'},
  v40WhereDestinationDot:{width:18,height:18,borderRadius:9,backgroundColor:COLORS.red,borderWidth:5,borderColor:'#FFE1DE'},
  v40WhereConnector:{position:'absolute',left:24,top:51,width:1,height:40,backgroundColor:COLORS.lineDark},
  v40WhereRouteValue:{fontFamily:FONT.bold,fontSize:15.5,lineHeight:20,fontWeight:'900',color:COLORS.black},
  v40WhereRouteLabel:{fontFamily:FONT.regular,fontSize:11,lineHeight:15,color:COLORS.muted,marginTop:2},
  v40WhereChange:{height:34,borderRadius:17,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:12,alignItems:'center',justifyContent:'center'},
  v40WhereChangeText:{fontFamily:FONT.bold,fontSize:11,fontWeight:'800',color:COLORS.black},
  v40WhereDestinationInput:{fontFamily:FONT.bold,fontSize:15.5,lineHeight:20,fontWeight:'900',color:COLORS.black,paddingVertical:2},
  v40WhereAdd:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},
  v40WhereMapWrap:{height:248,flexShrink:0,marginTop:10,position:'relative',overflow:'hidden'},
  v40WhereEtaBubble:{position:'absolute',left:'43%',top:'45%',backgroundColor:COLORS.yellow,borderRadius:15,paddingHorizontal:12,paddingVertical:7,...SHADOW},
  v40WhereEtaText:{fontFamily:FONT.bold,fontSize:12,fontWeight:'900',color:COLORS.black},
  v40WhereRouteMeta:{position:'absolute',left:14,bottom:14,backgroundColor:'rgba(255,255,255,.94)',borderRadius:12,flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:9,paddingVertical:6,maxWidth:'78%'},
  v40WhereRouteMetaText:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.black},
  v40WhereSheet:{flex:1,minHeight:300,marginTop:-16,borderTopLeftRadius:28,borderTopRightRadius:28,backgroundColor:COLORS.white,paddingHorizontal:18,paddingTop:10,paddingBottom:14,...SHADOW},
  v40WhereHandle:{width:46,height:5,borderRadius:3,backgroundColor:COLORS.lineDark,alignSelf:'center',marginBottom:12},
  v40WhereSuggestedTitle:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',color:COLORS.black,marginBottom:5},
  v40WhereSuggestionScroll:{flex:1,minHeight:170},
  v40WhereSuggestionRow:{minHeight:61,flexDirection:'row',alignItems:'center',gap:11,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v40WhereSuggestionIcon:{width:38,height:38,borderRadius:19,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  v40WhereSuggestionName:{fontFamily:FONT.bold,fontSize:13,fontWeight:'800',color:COLORS.black},
  v40WhereSuggestionAddress:{fontFamily:FONT.regular,fontSize:10.5,color:COLORS.muted,marginTop:2},
  v40WhereContinue:{height:49,borderRadius:15,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginTop:10},
  v40WhereContinueText:{fontFamily:FONT.bold,fontSize:14,fontWeight:'900',color:COLORS.white},

  v40RideHeader:{minHeight:70,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:16,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v40RideHeaderTitle:{fontFamily:FONT.bold,fontSize:20,fontWeight:'900',color:COLORS.black,textAlign:'center'},
  v40RideHeaderSub:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.muted,textAlign:'center',marginTop:2},
  v40RideScroll:{paddingHorizontal:16,paddingTop:14,paddingBottom:24,gap:11},
  v40RideList:{gap:10},
  v40RideCard:{minHeight:98,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:12,paddingVertical:10},
  v40RideCardActive:{borderColor:COLORS.red,borderWidth:1.6},
  v40RideImageWrap:{width:78,height:68,alignItems:'center',justifyContent:'center'},
  v40RideImage:{width:74,height:56},
  v40DeliveryImage:{width:58,height:58},
  v40RideNativeVehicle:{width:78,height:60,alignItems:'center',justifyContent:'center'},
  v40RideNativeVehicleComfort:{transform:[{scaleX:1.08}]},
  v40RideNativeVehicleXL:{transform:[{scaleX:1.14},{scaleY:1.05}]},
  v40RideName:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:COLORS.black},
  v40RideEta:{fontFamily:FONT.regular,fontSize:12.5,color:COLORS.muted,marginTop:3},
  v40RideDescription:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.muted,marginTop:3},
  v40RidePriceWrap:{alignItems:'flex-end',gap:10},
  v40RidePrice:{fontFamily:FONT.bold,fontSize:15.5,fontWeight:'900',color:COLORS.black},
  v40RideRadio:{width:25,height:25,borderRadius:13,borderWidth:1.5,borderColor:COLORS.lineDark,alignItems:'center',justifyContent:'center'},
  v40RideRadioActive:{borderColor:COLORS.red,borderWidth:2},
  v40RideRadioDot:{width:13,height:13,borderRadius:7,backgroundColor:COLORS.red},
  v40RideUtilityCard:{minHeight:76,borderRadius:18,borderWidth:1,borderColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:13},
  v40RideUtilityIcon:{width:52,height:52,borderRadius:14,backgroundColor:'#FFF3F1',alignItems:'center',justifyContent:'center'},
  v40RideUtilityTitle:{fontFamily:FONT.bold,fontSize:15,fontWeight:'900',color:COLORS.black},
  v40RideUtilitySub:{fontFamily:FONT.regular,fontSize:11.5,color:COLORS.muted,marginTop:3},
  v40RidePayment:{minHeight:72,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:12},
  v40RidePaymentTitle:{fontFamily:FONT.bold,fontSize:13.5,fontWeight:'800',color:COLORS.black},
  v40RidePaymentSub:{fontFamily:FONT.regular,fontSize:10.5,color:COLORS.muted,marginTop:2},
  v40RideConfirm:{height:58,borderRadius:17,backgroundColor:COLORS.red,alignItems:'center',justifyContent:'center'},
  v40RideConfirmText:{fontFamily:FONT.bold,fontSize:16,fontWeight:'900',color:COLORS.white},
  v40RideFareFooter:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:5,paddingTop:2},
  v40RideFareLabel:{fontFamily:FONT.regular,fontSize:12,color:COLORS.muted},
  v40RideFareValue:{fontFamily:FONT.bold,fontSize:18,fontWeight:'900',color:COLORS.black},
  v40RideFareNote:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.muted,textAlign:'center'},

  v40CommerceHeader:{paddingHorizontal:18,paddingTop:8,paddingBottom:7,backgroundColor:COLORS.white},
  v40CommerceTopRow:{height:42,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  v40CommerceBrandWrap:{width:142,height:38,alignItems:'flex-start',justifyContent:'center'},
  v40CommerceWordmark:{width:135,height:34},
  v40CommerceActions:{flexDirection:'row',alignItems:'center',gap:8},
  v40CommerceIconButton:{width:40,height:40,borderRadius:20,alignItems:'center',justifyContent:'center',position:'relative'},
  v40CommerceLocationRow:{minHeight:36,flexDirection:'row',alignItems:'center',gap:4},
  v40CommerceLocationPrefix:{fontFamily:FONT.regular,fontSize:12.5,color:COLORS.black},
  v40CommerceLocationText:{fontFamily:FONT.bold,fontSize:12.5,fontWeight:'900',color:COLORS.black,maxWidth:210},
  v40CommerceScroll:{paddingBottom:22,gap:14},
  v40CommerceSearch:{height:52,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:14,marginHorizontal:18},
  v40CommerceSearchInput:{flex:1,fontFamily:FONT.regular,fontSize:13,color:COLORS.black},
  v40FoodPromoRow:{gap:10,paddingHorizontal:18,paddingRight:22},
  v40FoodPromoCard:{width:210,height:118,borderRadius:18,padding:14,flexDirection:'row',alignItems:'center',overflow:'hidden'},
  v40FoodPromoEyebrow:{fontFamily:FONT.bold,fontSize:13,fontWeight:'900'},
  v40FoodPromoTitle:{fontFamily:FONT.bold,fontSize:20,lineHeight:22,fontWeight:'900',color:COLORS.black},
  v40FoodPromoBody:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:14,color:COLORS.black,marginTop:6,maxWidth:126},
  v40FoodPromoIcon:{width:54,height:54,borderRadius:18,backgroundColor:'rgba(255,255,255,.72)',alignItems:'center',justifyContent:'center'},
  v40FoodFeaturedPanel:{marginHorizontal:18,borderRadius:20,backgroundColor:'#FFF9F0',padding:13},
  v40RestaurantBrandRow:{gap:9,paddingTop:10},
  v40RestaurantBrandTile:{width:94,alignItems:'center'},
  v40RestaurantBrandLogo:{width:88,height:74,borderRadius:14,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center',paddingHorizontal:6},
  v40RestaurantBrandText:{fontFamily:FONT.bold,fontSize:12,lineHeight:14,fontWeight:'900',color:COLORS.black,textAlign:'center'},
  v40RestaurantOfferTag:{marginTop:-8,height:23,borderRadius:6,backgroundColor:'#C9FA28',flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:7},
  v40RestaurantOfferTagText:{fontFamily:FONT.bold,fontSize:8.5,fontWeight:'800',color:COLORS.black},
  v40FoodCategoryRow:{gap:14,paddingHorizontal:18},
  v40FoodCategory:{width:70,alignItems:'center'},
  v40FoodCategoryCircle:{width:64,height:64,borderRadius:32,borderWidth:1,borderColor:COLORS.line,overflow:'hidden',backgroundColor:COLORS.white},
  v40FoodCategoryCircleActive:{borderColor:COLORS.red,borderWidth:2},
  v40FoodCategoryImage:{width:'100%',height:'100%'},
  v40FoodCategoryText:{fontFamily:FONT.regular,fontSize:10.5,color:COLORS.black,textAlign:'center',marginTop:5},
  v40FoodCategoryTextActive:{fontFamily:FONT.bold,fontWeight:'800',color:COLORS.red},
  v40FilterRow:{gap:8,paddingHorizontal:18},
  v40RestaurantList:{marginHorizontal:18,gap:10},
  v40RestaurantRow:{minHeight:135,borderRadius:18,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',overflow:'hidden'},
  v40RestaurantImageWrap:{width:128,position:'relative'},
  v40RestaurantImage:{width:'100%',height:'100%'},
  v40RestaurantDiscount:{position:'absolute',left:7,bottom:7,backgroundColor:'#B9F725',borderRadius:7,paddingHorizontal:7,paddingVertical:4},
  v40RestaurantDiscountText:{fontFamily:FONT.bold,fontSize:9,fontWeight:'900',color:COLORS.black},
  v40RestaurantCopy:{flex:1,padding:11},
  v40RestaurantNameRow:{flexDirection:'row',alignItems:'center',gap:6},
  v40ProTag:{backgroundColor:'#A300FF',borderRadius:5,paddingHorizontal:5,paddingVertical:2},
  v40ProTagText:{fontFamily:FONT.bold,fontSize:8,fontWeight:'900',color:COLORS.white},
  v40RestaurantName:{flex:1,fontFamily:FONT.bold,fontSize:14.5,fontWeight:'900',color:COLORS.black},
  v40RestaurantMeta:{fontFamily:FONT.regular,fontSize:10,lineHeight:14,color:COLORS.black,marginTop:6},
  v40RestaurantReason:{alignSelf:'flex-start',backgroundColor:'#FFF4E6',borderRadius:9,paddingHorizontal:8,paddingVertical:4,marginTop:7},
  v40RestaurantReasonText:{fontFamily:FONT.regular,fontSize:9,color:COLORS.black},
  v40RestaurantCuisine:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.muted,marginTop:6},

  v40ShopCategoryRow:{gap:14,paddingHorizontal:18},
  v40ShopCategory:{width:64,alignItems:'center'},
  v40ShopCategoryCircle:{width:58,height:58,borderRadius:29,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center'},
  v40ShopCategoryCircleActive:{borderColor:COLORS.red,borderWidth:2},
  v40ShopCategoryText:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.black,textAlign:'center',marginTop:5},
  v40ShopCategoryTextActive:{fontFamily:FONT.bold,fontWeight:'800',color:COLORS.red},
  v40ShopHero:{height:190,borderRadius:20,marginHorizontal:18,padding:17,overflow:'hidden',position:'relative',flexDirection:'row'},
  v40ShopHeroCopy:{width:'58%',zIndex:2},
  v40ShopHeroTitle:{fontFamily:FONT.bold,fontSize:21,lineHeight:24,fontWeight:'900',color:COLORS.black},
  v40ShopHeroAccent:{color:'#7442D8'},
  v40ShopHeroOffer:{alignSelf:'flex-start',backgroundColor:COLORS.yellow,borderRadius:7,paddingHorizontal:8,paddingVertical:5,fontFamily:FONT.bold,fontSize:11.5,fontWeight:'900',color:COLORS.black,marginTop:8},
  v40ShopHeroBody:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:15,color:COLORS.black,marginTop:8,maxWidth:170},
  v40ShopHeroImage:{position:'absolute',right:-5,bottom:0,width:170,height:160},
  v40ShopHeroFree:{position:'absolute',right:8,top:8,height:28,borderRadius:9,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:7},
  v40ShopHeroFreeText:{fontFamily:FONT.bold,fontSize:8.5,fontWeight:'900',color:COLORS.red},
  v40PharmacyGrid:{marginHorizontal:18,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:9},
  v40PharmacyBrandCard:{width:'31.5%',height:91,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',padding:7},
  v40PharmacyBrandLogo:{height:49,width:'100%',alignItems:'center',justifyContent:'center'},
  v40PharmacyBrandEta:{fontFamily:FONT.regular,fontSize:9.5,color:COLORS.muted,marginTop:4},
  v40TopShopRow:{gap:9,paddingHorizontal:18},
  v40TopShopCard:{width:106,height:120,borderRadius:16,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:8,alignItems:'center'},
  v40TopShopLogo:{height:50,width:'100%',alignItems:'center',justifyContent:'center'},
  v40TopShopName:{fontFamily:FONT.bold,fontSize:10.5,lineHeight:13,fontWeight:'800',color:COLORS.black,textAlign:'center',marginTop:4},
  v40TopShopEta:{fontFamily:FONT.regular,fontSize:9,color:COLORS.muted,marginTop:4},
  v40BrowseTitle:{fontFamily:FONT.bold,fontSize:17,fontWeight:'900',color:COLORS.black,marginHorizontal:18},
  v40ShopList:{marginHorizontal:18,borderRadius:18,borderWidth:1,borderColor:COLORS.line,overflow:'hidden',backgroundColor:COLORS.white},
  v40ShopRow:{minHeight:91,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:10,paddingVertical:9,borderBottomWidth:1,borderBottomColor:COLORS.line},
  v40ShopRowLogo:{width:58,height:58,borderRadius:14,backgroundColor:COLORS.white,alignItems:'center',justifyContent:'center',overflow:'hidden'},
  v40ShopNameRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},
  v40ShopName:{flex:1,fontFamily:FONT.bold,fontSize:13,fontWeight:'900',color:COLORS.black},
  v40ShopRating:{fontFamily:FONT.bold,fontSize:10.5,fontWeight:'800',color:COLORS.black},
  v40ShopMeta:{fontFamily:FONT.regular,fontSize:9.5,lineHeight:13,color:COLORS.muted,marginTop:3},
  v40ShopBadges:{flexDirection:'row',alignItems:'center',gap:6,marginTop:6},
  v40ShopDeal:{maxWidth:'70%',height:25,borderRadius:8,backgroundColor:'#E8FB4A',flexDirection:'row',alignItems:'center',gap:4,paddingHorizontal:7},
  v40ShopDealText:{flexShrink:1,fontFamily:FONT.bold,fontSize:8.5,fontWeight:'800',color:COLORS.black},
  v40ShopFree:{height:24,borderRadius:8,backgroundColor:'#E8F7EC',flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:6},
  v40ShopFreeText:{fontFamily:FONT.bold,fontSize:7.5,fontWeight:'800',color:'#167A38'},
  v40ShopHeart:{width:34,height:34,alignItems:'center',justifyContent:'center'},

  v40AiRecommendations:{gap:8,marginTop:10},
  v40AiRecommendationCard:{minWidth:248,maxWidth:310,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,padding:10},
  v40AiRecommendationTop:{flexDirection:'row',alignItems:'center',gap:8},
  v40AiRecommendationTitle:{flex:1,fontFamily:FONT.bold,fontSize:12.5,fontWeight:'900',color:COLORS.black},
  v40AiRecommendationBadge:{fontFamily:FONT.bold,fontSize:8.5,fontWeight:'900',color:COLORS.red,backgroundColor:'#FFF0EE',borderRadius:8,paddingHorizontal:6,paddingVertical:3},
  v40AiRecommendationSubtitle:{fontFamily:FONT.regular,fontSize:10,color:COLORS.muted,marginTop:4},
  v40AiRecommendationReason:{fontFamily:FONT.regular,fontSize:10.5,lineHeight:15,color:COLORS.black,marginTop:6},
  v40AiRecommendationAction:{flexDirection:'row',alignItems:'center',gap:5,marginTop:8},
  v40AiRecommendationActionText:{fontFamily:FONT.bold,fontSize:10.5,fontWeight:'900',color:COLORS.red},

  v404ScheduleBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,.36)',justifyContent:'flex-end'},
  v404ScheduleSheet:{backgroundColor:COLORS.white,borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:18,paddingTop:10,paddingBottom:Platform.OS==='android'?28:20},
  v404ScheduleHandle:{width:42,height:4,borderRadius:2,backgroundColor:COLORS.lineDark,alignSelf:'center',marginBottom:14},
  v404ScheduleTitle:{...TYPE.navTitle,color:COLORS.black},
  v404ScheduleBody:{...TYPE.small,color:COLORS.muted,marginTop:4,marginBottom:12},
  v404ScheduleOption:{minHeight:68,borderTopWidth:1,borderTopColor:COLORS.line,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},
  v404ScheduleOptionActive:{backgroundColor:'#FFF8F6',marginHorizontal:-8,paddingHorizontal:8,borderRadius:14},
  v404ScheduleOptionTitle:{...TYPE.bodyStrong,color:COLORS.black},
  v404ScheduleOptionMeta:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v404ScheduledSummary:{minHeight:68,flexDirection:'row',alignItems:'center',gap:11,paddingHorizontal:14,shadowOpacity:0,backgroundColor:'#FFF8F6'},
  v404ScheduledSummaryIcon:{width:38,height:38,borderRadius:12,backgroundColor:'#FFF0EE',alignItems:'center',justifyContent:'center'},
  v404ScheduledSummaryLabel:{...TYPE.caption,color:COLORS.muted},
  v404ScheduledSummaryValue:{...TYPE.bodyStrong,color:COLORS.black,marginTop:2},

  v404ModalBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,.38)',justifyContent:'flex-end'},
  v404TopUpSheet:{backgroundColor:COLORS.white,borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:18,paddingTop:10,paddingBottom:Platform.OS==='android'?30:22},
  v404SheetHandle:{width:42,height:4,borderRadius:2,backgroundColor:COLORS.lineDark,alignSelf:'center',marginBottom:14},
  v404TopUpTitle:{...TYPE.navTitle,color:COLORS.black},
  v404TopUpBody:{...TYPE.small,color:COLORS.muted,marginTop:4,marginBottom:14},
  v404TopUpGrid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',rowGap:10},
  v404TopUpOption:{width:'48.5%',height:54,borderRadius:15,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.surface,alignItems:'center',justifyContent:'center'},
  v404TopUpOptionText:{...TYPE.bodyStrong,color:COLORS.black},
  v404TopUpCancel:{height:48,alignItems:'center',justifyContent:'center',marginTop:10},
  v404TopUpCancelText:{...TYPE.action,color:COLORS.red},
  v404PaymentSheet:{backgroundColor:COLORS.white,borderTopLeftRadius:26,borderTopRightRadius:26,paddingHorizontal:18,paddingTop:10,paddingBottom:Platform.OS==='android'?30:22},
  v404PaymentOption:{minHeight:72,borderTopWidth:1,borderTopColor:COLORS.line,flexDirection:'row',alignItems:'center',gap:12},
  v404PaymentOptionTitle:{...TYPE.bodyStrong,color:COLORS.black},
  v404PaymentOptionMeta:{...TYPE.caption,color:COLORS.muted,marginTop:2},
  v404PaymentRadio:{width:22,height:22,borderRadius:11,borderWidth:1.5,borderColor:COLORS.lineDark},

});
