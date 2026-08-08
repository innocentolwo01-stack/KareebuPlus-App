import { decodePolyline } from './polyline';
import { KareebuRoute, RouteRequest } from './types';

const VALHALLA_BASE = (process.env.EXPO_PUBLIC_VALHALLA_BASE_URL || 'https://valhalla1.openstreetmap.de').replace(/\/$/, '');
const CLIENT_ID = process.env.EXPO_PUBLIC_VALHALLA_CLIENT_ID || 'kareebu-plus-dev';

type ValhallaResponse = {
  trip?: {
    summary?: { time?: number; length?: number };
    legs?: Array<{ shape?: string }>;
  };
  error?: string;
  error_code?: number;
  status_message?: string;
};

function routeCosting(vehicleMode: RouteRequest['vehicleMode']) {
  return vehicleMode === 'BODA' ? 'motorcycle' : 'auto';
}

function joinShapes(legs: Array<{ shape?: string }> | undefined) {
  return legs?.flatMap((leg, index) => {
    const decoded = leg.shape ? decodePolyline(leg.shape, 6) : [];
    return index > 0 && decoded.length ? decoded.slice(1) : decoded;
  }) ?? [];
}

async function requestWithCosting(input: RouteRequest, costing: string): Promise<KareebuRoute> {
  const payload = {
    locations: [
      { lat: input.origin.latitude, lon: input.origin.longitude, type: 'break' },
      { lat: input.destination.latitude, lon: input.destination.longitude, type: 'break' },
    ],
    costing,
    units: 'kilometers',
    shape_format: 'polyline6',
    directions_options: { units: 'kilometers' },
  };

  const response = await fetch(`${VALHALLA_BASE}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Id': CLIENT_ID,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json() as ValhallaResponse;
  if (!response.ok || !data.trip?.summary) {
    throw new Error(data.status_message || data.error || `Valhalla route failed (${response.status})`);
  }

  const coordinates = joinShapes(data.trip.legs);
  return {
    provider: 'valhalla',
    distanceMeters: Math.max(0, Number(data.trip.summary.length || 0) * 1000),
    durationSeconds: Math.max(0, Number(data.trip.summary.time || 0)),
    coordinates: coordinates.length >= 2 ? coordinates : [input.origin, input.destination],
  };
}

export async function calculateValhallaRoute(input: RouteRequest): Promise<KareebuRoute> {
  try {
    return await requestWithCosting(input, routeCosting(input.vehicleMode));
  } catch (error) {
    // If the demo deployment rejects motorcycle costing, retain a two-wheel route
    // by retrying with Valhalla's motor_scooter model rather than using car routing.
    if (input.vehicleMode === 'BODA') return requestWithCosting(input, 'motor_scooter');
    throw error;
  }
}
