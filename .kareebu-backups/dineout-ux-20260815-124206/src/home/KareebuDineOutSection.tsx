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

type Restaurant = {
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

type Editorial = {
  id: string;
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
};

const RESTAURANTS: Restaurant[] = [
  {
    id: 'kampala-bistro',
    restaurantId: 'kampala-bistro',
    name: 'Kampala Bistro',
    rating: '4.7',
    reviews: '999+',
    eta: '20 - 30 mins',
    distance: '2.8 km',
    cuisine: 'Ugandan, East African',
    deliveryFee: 'UGX 2,000',
    image: require('../../assets/kareebu-plus/dineout/restaurant-kampala-bistro.jpg'),
  },
  {
    id: 'kololo-kitchen',
    restaurantId: 'kololo-kitchen',
    name: 'Kololo Kitchen',
    rating: '4.8',
    reviews: '999+',
    eta: '25 - 35 mins',
    distance: '3.6 km',
    cuisine: 'African, Grill',
    deliveryFee: 'UGX 2,500',
    offer: '20% off',
    image: require('../../assets/kareebu-plus/dineout/restaurant-kololo-kitchen.jpg'),
  },
  {
    id: 'acacia-grill',
    restaurantId: 'acacia-grill',
    name: 'Acacia Grill',
    rating: '4.8',
    reviews: '500+',
    eta: '20 - 30 mins',
    distance: '4.1 km',
    cuisine: 'Grill, Continental',
    deliveryFee: 'UGX 3,000',
    image: require('../../assets/kareebu-plus/dineout/restaurant-acacia-grill.jpg'),
  },
];

const EDITORIAL: Editorial[] = [
  {
    id: 'peaceful-retreats',
    title: 'Peaceful\nretreats\nin Kampala.',
    image: require('../../assets/kareebu-plus/dineout/editorial-peaceful-retreats.jpg'),
  },
  {
    id: 'weekend-dining',
    title: 'Weekend\ndining,\ndone right.',
    image: require('../../assets/kareebu-plus/dineout/editorial-weekend-dining.jpg'),
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

  // Reference screenshot: first restaurant takes ~67% of viewport and
  // the next card is visibly cut off on the right.
  const restaurantWidth = useMemo(
    () => Math.round(width * 0.675),
    [width],
  );

  // Reference screenshot: editorial card is ~91% of viewport.
  const editorialWidth = useMemo(
    () => Math.round(width * 0.905),
    [width],
  );

  return (
    <View style={styles.section}>
      <Pressable
        onPress={onOpenDineOut}
        accessibilityRole="button"
        accessibilityLabel="Explore Kareebu DineOut"
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Image
          source={require('../../assets/kareebu-plus/dineout/dineout-hero.jpg')}
          resizeMode="cover"
          style={[styles.hero, { height: width * 0.342 }]}
        />
      </Pressable>

      <FlatList
        horizontal
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.restaurantRail}
        ItemSeparatorComponent={() => <View style={styles.restaurantGap} />}
        renderItem={({ item }) => {
          const imageHeight = restaurantWidth / 2.06;

          return (
            <Pressable
              onPress={() => onOpenRestaurant(item.restaurantId)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, ${item.rating} stars, ${item.eta}`}
              style={({ pressed }) => [
                styles.restaurant,
                { width: restaurantWidth },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.restaurantImageFrame,
                  { height: imageHeight },
                ]}
              >
                <Image
                  source={item.image}
                  resizeMode="cover"
                  style={styles.restaurantImage}
                />

                {item.offer ? (
                  <View style={styles.offerBadge}>
                    <Text style={styles.offerText}>{item.offer}</Text>
                    <Text style={styles.offerSubtext}>Just for you</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.nameRow}>
                <Text numberOfLines={1} style={styles.restaurantName}>
                  {item.name}
                </Text>
                <Text style={styles.plusMark}>K+</Text>
              </View>

              <View style={styles.primaryMeta}>
                <Text style={styles.greenMeta}>
                  ★ {item.rating} ({item.reviews})
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.greenMeta}>{item.eta}</Text>
                <Text style={styles.distance}> ({item.distance})</Text>
              </View>

              <Text numberOfLines={1} style={styles.secondaryMeta}>
                {item.cuisine} · 🛵 {item.deliveryFee}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        horizontal
        data={EDITORIAL}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.editorialRail}
        ItemSeparatorComponent={() => <View style={styles.editorialGap} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={onOpenDineOut}
            style={({ pressed }) => [
              styles.editorialCard,
              {
                width: editorialWidth,
                height: editorialWidth / 1.83,
              },
              pressed && styles.pressed,
            ]}
          >
            <Image
              source={item.image}
              resizeMode="cover"
              style={styles.editorialImage}
            />
            <View style={styles.editorialShade} />

            <View style={styles.editorialCopy}>
              <View style={styles.dineoutBrand}>
                <Text style={styles.dineoutBrandIcon}>K</Text>
                <Text style={styles.dineoutBrandText}>DineOut</Text>
              </View>

              <Text style={styles.editorialTitle}>{item.title}</Text>
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
    overflow: 'hidden',
  },

  // Full-bleed, square-edged banner — intentionally not a rounded card.
  hero: {
    width: '100%',
    backgroundColor: '#07594E',
  },

  restaurantRail: {
    paddingTop: 0,
    paddingLeft: 12,
    paddingRight: 28,
  },
  restaurantGap: {
    width: 8,
  },
  restaurant: {
    paddingTop: 0,
    paddingBottom: 0,
    flexShrink: 0,
  },
  restaurantImageFrame: {
    width: '100%',
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#ECECEC',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    right: 10,
    bottom: 9,
    minWidth: 84,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  offerText: {
    color: '#F2556D',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '700',
  },
  offerSubtext: {
    marginTop: 1,
    color: '#F2556D',
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  nameRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  restaurantName: {
    maxWidth: '88%',
    color: '#303235',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },
  plusMark: {
    marginLeft: 5,
    color: '#008F7B',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
  },
  primaryMeta: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenMeta: {
    color: '#009B84',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  dot: {
    marginHorizontal: 4,
    color: '#8D9093',
    fontSize: 13,
  },
  distance: {
    color: '#696D70',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
  },
  secondaryMeta: {
    marginTop: 5,
    color: '#777B7F',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
  },

  // No heading between rows: the large editorial carousel follows directly,
  // matching the supplied reference.
  editorialRail: {
    paddingTop: 23,
    paddingLeft: 12,
    paddingRight: 28,
    paddingBottom: 3,
  },
  editorialGap: {
    width: 8,
  },
  editorialCard: {
    flexShrink: 0,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#3B2B24',
  },
  editorialImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  editorialShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.17)',
  },
  editorialCopy: {
    position: 'absolute',
    left: 16,
    top: 48,
    right: 20,
  },
  dineoutBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dineoutBrandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#FFFFFF',
    color: '#FFC928',
    fontSize: 18,
    fontWeight: '900',
  },
  dineoutBrandText: {
    marginLeft: 7,
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  },
  editorialTitle: {
    marginTop: 15,
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '500',
    letterSpacing: -0.6,
  },

  pressed: {
    opacity: 0.82,
  },
});
