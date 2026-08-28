export type CommercePaymentMethod = 'mtn' | 'airtel' | 'visa' | 'cash';

export type CommerceCartLine = {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  variantId: string | null;
  variantLabel: string | null;
  note: string;
};

export type CommerceCheckoutDraft = {
  fulfillment: 'delivery' | 'pickup';
  schedule: string;
  deliveryInstruction: string;
  couponCode: string | null;
  paymentMethod: CommercePaymentMethod;
};

export type CommerceOrder = {
  id: string;
  storeId: string;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: CommercePaymentMethod;
  fulfillment: 'delivery' | 'pickup';
  schedule: string;
  status: 'confirmed' | 'packing' | 'courier_assigned' | 'delivered';
};

export type ParcelDraft = {
  mode: 'city' | 'country';
  pickupAddress: string;
  dropoffAddress: string;
  parcelType: 'Documents' | 'Small parcel' | 'Medium parcel' | 'Large parcel';
  weightKg: number;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  instructions: string;
  paymentMethod: CommercePaymentMethod;
};

export type ParcelOrder = {
  id: string;
  fee: number;
  eta: string;
  status: 'confirmed' | 'courier_assigned' | 'picked_up' | 'in_transit' | 'delivered';
  pickupAddress: string;
  dropoffAddress: string;
  receiverName: string;
  parcelType: ParcelDraft['parcelType'];
};

export type RideFareBid = {
  id: string;
  driverName: string;
  rating: number;
  etaMinutes: number;
  fare: number;
  vehicle: string;
};

export type RentalBooking = {
  id: string;
  vehicleId: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  total: number;
  status: 'confirmed' | 'ready' | 'active' | 'completed';
};

export type ServiceRequest = {
  serviceId: string;
  providerId: string | null;
  address: string;
  schedule: string;
  note: string;
  budget: number;
};

export type ServiceBooking = {
  id: string;
  serviceId: string;
  providerId: string;
  providerName: string;
  schedule: string;
  total: number;
  status: 'confirmed' | 'provider_assigned' | 'on_the_way' | 'in_progress' | 'completed';
};

export type RewardLedgerEntry = {
  id: string;
  title: string;
  points: number;
  kind: 'earn' | 'spend';
  date: string;
};

export function createCommerceCheckoutDraft(): CommerceCheckoutDraft {
  return {
    fulfillment: 'delivery',
    schedule: 'Now',
    deliveryInstruction: 'Hand it to me',
    couponCode: null,
    paymentMethod: 'mtn',
  };
}

export function createParcelDraft(city = 'Kampala'): ParcelDraft {
  return {
    mode: 'city',
    pickupAddress: city,
    dropoffAddress: `${city} centre`,
    parcelType: 'Documents',
    weightKg: 1,
    senderName: 'John Ssekandi',
    senderPhone: '0772 123456',
    receiverName: '',
    receiverPhone: '',
    instructions: '',
    paymentMethod: 'mtn',
  };
}

export function createServiceRequest(city = 'Kampala'): ServiceRequest {
  return {
    serviceId: 'cleaning',
    providerId: null,
    address: city,
    schedule: 'Today · 4:00 PM',
    note: '',
    budget: 45000,
  };
}
