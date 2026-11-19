import { useState, type FormEvent } from 'react';
import { RELATIONSHIPS, type FamilyContact, type Relationship } from '../types';
import { RELATIONSHIP_KEYS } from '../data/i18n';
import { useProfile } from '../context/ProfileContext';
import {
  hasErrors,
  validateContactInput,
  type ContactInput,
  type FieldErrors,
} from '../lib/validation';

interface ContactFormProps {
  initial?: FamilyContact | null;
  onCancel: () => void;
  onSave: (input: ContactInput) => boolean;
}

export function ContactForm({ initial, onCancel, onSave }: ContactFormProps) {
  const { t } = useProfile();
  const [name, setName] = useState(initial?.name ?? '');
  const [relationship, setRelationship] = useState<Relationship>(
    initial?.relationship ?? 'Spouse',
  );
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [isPrimaryContact, setIsPrimaryContact] = useState(
    initial?.isPrimaryContact ?? false,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: ContactInput = { name, relationship, phone, isPrimaryContact };
    const nextErrors = validateContactInput(input, t);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    onSave(input);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="label" htmlFor="contact-name">
          {t('family.fieldName')} <span className="text-red-600">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          maxLength={120}
          placeholder={t('family.namePlaceholder')}
          onChange={(event) => setName(event.target.value)}
          className={`input ${errors.name ? 'input-error' : ''}`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="field-error">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="contact-relationship">
          {t('family.fieldRelationship')} <span className="text-red-600">*</span>
        </label>
        <select
          id="contact-relationship"
          value={relationship}
          onChange={(event) => setRelationship(event.target.value as Relationship)}
          className={`input ${errors.relationship ? 'input-error' : ''}`}
        >
          {RELATIONSHIPS.map((item) => (
            <option key={item} value={item}>
              {t(RELATIONSHIP_KEYS[item])}
            </option>
          ))}
        </select>
        {errors.relationship && <p className="field-error">{errors.relationship}</p>}
      </div>

      <div>
        <label className="label" htmlFor="contact-phone">
          {t('family.fieldPhone')} <span className="text-slate-400">({t('common.optional')})</span>
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          maxLength={30}
          placeholder={t('family.phonePlaceholder')}
          onChange={(event) => setPhone(event.target.value)}
          className={`input ${errors.phone ? 'input-error' : ''}`}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
        />
        {errors.phone && (
          <p id="contact-phone-error" className="field-error">
            {errors.phone}
          </p>
        )}
      </div>

      <label className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isPrimaryContact}
          onChange={(event) => setIsPrimaryContact(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
        />
        <span>{t('family.fieldPrimary')}</span>
      </label>

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
