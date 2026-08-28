import { PlaceSelection, PlaceSuggestion, PlacesRequestOptions, PlaceViewport } from './types';

const PHOTON_BASE = (process.env.EXPO_PUBLIC_PHOTON_BASE_URL || 'https://photon.komoot.io').replace(/\/$/, '');

type PhotonFeature = {
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: Record<string, unknown> & {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    osm_key?: string;
    osm_value?: string;
    osm_type?: string;
    osm_id?: number | string;
    extent?: number[];
  };
};

type PhotonResponse = { features?: PhotonFeature[] };

function compact(parts: Array<string | undefined | null>) {
  return parts.map((part) => part?.trim()).filter((part): part is string => Boolean(part));
}

function unique(parts: string[]) {
  return parts.filter((value, index) => parts.indexOf(value) === index);
}

function addressFor(properties: PhotonFeature['properties']) {
  if (!properties) return '';
  const streetLine = compact([properties.housenumber, properties.street]).join(' ');
  return unique(compact([
    streetLine,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ])).join(', ');
}

function viewportFor(extent?: number[]): PlaceViewport | undefined {
  if (!extent || extent.length < 4) return undefined;
  const [lon1, lat1, lon2, lat2] = extent.map(Number);
  if (![lon1, lat1, lon2, lat2].every(Number.isFinite)) return undefined;
  return {
    northeast: { latitude: Math.max(lat1, lat2), longitude: Math.max(lon1, lon2) },
    southwest: { latitude: Math.min(lat1, lat2), longitude: Math.min(lon1, lon2) },
  };
}

function normalizeFeature(feature: PhotonFeature): PlaceSelection | null {
  const coordinates = feature.geometry?.coordinates;
  const properties = feature.properties;
  if (!coordinates || coordinates.length < 2 || !properties) return null;
  const [longitude, latitude] = coordinates.map(Number);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const name = String(properties.name || properties.street || properties.city || properties.district || 'Selected place');
  const osmType = String(properties.osm_type || 'X');
  const osmId = String(properties.osm_id || `${latitude.toFixed(6)}-${longitude.toFixed(6)}`);
  const type = compact([
    properties.osm_key && properties.osm_value ? `${properties.osm_key}:${properties.osm_value}` : undefined,
    properties.osm_value,
  ]);

  return {
    placeId: `photon-${osmType}-${osmId}`,
    name,
    address: addressFor(properties) || compact([properties.city, properties.country]).join(', '),
    latitude,
    longitude,
    types: unique(type),
    provider: 'photon',
    viewport: viewportFor(properties.extent),
  };
}

function secondaryText(selection: PlaceSelection) {
  if (!selection.address) return '';
  const lowerName = selection.name.toLowerCase();
  const parts = selection.address.split(',').map((part) => part.trim());
  if (parts[0]?.toLowerCase().includes(lowerName)) parts.shift();
  return parts.join(', ') || selection.address;
}

async function fetchPhoton(path: string) {
  const response = await fetch(`${PHOTON_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Photon search failed (${response.status})`);
  return response.json() as Promise<PhotonResponse>;
}

export async function autocompletePhoton(input: string, options: PlacesRequestOptions = {}): Promise<PlaceSuggestion[]> {
  const trimmed = input.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({ q: trimmed, limit: '7', lang: 'en' });
  if (options.countryCode) params.append('countrycode', options.countryCode.toUpperCase());
  if (options.bias) {
    params.set('lat', String(options.bias.latitude));
    params.set('lon', String(options.bias.longitude));
    params.set('zoom', options.bias.radiusMeters && options.bias.radiusMeters < 25000 ? '13' : '11');
    params.set('location_bias_scale', '0.2');
  }

  const response = await fetchPhoton(`/api?${params.toString()}`);
  return (response.features ?? []).map((feature): PlaceSuggestion | null => {
    const selection = normalizeFeature(feature);
    if (!selection) return null;
    const secondary = secondaryText(selection);
    return {
      placeId: selection.placeId,
      primaryText: selection.name,
      secondaryText: secondary,
      fullText: secondary ? `${selection.name}, ${secondary}` : selection.name,
      types: selection.types,
      provider: 'photon',
      selection,
    };
  }).filter((item): item is PlaceSuggestion => Boolean(item));
}

export async function reverseGeocodePhoton(latitude: number, longitude: number): Promise<PlaceSelection> {
  const params = new URLSearchParams({ lat: String(latitude), lon: String(longitude), limit: '1', lang: 'en' });
  const response = await fetchPhoton(`/reverse?${params.toString()}`);
  const selection = response.features?.map(normalizeFeature).find((item): item is PlaceSelection => Boolean(item));
  if (!selection) throw new Error('No address found for this pin');
  return selection;
}

export function photonConfigured() {
  return Boolean(PHOTON_BASE);
}
