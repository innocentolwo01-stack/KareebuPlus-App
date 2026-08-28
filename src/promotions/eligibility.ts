export type PromotionEligibilityInput={customerId?:string;deviceId?:string;paymentFingerprint?:string;deliveryAddressHash?:string;householdKey?:string;redemptionsByCustomer:number;redemptionsByDevice:number;redemptionsByPayment:number;redemptionsByAddress:number;campaignCap?:number;perCustomerCap?:number};
export type PromotionEligibilityDecision={eligible:boolean;reason:'eligible'|'customer_cap'|'device_reuse'|'payment_reuse'|'address_reuse'|'campaign_cap'|'manual_review'};
export function promotionEligibility(input:PromotionEligibilityInput):PromotionEligibilityDecision {
  if(input.campaignCap!==undefined&&input.campaignCap<=0) return {eligible:false,reason:'campaign_cap'};
  if(input.perCustomerCap!==undefined&&input.redemptionsByCustomer>=input.perCustomerCap) return {eligible:false,reason:'customer_cap'};
  if(input.redemptionsByDevice>=3) return {eligible:false,reason:'device_reuse'};
  if(input.redemptionsByPayment>=3) return {eligible:false,reason:'payment_reuse'};
  if(input.redemptionsByAddress>=5) return {eligible:false,reason:'address_reuse'};
  return {eligible:true,reason:'eligible'};
}
