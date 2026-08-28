import type { PlaceSelection } from '../places/types';

export type LocationKind = 'current' | 'saved' | 'recent' | 'pickup' | 'destination' | 'seller' | 'venue' | 'collection-point';

export type OperationalLocation = {
  id: string;
  placeId?: string;
  label: string;
  secondaryLabel?: string;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  formattedAddress: string;
  type: LocationKind;
  entrance?: string;
  pickupNote?: string;
};

export type SemanticMarkerKind = 'car' | 'boda' | 'pickup' | 'destination' | 'courier' | 'event' | 'seller';
export type MapCameraIntent =
  | { type: 'focus'; location: OperationalLocation; zoom?: number }
  | { type: 'fit'; locations: OperationalLocation[]; edgePadding: { top: number; right: number; bottom: number; left: number } };

export function operationalLocation(place: PlaceSelection, context: { city: string; country: string; type: LocationKind }): OperationalLocation {
  return {
    id: `${context.type}-${place.placeId}`,
    placeId: place.placeId,
    label: place.name,
    secondaryLabel: place.address,
    latitude: place.latitude,
    longitude: place.longitude,
    city: context.city,
    country: context.country,
    formattedAddress: place.address,
    type: context.type,
  };
}

export function refinePickup(location: OperationalLocation, refinement: { entrance?: string; pickupNote?: string }): OperationalLocation {
  return { ...location, ...refinement, type: 'pickup' };
}

export interface LocationPlatform {
  current(): Promise<OperationalLocation | null>;
  search(query: string, context: { country: string; city: string; viewport?: MapCameraIntent }): Promise<OperationalLocation[]>;
  reverse(latitude: number, longitude: number, context: { country: string; city: string }): Promise<OperationalLocation>;
}
