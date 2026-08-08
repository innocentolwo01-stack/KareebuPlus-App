/**
 * Backend example for Kareebu+ ride/boda dispatch.
 * This is intentionally framework-neutral pseudocode/TypeScript so it can be
 * implemented in Supabase/Postgres, Node, NestJS, Fastify, etc.
 */

type VehicleType = 'CAR' | 'MOTORCYCLE';

type DispatchRequest = {
  riderId: string;
  vehicleType: VehicleType;
  pickup: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
};

declare const db: {
  drivers: {
    findNearby: (query: unknown) => Promise<Array<{ id: string }>>;
    update: (driverId: string, patch: unknown) => Promise<void>;
  };
};
declare function chunk<T>(items: T[], size: number): T[][];
declare function offerTripAndWaitForFirstAcceptance<T extends { id: string }>(
  drivers: T[],
  request: DispatchRequest,
  timeoutMs: number,
): Promise<{ driverId: string } | null>;

export async function dispatchNearbyDriver(request: DispatchRequest) {
  const searchRadiusKm = request.vehicleType === 'MOTORCYCLE' ? 4 : 7;

  // SQL shape when PostGIS is available:
  // SELECT id, vehicle_type, current_lat, current_lng, heading,
  //        ST_DistanceSphere(location, pickup_point) AS distance_m
  // FROM drivers
  // WHERE status = 'AVAILABLE'
  //   AND vehicle_type = $1
  //   AND ST_DWithin(location::geography, pickup_point::geography, $2)
  // ORDER BY distance_m ASC, acceptance_score DESC
  // LIMIT 20;

  const candidates = await db.drivers.findNearby({
    latitude: request.pickup.latitude,
    longitude: request.pickup.longitude,
    radiusKm: searchRadiusKm,
    filters: {
      status: 'AVAILABLE',
      vehicle_type: request.vehicleType,
    },
    orderBy: ['distance ASC', 'acceptance_score DESC'],
    limit: 20,
  });

  if (!candidates.length) {
    return { status: 'NO_DRIVER_AVAILABLE' as const };
  }

  // Dispatch in small waves rather than notifying every nearby driver at once.
  for (const wave of chunk(candidates, 3)) {
    const accepted = await offerTripAndWaitForFirstAcceptance(wave, request, 12_000);
    if (accepted) {
      await db.drivers.update(accepted.driverId, { status: 'ON_JOB' });
      return { status: 'MATCHED' as const, driver: accepted };
    }
  }

  return { status: 'NO_DRIVER_ACCEPTED' as const };
}

// Client request example:
// POST /v1/dispatch
// {
//   "riderId": "usr_123",
//   "vehicleType": selectedMode === "BODA" ? "MOTORCYCLE" : "CAR",
//   "pickup": { "latitude": 0.3389, "longitude": 32.5796 },
//   "destination": { "latitude": 0.3483, "longitude": 32.5905 }
// }
