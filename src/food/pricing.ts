import type { DemoMenuItem, DemoRestaurant } from '../demoData';
import { foodConfigurationFor } from './catalog';
import type { FoodCartLine, FoodCheckoutDraft } from './types';
import { applyDemand, demandQuote } from '../pricing/demand';

export function configuredUnitPrice(item: DemoMenuItem, selections: Record<string, string>, addonIds: string[]) {
  const config = foodConfigurationFor(item);
  const choiceDelta = config.choiceGroups.reduce((sum, group) => {
    const selected = group.options.find((option) => option.id === selections[group.id]);
    return sum + (selected?.priceDelta ?? 0);
  }, 0);
  const addons = config.addons.reduce((sum, addon) => sum + (addonIds.includes(addon.id) ? addon.price : 0), 0);
  return item.price + choiceDelta + addons;
}

export function foodCartLineId(itemId: string, selections: Record<string, string>, addonIds: string[]) {
  const choiceKey = Object.entries(selections).sort(([a], [b]) => a.localeCompare(b)).map(([group, option]) => `${group}:${option}`).join('|');
  const addonKey = [...addonIds].sort().join('|');
  return `${itemId}::${choiceKey}::${addonKey}`;
}

export function foodSubtotal(lines: FoodCartLine[]) {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function foodItemCount(lines: FoodCartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function foodCheckoutTotals(restaurant: DemoRestaurant, lines: FoodCartLine[], draft: FoodCheckoutDraft) {
  const subtotal = foodSubtotal(lines);
  const discount = 0;
  const baseDeliveryFee = draft.orderType === 'takeaway' ? 0 : restaurant.deliveryFee;
  const demand = demandQuote('food-delivery', { scheduled: draft.schedule !== 'Now' });
  const demandFee = applyDemand(baseDeliveryFee, demand);
  const deliveryFee = demandFee.totalFee;
  const deliveryDemandAdjustment = demandFee.demandAdjustment;
  const serviceFee = subtotal > 0 ? 1000 : 0;
  const tip = draft.orderType === 'takeaway' ? 0 : draft.tip;
  const total = Math.max(0, subtotal - discount + deliveryFee + serviceFee + tip);
  return { subtotal, discount, baseDeliveryFee, deliveryFee, deliveryDemandAdjustment, demand, serviceFee, tip, total };
}

export const FOOD_COUPON_CODES: readonly string[] = [];
export type FoodCouponCode = string;

export function bestFoodCoupon(restaurant: DemoRestaurant, lines: FoodCartLine[], draft: FoodCheckoutDraft): FoodCouponCode | null {
  if (foodSubtotal(lines) <= 0) return null;
  const baseline = foodCheckoutTotals(restaurant, lines, { ...draft, couponCode: null }).total;
  return FOOD_COUPON_CODES.map((code) => ({ code, saving: baseline - foodCheckoutTotals(restaurant, lines, { ...draft, couponCode: code }).total }))
    .filter(({ saving }) => saving > 0).sort((a, b) => b.saving - a.saving)[0]?.code ?? null;
}
