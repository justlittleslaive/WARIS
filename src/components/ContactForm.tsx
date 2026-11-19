import { useState, type FormEvent } from 'react'
import { RELATIONSHIPS, type FamilyContact, type Relationship } from '../types'
import { validateContact, type ContactFormValues, type FieldErrors } from '../lib/validation'
import type { TranslationKey } from '../data/i18n'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { Modal } from './Modal'

interface ContactFormProps {
  contact?: FamilyContact
  onClose: () => void
}

const inputClass = 'ui-input w-full px-3 py-2 text-sm'
const errorInputClass = 'border-danger'

export function ContactForm({ contact, onClose }: ContactFormProps) {
  const { actions, t } = useProfile()
  const { show } = useToast()
  const [values, setValues] = useState<ContactFormValues>({
    name: contact?.name ?? '',
    relationship: contact?.relationship ?? RELATIONSHIPS[0],
    phone: contact?.phone ?? '',
    isPrimaryContact: contact?.isPrimaryContact ?? false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})

  function tError(key: string): string {
    return t(key as TranslationKey)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateContact(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const phone = values.phone.trim()
    const input = {
      name: values.name.trim(),
      relationship: values.relationship as Relationship,
      isPrimaryContact: values.isPrimaryContact,
      phone: phone || undefined,
    }
    const ok = contact ? actions.updateContact(contact.id, input) : actions.addContact(input)
    if (!ok) {
      show(t('shell.storageWarning'), 'error')
      return
    }
    show(t('family.saved'))
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
      title={contact ? t('family.editTitle') : t('family.addTitle')}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="ui-button-secondary"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            form="contact-form"
            className="ui-button"
          >
            {t('common.save')}
          </button>
        </>
      }
    >
      <form id="contact-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-ink">
            {t('family.name')}
          </label>
          <input
            id="contact-name"
            type="text"
            value={values.name}
            maxLength={120}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            className={`${inputClass} ${errors.name ? errorInputClass : ''}`}
          />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor="contact-relationship" className="mb-1.5 block text-sm font-medium text-ink">
            {t('family.relationship')}
          </label>
          <select
            id="contact-relationship"
            value={values.relationship}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, relationship: event.target.value }))
            }
            className={inputClass}
          >
            {RELATIONSHIPS.map((relationship) => (
              <option key={relationship} value={relationship}>
                {relationship}
              </option>
            ))}
          </select>
          {fieldError('relationship')}
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-medium text-ink">
            {t('family.phone')}{' '}
            <span className="text-xs font-normal text-ink-soft">({t('common.optional')})</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={values.phone}
            maxLength={30}
            placeholder={t('family.phonePlaceholder')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
            className={`${inputClass} ${errors.phone ? errorInputClass : ''}`}
          />
          {fieldError('phone')}
        </div>

        <label className="ui-panel flex cursor-pointer items-center gap-3 p-4 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.isPrimaryContact}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, isPrimaryContact: event.target.checked }))
            }
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className="relative h-6 w-11 shrink-0 rounded-lg bg-ink-soft shadow-inner transition-colors after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded after:bg-white after:shadow-sm after:transition-transform after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-accent peer-focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:after:transition-none"
          />
          <span className="font-medium">
            {t('family.primaryToggle')}
            <span className="mt-1 block text-xs font-normal text-ink-soft">{t('family.primary')}</span>
          </span>
        </label>
      </form>
    </Modal>
  )
}
