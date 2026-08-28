import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, TYPE } from '../../../theme';
import { formatMoney } from '../../../locale';

import type {
  FoodHomeController,
  FoodHomeFilter,
  FoodHomeRestaurant,
} from '../types';

type Category = {
  label: string;
  image: ImageSourcePropType;
};

const FILTERS: Array<{label:string;value:FoodHomeFilter}> = [
  {label:'4.5+ Rated',value:'Top rated'},
  {label:'Top Choices',value:'Top rated'},
  {label:'Offers',value:'Offers'},
  {label:'Fast Delivery',value:'Fast delivery'},
  {label:'Kareebu+',value:'Kareebu+'},
  {label:'Healthy',value:'Healthy'},
  {label:'Under 30 mins',value:'Under 30 mins'},
  {label:'Free Delivery',value:'Free delivery'},
];

const CATEGORY_COLUMNS: Category[][] = [
  [{label:'Offers',image:require('../../../../assets/kareebu-plus/food-exact/categories/offers.png')},{label:'New Additions',image:require('../../../../assets/kareebu-plus/food-exact/categories/new-additions.png')}],
  [{label:'Burgers',image:require('../../../../assets/kareebu-plus/food-exact/categories/burger.png')},{label:'Chicken',image:require('../../../../assets/kareebu-plus/food-exact/categories/chicken-wings.png')}],
  [{label:'African',image:require('../../../../assets/kareebu-plus/food-exact/categories/catering.png')},{label:'Healthy',image:require('../../../../assets/kareebu-plus/food-exact/categories/healthy.png')}],
  [{label:'Pizza',image:require('../../../../assets/kareebu-plus/food-exact/categories/pizza.png')},{label:'Indian',image:require('../../../../assets/kareebu-plus/food-exact/categories/indian.png')}],
  [{label:'Breakfast',image:require('../../../../assets/kareebu-plus/food-exact/categories/coffee.png')},{label:'Local favourites',image:require('../../../../assets/kareebu-plus/food-exact/categories/best-selling.png')}],
  [{label:'Grills & BBQ',image:require('../../../../assets/kareebu-plus/food-exact/categories/chicken-wings.png')},{label:'Seafood',image:require('../../../../assets/kareebu-plus/food-exact/categories/healthy.png')}],
  [{label:'Cafés & Coffee',image:require('../../../../assets/kareebu-plus/food-exact/categories/coffee.png')},{label:'Desserts & Treats',image:require('../../../../assets/kareebu-plus/food-exact/categories/dessert.png')}],
  [{label:'Fast Food',image:require('../../../../assets/kareebu-plus/food-exact/categories/burger.png')}],
];

const MARKET_CATEGORY: Record<string, Category> = {
  Uganda:{label:'Ugandan',image:require('../../../../assets/kareebu-plus/food-exact/categories/biryani.png')},
  Kenya:{label:'Kenyan',image:require('../../../../assets/kareebu-plus/food-exact/categories/catering.png')},
  Tanzania:{label:'Tanzanian',image:require('../../../../assets/kareebu-plus/food-exact/categories/biryani.png')},
};

function restaurantPrimaryMeta(restaurant:FoodHomeRestaurant){
  return restaurant.liveAvailability
    ? `★ ${restaurant.rating.toFixed(1)} (${restaurant.reviews}) · ${restaurant.availabilityLabel ?? restaurant.eta}`
    : 'Reference listing';
}

function restaurantDetailMeta(restaurant:FoodHomeRestaurant){
  return restaurant.liveAvailability
    ? [restaurant.distance,restaurant.deliveryLabel].filter(Boolean).join(' · ')
    : 'Check current availability';
}

function restaurantAccessibilityLabel(restaurant:FoodHomeRestaurant){
  return restaurant.liveAvailability
    ? `${restaurant.name}, ${restaurant.rating.toFixed(1)} stars, ${restaurant.availabilityLabel ?? restaurant.eta}`
    : `${restaurant.name}, reference listing`;
}

function categoriesForMarket(country:string):Category[][] {
  return [
    ...CATEGORY_COLUMNS,
    [MARKET_CATEGORY[country] ?? MARKET_CATEGORY.Uganda,{label:country==='Uganda'?'Rolex':country==='Kenya'?'Nyama Choma':'Pilau',image:country==='Uganda'?require('../../../../assets/kareebu-plus/food-exact/categories/best-selling.png'):require('../../../../assets/kareebu-plus/food-exact/categories/biryani.png')}],
  ];
}

const FOOD_DISCOVERY_PROMOS = [
  {id:'restaurants',eyebrow:'DISCOVER',title:'Explore restaurants',body:'Browse reference listings and confirm current availability before ordering.'},
  {id:'cuisines',eyebrow:'FOOD',title:'Find a cuisine',body:'Use categories and search to find the food you want.'},
  {id:'membership',eyebrow:'KAREEBU+',title:'Explore member benefits',body:'Configured member benefits appear before checkout when available.'},
] as const;

function PlusMark() {
  return (
    <View style={styles.plusMark}>
      <Text style={styles.plusMarkText}>K+</Text>
    </View>
  );
}

function Favourite({
  active,
  onPress,
  label = 'restaurant',
  light = false,
}: {
  active: boolean;
  onPress: () => void;
  label?: string;
  light?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={10}
      style={styles.favourite}
    >
      <Feather
        name="heart"
        size={26}
        color={active ? '#FF566C' : light ? '#FFFFFF' : '#666B70'}
      />
    </Pressable>
  );
}

function RestaurantMeta({
  restaurant,
}: {
  restaurant: FoodHomeRestaurant;
}) {
  return (
    <>
      <Text style={styles.rating}>{restaurantPrimaryMeta(restaurant)}</Text>
      <Text numberOfLines={1} style={styles.meta}>
        {[restaurant.priceLevel, restaurant.neighborhood, restaurant.cuisine, restaurant.liveAvailability ? restaurant.deliveryLabel : 'Check current availability'].filter(Boolean).join(' · ')}
      </Text>
      {restaurant.featuredDish ? (
        <Text numberOfLines={1} style={styles.featuredDish}>
          Known for {restaurant.featuredDish}
        </Text>
      ) : null}
    </>
  );
}

