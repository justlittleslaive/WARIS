import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  Asset,
  DemoPersonaId,
  FamilyContact,
  Language,
  LegalTrack,
  MalaysianState,
  ManualReadinessId,
  UserProfile,
} from '../types';
import { MALAYSIAN_STATES } from '../types';
import { createTranslator, type Translate } from '../data/i18n';
import { buildDemoProfile } from '../data/demo';
import { createEmptyProfile, loadProfile, saveProfile } from '../lib/storage';
import { createId } from '../lib/id';

export interface ProfileActions {
  setProfileName(name: string): boolean;
  setLegalTrack(track: LegalTrack, state?: MalaysianState): boolean;
  setLanguage(language: Language): boolean;
  addAsset(input: Omit<Asset, 'id' | 'createdAt'>): boolean;
  updateAsset(id: string, changes: Partial<Omit<Asset, 'id' | 'createdAt'>>): boolean;
  deleteAsset(id: string): boolean;
  addContact(input: Omit<FamilyContact, 'id'>): boolean;
  updateContact(id: string, changes: Partial<Omit<FamilyContact, 'id'>>): boolean;
  deleteContact(id: string): boolean;
  setManualReadiness(id: ManualReadinessId, checked: boolean): boolean;
  loadDemoData(personaId?: DemoPersonaId): boolean;
  resetProfile(): boolean;
}

