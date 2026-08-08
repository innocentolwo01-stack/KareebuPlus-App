export type OrderKind = 'food' | 'shop' | 'parcel' | 'ride';
export type OrderStatus = 'draft' | 'confirmed' | 'preparing' | 'in_transit' | 'completed' | 'cancelled';

export type OrderSummary = {
  id: string;
  kind: OrderKind;
  title: string;
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
};
