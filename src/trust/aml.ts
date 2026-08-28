export type ComplianceAlertType='unusual_velocity'|'rapid_in_out'|'structuring'|'linked_accounts'|'cross_border_anomaly'|'sanctions_match'|'pep_match';
export type ComplianceAlert={id:string;type:ComplianceAlertType;risk:'low'|'medium'|'high';reason:string;status:'open'|'reviewed'|'escalated'|'closed';createdAt:string};
export interface ScreeningProvider {screen(input:{name:string;dateOfBirth?:string;country?:string}):Promise<{status:'clear'|'possible_match'|'provider_unavailable';matches:number}>;}
export const referenceScreeningProvider:ScreeningProvider={async screen(){return {status:'provider_unavailable',matches:0};}};
export const requiresComplianceCase=(alerts:ComplianceAlert[])=>alerts.some(item=>item.risk==='high'||item.type==='sanctions_match'||item.type==='pep_match');
