# Kareebu Plus — Trust, Payments, Compliance & Global Commerce Patch

Date: 23 August 2026

## Product decision

The separate **Kareebu Bank** concept is intentionally parked. This patch does not turn Kareebu Plus into a bank, e-money issuer, or independently regulated customer-funds custodian.

Kareebu Pay in this patch is an orchestration and customer-experience layer over configured licensed payment providers. Any future regulated stored-value or banking product must be scoped and licensed separately.

## What this patch adds

### Payment orchestration

- Market-aware payment rails for mobile money, cards, bank transfer and controlled cash states.
- Asynchronous payment lifecycle: `created`, `awaiting_customer`, `submitted`, `provider_processing`, `authorised`, `settled`, `failed`, `reversed`, `disputed`, `refunded`.
- Idempotency keys so retries are not treated as new charges.
- Provider-side verification boundary before fulfilment.
- Settlement reconciliation exception model.
- Retry queue for weak-connectivity/provider outages.

### Operational accounting

- Balanced double-entry transaction contract for Kareebu platform accounting.
- Clearing/payable/revenue/refund/reserve accounts.
- This is an operational ledger, not a customer bank-account product.

### Fraud, identity and device trust

- Central explainable risk engine with actions: allow, monitor, step-up, hold, manual review, decline.
- Signals for device/account/payment changes, velocity, promotion/refund abuse, linked accounts and high-value Global procurement.
- Tiered identity architecture: Basic, Verified and Enhanced.
- Identity-provider interface that does not pretend verification is live when no provider is configured.
- Trusted-device model and step-up rules.
- Sanctions/PEP provider boundary returning provider-unavailable rather than a fake clear result.

### Merchants, captains and delivery

- Merchant KYB provider boundary.
- Merchant trust states, settlement delays and reserve percentages.
- Captain/courier document/liveness re-verification model.
- Delivery proof policies including rotating PIN and high-value secure handover.
- Merchant settlement domain model.

### Customer protection

- Security & Privacy centre.
- Disputes & Refunds centre with case timelines.
- Receipts & Documents centre.
- Refund-risk decision model.
- Trust & Safety case structure linking users, merchants, captains, devices, payments, orders and evidence.

### Policy and regulation

- Independent Uganda, Kenya and Tanzania compliance packs.
- Effective-dated policy overrides / regulatory kill switches.
- Global browsing and Global procurement are independently controllable, so procurement can be paused without removing tracking or discovery.
- Operational incident model.
- Maker-checker approval model for sensitive staff actions.
- Audit-event architecture.
- Privacy purposes, consent, retention and data-request models.

### Promotion protection

- Campaign budget, redemption, per-customer and fraud-loss control fields.
- Promotion eligibility model using account/device/payment/address reuse signals.

## Kareebu Global additions

### Catalogue and marketplace architecture

- Deterministic development catalogue target: **2,040 products**.
- Six source/marketplace identities: Amazon, eBay, SHEIN, Temu, AliExpress and Etsy.
- Capability-based adapters distinguish reference-only, catalogue-connected, price-connected, procurement-supported and checkout-connected states.
- Amazon App Submission API is not used as a retail catalogue API.
- Amazon SP-API is modelled behind an authorised provider boundary and is not treated as unrestricted consumer checkout access.
- eBay Browse/Catalog/Taxonomy capabilities are separated from production checkout approval.
- No fabricated SHEIN/Temu/AliExpress/Etsy API capability.
- Fixture/live/price-freshness metadata is explicit.

### Deep taxonomy

The Global catalogue includes deep reusable taxonomy for Electronics, Fashion, Beauty, Home, Baby & Kids, Sports, Pets and related categories. Meaningful taxonomy nodes use the shared landing-page architecture rather than bespoke hard-coded screens.

### Uganda landed-cost architecture

The quote engine no longer uses one blanket import multiplier.

It supports:

- HS-code candidate classification with confidence/manual-review state.
- Effective-dated Uganda tariff profiles.
- Customs value.
- Import duty.
- Excise/environmental levy fields.
- Import Declaration Fee.
- Infrastructure Levy.
- Import VAT.
- Import WHT cash-flow representation.
- Brokerage and international/local fulfilment.
- Importer model: customer, Kareebu, third party or consolidator.
- Recoverable/creditable tax vs irrecoverable landed cost vs cash-flow requirement.
- Quote states such as estimated, review required, locked, expired, price changed, tariff changed and restricted.

Uganda tariff data in this development patch is **reference configuration**, not a legal tariff determination. Production requires an authoritative tariff source, customs classification process and Uganda tax/customs sign-off.

Kenya and Tanzania do not inherit Uganda tariff assumptions. Their payable Global quotes remain provider/review dependent until country-specific tariff integrations exist.

### Commercial economics

Government tax is not modelled as Kareebu profit. The commercial layer supports:

- Service/procurement fee.
- Customer freight charge vs actual freight cost.
- Freight margin.
- FX spread and rate lock metadata.
- Local-delivery economics.
- Returns/loss provision.
- Sponsored merchandising / partner revenue boundaries.
- Contribution amount and percentage.
- Minimum contribution guard/manual-review path.

### High-value Global risk

Global checkout now performs a reference risk assessment and can place an order in `verification_hold` before overseas procurement. Payment attempts use an idempotency key and remain in provider-processing state until a genuine provider confirms the payment.

A policy kill switch can pause new Global procurement while allowing Global discovery and tracking to remain available.

## Production integrations still required

The patch deliberately does not fake these systems:

- Production PSP/mobile-money/card credentials and signed webhook verification.
- Live KYC/liveness/document provider.
- Production device-integrity provider.
- Sanctions/PEP data provider.
- Merchant/company registry and bank-account verification integrations.
- Captain licence/vehicle/insurance verification providers.
- Authoritative Uganda tariff/HS classification service and customs-broker integration.
- Kenya/Tanzania tariff engines.
- Production FX source/treasury policy.
- EFRIS/fiscalisation connection where legally required.
- Live marketplace/catalogue/procurement credentials or commercial agreements.
- Secure backend persistence for audit, ledger, risk and compliance cases.
- Role-based internal Trust & Safety console.

## Validation performed in the packaged source

Static project validators run successfully in the packaging environment, including:

- main validation suite: 138/138
- UX/UI contracts: 7/7
- navigation: 13/13
- marketplace: 53/53
- Food: 18/18
- mobility: 22/22
- interactions: 2/2
- Home services: 10/10
- DineOut: 16/16
- Rides map: 15/15
- Global systems: all checks passed
- Trust/Payments/Policy: 16/16
- Visual asset resolver: 29/29 PNG masters and 7/7 resolver contracts

A TypeScript syntax transpilation check was also performed over the source without syntax errors.

A full post-patch `npm run typecheck` must still be run in the user's local KareebuPlus-Codex checkout, because this portable archive intentionally excludes `node_modules` and the packaging runtime does not contain the project's Expo/React Native dependency tree.

## Apply policy

The patch application package intentionally does not:

- modify `.env`
- run `git reset`
- run `git clean`
- switch branches
- merge
- push
- delete unrelated local files

Run it only against the current `codex/full-ux-system-pass` worktree.
