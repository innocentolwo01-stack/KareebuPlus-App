export type ReconstructionStatus =
  | 'core-architecture'
  | 'active-reconstruction'
  | 'preserve-and-enhance'
  | 'reconstruct'
  | 'reconstruct-backend-replacement'
  | 'reference-only'
  | 'optional';

export type KareebuFeatureId =
  | 'home' | 'rides' | 'rides-legacy' | 'food' | 'shops' | 'pay' | 'plus'
  | 'account' | 'auth' | 'explore' | 'support' | 'chat' | 'order-anything'
  | 'deliveries' | 'bike' | 'donations' | 'locations' | 'discovery' | 'appengine';

export type DonorFeatureSpec = {
  id: KareebuFeatureId;
  donorModule: string;
  kareebuName: string;
  status: ReconstructionStatus;
  donorEntryPoints: readonly string[];
  backendPolicy: 'keep-kareebu' | 'replace-careem' | 'none';
};

export type KareebuCanonicalRoute = {
  id: string;
  feature: KareebuFeatureId;
  path: string;
  source?: string;
};
