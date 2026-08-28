import type { GlobalProduct } from './types';

export type HsClassificationCandidate={code:string;confidence:number;requiresManualReview:boolean;reason:string};
export function classifyHsCandidate(product:GlobalProduct):HsClassificationCandidate {
  const text=`${product.title} ${product.category} ${product.subcategory??''}`.toLowerCase();
  if(/laptop|notebook computer/.test(text)) return {code:'8471.30 candidate',confidence:.74,requiresManualReview:true,reason:'Portable computer wording detected'};
  if(/phone|smartphone/.test(text)) return {code:'8517 candidate',confidence:.70,requiresManualReview:true,reason:'Telephone/smartphone wording detected'};
  if(/perfume|fragrance/.test(text)) return {code:'3303 candidate',confidence:.78,requiresManualReview:true,reason:'Fragrance wording detected'};
  if(/serum|moistur|skincare|makeup/.test(text)) return {code:'3304 candidate',confidence:.66,requiresManualReview:true,reason:'Beauty/skincare wording detected'};
  if(/shoe|trainer|boot|sandal/.test(text)) return {code:'64 candidate',confidence:.62,requiresManualReview:true,reason:'Footwear wording detected'};
  const family={electronics:'85/84',fashion:'61/62',beauty:'33',home:'39/63/84',kids:'95/61',sports:'95/64',automotive:'87',books:'49',pets:'23/42/95',accessories:'42/71/91'}[product.category];
  return {code:`${family} candidate`,confidence:.45,requiresManualReview:true,reason:'Category-family candidate only'};
}
