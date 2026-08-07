import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { AppActions, AppData, renderScreen } from './src/screens';
import { RideId, Screen } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [guest, setGuest] = useState(false);
  const [authReturn, setAuthReturn] = useState<Screen>('home');
  const [city, setCity] = useState('Kampala');
  const [phone, setPhone] = useState('7 123 456 789');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('John Ssekandi');
  const [email, setEmail] = useState('john.ssekandi@gmail.com');
  const [locationAllowed, setLocationAllowed] = useState(true);
  const [notificationsAllowed, setNotificationsAllowed] = useState(true);
  const [selectedRide, setSelectedRide] = useState<RideId>('boda');
  const [selectedPayment, setSelectedPayment] = useState<'mtn' | 'airtel' | 'visa'>('mtn');
  const [rating, setRating] = useState(5);
  const [tip, setTip] = useState(1000);
  const transition = useRef(new Animated.Value(1)).current;

  const navigate = (next: Screen) => {
    transition.setValue(0);
    setScreen(next);
    Animated.timing(transition, {
      toValue: 1,
      duration: 230,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (screen !== 'splash') return;
    const timer = setTimeout(() => navigate('welcome'), 1650);
    return () => clearTimeout(timer);
  }, [screen]);

  const data: AppData = useMemo(() => ({
    guest,
    authReturn,
    city,
    phone,
    otp,
    fullName,
    email,
    locationAllowed,
    notificationsAllowed,
    selectedRide,
    selectedPayment,
    rating,
    tip,
  }), [guest, authReturn, city, phone, otp, fullName, email, locationAllowed, notificationsAllowed, selectedRide, selectedPayment, rating, tip]);

  const actions: AppActions = useMemo(() => ({
    go: navigate,
    setGuest,
    setAuthReturn,
    setCity,
    setPhone,
    setOtp,
    setFullName,
    setEmail,
    setLocationAllowed,
    setNotificationsAllowed,
    setSelectedRide,
    setSelectedPayment,
    setRating,
    setTip,
  }), []);

  const translateX = transition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Animated.View style={{ flex: 1, opacity: transition, transform: [{ translateX }] }}>
        {renderScreen(screen, data, actions)}
      </Animated.View>
    </View>
  );
}
