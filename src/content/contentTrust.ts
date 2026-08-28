export type ContentSourceKind = 'merchant-official' | 'licensed-cms' | 'kareebu-editorial' | 'public-reference';

export type ContentTrustMetadata = {
  source: string;
  sourceUrl?: string;
  sourceKind: ContentSourceKind;
  market: 'Uganda' | 'Kenya' | 'Tanzania' | 'multi-market';
  demoReference: boolean;
  liveAvailability: boolean;
  lastVerifiedAt?: string;
  imageSource: 'merchant-provided' | 'licensed-cms' | 'editorial-reference' | 'kareebu-owned';
};

export type ReferencePrice = {
  amount: number;
  currency: 'UGX' | 'KES' | 'TZS';
  lastVerifiedAt: string;
  priceIsLive: false;
};

export const REFERENCE_VERIFIED_AT = '2026-08-17';
