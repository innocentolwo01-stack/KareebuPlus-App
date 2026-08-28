import type { MarketContentPack } from './types';

export const ugandaContent: MarketContentPack = {
  country: 'Uganda',
  cities: ['Kampala', 'Entebbe', 'Jinja', 'Wakiso', 'Mbarara', 'Gulu'],
  localPlaces: ['Kampala CBD', 'Kololo', 'Ntinda', 'Muyenga', 'Bugolobi', 'Naalya', 'Entebbe Airport'],
  rideDestinations: [
    { label: 'Entebbe', detail: 'Airport and lakeside' },
    { label: 'Jinja', detail: 'Eastern Uganda' },
  ],
  restaurantReferences: ['Café Javas'],
  storeReferences: ['Carrefour Uganda'],
  categoryOrder: ['African', 'Ugandan', 'Grill', 'Chicken', 'Indian', 'Pizza', 'Burgers', 'Healthy'],
  ridePromotionIds: ['rides-uganda-city', 'rides-uganda-airport'],
  bodaPromotionIds: ['boda-uganda-traffic'],
  fixtureNotice: 'Reference fixtures only · partnership and live availability are not confirmed',
};
