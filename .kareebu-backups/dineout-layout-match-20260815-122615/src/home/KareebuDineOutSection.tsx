import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type RestaurantCard = {
  id: string;
  restaurantId: string;
  name: string;
  rating: string;
  reviews: string;
  eta: string;
  distance: string;
  cuisine: string;
  deliveryFee: string;
  offer?: string;
  image: ImageSourcePropType;
};

type EditorialCard = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

const RESTAURANTS: RestaurantCard[] = [
  {
    id: 'kampala-bistro',
    restaurantId: 'kampala-bistro',
    name: 'Kampala Bistro',
    rating: '4.8',
    reviews: '999+',
    eta: '20–30 mins',
    distance: '2.4 km',
    cuisine: 'Ugandan, African',
    deliveryFee: 'UGX 2,000',
    image: require('../../assets/kareebu-plus/dineout/restaurant-kampala-bistro.jpg'),
  },
  {
    id: 'lakeside-grill',
    restaurantId: 'lakeside-grill',
    name: 'Lakeside Grill',
    rating: '4.7',
    reviews: '500+',
    eta: '25–35 mins',
    distance: '3.8 km',
    cuisine: 'Grill, Continental',
    deliveryFee: 'UGX 3,000',
    offer: '20% off',
    image: require('../../assets/kareebu-plus/dineout/restaurant-lakeside-grill.jpg'),
  },
  {
    id: 'city-cafe',
    restaurantId: 'city-cafe',
    name: 'City Café',
    rating: '4.9',
    reviews: '300+',
    eta: '15–25 mins',
    distance: '1.9 km',
    cuisine: 'Café, Breakfast',
    deliveryFee: 'UGX 1,500',
    image: require('../../assets/kareebu-plus/dineout/restaurant-city-cafe.jpg'),
  },
];

const EDITORIAL: EditorialCard[] = [
  {
    id: 'peaceful-retreats',
    title: 'Peaceful retreats',
    subtitle: 'Slow down, sip something good.',
    image: require('../../assets/kareebu-plus/dineout/editorial-peaceful-retreats.jpg'),
  },
  {
    id: 'weekend-brunch',
    title: 'Weekend brunch',
    subtitle: 'Your Saturday plans, sorted.',
    image: require('../../assets/kareebu-plus/dineout/editorial-weekend-brunch.jpg'),
  },
];

export function KareebuDineOutSection({
  onOpenRestaurant,
  onOpenDineOut,
}: {
  onOpenRestaurant: (restaurantId: string) => void;
  onOpenDineOut: () => void;
}) {
  const { width } = useWindowDimensions();

  const restaurantWidth = useMemo(
    () => Math.round(Math.min(320, Math.max(286, width * 0.76))),
    [width],
  );

  const editorialWidth = useMemo(
    () => Math.round(Math.min(330, Math.max(300, width * 0.82))),
    [width],
  );

  return (
    <View style={styles.section}>
      <Pressable
        onPress={onOpenDineOut}
        accessibilityRole="button"
        accessibilityLabel="Explore Kareebu DineOut"
        style={({ pressed }) => [styles.heroPressable, pressed && styles.pressed]}
      >
        <Image
          source={require('../../assets/kareebu-plus/dineout/dineout-hero.png')}
          resizeMode="cover"
          style={styles.hero}
        />
      </Pressable>

      <FlatList
        data={RESTAURANTS}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.restaurantRail}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenRestaurant(item.restaurantId)}
            style={({ pressed }) => [
              styles.restaurantWrap,
              { width: restaurantWidth },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.rating} stars, ${item.eta}`}
          >
            <View style={styles.restaurantImageWrap}>
              <Image source={item.image} style={styles.restaurantImage} resizeMode="cover" />

              {item.offer ? (
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{item.offer}</Text>
                  <Text style={styles.offerSubtext}>Just for you</Text>
                </View>
              ) : null}
            </View>

            <Text numberOfLines={1} style={styles.restaurantName}>
              {item.name}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.rating}>★ {item.rating} ({item.reviews})</Text>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.eta}>{item.eta}</Text>
              <Text style={styles.distance}> ({item.distance})</Text>
            </View>

            <Text numberOfLines={1} style={styles.cuisine}>
              {item.cuisine} · 🛵 {item.deliveryFee}
            </Text>
          </Pressable>
        )}
      />

      <View style={styles.editorialHeader}>
        <Text style={styles.editorialHeading}>More to discover</Text>
        <Pressable onPress={onOpenDineOut}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <FlatList
        data={EDITORIAL}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.editorialRail}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={onOpenDineOut}
            style={({ pressed }) => [
              styles.editorialCard,
              { width: editorialWidth },
              pressed && styles.pressed,
            ]}
          >
            <Image source={item.image} resizeMode="cover" style={styles.editorialImage} />
            <View style={styles.editorialOverlay} />
            <View style={styles.editorialCopy}>
              <Text style={styles.dineoutLabel}>KAREEBU DINEOUT</Text>
              <Text style={styles.editorialTitle}>{item.title}</Text>
              <Text style={styles.editorialSubtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginHorizontal: -16,
    backgroundColor: '#FFFFFF',
  },
  heroPressable: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: 168,
    backgroundColor: '#0A5A4F',
  },
  restaurantRail: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 30,
  },
  gap: {
    width: 12,
  },
  restaurantWrap: {
    flexShrink: 0,
  },
  restaurantImageWrap: {
    height: 175,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#F0F1F2',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  offerText: {
    color: '#F2556D',
    fontSize: 14,
    fontWeight: '800',
  },
  offerSubtext: {
    color: '#F2556D',
    fontSize: 11.5,
    marginTop: 1,
    fontWeight: '600',
  },
  restaurantName: {
    marginTop: 9,
    color: '#252628',
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
  },
  metaRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  rating: {
    color: '#009B84',
    fontSize: 13.5,
    fontWeight: '800',
  },
  bullet: {
    marginHorizontal: 4,
    color: '#8B8F92',
    fontSize: 13,
  },
  eta: {
    color: '#009B84',
    fontSize: 13.5,
    fontWeight: '800',
  },
  distance: {
    color: '#6F7377',
    fontSize: 13.5,
    fontWeight: '500',
  },
  cuisine: {
    marginTop: 5,
    color: '#717579',
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  editorialHeader: {
    marginTop: 22,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editorialHeading: {
    color: '#202225',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
  },
  seeAll: {
    color: '#F04B45',
    fontSize: 14,
    fontWeight: '800',
  },
  editorialRail: {
    paddingLeft: 16,
    paddingRight: 30,
    paddingBottom: 4,
  },
  editorialCard: {
    height: 245,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#402D25',
  },
  editorialImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  editorialOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  editorialCopy: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    right: 18,
  },
  dineoutLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  editorialTitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 29,
    lineHeight: 31,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  editorialSubtitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.82,
  },
});
