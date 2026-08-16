import type { KareebuCanonicalRoute, KareebuFeatureId } from './types';

const PREFIX_MAP: Array<[string, KareebuFeatureId, string]> = [
  ['careem://food.careem.com/app/food-discovery-home/discover', 'food', '/food'],
  ['careem://food.careem.com/app/food-menu/menu', 'food', '/food/menu'],
  ['careem://food.careem.com/search', 'food', '/food/search'],
  ['careem://food.careem.com/restaurants/', 'food', '/food/restaurant'],
  ['careem://food.careem.com/merchants/', 'food', '/food/merchant'],
  ['careem://bookaride', 'rides', '/rides/book'],
  ['careem://gmm-bookaride', 'rides', '/rides/book'],
  ['careem://ridehailing.careem.com', 'rides', '/rides'],
  ['careem://rides.careem.com', 'rides', '/rides'],
  ['careem://shops.careem.com', 'shops', '/shops'],
  ['careem://pay.careem.com', 'pay', '/pay'],
  ['careem://subscription.careem.com', 'plus', '/plus'],
  ['careem://identity.careem.com', 'account', '/account'],
  ['careem://care.careem.com', 'support', '/support'],
  ['careem://home.careem.com/ordertracking?service=food', 'food', '/food/order-tracking'],
  ['careem://home.careem.com/ordertracking?service=rides', 'rides', '/rides/order-tracking'],
  ['careem://home.careem.com', 'home', '/'],
  ['careem://app.careem.com/home', 'home', '/'],
  ['careem://discovery.careem.com', 'discovery', '/discovery'],
];

export function resolveCareemDonorRoute(url: string): KareebuCanonicalRoute | null {
  const match = PREFIX_MAP.find(([prefix]) => url.startsWith(prefix));
  if (!match) return null;
  const [, feature, path] = match;
  return { id: `${feature}:${path}`, feature, path, source: url };
}
