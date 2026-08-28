export type MarketContentPack = {
  country: 'Uganda' | 'Kenya' | 'Tanzania';
  cities: string[];
  localPlaces: string[];
  rideDestinations: Array<{ label: string; detail: string }>;
  restaurantReferences: string[];
  storeReferences: string[];
  categoryOrder: string[];
  ridePromotionIds: string[];
  bodaPromotionIds: string[];
  fixtureNotice: string;
};
