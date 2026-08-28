import type { PaymentAttempt, PaymentIntentInput, PaymentProviderCapability, PaymentProviderId, PaymentRail, PaymentVerificationResult } from './types';

export const PAYMENT_PROVIDERS: readonly PaymentProviderCapability[] = [
  { id:'mtn', rails:['mtn_momo'], countries:['Uganda'], supportsAsyncVerification:true, supportsRefunds:true, supportsReversals:true, status:'provider_required' },
  { id:'airtel', rails:['airtel_money'], countries:['Uganda','Kenya','Tanzania'], supportsAsyncVerification:true, supportsRefunds:true, supportsReversals:true, status:'provider_required' },
  { id:'safaricom', rails:['mpesa'], countries:['Kenya'], supportsAsyncVerification:true, supportsRefunds:true, supportsReversals:true, status:'provider_required' },
  { id:'card_processor', rails:['card'], countries:['Uganda','Kenya','Tanzania'], supportsAsyncVerification:true, supportsRefunds:true, supportsReversals:true, supportsThreeDS:true, status:'provider_required' },
  { id:'bank_partner', rails:['bank_transfer'], countries:['Uganda','Kenya','Tanzania'], supportsAsyncVerification:true, supportsRefunds:true, supportsReversals:true, status:'provider_required' },
  { id:'cash', rails:['cash'], countries:['Uganda','Kenya','Tanzania'], supportsAsyncVerification:false, supportsRefunds:false, supportsReversals:false, status:'configured' },
] as const;

const providerFor = (country:string, rail:PaymentRail):PaymentProviderId => {
  const provider=PAYMENT_PROVIDERS.find(item=>item.countries.includes(country as any) && item.rails.includes(rail));
  return provider?.id ?? 'card_processor';
};

export function preparePaymentAttempt(input: PaymentIntentInput): PaymentAttempt {
  const now=new Date().toISOString();
  const provider=providerFor(input.country,input.rail);
  return {
    ...input,
    id:`PAY-${input.idempotencyKey}`,
    provider,
    state: input.rail === 'cash' ? 'authorised' : 'created',
    createdAt:now,
    updatedAt:now,
    verificationRequired: input.rail !== 'cash',
  };
}

/**
 * Provider implementations belong on secure server infrastructure. Mobile UI must
 * never interpret an unverified client callback as proof that money moved.
 */
export interface PaymentOrchestratorProvider {
  create(input: PaymentIntentInput): Promise<PaymentAttempt>;
  verify(payment: PaymentAttempt): Promise<PaymentVerificationResult>;
  refund(payment: PaymentAttempt, amount?: number): Promise<PaymentVerificationResult>;
}

export const referencePaymentOrchestrator: PaymentOrchestratorProvider = {
  async create(input) {
    return preparePaymentAttempt(input);
  },
  async verify(payment) {
    return {paymentId:payment.id,verified:false,state:'provider_processing',verifiedAt:new Date().toISOString()};
  },
  async refund(payment) {
    return {paymentId:payment.id,verified:false,state:'provider_processing',verifiedAt:new Date().toISOString()};
  },
};

export function paymentRailsForMarket(country:string):PaymentRail[] {
  if(country==='Kenya') return ['mpesa','airtel_money','card','bank_transfer'];
  if(country==='Tanzania') return ['airtel_money','card','bank_transfer'];
  return ['mtn_momo','airtel_money','card','bank_transfer'];
}
