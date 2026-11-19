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
] as const

export type AssetCategory = (typeof ASSET_CATEGORIES)[number]

export const RELATIONSHIPS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Relative',
  'Other',
] as const

export type Relationship = (typeof RELATIONSHIPS)[number]

export const LEGAL_TRACKS = ['muslim', 'non-muslim', 'native-customary', 'unsure'] as const

export type LegalTrack = (typeof LEGAL_TRACKS)[number]

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
] as const

export type MalaysianState = (typeof MALAYSIAN_STATES)[number]

export type Language = 'ms' | 'en'

export type DemoPersonaId = 'ahmad' | 'lim' | 'rajesh' | 'anak-dayang'

export type ManualReadinessId = 'documents' | 'planning' | 'emergency'
export type ReadinessTaskId = 'assets' | 'family' | ManualReadinessId

export interface Asset {
  id: string
  name: string
  category: AssetCategory
  institution: string
  estimatedValue: number
  documentLocation: string
  notes?: string
  createdAt: string
}

export interface FamilyContact {
  id: string
  name: string
  relationship: Relationship
  phone?: string
  isPrimaryContact: boolean
}

/** Persist only the three manual confirmation flags. */
export interface ManualReadiness {
  documents: boolean
  planning: boolean
  emergency: boolean
}

export interface UserProfile {
  name: string
  legalTrack: LegalTrack
  state?: MalaysianState
  language: Language
  assets: Asset[]
  contacts: FamilyContact[]
  readiness: ManualReadiness
  updatedAt: string
}

export interface StorageEnvelope {
  schemaVersion: 1
  profile: UserProfile
}

export interface ReadinessTaskView {
  id: ReadinessTaskId
  points: number
  completed: boolean
  mode: 'derived' | 'manual'
}

export interface LocalizedText {
  ms: string
  en: string
}

export interface LearnCardText {
  ms: string
  en?: string
}

export interface KnowledgeCard {
  id: string
  title: LocalizedText
  summary: LocalizedText
  why: LearnCardText
  tip: LearnCardText
  body?: LearnCardText
  links: { label: LocalizedText; href: string }[]
}

export interface ProfileActions {
  setProfileName(name: string): boolean
  setLegalTrack(track: LegalTrack, state?: MalaysianState): boolean
  setLanguage(language: Language): boolean
  addAsset(input: Omit<Asset, 'id' | 'createdAt'>): boolean
  updateAsset(id: string, changes: Partial<Omit<Asset, 'id' | 'createdAt'>>): boolean
  deleteAsset(id: string): boolean
  addContact(input: Omit<FamilyContact, 'id'>): boolean
  updateContact(id: string, changes: Partial<Omit<FamilyContact, 'id'>>): boolean
  deleteContact(id: string): boolean
  setManualReadiness(id: ManualReadinessId, checked: boolean): boolean
  loadDemoData(personaId?: DemoPersonaId): boolean
  resetProfile(): boolean
}
