import type { ImageSourcePropType } from 'react-native';

export type DineOutCollectionKind='category'|'cuisine'|'guide'|'area'|'brand'|'highlight';
export type DineOutAvailability='open'|'closed'|'unknown';
export type DineOutMedia={image:ImageSourcePropType;alt:string;source:'kareebu-owned'|'merchant'|'cms'|'reference-fixture';rightsStatus:'owned'|'licensed'|'merchant-provided'|'reference-only'};
export type DineOutOffer={id:string;title:string;body:string;provider:'merchant'|'kareebu-plus'|'kareebu-pay'|'rewards'|'payment-partner';eligibilityKnown:boolean;startsAt?:string;endsAt?:string};
export type DineOutOpeningHours={day:number;opens:string;closes:string};
export type DineOutRestaurant={id:string;name:string;brand?:string;city:string;area:string;cuisines:string[];priceLevel:'$'|'$$'|'$$$';hero:DineOutMedia;gallery:DineOutMedia[];logo?:DineOutMedia;rating?:number;reviewCount?:number;ratingIsLive:false;openingHours?:DineOutOpeningHours[];availability:DineOutAvailability;offers:DineOutOffer[];kareebuPlus:false;reservationSupport:'none'|'enquiry'|'external'|'live';externalReservationProvider?:string;amenities:string[];editorialTags:string[];coordinates:{latitude:number;longitude:number};referenceFixture:true;partnerStatus:'unknown';liveAvailability:false;source:string;lastVerifiedAt:string};
export type DineOutDiscoveryItem={id:string;title:string;subtitle:string;kind:DineOutCollectionKind;visualKey?:string;image?:DineOutMedia;query:string};
export type DineOutHighlight={id:string;label:string;query:string};
export type DineOutMarketContent={country:'Uganda'|'Kenya'|'Tanzania';city:string;currency:'UGX'|'KES'|'TZS';areas:string[];categories:DineOutDiscoveryItem[];cuisines:DineOutDiscoveryItem[];guides:DineOutDiscoveryItem[];highlights:DineOutHighlight[];restaurants:DineOutRestaurant[];savings:DineOutOffer[]};
export type DineOutFeedState='loading'|'ready'|'empty'|'error';
