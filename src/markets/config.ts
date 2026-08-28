import type { Region } from 'react-native-maps';
import type { RideId } from '../types';
import type { VehicleMode } from '../ride/vehicle';
import { marketContent } from '../content/markets';

export type SupportedCountry = 'Uganda' | 'Kenya' | 'Tanzania';
export type MobilityProductConfig = { id: RideId; name: string; etaMinutes: number; baseFareUgx: number };
export type MobilityPricingConfig = {
  market: SupportedCountry;
  mode: VehicleMode;
  baseFareUgx: number;
  minimumFareUgx: number;
  perKmUgx: number;
  perMinuteUgx: number;
  bookingFeeUgx: number;
  estimated: true;
  isLive: false;
  source: 'market-fixture';
};
export type MobilityPlaceConfig={id:string;label:string;address:string;latitude:number;longitude:number;kind:'home'|'work'|'airport'|'recent'|'popular'};
export type MobilityEventConfig={id:string;name:string;venue:string;city:string;startAt:string;endAt:string;mobilityMode:VehicleMode|'BOTH';creativeUrl?:string;destination:{latitude:number;longitude:number};enabled:boolean;source:'cms'};
export type MarketConfig = {
  country: SupportedCountry;
  iso: 'UG' | 'KE' | 'TZ';
  dialCode: '+256' | '+254' | '+255';
  currency: 'UGX' | 'KES' | 'TZS';
  currencyScaleFromUgx: number;
  timezone: string;
  primaryCity: string;
  mobileMoney: [string, string];
  map: { countryRegion: Region; primaryCityRegion: Region; routePoints: Array<{ latitude: number; longitude: number }> };
  services: { rides: boolean; boda: boolean };
  products: Record<VehicleMode, MobilityProductConfig[]>;
  pricing: Record<VehicleMode, MobilityPricingConfig>;
  mobilityPlaces: MobilityPlaceConfig[];
  mobilityFeatures: { schoolRides:boolean; cityToCity:boolean; rideForSomeone:boolean; business:boolean };
};

const pricing = (market: SupportedCountry, mode: VehicleMode, values: Omit<MobilityPricingConfig, 'market' | 'mode' | 'estimated' | 'isLive' | 'source'>): MobilityPricingConfig => ({
  market, mode, ...values, estimated: true, isLive: false, source: 'market-fixture',
});

