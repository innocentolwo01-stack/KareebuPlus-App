import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTab, Screen } from './types';
import { COLORS, CONTROL, FONT, LAYOUT, RADIUS, SHADOW, TYPE } from './theme';
import { assets } from './assets';
import { useAppNavigation, useRegisterBackControl } from './navigation/AppNavigation';

export function ScreenShell({
  children,
  dark = false,
  scroll = false,
  contentStyle,
}: {
  children: React.ReactNode;
  dark?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  // React Native 0.86/Android 15 can run edge-to-edge even when an app did
  // not explicitly opt into it. Do not rely on the legacy SafeAreaView on
  // Android: reserve the status/navigation zones ourselves so headers and
  // bottom actions never sit underneath the system bars. iOS continues to use
  // the platform SafeAreaView.
  if (Platform.OS === 'android') {
    return (
      <View style={[styles.safe, styles.safeAndroid, dark && styles.safeDark]}>
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={dark ? COLORS.black : COLORS.white} />
        {body}
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, dark && styles.safeDark]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      {body}
    </SafeAreaView>
  );
}

export function Header({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const navigation = useAppNavigation();
  const resolvedBack = onBack ?? (navigation?.canGoBack ? navigation.goBack : undefined);
  useRegisterBackControl(Boolean(resolvedBack));
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {resolvedBack ? (
          <Pressable onPress={resolvedBack} hitSlop={12} style={styles.headerIconButton}>
            <Feather name="arrow-left" size={24} color={COLORS.black} />
          </Pressable>
        ) : null}
      </View>
      {title ? <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.headerTitle}>{title}</Text> : <View />}
      <View style={[styles.headerSide, styles.headerSideRight]}>{right}</View>
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  compact,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primaryButton,
        compact && styles.primaryButtonCompact,
        disabled && styles.primaryButtonDisabled,
        pressed && !disabled && styles.primaryButtonPressed,
      ]}
    >
      <Text style={[styles.primaryButtonText, compact && styles.primaryButtonTextCompact]}>{label}</Text>
    </Pressable>
  );
}

export function TextButton({ label, onPress, color = COLORS.black }: { label: string; onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => [styles.textButton, pressed && { opacity: 0.55 }]}>
      <Text style={[styles.textButtonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function AppField({
  label,
  left,
  right,
  style,
  ...props
}: TextInputProps & {
  label?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.fieldShell, style]}>
        {left ? <View style={styles.fieldLeft}>{left}</View> : null}
        <TextInput
          {...props}
          placeholderTextColor={COLORS.mutedLight}
          style={[styles.fieldInput, left ? styles.fieldInputWithLeft : undefined]}
        />
        {right ? <View style={styles.fieldRight}>{right}</View> : null}
      </View>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <Text numberOfLines={2} style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? <TextButton label={action} onPress={onAction} color={COLORS.red} /> : null}
    </View>
  );
}

export function RoundedCard({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}


export type BrandIconSemantic =
  | keyof typeof assets.service
  | 'account';

function semanticForIcon(icon?: string): BrandIconSemantic {
  const value = String(icon ?? '').toLowerCase();
  if (/(car|navigate|map|location|pin)/.test(value)) return 'rides';
  if (/(bicycle|bike|motorcycle)/.test(value)) return 'boda';
  if (/(restaurant|pizza|fast-food|cafe|coffee)/.test(value)) return 'food';
  if (/(medical|medkit|pulse|fitness)/.test(value)) return 'pharmacies';
  if (/(battery|headset|phone|flash|volume|hardware)/.test(value)) return 'electronics';
  if (/(basket|nutrition|leaf|water)/.test(value)) return 'groceries';
  if (/(card|wallet|cash|receipt|qr|document)/.test(value)) return 'pay';
  if (/(construct|hammer|build|tool)/.test(value)) return 'fix';
  if (/(heart|gift|people)/.test(value)) return 'forGood';
  if (/(calendar|ticket|compass|earth|globe)/.test(value)) return 'goOut';
  if (/(home|bed|key)/.test(value)) return 'homeCare';
  if (/(cube|package|send|paper-plane|time)/.test(value)) return 'send';
  if (/(person|account)/.test(value)) return 'account';
  if (/(bag|store|shop|sparkles|paw|eye)/.test(value)) return 'shops';
  return 'all';
}

export function BrandIcon({
  icon,
  semantic,
  size = 34,
  tile = false,
  active = false,
}: {
  icon?: string;
  semantic?: BrandIconSemantic;
  size?: number;
  tile?: boolean;
  active?: boolean;
}) {
  const resolved = semantic ?? semanticForIcon(icon);
  const source = resolved === 'account' ? assets.avatars.account : assets.service[resolved];
  const image = (
    <Image
      source={source}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
  if (!tile) return image;
  return (
    <View style={[styles.brandIconTile, active && styles.brandIconTileActive]}>
      {image}
    </View>
  );
}

export function ServiceTile({
  label,
  image,
  onPress,
}: {
  label: string;
  image: ImageSourcePropType;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.serviceTile, pressed && styles.pressed]}>
      <Image source={image} style={styles.serviceIcon} resizeMode="contain" />
      <Text numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.84} style={styles.serviceLabel}>{label}</Text>
    </Pressable>
  );
}

const tabConfig: Record<BottomTab, { label: string; icon: keyof typeof Ionicons.glyphMap; semantic: BrandIconSemantic; screen: Screen }> = {
  home: { label: 'Home', icon: 'home-outline', semantic: 'all', screen: 'home' },
  explore: { label: 'Explore', icon: 'compass-outline', semantic: 'goOut', screen: 'exploreHub' },
  activity: { label: 'Activity', icon: 'time-outline', semantic: 'send', screen: 'activity' },
  wallet: { label: 'Wallet', icon: 'wallet-outline', semantic: 'pay', screen: 'wallet' },
  account: { label: 'Account', icon: 'person-outline', semantic: 'account', screen: 'account' },
};

