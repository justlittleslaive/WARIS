import { ASSET_CATEGORIES, RELATIONSHIPS, type AssetCategory, type Relationship } from '../types';
import type { Translate } from '../data/i18n';

export type FieldErrors = Record<string, string | undefined>;

export interface AssetInput {
  name: string;
  category: AssetCategory;
  institution: string;
  estimatedValue: number;
  documentLocation: string;
  notes: string;
}

export interface ContactInput {
  name: string;
  relationship: Relationship;
  phone: string;
  isPrimaryContact: boolean;
}

export function validateAssetInput(input: AssetInput, t: Translate): FieldErrors {
  const errors: FieldErrors = {};

  const name = input.name.trim();
  if (!name) errors.name = t('val.nameRequired');
  else if (name.length > 120) errors.name = t('val.nameTooLong', { max: 120 });

  if (!(ASSET_CATEGORIES as readonly string[]).includes(input.category)) {
    errors.category = t('val.categoryRequired');
  }

  if (input.institution.trim().length > 120) {
    errors.institution = t('val.fieldTooLong', { max: 120 });
  }

  const value = input.estimatedValue;
  if (Number.isNaN(value)) errors.estimatedValue = t('val.valueRequired');
  else if (!Number.isFinite(value)) errors.estimatedValue = t('val.valueInvalid');
  else if (value < 0) errors.estimatedValue = t('val.valueNegative');
  else if (value > 1_000_000_000_000) errors.estimatedValue = t('val.valueTooLarge');

  if (input.documentLocation.trim().length > 200) {
    errors.documentLocation = t('val.fieldTooLong', { max: 200 });
  }
  if (input.notes.trim().length > 500) {
    errors.notes = t('val.fieldTooLong', { max: 500 });
  }

  return errors;
}

export function validateContactInput(input: ContactInput, t: Translate): FieldErrors {
  const errors: FieldErrors = {};

  const name = input.name.trim();
  if (!name) errors.name = t('val.nameRequired');
  else if (name.length > 120) errors.name = t('val.nameTooLong', { max: 120 });

  if (!(RELATIONSHIPS as readonly string[]).includes(input.relationship)) {
    errors.relationship = t('val.relationshipRequired');
  }

  if (input.phone.trim().length > 30) {
    errors.phone = t('val.fieldTooLong', { max: 30 });
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some((value) => Boolean(value));
}
