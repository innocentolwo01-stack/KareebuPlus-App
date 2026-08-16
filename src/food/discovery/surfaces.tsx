import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { formatMoney } from '../../locale';
import type {
  FoodDiscoveryAdvancedFilters,
  FoodDiscoverySort,
  FoodHomeController,
  FoodHomeRestaurant,
} from './types';

function SurfaceHeader({
  title,
  onBack,
  onFilter,
  filtered = false,
}: {
  title: string;
  onBack: () => void;
  onFilter?: () => void;
  filtered?: boolean;
}) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} hitSlop={10} style={styles.headerButton}>
        <Feather name="arrow-left" size={22} color="#181A1C" />
      </Pressable>

      <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>

      {onFilter ? (
        <Pressable onPress={onFilter} hitSlop={10} style={[styles.headerButton, filtered && styles.headerButtonActive]}>
          <Feather name="sliders" size={20} color={filtered ? '#FFFFFF' : '#181A1C'} />
        </Pressable>
      ) : (
        <View style={styles.headerButtonSpacer} />
      )}
    </View>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Feather name="search" size={24} color="#6F7478" />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

function FavouriteButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={styles.favourite}>
      <Feather name="heart" size={20} color={active ? '#FF566C' : '#5E6468'} />
    </Pressable>
  );
}

function SurfaceRestaurantPhoto({ restaurant }: { restaurant: FoodHomeRestaurant }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      source={failed && restaurant.fallbackImage ? restaurant.fallbackImage : restaurant.image}
      resizeMode="cover"
      style={styles.restaurantImage}
      onError={() => setFailed(true)}
    />
  );
}

function RestaurantRow({
  restaurant,
  controller,
}: {
  restaurant: FoodHomeRestaurant;
  controller: FoodHomeController;
}) {
  return (
    <Pressable
      onPress={() => controller.actions.openRestaurant(restaurant.id)}
      style={({ pressed }) => [styles.restaurantRow, pressed && styles.pressed]}
    >
      <SurfaceRestaurantPhoto restaurant={restaurant} />

      <View style={styles.restaurantCopy}>
        <View style={styles.restaurantNameRow}>
          {restaurant.plus ? <Text style={styles.plusBadge}>K+</Text> : null}
          <Text numberOfLines={1} style={styles.restaurantName}>{restaurant.name}</Text>
        </View>
        <Text numberOfLines={1} style={styles.restaurantMeta}>
          ★ {restaurant.rating.toFixed(1)} ({restaurant.reviews}) · {restaurant.eta} · {restaurant.distance}
        </Text>
        <Text numberOfLines={1} style={styles.restaurantMeta}>
          {[restaurant.priceLevel, restaurant.neighborhood, restaurant.cuisine, restaurant.deliveryLabel].filter(Boolean).join(' · ')}
        </Text>
        {restaurant.offer ? <Text numberOfLines={1} style={styles.offer}>{restaurant.offer}</Text> : null}
      </View>

      <FavouriteButton
        active={controller.favouriteIds.includes(restaurant.id)}
        onPress={() => controller.actions.toggleFavourite(restaurant.id)}
      />
    </Pressable>
  );
}

const TRENDING_SEARCHES = [
  'Chicken',
  'Burger',
  'Pizza',
  'Coffee',
  'Healthy',
  'Biryani',
];

