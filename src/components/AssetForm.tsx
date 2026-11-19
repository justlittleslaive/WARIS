import { useState, type FormEvent } from 'react'
import { ASSET_CATEGORIES, type Asset } from '../types'
import {
  parseAssetValues,
  validateAsset,
  type AssetFormValues,
  type FieldErrors,
} from '../lib/validation'
import type { TranslationKey } from '../data/i18n'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { Modal } from './Modal'

interface AssetFormProps {
  asset?: Asset
  onClose: () => void
}

const inputClass =
  'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:border-brand focus:outline-none'
const errorInputClass = 'border-danger'

export function AssetForm({ asset, onClose }: AssetFormProps) {
  const { actions, t } = useProfile()
  const { show } = useToast()
  const [values, setValues] = useState<AssetFormValues>({
    name: asset?.name ?? '',
    category: asset?.category ?? ASSET_CATEGORIES[0],
    institution: asset?.institution ?? '',
    estimatedValue: asset ? String(asset.estimatedValue) : '',
    documentLocation: asset?.documentLocation ?? '',
    notes: asset?.notes ?? '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  function tError(key: string): string {
    return t(key as TranslationKey)
  }

  function setField<K extends keyof AssetFormValues>(key: K, value: AssetFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateAsset(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const parsed = parseAssetValues(values)
    const ok = asset ? actions.updateAsset(asset.id, parsed) : actions.addAsset(parsed)
    if (!ok) {
      show(t('shell.storageWarning'), 'error')
      return
    }
    show(t('assets.saved'))
    onClose()
  }

  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1 text-xs font-medium text-danger">
        {tError(errors[key])}
      </p>
    ) : null

  return (
    <Modal
      title={asset ? t('assets.editTitle') : t('assets.addTitle')}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            form="asset-form"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="asset-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="asset-name" className="mb-1 block text-sm font-medium text-ink">
            {t('assets.name')}
          </label>
          <input
            id="asset-name"
            type="text"
            value={values.name}
            maxLength={120}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={(event) => setField('name', event.target.value)}
            className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
          />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor="asset-category" className="mb-1 block text-sm font-medium text-ink">
            {t('assets.category')}
          </label>
          <select
            id="asset-category"
            value={values.category}
            onChange={(event) => setField('category', event.target.value)}
            className={inputClass}
          >
            {ASSET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="asset-institution" className="mb-1 block text-sm font-medium text-ink">
            {t('assets.institution')}{' '}
            <span className="text-xs font-normal text-ink-soft">({t('common.optional')})</span>
          </label>
          <input
            id="asset-institution"
            type="text"
            value={values.institution}
            maxLength={120}
            aria-invalid={Boolean(errors.institution)}
            aria-describedby={errors.institution ? 'institution-error' : undefined}
            onChange={(event) => setField('institution', event.target.value)}
            className={`${inputClass} ${errors.institution ? errorInputClass : ''}`}
          />
          {fieldError('institution')}
        </div>

        <div>
          <label htmlFor="asset-value" className="mb-1 block text-sm font-medium text-ink">
            {t('assets.value')}
          </label>
          <input
            id="asset-value"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={values.estimatedValue}
            aria-invalid={Boolean(errors.estimatedValue)}
            aria-describedby={errors.estimatedValue ? 'estimatedValue-error' : undefined}
            onChange={(event) => setField('estimatedValue', event.target.value)}
            className={`${inputClass} ${errors.estimatedValue ? errorInputClass : ''}`}
          />
          {fieldError('estimatedValue')}
        </div>

        <div>
          <label
            htmlFor="asset-document-location"
            className="mb-1 block text-sm font-medium text-ink"
          >
            {t('assets.documentLocation')}{' '}
            <span className="text-xs font-normal text-ink-soft">({t('common.optional')})</span>
          </label>
          <input
            id="asset-document-location"
            type="text"
            value={values.documentLocation}
            maxLength={200}
            aria-invalid={Boolean(errors.documentLocation)}
            aria-describedby={errors.documentLocation ? 'documentLocation-error' : undefined}
            onChange={(event) => setField('documentLocation', event.target.value)}
            className={`${inputClass} ${errors.documentLocation ? errorInputClass : ''}`}
          />
          {fieldError('documentLocation')}
        </div>

        <div>
          <label htmlFor="asset-notes" className="mb-1 block text-sm font-medium text-ink">
            {t('assets.notes')}{' '}
            <span className="text-xs font-normal text-ink-soft">({t('common.optional')})</span>
          </label>
          <textarea
            id="asset-notes"
            rows={3}
            value={values.notes}
            maxLength={500}
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? 'notes-error' : undefined}
            onChange={(event) => setField('notes', event.target.value)}
            className={`${inputClass} ${errors.notes ? errorInputClass : ''}`}
          />
          {fieldError('notes')}
        </div>
      </form>
    </Modal>
  )
}
