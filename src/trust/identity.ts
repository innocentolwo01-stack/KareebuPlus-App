import type { IdentityState, IdentityTier } from './types';

export type IdentityProfile={tier:IdentityTier;state:IdentityState;documentVerified:boolean;livenessVerified:boolean;sourceOfFundsVerified:boolean;lastVerifiedAt?:string;expiresAt?:string};

export interface IdentityVerificationProvider {
  start(input:{customerId:string;targetTier:IdentityTier;country:string}):Promise<{sessionId:string}>;
  status(sessionId:string):Promise<IdentityProfile>;
}

export const referenceIdentityProvider:IdentityVerificationProvider={
  async start({customerId,targetTier}){return {sessionId:`IDV-${customerId}-${targetTier}`};},
  async status(){return {tier:'basic',state:'pending',documentVerified:false,livenessVerified:false,sourceOfFundsVerified:false};},
};

export function requiredIdentityTier(input:{purpose:'normal_commerce'|'global'|'high_value'|'sensitive_service';amount?:number}):IdentityTier {
  if(input.purpose==='high_value'||(input.amount??0)>=3_000_000) return 'enhanced';
  if(input.purpose==='global'||input.purpose==='sensitive_service') return 'verified';
  return 'basic';
}
