import { useCallback, useMemo, useRef, useState } from 'react';
import type { PlaceSelection } from '../../places/types';
import type { VehicleMode } from '../../ride/vehicle';
import type { RideId, Screen } from '../../types';
import type { AppActions, AppData, PaymentMethod } from './types';

export type KareebuAppState = {
  screen: Screen;
  data: AppData;
  actions: AppActions;
};

export function useKareebuAppState(): KareebuAppState {
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
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('mtn');
  const [walletBalance, setWalletBalance] = useState(52000);
  const [scheduledTrip, setScheduledTrip] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(1000);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('cafe-javas');
  const [selectedShopId, setSelectedShopId] = useState('goodlife');
  const [shopCategoryPreset, setShopCategoryPreset] = useState('All');
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    'javas-breakfast': 1,
    'javas-chicken-sandwich': 1,
  });
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(['cafe-javas']);
  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>(['goodlife']);
  const currentScreenRef = useRef<Screen>('splash');

  const navigate = useCallback((next: Screen) => {
    if (currentScreenRef.current === next) return;
    currentScreenRef.current = next;
    setScreen(next);
  }, []);

  const data = useMemo<AppData>(
    () => ({
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
    }),
    [
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
    ],
  );

  const actions = useMemo<AppActions>(
    () => ({
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
      selectRestaurant: (restaurantId: string) =>
        setSelectedRestaurantId((current) => {
          if (current !== restaurantId) setCartQuantities({});
          return restaurantId;
        }),
      selectShop: setSelectedShopId,
      setShopCategoryPreset,
      setCartItemQuantity: (itemId: string, quantity: number) =>
        setCartQuantities((current) => {
          const next = { ...current };
          if (quantity <= 0) delete next[itemId];
          else next[itemId] = quantity;
          return next;
        }),
      toggleFavoriteRestaurant: (restaurantId: string) =>
        setFavoriteRestaurantIds((current) =>
          current.includes(restaurantId)
            ? current.filter((id) => id !== restaurantId)
            : [...current, restaurantId],
        ),
      toggleFavoriteShop: (shopId: string) =>
        setFavoriteShopIds((current) =>
          current.includes(shopId) ? current.filter((id) => id !== shopId) : [...current, shopId],
        ),
    }),
    [navigate],
  );

  return { screen, data, actions };
}
