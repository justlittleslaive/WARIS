import {
  ASSET_CATEGORIES,
  LEGAL_TRACKS,
  MALAYSIAN_STATES,
  RELATIONSHIPS,
  type Asset,
  type AssetCategory,
  type FamilyContact,
  type Language,
  type LegalTrack,
  type MalaysianState,
  type Relationship,
  type UserProfile,
  type StorageEnvelope,
} from '../types'

export const STORAGE_KEY = 'warisready:v1'

export type LoadStatus = 'ok' | 'repaired' | 'invalid' | 'unavailable'

export interface LoadResult {
  profile: UserProfile
  status: LoadStatus
}

const LEGACY_CATEGORIES: Record<string, AssetCategory> = {
  'ASB / Investments': 'Investments (ASB, unit trust, shares)',
  KWSP: 'EPF / KWSP',
  'Takaful / Insurance': 'Insurance / Takaful',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function oneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value)
}

function normalizeCategory(value: unknown): { category: AssetCategory; repaired: boolean } {
  if (oneOf(ASSET_CATEGORIES, value)) return { category: value, repaired: false }
  if (typeof value === 'string' && LEGACY_CATEGORIES[value]) {
    return { category: LEGACY_CATEGORIES[value], repaired: true }
  }
  return { category: 'Other', repaired: true }
}

function normalizeRelationship(value: unknown): { relationship: Relationship; repaired: boolean } {
  if (oneOf(RELATIONSHIPS, value)) return { relationship: value, repaired: false }
  return { relationship: 'Other', repaired: true }
}

function normalizeState(
  value: unknown,
  track: LegalTrack,
): { state: MalaysianState | undefined; repaired: boolean } {
  if (value === undefined || value === null || value === '') return { state: undefined, repaired: false }
  if (!oneOf(MALAYSIAN_STATES, value)) return { state: undefined, repaired: true }
  if (track === 'native-customary' && value !== 'Sabah' && value !== 'Sarawak') {
    return { state: undefined, repaired: true }
  }
  return { state: value, repaired: false }
}

function normalizeAsset(value: unknown, now: string): { asset?: Asset; repaired: boolean } {
  if (!isRecord(value)) return { repaired: true }
  const name = typeof value.name === 'string' ? value.name.trim().slice(0, 120) : ''
  if (name.length === 0) return { repaired: true }

  const { category, repaired: categoryRepaired } = normalizeCategory(value.category)
  const rawValue = typeof value.estimatedValue === 'number' ? value.estimatedValue : Number.NaN
  const validValue = Number.isFinite(rawValue) && rawValue >= 0 && rawValue <= 1_000_000_000_000
  const estimatedValue = validValue ? rawValue : 0

  const asset: Asset = {
    id: typeof value.id === 'string' && value.id.trim() ? value.id : `asset-${Math.random().toString(36).slice(2, 10)}`,
    name,
    category,
    institution: typeof value.institution === 'string' ? value.institution.trim().slice(0, 120) : '',
    estimatedValue,
    documentLocation:
      typeof value.documentLocation === 'string' ? value.documentLocation.trim().slice(0, 200) : '',
    createdAt:
      typeof value.createdAt === 'string' && !Number.isNaN(Date.parse(value.createdAt))
        ? value.createdAt
        : now,
  }
  const notes = typeof value.notes === 'string' ? value.notes.trim().slice(0, 500) : ''
  if (notes) asset.notes = notes

  return { asset, repaired: categoryRepaired || !validValue }
}

function normalizeContact(value: unknown): { contact?: FamilyContact; repaired: boolean } {
  if (!isRecord(value)) return { repaired: true }
  const name = typeof value.name === 'string' ? value.name.trim().slice(0, 120) : ''
  if (name.length === 0) return { repaired: true }

  const { relationship, repaired } = normalizeRelationship(value.relationship)
  const contact: FamilyContact = {
    id: typeof value.id === 'string' && value.id.trim() ? value.id : `contact-${Math.random().toString(36).slice(2, 10)}`,
    name,
    relationship,
    isPrimaryContact: value.isPrimaryContact === true,
  }
  const phone = typeof value.phone === 'string' ? value.phone.trim().slice(0, 30) : ''
  if (phone) contact.phone = phone

  return { contact, repaired }
}

