import type { RiskDecision } from '../trust/types';
import type { AuditEvent } from './audit';
export type TrustEntityType='customer'|'merchant'|'captain'|'courier'|'device'|'payment'|'order'|'refund';
export type TrustEntityLink={type:TrustEntityType;id:string;label:string};
export type TrustSafetyCase={id:string;title:string;priority:'low'|'medium'|'high'|'critical';status:'open'|'investigating'|'waiting'|'resolved';entities:TrustEntityLink[];riskDecision?:RiskDecision;evidence:string[];createdAt:string;assignedRole?:string;auditTrail:AuditEvent[]};
