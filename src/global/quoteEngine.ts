import type { GlobalProduct, GlobalQuote, ImporterModel } from './types';
import { classifyHsCandidate } from './hsClassifier';
import { commercialAmounts, contributionGuard } from './economics';
import { recoverabilityFor, tariffProfileFor } from './tariffs';

export interface GlobalQuoteProvider {
  quote(input: { product: GlobalProduct; country: string; quantity: number; importerModel?:ImporterModel }): Promise<GlobalQuote>;
}

const MARKET_RATES = {
  Uganda: { currency: 'UGX' as const, usd: 3725, localDelivery: 9000, brokerageMinimum:15000 },
  Kenya: { currency: 'KES' as const, usd: 132, localDelivery: 350, brokerageMinimum:600 },
  Tanzania: { currency: 'TZS' as const, usd: 2570, localDelivery: 6500, brokerageMinimum:10000 },
};
const SOURCE_TO_USD={USD:1,GBP:1.29,EUR:1.10} as const;
const roundFor=(currency:'UGX'|'KES'|'TZS',value:number)=>currency==='KES'?Math.round(value):Math.round(value/100)*100;

const zeroBreakdown=()=>({product:0,internationalDelivery:0,estimatedDutyTax:0,kareebuLogistics:0,localDelivery:0,discount:0,total:0});

