# Kareebu+ Premium v2.7 — Layout Architecture Pass

## What changed

- Reworked the Home screen hierarchy so utility content appears before promotional discovery.
- Universal search remains app-wide and is more visually prominent without behaving like a ride shortcut.
- Added a compact Services heading and tighter 4-column service cards.
- Made Home campaign cards responsive to the device width and reduced their vertical footprint.
- Moved Recent activity (including the square interactive map) higher in the Home journey.
- Home map expansion now opens the location experience rather than assuming a ride booking.
- Food near you and Popular stores now use proper bordered cards with consistent padding and metadata hierarchy.
- Reduced functional heading sizes across the product and tightened global header / bottom-navigation spacing.
- Rebuilt Food and Shops headers into a consistent left-aligned title + delivery-location pattern.
- Reduced commerce promo, category and merchant card sizes to show more useful content per viewport.
- Food restaurant rows now use consistent rounded cards instead of loose divider-only rows.
- Food and Shops search controls now open Kareebu+ universal search instead of being inert.
- Tightened destination search, ride-option cards, trip cards and confirmation spacing.
- Moved the selected ride's estimated fare above the confirmation CTA so pricing is read before commitment.
- Preserved the Kareebu black / yellow / red brand system and the approved Kareebu+ logo assets.

## Native dependencies

No new native dependencies were introduced in v2.7. If the current development build already contains `react-native-maps` and `expo-location`, this update can be previewed through Metro without rebuilding Android.
