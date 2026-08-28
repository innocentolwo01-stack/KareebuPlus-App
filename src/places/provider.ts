import { autocompleteGoogle, getGooglePlaceDetails, googlePlacesConfigured } from './googlePlaces';
import { autocompletePhoton, photonConfigured, reverseGeocodePhoton } from './photon';
import { PlaceSelection, PlaceSuggestion, PlacesRequestOptions } from './types';

export type MapsStack = 'open' | 'google';

const configuredStack = String(process.env.EXPO_PUBLIC_MAPS_STACK || 'open').toLowerCase();
export const MAPS_STACK: MapsStack = configuredStack === 'google' ? 'google' : 'open';

function uuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function createPlacesSessionToken() {
  return uuidV4();
}

export function placesConfigured() {
  return MAPS_STACK === 'google' ? googlePlacesConfigured() : photonConfigured();
}

export function placeProviderName() {
  return MAPS_STACK === 'google' ? 'Google' : 'Photon';
}

export function placeAttribution() {
  return MAPS_STACK === 'google'
    ? 'Place suggestions powered by Google'
    : 'Search powered by Photon · © OpenStreetMap contributors';
}

export async function autocompletePlaces(input: string, options: PlacesRequestOptions = {}) {
  return MAPS_STACK === 'google'
    ? autocompleteGoogle(input, options)
    : autocompletePhoton(input, options);
}

export async function resolvePlaceSuggestion(suggestion: PlaceSuggestion, sessionToken?: string): Promise<PlaceSelection> {
  if (suggestion.provider === 'photon' && suggestion.selection) return suggestion.selection;
  return getGooglePlaceDetails(suggestion.placeId, sessionToken);
}

export async function reverseGeocodePlace(latitude: number, longitude: number): Promise<PlaceSelection> {
  // Photon gives Kareebu+ a free reverse-geocoding path for a manually dropped pin.
  // This remains available even when Google search is temporarily selected.
  return reverseGeocodePhoton(latitude, longitude);
}

export type { PlaceBias, PlaceSelection, PlaceSuggestion, PlaceViewport, PlacesRequestOptions } from './types';
