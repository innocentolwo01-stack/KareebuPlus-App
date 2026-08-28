import type { RideId } from '../types';
import type { VehicleMode } from './vehicle';
import { applyDemand, demandQuote, type DemandLevel } from '../pricing/demand';
import { mobilityPricing } from '../markets/config';

export type RideProduct = 'instant' | 'scheduled' | 'work' | 'school';

export type RidePlan = {
  product: RideProduct;
  scheduledLabel: string | null;
  days: string[];
  morningTime: string | null;
  returnTime: string | null;
  childName: string;
  schoolName: string;
  authorisedAdult: string;
};

export type CaptainOffer = {
  id: string;
  captainName: string;
  rating: number;
  completedTrips: number;
  etaMinutes: number;
  fare: number;
  vehicleMake: string;
  vehicleModel: string;
  colour: string;
  registration: string;
  verified: boolean;
  safetyEligible: boolean;
  isOnline: boolean;
  isRiding: boolean;
  distanceRemainingMeters: number;
  servicePreference: 'ride' | 'courier' | 'both';
};

export type RideFareBreakdown = {
  baseFare: number;
  demandAdjustment: number;
  demandMultiplier: number;
  demandLevel: DemandLevel;
  demandLabel: string;
  demandReason: string;
  bookingFee: number;
  priorityFee: number;
  membershipSaving: number;
  promoDiscount: number;
  total: number;
  estimated: boolean;
  isLive: boolean;
  source: 'market-fixture';
};

export type RideReceipt = {
  id: string;
  dateLabel: string;
  pickup: string;
  destination: string;
  rideName: string;
  captainName: string;
  vehicle: string;
  registration: string;
  paymentLabel: string;
  fare: RideFareBreakdown;
};

export const createRidePlan = (): RidePlan => ({
  product: 'instant',
  scheduledLabel: null,
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  morningTime: '07:30',
  returnTime: '16:30',
  childName: '',
  schoolName: '',
  authorisedAdult: '',
});

export function registrationFor(country: string, index: number): string {
  const ug = ['UAX 321P', 'UBE 882K', 'UBL 221D'];
  const ke = ['KDA 321P', 'KDG 882K', 'KDM 221D'];
  const tz = ['T 321 ARP', 'T 882 DKM', 'T 221 DLD'];
  const list = country === 'Kenya' ? ke : country === 'Tanzania' ? tz : ug;
  return list[index] ?? list[0];
}

export function captainOffers(baseFare: number, country: string, mode: VehicleMode): CaptainOffer[] {
  const boda = mode === 'BODA';
  return [
    {
      id: 'peter',
      captainName: 'Peter',
      rating: 4.9,
      completedTrips: 2430,
      etaMinutes: 3,
      fare: baseFare,
      vehicleMake: boda ? 'Bajaj' : 'Toyota',
      vehicleModel: boda ? 'Boxer 150' : 'Premio',
      colour: boda ? 'Black' : 'Silver',
      registration: registrationFor(country, 0),
      verified: true,
      safetyEligible: true,
      isOnline: true,
      isRiding: false,
      distanceRemainingMeters: 1200,
      servicePreference: 'both',
    },
    {
      id: 'james',
      captainName: 'James',
      rating: 4.8,
      completedTrips: 1814,
      etaMinutes: 5,
      fare: Math.max(1000, baseFare - 700),
      vehicleMake: boda ? 'TVS' : 'Toyota',
      vehicleModel: boda ? 'HLX 150' : 'Axio',
      colour: boda ? 'Red' : 'White',
      registration: registrationFor(country, 1),
      verified: true,
      safetyEligible: true,
      isOnline: true,
      isRiding: false,
      distanceRemainingMeters: 2100,
      servicePreference: 'ride',
    },
    {
      id: 'musa',
      captainName: 'Musa',
      rating: 4.7,
      completedTrips: 1290,
      etaMinutes: 2,
      fare: baseFare + 900,
      vehicleMake: boda ? 'Honda' : 'Toyota',
      vehicleModel: boda ? 'Ace 125' : 'Fielder',
      colour: boda ? 'Blue' : 'Black',
      registration: registrationFor(country, 2),
      verified: true,
      safetyEligible: false,
      isOnline: true,
      isRiding: false,
      distanceRemainingMeters: 900,
      servicePreference: 'both',
    },
  ];
}

export function rideFareBreakdown(params: {
  baseFare: number;
  offeredFare?: number | null;
  rideProduct: RideProduct;
  vehicleMode: VehicleMode;
  priority: boolean;
  member: boolean;
  promoCode?: string;
  activeRequests?: number;
  availableCaptains?: number;
  country?: string;
}): RideFareBreakdown {
  const baseFare = Math.round(params.offeredFare ?? params.baseFare);
  const quote = demandQuote(params.vehicleMode === 'BODA' ? 'boda' : 'ride', {
    activeRequests: params.activeRequests,
    availableProviders: params.availableCaptains,
    scheduled: params.rideProduct !== 'instant',
  });
  const demand = applyDemand(baseFare, quote);
  const demandAdjustment = demand.demandAdjustment;
  const pricing = mobilityPricing(params.country ?? 'Uganda', params.vehicleMode);
  const bookingFee = pricing.bookingFeeUgx;
  const priorityFee = params.priority ? Math.round(pricing.minimumFareUgx * 0.2) : 0;
  const membershipSaving = params.member ? Math.min(1200, Math.round(baseFare * 0.06)) : 0;
  const promoDiscount = (params.promoCode ?? '').trim().toUpperCase() === 'RIDE10' ? Math.min(2500, Math.round(baseFare * 0.1)) : 0;
  const total = Math.max(pricing.minimumFareUgx, baseFare + demandAdjustment + bookingFee + priorityFee - membershipSaving - promoDiscount);
  return { baseFare, demandAdjustment, demandMultiplier: quote.multiplier, demandLevel: quote.level, demandLabel: quote.label, demandReason: quote.reason, bookingFee, priorityFee, membershipSaving, promoDiscount, total, estimated: true, isLive: false, source: 'market-fixture' };
}

export function rideLabel(id: RideId): string {
  return id === 'boda' ? 'Boda' : id === 'economy' ? 'Economy' : id === 'comfort' ? 'Comfort' : id === 'xl' ? 'XL' : 'Delivery';
}
