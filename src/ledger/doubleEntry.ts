export type LedgerAccountType='asset'|'liability'|'revenue'|'expense'|'clearing'|'reserve';
export type LedgerEntry={account:string;accountType:LedgerAccountType;debit:number;credit:number;currency:string;memo:string};
export type LedgerTransaction={id:string;reference:string;createdAt:string;entries:LedgerEntry[];status:'pending'|'posted'|'reversed'};

export function isBalanced(entries:LedgerEntry[], tolerance=.001):boolean {
  const debit=entries.reduce((sum,item)=>sum+item.debit,0);
  const credit=entries.reduce((sum,item)=>sum+item.credit,0);
  return Math.abs(debit-credit)<=tolerance;
}

export function createLedgerTransaction(reference:string,entries:LedgerEntry[]):LedgerTransaction {
  if(!isBalanced(entries)) throw new Error(`Unbalanced ledger transaction: ${reference}`);
  return {id:`LED-${reference}`,reference,createdAt:new Date().toISOString(),entries,status:'pending'};
}

export const PLATFORM_LEDGER_ACCOUNTS={
  paymentClearing:'clearing.payment_provider',
  merchantPayable:'liability.merchant_payable',
  captainPayable:'liability.captain_payable',
  courierPayable:'liability.courier_payable',
  globalProcurement:'asset.global_procurement',
  taxPayable:'liability.tax_payable',
  rewardsLiability:'liability.rewards',
  refundsClearing:'clearing.refunds',
  chargebackReserve:'reserve.chargebacks',
  kareebuRevenue:'revenue.kareebu',
} as const;
