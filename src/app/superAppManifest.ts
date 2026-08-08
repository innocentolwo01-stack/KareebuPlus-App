export type SuperAppFeatureId =
  | 'food'
  | 'grocery'
  | 'shop'
  | 'pharmacy'
  | 'parcels'
  | 'rides'
  | 'orders'
  | 'wallet'
  | 'loyalty'
  | 'rewards'
  | 'notifications'
  | 'chat'
  | 'account';

export type SuperAppFeatureStatus = 'existing' | 'migration-next' | 'planned';

export const SUPER_APP_FEATURES: ReadonlyArray<{
  id: SuperAppFeatureId;
  label: string;
  status: SuperAppFeatureStatus;
}> = [
  { id: 'food', label: 'Food', status: 'existing' },
  { id: 'grocery', label: 'Groceries', status: 'existing' },
  { id: 'shop', label: 'Shops', status: 'existing' },
  { id: 'pharmacy', label: 'Pharmacy', status: 'existing' },
  { id: 'parcels', label: 'Parcels', status: 'existing' },
  { id: 'rides', label: 'Rides & Boda', status: 'existing' },
  { id: 'orders', label: 'Orders', status: 'existing' },
  { id: 'wallet', label: 'Wallet', status: 'existing' },
  { id: 'account', label: 'Account', status: 'existing' },
  { id: 'loyalty', label: 'Loyalty', status: 'migration-next' },
  { id: 'rewards', label: 'Rewards', status: 'migration-next' },
  { id: 'notifications', label: 'Notifications', status: 'planned' },
  { id: 'chat', label: 'Chat', status: 'planned' },
];
