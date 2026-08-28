import { VehicleMode, VEHICLE_MODE_CONFIG } from './vehicle';

export type DispatchPayload = {
  vehicle_type: 'CAR' | 'MOTORCYCLE';
  pickup: { latitude: number; longitude: number };
  destination: { latitude: number; longitude: number };
};

export function buildDispatchPayload(
  mode: VehicleMode,
  pickup: DispatchPayload['pickup'],
  destination: DispatchPayload['destination'],
): DispatchPayload {
  return {
    vehicle_type: VEHICLE_MODE_CONFIG[mode].vehicleType,
    pickup,
    destination,
  };
}

export async function requestDispatch(apiBaseUrl: string, token: string, payload: DispatchPayload) {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/v1/dispatch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Dispatch failed with HTTP ${response.status}`);
  return response.json();
}
