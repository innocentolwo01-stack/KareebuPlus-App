import type { GlobalCategoryId, ImporterModel } from './types';

export type TariffProfile={
  id:string;
  country:'Uganda'|'Kenya'|'Tanzania';
  category:GlobalCategoryId;
  hsCodeCandidate:string;
  description:string;
  effectiveFrom:string;
  effectiveTo?:string;
  importDutyRate:number;
  vatRate:number;
  whtRate:number;
  importDeclarationFeeRate:number;
  infrastructureLevyRate:number;
  exciseRate:number;
  environmentalLevyRate:number;
  specificDutyPerKg?:number;
  minimumDuty?:number;
  requiresManualReview:boolean;
  referenceOnly:boolean;
  source:string;
  notes:string[];
};

const ug=(input:Omit<TariffProfile,'country'|'effectiveFrom'|'vatRate'|'whtRate'|'importDeclarationFeeRate'|'infrastructureLevyRate'|'referenceOnly'|'source'>):TariffProfile=>({
  ...input,country:'Uganda',effectiveFrom:'2026-07-01',vatRate:.18,whtRate:.06,importDeclarationFeeRate:.01,infrastructureLevyRate:.015,referenceOnly:true,source:'Reference configuration — verify against effective URA/EAC tariff data before locking a production quote',
});

export const UGANDA_TARIFF_PROFILES:Record<GlobalCategoryId,TariffProfile>={
  electronics:ug({id:'ug-electronics',category:'electronics',hsCodeCandidate:'85/84 candidate',description:'Electronics reference profile',importDutyRate:.10,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Exact rate depends on item HS code. Laptops/phones/accessories can differ.']}),
  fashion:ug({id:'ug-fashion',category:'fashion',hsCodeCandidate:'61/62/64 candidate',description:'Garments and footwear reference profile',importDutyRate:.35,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Garments/footwear can be subject to specific or per-kg treatment; manual classification required.']}),
  beauty:ug({id:'ug-beauty',category:'beauty',hsCodeCandidate:'33 candidate',description:'Beauty/personal-care reference profile',importDutyRate:.35,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Cosmetics/fragrance may require regulatory review and category-specific tariff treatment.']}),
  home:ug({id:'ug-home',category:'home',hsCodeCandidate:'39/63/84 candidate',description:'Home goods reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Material and product function determine exact HS code.']}),
  kids:ug({id:'ug-kids',category:'kids',hsCodeCandidate:'95/94/61 candidate',description:'Kids/toys reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Baby products and toys can have different effective rates and product-safety requirements.']}),
  sports:ug({id:'ug-sports',category:'sports',hsCodeCandidate:'95/64/61 candidate',description:'Sports goods reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Footwear/apparel/equipment classifications differ.']}),
  automotive:ug({id:'ug-automotive',category:'automotive',hsCodeCandidate:'87 candidate',description:'Automotive accessories reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Vehicle parts/accessories require exact classification and may attract other charges.']}),
  books:ug({id:'ug-books',category:'books',hsCodeCandidate:'49 candidate',description:'Books/media reference profile',importDutyRate:0,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Printed matter classification must be confirmed; media/electronics differ.']}),
  pets:ug({id:'ug-pets',category:'pets',hsCodeCandidate:'23/42/63/95 candidate',description:'Pet supplies reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Pet food may trigger additional food/veterinary restrictions.']}),
  accessories:ug({id:'ug-accessories',category:'accessories',hsCodeCandidate:'42/71/91 candidate',description:'Accessories reference profile',importDutyRate:.25,exciseRate:0,environmentalLevyRate:0,requiresManualReview:true,notes:['Watches, jewellery and bags differ by HS classification.']}),
};

export function tariffProfileFor(country:string,category:GlobalCategoryId):TariffProfile|null {
  if(country!=='Uganda') return null;
  return UGANDA_TARIFF_PROFILES[category];
}

export function recoverabilityFor(importerModel:ImporterModel){
  return importerModel==='KAREEBU_IMPORTER'?{importVatPotentiallyRecoverable:true,whtPotentiallyCreditable:true}:{importVatPotentiallyRecoverable:false,whtPotentiallyCreditable:false};
}
