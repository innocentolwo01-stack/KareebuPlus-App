import type { RiskAction, RiskDecision, RiskSignal } from './types';

export type RiskAssessmentInput={
  transactionValue:number;
  accountAgeDays?:number;
  newDevice?:boolean;
  recentPhoneChange?:boolean;
  recentPinReset?:boolean;
  newPaymentInstrument?:boolean;
  attemptsLastHour?:number;
  refundClaims90d?:number;
  promotionRedemptions30d?:number;
  linkedHighRiskAccounts?:number;
  globalPurchase?:boolean;
  restrictedGoods?:boolean;
  providerVerified?:boolean;
};

function signal(code:RiskSignal['code'],weight:number,detail?:string):RiskSignal{return {code,weight,detail};}

export function assessRisk(input:RiskAssessmentInput):RiskDecision {
  const signals:RiskSignal[]=[];
  if(input.newDevice) signals.push(signal('new_device',18));
  if(input.recentPhoneChange) signals.push(signal('recent_phone_change',22));
  if(input.recentPinReset) signals.push(signal('recent_pin_reset',18));
  if(input.newPaymentInstrument) signals.push(signal('new_payment_instrument',12));
  if(input.transactionValue>=3_000_000) signals.push(signal('high_value',28));
  else if(input.transactionValue>=1_000_000) signals.push(signal('high_value',14));
  if((input.attemptsLastHour??0)>=6) signals.push(signal('high_velocity',25));
  if((input.refundClaims90d??0)>=4) signals.push(signal('refund_abuse',24));
  if((input.promotionRedemptions30d??0)>=5) signals.push(signal('promotion_abuse',22));
  if((input.linkedHighRiskAccounts??0)>0) signals.push(signal('linked_account_risk',35));
  if(input.globalPurchase && input.transactionValue>=1_500_000) signals.push(signal('global_procurement_risk',18));
  if(input.restrictedGoods) signals.push(signal('restricted_goods',100));
  if(input.providerVerified===false) signals.push(signal('provider_unverified',40));
  if((input.accountAgeDays??999)<3 && input.transactionValue>=500_000) signals.push(signal('high_velocity',10,'Young account with high first-order value'));

  const score=Math.min(100,signals.reduce((sum,item)=>sum+item.weight,0));
  let action:RiskAction='allow';
  if(score>=90) action='decline';
  else if(score>=70) action='manual_review';
  else if(score>=50) action='hold';
  else if(score>=25) action='step_up';
  else if(score>=10) action='allow_monitor';
  return {id:`RISK-${Date.now()}-${score}`,score,action,reasons:signals.map(item=>item.code),createdAt:new Date().toISOString(),requiresHumanReview:action==='manual_review'||action==='hold'};
}
