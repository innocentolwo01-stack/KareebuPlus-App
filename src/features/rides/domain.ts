import type { VehicleMode } from '../../ride/vehicle';
import type { PlaceSelection } from '../../places/types';

export type RideQuoteRequest = {
  country: string;
  mode: VehicleMode;
  pickup: PlaceSelection;
  destination: PlaceSelection;
};

export type RideQuote = {
  amount: number;
  currency: string;
  etaMinutes: number;
  distanceMeters?: number;
  durationSeconds?: number;
};
