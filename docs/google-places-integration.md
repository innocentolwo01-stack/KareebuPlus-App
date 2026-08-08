# Kareebu+ Google Places integration

The uploaded `google-places-api-master.zip` is a Java/Maven helper library intended for Spring Boot/server-side use. Kareebu+ is a React Native/Expo app, so the Java source is not bundled into the mobile app.

Kareebu+ v2.8.1 uses the current Google Places API (New) contract through a tiny local/backend proxy instead. This keeps the server Places key out of the React Native JavaScript bundle.

## Local emulator setup

1. Enable Places API (New) in the Google Cloud project used for Places requests.
2. In Terminal 1, from the project root:

   ```bash
   GOOGLE_PLACES_SERVER_API_KEY='YOUR_SERVER_PLACES_KEY' node scripts/places-proxy.mjs
   ```

3. In `.env` add:

   ```env
   EXPO_PUBLIC_PLACES_PROXY_URL=http://10.0.2.2:8787
   ```

4. Start the dev client normally:

   ```bash
   npx expo start --dev-client --clear
   ```

The app waits until at least 3 characters are entered before requesting predictions, debounces typing, location-biases results around the selected city, and uses one session token per search-selection session.

## Production

Run the same proxy logic in your own API/backend, keep the Places API key server-side, add authentication/rate limiting, and set `EXPO_PUBLIC_PLACES_PROXY_URL` to the production API origin.
