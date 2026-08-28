import type { ImageSourcePropType } from 'react-native';

/** Approved Go Out recreation artwork. Keep these imports centralized so the
 * landing surface never falls back to unrelated category or promo imagery. */
export const goOutAssets = {
  hero: require('../../assets/kareebu-plus/explore/goout/01_goout_hero_explore_kampala.png') as ImageSourcePropType,
  category: {
    attractions: require('../../assets/kareebu-plus/explore/goout/02_category_attractions.png') as ImageSourcePropType,
    wellness: require('../../assets/kareebu-plus/explore/goout/03_category_spa_wellness.png') as ImageSourcePropType,
    themeParks: require('../../assets/kareebu-plus/explore/goout/04_category_theme_parks.png') as ImageSourcePropType,
    kids: require('../../assets/kareebu-plus/explore/goout/05_category_kids_activities.png') as ImageSourcePropType,
    dining: require('../../assets/kareebu-plus/explore/goout/06_category_restaurants_dining.png') as ImageSourcePropType,
    nightlife: require('../../assets/kareebu-plus/explore/goout/07_category_nightlife.png') as ImageSourcePropType,
  },
  featured: {
    wellness: require('../../assets/kareebu-plus/explore/goout/08_featured_relax_recharge.png') as ImageSourcePropType,
    family: require('../../assets/kareebu-plus/explore/goout/09_featured_family_fun.png') as ImageSourcePropType,
  },
  benefits: require('../../assets/kareebu-plus/explore/goout/10_kareebu_plus_benefits.png') as ImageSourcePropType,
  venue: {
    lakeside: require('../../assets/kareebu-plus/explore/goout/11_venue_lakeside_restaurant.png') as ImageSourcePropType,
  },
} as const;
