export type SettlementRecord = {
  id:string;
  provider:string;
  providerReference:string;
  expectedAmount:number;
  settledAmount:number;
  currency:string;
  settledAt:string;
};

export type ReconciliationException = {
  id:string;
  settlementId:string;
  type:'missing_provider_record'|'missing_ledger_record'|'amount_mismatch'|'duplicate_settlement'|'currency_mismatch';
  expectedAmount:number;
  actualAmount:number;
  status:'open'|'investigating'|'resolved';
  createdAt:string;
};

export function reconcileSettlement(record:SettlementRecord):ReconciliationException|null {
  if(record.expectedAmount===record.settledAmount) return null;
  return {
    id:`REC-${record.id}`,
    settlementId:record.id,
    type:'amount_mismatch',
    expectedAmount:record.expectedAmount,
    actualAmount:record.settledAmount,
    status:'open',
    createdAt:new Date().toISOString(),
  };
}
