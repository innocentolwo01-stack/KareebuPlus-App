# Kareebu AI — OpenAI-backed concierge

Kareebu+ v4.0 includes a local backend endpoint that turns the in-app Kareebu AI experience into a real OpenAI-powered assistant.

## Architecture

React Native app -> `POST /assistant` -> Kareebu AI server -> OpenAI Responses API -> structured Kareebu reply -> app recommendation cards/actions.

The mobile app never receives `OPENAI_API_KEY`.

## Why the server is required

An OpenAI API key is a secret and must not be embedded in a mobile app. The Kareebu server reads the secret from the server environment and makes the OpenAI request on behalf of the app.

## Endpoint

`POST /assistant`

Request:

```json
{
  "message": "I want grilled chicken under my budget",
  "context": {
    "country": "Uganda",
    "city": "Kampala",
    "guest": false,
    "history": [
      {"role": "user", "text": "I want grilled chicken"},
      {"role": "assistant", "text": "I found several nearby options."}
    ],
    "catalog": {
      "restaurants": [],
      "stores": []
    }
  }
}
```

Response:

```json
{
  "reply": "Here are the best matches I found around Kampala.",
  "actions": [],
  "recommendations": [
    {
      "id": "chicken-tonight",
      "title": "Chicken Tonight",
      "subtitle": "4.6 ★ · 18–28 min",
      "reason": "Strong grilled chicken match with a current Kareebu+ offer.",
      "badge": "Recommended",
      "action": {
        "label": "View menu",
        "screen": "restaurant",
        "rideMode": null,
        "shopCategory": null,
        "entityId": "chicken-tonight"
      }
    }
  ]
}
```

## Run locally

```bash
cd "$HOME/Projects/KareebuPlus-Premium-v2.1"
read -s "OPENAI_API_KEY?Paste OpenAI API key: "
echo
export OPENAI_API_KEY
export OPENAI_MODEL=gpt-5-mini
node server/kareebu-ai-api.mjs
```

Leave that Terminal open. In `.env` use:

```env
EXPO_PUBLIC_KAREEBU_AI_URL=http://10.0.2.2:8790
```

Then restart Metro with `npx expo start --dev-client --clear`.

## Safety / product rules

- AI can recommend and navigate, but does not charge, place an order or dispatch a driver.
- Merchant recommendations are grounded in the catalogue sent to the server.
- Country/city context is included so recommendations stay local.
- The last few user/assistant turns are included so follow-up questions such as “what about something cheaper?” remain conversational.
- Health/pharmacy requests should not be treated as diagnosis or prescribing.
- Prices, stock, ETAs and driver availability must still be confirmed by the relevant Kareebu service before a transaction.

## Production follow-up

For production, the server should fetch inventory, offers, route estimates and availability from Kareebu services itself rather than trusting a client-supplied demo catalogue. Add authenticated users, persistent rate limiting, observability, abuse controls and API gateway protections before public launch.
