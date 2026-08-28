import { useEffect, useState } from 'react';
import { calculateRoute, KareebuRoute, RouteCoordinate } from './provider';
import { VehicleMode } from '../ride/vehicle';

export function useRouteEstimate(
  origin: RouteCoordinate | null,
  destination: RouteCoordinate | null,
  vehicleMode: VehicleMode,
) {
  const [route, setRoute] = useState<KareebuRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) {
      setRoute(null);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setRoute(null);
    setLoading(true);
    setError(null);
    calculateRoute({ origin, destination, vehicleMode })
      .then((value) => { if (active) setRoute(value); })
      .catch((cause) => {
        if (!active) return;
        setRoute(null);
        setError(cause instanceof Error ? cause.message : 'Route unavailable');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude, vehicleMode]);

  return { route, loading, error };
}
