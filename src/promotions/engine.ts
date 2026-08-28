import type { PromotionCampaign, PromotionContext, PromotionPlacement } from './types';

export type PromotionRuntimeContext = PromotionContext & {
  placement: PromotionPlacement;
  audience?: 'new' | 'returning' | 'all';
  paymentMethod?: string;
  sessionId?: string;
};

type FrequencyRecord = { impressions: number; dismissed: boolean; lastSeenAt: number; clicks: number };
const sessionLedger = new Map<string, FrequencyRecord>();

function ledgerKey(campaign: PromotionCampaign, context: PromotionRuntimeContext) {
  return `${context.sessionId ?? 'session'}:${context.country}:${context.city}:${campaign.id}`;
}

function matchesContext(campaign: PromotionCampaign, context: PromotionRuntimeContext) {
  if (campaign.categoryId && context.categoryId && campaign.categoryId !== context.categoryId) return false;
  if (campaign.subcategoryId && context.subcategoryId && campaign.subcategoryId !== context.subcategoryId) return false;
  if (campaign.sellerId && context.sellerId && campaign.sellerId !== context.sellerId) return false;
  if (campaign.marketplaceId && context.marketplaceId && campaign.marketplaceId !== context.marketplaceId) return false;
  if (campaign.merchantType && context.merchantType && campaign.merchantType !== context.merchantType) return false;
  if (campaign.brandId && context.brandId && campaign.brandId !== context.brandId) return false;
  return true;
}

export function eligiblePromotions(source: PromotionCampaign[], context: PromotionRuntimeContext) {
  const now = (context.now ?? new Date()).getTime();
  return source.filter((campaign) => {
    const record = sessionLedger.get(ledgerKey(campaign, context));
    const cooldownMs = (campaign.cooldownHours ?? 0) * 60 * 60 * 1000;
    const inCooldown = Boolean(record?.lastSeenAt && cooldownMs > 0 && now - record.lastSeenAt < cooldownMs);
    const cap = campaign.sessionCap ?? campaign.frequencyCap;
    return campaign.enabled
      && campaign.service === context.service
      && (!campaign.placement || campaign.placement === context.placement)
      && (!campaign.country || campaign.country === context.country)
      && (!campaign.city || campaign.city === context.city)
      && (!campaign.membershipRequired || context.member)
      && (!campaign.paymentMethod || campaign.paymentMethod === context.paymentMethod)
      && (!campaign.audience || campaign.audience === 'all' || !context.audience || campaign.audience === context.audience)
      && (!campaign.startAt || new Date(campaign.startAt).getTime() <= now)
      && (!campaign.endAt || new Date(campaign.endAt).getTime() >= now)
      && matchesContext(campaign, context)
      && !record?.dismissed
      && !inCooldown
      && (!cap || (record?.impressions ?? 0) < cap);
  }).sort((a, b) => b.priority - a.priority);
}

export function recordPromotionImpression(campaign: PromotionCampaign, context: PromotionRuntimeContext) {
  const key = ledgerKey(campaign, context);
  const current = sessionLedger.get(key);
  sessionLedger.set(key, { impressions: (current?.impressions ?? 0) + 1, dismissed: current?.dismissed ?? false, lastSeenAt: Date.now(), clicks: current?.clicks ?? 0 });
}

export function recordPromotionClick(campaign: PromotionCampaign, context: PromotionRuntimeContext) {
  const key = ledgerKey(campaign, context);
  const current = sessionLedger.get(key);
  sessionLedger.set(key, { impressions: current?.impressions ?? 0, dismissed: current?.dismissed ?? false, lastSeenAt: Date.now(), clicks: (current?.clicks ?? 0) + 1 });
}

export function dismissPromotion(campaign: PromotionCampaign, context: PromotionRuntimeContext) {
  const key = ledgerKey(campaign, context);
  const current = sessionLedger.get(key);
  sessionLedger.set(key, { impressions: current?.impressions ?? 0, dismissed: true, lastSeenAt: Date.now(), clicks: current?.clicks ?? 0 });
}

export function resetPromotionSession(sessionId?: string) {
  if (!sessionId) {
    sessionLedger.clear();
    return;
  }
  for (const key of [...sessionLedger.keys()]) {
    if (key.startsWith(`${sessionId}:`)) sessionLedger.delete(key);
  }
}
