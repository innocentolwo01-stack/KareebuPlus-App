import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme';
import type { Screen } from '../types';

type AppNavigationContextValue = {
  screen: Screen;
  canGoBack: boolean;
  goBack: () => void;
  goHome: () => void;
  registeredBackControls: number;
  registerBackControl: () => () => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({
  screen,
  canGoBack,
  goBack,
  goHome,
  children,
}: {
  screen: Screen;
  canGoBack: boolean;
  goBack: () => void;
  goHome: () => void;
  children: React.ReactNode;
}) {
  const [registeredBackControls, setRegisteredBackControls] = useState(0);

  const registerBackControl = useCallback(() => {
    let active = true;
    setRegisteredBackControls((count) => count + 1);

    return () => {
      if (!active) return;
      active = false;
      setRegisteredBackControls((count) => Math.max(0, count - 1));
    };
  }, []);

  const value = useMemo<AppNavigationContextValue>(() => ({
    screen,
    canGoBack,
    goBack,
    goHome,
    registeredBackControls,
    registerBackControl,
  }), [screen, canGoBack, goBack, goHome, registeredBackControls, registerBackControl]);

  return (
    <AppNavigationContext.Provider value={value}>
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  return useContext(AppNavigationContext);
}

export function useRegisterBackControl(enabled = true) {
  const navigation = useAppNavigation();

  // Register before paint so the universal fallback never briefly appears
  // beside a screen-owned Back button.
  useLayoutEffect(() => {
    if (!enabled || !navigation) return;
    return navigation.registerBackControl();
  }, [enabled, navigation?.registerBackControl]);
}

export function UniversalBackButton() {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();

  if (
    !navigation ||
    !navigation.canGoBack ||
    navigation.screen === 'home' ||
    navigation.screen === 'splash' ||
    navigation.registeredBackControls > 0
  ) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={12}
        onPress={navigation.goBack}
        style={({ pressed }) => [
          styles.backButton,
          { top: Math.max(insets.top, 8) + 8 },
          pressed && styles.backButtonPressed,
        ]}
      >
        <Feather name="arrow-left" size={23} color={COLORS.black} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D7DADD',
    backgroundColor: 'rgba(255,255,255,.98)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.13,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 9999,
  },
  backButtonPressed: {
    opacity: 0.66,
    transform: [{ scale: 0.97 }],
  },
});
