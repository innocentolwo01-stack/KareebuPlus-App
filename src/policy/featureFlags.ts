import { COUNTRY_COMPLIANCE_PACKS, type PolicyFeature } from './countryCompliance';

export type PolicyOverride={id:string;country:'Uganda'|'Kenya'|'Tanzania';feature:PolicyFeature;enabled:boolean;effectiveFrom:string;effectiveTo?:string;reason:string;source:'regulatory'|'provider_outage'|'risk'|'operations'};
const OVERRIDES:PolicyOverride[]=[];

export function registerPolicyOverride(override:PolicyOverride){OVERRIDES.push(override);}
export function featureEnabled(country:string,feature:PolicyFeature,at=new Date()):boolean {
  const pack=COUNTRY_COMPLIANCE_PACKS[country as keyof typeof COUNTRY_COMPLIANCE_PACKS]??COUNTRY_COMPLIANCE_PACKS.Uganda;
  const matches=OVERRIDES.filter(item=>item.country===pack.country&&item.feature===feature&&new Date(item.effectiveFrom)<=at&&(!item.effectiveTo||new Date(item.effectiveTo)>=at));
  return matches.length?matches[matches.length-1]!.enabled:pack.features[feature];
}
export function activePolicyOverrides(country:string,at=new Date()){return OVERRIDES.filter(item=>item.country===country&&new Date(item.effectiveFrom)<=at&&(!item.effectiveTo||new Date(item.effectiveTo)>=at));}
