import {
  categoryBannerAssets,
  categoryBannerById,
  type CategoryBannerAsset,
  type CategoryBannerId,
} from './categoryBannerAssets';
import { kareebuBannerRegistry, type KareebuBannerAsset } from './kareebuBannerRegistry';

export type CategoryBannerDomain =
  | 'food'
  | 'groceries'
  | 'pharmacy'
  | 'fashion'
  | 'beauty'
  | 'electronics'
  | 'home-care'
  | 'goout'
  | 'send';

const normalise = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-');

const prefixByDomain: Record<CategoryBannerDomain, string> = {
  food: 'food.',
  groceries: 'groceries.',
  pharmacy: 'pharmacy.',
  fashion: 'fashion_beauty.',
  beauty: 'fashion_beauty.',
  electronics: 'electronics.',
  'home-care': 'home_care.',
  goout: '07_go_out.',
  send: 'send.',
};

const mainByDomain: Record<CategoryBannerDomain, CategoryBannerAsset | KareebuBannerAsset> = {
  food: kareebuBannerRegistry.category.foodDelivery,
  groceries: kareebuBannerRegistry.category.groceriesEssentials,
  pharmacy: kareebuBannerRegistry.category.pharmacyHealth,
  fashion: kareebuBannerRegistry.category.fashion,
  beauty: kareebuBannerRegistry.category.beautyWellness,
  electronics: kareebuBannerRegistry.category.electronics,
  'home-care': kareebuBannerRegistry.category.homeServices,
  goout: categoryBannerAssets.main.goOut,
  send: kareebuBannerRegistry.category.parcelDelivery,
};

const aliasIds = {
  'food.healthy': 'food.healthy_food',
  'food.african': 'food.african_food',
  'food.indian': 'food.indian_food',
  'food.breakfast': 'food.breakfast_brunch',
  'food.local-favourites': 'food.local_ugandan_food',
  'food.ugandan': 'food.local_ugandan_food',
  'food.local-dishes': 'food.local_ugandan_food',
  'food.grill': 'food.grills_bbq',
  'food.grills': 'food.grills_bbq',
  'food.desserts': 'food.desserts_treats',
  'food.cafes': 'food.cafes_coffee',
  'food.coffee': 'food.cafes_coffee',

  'groceries.meat': 'groceries.meat_fish',
  'groceries.fish-seafood': 'groceries.meat_fish',
  'groceries.dairy': 'groceries.dairy_eggs',
  'groceries.rice-pasta-pulses': 'groceries.pantry_staples',
  'groceries.cooking': 'groceries.pantry_staples',
  'groceries.beverages': 'groceries.drinks',
  'groceries.water-beverages': 'groceries.drinks',
  'groceries.snacks': 'groceries.snacks_sweets',
  'groceries.frozen': 'groceries.frozen_foods',
  'groceries.household': 'groceries.household_cleaning',
  'groceries.baby': 'groceries.baby_child',
  'groceries.health': 'groceries.organic_healthy',

  'pharmacy.medicines-health': 'pharmacy.medicines',
  'pharmacy.vitamins': 'pharmacy.vitamins_supplements',
  'pharmacy.allergy': 'pharmacy.allergy_care',
  'pharmacy.digestive': 'pharmacy.digestive_health',
  'pharmacy.baby-child': 'pharmacy.mother_baby',
  'pharmacy.skincare': 'pharmacy.skin_care',
  'pharmacy.haircare': 'pharmacy.personal_care',

  'fashion.women': 'fashion_beauty.womens_fashion',
  'fashion.men': 'fashion_beauty.mens_fashion',
  'fashion.kids': 'fashion_beauty.kids_fashion',
  'fashion.beauty': 'fashion_beauty.makeup',
  'fashion.haircare': 'fashion_beauty.hair_care',
  'beauty.hair': 'fashion_beauty.hair_care',
  'beauty.tools': 'fashion_beauty.beauty_tools',
  'beauty.personal-care': 'fashion_beauty.skincare',

  'electronics.phones': 'electronics.smartphones',
  'electronics.computers': 'electronics.laptops_computers',
  'electronics.computing': 'electronics.laptops_computers',
  'electronics.tv': 'electronics.televisions',
  'electronics.tvs': 'electronics.televisions',
  'electronics.audio': 'electronics.audio_headphones',
  'electronics.wearables': 'electronics.smartwatches',
  'electronics.accessories': 'electronics.phone_accessories',
  'electronics.appliances': 'electronics.home_appliances',
  'electronics.power': 'electronics.power_charging',

  'home-care.home-cleaning': 'home_care.cleaning',
  'home-care.electrician': 'home_care.electrical',
  'home-care.ac': 'home_care.ac_service',
  'home-care.moving-help': 'home_care.moving',
  'home-care.beauty-home': 'home_care.beauty_at_home',

  'goout.attractions': '07_go_out.attractions_leisure',
  'goout.things-to-do': '07_go_out.attractions_leisure',
  'goout.wellness': '07_go_out.spa_wellness',
  'goout.theme-parks': '07_go_out.theme_parks_fun',
  'goout.fun': '07_go_out.theme_parks_fun',
  'goout.kids': '07_go_out.kids_activities',
  'goout.dining': '07_go_out.restaurants_dining',
  'goout.outdoor': '07_go_out.parks_outdoors',
  'goout.outdoors': '07_go_out.parks_outdoors',
  'goout.shopping': '07_go_out.shopping_malls',

  'send.documents': 'send.send_documents',
  'send.small-parcel': 'send.send_parcel',
  'send.medium-parcel': 'send.send_parcel',
  'send.large-parcel': 'send.send_parcel',
  'send.gift': 'send.deliver_gift',
  'send.business': 'send.business_delivery',
} as const satisfies Record<string, CategoryBannerId>;

