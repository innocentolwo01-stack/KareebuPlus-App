export type PaymentRail = 'mtn_momo' | 'airtel_money' | 'mpesa' | 'card' | 'bank_transfer' | 'cash';
export type PaymentState =
  | 'created'
  | 'awaiting_customer'
  | 'submitted'
  | 'provider_processing'
  | 'authorised'
  | 'settled'
  | 'failed'
  | 'reversed'
  | 'disputed'
  | 'refunded';

export type PaymentPurpose = 'ride' | 'boda' | 'food' | 'shops' | 'send' | 'services' | 'dineout' | 'goout' | 'global' | 'bill' | 'recharge';

export type PaymentProviderId = 'mtn' | 'airtel' | 'safaricom' | 'card_processor' | 'bank_partner' | 'cash';

export type PaymentProviderCapability = {
  id: PaymentProviderId;
  rails: PaymentRail[];
  countries: Array<'Uganda' | 'Kenya' | 'Tanzania'>;
  supportsAsyncVerification: boolean;
  supportsRefunds: boolean;
  supportsReversals: boolean;
  supportsThreeDS?: boolean;
  status: 'configured' | 'provider_required' | 'temporarily_unavailable';
};

export type PaymentIntentInput = {
  country: string;
  amount: number;
  currency: 'UGX' | 'KES' | 'TZS';
  rail: PaymentRail;
  purpose: PaymentPurpose;
  customerId?: string;
  orderId?: string;
  riskDecisionId?: string;
  idempotencyKey: string;
};

export type PaymentAttempt = PaymentIntentInput & {
  id: string;
  provider: PaymentProviderId;
  state: PaymentState;
  createdAt: string;
  updatedAt: string;
  providerReference?: string;
  verificationRequired: boolean;
  settlementReference?: string;
  failureCode?: string;
  failureMessage?: string;
};

export type PaymentVerificationResult = {
  paymentId: string;
  verified: boolean;
  state: PaymentState;
  providerReference?: string;
  verifiedAt: string;
};
