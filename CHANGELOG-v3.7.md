# Kareebu+ v3.7 — Single-entry onboarding + country-local stores

- Removed the duplicate JavaScript splash/welcome transition: the native splash now hands off directly to one Welcome screen.
- Added guarded Welcome actions so repeated taps cannot queue multiple onboarding transitions.
- Both **Get started** and **Continue as guest** now go to **Select your country** first.
- Country Continue always goes to **Select your city**.
- City **Use current location** now requests GPS, detects a supported country where possible, chooses the nearest supported city and skips manual pinning when successful.
- Manual city Continue opens the delivery-location map/search screen.
- Signed onboarding continues to Phone after location; Guest onboarding goes straight to Home after location.
- Local marketplace catalogues now follow the chosen country/city throughout Home Popular stores and the Shops screen.
- Added Kenya demo retailer entries for Naivas and Quickmart, alongside Carrefour, Goodlife and Jumia.
- Added Tanzania demo retailer entries for Shoppers Supermarket, Village Supermarket and Breeze Pharmacy.
- Added compact branded wordmark treatments for new locale retailers so cards no longer fall back to generic cart icons.
