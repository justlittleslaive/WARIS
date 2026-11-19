import { useState } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import type { FamilyContact } from '../types';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import { RELATIONSHIP_KEYS } from '../data/i18n';
import type { ContactInput } from '../lib/validation';
import { ContactForm } from '../components/ContactForm';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export function FamilyPage() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyContact | null>(null);
  const [deleting, setDeleting] = useState<FamilyContact | null>(null);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSave(input: ContactInput): boolean {
    const ok = editing
      ? actions.updateContact(editing.id, input)
      : actions.addContact(input);
    if (ok) {
      showToast(t('family.saved'), 'success');
      closeForm();
    } else {
      showToast(t('common.storageError'), 'error');
    }
    return ok;
  }

  function handleDelete() {
    if (!deleting) return;
    if (actions.deleteContact(deleting.id)) {
      showToast(t('family.deleted'), 'success');
    } else {
      showToast(t('common.storageError'), 'error');
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t('family.title')}</h1>
          <p className="page-subtitle">{t('family.count', { count: profile.contacts.length })}</p>
        </div>
        <button type="button" className="btn-primary" onClick={openAdd}>
          <Plus className="h-4 w-4" aria-hidden />
          {t('family.add')}
        </button>
      </div>

      {profile.contacts.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<Users className="h-10 w-10" aria-hidden />}
            message={t('family.empty')}
            action={
              <button type="button" className="btn-primary" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden />
                {t('family.add')}
              </button>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 lg:grid-cols-2">
          {profile.contacts.map((contact) => (
            <li key={contact.id} className="card flex items-start gap-3 p-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700"
                aria-hidden
              >
                {contact.name.trim().charAt(0).toUpperCase() || '?'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-base font-semibold text-slate-900">
                    {contact.name}
                  </h2>
                  {contact.isPrimaryContact && (
                    <span className="chip-teal">{t('family.primary')}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t(RELATIONSHIP_KEYS[contact.relationship])}
                  {contact.phone ? ` · ${contact.phone}` : ''}
                </p>
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    className="btn-ghost text-xs"
                    aria-label={t('aria.editContact', { name: contact.name })}
                    onClick={() => {
                      setEditing(contact);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    {t('common.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-xs text-red-600 hover:bg-red-50"
                    aria-label={t('aria.deleteContact', { name: contact.name })}
                    onClick={() => setDeleting(contact)}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="disclaimer mt-4">{t('family.disclaimer')}</p>

      {formOpen && (
        <Modal
          title={editing ? t('family.formEditTitle') : t('family.formAddTitle')}
          onClose={closeForm}
        >
          <ContactForm initial={editing} onCancel={closeForm} onSave={handleSave} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title={t('family.deleteTitle')}
          description={t('family.deleteDesc', { name: deleting.name })}
          confirmLabel={t('common.delete')}
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
