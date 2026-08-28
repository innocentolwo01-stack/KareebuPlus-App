export type RiskAction='allow'|'allow_monitor'|'step_up'|'hold'|'manual_review'|'decline';
export type RiskReasonCode=
  | 'new_device'
  | 'recent_phone_change'
  | 'recent_pin_reset'
  | 'new_payment_instrument'
  | 'high_value'
  | 'high_velocity'
  | 'location_anomaly'
  | 'promotion_abuse'
  | 'refund_abuse'
  | 'linked_account_risk'
  | 'merchant_risk'
  | 'global_procurement_risk'
  | 'restricted_goods'
  | 'provider_unverified';

export type RiskSignal={code:RiskReasonCode;weight:number;detail?:string};
export type RiskDecision={id:string;score:number;action:RiskAction;reasons:RiskReasonCode[];createdAt:string;requiresHumanReview:boolean};

export type IdentityTier='basic'|'verified'|'enhanced';
export type IdentityState='not_started'|'pending'|'verified'|'failed'|'expired'|'manual_review';
export type DeviceTrustState='trusted'|'new'|'challenged'|'blocked';

export type TrustCaseStatus='open'|'in_review'|'waiting_customer'|'waiting_partner'|'resolved'|'rejected';
export type TrustCase={id:string;kind:'payment'|'refund'|'merchant'|'captain'|'delivery'|'identity'|'global'|'safety';title:string;status:TrustCaseStatus;createdAt:string;updatedAt:string;reference?:string;timeline:Array<{at:string;label:string;detail?:string}>};