interface ProfileContextValue {
  profile: UserProfile;
  language: Language;
  t: Translate;
  initialWarnings: string[];
  actions: ProfileActions;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const MAX_VALUE = 1_000_000_000_000;

export function ProfileProvider({ children }: { children: ReactNode }) {
  const initial = useRef<ReturnType<typeof loadProfile> | null>(null);
  if (initial.current === null) {
    initial.current = loadProfile();
  }

  const [profile, setProfile] = useState<UserProfile>(initial.current.profile);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const commit = useCallback((next: UserProfile): boolean => {
    const stamped: UserProfile = { ...next, updatedAt: new Date().toISOString() };
    if (!saveProfile(stamped)) {
      return false;
    }
    profileRef.current = stamped;
    setProfile(stamped);
    return true;
  }, []);

  useEffect(() => {
    document.documentElement.lang = profile.language;
  }, [profile.language]);

  const t = useMemo<Translate>(() => createTranslator(profile.language), [profile.language]);

  const setProfileName = useCallback(
    (name: string): boolean => {
      const current = profileRef.current;
      return commit({ ...current, name: name.trim().slice(0, 100) });
    },
    [commit],
  );

  const setLegalTrack = useCallback(
    (track: LegalTrack, state?: MalaysianState): boolean => {
      if (track === 'native-customary' && state !== 'Sabah' && state !== 'Sarawak') {
        return false;
      }
      if (state !== undefined && !(MALAYSIAN_STATES as readonly string[]).includes(state)) {
        return false;
      }
      const current = profileRef.current;
      return commit({ ...current, legalTrack: track, state });
    },
    [commit],
  );

  const setLanguage = useCallback(
    (language: Language): boolean => {
      if (language !== 'ms' && language !== 'en') return false;
      const current = profileRef.current;
      return commit({ ...current, language });
    },
    [commit],
  );

  const addAsset = useCallback(
    (input: Omit<Asset, 'id' | 'createdAt'>): boolean => {
      const current = profileRef.current;
      const name = input.name.trim().slice(0, 120);
      if (!name) return false;
      if (
        !Number.isFinite(input.estimatedValue) ||
        input.estimatedValue < 0 ||
        input.estimatedValue > MAX_VALUE
      ) {
        return false;
      }
      const ids = new Set(current.assets.map((asset) => asset.id));
      let id = createId();
      while (ids.has(id)) id = createId();
      const asset: Asset = {
        ...input,
        id,
        name,
        institution: input.institution.trim().slice(0, 120),
        documentLocation: input.documentLocation.trim().slice(0, 200),
        notes: input.notes?.trim().slice(0, 500) || undefined,
        createdAt: new Date().toISOString(),
      };
      return commit({ ...current, assets: [...current.assets, asset] });
    },
    [commit],
  );

  const updateAsset = useCallback(
    (id: string, changes: Partial<Omit<Asset, 'id' | 'createdAt'>>): boolean => {
      const current = profileRef.current;
      const existing = current.assets.find((asset) => asset.id === id);
      if (!existing) return false;
      if (changes.name !== undefined && !changes.name.trim()) return false;
      if (
        changes.estimatedValue !== undefined &&
        (!Number.isFinite(changes.estimatedValue) ||
          changes.estimatedValue < 0 ||
          changes.estimatedValue > MAX_VALUE)
      ) {
        return false;
      }
      const updated: Asset = {
        ...existing,
        ...changes,
        name: (changes.name ?? existing.name).trim().slice(0, 120),
        institution:
          changes.institution !== undefined
            ? changes.institution.trim().slice(0, 120)
            : existing.institution,
        documentLocation:
          changes.documentLocation !== undefined
            ? changes.documentLocation.trim().slice(0, 200)
            : existing.documentLocation,
        notes:
          changes.notes !== undefined
            ? changes.notes.trim().slice(0, 500) || undefined
            : existing.notes,
      };
      return commit({
        ...current,
        assets: current.assets.map((asset) => (asset.id === id ? updated : asset)),
      });
    },
    [commit],
  );

  const deleteAsset = useCallback(
    (id: string): boolean => {
      const current = profileRef.current;
      if (!current.assets.some((asset) => asset.id === id)) return false;
      return commit({
        ...current,
        assets: current.assets.filter((asset) => asset.id !== id),
      });
    },
    [commit],
  );

  const addContact = useCallback(
    (input: Omit<FamilyContact, 'id'>): boolean => {
      const current = profileRef.current;
      const name = input.name.trim().slice(0, 120);
      if (!name) return false;
      const ids = new Set(current.contacts.map((contact) => contact.id));
      let id = createId();
      while (ids.has(id)) id = createId();
      const contact: FamilyContact = {
        ...input,
        id,
        name,
        phone: input.phone?.trim().slice(0, 30) || undefined,
      };
      const contacts = input.isPrimaryContact
        ? current.contacts.map((item) => ({ ...item, isPrimaryContact: false }))
        : current.contacts;
      return commit({ ...current, contacts: [...contacts, contact] });
    },
    [commit],
  );

  const updateContact = useCallback(
    (id: string, changes: Partial<Omit<FamilyContact, 'id'>>): boolean => {
      const current = profileRef.current;
      const existing = current.contacts.find((contact) => contact.id === id);
      if (!existing) return false;
      if (changes.name !== undefined && !changes.name.trim()) return false;
      const merged: FamilyContact = {
        ...existing,
        ...changes,
        name: (changes.name ?? existing.name).trim().slice(0, 120),
        phone:
          changes.phone !== undefined
            ? changes.phone.trim().slice(0, 30) || undefined
            : existing.phone,
      };
      let contacts = current.contacts.map((contact) => (contact.id === id ? merged : contact));
      if (merged.isPrimaryContact) {
        contacts = contacts.map((contact) =>
          contact.id === id ? merged : { ...contact, isPrimaryContact: false },
        );
      }
      return commit({ ...current, contacts });
    },
    [commit],
  );

  const deleteContact = useCallback(
    (id: string): boolean => {
      const current = profileRef.current;
      if (!current.contacts.some((contact) => contact.id === id)) return false;
      return commit({
        ...current,
        contacts: current.contacts.filter((contact) => contact.id !== id),
      });
    },
    [commit],
  );

  const setManualReadiness = useCallback(
    (id: ManualReadinessId, checked: boolean): boolean => {
      if (id !== 'documents' && id !== 'planning' && id !== 'emergency') return false;
      const current = profileRef.current;
      return commit({
        ...current,
        readiness: { ...current.readiness, [id]: checked },
      });
    },
    [commit],
  );

  const loadDemoData = useCallback(
    (personaId: DemoPersonaId = 'ahmad'): boolean => {
      const current = profileRef.current;
      const demo = buildDemoProfile(personaId, current.language);
      return commit(demo);
    },
    [commit],
  );

  const resetProfile = useCallback((): boolean => {
    return commit(createEmptyProfile());
  }, [commit]);

  const actions = useMemo<ProfileActions>(
    () => ({
      setProfileName,
      setLegalTrack,
      setLanguage,
      addAsset,
      updateAsset,
      deleteAsset,
      addContact,
      updateContact,
      deleteContact,
      setManualReadiness,
      loadDemoData,
      resetProfile,
    }),
    [
      setProfileName,
      setLegalTrack,
      setLanguage,
      addAsset,
      updateAsset,
      deleteAsset,
      addContact,
      updateContact,
      deleteContact,
      setManualReadiness,
      loadDemoData,
      resetProfile,
    ],
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      language: profile.language,
      t,
      initialWarnings: initial.current?.warnings ?? [],
      actions,
    }),
    [profile, t, actions],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
