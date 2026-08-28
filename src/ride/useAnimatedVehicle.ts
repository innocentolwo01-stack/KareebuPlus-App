import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { AnimatedRegion } from 'react-native-maps';
import { VehicleGpsPayload, normaliseHeading } from './vehicle';

const DEFAULT_ANIMATION_MS = 850;

export function useAnimatedVehicle(initial: VehicleGpsPayload) {
  const markerRef = useRef<any>(null);
  const coordinate = useRef(
    new AnimatedRegion({
      latitude: initial.latitude,
      longitude: initial.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    }),
  ).current;
  const [heading, setHeading] = useState(normaliseHeading(initial.heading));
  const [latest, setLatest] = useState(initial);

  const applyGpsPayload = useCallback(
    (payload: VehicleGpsPayload, duration = DEFAULT_ANIMATION_MS) => {
      setLatest(payload);
      setHeading(normaliseHeading(payload.heading));
      const next = { latitude: payload.latitude, longitude: payload.longitude };

      // react-native-maps exposes a native marker animation on Android. On iOS,
      // AnimatedRegion timing gives the same smooth movement without teleporting.
      if (Platform.OS === 'android' && markerRef.current?.animateMarkerToCoordinate) {
        markerRef.current.animateMarkerToCoordinate(next, duration);
      } else {
        // react-native-maps accepts latitude/longitude directly here at runtime.
        // Recent React Native typings incorrectly require Animated.timing's `toValue`,
        // so keep the documented react-native-maps shape and narrow only this call.
        coordinate
          .timing({
            ...next,
            duration,
            useNativeDriver: false,
          } as any)
          .start();
      }
    },
    [coordinate],
  );

  return { markerRef, coordinate, heading, latest, applyGpsPayload };
}
