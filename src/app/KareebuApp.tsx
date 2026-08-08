import * as NativeSplashScreen from 'expo-splash-screen';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { renderAppScreen } from './navigation/renderAppScreen';
import { SuperAppServicesProvider } from './providers/SuperAppServicesProvider';
import { useKareebuAppState } from './state/useKareebuAppState';

NativeSplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function KareebuApp() {
  const { screen, data, actions } = useKareebuAppState();
  const nativeSplashHiddenRef = useRef(false);

  const onRootLayout = useCallback(() => {
    if (nativeSplashHiddenRef.current) return;
    nativeSplashHiddenRef.current = true;
    NativeSplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <SuperAppServicesProvider>
      <View
        onLayout={onRootLayout}
        style={{ flex: 1, backgroundColor: screen === 'splash' ? '#030303' : '#FFFFFF' }}
      >
        {renderAppScreen(screen, data, actions)}
      </View>
    </SuperAppServicesProvider>
  );
}
