import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { assets } from '../assets';
import { COLORS, FONT, RADIUS, SPACE } from '../theme';

function logoFor(name: string) {
  const key = name.toLowerCase();
  if (key.includes('carrefour')) return assets.homeBrands.carrefour;
  if (key.includes('goodlife')) return assets.homeBrands.goodlife;
  if (key.includes('jumia')) return assets.homeBrands.jumia;
  return undefined;
}

function identityFor(name: string) {
  const key = name.toLowerCase();
  if (key.includes('capital shopper')) return { label: 'CAPITAL\nSHOPPERS', background: '#FFFFFF', foreground: '#087A3E', icon: 'cart-outline' as const };
  if (key.includes('quality supermarket')) return { label: 'QUALITY', background: '#FFFFFF', foreground: '#C71F2D', icon: 'basket-outline' as const };
  if (key === 'naivas' || key.includes('naivas')) return { label: 'Naivas', background: '#FFFFFF', foreground: '#E31B23', icon: 'leaf-outline' as const };
  if (key.includes('quickmart')) return { label: 'Quickmart', background: '#FFFFFF', foreground: '#F7941D', icon: 'flash-outline' as const };
  if (key.includes('shoppers supermarket')) return { label: 'SHOPPERS', background: '#FFFFFF', foreground: '#C5242A', icon: 'cart-outline' as const };
  if (key.includes('village supermarket')) return { label: 'Village', background: '#FFFFFF', foreground: '#2E6F45', icon: 'basket-outline' as const };
  if (key.includes('breeze pharmacy')) return { label: 'Breeze\nPHARMACY', background: '#FFFFFF', foreground: '#1B83C5', icon: 'medical-outline' as const };
  if (key.includes('gentleman')) return { label: "GENTLEMAN'S\nPHARMACY", background: '#FFFFFF', foreground: '#173F36', icon: 'medical-outline' as const };
  if (key.includes('kareebu health')) return { label: 'KAREEBU\nHEALTH', background: '#FFF8D7', foreground: COLORS.black, icon: 'medical-outline' as const };
  if (key.includes('healthplus')) return { label: 'HealthPlus', background: '#F5FFF8', foreground: '#16804C', icon: 'medical-outline' as const };
  if (key.includes('sunlife')) return { label: 'Sunlife', background: '#FFF7E8', foreground: '#D87500', icon: 'medical-outline' as const };
  if (key.includes('tyros')) return { label: 'Tyros', background: '#F5F3FF', foreground: '#5B4BB7', icon: 'medical-outline' as const };
  if (key.includes('silver glow')) return { label: 'Silver Glow', background: '#F7F7F7', foreground: '#555555', icon: 'sparkles-outline' as const };
  if (key.includes('lifecare')) return { label: 'LifeCare', background: '#F0FAFF', foreground: '#147DA8', icon: 'medical-outline' as const };
  if (key.includes('rapid chemist')) return { label: 'Rapid\nChemist', background: '#FFF5F5', foreground: '#9C2525', icon: 'medical-outline' as const };
  if (key.includes('care plus')) return { label: 'Care Plus', background: '#F4FFF8', foreground: '#27844D', icon: 'medical-outline' as const };
  if (key.includes('mediq')) return { label: 'MediQ', background: '#F4F8FF', foreground: '#385EB7', icon: 'medical-outline' as const };
  if (key.includes('beauty basket')) return { label: 'BEAUTY\nBASKET', background: '#FFF0F5', foreground: '#9D315B', icon: 'sparkles-outline' as const };
  if (key.includes('techpoint')) return { label: 'TECHPOINT', background: '#F4F7FA', foreground: '#171717', icon: 'phone-portrait-outline' as const };
  if (key.includes('homehub')) return { label: 'HOMEHUB', background: '#FFF8EA', foreground: '#6D4A19', icon: 'home-outline' as const };
  if (key.includes('petcare')) return { label: 'PETCARE', background: '#F3FFF4', foreground: '#2F6F3E', icon: 'paw-outline' as const };
  if (key.includes('nutrition hub')) return { label: 'NUTRITION\nHUB', background: '#F5FFF9', foreground: '#24724C', icon: 'fitness-outline' as const };
  if (key.includes('vision') || key.includes('eye care')) return { label: 'VISION &\nEYE CARE', background: '#F4F8FF', foreground: '#225A9B', icon: 'eye-outline' as const };
  return { label: name, background: '#FFFFFF', foreground: COLORS.black, icon: 'storefront-outline' as const };
}

export const SellerLogo = memo(function SellerLogo({ name }: { name: string }) {
  const logo = logoFor(name);
  if (logo) {
    return (
      <View accessibilityLabel={`${name} logo`} style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
    );
  }

  const identity = identityFor(name);
  return (
    <View accessibilityLabel={`${name} logo`} style={[styles.container, { backgroundColor: identity.background }]}>
      <Ionicons name={identity.icon} size={18} color={identity.foreground} />
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
        style={[styles.wordmark, { color: identity.foreground }]}
      >
        {identity.label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: SPACE.xs,
    paddingVertical: SPACE.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  logo: { width: '92%', height: '82%' },
  wordmark: {
    width: '100%',
    textAlign: 'center',
    fontFamily: FONT.bold,
    fontSize: 10.5,
    lineHeight: 11.5,
    fontWeight: '900',
    letterSpacing: 0.15,
  },
});
