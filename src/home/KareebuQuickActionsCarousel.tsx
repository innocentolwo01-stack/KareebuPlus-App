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

type QuickActionItem = {
  eyebrow: string;
  title: string;
  image: ImageSourcePropType;
  screen: string;
};

const quickActions: QuickActionItem[] = [
  {
    eyebrow: 'Balance',
    title: 'UGX 0',
    image: require('../../assets/kareebu-plus/quick-actions/balance.png'),
    screen: 'wallet',
  },
  {
    eyebrow: 'Kareebu+ Weekend',
    title: 'Exclusive grocery prices',
    image: require('../../assets/kareebu-plus/quick-actions/plus-weekend.png'),
    screen: 'shops',
  },
  {
    eyebrow: 'Add card',
    title: 'Set up payment',
    image: require('../../assets/kareebu-plus/quick-actions/add-card.png'),
    screen: 'wallet',
  },
  {
    eyebrow: 'Wallet',
    title: 'Add money',
    image: require('../../assets/kareebu-plus/quick-actions/wallet.png'),
    screen: 'wallet',
  },
  {
    eyebrow: 'Time to',
    title: 'Order a snack',
    image: require('../../assets/kareebu-plus/quick-actions/snack.png'),
    screen: 'food',
  },
];

export function KareebuQuickActionsCarousel({
  onOpen,
}: {
  onOpen: (label: string, screen: any) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={194}
      snapToAlignment="start"
      disableIntervalMomentum
      style={styles.bleed}
      contentContainerStyle={styles.rail}
      keyboardShouldPersistTaps="handled"
    >
      {quickActions.map((item) => (
        <Pressable
          key={`${item.eyebrow}-${item.title}`}
          onPress={() => onOpen(item.title, item.screen)}
          accessibilityRole="button"
          accessibilityLabel={`${item.eyebrow}, ${item.title}`}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <View style={styles.copy}>
            <Text numberOfLines={1} style={styles.eyebrow}>
              {item.eyebrow}
            </Text>
            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
          </View>

          <Image source={item.image} resizeMode="contain" style={styles.image} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -14,
    marginTop: 8,
  },
  rail: {
    paddingLeft: 14,
    paddingRight: 32,
    gap: 8,
  },
  card: {
    width: 162,
    height: 66,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E3E5E6',
    backgroundColor: '#FFFFFF',
    paddingLeft: 11,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#111111',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }],
  },
  copy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 5,
  },
  eyebrow: {
    color: '#73777C',
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '500',
  },
  title: {
    color: '#242528',
    marginTop: 1,
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '700',
  },
  image: {
    width: 42,
    height: 42,
    flexShrink: 0,
  },
});
