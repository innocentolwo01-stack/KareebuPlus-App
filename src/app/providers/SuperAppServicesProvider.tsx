import React, { createContext, useContext, useMemo } from 'react';
import type { SuperAppServices } from '../../core/services/contracts';
import { createSuperAppServices } from '../../services/createSuperAppServices';

const SuperAppServicesContext = createContext<SuperAppServices | null>(null);

export function SuperAppServicesProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo(() => createSuperAppServices(), []);
  return <SuperAppServicesContext.Provider value={services}>{children}</SuperAppServicesContext.Provider>;
}

export function useSuperAppServices(): SuperAppServices {
  const services = useContext(SuperAppServicesContext);
  if (!services) throw new Error('useSuperAppServices must be used inside SuperAppServicesProvider');
  return services;
}
