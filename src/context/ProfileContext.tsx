import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  Asset,
  DemoPersonaId,
  FamilyContact,
  Language,
  LegalTrack,
  MalaysianState,
  ManualReadinessId,
  ProfileActions,
  UserProfile,
} from '../types'
import { createEmptyProfile, loadProfile, saveProfile } from '../lib/storage'
import { buildDemoProfile, DEFAULT_PERSONA_ID, getPersona } from '../data/demo'
import { createId } from '../lib/id'
import { translate, type TranslationKey } from '../data/i18n'

type LoadNotice = 'repaired' | 'invalid' | null

interface ProfileContextValue {
  profile: UserProfile
  actions: ProfileActions
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
  loadNotice: LoadNotice
  dismissLoadNotice: () => void
  storageError: boolean
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => loadProfile())
  const [profile, setProfile] = useState<UserProfile>(initial.profile)
  const profileRef = useRef<UserProfile>(initial.profile)
  const [loadNotice, setLoadNotice] = useState<LoadNotice>(
    initial.status === 'repaired' ? 'repaired' : initial.status === 'invalid' ? 'invalid' : null,
  )
  const [storageError, setStorageError] = useState(initial.status === 'unavailable')

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(profile.language, key, vars),
    [profile.language],
  )

  // Persist first, publish second: a failed write must not claim success.
  const commit = useCallback((next: UserProfile): boolean => {
    const stamped: UserProfile = { ...next, updatedAt: new Date().toISOString() }
    if (!saveProfile(stamped)) {
      setStorageError(true)
      return false
    }
    setStorageError(false)
    profileRef.current = stamped
    setProfile(stamped)
    return true
  }, [])

  const actions = useMemo<ProfileActions>(
    () => ({
      setProfileName(name) {
        return commit({ ...profileRef.current, name: name.trim().slice(0, 100) })
      },
      setLegalTrack(track: LegalTrack, state?: MalaysianState) {
        if (track === 'native-customary' && state !== 'Sabah' && state !== 'Sarawak') {
          return false
        }
        const next: UserProfile = { ...profileRef.current, legalTrack: track }
        if (state) next.state = state
        else delete next.state
        return commit(next)
      },
      setLanguage(language: Language) {
        return commit({ ...profileRef.current, language })
      },
      addAsset(input) {
        const asset: Asset = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
        }
        return commit({
          ...profileRef.current,
          assets: [...profileRef.current.assets, asset],
        })
      },
      updateAsset(id, changes) {
        const current = profileRef.current
        if (!current.assets.some((asset) => asset.id === id)) return false
        return commit({
          ...current,
          assets: current.assets.map((asset) =>
            asset.id === id ? { ...asset, ...changes, id: asset.id, createdAt: asset.createdAt } : asset,
          ),
        })
      },
      deleteAsset(id) {
        const current = profileRef.current
        if (!current.assets.some((asset) => asset.id === id)) return false
        return commit({
          ...current,
          assets: current.assets.filter((asset) => asset.id !== id),
        })
      },
      addContact(input) {
        const contacts = input.isPrimaryContact
          ? profileRef.current.contacts.map((contact) => ({ ...contact, isPrimaryContact: false }))
          : profileRef.current.contacts.map((contact) => ({ ...contact }))
        const newContact: FamilyContact = { ...input, id: createId() }
        return commit({
          ...profileRef.current,
          contacts: [...contacts, newContact],
        })
      },
      updateContact(id, changes) {
        const current = profileRef.current
        if (!current.contacts.some((contact) => contact.id === id)) return false
        const makingPrimary = changes.isPrimaryContact === true
        return commit({
          ...current,
          contacts: current.contacts.map((contact) => {
            if (contact.id === id) {
              return { ...contact, ...changes, id: contact.id }
            }
            if (makingPrimary && contact.isPrimaryContact) {
              return { ...contact, isPrimaryContact: false }
            }
            return contact
          }),
        })
      },
      deleteContact(id) {
        const current = profileRef.current
        if (!current.contacts.some((contact) => contact.id === id)) return false
        // Deleting the primary contact intentionally leaves zero primaries.
        return commit({
          ...current,
          contacts: current.contacts.filter((contact) => contact.id !== id),
        })
      },
      setManualReadiness(id: ManualReadinessId, checked: boolean) {
        return commit({
          ...profileRef.current,
          readiness: { ...profileRef.current.readiness, [id]: checked },
        })
      },
      loadDemoData(personaId: DemoPersonaId = DEFAULT_PERSONA_ID) {
        const current = profileRef.current
        const personaProfile = buildDemoProfile(getPersona(personaId), current.language)
        return commit(personaProfile)
      },
      resetProfile() {
        return commit(createEmptyProfile())
      },
    }),
    [commit],
  )

  const dismissLoadNotice = useCallback(() => setLoadNotice(null), [])

  // Screen readers rely on <html lang> to pick a voice; keep it in sync with the toggle.
  useEffect(() => {
    document.documentElement.lang = profile.language
  }, [profile.language])

  const value = useMemo<ProfileContextValue>(
    () => ({ profile, actions, t, loadNotice, dismissLoadNotice, storageError }),
    [profile, actions, t, loadNotice, dismissLoadNotice, storageError],
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) throw new Error('useProfile must be used within ProfileProvider')
  return context
}
