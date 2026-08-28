# Kareebu AI Concierge (v3.9)

Kareebu+ now contains a backend-ready AI concierge screen. The React Native client never stores a model-provider secret.

## Client contract

Set `EXPO_PUBLIC_KAREEBU_AI_URL` to the Kareebu backend base URL. The app sends:

```json
{
  "message": "Find a nearby pharmacy",
  "context": {
    "country": "Uganda",
    "city": "Kampala",
    "guest": false,
    "app": "Kareebu+"
  }
}
```

The backend should return:

```json
{
  "reply": "I found pharmacy options around Kampala.",
  "actions": [
    { "label": "Nearby pharmacies", "screen": "shops", "shopCategory": "Pharmacy" }
  ]
}
```

Only allow known Kareebu+ screen/action values at the backend boundary. Production AI should call internal Kareebu catalogue, availability, pricing, routing and order APIs rather than inventing operational facts.

## Development fallback

When `EXPO_PUBLIC_KAREEBU_AI_URL` is not set, `src/ai/kareebuAssistant.ts` uses a deterministic local concierge. This supports demo queries for Ride, Boda, food, groceries, pharmacies, parcels, Wallet, orders and support without any external AI cost.

## Production principles

- Keep model API credentials server-side.
- Send only the minimum user context needed for the request.
- Do not let a model directly place an order, take payment or dispatch a driver without explicit user confirmation.
- Ground prices, store availability, ETAs and order state in Kareebu services, not model memory.
- Log tool/action outcomes separately from model text for auditability.
