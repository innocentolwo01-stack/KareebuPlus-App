import type { VehicleMode } from './vehicle';
import type { MobilityEventConfig } from '../markets/config';

export type MobilityModuleType='map'|'destination'|'saved_places'|'popular_destinations'|'quick_actions'|'promotion'|'city_event'|'airport'|'schedule'|'plus'|'safety'|'recent';
export type MobilityLandingModule={id:string;type:MobilityModuleType;cmsSlot:string;mode:VehicleMode;priority:number;enabled:boolean;event?:MobilityEventConfig};

export const MOBILITY_PROMO_SLOTS={
  RIDE:['RIDES_MAP','RIDES_DESTINATION','RIDES_SAVED_PLACES','RIDES_HERO','RIDES_POPULAR_DESTINATIONS','RIDES_QUICK_ACTIONS','RIDES_EVENTS','RIDES_AIRPORT','RIDES_SCHEDULE','RIDES_RECENT','RIDES_PLUS'],
  BODA:['BODA_DESTINATION','BODA_QUICK_ACTIONS','BODA_HERO','BODA_PROMO_02','BODA_CITY_EVENT','BODA_VALUE','BODA_SAFETY','BODA_RECENT'],
} as const;

export function mobilityLandingModules(mode:VehicleMode,event?:MobilityEventConfig):MobilityLandingModule[]{
  const prefix=mode==='BODA'?'BODA':'RIDES';
  return [
    {id:`${prefix.toLowerCase()}-map`,type:'map',cmsSlot:`${prefix}_MAP`,mode,priority:110,enabled:true},
    {id:`${prefix.toLowerCase()}-destination`,type:'destination',cmsSlot:`${prefix}_DESTINATION`,mode,priority:100,enabled:true},
    {id:`${prefix.toLowerCase()}-saved`,type:'saved_places',cmsSlot:`${prefix}_SAVED_PLACES`,mode,priority:95,enabled:true},
    {id:`${prefix.toLowerCase()}-hero`,type:'promotion',cmsSlot:`${prefix}_HERO`,mode,priority:90,enabled:true},
    {id:`${prefix.toLowerCase()}-popular`,type:'popular_destinations',cmsSlot:`${prefix}_POPULAR_DESTINATIONS`,mode,priority:85,enabled:true},
    {id:`${prefix.toLowerCase()}-actions`,type:'quick_actions',cmsSlot:`${prefix}_QUICK_ACTIONS`,mode,priority:80,enabled:true},
    {id:`${prefix.toLowerCase()}-event`,type:'city_event',cmsSlot:`${prefix}_CITY_EVENT`,mode,priority:70,enabled:Boolean(event),event},
    {id:`${prefix.toLowerCase()}-airport`,type:'airport',cmsSlot:`${prefix}_AIRPORT`,mode,priority:60,enabled:true},
    {id:`${prefix.toLowerCase()}-schedule`,type:'schedule',cmsSlot:`${prefix}_SCHEDULE`,mode,priority:50,enabled:true},
    {id:`${prefix.toLowerCase()}-recent`,type:'recent',cmsSlot:`${prefix}_RECENT`,mode,priority:30,enabled:false},
    {id:`${prefix.toLowerCase()}-plus`,type:'plus',cmsSlot:`${prefix}_PLUS`,mode,priority:20,enabled:false},
  ];
}
