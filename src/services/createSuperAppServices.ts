import { getRuntimeConfig } from '../core/config/runtimeConfig';
import type { SuperAppServices } from '../core/services/contracts';
import { createDemoSuperAppServices } from './demo/demoSuperAppServices';
import { createKareebuSuperAppServices } from './kareebu/kareebuSuperAppServices';
import { createLegacy6amSuperAppServices } from './legacy6am/legacy6amSuperAppServices';

export function createSuperAppServices(): SuperAppServices {
  const config = getRuntimeConfig();

  if (config.backendMode === 'kareebu') {
    return createKareebuSuperAppServices(config.kareebuApiBaseUrl);
  }

  if (config.backendMode === 'legacy6am') {
    return createLegacy6amSuperAppServices(config.legacy6amApiBaseUrl);
  }

  return createDemoSuperAppServices();
}
