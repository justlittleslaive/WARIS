import { useState, type FormEvent } from 'react';
import { ASSET_CATEGORIES, type Asset, type AssetCategory } from '../types';
import { CATEGORY_KEYS } from '../data/i18n';
import { useProfile } from '../context/ProfileContext';
import {
  hasErrors,
  validateAssetInput,
  type AssetInput,
  type FieldErrors,
} from '../lib/validation';

interface AssetFormProps {
  initial?: Asset | null;
  onCancel: () => void;
  onSave: (input: AssetInput) => boolean;
}

export function AssetForm({ initial, onCancel, onSave }: AssetFormProps) {
  const { t } = useProfile();
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<AssetCategory>(initial?.category ?? 'Bank Savings');
  const [institution, setInstitution] = useState(initial?.institution ?? '');
  const [value, setValue] = useState(initial ? String(initial.estimatedValue) : '');
  const [documentLocation, setDocumentLocation] = useState(initial?.documentLocation ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedValue = value.trim();
    const input: AssetInput = {
      name,
      category,
      institution,
      estimatedValue: trimmedValue === '' ? Number.NaN : Number(trimmedValue),
      documentLocation,
      notes,
    };
    const nextErrors = validateAssetInput(input, t);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="label" htmlFor="asset-name">
          {t('asset.fieldName')} <span className="text-red-600">*</span>
        </label>
        <input
          id="asset-name"
          type="text"
          value={name}
          maxLength={120}
          onChange={(event) => setName(event.target.value)}
          className={`input ${errors.name ? 'input-error' : ''}`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'asset-name-error' : undefined}
        />
        {errors.name && (
          <p id="asset-name-error" className="field-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="asset-category">
          {t('asset.fieldCategory')} <span className="text-red-600">*</span>
        </label>
        <select
          id="asset-category"
          value={category}
          onChange={(event) => setCategory(event.target.value as AssetCategory)}
          className={`input ${errors.category ? 'input-error' : ''}`}
        >
          {ASSET_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {t(CATEGORY_KEYS[item])}
            </option>
          ))}
        </select>
        {errors.category && <p className="field-error">{errors.category}</p>}
      </div>

      <div>
        <label className="label" htmlFor="asset-institution">
          {t('asset.fieldInstitution')} <span className="text-slate-400">({t('common.optional')})</span>
        </label>
        <input
          id="asset-institution"
          type="text"
          value={institution}
          maxLength={120}
          placeholder={t('asset.institutionPlaceholder')}
          onChange={(event) => setInstitution(event.target.value)}
          className={`input ${errors.institution ? 'input-error' : ''}`}
          aria-describedby={errors.institution ? 'asset-institution-error' : undefined}
        />
        {errors.institution && (
          <p id="asset-institution-error" className="field-error">
            {errors.institution}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="asset-value">
          {t('asset.fieldValue')} <span className="text-red-600">*</span>
        </label>
        <input
          id="asset-value"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={value}
          placeholder="0.00"
          onChange={(event) => setValue(event.target.value)}
          className={`input ${errors.estimatedValue ? 'input-error' : ''}`}
          aria-invalid={Boolean(errors.estimatedValue)}
          aria-describedby={errors.estimatedValue ? 'asset-value-error' : undefined}
        />
        {errors.estimatedValue && (
          <p id="asset-value-error" className="field-error">
            {errors.estimatedValue}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="asset-document-location">
          {t('asset.fieldDocLocation')}{' '}
          <span className="text-slate-400">({t('common.optional')})</span>
        </label>
        <input
          id="asset-document-location"
          type="text"
          value={documentLocation}
          maxLength={200}
          placeholder={t('asset.docLocationPlaceholder')}
          onChange={(event) => setDocumentLocation(event.target.value)}
          className={`input ${errors.documentLocation ? 'input-error' : ''}`}
        />
        {errors.documentLocation && <p className="field-error">{errors.documentLocation}</p>}
      </div>

      <div>
        <label className="label" htmlFor="asset-notes">
          {t('asset.fieldNotes')} <span className="text-slate-400">({t('common.optional')})</span>
        </label>
        <textarea
          id="asset-notes"
          rows={3}
          value={notes}
          maxLength={500}
          placeholder={t('asset.notesPlaceholder')}
          onChange={(event) => setNotes(event.target.value)}
          className={`input ${errors.notes ? 'input-error' : ''}`}
        />
        {errors.notes && <p className="field-error">{errors.notes}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {t('common.cancel')}
        </button>
        <button type="submit" className="btn-primary">
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}
