import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const check=(name,condition)=>checks.push({name,ok:Boolean(condition)});

const payment=read('src/payments/orchestrator.ts');
const paymentTypes=read('src/payments/types.ts');
const risk=read('src/trust/riskEngine.ts');
const identity=read('src/trust/identity.ts');
const merchant=read('src/trust/merchantRisk.ts');
const delivery=read('src/trust/deliveryProof.ts');
const policy=read('src/policy/countryCompliance.ts');
const flags=read('src/policy/featureFlags.ts');
const ledger=read('src/ledger/doubleEntry.ts');
const quote=read('src/global/quoteEngine.ts');
const tariffs=read('src/global/tariffs.ts');
const catalog=read('src/global/catalog.ts');
const screens=read('src/screens.tsx');
const types=read('src/types.ts');

check('payment state machine covers provider processing and reversals',/provider_processing/.test(paymentTypes)&&/reversed/.test(paymentTypes)&&/refunded/.test(paymentTypes));
check('payment orchestration uses idempotency key',/idempotencyKey/.test(payment)&&/providerFor/.test(payment));
check('payment providers are market-aware',/mtn_momo/.test(payment)&&/mpesa/.test(payment)&&/card_processor/.test(payment));
check('fraud engine supports step-up hold review decline',/step_up/.test(risk)&&/manual_review/.test(risk)&&/decline/.test(risk));
check('identity supports basic verified enhanced tiers',/basic/.test(identity)&&/verified/.test(identity)&&/enhanced/.test(identity));
check('merchant settlement policy supports reserves and delays',/reservePercent/.test(merchant)&&/delayDays/.test(merchant));
check('high-value delivery uses rotating PIN architecture',/rotatingDeliveryPin/.test(delivery)&&/high_value_secure/.test(delivery));
check('country compliance packs are independent',/Uganda/.test(policy)&&/Kenya/.test(policy)&&/Tanzania/.test(policy));
check('regulatory kill switches are effective-dated',/effectiveFrom/.test(flags)&&/featureEnabled/.test(flags));
check('operational ledger requires balanced double-entry',/isBalanced/.test(ledger)&&/Unbalanced ledger transaction/.test(ledger));
check('global quote no longer uses a single blanket category tax multiplier',!/product\.category === 'electronics' \? 0\.18 : 0\.12/.test(quote));
check('global quote separates recoverable tax cash flow',/recoverableTaxCashflow/.test(quote)&&/whtCashflow/.test(quote));
check('Uganda tariffs are effective-dated reference profiles',/effectiveFrom:'2026-07-01'/.test(tariffs)&&/referenceOnly:true/.test(tariffs));
check('Global catalogue targets 2040 products',/electronics:300/.test(catalog)&&/fashion:500/.test(catalog)&&/accessories:140/.test(catalog));
check('customer security routes exist',/securityCenter/.test(types)&&/disputeCenter/.test(types)&&/receiptsDocuments/.test(types));
check('customer account surfaces security and dispute controls',/Security & privacy/.test(screens)&&/Disputes & refunds/.test(screens)&&/Receipts & documents/.test(screens));

let failed=0;
for(const item of checks){console.log(`${item.ok?'PASS':'FAIL'} — ${item.name}`);if(!item.ok) failed++;}
console.log(`\nKareebu Trust/Payments/Policy contracts: ${checks.length-failed}/${checks.length}.`);
process.exit(failed?1:0);
