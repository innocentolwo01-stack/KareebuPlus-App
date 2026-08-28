import React, { memo, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { DEMO_PROMOTION_CATALOG } from './catalog';
import { eligiblePromotions, recordPromotionClick, recordPromotionImpression } from './engine';
import { CompactPromotion, DoublePromotionGrid, PromotionHero } from './PromotionCards';
import { PromoCarousel } from './PromoCarousel';
import type { PromotionCampaign, PromotionPlacement, PromotionService } from './types';

export type PromotionSurfaceLayout = 'hero' | 'carousel' | 'compact' | 'grid';

type Props = {
  service: PromotionService;
  placement: PromotionPlacement;
  country: string;
  city: string;
  layout?: PromotionSurfaceLayout;
  categoryId?: string;
  subcategoryId?: string;
  sellerId?: string;
  marketplaceId?: string;
  merchantType?: string;
  brandId?: string;
  nodeId?: string;
  nodeType?: string;
  sessionId?: string;
  limit?: number;
  onPress: (campaign: PromotionCampaign) => void;
};

export const PromotionSurface = memo(function PromotionSurface({
  service,
  placement,
  country,
  city,
  layout = 'carousel',
  categoryId,
  subcategoryId,
  sellerId,
  marketplaceId,
  merchantType,
  brandId,
  nodeId,
  nodeType,
  sessionId,
  limit = layout === 'grid' ? 2 : layout === 'carousel' ? 4 : 1,
  onPress,
}: Props) {
  const context = useMemo(() => ({ service, placement, country, city, categoryId, subcategoryId, sellerId, marketplaceId, merchantType, brandId, nodeId, nodeType, sessionId }), [service, placement, country, city, categoryId, subcategoryId, sellerId, marketplaceId, merchantType, brandId, nodeId, nodeType, sessionId]);
  const campaigns = useMemo(() => eligiblePromotions(DEMO_PROMOTION_CATALOG, context).slice(0, limit), [context, limit]);

  useEffect(() => {
    campaigns.forEach(campaign => recordPromotionImpression(campaign, context));
  }, [campaigns, context]);

  if (!campaigns.length) return null;
  const open = (campaign:PromotionCampaign) => {
    recordPromotionClick(campaign, context);
    onPress(campaign);
  };

  if (layout === 'hero') return <View style={styles.single}><PromotionHero campaign={campaigns[0]} onPress={open}/></View>;
  if (layout === 'compact') return <View style={styles.single}><CompactPromotion campaign={campaigns[0]} onPress={open}/></View>;
  if (layout === 'grid') return <View style={styles.single}><DoublePromotionGrid campaigns={campaigns} onPress={open}/></View>;
  return <View style={styles.bleed}><PromoCarousel campaigns={campaigns} onPress={open}/></View>;
});

const styles=StyleSheet.create({single:{marginVertical:6},bleed:{marginHorizontal:-16,marginVertical:6}});
