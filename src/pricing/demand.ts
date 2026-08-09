export type DemandService = 'ride' | 'boda' | 'food-delivery' | 'store-delivery' | 'parcel-delivery';
export type DemandLevel = 'low' | 'normal' | 'busy' | 'very_busy';

export type DemandSignals = {
  activeRequests?: number;
  availableProviders?: number;
  timestamp?: Date;
  scheduled?: boolean;
};

export type DemandQuote = {
  service: DemandService;
  level: DemandLevel;
  label: string;
  multiplier: number;
  pressureRatio: number;
  activeRequests: number;
  availableProviders: number;
  reason: string;
  source: 'realtime' | 'estimated';
};

const LIMITS: Record<DemandService, { floor: number; cap: number; sensitivity: number }> = {
  ride: { floor: 0.9, cap: 1.75, sensitivity: 0.36 },
  boda: { floor: 0.9, cap: 1.55, sensitivity: 0.3 },
  'food-delivery': { floor: 0.95, cap: 1.45, sensitivity: 0.24 },
  'store-delivery': { floor: 0.95, cap: 1.4, sensitivity: 0.22 },
  'parcel-delivery': { floor: 0.95, cap: 1.45, sensitivity: 0.24 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function estimatedPressure(service: DemandService, date: Date): number {
  const hour = date.getHours();
  const day = date.getDay();
  const weekend = day === 0 || day === 6;

  if (service === 'ride') {
    if ((hour >= 7 && hour < 10) || (hour >= 16 && hour < 20)) return weekend ? 1.35 : 1.75;
    if (hour >= 22 || hour < 2) return weekend ? 1.7 : 1.35;
    if (hour >= 10 && hour < 16) return 1.05;
    return 0.82;
  }

  if (service === 'boda') {
    if ((hour >= 7 && hour < 10) || (hour >= 16 && hour < 20)) return weekend ? 1.3 : 1.65;
    if (hour >= 11 && hour < 15) return 1.12;
    return 0.88;
  }

  if (service === 'food-delivery') {
    if (hour >= 11 && hour < 14) return weekend ? 1.55 : 1.4;
    if (hour >= 18 && hour < 22) return weekend ? 1.8 : 1.62;
    return weekend ? 1.02 : 0.82;
  }

  if (service === 'store-delivery') {
    if (hour >= 17 && hour < 21) return weekend ? 1.55 : 1.38;
    if (weekend && hour >= 10 && hour < 17) return 1.35;
    return 0.88;
  }

  if (hour >= 8 && hour < 11) return 1.25;
  if (hour >= 14 && hour < 18) return 1.4;
  return weekend ? 0.92 : 0.82;
}

function demandLevel(ratio: number): DemandLevel {
  if (ratio < 0.78) return 'low';
  if (ratio < 1.18) return 'normal';
  if (ratio < 1.65) return 'busy';
  return 'very_busy';
}

function demandLabel(level: DemandLevel) {
  if (level === 'low') return 'Lower demand';
  if (level === 'normal') return 'Normal demand';
  if (level === 'busy') return 'Busy';
  return 'Very busy';
}

export function demandQuote(service: DemandService, signals: DemandSignals = {}): DemandQuote {
  const hasRealtime = Number.isFinite(signals.activeRequests) && Number.isFinite(signals.availableProviders);
  const date = signals.timestamp ?? new Date();
  const estimatedRatio = estimatedPressure(service, date);
  const availableProviders = hasRealtime ? Math.max(1, Math.round(signals.availableProviders!)) : 10;
  const activeRequests = hasRealtime ? Math.max(0, Math.round(signals.activeRequests!)) : Math.max(1, Math.round(estimatedRatio * availableProviders));
  const pressureRatio = activeRequests / Math.max(1, availableProviders);
  const limits = LIMITS[service];
  let multiplier = 1 + (pressureRatio - 1) * limits.sensitivity;

  // Scheduled work is less exposed to last-minute scarcity. The production
  // backend can replace this with demand for the selected time slot.
  if (signals.scheduled) multiplier = 1 + (multiplier - 1) * 0.55;
  multiplier = clamp(multiplier, limits.floor, limits.cap);
  multiplier = Math.round(multiplier * 100) / 100;

  const level = demandLevel(pressureRatio);
  const reason = pressureRatio > 1.05
    ? `${activeRequests} requests for ${availableProviders} available ${service === 'boda' ? 'Boda Captains' : service === 'ride' ? 'Captains' : 'couriers'} nearby`
    : pressureRatio < 0.78
      ? 'More nearby supply than active requests'
      : 'Nearby supply is keeping pace with requests';

  return {
    service,
    level,
    label: demandLabel(level),
    multiplier,
    pressureRatio: Math.round(pressureRatio * 100) / 100,
    activeRequests,
    availableProviders,
    reason,
    source: hasRealtime ? 'realtime' : 'estimated',
  };
}

export function applyDemand(baseFee: number, quote: DemandQuote) {
  if (baseFee <= 0) return { baseFee: 0, demandAdjustment: 0, totalFee: 0 };
  const totalFee = Math.max(0, Math.round(baseFee * quote.multiplier));
  return {
    baseFee,
    demandAdjustment: totalFee - baseFee,
    totalFee,
  };
}

export function demandPercent(quote: DemandQuote) {
  return Math.round((quote.multiplier - 1) * 100);
}