export function estimateGlobalQuote(product: GlobalProduct, country: string, quantity = 1, importerModel:ImporterModel='THIRD_PARTY_IMPORTER'): GlobalQuote {
  const market = MARKET_RATES[country as keyof typeof MARKET_RATES] ?? MARKET_RATES.Uganda;
  const checkedAt = new Date().toISOString();
  const restrictionBlocked=['prohibited','hazardous','country-restricted'].includes(product.restriction);
  if (product.stock === 'unavailable' || restrictionBlocked) {
    return { id:`GQ-${product.id}`, productId:product.id, market:country, currency:market.currency, state:restrictionBlocked?'restricted':'unavailable', checkedAt, breakdown:zeroBreakdown(), estimateNotice:'This item cannot currently be quoted for the selected market. Kareebu will not take payment for a known unsupported item.', source:'reference-fixture', importerModel, requiresManualReview:true, assumptions:['No live procurement performed.'] };
  }

  const classification=classifyHsCandidate(product);
  const sourceUsd=product.sourcePrice*SOURCE_TO_USD[product.sourceCurrency];
  const sourceBaseLocal=sourceUsd*market.usd*quantity;
  const freightActualUsd=(8+product.weightKg*7.5)*quantity;
  const freightActual=freightActualUsd*market.usd;
  const customsValue=sourceBaseLocal+freightActual;
  const commercial=commercialAmounts({productCost:sourceBaseLocal,freightActual,localDeliveryActual:market.localDelivery});
  const productCustomer=sourceBaseLocal+commercial.fxMargin;
  const customerFreight=freightActual+commercial.freightMargin;
  const customerLocalDelivery=market.localDelivery+commercial.localDeliveryMargin;

  const tariff=tariffProfileFor(country,product.category);
  if(!tariff){
    const provisionalTotal=productCustomer+customerFreight+commercial.serviceFee+customerLocalDelivery;
    return {
      id:`GQ-${product.id}-${quantity}-${country}`,productId:product.id,market:country,currency:market.currency,state:'requires_review',checkedAt,
      breakdown:{product:roundFor(market.currency,productCustomer),internationalDelivery:roundFor(market.currency,customerFreight),estimatedDutyTax:0,kareebuLogistics:roundFor(market.currency,commercial.serviceFee),localDelivery:roundFor(market.currency,customerLocalDelivery),discount:0,total:roundFor(market.currency,provisionalTotal),customsValue:roundFor(market.currency,customsValue),serviceFee:roundFor(market.currency,commercial.serviceFee),freightMargin:roundFor(market.currency,commercial.freightMargin),fxMargin:roundFor(market.currency,commercial.fxMargin),paymentProcessing:roundFor(market.currency,commercial.paymentProcessing)},
      estimateNotice:`Kareebu has not applied Uganda tariff assumptions to ${country}. A country-specific tariff provider must confirm duties and taxes before this becomes a payable delivered quote.`,source:'reference-fixture',importerModel,hsCodeCandidate:classification.code,classificationConfidence:classification.confidence,requiresManualReview:true,assumptions:['Country-specific duty/tax resolver required before checkout.','Source pricing is reference data, not live marketplace availability.']
    };
  }

  const importDuty=Math.max(tariff.minimumDuty??0,customsValue*tariff.importDutyRate+(tariff.specificDutyPerKg??0)*product.weightKg*quantity);
  const excise=customsValue*tariff.exciseRate;
  const environmentalLevy=customsValue*tariff.environmentalLevyRate;
  const idf=customsValue*tariff.importDeclarationFeeRate;
  const infrastructure=customsValue*tariff.infrastructureLevyRate;
  const vatBase=customsValue+importDuty+excise+environmentalLevy+idf+infrastructure;
  const importVat=vatBase*tariff.vatRate;
  const whtCashflow=customsValue*tariff.whtRate;
  const brokerage=Math.max(market.brokerageMinimum,customsValue*.012);
  const recoverability=recoverabilityFor(importerModel);
  const customerImportVat=recoverability.importVatPotentiallyRecoverable?0:importVat;
  const recoverableTaxCashflow=(recoverability.importVatPotentiallyRecoverable?importVat:0)+(recoverability.whtPotentiallyCreditable?whtCashflow:0);
  const governmentCost=importDuty+excise+environmentalLevy+idf+infrastructure+customerImportVat;
  const estimatedDutyTax=governmentCost;
  const customerTotal=productCustomer+customerFreight+governmentCost+brokerage+commercial.serviceFee+customerLocalDelivery;
  const irrecoverableCosts=sourceBaseLocal+freightActual+governmentCost+brokerage+market.localDelivery;
  const guard=contributionGuard({customerTotal,irrecoverableCosts,kareebuRevenue:commercial.kareebuRevenue,paymentProcessing:commercial.paymentProcessing,returnsReserve:commercial.returnsReserve});
  const state:GlobalQuote['state']=product.restriction==='restricted'||product.restriction==='requires_documentation'||product.restriction==='requires_regulatory_clearance'||product.restriction==='manual_review'?'requires_review':'estimated';
  const round=(value:number)=>roundFor(market.currency,value);

  return {
    id:`GQ-${product.id}-${quantity}-${country}`,productId:product.id,market:country,currency:market.currency,state,checkedAt,
    breakdown:{
      product:round(productCustomer),internationalDelivery:round(customerFreight),estimatedDutyTax:round(estimatedDutyTax),kareebuLogistics:round(commercial.serviceFee),localDelivery:round(customerLocalDelivery),discount:0,total:round(customerTotal),
      customsValue:round(customsValue),importDuty:round(importDuty),importVat:round(importVat),importDeclarationFee:round(idf),infrastructureLevy:round(infrastructure),excise:round(excise),environmentalLevy:round(environmentalLevy),brokerage:round(brokerage),paymentProcessing:round(commercial.paymentProcessing),recoverableTaxCashflow:round(recoverableTaxCashflow),whtCashflow:round(whtCashflow),serviceFee:round(commercial.serviceFee),freightMargin:round(commercial.freightMargin),fxMargin:round(commercial.fxMargin),contributionMargin:round(guard.contribution),contributionMarginPercent:Number((guard.margin*100).toFixed(2)),
    },
    estimateNotice:state==='requires_review'?'This item needs additional import or regulatory review before Kareebu can lock a payable quote.':'This is a reference landed estimate using effective-dated Uganda tariff assumptions. Kareebu refreshes source price, FX, shipping and tariff data before payment.',
    source:'reference-fixture',importerModel,hsCodeCandidate:classification.code,classificationConfidence:classification.confidence,requiresManualReview:classification.requiresManualReview||tariff.requiresManualReview||!guard.passes,tariffEffectiveFrom:tariff.effectiveFrom,tariffSource:tariff.source,
    assumptions:[...tariff.notes,'HS classification is a candidate only until verified.','Source pricing is fixture/reference data unless the marketplace adapter reports live status.',recoverability.importVatPotentiallyRecoverable?'Import VAT is shown as potential recoverable cash flow for the configured importer model and is not silently counted as permanent cost.':'Import VAT is included in the customer landed estimate for this importer model.',guard.passes?'Reference contribution-margin guard passed.':'Reference contribution-margin guard requires review.'],
  };
}

export const referenceGlobalQuoteProvider: GlobalQuoteProvider = { quote: async ({ product, country, quantity, importerModel }) => estimateGlobalQuote(product, country, quantity, importerModel) };
