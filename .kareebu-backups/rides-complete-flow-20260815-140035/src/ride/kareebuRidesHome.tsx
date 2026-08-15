import React, { useMemo } from 'react';
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
import { Feather, Ionicons } from '@expo/vector-icons';
import MapView, { Circle } from 'react-native-maps';

import { ScreenShell } from '../components';
import type { MobilityActions, MobilityData } from './mobilityScreens';

type RideShortcut = {
  label: string;
  image: ImageSourcePropType;
  onPress: () => void;
};

function regionForCity(city: string) {
  const key = city.trim().toLowerCase();

  if (key.includes('entebbe')) {
    return {
      latitude: 0.0512,
      longitude: 32.4637,
      latitudeDelta: 0.030,
      longitudeDelta: 0.030,
    };
  }

  if (key.includes('jinja')) {
    return {
      latitude: 0.4478,
      longitude: 33.2026,
      latitudeDelta: 0.030,
      longitudeDelta: 0.030,
    };
  }

  if (key.includes('nairobi')) {
    return {
      latitude: -1.2864,
      longitude: 36.8172,
      latitudeDelta: 0.030,
      longitudeDelta: 0.030,
    };
  }

  return {
    latitude: 0.3476,
    longitude: 32.5825,
    latitudeDelta: 0.028,
    longitudeDelta: 0.028,
  };
}

function RideShortcutCard({
  label,
  image,
  onPress,
  width,
}: RideShortcut & { width: number }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.shortcutCard,
        { width },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.shortcutVisual}>
        <Image
          source={image}
          resizeMode="contain"
          style={styles.shortcutImage}
        />
      </View>

      <Text numberOfLines={2} style={styles.shortcutLabel}>
        {label}
      </Text>
    </Pressable>
  );
}

