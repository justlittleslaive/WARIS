import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ClipboardCheck } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import {
  calculateReadinessScore,
  getReadinessStatus,
  getReadinessTasks,
  getTaskPath,
  STATUS_KEYS,
} from '../lib/selectors';
import { ReadinessProgress } from '../components/ReadinessProgress';
import type { ManualReadinessId } from '../types';

export function ReadinessPage() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const score = calculateReadinessScore(profile);
  const status = getReadinessStatus(score);
  const tasks = getReadinessTasks(profile, t);
  const completed = tasks.filter((task) => task.completed).length;

  function toggleManual(id: ManualReadinessId, checked: boolean) {
    if (!actions.setManualReadiness(id, checked)) {
      showToast(t('common.storageError'), 'error');
    }
  }

  return (
    <div>
      <h1 className="page-title">{t('readiness.title')}</h1>

      <section className="card mt-4 p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row">
          <ReadinessProgress
            score={score}
            label={`${t('dashboard.metricScore')}: ${score}%`}
          />
          <div className="text-center sm:text-left">
            <span className="chip-teal">{t(STATUS_KEYS[status])}</span>
            <p className="mt-2 text-sm font-medium text-slate-700">
              {t('readiness.completed', { done: completed })}
            </p>
            <p className="mt-1 text-xs text-slate-500">{t('readiness.reviewNote')}</p>
          </div>
        </div>
      </section>

      <ul className="mt-4 space-y-3">
        {tasks.map((task) => {
          const Icon = task.completed ? CheckCircle2 : Circle;
          return (
            <li key={task.id} className="card p-4">
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    task.completed ? 'text-green-600' : 'text-slate-400'
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  {task.mode === 'manual' ? (
                    <label className="flex cursor-pointer items-start gap-2 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={(event) =>
                          toggleManual(task.id as ManualReadinessId, event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                      />
                      <span>{task.label}</span>
                    </label>
                  ) : (
                    <label className="flex items-start gap-2 text-sm font-medium text-slate-900">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        disabled
                        aria-readonly="true"
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-700"
                      />
                      <span>{task.label}</span>
                    </label>
                  )}
                  <p className="mt-1 text-xs text-slate-500">{task.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      {task.mode === 'derived' ? t('readiness.autoAssessed') : t('readiness.manual')}
                    </span>
                    {task.id === 'assets' && (
                      <Link
                        to={getTaskPath('assets')}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        {t('asset.add')}
                      </Link>
                    )}
                    {task.id === 'family' && (
                      <Link
                        to={getTaskPath('family')}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        {t('family.add')}
                      </Link>
                    )}
                    {task.id === 'emergency' && (
                      <Link
                        to={getTaskPath('emergency')}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        {t('readiness.reviewSummary')}
                      </Link>
                    )}
                  </div>
                </div>
                <span className="chip shrink-0">{t('readiness.points', { points: task.points })}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="disclaimer mt-4 flex items-start gap-2">
        <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <span>{t('readiness.disclaimer')}</span>
      </p>
    </div>
  );
}
