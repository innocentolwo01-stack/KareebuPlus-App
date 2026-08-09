# CabBook driver APK → Kareebu Mobility integration

Source inspected: `cabbook_driver.apk` supplied by the user.

## What was recovered from the APK

The Flutter AOT image contains driver-side ride semantics for:

- online/offline duty state (`Go online to start accepting jobs`)
- ride requests and request updates
- accept / reject ride
- ride accepted / rejected / cancelled
- on-the-way / arriving / ongoing / completed ride states
- Ride OTP and `beginRide`
- scheduled rides
- ride history / ride summary
- ratings summary
- live driver location fields
- ride + intercity + courier service preference
- delivery request accept/reject
- wallet balance, transactions, earnings and payout
- earnings insight filters (today/week/month/year)
- support and FAQ
- language selection

The bundled `sample_rides.json` also exposes the shared data shape for ride/courier jobs: pickup/destination coordinates, estimated/final distance and time, estimated/final fares, schedule, cancellation reason, vehicle type, customer, driver, payment and driver live location.

## API semantics retained as a provider-neutral compatibility map

No CabBook host, token, secret or branding is copied. Kareebu keeps only the API *shape* as an implementation reference:

- `api/ride/rides`
- `api/ride/drivers/`
- `api/ride/drivers/ratings/summary/`
- `api/ride/vehicle-types`
- `api/delivery`
- `api/delivery/request/`
- `api/user/wallet/balance`
- `api/user/wallet/earnings`
- `api/user/wallet/transactions`
- `api/user/wallet/payout`
- `api/user/push-notification`
- `api/support`
- `api/faq`

## Passenger-side integration

Kareebu Plus now models the same driver lifecycle:

`requested → accepted → on_way → arrived → otp_required → ongoing → complete`

with explicit `rejected` and `cancelled` terminal states.

For emulator testing, accepted/on-way/arrived changes are locally simulated. In production those transitions must come from Kareebu Captain through the realtime backend.

## Shared Captain job contract

The driver donor supports `ride`, `intercity` and `courier`. Kareebu should therefore keep one dispatch substrate that can carry:

- passenger Ride/Boda jobs
- intercity passenger jobs
- parcel/courier jobs
- food/shop delivery jobs

The customer UX remains different per job type; only dispatch, Captain identity, availability, GPS and status infrastructure are shared.
