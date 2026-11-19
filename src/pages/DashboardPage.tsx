import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Circle,
  ClipboardCheck,
  FileText,
  Target,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import {
  calculateAssetTotal,
  calculateReadinessScore,
  getReadinessStatus,
  getReadinessTasks,
  getTaskPath,
  sortAssetsByNewest,
  STATUS_KEYS,
} from '../lib/selectors';
import { CATEGORY_KEYS, TRACK_LABEL_KEYS } from '../data/i18n';
import { formatMoney } from '../lib/format';
import { ReadinessProgress } from '../components/ReadinessProgress';
import { LegalTrackSelector } from '../components/LegalTrackSelector';

export function DashboardPage() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const [name, setName] = useState(profile.name);
  const [setupDismissed, setSetupDismissed] = useState(false);

  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  const total = calculateAssetTotal(profile.assets);
  const score = calculateReadinessScore(profile);
  const status = getReadinessStatus(score);
  const tasks = getReadinessTasks(profile, t);
  const completed = tasks.filter((task) => task.completed).length;
  const incomplete = tasks.filter((task) => !task.completed).slice(0, 3);
  const recentAssets = sortAssetsByNewest(profile.assets).slice(0, 3);

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (actions.setProfileName(name)) {
      showToast(t('dashboard.nameSaved'), 'success');
    } else {
      showToast(t('common.storageError'), 'error');
    }
  }

  return (
    <div className="space-y-4">
      <section className="card p-5 sm:p-6">
        <h1 className="page-title">
          {profile.name
            ? `${t('dashboard.welcome')}, ${profile.name}`
            : t('dashboard.welcomeBrand')}
        </h1>
        <p className="page-subtitle">{t('dashboard.question')}</p>
        <form onSubmit={saveName} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-xs">
            <label className="label" htmlFor="profile-name">
              {t('dashboard.nameLabel')}
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              maxLength={100}
              placeholder={t('dashboard.namePlaceholder')}
              onChange={(event) => setName(event.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="btn-secondary">
            {t('common.save')}
          </button>
        </form>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<Wallet className="h-4 w-4" aria-hidden />}
          label={t('dashboard.metricValue')}
          value={formatMoney(total, profile.language)}
        />
        <Metric
          icon={<ClipboardCheck className="h-4 w-4" aria-hidden />}
          label={t('dashboard.metricAssets')}
          value={String(profile.assets.length)}
        />
        <Metric
          icon={<Users className="h-4 w-4" aria-hidden />}
          label={t('dashboard.metricContacts')}
          value={String(profile.contacts.length)}
        />
        <Metric
          icon={<Target className="h-4 w-4" aria-hidden />}
          label={t('dashboard.metricScore')}
          value={`${score}%`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <ReadinessProgress
              score={score}
              label={`${t('dashboard.metricScore')}: ${score}%`}
            />
            <div className="text-center sm:text-left">
              <span className="chip-teal">{t(STATUS_KEYS[status])}</span>
              <p className="mt-2 text-sm text-slate-600">
                {t('readiness.completed', { done: completed })}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Link to="/readiness" className="btn-primary">
                  {t('dashboard.ctaReadiness')}
                </Link>
                <Link to="/summary" className="btn-secondary">
                  <FileText className="h-4 w-4" aria-hidden />
                  {t('dashboard.ctaSummary')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t('dashboard.trackLabel')}
          </p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="chip-teal">{t(TRACK_LABEL_KEYS[profile.legalTrack])}</span>
            <Link
              to="/learn"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
            >
              {t('dashboard.trackChange')}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">{t('dashboard.trackNote')}</p>
        </section>
      </div>

      {profile.legalTrack === 'unsure' && !setupDismissed && (
        <section className="card border-teal-200 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="section-title">{t('dashboard.setupTitle')}</h2>
              <p className="mt-1 text-sm text-slate-600">{t('dashboard.setupDesc')}</p>
            </div>
            <button
              type="button"
              onClick={() => setSetupDismissed(true)}
              aria-label={t('common.dismiss')}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="mt-4">
            <LegalTrackSelector showTitle={false} onSaved={() => setSetupDismissed(true)} />
          </div>
          <button
            type="button"
            onClick={() => setSetupDismissed(true)}
            className="mt-3 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            {t('dashboard.setupSkip')}
          </button>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="section-title">{t('dashboard.incomplete')}</h2>
          {incomplete.length === 0 ? (
            <p className="muted mt-2">{t('dashboard.noIncomplete')}</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {incomplete.map((task) => (
                <li
                  key={task.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                >
                  <div className="flex items-start gap-2">
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{task.label}</p>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </div>
                  </div>
                  <Link
                    to={getTaskPath(task.id)}
                    className="shrink-0 text-xs font-semibold text-teal-700 hover:underline"
                  >
                    {task.id === 'assets'
                      ? t('asset.add')
                      : task.id === 'family'
                        ? t('family.add')
                        : task.id === 'emergency'
                          ? t('nav.summary')
                          : t('nav.readiness')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="section-title">{t('dashboard.recentAssets')}</h2>
            <Link
              to="/assets"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
            >
              {t('dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          {recentAssets.length === 0 ? (
            <div className="mt-3">
              <p className="muted">{t('asset.empty')}</p>
              <Link
                to="/assets"
                className="mt-2 inline-flex text-sm font-semibold text-teal-700 hover:underline"
              >
                {t('asset.addFirst')}
              </Link>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {recentAssets.map((asset) => (
                <li key={asset.id} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{asset.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {t(CATEGORY_KEYS[asset.category])}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatMoney(asset.estimatedValue, profile.language)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-700">
          {icon}
        </span>
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="mt-2 truncate text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
