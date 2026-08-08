import type { Restaurant } from '../../features/food/domain';
import type { OrderSummary } from '../../features/orders/domain';
import type { ParcelQuote, ParcelQuoteRequest } from '../../features/parcels/domain';
import type { RideQuote, RideQuoteRequest } from '../../features/rides/domain';
import type { Shop } from '../../features/shop/domain';
import type { WalletSnapshot } from '../../features/wallet/domain';

export type MarketContext = {
  country: string;
  city: string;
};

export interface CatalogService {
  listRestaurants(context: MarketContext): Promise<Restaurant[]>;
  listShops(context: MarketContext): Promise<Shop[]>;
}

export interface OrdersService {
  listOrders(context: MarketContext): Promise<OrderSummary[]>;
}

export interface ParcelsService {
  quote(request: ParcelQuoteRequest): Promise<ParcelQuote>;
}

export interface RidesService {
  quote(request: RideQuoteRequest): Promise<RideQuote>;
}

export interface WalletService {
  getSnapshot(context: MarketContext): Promise<WalletSnapshot>;
}

export type SuperAppServices = {
  catalog: CatalogService;
  orders: OrdersService;
  parcels: ParcelsService;
  rides: RidesService;
  wallet: WalletService;
};
