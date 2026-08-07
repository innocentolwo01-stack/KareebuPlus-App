# Kareebu+ Premium v2.1

A standalone Expo / React Native customer super app for Uganda and East Africa. This build is rebuilt around the approved premium Kareebu+ visual language and a complete local end-to-end customer journey.

## Included customer journeys

- Branded native splash and in-app splash
- Welcome and guest browsing
- Country/city selection
- Phone sign-in and six-digit OTP entry
- Profile setup and permission choices
- Premium Home with eight services, Kareebu Black promotion and recent activity
- Ride flow: destination → ride choice → payment confirmation → driver arrival → live trip → receipt → rating and tip
- Food: discovery → restaurant → cart → order tracking
- Shops and groceries
- Parcel sending within Kampala or across Uganda
- Wallet and payment-method selection
- Signed-in and guest account states
- Activity and orders

## Run as the Kareebu+ app, not Expo Go

```bash
npm install
npx expo install --fix
npm run validate
npm run typecheck
npx expo run:android
```

After the first native installation:

```bash
npm start
```

Press `a` to open the installed Kareebu+ development client.

## Local prototype behaviour

All screens, selections, forms and customer journeys work locally. Live SMS OTP, payment charging, real maps, merchant inventory, live driver dispatch and production accounts require backend/API credentials and are deliberately represented with safe demo data in this build.
