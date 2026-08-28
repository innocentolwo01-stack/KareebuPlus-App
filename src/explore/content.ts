import type { ImageSourcePropType } from 'react-native';

import { dineOutContent } from '../dineout/content';
import { goOutAssets } from './gooutAssets';

export type ExploreCategoryId = 'dining' | 'attractions' | 'things' | 'wellness' | 'fun' | 'kids' | 'cinema' | 'events' | 'nightlife' | 'sports' | 'outdoors' | 'culture' | 'shopping' | 'experiences' | 'day-trips';
export type ExploreEntityType = 'place' | 'restaurant' | 'shopping' | 'experience' | 'event' | 'wellness' | 'provider' | 'attraction';

export type ExploreCategory = {
  id: ExploreCategoryId;
  title: string;
  image: ImageSourcePropType;
  tint: string;
  searchTerms: string[];
};

export type ExploreEntity = {
  id: string;
  name: string;
  entityType: ExploreEntityType;
  categories: ExploreCategoryId[];
  categoryLabel: string;
  area: string;
  city: string;
  image?: ImageSourcePropType;
  fallbackImage: ImageSourcePropType;
  rating?: number;
  sourceState: 'configured-reference' | 'merchant-provided';
  restaurantId?: string;
  searchTerms: string[];
};

export const EXPLORE_CATEGORIES: ExploreCategory[] = [
  { id: 'dining', title: 'Restaurants & Dining', image: require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'), tint: '#FFF1E7', searchTerms: ['dining', 'restaurant', 'restaurants', 'cafe', 'food', 'eat', 'drink'] },
  { id: 'attractions', title: 'Attractions', image: require('../../assets/kareebu-plus/country-landmarks/uganda.jpg'), tint: '#EEF4FA', searchTerms: ['attractions', 'landmarks', 'sights', 'wildlife', 'gardens'] },
  { id: 'things', title: 'Things to Do', image: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), tint: '#F0F5EE', searchTerms: ['things to do', 'activities', 'city discovery'] },
  { id: 'wellness', title: 'Spa & Wellness', image: require('../../assets/kareebu-plus/realistic-v9/beauty-at-home.jpg'), tint: '#EAF6F3', searchTerms: ['wellness', 'spa', 'massage', 'salon', 'gym', 'fitness'] },
  { id: 'fun', title: 'Theme Parks & Fun', image: require('../../assets/kareebu-plus/lifestyle-cutouts/service-go-out.png'), tint: '#FFF4D7', searchTerms: ['theme parks', 'fun', 'arcade', 'bowling', 'go karting', 'trampoline'] },
  { id: 'kids', title: 'Kids Activities', image: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), tint: '#F7F3EA', searchTerms: ['kids activities', 'family activities', 'soft play', 'playgrounds'] },
  { id: 'cinema', title: 'Cinema', image: require('../../assets/kareebu-plus/lifestyle-cutouts/service-go-out.png'), tint: '#F2EEFA', searchTerms: ['cinema', 'film', 'screening', 'theatre'] },
  { id: 'events', title: 'Events', image: require('../../assets/kareebu-plus/lifestyle-cutouts/service-go-out.png'), tint: '#FFF4D7', searchTerms: ['events', 'concerts', 'shows', 'entertainment venues'] },
  { id: 'nightlife', title: 'Nightlife', image: require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'), tint: '#EEF0F6', searchTerms: ['nightlife', 'bars', 'lounges', 'clubs', 'live music', 'rooftops'] },
  { id: 'sports', title: 'Sports & Recreation', image: require('../../assets/kareebu-plus/realistic-v9/sports.jpg'), tint: '#EFF9F2', searchTerms: ['sports', 'recreation', 'fitness', 'activities'] },
  { id: 'outdoors', title: 'Parks & Outdoors', image: require('../../assets/kareebu-plus/country-landmarks/uganda.jpg'), tint: '#EFF9F2', searchTerms: ['parks', 'outdoors', 'gardens', 'walking', 'cycling', 'nature'] },
  { id: 'culture', title: 'Museums & Culture', image: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), tint: '#F7F3EA', searchTerms: ['museum', 'museums', 'culture', 'galleries', 'heritage', 'historic places'] },
  { id: 'shopping', title: 'Shopping', image: require('../../assets/kareebu-plus/lifestyle-cutouts/service-shops.png'), tint: '#F2EEFA', searchTerms: ['shopping', 'market', 'markets', 'mall', 'retail'] },
  { id: 'experiences', title: 'Experiences', image: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), tint: '#EEF4FA', searchTerms: ['experiences', 'tours', 'classes', 'workshops', 'adventure'] },
  { id: 'day-trips', title: 'Day Trips', image: require('../../assets/kareebu-plus/country-landmarks/uganda.jpg'), tint: '#EFF9F2', searchTerms: ['day trips', 'day trip', 'excursions', 'tours'] },
];

