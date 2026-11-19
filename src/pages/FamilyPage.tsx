import { useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import type { FamilyContact } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { ContactForm } from '../components/ContactForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'

const iconButtonClass =
  'rounded-lg p-2 text-ink-soft transition hover:bg-canvas hover:text-ink'

export function FamilyPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const [formState, setFormState] = useState<{ contact?: FamilyContact } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<FamilyContact | null>(null)

  function confirmDelete() {
    if (!pendingDelete) return
    const ok = actions.deleteContact(pendingDelete.id)
    setPendingDelete(null)
    if (ok) show(t('family.deleted'))
    else show(t('shell.storageWarning'), 'error')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{t('family.title')}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t('family.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormState({})}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('family.add')}
        </button>
      </header>

      <p className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-line">
        <Users className="h-3.5 w-3.5" aria-hidden="true" />
        {t('family.count', { count: profile.contacts.length })}
      </p>

      {profile.contacts.length === 0 ? (
        <EmptyState
          title={t('family.emptyTitle')}
          actionLabel={t('family.emptyCta')}
          onAction={() => setFormState({})}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {profile.contacts.map((contact) => (
            <article
              key={contact.id}
              className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-ink">{contact.name}</h2>
                  <p className="text-sm text-ink-soft">{contact.relationship}</p>
                </div>
                {contact.isPrimaryContact ? (
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                    {t('family.primary')}
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm text-ink-soft">
                {contact.phone || t('family.phoneEmpty')}
              </p>

              <div className="mt-4 flex justify-end gap-1 border-t border-line pt-2">
                <button
                  type="button"
                  onClick={() => setFormState({ contact })}
                  aria-label={t('family.editLabel', { name: contact.name })}
                  className={iconButtonClass}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(contact)}
                  aria-label={t('family.deleteLabel', { name: contact.name })}
                  className={`${iconButtonClass} hover:text-danger`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-ink-soft">
        {t('family.disclaimer')}
      </p>

      {formState ? (
        <ContactForm contact={formState.contact} onClose={() => setFormState(null)} />
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          title={t('family.deleteTitle')}
          body={t('family.deleteBody', { name: pendingDelete.name })}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
          danger
        />
      ) : null}
    </div>
  )
}
