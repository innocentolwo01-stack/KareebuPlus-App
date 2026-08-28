import type { Screen } from '../types';
import type { ServicePreference } from '../preferences';
import type { SupportedCountry } from '../markets/config';
import type { VehicleMode } from '../ride/vehicle';
import type { AppEngineSectionDefinition } from '../appEngine/types';
import { featureEnabled } from '../policy/featureFlags';

export type ServiceGroup = 'Mobility' | 'Food & Shopping' | 'Delivery' | 'Home & Services' | 'Money' | 'Lifestyle' | 'Kareebu';

export type KareebuServiceDefinition = {
  id: string;
  label: string;
  description: string;
  visualKey: string;
  route: Screen;
  marketAvailability: SupportedCountry[];
  enabled: boolean;
  sortOrder: number;
  homeCarousel: boolean;
  allServices?: boolean;
  analyticsKey: string;
  group: ServiceGroup;
  preference?: ServicePreference;
  vehicleMode?: VehicleMode;
  shopCategory?: string;
  badge?: string;
};

const EAST_AFRICA: SupportedCountry[] = ['Uganda', 'Kenya', 'Tanzania'];

export const KAREEBU_SERVICE_REGISTRY: readonly KareebuServiceDefinition[] = [
  {id:'rides',label:'Rides',description:'Cars for everyday trips',visualKey:'rides',route:'mobilityHome',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:1,homeCarousel:true,analyticsKey:'rides',group:'Mobility',preference:'rides',vehicleMode:'RIDE'},
  {id:'food',label:'Food',description:'Restaurants and delivery',visualKey:'food',route:'food',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:2,homeCarousel:true,analyticsKey:'food',group:'Food & Shopping',preference:'food'},
  {id:'groceries',label:'Groceries',description:'Fresh and everyday essentials',visualKey:'groceries',route:'groceries',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:3,homeCarousel:true,analyticsKey:'groceries',group:'Food & Shopping',preference:'shopping',shopCategory:'Groceries'},
  {id:'pharmacy',label:'Pharmacy',description:'Medicine and wellness',visualKey:'pharmacy',route:'pharmacyHome',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:4,homeCarousel:true,analyticsKey:'pharmacy',group:'Food & Shopping',preference:'shopping',shopCategory:'Pharmacy'},
  {id:'boda',label:'Boda',description:'Motorcycle rides',visualKey:'boda',route:'mobilityHome',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:5,homeCarousel:true,analyticsKey:'boda',group:'Mobility',preference:'rides',vehicleMode:'BODA'},
  {id:'shops',label:'Shops',description:'Local stores and products',visualKey:'shops',route:'shops',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:6,homeCarousel:true,analyticsKey:'shops',group:'Food & Shopping',preference:'shopping',shopCategory:'All'},
  {id:'send',label:'Send',description:'Parcel and document delivery',visualKey:'send',route:'parcel',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:7,homeCarousel:true,analyticsKey:'send',group:'Delivery',preference:'deliveries'},
  {id:'more',label:'More',description:'See every Kareebu service',visualKey:'more',route:'services',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:8,homeCarousel:true,allServices:false,analyticsKey:'more',group:'Kareebu'},

  {id:'home-care',label:'Home & Care',description:'Cleaning and help at home',visualKey:'homeCare',route:'homeCare',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:9,homeCarousel:true,analyticsKey:'home_care',group:'Home & Services'},
  {id:'pay',label:'Pay',description:'Balance, transfers and bills',visualKey:'pay',route:'wallet',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:10,homeCarousel:true,analyticsKey:'pay',group:'Money'},
  {id:'dineout',label:'DineOut',description:'Plan a restaurant visit',visualKey:'dineout',route:'dineOut',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:11,homeCarousel:true,analyticsKey:'dineout',group:'Lifestyle'},
  {id:'go-out',label:'Go Out',description:'Discover places nearby',visualKey:'goOut',route:'exploreHub',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:12,homeCarousel:true,analyticsKey:'go_out',group:'Lifestyle'},
  {id:'fix',label:'Fix',description:'Repairs and maintenance',visualKey:'fix',route:'fix',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:13,homeCarousel:true,analyticsKey:'fix',group:'Home & Services'},
  {id:'rentals',label:'Rentals',description:'Cars and vans',visualKey:'rides',route:'rentals',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:14,homeCarousel:true,analyticsKey:'rentals',group:'Mobility'},
  {id:'for-good',label:'For Good',description:'Support local causes',visualKey:'forGood',route:'donations',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:15,homeCarousel:true,analyticsKey:'for_good',group:'Kareebu'},
  {id:'rewards',label:'Rewards',description:'Earn and redeem points',visualKey:'rewards',route:'rewards',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:16,homeCarousel:true,analyticsKey:'rewards',group:'Kareebu'},
  {id:'global',label:'Kareebu Global',description:'International products, paid locally',visualKey:'shops',route:'globalHome',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:17,homeCarousel:false,allServices:true,analyticsKey:'global',group:'Food & Shopping',badge:'GLOBAL'},

  {id:'order-anything',label:'Order anything',description:'Ask Kareebu to find and deliver an item',visualKey:'shops',route:'orderAnything',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:20,homeCarousel:false,analyticsKey:'order_anything',group:'Delivery'},
  {id:'send-money',label:'Send money',description:'Transfer money to a contact',visualKey:'pay',route:'paySend',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:21,homeCarousel:false,analyticsKey:'send_money',group:'Money'},
  {id:'pay-bills',label:'Pay bills',description:'Utilities, TV and internet',visualKey:'pay',route:'payBills',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:22,homeCarousel:false,analyticsKey:'pay_bills',group:'Money'},
  {id:'recharge',label:'Mobile recharge',description:'Airtime and mobile services',visualKey:'pay',route:'payRecharge',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:23,homeCarousel:false,analyticsKey:'recharge',group:'Money'},
  {id:'services',label:'Local services',description:'Cleaning, beauty and moving help',visualKey:'homeServices',route:'serviceMarketplace',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:24,homeCarousel:false,analyticsKey:'local_services',group:'Home & Services'},
  {id:'plus',label:'Kareebu+',description:'Membership and benefits',visualKey:'more',route:'plusManage',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:25,homeCarousel:false,analyticsKey:'plus',group:'Kareebu'},
  {id:'support',label:'Help & support',description:'Help with any Kareebu service',visualKey:'support',route:'support',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:26,homeCarousel:false,analyticsKey:'support',group:'Kareebu'},
  {id:'assistant',label:'Kareebu AI',description:'Ask for services in your own words',visualKey:'more',route:'assistant',marketAvailability:EAST_AFRICA,enabled:true,sortOrder:27,homeCarousel:false,analyticsKey:'assistant',group:'Kareebu'},
];