const configuredUgandaPlaces: ExploreEntity[] = [
  {
    id: 'ug-serena', name: 'Kampala Serena Hotel', entityType: 'place', categories: ['dining'], categoryLabel: 'Hotel & dining', area: 'Nakasero', city: 'Kampala',
    fallbackImage: require('../../assets/kareebu-plus/lifestyle-cutouts/service-dineout.png'), sourceState: 'configured-reference', searchTerms: ['hotel', 'dining', 'nakasero'],
  },
  {
    id: 'ug-acacia-mall', name: 'Acacia Mall', entityType: 'shopping', categories: ['shopping'], categoryLabel: 'Shopping & entertainment', area: 'Kisementi', city: 'Kampala',
    fallbackImage: require('../../assets/kareebu-plus/lifestyle-cutouts/service-shops.png'), sourceState: 'configured-reference', searchTerms: ['mall', 'shopping', 'kisementi'],
  },
  {
    id: 'ug-ndere', name: 'Ndere Cultural Centre', entityType: 'experience', categories: ['things','culture','experiences'], categoryLabel: 'Culture & experiences', area: 'Ntinda', city: 'Kampala',
    fallbackImage: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), sourceState: 'configured-reference', searchTerms: ['culture', 'things to do', 'ntinda'],
  },
  {
    id: 'ug-museum', name: 'Uganda Museum', entityType: 'attraction', categories: ['things','attractions','culture'], categoryLabel: 'Museum & culture', area: 'Kitante', city: 'Kampala',
    fallbackImage: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), sourceState: 'configured-reference', searchTerms: ['museum', 'culture', 'things to do', 'kitante'],
  },
];

export function exploreContent(country: string, city: string): ExploreEntity[] {
  const restaurants = dineOutContent(country, city).restaurants.map<ExploreEntity>((restaurant) => ({
    id: `dineout-${restaurant.id}`,
    name: restaurant.name,
    entityType: 'restaurant',
    categories: ['dining'],
    categoryLabel: restaurant.cuisines.slice(0, 2).join(' · ') || 'Restaurant',
    area: restaurant.area,
    city: restaurant.city,
    // Reference fixtures intentionally do not present editorial campaign art as
    // venue photography. A CMS/merchant image can populate `image` once its
    // venue association and usage rights are known.
    image: restaurant.id === 'ug-lakeside'
      ? goOutAssets.venue.lakeside
      : restaurant.hero.rightsStatus === 'merchant-provided' ? restaurant.hero.image : undefined,
    fallbackImage: restaurant.id.length % 2 === 0
      ? require('../../assets/kareebu-plus/lifestyle-cutouts/service-food.png')
      : require('../../assets/kareebu-plus/lifestyle-cutouts/service-dineout.png'),
    rating: restaurant.rating,
    sourceState: restaurant.logo?.rightsStatus === 'merchant-provided' ? 'merchant-provided' : 'configured-reference',
    restaurantId: restaurant.id,
    searchTerms: [...restaurant.cuisines, ...restaurant.editorialTags, restaurant.area, 'dining', 'restaurant'],
  }));
  const localPlaces = country === 'Uganda' ? configuredUgandaPlaces.filter((place) => !city || place.city === city) : [];
  return [...restaurants, ...localPlaces];
}

export function searchExplore(entities: ExploreEntity[], query: string): ExploreEntity[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return entities;
  const matchingCategoryIds = EXPLORE_CATEGORIES
    .filter((category) => [category.title, ...category.searchTerms].some((term) => term.toLocaleLowerCase().includes(normalized) || normalized.includes(term.toLocaleLowerCase())))
    .map((category) => category.id);
  return entities.filter((entity) => {
    const searchable = [entity.name, entity.categoryLabel, entity.area, entity.city, ...entity.searchTerms].join(' ').toLocaleLowerCase();
    return searchable.includes(normalized) || entity.categories.some((category) => matchingCategoryIds.includes(category));
  });
}

export function categoryForQuery(query: string): ExploreCategory | undefined {
  const normalized = query.trim().toLocaleLowerCase();
  return EXPLORE_CATEGORIES.find((category) => category.title.toLocaleLowerCase() === normalized || category.searchTerms.some((term) => term.toLocaleLowerCase() === normalized));
}