export function createEmptyProfile(language: Language = 'ms'): UserProfile {
  return {
    name: '',
    legalTrack: 'unsure',
    language,
    assets: [],
    contacts: [],
    readiness: { documents: false, planning: false, emergency: false },
    updatedAt: new Date().toISOString(),
  }
}

function normalizeProfile(input: unknown): { profile: UserProfile; repaired: boolean } {
  const raw = isRecord(input) && isRecord(input.profile) ? input.profile : input
  if (!isRecord(raw)) return { profile: createEmptyProfile(), repaired: true }

  let repaired = false
  const now = new Date().toISOString()

  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 100) : ''

  let legalTrack: LegalTrack = 'unsure'
  if (oneOf(LEGAL_TRACKS, raw.legalTrack)) {
    legalTrack = raw.legalTrack
  } else if (raw.legalTrack !== undefined) {
    repaired = true
  }

  const stateResult = normalizeState(raw.state, legalTrack)
  if (stateResult.repaired) repaired = true

  let language: Language = 'ms'
  if (raw.language === 'ms' || raw.language === 'en') {
    language = raw.language
  } else if (raw.language !== undefined) {
    repaired = true
  }

  const assets: Asset[] = []
  if (Array.isArray(raw.assets)) {
    for (const item of raw.assets) {
      const result = normalizeAsset(item, now)
      if (result.repaired) repaired = true
      if (result.asset) assets.push(result.asset)
    }
  } else if (raw.assets !== undefined) {
    repaired = true
  }

  const contacts: FamilyContact[] = []
  if (Array.isArray(raw.contacts)) {
    for (const item of raw.contacts) {
      const result = normalizeContact(item)
      if (result.repaired) repaired = true
      if (result.contact) contacts.push(result.contact)
    }
  } else if (raw.contacts !== undefined) {
    repaired = true
  }

  // At most one primary contact: keep the first marked one.
  let primarySeen = false
  for (const contact of contacts) {
    if (contact.isPrimaryContact && primarySeen) {
      contact.isPrimaryContact = false
      repaired = true
    } else if (contact.isPrimaryContact) {
      primarySeen = true
    }
  }

  const readinessRaw = isRecord(raw.readiness) ? raw.readiness : {}
  const readiness = {
    documents: readinessRaw.documents === true,
    planning: readinessRaw.planning === true,
    emergency: readinessRaw.emergency === true,
  }
  if (raw.readiness !== undefined && !isRecord(raw.readiness)) repaired = true

  const updatedAt =
    typeof raw.updatedAt === 'string' && !Number.isNaN(Date.parse(raw.updatedAt)) ? raw.updatedAt : now
  if (raw.updatedAt !== undefined && updatedAt === now && raw.updatedAt !== now) repaired = true

  const profile: UserProfile = {
    name,
    legalTrack,
    language,
    assets,
    contacts,
    readiness,
    updatedAt,
  }
  if (stateResult.state) profile.state = stateResult.state

  return { profile, repaired }
}

export function loadProfile(): LoadResult {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return { profile: createEmptyProfile(), status: 'unavailable' }
  }

  if (raw === null) return { profile: createEmptyProfile(), status: 'ok' }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { profile: createEmptyProfile(), status: 'invalid' }
  }

  try {
    const { profile, repaired } = normalizeProfile(parsed)
    return { profile, status: repaired ? 'repaired' : 'ok' }
  } catch {
    return { profile: createEmptyProfile(), status: 'invalid' }
  }
}

export function saveProfile(profile: UserProfile): boolean {
  const envelope: StorageEnvelope = { schemaVersion: 1, profile }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
    return true
  } catch {
    return false
  }
}
