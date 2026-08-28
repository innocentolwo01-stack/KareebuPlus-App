export type DataPurpose='identity'|'payments'|'orders'|'location'|'fraud_prevention'|'support'|'marketing'|'analytics';
export type RetentionRule={purpose:DataPurpose;defaultDays:number;legalHoldAllowed:boolean;customerDeletionEligible:boolean};
export const RETENTION_RULES:RetentionRule[]=[
  {purpose:'identity',defaultDays:2190,legalHoldAllowed:true,customerDeletionEligible:false},
  {purpose:'payments',defaultDays:2555,legalHoldAllowed:true,customerDeletionEligible:false},
  {purpose:'orders',defaultDays:2190,legalHoldAllowed:true,customerDeletionEligible:false},
  {purpose:'location',defaultDays:180,legalHoldAllowed:true,customerDeletionEligible:true},
  {purpose:'fraud_prevention',defaultDays:730,legalHoldAllowed:true,customerDeletionEligible:false},
  {purpose:'support',defaultDays:730,legalHoldAllowed:true,customerDeletionEligible:true},
  {purpose:'marketing',defaultDays:365,legalHoldAllowed:false,customerDeletionEligible:true},
  {purpose:'analytics',defaultDays:395,legalHoldAllowed:false,customerDeletionEligible:true},
];
export type ConsentRecord={purpose:DataPurpose;granted:boolean;capturedAt:string;source:string;policyVersion:string};
export type PrivacyRequest={id:string;type:'access'|'export'|'delete'|'correct'|'restrict';status:'received'|'verifying_identity'|'processing'|'completed'|'rejected';createdAt:string;completedAt?:string};
