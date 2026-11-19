import type { AssetCategory, Language } from '../types'

export interface AssetFormValues {
  name: string
  category: string
  institution: string
  estimatedValue: string
  documentLocation: string
  notes: string
}

export interface ContactFormValues {
  name: string
  relationship: string
  phone: string
  isPrimaryContact: boolean
}

export interface ParsedAssetInput {
  name: string
  category: AssetCategory
  institution: string
  estimatedValue: number
  documentLocation: string
  notes?: string
}

export type FieldErrors = Record<string, string>

const MAX_MONEY = 1_000_000_000_000

function validateName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) return 'err.required'
  if (trimmed.length > 120) return 'err.nameLength'
  return null
}

export function validateAsset(values: AssetFormValues): FieldErrors {
  const errors: FieldErrors = {}

  const nameError = validateName(values.name)
  if (nameError) errors.name = nameError

  if (!values.category.trim()) errors.category = 'err.categoryInvalid'

  const rawValue = values.estimatedValue.trim()
  if (!rawValue) {
    errors.estimatedValue = 'err.valueRequired'
  } else {
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed)) errors.estimatedValue = 'err.valueInvalid'
    else if (parsed < 0) errors.estimatedValue = 'err.valueNegative'
    else if (parsed > MAX_MONEY) errors.estimatedValue = 'err.valueTooLarge'
    else if (!Number.isInteger(parsed)) errors.estimatedValue = 'err.valueWholeRinggit'
  }

  if (values.institution.trim().length > 120) errors.institution = 'err.tooLong'
  if (values.documentLocation.trim().length > 200) errors.documentLocation = 'err.tooLong'
  if (values.notes.trim().length > 500) errors.notes = 'err.tooLong'

  return errors
}

export function parseAssetValues(values: AssetFormValues): ParsedAssetInput {
  const notes = values.notes.trim()
  return {
    name: values.name.trim(),
    category: values.category as AssetCategory,
    institution: values.institution.trim(),
    estimatedValue: Number(values.estimatedValue.trim()),
    documentLocation: values.documentLocation.trim(),
    ...(notes ? { notes } : {}),
  }
}

export function validateContact(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {}

  const nameError = validateName(values.name)
  if (nameError) errors.name = nameError
  if (!values.relationship.trim()) errors.relationship = 'err.relationshipInvalid'
  if (values.phone.trim().length > 30) errors.phone = 'err.phoneTooLong'

  return errors
}

export function toLanguageLocale(language: Language): string {
  return language === 'en' ? 'en-MY' : 'ms-MY'
}
