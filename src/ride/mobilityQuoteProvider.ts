import type { RideId } from '../types';
import type { VehicleMode } from './vehicle';
import { rideFareBreakdown, type RideFareBreakdown, type RideProduct } from './mobility';

export type MobilityBookingState='idle'|'searching_destination'|'destination_selected'|'quoting'|'ride_selected'|'confirming'|'requesting'|'matching'|'driver_assigned'|'driver_arriving'|'driver_arrived'|'trip_started'|'trip_completed'|'cancelled';
export type MobilityProductQuote={product:RideId;mode:VehicleMode;etaMinutes:number;fare:RideFareBreakdown;availability:'available'|'unavailable';source:'configured-fixture'|'live-provider'};
export type MobilityQuoteRequest={country:string;mode:VehicleMode;product:RideId;baseFare:number;etaMinutes:number;rideProduct:RideProduct;member:boolean;promoCode?:string};
export interface MobilityQuoteProvider{quote(request:MobilityQuoteRequest):Promise<MobilityProductQuote>;}

export function configuredMobilityQuote(request:MobilityQuoteRequest):MobilityProductQuote{return {product:request.product,mode:request.mode,etaMinutes:request.etaMinutes,fare:rideFareBreakdown({baseFare:request.baseFare,rideProduct:request.rideProduct,vehicleMode:request.mode,priority:false,member:request.member,promoCode:request.promoCode,country:request.country}),availability:'available',source:'configured-fixture'};}

// Production injects a provider backed by routing, supply, demand and promotions.
// Customers select the returned product; no customer-entered fare is accepted.
export const configuredMobilityQuoteProvider:MobilityQuoteProvider={quote:async request=>configuredMobilityQuote(request)};
