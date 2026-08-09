# Kareebu Plus — Ride / Mobility parity

This layer turns Rides into a first-class subsystem in Kareebu Plus rather than a single taxi button.

## Customer journey

- Kareebu Mobility home
- Ride / Boda mode
- destination and route selection
- vehicle class selection
- Captain fare offers / bidding
- transparent fare breakdown
- priority matching
- mobile-money/card payment handoff
- Captain profile and vehicle details
- pickup PIN
- live-trip UI
- safety toolkit
- completion, receipt, rating and ride history

## Kareebu additions beyond donor parity

- scheduled ride product
- recurring work ride setup
- safeguarded school-run setup
- explicit priority matching
- Kareebu Black fare saving line
- persisted ride receipt model

## System boundary

The current UI uses local demo Captain offers and the existing animated map data. The data model is intentionally structured so live dispatch can later replace those values through Kareebu Captain without rewriting the customer screens.

Live production parity still requires:

- Captain availability and job acceptance
- realtime GPS transport
- server-issued pickup code
- server fare quote / demand multiplier
- payment authorization
- trip state synchronization
- push notifications
- persistent chat and safety events
