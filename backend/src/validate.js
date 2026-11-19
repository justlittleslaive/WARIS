import { randomUUID } from 'node:crypto'

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
]

export const RELATIONSHIPS = ['Spouse', 'Child', 'Parent', 'Sibling', 'Relative', 'Other']

export const LEGAL_TRACKS = ['muslim', 'non-muslim', 'native-customary', 'unsure']

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
]

export const LANGUAGES = ['ms', 'en']
export const MAX_VALUE = 1_000_000_000_000

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

const fail = (message) => {
  throw new ValidationError(message)
}

const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

function readText(value, field, max, { required = false } = {}) {
  if (value === undefined) {
    if (required) fail(`${field} is required`)
    return undefined
  }
  if (value === null) return ''
  if (typeof value !== 'string') fail(`${field} must be a string`)
  const trimmed = value.trim()
  if (required && !trimmed) fail(`${field} is required`)
  if (trimmed.length > max) fail(`${field} must be at most ${max} characters`)
  return trimmed
}

function readEnum(value, field, allowed, { required = false } = {}) {
  if (value === undefined) {
    if (required) fail(`${field} is required`)
    return undefined
  }
  if (!allowed.includes(value)) fail(`${field} is invalid`)
  return value
}

export function validateAssetInput(body, { partial = false } = {}) {
  if (!isRecord(body)) fail('Body must be a JSON object')
  const out = {}

  const name = readText(body.name, 'name', 120, { required: !partial })
  if (name !== undefined) {
    if (!name) fail('name is required')
    out.name = name
  }

  const category = readEnum(body.category, 'category', ASSET_CATEGORIES, { required: !partial })
  if (category !== undefined) out.category = category

  const institution = readText(body.institution, 'institution', 120)
  if (institution !== undefined) out.institution = institution

  if (body.estimatedValue !== undefined) {
    const value = body.estimatedValue
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      fail('estimatedValue must be a whole number')
    }
    if (value < 0 || value > MAX_VALUE) fail('estimatedValue is out of range')
    out.estimatedValue = value
  } else if (!partial) {
    fail('estimatedValue is required')
  }

  const documentLocation = readText(body.documentLocation, 'documentLocation', 200)
  if (documentLocation !== undefined) out.documentLocation = documentLocation

  const notes = readText(body.notes, 'notes', 500)
  if (notes !== undefined) out.notes = notes || null

  if (partial && Object.keys(out).length === 0) fail('No supported fields to update')
  return out
}

export function validateContactInput(body, { partial = false } = {}) {
  if (!isRecord(body)) fail('Body must be a JSON object')
  const out = {}

  const name = readText(body.name, 'name', 120, { required: !partial })
  if (name !== undefined) {
    if (!name) fail('name is required')
    out.name = name
  }

  const relationship = readEnum(body.relationship, 'relationship', RELATIONSHIPS, {
    required: !partial,
  })
  if (relationship !== undefined) out.relationship = relationship

  const phone = readText(body.phone, 'phone', 30)
  if (phone !== undefined) out.phone = phone || null

  if (body.isPrimaryContact !== undefined) {
    if (typeof body.isPrimaryContact !== 'boolean') fail('isPrimaryContact must be a boolean')
    out.isPrimaryContact = body.isPrimaryContact
  }

  if (partial && Object.keys(out).length === 0) fail('No supported fields to update')
  return out
}

export function validateProfilePatch(body) {
  if (!isRecord(body)) fail('Body must be a JSON object')
  const out = {}

  if (body.name !== undefined) {
    out.name = readText(body.name, 'name', 100) ?? ''
  }

  if (body.legalTrack !== undefined) {
    out.legalTrack = readEnum(body.legalTrack, 'legalTrack', LEGAL_TRACKS, { required: true })
  }

  if (body.state !== undefined) {
    if (body.state === null || body.state === '') {
      out.state = null
    } else {
      out.state = readEnum(body.state, 'state', MALAYSIAN_STATES, { required: true })
    }
  }

  if (body.language !== undefined) {
    out.language = readEnum(body.language, 'language', LANGUAGES, { required: true })
  }

  if (body.readiness !== undefined) {
    if (!isRecord(body.readiness)) fail('readiness must be an object')
    const readiness = {}
    for (const key of ['documents', 'planning', 'emergency']) {
      const value = body.readiness[key]
      if (value === undefined) continue
      if (typeof value !== 'boolean') fail(`readiness.${key} must be a boolean`)
      readiness[key] = value
    }
    out.readiness = readiness
  }

  if (Object.keys(out).length === 0) fail('No supported fields to update')
  return out
}

