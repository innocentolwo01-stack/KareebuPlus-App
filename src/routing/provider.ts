import { MAPS_STACK } from '../places/provider';
import { calculateGoogleRoute } from './googleRoutes';
import { calculateValhallaRoute } from './valhalla';
import { KareebuRoute, RouteRequest } from './types';

const cache = new Map<string, KareebuRoute>();

function cacheKey(input: RouteRequest) {
  const round = (value: number) => value.toFixed(5);
  return [
    MAPS_STACK,
    input.vehicleMode,
    round(input.origin.latitude),
    round(input.origin.longitude),
    round(input.destination.latitude),
    round(input.destination.longitude),
  ].join(':');
}

export function routingProviderName() {
  return MAPS_STACK === 'google' ? 'Google Routes' : 'Valhalla';
}

export function routingAttribution() {
  return MAPS_STACK === 'google' ? 'Route by Google' : 'Route by Valhalla · © OpenStreetMap contributors';
}

export async function calculateRoute(input: RouteRequest): Promise<KareebuRoute> {
  const key = cacheKey(input);
  const cached = cache.get(key);
  if (cached) return cached;
  const route = MAPS_STACK === 'google'
    ? await calculateGoogleRoute(input)
    : await calculateValhallaRoute(input);
  cache.set(key, route);
  return route;
}

export type { KareebuRoute, RouteCoordinate, RouteRequest } from './types';
