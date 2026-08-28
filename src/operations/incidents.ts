export type IncidentScope='payments'|'maps'|'global'|'rides'|'boda'|'food'|'shops'|'send'|'identity'|'tax';
export type OperationalIncident={id:string;scope:IncidentScope;market?:string;severity:'info'|'degraded'|'major'|'critical';title:string;customerMessage:string;startedAt:string;resolvedAt?:string;featureKillSwitch?:string};
export const isIncidentActive=(incident:OperationalIncident)=>!incident.resolvedAt;
