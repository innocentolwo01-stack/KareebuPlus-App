export const SERVICE_PREFERENCES_STORAGE_KEY = '@kareebu/plus/onboarding-v10-services';

export type ServicePreference = 'rides' | 'food' | 'deliveries' | 'shopping';

export function parseServicePreferences(value: string | null): ServicePreference[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ServicePreference =>
      ['rides', 'food', 'deliveries', 'shopping'].includes(item),
    );
  } catch {
    return [];
  }
}