const uploadReadyByCandidate: Partial<Record<string, KareebuBannerAsset>> = {
  'food.cafes': kareebuBannerRegistry.category.cafesCoffee,
  'food.cafes-coffee': kareebuBannerRegistry.category.cafesCoffee,
  'food.coffee': kareebuBannerRegistry.category.cafesCoffee,
  'food.local-favourites': kareebuBannerRegistry.category.localUgandanFood,
  'food.local-ugandan-food': kareebuBannerRegistry.category.localUgandanFood,
  'food.ugandan': kareebuBannerRegistry.category.localUgandanFood,
  'food.local-dishes': kareebuBannerRegistry.category.localUgandanFood,
};

const categoryEntries = Object.entries(categoryBannerById).filter(
  ([id]) => !id.startsWith('00_main.'),
) as Array<[CategoryBannerId, CategoryBannerAsset]>;

export function mainCategoryBanner(
  domain: CategoryBannerDomain,
): CategoryBannerAsset | KareebuBannerAsset {
  return mainByDomain[domain];
}

export function categoryBannerFor({
  domain,
  id,
  title,
}: {
  domain: CategoryBannerDomain;
  id?: string;
  title?: string;
}): CategoryBannerAsset | KareebuBannerAsset {
  const prefix = prefixByDomain[domain];
  const candidates = [
    id ? normalise(id.split('.').pop() ?? id) : '',
    title ? normalise(title) : '',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const uploadReady = uploadReadyByCandidate[`${domain}.${candidate}`];
    if (uploadReady) return uploadReady;

    const aliasId = aliasIds[`${domain}.${candidate}` as keyof typeof aliasIds];
    const aliasedBanner = aliasId ? categoryBannerById[aliasId] : undefined;
    if (aliasedBanner) return aliasedBanner;

    const exact = categoryEntries.find(([semanticId, asset]) => {
      if (!semanticId.startsWith(prefix)) return false;
      const semanticSlug = normalise(semanticId.slice(prefix.length));
      return semanticSlug === candidate || normalise(asset.title) === candidate;
    });
    if (exact) return exact[1];
  }

  return mainByDomain[domain];
}
