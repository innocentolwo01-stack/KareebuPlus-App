import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { AppActions, AppData, renderScreen } from './src/screens';
import { RideId, Screen } from './src/types';
import { VehicleMode } from './src/ride/vehicle';
import { PlaceSelection } from './src/places/types';
import * as NativeSplashScreen from 'expo-splash-screen';

// Keep the native launch layer in place until the first React Native splash
// frame has actually been laid out. This prevents a white/blank flash between
// Android's system splash and the exact branded in-app splash.
NativeSplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  // The native launch screen is intentionally minimal on Android. The exact
  // branded splash lives in React Native so it is identical across devices.
  const [screen, setScreen] = useState<Screen>('splash');
  const [guest, setGuest] = useState(false);
  const [authReturn, setAuthReturn] = useState<Screen>('home');
  const [locationReturn, setLocationReturn] = useState<Screen>('home');
  const [country, setCountry] = useState('Uganda');
  const [city, setCity] = useState('Kampala');
  const [phone, setPhone] = useState('7 123 456 789');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('John Ssekandi');
  const [email, setEmail] = useState('john.ssekandi@gmail.com');
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);
  const [destinationPlace, setDestinationPlace] = useState<PlaceSelection | null>(null);
  const [deliveryPlace, setDeliveryPlace] = useState<PlaceSelection | null>(null);
  const [focusedPlace, setFocusedPlace] = useState<PlaceSelection | null>(null);
  const [selectedVehicleMode, setSelectedVehicleMode] = useState<VehicleMode>('BODA');
  const [selectedRide, setSelectedRide] = useState<RideId>('boda');
  const [selectedPayment, setSelectedPayment] = useState<'mtn' | 'airtel' | 'visa'>('mtn');
  const [walletBalance, setWalletBalance] = useState(52000);
  const [scheduledTrip, setScheduledTrip] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(1000);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('cafe-javas');
  const [selectedShopId, setSelectedShopId] = useState('goodlife');
  const [shopCategoryPreset, setShopCategoryPreset] = useState('All');
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({ 'javas-breakfast': 1, 'javas-chicken-sandwich': 1 });
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['cafe-javas']);
  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>(['goodlife']);
  const currentScreenRef = useRef<Screen>('splash');
  const nativeSplashHiddenRef = useRef(false);

  // One synchronous navigation path. Removing the app-wide Animated wrapper
  // eliminates the blank/faded frame that was visible between onboarding
  // steps on slower Android emulators and prevents stale transition callbacks.
  const navigate = useCallback((next: Screen) => {
    if (currentScreenRef.current === next) return;
    currentScreenRef.current = next;
    setScreen(next);
  }, []);

  const data: AppData = useMemo(() => ({
    guest,
    authReturn,
    locationReturn,
    country,
    city,
    phone,
    otp,
    fullName,
    email,
    locationAllowed,
    notificationsAllowed,
    destinationPlace,
    deliveryPlace,
    focusedPlace,
    selectedVehicleMode,
    selectedRide,
    selectedPayment,
    walletBalance,
    scheduledTrip,
    rating,
    tip,
    selectedRestaurantId,
    selectedShopId,
    shopCategoryPreset,
    cartQuantities,
    favoriteRestaurantIds,
    favoriteShopIds,
  }), [guest, authReturn, locationReturn, country, city, phone, otp, fullName, email, locationAllowed, notificationsAllowed, destinationPlace, deliveryPlace, focusedPlace, selectedVehicleMode, selectedRide, selectedPayment, walletBalance, scheduledTrip, rating, tip, selectedRestaurantId, selectedShopId, shopCategoryPreset, cartQuantities, favoriteRestaurantIds, favoriteShopIds]);

  const actions: AppActions = useMemo(() => ({
    go: navigate,
    setGuest,
    setAuthReturn,
    setLocationReturn,
    setCountry,
    setCity,
    setPhone,
    setOtp,
    setFullName,
    setEmail,
    setLocationAllowed,
    setNotificationsAllowed,
    setDestinationPlace,
    setDeliveryPlace,
    setFocusedPlace,
    setSelectedVehicleMode,
    setSelectedRide,
    setSelectedPayment,
    setWalletBalance,
    setScheduledTrip,
    setRating,
    setTip,
    selectRestaurant: (restaurantId: string) => setSelectedRestaurantId((current) => {
      if (current !== restaurantId) setCartQuantities({});
      return restaurantId;
    }),
    selectShop: setSelectedShopId,
    setShopCategoryPreset,
    setCartItemQuantity: (itemId: string, quantity: number) => setCartQuantities((current) => {
      const next = { ...current };
      if (quantity <= 0) delete next[itemId]; else next[itemId] = quantity;
      return next;
    }),
    toggleFavoriteRestaurant: (restaurantId: string) => setFavoriteRestaurantIds((current) => current.includes(restaurantId) ? current.filter((id) => id !== restaurantId) : [...current, restaurantId]),
    toggleFavoriteShop: (shopId: string) => setFavoriteShopIds((current) => current.includes(shopId) ? current.filter((id) => id !== shopId) : [...current, shopId]),
  }), [navigate]);

  const onRootLayout = useCallback(() => {
    if (nativeSplashHiddenRef.current) return;
    nativeSplashHiddenRef.current = true;
    NativeSplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <View
      onLayout={onRootLayout}
      style={{ flex: 1, backgroundColor: screen === 'splash' ? '#030303' : '#FFFFFF' }}
    >
      {renderScreen(screen, data, actions)}
    </View>
  );
}