export const MARKET_CONFIG: Record<SupportedCountry, MarketConfig> = {
  Uganda: {
    country: 'Uganda', iso: 'UG', dialCode: '+256', currency: 'UGX', currencyScaleFromUgx: 1,
    timezone: 'Africa/Kampala', primaryCity: 'Kampala', mobileMoney: ['MTN Mobile Money', 'Airtel Money'],
    map: {
      countryRegion: { latitude: 1.25, longitude: 32.65, latitudeDelta: 6.2, longitudeDelta: 5.5 },
      primaryCityRegion: { latitude: 0.3476, longitude: 32.5825, latitudeDelta: 0.12, longitudeDelta: 0.105 },
      routePoints: [{ latitude: 0.3476, longitude: 32.5825 }, { latitude: 0.3548, longitude: 32.5981 }, { latitude: 0.3642, longitude: 32.6134 }],
    },
    services: { rides: true, boda: true },
    products: {
      RIDE: [{ id: 'economy', name: 'Economy', etaMinutes: 4, baseFareUgx: 6500 }, { id: 'comfort', name: 'Comfort', etaMinutes: 6, baseFareUgx: 11000 }, { id: 'xl', name: 'XL', etaMinutes: 7, baseFareUgx: 16000 }],
      BODA: [{ id: 'boda', name: 'Boda', etaMinutes: 2, baseFareUgx: 2000 }],
    },
    pricing: {
      RIDE: pricing('Uganda', 'RIDE', { baseFareUgx: 4500, minimumFareUgx: 5000, perKmUgx: 1200, perMinuteUgx: 180, bookingFeeUgx: 500 }),
      BODA: pricing('Uganda', 'BODA', { baseFareUgx: 1200, minimumFareUgx: 1800, perKmUgx: 500, perMinuteUgx: 80, bookingFeeUgx: 200 }),
    },
    mobilityPlaces:[{id:'home',label:'Home',address:'Save your home address',latitude:0.3476,longitude:32.5825,kind:'home'},{id:'work',label:'Work',address:'Save your work address',latitude:0.335,longitude:32.59,kind:'work'},{id:'airport',label:'Entebbe International Airport',address:'Entebbe',latitude:0.0424,longitude:32.4435,kind:'airport'},{id:'acacia',label:'Acacia Mall',address:'Kisementi, Kampala',latitude:0.3488,longitude:32.5824,kind:'popular'},{id:'kololo',label:'Kololo',address:'Kampala',latitude:0.3378,longitude:32.5969,kind:'popular'},{id:'bugolobi',label:'Bugolobi',address:'Kampala',latitude:0.3187,longitude:32.6205,kind:'popular'},{id:'ntinda',label:'Ntinda',address:'Kampala',latitude:0.354,longitude:32.612,kind:'popular'}],mobilityFeatures:{schoolRides:true,cityToCity:true,rideForSomeone:true,business:true},
  },
  Kenya: {
    country: 'Kenya', iso: 'KE', dialCode: '+254', currency: 'KES', currencyScaleFromUgx: 0.035,
    timezone: 'Africa/Nairobi', primaryCity: 'Nairobi', mobileMoney: ['M-PESA', 'Airtel Money'],
    map: {
      countryRegion: { latitude: 0.15, longitude: 37.8, latitudeDelta: 9.2, longitudeDelta: 8 },
      primaryCityRegion: { latitude: -1.2864, longitude: 36.8172, latitudeDelta: 0.12, longitudeDelta: 0.105 },
      routePoints: [{ latitude: -1.2864, longitude: 36.8172 }, { latitude: -1.2741, longitude: 36.8123 }, { latitude: -1.2645, longitude: 36.8041 }],
    },
    services: { rides: true, boda: true },
    products: {
      RIDE: [{ id: 'economy', name: 'Economy', etaMinutes: 4, baseFareUgx: 7200 }, { id: 'comfort', name: 'Comfort', etaMinutes: 6, baseFareUgx: 12500 }, { id: 'xl', name: 'XL', etaMinutes: 8, baseFareUgx: 18000 }],
      BODA: [{ id: 'boda', name: 'Boda', etaMinutes: 3, baseFareUgx: 2400 }],
    },
    pricing: {
      RIDE: pricing('Kenya', 'RIDE', { baseFareUgx: 5000, minimumFareUgx: 6000, perKmUgx: 1350, perMinuteUgx: 190, bookingFeeUgx: 600 }),
      BODA: pricing('Kenya', 'BODA', { baseFareUgx: 1500, minimumFareUgx: 2200, perKmUgx: 580, perMinuteUgx: 90, bookingFeeUgx: 220 }),
    },
    mobilityPlaces:[{id:'home',label:'Home',address:'Save your home address',latitude:-1.2864,longitude:36.8172,kind:'home'},{id:'work',label:'Work',address:'Save your work address',latitude:-1.267,longitude:36.81,kind:'work'},{id:'airport',label:'Jomo Kenyatta International Airport',address:'Nairobi',latitude:-1.3192,longitude:36.9278,kind:'airport'},{id:'westlands',label:'Westlands',address:'Nairobi',latitude:-1.2676,longitude:36.8108,kind:'popular'},{id:'kilimani',label:'Kilimani',address:'Nairobi',latitude:-1.2921,longitude:36.785,kind:'popular'},{id:'karen',label:'Karen',address:'Nairobi',latitude:-1.3192,longitude:36.7084,kind:'popular'},{id:'nairobi-cbd',label:'Nairobi CBD',address:'Nairobi',latitude:-1.2841,longitude:36.8155,kind:'popular'}],mobilityFeatures:{schoolRides:false,cityToCity:true,rideForSomeone:true,business:true},
  },
  Tanzania: {
    country: 'Tanzania', iso: 'TZ', dialCode: '+255', currency: 'TZS', currencyScaleFromUgx: 0.7,
    timezone: 'Africa/Dar_es_Salaam', primaryCity: 'Dar es Salaam', mobileMoney: ['M-Pesa', 'Airtel Money'],
    map: {
      countryRegion: { latitude: -6.15, longitude: 35.25, latitudeDelta: 10.6, longitudeDelta: 9.2 },
      primaryCityRegion: { latitude: -6.7924, longitude: 39.2083, latitudeDelta: 0.12, longitudeDelta: 0.105 },
      routePoints: [{ latitude: -6.7924, longitude: 39.2083 }, { latitude: -6.781, longitude: 39.222 }, { latitude: -6.768, longitude: 39.237 }],
    },
    services: { rides: true, boda: true },
    products: {
      RIDE: [{ id: 'economy', name: 'Economy', etaMinutes: 5, baseFareUgx: 7000 }, { id: 'comfort', name: 'Comfort', etaMinutes: 7, baseFareUgx: 12000 }, { id: 'xl', name: 'XL', etaMinutes: 9, baseFareUgx: 17500 }],
      BODA: [{ id: 'boda', name: 'Boda', etaMinutes: 3, baseFareUgx: 2200 }],
    },
    pricing: {
      RIDE: pricing('Tanzania', 'RIDE', { baseFareUgx: 4800, minimumFareUgx: 5600, perKmUgx: 1280, perMinuteUgx: 185, bookingFeeUgx: 550 }),
      BODA: pricing('Tanzania', 'BODA', { baseFareUgx: 1400, minimumFareUgx: 2000, perKmUgx: 540, perMinuteUgx: 85, bookingFeeUgx: 210 }),
    },
    mobilityPlaces:[{id:'home',label:'Home',address:'Save your home address',latitude:-6.7924,longitude:39.2083,kind:'home'},{id:'work',label:'Work',address:'Save your work address',latitude:-6.78,longitude:39.23,kind:'work'},{id:'airport',label:'Julius Nyerere International Airport',address:'Dar es Salaam',latitude:-6.8781,longitude:39.2026,kind:'airport'},{id:'masaki',label:'Masaki',address:'Dar es Salaam',latitude:-6.746,longitude:39.281,kind:'popular'},{id:'oyster-bay',label:'Oyster Bay',address:'Dar es Salaam',latitude:-6.77,longitude:39.283,kind:'popular'},{id:'mikocheni',label:'Mikocheni',address:'Dar es Salaam',latitude:-6.766,longitude:39.229,kind:'popular'},{id:'city-centre',label:'City Centre',address:'Dar es Salaam',latitude:-6.816,longitude:39.289,kind:'popular'}],mobilityFeatures:{schoolRides:false,cityToCity:true,rideForSomeone:true,business:true},
  },
};

export function marketConfig(country: string): MarketConfig {
  return MARKET_CONFIG[country as SupportedCountry] ?? MARKET_CONFIG.Uganda;
}

export function marketCities(country: string): string[] {
  return marketContent(country).cities;
}

export function mobilityProducts(country: string, mode: VehicleMode): MobilityProductConfig[] {
  const config = marketConfig(country);
  return config.services[mode === 'BODA' ? 'boda' : 'rides'] ? config.products[mode] : [];
}

export function mobilityPricing(country: string, mode: VehicleMode): MobilityPricingConfig {
  return marketConfig(country).pricing[mode];
}

export function mobilityPlaces(country:string):MobilityPlaceConfig[]{return marketConfig(country).mobilityPlaces;}

// Live events are intentionally empty until supplied by the CMS. The contract
// prevents fixture concerts or availability claims from leaking into production.
export function mobilityEvents(_country:string,_city:string,_mode:VehicleMode):MobilityEventConfig[]{return [];}
