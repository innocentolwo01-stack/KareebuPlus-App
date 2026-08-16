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

import type {
  FoodHomeController,
  FoodHomeFilter,
  FoodHomeRestaurant,
} from '../types';

type Category = {
  label: string;
  image: ImageSourcePropType;
};

const FILTERS: FoodHomeFilter[] = [
  '4.7+ Rated',
  'Top Choices',
  'Calorie info',
  '30% Off',
];

const CATEGORY_COLUMNS: Category[][] = [
  [{label:'Offers',image:require('../../../../assets/kareebu-plus/food-exact/categories/offers.png')},{label:'New Additions',image:require('../../../../assets/kareebu-plus/food-exact/categories/new-additions.png')}],
  [{label:'Asian',image:require('../../../../assets/kareebu-plus/food-exact/categories/asian.png')},{label:'Dessert',image:require('../../../../assets/kareebu-plus/food-exact/categories/dessert.png')}],
  [{label:'Chicken & Wings',image:require('../../../../assets/kareebu-plus/food-exact/categories/chicken-wings.png')},{label:'Pizza',image:require('../../../../assets/kareebu-plus/food-exact/categories/pizza.png')}],
  [{label:'Burger',image:require('../../../../assets/kareebu-plus/food-exact/categories/burger.png')},{label:'Chaat',image:require('../../../../assets/kareebu-plus/food-exact/categories/chaat.png')}],
  [{label:'Exclusive Offers',image:require('../../../../assets/kareebu-plus/food-exact/categories/exclusive.png')},{label:'Arabic',image:require('../../../../assets/kareebu-plus/food-exact/categories/arabic.png')}],
  [{label:'Far-away Gems',image:require('../../../../assets/kareebu-plus/food-exact/categories/far-away.png')},{label:'Lebanese',image:require('../../../../assets/kareebu-plus/food-exact/categories/lebanese.png')}],
  [{label:'Indian',image:require('../../../../assets/kareebu-plus/food-exact/categories/indian.png')},{label:'Healthy',image:require('../../../../assets/kareebu-plus/food-exact/categories/healthy.png')}],
  [{label:'Catering',image:require('../../../../assets/kareebu-plus/food-exact/categories/catering.png')},{label:'Gifting Options',image:require('../../../../assets/kareebu-plus/food-exact/categories/gifting.png')}],
  [{label:'Biryani',image:require('../../../../assets/kareebu-plus/food-exact/categories/biryani.png')},{label:'Coffee',image:require('../../../../assets/kareebu-plus/food-exact/categories/coffee.png')}],
  [{label:'Egyptian',image:require('../../../../assets/kareebu-plus/food-exact/categories/egyptian.png')},{label:'Filipino',image:require('../../../../assets/kareebu-plus/food-exact/categories/filipino.png')}],
  [{label:'Best Selling',image:require('../../../../assets/kareebu-plus/food-exact/categories/best-selling.png')},{label:'Ice Cream',image:require('../../../../assets/kareebu-plus/food-exact/categories/ice-cream.png')}],
  [{label:'Iranian',image:require('../../../../assets/kareebu-plus/food-exact/categories/iranian.png')},{label:'Italian',image:require('../../../../assets/kareebu-plus/food-exact/categories/italian.png')}],
];

const PROMOS: ImageSourcePropType[] = [
  require('../../../../assets/kareebu-plus/food-exact/banners/promo-30.png'),
  require('../../../../assets/kareebu-plus/food-exact/banners/promo-delivery.png'),
  require('../../../../assets/kareebu-plus/food-exact/banners/promo-weekend.png'),
];

const BANKS: ImageSourcePropType[] = [
  require('../../../../assets/kareebu-plus/food-exact/banners/bank-stanbic.png'),
  require('../../../../assets/kareebu-plus/food-exact/banners/bank-absa.png'),
  require('../../../../assets/kareebu-plus/food-exact/banners/bank-equity.png'),
  require('../../../../assets/kareebu-plus/food-exact/banners/bank-centenary.png'),
];

