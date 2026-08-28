# Kareebu+ Customer Parity V2

Careem donor deep links inventoried: **260** across **42** hosts.

## Implemented customer surfaces

### Home
- stories rail
- global search
- services discovery
- offers
- top picks

### Food
- discovery
- restaurant and dish search
- filters and sort
- category listings
- restaurant menu search
- item customisation
- cart
- checkout
- order tracking
- schedule entry

### Rides
- compact rides home
- where-to handoff
- schedule
- business profile
- settings
- school rides
- booking flow
- driver/on-trip/safety/rating

### Pay
- send
- request
- top up
- bills
- mobile recharge
- gift cards
- remittance entry
- transactions
- manage accounts
- KYC entry

### Kareebu+
- membership entry
- savings
- manage membership

### Explore
- explore hub
- location detail
- stories

### Account
- compact account hub
- privacy
- activity
- payments
- support shortcuts

### Shops
- storefront help entry
- existing commerce product/cart/checkout

### Support
- support inbox
- issue submission
- ticket persistence in app state

### Cross-service
- order anything
- donations/For Good
- deep-link resolver
- global service search

## Donor route families

- `pay.careem.com` — 41 recovered deep links
- `care.careem.com` — 30 recovered deep links
- `discovery.careem.com` — 28 recovered deep links
- `explore.careem.com` — 26 recovered deep links
- `home.careem.com` — 21 recovered deep links
- `ridehailing.careem.com` — 14 recovered deep links
- `identity.careem.com` — 13 recovered deep links
- `subscription.careem.com` — 10 recovered deep links
- `donations.careem.com` — 9 recovered deep links
- `food.careem.com` — 9 recovered deep links
- `shops.careem.com` — 8 recovered deep links
- `now.careem.com` — 7 recovered deep links
- `quik.careem.com` — 5 recovered deep links
- `app.careem.com` — 4 recovered deep links
- `rides.careem.com` — 4 recovered deep links
- `kyc.careem.com` — 3 recovered deep links
- `justmop.partner.careem.com` — 2 recovered deep links
- `orderanything.careem.com` — 2 recovered deep links
- `activities.careem.com` — 1 recovered deep links
- `bike.careem.com` — 1 recovered deep links
- `bookaride` — 1 recovered deep links
- `bookaride?action=setPickup&pickup=my_location&promo_code=` — 1 recovered deep links
- `c4b.careem.com` — 1 recovered deep links
- `cct-selection` — 1 recovered deep links
- `chat.careem.com` — 1 recovered deep links
- `com.careem.identity` — 1 recovered deep links
- `consents.identity.careem.com` — 1 recovered deep links
- `deletion.account.identity.careem.com` — 1 recovered deep links
- `gmm-bookaride` — 1 recovered deep links
- `homecleaning.justmop.partner.careem.com` — 1 recovered deep links
- `intercity` — 1 recovered deep links
- `marketing.consents.identity.careem.com` — 1 recovered deep links
- `now` — 1 recovered deep links
- `pcr.justmop.partner.careem.com` — 1 recovered deep links
- `quik` — 1 recovered deep links
- `rides.careem.com?service_provider=autocab` — 1 recovered deep links
- `salon.justmop.partner.careem.com` — 1 recovered deep links
- `service.careem.com` — 1 recovered deep links
- `swapp.partner.careem.com` — 1 recovered deep links
- `tikety.partner.careem.com` — 1 recovered deep links
- `wallet` — 1 recovered deep links
- `washmen.partner.careem.com` — 1 recovered deep links

## Backend boundary

- No Careem private API is called by Kareebu runtime code.
- Live money movement, KYC, remittance, dispatch, merchant catalogues, support ticket APIs and membership billing must be implemented against Kareebu-owned services.
- The reconstructed layer covers customer UX, navigation, state transitions and client-side flow behaviour.
