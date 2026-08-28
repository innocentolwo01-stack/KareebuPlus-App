import type { Screen } from '../types';

export type TransactionKind = 'rides' | 'boda' | 'food' | 'shops' | 'groceries' | 'pharmacy' | 'send' | 'services' | 'dineout' | 'goout' | 'global';
export type TransactionPhase = 'discovering' | 'selecting' | 'reviewing' | 'confirming' | 'processing' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type UnifiedTransaction = {
  id: string;
  kind: TransactionKind;
  phase: TransactionPhase;
  substate?: string;
  title: string;
  detail: string;
  updatedAt: string;
  screen: Screen;
  active: boolean;
  source: 'live' | 'fixture' | 'local-session';
};

export function activeTransactions(items: UnifiedTransaction[]) {
  return items
    .filter((item) => item.active && !['completed', 'cancelled', 'failed'].includes(item.phase))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function transactionStatus(item: UnifiedTransaction) {
  return item.substate?.replaceAll('_', ' ') ?? item.phase.replaceAll('_', ' ');
}
