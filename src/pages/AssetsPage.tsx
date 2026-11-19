import { useState } from 'react';
import { Pencil, Plus, Search, Trash2, Wallet } from 'lucide-react';
import { ASSET_CATEGORIES, type Asset, type AssetCategory } from '../types';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import { CATEGORY_KEYS } from '../data/i18n';
import { calculateAssetTotal } from '../lib/selectors';
import { formatMoney } from '../lib/format';
import type { AssetInput } from '../lib/validation';
import { AssetForm } from '../components/AssetForm';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export function AssetsPage() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | AssetCategory>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState<Asset | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = profile.assets.filter((asset) => {
    const matchesCategory = category === 'all' || asset.category === category;
    const matchesQuery =
      normalizedQuery === '' ||
      asset.name.toLowerCase().includes(normalizedQuery) ||
      asset.institution.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const total = calculateAssetTotal(profile.assets);
  const hasFilters = normalizedQuery !== '' || category !== 'all';

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSave(input: AssetInput): boolean {
    const ok = editing
      ? actions.updateAsset(editing.id, input)
      : actions.addAsset(input);
    if (ok) {
      showToast(t('asset.saved'), 'success');
      closeForm();
    } else {
      showToast(t('common.storageError'), 'error');
    }
    return ok;
  }

  function handleDelete() {
    if (!deleting) return;
    if (actions.deleteAsset(deleting.id)) {
      showToast(t('asset.deleted'), 'success');
    } else {
      showToast(t('common.storageError'), 'error');
    }
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">{t('asset.title')}</h1>
          <p className="page-subtitle">{t('asset.subtitle')}</p>
        </div>
        <button type="button" className="btn-primary" onClick={openAdd}>
          <Plus className="h-4 w-4" aria-hidden />
          {t('asset.add')}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">{t('asset.totalLabel')}</p>
          <p className="text-xl font-bold text-slate-900">{formatMoney(total, profile.language)}</p>
        </div>
        <span className="chip ml-auto">
          {t('asset.count', { count: profile.assets.length })}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('asset.searchPlaceholder')}
            aria-label={t('asset.searchPlaceholder')}
            className="input pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as 'all' | AssetCategory)}
          aria-label={t('asset.fieldCategory')}
          className="input sm:max-w-xs"
        >
          <option value="all">{t('asset.allCategories')}</option>
          {ASSET_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {t(CATEGORY_KEYS[item])}
            </option>
          ))}
        </select>
      </div>

      {profile.assets.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<Wallet className="h-10 w-10" aria-hidden />}
            message={t('asset.empty')}
            action={
              <button type="button" className="btn-primary" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden />
                {t('asset.addFirst')}
              </button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={<Search className="h-10 w-10" aria-hidden />}
            message={t('asset.emptyFiltered')}
            action={
              hasFilters ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                  }}
                >
                  {t('asset.clearFilter')}
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {filtered.map((asset) => (
            <article key={asset.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-base font-semibold text-slate-900">
                    {asset.name}
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="chip">{t(CATEGORY_KEYS[asset.category])}</span>
                    {asset.institution && <span className="break-words">{asset.institution}</span>}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-slate-900">
                  {formatMoney(asset.estimatedValue, profile.language)}
                </p>
              </div>
              {(asset.documentLocation || asset.notes) && (
                <dl className="mt-3 space-y-1 text-xs text-slate-600">
                  {asset.documentLocation && (
                    <div className="flex gap-1">
                      <dt className="shrink-0 font-medium text-slate-500">
                        {t('asset.fieldDocLocation')}:
                      </dt>
                      <dd className="break-words">{asset.documentLocation}</dd>
                    </div>
                  )}
                  {asset.notes && (
                    <div className="flex gap-1">
                      <dt className="shrink-0 font-medium text-slate-500">
                        {t('asset.fieldNotes')}:
                      </dt>
                      <dd className="break-words">{asset.notes}</dd>
                    </div>
                  )}
                </dl>
              )}
              <div className="mt-3 flex justify-end gap-1">
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  aria-label={t('aria.editAsset', { name: asset.name })}
                  onClick={() => {
                    setEditing(asset);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  {t('common.edit')}
                </button>
                <button
                  type="button"
                  className="btn-ghost text-xs text-red-600 hover:bg-red-50"
                  aria-label={t('aria.deleteAsset', { name: asset.name })}
                  onClick={() => setDeleting(asset)}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {t('common.delete')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal
          title={editing ? t('asset.formEditTitle') : t('asset.formAddTitle')}
          onClose={closeForm}
        >
          <AssetForm initial={editing} onCancel={closeForm} onSave={handleSave} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title={t('asset.deleteTitle')}
          description={t('asset.deleteDesc', { name: deleting.name })}
          confirmLabel={t('common.delete')}
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
