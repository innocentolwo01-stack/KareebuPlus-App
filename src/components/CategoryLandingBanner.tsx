import React, { memo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { CategoryBannerAsset } from '../assets/categoryBannerAssets';
import type { KareebuBannerAsset } from '../assets/kareebuBannerRegistry';
import { COLORS, RADIUS } from '../theme';

type CategoryLandingBannerProps = {
  banner: CategoryBannerAsset | KareebuBannerAsset;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export const CategoryLandingBanner = memo(function CategoryLandingBanner({
  banner,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: CategoryLandingBannerProps) {
  const aspectRatio = banner.aspectRatio || banner.width / banner.height;
  const artwork = (
    <Image
      accessibilityIgnoresInvertColors
      source={banner.source}
      resizeMode="contain"
      style={styles.image}
    />
  );

  if (!onPress) {
    return (
      <View
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel ?? banner.title}
        style={[styles.container, { aspectRatio }, style]}
      >
        {artwork}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? banner.title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { aspectRatio },
        style,
        pressed && styles.pressed,
      ]}
    >
      {artwork}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.84,
  },
});
