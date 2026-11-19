import { Link } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import {
  calculateAssetTotal,
  calculateReadinessScore,
  getReadinessStatus,
  getReadinessTasks,
  STATUS_KEYS,
} from '../lib/selectors';
import { CATEGORY_KEYS, RELATIONSHIP_KEYS } from '../data/i18n';
import { formatDate, formatMoney } from '../lib/format';

export function SummaryPage() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const total = calculateAssetTotal(profile.assets);
  const score = calculateReadinessScore(profile);
  const status = getReadinessStatus(score);
  const tasks = getReadinessTasks(profile, t);

  function toggleReviewed(checked: boolean) {
    if (!actions.setManualReadiness('emergency', checked)) {
      showToast(t('common.storageError'), 'error');
    }
  }

  return (
    <div>
      <div className="no-print">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="page-title">{t('summary.title')}</h1>
            <p className="page-subtitle">{t('summary.subtitle')}</p>
          </div>
          <button type="button" className="btn-primary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden />
            {t('summary.print')}
          </button>
        </div>

        <label className="card mt-4 flex items-start gap-3 p-4">
          <input
            type="checkbox"
            checked={profile.readiness.emergency}
            onChange={(event) => toggleReviewed(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">
              {t('summary.reviewCheckbox')}
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              {t('readiness.reviewNote')}
            </span>
          </span>
        </label>
      </div>

      <div
        id="print-report"
        className="print-report card mx-auto mt-4 max-w-3xl p-6 sm:p-8"
      >
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="report-brand text-lg font-black tracking-[0.2em] text-teal-700">
              WARISREADY
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{t('summary.reportTitle')}</h2>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p className="break-words">
              <span className="font-semibold">{t('summary.owner')}:</span>{' '}
              {profile.name || t('summary.notStated')}
            </p>
            <p className="mt-0.5">
              <span className="font-semibold">{t('summary.generated')}:</span>{' '}
              {formatDate(new Date(), profile.language)}
            </p>
          </div>
        </header>

        <section className="mt-5">
          <h3 className="report-section-title text-sm font-bold uppercase tracking-wide text-slate-800">
            {t('summary.assetsHeading')}
          </h3>
          {profile.assets.length === 0 ? (
            <div className="mt-2 rounded-md border border-slate-200 px-3 py-2 text-xs">
              <p className="font-semibold text-slate-700">{t('summary.notRecorded')}</p>
              <p className="mt-0.5 text-slate-500">{t('summary.missingAssets')}</p>
            </div>
          ) : (
            <table className="mt-2 w-full table-fixed border-collapse text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="w-[22%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colAsset')}
                  </th>
                  <th className="w-[18%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colCategory')}
                  </th>
                  <th className="w-[18%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colInstitution')}
                  </th>
                  <th className="w-[14%] border border-slate-300 px-2 py-1.5 text-right font-semibold">
                    {t('summary.colValue')}
                  </th>
                  <th className="w-[28%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colDocLocation')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {profile.assets.map((asset) => (
                  <tr key={asset.id} className="align-top">
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-800">
                      {asset.name}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {t(CATEGORY_KEYS[asset.category])}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {asset.institution || '—'}
                    </td>
                    <td className="whitespace-nowrap border border-slate-300 px-2 py-1.5 text-right text-slate-800">
                      {formatMoney(asset.estimatedValue, profile.language)}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {asset.documentLocation || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-slate-900">
                  <td
                    colSpan={3}
                    className="border border-slate-300 px-2 py-1.5 text-right"
                  >
                    {t('summary.totalLabel')}
                  </td>
                  <td className="whitespace-nowrap border border-slate-300 px-2 py-1.5 text-right">
                    {formatMoney(total, profile.language)}
                  </td>
                  <td className="border border-slate-300 px-2 py-1.5" />
                </tr>
              </tfoot>
            </table>
          )}
        </section>

        <section className="mt-5">
          <h3 className="report-section-title text-sm font-bold uppercase tracking-wide text-slate-800">
            {t('summary.contactsHeading')}
          </h3>
          {profile.contacts.length === 0 ? (
            <div className="mt-2 rounded-md border border-slate-200 px-3 py-2 text-xs">
              <p className="font-semibold text-slate-700">{t('summary.notRecorded')}</p>
              <p className="mt-0.5 text-slate-500">{t('summary.missingContacts')}</p>
            </div>
          ) : (
            <table className="mt-2 w-full table-fixed border-collapse text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="w-[30%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colName')}
                  </th>
                  <th className="w-[22%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colRelationship')}
                  </th>
                  <th className="w-[28%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colPhone')}
                  </th>
                  <th className="w-[20%] border border-slate-300 px-2 py-1.5 font-semibold">
                    {t('summary.colPrimary')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {profile.contacts.map((contact) => (
                  <tr key={contact.id} className="align-top">
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-800">
                      {contact.name}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {t(RELATIONSHIP_KEYS[contact.relationship])}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {contact.phone || t('summary.emptyPhone')}
                    </td>
                    <td className="break-words border border-slate-300 px-2 py-1.5 text-slate-600">
                      {contact.isPrimaryContact ? t('family.primaryShort') : t('summary.emptyPhone')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="mt-5">
          <h3 className="report-section-title text-sm font-bold uppercase tracking-wide text-slate-800">
            {t('summary.scoreHeading')}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 rounded-md border border-slate-200 px-3 py-2">
            <p className="report-score text-2xl font-bold text-slate-900">{score}%</p>
            <p className="chip-teal">{t(STATUS_KEYS[status])}</p>
          </div>
          <h4 className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-700">
            {t('summary.checklistHeading')}
          </h4>
          <ul className="mt-1 divide-y divide-slate-100">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start justify-between gap-3 py-1.5 text-xs">
                <span className="break-words text-slate-700">{task.label}</span>
                <span
                  className={`shrink-0 font-semibold ${
                    task.completed ? 'text-green-700' : 'text-slate-500'
                  }`}
                >
                  {task.completed ? t('summary.done') : t('summary.notDone')}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-5 border-t border-slate-200 pt-3 text-[10px] leading-relaxed text-slate-500">
          {t('disc.report')}
        </p>
      </div>

      <div className="no-print mt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('summary.back')}
        </Link>
      </div>
    </div>
  );
}
