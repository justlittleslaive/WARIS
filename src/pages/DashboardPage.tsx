import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Users, Wallet } from 'lucide-react'
import type { ReadinessTaskId } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import type { TranslationKey } from '../data/i18n'
import {
  calculateAssetTotal,
  calculateReadinessScore,
  getReadinessStatus,
  getReadinessTasks,
} from '../lib/selectors'
import { formatMoney } from '../lib/format'

const TASK_LINK: Record<ReadinessTaskId, string> = {
  assets: '/assets',
  family: '/family',
  documents: '/readiness',
  planning: '/readiness',
  emergency: '/summary',
}

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DashboardPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const [name, setName] = useState(profile.name)

  useEffect(() => {
    setName(profile.name)
  }, [profile.name])

  const score = calculateReadinessScore(profile)
  const status = getReadinessStatus(score)
  const tasks = getReadinessTasks(profile)
  const incomplete = tasks.filter((task) => !task.completed).slice(0, 3)
  const total = calculateAssetTotal(profile.assets)
  const isEmpty = profile.assets.length === 0 && profile.contacts.length === 0
  const displayName = profile.name.trim()

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (actions.setProfileName(name)) show(t('dash.nameSaved'))
    else show(t('shell.storageWarning'), 'error')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {displayName ? t('dash.welcome', { name: displayName }) : t('dash.welcomeNew')}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{t('dash.question')}</p>
      </header>

      <form
        onSubmit={saveName}
        className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="profile-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {t('dash.nameLabel')}
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            maxLength={100}
            placeholder={t('dash.namePlaceholder')}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:border-brand focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
        >
          {t('common.save')}
        </button>
      </form>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('nav.dashboard')}>
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {t('dash.totalValue')}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">{formatMoney(total, profile.language)}</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            {t('dash.assetsCount', { count: profile.assets.length })}
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            {t('dash.assetCount')}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">{profile.assets.length}</p>
          <Link to="/assets" className="mt-0.5 inline-block text-xs font-semibold text-brand">
            {t('nav.assets')}
          </Link>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {t('dash.contactCount')}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">{profile.contacts.length}</p>
          <Link to="/family" className="mt-0.5 inline-block text-xs font-semibold text-brand">
            {t('nav.family')}
          </Link>
        </article>
        <article className="rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft">
            <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {t('dash.score')}
          </p>
          <p className="mt-1 text-2xl font-bold text-ink">{score}%</p>
          <p className="mt-0.5 text-xs font-semibold text-brand">{t(`status.${status}`)}</p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-label={t('dash.progress')}
            className="relative h-36 w-36 shrink-0"
          >
            <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" aria-hidden="true">
              <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r={RADIUS}
                fill="none"
                stroke="var(--color-brand)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-ink">{score}%</span>
              <span className="text-[11px] font-medium text-ink-soft">{t('dash.score')}</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-ink">{t(`status.${status}`)}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t('dash.question')}</p>
            <Link
              to="/readiness"
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {t('dash.completeCta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            {t('dash.nextSteps')}
          </h2>
          {incomplete.length === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">{t('dash.noNextSteps')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {incomplete.map((task) => (
                <li key={task.id}>
                  <Link
                    to={TASK_LINK[task.id]}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:bg-canvas"
                  >
                    <span className="text-sm font-medium text-ink">
                      {t(`task.${task.id}.label` as TranslationKey)}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-brand">
                      {t('ready.points', { points: task.points })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/summary"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {t('dash.summaryCta')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {isEmpty ? (
        <section className="rounded-2xl border border-dashed border-line bg-surface px-4 py-5">
          <p className="text-sm text-ink-soft">{t('dash.emptyHint')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/assets"
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {t('dash.addAsset')}
            </Link>
            <Link
              to="/family"
              className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              {t('dash.addContact')}
            </Link>
          </div>
        </section>
      ) : null}

      <p className="text-xs leading-relaxed text-ink-soft">{t('dash.storageNote')}</p>
    </div>
  )
}