export function BottomNav({ active, go, persistent = false }: { active: BottomTab; go: (screen: Screen) => void; persistent?: boolean }) {
  // V6.18: screen-local BottomNav instances are suppressed because the
  // app root now owns one navigation bar for every customer route.
  if (!persistent) return null;
  return (
    <View style={styles.bottomNav}>
      {(Object.keys(tabConfig) as BottomTab[]).map((key) => {
        const item = tabConfig[key];
        const selected = active === key;
        return (
          <Pressable key={key} onPress={() => go(item.screen)} style={({ pressed }) => [styles.bottomNavItem, pressed && styles.bottomNavItemPressed]}>
            <View style={[styles.bottomNavIconBubble, selected && styles.bottomNavIconBubbleActive]}>
              <BrandIcon semantic={item.semantic} size={selected ? 28 : 25} active={selected} />
            </View>
            <Text style={[styles.bottomNavLabel, selected && styles.bottomNavLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function LocationDot({ color = COLORS.green }: { color?: string }) {
  return <View style={[styles.locationDotOuter, { backgroundColor: color }]}><View style={styles.locationDotInner} /></View>;
}

export function PaymentLogo({ source }: { source: ImageSourcePropType }) {
  return <Image source={source} style={styles.paymentLogo} resizeMode="contain" />;
}

export function MenuRow({ icon, label, detail, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; detail?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
      <BrandIcon icon={icon} size={30} tile />
      <Text style={styles.menuLabel}>{label}</Text>
      {detail ? <Text style={styles.menuDetail}>{detail}</Text> : null}
      <Feather name="chevron-right" size={22} color={COLORS.muted} />
    </Pressable>
  );
}

export function TrustNote({ icon, title, body }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.trustNote}>
      <View style={styles.trustIcon}><MaterialCommunityIcons name={icon} size={22} color={COLORS.black} /></View>
      <View style={styles.flex}>
        <Text style={styles.trustTitle}>{title}</Text>
        <Text style={styles.trustBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  safeAndroid: { paddingTop: Math.max(StatusBar.currentHeight ?? 24, 24) + 4, paddingBottom: 24 },
  safeDark: { backgroundColor: COLORS.black },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: LAYOUT.screenGutter },
  headerSide: { width: 46, minHeight: 40, justifyContent: 'center' },
  headerSideRight: { alignItems: 'flex-end' },
  headerIconButton: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...TYPE.navTitle, color: COLORS.black },
  primaryButton: { height: CONTROL.button, borderRadius: RADIUS.md, backgroundColor: COLORS.yellow, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  primaryButtonCompact: { height: 44, borderRadius: RADIUS.md },
  primaryButtonPressed: { backgroundColor: COLORS.yellowDeep, transform: [{ scale: 0.995 }] },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { ...TYPE.button, color: COLORS.black },
  primaryButtonTextCompact: { fontSize: TYPE.button.fontSize },
  textButton: { minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  textButtonText: { ...TYPE.action },
  fieldGroup: { gap: 6 },
  fieldLabel: { ...TYPE.small, fontFamily: FONT.medium, fontWeight: '700', color: COLORS.black },
  fieldShell: { minHeight: CONTROL.field, borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.md, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  fieldInput: { flex: 1, minHeight: CONTROL.field - 2, paddingHorizontal: LAYOUT.screenGutter, color: COLORS.black, ...TYPE.bodyStrong },
  fieldInputWithLeft: { paddingLeft: 8 },
  fieldLeft: { marginLeft: 14 },
  fieldRight: { marginRight: 14 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 28, marginBottom: 7 },
  sectionTitle: { ...TYPE.sectionTitle, color: COLORS.black },
  card: { borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, overflow: 'hidden', ...SHADOW },
  serviceTile: { width: '23.2%', minHeight: 78, borderWidth: 1, borderColor: COLORS.line, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 5, paddingVertical: 8, ...SHADOW },
  serviceIcon: { width: 46, height: 46 },
  serviceLabel: { minHeight: 26, textAlign: 'center', ...TYPE.small, fontFamily: FONT.medium, fontWeight: '700', color: COLORS.black },
  brandIconTile: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brandIconTileActive: { borderColor: COLORS.yellow, backgroundColor: COLORS.yellowSoft },
  pressed: { opacity: 0.62 },
  bottomNav: { minHeight: Platform.OS === 'android' ? 64 : 62, paddingTop: 4, paddingBottom: 4, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  bottomNavItem: { flex: 1, minHeight: Platform.OS === 'android' ? 52 : 50, alignItems: 'center', justifyContent: 'center', gap: 3 },
  bottomNavItemPressed: { opacity: 0.62 },
  bottomNavIconBubble: { width: 40, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  bottomNavIconBubbleActive: { backgroundColor: COLORS.yellowSoft },
  bottomNavLabel: { ...TYPE.label, fontSize: 10.5, lineHeight: 13, fontFamily: FONT.regular, fontWeight: '500', color: COLORS.muted },
  bottomNavLabelActive: { color: COLORS.black, fontFamily: FONT.bold, fontWeight: '900' },
  locationDotOuter: { width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  locationDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.white },
  paymentLogo: { width: 36, height: 36, borderRadius: 9 },
  menuRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  menuIconTile: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, ...TYPE.bodyStrong, color: COLORS.black },
  menuDetail: { color: COLORS.muted, ...TYPE.small },
  trustNote: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustIcon: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface },
  trustTitle: { ...TYPE.cardTitle, color: COLORS.black },
  trustBody: { ...TYPE.small, color: COLORS.muted, marginTop: 2 },
});