export function FoodSearchSurface({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const hasQuery = controller.query.trim().length > 0;
  const total = controller.restaurantSearchResults.length + controller.dishSearchResults.length;

  return (
    <View style={styles.root}>
      <SurfaceHeader
        title="Search Food"
        onBack={controller.back}
        onFilter={controller.openFilters}
        filtered={controller.hasAdvancedFilters}
      />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#5D6266" />
          <TextInput
            value={controller.query}
            onChangeText={controller.setQuery}
            autoFocus
            placeholder="Search restaurants or dishes"
            placeholderTextColor="#8B9094"
            style={styles.searchInput}
          />
          {hasQuery ? (
            <Pressable onPress={() => controller.setQuery('')} hitSlop={8}>
              <Feather name="x-circle" size={20} color="#6B7074" />
            </Pressable>
          ) : null}
        </View>

        {!hasQuery ? (
          <>
            <Text style={styles.sectionTitle}>Popular searches</Text>
            <View style={styles.trendingWrap}>
              {TRENDING_SEARCHES.map((item) => (
                <Pressable key={item} onPress={() => controller.setQuery(item)} style={styles.trendingChip}>
                  <Text style={styles.trendingText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Top restaurants</Text>
            <View style={styles.listCard}>
              {controller.rankedRestaurants.slice(0, 5).map((restaurant) => (
                <RestaurantRow key={restaurant.id} restaurant={restaurant} controller={controller} />
              ))}
            </View>
          </>
        ) : total === 0 ? (
          <Empty title="No Food results" body={`Nothing in the current catalogue matches “${controller.query}”.`} />
        ) : (
          <>
            {controller.restaurantSearchResults.length ? (
              <>
                <Text style={styles.sectionTitle}>Restaurants</Text>
                <View style={styles.listCard}>
                  {controller.restaurantSearchResults.map((restaurant) => (
                    <RestaurantRow key={restaurant.id} restaurant={restaurant} controller={controller} />
                  ))}
                </View>
              </>
            ) : null}

            {controller.dishSearchResults.length ? (
              <>
                <Text style={styles.sectionTitle}>Dishes</Text>
                <View style={styles.listCard}>
                  {controller.dishSearchResults.map((result) => (
                    <Pressable
                      key={`${result.restaurantId}-${result.item.id}`}
                      onPress={() => controller.actions.openFoodItem(result.restaurantId, result.item.id)}
                      style={({ pressed }) => [styles.dishRow, pressed && styles.pressed]}
                    >
                      <Image source={result.item.image} resizeMode="cover" style={styles.dishImage} />
                      <View style={styles.restaurantCopy}>
                        <Text numberOfLines={1} style={styles.dishName}>{result.item.name}</Text>
                        <Text numberOfLines={1} style={styles.restaurantMeta}>{result.restaurantName}</Text>
                        <Text numberOfLines={2} style={styles.dishDescription}>{result.item.description}</Text>
                        <Text style={styles.dishPrice}>{formatMoney(controller.document.market.country, result.item.price)}</Text>
                      </View>
                      <Feather name="chevron-right" size={21} color="#72777B" />
                    </Pressable>
                  ))}
                </View>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

export function FoodListingSurface({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const title = controller.surface.kind === 'listing' ? controller.surface.title : 'Restaurants';

  return (
    <View style={styles.root}>
      <SurfaceHeader
        title={title}
        onBack={controller.back}
        onFilter={controller.openFilters}
        filtered={controller.hasAdvancedFilters}
      />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listingSummary}>
          <Text style={styles.listingCount}>
            {controller.listingRestaurants.length} restaurant{controller.listingRestaurants.length === 1 ? '' : 's'}
          </Text>
          {controller.hasAdvancedFilters ? (
            <Pressable onPress={controller.clearAdvancedFilters}>
              <Text style={styles.clearLink}>Clear filters</Text>
            </Pressable>
          ) : null}
        </View>

        {controller.listingRestaurants.length ? (
          <View style={styles.listCard}>
            {controller.listingRestaurants.map((restaurant) => (
              <RestaurantRow key={restaurant.id} restaurant={restaurant} controller={controller} />
            ))}
          </View>
        ) : (
          <Empty title="No restaurants found" body="Try clearing a filter or choosing another Food category." />
        )}
      </ScrollView>
    </View>
  );
}

const SORTS: FoodDiscoverySort[] = ['Recommended', 'Top rated', 'Fastest'];
const RATINGS = [4, 4.5, 4.7];

function ToggleRow({
  label,
  body,
  active,
  onPress,
}: {
  label: string;
  body: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.toggleRow}>
      <View style={styles.flex}>
        <Text style={styles.toggleTitle}>{label}</Text>
        <Text style={styles.toggleBody}>{body}</Text>
      </View>
      <View style={[styles.toggle, active && styles.toggleActive]}>
        <View style={[styles.toggleKnob, active && styles.toggleKnobActive]} />
      </View>
    </Pressable>
  );
}

export function FoodFiltersSurface({
  controller,
}: {
  controller: FoodHomeController;
}) {
  const filters = controller.advancedFilters;
  const patch = (next: Partial<FoodDiscoveryAdvancedFilters>) => controller.setAdvancedFilters(next);

  return (
    <View style={styles.root}>
      <SurfaceHeader title="Filter & sort" onBack={controller.back} />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Sort by</Text>
        <View style={styles.optionWrap}>
          {SORTS.map((sort) => (
            <Pressable key={sort} onPress={() => patch({ sort })} style={[styles.optionChip, filters.sort === sort && styles.optionChipActive]}>
              <Text style={[styles.optionText, filters.sort === sort && styles.optionTextActive]}>{sort}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Minimum rating</Text>
        <View style={styles.optionWrap}>
          <Pressable onPress={() => patch({ minRating: null })} style={[styles.optionChip, filters.minRating === null && styles.optionChipActive]}>
            <Text style={[styles.optionText, filters.minRating === null && styles.optionTextActive]}>Any</Text>
          </Pressable>
          {RATINGS.map((rating) => (
            <Pressable key={rating} onPress={() => patch({ minRating: rating })} style={[styles.optionChip, filters.minRating === rating && styles.optionChipActive]}>
              <Text style={[styles.optionText, filters.minRating === rating && styles.optionTextActive]}>★ {rating}+</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.toggleCard}>
          <ToggleRow label="Offers" body="Restaurants with a current Kareebu offer" active={filters.offersOnly} onPress={() => patch({ offersOnly: !filters.offersOnly })} />
          <ToggleRow label="Kareebu+" body="Member restaurants and delivery perks" active={filters.plusOnly} onPress={() => patch({ plusOnly: !filters.plusOnly })} />
          <ToggleRow label="Free delivery" body="Show restaurants with free delivery" active={filters.freeDeliveryOnly} onPress={() => patch({ freeDeliveryOnly: !filters.freeDeliveryOnly })} />
        </View>
      </ScrollView>

      <View style={styles.filterFooter}>
        <Pressable onPress={controller.clearAdvancedFilters} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
        <Pressable onPress={controller.back} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Show results</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#ECEDEF', backgroundColor: '#FFFFFF' },
  headerButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F6F7' },
  headerButtonActive: { backgroundColor: '#111315' },
  headerButtonSpacer: { width: 40, height: 40 },
  headerTitle: { flex: 1, fontSize: 20, lineHeight: 25, fontWeight: '900', color: '#17191B' },
  content: { paddingHorizontal: 15, paddingTop: 14, paddingBottom: 110 },
  searchBox: { minHeight: 50, borderRadius: 16, backgroundColor: '#F3F4F5', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14 },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 15, lineHeight: 20, color: '#17191B' },
  sectionTitle: { marginTop: 22, marginBottom: 10, fontSize: 18, lineHeight: 23, fontWeight: '900', color: '#181A1C' },
  trendingWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  trendingChip: { minHeight: 38, paddingHorizontal: 14, borderRadius: 19, borderWidth: 1, borderColor: '#D7D9DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  trendingText: { fontSize: 13, fontWeight: '800', color: '#34383B' },
  listCard: { overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderColor: '#ECEDEF', backgroundColor: '#FFFFFF' },
  restaurantRow: { minHeight: 104, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11, borderBottomWidth: 1, borderBottomColor: '#ECEDEF' },
  restaurantImage: { width: 82, height: 82, borderRadius: 14, backgroundColor: '#F1F2F3' },
  restaurantCopy: { flex: 1, minWidth: 0 },
  restaurantNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  restaurantName: { flex: 1, fontSize: 15, lineHeight: 20, fontWeight: '900', color: '#17191B' },
  restaurantMeta: { marginTop: 3, fontSize: 12, lineHeight: 17, color: '#696E72' },
  plusBadge: { overflow: 'hidden', borderRadius: 7, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: '#101214', color: '#FFE14D', fontSize: 9, fontWeight: '900' },
  offer: { alignSelf: 'flex-start', marginTop: 5, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, backgroundColor: '#DFFF36', fontSize: 10, lineHeight: 13, fontWeight: '900', color: '#1D210D' },
  favourite: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  dishRow: { minHeight: 112, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11, borderBottomWidth: 1, borderBottomColor: '#ECEDEF' },
  dishImage: { width: 82, height: 82, borderRadius: 14, backgroundColor: '#F1F2F3' },
  dishName: { fontSize: 15, lineHeight: 20, fontWeight: '900', color: '#17191B' },
  dishDescription: { marginTop: 3, fontSize: 12, lineHeight: 16, color: '#73787C' },
  dishPrice: { marginTop: 5, fontSize: 13, lineHeight: 17, fontWeight: '900', color: '#17191B' },
  empty: { alignItems: 'center', paddingVertical: 54, paddingHorizontal:14 },
  emptyIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#F1F2F3', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { marginTop: 13, fontSize: 17, lineHeight: 22, fontWeight: '900', color: '#25282A', textAlign: 'center' },
  emptyBody: { marginTop: 6, maxWidth: 310, fontSize: 13, lineHeight: 19, color: '#767B7F', textAlign: 'center' },
  listingSummary: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  listingCount: { fontSize: 13, lineHeight: 18, fontWeight: '800', color: '#6C7175' },
  clearLink: { fontSize: 13, lineHeight: 18, fontWeight: '900', color: '#0C7A62' },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#D8DADC', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  optionChipActive: { borderColor: '#111315', backgroundColor: '#111315' },
  optionText: { fontSize: 13, fontWeight: '800', color: '#34383B' },
  optionTextActive: { color: '#FFFFFF' },
  toggleCard: { marginTop: 22, overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderColor: '#ECEDEF', backgroundColor: '#FFFFFF' },
  toggleRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#ECEDEF' },
  toggleTitle: { fontSize: 14, lineHeight: 19, fontWeight: '900', color: '#1F2224' },
  toggleBody: { marginTop: 2, fontSize: 11, lineHeight: 16, color: '#74797D' },
  toggle: { width: 44, height: 26, borderRadius: 13, padding: 3, backgroundColor: '#D6D8DA' },
  toggleActive: { backgroundColor: '#08A77D' },
  toggleKnob: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF' },
  toggleKnobActive: { alignSelf: 'flex-end' },
  filterFooter: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 15, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E7E9EA', backgroundColor: '#FFFFFF' },
  clearButton: { width: 104, minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: '#D5D7D9', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  clearButtonText: { fontSize: 14, fontWeight: '900', color: '#25282A' },
  applyButton: { flex: 1, minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111315' },
  applyButtonText: { fontSize: 14, fontWeight: '900', color: '#FFFFFF' },
  pressed: { opacity: 0.72 },
});
