# Kareebu demand pricing

Demand pricing is shared by Rides, Boda and delivery services instead of being hardcoded independently in each screen.

## Services covered

- Ride
- Boda
- Food delivery
- Store / grocery / pharmacy delivery
- Parcel / Collect delivery

## Pricing rule

Each quote has a base fare/fee and a bounded demand multiplier. The multiplier is derived from the ratio of active requests to available Captains/couriers.

The current local Android build uses a deterministic time-of-day demand estimate when no backend supply signal exists. The pricing contract already accepts `activeRequests` and `availableProviders`; the production Kareebu dispatch backend should supply those live counts.

Demand never changes the fare silently after confirmation. The user sees the demand level, multiplier and final quote before booking.

### Bounds

- Ride: 0.90x to 1.75x
- Boda: 0.90x to 1.55x
- Food delivery: 0.95x to 1.45x
- Store delivery: 0.95x to 1.40x
- Parcel delivery: 0.95x to 1.45x

Free delivery promotions remain free. Pickup remains zero-delivery-fee.

## Production handoff

Replace the fallback estimate with realtime demand signals from Kareebu dispatch:

`active requests / available providers -> demand multiplier -> locked customer quote`

Scheduled rides/deliveries should use demand for the selected future time slot once the backend supports slot forecasting.