const BRANDS = [
  { label:'Cafe\nJavas', background:'#F4C72D', foreground:'#221A0D', restaurantId:'cafe-javas' },
  { label:'Chicken\nTonight', background:'#E53C46', foreground:'#FFFFFF', restaurantId:'chicken-tonight' },
  { label:'Pizza\nInn', background:'#139B62', foreground:'#FFFFFF', restaurantId:'pizza-inn' },
  { label:'KFC', background:'#F4F4F4', foreground:'#D9242F', restaurantId:null },
  { label:'Java\nHouse', background:'#64271F', foreground:'#FFFFFF', restaurantId:'java-house' },
];

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
  light = false,
}: {
  active: boolean;
  onPress: () => void;
  light?: boolean;
}) {
  return (
    <Pressable
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
      <Text style={styles.rating}>
        ★ {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta}{' '}
        <Text style={styles.meta}>({restaurant.distance})</Text>
      </Text>
      <Text numberOfLines={1} style={styles.meta}>
        {[restaurant.priceLevel, restaurant.neighborhood, restaurant.cuisine, restaurant.deliveryLabel].filter(Boolean).join(' · ')}
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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterRail}
    >
      <Pressable
        onPress={controller.openFilters}
        style={({ pressed }) => [
          styles.filterIcon,
          pressed && styles.pressed,
        ]}
      >
        <Feather name="filter" size={21} color="#33373A" />
      </Pressable>

      {FILTERS.map((filter) => {
        const active = controller.activeFilter === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => controller.selectFilter(filter)}
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
              {filter}
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
      {CATEGORY_COLUMNS.map((column, columnIndex) => (
        <View
          key={`food-category-column-${columnIndex}`}
          style={styles.categoryColumn}
        >
          {column.map((category) => {
            const active = controller.activeCategory === category.label;

            return (
              <Pressable
                key={category.label}
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

export function PromoCarousel({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(280, width - 74);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={cardWidth + 14}
      contentContainerStyle={styles.promoRail}
    >
      {PROMOS.map((source, index) => (
        <Pressable
          key={`food-promo-${index}`}
          onPress={() => controller.openPromo(String(index))}
          style={({ pressed }) => [
            styles.promoCard,
            { width: cardWidth },
            pressed && styles.pressed,
          ]}
        >
          <Image source={source} resizeMode="cover" style={styles.promoImage} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

function SellerCard({
  restaurant,
  controller,
}: {
  restaurant: FoodHomeRestaurant;
  controller: FoodHomeController;
}) {
  return (
    <Pressable
      onPress={() => controller.actions.openRestaurant(restaurant.id)}
      style={({ pressed }) => [
        styles.sellerCard,
        pressed && styles.pressed,
      ]}
    >
      <FoodRestaurantPhoto restaurant={restaurant} style={styles.sellerImage}/>

      <View style={styles.sellerCopy}>
        <Text numberOfLines={1} style={styles.sellerName}>
          {restaurant.name}
        </Text>
        <Text style={styles.rating}>
          ★ {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta}
        </Text>
        <Text numberOfLines={1} style={styles.sellerCuisine}>
          {restaurant.cuisine}
        </Text>

        {restaurant.offer ? (
          <View style={styles.smallOffer}>
            <Text style={styles.smallOfferText}>{restaurant.offer}</Text>
          </View>
        ) : null}
      </View>

      <Favourite
        active={controller.favouriteIds.includes(restaurant.id)}
        onPress={() => controller.actions.toggleFavourite(restaurant.id)}
      />
    </Pressable>
  );
}

export function BestSellers({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const { width } = useWindowDimensions();
  const columnWidth = Math.round(
    Math.min(338, Math.max(296, width * 0.76)),
  );

  const columns = useMemo(() => {
    const rows = controller.rankedRestaurants.slice(0, 8);
    const result: FoodHomeRestaurant[][] = [];

    for (let index = 0; index < rows.length; index += 2) {
      result.push(rows.slice(index, index + 2));
    }

    return result;
  }, [controller.rankedRestaurants]);

  return (
    <View style={styles.mintSection}>
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingRight:18}}>
        <Text style={styles.sectionTitle}>Best Sellers 🔥</Text>
        <Pressable onPress={controller.openBestSellers} hitSlop={8}>
          <Text style={{fontSize:13,fontWeight:'900',color:COLORS.black}}>View all</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionSubtitle}>
        Satisfy cravings from top restaurants!
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={columnWidth + 14}
        contentContainerStyle={styles.sellerRail}
      >
        {columns.map((column, index) => (
          <View
            key={`seller-column-${index}`}
            style={[styles.sellerColumn, { width: columnWidth }]}
          >
            {column.map((restaurant) => (
              <SellerCard
                key={restaurant.id}
                restaurant={restaurant}
                controller={controller}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function MostOrdered({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(Math.min(334, Math.max(286, width * 0.64)));

  return (
    <View style={styles.mostSection}>
      <Text style={styles.sectionTitle}>Most Ordered 🤤</Text>
      <Text style={styles.sectionSubtitle}>
        Your guide to popular dishes making waves!
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={cardWidth + 14}
        contentContainerStyle={styles.largeRail}
      >
        {controller.rankedRestaurants.slice(0, 6).map((restaurant, index) => (
          <LargeRestaurantCard
            key={`ordered-${restaurant.id}`}
            restaurant={restaurant}
            width={cardWidth}
            rank={index + 1}
            controller={controller}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export function PopularBrands({
  controller,
}: {
  controller: FoodHomeController;
}) {
  return (
    <View style={styles.brandSection}>
      <Text style={styles.popularBrandsTitle}>Popular Brands</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.brandRail}
      >
        {BRANDS.map((brand) => (
          <Pressable
            key={brand.label}
            onPress={() => controller.openBrand(brand.label, brand.restaurantId)}
            style={({ pressed }) => [
              styles.brandCard,
              { backgroundColor: brand.background },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.brandText,
                { color: brand.foreground },
              ]}
            >
              {brand.label}
            </Text>
          </Pressable>
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
        ★ {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta}
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
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(Math.min(166, Math.max(148, width * 0.38)));

  return (
    <View style={styles.nearbySection}>
      <View style={styles.nearbyHeader}>
        <View style={styles.nearbyHeaderCopy}>
          <Text style={styles.nearbyTitle}>Nearby</Text>
          <Text style={styles.nearbySubtitle}>
            Savor the speedy goodness!
          </Text>

          <Pressable
            onPress={controller.openNearby}
            style={({ pressed }) => [
              styles.viewAll,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>

        <Image
          source={require('../../../../assets/kareebu-plus/food-exact/banners/nearby-stopwatch.png')}
          resizeMode="contain"
          style={styles.stopwatch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nearbyRail}
      >
        {controller.nearbyRestaurants.slice(0, 7).map((restaurant) => (
          <NearbyCard
            key={`nearby-${restaurant.id}`}
            restaurant={restaurant}
            width={cardWidth}
            controller={controller}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export function BankSavings({
  controller,
}: {
  controller: FoodHomeController;
}) {
  return (
    <View style={styles.bankSection}>
      <Text style={styles.bankTitle}>Big bank savings 💸</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bankRail}
      >
        {BANKS.map((source, index) => (
          <Pressable
            key={`food-bank-${index}`}
            onPress={controller.actions.openOffers}
            style={({ pressed }) => [
              styles.bankCard,
              pressed && styles.pressed,
            ]}
          >
            <Image source={source} resizeMode="cover" style={styles.bankImage} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
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
    subtitle: "Here's what everyone loves near you",
  },
  inspired: {
    title: 'Inspired by your past orders',
  },
  popular: {
    title: 'Popular today',
  },
  trending: {
    title: 'Trending near you',
  },
  'just-landed': {
    title: 'Just landed',
  },
};

const ALL_RESTAURANT_CATEGORIES = [
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
      const remaining = controller.rankedRestaurants.filter(
        (restaurant) => !controller.favouriteIds.includes(restaurant.id),
      );

      return [...favourites, ...remaining];
    }

    case 'popular':
      return rotateRestaurants(controller.rankedRestaurants, 1);

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
          <Text style={styles.stackStar}>★</Text>{' '}
          {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta} ·{' '}
          {restaurant.deliveryLabel}
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
              <Text style={styles.stackStar}>★</Text>{' '}
              {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta} ·{' '}
              {restaurant.deliveryLabel}
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
      next = next.filter((restaurant) => Boolean(restaurant.offer));
    }

    if (ratingOnly) {
      next = next.filter((restaurant) => restaurant.rating >= 4);
    }

    if (fastOnly) {
      next = next.filter(
        (restaurant) =>
          (Number.parseInt(restaurant.eta, 10) || 99) <= 25,
      );
    }

    if (sortMode === 'rating') {
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
                  <Text style={styles.stackStar}>★</Text>{' '}
                  {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta} ·{' '}
                  {restaurant.deliveryLabel}
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
  sectionTitle:{paddingHorizontal:14,color:COLORS.black,...TYPE.sectionTitle},
  sectionSubtitle:{paddingHorizontal:14,marginTop:4,color:COLORS.muted,...TYPE.small},
  sellerRail:{paddingLeft:16,paddingRight:22,paddingTop:18,gap:14},
  sellerColumn:{gap:12},
  sellerCard:{height:112,borderRadius:16,overflow:'hidden',backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E9EEEC',flexDirection:'row'},
  sellerImage:{width:112,height:'100%',backgroundColor:'#F3F3F3'},
  sellerCopy:{flex:1,minWidth:0,paddingHorizontal:10,paddingVertical:10},
  sellerName:{fontSize:16,lineHeight:20,fontWeight:'900',color:'#323639'},
  sellerCuisine:{marginTop:5,color:'#777D82',fontSize:13,lineHeight:17},
  smallOffer:{alignSelf:'flex-start',marginTop:8,borderWidth:1.5,borderColor:COLORS.red,borderRadius:11,paddingHorizontal:8,paddingVertical:4},
  smallOfferText:{color:COLORS.red,fontSize:12,lineHeight:15,fontWeight:'800'},

  brandSection:{backgroundColor:COLORS.yellowWash,paddingBottom:24},
  popularBrandsTitle:{paddingHorizontal:14,color:COLORS.black,...TYPE.sectionTitle},
  brandRail:{paddingLeft:14,paddingRight:22,paddingTop:16,gap:12},
  brandCard:{width:92,height:92,borderRadius:16,alignItems:'center',justifyContent:'center'},
  brandText:{textAlign:'center',fontSize:17,lineHeight:20,fontWeight:'900'},

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
  allReferenceTitle:{paddingHorizontal:14,fontSize:30,lineHeight:35,fontWeight:'900',color:'#303437',letterSpacing:-0.5},
  allCategoryRail:{paddingLeft:14,paddingRight:30,paddingTop:18,paddingBottom:18,gap:18},
  allCategoryItem:{width:82,alignItems:'center'},
  allCategoryImageWrap:{width:72,height:72,borderRadius:36,alignItems:'center',justifyContent:'center',backgroundColor:'#F7F7F7'},
  allCategoryImageWrapActive:{backgroundColor:COLORS.yellowSoft,borderWidth:2,borderColor:COLORS.black},
  allCategoryImage:{width:68,height:68},
  allCategoryLabel:{marginTop:8,width:88,textAlign:'center',fontSize:14,lineHeight:18,color:'#909496'},
  allCategoryLabelActive:{color:COLORS.black,fontWeight:'800'},
  allFilterRail:{paddingLeft:14,paddingRight:22,paddingBottom:22,gap:10},
  allFilterChip:{height:47,borderRadius:24,borderWidth:1,borderColor:'#DDDFE0',paddingHorizontal:16,backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',gap:7},
  allFilterChipActive:{backgroundColor:COLORS.black,borderColor:COLORS.black},
  allFilterChipText:{fontSize:15,lineHeight:19,fontWeight:'700',color:'#34383A'},
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
