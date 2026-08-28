import type { MerchantVerification } from './merchantRisk';
export type MerchantKybInput={merchantId:string;country:string;businessRegistrationNumber?:string;taxId?:string;beneficialOwnerIds:string[];settlementAccountName?:string;legalBusinessName?:string;categoryLicences:string[];addressVerified:boolean};
export interface MerchantKybProvider {verify(input:MerchantKybInput):Promise<MerchantVerification>;}
export const referenceMerchantKybProvider:MerchantKybProvider={async verify(){return {businessRegistration:false,taxIdentity:false,beneficialOwner:false,settlementOwnership:false,categoryLicence:false,physicalOrVideoCheck:false,state:'new'};}};
