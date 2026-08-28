import type { MarketContentPack } from './types';

export const kenyaContent: MarketContentPack = {
  country: 'Kenya',
  cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
  localPlaces: ['Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'JKIA'],
  rideDestinations: [
    { label: 'Naivasha', detail: 'Rift Valley' },
    { label: 'Nakuru', detail: 'Rift Valley' },
  ],
  restaurantReferences: ['Java House Kenya', 'KFC Kenya'],
  storeReferences: ['Naivas', 'Quickmart', 'Carrefour Kenya'],
  categoryOrder: ['African', 'Kenyan', 'Grill', 'Chicken', 'Indian', 'Pizza', 'Burgers', 'Healthy'],
  ridePromotionIds: ['rides-kenya-city', 'rides-kenya-airport'],
  bodaPromotionIds: ['boda-kenya-traffic'],
  fixtureNotice: 'Reference fixtures only · partnership and live availability are not confirmed',
};
