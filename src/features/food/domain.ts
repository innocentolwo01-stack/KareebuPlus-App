export type FoodMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageKey?: string;
  popular?: boolean;
  badge?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviews: string;
  eta: string;
  deliveryFee: number;
  distance: string;
  offer?: string;
  plus?: boolean;
  categories: string[];
  menu: FoodMenuItem[];
};
