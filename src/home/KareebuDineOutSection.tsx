import React, { useMemo, useState } from 'react';
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
  photoUrl: string;
  image: ImageSourcePropType;
};

type Editorial = {
  id: string;
  title: string;
  subtitle: string;
  photoUrl: string;
  image: ImageSourcePropType;
};

const REAL_DINEOUT_PHOTOS = {
  cafe: 'https://images.unsplash.com/photo-1563722897-e6dac3cec340?auto=format&fit=crop&w=1400&q=82',
  african: 'https://images.unsplash.com/photo-1665333048952-a3ee97714c6b?auto=format&fit=crop&w=1400&q=82',
  grill: 'https://images.unsplash.com/photo-1567121938596-6d9d015d348b?auto=format&fit=crop&w=1400&q=82',
  coffee: 'https://images.unsplash.com/photo-1769138885048-4f91ed2353a0?auto=format&fit=crop&w=1400&q=82',
  dining: 'https://images.unsplash.com/photo-1705537748124-926009973f94?auto=format&fit=crop&w=1400&q=82',
} as const;

const RESTAURANTS: Restaurant[] = [
  {
    id: 'kampala-bistro',
    restaurantId: 'kampala-bistro',
    name: 'Kampala Bistro',
    rating: '4.7',
    reviews: '1.8k',
    eta: '20–30 mins',
    distance: '2.8 km',
    cuisine: 'Ugandan · East African',
    deliveryFee: 'UGX 2,000',
    photoUrl: REAL_DINEOUT_PHOTOS.cafe,
    image: require('../../assets/kareebu-plus/dineout/restaurant-kampala-bistro.jpg'),
  },
  {
    id: 'kololo-kitchen',
    restaurantId: 'kololo-kitchen',
    name: 'Kololo Kitchen',
    rating: '4.8',
    reviews: '1.2k',
    eta: '25–35 mins',
    distance: '3.6 km',
    cuisine: 'African · Grill',
    deliveryFee: 'UGX 2,500',
    offer: '20% off',
    photoUrl: REAL_DINEOUT_PHOTOS.african,
    image: require('../../assets/kareebu-plus/dineout/restaurant-kololo-kitchen.jpg'),
  },
  {
    id: 'acacia-grill',
    restaurantId: 'acacia-grill',
    name: 'Acacia Grill',
    rating: '4.8',
    reviews: '760',
    eta: '20–30 mins',
    distance: '4.1 km',
    cuisine: 'Grill · Continental',
    deliveryFee: 'UGX 3,000',
    photoUrl: REAL_DINEOUT_PHOTOS.grill,
    image: require('../../assets/kareebu-plus/dineout/restaurant-acacia-grill.jpg'),
  },
];

const EDITORIAL: Editorial[] = [
  {
    id: 'peaceful-retreats',
    title: 'Peaceful retreats',
    subtitle: 'Cafés and quiet corners worth slowing down for.',
    photoUrl: REAL_DINEOUT_PHOTOS.coffee,
    image: require('../../assets/kareebu-plus/dineout/editorial-peaceful-retreats.jpg'),
  },
  {
    id: 'weekend-dining',
    title: 'Weekend dining',
    subtitle: 'Great food and easy plans for the weekend.',
    photoUrl: REAL_DINEOUT_PHOTOS.dining,
    image: require('../../assets/kareebu-plus/dineout/editorial-weekend-dining.jpg'),
  },
];

function RealDineOutPhoto({ url, fallback, style }: { url: string; fallback: ImageSourcePropType; style: any }) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      source={failed ? fallback : { uri: url }}
      resizeMode="cover"
      style={style}
      onError={() => setFailed(true)}
    />
  );
}

