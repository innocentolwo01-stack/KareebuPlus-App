export type PlaceProviderName = 'photon' | 'google';

export type PlaceViewport = {
  northeast: { latitude: number; longitude: number };
  southwest: { latitude: number; longitude: number };
};

export type PlaceSelection = {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];
  provider?: PlaceProviderName | 'manual';
  viewport?: PlaceViewport;
};

export type PlaceSuggestion = {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  fullText: string;
  types: string[];
  distanceMeters?: number;
  provider: PlaceProviderName;
  selection?: PlaceSelection;
};

export type PlaceBias = {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
};

export type PlacesRequestOptions = {
  countryCode?: string;
  bias?: PlaceBias;
  sessionToken?: string;
};
