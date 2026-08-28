import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, TYPE } from '../../theme';

import { useKareebuFoodHomeController } from './controller';
import { renderKareebuFoodWidget } from './renderer';
import { AllRestaurantFeedRow, AllRestaurantsFeedHeader } from './widgets/sections';
import {
  FoodFiltersSurface,
  FoodListingSurface,
  FoodSearchSurface,
} from './surfaces';
import type {
  FoodHomeActions,
  FoodHomeRestaurant,
  FoodHomeWidget,
} from './types';
import { promotionsFor } from '../../promotions/catalog';
import type { PromotionCampaign } from '../../promotions/types';
import { KareebuPageHeader } from '../../components/KareebuPageHeader';
import { searchContext } from '../../search/context';
import { promotionalBannerAssets } from '../../promotions/promotionalBannerAssets';

type Props = {
  city: string;
  country: string;
  loading?: boolean;
  restaurants: FoodHomeRestaurant[];
  favouriteIds: string[];
  initialSurface?: 'home' | 'search';
  actions: FoodHomeActions;
  onOpenPromotion: (campaign:PromotionCampaign) => void;
};

type FoodFeedItem =
  | {kind:'widget';widget:FoodHomeWidget}
  | {kind:'all-header';id:'all-restaurants-header'}
  | {kind:'restaurant';id:string;restaurant:FoodHomeRestaurant};

export function KareebuFoodDiscoveryHome({
  city,
  country,
  loading = false,
  restaurants,
  favouriteIds,
  initialSurface = 'home',
  actions,
  onOpenPromotion,
}: Props) {
  const [membershipVisible, setMembershipVisible] = useState(true);
  const insets = useSafeAreaInsets();
  const controller = useKareebuFoodHomeController({
    city,
    country,
    restaurants,
    favouriteIds,
    initialSurface,
    actions,
  });
  const campaigns = useMemo(() => promotionsFor({service:'food',country,city})
    .filter((campaign) => campaign.cmsSlot !== 'FOOD_PROMO_04')
    .map((campaign) => campaign.cmsSlot === 'FOOD_HERO'
      ? {...campaign,image:promotionalBannerAssets.food.primary,imageOnly:true}
      : campaign.cmsSlot === 'FOOD_PROMO_02'
        ? {...campaign,image:promotionalBannerAssets.food.secondary,imageOnly:true,headline:`${city}'s food favourites`}
        : campaign.cmsSlot === 'FOOD_PROMO_03'
          ? {...campaign,image:promotionalBannerAssets.food.tertiary,imageOnly:true}
          : campaign), [city, country]);
  const feedItems=useMemo<FoodFeedItem[]>(() => [
    ...controller.document.widgets.filter((widget)=>widget.type!=='all-restaurants-enhanced').map((widget)=>({kind:'widget' as const,widget})),
    {kind:'all-header' as const,id:'all-restaurants-header' as const},
    ...controller.restaurants.map((restaurant)=>({kind:'restaurant' as const,id:`all-${restaurant.id}`,restaurant})),
  ],[controller.document.widgets,controller.restaurants]);
  const renderFeedItem = useCallback(({ item }: { item: FoodFeedItem }) => {
    if(item.kind==='widget') return <>{renderKareebuFoodWidget(item.widget,controller,campaigns,onOpenPromotion)}</>;
    if(item.kind==='all-header') return <AllRestaurantsFeedHeader/>;
    return <View style={styles.restaurantRow}><AllRestaurantFeedRow restaurant={item.restaurant} controller={controller}/></View>;
  },[campaigns,controller,onOpenPromotion]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.black} />
      </View>
    );
  }

  if (controller.surface.kind === 'search') {
    return <FoodSearchSurface controller={controller} />;
  }

  if (controller.surface.kind === 'listing') {
    return <FoodListingSurface controller={controller} />;
  }

  if (controller.surface.kind === 'filters') {
    return <FoodFiltersSurface controller={controller} />;
  }

  return (
    <View style={styles.root}>
      <KareebuPageHeader
        title="Deliver to"
        country={country}
        city={city}
        locationEnabled
        searchEnabled
        searchContext={searchContext('food',{market:country,city})}
        onSearchPress={controller.actions.openSearch}
        onBack={controller.back}
        rightIcon="ellipsis-horizontal"
        rightLabel="Food menu"
        onRightAction={controller.actions.openOffers}
      />
      <FlatList
        data={feedItems}
        keyExtractor={(item)=>item.kind==='widget'?item.widget.id:item.id}
        renderItem={renderFeedItem}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={4}
        windowSize={7}
        removeClippedSubviews
        ListFooterComponent={<View style={styles.bottomSpace}/>}
      />

      {membershipVisible ? (
        <View style={[styles.membership,{bottom:Math.max(10,insets.bottom)}]}>
          <Pressable
            onPress={controller.actions.openMembership}
            style={({ pressed }) => [
              styles.membershipMain,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.membershipLogo}>
              <Text style={styles.membershipLogoText}>K+</Text>
            </View>
            <View style={styles.divider} />
            <Text numberOfLines={1} style={styles.membershipText}>
              Explore Kareebu+ food benefits
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss Kareebu+ food benefits"
            onPress={() => setMembershipVisible(false)}
            hitSlop={10}
            style={styles.membershipClose}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:'#FFFFFF'},
  scroll:{flex:1,backgroundColor:'#FFFFFF'},
  content:{paddingTop:6},
  header:{minHeight:52,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10},
  locationMark:{width:38,height:38,borderRadius:13,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  headerCopy:{flex:1,minWidth:0},
  deliverLabel:{...TYPE.caption,color:COLORS.muted,fontWeight:'800',letterSpacing:.5},
  location:{...TYPE.cardTitle,color:COLORS.black,marginTop:1},
  headerAction:{width:44,height:44,borderRadius:16,backgroundColor:COLORS.white,borderWidth:1,borderColor:COLORS.line,alignItems:'center',justifyContent:'center'},
  search:{minHeight:54,marginHorizontal:14,marginTop:4,borderRadius:17,borderWidth:1,borderColor:COLORS.line,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:15},
  searchText:{...TYPE.bodyStrong,color:COLORS.muted},
  loading:{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#FFFFFF'},
  bottomSpace:{height:86},
  restaurantRow:{paddingHorizontal:16,backgroundColor:COLORS.white},
  membership:{position:'absolute',left:15,right:15,bottom:10,height:54,borderRadius:28,backgroundColor:COLORS.black,flexDirection:'row',alignItems:'center',paddingLeft:14,paddingRight:8,zIndex:20},
  membershipMain:{flex:1,height:54,flexDirection:'row',alignItems:'center'},
  membershipClose:{width:38,height:38,borderRadius:19,alignItems:'center',justifyContent:'center'},
  membershipLogo:{width:30,height:30,borderRadius:15,backgroundColor:COLORS.yellow,alignItems:'center',justifyContent:'center'},
  membershipLogoText:{fontSize:12,fontWeight:'900',color:COLORS.black},
  divider:{width:1,height:28,marginHorizontal:10,backgroundColor:'rgba(255,255,255,0.55)'},
  membershipText:{flex:1,color:COLORS.white,...TYPE.bodyStrong,fontWeight:'900'},
  pressed:{opacity:0.76},
});
