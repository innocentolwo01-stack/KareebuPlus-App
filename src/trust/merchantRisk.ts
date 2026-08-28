export type MerchantRiskState='new'|'trusted'|'enhanced_monitoring'|'restricted'|'suspended';
export type MerchantVerification={businessRegistration:boolean;taxIdentity:boolean;beneficialOwner:boolean;settlementOwnership:boolean;categoryLicence:boolean;physicalOrVideoCheck:boolean;state:MerchantRiskState};
export type SettlementPolicy={delayDays:number;reservePercent:number;manualReleaseThreshold:number};

export function settlementPolicyFor(merchant:MerchantVerification,category:'food'|'general'|'electronics'|'pharmacy'|'global'):SettlementPolicy {
  if(merchant.state==='suspended'||merchant.state==='restricted') return {delayDays:30,reservePercent:100,manualReleaseThreshold:0};
  if(merchant.state==='new') return {delayDays:category==='electronics'||category==='global'?7:3,reservePercent:category==='electronics'||category==='global'?20:10,manualReleaseThreshold:2_000_000};
  if(merchant.state==='enhanced_monitoring') return {delayDays:5,reservePercent:15,manualReleaseThreshold:3_000_000};
  return {delayDays:1,reservePercent:3,manualReleaseThreshold:10_000_000};
}
