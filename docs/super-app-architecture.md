# Kareebu Plus — Super App architecture

This branch keeps the approved v4.0.4 customer experience running while moving the implementation away from a single prototype module and toward feature-owned services.

## Runtime layers

```text
App.tsx
  -> src/app/KareebuApp.tsx
      -> app state + navigation boundary
      -> SuperAppServicesProvider
          -> demo adapter (default)
          -> temporary legacy 6amMart adapter (opt-in, mapped feature-by-feature)
          -> Kareebu production API adapter
      -> existing screens during migration
```

The UI must not import vendor/backend implementation details directly. Migrated screens consume typed feature contracts through `useSuperAppServices()`.

## Backend modes

`EXPO_PUBLIC_KAREEBU_BACKEND_MODE` controls the adapter:

- `demo` — default local behaviour; safe for emulator development.
- `legacy6am` — temporary migration adapter. It intentionally fails for features that have not been mapped yet rather than inventing vendor endpoints.
- `kareebu` — target shared Kareebu API contract.

Do not put server secrets in `EXPO_PUBLIC_*` variables.

## Migration sequence

1. Foundation — app state, service contracts, configuration and feature domains.
2. Food / Grocery / Shop / Pharmacy — move catalogue reads behind `catalog` services.
3. Cart / Checkout / Orders — unify basket/order state and API contracts.
4. Parcels / Kareebu Collect — share parcel domain and backend with the specialist Collect app.
5. Rides / Boda — move estimates, dispatch and trip lifecycle behind ride services shared with Captain.
6. Wallet / Loyalty / Rewards — replace session-only wallet and promotion state with ledger/reward services.
7. Notifications / Chat / Account — persisted sessions, push, conversations and support.
8. Production cutover — `kareebu` backend mode becomes the default and legacy adapters are removed.

## Rule during migration

A feature only moves out of `src/screens.tsx` when its replacement passes TypeScript checks and its existing smoke path still works. Do not perform a mechanical Dart-to-TypeScript conversion of the Flutter donor application.
