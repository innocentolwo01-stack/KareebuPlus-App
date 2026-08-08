import type { SuperAppServices } from '../../core/services/contracts';

function unavailable(feature: string): never {
  throw new Error(`Kareebu backend adapter is not connected for ${feature} yet.`);
}

export function createKareebuSuperAppServices(apiBaseUrl?: string): SuperAppServices {
  if (!apiBaseUrl) {
    return {
      catalog: { listRestaurants: async () => unavailable('catalog'), listShops: async () => unavailable('catalog') },
      orders: { listOrders: async () => unavailable('orders') },
      parcels: { quote: async () => unavailable('parcels') },
      rides: { quote: async () => unavailable('rides') },
      wallet: { getSnapshot: async () => unavailable('wallet') },
    };
  }

  const request = async <T,>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!response.ok) throw new Error(`Kareebu API ${path} failed with HTTP ${response.status}`);
    return response.json() as Promise<T>;
  };

  return {
    catalog: {
      listRestaurants: (context) => request('/v1/catalog/restaurants', { method: 'POST', body: JSON.stringify(context) }),
      listShops: (context) => request('/v1/catalog/shops', { method: 'POST', body: JSON.stringify(context) }),
    },
    orders: {
      listOrders: (context) => request('/v1/orders', { method: 'POST', body: JSON.stringify(context) }),
    },
    parcels: {
      quote: (payload) => request('/v1/parcels/quote', { method: 'POST', body: JSON.stringify(payload) }),
    },
    rides: {
      quote: (payload) => request('/v1/rides/quote', { method: 'POST', body: JSON.stringify(payload) }),
    },
    wallet: {
      getSnapshot: (context) => request('/v1/wallet', { method: 'POST', body: JSON.stringify(context) }),
    },
  };
}
