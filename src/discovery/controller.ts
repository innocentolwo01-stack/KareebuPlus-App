import { useEffect, useMemo, useState } from 'react';
import {
  KAREEBU_CATALOG_VERTICALS,
  type KareebuDomainId,
  type UnifiedCatalogItem,
} from '../catalog/master/kareebuUnifiedCatalog';
import { buildKareebuDiscoveryDocument } from './document';
import type {
  KareebuDiscoveryController,
  KareebuDiscoveryFilterId,
  KareebuDiscoverySort,
} from './types';

export function useKareebuDiscoveryController(input:{
  domainId:KareebuDomainId;
  city:string;
  country:string;
  initialVerticalTitle?:string;
  onOpenItem:(item:UnifiedCatalogItem)=>void;
  onOpenMembership:()=>void;
  onOpenVertical?:(id:string,title:string)=>void;
}):KareebuDiscoveryController{
  const initialVertical=useMemo(()=>{
    const candidates=KAREEBU_CATALOG_VERTICALS.filter((node)=>node.domainId===input.domainId);
    if(!input.initialVerticalTitle) return candidates[0]??null;
    const needle=input.initialVerticalTitle.toLowerCase();
    return candidates.find((node)=>node.title.toLowerCase().includes(needle))??candidates[0]??null;
  },[input.domainId,input.initialVerticalTitle]);

  const [query,setQuery]=useState('');
  const [activeVerticalId,setActiveVerticalId]=useState<string|null>(initialVertical?.id??null);
  const [activeCategoryId,setActiveCategoryId]=useState<string|null>(null);
  const [activeSubcategoryId,setActiveSubcategoryId]=useState<string|null>(null);
  const [activeFilters,setActiveFilters]=useState<KareebuDiscoveryFilterId[]>([]);
  const [sort,setSort]=useState<KareebuDiscoverySort>('recommended');
  const [filtersOpen,setFiltersOpen]=useState(false);

  useEffect(()=>{
    setQuery('');
    setActiveVerticalId(initialVertical?.id??null);
    setActiveCategoryId(null);
    setActiveSubcategoryId(null);
    setActiveFilters([]);
    setSort('recommended');
    setFiltersOpen(false);
  },[input.domainId,initialVertical?.id]);

  const document=useMemo(()=>buildKareebuDiscoveryDocument({
    domainId:input.domainId,
    city:input.city,
    country:input.country,
    query,
    verticalId:activeVerticalId,
    categoryId:activeCategoryId,
    subcategoryId:activeSubcategoryId,
    filters:activeFilters,
    sort,
  }),[
    input.domainId,input.city,input.country,query,activeVerticalId,
    activeCategoryId,activeSubcategoryId,activeFilters,sort,
  ]);

  const toggleFilter=(id:KareebuDiscoveryFilterId)=>{
    setActiveFilters((current)=>current.includes(id)?current.filter((value)=>value!==id):[...current,id]);
  };

  return {
    document,
    domainId:input.domainId,
    query,
    setQuery,
    activeVerticalId,
    activeCategoryId,
    activeSubcategoryId,
    activeFilters,
    sort,
    filtersOpen,
    setFiltersOpen,
    selectVertical:(id)=>{
      setActiveVerticalId(id);
      setActiveCategoryId(null);
      setActiveSubcategoryId(null);
    },
    openVertical:(id,title)=>input.onOpenVertical?.(id,title),
    selectCategory:(id)=>{
      setActiveCategoryId(id);
      setActiveSubcategoryId(null);
    },
    selectSubcategory:(id)=>setActiveSubcategoryId((current)=>current===id?null:id),
    toggleFilter,
    setSort,
    clearFilters:()=>{
      setActiveFilters([]);
      setSort('recommended');
    },
    openItem:input.onOpenItem,
    openMembership:input.onOpenMembership,
  };
}
