import type { SuperAppServices } from '../../core/services/contracts';

function notMapped(feature: string): never {
  throw new Error(
    `The temporary 6amMart adapter has not mapped ${feature} yet. Keep EXPO_PUBLIC_KAREEBU_BACKEND_MODE=demo until that feature is migrated.`,
  );
}

export function createLegacy6amSuperAppServices(_apiBaseUrl?: string): SuperAppServices {
  return {
    catalog: { listRestaurants: async () => notMapped('catalog'), listShops: async () => notMapped('catalog') },
    orders: { listOrders: async () => notMapped('orders') },
    parcels: { quote: async () => notMapped('parcels') },
    rides: { quote: async () => notMapped('rides') },
    wallet: { getSnapshot: async () => notMapped('wallet') },
  };
}
