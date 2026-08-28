export type RetryableOperationState='queued'|'processing'|'succeeded'|'failed'|'manual_review';
export type RetryableOperation={id:string;kind:'payment_verify'|'refund'|'settlement_reconcile'|'order_status';attempts:number;maxAttempts:number;state:RetryableOperationState;nextAttemptAt:string;idempotencyKey:string;lastError?:string};

export function nextRetry(operation:RetryableOperation, error:string):RetryableOperation {
  const attempts=operation.attempts+1;
  const state:RetryableOperationState=attempts>=operation.maxAttempts?'manual_review':'queued';
  const delayMinutes=Math.min(60,Math.pow(2,attempts));
  return {...operation,attempts,state,lastError:error,nextAttemptAt:new Date(Date.now()+delayMinutes*60_000).toISOString()};
}
