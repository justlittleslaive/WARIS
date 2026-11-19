import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Printer } from 'lucide-react'
import { BrandBadge } from '../components/BrandBadge'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import type { TranslationKey } from '../data/i18n'
import {
  calculateAssetTotal,
  calculateReadinessScore,
  getReadinessTasks,
} from '../lib/selectors'
import { formatDate, formatMoney } from '../lib/format'

export function SummaryPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const score = calculateReadinessScore(profile)
  const tasks = getReadinessTasks(profile)
  const total = calculateAssetTotal(profile.assets)
  const generated = formatDate(new Date().toISOString(), profile.language)

  function toggleReviewed(checked: boolean) {
    if (!actions.setManualReadiness('emergency', checked)) {
      show(t('shell.storageWarning'), 'error')
    }
  }

  const thClass = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-soft'
  const tdClass = 'px-3 py-2 text-sm text-ink align-top'

  return (
    <div className="ui-page enter-page">
      <header className="no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="ui-title">{t('summary.title')}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t('summary.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="ui-button"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t('summary.print')}
          </button>
          <Link
            to="/app"
            className="ui-button-secondary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t('summary.back')}
          </Link>
        </div>
      </header>

      <article
        id="print-report"
        className="print-report ui-panel min-w-0 p-4 sm:p-6"
      >
        <div className="border-b border-line pb-4">
          <BrandBadge wordmark className="h-12 w-auto" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {t('summary.reportBrand')}
          </p>
          <h2 className="mt-1 text-xl font-bold text-ink">{t('summary.reportTitle')}</h2>
        </div>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('summary.owner')}
            </dt>
            <dd className="mt-0.5 font-medium text-ink">
              {profile.name.trim() || t('summary.ownerEmpty')}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('summary.generated')}
            </dt>
            <dd className="mt-0.5 font-medium text-ink">{generated}</dd>
          </div>
        </dl>

        <section className="mt-6">
          <h3 className="report-section-title text-sm font-bold text-ink">{t('summary.assets')}</h3>
          <div className="report-table-scroll mt-2 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={thClass}>{t('assets.colName')}</th>
                  <th scope="col" className={thClass}>{t('assets.colCategory')}</th>
                  <th scope="col" className={thClass}>{t('assets.colInstitution')}</th>
                  <th scope="col" className={thClass}>{t('assets.colValue')}</th>
                  <th scope="col" className={thClass}>{t('assets.colDocument')}</th>
                </tr>
              </thead>
              <tbody>
                {profile.assets.length === 0 ? (
                  <tr className="border-b border-line">
                    <td colSpan={5} className={`${tdClass} italic text-ink-soft`}>
                      {t('summary.notRecorded')}
                    </td>
                  </tr>
                ) : (
                  profile.assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-line">
                      <td className={tdClass}>{asset.name}</td>
                      <td className={tdClass}>{asset.category}</td>
                      <td className={tdClass}>{asset.institution || t('common.notProvided')}</td>
                      <td className={tdClass}>{formatMoney(asset.estimatedValue, profile.language)}</td>
                      <td className={tdClass}>{asset.documentLocation || t('common.notProvided')}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className={`${tdClass} font-semibold`}>
                    {t('summary.total')}
                  </td>
                  <td className={`${tdClass} font-bold`} colSpan={2}>
                    {formatMoney(total, profile.language)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="report-section-title text-sm font-bold text-ink">{t('summary.contacts')}</h3>
          <div className="report-table-scroll mt-2 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className={thClass}>{t('family.name')}</th>
                  <th scope="col" className={thClass}>{t('family.relationship')}</th>
                  <th scope="col" className={thClass}>{t('family.phone')}</th>
                </tr>
              </thead>
              <tbody>
                {profile.contacts.length === 0 ? (
                  <tr className="border-b border-line">
                    <td colSpan={3} className={`${tdClass} italic text-ink-soft`}>
                      {t('summary.notRecorded')}
                    </td>
                  </tr>
                ) : (
                  profile.contacts.map((contact) => (
                    <tr key={contact.id} className="border-b border-line">
                      <td className={tdClass}>
                        {contact.name}
                        {contact.isPrimaryContact ? (
                          <span className="ui-badge ml-2">
                            {t('summary.primaryMark')}
                          </span>
                        ) : null}
                      </td>
                      <td className={tdClass}>{contact.relationship}</td>
                      <td className={tdClass}>{contact.phone || t('common.notProvided')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="report-section-title text-sm font-bold text-ink">{t('summary.checklist')}</h3>
          <ul className="mt-2 space-y-1.5">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-2 text-sm">
                {task.completed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
                )}
                <span className="text-ink">
                  {t(`task.${task.id}.label` as TranslationKey)}
                  <span className="ml-2 text-xs text-ink-soft">
                    ({task.completed ? t('ready.completed') : t('ready.notCompleted')})
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm font-semibold text-ink">
            {t('summary.scoreLabel')}: {score}%
          </p>
        </section>

        <p className="keep-together mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink-soft">
          {t('summary.disclaimer')}
        </p>
      </article>

      <div className="no-print ui-panel space-y-2 p-4">
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={profile.readiness.emergency}
            onChange={(event) => toggleReviewed(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand"
          />
          <span>{t('summary.review')}</span>
        </label>
        <p className="text-xs text-ink-soft">{t('summary.printHint')}</p>
      </div>
    </div>
  )
}
