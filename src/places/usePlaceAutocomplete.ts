import { useEffect, useRef, useState } from 'react';
import {
  PlaceBias,
  PlaceSuggestion,
  autocompletePlaces,
  createPlacesSessionToken,
  placesConfigured,
} from './provider';

export function usePlaceAutocomplete(
  query: string,
  options: { countryCode?: string; bias?: PlaceBias; minimumChars?: number; debounceMs?: number } = {},
) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef(createPlacesSessionToken());
  const minimumChars = options.minimumChars ?? 2;
  const debounceMs = options.debounceMs ?? 240;

  useEffect(() => {
    const trimmed = query.trim();
    if (!placesConfigured() || trimmed.length < minimumChars) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      autocompletePlaces(trimmed, {
        countryCode: options.countryCode,
        bias: options.bias,
        sessionToken: tokenRef.current,
      })
        .then((items) => { if (active) setSuggestions(items); })
        .catch((cause) => {
          if (!active) return;
          setSuggestions([]);
          setError(cause instanceof Error ? cause.message : 'Place search unavailable');
        })
        .finally(() => { if (active) setLoading(false); });
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, options.countryCode, options.bias?.latitude, options.bias?.longitude, options.bias?.radiusMeters, minimumChars, debounceMs]);

  const resetSession = () => {
    tokenRef.current = createPlacesSessionToken();
    setSuggestions([]);
    setError(null);
  };

  return {
    configured: placesConfigured(),
    suggestions,
    loading,
    error,
    sessionToken: tokenRef.current,
    resetSession,
  };
}
