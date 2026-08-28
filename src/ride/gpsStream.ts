import { VehicleGpsPayload } from './vehicle';

/**
 * Production GPS stream adapter.
 * The prototype currently simulates movement on the map. When the backend
 * websocket is available, feed each payload from this function into
 * useAnimatedVehicle().applyGpsPayload(payload).
 */
export function subscribeToVehicleGps({
  tripId,
  websocketBaseUrl,
  onPosition,
  onError,
}: {
  tripId: string;
  websocketBaseUrl: string;
  onPosition: (payload: VehicleGpsPayload) => void;
  onError?: (error: unknown) => void;
}) {
  const url = `${websocketBaseUrl.replace(/\/$/, '')}/v1/trips/${encodeURIComponent(tripId)}/gps`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const raw = JSON.parse(String(event.data));
      const payload: VehicleGpsPayload = {
        driverId: String(raw.driver_id),
        vehicleType: raw.vehicle_type === 'MOTORCYCLE' ? 'MOTORCYCLE' : 'CAR',
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
        heading: Number(raw.heading ?? 0),
        speedMps: raw.speed_mps == null ? undefined : Number(raw.speed_mps),
        timestamp: Number(raw.timestamp ?? Date.now()),
      };

      if (!Number.isFinite(payload.latitude) || !Number.isFinite(payload.longitude)) return;
      onPosition(payload);
    } catch (error) {
      onError?.(error);
    }
  };

  socket.onerror = (error) => onError?.(error);
  return () => socket.close();
}
