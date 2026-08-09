export type ProductBrand = {
  id?: string;
  name: string;
};

export type ProductDimensions = {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'in';
};

export type NutritionFact = {
  label: string;
  value: string;
};

/**
 * Canonical Kareebu product metadata.
 *
 * The core fields mirror data exposed by the 6amMart item/store-category
 * models (brand, manufacturer, unit, stock, nutrition, allergies, generic
 * names, organic/halal/prescription, ratings, discounts and delivery flags).
 * Physical dimensions, SKU/barcode, ingredients, origin, warranty and return
 * information are deliberate Kareebu catalogue enrichments so the same model
 * can support richer retail catalogues without another schema migration.
 */
export type ProductMetadata = {
  brand?: ProductBrand;
  manufacturer?: string;
  sku?: string;
  barcode?: string;
  unitType?: string;
  unitValue?: string;
  netWeight?: string;
  dimensions?: ProductDimensions;
  countryOfOrigin?: string;
  stock?: number;
  maximumCartQuantity?: number;
  averageRating?: number;
  ratingCount?: number;
  organic?: boolean;
  halal?: boolean;
  vegetarian?: boolean;
  prescriptionRequired?: boolean;
  verifiedSeller?: boolean;
  freeDelivery?: boolean;
  taxRatePercent?: number;
  nutritionSummary?: string[];
  nutritionFacts?: NutritionFact[];
  ingredients?: string[];
  allergens?: string[];
  genericNames?: string[];
  storageInstructions?: string;
  careInstructions?: string;
  warranty?: string;
  returnPolicy?: string;
};
