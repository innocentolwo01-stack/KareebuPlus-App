import type { BrandIconSemantic } from '../components';
import type {
  CatalogCategory,
  CatalogSubcategory,
  CatalogVertical,
  KareebuDomainId,
  UnifiedCatalogItem,
} from '../catalog/master/kareebuUnifiedCatalog';

export type KareebuDiscoverySort =
  | 'recommended'
  | 'top-rated'
  | 'fastest'
  | 'price-low'
  | 'price-high';

export type KareebuDiscoveryFilterId =
  | 'offers'
  | 'rating'
  | 'fast'
  | 'free-delivery'
  | 'price'
  | 'nearby'
  | 'available-now'
  | 'today'
  | 'verified'
  | 'emergency'
  | 'member'
  | 'delivery-details';

export type KareebuDiscoveryFilter = {
  id: KareebuDiscoveryFilterId;
  label: string;
  icon: string;
};

export type KareebuDiscoveryPromo = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  chip: string;
  photo: string;
};

export type KareebuDiscoveryItem = UnifiedCatalogItem & {
  etaMinutes: number | null;
  distanceKm: number | null;
  freeDelivery: boolean | null;
  offerLabel: string | null;
  verified: boolean | null;
  photo: string;
};

export type KareebuDiscoveryHeader = {
  title: string;
  locationEyebrow: string;
  searchPlaceholder: string;
  semantic: BrandIconSemantic;
};

export type KareebuDiscoveryWidget =
  | { id:'hero'; type:'hero-carousel'; items:KareebuDiscoveryPromo[] }
  | { id:'filters'; type:'filter-rail'; items:KareebuDiscoveryFilter[] }
  | { id:'verticals'; type:'vertical-grid'; title:string; items:CatalogVertical[]; activeId:string | null }
  | { id:'categories'; type:'category-rail'; title:string; items:CatalogCategory[]; activeId:string | null }
  | { id:'subcategories'; type:'subcategory-grid'; title:string; items:CatalogSubcategory[]; activeId:string | null }
  | { id:'recommended'; type:'item-rail'; title:string; subtitle:string; items:KareebuDiscoveryItem[] }
  | { id:'all-items'; type:'item-list'; title:string; subtitle:string; items:KareebuDiscoveryItem[] }
  | { id:'membership'; type:'membership-strip' };

export type KareebuDiscoveryDocument = {
  page:'kareebu-discovery';
  version:1;
  domainId:KareebuDomainId;
  city:string;
  country:string;
  header:KareebuDiscoveryHeader;
  widgets:KareebuDiscoveryWidget[];
};

export type KareebuDiscoveryController = {
  document:KareebuDiscoveryDocument;
  domainId:KareebuDomainId;
  query:string;
  setQuery:(value:string)=>void;
  activeVerticalId:string|null;
  activeCategoryId:string|null;
  activeSubcategoryId:string|null;
  activeFilters:KareebuDiscoveryFilterId[];
  sort:KareebuDiscoverySort;
  filtersOpen:boolean;
  setFiltersOpen:(value:boolean)=>void;
  selectVertical:(id:string)=>void;
  openVertical:(id:string,title:string)=>void;
  selectCategory:(id:string)=>void;
  selectSubcategory:(id:string)=>void;
  toggleFilter:(id:KareebuDiscoveryFilterId)=>void;
  setSort:(sort:KareebuDiscoverySort)=>void;
  clearFilters:()=>void;
  openItem:(item:UnifiedCatalogItem)=>void;
  openMembership:()=>void;
};
