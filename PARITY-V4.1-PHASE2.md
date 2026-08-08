# Kareebu Plus — 6amMart V4.1 parity phase 2

This phase extends the working Food parity build across the remaining customer-facing Android modules while keeping Kareebu branding and the Expo/React Native/TypeScript codebase.

## Implemented user journeys

### Grocery / Shops / Pharmacy
Storefront → product → variant → quantity/note → basket → delivery/pickup → address → schedule → delivery instruction → coupon → mobile money/card/cash → order confirmation → Orders.

Prescription-only pharmacy requests include a prescription gate before the item can be added.

### Parcels / Kareebu Send
Parcel type → city/country mode → pickup/drop-off → weight → estimate → sender/receiver → instructions → payment → confirmation → parcel tracking → courier contact.

### Rides / Boda
Ride choice → nearby driver fare offers → selected offer changes the confirmation price and matched driver → payment → driver arrival → pickup code → safety toolkit → trip → completion/rating.

### Vehicle rental
Rental discovery/filtering → vehicle details → pickup slot → rental duration → deposit/total → confirmation → trip/booking management → provider contact.

### Local services
Service discovery → provider selection or custom request → address/schedule/job description/budget → provider bids → checkout → booking → status tracking → provider chat.

### Wallet / rewards / engagement
Rewards redemption, coupons, refer & earn, notifications, messages/chat, Discover/Reels, Kareebu Black membership, favourites, support, settings, edit profile, refunds and reviews.

### Unified Orders
The Orders surface now aggregates recent Food, store/commerce, parcel, rental and service activity and links into the appropriate tracking/review/refund flows.

## Validation

Run:

```bash
npm run validate
npm run validate:food
npm run validate:parity
npm run typecheck
git diff --check
```

Then test locally on Android with:

```bash
npx expo run:android
```

## Backend status

This phase implements the on-device UI/state/navigation and flow semantics. It does not claim production parity with the 6amMart server yet. Live catalogue inventory, real order dispatch, real payments, courier/driver matching, chat transport, push notifications, refund processing, vendor fulfilment and persistence across reinstalls still need to be connected through Kareebu's backend/API adapters.

A module is not production-complete until its live backend path and Android smoke test also pass.
