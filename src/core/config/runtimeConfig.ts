export type BackendMode = 'demo' | 'kareebu' | 'legacy6am';

export type RuntimeConfig = {
  backendMode: BackendMode;
  kareebuApiBaseUrl?: string;
  legacy6amApiBaseUrl?: string;
  kareebuAiBaseUrl?: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value.replace(/\/$/, '') : undefined;
}

function readBackendMode(): BackendMode {
  const value = readEnv('EXPO_PUBLIC_KAREEBU_BACKEND_MODE');
  if (value === 'kareebu' || value === 'legacy6am') return value;
  return 'demo';
}

export function getRuntimeConfig(): RuntimeConfig {
  return {
    backendMode: readBackendMode(),
    kareebuApiBaseUrl: readEnv('EXPO_PUBLIC_KAREEBU_API_URL'),
    legacy6amApiBaseUrl: readEnv('EXPO_PUBLIC_LEGACY_6AM_API_URL'),
    kareebuAiBaseUrl: readEnv('EXPO_PUBLIC_KAREEBU_AI_URL'),
  };
}
