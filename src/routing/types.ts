import { VehicleMode } from '../ride/vehicle';

export type RouteCoordinate = { latitude: number; longitude: number };

export type RouteRequest = {
  origin: RouteCoordinate;
  destination: RouteCoordinate;
  vehicleMode: VehicleMode;
};

export type KareebuRoute = {
  provider: 'valhalla' | 'google';
  distanceMeters: number;
  durationSeconds: number;
  coordinates: RouteCoordinate[];
};
