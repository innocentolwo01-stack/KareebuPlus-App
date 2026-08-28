import type { DineOutCollectionKind } from './types';

export type DineOutSession={collectionId:string;collectionTitle:string;collectionKind:DineOutCollectionKind;collectionQuery:string;restaurantId:string;returnScreen:'dineOut'|'dineOutCollection'|'exploreHub';searchQuery:string;filters:string[];homeScrollOffset:number;reservationIntent?:{date:string;time:string;guests:number;status:'enquiry-sent'}};
const state:DineOutSession={collectionId:'',collectionTitle:'',collectionKind:'category',collectionQuery:'',restaurantId:'',returnScreen:'dineOut',searchQuery:'',filters:[],homeScrollOffset:0};
export const dineOutSession={
  read:()=>state,
  openCollection:(input:Pick<DineOutSession,'collectionId'|'collectionTitle'|'collectionKind'|'collectionQuery'>)=>Object.assign(state,input,{returnScreen:'dineOut' as const}),
  openRestaurant:(restaurantId:string,returnScreen:'dineOut'|'dineOutCollection'|'exploreHub')=>Object.assign(state,{restaurantId,returnScreen}),
  setSearch:(searchQuery:string)=>{state.searchQuery=searchQuery},
  setFilters:(filters:string[])=>{state.filters=filters},
  setHomeScrollOffset:(homeScrollOffset:number)=>{state.homeScrollOffset=homeScrollOffset},
  setReservationIntent:(reservationIntent:DineOutSession['reservationIntent'])=>{state.reservationIntent=reservationIntent},
};
