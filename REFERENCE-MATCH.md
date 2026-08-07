# Reference-match specification

The supplied Kareebu+ mockups are treated as the visual source of truth.

## Native screen mapping

1. `SplashScreen` — black Kareebu+ branding, centred mark, tagline, Uganda-colour ribbons.
2. `WelcomeScreen` — large Kareebu+ heading, approved woman illustration, four services, Get started and Continue as guest.
3. `LocationScreen` — Uganda selector and Kampala, Entebbe, Jinja, Mbarara and Gulu list.
4. `PhoneScreen` — +256 phone verification layout.
5. `OtpScreen` — six individual OTP fields and resend timer.
6. `ProfileScreen` — profile photo placeholder, name and optional email.
7. `PermissionsScreen` — location, notifications and native Home preview.
8. `HomeScreen` — compact 2×4 services, Kareebu Black, recent activity, food and shops.
9. `WhereToScreen` — pickup/destination card, Kampala route map and suggested places.
10. `ChooseRideScreen` — Boda, Economy, Comfort, XL, Delivery and Scheduled.
11. `ConfirmBookingScreen` — payment selection and fare breakdown.
12. `DriverScreen` — driver ETA, route map, driver identity and communication controls.
13. `OnTripScreen` — route map, destination, trip data, safety and End trip.
14. `TripCompleteScreen` and `RateTripScreen` — receipt, rating and tip.
15. `FoodScreen` — categories, promotion and restaurant cards.
16. `RestaurantScreen`, `CartScreen`, `OrderTrackingScreen` — complete food-order journey.
17. `ShopsScreen` — delivery address, categories, promotion and stores.
18. `ParcelScreen` — city/across-Uganda modes, pickup, drop-off, parcel and payment.
19. `WalletScreen` — Kareebu+ Wallet, money actions and payment methods.
20. `AccountScreen` — signed-in and guest account states.

## Implementation rule

No complete phone screenshot is rendered as an app screen. The UI is composed with React Native views, text, inputs, lists, buttons and navigation. Cropped visual assets are limited to illustrations, marketing banners, food imagery and map artwork.
