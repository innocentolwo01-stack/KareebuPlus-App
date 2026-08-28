export type AnalyticsEventName =
  | 'navigation'
  | 'service_entry'
  | 'quick_action'
  | 'discovery_interaction'
  | 'checkout_progression'
  | 'conversion'
  | 'abandonment';

export type AnalyticsProperties = Record<string, string | number | boolean | null>;
export type AnalyticsSink = (event: { name: AnalyticsEventName; properties: AnalyticsProperties; at: string }) => void;

let sink: AnalyticsSink | null = null;

export function configureAnalytics(nextSink: AnalyticsSink | null) {
  sink = nextSink;
}

// Keep this boundary limited to enumerated, non-identifying product context.
export function trackEvent(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  sink?.({ name, properties, at: new Date().toISOString() });
}
