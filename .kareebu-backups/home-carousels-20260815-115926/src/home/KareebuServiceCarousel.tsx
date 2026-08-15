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
    { label: 'Rides', screen: 'mobilityHome', image: require('../../assets/kareebu-plus/service-carousel/rides.png') },
    { label: 'Pharmacies', screen: 'shops', image: require('../../assets/kareebu-plus/service-carousel/pharmacies.png') },
  ],
  [
    { label: 'Food', screen: 'food', image: require('../../assets/kareebu-plus/service-carousel/food.png') },
    { label: 'Shops', screen: 'shops', image: require('../../assets/kareebu-plus/service-carousel/shops.png') },
  ],
  [
    { label: 'Groceries', screen: 'shops', image: require('../../assets/kareebu-plus/service-carousel/groceries.png') },
    { label: 'Send', screen: 'parcel', image: require('../../assets/kareebu-plus/service-carousel/send.png') },
  ],
  [
    { label: 'Boda', screen: 'mobilityHome', image: require('../../assets/kareebu-plus/service-carousel/boda.png') },
    { label: 'More', screen: 'services', image: require('../../assets/kareebu-plus/service-carousel/more.png') },
  ],
  [
    { label: 'DineOut', screen: 'dineOut', image: require('../../assets/kareebu-plus/service-carousel/dineout.png') },
    { label: 'Pay', screen: 'wallet', image: require('../../assets/kareebu-plus/service-carousel/pay.png') },
  ],
  [
    { label: 'Fix', screen: 'fix', image: require('../../assets/kareebu-plus/service-carousel/fix.png') },
    { label: 'Home & Care', screen: 'homeCare', image: require('../../assets/kareebu-plus/service-carousel/home-care.png') },
  ],
  [
    { label: 'For Good', screen: 'forGood', image: require('../../assets/kareebu-plus/service-carousel/for-good.png') },
    { label: 'Go Out', screen: 'goOut', image: require('../../assets/kareebu-plus/service-carousel/go-out.png') },
  ],
  [
    { label: 'Electronics', screen: 'shops', image: require('../../assets/kareebu-plus/service-carousel/electronics.png') },
    { label: 'Healthcare', screen: 'healthcare', image: require('../../assets/kareebu-plus/service-carousel/healthcare.png') },
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
    marginHorizontal: -16,
  },
  rail: {
    paddingLeft: 16,
    paddingRight: 28,
    gap: 8,
  },
  column: {
    width: 86,
    gap: 12,
  },
  tile: {
    width: 86,
    height: 112,
    borderRadius: 15,
    backgroundColor: '#F4F6F5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.68,
    transform: [{ scale: 0.98 }],
  },
  artWrap: {
    width: 68,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    width: 66,
    height: 66,
  },
  label: {
    minHeight: 30,
    marginTop: 0,
    paddingHorizontal: 2,
    textAlign: 'center',
    color: '#202124',
    fontSize: 13.2,
    lineHeight: 15.5,
    fontWeight: '700',
  },
});
