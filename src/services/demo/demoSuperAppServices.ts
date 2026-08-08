import { DEMO_RESTAURANTS, DEMO_SHOPS } from '../../demoData';
import type { Restaurant } from '../../features/food/domain';
import type { OrderSummary } from '../../features/orders/domain';
import type { Shop } from '../../features/shop/domain';
import type { SuperAppServices } from '../../core/services/contracts';

function currencyFor(country: string) {
  if (country === 'Kenya') return 'KES';
  if (country === 'Tanzania') return 'TZS';
  return 'UGX';
}

function restaurants(): Restaurant[] {
  return DEMO_RESTAURANTS.map((restaurant) => ({
    id: restaurant.id,
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    rating: restaurant.rating,
    reviews: restaurant.reviews,
    eta: restaurant.eta,
    deliveryFee: restaurant.deliveryFee,
    distance: restaurant.distance,
    offer: restaurant.offer,
    plus: restaurant.plus,
    categories: restaurant.categories,
    menu: restaurant.menu.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageKey: item.image,
      popular: item.popular,
      badge: item.badge,
    })),
  }));
}

function shops(country: string): Shop[] {
  const localIds =
    country === 'Kenya'
      ? new Set(['naivas', 'quickmart'])
      : country === 'Tanzania'
        ? new Set(['shoppers-tz', 'village-tz', 'breeze-tz'])
        : null;

  return DEMO_SHOPS.filter((shop) => !localIds || localIds.has(shop.id)).map((shop) => ({
    id: shop.id,
    name: shop.name,
    category: shop.category,
    rating: shop.rating,
    eta: shop.eta,
    minOrder: shop.minOrder,
    deliveryFee: shop.deliveryFee,
    deal: shop.deal,
    icon: shop.icon,
    tone: shop.tone,
  }));
}

export function createDemoSuperAppServices(): SuperAppServices {
  return {
    catalog: {
      async listRestaurants() {
        return restaurants();
      },
      async listShops(context) {
        return shops(context.country);
      },
    },
    orders: {
      async listOrders(context): Promise<OrderSummary[]> {
        const currency = currencyFor(context.country);
        return [
          {
            id: 'demo-food-order',
            kind: 'food',
            title: 'Restaurant order',
            status: 'preparing',
            total: 37000,
            currency,
            createdAt: new Date(0).toISOString(),
          },
          {
            id: 'demo-parcel-order',
            kind: 'parcel',
            title: 'Parcel delivery',
            status: 'in_transit',
            total: 12000,
            currency,
            createdAt: new Date(0).toISOString(),
          },
        ];
      },
    },
    parcels: {
      async quote(request) {
        const currency = currencyFor(request.country);
        const interCity = request.pickupCity !== request.destinationCity;
        const base = request.country === 'Kenya' ? 450 : request.country === 'Tanzania' ? 8000 : 6000;
        const amount = Math.round(base * (interCity ? 2 : 1) * (request.express ? 1.5 : 1));
        return { amount, currency, etaLabel: interCity ? 'Same day or next day' : '45–90 min' };
      },
    },
    rides: {
      async quote(request) {
        const currency = currencyFor(request.country);
        const base = request.mode === 'BODA' ? 2500 : 7000;
        return { amount: base, currency, etaMinutes: request.mode === 'BODA' ? 3 : 5 };
      },
    },
    wallet: {
      async getSnapshot(context) {
        return { balance: 52000, currency: currencyFor(context.country), updatedAt: new Date(0).toISOString() };
      },
    },
  };
}
