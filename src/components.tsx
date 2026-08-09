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
import { COLORS, FONT, SHADOW, TYPE } from './theme';

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
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.headerIconButton}>
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

const tabConfig: Record<BottomTab, { label: string; icon: keyof typeof Ionicons.glyphMap; screen: Screen }> = {
  home: { label: 'Home', icon: 'home-outline', screen: 'home' },
  explore: { label: 'Explore', icon: 'grid-outline', screen: 'services' },
  activity: { label: 'Activity', icon: 'time-outline', screen: 'activity' },
  wallet: { label: 'Wallet', icon: 'wallet-outline', screen: 'wallet' },
  account: { label: 'Account', icon: 'person-outline', screen: 'account' },
};

export function BottomNav({ active, go }: { active: BottomTab; go: (screen: Screen) => void }) {
  return (
    <View style={styles.bottomNav}>
      {(Object.keys(tabConfig) as BottomTab[]).map((key) => {
        const item = tabConfig[key];
        const selected = active === key;
        return (
          <Pressable key={key} onPress={() => go(item.screen)} style={({ pressed }) => [styles.bottomNavItem, pressed && styles.bottomNavItemPressed]}>
            <View style={[styles.bottomNavIconBubble, selected && styles.bottomNavIconBubbleActive]}>
              <Ionicons name={selected ? String(item.icon).replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={selected ? COLORS.white : COLORS.muted} />
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
      <View style={styles.menuIconTile}><Ionicons name={icon} size={23} color={COLORS.black} /></View>
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
  safeAndroid: { paddingTop: Math.max(StatusBar.currentHeight ?? 24, 24) + 12, paddingBottom: 24 },
  safeDark: { backgroundColor: COLORS.black },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  headerSide: { width: 54, minHeight: 44, justifyContent: 'center' },
  headerSideRight: { alignItems: 'flex-end' },
  headerIconButton: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { ...TYPE.navTitle, color: COLORS.black },
  primaryButton: { height: 54, borderRadius: 17, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primaryButtonCompact: { height: 50, borderRadius: 15 },
  primaryButtonPressed: { backgroundColor: COLORS.redDark, transform: [{ scale: 0.995 }] },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { ...TYPE.button, color: COLORS.white },
  primaryButtonTextCompact: { fontSize: TYPE.button.fontSize },
  textButton: { minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  textButtonText: { ...TYPE.action },
  fieldGroup: { gap: 8 },
  fieldLabel: { ...TYPE.small, fontFamily: FONT.medium, fontWeight: '700', color: COLORS.black },
  fieldShell: { minHeight: 58, borderWidth: 1.2, borderColor: COLORS.line, borderRadius: 17, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  fieldInput: { flex: 1, minHeight: 56, paddingHorizontal: 17, color: COLORS.black, ...TYPE.bodyStrong },
  fieldInputWithLeft: { paddingLeft: 8 },
  fieldLeft: { marginLeft: 14 },
  fieldRight: { marginRight: 14 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 32, marginBottom: 10 },
  sectionTitle: { ...TYPE.sectionTitle, color: COLORS.black },
  card: { borderRadius: 18, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, overflow: 'hidden', ...SHADOW },
  serviceTile: { width: '23.2%', minHeight: 96, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', gap: 5, paddingHorizontal: 5, paddingVertical: 10, ...SHADOW },
  serviceIcon: { width: 54, height: 54 },
  serviceLabel: { minHeight: 30, textAlign: 'center', ...TYPE.small, fontFamily: FONT.medium, fontWeight: '700', color: COLORS.black },
  pressed: { opacity: 0.62 },
  bottomNav: { minHeight: Platform.OS === 'android' ? 72 : 68, paddingTop: 7, paddingBottom: 5, borderTopWidth: 1, borderTopColor: COLORS.line, backgroundColor: COLORS.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  bottomNavItem: { flex: 1, minHeight: Platform.OS === 'android' ? 58 : 54, alignItems: 'center', justifyContent: 'center', gap: 3 },
  bottomNavItemPressed: { opacity: 0.62 },
  bottomNavIconBubble: { width: 38, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  bottomNavIconBubbleActive: { backgroundColor: COLORS.black },
  bottomNavLabel: { ...TYPE.label, fontSize: 10.5, lineHeight: 13, fontFamily: FONT.regular, fontWeight: '500', color: COLORS.muted },
  bottomNavLabelActive: { color: COLORS.black, fontFamily: FONT.bold, fontWeight: '900' },
  locationDotOuter: { width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  locationDotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.white },
  paymentLogo: { width: 36, height: 36, borderRadius: 9 },
  menuRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  menuIconTile: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, ...TYPE.bodyStrong, color: COLORS.black },
  menuDetail: { color: COLORS.muted, ...TYPE.small },
  trustNote: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  trustIcon: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface },
  trustTitle: { ...TYPE.cardTitle, color: COLORS.black },
  trustBody: { ...TYPE.small, color: COLORS.muted, marginTop: 2 },
});
