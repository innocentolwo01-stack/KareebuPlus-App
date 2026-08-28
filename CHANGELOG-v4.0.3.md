# Kareebu+ v4.0.3 — Country Landmark + Onboarding Transition Fix

- Replaced remote country landmark URLs and illustrated fallbacks with bundled local photographic country assets for Uganda/Kampala, Kenya/Nairobi and Tanzania/Dar es Salaam.
- Replaced the live `MapView` on Select your country with a bundled East Africa map background matching the approved composition. This removes the heavy native map mount from the Welcome → Country transition.
- App now starts JavaScript directly on the single Welcome screen after the native splash. The duplicate JavaScript splash handoff is removed from normal launch.
- Welcome → Country → City → Location onboarding navigation is instant and bypasses the app-wide fade/slide transition.
- Country cards remain interactive and continue to swap country/city state normally.
