export type ParcelQuoteRequest = {
  country: string;
  pickupCity: string;
  destinationCity: string;
  weightKg?: number;
  express?: boolean;
};

export type ParcelQuote = {
  amount: number;
  currency: string;
  etaLabel: string;
};
