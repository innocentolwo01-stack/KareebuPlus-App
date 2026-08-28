import { MARKET_CONFIG, marketConfig, type SupportedCountry } from './markets/config';
import { marketContent } from './content/markets';

export type { SupportedCountry } from './markets/config';

export type LocaleProfile = {
  country: SupportedCountry;
  iso: 'UG' | 'KE' | 'TZ';
  dialCode: '+256' | '+254' | '+255';
  currency: 'UGX' | 'KES' | 'TZS';
  currencyScaleFromUgx: number;
  primaryMobileMoney: string;
  secondaryMobileMoney: string;
  primaryCity: string;
  timezone: string;
  cityToCityExamples: Array<{ city: string; detail: string; baseFareUgx: number }>;
};

const CITY_FARES: Record<SupportedCountry, number[]> = {
  Uganda: [80000, 260000],
  Kenya: [260000, 410000],
  Tanzania: [210000, 480000],
};

const LOCALE_PROFILES = Object.fromEntries(
  (Object.keys(MARKET_CONFIG) as SupportedCountry[]).map((country) => {
    const config = MARKET_CONFIG[country];
    const destinations = marketContent(country).rideDestinations;
    return [country, {
      country,
      iso: config.iso,
      dialCode: config.dialCode,
      currency: config.currency,
      currencyScaleFromUgx: config.currencyScaleFromUgx,
      primaryMobileMoney: config.mobileMoney[0],
      secondaryMobileMoney: config.mobileMoney[1],
      primaryCity: config.primaryCity,
      timezone: config.timezone,
      cityToCityExamples: destinations.map((destination, index) => ({ city: destination.label, detail: destination.detail, baseFareUgx: CITY_FARES[country][index] })),
    } satisfies LocaleProfile];
  }),
) as Record<SupportedCountry, LocaleProfile>;

export function localeProfile(country: string): LocaleProfile {
  const resolved = marketConfig(country).country;
  return LOCALE_PROFILES[resolved];
}

export function localAmount(country: string, baseUgx: number) {
  const profile = localeProfile(country);
  return Math.max(0, Math.round(baseUgx * profile.currencyScaleFromUgx));
}

export function formatMoney(country: string, baseUgx: number) {
  const profile = localeProfile(country);
  return `${profile.currency} ${localAmount(country, baseUgx).toLocaleString()}`;
}

export function dialCodeFor(country: string) {
  return localeProfile(country).dialCode;
}

export function primaryMobileMoneyFor(country: string) {
  return localeProfile(country).primaryMobileMoney;
}

export function secondaryMobileMoneyFor(country: string) {
  return localeProfile(country).secondaryMobileMoney;
}

export function formatLocalDateTime(country: string, date = new Date()) {
  const profile = localeProfile(country);
  return new Intl.DateTimeFormat('en', {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZone: profile.timezone,
  }).format(date);
}
