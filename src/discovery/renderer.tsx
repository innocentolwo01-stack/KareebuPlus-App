import React from 'react';
import type {
  KareebuDiscoveryController,
  KareebuDiscoveryWidget,
} from './types';
import {
  DiscoveryCategoryRail,
  DiscoveryFilterRail,
  DiscoveryHeroCarousel,
  DiscoveryItemList,
  DiscoveryItemRail,
  DiscoveryMembershipStrip,
  DiscoverySubcategoryGrid,
  DiscoveryVerticalGrid,
} from './widgets';

export function renderKareebuDiscoveryWidget(
  widget:KareebuDiscoveryWidget,
  controller:KareebuDiscoveryController,
):React.ReactNode{
  switch(widget.type){
    case 'hero-carousel':
      return <DiscoveryHeroCarousel items={widget.items} domainId={controller.domainId} onOffer={()=>controller.toggleFilter('offers')}/>;
    case 'filter-rail':
      return <DiscoveryFilterRail controller={controller}/>;
    case 'vertical-grid':
      return <DiscoveryVerticalGrid controller={controller} title={widget.title} items={widget.items} activeId={widget.activeId}/>;
    case 'category-rail':
      return <DiscoveryCategoryRail controller={controller} title={widget.title} items={widget.items} activeId={widget.activeId}/>;
    case 'subcategory-grid':
      return <DiscoverySubcategoryGrid controller={controller} title={widget.title} items={widget.items} activeId={widget.activeId}/>;
    case 'item-rail':
      return <DiscoveryItemRail controller={controller} title={widget.title} subtitle={widget.subtitle} items={widget.items}/>;
    case 'item-list':
      return <DiscoveryItemList controller={controller} title={widget.title} subtitle={widget.subtitle} items={widget.items}/>;
    case 'membership-strip':
      return <DiscoveryMembershipStrip controller={controller}/>;
    default:
      return null;
  }
}
