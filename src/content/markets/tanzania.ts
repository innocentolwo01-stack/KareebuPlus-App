import type { MarketContentPack } from './types';

export const tanzaniaContent: MarketContentPack = {
  country: 'Tanzania',
  cities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya'],
  localPlaces: ['City Centre', 'Masaki', 'Mikocheni', 'Mbezi', 'Mlimani City', 'Julius Nyerere Airport'],
  rideDestinations: [
    { label: 'Bagamoyo', detail: 'Coastal Tanzania' },
    { label: 'Morogoro', detail: 'Eastern Tanzania' },
  ],
  restaurantReferences: [],
  storeReferences: ['Shoppers Supermarket'],
  categoryOrder: ['African', 'Tanzanian', 'Grill', 'Chicken', 'Indian', 'Pizza', 'Burgers', 'Healthy'],
  ridePromotionIds: ['rides-tanzania-city', 'rides-tanzania-airport'],
  bodaPromotionIds: ['boda-tanzania-traffic'],
  fixtureNotice: 'Reference fixtures only · partnership and live availability are not confirmed',
};
