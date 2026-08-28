# 6amMart V4.1 Android front-end parity matrix

This matrix maps the donor Flutter customer front-end screen files to the Kareebu Plus Expo/React Native Android routes used by the parity build. It tracks **route/front-end surface coverage**, not a claim of pixel-identical rendering or live-backend completion.

- Donor screen files reviewed: **125**
- Web-only donor screens excluded from Android scope: **2**
- Android donor screen files mapped: **123**

| Donor Flutter screen | Kareebu Plus route / flow | Coverage |
|---|---|---|
| `features/address/screens/add_address_screen.dart` | `addAddress` | Mapped to Kareebu route |
| `features/address/screens/address_screen.dart` | `addresses` | Mapped to Kareebu route |
| `features/ai_chat_bot/screens/ai_chat_bot_screen.dart` | `assistant` | Mapped to Kareebu route |
| `features/ai_chat_bot/screens/ai_chat_details_screen.dart` | `assistant` | Mapped to Kareebu route |
| `features/auth/screens/delivery_man_registration_screen.dart` | `partnerRegistration` | Mapped to Kareebu route |
| `features/auth/screens/new_user_setup_screen.dart` | `profile` | Mapped to Kareebu route |
| `features/auth/screens/rider_registration_screen.dart` | `partnerRegistration` | Mapped to Kareebu route |
| `features/auth/screens/sign_in_screen.dart` | `signIn` | Mapped to Kareebu route |
| `features/auth/screens/sign_up_screen.dart` | `signUp` | Mapped to Kareebu route |
| `features/auth/screens/store_registration_screen.dart` | `partnerRegistration` | Mapped to Kareebu route |
| `features/auth/widgets/verification_new/forget_pass_new_screen.dart` | `forgotPassword` | Mapped to Kareebu route |
| `features/auth/widgets/verification_new/new_pass_new_screen.dart` | `resetPassword` | Mapped to Kareebu route |
| `features/auth/widgets/verification_new/verification_new_screen.dart` | `verification` | Mapped to Kareebu route |
| `features/brands/screens/brands_product_screen.dart` | `brandItems` | Mapped to Kareebu route |
| `features/brands/screens/brands_screen.dart` | `brands` | Mapped to Kareebu route |
| `features/business/screens/subscription_payment_screen.dart` | `subscriptionPlans → paymentMethods` | Mapped to Kareebu route |
| `features/business/screens/subscription_success_or_failed_screen.dart` | `subscriptionResult / paymentFailed` | Mapped to Kareebu route |
| `features/cart/screens/cart_screen.dart` | `cart / commerceCart` | Mapped to Kareebu route |
| `features/cart/screens/global_cart_screen.dart` | `globalCart` | Mapped to Kareebu route |
| `features/category/screens/category_item_screen.dart` | `categoryItems` | Mapped to Kareebu route |
| `features/category/screens/category_screen.dart` | `categories` | Mapped to Kareebu route |
| `features/chat/screens/chat_screen.dart` | `chat` | Mapped to Kareebu route |
| `features/chat/screens/conversation_screen.dart` | `messages` | Mapped to Kareebu route |
| `features/checkout/screens/checkout_screen.dart` | `foodCheckout / commerceCheckout` | Mapped to Kareebu route |
| `features/checkout/screens/digital_payment_failed_screen.dart` | `paymentFailed` | Mapped to Kareebu route |
| `features/checkout/screens/order_successful_screen.dart` | `foodOrderSuccess / commerceOrderSuccess` | Mapped to Kareebu route |
| `features/coupon/screens/coupon_screen.dart` | `coupons` | Mapped to Kareebu route |
| `features/dashboard/screens/dashboard_screen.dart` | `home` | Mapped to Kareebu route |
| `features/favourite/screens/favourite_screen.dart` | `favourites` | Mapped to Kareebu route |
| `features/flash_sale/screens/flash_sale_details_screen.dart` | `flashSale` | Mapped to Kareebu route |
| `features/home/screens/home_screen.dart` | `home` | Mapped to Kareebu route |
| `features/home/screens/web_new_home_screen.dart` | `EXCLUDED — web only` | Excluded (Android scope) |
| `features/html/screens/html_viewer_screen.dart` | `legal` | Mapped to Kareebu route |
| `features/interest/screens/interest_screen.dart` | `interests` | Mapped to Kareebu route |
| `features/item/screens/item_campaign_screen.dart` | `campaignDetails` | Mapped to Kareebu route |
| `features/item/screens/item_view_all_screen.dart` | `itemViewAll` | Mapped to Kareebu route |
| `features/item/screens/popular_item_screen.dart` | `itemViewAll` | Mapped to Kareebu route |
| `features/language/screens/language_new_screen.dart` | `language` | Mapped to Kareebu route |
| `features/language/screens/web_language_screen.dart` | `EXCLUDED — web only` | Excluded (Android scope) |
| `features/location/screens/access_location_screen.dart` | `location` | Mapped to Kareebu route |
| `features/location/screens/map_screen.dart` | `locationPicker` | Mapped to Kareebu route |
| `features/location/screens/pick_location_screen.dart` | `locationPicker` | Mapped to Kareebu route |
| `features/location/screens/pick_map_screen.dart` | `locationPicker` | Mapped to Kareebu route |
| `features/loyalty/screens/loyalty_screen.dart` | `rewards` | Mapped to Kareebu route |
| `features/menu/screens/menu_screen.dart` | `account` | Mapped to Kareebu route |
| `features/notification/screens/notification_screen.dart` | `notifications` | Mapped to Kareebu route |
| `features/offer/offer_screen.dart` | `offers` | Mapped to Kareebu route |
| `features/onboard/screens/onboarding_new_screen.dart` | `welcome` | Mapped to Kareebu route |
| `features/order/screens/guest_track_order_screen.dart` | `guestTrackOrder` | Mapped to Kareebu route |
| `features/order/screens/my_items_detail_screen.dart` | `orderDetails` | Mapped to Kareebu route |
| `features/order/screens/my_items_screen.dart` | `myItems` | Mapped to Kareebu route |
| `features/order/screens/my_order_screen.dart` | `orders` | Mapped to Kareebu route |
| `features/order/screens/order_details_new_screen.dart` | `orderDetails` | Mapped to Kareebu route |
| `features/order/screens/order_screen.dart` | `orders` | Mapped to Kareebu route |
| `features/order/screens/order_tracking_screen.dart` | `orderTracking` | Mapped to Kareebu route |
| `features/order/screens/refund_request_screen.dart` | `refunds` | Mapped to Kareebu route |
| `features/parcel/screens/parcel_category_screen.dart` | `categories` | Mapped to Kareebu route |
| `features/parcel/screens/parcel_location_screen.dart` | `parcelContacts` | Mapped to Kareebu route |
| `features/parcel/screens/parcel_request_screen.dart` | `parcelReview` | Mapped to Kareebu route |
| `features/payment/screens/offline_payment_screen.dart` | `offlinePayment` | Mapped to Kareebu route |
| `features/payment/screens/payment_screen.dart` | `paymentMethods` | Mapped to Kareebu route |
| `features/payment/screens/payment_webview_screen.dart` | `paymentProcessing` | Mapped to Kareebu route |
| `features/pro/screens/subscription_plan_screen.dart` | `subscriptionPlans` | Mapped to Kareebu route |
| `features/profile/screens/profile_screen.dart` | `account` | Mapped to Kareebu route |
| `features/profile/screens/update_profile_screen.dart` | `account` | Mapped to Kareebu route |
| `features/redesign_feature/dashboard/screens/main_screen.dart` | `home` | Mapped to Kareebu route |
| `features/redesign_feature/dashboard/widgets/common_widget/item_details_new_screen.dart` | `commerceProduct / foodItem` | Mapped to Kareebu route |
| `features/redesign_feature/food/screens/food_module_screen.dart` | `food` | Mapped to Kareebu route |
| `features/redesign_feature/grocery/screens/create_list_screen.dart` | `groceryList` | Mapped to Kareebu route |
| `features/redesign_feature/grocery/screens/grocery_module_screen.dart` | `shops (Groceries)` | Mapped to Kareebu route |
| `features/redesign_feature/home/screens/all_stores_screen.dart` | `allStores` | Mapped to Kareebu route |
| `features/redesign_feature/home/screens/home_new_screen.dart` | `home` | Mapped to Kareebu route |
| `features/redesign_feature/home/screens/preference_screen.dart` | `interests` | Mapped to Kareebu route |
| `features/redesign_feature/parcel/screens/parcel_category_screen.dart` | `categories` | Mapped to Kareebu route |
| `features/redesign_feature/parcel/screens/parcel_module_screen.dart` | `parcel` | Mapped to Kareebu route |
| `features/redesign_feature/pharmacy/screens/pharmacy_module_screen.dart` | `shops (Pharmacy) / medicineList` | Mapped to Kareebu route |
| `features/redesign_feature/shop/screens/shop_module_screen.dart` | `shops` | Mapped to Kareebu route |
| `features/reels/screens/reels_screen.dart` | `reels` | Mapped to Kareebu route |
| `features/refer_and_earn/screens/refer_and_earn_screen.dart` | `referral` | Mapped to Kareebu route |
| `features/rental_module/home/screens/rental_module_screen.dart` | `rentals` | Mapped to Kareebu route |
| `features/rental_module/home/screens/taxi_home_screen.dart` | `home` | Mapped to Kareebu route |
| `features/rental_module/rental_cart_screen/rental_cart_screen.dart` | `cart / commerceCart` | Mapped to Kareebu route |
| `features/rental_module/rental_cart_screen/taxi_cart_screen.dart` | `cart / commerceCart` | Mapped to Kareebu route |
| `features/rental_module/rental_checkout_screen/taxi_checkout_screen.dart` | `foodCheckout / commerceCheckout` | Mapped to Kareebu route |
| `features/rental_module/rental_favourite/screens/vehicle_favourite_screen.dart` | `favourites` | Mapped to Kareebu route |
| `features/rental_module/rental_order/screens/taxi_order_details_screen.dart` | `rentalTrip` | Mapped to Kareebu route |
| `features/rental_module/rental_order/screens/taxi_order_screen.dart` | `orders` | Mapped to Kareebu route |
| `features/rental_module/vehicle_details_screen/rental_vehicle_details_screen.dart` | `rentalVehicle` | Mapped to Kareebu route |
| `features/rental_module/vehicle_details_screen/vehicle_details_screen.dart` | `rentalVehicle` | Mapped to Kareebu route |
| `features/rental_module/vendor/screens/provider_detail_screen.dart` | `providerProfile` | Mapped to Kareebu route |
| `features/review/screens/rate_review_screen.dart` | `reviews` | Mapped to Kareebu route |
| `features/review/screens/review_screen.dart` | `reviews` | Mapped to Kareebu route |
| `features/ride_share_module/offer/screens/offer_screen.dart` | `rideOffers` | Mapped to Kareebu route |
| `features/ride_share_module/ride_home/screens/biding_list_screen.dart` | `rideFareBids` | Mapped to Kareebu route |
| `features/ride_share_module/ride_home/screens/ride_home_screen.dart` | `home` | Mapped to Kareebu route |
| `features/ride_share_module/ride_location/screens/map_screen.dart` | `whereTo / chooseRide` | Mapped to Kareebu route |
| `features/ride_share_module/ride_order/screens/ride_order_complete_screen.dart` | `tripComplete` | Mapped to Kareebu route |
| `features/ride_share_module/ride_payment/screens/ride_payment_screen.dart` | `ridePayment` | Mapped to Kareebu route |
| `features/ride_share_module/safety_alert/screens/safety_policy_screen.dart` | `rideSafety` | Mapped to Kareebu route |
| `features/search/screens/search_new_filter_screen.dart` | `searchFilters` | Mapped to Kareebu route |
| `features/search/screens/search_screen.dart` | `search` | Mapped to Kareebu route |
| `features/service_module/custom_service_request/screens/custom_service_details_screen.dart` | `serviceTracking` | Mapped to Kareebu route |
| `features/service_module/custom_service_request/screens/custom_service_list_screen.dart` | `orders / serviceTracking` | Mapped to Kareebu route |
| `features/service_module/custom_service_request/screens/custom_service_request_screen.dart` | `serviceRequest` | Mapped to Kareebu route |
| `features/service_module/provider_details/screens/provider_details_screen.dart` | `providerProfile / serviceDetail` | Mapped to Kareebu route |
| `features/service_module/request_service/screens/new_service_request_screen.dart` | `serviceRequest` | Mapped to Kareebu route |
| `features/service_module/request_service/screens/requested_service_screen.dart` | `serviceTracking` | Mapped to Kareebu route |
| `features/service_module/service_category_screen/screens/service_category_screen.dart` | `categories` | Mapped to Kareebu route |
| `features/service_module/service_checkout/screens/service_checkout_screen.dart` | `foodCheckout / commerceCheckout` | Mapped to Kareebu route |
| `features/service_module/service_checkout/widgets/custom_booking_picker_screen.dart` | `serviceRequest` | Mapped to Kareebu route |
| `features/service_module/service_details/screens/service_details_screen.dart` | `serviceDetail` | Mapped to Kareebu route |
| `features/service_module/service_home/screens/service_screen.dart` | `serviceMarketplace` | Mapped to Kareebu route |
| `features/service_module/service_home/screens/service_verified_providers_list_screen.dart` | `serviceProviders` | Mapped to Kareebu route |
| `features/splash/screens/qr_screen.dart` | `qr` | Mapped to Kareebu route |
| `features/splash/screens/splash_screen.dart` | `splash` | Mapped to Kareebu route |
| `features/store/screens/all_store_screen.dart` | `allStores` | Mapped to Kareebu route |
| `features/store/screens/campaign_screen.dart` | `campaigns / campaignDetails` | Mapped to Kareebu route |
| `features/store/screens/store_item_search_screen.dart` | `search` | Mapped to Kareebu route |
| `features/store/screens/store_screen.dart` | `shop / restaurant` | Mapped to Kareebu route |
| `features/support/screens/support_screen.dart` | `support` | Mapped to Kareebu route |
| `features/update/screens/update_screen.dart` | `updateApp` | Mapped to Kareebu route |
| `features/verification/screens/forget_pass_screen.dart` | `forgotPassword` | Mapped to Kareebu route |
| `features/verification/screens/new_pass_screen.dart` | `resetPassword` | Mapped to Kareebu route |
| `features/verification/screens/verification_screen.dart` | `verification` | Mapped to Kareebu route |
| `features/wallet/screens/wallet_screen.dart` | `wallet` | Mapped to Kareebu route |

## Completion rule

A mapped route is only the front-end coverage layer. Full parity still requires emulator QA for layout, controls, state transitions, loading/empty/error states, and the eventual live Kareebu backend integration.
