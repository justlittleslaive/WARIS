export const ASSET_CATEGORIES = [
  'Bank Savings',
  'Property',
  'Investments (ASB, unit trust, shares)',
  'EPF / KWSP',
  'Insurance / Takaful',
  'Business Interest',
  'Cash, Gold and Jewellery',
  'Vehicle',
  'Other',
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const RELATIONSHIPS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Relative',
  'Other',
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

export const LEGAL_TRACKS = ['muslim', 'non-muslim', 'native-customary', 'unsure'] as const;

export type LegalTrack = (typeof LEGAL_TRACKS)[number];

export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Penang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'W.P. Kuala Lumpur',
  'W.P. Labuan',
  'W.P. Putrajaya',
] as const;

export type MalaysianState = (typeof MALAYSIAN_STATES)[number];

export type Language = 'ms' | 'en';

export type ManualReadinessId = 'documents' | 'planning' | 'emergency';

export type ReadinessTaskId = 'assets' | 'family' | ManualReadinessId;

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  institution: string;
  estimatedValue: number;
  documentLocation: string;
  notes?: string;
  createdAt: string;
}

export interface FamilyContact {
  id: string;
  name: string;
  relationship: Relationship;
  phone?: string;
  isPrimaryContact: boolean;
}

export interface ManualReadiness {
  documents: boolean;
  planning: boolean;
  emergency: boolean;
}

export interface UserProfile {
  name: string;
  legalTrack: LegalTrack;
  state?: MalaysianState;
  language: Language;
  assets: Asset[];
  contacts: FamilyContact[];
  readiness: ManualReadiness;
  updatedAt: string;
}

export interface StorageEnvelope {
  schemaVersion: 1;
  profile: UserProfile;
}

export interface ReadinessTaskView {
  id: ReadinessTaskId;
  label: string;
  description: string;
  points: number;
  completed: boolean;
  mode: 'derived' | 'manual';
}

export type DemoPersonaId = 'ahmad' | 'lim' | 'rajesh' | 'anak-dayang';