export function KareebuDineOutSection({
  onOpenRestaurant,
  onOpenDineOut,
}: {
  onOpenRestaurant: (restaurantId: string) => void;
  onOpenDineOut: () => void;
}) {
  const { width } = useWindowDimensions();

  // One card is easy to read, while ~22% of the next card remains visible.
  const restaurantWidth = useMemo(
    () => Math.round(Math.min(308, Math.max(272, width * 0.72))),
    [width],
  );

  const editorialWidth = useMemo(
    () => Math.round(Math.min(336, Math.max(292, width * 0.82))),
    [width],
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>DineOut</Text>
          <Text style={styles.sectionSubtitle}>Great places around Kampala</Text>
        </View>
        <Pressable
          onPress={onOpenDineOut}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="See all DineOut restaurants"
        >
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onOpenDineOut}
        accessibilityRole="button"
        accessibilityLabel="Explore Kareebu DineOut"
        style={({ pressed }) => [
          styles.heroPressable,
          pressed && styles.pressed,
        ]}
      >
        <RealDineOutPhoto
          url={REAL_DINEOUT_PHOTOS.cafe}
          fallback={require('../../assets/kareebu-plus/dineout/dineout-hero.jpg')}
          style={styles.hero}
        />
      </Pressable>

      <FlatList
        horizontal
        data={RESTAURANTS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.restaurantRail}
        ItemSeparatorComponent={() => <View style={styles.restaurantGap} />}
        decelerationRate="fast"
        snapToInterval={restaurantWidth + 12}
        disableIntervalMomentum
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenRestaurant(item.restaurantId)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${item.rating} stars, ${item.eta}`}
            style={({ pressed }) => [
              styles.restaurantCard,
              { width: restaurantWidth },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.restaurantImageFrame}>
              <RealDineOutPhoto url={item.photoUrl} fallback={item.image} style={styles.restaurantImage}/>

              {item.offer ? (
                <View style={styles.offerBadge}>
                  <Text style={styles.offerText}>{item.offer}</Text>
                </View>
              ) : null}

              <View style={styles.plusBadge}>
                <Text style={styles.plusBadgeText}>K+</Text>
              </View>
            </View>

            <View style={styles.restaurantBody}>
              <Text numberOfLines={1} style={styles.restaurantName}>
                {item.name}
              </Text>

              <View style={styles.ratingRow}>
                <Text style={styles.rating}>★ {item.rating}</Text>
                <Text style={styles.reviews}>({item.reviews})</Text>
                <View style={styles.metaDot} />
                <Text style={styles.eta}>{item.eta}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text numberOfLines={1} style={styles.cuisine}>
                  {item.cuisine}
                </Text>
                <Text style={styles.distance}>{item.distance}</Text>
              </View>

              <Text style={styles.deliveryFee}>Delivery {item.deliveryFee}</Text>
            </View>
          </Pressable>
        )}
      />

      <View style={styles.editorialHeader}>
        <Text style={styles.editorialHeading}>Discover something different</Text>
      </View>

      <FlatList
        horizontal
        data={EDITORIAL}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.editorialRail}
        ItemSeparatorComponent={() => <View style={styles.editorialGap} />}
        decelerationRate="fast"
        snapToInterval={editorialWidth + 12}
        disableIntervalMomentum
        renderItem={({ item }) => (
          <Pressable
            onPress={onOpenDineOut}
            style={({ pressed }) => [
              styles.editorialCard,
              { width: editorialWidth },
              pressed && styles.pressed,
            ]}
          >
            <RealDineOutPhoto url={item.photoUrl} fallback={item.image} style={styles.editorialImage}/>
            <View style={styles.editorialShade} />

            <View style={styles.editorialTopBadge}>
              <Text style={styles.editorialTopBadgeText}>Kareebu DineOut</Text>
            </View>

            <View style={styles.editorialCopy}>
              <Text style={styles.editorialTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.editorialSubtitle}>
                {item.subtitle}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 14,
    marginHorizontal: -14,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },

  sectionHeader: {
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#1F2224',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    marginTop: 2,
    color: '#72767A',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '500',
  },
  seeAll: {
    color: '#E94843',
    fontSize: 14,
    lineHeight: 15,
    fontWeight: '800',
  },

  heroPressable: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hero: {
    width: '100%',
    height: 104,
    backgroundColor: '#171717',
  },

  restaurantRail: {
    paddingTop: 10,
    paddingLeft: 14,
    paddingRight: 34,
  },
  restaurantGap: {
    width: 9,
  },
  restaurantCard: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E9EA',
  },
  restaurantImageFrame: {
    width: '100%',
    height: 126,
    backgroundColor: '#ECEDEE',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  offerBadge: {
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#F2556D',
  },
  offerText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
  },
  plusBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 34,
    height: 27,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  plusBadgeText: {
    color: '#19A85A',
    fontSize: 12.5,
    fontWeight: '900',
  },

  restaurantBody: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  restaurantName: {
    color: '#242629',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  ratingRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#008F7B',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
  },
  reviews: {
    marginLeft: 3,
    color: '#008F7B',
    fontSize: 12.5,
    lineHeight: 15,
    fontWeight: '600',
  },
  metaDot: {
    width: 4,
    height: 4,
    marginHorizontal: 7,
    borderRadius: 2,
    backgroundColor: '#A7AAAD',
  },
  eta: {
    color: '#008F7B',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '800',
  },
  detailRow: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisine: {
    flex: 1,
    color: '#74787C',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
  },
  distance: {
    marginLeft: 8,
    color: '#74787C',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
  },
  deliveryFee: {
    marginTop: 5,
    color: '#45494D',
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
  },

  editorialHeader: {
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 10,
  },
  editorialHeading: {
    color: '#25272A',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
  },
  editorialRail: {
    paddingLeft: 14,
    paddingRight: 34,
  },
  editorialGap: {
    width: 9,
  },
  editorialCard: {
    height: 210,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#362821',
  },
  editorialImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  editorialShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  editorialTopBadge: {
    position: 'absolute',
    left: 14,
    top: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  editorialTopBadgeText: {
    color: '#171717',
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
  },
  editorialCopy: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  editorialTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  editorialSubtitle: {
    maxWidth: '90%',
    marginTop: 4,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '500',
  },

  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.995 }],
  },
});
