import type { VisualArtStyle, VisualCompositionType } from './categoryVisuals';

export type VisualAssetGapReason='temporary'|'cartoon-style'|'flat'|'outline'|'low-resolution'|'semantically-inaccurate'|'visually-inconsistent'|'missing-dedicated-asset';
export type VisualAssetGap={key:string;reason:VisualAssetGapReason;requiredStyle:VisualArtStyle;compositionType:VisualCompositionType;brief:string;priority:'critical'|'high'|'medium'};

/**
 * Production art backlog. These keys intentionally resolve to packaged fallbacks
 * until a QC-approved realistic photograph/cutout or CMS override exists.
 */
export const VISUAL_ASSET_GAPS:readonly VisualAssetGap[]=[
  {key:'mobility.rides.comfort',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Premium sedan visibly distinct from Economy, three-quarter view.',priority:'critical'},
  {key:'mobility.rides.xl',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Dedicated SUV or MPV with a clearly larger silhouette.',priority:'critical'},
  {key:'shops.butcherySeafood',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Fresh fish, premium meat cut and restrained preparation cue.',priority:'critical'},
  {key:'groceries.meatFish',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Fresh fish and meat composition; current chicken fallback is insufficient.',priority:'critical'},
  {key:'groceries.dairyEggs',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Milk, eggs, yoghurt and cheese composition.',priority:'high'},
  {key:'groceries.drinks',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Water, juice and beverage grouping rather than coffee.',priority:'high'},
  {key:'groceries.snacks',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Crisps, biscuits and chocolate grouping.',priority:'high'},
  {key:'groceries.cooking',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Rice, flour, cooking oil and East African pantry spices.',priority:'high'},
  {key:'shops.petSupplies',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Dog and cat with food bowl and pet-care products.',priority:'critical'},
  {key:'pets.dogs',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Dog with relevant food and care products.',priority:'high'},
  {key:'pets.cats',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Cat with relevant food and care products.',priority:'high'},
  {key:'pets.birds',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Bird and bird-care products.',priority:'high'},
  {key:'food.african',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Recognisable plated African meal, CMS market override preferred.',priority:'high'},
  {key:'food.ugandan',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Ugandan plated meal with market-specific CMS provenance.',priority:'high'},
  {key:'food.kenyan',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Kenyan plated meal with market-specific CMS provenance.',priority:'high'},
  {key:'food.tanzanian',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Tanzanian plated meal with market-specific CMS provenance.',priority:'high'},
  {key:'groceries.leafy-greens',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Leafy greens assortment such as spinach, kale and lettuce; current produce fallback is temporary.',priority:'high'},
  {key:'groceries.root-vegetables',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Root vegetable assortment including carrots and other roots.',priority:'high'},
  {key:'groceries.onions-garlic-ginger',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Dedicated onions, garlic and ginger assortment.',priority:'high'},
  {key:'groceries.peppers',reason:'semantically-inaccurate',requiredStyle:'product-photo',compositionType:'composite',brief:'Dedicated peppers and chillies assortment; current tomato-led fallback is temporary.',priority:'high'},
  {key:'groceries.herbs',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Fresh herb assortment such as coriander, parsley and basil.',priority:'medium'},
  {key:'groceries.mushrooms',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Dedicated fresh mushroom assortment.',priority:'medium'},
  {key:'groceries.ready-to-cook',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Prepared vegetable pack with clearly cut mixed vegetables.',priority:'medium'},
  {key:'services.ac',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Air-conditioning unit/service composition; do not reuse generic Home & Care artwork.',priority:'critical'},
  {key:'services.moving',reason:'missing-dedicated-asset',requiredStyle:'lifestyle-photo',compositionType:'scene',brief:'Moving boxes/trolley/van composition; never use grocery artwork.',priority:'critical'},
  {key:'services.beauty-home',reason:'missing-dedicated-asset',requiredStyle:'lifestyle-photo',compositionType:'composite',brief:'At-home beauty/hair service composition distinct from retail skincare.',priority:'high'},
  {key:'send.parcel',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Parcel/box with shipping cue; never use grocery artwork.',priority:'critical'},
  {key:'send.documents',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Secure document envelope/folder; never use shopping artwork.',priority:'critical'},
  {key:'send.gift',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'single-object',brief:'Wrapped gift parcel distinct from flowers unless the delivery is explicitly floral.',priority:'high'},
  {key:'send.business',reason:'missing-dedicated-asset',requiredStyle:'product-photo',compositionType:'composite',brief:'Business delivery/document parcel composition distinct from consumer shopping imagery.',priority:'high'},
  {key:'services.send',reason:'visually-inconsistent',requiredStyle:'product-photo',compositionType:'composite',brief:'Parcel, delivery bag and shipping-label cue with no fake text.',priority:'medium'},
  {key:'services.goOut',reason:'missing-dedicated-asset',requiredStyle:'lifestyle-photo',compositionType:'scene',brief:'Experience composition variants for spa, family activities and attractions.',priority:'high'},
  {key:'services.pay',reason:'visually-inconsistent',requiredStyle:'product-photo',compositionType:'composite',brief:'Premium wallet/payment composition suitable for small navigation derivatives.',priority:'medium'},
  {key:'emptyStates.marketplace',reason:'missing-dedicated-asset',requiredStyle:'lifestyle-photo',compositionType:'scene',brief:'Unified empty marketplace basket composition.',priority:'medium'},
  {key:'successStates.commerce',reason:'missing-dedicated-asset',requiredStyle:'lifestyle-photo',compositionType:'scene',brief:'Successful order composition without baked text.',priority:'medium'},
] as const;

export const visualAssetGap=(key:string)=>VISUAL_ASSET_GAPS.find(item=>item.key===key);
