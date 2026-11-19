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
