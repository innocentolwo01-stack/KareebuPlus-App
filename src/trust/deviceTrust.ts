import type { DeviceTrustState } from './types';
export type DeviceTrustRecord={deviceId:string;state:DeviceTrustState;firstSeenAt:string;lastSeenAt:string;integrity:'unknown'|'normal'|'elevated_risk';biometricEnabled:boolean};
export const shouldStepUpForDevice=(record:DeviceTrustRecord, sensitiveAction:boolean)=>sensitiveAction&&(record.state!=='trusted'||record.integrity==='elevated_risk');