export function KareebuRidesHomeScreen({
  data,
  actions,
}: {
  data: MobilityData;
  actions: MobilityActions;
}) {
  const { width } = useWindowDimensions();
  const region = useMemo(() => regionForCity(data.city), [data.city]);

  const tileWidth = useMemo(() => {
    const available = width - 32 - 24;
    return Math.max(76, Math.min(96, Math.floor(available / 4)));
  }, [width]);

  const goWhereTo = () => {
    actions.selectMode('RIDE');
    actions.selectRide('economy');
    actions.setRideProduct('instant');
    actions.go('whereTo');
  };

  const shortcuts: RideShortcut[] = [
    {
      label: 'Schedule',
      image: require('../../assets/kareebu-plus/rides-home/schedule.png'),
      onPress: () => {
        actions.selectMode('RIDE');
        actions.setRideProduct('scheduled');
        actions.go('rideSchedule');
      },
    },
    {
      label: 'School Rides',
      image: require('../../assets/kareebu-plus/rides-home/school-rides.png'),
      onPress: () => {
        actions.selectMode('RIDE');
        actions.setRideProduct('school');
        actions.go('schoolRun');
      },
    },
    {
      label: 'City to City',
      image: require('../../assets/kareebu-plus/rides-home/city-to-city.png'),
      onPress: () => {
        actions.selectMode('RIDE');
        actions.selectRide('comfort');
        actions.setRideProduct('instant');
        actions.go('whereTo');
      },
    },
    {
      label: 'For a Friend',
      image: require('../../assets/kareebu-plus/rides-home/for-a-friend.png'),
      onPress: () => {
        actions.selectMode('RIDE');
        actions.selectRide('economy');
        actions.setRideProduct('instant');
        actions.go('whereTo');
      },
    },
  ];

  const pickup =
    data.pickup && data.pickup.trim().length > 0
      ? data.pickup
      : `${data.city}, ${data.country}`;

  return (
    <ScreenShell>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapSection}>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            showsMyLocationButton={false}
          >
            <Circle
              center={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              radius={42}
              fillColor="rgba(66,133,244,0.95)"
              strokeColor="#FFFFFF"
              strokeWidth={3}
            />
          </MapView>

          <Pressable
            onPress={() => actions.go('home')}
            accessibilityRole="button"
            accessibilityLabel="Back to Kareebu home"
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather name="chevron-left" size={24} color="#242628" />
          </Pressable>

          <View style={styles.searchPanel}>
            <View style={styles.destinationRow}>
              <Pressable
                onPress={goWhereTo}
                style={({ pressed }) => [
                  styles.destinationButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.searchIcon}>
                  <Feather name="search" size={25} color="#FFFFFF" />
                </View>

                <Text style={styles.destinationText}>Where to?</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  actions.selectMode('RIDE');
                  actions.setRideProduct('scheduled');
                  actions.go('rideSchedule');
                }}
                style={({ pressed }) => [
                  styles.laterButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="calendar-outline" size={18} color="#2A2C2E" />
                <Text style={styles.laterText}>Later</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={goWhereTo}
              style={({ pressed }) => [
                styles.pickupRow,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.pickupIconWrap}>
                <Ionicons name="location-outline" size={26} color="#37393C" />
              </View>

              <View style={styles.pickupCopy}>
                <Text numberOfLines={1} style={styles.pickupTitle}>
                  {pickup}
                </Text>
                <Text numberOfLines={1} style={styles.pickupSubtitle}>
                  {data.city}, {data.country}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Rides for every need</Text>

          <View style={styles.shortcutRow}>
            {shortcuts.map((item) => (
              <RideShortcutCard
                key={item.label}
                {...item}
                width={tileWidth}
              />
            ))}
          </View>

          <Pressable
            onPress={() => actions.go('membership')}
            style={({ pressed }) => [
              styles.plusBanner,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.plusPattern} />

            <View style={styles.plusCopy}>
              <View style={styles.plusBrandRow}>
                <View style={styles.plusLogoMark}>
                  <Text style={styles.plusLogoK}>K</Text>
                </View>
                <Text style={styles.plusLogoText}>Kareebu+</Text>
              </View>

              <Text style={styles.plusTitle}>More value on every journey</Text>
              <Text style={styles.plusBody}>
                Explore member ride perks and exclusive Kareebu+ offers.
              </Text>
            </View>

            <View style={styles.giftCircle}>
              <Ionicons name="gift" size={40} color="#FFC928" />
            </View>
          </Pressable>

          <View style={styles.offersHeader}>
            <Text style={styles.offersTitle}>Offers</Text>

            <Pressable
              onPress={() => actions.go('rideOffers')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.seeAllButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <Feather name="arrow-right" size={22} color="#07594E" />
            </Pressable>
          </View>

          <Pressable
            onPress={() => actions.go('rideOffers')}
            style={({ pressed }) => [
              styles.promoCard,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.promoCopy}>
              <Text style={styles.promoTitle}>Add a promo code</Text>
              <Text style={styles.promoBody}>Save on an eligible Kareebu ride.</Text>
            </View>

            <View style={styles.promoIcon}>
              <Ionicons name="pricetag-outline" size={27} color="#2452D6" />
            </View>
          </Pressable>

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },

  mapSection: {
    height: 500,
    backgroundColor: '#E9EEF1',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },

  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.10,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  searchPanel: {
    position: 'absolute',
    top: 47,
    left: 28,
    right: 28,
    minHeight: 214,
    padding: 22,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.11,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  destinationRow: {
    minHeight: 86,
    padding: 12,
    borderRadius: 22,
    backgroundColor: '#F3F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  destinationButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07594E',
  },
  destinationText: {
    marginLeft: 15,
    color: '#2A2C2E',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  laterButton: {
    height: 54,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D9DCDD',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  laterText: {
    color: '#2C2E30',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },

  pickupRow: {
    minHeight: 82,
    marginTop: 13,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupIconWrap: {
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupCopy: {
    flex: 1,
    minWidth: 0,
    paddingLeft: 8,
  },
  pickupTitle: {
    color: '#303235',
    fontSize: 16.5,
    lineHeight: 21,
    fontWeight: '800',
  },
  pickupSubtitle: {
    marginTop: 4,
    color: '#85898D',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '500',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    color: '#2C2E30',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  shortcutRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutCard: {
    height: 126,
    borderRadius: 15,
    backgroundColor: '#F4F6F5',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 3,
  },
  shortcutVisual: {
    width: '100%',
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutImage: {
    width: '94%',
    height: '94%',
  },
  shortcutLabel: {
    minHeight: 31,
    paddingHorizontal: 2,
    color: '#2B2D2F',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14.5,
    fontWeight: '800',
  },

  plusBanner: {
    minHeight: 145,
    marginTop: 30,
    borderWidth: 1.5,
    borderColor: '#087565',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusPattern: {
    position: 'absolute',
    left: 28,
    right: -12,
    bottom: -17,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#07594E',
    transform: [{ rotate: '-4deg' }],
  },
  plusCopy: {
    flex: 1,
    zIndex: 2,
    paddingLeft: 16,
    paddingVertical: 17,
    paddingRight: 5,
  },
  plusBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusLogoMark: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07594E',
  },
  plusLogoK: {
    color: '#FFC928',
    fontSize: 17,
    fontWeight: '900',
  },
  plusLogoText: {
    marginLeft: 7,
    color: '#07594E',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
  },
  plusTitle: {
    marginTop: 10,
    color: '#2C2E30',
    fontSize: 16.5,
    lineHeight: 21,
    fontWeight: '800',
  },
  plusBody: {
    maxWidth: 250,
    marginTop: 3,
    color: '#555A5E',
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '500',
  },
  giftCircle: {
    zIndex: 2,
    width: 88,
    height: 88,
    marginRight: 12,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF6D9',
  },

  offersHeader: {
    marginTop: 31,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offersTitle: {
    color: '#2C2E30',
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  seeAllText: {
    color: '#07594E',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
  },

  promoCard: {
    minHeight: 102,
    borderRadius: 17,
    backgroundColor: '#F0F3FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  promoCopy: {
    flex: 1,
    minWidth: 0,
  },
  promoTitle: {
    color: '#2B2D30',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
  },
  promoBody: {
    marginTop: 4,
    color: '#6F7478',
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  promoIcon: {
    width: 58,
    height: 58,
    marginLeft: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCE4FF',
  },

  bottomSpace: {
    height: 28,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
});