function FoodRestaurantPhoto({
  restaurant,
  style,
}: {
  restaurant: FoodHomeRestaurant;
  style: any;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      source={failed && restaurant.fallbackImage ? restaurant.fallbackImage : restaurant.image}
      resizeMode="cover"
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

function LargeRestaurantCard({
  restaurant,
  width,
  rank,
  controller,
}: {
  restaurant: FoodHomeRestaurant;
  width: number;
  rank?: number;
  controller: FoodHomeController;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={restaurantAccessibilityLabel(restaurant)}
      onPress={() => controller.actions.openRestaurant(restaurant.id)}
      style={({ pressed }) => [
        styles.largeCard,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.largeImageWrap}>
        <FoodRestaurantPhoto restaurant={restaurant} style={styles.largeImage}/>

        {rank ? (
          <Text style={styles.rank}>{rank}</Text>
        ) : null}

        <Favourite
          active={controller.favouriteIds.includes(restaurant.id)}
          label={restaurant.name}
          onPress={() => controller.actions.toggleFavourite(restaurant.id)}
          light
        />

        {restaurant.offer ? (
          <View style={styles.offerBadge}>
            <Text style={styles.offerBadgeText}>{restaurant.offer}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.largeCopy}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.restaurantName}>
            {restaurant.name}
          </Text>
          {restaurant.plus ? <PlusMark /> : null}
        </View>
        <RestaurantMeta restaurant={restaurant} />
      </View>
    </Pressable>
  );
}

export function FilterRail({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const hasLiveRestaurantData=controller.restaurants.some(restaurant=>restaurant.liveAvailability);
  const availableFilters=useMemo(()=>FILTERS.filter(filter=>{
    if(filter.value==='Healthy')return controller.restaurants.some(restaurant=>`${restaurant.cuisine} ${restaurant.categories.join(' ')}`.toLowerCase().includes('healthy'));
    if(filter.value==='Offers')return controller.restaurants.some(restaurant=>restaurant.liveAvailability&&Boolean(restaurant.offer));
    if(filter.value==='Kareebu+')return controller.restaurants.some(restaurant=>restaurant.liveAvailability&&restaurant.plus);
    if(filter.value==='Top rated')return controller.restaurants.some(restaurant=>restaurant.liveAvailability&&Number.isFinite(restaurant.rating));
    if(filter.value==='Fast delivery'||filter.value==='Under 30 mins')return controller.restaurants.some(restaurant=>restaurant.liveAvailability&&Boolean(restaurant.eta));
    if(filter.value==='Free delivery')return controller.restaurants.some(restaurant=>restaurant.liveAvailability&&restaurant.deliveryLabel.toLowerCase().includes('free'));
    return false;
  }),[controller.restaurants]);
  if(!hasLiveRestaurantData&&!availableFilters.length)return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRail}
    >
      {hasLiveRestaurantData?<Pressable
        accessibilityRole="button"
        accessibilityLabel="Open food filters"
        onPress={controller.openFilters}
        style={({ pressed }) => [
          styles.filterIcon,
          pressed && styles.pressed,
        ]}
      >
        <Feather name="filter" size={21} color="#33373A" />
      </Pressable>:null}

      {availableFilters.map((filter) => {
        const active = controller.activeFilter === filter.value;

        return (
          <Pressable
            key={filter.label}
            accessibilityRole="button"
            accessibilityLabel={filter.label}
            accessibilityState={{ selected: active }}
            onPress={() => controller.selectFilter(filter.value)}
            style={({ pressed }) => [
              styles.filterChip,
              active && styles.filterChipActive,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                active && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function CategoryCarousel({
  controller,
}: {
  controller: FoodHomeController;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={112}
      contentContainerStyle={styles.categoryRail}
    >
      {categoriesForMarket(controller.document.market.country).map((column, columnIndex) => (
        <View
          key={`food-category-column-${columnIndex}`}
          style={styles.categoryColumn}
        >
          {column.map((category) => {
            const active = controller.activeCategory === category.label;

            return (
              <Pressable
                key={category.label}
                accessibilityRole="button"
                accessibilityLabel={`${category.label} food`}
                accessibilityState={{ selected: active }}
                onPress={() => controller.openCategory(category.label)}
                style={({ pressed }) => [
                  styles.categoryItem,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.categoryImageWrap,
                    active && styles.categoryActive,
                  ]}
                >
                  <Image
                    source={category.image}
                    resizeMode="contain"
                    style={styles.categoryImage}
                  />
                </View>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.categoryLabel,
                    active && styles.categoryLabelActive,
                  ]}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

export function IconicBanner() {
  return (
    <Image
      source={require('../../../../assets/kareebu-plus/food-exact/banners/iconic-spots.png')}
      resizeMode="cover"
      style={styles.iconicBanner}
    />
  );
}

export function RestaurantCarousel({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(Math.min(344, Math.max(292, width * 0.66)));
  const rows = controller.visibleRestaurants.length
    ? controller.visibleRestaurants
    : controller.restaurants;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={cardWidth + 14}
      contentContainerStyle={styles.largeRail}
    >
      {rows.slice(0, 7).map((restaurant) => (
        <LargeRestaurantCard
          key={`featured-${restaurant.id}`}
          restaurant={restaurant}
          width={cardWidth}
          controller={controller}
        />
      ))}
    </ScrollView>
  );
}

export function PromoCarousel({ controller }: { controller: FoodHomeController }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(280, width - 74);
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={cardWidth+14} contentContainerStyle={styles.promoRail}>
    {FOOD_DISCOVERY_PROMOS.map((promo,index)=><Pressable key={promo.id} onPress={()=>controller.openPromo(String(index))} style={({pressed})=>[styles.promoCard,{width:cardWidth,backgroundColor:index===2?COLORS.black:COLORS.yellow,padding:18,justifyContent:'center'},pressed&&styles.pressed]}><Text style={[TYPE.caption,{fontWeight:'900',color:index===2?COLORS.yellow:COLORS.red}]}>{promo.eyebrow}</Text><Text style={[TYPE.sectionTitle,{marginTop:6,color:index===2?COLORS.white:COLORS.black}]}>{promo.title}</Text><Text style={[TYPE.body,{marginTop:8,color:index===2?'#D7D7D7':COLORS.black}]}>{promo.body}</Text></Pressable>)}
  </ScrollView>;
}

export function RestaurantLogoTile({
  restaurant,
  onPress,
}: {
  restaurant: FoodHomeRestaurant;
  onPress: () => void;
}) {
  if (!restaurant.logo) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${restaurant.name} restaurant menu`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.restaurantLogoTile,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.restaurantLogoArea,
          {
            backgroundColor:
              restaurant.logoBackgroundColor ?? COLORS.white,
          },
        ]}
      >
        <Image
          source={restaurant.logo}
          resizeMode="contain"
          style={styles.restaurantLogoImage}
        />
      </View>
      <Text numberOfLines={2} style={styles.restaurantLogoName}>
        {restaurant.name}
      </Text>
    </Pressable>
  );
}

export function PopularRestaurants({
  controller,
}: {
  controller: FoodHomeController;
}) {
  if (!controller.popularRestaurants.length) return null;

  return (
    <View style={styles.popularRestaurantSection}>
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.popularRestaurantTitle}>Popular Restaurants</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all popular restaurants"
          onPress={controller.openPopularRestaurants}
          hitSlop={8}
        >
          <Text style={styles.sectionViewAll}>View all</Text>
        </Pressable>
      </View>
      <Text style={styles.popularRestaurantSubtitle}>
        Restaurants in the current catalogue
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.restaurantLogoRail}
      >
        {controller.popularRestaurants.map((restaurant) => (
          <RestaurantLogoTile
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => controller.actions.openRestaurant(restaurant.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function NearbyCard({
  restaurant,
  width,
  controller,
}: {
  restaurant: FoodHomeRestaurant;
  width: number;
  controller: FoodHomeController;
}) {
  return (
    <Pressable
      onPress={() => controller.actions.openRestaurant(restaurant.id)}
      style={({ pressed }) => [
        styles.nearbyCard,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.nearbyImageWrap}>
        <FoodRestaurantPhoto restaurant={restaurant} style={styles.nearbyImage}/>

        <Favourite
          active={controller.favouriteIds.includes(restaurant.id)}
          label={restaurant.name}
          onPress={() => controller.actions.toggleFavourite(restaurant.id)}
          light
        />

        {restaurant.offer ? (
          <View style={styles.nearbyOffer}>
            <Text style={styles.nearbyOfferText}>{restaurant.offer}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.nearbyNameRow}>
        <Text numberOfLines={1} style={styles.nearbyName}>
          {restaurant.name}
        </Text>
        {restaurant.plus ? <PlusMark /> : null}
      </View>

      <Text style={styles.rating}>
        {restaurantPrimaryMeta(restaurant)}
      </Text>
      <Text numberOfLines={1} style={styles.meta}>
        {restaurant.cuisine}
      </Text>
    </Pressable>
  );
}

export function Nearby({
  controller,
}: {
  controller: FoodHomeController;
}) {
  if (!controller.speedyRestaurants.length) return null;
  return <View style={styles.nearbySection}><Pressable accessibilityRole="button" accessibilityLabel="Restaurants with a current delivery estimate of 20 minutes or less" onPress={controller.openSpeedyDelivery} style={({pressed})=>[styles.nearbyHeader,pressed&&styles.pressed]}><View style={styles.nearbyHeaderCopy}><Text style={styles.nearbyTitle}>20 minutes or less</Text><Text style={styles.nearbySubtitle}>Current fulfilment estimates verified at 20 minutes or less</Text><View style={styles.viewAll}><Text style={styles.viewAllText}>View all</Text></View></View><Feather name="arrow-right" size={28} color={COLORS.black}/></Pressable></View>;
}

export function BankSavings({ controller }: { controller: FoodHomeController }) {
  return <View style={styles.bankSection}><Text style={styles.bankTitle}>Payment benefits</Text><Pressable onPress={controller.actions.openOffers} style={({pressed})=>[styles.bankCard,{padding:16,justifyContent:'center',backgroundColor:COLORS.surface},pressed&&styles.pressed]}><Text style={TYPE.cardTitle}>No bank benefit assumed</Text><Text style={[TYPE.body,{color:COLORS.muted,marginTop:4}]}>Eligible payment or bank campaigns appear here only when configured for your market.</Text></Pressable></View>;
}

type StackedRailVariant =
  | 'top-rated'
  | 'inspired'
  | 'popular'
  | 'trending'
  | 'just-landed';

const STACKED_RAIL_COPY: Record<
  StackedRailVariant,
  { title: string; subtitle?: string }
> = {
  'top-rated': {
    title: 'Top rated restaurants',
    subtitle: 'Live restaurant ratings only',
  },
  inspired: {
    title: 'More restaurants to explore',
  },
  popular: {
    title: 'Restaurant discovery',
  },
  trending: {
    title: 'More places to explore',
  },
  'just-landed': {
    title: 'Explore more restaurants',
  },
};

const ALL_RESTAURANT_CATEGORIES: Array<{
  label: string;
  image: ImageSourcePropType;
  terms: string[];
}> = [
  {
    label: 'Burgers',
    image: require('../../../../assets/kareebu-plus/food-exact/categories/burger.png'),
    terms: ['burger', 'fast food'],
  },
  {
    label: 'Fried Chicken',
    image: require('../../../../assets/kareebu-plus/food-exact/categories/chicken-wings.png'),
    terms: ['chicken', 'wings'],
  },
  {
    label: 'Grills',
    image: require('../../../../assets/kareebu-plus/food-exact/categories/lebanese.png'),
    terms: ['grill', 'bbq', 'barbecue'],
  },
  {
    label: 'Pizza',
    image: require('../../../../assets/kareebu-plus/food-exact/categories/pizza.png'),
    terms: ['pizza', 'italian'],
  },
  {
    label: 'Indian',
    image: require('../../../../assets/kareebu-plus/food-exact/categories/indian.png'),
    terms: ['indian', 'biryani'],
  },
];

function rotateRestaurants(
  restaurants: FoodHomeRestaurant[],
  offset: number,
) {
  if (restaurants.length === 0) return restaurants;

  const normalised = offset % restaurants.length;
  return [
    ...restaurants.slice(normalised),
    ...restaurants.slice(0, normalised),
  ];
}

function stackedRestaurantsForVariant(
  controller: FoodHomeController,
  variant: StackedRailVariant,
) {
  switch (variant) {
    case 'top-rated':
      return controller.rankedRestaurants;

    case 'inspired': {
      const favourites = controller.restaurants.filter((restaurant) =>
        controller.favouriteIds.includes(restaurant.id),
      );
      const remaining = controller.restaurants.filter(
        (restaurant) => !controller.favouriteIds.includes(restaurant.id),
      );
      return [...favourites, ...remaining];
    }

    case 'popular':
      return rotateRestaurants(controller.restaurants, 1);

    case 'trending':
      return rotateRestaurants(controller.restaurants, 2);

    case 'just-landed':
      return [...controller.restaurants].reverse();

    default:
      return controller.restaurants;
  }
}

function groupByThree(restaurants: FoodHomeRestaurant[]) {
  const groups: FoodHomeRestaurant[][] = [];

  for (let index = 0; index < restaurants.length; index += 3) {
    groups.push(restaurants.slice(index, index + 3));
  }

  return groups;
}

function compactOfferText(restaurant: FoodHomeRestaurant) {
  if (!restaurant.liveAvailability) return null;
  if (restaurant.offer) return restaurant.offer;

  if (restaurant.deliveryLabel.toLowerCase().includes('free')) {
    return 'Free delivery';
  }

  return null;
}

function CompactStackedRestaurantCard({
  restaurant,
  controller,
}: {
  restaurant: FoodHomeRestaurant;
  controller: FoodHomeController;
}) {
  const offer = compactOfferText(restaurant);

  return (
    <Pressable
      onPress={() => controller.actions.openRestaurant(restaurant.id)}
      style={({ pressed }) => [
        styles.stackCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.stackImageWrap}>
        <FoodRestaurantPhoto restaurant={restaurant} style={styles.stackImage}/>

        <Favourite
          active={controller.favouriteIds.includes(restaurant.id)}
          label={restaurant.name}
          onPress={() => controller.actions.toggleFavourite(restaurant.id)}
          light
        />

        {offer ? (
          <View style={styles.stackOfferBadge}>
            <Text numberOfLines={1} style={styles.stackOfferText}>
              {offer}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.stackCardCopy}>
        <View style={styles.stackNameRow}>
          {restaurant.plus ? (
            <View style={styles.stackPlusBadge}>
              <Text style={styles.stackPlusBadgeText}>K+</Text>
            </View>
          ) : null}

          <Text numberOfLines={1} style={styles.stackName}>
            {restaurant.name}
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.stackMeta}>
          {restaurant.liveAvailability?<><Text style={styles.stackStar}>★</Text>{' '}{restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.availabilityLabel ?? restaurant.eta} · {restaurant.deliveryLabel}</>:'Reference listing · Check current availability'}
        </Text>
      </View>
    </Pressable>
  );
}

function recommendationLabel(
  restaurant: FoodHomeRestaurant,
  index: number,
) {
  const category =
    restaurant.categories[0] ??
    restaurant.cuisine.split(',')[0]?.trim() ??
    'Food';

  if (!restaurant.liveAvailability) return `Explore ${category}`;
  return index % 2 === 0
    ? `Top rated in ${category}`
    : `Popular in ${category}`;
}

function InspiredRecommendationList({
  controller,
  restaurants,
}: {
  controller: FoodHomeController;
  restaurants: FoodHomeRestaurant[];
}) {
  return (
    <View style={styles.inspiredList}>
      {restaurants.slice(0, 3).map((restaurant, index) => (
        <Pressable
          key={`inspired-list-${restaurant.id}`}
          onPress={() => controller.actions.openRestaurant(restaurant.id)}
          style={({ pressed }) => [
            styles.inspiredRow,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.inspiredImageWrap}>
            <FoodRestaurantPhoto restaurant={restaurant} style={styles.inspiredImage}/>
            <Favourite
              active={controller.favouriteIds.includes(restaurant.id)}
              label={restaurant.name}
              onPress={() => controller.actions.toggleFavourite(restaurant.id)}
              light
            />
          </View>

          <View style={styles.inspiredCopy}>
            <Text numberOfLines={1} style={styles.inspiredReason}>
              {recommendationLabel(restaurant, index)}
            </Text>

            <View style={styles.stackNameRow}>
              {restaurant.plus ? (
                <View style={styles.stackPlusBadge}>
                  <Text style={styles.stackPlusBadgeText}>K+</Text>
                </View>
              ) : null}

              <Text numberOfLines={1} style={styles.inspiredName}>
                {restaurant.name}
              </Text>
            </View>

            <Text numberOfLines={1} style={styles.inspiredMeta}>
              {restaurant.liveAvailability?<><Text style={styles.stackStar}>★</Text>{' '}{restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.availabilityLabel ?? restaurant.eta} · {restaurant.deliveryLabel}</>:'Reference listing · Check current availability'}
            </Text>

            {compactOfferText(restaurant) ? (
              <View style={styles.inspiredOffer}>
                <Text numberOfLines={1} style={styles.inspiredOfferText}>
                  {compactOfferText(restaurant)}
                </Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export function StackedRestaurantRail({
  controller,
  variant,
}: {
  controller: FoodHomeController;
  variant: StackedRailVariant;
}) {
  const { width } = useWindowDimensions();
  const copy = STACKED_RAIL_COPY[variant];
  const restaurants = stackedRestaurantsForVariant(controller, variant);
  const columns = groupByThree(restaurants.slice(0, 9));
  const columnWidth = Math.round(
    Math.min(610, Math.max(310, width * 0.78)),
  );

  return (
    <View style={styles.stackSection}>
      <Text style={styles.stackSectionTitle}>{copy.title}</Text>

      {copy.subtitle ? (
        <Text style={styles.stackSectionSubtitle}>{copy.subtitle}</Text>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={columnWidth + 14}
        contentContainerStyle={styles.stackRail}
      >
        {columns.map((column, columnIndex) => (
          <View
            key={`${variant}-column-${columnIndex}`}
            style={[styles.stackColumn, { width: columnWidth }]}
          >
            {column.map((restaurant) => (
              <CompactStackedRestaurantCard
                key={`${variant}-${restaurant.id}`}
                restaurant={restaurant}
                controller={controller}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {variant === 'inspired' ? (
        <InspiredRecommendationList
          controller={controller}
          restaurants={restaurants.slice(0, 3)}
        />
      ) : null}
    </View>
  );
}

type AllSortMode = 'default' | 'rating';

export function AllRestaurantsFeedHeader() {
  return <View style={styles.allFeedHeader}><Text accessibilityRole="header" style={styles.allReferenceTitle}>All Restaurants</Text><Text style={styles.allFeedSubtitle}>Browse restaurants available in your market</Text></View>;
}

export const AllRestaurantFeedRow = React.memo(function AllRestaurantFeedRow({restaurant,controller}:{restaurant:FoodHomeRestaurant;controller:FoodHomeController}) {
  const favourite=controller.favouriteIds.includes(restaurant.id);
  return <Pressable accessibilityRole="button" accessibilityLabel={restaurantAccessibilityLabel(restaurant)} onPress={()=>controller.actions.openRestaurant(restaurant.id)} style={({pressed})=>[styles.allReferenceRow,pressed&&styles.pressed]}>
    <View style={styles.allReferenceImageWrap}><FoodRestaurantPhoto restaurant={restaurant} style={styles.allReferenceImage}/>{restaurant.liveAvailability&&restaurant.offer?<View style={styles.stackOfferBadge}><Text numberOfLines={1} style={styles.stackOfferText}>{restaurant.offer}</Text></View>:null}</View>
    <View style={styles.allReferenceCopy}><View style={styles.nameRow}><Text numberOfLines={1} style={styles.allFeedName}>{restaurant.name}</Text>{restaurant.plus?<PlusMark/>:null}<View style={styles.allFeedFavourite}><Favourite active={favourite} label={restaurant.name} onPress={()=>controller.actions.toggleFavourite(restaurant.id)}/></View></View><Text numberOfLines={2} style={styles.allReferenceMeta}>{restaurant.cuisine}</Text><Text style={styles.rating}>{restaurantPrimaryMeta(restaurant)}</Text><Text numberOfLines={1} style={styles.meta}>{restaurantDetailMeta(restaurant)}</Text></View>
  </Pressable>;
});

function allRestaurantSearchText(restaurant: FoodHomeRestaurant) {
  return [
    restaurant.name,
    restaurant.cuisine,
    ...restaurant.categories,
  ]
    .join(' ')
    .toLowerCase();
}

function allRestaurantReason(
  restaurant: FoodHomeRestaurant,
  index: number,
) {
  const category =
    restaurant.categories[0] ??
    restaurant.cuisine.split(',')[0]?.trim();

  if (!category) return null;

  if (index % 3 === 0) return `Top rated in ${category}`;
  if (index % 3 === 1) return `Popular in ${category}`;

  return null;
}

export function AllRestaurantsEnhanced({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<AllSortMode>('default');
  const [offersOnly, setOffersOnly] = useState(false);
  const [ratingOnly, setRatingOnly] = useState(false);
  const [fastOnly, setFastOnly] = useState(false);

  const rows = useMemo(() => {
    let next = [...controller.restaurants];

    if (category) {
      const selected = ALL_RESTAURANT_CATEGORIES.find(
        (item) => item.label === category,
      );

      if (selected) {
        next = next.filter((restaurant) => {
          const searchable = allRestaurantSearchText(restaurant);

          return selected.terms.some((term) =>
            searchable.includes(term),
          );
        });
      }
    }

    if (offersOnly) {
      next = next.filter((restaurant) => restaurant.liveAvailability && Boolean(restaurant.offer));
    }

    if (ratingOnly) {
      next = next.filter((restaurant) => restaurant.liveAvailability && restaurant.rating >= 4);
    }

    if (fastOnly) {
      next = next.filter(
        (restaurant) =>
          restaurant.liveAvailability && (Number.parseInt(restaurant.eta, 10) || 99) <= 25,
      );
    }

    if (sortMode === 'rating') {
      next = next.filter((restaurant) => restaurant.liveAvailability);
      next.sort((a, b) => b.rating - a.rating);
    }

    return next;
  }, [
    category,
    controller.restaurants,
    fastOnly,
    offersOnly,
    ratingOnly,
    sortMode,
  ]);

  return (
    <View style={styles.allReferenceSection}>
      <Text style={styles.allReferenceTitle}>All restaurants</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.allCategoryRail}
      >
        {ALL_RESTAURANT_CATEGORIES.map((item) => {
          const active = category === item.label;

          return (
            <Pressable
              key={item.label}
              onPress={() =>
                setCategory((current) =>
                  current === item.label ? null : item.label,
                )
              }
              style={({ pressed }) => [
                styles.allCategoryItem,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.allCategoryImageWrap,
                  active && styles.allCategoryImageWrapActive,
                ]}
              >
                <Image
                  source={item.image}
                  resizeMode="contain"
                  style={styles.allCategoryImage}
                />
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.allCategoryLabel,
                  active && styles.allCategoryLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.allFilterRail}
      >
        <Pressable
          onPress={() =>
            setSortMode((current) =>
              current === 'rating' ? 'default' : 'rating',
            )
          }
          style={({ pressed }) => [
            styles.allFilterChip,
            sortMode === 'rating' && styles.allFilterChipActive,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            name="sliders"
            size={18}
            color={sortMode === 'rating' ? '#FFFFFF' : '#34383A'}
          />
          <Text
            style={[
              styles.allFilterChipText,
              sortMode === 'rating' && styles.allFilterChipTextActive,
            ]}
          >
            Sort by
          </Text>
          <Feather
            name="chevron-down"
            size={17}
            color={sortMode === 'rating' ? '#FFFFFF' : '#34383A'}
          />
        </Pressable>

        <Pressable
          onPress={() => setOffersOnly((current) => !current)}
          style={({ pressed }) => [
            styles.allFilterChip,
            offersOnly && styles.allFilterChipActive,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.allFilterChipText,
              offersOnly && styles.allFilterChipTextActive,
            ]}
          >
            Offers
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRatingOnly((current) => !current)}
          style={({ pressed }) => [
            styles.allFilterChip,
            ratingOnly && styles.allFilterChipActive,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.allFilterChipText,
              ratingOnly && styles.allFilterChipTextActive,
            ]}
          >
            Rating 4.0+
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFastOnly((current) => !current)}
          style={({ pressed }) => [
            styles.allFilterChip,
            fastOnly && styles.allFilterChipActive,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            name="zap"
            size={18}
            color={fastOnly ? '#FFFFFF' : '#34383A'}
          />
          <Text
            style={[
              styles.allFilterChipText,
              fastOnly && styles.allFilterChipTextActive,
            ]}
          >
            Fast delivery
          </Text>
        </Pressable>
      </ScrollView>

      {rows.length === 0 ? (
        <View style={styles.allEmpty}>
          <Text style={styles.allEmptyTitle}>
            No restaurants match these filters
          </Text>
          <Text style={styles.allEmptyText}>
            Clear a filter to see more places.
          </Text>
        </View>
      ) : null}

      <View style={styles.allReferenceList}>
        {rows.map((restaurant, index) => {
          const reason = allRestaurantReason(restaurant, index);

          return (
            <Pressable
              key={`all-reference-${restaurant.id}`}
              onPress={() =>
                controller.actions.openRestaurant(restaurant.id)
              }
              style={({ pressed }) => [
                styles.allReferenceRow,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.allReferenceImageWrap}>
                <FoodRestaurantPhoto restaurant={restaurant} style={styles.allReferenceImage}/>

                <Favourite
                  active={controller.favouriteIds.includes(restaurant.id)}
                  label={restaurant.name}
                  onPress={() =>
                    controller.actions.toggleFavourite(restaurant.id)
                  }
                  light
                />
              </View>

              <View style={styles.allReferenceCopy}>
                {reason ? (
                  <Text numberOfLines={1} style={styles.allReferenceReason}>
                    {reason}
                  </Text>
                ) : null}

                <View style={styles.stackNameRow}>
                  {restaurant.plus ? (
                    <View style={styles.stackPlusBadge}>
                      <Text style={styles.stackPlusBadgeText}>K+</Text>
                    </View>
                  ) : null}

                  <Text numberOfLines={1} style={styles.allReferenceName}>
                    {restaurant.name}
                  </Text>
                </View>

                <Text numberOfLines={1} style={styles.allReferenceMeta}>
                  {restaurant.liveAvailability?<><Text style={styles.stackStar}>★</Text>{' '}{restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.availabilityLabel ?? restaurant.eta} · {restaurant.deliveryLabel}</>:'Reference listing · Check current availability'}
                </Text>

                {compactOfferText(restaurant) ? (
                  <View style={styles.allReferenceOffer}>
                    <Text
                      numberOfLines={1}
                      style={styles.allReferenceOfferText}
                    >
                      {compactOfferText(restaurant)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  filterRail:{paddingHorizontal:14,paddingVertical:10,gap:8},
  filterIcon:{width:42,height:42,borderRadius:14,borderWidth:1,borderColor:'#D6D9DB',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},
  filterChip:{height:42,paddingHorizontal:14,borderRadius:14,borderWidth:1,borderColor:'#D6D9DB',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},
  filterChipActive:{backgroundColor:COLORS.yellow,borderColor:COLORS.yellow},
  filterChipText:{...TYPE.bodyStrong,color:COLORS.black},
  filterChipTextActive:{color:COLORS.black,fontWeight:'900'},

  categoryRail:{paddingLeft:14,paddingRight:22,paddingBottom:16},
  categoryColumn:{width:92,gap:10},
  categoryItem:{height:128,alignItems:'center'},
  categoryImageWrap:{width:82,height:80,borderRadius:16,alignItems:'center',justifyContent:'center'},
  categoryActive:{backgroundColor:COLORS.yellowSoft},
  categoryImage:{width:76,height:72},
  categoryLabel:{marginTop:6,width:90,textAlign:'center',...TYPE.small,fontWeight:'700',color:COLORS.black},
  categoryLabelActive:{color:COLORS.black,fontWeight:'900'},

  iconicBanner:{width:'100%',height:160,backgroundColor:COLORS.black},
  largeRail:{paddingLeft:16,paddingRight:22,paddingBottom:18,gap:14},
  largeCard:{overflow:'hidden',borderRadius:18,borderWidth:1,borderColor:'#EEEEEE',backgroundColor:'#FFFFFF'},
  largeImageWrap:{height:158,position:'relative',backgroundColor:'#F2F2F2'},
  largeImage:{width:'100%',height:'100%'},
  favourite:{position:'absolute',right:12,top:12,zIndex:5},
  offerBadge:{position:'absolute',left:14,bottom:12,borderWidth:1.5,borderColor:COLORS.red,borderRadius:12,backgroundColor:'#FFFFFF',paddingHorizontal:9,paddingVertical:7},
  offerBadgeText:{color:COLORS.red,fontSize:13,lineHeight:17,fontWeight:'800'},
  rank:{position:'absolute',left:11,top:5,color:'#FFFFFF',fontSize:47,lineHeight:52,fontWeight:'900'},
  largeCopy:{paddingHorizontal:12,paddingTop:10,paddingBottom:13},
  dishCard:{overflow:'hidden',borderRadius:18,borderWidth:1,borderColor:'#EEEEEE',backgroundColor:'#FFFFFF'},
  dishImage:{width:'100%',height:148,backgroundColor:'#F2F2F2'},
  dishCopy:{padding:11},
  dishName:{...TYPE.cardTitle,color:COLORS.black},
  dishRestaurant:{...TYPE.caption,color:COLORS.muted,marginTop:3},
  dishPrice:{...TYPE.bodyStrong,color:COLORS.black,marginTop:7},
  nameRow:{flexDirection:'row',alignItems:'center',gap:5,minWidth:0},
  restaurantName:{flex:1,...TYPE.cardTitle,color:COLORS.black},
  plusMark:{height:20,minWidth:26,borderRadius:10,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',paddingHorizontal:5},
  plusMarkText:{fontSize:11,lineHeight:13,fontWeight:'900',color:COLORS.yellow},
  rating:{marginTop:4,color:COLORS.green,...TYPE.small,fontWeight:'800'},
  meta:{color:COLORS.muted,...TYPE.small,fontWeight:'500'},
  featuredDish:{color:COLORS.black,...TYPE.caption,fontWeight:'700',marginTop:3},

  promoRail:{paddingLeft:16,paddingRight:22,paddingVertical:16,gap:14},
  promoCard:{height:112,borderRadius:15,overflow:'hidden',backgroundColor:COLORS.yellowWash},
  promoImage:{width:'100%',height:'100%'},

  mintSection:{backgroundColor:COLORS.yellowWash,paddingTop:24,paddingBottom:22},
  mostSection:{backgroundColor:COLORS.yellowWash,paddingTop:25,paddingBottom:4},
  sectionHeadingRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:18},
  sectionTitle:{paddingHorizontal:14,color:COLORS.black,...TYPE.sectionTitle},
  sectionSubtitle:{paddingHorizontal:14,marginTop:4,color:COLORS.muted,...TYPE.small},
  sectionViewAll:{fontSize:13,lineHeight:18,fontWeight:'900',color:COLORS.black},
  bestSellerRail:{paddingLeft:16,paddingRight:22,paddingTop:18,gap:14},
  restaurantDishCard:{width:182,minHeight:262,overflow:'hidden',borderRadius:18,borderWidth:1,borderColor:'#E4E6E4',backgroundColor:COLORS.white},
  restaurantDishImageWrap:{width:'100%',height:137,position:'relative',overflow:'hidden',backgroundColor:'#F2F2F2'},
  restaurantDishImage:{width:'100%',height:'100%'},
  dishFavourite:{position:'absolute',right:9,top:9,width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,0.94)'},
  restaurantDishCopy:{flex:1,paddingHorizontal:11,paddingTop:10,paddingBottom:11},
  restaurantDishName:{minHeight:42,fontSize:16,lineHeight:20,fontWeight:'800',color:COLORS.black},
  dishRestaurantIdentity:{minHeight:36,marginTop:7,flexDirection:'row',alignItems:'center',gap:8},
  dishRestaurantLogoWrap:{width:34,height:34,borderRadius:9,borderWidth:1,borderColor:'#E5E6E5',alignItems:'center',justifyContent:'center',padding:4},
  dishRestaurantLogo:{width:'100%',height:'100%'},
  restaurantDishRestaurant:{flex:1,fontSize:12,lineHeight:16,fontWeight:'800',color:'#4E5356'},
  restaurantDishPrice:{marginTop:7,...TYPE.bodyStrong,color:COLORS.black,fontWeight:'900'},

  popularRestaurantSection:{backgroundColor:COLORS.yellowWash,paddingTop:4,paddingBottom:24},
  popularRestaurantTitle:{paddingHorizontal:14,color:COLORS.black,...TYPE.sectionTitle},
  popularRestaurantSubtitle:{paddingHorizontal:14,marginTop:4,...TYPE.small,color:COLORS.muted},
  restaurantLogoRail:{paddingLeft:14,paddingRight:22,paddingTop:16,gap:12},
  restaurantLogoTile:{width:112,height:140,borderRadius:16,alignItems:'center',justifyContent:'flex-start',padding:8,backgroundColor:COLORS.white,borderWidth:1,borderColor:'#E2E4E2',shadowColor:'#000000',shadowOpacity:0.04,shadowRadius:5,shadowOffset:{width:0,height:2},elevation:1},
  restaurantLogoArea:{width:94,height:86,borderRadius:12,alignItems:'center',justifyContent:'center',padding:11},
  restaurantLogoImage:{width:'100%',height:'100%'},
  restaurantLogoName:{marginTop:7,paddingHorizontal:2,textAlign:'center',fontSize:12,lineHeight:16,fontWeight:'800',color:COLORS.black},

  nearbySection:{backgroundColor:'#FFFFFF',paddingBottom:20},
  nearbyHeader:{height:172,overflow:'hidden',backgroundColor:COLORS.yellowSoft,flexDirection:'row',alignItems:'center',paddingLeft:14},
  nearbyHeaderCopy:{zIndex:2,flex:1},
  nearbyTitle:{color:COLORS.black,...TYPE.screenTitle},
  nearbySubtitle:{marginTop:5,color:COLORS.muted,...TYPE.body},
  viewAll:{marginTop:12,width:94,height:42,borderRadius:14,borderWidth:1,borderColor:'#D2D7D4',backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center'},
  viewAllText:{...TYPE.action,color:COLORS.black},
  stopwatch:{width:150,height:150,marginRight:-22},
  nearbyRail:{paddingLeft:16,paddingRight:22,paddingTop:14,gap:12},
  nearbyCard:{minHeight:232},
  nearbyImageWrap:{height:145,borderRadius:16,overflow:'hidden',backgroundColor:'#F1F1F1'},
  nearbyImage:{width:'100%',height:'100%'},
  nearbyOffer:{position:'absolute',left:12,bottom:10,borderRadius:11,backgroundColor:'#FFFFFF',paddingHorizontal:9,paddingVertical:5},
  nearbyOfferText:{color:COLORS.red,fontSize:12,lineHeight:15,fontWeight:'800'},
  nearbyNameRow:{marginTop:8,flexDirection:'row',alignItems:'center',gap:4},
  nearbyName:{flex:1,fontSize:15,lineHeight:19,fontWeight:'900',color:'#35393C'},

  bankSection:{paddingTop:24,backgroundColor:'#FFFFFF'},
  bankTitle:{paddingHorizontal:14,color:COLORS.black,...TYPE.sectionTitle},
  bankRail:{paddingLeft:14,paddingRight:22,paddingTop:16,paddingBottom:20,gap:12},
  bankCard:{width:150,height:130,borderRadius:16,overflow:'hidden'},
  bankImage:{width:'100%',height:'100%'},

  allSection:{backgroundColor:'#FFFFFF',paddingHorizontal:14},
  allHeader:{paddingHorizontal:8,marginTop:4,marginBottom:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  allTitle:{color:COLORS.black,...TYPE.sectionTitle},
  allRow:{minHeight:148,paddingVertical:10,borderBottomWidth:1,borderBottomColor:'#EFEFEF',flexDirection:'row',alignItems:'flex-start'},
  allImage:{width:98,height:128,borderRadius:14,backgroundColor:'#F1F1F1'},
  allCopy:{flex:1,minWidth:0,paddingLeft:12,paddingRight:8},
  allName:{flex:1,...TYPE.cardTitle,color:COLORS.black},
  allOffer:{alignSelf:'flex-start',marginTop:10,borderWidth:1.5,borderColor:COLORS.red,borderRadius:10,paddingHorizontal:8,paddingVertical:5},
  allOfferText:{color:COLORS.red,fontSize:12,lineHeight:15,fontWeight:'800'},
  emptyFavourites:{paddingVertical:36,alignItems:'center',justifyContent:'center'},
  emptyFavouritesTitle:{marginTop:10,fontSize:17,lineHeight:22,fontWeight:'900',color:'#35393C'},
  emptyFavouritesText:{marginTop:5,fontSize:14,lineHeight:19,color:'#777C81',textAlign:'center'},

  stackSection:{backgroundColor:COLORS.surface,paddingTop:18,paddingBottom:18},
  stackSectionTitle:{paddingHorizontal:14,...TYPE.sectionTitle,color:COLORS.black},
  stackSectionSubtitle:{paddingHorizontal:14,marginTop:4,...TYPE.small,color:COLORS.muted},
  stackRail:{paddingLeft:14,paddingRight:22,paddingTop:18,gap:14},
  stackColumn:{gap:10},
  stackCard:{height:92,borderRadius:18,borderWidth:1,borderColor:'#E0E2E3',backgroundColor:'#FFFFFF',overflow:'hidden',flexDirection:'row'},
  stackImageWrap:{width:114,height:'100%',position:'relative',borderRightWidth:1,borderRightColor:'#E7E7E7',backgroundColor:'#F6F6F6'},
  stackImage:{width:'100%',height:'100%'},
  stackOfferBadge:{position:'absolute',left:8,bottom:5,maxWidth:105,borderRadius:7,backgroundColor:COLORS.yellow,paddingHorizontal:8,paddingVertical:4},
  stackOfferText:{fontSize:12,lineHeight:15,fontWeight:'800',color:'#101514'},
  stackCardCopy:{flex:1,minWidth:0,paddingHorizontal:13,justifyContent:'center'},
  stackNameRow:{flexDirection:'row',alignItems:'center',gap:6,minWidth:0},
  stackPlusBadge:{height:19,minWidth:25,borderRadius:5,backgroundColor:COLORS.black,alignItems:'center',justifyContent:'center',paddingHorizontal:5},
  stackPlusBadgeText:{fontSize:10,lineHeight:12,fontWeight:'900',color:'#FFD43D'},
  stackName:{flex:1,fontSize:17,lineHeight:21,fontWeight:'800',color:'#34383A'},
  stackMeta:{marginTop:7,fontSize:15,lineHeight:19,fontWeight:'500',color:'#4C5155'},
  stackStar:{color:'#F3B314',fontWeight:'900'},

  inspiredList:{marginTop:18,backgroundColor:'#FFFFFF',paddingHorizontal:20,paddingTop:22,paddingBottom:8,gap:18},
  inspiredRow:{minHeight:132,flexDirection:'row',alignItems:'flex-start'},
  inspiredImageWrap:{width:114,height:114,borderRadius:18,overflow:'hidden',position:'relative',backgroundColor:'#F2F2F2'},
  inspiredImage:{width:'100%',height:'100%'},
  inspiredCopy:{flex:1,minWidth:0,paddingLeft:14,paddingTop:4},
  inspiredReason:{fontSize:14,lineHeight:18,fontWeight:'800',color:'#057BC1'},
  inspiredName:{flex:1,fontSize:18,lineHeight:23,fontWeight:'800',color:'#34383A'},
  inspiredMeta:{marginTop:7,fontSize:14,lineHeight:18,fontWeight:'500',color:'#4C5155'},
  inspiredOffer:{alignSelf:'flex-start',marginTop:8,maxWidth:'100%',borderRadius:7,backgroundColor:COLORS.yellow,paddingHorizontal:8,paddingVertical:4},
  inspiredOfferText:{fontSize:13,lineHeight:16,fontWeight:'800',color:'#101514'},

  allReferenceSection:{backgroundColor:'#FFFFFF',paddingTop:28,paddingBottom:28},
  allFeedHeader:{paddingTop:28,paddingBottom:10,backgroundColor:COLORS.white},
  allFeedSubtitle:{paddingHorizontal:16,marginTop:4,...TYPE.small,color:COLORS.muted},
  allFeedName:{flex:1,...TYPE.cardTitle,color:COLORS.black},
  allFeedFavourite:{width:44,height:44,position:'relative'},
  allReferenceTitle:{paddingHorizontal:16,fontSize:20,lineHeight:25,fontWeight:'900',color:COLORS.black,letterSpacing:-0.25},
  allCategoryRail:{paddingLeft:14,paddingRight:30,paddingTop:18,paddingBottom:18,gap:18},
  allCategoryItem:{width:82,alignItems:'center'},
  allCategoryImageWrap:{width:72,height:72,borderRadius:36,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F7F7'},
  allCategoryImageWrapActive:{backgroundColor:COLORS.yellowSoft,borderWidth:2,borderColor:COLORS.black},
  allCategoryImage:{width:68,height:68},
  allCategoryLabel:{marginTop:8,width:88,textAlign:'center',fontSize:14,lineHeight:18,color:'#909496'},
  allCategoryLabelActive:{color:COLORS.black,fontWeight:'800'},
  allFilterRail:{paddingLeft:14,paddingRight:22,paddingBottom:22,gap:10},
  allFilterChip:{height:40,borderRadius:20,borderWidth:1,borderColor:COLORS.line,paddingHorizontal:14,backgroundColor:COLORS.white,flexDirection:'row',alignItems:'center',gap:7},
  allFilterChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  allFilterChipText:{fontSize:13,lineHeight:17,fontWeight:'700',color:COLORS.black},
  allFilterChipTextActive:{color:'#FFFFFF'},
  allReferenceList:{paddingHorizontal:20},
  allReferenceRow:{minHeight:146,flexDirection:'row',alignItems:'center',paddingVertical:12},
  allReferenceImageWrap:{width:118,height:118,borderRadius:20,overflow:'hidden',position:'relative',backgroundColor:'#F2F2F2'},
  allReferenceImage:{width:'100%',height:'100%'},
  allReferenceCopy:{flex:1,minWidth:0,paddingLeft:14},
  allReferenceReason:{marginBottom:4,fontSize:14,lineHeight:18,fontWeight:'800',color:'#057BC1'},
  allReferenceName:{flex:1,fontSize:19,lineHeight:24,fontWeight:'800',color:'#34383A'},
  allReferenceMeta:{marginTop:7,fontSize:14,lineHeight:18,fontWeight:'500',color:'#4C5155'},
  allReferenceOffer:{alignSelf:'flex-start',marginTop:9,maxWidth:'100%',borderRadius:7,backgroundColor:COLORS.yellow,paddingHorizontal:8,paddingVertical:5},
  allReferenceOfferText:{fontSize:13,lineHeight:16,fontWeight:'800',color:'#101514'},
  allEmpty:{marginHorizontal:22,marginBottom:12,borderRadius:16,backgroundColor:'#F7F7F7',paddingVertical:24,paddingHorizontal:20,alignItems:'center'},
  allEmptyTitle:{fontSize:16,lineHeight:21,fontWeight:'800',color:'#34383A'},
  allEmptyText:{marginTop:4,fontSize:14,lineHeight:18,color:'#777C81'},

  pressed:{opacity:0.76},
});
