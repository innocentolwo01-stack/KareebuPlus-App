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

type LargeOffer = {
  id: string;
  partner: string;
  headline: string;
  subcopy?: string;
  image: ImageSourcePropType;
  discount?: string;
};

type SmallOffer = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

const LARGE_OFFERS: LargeOffer[] = [
  {
    id: 'kitchen',
    partner: 'HOME & KITCHEN',
    headline: 'All your kitchen needs.',
    subcopy: 'Now on Kareebu Shops.',
    image: require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg'),
  },
  {
    id: 'toys',
    partner: 'KIDS & TOYS',
    headline: 'Toys and family favourites.',
    image: require('../../assets/kareebu-plus/top-offers/offer-toys.jpg'),
    discount: 'Discover',
  },
  {
    id: 'wellness',
    partner: 'HEALTH & WELLNESS',
    headline: 'Everyday wellness.\nBrowse essentials.',
    image: require('../../assets/kareebu-plus/top-offers/offer-wellness.jpg'),
    discount: 'Discover',
  },
];

const SMALL_OFFERS: SmallOffer[] = [
  {
    id: 'essentials',
    title: 'Essentials',
    image: require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
  },
  {
    id: 'flowers',
    title: 'Flowers &\ngifting',
    image: require('../../assets/kareebu-plus/top-offers/category-flowers.jpg'),
  },
  {
    id: 'vitamins',
    title: 'Vitamins and\nSupplements',
    image: require('../../assets/kareebu-plus/top-offers/category-vitamins.jpg'),
  },
];

export function KareebuTopOffers({
  onOpenOffer,
}: {
  onOpenOffer: (offerId: string) => void;
}) {
  const { width } = useWindowDimensions();

  const largeWidth = useMemo(
    () => Math.round(Math.min(188, Math.max(166, width * 0.435))),
    [width],
  );

  const smallWidth = useMemo(
    () => Math.round(Math.min(126, Math.max(108, width * 0.296))),
    [width],
  );

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Top offers</Text>

      <FlatList
        horizontal
        data={LARGE_OFFERS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.largeRail}
        ItemSeparatorComponent={() => <View style={styles.largeGap} />}
        decelerationRate="fast"
        snapToInterval={largeWidth + 8}
        disableIntervalMomentum
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenOffer(item.id)}
            style={({ pressed }) => [
              styles.largeCard,
              { width: largeWidth, height: largeWidth * 1.245 },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${item.partner}. ${item.headline.replace('\n', ' ')}`}
          >
            <View style={styles.brandRow}>
              <View style={styles.kareebuMark}>
                <Text style={styles.kareebuK}>K</Text>
              </View>
              <Text style={styles.shopsText}>Shops</Text>
              <View style={styles.brandDivider} />
              <Text numberOfLines={1} style={styles.partnerText}>
                {item.partner}
              </Text>
            </View>

            <View style={styles.ticketDivider}>
              <View style={styles.dash} />
              <View style={[styles.notch, styles.notchLeft]} />
              <View style={[styles.notch, styles.notchRight]} />
            </View>

            <View style={styles.offerCopy}>
              <Text style={styles.offerHeadline}>{item.headline}</Text>
              {item.subcopy ? (
                <Text style={styles.offerSubcopy}>{item.subcopy}</Text>
              ) : null}
            </View>

            <View style={styles.largeImageWrap}>
              <Image
                source={item.image}
                resizeMode="cover"
                style={styles.largeImage}
              />

              {item.discount ? (
                <View style={styles.discountBubble}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        )}
      />

      <FlatList
        horizontal
        data={SMALL_OFFERS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.smallRail}
        ItemSeparatorComponent={() => <View style={styles.smallGap} />}
        decelerationRate="fast"
        snapToInterval={smallWidth + 8}
        disableIntervalMomentum
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpenOffer(item.id)}
            style={({ pressed }) => [
              styles.smallCard,
              {
                width: smallWidth,
                height: smallWidth * 0.93,
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={item.title.replace('\n', ' ')}
          >
            <Text style={styles.smallTitle}>{item.title}</Text>

            <Image
              source={item.image}
              resizeMode="cover"
              style={styles.smallImage}
            />
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
  heading: {
    marginLeft: 14,
    marginBottom: 9,
    color: '#2A2C2E',
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },

  largeRail: {
    paddingLeft: 14,
    paddingRight: 28,
  },
  largeGap: {
    width: 8,
  },
  largeCard: {
    flexShrink: 0,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#FFF4BF',
  },

  brandRow: {
    height: 40,
    paddingHorizontal: 13,
    paddingTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  kareebuMark: {
    width: 25,
    height: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
  },
  kareebuK: {
    color: '#FFC928',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
  },
  shopsText: {
    marginLeft: 6,
    color: '#171717',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  brandDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 7,
    backgroundColor: 'rgba(23,23,23,0.18)',
  },
  partnerText: {
    flex: 1,
    color: '#171717',
    fontSize: 9.5,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.1,
  },

  ticketDivider: {
    height: 14,
    justifyContent: 'center',
    overflow: 'visible',
  },
  dash: {
    marginHorizontal: 12,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: 'rgba(255,255,255,0.98)',
  },
  notch: {
    position: 'absolute',
    width: 14,
    height: 14,
    top: 0,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  notchLeft: {
    left: -7,
  },
  notchRight: {
    right: -7,
  },

  offerCopy: {
    minHeight: 52,
    paddingHorizontal: 11,
    paddingTop: 4,
    alignItems: 'center',
  },
  offerHeadline: {
    color: '#073D35',
    textAlign: 'center',
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '600',
  },
  offerSubcopy: {
    marginTop: 3,
    color: '#29574F',
    textAlign: 'center',
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '500',
  },

  largeImageWrap: {
    flex: 1,
    overflow: 'hidden',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  discountBubble: {
    position: 'absolute',
    right: 12,
    top: 12,
    minWidth: 58,
    height: 34,
    paddingHorizontal: 8,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22DCA4',
  },
  discountText: {
    color: '#073D35',
    fontSize: 12.5,
    fontWeight: '900',
  },

  smallRail: {
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 28,
  },
  smallGap: {
    width: 8,
  },
  smallCard: {
    flexShrink: 0,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#FFF4BF',
  },
  smallTitle: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 7,
    right: 7,
    color: '#171717',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '600',
  },
  smallImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '68%',
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },
});