export const MAX_IMPORT_ASSETS = 500
export const MAX_IMPORT_CONTACTS = 200

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function readImportId(value, seen) {
  const candidate = typeof value === 'string' && UUID_RE.test(value) ? value : randomUUID()
  if (seen.has(candidate)) return randomUUID()
  seen.add(candidate)
  return candidate
}

function readImportDate(value) {
  if (typeof value === 'string' && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString()
  }
  return new Date().toISOString()
}

function readImportProfile(source) {
  const name = readText(source.name, 'name', 100) ?? ''
  const legalTrack = readEnum(source.legalTrack, 'legalTrack', LEGAL_TRACKS) ?? 'unsure'

  let state = null
  if (source.state !== undefined && source.state !== null && source.state !== '') {
    state = readEnum(source.state, 'state', MALAYSIAN_STATES, { required: true })
  }
  if (legalTrack === 'native-customary' && state !== 'Sabah' && state !== 'Sarawak') {
    fail('state must be Sabah or Sarawak for the native-customary track')
  }

  const language = readEnum(source.language, 'language', LANGUAGES) ?? 'ms'

  const readiness = { documents: false, planning: false, emergency: false }
  if (source.readiness !== undefined) {
    if (!isRecord(source.readiness)) fail('readiness must be an object')
    for (const key of Object.keys(readiness)) {
      const value = source.readiness[key]
      if (value === undefined) continue
      if (typeof value !== 'boolean') fail(`readiness.${key} must be a boolean`)
      readiness[key] = value
    }
  }

  return { name, legalTrack, state, language, readiness }
}

function readImportAssets(value) {
  if (value === undefined) return []
  if (!Array.isArray(value)) fail('assets must be an array')
  if (value.length > MAX_IMPORT_ASSETS) {
    fail(`assets must contain at most ${MAX_IMPORT_ASSETS} items`)
  }

  const seen = new Set()
  return value.map((item, index) => {
    try {
      const input = validateAssetInput(item)
      return {
        id: readImportId(item.id, seen),
        name: input.name,
        category: input.category,
        institution: input.institution ?? '',
        estimatedValue: input.estimatedValue,
        documentLocation: input.documentLocation ?? '',
        notes: input.notes ?? null,
        createdAt: readImportDate(item.createdAt),
      }
    } catch (error) {
      if (error instanceof ValidationError) fail(`assets[${index}]: ${error.message}`)
      throw error
    }
  })
}

function readImportContacts(value) {
  if (value === undefined) return []
  if (!Array.isArray(value)) fail('contacts must be an array')
  if (value.length > MAX_IMPORT_CONTACTS) {
    fail(`contacts must contain at most ${MAX_IMPORT_CONTACTS} items`)
  }

  const seen = new Set()
  let primarySeen = false
  return value.map((item, index) => {
    try {
      const input = validateContactInput(item)
      const isPrimaryContact = input.isPrimaryContact === true
      let keepPrimary = isPrimaryContact
      if (keepPrimary && primarySeen) keepPrimary = false
      if (keepPrimary) primarySeen = true
      return {
        id: readImportId(item.id, seen),
        name: input.name,
        relationship: input.relationship,
        phone: input.phone ?? null,
        isPrimaryContact: keepPrimary,
      }
    } catch (error) {
      if (error instanceof ValidationError) fail(`contacts[${index}]: ${error.message}`)
      throw error
    }
  })
}

// Accepts the localStorage envelope ({ schemaVersion, profile }) or a bare profile.
export function validateImport(body) {
  if (!isRecord(body)) fail('Body must be a JSON object')
  if (body.schemaVersion !== undefined && body.schemaVersion !== 1) {
    fail('Unsupported schemaVersion')
  }
  const source = isRecord(body.profile) ? body.profile : body
  return {
    profile: readImportProfile(source),
    assets: readImportAssets(source.assets),
    contacts: readImportContacts(source.contacts),
  }
}
