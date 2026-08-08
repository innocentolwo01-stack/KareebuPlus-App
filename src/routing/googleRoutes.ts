import { decodePolyline } from './polyline';
import { KareebuRoute, RouteRequest } from './types';

const PROXY_URL = (process.env.EXPO_PUBLIC_PLACES_PROXY_URL || '').replace(/\/$/, '');
const DIRECT_DEV_KEY = process.env.EXPO_PUBLIC_GOOGLE_ROUTES_API_KEY || '';
const GOOGLE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

function durationSeconds(value?: string) {
  if (!value) return 0;
  const parsed = Number(value.replace(/s$/, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function calculateGoogleRoute(input: RouteRequest): Promise<KareebuRoute> {
  const payload = {
    origin: { location: { latLng: { latitude: input.origin.latitude, longitude: input.origin.longitude } } },
    destination: { location: { latLng: { latitude: input.destination.latitude, longitude: input.destination.longitude } } },
    travelMode: input.vehicleMode === 'BODA' ? 'TWO_WHEELER' : 'DRIVE',
    ...(input.vehicleMode === 'RIDE' ? { routingPreference: 'TRAFFIC_AWARE' } : {}),
    polylineQuality: 'OVERVIEW',
  };

  let response: Response;
  if (PROXY_URL) {
    response = await fetch(`${PROXY_URL}/routes:compute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } else {
    if (!DIRECT_DEV_KEY) throw new Error('Google Routes is not configured');
    response = await fetch(GOOGLE_ROUTES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': DIRECT_DEV_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify(payload),
    });
  }

  const data = await response.json() as any;
  if (!response.ok || !data.routes?.[0]) throw new Error(data.error?.message || `Google route failed (${response.status})`);
  const route = data.routes[0];
  const shape = route.polyline?.encodedPolyline || '';
  return {
    provider: 'google',
    distanceMeters: Number(route.distanceMeters || 0),
    durationSeconds: durationSeconds(route.duration),
    coordinates: shape ? decodePolyline(shape, 5) : [input.origin, input.destination],
  };
}
