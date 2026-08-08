import type { DemoMenuItem } from '../demoData';

export type FoodChoiceOption = {
  id: string;
  label: string;
  priceDelta: number;
};

export type FoodChoiceGroup = {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
  options: FoodChoiceOption[];
};

export type FoodAddon = {
  id: string;
  label: string;
  price: number;
};

export type FoodItemConfiguration = {
  choiceGroups: FoodChoiceGroup[];
  addons: FoodAddon[];
  maxQuantity: number;
};

export type FoodCartLine = {
  id: string;
  restaurantId: string;
  itemId: string;
  quantity: number;
  selections: Record<string, string>;
  addonIds: string[];
  specialInstructions: string;
  unitPrice: number;
};

export type FoodOrderType = 'delivery' | 'takeaway';
export type FoodPaymentMethod = 'mtn' | 'airtel' | 'visa' | 'cash';

export type FoodCheckoutDraft = {
  orderType: FoodOrderType;
  schedule: string;
  deliveryInstruction: string;
  tip: number;
  couponCode: string | null;
  paymentMethod: FoodPaymentMethod;
};

export type FoodOrder = {
  id: string;
  restaurantId: string;
  placedAt: string;
  etaMinutes: number;
  total: number;
  itemCount: number;
  orderType: FoodOrderType;
  schedule: string;
  deliveryInstruction: string;
  paymentMethod: FoodPaymentMethod;
  status: 'confirmed' | 'preparing' | 'picked_up' | 'delivered';
};

export type FoodCartLineView = FoodCartLine & {
  item: DemoMenuItem;
  selectionLabels: string[];
  addonLabels: string[];
};

export function createFoodCheckoutDraft(): FoodCheckoutDraft {
  return {
    orderType: 'delivery',
    schedule: 'Now',
    deliveryInstruction: 'Hand it to me',
    tip: 0,
    couponCode: null,
    paymentMethod: 'mtn',
  };
}