const POLICY_FEATURE_FOR_SERVICE:Partial<Record<string, Parameters<typeof featureEnabled>[1]>>={rides:'rides',boda:'boda',send:'send',global:'global_browse',pay:'mobile_money','send-money':'pay_transfers'};

export function servicesForMarket(country: string, homeOnly = false): KareebuServiceDefinition[] {
  return KAREEBU_SERVICE_REGISTRY
    .filter(item => {
      const policyFeature=POLICY_FEATURE_FOR_SERVICE[item.id];
      const policyAllows=!policyFeature || featureEnabled(country,policyFeature);
      return item.enabled && policyAllows && item.marketAvailability.includes(country as SupportedCountry) && (!homeOnly || item.homeCarousel) && (homeOnly || item.allServices !== false);
    })
    .sort((a,b)=>a.sortOrder-b.sortOrder);
}

export function homeServiceCarouselSection(country: string): AppEngineSectionDefinition {
  const items=servicesForMarket(country,true);
  return {id:'home-primary-services',type:'service-tile-carousel',layout:'carousel',enabled:true,priority:1000,service:'home',items:items.map(item=>({id:item.id,title:item.label,subtitle:item.description,visualKey:`services.${item.visualKey}`,route:{screen:item.route},data:{analyticsKey:item.analyticsKey,badge:item.badge}})),targeting:{countries:[country]},data:{rows:2,visibleColumns:3,registryValidated:true}};
}
