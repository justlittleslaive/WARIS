import { useState } from 'react'
import { Check, Pencil, Plus, Trash2, Users } from 'lucide-react'
import type { FamilyContact } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { ContactForm } from '../components/ContactForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'

const iconButtonClass =
  'rounded-lg p-2 text-ink-soft transition hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2'

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
    <div className="ui-page min-w-0 w-full">
      <header>
        <h1 className="ui-title text-ink">{t('family.title')}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('family.subtitle')}</p>
      </header>

      <section className="ui-panel min-w-0 overflow-hidden" aria-label={t('family.title')}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
            <Users className="h-4 w-4" aria-hidden="true" />
            {t('family.count', { count: profile.contacts.length })}
          </p>
          <button
            type="button"
            onClick={() => setFormState({})}
            className="ui-button inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('family.add')}
          </button>
        </div>

        {profile.contacts.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={t('family.emptyTitle')}
              actionLabel={t('family.emptyCta')}
              onAction={() => setFormState({})}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-canvas text-xs text-ink-soft">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('family.name')}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('family.relationship')}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('family.phone')}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    {t('family.primary')}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    {t('assets.colActions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {profile.contacts.map((contact) => (
                  <tr key={contact.id} className="transition-colors hover:bg-canvas/80">
                    <td className="max-w-72 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas text-xs font-semibold text-ink-soft ring-1 ring-inset ring-line"
                        >
                          {contact.name
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((part) => part.charAt(0))
                            .join('')
                            .toUpperCase()}
                        </span>
                        <span className="min-w-0 break-words font-medium text-ink">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="ui-badge whitespace-nowrap">{contact.relationship}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-soft tabular-nums">
                      {contact.phone || t('family.phoneEmpty')}
                    </td>
                    <td className="px-4 py-3">
                      {contact.isPrimaryContact ? (
                        <span className="ui-badge inline-flex items-center gap-1 whitespace-nowrap">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          {t('family.primary')}
                        </span>
                      ) : (
                        <span className="text-ink-soft">{t('common.notProvided')}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs leading-relaxed text-ink-soft">{t('family.disclaimer')}</p>

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
