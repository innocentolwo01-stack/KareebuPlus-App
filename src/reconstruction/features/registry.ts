import type { DonorFeatureSpec } from '../core/types';

export const KAREEBU_DONOR_FEATURES: DonorFeatureSpec[] = [
  {"id": "home", "donorModule": "superapp", "kareebuName": "Kareebu Home", "status": "preserve-and-enhance", "donorEntryPoints": ["careem://app.careem.com/home", "careem://home.careem.com"], "backendPolicy": "keep-kareebu"},
  {"id": "rides", "donorModule": "ridehail", "kareebuName": "Kareebu Rides", "status": "preserve-and-enhance", "donorEntryPoints": ["careem://bookaride", "careem://gmm-bookaride", "careem://ridehailing.careem.com/gmm-bookaride"], "backendPolicy": "keep-kareebu"},
  {"id": "rides-legacy", "donorModule": "rides", "kareebuName": "Kareebu Rides compatibility", "status": "reference-only", "donorEntryPoints": ["careem://rides.careem.com"], "backendPolicy": "none"},
  {"id": "food", "donorModule": "food", "kareebuName": "Kareebu Food", "status": "active-reconstruction", "donorEntryPoints": ["careem://food.careem.com/app/food-discovery-home/discover", "careem://food.careem.com/search", "careem://food.careem.com/app/food-menu/menu"], "backendPolicy": "keep-kareebu"},
  {"id": "shops", "donorModule": "shops", "kareebuName": "Kareebu Shops", "status": "reconstruct", "donorEntryPoints": ["careem://shops.careem.com/actions/address"], "backendPolicy": "keep-kareebu"},
  {"id": "pay", "donorModule": "pay", "kareebuName": "Kareebu Pay", "status": "reconstruct-backend-replacement", "donorEntryPoints": ["careem://pay.careem.com/pay_home_sa", "careem://pay.careem.com/p2p", "careem://pay.careem.com/topup-credit"], "backendPolicy": "replace-careem"},
  {"id": "plus", "donorModule": "subscription", "kareebuName": "Kareebu+", "status": "reconstruct", "donorEntryPoints": ["careem://subscription.careem.com"], "backendPolicy": "keep-kareebu"},
  {"id": "account", "donorModule": "identity", "kareebuName": "Kareebu Account", "status": "reconstruct-backend-replacement", "donorEntryPoints": ["careem://identity.careem.com/settings/", "careem://identity.careem.com/update/profile", "careem://identity.careem.com/security"], "backendPolicy": "replace-careem"},
  {"id": "auth", "donorModule": "auth", "kareebuName": "Kareebu Authentication", "status": "reconstruct-backend-replacement", "donorEntryPoints": ["careem://identity.careem.com/signin/", "careem://identity.careem.com/customer/onboard"], "backendPolicy": "replace-careem"},
  {"id": "explore", "donorModule": "explore", "kareebuName": "Kareebu Explore", "status": "reconstruct", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "support", "donorModule": "care", "kareebuName": "Kareebu Support", "status": "reconstruct", "donorEntryPoints": ["careem://care.careem.com/unifiedhelp", "careem://care.careem.com/supportinbox"], "backendPolicy": "keep-kareebu"},
  {"id": "chat", "donorModule": "chat", "kareebuName": "Kareebu Chat", "status": "reconstruct-backend-replacement", "donorEntryPoints": [], "backendPolicy": "replace-careem"},
  {"id": "order-anything", "donorModule": "orderanything", "kareebuName": "Kareebu Send/Order Anything", "status": "reconstruct", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "deliveries", "donorModule": "deliveries", "kareebuName": "Kareebu Delivery", "status": "reconstruct", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "bike", "donorModule": "bike", "kareebuName": "Kareebu Bike/Micromobility", "status": "optional", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "donations", "donorModule": "donations", "kareebuName": "Kareebu Donations", "status": "optional", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "locations", "donorModule": "globalexp", "kareebuName": "Kareebu Locations", "status": "reconstruct-backend-replacement", "donorEntryPoints": [], "backendPolicy": "replace-careem"},
  {"id": "discovery", "donorModule": "discovery", "kareebuName": "Kareebu Discovery Engine", "status": "reconstruct", "donorEntryPoints": [], "backendPolicy": "keep-kareebu"},
  {"id": "appengine", "donorModule": "appengine", "kareebuName": "Kareebu Widget Engine", "status": "core-architecture", "donorEntryPoints": [], "backendPolicy": "none"},
];

export function getDonorFeature(id: DonorFeatureSpec['id']) { return KAREEBU_DONOR_FEATURES.find((feature) => feature.id === id); }
