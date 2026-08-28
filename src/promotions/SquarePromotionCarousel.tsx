import React, { memo, useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import type { KareebuBannerAsset } from './promotionalContentRegistry';
import { COLORS, RADIUS, SHADOW, SPACE } from '../theme';

type SquarePromotionCarouselProps = {
  assets: readonly KareebuBannerAsset[];
  onPress: (asset: KareebuBannerAsset) => void;
};

export const SquarePromotionCarousel = memo(function SquarePromotionCarousel({
  assets,
  onPress,
}: SquarePromotionCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = useMemo(
    () => Math.round(Math.min(188, Math.max(152, width * 0.44))),
    [width],
  );

  if (!assets.length) return null;

  return (
    <View accessibilityRole="adjustable" accessibilityLabel="Promotional cards">
      <FlatList
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        data={assets}
        keyExtractor={asset => asset.id}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
        snapToInterval={cardWidth + SPACE.md}
        disableIntervalMomentum
        removeClippedSubviews={false}
        contentContainerStyle={styles.rail}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.accessibilityLabel}
            accessibilityHint={`Opens ${item.destination.categoryId ?? item.title}`}
            onPress={() => onPress(item)}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth },
              pressed && styles.pressed,
            ]}
          >
            <Image
              accessibilityIgnoresInvertColors
              source={item.source}
              resizeMode="contain"
              style={styles.image}
            />
          </Pressable>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  rail: {
    gap: SPACE.md,
    paddingRight: 44,
    paddingBottom: 4,
  },
  card: {
    aspectRatio: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
});
