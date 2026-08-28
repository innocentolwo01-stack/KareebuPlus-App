import type { ImageSourcePropType } from 'react-native';
import { assets } from '../assets';
import type { RideId } from '../types';

export type MobilityVisual={image?:ImageSourcePropType;fallback:'car-hatchback'|'car-sports'|'car-estate'|'motorbike';scale:number;offsetX?:number;offsetY?:number;label:string};

export const MOBILITY_VISUALS={
  'mobility.rides.economy':{image:require('../../assets/kareebu-plus/rides-home/economy-car-v2.png'),fallback:'car-hatchback',scale:1.12,offsetY:2,label:'Photorealistic compact economy hatchback'},
  'mobility.rides.comfort':{image:require('../../assets/kareebu-plus/rides-home/comfort-car-v2.png'),fallback:'car-sports',scale:1.18,offsetY:2,label:'Photorealistic premium comfort sedan'},
  'mobility.rides.xl':{image:require('../../assets/kareebu-plus/rides-home/xl-car-v2.png'),fallback:'car-estate',scale:1.18,label:'Photorealistic large SUV or MPV'},
  'mobility.boda.standard':{image:assets.service.boda,fallback:'motorbike',scale:1.24,offsetX:1,offsetY:1,label:'Kareebu Boda motorcycle'},
} satisfies Record<string,MobilityVisual>;

export function mobilityVisual(rideId:RideId):MobilityVisual{
  if(rideId==='boda')return MOBILITY_VISUALS['mobility.boda.standard'];
  if(rideId==='comfort')return MOBILITY_VISUALS['mobility.rides.comfort'];
  if(rideId==='xl')return MOBILITY_VISUALS['mobility.rides.xl'];
  return MOBILITY_VISUALS['mobility.rides.economy'];
}
