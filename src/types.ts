export type Screen =
  | 'splash'
  | 'welcome'
  | 'location'
  | 'phone'
  | 'otp'
  | 'profile'
  | 'permissions'
  | 'home'
  | 'whereTo'
  | 'chooseRide'
  | 'confirmBooking'
  | 'driver'
  | 'onTrip'
  | 'tripComplete'
  | 'rateTrip'
  | 'food'
  | 'restaurant'
  | 'cart'
  | 'orderTracking'
  | 'shops'
  | 'parcel'
  | 'wallet'
  | 'account'
  | 'activity'
  | 'orders';

export type BottomTab = 'home' | 'activity' | 'orders' | 'wallet' | 'account';
export type RideId = 'boda' | 'economy' | 'comfort' | 'xl' | 'delivery';
