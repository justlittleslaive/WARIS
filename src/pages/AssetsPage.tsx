import { useMemo, useState } from 'react'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { ASSET_CATEGORIES, type Asset, type AssetCategory } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { calculateAssetTotal } from '../lib/selectors'
import { formatMoney } from '../lib/format'
import { AssetForm } from '../components/AssetForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'

const iconButtonClass =
  'rounded-lg p-2 text-ink-soft transition hover:bg-canvas hover:text-ink'

export function AssetsPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | AssetCategory>('all')
  const [formState, setFormState] = useState<{ asset?: Asset } | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Asset | null>(null)

  const sorted = useMemo(
    () => [...profile.assets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [profile.assets],
  )

  const search = query.trim().toLowerCase()
  const filtered = sorted.filter((asset) => {
    const matchesQuery =
      !search ||
      asset.name.toLowerCase().includes(search) ||
      asset.institution.toLowerCase().includes(search)
    const matchesCategory = category === 'all' || asset.category === category
    return matchesQuery && matchesCategory
  })

  const total = calculateAssetTotal(profile.assets)

  function confirmDelete() {
    if (!pendingDelete) return
    const ok = actions.deleteAsset(pendingDelete.id)
    setPendingDelete(null)
    if (ok) show(t('assets.deleted'))
    else show(t('shell.storageWarning'), 'error')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">{t('assets.title')}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t('assets.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setFormState({})}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('assets.add')}
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {t('assets.total')}
          </p>
          <p className="mt-1 text-3xl font-bold text-ink">{formatMoney(total, profile.language)}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {t('dash.assetCount')}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{t('assets.count', { count: profile.assets.length })}</p>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('assets.searchPlaceholder')}
            aria-label={t('common.search')}
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="category-filter" className="sr-only">
            {t('assets.filterLabel')}
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value as 'all' | AssetCategory)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="all">{t('assets.filterAll')}</option>
            {ASSET_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {profile.assets.length === 0 ? (
        <EmptyState
          title={t('assets.emptyTitle')}
          actionLabel={t('assets.emptyCta')}
          onAction={() => setFormState({})}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('assets.noMatch')}
          actionLabel={t('assets.clearFilters')}
          onAction={() => {
            setQuery('')
            setCategory('all')
          }}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-canvas text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('assets.colName')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('assets.colCategory')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('assets.colInstitution')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('assets.colValue')}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  {t('assets.colDocument')}
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  {t('assets.colActions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((asset) => (
                <tr key={asset.id} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{asset.name}</p>
                    {asset.notes ? (
                      <p className="mt-0.5 text-xs text-ink-soft">{asset.notes}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{asset.category}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {asset.institution || t('common.notProvided')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {formatMoney(asset.estimatedValue, profile.language)}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-ink-soft">
                    {asset.documentLocation || t('common.notProvided')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setFormState({ asset })}
                        aria-label={t('assets.editLabel', { name: asset.name })}
                        className={iconButtonClass}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(asset)}
                        aria-label={t('assets.deleteLabel', { name: asset.name })}
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

      <p className="text-xs leading-relaxed text-ink-soft">{t('assets.indicativeNote')}</p>

      {formState ? <AssetForm asset={formState.asset} onClose={() => setFormState(null)} /> : null}

      {pendingDelete ? (
        <ConfirmDialog
          title={t('assets.deleteTitle')}
          body={t('assets.deleteBody', { name: pendingDelete.name })}
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
