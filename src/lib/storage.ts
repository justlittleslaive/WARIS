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
  type StorageEnvelope,
  type UserProfile,
} from '../types';
import { createId } from './id';

export const STORAGE_KEY = 'warisready:v1';

export function createEmptyProfile(): UserProfile {
  return {
    name: '',
    legalTrack: 'unsure',
    language: 'ms',
    assets: [],
    contacts: [],
    readiness: { documents: false, planning: false, emergency: false },
    updatedAt: new Date().toISOString(),
  };
}

export function saveProfile(profile: UserProfile): boolean {
  try {
    const envelope: StorageEnvelope = { schemaVersion: 1, profile };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export interface LoadResult {
  profile: UserProfile;
  warnings: string[];
}

export function loadProfile(): LoadResult {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { profile: createEmptyProfile(), warnings: ['warn.storage'] };
  }
  if (raw === null) {
    return { profile: createEmptyProfile(), warnings: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { profile: createEmptyProfile(), warnings: ['warn.corrupt'] };
  }

  const candidate = extractProfile(parsed);
  if (!candidate) {
    return { profile: createEmptyProfile(), warnings: ['warn.corrupt'] };
  }

  const { profile, changed } = normalizeProfile(candidate);
  return { profile, warnings: changed ? ['warn.normalized'] : [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractProfile(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  if (isRecord(value.profile)) return value.profile;
  if (Array.isArray(value.assets) && Array.isArray(value.contacts)) return value;
  return null;
}

const LEGACY_CATEGORIES: Record<string, AssetCategory> = {
  'ASB / Investments': 'Investments (ASB, unit trust, shares)',
  KWSP: 'EPF / KWSP',
  'Takaful / Insurance': 'Insurance / Takaful',
};

interface NormalizeResult {
  profile: UserProfile;
  changed: boolean;
}

function normalizeProfile(raw: Record<string, unknown>): NormalizeResult {
  let changed = false;

  const name = typeof raw.name === 'string' ? raw.name.trim().slice(0, 100) : '';
  if (typeof raw.name !== 'string' && raw.name !== undefined) changed = true;

  const ids = new Set<string>();

  const assets: Asset[] = [];
  const rawAssets = Array.isArray(raw.assets) ? raw.assets : [];
  if (!Array.isArray(raw.assets) && raw.assets !== undefined) changed = true;
  for (const item of rawAssets) {
    if (!isRecord(item)) {
      changed = true;
      continue;
    }
    const assetName = typeof item.name === 'string' ? item.name.trim() : '';
    if (!assetName) {
      changed = true;
      continue;
    }
    const category = normalizeCategory(item.category);
    if (category.changed) changed = true;
    const value = item.estimatedValue;
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      changed = true;
      continue;
    }
    let id = typeof item.id === 'string' && item.id.trim() ? item.id : '';
    if (!id || ids.has(id)) {
      id = createId();
      changed = true;
    }
    ids.add(id);
    assets.push({
      id,
      name: assetName.slice(0, 120),
      category: category.value,
      institution: normalizeText(item.institution, 120),
      estimatedValue: value,
      documentLocation: normalizeText(item.documentLocation, 200),
      notes: normalizeText(item.notes, 500) || undefined,
      createdAt: normalizeIso(item.createdAt),
    });
  }

  const contacts: FamilyContact[] = [];
  const rawContacts = Array.isArray(raw.contacts) ? raw.contacts : [];
  if (!Array.isArray(raw.contacts) && raw.contacts !== undefined) changed = true;
  let primarySeen = false;
  for (const item of rawContacts) {
    if (!isRecord(item)) {
      changed = true;
      continue;
    }
    const contactName = typeof item.name === 'string' ? item.name.trim() : '';
    if (!contactName) {
      changed = true;
      continue;
    }
    const relationship = normalizeRelationship(item.relationship);
    if (relationship.changed) changed = true;
    let id = typeof item.id === 'string' && item.id.trim() ? item.id : '';
    if (!id || ids.has(id)) {
      id = createId();
      changed = true;
    }
    ids.add(id);
    let isPrimaryContact = item.isPrimaryContact === true;
    if (isPrimaryContact && primarySeen) {
      isPrimaryContact = false;
      changed = true;
    }
    if (isPrimaryContact) primarySeen = true;
    contacts.push({
      id,
      name: contactName.slice(0, 120),
      relationship: relationship.value,
      phone: normalizeText(item.phone, 30) || undefined,
      isPrimaryContact,
    });
  }

  const rawReadiness = isRecord(raw.readiness) ? raw.readiness : {};
  if (!isRecord(raw.readiness) && raw.readiness !== undefined) changed = true;

  const legalTrack = normalizeTrack(raw.legalTrack);
  if (legalTrack.changed) changed = true;

  const state = normalizeState(raw.state);
  if (state.changed) changed = true;
  let finalState = state.value;
  if (legalTrack.value === 'native-customary' && finalState !== 'Sabah' && finalState !== 'Sarawak') {
    if (finalState !== undefined) changed = true;
    finalState = undefined;
  }

  const language = normalizeLanguage(raw.language);
  if (language.changed) changed = true;

  return {
    changed,
    profile: {
      name,
      legalTrack: legalTrack.value,
      state: finalState,
      language: language.value,
      assets,
      contacts,
      readiness: {
        documents: rawReadiness.documents === true,
        planning: rawReadiness.planning === true,
        emergency: rawReadiness.emergency === true,
      },
      updatedAt: normalizeIso(raw.updatedAt),
    },
  };
}

function normalizeText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeIso(value: unknown): string {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

function normalizeCategory(value: unknown): { value: AssetCategory; changed: boolean } {
  if (typeof value === 'string') {
    if ((ASSET_CATEGORIES as readonly string[]).includes(value)) {
      return { value: value as AssetCategory, changed: false };
    }
    if (value in LEGACY_CATEGORIES) {
      return { value: LEGACY_CATEGORIES[value]!, changed: true };
    }
  }
  return { value: 'Other', changed: true };
}

function normalizeRelationship(value: unknown): { value: Relationship; changed: boolean } {
  if (typeof value === 'string' && (RELATIONSHIPS as readonly string[]).includes(value)) {
    return { value: value as Relationship, changed: false };
  }
  return { value: 'Other', changed: true };
}

function normalizeTrack(value: unknown): { value: LegalTrack; changed: boolean } {
  if (value === undefined) return { value: 'unsure', changed: false };
  if (typeof value === 'string' && (LEGAL_TRACKS as readonly string[]).includes(value)) {
    return { value: value as LegalTrack, changed: false };
  }
  return { value: 'unsure', changed: true };
}

function normalizeState(value: unknown): { value: MalaysianState | undefined; changed: boolean } {
  if (value === undefined || value === null || value === '') {
    return { value: undefined, changed: false };
  }
  if (typeof value === 'string' && (MALAYSIAN_STATES as readonly string[]).includes(value)) {
    return { value: value as MalaysianState, changed: false };
  }
  return { value: undefined, changed: true };
}

function normalizeLanguage(value: unknown): { value: Language; changed: boolean } {
  if (value === undefined) return { value: 'ms', changed: false };
  if (value === 'ms' || value === 'en') return { value, changed: false };
  return { value: 'ms', changed: true };
}
