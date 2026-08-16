import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ServiceItem = {
  label: string;
  screen: string;
  image: ImageSourcePropType;
};

type ServiceColumn = [ServiceItem, ServiceItem];

const serviceColumns: ServiceColumn[] = [
  [
    { label: 'Rides', screen: 'mobilityHome', image: require('../../assets/kareebu-plus/services-3d/rides.png') },
    { label: 'Pharmacies', screen: 'shops', image: require('../../assets/kareebu-plus/services-3d/pharmacies.png') },
  ],
  [
    { label: 'Food', screen: 'food', image: require('../../assets/kareebu-plus/services-3d/food.png') },
    { label: 'Shops', screen: 'shops', image: require('../../assets/kareebu-plus/services-3d/shops.png') },
  ],
  [
    { label: 'Groceries', screen: 'groceries', image: require('../../assets/kareebu-plus/services-3d/groceries.png') },
    { label: 'Send', screen: 'parcel', image: require('../../assets/kareebu-plus/services-3d/send.png') },
  ],
  [
    { label: 'Boda', screen: 'mobilityHome', image: require('../../assets/kareebu-plus/services-3d/boda.png') },
    { label: 'More', screen: 'services', image: require('../../assets/kareebu-plus/services-3d/more.png') },
  ],
  [
    { label: 'DineOut', screen: 'dineOut', image: require('../../assets/kareebu-plus/services-3d/dineout.png') },
    { label: 'Pay', screen: 'wallet', image: require('../../assets/kareebu-plus/services-3d/pay.png') },
  ],
  [
    { label: 'Fix', screen: 'fix', image: require('../../assets/kareebu-plus/services-3d/fix.png') },
    { label: 'Home & Care', screen: 'homeCare', image: require('../../assets/kareebu-plus/services-3d/home-care.png') },
  ],
  [
    { label: 'For Good', screen: 'donations', image: require('../../assets/kareebu-plus/services-3d/for-good.png') },
    { label: 'Go Out', screen: 'dineOut', image: require('../../assets/kareebu-plus/services-3d/go-out.png') },
  ],
  [
    { label: 'Electronics', screen: 'electronics', image: require('../../assets/kareebu-plus/services-3d/electronics.png') },
    { label: 'Healthcare', screen: 'shops', image: require('../../assets/kareebu-plus/services-3d/healthcare.png') },
  ],
];

export function KareebuServiceCarousel({
  onOpen,
}: {
  onOpen: (label: string, screen: any) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      style={styles.bleed}
      contentContainerStyle={styles.rail}
      keyboardShouldPersistTaps="handled"
    >
      {serviceColumns.map((column, columnIndex) => (
        <View key={`service-column-${columnIndex}`} style={styles.column}>
          {column.map((item) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => onOpen(item.label, item.screen)}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <View style={styles.artWrap}>
                <Image source={item.image} style={styles.art} resizeMode="contain" />
              </View>
              <Text numberOfLines={2} style={styles.label}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -14,
  },
  rail: {
    paddingLeft: 14,
    paddingRight: 28,
    gap: 6,
  },
  column: {
    width: 76,
    gap: 8,
  },
  tile: {
    width: 76,
    height: 92,
    borderRadius: 13,
    backgroundColor: '#FFFDF8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 6,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.68,
    transform: [{ scale: 0.98 }],
  },
  artWrap: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    width: 56,
    height: 56,
  },
  label: {
    minHeight: 24,
    marginTop: 0,
    paddingHorizontal: 2,
    textAlign: 'center',
    color: '#202124',
    fontSize: 11.5,
    lineHeight: 14,
    fontWeight: '700',
  },
});
