export type SupportedCountry = 'Uganda' | 'Kenya' | 'Tanzania';

export type LocaleProfile = {
  country: SupportedCountry;
  iso: 'UG' | 'KE' | 'TZ';
  dialCode: '+256' | '+254' | '+255';
  currency: 'UGX' | 'KES' | 'TZS';
  currencyScaleFromUgx: number;
  primaryMobileMoney: string;
  secondaryMobileMoney: string;
};

const LOCALE_PROFILES: Record<SupportedCountry, LocaleProfile> = {
  Uganda: {
    country: 'Uganda',
    iso: 'UG',
    dialCode: '+256',
    currency: 'UGX',
    currencyScaleFromUgx: 1,
    primaryMobileMoney: 'MTN Mobile Money',
    secondaryMobileMoney: 'Airtel Money',
  },
  Kenya: {
    country: 'Kenya',
    iso: 'KE',
    dialCode: '+254',
    currency: 'KES',
    // Demo display scaling only. Production pricing should come from the local fare/catalogue service.
    currencyScaleFromUgx: 0.035,
    primaryMobileMoney: 'M-PESA',
    secondaryMobileMoney: 'Airtel Money',
  },
  Tanzania: {
    country: 'Tanzania',
    iso: 'TZ',
    dialCode: '+255',
    currency: 'TZS',
    // Demo display scaling only. Production pricing should come from the local fare/catalogue service.
    currencyScaleFromUgx: 0.70,
    primaryMobileMoney: 'M-Pesa',
    secondaryMobileMoney: 'Airtel Money',
  },
};

export function localeProfile(country: string): LocaleProfile {
  return LOCALE_PROFILES[country as SupportedCountry] ?? LOCALE_PROFILES.Uganda;
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
