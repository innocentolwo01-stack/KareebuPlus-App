import { PlaceSelection, PlaceSuggestion, PlacesRequestOptions } from './types';

const PROXY_URL = (process.env.EXPO_PUBLIC_PLACES_PROXY_URL || '').replace(/\/$/, '');
// Direct web-service calls are useful for short-lived local testing only. In production,
// keep the Places server key behind the proxy so it is not shipped in the mobile bundle.
const DIRECT_DEV_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
const GOOGLE_BASE = 'https://places.googleapis.com/v1';

export function googlePlacesConfigured() {
  return Boolean(PROXY_URL || DIRECT_DEV_KEY);
}

async function requestJson<T>(path: string, body?: unknown, fieldMask?: string): Promise<T> {
  if (PROXY_URL) {
    const response = await fetch(`${PROXY_URL}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`Places proxy request failed (${response.status})`);
    return response.json() as Promise<T>;
  }

  if (!DIRECT_DEV_KEY) throw new Error('Google Places is not configured');

  const response = await fetch(`${GOOGLE_BASE}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': DIRECT_DEV_KEY,
      ...(fieldMask ? { 'X-Goog-FieldMask': fieldMask } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Google Places request failed (${response.status})`);
  return response.json() as Promise<T>;
}

function autocompleteBody(input: string, options: PlacesRequestOptions) {
  const body: Record<string, unknown> = {
    input,
    sessionToken: options.sessionToken,
    languageCode: 'en',
  };
  if (options.countryCode) body.includedRegionCodes = [options.countryCode.toLowerCase()];
  if (options.bias) {
    body.locationBias = {
      circle: {
        center: { latitude: options.bias.latitude, longitude: options.bias.longitude },
        radius: options.bias.radiusMeters ?? 45000,
      },
    };
  }
  return body;
}

export async function autocompleteGoogle(input: string, options: PlacesRequestOptions = {}): Promise<PlaceSuggestion[]> {
  const trimmed = input.trim();
  if (trimmed.length < 3) return [];
  const response = await requestJson<any>('/places:autocomplete', autocompleteBody(trimmed, options));
  return (response.suggestions ?? [])
    .map((suggestion: any): PlaceSuggestion | null => {
      const prediction = suggestion.placePrediction;
      if (!prediction) return null;
      const placeId = String(prediction.placeId || prediction.place || '').replace(/^places\//, '');
      const fullText = prediction.text?.text ?? prediction.structuredFormat?.mainText?.text ?? '';
      const primaryText = prediction.structuredFormat?.mainText?.text ?? fullText;
      const secondaryText = prediction.structuredFormat?.secondaryText?.text ?? '';
      if (!placeId || !primaryText) return null;
      return {
        placeId,
        primaryText,
        secondaryText,
        fullText,
        types: prediction.types ?? [],
        distanceMeters: prediction.distanceMeters,
        provider: 'google',
      };
    })
    .filter(Boolean) as PlaceSuggestion[];
}

export async function getGooglePlaceDetails(placeId: string, sessionToken?: string): Promise<PlaceSelection> {
  const cleanId = placeId.replace(/^places\//, '');
  const query = sessionToken ? `?sessionToken=${encodeURIComponent(sessionToken)}&languageCode=en` : '?languageCode=en';
  const response = await requestJson<any>(
    `/places/${encodeURIComponent(cleanId)}${query}`,
    undefined,
    'id,displayName,formattedAddress,location,types,viewport',
  );
  return {
    placeId: response.id ?? cleanId,
    name: response.displayName?.text ?? response.formattedAddress ?? 'Selected place',
    address: response.formattedAddress ?? '',
    latitude: response.location?.latitude ?? 0,
    longitude: response.location?.longitude ?? 0,
    types: response.types ?? [],
    provider: 'google',
    viewport: response.viewport ? {
      northeast: {
        latitude: response.viewport.high?.latitude ?? response.viewport.northeast?.latitude ?? response.location?.latitude ?? 0,
        longitude: response.viewport.high?.longitude ?? response.viewport.northeast?.longitude ?? response.location?.longitude ?? 0,
      },
      southwest: {
        latitude: response.viewport.low?.latitude ?? response.viewport.southwest?.latitude ?? response.location?.latitude ?? 0,
        longitude: response.viewport.low?.longitude ?? response.viewport.southwest?.longitude ?? response.location?.longitude ?? 0,
      },
    } : undefined,
  };
}
