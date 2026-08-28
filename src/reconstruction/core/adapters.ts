export type GeoPoint = { latitude: number; longitude: number };
export type Money = { amount: number; currency: string };

export interface KareebuLocationAdapter {
  getCurrentLocation(): Promise<GeoPoint | null>;
  search(query: string): Promise<Array<{ id: string; label: string; point: GeoPoint }>>;
}

export interface KareebuFoodAdapter {
  loadDiscoveryHome(input: { city?: string; point?: GeoPoint }): Promise<unknown>;
  search(query: string): Promise<unknown>;
  loadMerchant(merchantId: string): Promise<unknown>;
  loadMenu(merchantId: string): Promise<unknown>;
  checkout(input: unknown): Promise<unknown>;
}

export interface KareebuRidesAdapter {
  estimate(input: { pickup: GeoPoint; dropoff: GeoPoint }): Promise<unknown>;
  book(input: unknown): Promise<unknown>;
  getTrip(tripId: string): Promise<unknown>;
}

export interface KareebuPayAdapter {
  getWallet(): Promise<unknown>;
  createPayment(input: { amount: Money; reference?: string }): Promise<unknown>;
  getTransactions(): Promise<unknown>;
}

// Careem network clients must never be copied into production Kareebu code.
// Implement these interfaces against Kareebu/Supabase-owned services instead.
export type KareebuAdapters = {
  location: KareebuLocationAdapter;
  food: KareebuFoodAdapter;
  rides: KareebuRidesAdapter;
  pay: KareebuPayAdapter;
};
