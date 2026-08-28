# Kareebu+ v3.9 — Landmark Onboarding + AI Concierge

## Country onboarding

- Replaced generic country-card illustrations with dedicated landmark imagery for Uganda, Kenya and Tanzania.
- The existing country map remains as geographic context while the focused country card now provides a strong local visual identity.
- Country cards keep flag, country and capital labels in native UI so the imagery remains reusable and accessible.
- The deterministic Welcome → Country → City → Location onboarding architecture from v3.8 is preserved.

## Kareebu AI

- Added a new native `KareebuAssistantScreen` reachable from Home, Universal Search and All Services.
- Added a compact `Ask Kareebu AI` home card directly beneath universal search.
- Added natural-language demo intents for Ride, Boda, food, groceries, pharmacies, parcels, Wallet, orders and support.
- AI actions route into the real Kareebu+ service screens and preserve selected country/city context.
- Added quick prompts and action chips so the assistant is usable in the emulator immediately.
- Added `EXPO_PUBLIC_KAREEBU_AI_URL` backend configuration. No model/provider secret is stored in the React Native app.
- If no AI backend is configured, the app uses a deterministic local concierge and labels responses as Demo.
- Added an explicit AI safety note: customers still confirm prices, availability and trip/order details in the normal Kareebu+ flows.

## Architecture

- Added `src/ai/kareebuAssistant.ts` provider boundary.
- Added `docs/ai-concierge.md` with the mobile/backend request-response contract and production guardrails.
- No new native dependencies were introduced.
