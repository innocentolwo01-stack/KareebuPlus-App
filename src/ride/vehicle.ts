import { ImageSourcePropType } from 'react-native';
import { assets } from '../assets';
import { RideId } from '../types';

export type VehicleMode = 'RIDE' | 'BODA';
export type VehicleType = 'CAR' | 'MOTORCYCLE';

export type VehicleGpsPayload = {
  driverId: string;
  vehicleType: VehicleType;
  latitude: number;
  longitude: number;
  heading: number;
  speedMps?: number;
  timestamp: number;
};

export type VehicleModeConfig = {
  mode: VehicleMode;
  label: string;
  vehicleType: VehicleType;
  defaultRide: RideId;
  marker: ImageSourcePropType;
};

export const VEHICLE_MODE_CONFIG: Record<VehicleMode, VehicleModeConfig> = {
  RIDE: {
    mode: 'RIDE',
    label: 'Ride',
    vehicleType: 'CAR',
    defaultRide: 'economy',
    marker: assets.service.rides,
  },
  BODA: {
    mode: 'BODA',
    label: 'Boda',
    vehicleType: 'MOTORCYCLE',
    defaultRide: 'boda',
    marker: assets.service.boda,
  },
};

export function vehicleModeForRide(ride: RideId): VehicleMode {
  return ride === 'boda' ? 'BODA' : 'RIDE';
}

export function rideBelongsToMode(ride: RideId, mode: VehicleMode): boolean {
  if (mode === 'BODA') return ride === 'boda';
  return ride === 'economy' || ride === 'comfort' || ride === 'xl';
}

export function normaliseHeading(value: number | null | undefined): number {
  if (!Number.isFinite(value)) return 0;
  const heading = Number(value) % 360;
  return heading < 0 ? heading + 360 : heading;
}

export function bearingBetween(
  from: Pick<VehicleGpsPayload, 'latitude' | 'longitude'>,
  to: Pick<VehicleGpsPayload, 'latitude' | 'longitude'>,
): number {
  const lat1 = (from.latitude * Math.PI) / 180;
  const lat2 = (to.latitude * Math.PI) / 180;
  const deltaLng = ((to.longitude - from.longitude) * Math.PI) / 180;
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  return normaliseHeading((Math.atan2(y, x) * 180) / Math.PI);
}
