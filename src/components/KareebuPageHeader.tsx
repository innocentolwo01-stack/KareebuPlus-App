import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, CONTROL, LAYOUT, RADIUS, SHADOW, TYPE } from '../theme';
import { useAppNavigation, useRegisterBackControl } from '../navigation/AppNavigation';
import type { SearchContext } from '../search/context';
import { KareebuSearchField } from './KareebuSearchField';

export type KareebuPageHeaderVariant = 'root' | 'service' | 'vertical' | 'detail' | 'transaction' | 'map' | 'restaurant';

type Props = {
  title: string;
  country?: string;
  city?: string;
  locationLabel?: string;
  locationEnabled?: boolean;
  searchEnabled?: boolean;
  searchContext?: SearchContext;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  backEnabled?: boolean;
  onBack?: () => void;
  rootIcon?: keyof typeof Ionicons.glyphMap;
  onRootAction?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightAction?: () => void;
  rightLabel?: string;
  rightContent?: React.ReactNode;
  onLocationPress?: () => void;
  onSearchPress?: () => void;
  variant?: KareebuPageHeaderVariant;
};

export function KareebuPageHeader({
  title,
  country,
  city,
  locationLabel,
  locationEnabled = true,
  searchEnabled = false,
  searchContext,
  searchPlaceholder = 'Search Kareebu',
  searchValue,
  onSearchChange,
  backEnabled,
  onBack,
  rootIcon = 'apps-outline',
  onRootAction,
  rightIcon,
  onRightAction,
  rightLabel,
  rightContent,
  onLocationPress,
  onSearchPress,
  variant = 'service',
}: Props) {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const shouldShowBack = backEnabled ?? variant !== 'root';
  const resolvedBack = shouldShowBack
    ? onBack ?? (navigation?.canGoBack ? navigation.goBack : undefined)
    : undefined;
  const topInset = Math.max(insets.top, StatusBar.currentHeight ?? 0);

  useRegisterBackControl(Boolean(resolvedBack));

  const location = city && country ? `${city}, ${country}` : city ?? country;
  const showLocation = locationEnabled && Boolean(location);
  const showInteractiveSearch = searchEnabled && Boolean(onSearchChange);
  const resolvedSearchPlaceholder = searchContext?.placeholder ?? searchPlaceholder;

  return (
    <View style={[styles.shell, { marginTop: -topInset, paddingTop: topInset }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.yellow} />
      <View style={styles.topRow}>
        <View style={styles.controlSlot}>
          {resolvedBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={resolvedBack}
              style={({ pressed }) => [styles.control, pressed && styles.pressed]}
            >
              <Feather name="arrow-left" size={22} color={COLORS.black} />
            </Pressable>
          ) : variant === 'root' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open account"
              disabled={!onRootAction}
              onPress={onRootAction}
              style={({ pressed }) => [styles.control, pressed && styles.pressed]}
            >
              <Ionicons name={rootIcon} size={23} color={COLORS.black} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.titleBlock}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={styles.title}>{title}</Text>
          {showLocation ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${locationLabel ?? title}, ${location}`}
              disabled={!onLocationPress}
              onPress={onLocationPress}
              style={({ pressed }) => [styles.location, pressed && styles.inlinePressed]}
            >
              <Ionicons name="location" size={19} color={COLORS.black} />
              <Text numberOfLines={1} style={styles.locationText}>{location}</Text>
              <Feather name="chevron-down" size={18} color={COLORS.black} />
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.controlSlot, Boolean(rightContent) && styles.multiControlSlot]}>
          {rightContent ? <View style={[styles.control, styles.multiControl]}>{rightContent}</View> : rightIcon ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={rightLabel ?? 'Page action'}
              onPress={onRightAction}
              style={({ pressed }) => [styles.control, pressed && styles.pressed]}
            >
              <Ionicons name={rightIcon} size={23} color={COLORS.black} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {searchEnabled ? (
        <View style={styles.searchWrap}>
          <KareebuSearchField
            context={searchContext ?? { scope: 'global', placeholder: resolvedSearchPlaceholder }}
            value={searchValue}
            onChangeText={showInteractiveSearch ? onSearchChange : undefined}
            onPress={onSearchPress}
          />
        </View>
      ) : null}

      <View style={styles.canvasTransition} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: LAYOUT.pageHeaderGutter,
    paddingBottom: 0,
  },
  topRow: {
    minHeight: CONTROL.pageHeaderAction,
    flexDirection: 'row',
    alignItems: 'center',
    gap: LAYOUT.pageHeaderGap,
    paddingTop: 8,
  },
  controlSlot: {
    width: CONTROL.pageHeaderAction,
    height: CONTROL.pageHeaderAction,
  },
  control: {
    width: CONTROL.pageHeaderAction,
    height: CONTROL.pageHeaderAction,
    borderRadius: RADIUS.pageHeaderControl,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  multiControlSlot: { width: 76 },
  multiControl: { width: 76, paddingHorizontal: 8 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  inlinePressed: { opacity: 0.62 },
  titleBlock: { flex: 1, minWidth: 0, justifyContent: 'center' },
  title: { ...TYPE.screenTitle, color: COLORS.black },
  location: { minHeight: 30, flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3 },
  locationText: { ...TYPE.bodyStrong, color: COLORS.black, flexShrink: 1 },
  searchWrap: {
    marginTop: 12,
  },
  canvasTransition: {
    height: 20,
    marginTop: 12,
    marginHorizontal: -LAYOUT.pageHeaderGutter,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.pageCanvas,
    borderTopRightRadius: RADIUS.pageCanvas,
  },
});
