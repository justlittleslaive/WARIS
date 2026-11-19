import { Link } from 'react-router-dom'
import type { ManualReadinessId, ReadinessTaskId } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import type { TranslationKey } from '../data/i18n'
import {
  calculateReadinessScore,
  getReadinessStatus,
  getReadinessTasks,
} from '../lib/selectors'

const TASK_LINK: Record<ReadinessTaskId, string> = {
  assets: '/assets',
  family: '/family',
  documents: '/readiness',
  planning: '/readiness',
  emergency: '/summary',
}

export function ReadinessPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const score = calculateReadinessScore(profile)
  const status = getReadinessStatus(score)
  const tasks = getReadinessTasks(profile)
  const done = tasks.filter((task) => task.completed).length

  function toggleManual(id: ManualReadinessId, checked: boolean) {
    if (!actions.setManualReadiness(id, checked)) {
      show(t('shell.storageWarning'), 'error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t('ready.title')}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('ready.subtitle')}</p>
      </header>

      <section
        className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
        aria-label={t('ready.scoreLabel')}
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {t('ready.scoreLabel')}
            </p>
            <p className="mt-1 text-4xl font-bold text-ink">{score}%</p>
            <p className="mt-0.5 text-sm font-semibold text-brand">{t(`status.${status}`)}</p>
          </div>
          <p className="text-sm text-ink-soft">{t('ready.doneOf', { done, total: tasks.length })}</p>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
          aria-label={t('ready.scoreLabel')}
          className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-canvas ring-1 ring-line"
        >
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${score}%` }} />
        </div>
      </section>

      <ol className="space-y-3">
        {tasks.map((task) => {
          const labelKey = `task.${task.id}.label` as TranslationKey
          const descKey = `task.${task.id}.desc` as TranslationKey
          const inputId = `task-${task.id}`
          const isManual = task.mode === 'manual'
          return (
            <li
              key={task.id}
              className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <input
                  id={inputId}
                  type="checkbox"
                  checked={task.completed}
                  disabled={!isManual}
                  aria-label={t(labelKey)}
                  onChange={(event) => {
                    if (isManual) {
                      toggleManual(task.id as ManualReadinessId, event.target.checked)
                    }
                  }}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#0F766E] disabled:opacity-60"
                />
                <div className="flex-1">
                  <label
                    htmlFor={inputId}
                    className={`block font-semibold text-ink ${isManual ? '' : 'cursor-default'}`}
                  >
                    {t(labelKey)}
                  </label>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{t(descKey)}</p>
                  <span className="mt-2 inline-flex rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-line">
                    {isManual ? t('ready.manualHint') : t('ready.derived')}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                  {t('ready.points', { points: task.points })}
                </span>
              </div>
              {task.mode === 'derived' ? (
                <Link
                  to={TASK_LINK[task.id]}
                  className="mt-3 ml-8 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  {task.id === 'assets' ? t('ready.goAssets') : t('ready.goContacts')}
                </Link>
              ) : task.id === 'emergency' ? (
                <Link
                  to="/summary"
                  className="mt-3 ml-8 inline-block text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  {t('ready.reviewSummary')}
                </Link>
              ) : null}
            </li>
          )
        })}
      </ol>

      <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-ink-soft">
        {t('ready.disclaimer')}
      </p>
    </div>
  )
}
