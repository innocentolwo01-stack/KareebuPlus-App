import type { PromotionPlacement, PromotionService } from '../promotions/types';

export type TaxonomyNodeType =
  | 'service'
  | 'vertical'
  | 'marketplace'
  | 'merchant'
  | 'department'
  | 'category'
  | 'subcategory'
  | 'child_category'
  | 'brand'
  | 'collection'
  | 'campaign'
  | 'occasion'
  | 'cuisine'
  | 'activity_type'
  | 'area'
  | 'editorial_collection';

export type TaxonomyDomain =
  | 'pharmacy'
  | 'groceries'
  | 'electronics'
  | 'beauty'
  | 'fashion'
  | 'pets'
  | 'home'
  | 'butchery'
  | 'gifts'
  | 'global'
  | 'goout'
  | 'dineout'
  | 'services';

export type TaxonomyMerchandisingProfile =
  | 'very-high'
  | 'high'
  | 'medium-high'
  | 'medium'
  | 'low';

export type TaxonomyNode = {
  id: string;
  slug: string;
  type: TaxonomyNodeType;
  domain: TaxonomyDomain;
  parentId?: string;
  title: string;
  shortTitle?: string;
  description: string;
  visualKey: string;
  searchPlaceholder: string;
  merchandisingProfile: TaxonomyMerchandisingProfile;
  promotionService: PromotionService;
  heroPlacement?: PromotionPlacement;
  inlinePlacement?: PromotionPlacement;
  productTerms?: string[];
  merchantCategories?: string[];
  brands?: string[];
  leaf?: boolean;
  productionStatus?: 'production-ready' | 'fixture-backed' | 'needs-production-art';
};

export type TaxonomyPath = {
  node: TaxonomyNode;
  ancestors: TaxonomyNode[];
  children: TaxonomyNode[];
  isLeaf: boolean;
};
