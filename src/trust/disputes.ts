import type { TrustCase } from './types';
export type RefundDecision='instant_refund'|'standard_review'|'manual_investigation'|'decline';
export function refundDecision(input:{value:number;accountAgeDays:number;refundClaims90d:number;evidenceAvailable:boolean;merchantRisk?:'low'|'medium'|'high'}):RefundDecision {
  if(input.refundClaims90d>=4||input.merchantRisk==='high'||input.value>=2_000_000) return 'manual_investigation';
  if(input.value<=50_000&&input.accountAgeDays>=90&&input.refundClaims90d<=1) return 'instant_refund';
  if(!input.evidenceAvailable&&input.value>=500_000) return 'manual_investigation';
  return 'standard_review';
}
export const DEMO_TRUST_CASES:TrustCase[]=[
  {id:'CASE-1042',kind:'refund',title:'Refund review',status:'resolved',createdAt:'2026-08-17T10:00:00Z',updatedAt:'2026-08-18T08:30:00Z',reference:'Order K-21890',timeline:[{at:'2026-08-17T10:00:00Z',label:'Submitted'},{at:'2026-08-17T13:20:00Z',label:'Under review'},{at:'2026-08-18T08:30:00Z',label:'Refund issued'}]},
];
