import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

type GroceryPick = {
  id: string;
  productId: string;
  title: string;
  weight: string;
  discount: string;
  price: string;
  priceNote: string;
  image: ImageSourcePropType;
};

const GROCERY_PICKS: GroceryPick[] = [
  {
    id: 'bananas',
    productId: 'bananas',
    title: 'Bananas',
    weight: '400–500 g',
    discount: 'Discover',
    price: 'UGX 4,900',
    priceNote: 'Price confirmed before checkout',
    image: require('../../assets/kareebu-plus/top-picks/bananas.png'),
  },
  {
    id: 'cucumber',
    productId: 'cucumber',
    title: 'Cucumber',
    weight: '400–500 g',
    discount: 'Discover',
    price: 'UGX 5,900',
    priceNote: 'Price confirmed before checkout',
    image: require('../../assets/kareebu-plus/top-picks/cucumber.png'),
  },
  {
    id: 'tomatoes',
    productId: 'tomatoes',
    title: 'Tomato Round',
    weight: '500 g',
    discount: 'Discover',
    price: 'UGX 3,700',
    priceNote: 'Price confirmed before checkout',
    image: require('../../assets/kareebu-plus/top-picks/tomatoes.png'),
  },
];

const GAP = 10;
const SIDE_PADDING = 16;

export function KareebuTopPicks({
  onOpenProduct,
}: {
  onOpenProduct: (productId: string) => void;
}) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  // Careem-like proportions: about 2.25 product cards visible.
  const cardWidth = useMemo(() => {
    const usable = Math.max(320, width);
    return Math.round(
      Math.min(
        174,
        Math.max(
          146,
          (usable - SIDE_PADDING * 2 - GAP * 1.3) / 2.28,
        ),
      ),
    );
  }, [width]);

  const snapInterval = cardWidth + GAP;

  const onMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const x = event.nativeEvent.contentOffset.x;
    const next = Math.max(
      0,
      Math.min(
        GROCERY_PICKS.length - 1,
        Math.round(x / snapInterval),
      ),
    );
    setActiveIndex(next);
  };

  const renderItem = ({ item }: { item: GroceryPick }) => (
    <Pressable
      onPress={() => onOpenProduct(item.productId)}
      style={({ pressed }) => [
        styles.productWrap,
        { width: cardWidth },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityHint="Opens this product's details"
      accessibilityLabel={`${item.title}, ${item.weight}, ${item.price}`}
    >
      <View style={[styles.productCard, { width: cardWidth }]}>
        <View style={styles.discountPill}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>

        <View style={styles.originPill}>
          <Text style={styles.originText}>UG</Text>
        </View>

        <Image
          source={item.image}
          resizeMode="contain"
          style={[styles.productImage, { width: cardWidth - 18 }]}
        />
      </View>

      <Text numberOfLines={1} style={styles.productTitle}>
        {item.title}
      </Text>
      <Text style={styles.weight}>{item.weight}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <Text numberOfLines={1} style={styles.priceNote}>{item.priceNote}</Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.heading}>Top picks for you</Text>
          <Text style={styles.subheading}>Order groceries in seconds</Text>
        </View>

        <Image
          source={require('../../assets/kareebu-plus/top-picks/hero-groceries.png')}
          resizeMode="contain"
          style={styles.hero}
        />
      </View>

      <FlatList
        data={GROCERY_PICKS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={styles.rail}
        snapToInterval={snapInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        overScrollMode="never"
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: snapInterval * index,
          index,
        })}
      />

      <View style={styles.dots}>
        {GROCERY_PICKS.map((item, index) => (
          <View
            key={`dot-${item.id}`}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    marginHorizontal: -14,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFF4BF',
    overflow: 'hidden',
  },
  headingRow: {
    minHeight: 86,
    paddingLeft: 14,
    paddingRight: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headingCopy: {
    paddingTop: 4,
    zIndex: 2,
  },
  heading: {
    color: '#171717',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subheading: {
    marginTop: 4,
    color: '#73777F',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
  },
  hero: {
    position: 'absolute',
    width: 118,
    height: 104,
    right: -10,
    top: -12,
    opacity: 0.98,
  },
  rail: {
    paddingLeft: SIDE_PADDING,
    paddingRight: 30,
  },
  productWrap: {
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  productCard: {
    height: 146,
    borderRadius: 14,
    backgroundColor: '#FFFDFB',
    overflow: 'hidden',
  },
  discountPill: {
    position: 'absolute',
    left: 10,
    top: 10,
    zIndex: 3,
    paddingHorizontal: 9,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2556D',
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  originPill: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 3,
    width: 34,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8E9E8',
  },
  originText: {
    color: '#11945D',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  productImage: {
    position: 'absolute',
    left: 9,
    bottom: 4,
    height: 112,
  },
  productTitle: {
    marginTop: 9,
    paddingHorizontal: 8,
    color: '#282A2D',
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '600',
  },
  weight: {
    paddingHorizontal: 8,
    color: '#34373A',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
  },
  priceRow: {
    marginTop: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    color: '#F2556D',
    fontSize: 16.5,
    lineHeight: 21,
    fontWeight: '800',
  },
  priceNote: {
    marginTop: 5,
    paddingHorizontal: 8,
    color: '#006E59',
    fontSize: 12.5,
    lineHeight: 16,
    fontWeight: '800',
  },
  dots: {
    marginTop: 13,
    height: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(7,59,50,0.20)',
  },
  dotActive: {
    width: 16,
    backgroundColor: '#171717',
  },
});
